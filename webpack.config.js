const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/server.ts",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@/*": path.resolve(__dirname, "src/*"),
    },
  },
  target: "node",
  node: {
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
