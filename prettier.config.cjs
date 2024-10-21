/** @type {import("prettier").Config} */
module.exports = {
	endOfLine: "lf",
	semi: false,
	useTabs: false,
	singleQuote: false,
	arrowParens: "always",
	tabWidth: 2,
	experimentalTernaries: true,
	proseWrap: "always",
	// Since prettier 3.0, manually specifying plugins is required
	plugins: ["@ianvs/prettier-plugin-sort-imports"],
	// This plugin's options
	importOrder: [
		"",
		"<TYPES>^(node:)",
		"<TYPES>",
		"<TYPES>^(@)(/.*)$",
		"<TYPES>^[.]",
		"<TYPES>^@/types",
		"",
		"^react$",
		"<BUILTIN_MODULES>", // Node.js built-in modules
		"",
		"<THIRD_PARTY_MODULES>", // Imports not matched by other special words or groups.
		"",
		"^(@)(/.*)$",
		"^[./]",
		"^(@ui)(/.*)$",
		"",
		"^(?!.*[.]css$)[./].*$",
		".css$",
		"",
	],
	importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
	importOrderTypeScriptVersion: "5.0.0",
};
