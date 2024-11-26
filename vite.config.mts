import react from "@vitejs/plugin-react";
import { join } from "path";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import { defineConfig } from "vitest/config";
import pkg from "./package.json";

const rendererRoot = join(__dirname, "src", "renderer");
const rendererOutDir = join(__dirname, "dist-renderer");

const mainEntryPoint = join(__dirname, "src", "main", "index.ts");
const mainOutDir = join(__dirname, "dist-main");

const preloadEntryPoint = join(__dirname, "src", "preload", "index.ts");
const preloadOutDir = join(__dirname, "dist-preload");

export default defineConfig(({ command }) => {
    const isServe = command === "serve";
    const isBuild = command === "build";
    const sourcemap = isServe || process.argv.includes("--sourcemap");

    return {
        root: rendererRoot,
        resolve: {
            alias: {
                "@common": join(__dirname, "src", "common"),
                "@Core": join(__dirname, "src", "renderer", "Core"),
            },
        },
        build: {
            outDir: rendererOutDir,
            emptyOutDir: true,
            chunkSizeWarningLimit: 1200,
        },
        plugins: [
            react(),
            electron([
                {
                    entry: mainEntryPoint,
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
                            outDir: mainOutDir,
                            emptyOutDir: true,
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
                {
                    entry: preloadEntryPoint,
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
                            outDir: preloadOutDir,
                            emptyOutDir: true,
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
            ]),
            process.env.NODE_ENV === "test" ? null : renderer(),
        ],
        server: (() => ({
            host: "127.0.0.1",
            port: 7777,
        }))(),
        clearScreen: false,
        test: {
            root: "src",
            isolate: false, // This makes the tests run faster
            coverage: {
                include: ["**/*.ts"],
                exclude: ["**/index.ts", "**/*.test.ts"],
            },
        },
    };
});
