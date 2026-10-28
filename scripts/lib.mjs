import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const configDirectory = join(root, 'configs');

// One input can demonstrate several styles without duplicating source files.
export const examples = [
  {
    directory: 'javascript',
    extension: 'js',
    presets: ['base', 'compact', 'spacious'],
  },
  { directory: 'typescript', extension: 'ts', presets: ['backend'] },
  { directory: 'react', extension: 'tsx', presets: ['frontend'] },
  { directory: 'css', extension: 'css', presets: ['frontend'] },
  { directory: 'html', extension: 'html', presets: ['frontend'] },
  { directory: 'json', extension: 'json', presets: ['documentation'] },
  { directory: 'markdown', extension: 'md', presets: ['documentation'] },
  { directory: 'yaml', extension: 'yml', presets: ['documentation'] },
];

export function examplePath(example, name = 'before') {
  return join(
    root,
    'examples',
    example.directory,
    `${name}.${example.extension}`,
  );
}

export async function formatExample(example, configPath, source) {
  const filepath = examplePath(example);
  const options = await prettier.resolveConfig(filepath, {
    config: configPath,
    editorconfig: false,
    useCache: false,
  });
  if (!options) throw new Error(`Could not resolve ${configPath}`);
  return prettier.format(source ?? (await readFile(filepath, 'utf8')), {
    ...options,
    filepath,
  });
}
