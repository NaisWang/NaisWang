# webpack简介
webpack 是前端的一个项目构建工具，它是基于 Node.js 开发出来的一个前端工具；
借助于webpack这个前端自动化构建工具，可以完美实现资源的合并、打包、压缩、混淆等诸多功能。
根据官网的图片介绍webpack打包的过程
- [webpack官网](http://webpack.github.io/)

# webpack安装的两种方式
1. 运行`npm i webpack -g`全局安装webpack，这样就能在全局使用webpack的命令
2. 在项目根目录中运行`npm i webpack --save-dev`安装到项目依赖中

# 初步使用webpack打包构建列表隔行变色案例
1. 运行`npm init`初始化项目，使用npm管理项目中的依赖包
2. 创建项目基本的目录结构
3. 使用`cnpm i jquery --save`安装jquery类库
4. 创建`main.js`并书写各行变色的代码逻辑：

```js
// 导入jquery类库
import $ from 'jquery'

// 设置偶数行背景色，索引从0开始，0是偶数
$('#list li:even').css('backgroundColor','lightblue');
// 设置奇数行背景色
$('#list li:odd').css('backgroundColor','pink');
```

5. 直接在页面上引用`main.js`会报错，因为浏览器不认识`import`这种高级的JS语法，需要使用webpack进行处理，webpack默认会把这种高级的语法转换为低级的浏览器能识别的语法；
6. 运行`webpack 入口文件路径 输出文件路径`对`main.js`进行处理：
```shell
webpack src/js/main.js dist/bundle.js
```

# 使用webpack的配置文件简化打包时候的命令
1. 在项目根目录中创建`webpack.config.js`
2. 由于运行webpack命令的时候，webpack需要指定入口文件和输出文件的路径，所以，我们需要在`webpack.config.js`中配置这两个路径：
```js
// 导入处理路径的模块
var path = require('path');

// 导出一个配置对象，将来webpack在启动的时候，会默认来查找webpack.config.js，并读取这个文件中导出的配置对象，来进行打包处理
module.exports = {
    entry: path.resolve(__dirname, 'src/js/main.js'), // 项目入口文件
    output: { // 配置输出选项
        path: path.resolve(__dirname, 'dist'), // 配置输出的路径
        filename: 'bundle.js' // 配置输出的文件名
    }
}
```
然后我们直接输入`webpack`命令，webpack会做一下几步
- 首先webpack发现，我们并没有通过命令的形式，给它指定入口和出口
- webpack就会去项目的根目录中，查找一个叫做`webpack.config.js`的配置文件
- 当找到配置文件后，webpack会去解析这个配置文件，当解析执行配置文件完成后，就会得到配置文件中的配置对象
- 当webpack拿到配置对象后，就拿到了配置对象中的指定的入口和出口，然后进行打包构建


# 实现webpack的实时打包构建
由于每次重新修改代码之后，都需要手动运行webpack打包的命令，比较麻烦，所以使用`webpack-dev-server`工具来实现代码实时打包编译，当修改代码之后，会自动进行打包构建。
- 运行`cnpm i webpack-dev-server --save-dev`安装到开发依赖
- 安装完成之后，在命令行直接运行`webpack-dev-server`来进行打包，发现报错，此时需要借助于`package.json`文件中的指令来进行运行`webpack-dev-server`命令，在`package.json`文件中的`scripts`节点下新增`"dev": "webpack-dev-server"`指令，然后在命令行直接运行`npm run dev`,发现可以进行实时打包，但是dist目录下并没有生成`bundle.js`文件，这是因为`webpack-dev-server`将打包好的文件放在了内存中
- 把`bundle.js`放在内存中的好处是：由于需要实时打包编译，所以放在内存中速度会非常快
- 这个时候访问webpack-dev-server启动的`http://localhost:8080/`网站，发现是一个文件夹的面板，需要点击到src目录下，才能打开我们的index首页，此时引用不到bundle.js文件，需要修改index.html中script的src属性为:`<script src="../bundle.js"></script>`
- 为了能在访问`http://localhost:8080/`的时候直接访问到index首页，可以使用`--contentBase src`指令来修改dev指令，指定启动的根目录：
```
 "dev": "webpack-dev-server --contentBase src"
```
同时修改index页面中script的src属性为`<script src="bundle.js"></script>`

> <font color="red">注意</font>：对于webpack-cli版本为3.x的是使用webpack-dev-server命令，但版本为4.x时，该命令替换成了webpack serve。如果在4.x版本中使用webpack-dev-server命令，则会报如下错误：
```
Cannot find module 'webpack/bin/config-yargs'
```

# webpack-dev-server实现自动打开浏览器、热更新和配置浏览器的默认端口号
**方式1：（推荐）**
- 修改`package.json`的script节点如下，其中`--open`表示自动打开浏览器，`--port 4321`表示打开的端口号为4321，`--hot`表示启用浏览器热更新，
```json
"dev": "webpack-dev-server --hot --port 4321 --open --contentBase src"
```
**方式2（不推荐使用）：**
将`package.json文件设置中的script节点设置如下`
```json
"dev": "webpack-dev-server"
```
修改`webpack.config.js`文件
```js
var path = require('path');

var webpack = require('webpack');//启动热更新第一步：在头部引入`webpack`模块：
module.exports = {
    entry: path.resolve(__dirname, 'src/js/main.js'),
    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename: 'bundle.js' 
    },
    devServer:{
        hot:true, //启动热更新第二步：
        open:true,
        port:4321,
        contentBase:'src'
    },
    plugins:[ 
        new webpack.HotModuleReplacementPlugin() //启动热更新第三步：
    ]
}
```

# 使用html-webpack-plugin插件配置启动页面
由于使用`--contentBase`指令的过程比较繁琐，需要指定启动的目录，同时还需要修改index.html中script标签的src属性，而使用`html-webpack-plugin`插件配置启动页面后.<font color="red">这个插件会在内存中生成一个html页面，并且还在此html中自动加上script标签，其src自动指向了bundles.js</font>, 所以启用这个插件后，我们可以在启动页index.html中不加上引入bundles.js的script标签
1. 运行`cnpm i html-webpack-plugin --save-dev`安装到开发依赖
2. 修改`webpack.config.js`配置文件如下：
```js
// 导入处理路径的模块
var path = require('path');

// 导入自动生成HTMl文件的插件
var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/js/main.js'), // 项目入口文件
  output: { // 配置输出选项
      path: path.resolve(__dirname, 'dist'), // 配置输出的路径
      filename: 'bundle.js' // 配置输出的文件名
  },
  plugins:[ // 添加plugins节点配置插件
      new htmlWebpackPlugin({
          template:path.resolve(__dirname, 'src/index.html'),//指定模板页面，将来会根据此模板页面在内存中生成启动页
          filename:'index.html'//自动生成的启动页的名称
      })
  ]
}
```
3. 修改`package.json`中`script`节点中的dev指令如下：
要想使用html-webpack-plugin的前提是有webpack-dev-server
```
"dev": "webpack-dev-server"
```
4. <font color="red">将index.html中script标签注释掉，因为`html-webpack-plugin`插件会自动把bundle.js注入到index.html页面中！</font>


# webpack处理文件
<font color="red">webpack打包编译一个文件时要做的事情</font>
当webpack打包编译一个文件时,此时webpack会到`webpack.config.js`文件中找到rules的属性，来获取此文件类型的匹配和处理规则，来调用对应的loader处理。当后一个loader调用完毕后，会把处理的结果直接交给webpack进行打包合并，最终输出到bundle.js中

es6 的import只支持js，但可以通过webpack的打包处理文件的特性使import支持导入样式文件

## 使用webpack打包css文  件
1. 运行`cnpm i style-loader css-loader --save-dev`
2. 在`webpack.config.js`的module属性中添加rules属性
```json
module: { // 用来配置第三方loader模块的
  rules: [ // rules属性是一个数组，存放了所有的非js文件类型的匹配和处理规则
    //`use`表示使用哪些模块来处理`test`所匹配到的文件；`use`中相关loader模块的调用顺序是从后向前调用的；及css-loader先处理再style-loader处理
    { test: /\.css$/, use: ['style-loader', 'css-loader'] }//处理css文件的规则,这个顺序不能变，
  ]
}
```

## 使用webpack打包less文件
1. 运行`cnpm i less-loader less -D`
2. 修改`webpack.config.js`这个配置文件：
```
{ test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
```

## 使用webpack打包sass文件
1. 运行`cnpm i sass-loader node-sass --save-dev`
2. 在`webpack.config.js`中添加处理sass文件的loader模块：
```
{ test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }
```

## 使用webpack处理css中的路径
默认情况下，webpack是无法处理css文件中的url地址，不管是字体库还是图片的url，只要是url地址，就处理不了
**解决方法：**
1. 运行`cnpm i url-loader file-loader --save-dev`
2. 在`webpack.config.js`中添加处理url路径的loader模块：
```
{ test: /\.(png|jpg|gif|bmp?jpeg)$/, use: 'url-loader' }
{ test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' }
```
3. 可以通过`limit`指定进行base64编码的图片大小；只有小于指定字节（byte）的图片才会进行base64编码：
```
{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=43960' },
```

## 使用postCSS来解决css兼容性问题
由于css兼容性问题， 同一个css语句在chrome能用，但是在IE上就可能用不了。 
为了解决这个问题，我们可以使用postCSS
postCSS可以帮我们完成css兼容性问题， 有关postCSS的使用如下：
1. 使用`npm i postcss-loader autoprefixer -D`命令来安装相关插件
2. 在项目根目录中创建postcss的配置文件`postcss.config.js`, 并初始化如下配置：
```
const autoprefixer = require('autoprefixer') // 导入自动添加前缀的插件
module.exports = {
 plugins: [autoprefixer] // 挂载插件
}
```
3. 在webpack.config.js的`module->rules`数组中， 修改css的loader规则如下：
```
rules:[
    { test: /\.css$/, use: ['style-loader', 'css-loader','postcss-loader'] }
]
```

## 使用babel处理高级JS语法
1. 运行`cnpm i babel-core babel-loader babel-plugin-transform-runtime --save-dev`安装babel的相关loader包
2. 运行`cnpm i babel-preset-es2015 babel-preset-stage-0 --save-dev`安装babel转换的语法
3. 在`webpack.config.js`中添加相关loader模块，其中需要注意的是，一定要把`node_modules`文件夹添加到排除项：
```
{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
```
4. 在项目根目录中添加`.babelrc`文件，并修改这个配置文件如下：
```
{
    "presets":["es2015", "stage-0"],
    "plugins":["transform-runtime"]
}
```
5. **注意：语法插件`babel-preset-es2015`可以更新为`babel-preset-env`，它包含了所有的ES相关的语法；**

# '@/'路径
@/ 是webpack设置的路径别名，代表什么路径，要看webpack的build文件夹下webpack.base.conf.js里面对于@是如何配置
```conf
resolve: {
    // 路径别名
    alias: {
      'public': path.resolve(__dirname, '../public'),
      'vue': 'vue/dist/vue.js',
      '@': path.resolve('src'),
    }
  },
```
上述例子 @/ 代表着到src这个文件夹的路径。