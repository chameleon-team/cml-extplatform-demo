const fs = require('fs-extra');
const extConfig = require('./ext-config.js')

const _ = module.exports = {};
//优化项
_.checkExtConfig = function(){
  //检查config必须项，参考下loder-utils的实现
}
_.isDir = function(filePath){
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}
_.isFile = function(filePath){
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}
//将tt相关的包拷贝
_.copyDir = function(from,to){
  try{
    // fs.emptyDir(to);
    fs.copySync(from,to)
  }catch(e){
    console.log(e);
  }
}
/*处理package.json文件，因为直接copy已经发布的json文件需要修改
@params:filePath : package.json文件路径
@params:usedKeys : package.json文件中要取的key集合
@params:type:api ui ui-builtin,runtime,mixins,store,plugin等类型
*/
_.handleJSONfile = function(filePath,usedKeys,type){
  if(fs.existsSync(filePath)){
    const jsonContent = fs.readJSONSync(filePath);
    const newJsonContent = {};
    usedKeys.forEach((key) => {
      if(jsonContent[key]){
        //name 和 version 字段特殊改一下
        newJsonContent[key] = jsonContent[key];
        (key === 'name') && (newJsonContent[key] = `cml-${extConfig.platformConfig.extName}-type`);
        (key === 'version') && (newJsonContent[key] = '0.0.1');
      }
    });
    fs.outputJsonSync(filePath,newJsonContent)
  }
}
/**
 * api 主要处理两种文件 .interface .js 以及package.json
 */
