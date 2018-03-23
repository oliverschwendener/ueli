const env = process.env.NODE_ENV;
const rendererConfig = require("./webpack/webpack.renderer");
const mainConfig = require("./webpack/webpack.main");

module.exports = [rendererConfig, mainConfig];
