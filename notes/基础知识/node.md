# node简介
安装node后，自带npm
对于Node而言，NPM(Node Package Manager)帮助其完成了第三方模块的发布、安装和依赖等。借助NPM，Node与第三方模块之间形成了很好的一个生态系统。

## 模块化 
**基本概念**
在nodejs中，应用由模块组成，nodejs中采用commonJS模块规范。
- 一个js文件就是一个模块
-  每个模块都是一个独立的作用域，在这个文件中定义的变量、函数、对象都是私有的，对其他文件不可见。

**node中模块分类**
- 核心模块: 由 node 本身提供，不需要单独安装（npm），可直接引入使用
- 第三方模块: 由社区或个人提供，需要通过npm安装后使用
- 自定义模块: 由我们自己创建，比如：tool.js 、 user.js

**常见核心模块**
- fs：文件操作模块
- http：网络操作模块
- path：路径操作模块
- url: 解析地址的模块
- querystring: 解析参数字符串的模块

**模块导入**
- 通过require("fs")来加载模块
- 如果是第三方模块，需要先使用npm进行下载
- 如果是自定义模块，需要加上相对路径./或者../,可以省略.js后缀，如果文件名是index.js那么index.js也可以省略。
- 模块可以被多次加载，但是只会在第一次加载

**模块导出**
在模块的内部，module变量代表的就是当前模块，它的exports属性就是对外的接口，加载某个模块，加载的就是module.exports属性，这个属性指向一个空的对象。
```js
//module.exports指向的是一个对象，我们给对象增加属性即可。
//module.exports.num = 123;
//module.exports.age = 18;
 
//通过module.exports也可以导出一个值，但是多次导出会覆盖
module.exports = '123';
module.exports = "abc"
```

**module.exports与exports**
- exports 是 module.exports 的引用
```js
console.log( module.exports === exports ) // ==> true
 
// 等价操作
module.exports.num = 123
exports.num = 123
 
// 赋值操作：不要使用 exports = {}
module.exports = {}
```

**引入一个模块的过程**
- 先基于当前文件模块所属目录找 node_modules 目录
- 如果找到，则去该目录中找 mime 目录
- 如果找到 mime 目录，则找该目录中的 package.json 文件
- 如果找到 package.json 文件，则找该文件中的 main 属性
- 如果找到 main 属性，则拿到该属性对应的文件路径
- 如果找到 mime 目录之后
  - 发现没有 package.json
  - 或者 有 package.json 没有 main 属性
  - 或者 有 main 属性，但是指向的路径不存在
  - 则 node 会默认去看一下 mime 目录中有没有 index.js index.node index.json 文件
- 如果找不到 index 或者找不到 mime 或者找不到 node_modules
- 则进入上一级目录找 node_moudles 查找规则同上
- 如果上一级还找不到，继续向上，一直到当前文件所属磁盘根目录
- 如果最后到磁盘根目录还找不到，最后报错：can not find module xxx

**引入一个全局模块**
想要在js文件中通过require（‘模块名’）来使用全局安装的模块，有三种方式，
- 模块名使用路径
- 配置Node系统环境变量
- 使用`npm link`命令创建全局链接

## 包(package)
CommonJS的包规范允许我们将一组相关的模块组合到一起，形成一组完整的工具
CommonJS的包规范有`包结构`和`包描述文件`两个部分组成
- 包结构：用于组织包中的各种文件
- 包描述文件：描述包的相关信息，以供外部读取分析

**包结构**
包实际上就是一个压缩文件，解压以后是一个目录。符合CommonJS规范的目录，应该包含如下文件/文件夹：
- package.json：描述文件，**这是必须要有的文件**
- bin：存放可执行二进制文件的文件夹
- lib：存放js代码的文件夹
- doc：存放文档的文件夹
- test：存放单元测试的文件夹

Node.js 对包的要求并没有这么严格，只要顶层目录下有 package.json，并符合一些规范即可。

## package.json文件说明
**包含可配置项**
- name 名称
- 应用描述 description
- 版本号 version
- 脚本 script
- 应用的配置项 config
- 作者 author
- 资源仓库地址 respository
- 授权方式 licenses
- 目录 directories
- 应用入口文件 main
- 命令行文件 bin
- 项目应用运行依赖模块 dependencies
- 项目应用开发环境依赖 devDependencies
- 运行引擎 engines
- ...

