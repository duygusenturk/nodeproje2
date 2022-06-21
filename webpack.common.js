const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname + "dist"),
    publicPath: "/",
  },
  context: __dirname,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      title: "Anasayfa",
      template: "src/index.html",
      filename: "index.html",
      inject: true,
      chunks: ["main"],
    }),
    new MiniCssExtractPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: "babel-loader",
      },

      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
}
