import { join } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";

import pkg from "./package.json" with { type: "json" };

const dirname = import.meta.dirname;

const rendererRoot = join(dirname, "src", "renderer");

export default defineConfig(({ command }) => {
    const isServe = command === "serve";
    const isBuild = command === "build";
    const sourcemap = isServe || process.argv.includes("--sourcemap");

    return {
        main: {
            resolve: {
                alias: {
                    "@Shared": join(dirname, "src", "shared"),
                    "@Core": join(dirname, "src", "main", "Core"),
                },
            },
            build: {
                sourcemap,
                minify: isBuild,
                outDir: join(dirname, "dist-main"),
                rollupOptions: {
                    external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                },
            },
        },
        preload: {
            resolve: {
                alias: {
                    "@Shared": join(dirname, "src", "shared"),
                },
            },
            build: {
                sourcemap,
                minify: isBuild,
                outDir: join(dirname, "dist-preload"),
                rollupOptions: {
                    external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                },
            },
        },
        renderer: {
            root: rendererRoot,
            resolve: {
                alias: {
                    "@Shared": join(dirname, "src", "shared"),
                    "@Core": join(dirname, "src", "renderer", "Core"),
                },
            },
            build: {
                sourcemap,
                rollupOptions: {
                    input: {
                        search: join(rendererRoot, "search.html"),
                        settings: join(rendererRoot, "settings.html"),
                    },
                },
                outDir: join(dirname, "dist-renderer"),
                emptyOutDir: true,
                chunkSizeWarningLimit: 1200,
            },
            plugins: [react()],
            server: {
                host: "127.0.0.1",
                port: 7777,
            },
        },
    };
});
