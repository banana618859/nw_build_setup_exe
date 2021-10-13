/*
 * @Descripttion: unTitle
 * @Author: yizheng.yuan
 * @Date: 2021-08-31 11:45:49
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-10-13 18:22:50
 */
var innosetupCompiler = require('innosetup-compiler')
var path = require('path')
var fs = require('fs')
var iconv = require('iconv-lite')

var rootPath = path.resolve(__dirname, '../')

// // `./package.json`
var tmpJson = require(path.resolve(rootPath, './package.json'))
console.log('tmpJson',tmpJson);

// // get config
// var config = require(path.resolve(rootPath, 'config'))
// var setupOptions = config.build.nw.setup
var curReleasesPath = path.resolve(__dirname, '../','releases')
console.log('curReleasesPath',curReleasesPath);
var setupOptions = {
  issPath: path.resolve(__dirname, './setup.iss'),
  // only one version path
  files: curReleasesPath,
  resourcesPath: path.resolve(__dirname, './setup_resources'),
  appPublisher: 'vue-nw-seed, Inc.',
  appURL: 'https://github.com/anchengjian/vue-nw-seed',
  appId: '{{A448363D-3A2F-4800-B62D-8A1C4D8F1115}}',
  // data: { name, version, platform }
  outputFileName: function (data) {
    return data.name + '-' + data.version
  }
}
// var platforms = ['win32', 'win64']
var platforms = ['win32']

module.exports = function () {
  const res = []
  const files = fs.readdirSync(setupOptions.files)
  console.log('setupOptions.files',setupOptions.files, files);

  files.forEach(function (fileName) {
    if (!~platforms.indexOf(fileName)){
      console.log('不满足', fileName);
      return
    }

    const curPath = path.resolve(setupOptions.files, fileName)
    const stats = fs.statSync(curPath)
    if (!stats.isDirectory()) return

    const options = Object.assign({}, setupOptions, { files: curPath, platform: fileName })
    options.outputPath = options.outputPath || path.resolve(setupOptions.files, fileName + '-setup')

    console.log('options',options);
    res.push(makeExeSetup(options))
  })

  // 这里是所有promise完成后再返回
  return Promise.all(res)
}

function makeExeSetup(opt) {
  console.log('makeExeSetup: ',opt);
  const { issPath, files, outputPath, outputFileName, resourcesPath, appPublisher, appURL, appId, platform } = opt
  const { name, appName, version } = tmpJson
  const tmpIssPath = path.resolve(path.parse(issPath).dir, '_tmp_' + platform + '.iss')
  const getOutputNameHandle = typeof outputFileName === 'function' ? outputFileName : getOutputName

  return new Promise(function (resolve, reject) {
    // rewrite name, version to iss
    fs.readFile(issPath, null, function (err, text) {
      if (err) return reject(err)

      let str = iconv.decode(text, 'gbk')
        .replace(/_name_/g, name)
        .replace(/_appName_/g, appName)
        .replace(/_version_/g, version)
        .replace(/_outputPath_/g, outputPath)
        .replace(/_outputFileName_/g, getOutputNameHandle({ name, version, platform }))
        .replace(/_filesPath_/g, files)
        .replace(/_resourcesPath_/g, resourcesPath)
        .replace(/_appPublisher_/g, appPublisher)
        .replace(/_appURL_/g, appURL)
        .replace(/_appId_/g, appId)
        .replace(/_platform_/g, platform === 'win64' ? '64' : '')

      fs.writeFile(tmpIssPath, iconv.encode(str, 'gbk'), null, function (err) {
        if (err) return reject(err)

        // inno setup start
        innosetupCompiler(tmpIssPath, { gui: false, verbose: true }, function (err) {
          fs.unlinkSync(tmpIssPath)
          if (err) return reject(err)
          resolve(opt)
        })
      })
    })
  })
}

function getOutputName(data) {
  return data.name
}


// 测试
// let issPath = '../config/setup.iss'
// makeExeSetup({issPath})