**scripts字段**
scripts指定了运行脚本命令的npm命令行缩写，比如dev指定了运行`webpack-dev-server --inline --progress --config build/webpack.dev.conf.js`时，所要执行的命令。
```json
"scripts" : {
  "dev" : "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"
}
```
然后执行`npm run + scripts的key`,就相当于执行scripts的key对应的value，
如：执行`npm run dev`等同于执行`webpack-dev-server --inline --progress --config build/webpack.dev.conf.js`， 即启动程序

**dependencies**
应用依赖，或者叫做业务依赖，这是我们最常用的依赖包管理对象！它用于指定应用依赖的外部包，这些依赖是应用发布后正常执行时所需要的，但不包含测试时或者本地打包时所使用的包。可使用下面的命令来安装：
```shell
npm install packageName --save
```
dependencies是一个简单的JSON对象，包含包名与包版本，其中包版本可以是版本号或者URL地址。比如：
```json
{ 
  "dependencies" :{ 
    "foo" : "1.0.0 - 2.9999.9999", // 指定版本范围
    "bar" : ">=1.0.2 <2.1.2", 
    "baz" : ">1.0.2 <=2.3.4", 
    "boo" : "2.0.1", // 指定版本
    "qux" : "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0", 
    "asd" : "http://asdf.com/asdf.tar.gz", // 指定包地址
    "til" : "~1.2",  // 最近可用版本
    "elf" : "~1.2.3", 
    "elf" : "^1.2.3", // 兼容版本
    "two" : "2.x", // 2.1、2.2、...、2.9皆可用
    "thr" : "*",  // 任意版本
    "thr2": "", // 任意版本
    "lat" : "latest", // 当前最新
    "dyl" : "file:../dyl", // 本地地址
    "xyz" : "git+ssh://git@github.com:npm/npm.git#v1.0.27", // git 地址
    "fir" : "git+ssh://git@github.com:npm/npm#semver:^5.0",
    "wdy" : "git+https://isaacs@github.com/npm/npm.git",
    "xxy" : "git://github.com/npm/npm.git#v1.0.27",
  }
}
```
指定版本：比如1.2.2，版本的命名一般都遵循`大(主)版本.次(子)版本.小版本`的格式规定，安装时只安装指定版本。
- 波浪号（tilde）+指定版本：比如~1.2.2，表示安装1.2.x的最新版本（不低于1.2.2），但是不安装1.3.x，也就是说安装时不改变大版本号和次要版本号。
- 插入号（caret）+指定版本：比如ˆ1.2.2，表示安装1.x.x的最新版本（不低于1.2.2），但是不安装2.x.x，也就是说安装时不改变大版本号。需要注意的是，如果大版本号为0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。

**devDependencies**
开发环境依赖，仅次于dependencies的使用频率！它的对象定义和dependencies一样，只不过它里面的包只用于开发环境，不用于生产环境，这些包通常是单元测试或者打包工具等，例如gulp, grunt, webpack, moca, coffee等，可使用以下命令来安装：
```
npm install packageName --save-dev
```
举个栗子：
```json
{ "name": "ethopia-waza",
  "description": "a delightfully fruity coffee varietal",
  "version": "1.2.3",
  "devDependencies": {
    "coffee-script": "~1.6.3"
  },
  "scripts": {
    "prepare": "coffee -o lib/ -c src/waza.coffee"
  },
  "main": "lib/waza.js"
}
```

**peerDependencies**
同等依赖，或者叫同伴依赖，用于指定当前包（也就是你写的包）兼容的宿主版本。如何理解呢？ 试想一下，我们编写一个gulp的插件，而gulp却有多个主版本，我们只想兼容最新的版本，此时就可以用同等依赖（peerDependencies）来指定：
```json
{
  "name": "gulp-my-plugin",
  "version": "0.0.1",
  "peerDependencies": {
    "gulp": "3.x"
  }
}
```
当别人使用我们的插件时，peerDependencies就会告诉明确告诉使用方，你需要安装该插件哪个宿主版本。
通常情况下，我们会在一个项目里使用一个宿主（比如gulp）的很多插件，如果相互之间存在宿主不兼容，在执行npm install时，cli会抛出错误信息来告诉我们，比如：
```
npm ERR! peerinvalid The package gulp does not satisfy its siblings' peerDependencies requirements!
npm ERR! peerinvalid Peer gulp-cli-config@0.1.3 wants gulp@~3.1.9
npm ERR! peerinvalid Peer gulp-cli-users@0.1.4 wants gulp@~2.3.0
```
运行命令`npm install gulp-my-plugin --save-dev`来安装我们插件，我们来看下依赖图谱：
```
├── gulp-my-plugin@0.0.1
└── gulp@3.9.1
```
> 注意，npm 1 与 npm 2 会自动安装同等依赖，npm 3 不再自动安装，会产生警告！手动在package.json文件中添加依赖项可以解决。

