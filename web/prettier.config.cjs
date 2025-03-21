/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  semi: false,
  useTabs: false,
  singleQuote: false,
  arrowParens: "always",
  tabWidth: 2,
  trailingComma: "es5",
  plugins: ["prettier-plugin-organize-imports"],
  organizeImportsSkipDestructiveCodeActions: true,
}
