// @ts-check

import pluginJs from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginTypescript from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/"]),
  pluginJs.configs.recommended,
  {
    rules: {
      "no-console": "error",
      "no-undef": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  ...pluginTypescript.configs.recommendedTypeChecked.map((config) => ({ ...config, files: ["**/*.{ts,tsx,mts,cts}"] })),
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
]);
