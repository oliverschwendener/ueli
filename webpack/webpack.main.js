const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: "./src/ts/main.ts",
  target: "electron-main",
  output: {
    filename: "main.js"
  },
});
