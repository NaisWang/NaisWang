# Vue简介
+ Vue.js 是目前最火的一个前端框架，React是最流行的一个前端框架（React除了开发网站，还可以开发手机App， Vue语法也是可以用于进行手机App开发的，需要借助于Weex）
+ Vue.js 是前端的**主流框架之一**，和Angular.js、React.js 一起，并成为前端三大主流框架！
+ Vue.js 是一套构建用户界面的框架，**只关注视图层**，它不仅易于上手，还便于与第三方库或既有项目整合。（Vue有配套的第三方类库，可以整合起来做大型项目的开发）
+ 前端的主要工作？主要负责MVC中的V这一层；主要工作就是和界面打交道，来制作前端页面效果；
## 为什么要学习流行框架
 + 企业为了提高开发效率：在企业中，时间就是效率，效率就是金钱；
  - 企业中，使用框架，能够提高开发的效率；
 + 提高开发效率的发展历程：原生JS -> Jquery之类的类库 -> 前端模板引擎 -> Angular.js / Vue.js（能够帮助我们减少不必要的DOM操作；提高渲染效率；双向数据绑定的概念【通过框架提供的指令，我们前端程序员只需要关心数据的业务逻辑，不再关心DOM是如何渲染的了】）
 + 在Vue中，一个核心的概念，就是让用户不再操作DOM元素，解放了用户的双手，让程序员可以更多的时间去关注业务逻辑；
 + 增强自己就业时候的竞争力
  - 人无我有，人有我优
  - 你平时不忙的时候，都在干嘛？
## 框架和库的区别
 + 框架：是一套完整的解决方案；对项目的侵入性较大，项目如果需要更换框架，则需要重新架构整个项目。
  - node 中的 express；
 + 库（插件）：提供某一个小功能，对项目的侵入性较小，如果某个库无法完成某些需求，可以很容易切换到其它库实现需求。
  - 1. 从Jquery 切换到 Zepto
  - 2. 从 EJS 切换到 art-template
## MVVM
MVVM是前端视图层的概念，主要关注于 视图层分离，也就是说：MVVM把前端的视图层，分为了 三部分 Model, View , VM ViewModel
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <!-- 1. 导入Vue的包 -->
  <script src="./lib/vue-2.4.0.js"></script>
</head>
<body>
  <!-- 将来 new 的Vue实例，会控制这个 元素中的所有内容 -->
  <!-- Vue 实例所控制的这个元素区域，就是我们的 V  -->
  <div id="app">
    <p>{{ msg }}</p>
  </div>
  <script>
    // 2. 创建一个Vue的实例， 得到 ViewModel
    // 当我们导入包之后，在浏览器的内存中，就多了一个 Vue 构造函数
    //  注意：我们 new 出来的这个 vm 对象，就是我们 MVVM中的 VM调度者
    var vm = new Vue({
      el: '#app',  // 表示，当前我们 new 的这个 Vue 实例，要控制页面上的哪个区域
      // 这里的 data 就是 MVVM中的 M，专门用来保存 每个页面的数据的
      data: { // data 属性中，存放的是 el 中要用到的数据
        msg: '欢迎学习Vue' // 通过 Vue 提供的指令，很方便的就能把数据渲染到页面上，程序员不再手动操作DOM元素了【前端的Vue之类的框架，不提倡我们去手动操作DOM元素了】
      }
    })
  </script>
</body>
</html>
```

<img src="https://gitee.com/NaisWang/images/raw/master/img/20210327161205.png" width="700px"/>

## 插值表达式、v-cloak、v-text、v-html
问题：
解决插值表达式时， 出现闪烁问题，即当vue.js未加载完成时，插值表达式不会替换， 而是等到vue.js加载完成时才会替换 如下：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191220174441.gif"/>
解决方法：
1. 使用v-cloak, 当我们给一个标签添加v-cloak属性时， 在vue.js加载完成之后， vue.js会删除这个v-cloak属性， 所以我们可以使用如下方法来解决插值表达式闪烁问题
```html
<style>
[v-cloak] {  /* 对含有v-cloak属性的标签进行样式修改*/
  display: none; /*让其含有v-cloak属性的元素进行隐藏， 当vue.js加载完成后， v-cloak属性会消失， 从而又能显示*/
}
</style>
<p v-cloak>++++++++ {{ msg }} ----------</p>
```

2. 使用v-text或v-html属性， 也可以解决插值表示闪烁问题
```html
<h4 v-text="msg">==================</h4>
<div v-html="msg2">1212112</div> /*将msg2当作html来解析*/
```
但是v-text与v-html都会覆盖元素中原本的内容

## v-bind
v-bind: 是 Vue中，提供的用于绑定属性的指令
1. 直接使用指令: `v-bind`
2. 使用简化指令: `:`
3. 在绑定的时候，拼接绑定内容：`:title="btnTitle + ', 这是追加的内容'"`
例子：
```html
<input type="button" value="按钮" v-bind:title="mytitle + '123'"> /*即title属性中没有用单引号括起来的字符串都是vue中的data中的变量*/

<script>
var vm = new Vue({
  el: '#app',
  data: {
    mytitle: '这是一个自己定义的title'
  }
})
</script>
```

## Vue指令之v-on和跑马灯效果
v-on是用来绑定事件的， v-on的属性值只能是在vue中methods中自定的方法名
v-on的缩写： `@`
跑马灯效果
1. HTML结构：
```html
<div id="app">
    <p>{{info}}</p>
    <input type="button" value="开启" v-on:click="go">
    <input type="button" value="停止" v-on:click="stop">
</div>
```
2. Vue实例：
```js
// 创建 Vue 实例，得到 ViewModel
var vm = new Vue({
  el: '#app',
  data: {
    info: '猥琐发育，别浪~！',
	//在data上定义定时器Id
    intervalId: null
  },
  methods: {
    go() {
      // 如果当前有定时器在运行，则直接return
      if (this.intervalId != null) {
        return;
      }
      // 开始定时器
      this.intervalId = setInterval(() => {//箭头函数，使得函数里面的this和函数外面的this保持一致
        this.info = this.info.substring(1) + this.info.substring(0, 1);
      }, 500);
    },
	//注意：VM示例，会监听自己的data属性，如果某个属性发生变化，那么会自动的将这些数据同步到页面上去【好处：程序员只需要关系数据，而不需要考虑如何使用DOM来渲染页面】
    stop() {
      clearInterval(this.intervalId);
      //每次清除定时器ID后，都需要将定时器Id置为null
      this.intervalId = null;
    }
  }
});
```

## 事件修饰符
- .stop 阻止冒泡
- .prevent 阻止默认事件
- .capture 添加事件侦听器时使用事件捕获模式
- .self 只当事件在该元素本身（比如不是子元素）触发时触发回调
- .once 事件只触发一次
.stop与self的区别： .self 只会阻止自己身上冒泡行为的触发，并不会真正阻止 冒泡的行为 

用法:
```html
    <!-- 使用  .stop  阻止冒泡， 此时点击input时， 由于不会冒泡， 所以不会触发div的click事件 -->
    <div class="inner" @click="div1Handler">
      <input type="button" value="戳他" @click.stop="btnHandler">
    </div>

    <!-- 使用 .prevent 阻止默认行为 -->
    <a href="http://www.baidu.com" @click.prevent="linkClick">有问题，先去百度</a>

    <!-- 使用  .capture 实现捕获触发事件的机制， 即点击input时， 先执行div的点击事件，在执行input的点击事件 -->
    <div class="inner" @click.capture="div1Handler">
      <input type="button" value="戳他" @click="btnHandler">
    </div>

    <!-- 使用 .self 实现只有点击当前元素时候，才会触发事件处理函数 -->
    <div class="inner" @click="div1Handler">
      <input type="button" value="戳他" @click="btnHandler">
    </div>

    <!-- 使用 .once 只触发一次事件处理函数 -->
    <a href="http://www.baidu.com" @click.prevent.once="linkClick">有问题，先去百度</a>

    <!-- 演示： .stop 和 .self 的区别 -->
    <div class="outer" @click="div2Handler">
      <div class="inner" @click="div1Handler">
        <input type="button" value="戳他" @click.stop="btnHandler">
      </div>
    </div>
```

## vm.$on
- **参数**：
  - `{string | Array<string>} event` (数组只在 2.2.0+ 中支持)
  - `{Function} callback`
- **用法**：
  监听当前实例上的自定义事件。事件可以由`vm.$emit`触发。回调函数会接收所有传入事件触发函数的额外参数。
- **示例**：
```js
vm.$on('test', function (msg) {
console.log(msg)
})
vm.$emit('test', 'hi')
// => "hi"
```
## vm.$once
- **参数**：
  - `{string} event`
  - `{Function} callback`
- **用法**：
  监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。
## vm.$off
- **参数**：
  - `{string | Array<string>} event` (只在 2.2.2+ 支持数组)
  - `{Function} [callback]`
- **用法**：
  移除自定义事件监听器。
  - 如果没有提供参数，则移除所有的事件监听器；
  - 如果只提供了事件，则移除该事件所有的监听器；
  - 如果同时提供了事件与回调，则只移除这个回调的监听器。
## vm.$emit
- **参数**：
  - `{string} eventName` ： 需要执行的方法名
  - `[...args]` ： 执行的方法名中的参数
触发当前实例上的事件。附加参数都会传给监听器回调。
- **示例：**
只配合一个事件名使用 `$emit`：
```js
Vue.component('welcome-button', {
template: `
  <button v-on:click="$emit('welcome')">
    Click me to be welcomed
  </button>
`
})
```
```html
<div id="emit-example-simple">
<welcome-button v-on:welcome="sayHi"></welcome-button>
</div>
```
```js
new Vue({
el: '#emit-example-simple',
methods: {
  sayHi: function () {
    alert('Hi!')
  }
}
})
```
配合额外的参数使用 `$emit`：
```js
Vue.component('magic-eight-ball', {
data: function () {
  return {
    possibleAdvice: ['Yes', 'No', 'Maybe']
  }
},
methods: {
  giveAdvice: function () {
    var randomAdviceIndex = Math.floor(Math.random() * this.possibleAdvice.length)
    this.$emit('give-advice', this.possibleAdvice[randomAdviceIndex])
  }
},
template: `
  <button v-on:click="giveAdvice">
    Click me for advice
  </button>
`
})
```

```html
<div id="emit-example-argument">
<magic-eight-ball v-on:give-advice="showAdvice"></magic-eight-ball>
</div>
```
```js
new Vue({
el: '#emit-example-argument',
methods: {
  showAdvice: function (advice) {
    alert(advice)
  }
}
})
```

## $event
有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 $event 把它传入方法：
```html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

```js
// ...
methods: {
  warn: function (message, event) {
    // 现在我们可以访问原生事件对象
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

## 事件绑定加括号与不加括号的区别
```js
maxApp(e){
  console.log(e);
}
```

**不加括号时**
```html
<i @click="maxApp"></i>
```
此时结果打印为：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210515212056.png" width="700px"/>


**加括号时**
```html
<i @click="maxApp()"></i>
```
此时打印undefined：

如果想要打印MouseEvent，括号中必须传$event, 如下：
```html
<i @click="maxApp($event)"></i>
```

**总结**： 加不加括号，其实就是是否默认传事件对象 event 。不加括号时，函数第一个参数为 event，加了括号后，需要手动传入`$event`才能获得事件对象。

## '.native'修饰符的使用
官网的解释：
你可能想在某个组件的根元素上监听一个原生事件。可以使用`v-on`的修饰符`.native`。
通俗点讲：就是在父组件中给子组件绑定一个原生的事件，就将子组件变成了普通的HTML标签，不加'. native'事件是无法触发的。
```vue
<template>
  <div>
    <my-component @click="outClick"></my-component>
  </div>
</template>

<script>
import Vue from 'vue'
Vue.component('my-component', {
  template: `<el-button type="priamry">InnerButton</el-button>`
})

export default{
  methods:{
    outClick(){
      alert("this is outer");
    }
  }
}
</script>
```
此时点击页面中的按钮无任何反应。
添加修饰符后：
```vue
<template>
  <div>
    <my-component @click.native="outClick"></my-component>
  </div>
</template>
```
此时点击就会弹窗

## v-model和双向数据绑定
在vue中**只有**v-model这一个指令能实现双向数据绑定，即Model层数据变了，会导致View层数据也会跟着变。View层数据变了，也会导致Model层数据也会跟着变。 并且v-model**只能**用于表单元素中

```html
<body>
  <div id="app">
    <h4>{{ msg }}</h4>
    <!-- v-bind 只能实现数据的单向绑定，从M自动绑定到V，即model层数据变了，会导致View层数据会跟着变，但是View层数据变了，是不会导致Model层数据发生变化。 -->
    <input type="text" v-bind:value="msg" style="width:100%;">

    <!-- 使用v-model指令，可以实现 表单元素和Model中数据的双向数据绑定 -->
    <!-- 此时在网页上修改input中的值时，<h4>标签的内容也会发生变化 -->
    <!-- 注意：v-model 只能运用在表单元素中 -->
    <input type="text" style="width:100%;" v-model="msg">
  </div>
  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        msg: '大家都是好学生，爱敲代码，爱学习，爱思考，简直是完美，没瑕疵！'
      },
      methods: {
      }
    });
  </script>
</body>
```


## 使用class样式
1. 数组
```html
<h1 :class="['red', 'thin']">这是一个邪恶的H1</h1>
/*因为使用了v-bind绑定了class属性， 所以class属性值的内容除了单引号括起来的，其他的都要会当作变量， 所以这里用了数组变量*/
```

2. 数组中使用三元表达式
```html
<h1 :class="['red', 'thin', isactive?'active':'']">这是一个邪恶的H1</h1>
/*其中的isactive是你在vue的data中定义的变量， isactive的值有true或false*/
```

3. 数组中嵌套对象
```html
<h1 :class="['red', 'thin', {'active': isactive}]">这是一个邪恶的H1</h1>
/*其中isactive是你在vue中data中定义的变量， 当isactive的值为false时， 这个class属性将没有active类选择器，如果为true，则有*/
```

4. 直接使用对象
```html
<h1 :class="{red:true, italic:true, active:true, thin:true}">这是一个邪恶的H1</h1>
/*原理同上一点， 其中red、italic等都是类选择器*/
```

## 使用内联样式
1. 直接在元素上通过 `:style` 的形式，书写样式对象
```html
<h1 :style="{color: 'red', 'font-size': '40px'}">这是一个善良的H1</h1>
```

2. 将样式对象，定义到 `data` 中，并直接引用到 `:style` 中
在data上定义样式：
```css
data: {
     h1StyleObj: { color: 'red', 'font-size': '40px', 'font-weight': '200' }
}
```
在元素中，通过属性绑定的形式，将样式对象应用到元素中：
```html
<h1 :style="h1StyleObj">这是一个善良的H1</h1>
```

3. 在 `:style` 中通过数组，引用多个 `data` 上的样式对象
在data上定义样式：
```css
data: {
    h1StyleObj: { color: 'red', 'font-size': '40px', 'font-weight': '200' },
    h1StyleObj2: { fontStyle: 'italic' }
}
```
在元素中，通过属性绑定的形式，将样式对象应用到元素中：
```html
<h1 :style="[h1StyleObj, h1StyleObj2]">这是一个善良的H1</h1>
```

## v-for和key属性

### 用 v-for 把一个数组对应为一组元素
我们可以用 v-for 指令基于一个数组来渲染一个列表。v-for 指令需要使用 item in items 形式的特殊语法，其中 items 是源数据数组，而 item 则是被迭代的数组元素的别名。
```html
<div id="example-1">
  <div v-for="item in items" :key="item.message">
    {{ item.message }}
  </div>
</div>
```
```js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```
结果：
```
Foo
Bar
```
在 v-for 块中，我们可以访问所有父作用域的 property。v-for 还支持一个可选的第二个参数，即当前项的索引。
```html
<div id="example-2">
  <div v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </div>
</div>
```
```js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```
结果：
```
Parent-0-Foo
Parent-1-Bar
```
你也可以用 of 替代 in 作为分隔符，因为它更接近 JavaScript 迭代器的语法：
```html
<div v-for="item of items"></div>
```

### 在 v-for 里使用对象
你也可以用 v-for 来遍历一个对象的 property。
```html
<div id="v-for-object" class="demo">
  <div v-for="value in object">
    {{ value }}
  </div>
