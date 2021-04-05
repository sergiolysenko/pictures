const path = require('path');
const webpack = require('webpack');
const tailwind = require('tailwindcss');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

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
    port: 8090,
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
    }, {
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: ''
        }
      }, {
        loader: 'css-loader'
      }, {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              tailwind('./tailwind.config.js'),
              require('autoprefixer'),
            ]
          }
        }
      }]
    }, {
      test: /\.(png|jpe?g|webp)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        }
      }]
    }, {
      test: /\.(ttf|woff|woff2)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        }
      }]
    }]
  }
}
