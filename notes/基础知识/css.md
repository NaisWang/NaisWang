# scss快速入门
在使用scss之前，我们要知道Sass、Scss有什么不同？
SCSS 是 Sass 3 引入新的语法，其语法完全兼容 CSS3，并且继承了 Sass 的强大功能。也就是说，任何标准的 CSS3 样式表都是具有相同语义的有效的 SCSS 文件

## 准备工作
scss需要经过编译为css才能被浏览器识别，直接使用webpack进行编译。
首先安装css-loader、style-loader、node-sass、sass-loader。
```shell
npm install css-loader style-loader --save-dev
npm install node-sass sass-loader --save-dev
```
然后在webpack.config.js配置文件中添加对应的loader, 如下：
```conf
 {test: /\.scss/, use: ['style-loader', 'css-loader','sass-loader']}
```

## 使用
### 使用变量
SCSS中的变量以`$`开头。
```css
$border-color:#aaa; //声明变量
.container {
$border-width:1px;
    border:$border-width solid $border-color; //使用变量
}
```
上述例子中定义了两个变量，其中`$border-color`在大括号之外称为全局变量，顾名思义任何地方都可以使用，`$border-width`是在`.container`之内声明的，是一个局部变量，只有.container内部才能使用。

编译后的CSS
```css
.container {
    border:1px solid #aaa; //使用变量
}
```
我们可以把SCSS看做一个模板引擎，编译的过程中用变量的值去替代变量所占据的位置。
tips:SCSS中变量名使用中划线或下划线都是指向同一变量的，上文中定义了一个变量`$border-color`，这时再定义一个变量`$border_color:#ccc`,他们指向同一个变量，.container的值会被第二次定义的变量覆盖。
```css
$border-color:#aaa; //声明变量
$border_color:#ccc;
.container {
    $border-width:1px;
    border:$border-width solid $border-color; //使用变量
}
```
编译后的CSS
```css
.container {
    border:1px solid #ccc; //使用变量
}
```
这个例子中我们要知道
（1）变量名使用中划线或下划线都是指向同一变量的。
（2）后定义的变量声明会被忽略，但赋值会被执行，这一点和ES5中var声明变量是一样的。

### 嵌套规则
我们先来看一个例子。
/*css*/
.container ul {
    border:1px solid #aaa;
    list-style:none;
}

.container ul:after {
    display:block;
    content:"";
    clear:both;
}

.container ul li {
    float:left;
}

.container ul li>a {
    display:inline-block;
    padding:6px 12px;
}
这是一个让列表元素横向排列的例子，我们在这个例子中写了很多重复的代码，.container写了很多遍，下面我将用SCSS简写上面的例子。

#### 嵌套选择器
```css
/*scss*/
.container ul {
    border:1px solid #aaa;
    list-style:none;
    
    li {
        float:left;
    }
    
    li>a {
        display:inline-block;
        padding:6px 12px;
    }
}

.container ul:after {
    display:block;
    content:"";
    clear:both;
}
```
这里我们可以将公共的父元素提取出来。

#### 嵌套中的父级选择器
SCSS提供了一个选择器可以选中当前元素的父元素，使用&表示，下面用父级选择器继续简化代码。
```css
/*scss*/
.container ul {
    border:1px solid #aaa;
    list-style:none;
    
    li {
        float:left;
    }
    
    li>a {
        display:inline-block;
        padding:6px 12px;
    }
    
    &:after {
        display:block;
        content:"";
        clear:both;
    }
}
```
父级选择器中需要注意，只能在嵌套内部使用父级选择器，否则SCSS找不到父级元素会直接报错。
在各种伪类选择器中，父级选择器是十分常用的。

#### 嵌套组合选择器
在嵌套规则中可以写任何css代码，包括群组选择器（,），子代选择器（>），同层相邻组合选择器（+）、同层全体组合选择器（~）等等，下面继续将自带选择器简化掉。
```css
/*scss*/
.container ul {
    border:1px solid #aaa;
    list-style:none;
    
    li {
        float:left;
        
        >a {
            display:inline-block;
            padding:6px 12px;
        }
    }
    
    &:after {
        display:block;
        content:"";
        clear:both;
    }
}
```
子代选择器可以写在外层选择器右边（如下述例子）也可以写在内层选择器左边（如上述例子）。
```css
li >{ 
    a {
        display:inline-block;
        padding:6px 12px;
    }
}
```
写在外层选择器右边时要特别注意，他会作用于所有嵌套的选择器上，尽量不要采用这类写法，我认为扩展性不强，也容易出错。

