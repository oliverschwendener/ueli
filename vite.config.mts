import react from "@vitejs/plugin-react";
import { join } from "path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";

export default defineConfig(({ command }) => {
    const isServe = command === "serve";
    const isBuild = command === "build";
    const sourcemap = isServe || process.argv.includes("--sourcemap");

    return {
        root: "src/renderer",
        resolve: {
            alias: {
                "@common": join(__dirname, "src", "common"),
                "@Core": join(__dirname, "src", "renderer", "Core"),
            },
        },
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
                        resolve: {
                            alias: {
                                "@common": join(__dirname, "src", "common"),
                                "@Core": join(__dirname, "src", "main", "Core"),
                            },
                        },
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
                        resolve: {
                            alias: {
                                "@common": join(__dirname, "src", "common"),
                            },
                        },
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
