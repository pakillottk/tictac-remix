
/** @type {import('eslint').Linter.Config} */
module.exports = {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    env: {
      commonjs: true,
      es6: true,
    },  
    // Base config
    extends: ["eslint:recommended"],
  
    overrides: [
      // Typescript
      {
        files: ["**/*.{ts,tsx}"],
        plugins: ["@typescript-eslint", "import"],
        parser: "@typescript-eslint/parser",
        languageOptions: {
          parserOptions: {
            project: true,
            tsconfigRootDir: __dirname,
          },
        },
        settings: {
          "import/internal-regex": "^~/",
          "import/resolver": {
            node: {
              extensions: [".ts", ".tsx"],
            },
            typescript: {
              alwaysTryTypes: true,
            },
          },
        },
        extends: [
          "plugin:@typescript-eslint/recommended",
          "plugin:import/recommended",
          "plugin:import/typescript",
        ],
      },
  
      // Node
      {
        files: [".eslintrc.cjs"],
        env: {
          node: true,
        },
      },
    ],
  };
  