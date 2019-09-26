//配置成对象，每个单独的对象以后都可以扩展；
module.exports = {
  root:'packages-other',//配置新生成跨端代码的位置；
  /*1 生成相关仓库名，会以这个字段生成仓库，比如cml-other-api等，
    2 将这些仓库中用到的包名，比如cml-tt-ui中用到的cml-tt-api替换成cml-other-api等
    3 将全局变量 tt 替换成 other
    */
  platformConfig: {
    extName: 'other',//扩展新端的特定标志 比如 微信是 wx 支付宝的是 my  字节跳动的是 tt 
    //只能取值'api','store','mixins','plugin','ui-builtin','ui','runtime',用于定义哪些扩展新端自动生成
    extRepositories:['api','store','mixins','plugin','ui-builtin','ui','runtime']
    // extRepositories:['api']
  },
  plugin:{ //cml-other-plugin相关配置，主要是模板相关的；
    template:{
      "c-if":"other:if",
      "c-else-if":"other:elif",
      "c-else":"other:else",
      "c-for":"other:for",
      "c-for-index":"other:for-index",
      "c-for-item":"other:for-item",
      "c-key":"other:key",
    },
  },
  ui:{
    "inhertName":"cml-ui",//表示 .interface文件中要继承的那个包
  },
  'ui-builtin':{
    "inhertName":"chameleon-ui-builtin",//表示 .interface文件中要继承的那个包
  },
  api:{
    "inhertName":"chameleon-api",//表示 .interface文件中要继承的那个包
  },
  store:{
    "inhertName":"chameleon-store",//表示 .interface文件中要继承的那个包
  },
  runtime:{
    "inhertName":"chameleon-runtime",//表示 .interface文件中要继承的那个包
  },


}