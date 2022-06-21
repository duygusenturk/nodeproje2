const common = require("./webpack.common.js")
const webpack = require("webpack")
const { merge } = require("webpack-merge")

const hotMiddlewareConfig =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true"

module.exports = merge(common, {
  mode: "development",
  context: __dirname,
  entry: { main: ["./src/index.js", hotMiddlewareConfig] },
  devtool: "inline-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
})
