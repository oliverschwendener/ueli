const path = require("path");
const webpack = require("webpack");

const mode = process.env.NODE_ENV === "production" ? "production" : "development";

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
    devtool: "source-map"
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
    devtool: "source-map",
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
            NODE_ENV: '"production"'
            }
        })
    ]
};

module.exports = [
    mainConfig,
    rendererConfig
];
