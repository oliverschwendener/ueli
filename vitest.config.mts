import { join } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname = import.meta.dirname;

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@shared": join(dirname, "src", "shared"),
            "@Core": join(dirname, "src", "main", "Core"),
        },
    },
    test: {
        root: "src",
        environment: "happy-dom",
        coverage: {
            include: ["**/*.ts", "**/*.tsx"],
            exclude: ["**/index.ts", "**/*.test.ts", "**/*.test.tsx"],
        },
    },
});