</div>
```
```js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
```
结果：
```
How to do lists in Vue
Jane Doe
2016-04-10
```

你也可以提供第二个的参数为 property 名称 (也就是键名)：
```html
<div v-for="(value, name) in object">
  {{ name }}: {{ value }}
</div>
```
结果：
```
title: How to do lists in Vue
author: Jane Doe
publishedAt: 2016-04-10
```

还可以用第三个参数作为索引：
```html
<div v-for="(value, name, index) in object">
  {{ index }}. {{ name }}: {{ value }}
</div>
```
结果：
```
0. title: How to do lists in Vue
1. author: Jane Doe
2. publishedAt: 2016-04-10
```

### 迭代时调用方法
```html
<p v-for="item in search(keywords)">这是第 {{i}} 个P标签</p>
/*这个search是vue中的methods中定义的方法， keywords是vue中data的的变量， 这个遍历的数组是执行search(keywords)方法后得到的数组*/
```

### v-for必须要有key
> 2.2.0+ 的版本里，**当在组件中使用** v-for 时，key 现在是必须的。

当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用 “**就地复用**” 策略。如果数据项的顺序被改变，Vue将**不是移动 DOM 元素来匹配数据项的顺序**， 而是**简单复用此处每个元素**，并且确保它在特定索引下显示已被渲染过的每个元素。

为了给 Vue 一个提示，**以便它能跟踪每个节点的身份，从而重用和重新排序现有元素**，你需要为每项提供一个唯一 key 属性。
```html
<body>
  <div id="app">
    <div>
      <label>Id:
        <input type="text" v-model="id">
      </label>
      <label>Name:
        <input type="text" v-model="name">
      </label>
      <input type="button" value="添加" @click="add">
    </div>
    <!-- 注意： v-for 循环的时候，key 属性只能使用 number获取string -->
    <!-- 注意： key 在使用的时候，必须使用 v-bind 属性绑定的形式，指定 key 的值 -->
    <!-- 在组件中，使用v-for循环的时候，或者在一些特殊情况中，如果 v-for 有问题，必须 在使用 v-for 的同时，指定 唯一的 字符串/数字 类型 :key 值 -->
    <p v-for="item in list" :key="item.id">
      <input type="checkbox">{{item.id}} --- {{item.name}}
    </p>
  </div>
  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        id: '',
        name: '',
        list: [
          { id: 1, name: '李斯' },
          { id: 2, name: '嬴政' },
          { id: 3, name: '赵高' },
          { id: 4, name: '韩非' },
          { id: 5, name: '荀子' }
        ]
      },
      methods: {
        add() { // 添加方法
          this.list.unshift({ id: this.id, name: this.name })
        }
      }
    });
  </script>
</body>
```

## v-if和v-show
v-if 与 v-show都是用来控制元素的显示的
v-if 的特点：每次都会重新删除或创建元素
v-show 的特点： 每次不会重新进行DOM的删除和创建操作，只是切换了元素的 display:none 样式

> 一般来说，v-if 有更高的切换消耗而 v-show 有更高的初始渲染消耗。因此，如果需要频繁切换 v-show 较好，如果在运行时条件不大可能改变 v-if 较好。

```html
<body>
  <div id="app">
    <!-- <input type="button" value="toggle" @click="toggle"> -->
    <input type="button" value="toggle" @click="flag=!flag">
    <h3 v-if="flag">这是用v-if控制的元素</h3>
    <h3 v-show="flag">这是用v-show控制的元素</h3>
  </div>
  <script>
    var vm = new Vue({
      el: '#app',
      data: {
        flag: false
      },
      methods: {
        /* toggle() {
          this.flag = !this.flag
        } */
      }
    });
  </script>
</body>
```
## watch属性的使用
考虑一个问题：想要实现 `名` 和 `姓` 两个文本框的内容改变，则全名的文本框中的值也跟着改变；（用以前的知识如何实现？？？）
1. 监听`data`中属性的改变：
```html
<div id="app">
    <input type="text" v-model="firstName"> +
    <input type="text" v-model="lastName"> =
    <span>{{fullName}}</span>
  </div>

  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        firstName: 'jack',
        lastName: 'chen',
        fullName: 'jack - chen'
      },
      methods: {},
      watch: {
        'firstName': function (newVal, oldVal) { // 第一个参数是新数据，第二个参数是旧数据
          this.fullName = newVal + ' - ' + this.lastName;
        },
        'lastName': function (newVal, oldVal) {
          this.fullName = this.firstName + ' - ' + newVal;
        }
      }
    });
  </script>
```

2. 监听路由对象的改变：
```html
<div id="app">
    <router-link to="/login">登录</router-link>
    <router-link to="/register">注册</router-link>
    <router-view></router-view>
</div>

<script>
var login = Vue.extend({
  template: '<h1>登录组件</h1>'
});

var register = Vue.extend({
  template: '<h1>注册组件</h1>'
});

var router = new VueRouter({
  routes: [
    { path: "/login", component: login },
    { path: "/register", component: register }
  ]
});

// 创建 Vue 实例，得到 ViewModel
var vm = new Vue({
  el: '#app',
  data: {},
  methods: {},
  router: router,
  watch: {
    '$route': function (newVal, oldVal) {
      if (newVal.path === '/login') {
        console.log('这是登录组件');
      }
    }
  }
});
</script>
```

## computed计算属性的使用
1. 默认只有`getter`的计算属性：
```html
<div id="app">
    <input type="text" v-model="firstName"> +
    <input type="text" v-model="lastName"> =
    <span>{{fullName}}</span>
  </div>

  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        firstName: 'jack',
        lastName: 'chen'
      },
      methods: {},
      computed: { // 计算属性； 特点：当计算属性中所有用到的任何一个data属性改变之后，都会重新触发本计算属性 的重新计算，从而更新fullName的值
        fullName() {
          return this.firstName + ' - ' + this.lastName;
        }
      }
    });
  </script>
```

2. 定义有`getter`和`setter`的计算属性：

```html
<div id="app">
    <input type="text" v-model="firstName">
    <input type="text" v-model="lastName">
    <!-- 点击按钮重新为 计算属性 fullName 赋值 -->
    <input type="button" value="修改fullName" @click="changeName">

    <span>{{fullName}}</span>
  </div>

  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        firstName: 'jack',
        lastName: 'chen'
      },
      methods: {
        changeName() {
          this.fullName = 'TOM - chen2';
        }
      },
      computed: {
        fullName: {
          get: function () {
            return this.firstName + ' - ' + this.lastName;
          },
          set: function (newVal) {
            var parts = newVal.split(' - ');
            this.firstName = parts[0];
            this.lastName = parts[1];
          }
        }
      }
    });
  </script>

```

## watch、computed和methods之间的对比
1. `computed`属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。主要当作属性来使用；
2. `methods`方法表示一个具体的操作，主要书写业务逻辑；
3. `watch`一个对象，键是需要观察的表达式，值是对应回调函数。主要用来监听某些特定数据的变化，从而进行某些具体的业务逻辑操作；可以看作是`computed`和`methods`的结合体；

# 过滤器
概念：Vue.js 允许你自定义过滤器，**可被用作一些常见的文本格式化**。过滤器可以用在两个地方：**mustache 插值和 v-bind 表达式**。过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符指示；
过滤器基本使用：
```html
<body>
  <div id="app">
    /*此时msg变量会当作第一个实参传给msgFormat方法，将得到的结果再传给test方法， 最后得到的结果就是这个插值表达式的结果*/
    <p>{{ msg | msgFormat('疯狂+1', '123') | test }}</p>
  </div>
  <script>
    // 定义一个 Vue 全局的过滤器，名字叫做  msgFormat
    Vue.filter('msgFormat', function (msg, arg, arg2) {
      // 字符串的  replace 方法，第一个参数，除了可写一个 字符串之外，还可以定义一个正则
      return msg.replace(/单纯/g, arg + arg2)
    })

    Vue.filter('test', function (msg) {
      return msg + '========'
    })

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        msg: '曾经，我也是一个单纯的少年，单纯的我，傻傻的问，谁是世界上最单纯的男人'
      },
      methods: {}
    });
  </script>
</body>
```

## 私有过滤器
1. HTML元素：
```html
<td>{{item.ctime | dataFormat('yyyy-mm-dd')}}</td>
```

2. 私有 `filters` 定义方式：
```js
filters: { // 私有局部过滤器，只能在 当前 VM 对象所控制的 View 区域进行使用
    dataFormat(input, pattern = "") { // 在参数列表中 通过 pattern="" 来指定形参默认值，防止报错
      var dt = new Date(input);
      // 获取年月日
      var y = dt.getFullYear();
      var m = (dt.getMonth() + 1).toString().padStart(2, '0');
      var d = dt.getDate().toString().padStart(2, '0');
      // 如果 传递进来的字符串类型，转为小写之后，等于 yyyy-mm-dd，那么就返回 年-月-日
      // 否则，就返回  年-月-日 时：分：秒
      if (pattern.toLowerCase() === 'yyyy-mm-dd') {
        return `${y}-${m}-${d}`;
      } else {
        // 获取时分秒
        var hh = dt.getHours().toString().padStart(2, '0');
        var mm = dt.getMinutes().toString().padStart(2, '0');
        var ss = dt.getSeconds().toString().padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }
    }
  }