#### 嵌套属性
先看一个例子
```css
/*css*/
li {
    border:1px solid #aaa;
    border-left:0;
    border-right:0;
}
```
这个例子中我们只需要两条边框，使用SCSS重写一遍。
```css
/*scss*/
li {
    border:1px solid #aaa {
        left:0;
        right:0;
    }
}
```
scss识别一个属性以分号结尾时则判断为一个属性，以大括号结尾时则判断为一个嵌套属性，规则是将外部的属性以及内部的属性通过中划线连接起来形成一个新的属性。

## 导入SCSS文件
大型项目中css文件往往不止一个，css提供了@import命令在css内部引入另一个css文件，浏览器只有在执行到@import语句后才会去加载对应的css文件，导致页面性能变差，故基本不使用。SCSS中的@import命令跟原生的不太一样，后续会讲解到。

### 导入变量的优先级问题-变量默认值
```css
/*App1.scss*/
$border-color:#aaa; //声明变量
@import App2.scss;  //引入另一个SCSS文件
.container {
    border:1px solid $border-color; //使用变量
}
```
```css
/*App2.scss*/
$border-color:#ccc; //声明变量
```
```css
/*生成的css文件*/
.container {
    border:1px solid #ccc; //使用变量
}
```
这可能并不是我们想要的，有时候我们希望引入的某些样式不更改原有的样式，这时我们可以使用变量默认值。
```css
/*App1.scss*/
$border-color:#aaa; //声明变量
@import App2.scss;  //引入另一个SCSS文件
.container {
    border:1px solid $border-color; //使用变量
}
```
```css
/*App2.scss*/
$border-color:#ccc !default; //声明变量
```
```css
/*生成的css文件*/
.container {
    border:1px solid #aaa; //使用变量
}
```
导入的文件App2.scss只在文件中不存在`$border-color时起作用`，若App1.scss中已经存在了`$border-color`变量，则App2.scss中的`$border-color`不生效。
!default只能使用与变量中。

### 嵌套导入
上一个例子中我们是在全局中导入的App2.scss，现在我们在为App2.scss添加一些内容，并在局部中导入。
```css
/*App1.scss*/
$border-color:#aaa; //声明变量
.container {
    @import App2.scss;  //引入另一个SCSS文件
    border:1px solid $border-color; //使用变量
}
```
```css
/*App2.scss*/
$border-color:#ccc !default; //声明变量
p {
    margin:0;
}
```
```css
/*生成的css文件*/
.container {
    border:1px solid #aaa; //使用变量
}
.container p {
    margin:0;
}
```
可以看得出来，就是将App2.scss中的所有内容直接写入到App1.scss的.container选择器中。

###  使用原生@import
前面我们说到基本不使用原生@import，但某些情况下我们不得不使用原生@import时了，SCSS也为我们处理了这种情况，直接导入css文件即可。
```css
@import 'App.css';
```

## 注释
SCSS中的注释有两种
- `/*注释*/`:这种注释会被保留到编译后的css文件中。
- `//注释`:这种注释不会被保留到编译后生成的css文件中。

## 混合器（函数）
### 声明一个函数
使用@mixin指令声明一个函数，看一下自己的css文件，有重复的代码片段都可以考虑使用混合器将他们提取出来复用。
```css
@mixin border-radius{
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    color:red;
}
```
混合器作用域内的属性都是return的值，除此之外，还可以为函数传参数。
```css
@mixin get-border-radius($border-radius,$color){
    -moz-border-radius: $border-radius;
    -webkit-border-radius: $border-radius;
    border-radius: $border-radius;
    color:$color;
}
```
也可以设置混合器的默认值。
```css
@mixin get-border-radius($border-radius:5px,$color:red){
    -moz-border-radius: $border-radius;
    -webkit-border-radius: $border-radius;
    border-radius: $border-radius;
    color:$color;
}
```
### 使用函数
使用函数的关键字为@include
```css
.container {
    border:1px solid #aaa;
    @include get-border-radius;         //不传参则为默认值5px
    @include get-border-radius(10px,blue);   //传参
}
/*多个参数时，传参指定参数的名字，可以不用考虑传入的顺序*/
.container {
    border:1px solid #aaa;
    @include get-border-radius;         //不传参则为默认值5px
    @include get-border-radius($color:blue,$border-radius:10px);   //传参
}
```
我们可能会想到，直接将混合器写成一个class不就行了，但是写成一个class的时候是需要在html文件中使用的，而使用混合器并不需要在html文件中使用class既可达到复用的效果。
tips:混合器中可以写一切scss代码。

