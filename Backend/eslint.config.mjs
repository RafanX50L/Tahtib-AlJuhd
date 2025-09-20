import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser, 
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    settings: {
      react: {
        version: "19.1.0",
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, 
    ],
    rules: {
      "no-console": "off",
      "semi": ["error", "always"],
      "camelcase": ["warn", { properties: "always" }],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);