```

> 使用ES6中的字符串新方法 String.prototype.padStart(maxLength, fillString='') 或 String.prototype.padEnd(maxLength, fillString='')来填充字符串；


## 全局过滤器
```js
// 定义一个全局过滤器
Vue.filter('dataFormat', function (input, pattern = '') {//如果pattern没传值，则默认为'';
  var dt = new Date(input);
  // 获取年月日
  var y = dt.getFullYear();
  var m = (dt.getMonth() + 1).toString().padStart(2, '0');
  var d = dt.getDate().toString().padStart(2, '0');
  // 如果 传递进来的字符串类型，转为小写之后，等于 yyyy-mm-dd，那么就返回 年-月-日
  // 否则，就返回  年-月-日 时：分：秒
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${y}-${m}-${d}`;
  } else {
    // 获取时分秒
    var hh = dt.getHours().toString().padStart(2, '0');
    var mm = dt.getMinutes().toString().padStart(2, '0');
    var ss = dt.getSeconds().toString().padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }
});
```
> 注意：当有局部和全局两个名称相同的过滤器时候，会以就近原则进行调用，即：局部过滤器优先于全局过滤器被调用！

## 键盘修饰符
在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 v-on 在监听键盘事件时添加按键修饰符：
```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```
你可以直接将 KeyboardEvent.key 暴露的任意有效按键名转换为 kebab-case 来作为修饰符。
```html
<input v-on:keyup.page-down="onPageDown">
```
在上述示例中，处理函数只会在 $event.key 等于 PageDown 时被调用。

### 按键码
keyCode 的事件用法已经被废弃了并可能不会被最新的浏览器支持。
使用 keyCode 特性也是允许的：
```
<input v-on:keyup.13="submit">
```
为了在必要的情况下支持旧浏览器，Vue 提供了绝大多数常用的按键码的别名：
```
.enter
.tab
.delete (捕获“删除”和“退格”键)
.esc
.space
.up
.down
.left
.right
```

有一些按键 (.esc 以及所有的方向键) 在 IE9 中有不同的 key 值, 如果你想支持 IE9，这些内置的别名应该是首选。
### 自定义键盘修饰符
1.x中自定义键盘修饰符【了解即可】
```css
Vue.directive('on').keyCodes.f2 = 113;
```

2.x中自定义键盘修饰符
通过`Vue.config.keyCodes.名称 = 按键值`来自定义案件修饰符的别名：
```css
Vue.config.keyCodes.f2 = 113; /*其中f2键的keycode码113*/
```
使用自定义的按键修饰符：
```html
<input type="text" v-model="name" @keyup.f2="add">
```
[js 里面的键盘事件对应的键码](https://www.cnblogs.com/wuhua1/p/6686237.html)


## 自定义指令
[自定义指令官网链接](https://cn.vuejs.org/v2/guide/custom-directive.html)
```js
    <input type="text" v-focus v-color="'green'"> 

    // 使用  Vue.directive()来定义全局的指令v-focus
    // 其中：参数1 ： 指令的名称，注意，在定义的时候，指令的名称前面，不需要加 v- 前缀,
    // 但是： 在调用的时候，必须 在指令名称前 加上 v- 前缀来进行调用
    //  参数2： 是一个对象，这个对象身上，有一些指令相关的函数，这些函数可以在特定的阶段，执行相关的操作
    Vue.directive('focus', {
      bind: function (el) { // 每当指令绑定到元素上的时候，会立即执行这个 bind 函数，只执行一次
        // 注意： 在每个 函数中，第一个参数，永远是 el ，表示 被绑定了指令的那个元素，这个 el 参数，是一个原生的JS对象
        // 在元素 刚绑定了指令的时候，还没有插入到 DOM中去，这时候，调用focus方法没有作用
        //  因为，一个元素，只有插入DOM之后，才能获取焦点
        // el.focus()
      },
      inserted: function (el) { // inserted 表示元素 插入到DOM中的时候，会执行 inserted 函数【触发1次】
        el.focus()
        // 和JS行为有关的操作，最好在 inserted 中去执行，防止JS行为不生效
      },
      updated: function (el) { // 当VNode更新的时候，会执行updated， 可能会触发多次
      }
    })

    // 自定义一个 设置字体颜色的 指令
    Vue.directive('color', {
      // 样式，只要通过指令绑定给了元素，不管这个元素有没有被插入到页面中去，这个元素肯定有了一个内联的样式
      // 将来元素肯定会显示到页面中，这时候，浏览器的渲染引擎必然会解析样式，应用给这个元素
      bind: function (el, binding) {
        // el.style.color = 'red'
        // console.log(binding.name)
        // 和样式相关的操作，一般都可以在 bind 执行
        // console.log(binding.value)
        // console.log(binding.expression)
        el.style.color = binding.value
      }
    })
```

自定义全局和局部的自定义指令：
```css
// 自定义全局指令 v-focus，为绑定的元素自动获取焦点：
Vue.directive('focus', {
  inserted: function (el) { // inserted 表示被绑定元素插入父节点时调用
    el.focus();
  }
});

// 自定义局部指令 v-color 和 v-font-weight，为绑定的元素设置指定的字体颜色 和 字体粗细：
  directives: {
    color: { // 为元素设置指定的字体颜色
      bind(el, binding) {
        el.style.color = binding.value;
      }
    },
   'font-weight': function (el, binding2) { // 自定义指令的简写形式，等同于定义了 bind 和 update 两个钩子函数
      el.style.fontWeight = binding2.value;
    }
  }
```

自定义指令的使用方式：
```html
<input type="text" v-model="searchName" v-focus v-color="'red'" v-font-weight="900">
```

# vue实例的生命周期
[vue实例的生命周期官网链接](https://cn.vuejs.org/v2/guide/instance.html#实例生命周期)
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191220161235.png"/>

什么是生命周期：从Vue实例创建、运行、到销毁期间，总是伴随着各种各样的事件，这些事件，统称为生命周期！
[生命周期钩子](https://cn.vuejs.org/v2/api/#选项-生命周期钩子)：就是生命周期事件的别名而已；
生命周期钩子 = 生命周期函数 = 生命周期事件

主要的生命周期函数分类：
- 创建期间的生命周期函数：
```
beforeCreate： 实例刚在内存中被创建出来，此时，还没有初始化好 data 和 methods 属性
created： 实例已经在内存中创建OK，此时 data 和 methods 已经创建OK，此时还没有开始 编译模板
beforeMount： 此时已经完成了模板的编译，但是还没有挂载到页面中
mounted： 此时，已经将编译好的模板，挂载到了页面指定的容器中显示
```
- 运行期间的生命周期函数：
```
beforeUpdate： 状态更新之前执行此函数， 此时 data 中的状态值是最新的，但是界面上显示的 数据还是旧的，因为此时还没有开始重新渲染DOM节点
updated： 实例更新完毕之后调用此函数，此时 data 中的状态值 和 界面上显示的数据，都已经完成了更新，界面已经被重新渲染好了！
```
- 销毁期间的生命周期函数：
```
beforeDestroy： 实例销毁之前调用。在这一步，实例仍然完全可用。
destroyed： Vue实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
```

```html
<body>
<div id="app">
  <input type="button" value="修改msg" @click="msg='No'">
  <h3 id="h3">{{ msg }}</h3>
</div>

<script>
  // 创建 Vue 实例，得到 ViewModel
  var vm = new Vue({
    el: '#app',
    data: {
      msg: 'ok'
    },
    methods: {
      show() {
        console.log('执行了show方法')
      }
    },
    beforeCreate() { // 这是我们遇到的第一个生命周期函数，表示实例完全被创建出来之前，会执行它
      // console.log(this.msg)
      // this.show()
      // 注意： 在 beforeCreate 生命周期函数执行的时候，data 和 methods 中的 数据都还没有没初始化
    },
    created() { // 这是遇到的第二个生命周期函数
      // console.log(this.msg)
      // this.show()
      //  在 created 中，data 和 methods 都已经被初始化好了！
      // 如果要调用 methods 中的方法，或者操作 data 中的数据，最早，只能在 created 中操作
    },
    beforeMount() { // 这是遇到的第3个生命周期函数，表示 模板已经在内存中编辑完成了，但是尚未把 模板渲染到 页面中
      // console.log(document.getElementById('h3').innerText)
      // 在 beforeMount 执行的时候，页面中的元素，还没有被真正替换过来，只是之前写的一些模板字符串
    },
    mounted() { // 这是遇到的第4个生命周期函数，表示，内存中的模板，已经真实的挂载到了页面中，用户已经可以看到渲染好的页面了
      // console.log(document.getElementById('h3').innerText)
      // 注意： mounted 是 实例创建期间的最后一个生命周期函数，当执行完 mounted 就表示，实例已经被完全创建好了，此时，如果没有其它操作的话，这个实例，就静静的 躺在我们的内存中，一动不动
    },
    // 接下来的是运行中的两个事件
    beforeUpdate() { // 这时候，表示 我们的界面还没有被更新【数据被更新了吗？  数据肯定被更新了】
      /* console.log('界面上元素的内容：' + document.getElementById('h3').innerText)
      console.log('data 中的 msg 数据是：' + this.msg) */
      // 得出结论： 当执行 beforeUpdate 的时候，页面中的显示的数据，还是旧的，此时 data 数据是最新的，页面尚未和 最新的数据保持同步
    },
    updated() {
      console.log('界面上元素的内容：' + document.getElementById('h3').innerText)
      console.log('data 中的 msg 数据是：' + this.msg)
      // updated 事件执行的时候，页面和 data 数据已经保持同步了，都是最新的
    }
  });
</script>
</body>
```

# vue.js中created()、activated()、deactivated()理解
- created()：在创建vue对象时，当html渲染之前触发；但是注意，全局vue.js不强制刷新或者重启时只创建一次，也就是说，created()只会触发一次；
- activated()：在vue对象存活的情况下，进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据、keepalive缓存组件后，可执行方法；
- deactivated()：离开组件时执行；

<font color="red">注意：activated()和deactivated()只有在`<keep-alive></keep-alive>`包裹的时候才有效；</font>

例：
新建两个组件，compA，compB：
```vue
<template>
<div class="app">
    我是组件A
</div>
</template>
 
<script>
    export default{
        name: "compA",
        data(){
            return {
               
            }
        },
        created(){
            console.log('created');
        },
        activated(){
            console.log('activated');
        },
        deactivated(){
            console.log('deactivated');
        }
    }
</script>
``` 
同理建compB；
在view中引用两个组件：
```vue
<template>
<div class="app">
    <div class="bth">
        <button @click="currentComponent='compA'">A</button>
        <button @click="currentComponent='compB'">B</button>    
    </div>
</div>
<keep-alive>
    <component :is="currentComponent"></component>
</keep-alive>
</template>
 
<script>
    import compA from './component/compA'
    import compB from './component/compB'
    export default{
        name: "App",
        component: {
            compA, compB
        },
        data(){
            return {
                currentComponent: 'compA'
            }
        }
    }
</script>
``` 
在点击切换B组件时，A组件的deactivated()会执行；
注：:is后绑定组件名，渲染当前组件；

# vue-resource实现get,post,jsonp请求
[官网链接](https://github.com/pagekit/vue-resource)
除了 vue-resource 之外，还可以使用 `axios` 的第三方包实现实现数据的请求

1. 之前的学习中，如何发起数据请求？
2. 常见的数据请求类型？  get  post jsonp
3. 测试的URL请求资源地址：
- get请求地址： http://vue.studyit.io/api/getlunbo
- post请求地址：http://vue.studyit.io/api/post
- jsonp请求地址：http://vue.studyit.io/api/jsonp

## JSONP的实现原理
- 由于浏览器的安全性限制，不允许AJAX访问 协议不同、域名不同、端口号不同的 数据接口，浏览器认为这种访问不安全；
- 由于凡是拥有scr这个属性的标签都可以跨域例如\<script>\<img>\<iframe>，所以可以通过动态创建script标签的形式，把script标签的src属性，指向数据接口的地址，因为script标签不存在跨域限制，这种数据获取方式，称作JSONP（注意：根据JSONP的实现原理，知晓，JSONP只支持Get请求）；
- 具体实现过程：
- 先在客户端定义一个回调方法，预定义对数据的操作；
  - 再把这个回调方法的名称，通过URL传参的形式，提交到服务器的数据接口；
  - 服务器数据接口组织好要发送给客户端的数据，再拿着客户端传递过来的回调方法名称，拼接出一个调用这个方法的字符串，发送给客户端去解析执行；
  - 客户端拿到服务器返回的字符串之后，当作Script脚本去解析执行，这样就能够拿到JSONP的数据了；
- 带大家通过 Node.js ，来手动实现一个JSONP的请求例子；
```js
    const http = require('http');
    // 导入解析 URL 地址的核心模块
    const urlModule = require('url');
    const server = http.createServer();
    // 监听 服务器的 request 请求事件，处理每个请求
    server.on('request', (req, res) => {
      const url = req.url;

      // 解析客户端请求的URL地址
      var info = urlModule.parse(url, true);

      // 如果请求的 URL 地址是 /getjsonp ，则表示要获取JSONP类型的数据
      if (info.pathname === '/getjsonp') {
        // 获取客户端指定的回调函数的名称
        var cbName = info.query.callback;
        // 手动拼接要返回给客户端的数据对象
        var data = {
          name: 'zs',
          age: 22,
          gender: '男',
          hobby: ['吃饭', '睡觉', '运动']
        }
        // 拼接出一个方法的调用，在调用这个方法的时候，把要发送给客户端的数据，序列化为字符串，作为参数传递给这个调用的方法：
        var result = `${cbName}(${JSON.stringify(data)})`;
        // 将拼接好的方法的调用，返回给客户端去解析执行
        res.end(result);
      } else {
        res.end('404');
      }
    });

    server.listen(3000, () => {
      console.log('server running at http://127.0.0.1:3000');
    });
```
## Methods
Shortcut methods are available for all request types. These methods work globally or in a Vue instance.

```js
// global Vue object
Vue.http.get('/someUrl', [config]).then(successCallback, errorCallback);
Vue.http.post('/someUrl', [body], [config]).then(successCallback, errorCallback);

// in a Vue instance
this.$http.get('/someUrl', [config]).then(successCallback, errorCallback);
this.$http.post('/someUrl', [body], [config]).then(successCallback, errorCallback);
```

List of shortcut methods:
- `get(url, [config])`
- `head(url, [config])`
- `delete(url, [config])`
- `jsonp(url, [config])`
- `post(url, [body], [config])`
- `put(url, [body], [config])`
- `patch(url, [body], [config])`

Config

| Parameter        | Type                           | Description                                                                                                                  |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| url              | `string`                       | URL to which the request is sent                                                                                             |
| body             | `Object`, `FormData`, `string` | Data to be sent as the request body                                                                                          |
| headers          | `Object`                       | Headers object to be sent as HTTP request headers                                                                            |
| params           | `Object`                       | Parameters object to be sent as URL parameters                                                                               |
| method           | `string`                       | HTTP method (e.g. GET, POST, ...)                                                                                            |
| responseType     | `string`                       | Type of the response body (e.g. text, blob, json, ...)                                                                       |
| timeout          | `number`                       | Request timeout in milliseconds (`0` means no timeout)                                                                       |
| credentials      | `boolean`                      | Indicates whether or not cross-site Access-Control requests should be made using credentials                                 |
| emulateHTTP      | `boolean`                      | Send PUT, PATCH and DELETE requests with a HTTP POST and set the `X-HTTP-Method-Override` header                             |
| emulateJSON      | `boolean`                      | Send request body as `application/x-www-form-urlencoded` content type                                                        |
| before           | `function(request)`            | Callback function to modify the request object before it is sent                                                             |
| uploadProgress   | `function(event)`              | Callback function to handle the [ProgressEvent](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) of uploads   |
| downloadProgress | `function(event)`              | Callback function to handle the [ProgressEvent](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) of downloads |

Response
A request resolves to a response object with the following properties and methods:

| Property   | Type                       | Description                             |
| ---------- | -------------------------- | --------------------------------------- |
| url        | `string`                   | Response URL origin                     |
| body       | `Object`, `Blob`, `string` | Response body                           |
| headers    | `Header`                   | Response Headers object                 |
| ok         | `boolean`                  | HTTP status code between 200 and 299    |
| status     | `number`                   | HTTP status code of the response        |
| statusText | `string`                   | HTTP status text of the response        |
| **Method** | **Type**                   | **Description**                         |
| text()     | `Promise`                  | Resolves the body as string             |
| json()     | `Promise`                  | Resolves the body as parsed JSON object |
| blob()     | `Promise`                  | Resolves the body as Blob object        |

Example
```js
{
 // POST /someUrl
 this.$http.post('/someUrl', {foo: 'bar'}).then(response => {
   // get status
   response.status;
   // get status text
   response.statusText;
   // get 'Expires' header
   response.headers.get('Expires');
   // get body data
   this.someData = response.body;
 }, response => {
   // error callback
 });
}
```
Send a get request with URL query parameters and a custom headers.
```js
{
 // GET /someUrl?foo=bar
 this.$http.get('/someUrl', {params: {foo: 'bar'}, headers: {'X-Custom': '...'}}).then(response => {
   // success callback
 }, response => {
   // error callback
 });
}
```

   Fetch an image and use the blob() method to extract the image body content from the response.

   ```js
   {
     // GET /image.jpg
     this.$http.get('/image.jpg', {responseType: 'blob'}).then(response => {
       // resolve to Blob
       return response.blob();
     }).then(blob => {
       // use image Blob
     });
   }
   ```

## vue-resource 的配置步骤
- 直接在页面中，通过`script`标签，引入 `vue-resource` 的脚本文件；
- 注意：引用的先后顺序是：先引用 `Vue` 的脚本文件，再引用 `vue-resource` 的脚本文件；

## 发送请求
1. 发送get请求

```js
getInfo() { // get 方式获取数据
  this.$http.get('http://127.0.0.1:8899/api/getlunbo').then(res => {
    //通过res.body来获取服务器返回的数据
    console.log(res.body);
  })
}
```

2. 发送post请求：

```js
postInfo() {
  var url = 'http://127.0.0.1:8899/api/post';
  // post 方法接收三个参数：
  // 参数1： 要请求的URL地址
  // 参数2： 要发送的数据对象
  // 参数3： 指定post提交的编码类型为 application/x-www-form-urlencoded
  this.$http.post(url, { name: 'zs' }, { emulateJSON: true }).then(res => {
    console.log(res.body);
  });
}
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191220160733.png"/>

3. 发送JSONP请求获取数据：

```js
jsonpInfo() { // JSONP形式从服务器获取数据
  var url = 'http://127.0.0.1:8899/api/jsonp';
  this.$http.jsonp(url).then(res => {
    console.log(res.body);
  });
}
```

## 全局配置
```js
    // 如果我们通过全局配置了，请求的数据接口 根域名，则 ，在每次单独发起 http 请求的时候，请求的 url 路径，应该以相对路径开头，前面不能带 /  ，否则 不会启用根路径做拼接；
    Vue.http.options.root = 'http://vue.studyit.io/';
    // 全局启用 emulateJSON 选项
    Vue.http.options.emulateJSON = true;
```

# Vue中的动画
[官方链接](https://cn.vuejs.org/v2/guide/transitions.html)
为什么要有动画：动画能够提高用户的体验，帮助用户更好的理解页面中的功能；
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191220160310.png"/>

```
v-enter: 【这是一个时间点】 是进入之前，元素的起始状态，此时还没有开始进入
v-leave-to: 【这是一个时间点】 是动画离开之后，离开的终止状态，此时，元素 动画已经结束了
v-enter-active: 【入场动画的时间段】
v-leave-active: 【离场动画的时间段】
```
对于这些在过渡中切换的类名来说，如果你使用一个没有名字的`<transition>`，则 v- 是这些类名的默认前缀。如果你使用了`<transition name="my-transition">`，那么 v-enter 会替换为 my-transition-enter。

## 使用过渡类名
1. HTML结构：
```html
<div id="app">
    <input type="button" value="动起来" @click="myAnimate">
    <!-- 使用 transition 将需要过渡的元素包裹起来 -->
    <transition name="fade">
      <div v-show="isshow">动画哦</div>
    </transition>
</div>
```
2. VM 实例：
```css
// 创建 Vue 实例，得到 ViewModel
var vm = new Vue({
  el: '#app',
  data: {
    isshow: false
  },
  methods: {
    myAnimate() {
      this.isshow = !this.isshow;
    }
  }
});
```
3. 定义两组类样式：
```css
    /* 定义进入和离开时候的过渡状态 */
    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.2s ease;
      position: absolute; // 可以防止过渡时的效果时产生如下影响
    }

    /* 定义进入过渡的开始状态 和 离开过渡的结束状态 */
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
      transform: translateX(100px);
    }
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191220160849.gif"/>

## 使用第三方 CSS 动画库
[官方链接](https://cn.vuejs.org/v2/guide/transitions.html#自定义过渡类名)
1. 导入动画类库：
```html
<link rel="stylesheet" type="text/css" href="./lib/animate.css">
```
2. 定义 transition 及属性：
```html
<transition
	enter-active-class="fadeInRight"
    leave-active-class="fadeOutRight"
    :duration="{ enter: 500, leave: 800 }">
  	<div class="animated" v-show="isshow">动画哦</div>
</transition>
```
或
```html
<transition
	enter-active-class="animated fadeInRight"
    leave-active-class="animated fadeOutRight"
    :duration="{ enter: 500, leave: 800 }">
  	<div v-show="isshow">动画哦</div>
</transition>
```

## 使用动画钩子函数
1. 定义 transition 组件以及三个钩子函数：
```html
<div id="app">
    <input type="button" value="切换动画" @click="isshow = !isshow">
    <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter">
      <div v-if="isshow" class="show">OK</div>
    </transition>
  </div>
```
2. 定义三个 methods 钩子方法：
```js
methods: {
    beforeEnter(el) { // 动画进入之前的回调
      el.style.transform = 'translateX(500px)';
    },
    enter(el, done) { // 动画进入完成时候的回调
      el.offsetWidth;
      el.style.transform = 'translateX(0px)';
      done(); // 表示立即执行afterEnter函数
    },
    afterEnter(el) { // 动画进入完成之后的回调
      this.isshow = !this.isshow;
    }
}
```

3. 定义动画过渡时长和样式：
```css
.show{
      transition: all 0.4s ease;
    }
```

示例：
```html
<body>
  <div id="app">
    <input type="button" value="快到碗里来" @click="flag=!flag">
    <!-- 1. 使用 transition 元素把 小球包裹起来 -->
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter">
      <div class="ball" v-show="flag"></div>
    </transition>
  </div>

  <script>

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        flag: false
      },
      methods: {
        // 注意： 动画钩子函数的第一个参数：el，表示 要执行动画的那个DOM元素，是个原生的 JS DOM对象
        // 大家可以认为 ， el 是通过 document.getElementById('') 方式获取到的原生JS DOM对象
        beforeEnter(el){
          // beforeEnter 表示动画入场之前，此时，动画尚未开始，可以 在 beforeEnter 中，设置元素开始动画之前的起始样式
          // 设置小球开始动画之前的，起始位置
          el.style.transform = "translate(0, 0)"
        },
        enter(el, done){
          // 这句话，没有实际的作用，但是，如果不写，出不来动画效果；
          // 可以认为 el.offsetWidth 会强制动画刷新
          el.offsetWidth
          // enter 表示动画 开始之后的样式，这里，可以设置小球完成动画之后的，结束状态
          el.style.transform = "translate(150px, 450px)"
          el.style.transition = 'all 1s ease'

          // 这里的 done， 起始就是 afterEnter 这个函数，也就是说：done 是 afterEnter 函数的引用
          done()
        },
        afterEnter(el){
          // 动画完成之后，会调用 afterEnter
          // console.log('ok')
          this.flag = !this.flag
        }
      }
    });
  </script>
</body>
```

## v-for的列表过渡
[官方链接](https://cn.vuejs.org/v2/guide/transitions.html#列表的进入和离开过渡)
目前为止，关于过渡我们已经讲到：
- 单个节点
- 同一时间渲染多个节点中的一个

那么怎么同时渲染整个列表，比如使用 v-for ？在这种场景中，使用 `<transition-group>` 组件。在我们深入例子之前，先了解关于这个组件的几个特点：
- 不同于 `<transition>`，它会以一个真实元素呈现：默认为一个 `<span>`。你也可以通过 tag 特性更换为其他元素。
- 过渡模式不可用，因为我们不再相互切换特有的元素。
- 内部元素 总是需要 提供唯一的 key 属性值。
- CSS 过渡的类将会应用在内部的元素中，而不是这个组/容器本身。
1. 定义过渡样式：
```css
<style>
    .list-enter,
    .list-leave-to {
      opacity: 0;
      transform: translateY(10px);
    }

    .list-enter-active,
    .list-leave-active {
      transition: all 0.3s ease;
    }
</style>
```

2. 定义DOM结构，其中，需要使用 transition-group 组件把v-for循环的列表包裹起来：
```html
  <div id="app">
    <input type="text" v-model="txt" @keyup.enter="add">
    <transition-group tag="ul" name="list">
      <li v-for="(item, i) in list" :key="i">{{item}}</li>
    </transition-group>
  </div>
```

3. 定义 VM中的结构：
```css
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        txt: '',
        list: [1, 2, 3, 4]
      },
      methods: {
        add() {
          this.list.push(this.txt);
          this.txt = '';
        }
      }
    });
```

## 列表的排序过渡
`<transition-group>` 组件还有一个特殊之处。不仅可以进入和离开动画，**还可以改变定位**。要使用这个新功能只需了解新增的 `v-move` 特性，**它会在元素的改变定位的过程中应用**。
`v-move` 和 `v-leave-active` 结合使用，能够让列表的过渡更加平缓柔和：
```css
.v-move{
  transition: all 0.8s ease;
}
.v-leave-active{
  position: absolute;
}
```

案例：
```html
<style>
    li {
      border: 1px dashed #999;
      margin: 5px;
      line-height: 35px;
      padding-left: 5px;
      font-size: 12px;
      width: 100%;
    }
    li:hover {
      background-color: hotpink;
      transition: all 0.8s ease;
    }
    .v-enter,
    .v-leave-to {
      opacity: 0;
      transform: translateY(80px);
    }
    .v-enter-active,
    .v-leave-active {
      transition: all 0.6s ease;
    }
    /* 下面的 .v-move 和 .v-leave-active 配合使用，能够实现列表后续的元素，渐渐地漂上来的效果 */
    .v-move {
      transition: all 0.6s ease;
    }
    .v-leave-active{
      position: absolute;
    }
  </style>
</head>

<body>
  <div id="app">
    <div>
      <label>
        Id:
        <input type="text" v-model="id">
      </label>
      <label>
        Name:
        <input type="text" v-model="name">
      </label>
      <input type="button" value="添加" @click="add">
    </div>
    <!-- <ul> -->
      <!-- 在实现列表过渡的时候，如果需要过渡的元素，是通过 v-for 循环渲染出来的，不能使用 transition 包裹，需要使用 transitionGroup -->
      <!-- 如果要为 v-for 循环创建的元素设置动画，必须为每一个 元素 设置 :key 属性 -->
      <!-- 给 ransition-group 添加 appear 属性，实现页面刚展示出来时候，入场时候的效果 -->
      <!-- 通过 为 transition-group 元素，设置 tag 属性，指定 transition-group 渲染为指定的元素，如果不指定 tag 属性，默认，渲染为 span 标签 -->
      <transition-group appear tag="ul">
        <li v-for="(item, i) in list" :key="item.id" @click="del(i)">
          {{item.id}} --- {{item.name}}
        </li>
      </transition-group>
    <!-- </ul> -->
  </div>
  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        id: '',
        name: '',
        list: [
          { id: 1, name: '赵高' },
          { id: 2, name: '秦桧' },
          { id: 3, name: '严嵩' },
          { id: 4, name: '魏忠贤' }
        ]
      },
      methods: {
        add() {
          this.list.push({ id: this.id, name: this.name })
          this.id = this.name = ''
        },
        del(i) {
          this.list.splice(i, 1)
        }
      }
    });
  </script>
</body>
```

# Vue组件
什么是组件： 组件的出现，就是为了拆分Vue实例的代码量的，能够让我们以不同的组件，来划分不同的功能模块，将来我们需要什么样的功能，就可以去调用对应的组件即可；
组件化和模块化的不同：
- 模块化：是从代码逻辑的角度进行划分的；方便代码分层开发，保证每个功能模块的职能单一；
- 组件化：是从UI界面的角度进行划分的；前端的组件化，方便UI组件的重用；
## 全局组件
**全局组件定义的四种方式**
注：是<font color="red">全局组件</font>， 全局组件是所有Vue实例的子组件
无论是通过哪个方式常见全局组件，最后都必须要调用Vue.component('组件的名称', 创建出来的组件模板对象)，  <font color="red">并且创建出来的组件模板对象有且只能有一个根元素， 否则会报错</font>
1. 使用Vue.extend配合Vue.component方法：
```js
var login = Vue.extend({
      template: '<h1>登录</h1>'
});
Vue.component('login', login);
```

2. 直接使用Vue.component方法：
```js
Vue.component('register', {
      template: '<h1>注册</h1>'
});
```

3. 将模板字符串，定义到script标签(类型要为`x-template`)种：
```html
<script id="tmpl" type="x-template">
    <div><a href="#">登录</a> | <a href="#">注册</a></div>
</script>
```
同时，需要使用 Vue.component 来定义组件：
```js
Vue.component('account', {
      template: '#tmpl'
});
```

4. 使用`<template>`标签
```html
<template id="tmpl">
    <div><a href="#">登录</a> | <a href="#">注册</a></div>
</template>
```
同时，需要使用 Vue.component 来定义组件：
```js
Vue.component('account', {
      template: '#tmpl'
});
```
<font color="red">注意： 组件中的DOM结构，**有且只能有唯一**的根元素（Root Element）来进行包裹！</font>

## 局部子组件
使用components属性定义局部子组件
1. 组件实例定义方式：
```js
<script>
import Test from './Test.vue' //引入Test组件

// 创建 Vue 实例，得到 ViewModel
var vm = new Vue({
  el: '#app',
  data: {},
  methods: {},
  components: { // 定义子组件
    Test, // Test主机
    account: { // account 组件
      template: '<div><h1>这是Account组件{{name}}</h1><login></login></div>', // 在这里使用定义的子组件
      components: { // 定义子组件的子组件
        login: { // login 组件
          template: "<h3>这是登录组件</h3>"
        }
      }
    }
  }
});
</script>
```

2. 引用组件：
```html
<div id="app">
    <account></account>
 </div  
```

## 组件中的data属性
- 组件可以有自己的data数据。
- 组件的data和vue实例中的data有点不一样，实例中的data属性值可以是一个对象，但是组件中的data属性值必须要是一个方法，且必须要返回一个对象
- 组件获取自身的data数据的方式与vue实例获取data数据的方式一样
```js
Vue.component('account', {
  template: '<h1>这是一个全局组件---{{msg}}</h1>',
  data: function() {
    return {
      msg: '大家好！'
    }
  }
});
或
Vue.component('account', {
  template: '<h1>这是一个全局组件---{{msg}}</h1>',
  data(){
    return {
      msg: '大家好！'
    }
  }
});
```

## 组件中的props属性
### Prop 的大小写 (camelCase vs kebab-case)
HTML 中的 attribute 名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符。这意味着当你使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名：
```js
Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```
```html
<!-- 在 HTML 中是 kebab-case 的 -->
<blog-post post-title="hello!"></blog-post>
```
重申一次，如果你使用字符串模板，那么这个限制就不存在了。

### Prop 类型
到这里，我们只看到了以字符串数组形式列出的 prop：
```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```
但是，通常你希望每个 prop 都有指定的值类型。这时，你可以以对象形式列出 prop，这些 property 的名称和值分别是 prop 各自的名称和类型：
```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```
这不仅为你的组件提供了文档，还会在它们遇到错误的类型时从浏览器的 JavaScript 控制台提示用户。你会在这个页面接下来的部分看到类型检查和其它 prop 验证。

### 传递静态或动态 Prop
像这样，你已经知道了可以像这样给 prop 传入一个静态的值：
```html
<blog-post title="My journey with Vue"></blog-post>
```
你也知道 prop 可以通过 v-bind 动态赋值，例如：
```html
<!-- 动态赋予一个变量的值 -->
<blog-post v-bind:title="post.title"></blog-post>

<!-- 动态赋予一个复杂表达式的值 -->
<blog-post
  v-bind:title="post.title + ' by ' + post.author.name"
></blog-post>
```
在上述两个示例中，我们传入的值都是字符串类型的，但实际上任何类型的值都可以传给一个 prop。

**传入一个数字**
```html
<!-- 即便 `42` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:likes="42"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:likes="post.likes"></blog-post>
```

**传入一个布尔值**
```html
<!-- 包含该 prop 没有值的情况在内，都意味着 `true`。-->
<blog-post is-published></blog-post>

<!-- 即便 `false` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:is-published="false"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:is-published="post.isPublished"></blog-post>
```

**传入一个数组**
```html
<!-- 即便数组是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```

**传入一个对象**
```html
<!-- 即便对象是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:author="post.author"></blog-post>
```

**传入一个对象的所有 property**
如果你想要将一个对象的所有 property 都作为 prop 传入，你可以使用不带参数的 v-bind (取代 v-bind:prop-name)。例如，对于一个给定的对象 post：
```html
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```
下面的模板：
```html
<blog-post v-bind="post"></blog-post>
```
等价于：
```html
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

### 单向数据流
所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解。

额外的，每次父级组件发生变更时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。

这里有两种常见的试图变更一个 prop 的情形：
1. 这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。在这种情况下，最好定义一个本地的 data property 并将这个 prop 用作其初始值：
```js
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
```
2. 这个 prop 以一种原始的值传入且需要进行转换。在这种情况下，最好使用这个 prop 的值来定义一个计算属性：
```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```
> 注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身将会影响到父组件的状态。

### Prop 验证
我们可以为组件的 prop 指定验证要求，例如你知道的这些类型。如果有一个需求没有被满足，则 Vue 会在浏览器控制台中警告你。这在开发一个会被别人用到的组件时尤其有帮助。

为了定制 prop 的验证方式，你可以为 props 中的值提供一个带有验证需求的对象，而不是一个字符串数组。例如：
```js
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```
当 prop 验证失败的时候，(开发环境构建版本的) Vue 将会产生一个控制台的警告。

> 注意那些 prop 会在一个组件实例创建之前进行验证，所以实例的 property (如 data、computed 等) 在 default 或 validator 函数中是不可用的。

**类型检查**
type 可以是下列原生构造函数中的一个：
- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol
额外的，type 还可以是一个自定义的构造函数，并且通过 instanceof 来进行检查确认。例如，给定下列现成的构造函数：
```js
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```
你可以使用：
```js
Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```
来验证 author prop 的值是否是通过 new Person 创建的。

### 非 Prop 的 Attribute
一个非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 prop 定义的 attribute。

因为显式定义的 prop 适用于向一个子组件传入信息，然而组件库的作者并不总能预见组件会被用于怎样的场景。这也是为什么组件可以接受任意的 attribute，而这些 attribute 会被添加到这个组件的根元素上。

例如，想象一下你通过一个 Bootstrap 插件使用了一个第三方的`<bootstrap-date-input>`组件，这个插件需要在其`<input>`上用到一个 data-date-picker attribute。我们可以将这个 attribute 添加到你的组件实例上：
```html
<bootstrap-date-input data-date-picker="activated"></bootstrap-date-input>
```
然后这个`data-date-picker="activated"` attribute就会自动添加到`<bootstrap-date-input>`的根元素上。

**替换/合并已有的 Attribute**
想象一下`<bootstrap-date-input>`的模板是这样的：
```html
<input type="date" class="form-control">
```
为了给我们的日期选择器插件定制一个主题，我们可能需要像这样添加一个特别的类名：
```html
<bootstrap-date-input
  data-date-picker="activated"
  class="date-picker-theme-dark"
></bootstrap-date-input>
```
在这种情况下，我们定义了两个不同的 class 的值：
- form-control，这是在组件的模板内设置好的
- date-picker-theme-dark，这是从组件的父级传入的
对于绝大多数 attribute 来说，从外部提供给组件的值会替换掉组件内部设置好的值。所以如果传入 type="text" 就会替换掉 type="date" 并把它破坏！庆幸的是，class 和 style attribute 会稍微智能一些，即两边的值会被合并起来，从而得到最终的值：form-control date-picker-theme-dark。

**禁用 Attribute 继承**
如果你不希望组件的根元素继承 attribute，你可以在组件的选项中设置 inheritAttrs: false。例如：
```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```
这尤其适合配合实例的 $attrs property 使用，该 property 包含了传递给一个组件的 attribute 名和 attribute 值，例如：
```js
{
  required: true,
  placeholder: 'Enter your username'
}
```
有了 inheritAttrs: false 和 $attrs，你就可以手动决定这些 attribute 会被赋予哪个元素。在撰写基础组件的时候是常会用到的：
```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```
注意 inheritAttrs: false 选项不会影响 style 和 class 的绑定。

这个模式允许你在使用基础组件的时候更像是使用原始的 HTML 元素，而不会担心哪个元素是真正的根元素：
```html
<base-input
  label="Username:"
  v-model="username"
  required
  placeholder="Enter your username"
></base-input>
```

## 却换组件
### 使用flag标识符结合v-if和v-else切换组件
1. 页面结构：
```html
<div id="app">
    <input type="button" value="toggle" @click="flag=!flag">
    <my-com1 v-if="flag"></my-com1>
    <my-com2 v-else="flag"></my-com2>
 </div>
```

2. Vue实例定义：
```js
<script>
    Vue.component('myCom1', {
      template: '<h3>奔波霸</h3>'
    })
    Vue.component('myCom2', {
      template: '<h3>霸波奔</h3>'
    })
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        flag: true
      },
      methods: {}
    });
  </script>
```

## 使用:is属性来切换不同的子组件,并添加切换动画
1. 组件实例定义方式：
```js
    // 登录组件
    const login = Vue.extend({
      template: `<div>
        <h3>登录组件</h3>
      </div>`
    });
    Vue.component('login', login);

    // 注册组件
    const register = Vue.extend({
      template: `<div>
        <h3>注册组件</h3>
      </div>`
    });
    Vue.component('register', register);

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: { comName: 'login' },
      methods: {}
    });
```

2. 使用`component`标签，来引用组件，并通过`:is`属性来指定要加载的组件：
```html
<div id="app">
<a href="#" @click.prevent="comName='login'">登录</a>
<a href="#" @click.prevent="comName='register'">注册</a>
<hr>
<transition mode="out-in">
  <component :is="comName"></component>
</transition>
</div>
```

3. 添加切换样式：
```css
  <style>
    .v-enter,
    .v-leave-to {
      opacity: 0;
      transform: translateX(30px);
    }

    .v-enter-active,
    .v-leave-active {
      position: absolute;
      transition: all 0.3s ease;
    }

    h3{
      margin: 0;
    }
  </style>
```

## 父组件向子组件传值
1. 组件实例定义方式，注意：在子组件上一定要使用`props`属性来定义父组件传递过来的数据时接收的变量
注意： **组件中的所有props中的数据，都是通过父组件传递给子组件的，  props中的数据，都是只读的，无法重新赋值**
然后通过属性绑定`v-bind:子组件中的props="父组件中的data属性"`的方法，父组件会把data属性的值赋给子组件中的props
```js
<script>
// 创建 Vue 实例，得到 ViewModel
var vm = new Vue({
  el: '#app',
  data: {
    msg: '这是父组件中的消息'
  },
  components: {
    son: {
      template: '<h1>这是子组件 --- {{finfo}}</h1>',
      props: ['finfo']
    }
  }
});
</script>
```

2. 使用`v-bind`或简化指令，将数据传递到子组件中：
```html
<div id="app">
    <son :finfo="msg"></son> // 通过`:finfo="msg"`绑定后，会把父组件中的msg属性值赋给finfo。父组件给子组件传递它的方法的形式与这种方式类似
</div>
```

## 父组件向子组件传递父组件所拥有的方法，以及父组件获取子组件中的数据
父组件向子组件传递父组件所拥有的方法，使用的事件绑定机制`@将要在子组件生成的方法的方法名A:"父组件中的要传递的方法的方法名"`的方式，使得父组件要传递的方法的方法对象赋给了A，然后子组件内部通过`this.$emit('方法名A', 要传递的数据)`方式，来调用父组件中的方法，同时把数据传递给父组件使用

示例：
```html
<body>
	<div id="app">
    <my-component @func="show"></my-component>
	</div>
  <template id="temp1">
    <div>
      <input type="button" value="button" @click="myclick">
    </div>
  </template>

  <script>
    Vue.component("my-component", {
      template:  '#temp1',
      methods:{
        myclick(){
          this.$emit('func', 111);
        }
      }
    })
    var vm = new Vue({
      el: '#app',
      data: {
        dataFromSon: null;
      },
      methods:{
        show(num){
          this.dataFromSon = num; // 获取来自子组件的数据
          console.log("hello");
        }
      }
    })
  </script>
</body>
```

## 使用this.$refs来获取元素和组件
```html
  <div id="app">
    <div>
      <input type="button" value="获取元素内容" @click="getElement" />
      <!-- 使用 ref 获取元素 -->
      <h1 ref="myh1">这是一个大大的H1, 1</h1>
      <h1 ref="myh2">这是一个大大的H2, 1</h1>
      <h1 ref="myh2">这是一个大大的H2, 2</h1>
      <hr>
      <!-- 使用 ref 获取子组件 -->
      <my-com ref="mycom"></my-com>
    </div>
  </div>
  <script>
    Vue.component('my-com', {
      template: '<h5>这是一个子组件</h5>',
      data() {
        return {
          name: '子组件'
        }
      }
    });
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {},
      methods: {
        getElement() {
          // 通过 this.$refs 来获取元素的text内容
          console.log(this.$refs.myh1.innerText);
          console.log(this.$refs.myh2[0].innerText);
          console.log(this.$refs.myh2[1].innerText);
          // 通过 this.$refs 来获取组件中的data为name的值
          console.log(this.$refs.mycom.name);
        }
      }
    });
  </script>
