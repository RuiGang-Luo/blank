module.exports = {
  // presets: [
  //   '@vue/app'
  // ],
  presets: [
    [
      '@babel/preset-env',
      {
        "targets": {
          "browsers": ["last 2 versions", "ie >= 7"]
        }
      }
    ]
  ],
  //babel语法转换插件
  plugins: [
    // [
    "@babel/plugin-transform-runtime",
    "transform-vue-jsx",
      // {
      //   "corejs": 2,
      //   "helpers": true,
      //   "regenerator": true,
      //   "useESModules": true
      // }
    // ],
    "@babel/plugin-syntax-dynamic-import"
  ]
}
