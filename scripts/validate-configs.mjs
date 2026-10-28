import { readFile, readdir } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as prettier from 'prettier';
import { configDirectory, examples, formatExample } from './lib.mjs';

const support = await prettier.getSupportInfo({ showDeprecated: true });
const supportedOptions = new Map(
  support.options.map((option) => [option.name, option]),
);
const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function fail(location, message) {
  throw new Error(`${location}: ${message}`);
}

function validateOptions(options, location) {
  if (!isObject(options) || Object.keys(options).length === 0) {
    fail(location, 'expected a nonempty options object');
  }

  for (const [name, value] of Object.entries(options)) {
    const option = supportedOptions.get(name);
    const key = `${location}.${name}`;
    if (!option) fail(key, 'unsupported Prettier option');
    if (option.deprecated) fail(key, 'deprecated Prettier option');
    if (['parser', 'filepath', 'plugins'].includes(name)) {
      fail(
        key,
        'presets must use automatic parser detection and built-in languages',
      );
    }

    switch (option.type) {
      case 'boolean':
        if (typeof value !== 'boolean') fail(key, 'expected a boolean');
        break;
      case 'int': {
        if (!Number.isInteger(value)) fail(key, 'expected an integer');
        const { start = -Infinity, end = Infinity } = option.range ?? {};
        if (value < start || value > end)
          fail(key, 'integer outside supported range');
        break;
      }
      case 'choice': {
        const choice = option.choices.find((choice) => choice.value === value);
        if (!choice) fail(key, 'unsupported option value');
        if (choice.deprecated) fail(key, 'deprecated option value');
        break;
      }
      default:
        fail(key, `unhandled option type ${option.type}; review the validator`);
    }
  }
}

function validatePatterns(value, location) {
  const patterns = Array.isArray(value) ? value : [value];
  if (
    patterns.length === 0 ||
    patterns.some((pattern) => typeof pattern !== 'string' || !pattern.trim())
  ) {
    fail(location, 'expected a nonempty glob string or array of glob strings');
  }
}

export function validateConfig(config) {
  if (!isObject(config)) fail('config', 'expected an object');
  const { overrides, ...options } = config;
  validateOptions(options, 'config');
  if (!Object.hasOwn(config, 'overrides')) return;
  if (!Array.isArray(overrides)) fail('overrides', 'expected an array');

  overrides.forEach((override, index) => {
    const location = `overrides[${index}]`;
    if (!isObject(override)) fail(location, 'expected an object');
    for (const key of Object.keys(override)) {
      if (!['files', 'excludeFiles', 'options'].includes(key))
        fail(`${location}.${key}`, 'unknown override key');
    }
    validatePatterns(override.files, `${location}.files`);
    if (Object.hasOwn(override, 'excludeFiles'))
      validatePatterns(override.excludeFiles, `${location}.excludeFiles`);
    validateOptions(override.options, `${location}.options`);
  });
}

export async function discoverConfigs(directory = configDirectory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => join(directory, entry.name))
    .sort();
  if (paths.length === 0) throw new Error('No configuration JSON files found');
  return paths;
}

export async function validatePreset(configPath) {
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  validateConfig(config);
  for (const example of examples) {
    const formatted = await formatExample(example, configPath);
    if (!formatted.trim())
      throw new Error(`Empty output for ${example.directory}`);
    if ((await formatExample(example, configPath, formatted)) !== formatted) {
      throw new Error(`Formatting is not idempotent for ${example.directory}`);
    }
  }
}

async function main() {
  console.log(`Validating presets with Prettier ${prettier.version}`);
  const paths = await discoverConfigs();
  let failures = 0;
  for (const configPath of paths) {
    try {
      await validatePreset(configPath);
      console.log(
        `PASS ${basename(configPath)} (${examples.length} file types)`,
      );
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${basename(configPath)}: ${error.message}`);
    }
  }
  console.log(`${paths.length - failures}/${paths.length} presets passed`);
  if (failures) process.exitCode = 1;
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  await main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
