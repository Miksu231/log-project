module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    "prettier",
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  plugins: ["@typescript-eslint", ],
  root: true,
  ignorePatterns: ["coverage/*"],
  overrides: [
    {
      files: ["*.json"],
      rules: {
        "no-unused-expressions": 0,
        quotes: 0,
        "quote-props": 0,
        "@typescript-eslint/comma-dangle": ["error", "never"],
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json", "./tsconfig.node.json"],
      },
    },
  ],
  rules: {
    "no-tabs": "off",
    "@typescript-eslint/consistent-type-assertions": [
      "warn",
      { assertionStyle: "never" },
    ],
    "vue/multi-word-component-names": "off",
    "brace-style": "off",
    "@typescript-eslint/brace-style": "warn",

    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],

    "comma-spacing": "off",
    "@typescript-eslint/comma-spacing": "warn",

    "func-call-spacing": "off",
    "@typescript-eslint/func-call-spacing": "warn",

    indent: "off",
    "@typescript-eslint/indent": ["warn", "tab"],

    "keyword-spacing": "off",
    "@typescript-eslint/keyword-spacing": "warn",

    "@typescript-eslint/member-delimiter-style": "warn",

    "no-extra-parens": "off",
    "@typescript-eslint/no-extra-parens": "warn",

    "object-curly-spacing": "off",
    "@typescript-eslint/object-curly-spacing": ["warn", "always"],

    semi: "off",
    "@typescript-eslint/semi": ["warn", "never"],

    "space-before-blocks": "off",
    "@typescript-eslint/space-before-blocks": "warn",

    "space-before-function-paren": "off",
    "@typescript-eslint/space-before-function-paren": [
      "error",
      { anonymous: "never", named: "never", asyncArrow: "always" },
    ],

    "space-infix-ops": "off",
    "@typescript-eslint/space-infix-ops": "warn",

    "@typescript-eslint/type-annotation-spacing": "error",
  },
};
