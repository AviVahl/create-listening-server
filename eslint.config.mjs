import pluginJs from "@eslint/js";
import pluginTypescript from "typescript-eslint";

for (const config of pluginTypescript.configs.recommendedTypeChecked) {
  config.files = ["**/*.{ts,tsx,mts,cts}"]; // ensure config only targets TypeScript files
}

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist/"] },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-console": "error",
      "no-undef": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  ...pluginTypescript.configs.recommendedTypeChecked,
  { languageOptions: { parserOptions: { projectService: true } } },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.test.{ts,tsx,mts,cts}"],
    rules: {
      // native node test runner types for describe() and it() return a promise, so disable this rule in tests
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
];
