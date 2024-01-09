import react from "@vitejs/plugin-react";
import { join } from "path";
import { defineConfig, type AliasOptions } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";

export default defineConfig(({ command }) => {
    const isServe = command === "serve";
    const isBuild = command === "build";
    const sourcemap = isServe ? "inline" : undefined;

    const resolve: { alias: AliasOptions } = {
        alias: {
            "@common": join(__dirname, "src", "common"),
            "@Core": join(__dirname, "src", "main", "Core"),
        },
    };

    return {
        root: "src/renderer",
        resolve,
        build: {
            outDir: "../../dist-renderer",
            emptyOutDir: true,
            chunkSizeWarningLimit: 1000,
        },
        plugins: [
            react(),
            electron([
                {
                    entry: "src/main/index.ts",
                    onstart(options) {
                        options.startup();
                    },
                    vite: {
                        resolve,
                        build: {
                            sourcemap,
                            minify: isBuild,
                            outDir: "dist-main",
                            emptyOutDir: true,
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
                {
                    entry: "src/preload/index.ts",
                    onstart(options) {
                        // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                        // instead of restarting the entire Electron App.
                        options.reload();
                    },
                    vite: {
                        resolve,
                        build: {
                            sourcemap,
                            minify: isBuild,
                            outDir: "dist-preload",
                            emptyOutDir: true,
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
            ]),
            renderer(),
        ],
        server: (() => ({
            host: "127.0.0.1",
            port: 7777,
        }))(),
        clearScreen: false,
    };
});
