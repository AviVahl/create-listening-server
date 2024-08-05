import pluginJs from "@eslint/js";
import pluginTypescript from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist/", "**/*.{js,mjs,cjs}"] },
  pluginJs.configs.recommended,

  ...pluginTypescript.configs.recommendedTypeChecked,
  { languageOptions: { parserOptions: { projectService: true } } },

  {
    rules: {
      "no-console": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },

  {
    files: ["**/*.test.{ts,tsx}"],
    rules: {
      // native node test runner types for describe() and it() return a promise, so disable this rule in tests
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
];
