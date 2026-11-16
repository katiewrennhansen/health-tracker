// @ts-check
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "**/*.tsbuildinfo"] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Matches `verbatimModuleSyntax`: type-only imports must say so.
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-import-type-side-effects": "error",

      // No escape hatches past the type checker (AGENTS.md).
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
      "@typescript-eslint/no-non-null-assertion": "error",

      // Unhandled promises are a common source of silent API and query bugs.
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",

      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      eqeqeq: ["error", "always"],

      // Cross-package code goes through the workspace package name, never relative paths.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/shared/src/**", "**/server/src/**", "**/client/src/**", "@health-tracker/*/src/**"],
              message: "Import other packages by name, e.g. '@health-tracker/shared'.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["server/**/*.ts"],
    languageOptions: { globals: globals.node },
  },

  {
    files: ["client/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    rules: {
      // Server code (and secrets like the LLM key) must never be bundled into the client.
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "@health-tracker/server", message: "The client must not import server code." }],
          patterns: [
            {
              group: ["**/shared/src/**", "**/server/**", "@health-tracker/*/src/**"],
              message: "Import shared code as '@health-tracker/shared'; never import server code.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      globals: globals.node,
    },
  },
);