```

## 父组件调用子组件中的方法
可以通过this.$refs拿到子组件中的所有方法
实例：

child1.vue
```vue
<template>
    <div>
        child1
    </div>
</template>

<script>
    export default {
        name: "child1",
        props: "msg",
        methods: {
            handleParentClick(e) {
                console.info(e)
            }
        }
    }
</script>
```

parent.vue
```vue
<template>
    <div>
        <button v-on:click="clickParent">点击</button>
        <child1 ref="child1"></child1>
    </div>
</template>

<script>
    import Child1 from './child1';
    export default {
        name: "parent",
        components: {
            child1: Child1
        },
        methods: {
            clickParent() {
                // this.$refs.child1.$emit('click-child', "high");
                this.$refs.child1.handleParentClick("ssss");
            }
        }
    }
</script>
```

## 异步组件（延迟加载组件）
在我们开始了解延迟加载组件之前，我们先来了解通常是如何加载组件的。 为此，我创建了一个Tooltip.vue组件：
```html
<!-- Tooltip.vue -->
<template>
    <h1>Hi from Tooltip!</h2>
</template>
```
这里没有什么特别之处，它就是一个简单的组件。我们可以通过本地注册，导入Tooltip组件并将其添加到components选项中，这样就可以在另一个组件中使用它。比如，在App.vue中使用它：
```vue
<!-- App.vue -->
<template>
    <div id="app">
        <Tooltip />
    </div>
