# Customize a copied preset

All six presets are plain JSON. Edit your project's `.prettierrc.json` directly;
changes to this repository do not update a file you already copied. JSON does
not allow comments or trailing commas in the configuration itself.

## Common preferences

| Option          | Supported values                                           | Effect                                                                                                                                               |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `singleQuote`   | `true`, `false`                                            | Prefer single or double quotes in JavaScript. Prettier may choose the other style to reduce escaping; JSON and JSX follow their own rules.           |
| `semi`          | `true`, `false`                                            | Add statement semicolons or omit them where safe. `false` can still produce leading semicolons to avoid parsing hazards.                             |
| `tabWidth`      | Nonnegative integer; typically `2` or `4`                  | Set indentation width. Keep `useTabs: false` for spaces, or set it to `true` for tab indentation.                                                    |
| `printWidth`    | Nonnegative integer; typically `60`, `80`, `100`, or `120` | Set a preferred wrapping width, not a strict maximum.                                                                                                |
| `trailingComma` | `all`, `es5`, `none`                                       | Choose trailing-comma positions supported by each syntax. `all` includes multiline function parameters and calls; `es5` omits those function commas. |
| `arrowParens`   | `always`, `avoid`                                          | Always wrap arrow parameters in parentheses, or omit them when possible. Typed, defaulted, and multiple parameters still need parentheses.           |

For example, if your team wants four-space indentation and double JavaScript
quotes, change `tabWidth` to `4` and `singleQuote` to `false` in the copied file.
You do not need to change the rest of the preset.

## JSX, HTML, and objects

Frontend uses `jsxSingleQuote: false` for double JSX quotes and
`singleAttributePerLine: true` for attribute layout in JSX and HTML. It keeps
`bracketSameLine: false` so the closing `>` of a multiline opening element is on
its own line. These choices do not validate accessibility or change component
behavior. `htmlWhitespaceSensitivity: "css"` respects default CSS display
behavior when considering HTML whitespace; it does not read your stylesheets.

Compact sets `bracketSpacing: false`, removing the spaces immediately inside
object braces. It does not remove required whitespace throughout a file.

With `objectWrap: "preserve"`, a newline before the first object property is a
hint to preserve multiline layout. With `"collapse"`, an object can fit on one
line when the width allows. Neither value changes property order or turns
Prettier into a minifier. See the
[official object wrapping options](https://prettier.io/docs/options#object-wrap).

## Language-specific overrides

Only use an override when files need a different formatting preference. Add an
`overrides` array to your copied configuration, for example to give JSON files
four-space indentation:

```json
{
  "tabWidth": 2,
  "overrides": [
    {
      "files": "*.json",
      "options": {
        "tabWidth": 4
      }
    }
  ]
}
```

This is a minimal illustration. Keep the rest of your preset's top-level
settings. If it already has overrides, merge this entry into the existing array.
Matching overrides apply on top of top-level preferences; later matching entries
can override earlier ones. See the
[official override documentation](https://prettier.io/docs/configuration#configuration-overrides).

Documentation uses `proseWrap: "always"` to reflow Markdown paragraphs to the
preferred width. Its `*.md` override sets `embeddedLanguageFormatting: "off"`
so fenced snippets can remain as written, including examples of unformatted
code. Markdown outside those fences is still formatted, and standalone JS,
JSON, and YAML files still use their normal parsers. Remove that override or set
the value to `"auto"` to format recognized code fences too. Use
`proseWrap: "preserve"` to retain author-chosen prose wrapping.

## Know what the formatter controls

Prettier handles layout, quotes, indentation, and supported punctuation rules.
It intentionally offers few customization options. It does not enforce
application architecture, sort imports, find unused variables, or type-check
code. Use a linter such as ESLint for code-quality rules and keep its formatting
rules from conflicting with Prettier.

Do not add invented options such as framework names, CSS property ordering, or
arbitrary blank-line policies. The [option reference](https://prettier.io/docs/options)
and the installed Prettier version determine what is supported. The collection
validator also rejects deprecated options, unknown options inside overrides,
parser forcing, and plugins so the presets stay portable and self-contained.