_.generateApi = function(options){
  let {filePath,type} = options;
  if(_.isFile(filePath)){
    let extName = `${extConfig.platformConfig.extName}`;
    if(/\.interface/.test(filePath)){ //interface主要处理两个地方，第一个 include的值，第二个cml-type="xxx"
      let content = fs.readFileSync(filePath,'utf-8');
      let regInclude = /<include\s+?src\s*?=\s*?['"](.+?)\/.+?>/;
      let regCmlType = /<script\s+?(cml-type\s*?=\s*?['"]\s*?tt\s*?['"]).*?>/
      let regTtVariable = /tt/g;
      content = content.replace(regInclude,(match,$1) => {
        return match.replace(new RegExp($1),extConfig[type].inhertName)
      });
      content = content.replace(regCmlType,(match,$1) => {
        return match.replace(new RegExp($1),`cml-type="${extConfig.platformConfig.extName}"`)
      });
      content = content.replace(regTtVariable,extName);
      fs.writeFileSync(filePath,content, {encoding: 'utf-8'})
    }
    /*对于.js .interface  .cml 文件里面，ast解析来替换
    tt ==> demo; cml-tt-api ==> cml-demo-api */
    if(/\.js/.test(filePath)){
      let content = fs.readFileSync(filePath,'utf-8');
      let regTtVariable = /tt/g;
      content = content.replace(regTtVariable,extName);
      debugger;
      if(filePath.endsWith('tt.js')){ //
        //删除这个文件
        fs.unlinkSync(filePath)
        filePath = filePath.replace('tt.js',`${extName}.js`);
      };
      fs.writeFileSync(filePath,content, {encoding: 'utf-8'});
    }
    if(/\.json/.test(filePath)){
      let usedKeys = ['author','devDependencies','license','main','version','name','description']
      _.handleJSONfile(filePath,usedKeys,type)
    }
  }
}
/*
ui 主要处理 
.cml  1.处理名称后缀；2.处理 .cml 文件里引用的 cml-tt-api
.json 1.只引用必要字段
.js   1.处理引用的 cml-tt-api
.interface 修改要继承的组件库
*/
_.generateUI = function(options){
  let {filePath,type} = options;
  if(_.isFile(filePath)){
    let extName = `${extConfig.platformConfig.extName}`;
    if(/\.interface/.test(filePath)){ //interface主要处理两个地方，第一个 include的值，第二个cml-type="xxx"
      let content = fs.readFileSync(filePath,'utf-8');
      let regInclude = /<include\s+?src\s*?=\s*?['"](.+?)\/.+?>/;
      content = content.replace(regInclude,(match,$1) => {
        return match.replace(new RegExp($1),extConfig[type].inhertName)
      });
      fs.writeFileSync(filePath,content, {encoding: 'utf-8'})
    }
    /*对于.js .interface  .cml 文件里面，ast解析来替换
    tt ==> demo; cml-tt-api ==> cml-demo-api */
    if(/\.js/.test(filePath)){
      let content = fs.readFileSync(filePath,'utf-8');
      let regTtVariable = /cml-tt-api/g;
      content = content.replace(regTtVariable,`cml-${extName}-api`);
      
      fs.writeFileSync(filePath,content, {encoding: 'utf-8'})
    }
    if(/\.json/.test(filePath)){
      let usedKeys = ['author','devDependencies','license','main','version','name','description']
      _.handleJSONfile(filePath,usedKeys,type)
    }
    if(/\.cml/.test(filePath)){
      let content = fs.readFileSync(filePath,'utf-8');
      let regTtVariable = /cml-tt-api/g;
      content = content.replace(regTtVariable,`cml-${extName}-api`);
      if(filePath.endsWith('tt.cml')){ //
        //删除这个文件
        fs.unlinkSync(filePath)
        filePath = filePath.replace('tt.cml',`${extName}.cml`);
      };
      fs.writeFileSync(filePath,content, {encoding: 'utf-8'});
    }
  }
}
/*
.js 文件处理 全局对象 tt
.json 文件
*/
_.generateMixins = function(options){
  let {filePath,type} = options;
  if(_.isFile(filePath)){
    let extName = `${extConfig.platformConfig.extName}`;
    if(/\.js/.test(filePath)){
      let content = fs.readFileSync(filePath,'utf-8');
      let regTtVariable = /tt/g;
      content = content.replace(regTtVariable,extName);
      debugger;
      fs.writeFileSync(filePath,content, {encoding: 'utf-8'});
    }
    if(/\.json/.test(filePath)){
      let usedKeys = ['author','devDependencies','license','main','version','name','description']
      _.handleJSONfile(filePath,usedKeys,type)
    }
  }

}
/**
 * .interface 1.处理cml-type='tt' 2 处理 include 要继承的store;
 * .json 
 * 
 */
_.generateStore = function(options){
  let {filePath,type} = options;
  if(_.isFile(filePath)){
    let extName = `${extConfig.platformConfig.extName}`;
    if(/\.js/.test(filePath)){
      let content = fs.readFileSync(filePath,'utf-8');
      let regInclude = /<include\s+?src\s*?=\s*?['"](.+?)\/.+?>/;
      let regCmlType = /<script\s+?(cml-type\s*?=\s*?['"]\s*?tt\s*?['"]).*?>/
      content = content.replace(regInclude,(match,$1) => {
        return match.replace(new RegExp($1),extConfig[type].inhertName)
      });
      content = content.replace(regCmlType,(match,$1) => {
        return match.replace(new RegExp($1),`cml-type="${extConfig.platformConfig.extName}"`)
      });
      fs.writeFileSync(filePath,content, {encoding: 'utf-8'});

    }
    if(/\.json/.test(filePath)){
      let usedKeys = ['author','devDependencies','license','main','version','name','description']
      _.handleJSONfile(filePath,usedKeys,type)
    }
  }
}
_.generateRuntime = function(options){
  let {filePath,type} = options;
  if(_.isFile(filePath)){
    let extName = `${extConfig.platformConfig.extName}`;
    if(/\.js/.test(filePath)){
      let content = fs.readFileSync(filePath,'utf-8');
      let regInclude = /<include\s+?src\s*?=\s*?['"](.+?)\/.+?>/;
      let regCmlType = /<script\s+?(cml-type\s*?=\s*?['"]\s*?tt\s*?['"]).*?>/
      content = content.replace(regInclude,(match,$1) => {
        return match.replace(new RegExp($1),extConfig[type].inhertName)
      });
      content = content.replace(regCmlType,(match,$1) => {
        return match.replace(new RegExp($1),`cml-type="${extConfig.platformConfig.extName}"`)
      });
      fs.writeFileSync(filePath,content, {encoding: 'utf-8'});

    }
    if(/\.json/.test(filePath)){
      let usedKeys = ['author','devDependencies','license','main','version','name','description']
      _.handleJSONfile(filePath,usedKeys,type)
    }
  }
}
/**
 * @parmas:filePath:要被替换的文件路径；
 * @params:replacement:要被替换的字段
 * @params:strOrFun:要替换的结果
 * 特定要替换的文件包括 json
 */
_.replaceFile = function(options){
  let {filePath,type} = options;//type: api  ui  ui-builtin store  runtime  plugin
  if(type === 'api'){//处理api的生成
    _.generateApi(options);
  } 
  if(type === 'ui' || type === 'ui-builtin'){
    _.generateUI(options);
  }
  if(type === 'mixins'){
    _.generateMixins(options);
  }
  if(type === 'store'){
    _.generateStore(options);
  }
  if(type === 'runtime'){
    _.generateRuntime(options);
  }
  
}
