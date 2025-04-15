import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    ...tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended),
    {
        ignores: ["dist-main/", "dist-preload/", "dist-renderer/", "node_modules/", "**/coverage/"],
    },
    {
        rules: {
            curly: ["error"],
            "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
            "@typescript-eslint/consistent-type-imports": "error",
            "func-style": ["error", "expression"],

            /**
             * Prevents empty constructors, e.g.: `constructor() {}`.
             */
            "no-useless-constructor": "off",
            "@typescript-eslint/no-useless-constructor": "error",

            /**
             * Enforces explicit class-member accessibility.
             */
            "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit" }],

            "padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "*", next: "if" },
                { blankLine: "always", prev: "if", next: "*" },
                { blankLine: "always", prev: "*", next: "for" },
                { blankLine: "always", prev: "for", next: "*" },
                { blankLine: "always", prev: "*", next: "try" },
                { blankLine: "always", prev: "try", next: "*" },
                { blankLine: "always", prev: "*", next: "while" },
                { blankLine: "always", prev: "while", next: "*" },
                { blankLine: "always", prev: "*", next: "switch" },
                { blankLine: "always", prev: "switch", next: "*" },
            ],
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
];