</template>

<script>
    import Tooltip from "./components/Tooltip"

    export default {
        name: "App",
        components: {
            Tooltip
        }
    };
</script>
```
只要App被导入，就可以在初始加载时，Tooltip组件就会被导入、使用和加载。但是想想：只有在我们要使用组件时才加载该组件难道没有意义吗？用户很可能在不需要工具提示的情况下浏览整个系统。所以可以使用异步加载Tooltip组件

动态导入是一个返回Promise的函数，其中包含模块作为其有效的加载。下面的示例展示了如何以静态导入和动态方式导入utils模块。
```js
// 静态导入模块
import utils from './utils'
```
```js
// 动态导入
import('./utils').then(utils => {
    // 可以在这里使用utils模块
})
```
在Vue中延迟加载组件与在封装的函数中动态导入组件一样容易。在前面的例子中，我们可以像下面这样延迟加载Tooltip组件：
```js
export default {
    components: {
        Tooltip: () => import('./components/Tooltip')
    }
}
```
### 有条件地加载一个异步组件
在前面的示例中，尽管我们通过延迟加载来加载Tooltip组件，但它将在需要渲染时立即加载，这在App组件加载时就立即发生了。

然而，在实践中，我们希望将Tooltip组件加载能延迟到需要时加载，这通常是在触发某个事件之后有条件地进行，比如在按钮或文本上悬停时触发。

为了简单起见，在App组件中添加一个按钮，使用v-if有条件地渲染Tooltip组件：
```vue
<!-- App.vue -->
<template>
    <div>
        <button @click="show = true">Load Tooltip</button>
        <div v-if="show">
            <Tooltip />
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            show: false
        }),

        components: {
            Tooltip: () => import('./components/Tooltip')
        }
    }
</script>
```
请记住，Vue在需要渲染之前不会使用该组件。这意味着在点击之前不需要该组件，并且该组件将被延迟加载

### 路由中使用异步组件
```js
import Test2 from './views/Test2.vue'

var router = new VueRouter({
  routes:[
      {path: '/test2', name:"Test2页面", component: Test2},
  ]
})
```
使用异步组件如下：
```js
var router = new VueRouter({
  routes:[
      {path: '/test2', name:"Test2页面", component: () => import('./views/Tet2.vue')},
  ]
})
```

# slot与slot-scope
插槽，也就是slot，是组件的一块HTML模板，这块模板显示不显示、以及怎样显示由父组件来决定， 但是插槽显示的位置却由子组件自身决定，slot写在组件template的什么位置，父组件传过来的模板将来就显示在什么位置 
实际上，一个slot最核心的两个问题在这里就点出来了，是显示不显示和怎样显示。

## 单个插槽 
首先是单个插槽，单个插槽是vue的官方叫法，但是其实也可以叫它默认插槽，或者与具名插槽相对，我们可以叫它匿名插槽。因为它不用设置name属性。
单个插槽可以放置在组件的任意位置，但是就像它的名字一样，一个组件中只能有一个该类插槽。相对应的，具名插槽就可以有很多个，只要名字（name属性）不同就可以了。
下面通过一个例子来展示。
父组件：
```html
<template>
    <div class="father">
        <h3>这里是父组件</h3>
        <child>
            <div class="tmpl">
              <span>菜单1</span>
              <span>菜单2</span>
              <span>菜单3</span>
              <span>菜单4</span>
              <span>菜单5</span>
              <span>菜单6</span>
            </div>
        </child>
    </div>
</template>
```
子组件：
```html
<template>
    <div>
        <h3>这里是子组件</h3>
        <slot></slot>
    </div>
</template>
```
在这个例子里，因为父组件在里面写了html模板，那么子组件的匿名插槽这块模板就是下面这样。也就是说，子组件的匿名插槽被使用了，是被下面这块模板使用了。
```html
<div class="tmpl">
  <span>菜单1</span>
  <span>菜单2</span>
  <span>菜单3</span>
  <span>菜单4</span>
  <span>菜单5</span>
  <span>菜单6</span>
</div>
```
最终的渲染结果如图所示：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210516204123.png" width="700px"/>

## 具名插槽
匿名插槽没有name属性，所以是匿名插槽，那么，插槽加了name属性，就变成了具名插槽。具名插槽可以在一个组件中出现N次，出现在不同的位置。下面的例子，就是一个有两个具名插槽和单个插槽的组件，这三个插槽被父组件用同一套css样式显示了出来，不同的是内容上略有区别。
父组件：
```html
<template>
  <div class="father">
    <h3>这里是父组件</h3>
    <child>
      <div class="tmpl" slot="up">
        <span>菜单1</span>
        <span>菜单2</span>
        <span>菜单3</span>
        <span>菜单4</span>
        <span>菜单5</span>
        <span>菜单6</span>
      </div>
      <div class="tmpl" slot="down">
        <span>菜单-1</span>
        <span>菜单-2</span>
        <span>菜单-3</span>
        <span>菜单-4</span>
        <span>菜单-5</span>
        <span>菜单-6</span>
      </div>
      <div class="tmpl">
        <span>菜单->1</span>
        <span>菜单->2</span>
        <span>菜单->3</span>
        <span>菜单->4</span>
        <span>菜单->5</span>
        <span>菜单->6</span>
      </div>
    </child>
  </div>
</template>
```
子组件：
```html
<template>
  <div>
    // 具名插槽
    <slot name="up"></slot>
    <h3>这里是子组件</h3>
    // 具名插槽
    <slot name="down"></slot>
    // 匿名插槽
    <slot></slot>
  </div>
</template>
```
显示结果如图：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210516204237.png" width="700px"/>

可以看到，父组件通过html模板上的slot属性关联具名插槽。没有slot属性的html模板默认关联匿名插槽。

## slot-scope/作用域插槽/带数据的插槽
最后，就是我们的作用域插槽。这个稍微难理解一点。官方叫它作用域插槽，实际上，对比前面两种插槽，我们可以叫它带数据的插槽。什么意思呢，就是前面两种，都是在组件的template里面写
```html
//匿名插槽
<slot></slot>

//具名插槽
<slot name="up"></slot>
```

但是作用域插槽要求，在slot上面绑定数据。也就是你得写成大概下面这个样子。
```html
<slot name="up" :data="data"></slot>
 export default {
    data: function(){
      return {
        data: ['zhangsan','lisi','wanwu','zhaoliu','tianqi','xiaoba']
      }
    },
}
```
我们前面说了，插槽最后显示不显示是看父组件有没有在child下面写模板，像下面那样。
```html
<child>
   html模板
</child>
```
写了，插槽就总得在浏览器上显示点东西，东西就是html该有的模样，没写，插槽就是空壳子，啥都没有。
OK，我们说有html模板的情况，就是父组件会往子组件插模板的情况，那到底插一套什么样的样式呢，这由父组件的html+css共同决定，但是这套样式里面的内容呢？
正因为作用域插槽绑定了一套数据，父组件可以拿来用。于是，情况就变成了这样：样式父组件说了算，但内容可以显示子组件插槽绑定的。
我们再来对比，作用域插槽跟单个插槽和具名插槽的区别，因为单个插槽和具名插槽不绑定数据，所以父组件提供的模板一般要既包括样式又包括内容，上面的例子中，你看到的文字，“菜单1”，“菜单2”都是父组件自己提供的内容；而作用域插槽，父组件只需要提供一套样式（在确实用作用域插槽绑定的数据的前提下）。
下面的例子，你就能看到，父组件提供了三种样式(分别是flex、ul、直接显示)，都没有提供数据，数据使用的都是子组件插槽自己绑定的那个数组（一堆人名的那个数组）。

父组件：
```html
<template>
  <div class="father">
    <h3>这里是父组件</h3>
    <!--第一次使用：用flex展示数据-->
    <child>
      <template slot-scope="user">
        <div class="tmpl">
          <span v-for="item in user.data">{{item}}</span>
        </div>
      </template>

    </child>

    <!--第二次使用：用列表展示数据-->
    <child>
      <template slot-scope="user">
        <ul>
          <li v-for="item in user.data">{{item}}</li>
        </ul>
      </template>

    </child>

    <!--第三次使用：直接显示数据-->
    <child>
      <template slot-scope="user">
       {{user.data}}
      </template>

    </child>

    <!--第四次使用：不使用其提供的数据, 作用域插槽退变成匿名插槽-->
    <child>
      我就是模板
    </child>
  </div>
</template>
```
子组件：
```html
<template>
  <div class="child">

    <h3>这里是子组件</h3>
    // 作用域插槽
    <slot  :data="data"></slot>
  </div>
</template>

 export default {
    data: function(){
      return {
        data: ['zhangsan','lisi','wanwu','zhaoliu','tianqi','xiaoba']
      }
    }
}
```
结果如图所示：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210516204458.png" width="700px"/>


# 路由
1. 后端路由：对于普通的网站，所有的超链接都是URL地址，所有的URL地址都对应服务器上对应的资源；
2. 前端路由：对于单页面应用程序来说，主要通过URL中的hash(#号)来实现不同页面之间的切换，同时，hash有一个特点：HTTP请求中不会包含hash相关的内容；所以，单页面程序中的页面跳转主要用hash实现；
3. 在单页面应用程序中，这种通过hash改变来切换页面的方式，称作前端路由（区别于后端路由）；

* 后端路由: 输入url -》请求发送到服务器 -》服务器解析请求的路径 -〉拿到对应的页面 -》 返回回去
* 前端路由: 输入url -〉js解析地址 -》找到对应的地址页面 -〉执行页面生产的js -》 看到页面


## vue-router
1. 导入 vue-router 组件类库：
```html
<!-- 1. 导入 vue-router 组件类库 -->
<script src="./lib/vue-router-2.7.0.js"></script>
```

2. 使用 router-link 组件来导航
```html
<!-- 使用 router-link 组件来导航，router-link默认渲染为一个a标签，可以通过tag属性来改变-->
<router-link to="/login" tag="span">登录</router-link>
<router-link to="/register">注册</router-link>

<!-- 或者 使用 a标签 组件来导航 -->
<a href="#/login">登录</a>
<a href="#/register">注册</a>
```

3. 使用`router-view`组件来显示匹配到的组件
```html
<!-- 3. 使用`router-view`组件来显示匹配到的组件 -->
<!-- 这是 vue-router 提供的元素，专门用来当作占位符的，将来路由规则匹配到的组件，就会展示到这个router-view中去  -->
<router-view></router-view>
```

4. 创建使用`Vue.extend`创建组件
```js
// 4.1 使用 Vue.extend 来创建登录组件
var login = Vue.extend({
    template: '<h1>登录组件</h1>'
});
// 4.2 使用 Vue.extend 来创建注册组件
var register = Vue.extend({
    template: '<h1>注册组件</h1>'
});

// 4.2 使用 Vue.extend 来创建注册组件
var error = Vue.extend({
    template: '<h1>找不到页面</h1>'
});
```

5. 创建一个路由 router 实例，通过 routers 属性来定义路由匹配规则
```js
// 5. 创建一个路由router实例，通过 routers 属性来定义路由匹配规则
var router = new VueRouter({
    routes: [
        // path：表示监听哪个前端路由链接地址
        //component的属性值必需要是一个组件对象，而不能是组件的引用名称
        //redirect表示重定向另一个前端路由链接地址
        { path: '/', redirect: '/login' }, 
        { path: '/login', component: login },
        { path: '/register', component: register }
        { path: '*', component: error} //找不到页面时的配置, 会使用error组件
    ]
});
```

6. 使用 router 属性来使用路由规则
```js
// 6. 创建 Vue 实例，得到 ViewModel
var vm = new Vue({
    el: '#app',
    router: router // 将路由规则对象注册到vm实例上，用来监听url地址的变化，然后展示对应的组件
});
```

**注：当一个组件要用于路由匹配规则跳转时，不能使用如下方式来创建组件**
```
Vue.component("login",{
  template: '...'
})
```
因为此时的login只是组件的引用名称，而不是一个组件对象。而routes属性中的component属性值必须要是一个组件对象，而不能使组件的引用名称， 所以如果按照上述的方式来创建组件，那么`{ path: '/login', component: login }`的写法是无法识别该组件的

## 路由传参
**第一种方式：query方法**
```js
{ path: '/login', component: login }
```
2. 通过 `this.$route.query`来获取路由中的参数：
```js
<router-link to="/login?id=10&name=whz">login<router-link>

<router-view><router-view>