**optionalDependencies**
可选依赖，如果有一些依赖包即使安装失败，项目仍然能够运行或者希望npm继续运行，就可以使用optionalDependencies中声明的依赖。另外optionalDependencies会覆盖dependencies中的同名依赖包，所以不要在两个地方都写。

**bundledDependencies**
打包依赖，bundledDependencies是一个包含依赖包名的数组对象，在发布时会将这个对象中的包打包到最终的发布包里。如：
```json
{
  "name": "fe-weekly",
  "description": "ELSE 周刊",
  "version": "1.0.0",
  "main": "index.js",
  "devDependencies": {
    "fw2": "^0.3.2",
    "grunt": "^1.0.1",
    "webpack": "^3.6.0"
  },
  "dependencies": {
    "gulp": "^3.9.1",
    "hello-else": "^1.0.0"
  },
  "bundledDependencies": [
    "fw2",
    "hello-else"
  ]
}
```
执行打包命令npm pack, 在生成的fe-weekly-1.0.0.tgz包中，将包含fw2和hello-else。 但是值得注意的是，这两个包必须先在devDependencies或dependencies声明过，否则打包会报错。

**description**
字符串。用来描述当前项目的大致功能。

**name**
此项目包的名称。在不确定自己的包名能否使用之前，请先npm registry 一下，看看当前你喜欢的包名是否已经被占用。

**version**
当前项目包的版本号。每一次项目改动时，在即将发布时，都要同步的去更改项目的版本号。一般格式为：x.y.z。意思是：大版本.中版本.小版本

**keywords**
放简介，字符串。方便屌丝们在 npm search中搜索

**homepage**
项目官网的url

**bugs**
你项目的提交问题的url和（或）邮件地址。这对遇到问题的屌丝很有帮助。
```json
{ "url" : "http://github.com/owner/project/issues" , "email" : "project@hostname.com" }
```
你可以指定一个或者指定两个。如果你只想提供一个url，那就不用对象了，字符串就行。如果提供了url，它会被npm bugs命令使用。

**license**
你应该要指定一个许可证，让人知道使用的权利和限制的。最简单的方法是，假如你用一个像BSD或者MIT这样通用的许可证，就只需要指定一个许可证的名字，像这样：
```json
{ "license" : "BSD" }
```

**author**
项目作者。可以指定name，email，url字段信息。也可以单独使用字符串来表示。
```json
{“ author ”: { "name" : "Barney Rubble" , "email" : "b@rubble.com" , "url" : "http://barnyrubble.tumblr.com/" } }
```

**contributors**
项目相关贡献者。是数组。用于罗列对应的贡献人。可以是单独的字符串，也可以分别指定name,email,url等属性。
```json
{"contributors ":[ { "name" : "Barney Rubble" , "email" : "b@rubble.com" , "url" : "http://barnyrubble.tumblr.com/" } ]}
```

**files**
package.json中的files字段，这个字段中的文件默认会加入到npm publish发布的包中，它的优先级高于.npmignore和.gitignore，这个才是使用最广的方法，好像很多开源项目用的都是files字段

`.npmignore`文件与`.gitignore`文件中的文件不会被发布,如果两个文件同时存在,`.npmignore`的优先级更好
```json
{ "files": [ "bin/", "templates/", "test/" ]}
```

**main**
main字段是一个模块ID，它是一个指向你程序的主要项目。就是说，如果你包的名字叫foo，然后用户安装它，然后require("foo")，然后你的main模块的exports对象会被返回。这应该是一个相对于根目录的模块ID。对于大多数模块，它是非常有意义的，其他的都没啥。
```json
{ "main": "bin/index.js"}
```

**bin**
很多包都有一个或多个可执行的文件希望被放到PATH中。（实际上，就是这个功能让npm可执行的）。要用这个功能，给package.json中的bin字段一个命令名到文件位置的map。初始化的时候npm会将他链接到prefix/bin（全局初始化）或者./node_modules/.bin/（本地初始化）。
```json
{ "bin" : { "npm" : "./cli.js" } }
```
当你初始化npm，它会创建一个符号链接到cli.js脚本到/usr/local/bin/npm。如果你只有一个可执行文件，并且名字和包名一样。那么你可以只用一个字符串，比如
```json
{ "name": "my-program" , "version": "1.2.5" , "bin": "./path/to/program" }
// 等价于
{ "name": "my-program" , "version": "1.2.5" , "bin" : { "my-program" : "./path/to/program" } }
```

