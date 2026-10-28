import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { test } from 'node:test';
import {
  configDirectory,
  examples,
  examplePath,
  formatExample,
} from '../scripts/lib.mjs';
import {
  discoverConfigs,
  validateConfig,
  validatePreset,
} from '../scripts/validate-configs.mjs';

const names = [
  'backend',
  'base',
  'compact',
  'documentation',
  'frontend',
  'spacious',
];
const configPath = (name) => join(configDirectory, `${name}.json`);

test('the collection contains all six independent JSON presets', async () => {
  const paths = await discoverConfigs();
  assert.deepEqual(
    paths.map((path) => basename(path, '.json')),
    names,
  );
  for (const path of paths) {
    const config = JSON.parse(await readFile(path, 'utf8'));
    validateConfig(config);
    assert.equal(config.endOfLine, 'lf');
    assert.equal(config.useTabs, false);
  }
});

for (const name of names) {
  test(`${name} formats every fixture deterministically and idempotently`, async () => {
    for (const example of examples) {
      const first = await formatExample(example, configPath(name));
      assert.equal(
        await formatExample(example, configPath(name)),
        first,
        example.directory,
      );
      assert.equal(
        await formatExample(example, configPath(name), first),
        first,
        example.directory,
      );
      assert.ok(first.trim());
      assert.ok(!first.includes('\r'), 'output uses LF line endings');
    }
  });
}

test('committed examples exactly match real Prettier output', async () => {
  for (const example of examples) {
    for (const name of example.presets) {
      const expected = await formatExample(example, configPath(name));
      assert.equal(
        await readFile(examplePath(example, name), 'utf8'),
        expected,
        `${example.directory}/${name}`,
      );
    }
  }
});

test('compact collapses a short object while spacious preserves its multiline layout', async () => {
  const fixture = examples[0];
  const source = 'const options = {\n theme: "light", enabled: true\n};';
  const compact = await formatExample(fixture, configPath('compact'), source);
  const spacious = await formatExample(fixture, configPath('spacious'), source);
  assert.match(compact, /\{theme: 'light', enabled: true\}/);
  assert.match(spacious, /\{\n/);
  assert.ok(spacious.split('\n').length > compact.split('\n').length);
});

test('line width wraps a call in spacious that fits in compact', async () => {
  const source =
    'sendNotification(currentUser, notificationTitle, notificationMessage, deliveryOptions);';
  const compact = await formatExample(
    examples[0],
    configPath('compact'),
    source,
  );
  const spacious = await formatExample(
    examples[0],
    configPath('spacious'),
    source,
  );
  assert.equal(compact.trim().split('\n').length, 1);
  assert.ok(spacious.trim().split('\n').length > 1);
});

test('frontend separates JSX and HTML attributes while backend allows a short single line', async () => {
  for (const [extension, source] of [
    [
      'tsx',
      'const view = <button type="button" disabled={false}>Save</button>;',
    ],
    ['html', '<button type="button" class="save">Save</button>'],
  ]) {
    const fixture = examples.find((example) => example.extension === extension);
    const frontend = await formatExample(
      fixture,
      configPath('frontend'),
      source,
    );
    const backend = await formatExample(fixture, configPath('backend'), source);
    assert.match(frontend, /type="button"\n/);
    assert.match(backend, /<button type="button" /);
  }
});

test('documentation wraps prose and preserves Markdown code fences through its override', async () => {
  const fixture = examples.find((example) => example.extension === 'md');
  const source = await readFile(examplePath(fixture), 'utf8');
  const documentation = await formatExample(
    fixture,
    configPath('documentation'),
  );
  const base = await formatExample(fixture, configPath('base'));
  const codeFence = source.match(/```js\n([\s\S]*?)```/)[1];
  assert.ok(documentation.includes(codeFence));
  assert.ok(!base.includes(codeFence));
  const paragraph = (text) => text.split('\n\n')[1];
  assert.ok(paragraph(documentation).includes('\n'));
  assert.ok(!paragraph(base).includes('\n'));
});

test('invalid options, deprecated options, wrong types and malformed overrides fail', () => {
  const invalid = [
    [null, /expected an object/],
    [{}, /nonempty/],
    [{ singleQuotes: true }, /unsupported Prettier option/],
    [{ jsxBracketSameLine: true }, /deprecated/],
    [{ semi: 'true' }, /boolean/],
    [{ semi: null }, /boolean/],
    [{ tabWidth: 2.5 }, /integer/],
    [{ printWidth: -1 }, /range/],
    [{ trailingComma: 'sometimes' }, /unsupported option value/],
    [{ parser: 'babel' }, /automatic parser detection/],
    [{ semi: true, overrides: null }, /expected an array/],
    [{ semi: true, overrides: [{ options: { semi: false } }] }, /glob/],
    [
      { semi: true, overrides: [{ files: [], options: { semi: false } }] },
      /glob/,
    ],
    [
      {
        semi: true,
        overrides: [
          { files: '*.md', excludeFiles: 42, options: { semi: false } },
        ],
      },
      /glob/,
    ],
    [
      {
        semi: true,
        overrides: [{ files: '*.md', options: { fakeOption: true } }],
      },
      /unsupported/,
    ],
    [
      {
        semi: true,
        overrides: [{ files: '*.md', options: { semi: 'false' } }],
      },
      /boolean/,
    ],
    [
      {
        semi: true,
        overrides: [{ files: '*.md', options: { semi: false }, typo: true }],
      },
      /unknown override key/,
    ],
  ];
  for (const [config, error] of invalid)
    assert.throws(() => validateConfig(config), error);
});

test('discovery and JSON parsing report unusable configuration files', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'prettier-configs-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await assert.rejects(discoverConfigs(directory), /No configuration/);
  const path = join(directory, 'broken.json');
  await writeFile(path, '{ "semi": true, }');
  assert.deepEqual(await discoverConfigs(directory), [path]);
  await assert.rejects(validatePreset(path), SyntaxError);
});
