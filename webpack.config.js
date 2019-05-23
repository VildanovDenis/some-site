const path = require('path');

module.exports = {
  entry: './app/js/index.js',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'app/js'),
    filename: 'index.bundle.js'
  },
  watch: true,
  mode: 'production'
}