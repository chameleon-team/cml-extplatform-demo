#! /usr/bin/env node    --inspect-brk  
//1 copy对应仓库 2 将对应仓库中 js interface
 //cml json 后缀的文件特殊处理，其他文件不作处理；
const path = require('path');
const extConfig = require('./utils/ext-config.js');
const utils = require('./utils/index.js');
const fs = require('fs-extra');
const glob = require('glob');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const log = console.log;


const resolve = function resolve (dir) {
  return path.join(__dirname, './', dir)
}
const fromDir = resolve('node_modules');//仓库要拷贝的源目录
const destinationDir = resolve(extConfig.root) ;//要生成的仓库所在目录；
const {extName,extRepositories} = extConfig.platformConfig;

const _ = module.exports = {};
/**
 * 分两步
 * 1 首先拷贝 node_modules 里面的资源
 * 2 然后对里面的资源进行替换
 */
_.convertDemos = function(){
  (extRepositories || []).forEach((type) => {
    let from = path.join(fromDir,`cml-tt-${type}`);
    let to = path.join(destinationDir,`cml-${extName}-${type}`)
    if(utils.isDir(from)){ 
      utils.copyDir(from,to);
      let filePaths = glob.sync(path.join(to,'./**/*.*'));
      debugger;
      filePaths.forEach((filePath) => {
        utils.replaceFile({filePath,type})
      })
    }
  })
  
}
_.start = function(){
  // if(utils.isDir(destinationDir)){ //已经转化过了，如果再次执行转化函数，需要询问用户是否确认再次转化；
  if(false){ //已经转化过了，如果再次执行转化函数，需要询问用户是否确认再次转化；
    log(chalk.green(`The ${destinationDir} is already inited`));
    log(chalk.red(`Attention: all the repositories will be rewrited `));
    let question = [
      {
        type:"list",
        name:'reconvert',
        message:"Do you want to reconvert the demos? All the repositories will be rewrited ",
        choices:[
          'no',
          'yes',
        ]
      }
    ]
    inquirer.prompt(question)
      .then((answer) => {
        if(answer.reconvert === 'yes'){
          _.convertDemos();
        }
    })
    // _.convertDemos();
  }else{ //没有转化过就直接执行转化
    _.convertDemos();
  }
}

_.start();




