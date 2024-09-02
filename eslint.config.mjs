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
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
];
