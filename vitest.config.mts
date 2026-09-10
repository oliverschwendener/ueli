import { join } from "node:path";

import { defineConfig } from "vitest/config";

const dirname = import.meta.dirname;

export default defineConfig({
    resolve: {
        alias: {
            "@common": join(dirname, "src", "common"),
            "@Core": join(dirname, "src", "main", "Core"),
        },
    },
    test: {
        root: "src",
        coverage: {
            include: ["**/*.ts"],
            exclude: ["**/index.ts", "**/*.test.ts"],
        },
    },
});
