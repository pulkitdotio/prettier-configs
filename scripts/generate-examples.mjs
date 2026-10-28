import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  configDirectory,
  examples,
  examplePath,
  formatExample,
} from './lib.mjs';

for (const example of examples) {
  for (const preset of example.presets) {
    const output = await formatExample(
      example,
      join(configDirectory, `${preset}.json`),
    );
    await writeFile(examplePath(example, preset), output);
    console.log(
      `Generated ${example.directory}/${preset}.${example.extension}`,
    );
  }
}
