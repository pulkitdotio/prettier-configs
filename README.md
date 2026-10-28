# Prettier Configs

Six ready-to-copy Prettier presets for JavaScript, TypeScript, React, and
documentation. Pick a style, copy one JSON file, and format your project.

Each preset is independent, uses built-in Prettier languages, and comes with
generated examples and automated checks. Start with **base** if you are unsure.
This repository is a configuration collection, not an npm package.

## Choose a preset

All presets use two-space indentation, spaces instead of tabs, single quotes for
JavaScript, and LF line endings. JSON always uses double quotes. These settings
do not determine which languages a preset can format; Prettier detects the
language from the file extension.

| Preset            | Intended use                                                   | Important formatting preferences                                                                                                                                                | File                                             |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **base**          | General JavaScript and TypeScript; recommended starting point  | Width 80; semicolons; trailing commas `all`; arrow parentheses `always`                                                                                                         | [base.json](configs/base.json)                   |
| **frontend**      | React, TypeScript, HTML, and CSS                               | Width 80; semicolons; trailing commas `all`; arrow parentheses `always`; one JSX/HTML attribute per line; double JSX quotes; closing `>` on its own line for multiline elements | [frontend.json](configs/frontend.json)           |
| **backend**       | Node.js and TypeScript, including Express and Fastify projects | Width 100; semicolons; trailing commas `all`; arrow parentheses `always`; `objectWrap: "preserve"`                                                                              | [backend.json](configs/backend.json)             |
| **compact**       | Teams that prefer less wrapping and punctuation                | Width 120; semicolons off; trailing commas `es5`; arrow parentheses `avoid`; no spaces inside object braces; `objectWrap: "collapse"`                                           | [compact.json](configs/compact.json)             |
| **spacious**      | Teams that prefer shorter lines                                | Width 60; semicolons; trailing commas `all`; arrow parentheses `always`; spaces inside object braces; `objectWrap: "preserve"`                                                  | [spacious.json](configs/spacious.json)           |
| **documentation** | Markdown, JSON, YAML, and documentation repositories           | Width 80; semicolons; trailing commas `all`; arrow parentheses `always`; prose wrapping `always`; Markdown override preserves embedded code                                     | [documentation.json](configs/documentation.json) |

Frontend and backend are style choices, not framework rules. Frontend expands
JSX/HTML attributes; backend allows wider lines and leaves short attribute lists
inline. CSS uses Prettier's standard layout with the preset's indentation and
line width. No React or server framework dependency is required.

Compact can collapse objects that fit on one line. Spacious preserves an existing
newline before the first object property and wraps sooner. It does not force
every object onto multiple lines or add extra blank lines. Compact is not a
minifier and does not optimize production code.

## Quick start

Run these commands **inside your own npm project**. If it has no `package.json`,
run `npm init -y` first. Node.js 22 or newer is recommended; this collection is
verified with Node.js 24 and Prettier **3.9.10**.

1. Install the tested Prettier version:

   ```sh
   npm install --save-dev --save-exact prettier@3.9.10
   ```

2. Choose a preset above. Copy its entire JSON contents into a file named
   `.prettierrc.json` in your project root. To download base directly on
   macOS/Linux:

   ```sh
   curl -fsSL https://raw.githubusercontent.com/pulkitdotio/prettier-configs/main/configs/base.json -o .prettierrc.json
   ```

   In PowerShell:

   ```powershell
   Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/pulkitdotio/prettier-configs/main/configs/base.json' -OutFile '.prettierrc.json'
   ```

   Replace `base.json` in the URL to select another preset. Copying or downloading
   replaces an existing `.prettierrc.json`; merge your existing preferences first.

3. Check, then format your code:

   ```sh
   npx prettier . --check
   npx prettier . --write
   ```

   `--check` reports files that need formatting and returns a nonzero exit code
   when they differ. `--write` updates supported files in place.

Commit `.prettierrc.json`, your lockfile, and a project-specific `.prettierignore`
so contributors use the same setup. Keep one intended Prettier configuration in
scope; an existing `prettier` field in `package.json` can take precedence over
the copied file. See [usage](docs/usage.md) for local copying, ignores, and
explicit configuration paths.

## Customize your copy

Edit `.prettierrc.json`; no inheritance or merge with another preset is needed.

| Option          | What to change                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `singleQuote`   | `true` prefers single JS quotes; `false` prefers double. JSX has its own `jsxSingleQuote` setting.          |
| `semi`          | `true` adds statement semicolons; `false` omits them except where needed to avoid parsing hazards.          |
| `tabWidth`      | Change the indentation size, for example from `2` to `4`. `useTabs` controls tabs versus spaces separately. |
| `printWidth`    | Set the preferred line width. It is a wrapping guideline, not a hard maximum.                               |
| `trailingComma` | Choose `all`, `es5`, or `none`. Only syntactically valid positions receive commas.                          |
| `arrowParens`   | Choose `always` or `avoid`; required parentheses remain even with `avoid`.                                  |