**config字段**
config字段用于向环境变量输出值。
```json
{
  "name" : "foo",
  "config" : { "port" : "8080" },
  "scripts" : { "start" : "node server.js" }
}
```

**man**
指定一个单一的文件或者一个文件数组供man程序使用。如果只提供一个单一的文件，那么它初始化后就是man 的结果，而不管实际的文件名是神马，比如：
```json
{ "name" : "foo" , "version" : "1.2.3" , "description" : "A packaged foo fooer for fooing foos" , "main" : "foo.js" , "man" : "./man/doc.1" }
```
这样man foo就可以用到./man/doc.1文件了。
如果文件名不是以包名开头，那么它会被冠以前缀，下面的：
```json
{ "name" : "foo" , "version" : "1.2.3" , "description" : "A packaged foo fooer for fooing foos" , "main" : "foo.js" , "man" : [ "./man/foo.1", "./man/bar.1" ] }
```
会为man foo和man foo-bar创建文件。
man文件需要以数字结束，然后可选地压缩后以.gz为后缀。
```json
{ "name" : "foo" , "version" : "1.2.3" , "description" : "A packaged foo fooer for fooing foos" , "main" : "foo.js" , "man" : [ "./man/foo.1", "./man/foo.2" ] }
```
会为man foo和man 2 foo创建。

**repository**
指定你的代码存放的地方。这个对希望贡献的人有帮助。如果git仓库在github上，那么npm docs命令能找到你。

**engines**
指定项目工作的环境。除非用户设置engine-strict标记，这个字段只是建议值。
```json
{ "engines" : { "node" : ">=0.10.3 <0.12", "npm" : "~1.0.20" } }
```

**engineStrict**
如果你确定你的模块一定不会运行在你指定版本之外的node或者npm上，你可以在package.json文件中设置"engineStrict":true。它会重写用户的engine-strict设置。除非你非常非常确定，否则不要这样做。如果你的engines hash过度地限制，很可能轻易让自己陷入窘境。慎重地考虑这个选择。如果大家滥用它，它会再以后的npm版本中被删除。

**os**
可以指定你的模块要运行在哪些操作系统中
```json
"os" : [ "darwin", "linux" ]
```
你也可以用黑名单代替白名单，在名字前面加上“!”就可以了：
```json
"os" : [ "!win32" ]
```
操作系统用process.platform来探测。虽然没有很好地理由，但它是同时支持黑名单和白名单的。

**cpu**
如果你的代码只能运行在特定的cpu架构下，你可以指定一个
```json
"cpu" : [ "x64", "ia32" ]
```
就像os选项，你也可以黑一个架构：
```sjon
"cpu" : [ "!arm", "!mips" ]
```
cpu架构用process.arch探测。

**style字段**
style指定供浏览器使用时，样式文件所在的位置。样式文件打包工具parcelify，通过它知道样式文件的打包位置。
```json
"style": [
  "./node_modules/tipso/src/tipso.css"
]
```

**preferGlobal**
如果包主要是需要全局安装的命令行程序，就设置它为true来提供一个warning给只在局部安装的人。它不会真正的防止用户在局部安装，但如果它没有按预期工作它会帮助防止产生误会。
```json
{" preferGlobal ":true}
```

**private**
如果你设置"private": true，npm就不会发布它。
这是一个防止意外发布私有库的方式。如果你要确定给定的包是只发布在特定registry（如内部registry）的，用publishConfighash的描述来重写registry的publish-time配置参数。

# node不支持import语法
node编程中最重要的思想之一就是模块，而正是这个思想，让JavaScript的大规模工程成为可能。模块化编程在js界流行，也是基于此，随后在浏览器端，requirejs和seajs之类的工具包也出现了，可以说在对应规范下，require统治了ES6之前的所有模块化编程，即使现在，在ES6 module被完全实现之前，还是这样。ES6标准发布后，module成为标准，标准的使用是以export指令导出接口，以import引入模块。但因为一些历史原因，虽然Node.js已经实现了99%的ES6新特性，采用的却是CommonJS规范，使用require引入模块，使用module.exports导出接口。