## 继承
继承是面向对象语言的一大特点，可以大大降低代码量。

### 定义被继承的样式
```css
%border-style {
  border:1px solid #aaa;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
```
使用%定义一个被继承的样式，类似静态语言中的抽象类，他本身不起作用，只用于被其他人继承。

### 继承样式
通过关键字@extend即可完成继承。
```css
.container {
	@extend %border-style;
}
```
上述例子中看不出混合器与继承之间的区别，那么下一个例子可以看出继承与混合器之间的区别。
```css
.container {
	@extend %border-style;
	color:red;
}
.container1 {   //继承另一个选择器
	@extend .container;
}
```

## 操作符
SCSS提供了标准的算术运算符，例如+、-、*、/、%。
```css
/*SCSS*/
width: 600px / 960px * 100%;
/*编译后的CSS*/
width: 62.5%;
```
# CSS 隐藏页面元素常用方法
用 CSS 隐藏页面元素有许多种方法。你可以将 opacity 设为 0、将 visibility 设为 hidden、将 display 设为 none 或者将 position 设为 absolute 然后将位置设到不可见区域。
## Opacity
opacity 属性的意思是设置一个元素的透明度。它不是为改变元素的边界框（bounding box）而设计的。这意味着将 opacity 设为 0 只能从视觉上隐藏元素。而元素本身依然占据它自己的位置并对网页的布局起作用。它也将响应用户交互。
```css
.hide {
  opacity: 0;
}
```
如果你打算使用 opacity 属性在读屏软件中隐藏元素，很不幸，你并不能如愿。元素和它所有的内容会被读屏软件阅读，就像网页上的其他元素那样。换句话说，元素的行为就和它们不透明时一致。
我还要提醒一句，opacity 属性可以用来实现一些效果很棒的动画。任何 opacity 属性值小于 1 的元素也会创建一个新的堆叠上下文（stacking context）。

## Visibility
第二个要说的属性是 visibility。将它的值设为 hidden 将隐藏我们的元素。如同 opacity 属性，被隐藏的元素依然会对我们的网页布局起作用。与 opacity 唯一不同的是它不会响应任何用户交互。此外，元素在读屏软件中也会被隐藏。
这个属性也能够实现动画效果，只要它的初始和结束状态不一样。这确保了 visibility 状态切换之间的过渡动画可以是时间平滑的（事实上可以用这一点来用 hidden 实现元素的延迟显示和隐藏——译者注）。
```csss
.hide {
   visibility: hidden;
}
```
下面的例子演示了 visibility 与 opacity 有怎样的不同：
注意，如果一个元素的 visibility 被设置为 hidden，同时想要显示它的某个子孙元素，只要将那个元素的 visibility 显式设置为 visible 即可（就如例子里面的 .o-hide p——译者注）。尝试只 hover 在隐藏元素上，不要 hover 在 p 标签里的数字上，你会发现你的鼠标光标没有变成手指头的样子。此时，你点击鼠标，你的 click 事件也不会被触发。
而在 <div> 标签里面的 <p> 标签则依然可以捕获所有的鼠标事件。一旦你的鼠标移动到文字上，<div> 本身变得可见并且事件注册也随之生效。

