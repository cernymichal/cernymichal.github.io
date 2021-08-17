const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/App.ts",
    loader: "./src/Loader.ts",
  },

  // Outputs compiled bundle to `./dist/js/main.js`
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],

    // Shortcuts to avoid up-one-level hell:
    // Turns "../../../utils" into "Utils"
    alias: {
      Utils: path.resolve(__dirname, "./src/utils/"),
    },
  },

  module: {
    // Test file extension to run loader
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        loader: "ts-shader-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, /tsOld/],
        loader: "ts-loader",
      },
    ],
  },

  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },

  // Enables dev server to be accessed by computers in local network
  devServer: {
    host: "0.0.0.0",
    port: 8000,
    contentBase: path.join(__dirname, "dist"),
    disableHostCheck: true,
  },
};