nodejs采用的是CommonJS的模块化规范，使用require引入模块；而import是ES6的模块化规范关键字。想要使用import，必须引入babel转义支持，通过babel进行编译，使其变成node的模块化代码。

**在node中使用import/export的方法：**
想要使用import，必须引入babel转义支持，通过babel进行编译，使其变成node的模块化代码。
我们可以在命令行中使用 babel-node 命令来进行编译，babel-node 命令不是独立安装，在 Babel 7.X 版本前，需要通过安装 babel-cli 包获得；
安装必要的插件
```
# 全局安装 babel-cli
npm install babel-cli -g

# 安装 babel-preset-env
npm install babel-preset-env -D
```
然后原来是`node server.js`, 改为这样调用`babel-node --presets env server.js`

# npm常见命令
**npm init**
npm init 用来初始化生成一个新的 package.json 文件。它会向用户提问一系列问题，如果你觉得不用修改默认配置，一路回车就可以了。
如果使用了 -f（代表force）、-y（代表yes），则跳过提问阶段，直接生成一个新的 package.json 文件。
```shell
$ npm init -y
```

**npm set**
npm set 用来设置环境变量
```shell
$ npm set init-author-name 'Your name'
$ npm set init-author-email 'Your email'
$ npm set init-author-url 'http://yourdomain.com'
$ npm set init-license 'MIT'
```
上面命令等于为 npm init 设置了默认值，以后执行 npm init 的时候，package.json 的作者姓名、邮件、主页、许可证字段就会自动写入预设的值。这些信息会存放在用户主目录的 ~/.npmrc文件，使得用户不用每个项目都输入。如果某个项目有不同的设置，可以针对该项目运行 npm config。

**npm info**
npm info 命令可以查看每个模块的具体信息。比如，查看 underscore 模块的信息。
```shell
$ npm info underscore
```
上面命令返回一个 JavaScript 对象，包含了 underscore 模块的详细信息。这个对象的每个成员，都可以直接从 info 命令查询。
```shell
$ npm info underscore description
$ npm info underscore homepage
$ npm info underscore version
```

**npm search**
npm search 命令用于搜索 npm 仓库，它后面可以跟字符串，也可以跟正则表达式。
```shell
$ npm search <搜索词>
```

**npm list**
npm list 命令以树形结构列出当前项目安装的所有模块，以及它们依赖的模块。
```shell
$ npm list

#  查看[全局]安装的包
npm list --depth=0 [-g] 

# npm list 命令也可以列出单个模块
$ npm list underscore
```

**npm root**
```shell
# 查看[全局的]包的安装路径
npm root [-g] 
```

**安装不同版本**
install 命令总是安装模块的最新版本，如果要安装模块的特定版本，可以在模块名后面加上 @ 和版本号。
```shell
$ npm install sax@latest
$ npm install sax@0.1.1
$ npm install sax@">=0.1.0 <0.2.0"
```
install 命令可以使用不同参数，指定所安装的模块属于哪一种性质的依赖关系，即出现在 packages.json 文件的哪一项中。

**npm run**
npm 不仅可以用于模块管理，还可以用于执行脚本。package.json 文件有一个 scripts 字段，可以用于指定脚本命令，供 npm 直接调用。
- `npm run`如果不加任何参数，直接运行，会列出 package.json 里面所有可以执行的脚本命令。
- npm 内置了两个命令简写，`npm test`等同于执行`npm run test`，`npm start`等同于执行`npm run start`

**pre- 和 post- 脚本**
`npm run`为每条命令提供了`pre-`和`post-`两个钩子（hook）。以`npm run lint`为例，执行这条命令之前，npm 会先查看有没有定义`prelint`和`postlint`两个钩子，如果有的话，就会先执行`npm run prelint`,然后执行`npm run lint`,最后执行`npm run postlint`.
```json
{
  "name": "myproject",
  "devDependencies": {
    "eslint": "latest"
    "karma": "latest"
  },
  "scripts": {
    "lint": "eslint --cache --ext .js --ext .jsx src",
    "test": "karma start --log-leve=error karma.config.js --single-run=true",
    "pretest": "npm run lint",
    "posttest": "echo 'Finished running tests'"
  }
}
```
上面代码是一个 package.json 文件的例子。如果执行`npm test`,会按pretest->test->posttest下面的顺序执行相应的命令。
如果执行过程出错，就不会执行排在后面的脚本，即如果 prelint 脚本执行出错，就不会接着执行 lint 和 postlint 脚本。

