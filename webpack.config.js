const path = require('path');
console.log(__dirname);
console.log('############');

module.exports = {
  mode: 'development', // 実行モード
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'public'), // 出力は絶対パス限定
    filename: 'js/bundle.js', // 出力ファイル設定
  },
  devServer: {
    contentBase: 'public',
    open: true,
  },
};
