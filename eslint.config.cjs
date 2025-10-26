module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "**/.next/**",
      "dist/**",
      "build/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-duplicate-imports": "error",
      "no-throw-literal": "error",
      "no-explicit-any": "off",
    },
  },
];