**npm bin**
npm bin 命令显示相对于当前目录的，Node 模块的可执行脚本所在的目录（即 .bin 目录）。
```shell
# 项目根目录下执行
$ npm bin
./node_modules/.bin
```

**创建全局链接**
npm 提供了一个有趣的命令 npm link，它的功能是在本地包和全局包之间创建符号链接。我们说过使用全局模式安装的包不能直接通过 require 使用。但通过 npm link 命令可以打破这一限制。举个例子，我们已经通过`npm install -g express`安装了`express`，这时在工程的目录下运行命令：
```shell
npm link express ./node_modules/express -> /user/local/lib/node_modules/express
```
我们可以在 node_modules 子目录中发现一个指向安装到全局的包的符号链接。通过这种方法，我们就可以把全局包当做本地包来使用了。
除了将全局的包链接到本地以外，使用 npm link 命令还可以将本地的包链接到全局。使用方法是在包目录（package.json 所在目录）中运行 npm link 命令。如果我们要开发一个包，利用这种方法可以非常方便地在不同的工程间进行测试。

**包的发布, npm adduser, npm whoami, npm publish, npm unpublish**
通过使用 npm init 可以根据交互式回答产生一个符合标准的 package.json。创建一个 index.js 作为包的接口,一个简单的包就制作完成了。
在发布前,我们还需要获得一个账号用于今后维护自己的包,使用`npm adduser`根据提示完成账号的创建。
完成后可以使用`npm whoami`检测是否已经取得了账号。
接下来，在 package.json 所在目录下运行`npm publish`,稍等片刻就可以完成发布了，打开浏览器，访问 http://search.npmjs.org/ 就可以找到自己刚刚发布的包了。现在我们可以在世界的任意一台计算机上使用`npm install neveryumodule`命令来安装它。

如果你的包将来有更新,只需要在 package.json 文件中修改 version 字段，然后重新使用`npm publish`命令就行了。
如果你对已发布的包不满意，可以使用`npm unpublish`命令来取消发布。

# 编写和发布NPM软件包
首先要登陆npm官网，创建一个npm账号

## 本地创建js模块
然后在本地创建一个需要打包成npm软件的js模块：

```shell
mkdir shadowizard && cd shadowizard
```

在该文件夹下创建如下index.js与README.md2个文件：

index.js:

```js
function shadowizard(options) {
  let images = document.querySelectorAll('.shadowizard');

  if (options.shadow_type === 'hard') {
    options.shadow_type = 'opx';
  } else {
    options.shadow_type = '15px';
  }

  images.forEach(image => {
    image.style.boxShadow = `10px 10px ${options.shadow_type} 1px rgba(0, 0, 0, 0.12)`;

    if (options.padding) {
      image.style.padding = "1em";
    }
  })
}

module.exports.shadowizard = shadowizard
```

README.md:

```md
# What is this?

Get prefect shadows every time for the non-designer.

# Installation

`npm i shadowizard --save`

Then ...

``
import {shadowizard} from 'shadowizard';

shadowizard({
  shadow_type: 'soft',
  padding: false
})
``

## Options

Shadowizard supports 2 options, both of which are optional:

* *shadow_type* - _hard | soft_ (Defaults to soft)
* *padding* - _boolean_ (Defaults to false)

```

然后创建一个github远程仓库，将该文件夹同步到github上

```bash
git init
git add .
git commit -m "first commit"
git remote add origin git@github.com:NaisWang/shadowizard.git
git push -u origin master
```

## 发布到npm

需要使用`npm init`来初始化js模块文件夹

```bash
npm init
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220106135422.png)

然后使用`npm publish`来发布该js模块到npm上，注意，在发布前，需要使用`npm login`来登陆用户，否则会报错，如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220106120008.png)

登陆用户

![](https://raw.githubusercontent.com/NaisWang/images/master/20220106140322.png)

可以使用`npm whoami`命令来查看当前登陆用户：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220106140418.png)


然后发布即可

![](https://raw.githubusercontent.com/NaisWang/images/master/20220106135646.png)


你随后在npm官网就可以看到这个包了

![](https://raw.githubusercontent.com/NaisWang/images/master/20220106135709.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220106135748.png)

## 使用刚刚上传的npm包
使用`npm i @hzwang/shadowizard --save`来下载

下载到目录如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220106140103.png)
