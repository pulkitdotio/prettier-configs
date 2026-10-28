# Use a preset in your project

## Copy the file

Install local Prettier in your npm project:

```sh
npm install --save-dev --save-exact prettier@3.9.10
```

If you downloaded this collection beside your own project, run the following
from your project's root, adjusting the source path as needed:

```sh
cp ../prettier-configs/configs/base.json .prettierrc.json
```

PowerShell equivalent:

```powershell
Copy-Item -LiteralPath '../prettier-configs/configs/base.json' -Destination '.prettierrc.json'
```

Choose any of the six files in `configs/`. Copy the entire file, including any
`overrides`. Each preset contains its own settings; no other preset needs to be
copied. Review an existing configuration before replacing it.

Prettier discovers configuration by searching from the formatted file's
directory upward. Keep one intended configuration in scope, especially in a
monorepo: a nearer config or a `prettier` field in `package.json` may be selected
instead. See the official
[configuration file documentation](https://prettier.io/docs/configuration).

## Run the formatter

```sh
npx prettier src --check
npx prettier src --write
npx prettier . --check
```

Replace `src` with a directory or supported file in your project. The check
returns a nonzero exit code if formatting differs. The write command changes
files; review the diff before committing.

To try a preset without copying it, pass the config explicitly. For example,
inside a cloned copy of this collection:

```sh
npx prettier examples/javascript/before.js --config configs/compact.json --ignore-path .gitignore
```

This prints formatted code without changing the input. `--ignore-path .gitignore`
bypasses this collection's deliberate `.prettierignore` exclusion for examples.
The normal validation and generator scripts use Prettier's API, which does not
apply CLI ignore files automatically.

In your own project you can use a differently named config with
`npx prettier . --config path/to/preset.json --check`. Relative override patterns
are interpreted relative to the config file, so placing the copied preset at
your project root makes its scope predictable. Let the file extension select the
parser rather than adding a global `parser` setting.

## Ignore generated files

Add a `.prettierignore` suitable for your project, for example:

```gitignore
dist/
coverage/
generated/
```

Do not copy this collection's `.prettierignore` blindly: it excludes `examples/`
because those files are maintained by tests and the example generator.

## Add npm scripts

Merge these entries into the `scripts` object in your own `package.json`:

```json
{
  "scripts": {
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

These commands discover your copied `.prettierrc.json` automatically. This
collection's own scripts pass `configs/base.json` explicitly because the
collection has several alternative presets and no single copied root config.

## Maintain the collection

After editing a preset or an example input, run:

```sh
npm run examples:generate
npm run format
npm run validate
npm test
npm run format:check
```

The example mapping lives in [scripts/lib.mjs](../scripts/lib.mjs). To add an
example, add its `before` file and mapping, generate its output, and update the
README links. `validate` discovers every JSON file in `configs/`; the tests also
check that the six expected presets exist. If the collection grows, update that
expected list deliberately.

Use `npm ci` to reproduce the committed lockfile. When upgrading Prettier,
regenerate outputs and review the changes before updating documentation.
