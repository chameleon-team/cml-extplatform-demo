# 仓库说明
本仓库是对chameleon进行新端扩展的demo示例代码，实现了基本的微信小程序的扩展。
`packages`是需要开发的npm包。
```
├── cml-demo-api   扩展端api库
├── cml-demo-plugin  扩展端编译插件
├── cml-demo-ui-builtin 扩展端内置组件库
├── cml-demo-runtime 扩展端运行时库
└── cml-demo-project  示例项目
```

### 运行项目
- 首先全局安装支持扩展新端的脚手架`npm i chameleon-tool@0.4.0-mvvm.6 -g`。
- 全局安装`lerna` 对本项目进行管理 `npm i lerna -g`。
- 在本仓库根目录执行`lerna bootstrap`，安装外部依赖与建立本仓库npm包之间的依赖。
- 在`cml-demo-project`目录执行`cml demo dev`, 用微信开发者工具打开`cml-demo-project/dist/demo`目录。

### 自动生成百分之90跨端代码

在项目根目录执行 `npm i `

然后执行  `npm run convert`

会自动生成90%的跨端代码，剩下的只需要简单调试下即可

cml-demo-plugin: 模板编译，打包输出

cml-demo-mixins:事件代理

cml-demo-api:对应端的API实现

cml-demo-store:数据存储

cml-demo-runtime:生命周期映射等

cml-demo-ui/cml-demo-ui-builtin:ui组件库