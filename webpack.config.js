const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: [`./main.js`],
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    open: true,
    port: 8000,
  },

  plugins: [
    new HtmlWebpackPlugin({
      remplate: './index.js',
    })
  ]
}