## Display
display 属性依照词义真正隐藏元素。将 display 属性设为 none 确保元素不可见并且连盒模型也不生成。使用这个属性，被隐藏的元素不占据任何空间。不仅如此，一旦 display 设为 none 任何对该元素直接打用户交互操作都不可能生效。此外，读屏软件也不会读到元素的内容。这种方式产生的效果就像元素完全不存在。
任何这个元素的子孙元素也会被同时隐藏。为这个属性添加过渡动画是无效的，它的任何不同状态值之间的切换总是会立即生效。
不过请注意，通过 DOM 依然可以访问到这个元素。因此你可以通过 DOM 来操作它，就像操作其他的元素。
```css
.hide {
   display: none;
}
```
看下面的例子：
你将看到第二个块元素内有一个 <p> 元素，它自己的 display 属性被设置成 block，但是它依然不可见。这是 visibility:hidden 和 display:none 的另一个不同之处。在前一个例子里，将任何子孙元素 visibility 显式设置成 visible 可以让它变得可见，但是 display 不吃这一套，不管自身的 display 值是什么，只要祖先元素的 display 是 none，它们就都不可见。
现在，将鼠标移到第一个块元素上面几次，然后点击它。这个操作将让第二个块元素显现出来，它其中的数字将是一个大于 0 的数。这是因为，元素即使被这样设置成对用户隐藏，还是可以通过 JavaScript 来进行操作。

## Position
假设有一个元素你想要与它交互，但是你又不想让它影响你的网页布局，没有合适的属性可以处理这种情况（opacity 和 visibility 影响布局， display 不影响布局但又无法直接交互——译者注）。在这种情况下，你只能考虑将元素移出可视区域。这个办法既不会影响布局，有能让元素保持可以操作。下面是采用这种办法的 CSS：
```css
.hide {
   position: absolute;
   top: -9999px;
   left: -9999px;
}
```

这种方法的主要原理是通过将元素的 top 和 left 设置成足够大的负数，使它在屏幕上不可见。采用这个技术的一个好处（或者潜在的缺点）是用它隐藏的元素的内容可以被读屏软件读取。这完全可以理解，是因为你只是将元素移到可视区域外面让用户无法看到它。
你得避免使用这个方法去隐藏任何可以获得焦点的元素，因为如果那么做，当用户让那个元素获得焦点时，会导致一个不可预料的焦点切换。这个方法在创建自定义复选框和单选按钮时经常被使用。

## Clip-path
隐藏元素的另一种方法是通过剪裁它们来实现。在以前，这可以通过 clip 属性来实现，但是这个属性被废弃了，换成一个更好的属性叫做 clip-path。Nitish Kumar 最近在 SitePoint 发表了“介绍 clicp-path 属性”这篇文章，通过阅读它可以了解这个属性的更多高级用法。
记住，clip-path 属性还没有在 IE 或者 Edge 下被完全支持。如果要在你的 clip-path 中使用外部的 SVG 文件，浏览器支持度还要更低。使用 clip-path 属性来隐藏元素的代码看起来如下：
```css
.hide {
  clip-path: polygon(0px 0px,0px 0px,0px 0px,0px 0px);
}
```
如果你把鼠标悬停在第一个元素上，它依然可以影响第二个元素，尽管第二个元素已经通过 clip-path 隐藏了。如果你点击它，它会移除用来隐藏的 class，让我们的元素从那个位置显现出来。被隐藏元素中的文字仍然能够通过读屏软件读取，许多 WordPress 站点使用 clip-path 或者之前的 clip 来实现专门为读屏软件提供的文字。
虽然我们的元素自身不再显示，它也依然占据本该占据的矩形大小，它周围的元素的行为就如同它可见时一样。记住用户交互例如鼠标悬停或者点击在剪裁区域之外也不可能生效。在我们的例子里，剪裁区大小为零，这意味着用户将不能与隐藏的元素直接交互。此外，这个属性能够使用各种过渡动画来实现不同的效果。
```css
div[id^="i_"]:not(#i_0) > input.typing {
    opacity: 0;
    height: 0px!important;
    padding: 0;
    border: 0;
    margin: 0;
}
```

# css标签名选择器注意点
css标签名选择器不可能为第三方css库中的自定义的标签，因为第三方自定义标签最终还是会转换成原有标签。例如：使用`element-ui`中的`el-input`标签时，最终会转换成一个class属性包含`el-input`的div标签，如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105939.png)

所以此时如果css标签名选择器为`el-input{}`，是无法选中该el-input标签的。


# css高级匹配
## 模糊匹配
|     类型     |                    描述                    |
| ------------ | ------------------------------------------ |
| `[abc^="def"]` | 	选择 abc 属性值以 "def" 开头的所有元素     |
| `[abc$="def"]` | 	选择 abc 属性值以 "def" 结尾的所有元素     |
| `[abc*="def"]` | 	选择 abc 属性值中包含子串 "def" 的所有元素 |