var login = Vue.extend({
    template: '<h1>注册组件 --- {{this.$route.query.id}}---{{this.$router.query.name}}</h1>',
    create(){
      console.log(this.$route.query)//在控制台输出query对象
    }
});
```
此时`/login?id=10&name=whz`的前端路由能够被匹配到，且展示相应的login组件

**第二种方式：params方法**
1. 在规则中定义参数：
```js
{ path: '/register/:id/:name', component: login }
```
2. 通过 `this.$route.params`来获取路由中的参数：
```js
<router-link to="/login/10/whz">login<router-link>

<router-view><router-view>

var login = Vue.extend({
    template: '<h1>注册组件 --- {{this.$route.params.id}}---{{this.$route.params.name}}</h1>',
    create(){
      console.log(this.$route.params) //在控制台输出params对象
    }
});
```

## 路由嵌套
实际生活中的应用界面，通常由多层嵌套的组件组合而成。同样地，URL 中各段动态路径也按某种结构对应嵌套的各层组件，例如：
```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```
借助 vue-router的children属性，使用嵌套路由配置，就可以很简单地表达这种关系。
```html
<div id="app">
  <router-view></router-view>
</div>
```
```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }]
})
```
这里的`<router-view>`是最顶层的出口，渲染最高级路由匹配到的组件。同样地，一个被渲染组件同样可以包含自己的嵌套 `<router-view>`。例如，在 User 组件的模板添加一个 `<router-view>`：

```js
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```
要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```
要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。

此时，基于上面的配置，当你访问 /user/foo 时，User 的出口是不会渲染任何东西，这是因为没有匹配到合适的子路由。如果你想要渲染点什么，可以提供一个 空的 子路由：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome }

        // ...其他子路由
      ]
    }
  ]
})
```

## 动态生成路由
利用 vue-router 的 addRoutes 方法可以动态添加路由。
**router.addRoutes**
```js
router.addRoutes(routes: Array<RouteConfig>)
```
动态添加更多的路由规则。参数必须是一个符合 routes 选项要求的数组。

举个例子：
```js
const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/Login.vue')
        },
        {path: '/', redirect: '/home'},
    ]   
})
```
上面的代码和下面的代码效果是一样的
```js
const router = new Router({
    routes: [
        {path: '/', redirect: '/home'},
    ]   
})

router.addRoutes([
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/Login.vue')
    }
])
```

**注：使用router.addRoutes动态添加路由后，router.options.routes是不会更新的。**
解决方法：
1. 在addroutes前，使用router.options.routes=XXXXX的方法手动添加
2. 使用vue作者的方法，在vuex store里维护一个routes对象，然后使用这个对象遍历生成侧面导航栏

## 命名视图
一般情况下，一个页面里面可能有多个组件，比如侧边栏，内容区，侧边栏是一个组件、内容区是一个组件，我们普遍会将两个组件作为子组件添加到主页面中，因为页面中只有一个router-view视图，那么问题来了，怎么让一个页面中有多个视图呢，拥有多个视图，很随意，多写几个router-view标签就行了，但是每个router-view视图里面显示的相同的内容，这是一个问题，多写几个视图好像没什么用，那么怎么让一个页面中的多个视图显示不同的内容呢？
下面就来介绍命名视图的作用，首先，一般情况下，我们在路由配置中，一个路由路径只能对应一个组件，若想对应多个组件，必须得作为子组件存在，然后再一个公用的视图内显示，这是一个路由对应多个组件，这些组件对应一个视图
例如：
```json
{
　　path:'tv',
　　name:'tv',
　　component:Tv,
　　children:[
　　　　{path:'',component:Zhonghe},
　　　　{path:'zhonghe',component:Zhonghe},
　　　　{path:'guochan',component:Guochan},
　　　　{path:'yingmei',component:Yingmei},
　　　　{path:'riju',component:Riju},
　　　　{path:'hanju',component:Hanju}
　　]
},
```
那么，下面来介绍命名视图：有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar (侧导航) 和 main (主内容) 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 router-view 没有设置名字，那么默认为 default。
```js
<router-view></router-view>
<router-view name="a"></router-view>
<router-view name="b"></router-view>
```
一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components配置 (带上 s)：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```
解释一下：
在这个默认路由下，
第一个非未命名视图显示Foo组件
第二个name名为a的视图显示Bar组件
第二个name名为b的视图显示Baz组件

## 设置路由切换动效
示例：
```html
  <style>
    .router-link-active,
    .myactive {
      color: red;
      font-weight: 800;
      font-style: italic;
      font-size: 80px;
      text-decoration: underline;
      background-color: green;
    }

    .v-enter,
    .v-leave-to {
      opacity: 0;
      transform: translateX(140px);
    }

    .v-enter-active,
    .v-leave-active {
      transition: all 0.5s ease;
    }
  </style>
</head>

<body>
  <div id="app">

    <!-- <a href="#/login">登录</a> -->
    <!-- <a href="#/register">注册</a> -->

    <!-- router-link 默认渲染为一个a 标签 -->
    <router-link to="/login" tag="span">登录</router-link>
    <router-link to="/register">注册</router-link>

    <!-- 这是 vue-router 提供的元素，专门用来 当作占位符的，将来，路由规则，匹配到的组件，就会展示到这个 router-view 中去 -->
    <!-- 所以： 我们可以把 router-view 认为是一个占位符 -->
    <transition mode="out-in">
      <router-view></router-view>
    </transition>
  </div>

  <script>
    // 组件的模板对象
    var login = {
      template: '<h1>登录组件</h1>'
    }

    var register = {
      template: '<h1>注册组件</h1>'
    }


    /*  Vue.component('login', {
       template: '<h1>登录组件</h1>'
     }) */

    // 2. 创建一个路由对象， 当 导入 vue-router 包之后，在 window 全局对象中，就有了一个 路由的构造函数，叫做 VueRouter
    // 在 new 路由对象的时候，可以为 构造函数，传递一个配置对象
    var routerObj = new VueRouter({
      // route // 这个配置对象中的 route 表示 【路由匹配规则】 的意思
      routes: [ // 路由匹配规则 
        // 每个路由规则，都是一个对象，这个规则对象，身上，有两个必须的属性：
        //  属性1 是 path， 表示监听 哪个路由链接地址；
        //  属性2 是 component， 表示，如果 路由是前面匹配到的 path ，则展示 component 属性对应的那个组件
        // 注意： component 的属性值，必须是一个 组件的模板对象， 不能是 组件的引用名称；
        // { path: '/', component: login },
        { path: '/', redirect: '/login' }, // 这里的 redirect 和 Node 中的 redirect 完全是两码事
        { path: '/login', component: login },
        { path: '/register', component: register }
      ],
      linkActiveClass: 'myactive'   //经路由选中时的样式类替换成myactive
    })

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {},
      methods: {},
      router: routerObj // 将路由规则对象，注册到 vm 实例上，用来监听 URL 地址的变化，然后展示对应的组件
    });
  </script>
</body>
```

## vue-router的两种模式
vue-router中提供两种模式，分别是hash模式与history模式。
vur-router默认是使用hash模式，我们可以通过在VueRouter的构造函数中添加`mode:'history'`代码来使用history模式，如下：
```js
var router = new VueRouter({
  mode: 'history',
  routes:[
    ...
  ]
})
```

**为什么要有 hash 和 history**

详情请见计算机网络.md

对于 Vue 这类渐进式前端开发框架，为了构建 SPA（单页面应用），需要引入前端路由系统，这也就是 Vue-Router 存在的意义。前端路由的核心，就在于改变视图的同时不会向后端发出请求。

为了达到这一目的，浏览器当前提供了以下两种支持：
- hash模式：即地址栏 URL 中的 # 符号（此 hash 不是密码学里的散列运算）。比如这个 URL：http://www.abc.com/#/hello，hash 的值为 #/hello。它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。
- history：利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。（需要特定浏览器支持）这两个方法应用于浏览器的历史记录栈，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。只是当它们执行修改时，**虽然改变了当前的 URL，但浏览器不会立即向后端发送请求**。
 
因此可以说，hash 模式和 history 模式都属于浏览器自身的特性，Vue-Router 只是利用了这两个特性（通过调用浏览器提供的接口）来实现前端路由。

### 使用场景
一般场景下，hash 和 history 都可以，除非你更在意颜值，# 符号夹杂在 URL 里看起来确实有些不太美丽。

>如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成URL 跳转而无须重新加载页面。—— Vue-router 官网。

另外，根据 Mozilla Develop Network 的介绍，调用 history.pushState() 相比于直接修改 hash，存在以下优势：
- pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL；
- pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中；
- pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串；
- pushState() 可额外设置 title 属性供后续使用。

当然啦，history 也不是样样都好。SPA 虽然在浏览器里游刃有余，但真要通过 URL 向后端发起 HTTP 请求时，两者的差异就来了。尤其在用户手动输入 URL 后回车，或者刷新（重启）浏览器的时候。
- hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 http://www.abc.com，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。
- history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.abc.com/book/id。如果后端缺少对 /book/id 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”

## 路由中的钩子函数（导航守卫）
总体来讲vue路由里面提供了三大类钩子(守卫)
1. 全局钩子
2. 某个路由独享的钩子
3. 组件内钩子

### 全局钩子函数
```js
router.beforeEach((to, from, next) => {
  /* must call `next` */
})

router.afterEach((to, from) => {})
```

当一个导航触发时，全局前置守卫按照创建顺序调用
每个守卫方法接收三个参数：
1. `to`: (route路由对象)  表示即将要进入的目标的路由对象，to对象下面的属性： path、params、query、hash、fullPath、matched、name、meta（在matched下，但是本例可以直接用）
2. `from`: (route路由对象)  表示当前导航正要离开的路由对象
3. `next`: (Function函数)   一定要调用该方法来 resolve 这个钩子。  调用方法：next(参数或者空)   ***必须调用
  - next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
  - next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
  - next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。
  - next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。

