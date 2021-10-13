/*
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2021-03-19 11:04:11
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-10-13 17:27:56
 */
var NwBuilder = require('nw-builder');

var setupFun = require('./build/build-win-setup')
const path = require('path');

// 注意logo.icon经常会缓存，我怀疑跟cache的nw包有关，一旦删除了nw的缓存包，
// 然后重新打包就正常了
var nw = new NwBuilder({
  "main": "index.html",
  files: ['index.html','./package.json','./logo.ico'], // 包含文件
  platforms: ['win32'], // 打包的平台
  version: '0.37.0', // 使用 NW.js 的版本
  flavor: 'sdk',  // 是否启用开发模式（能鼠标右键查看打印结果）sdk、normal任选一
  winIco: path.resolve(__dirname,'./logo.ico'),
  buildDir: './releases', // 打包完成存放文件夹
  buildType: function(){return ''} // default [appName]
});

nw.on('log', console.log); // 日志打印函数

// 开始构建
nw.build().then(function(){
  console.log('---------### win包打包完成 ###--------');
  console.log('---------### 开始制作exe安装包 ###--------');
  setupFun().then((a)=>{
    console.log('Success--打包完成！');
  },(e)=>{
    console.log('Error',e);
  })
}).catch(function(err){
  console.log(err);
});