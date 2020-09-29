const isProduction = process.env.NODE_ENV === 'production';
//const TerserPlugin = require('terser-webpack-plugin'); // yarn -dev add terser-webpack-plugin
module.exports = {
  publicPath: isProduction
    ? '/RainbowWars/dist/'
    : '/',
  productionSourceMap: isProduction
    ? false : true,
}