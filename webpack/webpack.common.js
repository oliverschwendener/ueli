const path = require("path");

module.exports = {
  devtool: "source-map",
  node: false,
  mode: "development",
  output: {
    filename: "renderer.js",
    path: path.resolve(__dirname, "../build")
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.(png|jpg|gif|html)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  }
};