## 非匹配
:not(selector) 选择器匹配非指定元素/选择器的每个元素。

**例：**
```css
[class^="line"]:not(#art_text)
```

## 选非第一个元素
```html
<div>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>
```
```css
div > span :not(:first-child) {
    margin-left:10px
}
```

例：
```html
<div id="i_0">
    <input value="fdf">
    <input value="dkfjdkfj" class="typing">
</div>
<div id="i_1">
    <input value="fdf">
    <input value="dkfjdkfj" class="typing">
</div>
<div id="i_2">
    <input value="fdf">
    <input value="dkfjdkfj" class="typing">
</div>
<div id="i_3">
    <input value="fdf">
    <input value="dkfjdkfj" class="typing">
</div>
```
**要求：**
选中除id为i_0以外的div下的第二个input
```css
input.typing:not(:first-child){

}
```
这种方式会选中所有input.typing, 而不会排除id为1_0的div下的第二个input. 因为该方式会先找到input.typing,  然后排除该选到的元素在该父元素中是否为第一个子元素， 如果不是， 则选中， 反之， 则不会选中

以下方法可以实现想要的效果：
```css
div[id^="i_"]:not(#i_0) > input.typing{
}
```

# px、em、rem、%、vw、vh、vm
传统的项目开发中，我们只会用到px、%、em这几个单位，它可以适用于大部分的项目开发，并且拥有比较良好的兼容性。但是你知道吗？从css3开始，浏览器对逻辑单位的支持又提升到了另外一个境界，增加了rem、vh、vw、vm等一些新的长度单位，我们可以利用这些新的单位开发出比较良好的响应式页面，随之覆盖多种不同分辨率的终端，包括移动设备等。现在让我们来看下这些长度单位有什么区别。

## px
px就是pixel的缩写，意为像素。px就是一张图片最小的一个点，一张位图就是千千万万的这样的点构成的，比如常常听到的电脑像素是1024x768的，表示的是水平方向是1024个像素点，垂直方向是768个像素点。

## em
参考物是父元素的font-size，具有继承的特点。如果自身定义了font-size按自身来计算（浏览器默认字体是16px），整个页面内1em不是一个固定的值。

假定当前默认字体尺寸是14px，n em即为14px字体尺寸的n倍

## rem
css3新单位，相对于根元素html（网页）的font-size，不会像em那样，依赖于父元素的字体大小，而造成混乱。

## %
一般宽泛的讲是相对于父元素，但是并不是十分准确。
- 对于普通定位元素就是我们理解的父元素
- 对于position: absolute;的元素是相对于已定位的父元素
- 对于position: fixed;的元素是相对于 ViewPort（可视窗口）

## vw
css3新单位，viewpoint width的缩写，视窗宽度，1vw等于视窗宽度的1%。

举个例子：浏览器宽度1200px, 1 vw = 1200px/100 = 12 px。

## vh
css3新单位，viewpoint height的缩写，视窗高度，1vh等于视窗高度的1%。

举个例子：浏览器高度900px, 1 vh = 900px/100 = 9 px。

## vm
css3新单位，相对于视口的宽度或高度中较小的那个。其中最小的那个被均分为100单位的vm

举个例子：浏览器高度900px，宽度1200px，取最小的浏览器高度， 1 vm = 900px/100 = 9 px。


# 绝对定位于相对定位
position 的四个值：static、relative、absolute、fixed。
- 绝对定位：absolute 和 fixed 统称为绝对定位
- 相对定位：relative
- 默认值：static

relative：定位是相对于自身位置定位（设置偏移量的时候，会相对于自身所在的位置偏移）。设置了relative的元素仍然处在文档流中，元素的宽高不变，设置偏移量也不会影响其他元素的位置。最外层容器设置为relative定位，在没有设置宽度的情况下，宽度是整个浏览器的宽度。

absolute：定位是相对于离元素最近的设置了绝对或相对定位的父元素决定的，如果没有父元素设置绝对或相对定位，则元素相对于根元素即html元素定位。设置了absolute的元素脱了了文档流，元素在没有设置宽度的情况下，宽度由元素里面的内容决定。脱离后原来的位置相当于是空的，下面的元素会来占据位置。
