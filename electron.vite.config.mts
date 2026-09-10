import { join } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

const dirname = import.meta.dirname;

const commonAlias = { "@common": join(dirname, "src", "common") };

const rendererRoot = join(dirname, "src", "renderer");

export default defineConfig(({ command }) => {
    const isBuild = command === "build";

    return {
        main: {
            resolve: {
                alias: { ...commonAlias, "@Core": join(dirname, "src", "main", "Core") },
            },
            build: {
                minify: isBuild,
            },
            plugins: [externalizeDepsPlugin()],
        },
        preload: {
            resolve: {
                alias: commonAlias,
            },
            build: {
                minify: isBuild,
            },
            plugins: [externalizeDepsPlugin()],
        },
        renderer: {
            resolve: {
                alias: { ...commonAlias, "@Core": join(rendererRoot, "Core") },
            },
            build: {
                rollupOptions: {
                    input: {
                        search: join(rendererRoot, "search.html"),
                        settings: join(rendererRoot, "settings.html"),
                    },
                },
                chunkSizeWarningLimit: 1200,
            },
            server: {
                host: "127.0.0.1",
                port: 7777,
            },
            plugins: [react()],
        },
    };
});
