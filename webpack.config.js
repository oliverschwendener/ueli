const path = require("path");
const webpack = require("webpack");
const exec = require('child_process').exec;

const mode = process.env.NODE_ENV === "production" ? "production" : "development";
const devtool = process.env.NODE_ENV === "production" ? undefined : "source-map";

let script = "yarn start";

console.log(`Using "${mode}" mode for webpack bundles`);

const mainConfig = {
    entry: path.join(__dirname, "src", "main", "main.ts"),
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "bundle")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    mode,
    target: "electron-main",
    node: false,
    devtool,
}

const rendererConfig = {
    entry: path.join(__dirname, "src", "renderer", "renderer.ts"),
    output: {
        filename: "renderer.js",
        path: path.join(__dirname, "bundle")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            }
        ],
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        },
        extensions: [".ts", ".js"]
    },
    mode,
    target: "electron-renderer",
    node: false,
    devtool,
    plugins: [
     {
          apply: (compiler) => {
            compiler.hooks.afterEmit.tap("Start Ueli", () => {
              if (script.length > 0) {
                setTimeout(() => {
                  const proc = exec(script, (error) => {
                    if (error) {
                      throw error;
                    }
                  });
                  proc.stdout.pipe(process.stdout);
                  proc.stderr.pipe(process.stdout);
                  script = "";
                }, 2000);
              }
            });
          },
        }
  ]
};

module.exports = [
    mainConfig,
    rendererConfig
];
