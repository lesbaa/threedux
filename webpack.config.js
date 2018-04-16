/* eslint-env node */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './dev/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dev.app.bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './dev/template.html',
    }),
    new CopyWebpackPlugin([
      {
        from: './dev/assets',
        to: 'assets',
      },
    ]),
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './dist',
    port: 1234,
  },
  module: {
    rules: [
      {
        test: /\.glsl$/,
        loader: require.resolve('webpack-glsl-loader'),
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/stage-0',
              '@babel/stage-3',
            ],
            plugins: [
              require('@babel/plugin-transform-runtime'),
              require('@babel/plugin-proposal-object-rest-spread'),
              require('@babel/plugin-proposal-class-properties'),
            ],
          },
        },
      },
    ],
  },
}