### 某个路由独享的钩子
就像说的一样，给某个路由单独使用的，本质上和后面的组件内钩子是一样的。都是特指的某个路由。不同的是，这里的一般定义在router当中，而不是在组件内。如下
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      },
      beforeLeave: (to, from, next) => {
        // ...
      }
    }
  ]
})
```
### 组件内钩子
你可以在路由组件内直接定义以下路由导航钩子： 如下
```js
export default{
  name:'test',
  data() {},
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不能获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```
注意：beforeRouteEnter钩子不能访问this，因为钩子在导航确认前被调用，因此即将登场的新组件还没被创建。

不过，你可以通过传一个回调给next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```
你可以 在 beforeRouteLeave中直接访问this。这个leave钩子通常用来禁止用户在还未保存修改前突然离开。可以通过next(false)来取消导航。
同时注意必须有这个next()，相当于一个按钮开启一样。

## 区分route对象与router对象
`this.$route`是路由参数对象，所有路由中的参数，其中包含params, query都属于它
`this.$router`是路由导航对象， 用它可以方便的使用JS代码来实现路由的前进、后退、跳转到行的URL 地址
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210513145052.png" width="700px"/>
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210513145226.png" width="700px"/>

## vue-router原理解析
我们在页面中使用vue-router一般是这样的：
```html
    <!--这是App.vue组件-->
    <div>
        <div>
            <!--这里放导航-->
            <router-link to="/home">home</router-link>
            <router-link to="/about">about</router-link>
        </div>
        
        <!--这里是导航对应的组件要渲染的地方-->
        <router-view></router-view>
    </div>
```
当我们点击home导航，`<router-view></router-view>`里就会展示home组件对应的内容
当我们点击about导航，`<router-view></router-view>`里就会展示about组件对应的内容

### 基本原理
```html
<router-link to="/home">home</router-link>
<router-link to="/about">about</router-link>
```
会被解析为
```html
<a href="#/home">home</a>
<a href="#/about">about</a>
```
当我们点击`<a href="#/home">home</a>`时，页面链接的hash就变成了#/home，这会触发hashchange事件，我们通过监听hashchange事件，可以拿到当前页面的hash变为了#/home，然后可以通过/home拿到其对应的组件，再将组件放到`<router-view></router-view>`组件里渲染出来就可以了。

如何通过/home拿到对应的组件呢，因为我们创建router实例的时候会先创建一个类似下面routes的路由配置对象，通过该对象可以拿到当前路由对应的组件。
```js
const routes = [
    { path: '/home', component: Home },
    { path: '/about', component: About }
  ]
```
以上就是从路由变化到路由跳转的一个基本过程。

### 路由嵌套原理
我们在写路由的时候有时候会写嵌套路由，配置对象类似下面这样，我们在/about路由下添加了children属性，保存其子路由：
```js
import Home from './components/Home';
import About from './components/About';
import RouterLearn from './components/RouterLearn';

const routes = [
    { path: '/home', component: Home },
    { 
        path: '/about',
        component: About, 
        // 子路由
        children: [
            {
                path: 'routerLearn',
                component: RouterLearn
            }
        ]
    }
  ]
```
单文件组件里面会这么引用：
App.vue组件
```html
<template>
    <div>
        <p>这是App组件</p>
        <div>
            <router-link to="/home">home</router-link>
            <router-link to="/about/routerLearn">about/routerLearn</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>
```
About组件
```html
<template>
    <div>
        这是about组件
        <router-view></router-view>
    </div>
</template>
```
当我们点击`<router-link to="/about/routerLearn">routerLearn</router-link>`导航时，页面的hash会变成#/about/routerLearn，所以这个时候要实现的是App.vue组件里的`<router-view></router-view>`渲染的是About组件，About组件里的`<router-view></router-view>`里面渲染的是routerLearn组件。

**关键是如何让`<router-view></router-view>`知道自己该渲染的是哪个组件呢，实现方法是：**
1. 给每个router-view组件计算出自己的深度，最外层的router-view其深度为0，即index.html中的`<router-view>`，如果router-view渲染的组件里又有router-view，那么这个嵌套的router-view深度就是1，计算方法如下：
```js
 vue.component('router-view', {
        render(h) {
        
            // 如果是router-view组件，就在实例上设置一个标识
            this.routerView = true;

            // 获取当前router-view的深度,初始值为0
            let depth = 0;
            let parent = this.$parent; // 父组件实例
            
            // 向上递归查找父组件，如果找到depth就+1，最终计算出的depth即为该router-view的深度
            while (parent) {
               if (parent.routerView) depth++;
                parent = parent.$parent;
            }

            // 根据当前router-view的深度，从匹配的路由中拿到对应的组件
            let com = this.$router.matched[depth].component;

            return h(com);
        }
    });
```
2. 根据路由配置对象以及当前页面的hash，计算出匹配当前页面hash的路由数组，计算方法如下：
```js
// 路由配置对象是这样的
const routes = [
    { path: '/home', component: Home },
    { 
        path: '/about',
        component: About, 
        // 子路由
        children: [
            {
                path: 'routerLearn',
                component: RouterLearn
            }
        ]
    }
  ]
  
  // 当前的页面hash为 #/about/routerLearn
  let current = '#/about/routerLearn';
  
  // 得到当前hash匹配的路由数组metched
  // 这里matched会得到 [About路由配置对象， RouterLearn路由配置对象]
  let matched = match(routes);

    // 递归遍历routes，获取当前hash匹配的路由
    function match(routes) {
        for (const route of routes) {
            if (this.current.indexOf(route.path) !== -1) {
                this.matched.push(route);
                if (route.children) {
                    this.match(route.children);
                }
            }
        }
    }
```
3. 计算出router-view的深度，以及拿到matched数组后，就能知道每个router-view该渲染哪个组件了，需要渲染的组件为`matched[depth].component`, **并且会渲染得到的matched数组中所有的组件到相应的`<router-view/>`中**，因为子组件的`<router-view>`不能脱离其父组件而存在， 其证明见下：

假设此我的路由配置如下：
```js
import Test1 from './views/Test1.vue'
import Test2 from './views/Test2.vue'
import Test3 from './views/Test3.vue'

var router = new VueRouter({
  routes:[
    {path:'/home', component: Home, children:[
      {path: '/test1', component: Test1},
      {path: 'test2', component: Test1},
    ]},
    {path: '/test3', component: Test2},
  ]
})
```
Test1.vue
```
<template>
  <div>Test1</div>
</template>
```
Test2.vue
```
<template>
  <div>Test2</div>
</template>
```
Test3.vue
```
<template>
  <div>Test3</div>
</template>
```
- 此时如果我们在浏览器中输入localhost:3000/test3, 会出现下面情况：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210513142545.png" width="700px"/>

- 输入localhost:3000/home/test2, 会出现下面情况：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210513143037.png" width="700px"/>
可见同时渲染了Home组件

- 输入localhost:3000/test1, 会出现下面情况：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210513142719.png" width="700px"/>
可见同时也渲染了Home组件

## Vue-router中keep-alive的理解
### 什么是keep-alive
keep-alive用来缓存组件,避免多次加载相应的组件,减少性能消耗，简单一点来说就是从页面1链接到其他页面后回退到页面1不用在重新执行页面1的代码，只会从缓存中加载之前已经缓存的页面1，这样可以减少加载时间及性能消耗，提高用户体验性。
### keep-alive的作用是什么
通过设置了keep-alive，可以简单理解为从页面1跳转到页面2后，然后后退到页面1，只会加载缓存中之前已经渲染好的页面1，而不会再次重新加载页面1，及不会再触发页面一种的created等类似的钩子函数，除非自己重新刷新该页面1。


### 什么时候用keep-alive
如果需要频繁切换路由，这个时候就可以考虑用keep-alive了，来达到避免数据的重复请求的目的。

### 怎么用keep-alive
```html
<keep-alive>
    <router-view> </router-view>
</keep-alive>
```

将首次触发请求写在created钩子函数中,就能实现缓存,
如果你需要缓存部分页面或者组件，可以使用如下方法：

1. 使用router. meta属性
```html
<keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>

<router-view v-if="!$route.meta.keepAlive"></router-view>
```
```js
routes:[
  {path: '/test1', component: test1, meta: {keepAlive: true}},
  {path: '/test2', component: test2, meta: {keepAlive: false}}
]
```

2. 使用新增属性inlcude/exclude
```html
<keep-alive exclude="test1">
    <router-view> </router-view>
</keep-alive>
```
同时必须在test1组件js部分添加name: 'test1'
表示除了test1，其他都使用keep-alive
其中，也可动态设置，如下
```html
<keep-alive :exclude="components">
    <router-view> </router-view>
</keep-alive>
```

# 编程式的导航
除了使用 `<router-link>` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。
## router.push
**注意：在 Vue 实例内部，你可以通过`$router`访问路由实例。因此你可以调用`this.$router.push`。**

想要导航到不同的 URL，则使用 `router.push` 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。
当你点击 `<router-link>` 时，这个方法会在内部调用`router.push()`，所以说，点击 `<router-link :to="...">` 等同于调用 `router.push(...)`。

| 声明式                    | 编程式             |
| ------------------------- | ------------------ |
| `<router-link :to="...">` | `router.push(...)` |
该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：
```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```
**注意：如果提供了path，则params会被忽略，上述例子中的query并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：**
```js
const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```

同样的规则也适用于 `router-link` 组件的 `to` 属性。
在 2.2.0+，可选的在 `router.push` 或 `router.replace` 中提供 `onComplete` 和 `onAbort` 回调作为第二个和第三个参数。这些回调将会在导航成功完成 (在所有的异步钩子被解析之后) 或终止 (导航到相同的路由、或在当前导航完成之前导航到另一个不同的路由) 的时候进行相应的调用。
**注意**： 如果目的地和当前路由相同，只有参数发生了改变 (比如从一个用户资料到另一个 `/users/1` -> `/users/2`)，你需要使用 [`beforeRouteUpdate`](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#响应路由参数的变化) 来响应这个变化 (比如抓取用户信息)。

## router.replace
跟 `router.push` 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。
| 声明式                            | 编程式                |
| --------------------------------- | --------------------- |
| `<router-link :to="..." replace>` | `router.replace(...)` |

## router.go
这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 `window.history.go(n)`。
例子
```js
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```

## History
你也许注意到 `router.push`、 `router.replace` 和 `router.go` 跟 [`window.history.pushState`、 `window.history.replaceState` 和 `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History)好像， 实际上它们确实是效仿 `window.history`API 的。
因此，如果你已经熟悉 [Browser History APIs](https://developer.mozilla.org/en-US/docs/Web/API/History_API)，那么在 Vue Router 中操作 history 就是超级简单的。
还有值得提及的，Vue Router 的导航方法 (`push`、 `replace`、 `go`) 在各类路由模式 (`history`、 `hash` 和 `abstract`) 下表现一致。


# 在普通页面中使用render函数渲染组件
## 常规渲染组件
1. 放到对应的插槽
2. 不会覆盖
```html
<div id="app">
    {{msg}}
    <login></login>
</div>
<script src="node_modules/vue/dist/vue.js"></script>
<script>
  let login = {
    template: "<div>login zujian</div>"
  };
  let vm = new Vue({
    el: "#app",
    data: {
      msg: "maotai"
    },
    components: {
      login,
    }
  })
</script>
```

## render渲染组件
1. 覆盖#app下的
```html
<body>
<div id="app">
    hellow
</div>
<script src="node_modules/vue/dist/vue.js"></script>
<script>
  let login = {
    template: "<div>login zujian</div>"
  };
  let vm = new Vue({
    el: "#app",
    data: {
      msg: "maotai"
    },
    render: function (createElements) { //createElements是一个方法,调用它能够把指定的组件模板,渲染为对应的html
      // 这里return的结果会替换页面中的#app的哪个容器,所以不要把路由的<router-view>和<view-link>直接写到el所控制的元素中
      return createElements(login); 
    }
  })
</script>
```

render简写
```js
let vm = new Vue({
    el: "#app",
    render: c => c(login),
});
```

# 自定义指令
除了核心功能默认内置的指令 (v-model 和 v-show)，Vue 也允许注册自定义指令。注意，在 Vue2.0 中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。举个聚焦输入框的例子，如下：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210718021153.png" width="200px"/>

当页面加载时，该元素将获得焦点 (注意：autofocus 在移动版 Safari 上不工作)。事实上，只要你在打开这个页面后还没点击过任何内容，这个输入框就应当还是处于聚焦状态。现在让我们用指令来实现这个功能：
```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```
如果想注册局部指令，组件中也接受一个 directives 的选项：
```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```
然后你可以在模板中任何元素上使用新的 v-focus property，如下：
```html
<input v-focus>
```

## 钩子函数
一个指令定义对象可以提供如下几个钩子函数 (均为可选)：
- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- `update`：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
- `componentUpdated`：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- `unbind`：只调用一次，指令与元素解绑时调用。

接下来我们来看一下钩子函数的参数 (即 el、binding、vnode 和 oldVnode)。

## 钩子函数参数
指令钩子函数会被传入以下参数：
- `el`：指令所绑定的元素，可以用来直接操作 DOM。
- `binding`：一个对象，包含以下 property：
  - `name`：指令名，不包括 v- 前缀。
  - `value`：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
  - `oldValue`：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
  - `arg`：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
  - `modifiers`：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
- `vnode`：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
- `oldVnode`  ：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

> 除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行。

这是一个使用了这些 property 的自定义钩子样例：
```html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210718021509.png" width="500px"/>




# 避免内存泄漏 
## 简介
如果你在用 Vue 开发应用，那么就要当心内存泄漏的问题。这个问题在单页应用 (SPA) 中尤为重要，因为在 SPA 的设计中，用户使用它时是不需要刷新浏览器的，所以 JavaScript 应用需要自行清理组件来确保垃圾回收以预期的方式生效。

内存泄漏在 Vue 应用中通常不是来自 Vue 自身的，更多地发生于把其它库集成到应用中的时候。

## 基本的示例
接下来的示例展示了一个由于在一个 Vue 组件中使用 Choices.js 库而没有将其及时清除导致的内存泄漏。等一下我们再交代如何移除这个 Choices.js 的足迹进而避免内存泄漏。

下面的示例中，我们加载了一个带有非常多选项的选择框，然后我们用到了一个显示/隐藏按钮，通过一个 v-if 指令从虚拟 DOM 中添加或移除它。这个示例的问题在于这个 v-if 指令会从 DOM 中移除父级元素，但是我们并没有清除由 Choices.js 新添加的 DOM 片段，从而导致了内存泄漏。

```html
<link rel="stylesheet prefetch" href="https://joshuajohnson.co.uk/Choices/assets/styles/css/choices.min.css?version=3.0.3">
<script src="https://joshuajohnson.co.uk/Choices/assets/scripts/dist/choices.min.js?version=3.0.3"></script>

<div id="app">
  <button
    v-if="showChoices"
    @click="hide"
  >Hide</button>
  <button
    v-if="!showChoices"
    @click="show"
  >Show</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>
```

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      // 我们来为选择框载入很多选项
      // 这样的话它会占用大量的内存
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      this.showChoices = false
    }
  }
})
```
为了实际观察一下这个内存泄露，请使用 Chrome 打开这个 CodePen 示例然后打开 Chrome 的任务管理器。Mac 下打开 Chrome 任务管理器的方式是选择 Chrome 顶部导航 > 窗口 > 任务管理；在 Windows 上则是 Shift + Esc 快捷键。现在点击展示/隐藏按钮 50 次左右。你应该在 Chrome 任务管理中发现内存的使用在增加并且从未被回收。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210714132142.png" width="400px"/>

## 解决这个内存泄漏问题
在上述的示例中，我们可以用 hide() 方法在将选择框从 DOM 中移除之前做一些清理工作，来解决内存泄露问题。为了做到这一点，我们会在 Vue 实例的数据对象中保留一个 property，并会使用 Choices API 中的 destroy() 方法将其清除。

通过这个更新之后的 CodePen 示例可以再重新看看内存的使用情况。
```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true,
      choicesSelect: null
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      // 在我们的 Vue 实例的数据对象中设置一个 `choicesSelect` 的引用
      this.choicesSelect = new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      // 现在我们可以让 Choices 使用这个引用
      // 在从 DOM 中移除这些元素之前进行清理工作
      this.choicesSelect.destroy()
      this.showChoices = false
    }
  }
})
```

## 这样做的价值
内存管理和性能测试在快速交付的时候是很容易被忽视的，然而，保持小内存开销仍然对整体的用户体验非常重要。

考虑一下你的用户使用的设备类型，以及他们通常情况下的使用方式。他们使用的是内存很有限的上网本或移动设备吗？你的用户通常会做很多应用内的导航吗？如果其中之一是的话，那么良好的内存管理实践会帮助你避免糟糕的浏览器崩溃的场景。即便都不是，因为一个不小心，你的应用在经过持续的使用之后，仍然有潜在的性能恶化的问题。

## 实际的例子
在上述示例中，我们使用了一个 v-if 指令产生内存泄漏，但是一个更常见的实际的场景是使用 Vue Router 在一个单页应用中路由到不同的组件。

就像这个 v-if 指令一样，当一个用户在你的应用中导航时，Vue Router 从虚拟 DOM 中移除了元素，并替换为了新的元素。Vue 的 beforeDestroy() 生命周期钩子是一个解决基于 Vue Router 的应用中的这类问题的好地方。

我们可以将清理工作放入`beforeDestroy()`钩子，像这样：
```js
beforeDestroy: function () {
  this.choicesSelect.destroy()
}
```

## 替代方案
我们已经讨论了移除元素时的内存管理，但是如果你打算在内存中保留状态和元素该怎么做呢？这种情况下，你可以使用内建的 keep-alive 组件。

当你用 keep-alive 包裹一个组件后，它的状态就会保留，因此就留在了内存里。
```html
<button @click="show = false">Hide</button>
<keep-alive>
  <!-- `<my-component>` 即便被删除仍会刻意保留在内存里 -->
  <my-component v-if="show"></my-component>
</keep-alive>
```
这个技巧可以用来提升用户体验。例如，设想一个用户在一个文本框中输入了评论，之后决定导航离开。如果这个用户之后导航回来，那些评论应该还保留着。

一旦你使用了 keep-alive，那么你就可以访问另外两个生命周期钩子：activated 和 deactivated。如果你想要在一个 keep-alive 组件被移除的时候进行清理或改变数据，可以使用 deactivated 钩子。
```js
deactivated: function () {
  // 移除任何你不想保留的数据
}
```

## 总结
Vue 让开发非常棒的响应式的 JavaScript 应用程序变得非常简单，但是你仍然需要警惕内存泄漏。这些内存泄漏往往会发生在使用 Vue 之外的其它进行 DOM 操作的三方库时。请确保测试应用的内存泄漏问题并在适当的时机做必要的组件清理。

# 在webpack中配置.vue组件页面的解析
## 在普通网页中使用vue：
1. 使用script标签，引入vue的包
2. 在index页面中，创建一个id为app的div容器
3. 通过new Vue 得到一个vm的实例

## 在webpack搭建一个vue

**项目模板**
项目目录结构
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210406185309.png" width="700px"/>

- package.json文件
```json
{
  "name": "template",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack server --hot --port 3000"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.21.1",
    "element-ui": "^2.15.1",
    "file-loader": "^6.2.0",
    "font-awesome": "^4.7.0",
    "jquery": "^3.6.0",
    "node-sass": "^6.0.0",
    "qs": "^6.10.1",
    "sass-loader": "^11.1.0",
    "url-loader": "^4.1.1",
    "vue": "^2.6.12",
    "vue-router": "^3.5.1",
    "vuex": "^3.6.2",
  },
  "devDependencies": {
    "@babel/core": "^7.13.10",
    "@babel/preset-env": "^7.13.10",
    "@babel/plugin-transform-runtime": "^7.0.0",
    "babel-loader": "^8.2.2",
    "babel-preset-stage-0": "^6.24.1",
    "css-loader": "^5.1.3",
    "html-webpack-plugin": "^5.3.1",
    "style-loader": "^2.0.0",
    "vue-loader": "^15.9.7",
    "vue-template-compiler": "^2.6.12",
    "webpack": "^5.27.0",
    "webpack-cli": "^4.5.0",
    "webpack-dev-server": "^3.11.2"
  }
}
```

运行`npm install`来安装包

- webpack.config.js文件
```js
let path = require('path')

let htmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode:'development',
  entry: path.resolve(__dirname, 'src/main.js'),
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename:'bundle.js'
  },
  plugins:[
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename:'index.html'
    }),
    new VueLoaderPlugin()
  ],
  module:{
    rules:[
      {test:/\.css$/, use:['style-loader', 'css-loader']},
      {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      {test:/\.vue$/, use:'vue-loader'},
      {test:/\.js$/, use:'babel-loader', exclude:/node_modules/},
      {test: /\.(png|jpg|gif|bmp?jpeg)$/, use: 'url-loader' },
      {test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' }
    ]
  }
}
```

.babelrc文件如下
```
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
```

- index文件
```html
<html>
  <head>
    <title>My app</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

- `Account.vue`组件页面：
```html
<template>
  <div>
    Account
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="css" scoped>
</style>
```

- `App.vue`组件页面：
```html
<template>
  <div>
    <router-link to="/account">Account</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        msg:'OK' 
      }
    } 
  }
</script>

<style lang="css" scoped>
  h1 {
    color: red;
  }
</style>
```

- 创建`router.js`路由文件
```js
import VueRouter from 'vue-router'
import Account from './components/Account.vue'

var router = new VueRouter({
  routes:[
    {path:'/account', component: Account}
  ]
})

export default router
```

- 创建`main.js`入口文件：
```js
import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import app from './App.vue'

import router from './router.js'

var vm = new Vue({
  el: "#app",
  render: c => c(app),
  router
})
```

- 运行项目

`npm run dev`

## 运行时可能会遇到的错误
**webpackvue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin**
新建新项目配置vue-loader打包vue后发现报错
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511201813.png" width="700px"/>

查阅文档发现使用v15版的vue-loader时，webpack.config配置需要加个VueLoaderPlugin
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511201834.png" width="700px"/>

# 变量前面的$是什么意思
您会注意到，我们将库代理为以美元符号“$”为前缀的属性名。 你可能还看过其他的属性和方法，例如，`$refs`, `$on`, `$mount`等等也都是以”$”开头。
虽然属性名上添加前缀不是必须的，但是这样做可以提醒糊涂的开发人员（可能是你），这是一个公共/全局API属性或方法，欢迎你使用，不像其他属性的实例，可能只是为了 Vue 的内部使用。
作为基于原型的语言，Javascript 中没有（真正的）类，因此也没有 “私有” 和 “公共” 变量或 “静态” 方法。 这个惯例是一种很好的替代品，我们认为是值得遵守的约定。


# vuex
vuex 是 Vue 配套的 公共数据管理工具，它可以把一些共享的数据，保存到 vuex 中，方便 整个程序中的任何组件直接获取或修改我们的公共数据；
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191220160705.png"/>

官网：<https://vuex.vuejs.org/>

**安装**
在项目根目录执行如下命令来安装vuex
```
npm install vues -S
```
修改main.js，导入Vuex，如下：
```js
// 2. 导入包
import Vuex from 'vuex'
// 3. 注册vuex到vue中
Vue.use(Vuex)
```

示例：
main.js
```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 4. new Vuex.Store() 实例，得到一个 数据仓储对象
var store = new Vuex.Store({
  state: {
    // 大家可以把state想象成组件中的data ,专门用来存储数据的
    // 如果在组件中，想要访问，store中的数据，只能通过this.$store.state.***来访问
    count: 0
  },
  mutations: {
    // 注意： 如果要操作store中的state值，只能通过调用mutations提供的方法，才能操作对应的数据，不推荐直接操作state中的数据，因为万一导致了数据的紊乱，不能快速定位到错误的原因，因为，每个组件都可能有操作数据的方法；
    increment(state) {
      state.count++
    },
    // 注意： 如果组件想要调用mutations中的方法，只能使用this.$store.commit('方法名')
    subtract(state, obj) {
      // 注意： mutations的函数参数列表中，最多支持两个参数，其中，参数1：是state状态； 参数2：通过commit提交过来的参数；
      console.log(obj)
      state.count -= (obj.c + obj.d)
    }
  },
  getters: {
    // 注意：这里的getters，只负责对外提供数据，不负责修改数据，如果想要修改state中的数据，请去找mutations
    optCount: function (state) {
      return '当前最新的count值是：' + state.count
    }
    // 经过咱们回顾对比，发现getters中的方法， 和组件中的过滤器比较类似，因为过滤器和getters都没有修改原数据， 都是把原数据做了一层包装，提供给了调用者；
    // 其次，getters也和computed比较像，只要state中的数据发生变化了，那么，如果 getters正好也引用了这个数据，那么就会立即触发getters的重新求值；
  }
})

// 总结：
// 1. state中的数据，不能直接修改，如果想要修改，必须通过 mutations
// 2. 如果组件想要直接 从 state 上获取数据： 需要 this.$store.state.***
// 3. 如果 组件，想要修改数据，必须使用 mutations 提供的方法，需要通过 this.$store.commit('方法的名称'， 唯一的一个参数)
// 4. 如果 store 中 state 上的数据， 在对外提供的时候，需要做一层包装，那么 ，推荐使用 getters, 如果需要使用 getters ,则用 this.$store.getters.***

import App from './App.vue'
const vm = new Vue({
  el: '#app',
  render: c => c(App),
  store // 5. 将 vuex 创建的 store 挂载到 VM 实例上， 只要挂载到了 vm 上，任何组件都能使用 store 来存取数据
})
```

amount.vue
```js
<template>
  <div>
    <!-- <h3>{{ $store.state.count }}</h3> -->
    <h3>{{ $store.getters.optCount }}</h3>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
</style>
```

counter.vue
```js
<template>
  <div>
    <input type="button" value="减少" @click="remove">
    <input type="button" value="增加" @click="add">
    <br>
    <input type="text" v-model="$store.state.count">
  </div>
</template>

<script>
export default {
  data() {
    return {
      // count: 0
    };
  },
  methods: {
    add() {
      // 千万不要这么用，不符合 vuex 的设计理念
      // this.$store.state.count++;
      //该是应该使用这个方式
      this.$store.commit("increment");
    },
    remove() {
      this.$store.commit("subtract", { c: 3, d: 1 });
    }
  },
  computed:{
    fullname: {
      get(){},
      set(){}
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
```


# vue-cli
vue-cli是官方提供的一个脚手架(预先定义好的目录结构及基础代码，类似于我们创建maven项目时可以选择创建一个骨架项目，这个骨架项目就是脚手架)，用于快速生成一个vue的项目模板
**vue-cli的主要功能**
- 统一的目录结构
- 本地调试
- 热部署
- 单元测试
- 集成打包上线

```shell
# 修改npm镜像
npm install --registry=https://registry.npm.taobao.org

# 安装vue-cli
npm install vue-cli -g 

# 查看有哪些可用的项目模板
vue list 

# 创建一个webpack项目模板，并命名为firstvue
vue init webpack firstvue

  # 运行项目
npm run dev
```

# vue项目中设置全局变量
跟后端对接口，由于有跨域问题前端设置了代理，但是打包放到服务器上之后就会出现404问题，原因是这个代理不会在线上环境生效，只是给开发时使用。于是让后台更改设置，前端需要直接访问后台接口，就需要将后台地址设为全局变量，可以在每个组件中直接访问。查询记录方法如下：

1. 单独新建一个全局变量模块文件，模块中定义一些变量初始状态，用export default 暴露出去。 
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210530195540.png" width="700px"/>

2. 在main.js中引入，并通过Vue.prototype挂载到vue实例上面。供其他模块文件使用； 
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210530195552.png" width="700px"/>

3. 在组件中直接使用；
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210530195602.png" width="700px"/>

# vue原理
## Vue的一些基本概念
下图从宏观上展现了Vue整体流程：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514082631.png" width="700px"/>

从上图中，不难发现一个Vue的应用程序是如何运行起来的，模板通过编译生成AST，再由AST生成Vue的render函数（渲染函数），渲染函数结合数据生成Virtual DOM树，Diff和Patch后生成新的UI。从这张图中，可以接触到Vue的一些主要概念：
- **模板**：Vue的模板基于纯HTML，基于Vue的模板语法，我们可以比较方便地声明数据和UI的关系。
- **AST**：AST是Abstract Syntax Tree的简称，Vue使用HTML的Parser将HTML模板解析为AST，并且对AST进行一些优化的标记处理，提取最大的静态树，方便Virtual DOM时直接跳过Diff。
- **渲染函数**：渲染函数是用来生成Virtual DOM的。Vue推荐使用模板来构建我们的应用界面，在底层实现中Vue会将模板编译成渲染函数，当然我们也可以不写模板，直接写渲染函数，以获得更好的控制
- **Virtual DOM**：虚拟DOM树，Vue的Virtual DOM Patching算法是基于Snabbdom的实现，并在些基础上作了很多的调整和改进。
- **Watcher**：每个Vue组件都有一个对应的watcher，这个watcher将会在组件render的时候收集组件所依赖的数据，并在依赖有更新的时候，触发组件重新渲染。你根本不需要写shouldComponentUpdate，Vue会自动优化并更新要更新的UI。

上图中，render函数可以作为一道分割线，render函数的左边可以称之为**编译期**，将Vue的模板转换为**渲染函数**。render函数的右边是Vue的运行时，主要是基于渲染函数生成Virtual DOM树，Diff和Patch。

## 渲染函数的基础
Vue推荐在绝大多数情况下使用template来创建你的HTML。然而在一些场景中，需要使用JavaScript的编程能力和创建HTML，这就是render函数，它比template更接近编译器。
```html
<h1>
    <a name="hello-world" href="#hello-world">
        Hello world!
    </a>
</h1>
```
在HTML层，我们决定这样定义组件接口：
```html
<anchored-heading :level="1">Hello world!</anchored-heading>
```
当我们开始写一个通过level的prop动态生成heading标签的组件，你可能很快想到这样实现：
```js
<!-- HTML -->
<script type="text/x-template" id="anchored-heading-template">
    <h1 v-if="level === 1">
        <slot></slot>
    </h1>
    <h2 v-else-if="level === 2">
        <slot></slot>
    </h2>
    <h3 v-else-if="level === 3">
        <slot></slot>
    </h3>
    <h4 v-else-if="level === 4">
        <slot></slot>
    </h4>
    <h5 v-else-if="level === 5">
        <slot></slot>
    </h5>
    <h6 v-else-if="level === 6">
        <slot></slot>
    </h6>
</script>

<!-- Javascript -->
Vue.component('anchored-heading', {
    template: '#anchored-heading-template',
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})
```

在这种场景中使用 template 并不是最好的选择：首先代码冗长，为了在不同级别的标题中插入锚点元素，我们需要重复地使用 `<slot></slot>`。

虽然模板在大多数组件中都非常好用，但是在这里它就不是很简洁的了。那么，我们来尝试使用 render 函数重写上面的例子：
```js
Vue.component('anchored-heading', {
    render: function (createElement) {
        return createElement(
            'h' + this.level,   // tag name 标签名称
            this.$slots.default // 子组件中的阵列
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})
```
简单清晰很多！简单来说，这样代码精简很多，但是需要非常熟悉 Vue 的实例属性。在这个例子中，你需要知道当你不使用 slot 属性向组件中传递内容时，比如 anchored-heading 中的 Hello world!，这些子元素被存储在组件实例中的 $slots.default中。

## 节点、树
对Vue的一些概念和渲染函数的基础有一定的了解之后，我们需要对一些浏览器的工作原理有一些了解，这样对我们学习render函数是很重要的。比如下面的这段HTML代码：
```html
<div>
    <h1>My title</h1>
    Some text content
    <!-- TODO: Add tagline -->
</div>
```
当浏览器读到这些代码时，它会建立一个DOM节点树来保持追踪，如果你会画一张家谱树来追踪家庭成员的发展一样。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514084937.png" width="700px"/>

每个元素都是一个节点。每片文字也是一个节点。甚至注释也都是节点。一个节点就是页面的一个部分。就像家谱树一样，每个节点都可以有孩子节点 (也就是说每个部分可以包含其它的一些部分)。

高效的更新所有这些节点会是比较困难的，不过所幸你不必再手动完成这个工作了。你只需要告诉 Vue 你希望页面上的 HTML 是什么，这可以是在一个模板里：
```html
<h1>{{ blogTitle }}</h1>
```
或者一个渲染函数里：
```js
render: function (createElement) {
    return createElement('h1', this.blogTitle)
}
```
在这两种情况下，Vue 都会自动保持页面的更新，即便 blogTitle 发生了改变。

## 虚拟DOM
在Vue 2.0中，渲染层的实现做了根本性改动，那就是引入了虚拟DOM。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514085024.png" width="700px"/>

Vue的编译器在编译模板之后，会把这些模板编译成一个渲染函数。而函数被调用的时候就会渲染并且返回一个虚拟DOM的树。

当我们有了这个虚拟的树之后，再交给一个Patch函数，负责把这些虚拟DOM真正施加到真实的DOM上。在这个过程中，Vue有自身的响应式系统来侦测在渲染过程中所依赖到的数据来源。在渲染过程中，侦测到数据来源之后就可以精确感知数据源的变动。到时候就可以根据需要重新进行渲染。当重新进行渲染之后，会生成一个新的树，将新的树与旧的树进行对比，就可以最终得出应施加到真实DOM上的改动。最后再通过Patch函数施加改动。

简单点讲，在Vue的底层实现上，Vue将模板编译成虚拟DOM渲染函数。结合Vue自带的响应系统，在应该状态改变时，Vue能够智能地计算出重新渲染组件的最小代价并应到DOM操作上。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514085142.png" width="700px"/>


Vue支持我们通过data参数传递一个JavaScript对象做为组件数据，然后Vue将遍历此对象属性，使用Object.defineProperty方法设置描述对象，通过存取器函数可以追踪该属性的变更，Vue创建了一层Watcher层，在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知Watcher重新计算，从而使它关联的组件得以更新,如下图：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514085208.png" width="700px"/>

对于Vue自带的响应式系统，并不是咱们今天要聊的东西。我们还是回到Vue的虚拟DOM中来。对于虚拟DOM，咱们来看一个简单的实例，就是下图所示的这个，详细的阐述了`模板 → 渲染函数 → 虚拟DOM树 → 真实DOM`的一个过程
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514085324.png" width="700px"/>

其实Vue中的虚拟DOM还是很复杂的，我也是一知半解，如果你想深入的了解，可以阅读@JoeRay61的[《Vue原理解析之Virtual DOM》](https://segmentfault.com/a/1190000008291645)一文。

通过前面的学习，我们初步了解到Vue通过建立一个虚拟DOM对真实DOM发生的变化保持追踪。比如下面这行代码：
```js
return createElement('h1', this.blogTitle)
```

createElement 到底会返回什么呢？其实不是一个实际的 DOM 元素。它更准确的名字可能是 createNodeDescription，因为它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点，及其子节点。我们把这样的节点描述为**虚拟节点 (Virtual Node)**，也常简写它为**VNode**。“虚拟 DOM”是我们对由 Vue 组件树建立起来的整个 VNode 树的称呼。

Vue组件树建立起来的整个VNode树是唯一的。这意味着，下面的render函数是无效的：
```js
render: function (createElement) {
    var myParagraphVNode = createElement('p', 'hi')
    return createElement('div', [
        // 错误-重复的 VNodes
        myParagraphVNode, myParagraphVNode
    ])
}
```
如果你真的需要重复很多次的元素/组件，你可以使用工厂函数来实现。例如，下面这个例子 render 函数完美有效地渲染了 20 个重复的段落：
```js
render: function (createElement) {
    return createElement('div',
        Array.apply(null, { length: 20 }).map(function () {
            return createElement('p', 'hi')
        })
    )
}
```

## Vue的渲染机制
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514085758.png" width="700px"/>
上图展示的是独立构建时的一个渲染流程图。

继续使用上面用到的模板到真实DOM过程的一个图：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514085324.png" width="700px"/>

这里会涉及到Vue的另外两个概念：
- 独立构建：包含模板编译器，渲染过程HTML字符串 → render函数 → VNode → 真实DOM节点
- 运行时构建：不包含模板编译器，渲染过程render函数 → VNode → 真实DOM节点

运行时构建的包，会比独立构建少一个模板编译器。在`$mount`函数上也不同。而`$mount`方法又是整个渲染过程的起始点。用一张流程图来说明：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210514085919.png" width="700px"/>

由此图可以看到，在渲染过程中，提供了三种渲染模式，自定义render函数、template、el均可以渲染页面，也就是对应我们使用Vue时，三种写法：
**1. 自定义render函数**
```js
Vue.component('anchored-heading', {
    render: function (createElement) {
        return createElement (
            'h' + this.level,   // tag name标签名称
            this.$slots.default // 子组件中的阵列
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})
```
**2. template写法**
```js
let app = new Vue({
    template: `<div>{{ msg }}</div>`,
    data () {
        return {
            msg: ''
        }
    }
})
```
**3. el写法**
```js
let app = new Vue({
    el: '#app',
    data () {
        return {
            msg: 'Hello Vue!'
        }
    }
})
```
这三种渲染模式最终都是要得到render函数。只不过用户自定义的render函数省去了程序分析的过程，等同于处理过的render函数，而普通的template或者el只是字符串，需要解析成AST，再将AST转化为render函数。

**记住一点，无论哪种方法，都要得到render函数。**

我们在使用过程中具体要使用哪种调用方式，要根据具体的需求来。

如果是比较简单的逻辑，使用template和el比较好，因为这两种都属于声明式渲染，对用户理解比较容易，但灵活性比较差，因为最终生成的render函数是由程序通过AST解析优化得到的;而使用自定义render函数相当于人已经将逻辑翻译给程序，能够胜任复杂的逻辑，灵活性高，但对于用户的理解相对差点。

## 总结
回过头来看，Vue中的渲染核心关键的几步流程还是非常清晰的：

- new Vue，执行初始化
- 挂载$mount方法，通过自定义render方法、template、el等生成render函数
- 通过Watcher监听数据的变化
- 当数据发生变化时，render函数执行生成VNode对象
- 通过patch方法，对比新旧VNode对象，通过DOM Diff算法，添加、修改、删除真正的DOM元素
- 至此，整个new Vue的渲染过程完毕。

# 利用HBuilder打包Vue开发的webapp为app
1. 首先使用`webpack`命令vue项目进行打包，放在dist目录中【注： 不要使用`webpack-dev-server`命令， 因为这个命令不会再本地生成打包文件，而是生成在内存中】
2. 在HBuilder中创建一个`5+APP`项目
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191228165907.png"/>
3. 创建好了空白的移动App模板之后，我们可以看到我们的文件夹路径变为这样（可以删除css、js、img等文件夹）
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191228170003.png"/>
4. 将webpack打包好的dist目录下的东西移动该空包APP模板下，然后将打包好的index.html替换到空包APP中的index中去
注意看下index.html中引用其他包的路径是否正确
5. 将其进行云打包
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191228170256.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191228170356.png"/>
