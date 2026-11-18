// @ts-check
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "**/*.tsbuildinfo"] },

  js.configs.recommended,
  // typescript-eslint's standard starting point: rules that almost always flag a real bug.
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // Tool configs outside any tsconfig's `include`, type-checked with the server's settings.
          allowDefaultProject: ["server/drizzle.config.ts"],
          defaultProject: "server/tsconfig.json",
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Matches `verbatimModuleSyntax`: type-only imports must say so.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",

      // Allow async functions as JSX event handlers (e.g. onSubmit={handleSubmit(onSubmit)}).
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      eqeqeq: ["error", "always"],

      // Cross-package code goes through the workspace package name, never relative paths.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/shared/src/**",
                "**/server/src/**",
                "**/client/src/**",
                "@health-tracker/*/src/**",
              ],
              message:
                "Import other packages by name, e.g. '@health-tracker/shared'.",
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
          paths: [
            {
              name: "@health-tracker/server",
              message: "The client must not import server code.",
            },
          ],
          patterns: [
            {
              group: [
                "**/shared/src/**",
                "**/server/**",
                "@health-tracker/*/src/**",
              ],
              message:
                "Import shared code as '@health-tracker/shared'; never import server code.",
            },
            {
              group: ["../*", "../**"],
              message:
                "Use the '@/' alias for imports outside this folder, e.g. '@/components/Foo'.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["client/src/**/*.{ts,tsx}"],
    ...reactHooks.configs.flat["recommended-latest"],
  },
  {
    files: ["client/src/**/*.{ts,tsx}"],
    ...reactRefresh.configs.vite,
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
