module.exports = {
  pages:{
    index:{
      //入口文件
      entry: 'src/main.js'
    },
  },
  lintOnSave:false,//关闭语法检查
  //方式一:开启代理服务器
  // devServer:{
  //   proxy: 'http://localhost:5000'
  // },

  //方式二:开启代理服务器
  devServer: {
    proxy: {
      '/Litx': {
        target: 'http://localhost:5000',
        pathRewrite:{'^/Litx':''},
        // 用于支持websocket
        ws: true,//默认值为true
        changeOrigin: true//默认值为true,用于请求头中的Host值
      },
      '/demo': {
        target: 'http://localhost:5001',
        pathRewrite:{'^/demo':''},
        // 用于支持websocket
        ws: true,//默认值为true
        changeOrigin: true//默认值为true,用于请求头中的Host值
      },
      // '/foo': {
      //   target: '<other_url>'
      // }
    }
  }
}