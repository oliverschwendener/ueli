import react from "@vitejs/plugin-react";
import { rmSync } from "fs";
import { join } from "path";
import { AliasOptions, defineConfig, type ConfigEnv, type ServerOptions, type UserConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";

export default defineConfig(({ command }: ConfigEnv): UserConfig => {
    rmSync("dist-electron", { recursive: true, force: true });

    const isServe = command === "serve";
    const isBuild = command === "build";
    const sourcemap = isServe;

    const resolve: { alias: AliasOptions } = {
        alias: {
            "@common": join(__dirname, "common"),
        },
    };

    return {
        resolve,
        build: {
            chunkSizeWarningLimit: 1000,
        },
        plugins: [
            react(),
            electron([
                {
                    entry: "electron/main/index.ts",
                    onstart(options) {
                        options.startup();
                    },
                    vite: {
                        resolve,
                        build: {
                            sourcemap,
                            minify: isBuild,
                            outDir: "dist-electron/main",
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
                {
                    entry: "electron/preload/index.ts",
                    onstart(options) {
                        // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                        // instead of restarting the entire Electron App.
                        options.reload();
                    },
                    vite: {
                        resolve,
                        build: {
                            sourcemap: sourcemap ? "inline" : undefined,
                            minify: isBuild,
                            outDir: "dist-electron/preload",
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
            ]),
            renderer(),
        ],
        server: ((): ServerOptions => {
            return {
                host: "127.0.0.1",
                port: 7777,
            };
        })(),
        clearScreen: false,
    };
});
