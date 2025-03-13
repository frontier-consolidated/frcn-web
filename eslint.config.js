import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";
import "eslint-import-resolver-typescript";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs["flat/recommended"],
	prettier,
	...svelte.configs["flat/prettier"],
	importPlugin.flatConfigs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				App: "readonly"
			}
		}
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		}
	},
	{
		ignores: ["eslint.config.js", "build/", ".svelte-kit/", "dist/"]
	},
	{
		settings: {
			"import/parsers": {
				"@typescript-eslint/parser": [".ts", ".tsx"]
			},
			"import/resolver": {
				typescript: {
					project: "./tsconfig.json"
				},
				node: {
					extensions: [".js", ".jsx", ".ts", ".tsx", ".svelte"]
				}
			}
		}
	},
	{
		rules: {
			"import/no-unresolved": [
				"error",
				{
					ignore: ["^\\$app/.+", "^\\$env/.+"]
				}
			],
			"import/no-duplicates": "off",
			"import/order": [
				"warn",
				{
					groups: ["builtin", "external", ["sibling", "parent"], "index"],
					alphabetize: {
						order: "asc",
						caseInsensitive: true
					},
					"newlines-between": "always"
				}
			],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_"
				}
			]
		}
	}
);
