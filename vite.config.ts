import react from "@vitejs/plugin-react";
import { rmSync } from "fs";
import { join } from "path";
import { defineConfig, type AliasOptions } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";

export default defineConfig(({ command }) => {
    rmSync("dist-main", { recursive: true, force: true });
    rmSync("dist-preload", { recursive: true, force: true });

    const isServe = command === "serve";
    const isBuild = command === "build";
    const sourcemap = isServe ? "inline" : undefined;

    const resolve: { alias: AliasOptions } = {
        alias: {
            "@common": join(__dirname, "src", "common"),
        },
    };

    return {
        root: "src/renderer",
        resolve,
        build: {
            outDir: "../../dist-renderer",
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
