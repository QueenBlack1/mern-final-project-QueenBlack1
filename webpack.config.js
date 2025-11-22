const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // JS entry point
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML template
    }),
  ],
  // ...other rules for TSX/TS files
};