The documentation preset wraps Markdown prose and leaves fenced code as written.
Remove its Markdown override to format embedded code automatically. Details and
override examples are in [customization](docs/customization.md).

Prettier intentionally has a limited set of formatting options. It does not
replace ESLint, type checking, or tests. Read the official
[options reference](https://prettier.io/docs/options) before adding a rule.

## Formatting examples

Each output below was generated from its linked input using the named preset
and the pinned Prettier version. Open them side by side to compare.

| Language   | Before                                 | Generated output                                                                                                            |
| ---------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| JavaScript | [Input](examples/javascript/before.js) | [Base](examples/javascript/base.js), [compact](examples/javascript/compact.js), [spacious](examples/javascript/spacious.js) |
| TypeScript | [Input](examples/typescript/before.ts) | [Backend](examples/typescript/backend.ts)                                                                                   |
| React TSX  | [Input](examples/react/before.tsx)     | [Frontend](examples/react/frontend.tsx)                                                                                     |
| CSS        | [Input](examples/css/before.css)       | [Frontend](examples/css/frontend.css)                                                                                       |
| HTML       | [Input](examples/html/before.html)     | [Frontend](examples/html/frontend.html)                                                                                     |
| JSON       | [Input](examples/json/before.json)     | [Documentation](examples/json/documentation.json)                                                                           |
| Markdown   | [Input](examples/markdown/before.md)   | [Documentation](examples/markdown/documentation.md)                                                                         |
| YAML       | [Input](examples/yaml/before.yml)      | [Documentation](examples/yaml/documentation.yml)                                                                            |

For example, the JavaScript input's short multiline `options` object becomes one
line with compact. Its `describe` arrow function stays on one line with base and
wraps with spacious. The frontend examples separate attributes, and the Markdown
output wraps the paragraph while preserving the code fence.

The fixtures illustrate formatting; they are not applications and need no React
installation or TypeScript build. All six presets are tested against all eight
file types, including types outside their suggested use.

## VS Code

Install [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
(`esbenp.prettier-vscode`). After installing local Prettier and copying your
preset, add these settings to your project's `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.requireConfig": true
}
```

The extension finds `.prettierrc.json` from the file's directory upward and uses
the local Prettier installation. If your editor has a language-specific default
formatter, select Prettier for that language too. Configuration files take
precedence over extension formatting preferences. See the
[extension documentation](https://github.com/prettier/prettier-vscode).

## Work on this collection

```sh
git clone https://github.com/pulkitdotio/prettier-configs.git
cd prettier-configs
npm ci
npm run validate
npm test
npm run format:check
```

On Windows, use `npm.cmd` and `npx.cmd` if PowerShell blocks the `npm.ps1` or
`npx.ps1` wrapper.

| Script                      | Purpose                                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run validate`          | Discover preset JSON files, validate options, and format eight file types with each preset.                                  |
| `npm test`                  | Check all six presets, determinism, idempotence, meaningful style differences, validator failures, and exact example output. |
| `npm run format`            | Format repository code and documentation using base.                                                                         |
| `npm run format:check`      | Check repository formatting without writing.                                                                                 |
| `npm run examples:generate` | Regenerate the ten example outputs using their corresponding presets.                                                        |

Repository formatting excludes `examples/` to preserve intentionally unformatted
inputs and outputs belonging to other presets. Tests check every generated
output instead. After changing a preset or upgrading Prettier, regenerate the
examples, review the differences, and run all three verification commands.

The validator uses the installed Prettier's public `getSupportInfo` metadata for
option names, deprecations, types, and values. It validates override structure,
resolves each fixture's configuration with `resolveConfig`, and formats with
`format`. It fails on invalid JSON, unsupported options, formatting errors, or
non-idempotent output. It is an internal utility for this plugin-free collection,
not a general validator for arbitrary Prettier plugins or configurations.

GitHub Actions runs `npm ci`, validation, tests, and the formatting check on
pushes and pull requests using Node.js 24.

```text
configs/       Six self-contained JSON presets
examples/      Eight inputs and ten generated outputs, grouped by language
docs/          Usage and customization guides
scripts/       Validation, example generation, and shared helpers
tests/         Node.js built-in tests
.github/       GitHub Actions workflow
```

## Known limitations

- Preset names describe formatting preferences, not framework behavior, coding
  best practices, or correctness checks.
- Prettier does not offer arbitrary spacing rules, import sorting, or a separate
  style policy for every CSS construct. No plugins are included.
- `printWidth` is a preference. Long strings, URLs, and some constructs may
  exceed it. `objectWrap: "preserve"` uses the existing newline as a hint, rather
  than forcing every object to expand.
- JavaScript quote settings do not change JSON's required double quotes.
  Prettier can choose the other JavaScript quote style to reduce escapes.
- Markdown prose reflow can affect workflows where line breaks are meaningful.
  Use `proseWrap: "preserve"` if you need to keep author-chosen wrapping.
- The collection is tested with Prettier 3.9.10. `objectWrap` requires Prettier
  3.5 or newer; older installations may ignore it with a warning. Pin your
  formatter and review changes when upgrading.
