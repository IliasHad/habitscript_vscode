'use strict';

const path = require('path');


const config = {
  target: 'node',
  entry: './src/extension.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
    ],
  },
};

module.exports = config;