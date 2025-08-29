// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";


// export default defineConfig([
//   { 
//     files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
//     plugins: { js },
//     extends: ["ts/recommended"],
//     rules: {
//     "no-console": "off",
//     "semi": ["error", "always"],
//     "camelcase": ["warn", { "properties": "always" }]
//     } 
//   },
//   { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
//   tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
// ]);
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser, // Use the TypeScript parser
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin, // Use the TypeScript ESLint plugin
      react: pluginReact,
    },
    settings: {
      react: {
        version: "19.1.0", // Auto-detect the version from package.json
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, // Spread recommended TS configs
      pluginReact.configs.flat.recommended,
    ],
    rules: {
      "no-console": "off",
      "semi": ["error", "always"],
      "camelcase": ["warn", { properties: "always" }],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
]);
