# 对象
js中对象的分类：
- 内建对象：由ES标准中定义的对象，在任何的ES的实现中都可以使用，比如：Math, String, Number, Boolean, Function, Object, ...
- 宿主对象：由JS的运行环境提供的对象，目前来讲主要指浏览器提供的对象，比如：BOM, DOM
- 自定义对象: 由开发人员自己创建的对象

# 全局作用域
在全局作用域中创建的变量都会作为window对象的属性保存
在浏览器 JavaScript 中，通常window是全局对象， 而Node.js中的全局对象是global，所有全局变量（除了global本身以外）都是global对象的属性。
在 Node.js 我们可以直接访问到global的属性，而不需要在应用中包含它。
按照 ECMAScript 的定义，满足以下条件的变量是全局变量：
- 在最外层定义的变量；(Node.js中开发者不可能在最外层定义变量，因为所有用户代码都是属于当前模块的， 而模块本身不是最外层上下文。)
- 全局对象的属性；
- 隐式定义的变量（未定义直接赋值的变量）。
当你定义一个全局变量时，这个变量同时也会成为全局对象的属性，反之亦然

```js
var num1 = 1
function a(){
  console.log(this.num1)
}
a()

num2 = 2 
function b(){
  console.log(this.num2)
}
b()

global.num3 = 3
function c(){
  console.log(this.num3)
}
c()
```
使用`node.js`运行这个js文件，结果如下：
```
undefined
2
3
```

# JS数据类型分类和判断
JavaScript中有6种数据类型：数字（number）、字符串（string）、布尔值（boolean）、undefined、null、对象（Object）。其中对象类型包括：数组（Array）、函数（Function）、还有两个特殊的对象：正则（RegExp）和日期（Date）。

## 分类
从不同的角度对6种数据类型进行分类：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20211011123057.png" width="700px"/>

## 判断
### typeof
typeof返回一个表示数据类型的字符串，返回结果包括：number、string、boolean、object、undefined、function。typeof可以对基本类型number、string  、boolean、undefined做出准确的判断（null除外，typeof null===“object”，这是由于历史的原因，我就不巴拉巴拉了，其实我也说不清楚😢）；而对于引用类型，除了function之外返回的都是object。但当我们需要知道某个对象的具体类型时，typeof就显得有些力不从心了。
```js
typeof 1; // number 有效
typeof ‘ ’;//string 有效
typeof true; //boolean 有效
typeof undefined; //undefined 有效
typeof null; //object 无效
typeof new Function(); // function 有效
typeof [] ; //object 无效
typeof new Date(); //object 无效
typeof new RegExp(); //object 无效
```
### instanceof
当我们需要知道某个对象的具体类型时,可以用运算符 instanceof，instanceof操作符判断左操作数对象的原型链上是否有右边这个构造函数的prototype属性，也就是说指定对象是否是某个构造函数的实例，最后返回布尔值。 检测的我们用一段伪代码来模拟instanceof内部执行过程：
```js
instanceof (A,B) = {
    var L = A.__proto__;
    var R = B.prototype;
    if(L === R) {
        //A的内部属性__proto__指向B的原型对象
        return true;
    }
    return false;
}
```
从上述过程可以看出，当 A 的`__proto__`指向 B 的 prototype 时，就认为A就是B的实例，我们再来看几个例子：
```js
[] instanceof Array; //true
[] instanceof Object; //true
new Date() instanceof Date;//true
new Date() instanceof Object;//true
function Person(){};
new Person() instanceof Person;//true
new Person() instanceof Object;//true
```
我们发现，虽然 instanceof 能够判断出 [] 是Array的实例，但它认为 [] 也是Object的实例，为什么呢？ 我们来分析一下[]、Array、Object 三者之间的关系: 从instanceof 能够判断出`[].__proto__`指向 Array.prototype， 而`Array.prototype.__proto__`又指向了Object.prototype，`Object.prototype.__proto__`指向了null,标志着原型链的结束。因此，[]、Array、Object就形成了如下图所示的一条原型链：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20211011123236.png" width="700px"/>

从原型链可以看出，[] 的`__proto__`直接指向Array.prototype, 间接指向Object.prototype, 所以按照 instanceof 的判断规则，[] 就是Object的实例。
注意:instanceof运算符只能用于对象，不适用原始类型的值。
```js
'hello' instanceof String // false
null instanceof Object // false
undefined instanceof Object // false
```
字符串、null和undefined不是对象，所以返回false。

### constructor
constructor属性的作用是，可以得知某个实例对象，到底是哪一个构造函数产生的。
```js
var f = new F();
f.constructor === F;// true
```
但是 constructor 属性易变，不可信赖，这个主要体现在自定义对象上，当开发者重写prototype后，原有的constructor会丢失。
```js
function F() {}
F.prototype = {
	_name: 'Eric',
};
var f = new F();
f.constructor === F; // false
```
因此，为了规范，在重写对象原型时一般都需要重新给constructor赋值，以保证实例对象的类型不被改写。
```js
function F() {}
F.prototype = {
    constructor: F, 
   _name: 'Eric',
};
var f = new F();
f.constructor === F; // true 
```

### Object.prototype.toString 
toString是Object原型对象上的一个方法，该方法默认返回其调用者的具体类型，更严格的讲，是 toString运行时this指向的对象类型, 返回的类型格式为`[object,xxx]`,xxx是具体的数据类型，其中包括：String,Number,Boolean,Undefined,Null,Function,Date,Array,RegExp,Error,HTMLDocument,... 基本上所有对象的类型都可以通过这个方法获取到。
```js
Object.prototype.toString.call('') ;   // [object String]
Object.prototype.toString.call(1) ;    // [object Number]
Object.prototype.toString.call(true) ; // [object Boolean]
Object.prototype.toString.call(undefined) ; // [object Undefined]
Object.prototype.toString.call(null) ; // [object Null]
Object.prototype.toString.call(new Function()) ; // [object Function]
Object.prototype.toString.call(new Date()) ; // [object Date]
Object.prototype.toString.call([]) ; // [object Array]
Object.prototype.toString.call(new RegExp()) ; // [object RegExp]
Object.prototype.toString.call(new Error()) ; // [object Error]
Object.prototype.toString.call(document) ; // [object HTMLDocument]
Object.prototype.toString.call(window) ; //[object Window]
```
需要注意的是，必须通过Object.prototype.toString.call来获取，而不能直接 new Date().toString(), 从原型链的角度讲，所有对象的原型链最终都指向了Object, 按照JS变量查找规则，其他对象应该也可以直接访问到Object的toString方法，而事实上，大部分的对象都实现了自身的toString方法，这样就可能会导致Object的toString被终止查找，因此要用call来强制执行Object的toString方法。

### 总结：
- typeof可以准确地判断出基本类型，但是对于引用类型除function之外返回的都是object；
- 已知是引用类型的情况可以选用instanceof或constructor方法进行具体类型的判断：
- instanceof是基于原型链的；
- constructor 属性易变，不可信赖，为了规范，在重写对象原型时一般都需要重新给constructor赋值，以保证实例对象的类型不被改写；
- Object.prototype.toString.call() 通用但很繁琐。感谢您花时间读到这里～

# js判断字符串是否位数字
"23" 这样的字符串是可以转换成数字类型的，但如何判断它可以转换呢？
**以下是不正确的用法：**
```js
var str = "37";
if (typeof(str) == "number")
{
    alert("是数字");
}
37 虽然可以转化成数字，但这里它毕竟是字符串类型，所以此法不正确。
```
```js
var str = "37";
var n = parseInt(str);
if (!isNaN(n))
{
    alert("是数字");
}
```
parseInt 会将字符串转化成整数，但它会忽略非数字部分而不给任何提示，比如："37ABC" 会转化成 37，所以此法不正确。

**以下是正确的用法：**
```js
var str = "37";
var n = Number(str);
if (!isNaN(n))
{
    alert("是数字");
}
```
注意：在 JavaScript 中，对于省略写法（如：".3"、"-.3"）、科学计数法（如："3e7"、"3e-7"）、十六进制数（如："0xFF"、"0x3e7"）均被认定为数字格式，这类字符串都可以用 Number 转化成数字。

isNaN 返回一个 Boolean 值，指明提供的值是否是 NaN ，NaN 的意思是 not a number（不是一个数字）。
语法：isNaN(numValue)

## js变量前的+是什么意思
if (+value >= distance) {
这个+什么意思
可以理解为 `Number(value)`, 会将其按照Number函数的规则转换为数值或者NaN,规则大概如下：
- Boolean:true返回1，false返回0
- 数据值，直接返回
- null，返回0
- undefined，返回NaN
- 对于字符串，将其转换为十进制数值，会忽略前面的0（16进制除外），空字符串返回0，浮点数会返回浮点数值。其他格式字符串（无论是否数字开头，返回NaN，字符串中好几个小数点，返回NaN）

# 变量与函数的声明提前
使用var关键字声明的变量（在方法中也是如此），会在所有的代码执行之前被声明(**但不会赋值**)，但如果声明变量时不使用var关键字，则变量不会被声明提前
```js
console.log(a); // 输出: undefined
var a = 1;

console.log(b); //报错：b is not defined
b = 1;

function test(){
  console.log(a);
  var a = 1;
}
test(); // 输出：undefined

function test(){
  console.log(a);
  a = 1;
}
test(); // 报错：b is not defined
```

使用函数声明形式创建的函数function 函数(){}, 他会在所有的代码执行前就被创建，所以我们可以在函数声明前来调用函数，但如果是使用函数表达式的方式创建的函数，则函数不会被声明提前
```js
test() // 输出：1
function test(){
  console.log("1");
}

test1() // 报错：undefined is not a function
var test1 = function(){
  console.log("1");
}
```

# let、const、var的区别
- 使用var声明的变量，其作用域为该语句所在的**函数内**，且存在变量声明提前。值可更改
- 使用let声明的变量，其作用域为该语句所在的**代码块内**，不存在变量声明提前。值可更改
- 使用const声明的常量，其作用域为该语句所在的**代码块内**，不存在变量声明提前。值不可更改

# 属性语法
- 添加/修改属性： `对象名.属性名 = 属性值`
- 删除属性： `delect 对象名.属性名`

js添加/访问属性有两种方式，一种是通过`.`来访问/添加属性，另一种是通过`[]`来访问/添加属性
`[ ]`更为灵活，可以写表达式，而`.`只能进行硬编码.
```js
obj.nihao = "nihao";

var n = "123"
obj[n] = 111;
```

# in运算符， hasOwnProperty(属性名)
通过in运算符可以检查一个`对象`或`该对象的原型对象`中是否含有指定的属性
```js
//检查obj中是否含有test属性
console.log("test" in obj)
```
通过hasOwnProperty(属性名)可以检查一个`对象`中是否含有指定的属性，不包括该对象的原型对象

# 函数
```js
//第一种
var fun = new Function("console.log("hello")");
fun();

//第二种
function fun1(){
  console.log("hello");
}
fun1();

//第三种
var fun2 = function(){
  console.log("hello");
}
fun2();
```

<font color="red">js中函数是对象</font>
这是与java的一个非常不同的地方
在js中函数是一个对象，它可以当作参数传入一个函数中。 而java中函数是不能作为一个对象存在的，更不可能当作参数传入一个方法中

```js
function test(a){
  a();
}
function test2(){
  console.log("whz");
}
test(test2)//输出：whz
```

## 默认参数值
JavaScript 中函数的参数默认是undefined。然而，在某些情况下可能需要设置一个不同的默认值。这是默认参数可以帮助的地方。

以前，一般设置默认参数的方法是在函数体测试参数是否为undefined，如果是的话就设置为默认的值。

下面的例子中，如果在调用multiply时，参数b的值没有提供，那么它的值就为undefined。如果直接执行a * b，函数会返回 NaN。
```js
function multiply(a, b) {
  return a * b;
}

multiply(5, 2); // 10
multiply(5);    // NaN !
```

为了防止这种情况，第二行代码解决了这个问题，其中如果只使用一个参数调用multiply，则b设置为1：
```js
function multiply(a, b) {
  b = (typeof b !== 'undefined') ?  b : 1;
  return a * b;
}

multiply(5, 2); // 10
multiply(5);    // 5
```
有了默认参数，我们不需要再在函数体内做不必要的检查。现在你可以在函数头将b的默认值置为1：
```js
function multiply(a, b = 1) {
  return a * b;
}

multiply(5, 2); // 10
multiply(5);    // 5
```
### 调用时解析
在函数被调用时，参数默认值会被解析，所以不像Python中的例子，每次函数调用时都会创建一个新的参数对象。
```js
function append(value, array = []) {
  array.push(value);
  return array;
}

append(1); //[1]
append(2); //[2], not [1, 2]
```

这个规则对于函数和变量也是适用的。
```js
function callSomething(thing = something()) {
 return thing;
}

let numberOfTimesCalled = 0;
function something() {
  numberOfTimesCalled += 1;
  return numberOfTimesCalled;
}

callSomething(); // 1
callSomething(); // 2
```
### 默认参数可用于后面的默认参数
已经遇到的参数可用于以后的默认参数：
```js
function greet(name, greeting, message = greeting + ' ' + name) {
    return [name, greeting, message];
}

greet('David', 'Hi');  // ["David", "Hi", "Hi David"]
greet('David', 'Hi', 'Happy Birthday!');  // ["David", "Hi", "Happy Birthday!"]
```

### 位于默认参数之后非默认参数
在Gecko 26 (Firefox 26 / Thunderbird 26 / SeaMonkey 2.23 / Firefox OS 1.2)之前，以下代码会造成SyntaxError错误。这已经在bug 1022967中修复，并在以后的版本中按预期方式工作。参数仍然设置为从左到右，覆盖默认参数，即使后面的参数没有默认值。
```js
function f(x = 1, y) {
  return [x, y];
}

f(); // [1, undefined]
f(2); // [2, undefined]
```

### 有默认值的解构参数
你可以通过解构赋值为参数赋值：
```js
function f([x, y] = [1, 2], {z: z} = {z: 3}) {
  return x + y + z;
}

f(); // 6
```

## 剩余参数
```js
function sum(...theArgs) {
  return theArgs.reduce((previous, current) => {
    return previous + current;
  });
}

console.log(sum(1, 2, 3));
// expected output: 6

console.log(sum(1, 2, 3, 4));
// expected output: 10
```
### 描述
如果函数的最后一个命名参数以`...`为前缀，则它将成为一个由剩余参数组成的真数组，其中从0（包括）到theArgs.length（排除）的元素由传递给函数的实际参数提供。
在上面的例子中，theArgs将收集该函数的第三个参数（因为第一个参数被映射到a，而第二个参数映射到b）和所有后续参数。

### 剩余参数和 arguments对象的区别
剩余参数和 arguments对象之间的区别主要有三个：
- 剩余参数只包含那些没有对应形参的实参，而 arguments 对象包含了传给函数的所有实参。
- arguments对象不是一个真正的数组，而剩余参数是真正的 Array实例，也就是说你能够在它上面直接使用所有的数组方法，比如 sort，map，forEach或pop。
- arguments对象还有一些附加的属性 （如callee属性）。

### 解构剩余参数
剩余参数可以被解构，这意味着他们的数据可以被解包到不同的变量中。
```js
function f(...[a, b, c]) {
  return a + b + c;
}

f(1)          // NaN (b and c are undefined)
f(1, 2, 3)    // 6
f(1, 2, 3, 4) // 6 (the fourth parameter is not destructured)
```

### 示例
因为theArgs是个数组，所以你可以使用length属性得到剩余参数的个数：
```js
function fun1(...theArgs) {
  alert(theArgs.length);
}

fun1();  // 弹出 "0", 因为theArgs没有元素
fun1(5); // 弹出 "1", 因为theArgs只有一个元素
fun1(5, 6, 7); // 弹出 "3", 因为theArgs有三个元素
```
下例中，剩余参数包含了从第二个到最后的所有实参，然后用第一个实参依次乘以它们：
```js
function multiply(multiplier, ...theArgs) {
  return theArgs.map(function (element) {
    return multiplier * element;
  });
}

var arr = multiply(2, 1, 2, 3);
console.log(arr);  // [2, 4, 6]
```

# 展开语法
展开语法(Spread syntax), 可以在函数调用/数组构造时, 将数组表达式或者string在语法层面展开；还可以在构造字面量对象时, 将对象表达式按key-value的方式展开。(译者注: 字面量一般指 [1, 2, 3] 或者 {name: "mdn"} 这种简洁的构造方式)
```js
function sum(x, y, z) {
  return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers));
// expected output: 6

console.log(sum.apply(null, numbers));
// expected output: 6
```
## 语法
函数调用：
```js
myFunction(...iterableObj);
```
字面量数组构造或字符串：
```js
[...iterableObj, '4', ...'hello', 6];
```
构造字面量对象时,进行克隆或者属性拷贝（ECMAScript 2018规范新增特性）：
```js
let objClone = { ...obj };
```
## 在函数调用时使用展开语法
**等价于apply的方式**
如果想将数组元素迭代为函数参数，一般使用Function.prototype.apply 的方式进行调用。
```js
function myFunction(x, y, z) { }
var args = [0, 1, 2];
myFunction.apply(null, args);
```
有了展开语法，可以这样写：
```js
function myFunction(x, y, z) { }
var args = [0, 1, 2];
myFunction(...args);
```
所有参数都可以通过展开语法来传值，也不限制多次使用展开语法。
```js
function myFunction(v, w, x, y, z) { }
var args = [0, 1];
myFunction(-1, ...args, 2, ...[3]);
```

## 在 new 表达式中应用
使用 new 关键字来调用构造函数时，不能直接使用数组+ apply 的方式（apply 执行的是调用 [[Call]] , 而不是构造 [[Construct]]）。当然, 有了展开语法, 将数组展开为构造函数的参数就很简单了：
```js
var dateFields = [1970, 0, 1]; // 1970年1月1日
var d = new Date(...dateFields);
```

## 构造字面量数组时更给力！
没有展开语法的时候，只能组合使用 push, splice, concat 等方法，来将已有数组元素变成新数组的一部分。有了展开语法,  通过字面量方式, 构造新数组会变得更简单、更优雅：
```js
var parts = ['shoulders', 'knees'];
var lyrics = ['head', ...parts, 'and', 'toes']; 
// ["head", "shoulders", "knees", "and", "toes"]
```
和参数列表的展开类似, `...`在构造字面量数组时, 可以在任意位置多次使用.

## 数组拷贝(copy)
```js
var arr = [1, 2, 3];
var arr2 = [...arr]; // like arr.slice()
arr2.push(4);

// arr2 此时变成 [1, 2, 3, 4]
// arr 不受影响
```
提示: 实际上, 展开语法和 Object.assign() 行为一致, 执行的都是浅拷贝(只遍历一层)。如果想对多维数组进行深拷贝, 下面的示例就有些问题了。
```js
var a = [[1], [2], [3]];
var b = [...a];
b.shift().shift(); // 1
// Now array a is affected as well: [[2], [3]]
```

## 连接多个数组
Array.concat 函数常用于将一个数组连接到另一个数组的后面。如果不使用展开语法, 代码可能是下面这样的:
```js
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
// 将 arr2 中所有元素附加到 arr1 后面并返回
var arr3 = arr1.concat(arr2);
```
使用展开语法:
```js
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
var arr3 = [...arr1, ...arr2];
```
Array.unshift 方法常用于在数组的开头插入新元素/数组.  不使用展开语法, 示例如下:
```js
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
// 将 arr2 中的元素插入到 arr1 的开头
Array.prototype.unshift.apply(arr1, arr2) // arr1 现在是 [3, 4, 5, 0, 1, 2]
```
如果使用展开语法, 代码如下:  [请注意, 这里使用展开语法创建了一个新的 arr1 数组,  Array.unshift 方法则是修改了原本存在的 arr1 数组]:
```js
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1 = [...arr2, ...arr1]; // arr1 现在为 [3, 4, 5, 0, 1, 2]
```

## 构造字面量对象时使用展开语法
Rest/Spread Properties for ECMAScript 提议(stage 4) 对 字面量对象 增加了展开特性。其行为是, 将已有对象的所有可枚举(enumerable)属性拷贝到新构造的对象中.

浅拷贝(Shallow-cloning, 不包含 prototype) 和对象合并, 可以使用更简短的展开语法。而不必再使用 Object.assign() 方式.
```js
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// 克隆后的对象: { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// 合并后的对象: { foo: "baz", x: 42, y: 13 }
```
提示: Object.assign() 函数会触发 setters，而展开语法则不会。

## 只能用于可迭代对象
在数组或函数参数中使用展开语法时, 该语法只能用于可迭代对象：
```js
var obj = {'key1': 'value1'};
var array = [...obj]; // TypeError: obj is not iterable
```

## 与剩余参数的区别
剩余语法(Rest syntax) 看起来和展开语法完全相同，不同点在于, 剩余参数用于解构数组和对象。从某种意义上说，剩余语法与展开语法是相反的：展开语法将数组展开为其中的各个元素，而剩余语法则是将多个元素收集起来并“凝聚”为单个元素

# Lambda表达式(箭头函数)
js中的Lambda表达式就可以看作是一个匿名函数声明方式，可以随意地使用，不像java那样，只有在实现一个函数接口时候才能使用Lambda表达式
**箭头函数中的this, arguments问题**
首先箭头函数其实是没有`this`, `arguments`的，箭头函数中的`this`与`arguments`只取决于包裹箭头函数的第一个普通函数的`this`的`arguments`。在下面例子中，因为包裹箭头函数的第一个普通函数是a，所以此时的`this`是`window`，`arguments`是普通函数a中的`arguments`。
```js
window.num = 1
function a() {
  return () => {
    return () => {
      console.log(this.num)//window
      console.log(arguments.length) 
      return 123
    }
  }
}
console.log(a(1,1)()())//123
```
输出：
```
1
2
123
```


# this的指向

使用 JavaScript 开发的时候，很多开发者多多少少会被 this 的指向搞蒙圈，但是实际上，关于 this 的指向，记住最核心的一句话：**函数里的this总是指向调用该函数的对象。**

## 浏览器环境下this普通函数指向
最外层的对象就是windows。我们在最外层调用test()函数，所以test()的this也是win，故输出“win”。
```js
//在浏览器执行
window.name = 'win'
function test(){
    console.log(this.name); //输出“win”
}
test();
```
并且最外层的this就是windows 
```js
//在浏览器执行
console.log(this === window); //输出“ture”
```
所以我们可以写这样一个代码：
```js
//在浏览器执行
this.name = 'win' //这种写法与windows.name=win等价
 
console.log(this === window); //输出“ture”
 
function test(){
    console.log(window === this); //输出“true”
    console.log(this.name); //输出“win”
}
test();
```
好了，以上就是在浏览器中函数指向this简谈。

## node环境下this普通函数指向
看懂上边里的例子，我们会认为node只是把全局的的名字window换成了global。

并且看起来也是这样：
```js
//在node环境执行
global.name = 'node.js'
function test(){
    console.log(this.name); //输出“node.js”
}
test();
```
可是，这不代表node中仅仅是把全局对象改名为global这么简单！

看下边这个例子：
```js
//在node中执行
this.name = 'win' 
 
console.log(this === global); //输出"false”
 
function test(){
    console.log(this === global); //输出“true”
    console.log(this.name); //输出“undefined”
}
test();
```
也就是说，在最外层this不等于global，但是test函数的this依旧指向global。

这是因为在最外层的this并不是全局对象global。而是`module.exports`

关于`module.export`具体定义可以查看相关文章，这是es6的新特性。
```js
console.log(module.exports === this); //输出“true”
``` 

总结：node中最外层this不等于全局作用域global。而且在最外层调用函数，将会使得函数指向global。

# 函数中this关键字与arguments关键字
<font color="red">解析器在调用函数时，每次都会向函数内部传递一个隐含的参数this与arguments, this指向调用这个方法的对象</font>

**arguments对象**
arguments是一个类数组对象(一个类似于数组但不是数组的对象)，它可以通过索引来操作数据，也可以获取长度，在调用函数时，我们所传递的实参(注意：不是形参)都会在arguments中报存，我们可以通过`arguments[i]`的方式来获取第i个实参 

arguments常用方法:`arguments.length`, `arguments.callee`

# js中没有方法重载
js中是没有方法重载的，只有覆盖
```js
function test(a){
  console.log("test1....");
}
function test(){
  console.log("test....");
}
test(1);//输出：test...
```
```js
function test(){
  console.log("test....");
}
function test(a){
  console.log("test1....");
}
test(1);//输出：test1...
```
但是由于arguments属性的存在，我们可以模拟重载，如下：
```js
function add(num1, num2){
  if(arguments.length == 1){
    alert("你输入的只有一个数字:"+arguments[0]+" 请重新输入");
  }else if(arguments.length == 2){
    alert("你输入数字的和为：" + arguments[0]+arguments[1]);
  }
}
```

**注：js调用函数时传入的参数个数与函数定义时的参数个数不符时的操作**
ECMAScript函数的参数与大多数其他语言中的函数的参数有所不同。<font color="red">ECMAScript函数不介意传递进来多少个参数，也不在乎穿进来参数是什么数据类型</font>。也就是是说，即便你定义的函数值接受两个参数，在调用这个函数时也未必一定要是两个参数。可以传递一个、三个甚至不传递参数，而解析器永远不会有什么怨言。之所以会这样，原因是ECMAScript中的参数在内部是用一个数组来运行的。函数接受到的永远是这个数组，而不关心数组中包含哪些参数(如果有参数的话)。如果这个数组中不包含任何元素，无所谓；如果包含多个元素，也没问题。实际上，在函数体内可以通过arguments对象来访问这个参数数组，从而获取传递给含糊的每一个参数。

# 原型对象
- 每创建一个函数，解析器都会向函数中添加一个属性`prototype`，这个属性对应着一个对象，这个对象就是原型对象。
- 当函数以构造函数的形式调用时，它所创建的对象都会有一个隐含的属性`__proto__`, 这个属性指向构造函数的原型对象
- 原型对象也一个隐含属性`__prote__`, 同样也是指向它的原型对象
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210404175329.png" width="700px"/>

原型对象的作用：相当于一个公共的区域，所有同一个类的实例都可以访问到这个原型对象，所以我们可以将对象中共有的内容，放到原型对象中
下面是用实例阐述了原型对象的作用
```js
function Person(name){
  this.name = name;
  this.sayName = function(){
    alert(this.name);
  };
}
var obj4 = new Person("whz");
```
这样的话，每创建一个Person对象，都会在堆中创建一个sayName方法对象，这样做的效率太低了
做如下改进：
```js
function Person(name){
  this.name = name;
  this.sayName = say;
}
var say = function(){
  alert(this.name);
};

var obj4 = new Person("whz");
```
这样的话，解决了上述的开辟多个sayName方法对象的问题，但是这样做的话，要创建一个全局变量，在开发中，是十分不推荐随意创建全局变量的
做如下改进：
```java
function Person(name){
  this.name = name;
  this.sayName = say;
}
Person.prototype.sayName = function(){
  alert(this.name);
}
var obj4 = new Person("whz");
```
使用原型对象的方式就很好的解决了上述所有问题

# call()和apply()
call()、apply()都是来修改this的指向。

- 这两个方法都是函数对象的方法，需要通过函数对象来调用，从而调用函数执行
- 在调用call()和apply()时，可以将一个对象作为该方法的第一个参数，此时这个对象就会成为该函数执行时的this所指向的对象 
- call和apply用法基本相同，只是传参的方式不同而已，call是一个一个的传值， apply则传入一个数组；
  - call()可以将参数放在第一个参数后一次传递，例如`fun.call(obj, 2, 3);`
  - apply()需要将参数封装到一个数组中传递，例如`fun.call(obj,[2, 3]);`



# 访问一个属性的过程
当访问对象中的一个属性或方法时，它会先在对象自身中寻找，再到该对象的原型对象中寻找，再到该对象的原型对象的原型对象中寻找，直到找到Object对象，Object对象没有原型对象，如果再Object中还没有找到，则返回undefined

# 浏览器加载HTML页面的顺序
首先我们可以把浏览器加载页面的工作分给`渲染引擎`和`javascript引擎`
浏览器在解析页面时，是**从上到下的**，我们来看下面这个结构：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210404193325.png" width="700px"/>

**浏览器加载顺序：**
1. 解析到head标签内的内部样式表①，渲染引擎加载样式表中的样式，下载引用到的图片，下载等工作可以跟渲染同时进行。
2. 向服务器请求链如样式表②，然后渲染引擎加载样式表中的样式。
3. 下载链入js③，浏览器将控制权交给js引擎，js引擎解释执行。
4. 遇到script标签，将控制权交给js引擎，从上到下，js引擎解释执行。
5. 加载完head标签后，继续向下解析，执行到内部js⑤，js引擎解释执行。
6. 加载完body中的标签，之后再将控制权交给js引擎，js引擎解释执行内部js⑥。
7. 遇到html结束标签，加载完毕，将构建好的DOM树和计算好的样式整合构成渲染树（render树），在浏览器窗口中画出。

**js文件和script标签的加载**
在解析到链入js文件或者script标签时。浏览器会阻塞其它下载，即无法并行解析和下载，在请求js文件时，浏览器会一直等待返回结果并解析完成之后才会继续向下执行。
重点：建议将script标签放在body的最后，因为js文件很有可能会修改DOM树和引用DOM元素，为了不让js文件解析执行时找不到要引用的DOM元素和DOM树被反复修改而带来的性能问题，所以最好将script标签放在body的最后，或者可以在js代码放在window.onload中，意思是等页面全部加载完之后再加载这些js代码。

# 页面渲染的过程
## 页面渲染是客户端请求页面的最后一步
- DNS解析域名
- TCP建立连接
- HTTP发送请求
- 服务器返回状态码及相应数据
- 浏览器解析渲染页面

## 渲染引擎
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210714125220.png" width="200px"/>

从图中可以看出，一个渲染引擎大致包括HTML解释器、CSS解释器、布局和JavaScript引擎。
- `HTML解释器`：解释HTML语言的解释器，本质是将HTML文本解释成DOM树（文档对象模型）。
- `CSS解释器`：解释样式表的解释器，其作用是将DOM中的各个元素对象加上样式信息，从而为计算最后结果的布局提供依据。
- `布局`：将DOM和css样式信息结合起来，计算它们的大小位置等布局信息，形成一个能够表示这所有信息的内部表示模型即渲染树。
- `JavaScript引擎`：JavaScript可以修改网页的内容，也能修改CSS的信息，JavaScript引擎解释JavaScript代码并把代码的逻辑和对DOM和CSS的改动信息应用到布局中去，从而改变渲染的结果。

## 页面渲染
浏览器加载，解析，渲染页面
解析html 构建dom树 -> 构建render树 -> 布局render树 -> 绘制render树 ：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210714124945.png" width="300px"/>
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210714125758.png" width="300px"/>

我们知道浏览器为了体验友好，并不是文档全部都解析才绘制到屏幕上，而是从上至下开始解析html，遇到css 会开启线程下载css；
解析：
- 浏览器会将HTML解析成一个DOM树（Document Object Model 文档对象模型），DOM树的构建过程是一个深度遍历过程，当前节点的所有子节点都构建好后才会去构建当前节点的下一个兄弟节点，
- 将CSS解析成CSS规则树（或CSSOM树，CSS Object Model CSS对象模型）；
- 构建：根据DOM树和CSS来构造render树，渲染树不等于DOM树，像header和display：none；这种没有具体内容的东西就不在渲染树中；
- 布局：根据render树，浏览器可以计算出网页中有哪些节点，各节点的CSS以及从属关系，然后可以计算出每个节点在屏幕中的位置；
- 绘制：遍历render树进行绘制页面中的各元素。

### Reflow（重排）
渲染对象在创建完成并添加到渲染树时，并不包含位置和大小信息。计算这些值的过程称为`布局`或`重排`。

**当改变影响到文本内容或结构，或者元素位置时**，重排或者说重新布局就会发生。这些改变通常由以下事件触发：
- DOM操作（元素添加、删除、修改或者元素顺序的改变）；
- 内容变化，包括表单域内的文本改变；
- CSS属性的计算或改变；
- 添加或删除样式表；
- 更改“类”的属性；
- 浏览器窗口的操作（缩放，滚动）；
- 伪类激活（悬停）。

### Repaint(重绘)
重绘是改变不影响元素在网页中的位置的元素样式时，譬如background-color(背景色)， border-color(边框色)， visibility(可见性)，浏览器会根据元素的新属性重新绘制一次(这就是重绘，或者说重新构造样式)，使元素呈现新的外观。**重绘不会带来重新布局，所以并不一定伴随重排。**


"重绘"不一定需要"重排"，比如改变某个网页元素的颜色，就只会触发"重绘"，不会触发"重排"，因为布局没有改变。但是，"重排"必然导致"重绘"，比如改变一个网页元素的位置，就会同时触发"重排"和"重绘"，因为布局改变了。

## 浏览器如何优化渲染？
- 将多次改变样式属性的操作合并成一次操作
- 将需要多次重排的元素，position属性设为absolute或fixed，
这样此元素就脱离了文档流，它的变化不会影响到其他元素。例如有动画效果的元素就最好设置为绝对定位。
- 由于display属性为none的元素不在渲染树中，对隐藏的元素操作不会引发其他元素的重排。
如果要对一个元素进行复杂的操作时，可以先隐藏它，操作完成后再显示。这样只在隐藏和显示时触发2次重排。
- 如果在解析html的时候遇到js会阻塞页面渲染，所以一般将script标签放到页面底部，也就是body闭合标签之前，这能确保在脚本执行前页面已经完成了DOM树渲染
- 尽可能地合并脚本。页面中的script标签越少，加载也就越快，响应也越迅速。无论是外链脚本还是内嵌脚本都是如此
- 不要一条一条地修改 DOM 的样式。与其这样，还不如预先定义好 css 的 class，然后修改 DOM 的 className
- 千万不要使用 table 布局。因为可能很小的一个小改动会造成整个 table 的重新布局

# createDocumentFragment()与createElement()
1.createDocumentFragment()方法，是用来创建一个虚拟的节点对象，或者说，是用来创建文档碎片节点。它可以包含各种类型的节点，在创建之初是空的。

2.DocumentFragment节点不属于文档树，继承的parentNode属性总是null。它有一个很实用的特点，当请求把一个DocumentFragment节点插入文档树时，插入的不是DocumentFragment自身，而是它的所有子孙节点，即插入的是括号里的节点。这个特性使得DocumentFragment成了占位符，暂时存放那些一次插入文档的节点。它还有利于实现文档的剪切、复制和粘贴操作。 

另外，当需要添加多个dom元素时，如果先将这些元素添加到DocumentFragment中，再统一将DocumentFragment添加到页面，会减少页面渲染dom的次数，效率会明显提升。

3.如果使用appendChid方法将原dom树中的节点添加到DocumentFragment中时，会删除原来的节点。 

4.createDocumentFragment()方法和createElement()方法的区别：
(1)需要很多的插入操作和改动，继续使用类似于下面的代码则会很有问题
```js
var ul = document.getElementById("ul");
for (var i = 0; i < 20; i++) {
    var li = document.createElement("li");
    li.innerHTML = "index: " + i;
    ul.appendChild(li);
}
```
由于每一次对文档的插入都会引起重新渲染（计算元素的尺寸，显示背景，内容等），所以进行多次插入操作使得浏览器发生了很多次渲染，效率是比较低的。这是我们提倡通过减少页面的渲染来提高DOM操作的效率的原因。一个优化的方法是将要创建的元素写到一个字符串上，然后一次性写到innerHTML上，这种利用浏览器对innerHTML的解析确实是相比上面的多次插入快了很多。但是构造字符串灵活性上面比较差，很难符合创建各种各样的DOM元素的需求。利用DocumentFragment，可以弥补这两个方法的不足。

因为文档片段存在于内存中，并不在DOM中，所以将子元素插入到文档片段中时不会引起页面回流（对元素位置和几何上的计算），因此使用DocumentFragment可以起到性能优化的作用。例如上面的代码就可以改成下面的片段。
```js
var ul = document.getElementById("ul");
var fragment = document.createDocumentFragment();
for (var i = 0; i < 20; i++) {
    var li = document.createElement("li");
    li.innerHTML = "index: " + i;
    fragment.appendChild(li);
}
ul.appendChild(fragment);
```
(2)createElement创建的元素可以使用innerHTML，createDocumentFragment创建的元素使用innerHTML并不能达到预期修改文档内容的效果，只是作为一个属性而已。两者的节点类型完全不同，createElement创建的是元素节点，节点类型为1，createDocumentFragment创建的是文档碎片，节点类型是11。并且createDocumentFragment创建的元素在文档中没有对应的标记，因此在页面上只能用js中访问到。
```js
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style type="text/css">
        #outer{ height: 200px; border: 1px solid #006400;}
    </style>
</head>
<body>
<div id="outer">
</div>
<input type="button" value="createElement" id="btn_1"/><input type="button" value="createDocumentFragment" id="btn_2"/>
<script type="text/javascript">
var fragment_1 = document.createDocumentFragment();
        fragment_1.innerHTML = '<p>我是一个粉刷匠</p>';
        document.body.appendChild(fragment_1);
    var fragment_2 = document.createElement('p');
        fragment_2.innerHTML = '粉刷本领强';
        document.body.appendChild(fragment_2);
</script>
</body>
</html>
```

(3)createElement创建的元素可以重复操作，添加之后就算从文档里面移除依旧归文档所有，可以继续操作，但是createDocumentFragment创建的元素是一次性的，添加之后再就不能操作了（说明：这里的添加并不是添加了新创建的片段，因为上面说过，新创建的片段在文档内是没有对应的标签的，这里添加的是片段的所有子节点）。
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style type="text/css">
        #outer{ height: 200px; border: 1px solid #006400;}
    </style>
</head>
<body>
<div id="outer">
</div>
<input type="button" value="createElement" id="btn_1"/><input type="button" value="createDocumentFragment" id="btn_2"/>
<script type="text/javascript">
    function $(id){
        return document.getElementById(id);
    }
    var outer = $('outer');
    var inner = $('inner'); 
    $('btn_1').onclick = function(){
        var div = document.createElement('div');
            div.innerHTML = '<p>测试createElement</p>';
        document.body.appendChild(div);
        setTimeout(function(){
            outer.appendChild(div);
            setTimeout(function(){
                outer.removeChild(div);
            },1000)
        },1000)
    }
    $('btn_2').onclick = function(){
        var p = document.createElement('p');
            p.innerHTML = '测试DocumentFragment';
        var fragment = document.createDocumentFragment();
            fragment.appendChild(p);
            fragment.innerHTML = '<p>测试DocumentFragment</p>';
            fragment.innerHTML = '<span>测试DocumentFragment</span>';
        document.body.appendChild(fragment);
        setTimeout(function(){
            outer.appendChild(fragment);//报错，因为此时文档内部已经能够不存在fragment了
            setTimeout(function(){
                outer.removeChild(fragment);
            },1000)
        },1000)
    }
</script>
</body>
</html>
```
(4)通过createElement新建元素必须指定元素tagName,因为其可用innerHTML添加子元素。通过createDocumentFragment则不必。

(5)通过createElement创建的元素插入文档后，还可以取到创建时的返回值，即上面例子中createElement还是创建的那个div元素，而createDocumentFragment创建的元素插入到文档后，就不能访问创建时的返回值了，相当于把自己创建的文档片段直接挪到文档中了。

5.createDocumentFragment()方法和createElement()方法的共同点：

(1)添加子元素后返回值都是新添加的子元素，因此，可通过下面的方法利用innerHTML为createDocumentFragment添加子元素：
```js
var fragment = document.createDocumentFragment();
var ret = fragment.appendChild(document.createElement('div'));
ret.innerHTML = 'by innerHTML ';
test1.appendChild(fragment);
```
(2)都可以通过appendChild添加子元素，且子元素必须是node类型，不能为文本。

(3)若添加的子元素是文档中存在的元素，则通过appendChild在为其添加子元素时，会从文档中删除之前存在的元素。

6.DocumentFragment是没有父节点的最小的文档对象，用于存储HTML和XML片段。DocumentFragment对象继承Node，所以它有Node的所有属性方法，完全可以操作Node(NodeList)那样操作DocumentFragment。此外W3C对DocumentFragment也定义了一些另外的属性和方法，但是由于多数浏览器都没有实现，从兼容性上来说不推荐使用这些属性。具体有哪些属性方法可以参考MDN说明。

创建DocumentFragment的方法有两种，document.createDocumentFragment()和new Fragment()。对于document.createDocumentFragment()，所有浏览器都支持（包括IE6），而构造函数方法就不是所有浏览器都有效了（IE没有实现该方法）。所以从兼容性上来说推荐使用document.createDocumentFragment()。

# 闭包
当一个嵌套的内部(子)函数引用了嵌套的外部(父)函数的变量或函数时，就产生了闭包。
闭包可以理解为是嵌套的内部函数。

**闭包产生的两个条件：**
- 函数嵌套
- 内部函数引用了外部函数的数据(变量/函数)
注：满足上面的两个条件后，执行内部函数的定义就能产生闭包，而无需调用内部函数
```js
function fn1(){
  var a = 2
  var b = 'abc'
  function fn2(){ 
    console.log(a)
  }
  return fn2
}
```
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210404203306.png" width="700px"/>

**闭包的作用**
- 使函数内部的变量在函数执行完后，仍然存活在内存中(延迟了局部变量的生命周期)
- 让外部能够操作(读写)到函数内部的数据(变量/函数)
**闭包的生命周期**
产生：在嵌套内部函数定义执行(函数声明提升)时就产生了,不是在调用时产生
死亡：在嵌套内部函数成为垃圾对象时，即没有引用指向嵌套内部函数时
```js
function fn1(){
  //此时闭包就产生了，因为函数提升
  var a = 2
  var b = 'abc'
  function fn2(){ 
    a++
    console.log(a)
  }
  return fn2
}
var f = fn1()
f(); //输出：3
f(); //输出：4
f = null // 闭包死亡（因为没有引用指向嵌套内部函数）
```

**闭包的引用：自定义js模块**
```js
(function(){
  var msg = "whz"
  function doSomething(){
    console.log('doSomething()'+msg.toUpperCase())
  }
  function doOthering(){
    console.log('doOtherthing()'+msg.toLowerCase())
  }

  //向外暴露嵌套内部函数
  window.myMoudle2 = {
    doSomething: doSomething,
    doOtherthing: doOtherthing
  }
})()

myMoudle2.doSomething()
myMoudle2.doOtherthing()
```

# js的错误处理
js的错误类型：
- Error：是所有错误类型的父类型
- ReferenceError: 引用的变量不存在的错误
- TypeError: 数据类型不正确的错误
- RangeError: 数据值不在其所允许的范围内
- SyntaxError: 语法错误

**错误处理**
- 捕获错误：try...catch
```js
try{
  let d
  console.log(d.name)
}catch(error){
  console.log(error.message)
  console.log(error.stack)
}
```
- 抛出错误：throw error
```js
if(Date.now()%2 === 1){
  console.log('执行任务')
}else{
  throw new Error('错误');
}
```

# 解构赋值
[解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

基本语法
```js
var a, b, rest;
[a, b] = [10, 20];
console.log(a); // 10
console.log(b); // 20

[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); // 10
console.log(b); // 20
console.log(rest); // [30, 40, 50]

({ a, b } = { a: 10, b: 20 });
console.log(a); // 10
console.log(b); // 20

// Stage 4（已完成）提案中的特性
({a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40});
console.log(a); // 10
console.log(b); // 20
console.log(rest); // {c: 30, d: 40}
```

# 类
## 创建对象
```js
//第一种
var obj = new Object;
obj.name = "whz";

//第二种
var obj1 = {};
obj1.name = "whz";

//第三种
var obj2 = {
  name:"whz",
  age:18
};

//第四种
function createPerson(name, age, gender){
  var obj = new Object();
  obj.name = name;
  obj.age = age;
  obj.gender = gender;
  obj.sayName = function(){
    alert(this.name);
  };
  return obj;
}
var obj3 = createPerson("whz", 28, "男");

//第五种
function Person(name, age, gender){
  this.name = name;
  this.age = age;
  this.gender = gender;
  this.sayName = function(){
    alert(this.name);
  };
}
var obj4 = new Person("whz", 28, "男");
```

## new 关键字
在JavaScript中， new 关键字用来创建一个类（模拟类）的实例对象。 实例化对象之后， 也就继承了类的属性和方法。 例如：
```js
function Person(name, age){
  this.name = name;
  this.age = age;
}
Person.prototype.getName = function(){
  return this.name;
};

var person = new Person('james', 18);
console.log(person.name, person.age);
person.getName();
```
在以上代码中`var person = new Person('james', 18);`中的new关键字做了些什么呢？用伪代码来模拟其执行的过程如下：
```js
new Person('james', 18)  = {
  var obj = {};
  obj.__proto__ = Person.prototype;
  var res = Person.call(obj, 'james', 18);
  return typeof res === 'object' ? res : obj;
}
```
在JavaScript中， 使用new关键字后， 意味着做了如下4件事：
- 创建一个新的空对象`{}`
- 设置这个对象原型指向构造函数， 即上例中的`obj.__proto = Person.prototype`
- 执行构造函数， 当this关键字被提及的时候， 使用新创建的对象的属性。
- 返回新创建的对象（除非构造函数中返回的是“无原型”）。

## class关键字
ES6中新增了`class`关键字用来创建类
**类constructor构造函数**: constructor()方法是类的构造函数(默认方法)，用于传递参数，返回实例对象，通过new命令生成对象实例时，会自动调用该方法。如果没有写构造函数，类内部会自动给我创建一个无参构造函数`constructor()`

**示例**
```js
class Student{
  constructor(name, age){
    this.name = name
    this.age = age
  }
  say(){
    console.log('name:'+this.name)
  }
}

var stu = new Student("whz", 18);
```

## 类变量与类方法
其实js中的类变量与类方法与java中定义一样，即属于类的变量与方法，而不是实例的变量与方法
<font color="red">但是在java中实例能够访问类变量与类方法的，而js中实例是不能访问类变量与类方法</font>

ES6之前创建类变量与类方法的示例
```js
//ES6之前创建类变量与类方法的示例
function Phone(){ //构造函数
}
Phone.name = 'whz' // 定义了一个类变量
Phone.change = function(){ //定义了一个类方法
  console.log('fff') 
}

//ES6创建类变量与类方法的示例
class Phone1(){
  static name = 'whz' //定义了一个类变量
  static change(){ //定义了一个类方法
    console.log('fff') 
  }
}


let test = new Phone();
let test1 = new Phone1();
console.log(test.name) // 输出：undefined
console.log(test1.name) // 输出：undefined
test.change() // 报错： test.change is not a function
test1.change() // 报错： test.change is not a function
```

## 继承
**Es5实现继承的示例**
```js
//父类
function Phone(brand, price){
  this.brand = brand;
  this.price = price;
}
Phone.prototype.tele = function(){
  console.log("我可以打电话")
}

//子类
function SmartPhone(brand, price, color, size){
  Phone.call(this, brand, price);
  this.color = color
  this.size = size
}

//设置子类构造函数的原型
SmartPhone.prototype = new Phone()
SmartPhone.prototype.constructor = SmartPhone

//声明子类中的方法
SmartPhone.prototype.phone = function(){
  console.log("我可以拍照片")
}

const chuizi = new SmartPhone('锤子', 2499, '黑色','5.5inch')
console.log(chuizi) //输出：SmartPhone { brand: '锤子', price: 2499, color: '黑色', size: '5.5inch'
```

**Es6实现继承的示例**
```js
class Phone{
  constructor(brand, price){
    this.brand = brand
    this.price = price
  }

  tele(){
    console.log("我可以打电话");
  }
}
class SmartPhone extends Phone{
  //构造函数
  constructor(brand, price, color, size){
    super(brand, price) //调用父类中的构造函数，类似于ES5中的Phone.call(this, brand, price)
    this.color = color
    this.size = size
  }
  photo(){
    console.log("拍照")
  }
}
const chuizi = new SmartPhone('锤子', 2499, '黑色','5.5inch')
console.log(chuizi) //输出：SmartPhone { brand: '锤子', price: 2499, color: '黑色', size: '5.5inch'
```

# setter
当尝试设置属性时，set语法将对象属性绑定到要调用的函数。
```js
const language = {
  set current(name) {
    this.log.push(name);
  },
  log: []
};

language.current = 'EN';
language.current = 'FA';

console.log(language.log);
// expected output: Array ["EN", "FA"]
```

## 语法
```
{set prop(val) { . . . }}
{set [expression](val) { . . . }}
```
- 参数: prop,要绑定到给定函数的属性名。
- val: 用于保存尝试分配给prop的值的变量的一个别名。
- 表达式: 从 ECMAScript 2015 开始，还可以使用一个计算属性名的表达式绑定到给定的函数。

## 描述
在 javascript 中，如果试着改变一个属性的值，那么对应的 setter 将被执行。setter 经常和 getter 连用以创建一个伪属性。不可能在具有真实值的属性上同时拥有一个 setter 器。
使用 set 语法时请注意：
- 它的标识符可以是数字或字符串；
- 在对象字面量中，不能为一个已有真实值的变量使用 set ，也不能为一个属性设置多个 set。( { set x(v) { }, set x(v) { } } 和 { x: ..., set x(v) { } } 是不允许的 )

## 在对象初始化时定义 setter
这将定义一个对象 language 的伪属性current，当current被分配一个值时，将使用该值更新log：
```js
const language = {
  set current(name) {
    this.log.push(name);
  },
  log: []
}

language.current = 'EN';
console.log(language.log); // ['EN']

language.current = 'FA';
console.log(language.log); // ['EN', 'FA']
```
请注意，current属性是未定义的，访问它时将会返回 undefined。

## 用 delete 操作符移除一个 setter
我们可以使用delete操作符移除 setter。
```js
delete language.current;
```

## 使用 defineProperty 为当前对象定义 setter
我们可以随时使用 Object.defineProperty() 给一个已经存在的对象添加一个 setter。
```js
const o = { a:0 };

Object.defineProperty(o, "b", { set: function (x) { this.a = x / 2; } });

o.b = 10; // Runs the setter, which assigns 10 / 2 (5) to the 'a' property
console.log(o.a) // 5
```

## 使用计算属性名
```js
const expr = "foo";

const obj = {
  baz: "bar",
  set [expr](v) { this.baz = v; }
};

console.log(obj.baz); // "bar"
obj.foo = "baz";      // run the setter
console.log(obj.baz); // "baz"
```

# getter
get语法将对象属性绑定到查询该属性时将被调用的函数。
```js
const obj = {
  log: ['a', 'b', 'c'],
  get latest() {
    if (this.log.length === 0) {
      return undefined;
    }
    return this.log[this.log.length - 1];
  }
};

console.log(obj.latest);
// expected output: "c"
```
语法
```
{get prop() { ... } }
{get [expression]() { ... } }
```
- 参数: prop, 要绑定到给定函数的属性名。
- expression: 从 ECMAScript 2015 开始，还可以使用一个计算属性名的表达式绑定到给定的函数。

## 描述
有时需要允许访问返回动态计算值的属性，或者你可能需要反映内部变量的状态，而不需要使用显式方法调用。在JavaScript中，可以使用 getter 来实现。
尽管可以结合使用getter和setter来创建一个伪属性，但是不可能同时将一个 getter 绑定到一个属性并且该属性实际上具有一个值。

使用get语法时应注意以下问题：
- 可以使用数值或字符串作为标识；
- 它不能与另一个 get 或具有相同属性的数据条目同时出现在一个对象字面量中（不允许使用 { get x() { }, get x() { } } 和 { x: ..., get x() { } }）。

## 在新对象初始化时定义一个getter
这会为obj创建一个伪属性latest，它会返回log数组的最后一个元素。
```js
const obj = {
  log: ['example','test'],
  get latest() {
    if (this.log.length == 0) return undefined;
    return this.log[this.log.length - 1];
  }
}
console.log(obj.latest); // "test".
```
注意，尝试为latest分配一个值不会改变它。

## 使用delete操作符删除 getter
只需使用 delete，就可删除 getter：
```js
delete obj.latest;
```

## 使用defineProperty在现有对象上定义 getter
要随时将 getter 添加到现有对象，使用 Object.defineProperty().
```js
var o = { a:0 }
Object.defineProperty(o, "b", { get: function () { return this.a + 1; } });
console.log(o.b) // Runs the getter, which yields a + 1 (which is 1)
```

## 使用计算出的属性名
```js
var expr = 'foo';

var obj = {
  get [expr]() { return 'bar'; }
};

console.log(obj.foo); // "bar"
```

## 智能 / 自我复写/ 懒加载 getters
Getters 给你一种方法来定义一个对象的属性，但是在访问它们之前不会计算属性的值。 getter 延迟计算值的成本，直到需要此值，如果不需要，您就不用支付成本。

一种额外的优化技术是用智能(或称记忆化)getters 延迟属性值的计算并将其缓存以备以后访问。该值是在第一次调用getter 时计算的，然后被缓存，因此后续访问返回缓存值而不重新计算它。这在以下情况下很有用：
- 如果属性值的计算是昂贵的（占用大量RAM或CPU时间，产生工作线程，检索远程文件等）。
- 如果现在不需要该值。它将在稍后使用，或在某些情况下它根本不使用。
- 如果被使用，它将被访问几次，并且不需要重新计算，该值将永远不会被改变，或者不应该被重新计算。

这意味着你不应该为你希望更改其值的属性使用懒 getter，因为 getter 不会重新计算该值。
在以下示例中，对象具有一个 getter 属性。在获取属性时，该属性将从对象中删除并重新添加，但此时将隐式显示为数据属性。最后返回得到值。
```js
get notifier() {
  delete this.notifier;
  return this.notifier = document.getElementById('bookmarked-notification-anchor');
},
```

# console.dir
在控制台中显示指定JavaScript对象的属性，并通过类似文件树样式的交互列表显示。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20211010221952.png" width="700px"/>

# ES6 中的 Map 和 Set 集合
下面正式来讨论这两种集合的特点
## Map
Map 中存储的是 key-value 形式的键值对,  其中的 key 和 value 可以是任何类型的,  即对象也可以作为 key . 这比用对象来模拟的方式就灵活了很多
### Map 的创建和初始化
1. 可以用new Map()构造函数来创建一个空的 Map
```js
// 创建一个空的 Map 
let map  = new Map();
```
2. 也可以在 Map() 构造函数中传入一个数组来创建并初始化一个 Map. 传入的数组是二维数组, 其中的每一个子数组都有两个元素,  前面的元素作为 key,  后面的元素作为 value,  这样就形成了一个 key-value 键值对. 例如:

```js
// 用数组来创建一个 非空的 Map 

let array = [ // 定义一个二维数组,  数组中的每子数组都有两个元素
    ['key1' ,  'value 1'],   // key 是 字符串 "key1", value 是字符串 "value 1"
    [{} ,  10086] ,          // key 是个对象, value 是数值 10086
    [ 5,  {} ]              // key 是个数值类型, value 是对象
];

let map = new Map(array);  // 将数组传入 Map 构造函数中
```

### Map 可用的 方法
```js
set(key, value): 向其中加入一个键值对
get(key): 若不存在 key 则返回 undefined
has(key):返回布尔值
delete(key): 删除成功则返回 true,  若key不存在或者删除失败会返回 false
clear(): 将全部元素清除
```

size 属性, 属性值为 map 中键值对的个数
遍历方法 forEach()
和数组的 forEach 方法类似, 回调函数中都包含3个参数 值, 键, 和 调用这个方法的 Map 集合本身
```js
map.forEach(function(value,  key,  ownerMap){
    console.log(key,  value); // 每对键和值
    console.log(ownerMap === map);  // true
});
```
## Set 集合
Set 和 Map 最大的区别是只有键 key 而没有 value,  所以一般用来判断某个元素(key)是否存在于其中.
### 创建和初始化方法
既可以创建一个空 set 也可以用数组来初始化一个非空的set. 和 Map 不同的是, 数组是一维数组, 每个元素都会成为 set 的键.例如:
```js
// 创建一个数组
let array = [1, 'str'];      // 一维数组

// 用数组来初始化 set
let set  = new Set(array);
```
### set 的方法
1. add(key): 往set添加一个元素,  如果传入多个参数, 则只会把第一个加入进去
```js
let set = new Set();
set.add(1, 2, 3);
console.log(set.has(1),  set.has(2),  set.has(3));  // true false false 可以看到只有第一个参数被加入进了 set
```
2. has(key)
3. delete(key)
4. clear()

可以使用new Set()来对一个数组进行去重
```js
Array.from(new Set([1,2,2,3]))
/**
输出为[1,2,3]
/
```

# 可迭代对象
判断当前对象是否为可迭代对象，检测该对象是否具备 Symbol.iterator 属性。
```js
    // 以数组为例
    Array.prototype.hasOwnProperty(Symbol.iterator); // => true
```
可通过检测当前对象是否具有Symbol.iterator属性来判断当前对象是否为可迭代对象。Symbol.iterator 是一个函数，所以通过typeof来检测返回值，如果返回值为'function'则为可迭代对象，如果返回值为'undefined'则为不可迭代对象。
```js
    typeof [][Symbol.iterator]; // => 'function'
    typeof {}[Symbol.iterator]; // => 'undefined'
    typeof new Set()[Symbol.iterator]; // => 'function'
    typeof new Map()[Symbol.iterator]; // => 'function'
    typeof ''[Symbol.iterator]; // => 'function'
    var list = document.querySelectorAll('p'); // 获取dom节点
    typeof list[Symbol.iterator]; // => 'function'
    typeof new Int8Array()[Symbol.iterator]  // => 'function'
    (function(){
        typeof arguments[Symbol.iterator]; // => 'function'
    })();
```
原生具备 Iterator 接口的数据结构如下。
- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

数组如何使用.next() 方法：
```js
    var arr = [1,2,3];
    var si = arr[Symbol.iterator]();
    si.next(); //=> {value: 1, done: false}
    si.next(); //=> {value: 2, done: false}
    si.next(); //=> {value: 3, done: false}
    si.next(); //=> {value: undefined, done: true}
```
如何实现一个自定义的可迭代对象：
```
    var myIterator = {};
    myIterator[Symbol.iterator] = function* () {
        yield 'Bryan';
        yield 'programmer';
        yield 'bachelordom';
    }
    for (let val of myIterator) {
        console.info(val);
    }
    // Bryan
    // programmer
    // bachelordom
```
总结
可迭代对象的特点：
- 可使用 for...of 进行循环；
- 对象或者原型链当中具有 Symbol.interator 属性；
- 可通过迭代器访问并跟踪该序列中的当前位置。（迭代器提供next()方法，返回对象包含done和value方法）

# 深拷贝与浅拷贝
## Object.assign()
Object.assign()是**浅拷贝**
```js
Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
Object.assign(target, ...sources)    【target：目标对象】，【souce：源对象（可多个）】
举个栗子：
const object1 = {
  a: 1,
  b: 2,
  c: 3
};

const object2 = Object.assign({c: 4, d: 5}, object1);

object1.a = 2;
console.log(object1)  // { a: 2, b: 2, c: 3 }
console.log(object2)  // { c: 3, d: 5, a: 1, b: 2 }
```
注意： 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性

## js深拷贝
对象
```js
var obj = {a: 1, b: 2, c: { a: 3 },d: [4, 5]}
var obj1 = obj
var obj2 = JSON.parse(JSON.stringify(obj))//深拷贝常用方法
var obj3 = {...obj}
var obj4 = Object.assign({},obj)
obj.a = 999
obj.c.a = -999
obj.d[0] = 123
console.log(obj1) //{a: 999, b: 2, c: { a: -999 },d: [123, 5]}
console.log(obj2) //{a: 1, b: 2, c: { a: 3 },d: [4, 5]}
console.log(obj3) //{a: 1, b: 2, c: { a: -999 },d: [123, 5]}
console.log(obj4) //{a: 1, b: 2, c: { a: -999 },d: [123, 5]}
```

数组
```js
var arr = [1, 2, 3, [4, 5], {a: 6, b: 7}]
var arr1 = JSON.parse(JSON.stringify(arr))//深拷贝常用方法
var arr2 = arr
var arr3 = [...arr]
var arr4 = Object.assign([],arr)
console.log(arr === arr1) //false
console.log(arr === arr2) //true
console.log(arr === arr3) //false
console.log(arr === arr4) //false
arr[0]= 999
arr[3][0]= -999
arr[4].a = 123
console.log(arr1) //[1, 2, 3, [4, 5], {a: 6, b: 7}]
console.log(arr2) //[999, 2, 3, [-999, 5], {a: 123, b: 7}]
console.log(arr3) //[1, 2, 3, [-999, 5], {a: 123, b: 7}]
console.log(arr4) //[1, 2, 3, [-999, 5], {a: 123, b: 7}]
```

# 回调函数
回调函数：一种你只**定义了**，你**没有调用**它，但它**最终在某个时候执行**了的函数就是回调函数
常见的回调函数
1. DOM事件回调函数
```js
document.getElementById("btn").onclick = function(){
  console.log("fff");
}
```
2. 定时器回调函数
```js
setTimeout(function(){
  console.log("jfkdfj");
})
```

下面是一个回调函数的简单例子：
```js
//定义主函数，回调函数作为参数
function Main(callback) { callback(); console.log('我是主函数'); }

//定义回调函数
function A(){ setTimeout("console.log('我是回调函数')", 3000);//模仿耗时操作  
}

//调用主函数，将函数B传进去
Main(A);
```
输出结果
```
我是主函数
我是回调函数
```
上面的代码中，我们先定义了主函数和回调函数，然后再去调用主函数，将回调函数传进去。
定义主函数的时候，我们让代码先去执行callback()回调函数，但输出结果却是后输出回调函数的内容。这就说明了主函数不用等待回调函数执行完，可以接着执行自己的代码，实现了异步编程的效果。
回调函数多用在使用 js 写组件时和耗时操作上面，尤其是组件的事件很多都需要回调函数的支持。

**同步回调函数**：立即执行，完全执行后才结束，不会放入回调队列中
**异步回调函数**：不会立即执行，会放入回调队列中将来执行
```js
//同步回调函数
const arr = [1, 3, 5]
arr.forEach(item => {
  console.log(item)
})
console.log('forEach()之后')

//异步回调函数
setTimeout(() => {
  console.log('time callback()')
}, 0)
console.log('setTimeout()之后')
```

**缺点**
回调函数有一个致命的弱点，就是容易写出回调地狱（Callback hell）。假设多个请求存在依赖性，你可能就会写出如下代码：
```js
ajax(url, () => { 
  // 处理逻辑 ajax(url1, () => { 
    // 处理逻辑 ajax(url2, () => { 
      // 处理逻辑 }) })
})
```

**解决办法**
解决回调地狱有很多方法，比如：Promise对象、async函数

# Promise
> 搞懂Promise之前，先要搞懂什么是回调函数

Promise是JS中进行异步编程的新的解决方案
从语法上来说：Promise是一个构造函数
从功能上来说：Promise对象来封装一个异步操作并获取其结果

**Promise的状态改变**
- pending变为resolved
- pending变为rejected
只有这2种，且一个promise对象只能改变一次，无论变为成功还是失败，都会有一个结果数据，成功的结果数据一般称为value，失败的结果数据一般称为reason

**Promise的基本流程**
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210404224404.png" width="700px"/>

<font color="red">每产生一个Promise对象，不管是否调用then方法，都会执行一个异步操作</font>

```js
//创建一个promise对象
const p = new Promise((resolve, reject) => {
  //执行异步操作
  setTimeout(() => {
    const time = Date.now() //规定当前时间如果是偶数就代表成功，否则代表失败
    if(time % 2 == 0){
      //如果成功了，调用resolve(value)
      resolve('成功的数据，time=' + time)
    }else{
      //如果失败了，调用reject(reason)
      reject('失败的数据，time=' + time)
    }
  }, 1000)
})

//Promise中的then方法中的第一个参数函数就是Promise方法中第一个的resolve参数函数(不可省略)，
//                      第二个参数函数就是Promise方法中的第二个的reject参数函数(可省略)
p.then(
  value => {
    console.log('成功的回调', value)
  },
  reason => {
    console.log('失败的回调', reason)
  }
)
```

**Promise作用**
- 使用Promise使得指定回调函数的方式更加灵活：
以前的方式：必须在启动异步操作前指定
promise方式：启动异步操作 => 返回promise对象 => 给promise对象绑定回调函数(甚至可以在异步任务结束后指定)

- promise支持链式调用，可以解决回调地狱问题
什么是回调地狱？ 答：回调函数嵌套调用，外部回调函数异步执行的结果使嵌套的回调函数执行的条件
解决方法？ 答：promise链式调用，终极解决方案为`async/await`

## promise中的API
**Promise的构造函数：`Promise(excutor){}`**
- excutor函数：执行器`(resolve, reject) => {}`
- resolve函数：内部定义成功时我们调用的函数`value => {}`
- reject函数：内部定义失败时我们调用的函数`reason => {}`
说明：excutor会在Promise内部立即同步回调，异步操作在执行器中执行

**Promise.prototype.then((onResolved, onRejected) => {})**
- onResolved函数：成功的回调函数, (value) => {}
- onRejected函数：失败的回调函数, (reason) => {}
说明：指定用于得到成功value的成功回调和用于得到失败reason的失败回调，返回一个新的promise对象

**Promise.prototype.catch((onRejected) => {})**
- onRejected函数：失败的回调函数，(reason) => {}
说明：then()的语法糖，相当于：then(undefined, onRejected)

**Promise.resolve(value)**
- value：成功的数据
说明：返回一个成功的promise对象

**Promise.reject(reason)**
- reason：失败的原因
说明：返回一个失败的promise对象

**Promise.all([promise1, promise2, ...])**
- promises: 包含n个promise的数组
说明：返回一个新的promise, 只有所有的promise都成功了才成功，只要有一个失败就直接失败了

**Promise.race([promise1, promise2, ...])**
- promises: 包含n个promise的数组 
说明：返回一个新的promise, 第一个完成的promise的结果状态就是最终的结果状态
```js
const p1 = new Promise((resolve, reject) =>{
  resolve(1)
})
const p2 = Promise.resolve(2)
const p3 = Promise.reject(3)
p1.then(value => {console.log("first: " + value)})
p2.then(value => {console.log("seocnd: " + value)})
p3.catch(reason => {console.log("third: " + reason)})

const pAll1 = Promise.all([p1, p2, p3])
const pAll2 = Promise.all([p1, p2])

pAll1.then(
  values => {
    console.log('all onResolved()', values)
  },
  reasons => {
    console.log('all onRejected()', reasons)
  }
)

pAll2.then(
  values => {
    console.log('all onResolved()', values)
  },
  reasons => {
    console.log('all onRejected()', reasons)
  }
)

const pRace = Promise.race([p1, p2])
pRace.then(
  value => {
    console.log('race onResolved()', value)
  },
  reason =>{
    console.log('race onRejected()', reason)
  }
)
```
输出：
```
first: 1
seocnd: 2
third: 3
all onRejected() 3
all onResolved() [ 1, 2 ]
race onResolved() 1
```

**Promise大致源码**
```js
class Mypromise {
  constructor(executor) {
    this.status = 'pending'  //状态值
    this.value = undefined   //成功的返回值
    this.reason = undefined	 //失败的返回值
    this.onResolvedCallbacks = [] //成功的回调函数
    this.onRejectedCallbacks = [] //失败的回调函数
    // 成功
    let resolve = (value) => {
      // pending用来屏蔽的，resolve和reject只能调用一个，不能同时调用，这就是pending的作用
      if (this.status == 'pending') {
        this.status = 'fullFilled'
        this.value = value
        // 发布执行函数
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    // 失败
    let reject = (reason) => {
      if (this.status == 'pending') {
        this.status = 'rejected'
        this.reason = reason
        //失败执行函数
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      // 执行函数
      executor(resolve, reject)
    } catch (err) {
      // 失败则直接执行reject函数
      reject(err)
    }
  }
  then(onFullFilled, onRejected) {
    // 同步
    if (this.status == 'fullFilled') {
      onFullFilled(this.value)
    }
    if (this.status == 'rejected') {
      onRejected(this.reason)
    }
    // 异步
    if (this.status == 'pending') {
      // 在pending状态的时候先订阅
      this.onResolvedCallbacks.push(() => {
        // todo
        onFullFilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        // todo
        onRejected(this.reason)
      })
    }
  }
}

const p = new Mypromise((resolve, reject) => {
  setTimeout(function() {
      // resolve('success') // 异步调用的时候，this.status一直是pending状态,不会执行代码了，因此要改装成发布订阅者模式
      reject('failed')
  }, 1000)
  // resolve('success') // 走了成功就不会走失败了
  // throw new Error('失败') // 失败了也会走resolve
  // reject('failed')
})
p.then((res) => {
  console.log(res)
}, (err) => {
  console.log(err)
})
p.then((res) => {
  console.log(res)
}, (err) => {
  console.log(err)
})
p.then((res) => {
  console.log(res)
}, (err) => {
  console.log(err)
})
```

## Promise异步与同步
Promise是异步的，但是then是同步的。
如下：
```js
new Promise(..).then(
  // 代码段1
).then(
  // 代码段2
).then(
  // 代码段3
);


//代码段4
```

代码段4与代码段1/2/3之间是没有先后顺序的，可能代码段4在代码段1/2/3执行完之前执行，也有可能执行完之后执行，即它们之间是异步的
但是代码段1,2,3之间是由执行顺序的，是同步的。代码段1执行完后，代码段2才能执行，代码段2执行完后，代码段3才能执行

# 模块化
模块化是指将一个大的程序文件，拆封成许多小的文件，然后将小文件组合起来
**模块化的好处**
- 防止命名冲突
- 代码复用
- 高维护性

现在前端主要使用的模块化技术为2种，分别是`CommonJS`与`ES6`

## 什么是CommonJS模块与ES6模块
### 为什么会有CommonJs和Es Module呢
我们都知道在早期JavaScript模块这一概念，都是通过script标签引入js文件代码。当然这写基本简单需求没有什么问题，但当我们的项目越来越庞大时，我们引入的js文件就会越多，这时就会出现以下问题：
- js文件作用域都是顶层，这会造成变量污染
- js文件多，变得不好维护
- js文件依赖问题，稍微不注意顺序引入错，代码全报错

为了解决以上问题JavaScript社区出现了CommonJs，CommonJs是一种模块化的规范，包括现在的NodeJs里面也采用了部分CommonJs语法在里面。那么在后来Es6版本正式加入了Es Module模块，这两种都是解决上面问题，那么都是解决什么问题呢。
- 解决变量污染问题，每个文件都是独立的作用域，所以不存在变量污染
- 解决代码维护问题，一个文件里代码非常清晰
- 解决文件依赖问题，一个文件里可以清楚的看到依赖了那些其它文件

### es6中的es是什么意思
es6中的es全称ECMAScript，是一种由Ecma国际（前身为欧洲计算机制造商协会，European Computer Manufacturers Association）通过ECMA-262标准化的脚本程序设计语言。因而，ES6就是ECMAScript 6, 它往往被称为JavaScript或JScript，所以它可以理解为是JavaScript的一个标准

## CommonJS
- **对于基本数据类型，属于复制**。即会被模块缓存。同时，在另一个模块可以对该模块输出的变量重新赋值。
- **对于复杂数据类型，属于浅拷贝**。由于两个模块引用的对象指向同一个内存空间，因此对该模块的值做修改时会影响另一个模块。
- 当使用require命令加载某个模块时，就会运行整个模块的代码。
- 当使用require命令加载同一个模块时，不会再执行该模块，而是取到缓存之中的值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
- 循环加载时，属于加载时执行。即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。
对于基本数据类型，属于复制。即会被模块缓存。同时，在另一个模块可以对该模块输出的变量重新赋值。
```js
// b.js
let count = 1
let plusCount = () => {
  count++
}
setTimeout(() => {
  console.log('b.js-1', count)
}, 1000)
module.exports = {
  count,
  plusCount
}

// a.js
let mod = require('./b.js')
console.log('a.js-1', mod.count)
mod.plusCount()
console.log('a.js-2', mod.count)
setTimeout(() => {
    mod.count = 3
    console.log('a.js-3', mod.count)
}, 2000)

node a.js
a.js-1 1
a.js-2 1
b.js-1 2  // 1秒后
a.js-3 3  // 2秒后
```
以上代码可以看出，b模块export的count变量，是一个复制行为。在plusCount方法调用之后，a模块中的count不受影响。同时，可以在b模块中更改a模块中的值。如果希望能够同步代码，可以export出去一个getter。
```js
// 其他代码相同
module.exports = {
  get count () {
    return count
  },
  plusCount
}

node a.js
a.js-1 1
a.js-2 1
b.js-1 2  // 1秒后
a.js-3 2  // 2秒后， 由于没有定义setter，因此无法对值进行设置。所以还是返回2
```
对于复杂数据类型，属于浅拷贝。由于两个模块引用的对象指向同一个内存空间，因此对该模块的值做修改时会影响另一个模块。
```js
// b.js
let obj = {
  count: 1
}
let plusCount = () => {
  obj.count++
}
setTimeout(() => {
  console.log('b.js-1', obj.count)
}, 1000)
setTimeout(() => {
  console.log('b.js-2', obj.count)
}, 3000)
module.exports = {
  obj,
  plusCount
}

// a.js
var mod = require('./b.js')
console.log('a.js-1', mod.obj.count)
mod.plusCount()
console.log('a.js-2', mod.obj.count)
setTimeout(() => {
  mod.obj.count = 3
  console.log('a.js-3', mod.obj.count)
}, 2000)

node a.js
a.js-1 1
a.js-2 2
b.js-1 2
a.js-3 3
b.js-2 3
```
以上代码可以看出，对于对象来说属于浅拷贝。当执行a模块时，首先打印obj.count的值为1，然后通过plusCount方法，再次打印时为2。接着在a模块修改count的值为3，此时在b模块的值也为3。

3.当使用require命令加载某个模块时，就会运行整个模块的代码。
4.当使用require命令加载同一个模块时，不会再执行该模块，而是取到缓存之中的值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
5.循环加载时，属于加载时执行。即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

3, 4, 5可以使用同一个例子说明
```js
// b.js
exports.done = false
let a = require('./a.js')
console.log('b.js-1', a.done)
exports.done = true
console.log('b.js-2', '执行完毕')

// a.js
exports.done = false
let b = require('./b.js')
console.log('a.js-1', b.done)
exports.done = true
console.log('a.js-2', '执行完毕')

// c.js
let a = require('./a.js')
let b = require('./b.js')

console.log('c.js-1', '执行完毕', a.done, b.done)

node c.js
b.js-1 false
b.js-2 执行完毕
a.js-1 true
a.js-2 执行完毕
c.js-1 执行完毕 true true
```
仔细说明一下整个过程。

在Node.js中执行c模块。此时遇到require关键字，执行a.js中所有代码。
在a模块中exports之后，通过require引入了b模块，执行b模块的代码。
在b模块中exports之后，又require引入了a模块，此时执行a模块的代码。
a模块只执行exports.done = false这条语句。
回到b模块，打印b.js-1, exports, b.js-2。b模块执行完毕。
回到a模块，接着打印a.js-1, exports, b.js-2。a模块执行完毕
回到c模块，接着执行require，需要引入b模块。由于在a模块中已经引入过了，所以直接就可以输出值了。
结束。
从以上结果和分析过程可以看出，当遇到require命令时，会执行对应的模块代码。当循环引用时，有可能只输出某模块代码的一部分。当引用同一个模块时，不会再次加载，而是获取缓存。

## ES6模块
**ES6模块化语法**
ES6模块功能主要有两个命令构成：export和import
- export命令用于规定模块的的对外接口
- import命令用于输入其他模块提供的功能

module.js文件
```js
//方法一：分别暴露
export let school = "HNUST"
export function teach(){
  console.log("i am a teacher");
}

//方法二：统一暴露
school1 = "HNUST"
function teach1(){
  console.log("i am a teacher");
}
export {school, teacher1}

//方法三：默认暴露
export default{
  school2:"HNUST",
  teach2: function(){
    console.log("i am a teacher");
  }
}
```
test.js文件
```js
//方法一：通用的导入方式
import * as m1 from "./module.js"
console.log(m1.school) //输出：HNUST
m1.teach() //输出：i am a teacher

//方法二：解构赋值形式
import {school1 as schoolAlias, teach1} from './module.js'
import {default as m3} from 'module.js' //引入默认暴露的模块必须要别名
console.log(schoolAlias) //输出：HNUST
teach1() //输出：i am a teacher

//方法三：简便形式，只用于默认暴露
import m4 from './module.js'
console.log(m4)
```
在一个模块中，`export default`只允许向外暴露1次。
在一个模块中，可以同时使用`export defalut`和`export`向外暴露，并且`export`可以向外暴露n次
**注：node现在还不支持import语法**

es6模块中的值属于【动态只读引用】。只说明一下复杂数据类型。
对于只读来说，即不允许修改引入变量的值，import的变量是只读的，不论是基本数据类型还是复杂数据类型。当模块遇到import命令时，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
对于动态来说，原始值发生变化，import加载的值也会发生变化。不论是基本数据类型还是复杂数据类型。
```js
// b.js
export let counter = {
  count: 1
}
setTimeout(() => {
  console.log('b.js-1', counter.count)
}, 1000)

// a.js
import { counter } from './b.js'
counter = {}
console.log('a.js-1', counter)

// Syntax Error: "counter" is read-only
```
虽然不能将counter重新赋值一个新的对象，但是可以给对象添加属性和方法。此时不会报错。这种行为类似与关键字const的用法。
```js
// a.js
import { counter } from './b.js'
counter.count++
console.log(counter)

// 2
循环加载时，ES6模块是动态引用。只要两个模块之间存在某个引用，代码就能够执行。
// b.js
import {foo} from './a.js';
export function bar() {
  console.log('bar');
  if (Math.random() > 0.5) {
    foo();
  }
}

// a.js
import {bar} from './b.js';
export function foo() {
  console.log('foo');
  bar();
  console.log('执行完毕');
}
foo();

babel-node a.js
foo
bar
执行完毕

// 执行结果也有可能是
foo
bar
foo
bar
执行完毕
执行完毕
```
由于在两个模块之间都存在引用。因此能够正常执行。

# 钩子函数
在一个有序的步骤中的特殊位置(挂载点)，插入自定义的内容。这就叫"钩子"。
钩子函数：钩子函数是在一个事件触发的时候，在系统级捕获到了他，然后做一些操作。一段用以处理系统消息的程序。“钩子”就是在某个阶段给你一个做某些处理的机会。

钩子函数： 1、是个函数，在系统消息触发时被系统调用 2、不是用户自己触发的

钩子函数的名称是确定的，当系统消息触发，自动会调用。例如react的componentWillUpdate函数，用户只需要编写componentWillUpdate的函数体，当组件状态改变要更新时，系统就会调用componentWillUpdate。

常见的钩子函数：
react的生命周期函数、vue的生命周期函数，vue的自定义指令等

# attribute和property的区别
property 和 attribute非常容易混淆，两个单词的中文翻译也都非常相近（property：属性，attribute：特性），但实际上，二者是不同的东西，属于不同的范畴。
在英文系统里，右键单击一个文件，显示是property（中文系统里对应的是"属性“），会显示文件的大小、创建日期等等，这些你是没办法去改变的（当然，你也可以改，但是改就是另外一个文件）
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210717140511.png" width="400px"/>
而文件“只读”，“隐藏”是算在attribute的，你可以改变他的只读、隐藏属性，不过文件本身不会有变化。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210717140531.png" width="400px"/>
所以这么理解，property是 物体本身自带属性，不能改变的（一旦改了就是另外一个东西了）attribute，由于 attribute还可以做动词，表示赋予。。。特性，属于人为赋予的可改变的属性。比如，你的头发，可以人为拉直、弯曲，但不管怎么样，都是你的头发，这叫做头发的attribute。但是头发的弹性、硬度，这些没办法改变，改了就不是头发了，这是property.

- property是DOM中的属性，是JavaScript里的对象；
- attribute是HTML标签上的特性，它的值只能够是字符串；

有以下代码：
```html
<div id="div1" class="divClass" title="divTitle" title1="divTitle1"></div>

var in1=document.getElementById("div1");
console.log(in1);
```
对于id为div1的div，它的property内容如下：（部分）
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210515155040.png" width="700px"/>

可以发现有一个名为“attributes”的属性，类型是NamedNodeMap; 同时有“id”和“className”、”title“等基本的属性，但没有“title1”这个自定义的属性。
```js
console.log(in1.id);          //div1
console.log(in1.className);        //divClass
console.log(in1.title);          //divTitle
console.log(in1.title1);       //undefined
```
可以发现，标签中的属性，“id”和“className”、”title“会在in1上创建，而“title1”不会被创建。这是由于，每一个DOM对象都会有它默认的基本属性，而在创建的时候，它只会创建这些基本属性，我们在TAG标签中自定义的属性是不会直接放到DOM中的。

那自定义的”title1“去哪里了呢？在attributes属性里可以看到如下：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210515155313.png" width="700px"/>
“title1”被放在了attributes这个对象里，这个对象按顺序记录了我们在TAG中定义的属性和属性的数量。

从这里就可以看出，**attributes是属于property的一个子集**，它保存了HTML标签上定义属性。如果再进一步探索attitudes中的每一个属性，会发现它们并不是简单的对象，它是一个Attr类型的对象，拥有NodeType、NodeName等属性。关于这一点，稍后再研究。注意，打印attribute属性不会直接得到对象的值，而是获取一个包含属性名和值的字符串，如：
```js
console.log(in1.attibutes.title1);        // divTitle1
```
由此可以得出：
- HTML标签中定义的属性和值会保存该DOM对象的attributes属性里面；
- 这些attribute属性的JavaScript中的类型是Attr，而不仅仅是保存属性名和值这么简单；

再如下：
```html
<input id="in_2">
```
在它的property中有如下部分：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210515155454.png" width="700px"/>

尽管我们没有在TAG中定义“value”，但由于它是DOM默认的基本属性，在DOM初始化的时候它照样会被创建。

## “脚踏两只船”
常用的Attribute，例如id、class、title等，已经被作为Property附加到DOM对象上，可以和Property一样取值和赋值。但是自定义的Attribute，就不会有这样的特殊优待，例如：
```html
<div id="div1" class="divClass" title="divTitle" title1="divTitle1">100</div>
```
这个div里面的“title1”就不会变成Property。
即，**只要是DOM标签中出现的属性（html代码），都是Attribute**。然后有些常用特性（id、class、title等），会被转化为Property。可以很形象的说，这些特性/属性，是“脚踏两只船”的。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210515155649.png" width="700px"/>
最后注意：“class”变成Property之后叫做“className”，因为“class”是ECMA的关键字。

## attribute和property的取值和赋值
### attribute取值
《js高级程序设计》中提到，为了方便操作，建议大家用setAttribute()和getAttribute()来操作即可。
```html
 <div id="div1" class="divClass" title="divTitle" align="left" title1="divTitle1"></div>
 
 var id = div1.getAttribute("id");              
 var className1 = div1.getAttribute("class");
 var title = div1.getAttribute("title");
 var title1 = div1.getAttribute("title1");   //自定义特性
```
getAttribute()可以取得任何特性，不管是标准的还是自定义的。
但是这个方法的浏览器兼容性有问题，有些浏览器可能会获取属性Property的值，因此jQuery要做一个测试，看getAttribute()是否是绝对获取特性Attribute的值。
```js
div1.className = 'a';
var judge = div1.getAttribute("className") === 'a';
```
如果以上代码成立，说明getAttribute()方法出现了问题，将不再使用。

### attribute赋值
```js
div1.setAttribute('class', 'a');
div1.setAttribute('title', 'b');
div1.setAttribute('title1', 'c');
div1.setAttribute('title2', 'd');
```
用setAttrbute()赋值，任何Attribute都可以，包括自定义的。而且，赋值的Attribute会立刻表现到DOM元素上。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210515155922.png" width="700px"/>

如果是标准特性，也会更新它们关联的属性的值：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210515160000.png" width="700px"/>

**最后注意，setAttribute()的两个参数**，都必须是字符串。即对特性Attribute职能赋值字符串，而对属性Property就可以赋任何类型的值了。

### property取值
属性取值很简单。取任何属性的只，用`.`就可以：
```js
var id = div1.id;
var className = div1.className;
var childNodes = div1.childNodes;
var attrs = div1.attributes;
```
此处再次强调：
- class特性在变成属性时，名字改成了“className”，因此div1.className和div1.getAttrbute('class')相同。
- 上面代码中的div1.attributes是取的attributes这一属性，取出来保存到attrs变量中，attrs就成了一个NamedNodeList类型的对象，里面存储了若干个Attr类型。

### Property赋值
赋值和基本的js对象属性赋值一样，用“.”即可：
```js
div1.className = 'a';
div1.align = 'center';
div1.AAAAA = true;
div1.BBBBB = [1, 2, 3];
```
**对属性Property可以赋任何类型的值，而对特性Attribute只能赋值字符串！**

### property和attribute数据同步问题
```js
in1.value='new value of prop';

console.log(in1.value);               // 'new value of prop'
console.log(in1.attributes.value);         // 'value="1"'
```
此时，页面中的输入栏的值变成了“new value of prop”，而propety中的value也变成了新的值，但attributes却仍然是“1”。从这里可以推断，property和attribute的同名属性的值并不是双向绑定的。

如果反过来，设置attitudes中的值，效果会怎样呢？
```js
in2.setAttribute('value','ni')
console.log(in2.value);          //ni
console.log(in2.attributes.value); //value='ni'
```
由此，可得出结论：
- property能够从attribute中得到同步；
- attribute不会同步property上的值；
- attribute和property之间的数据绑定是单向的，attribute->property；
- 更改property和attribute上的任意值，都会将更新反映到HTML页面中；

# localStorage与sessionStorage
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210513120832.png" width="300px"/>

## localStorage
localStorage是HTML5新增的特性，这个特性主要是用来本地存储的，解决了Cookie存储空间不足的问题(Cookie中每条Cookie的存储空间为4k)，localStorage存储的内存大小是5M左右。

localStorage是本地永久存储，数据被存放在本地硬盘中，关掉浏览器数据不会被清除，在同一个浏览器的不同tab页中，localStorage是共享的，但是不同的浏览器存储的localStorage是不共享的，也就是说使用Chrome浏览器存储的localStorage在IE中是不能使用的。

### localStorage的用法
localStorage只能用来存储字符串。
```js
localStorage.setItem("name", "lisi"); //存储name = "lisi"。
localStorage.getItem("name");  // 获取name的值。
localStorage.removeItem("name");  //将name移除。
```
当localStorage要存储对象时，需要先将对象转化为json字符串进行存储。
```js
var user= {"name" : "lisi"; "age" : "24"};
localStorage.setItem("user", JSON.stringify(user));  //JSON.stringify(user)是将user对象转化为json字符串。
var user = JSON.parse(localStorage.getItem("user")) //将取出的json字符串转化为对象。
```
## sessionStorage
和localStorage一样，sessionStorage也是HTML5新增的特性，也是用来本地存储数据的，不同的是localStorage是本地永久存储，sessionStorage存储的数据只有在同一个会话中才能被访问，关闭浏览器数据就会被清除。sessionStorage存储的数据是不能跨进程的，也就是在同一个浏览器的不同tab页中，sessionStorage不是共享的。sessionStorage数据存储在浏览器内存中，因此关闭浏览器数据就会被清除。

### sessionStorage用法。
和localStorage的用法相似，sessionStorage也只能存储字符串。
```js
sessionStorage.setItem("name","lisi"); //存储name = "lisi"。
sessionStorage.getItem("name");  // 获取name的值。
sessionStorage.removeItem("name");  //将name移除。
```
当sessionStorage要存储对象时。
```js
var user= {"name" : "lisi"; "age" : "24"};
sessionStorage.setItem("user",JSON.stringify(user));  //JSON.stringify(user)是将user对象转化为json字符串。
var user = JSON.parse(sessionStorage.getItem("user")) //将取出的json字符串转化为对象。
```

# requestAnimationFrame
## 概述
requestAnimationFrame是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按帧对网页进行重绘。

设置这个API的目的是为了让各种网页动画效果（DOM动画、Canvas动画、SVG动画、WebGL动画）能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。代码中使用这个API，就是告诉浏览器希望执行一个动画，让浏览器在下一个动画帧安排一次网页重绘。

requestAnimationFrame的优势，在于充分利用显示器的刷新机制，比较节省系统资源。显示器有固定的刷新频率（60Hz或75Hz），也就是说，每秒最多只能重绘60次或75次，requestAnimationFrame的基本思想就是与这个刷新频率保持同步，利用这个刷新频率进行页面重绘。此外，使用这个API，一旦页面不处于浏览器的当前标签，就会自动停止刷新。这就节省了CPU、GPU和电力。

不过有一点需要注意，requestAnimationFrame是在主线程上完成。这意味着，如果主线程非常繁忙，requestAnimationFrame的动画效果会大打折扣。

requestAnimationFrame使用一个回调函数作为参数。这个回调函数会在浏览器重绘之前调用。
```js
requestID = window.requestAnimationFrame(callback); 
```
目前，主要浏览器Firefox 23 / IE 10 / Chrome / Safari）都支持这个方法。可以用下面的方法，检查浏览器是否支持这个API。如果不支持，则自行模拟部署该方法。
```js
 window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
```
上面的代码按照1秒钟60次（大约每16.7毫秒一次），来模拟requestAnimationFrame。

使用requestAnimationFrame的时候，只需反复调用它即可。
```js
function repeatOften() {
  // Do whatever
  requestAnimationFrame(repeatOften);
}

requestAnimationFrame(repeatOften);
```

## cancelAnimationFrame方法
cancelAnimationFrame方法用于取消重绘。
```js
window.cancelAnimationFrame(requestID);
```
它的参数是requestAnimationFrame返回的一个代表任务ID的整数值。
```js
var globalID;

function repeatOften() {
  $("<div />").appendTo("body");
  globalID = requestAnimationFrame(repeatOften);
}

$("#start").on("click", function() {
  globalID = requestAnimationFrame(repeatOften);
});

$("#stop").on("click", function() {
  cancelAnimationFrame(globalID);
});
```
上面代码持续在body元素下添加div元素，直到用户点击stop按钮为止。

## 实例
下面，举一个实例。

假定网页中有一个动画区块。
```html
<div id="anim">点击运行动画</div> 
```
然后，定义动画效果。
```js
var elem = document.getElementById("anim");

var startTime = undefined;
 
function render(time) {
 
  if (time === undefined)
    time = Date.now();
  if (startTime === undefined)
    startTime = time;
 
  elem.style.left = ((time - startTime)/10 % 500) + "px";
}
```
最后，定义click事件。
```js
elem.onclick = function() {

    (function animloop(){
      render();
      requestAnimFrame(animloop);
    })();

};
```

# JS合并两个数组的方法
我们在项目过程中，有时候会遇到需要将两个数组合并成为一个的情况。
比如：
```js
var a = [1,2,3];
var b = [4,5,6];
```
有两个数组a、b，需求是将两个数组合并成一个。方法如下：

**1. concat**
js的Array对象提供了一个叫concat()方法，连接两个或更多的数组，并返回结果。
```js
var c = a.concat(b);//c=[1,2,3,4,5,6]
```
这里有一个问题，concat方法连接a、b两个数组后，a、b两个数组的数据不变，同时会返回一个新的数组。这样当我们需要进行多次的数组合并时，会造成很大的内存浪费，所以这个方法肯定不是最好的。

**2. for循环**
大概的思路是：遍历其中一个数组，把该数组中的所有元素依次添加到另外一个数组中。直接上代码：
```js
for(var i in b){
    a.push(b[i]);
}
```
这样的写法可以解决第一种方案中对内存的浪费，但是会有另一个问题：丑！这么说不是没有道理，如果能只用一行代码就搞定，岂不快哉~

**3. apply**
函数的apply方法有一个特性，那就是func.apply(obj,argv)，argv是一个数组。所以我们可以利用这点，直接上代码：
```js
a.push.apply(a,b);
```
调用a.push这个函数实例的apply方法，同时把，b当作参数传入，这样a.push这个方法就会遍历b数组的所有元素，达到合并的效果。
这里可能有点绕，我们可以把b看成[4,5,6]，变成这样：
```js
a.push.apply(a,[4,5,6]);
```
然后上面的操作就等同于：
```js
a.push(4,5,6);
```
这样就很清楚了！
另外，还要注意两个小问题：
1）以上3种合并方法并没有考虑过a、b两个数组谁的长度更小。
所以好的做法是预先判断a、b两个数组哪个更大，然后使用大数组合并小数组，这样就减少了数组元素操作的次数！
2）有时候我们不希望原数组（a、b）改变，这时就只能使用concat了。

# 零碎知识点
## 有关js如何获取先前的URL的问题
首先可以通过如下方法来跳转到前一个页面
```js
history.go(-1)
history.back()
```
但是如果我们只是想要得到前一个页面的url。我们该怎么做？
答案就是不能获取到， 因为出于安全和隐式原因，是不能访问到前一个页面的url的
而有关于网上说的`document.referer`方法， 这方法不是获取前一个页面的url

## js获取手机端屏幕大小
```js
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
```

## js获取上传文件内容
```html
<div>
    上传文件 ： <input type="file" name = "file" id = "fileId" /> 
    
    <button  type = "submit" name = "btn" value = "提交" id = "btnId" onclick="check()" /> 提交
</div>

<script>

    function check() {
        
        var objFile = document.getElementById("fileId");
        if(objFile.value == "") {
            alert("不能空")
        }
    
        console.log(objFile.files[0].size); // 文件字节数
        
        var files = $('#fileId').prop('files');//获取到文件列表
        if(files.length == 0){
            alert('请选择文件');
        }else{
            var reader = new FileReader();//新建一个FileReader
            reader.readAsText(files[0], "UTF-8");//读取文件 
            reader.onload = function(evt){ //读取完文件之后会回来这里
                var fileString = evt.target.result; // 读取文件内容, fileString的类型为String
        }
    }
    
}
```

## 清空canvas的方法
```js
canvas.height=canvas.height;
```
重新设置canvas的高度时， canvas都会自动清空

## JavaScript中方法或者变量名称前加下划线的是什么意思？
加下划线不是js要求的，是程序员约定俗成的。
通常变量前加下划线表示“私有变量”。
函数名前加下划线表示“私有函数”。
为什么我加引号，因为“私有”这个词不是js的官方说法，js也根本没有“私有变量”这种东西，只是程序员之间模仿其他有私有变量的语言的一种约定俗成的说法。也就是“你懂的”。
只为代码维护方便，没特别意义。不是说加了下划线就有本质变化了

在JavaScript的变量名或函数名前加“_” 。
在变量名或函数名前加下划线，一般表示“私有”。是约定俗成的开发规范，没有强制限制，类似于类名首字母大写。

加下划线，还能有效防止重名。

通常变量前加下划线表示“私有变量”。
函数名前加下划线表示“私有函数”。

## 前端下载文件方式
前端下载文件常用的三种方式:
- 第一种是后台提供一个 URL，然后用 window.open(URL) 下载，或者window.location.href（URL）
- 第二种用a标签
- 第三种就是后台直接返回文件流，然后前端转化一下再下载。

### 使用a标签
用户点击下载多媒体文件(图片/视频等)，最简单的方式：
```html
<a href='url' download="filename.ext">下载</a>
```

### 后台返回文件流
后台返回数据为二进制文件(content-type="application/octet-stream")：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210519151949.png" width="700px"/>

具体方法：
```js
axios({
        url: '/api/system/file/download/by/fileId',
        method: 'get',
        responseType: 'arraybuffer', //由于后台返回来的是文件流，所以设置成arraybuffer, 否则会乱码
      }).then(res => {
            var blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'}); //指定格式为vnd.ms-excel
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);     //创建下载的链接
            downloadElement.href = href
            downloadElement.download = '测试文件.xls';      //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();    //点击下载
            document.body.removeChild(downloadElement);     //下载完成移除元素
            window.URL.revokeObjectURL(href);     //释放掉blob对象
      })
```


## 在浏览器控制台中使用js设置焦点失效的问题
我在web.whatsapp.com(chrome)上尝试相同的输入搜索字段.
这是我的代码：
```js
document.getElementsByClassName("input input-search")[0].focus()
document.getElementsByClassName("input input-search")[0].select()
$(".input-search").focus() 
```
都不起作用， 都不能将光标聚焦到input上
### 原因：
由于浏览器控制台的工作方式.运行每个命令后, 控制台将获得焦点， 所以你在chrome 控制台中设置web页面中的某个元素获取焦点的话， 是无效的
为了解决这个问题， 你可以在执行命令前， 点击一下web页面， 让焦点在web页面上， 而不是在chrome控制台上， 然后执行有关focus（）焦点方法就可以实现
可以使用如下代码实现：
```js
var input = document.getElemtnsById("ff")
setTimeout(function(){
    input.focus()
}, 2000)
```
这要的话，你在2秒内点击web页面，使焦点脱离chrome控制台，  就可以实现input元素聚焦

**注：不要使用Jquery对象的focus()方法， 这不是触发focus事件， 而是定义focus事件， 应该使用JS对象的focus方法**

# 为什么不推荐使用 setInterval
解释原因之前需要先简单介绍一下 js 的执行原理：js引擎是单线程的，主要分为主线程和事件队列，同步操作是在主线程上执行，而异步操作的函数会先放在事件队列当中，等到js主线程空闲了，才会去事件队列取出放到主线程执行。定时器是属于异步事件，参数里面设置的时间，并不是延迟多少秒去执行回调函数，这个时间代表的是延迟多少秒，把回调函数放到异步队列，等待主线程空闲再被执行。

如果按照上面的说法，假如同步代码耗时较长就会存在执行多次的问题，举个例子，假如设置一个 100ms 的定时器，定时器中代码需要执行1000ms，那么事件队列中就会添加10次定时器的函数（实际小于10次），这样1s之后会就执行10次代码，而不是我们想要的每隔 100ms 执行一次，对此js引擎解决方法是，当使用setInterval时，仅当没有该定时器的任何其他代码实例时，才将定时器代码添加到队列中。这确保了定时器代码加入到队列中的最小时间间隔为指定间隔。什么意思呢，看如下代码：
```js
console.time('耗时')
var timer = setInterval(() => {
  for (let i = 0; i < 1100000000; i++) { // 900ms左右
  }
  console.log(0)
}, 100);

setTimeout(() => {
  console.log('1s了')
  clearInterval(timer)
  console.timeEnd('耗时') // 耗时: 1955.52490234375ms（打印结果不固定）
}, 1000);
```

看上去这里应该打印10个0才对，其实只会打印2个0，原因就是如果当事件队列当中，已经存在了定时器的回调函数，即使已经到了规定的间隔时间，也不会再把这个时间点的定时器回调函数放到事件队列当中，定时器依旧运行。当下一个约定时间又到了，如果事件队列当中依然存在定时器的回调函数，这个时间点的定时器回调函数也不会放进事件队列…

这样就会导致一些间隔被跳过了。如果需要每个定时器的回调函数都被执行到，这里就不能满足需求了。

还有一个常用的场景是使用 setInterval 进行ajax请求，如果某一次请求时间过长，就导致下一次甚至多次的请求被忽略掉，这显然是不能接受的。

## 递归setTimeout
为了避免setInterval()定时器的问题，可以使用递归setTimeout()
```js
setTimeout(function fn(){
    // 执行业务代码，执行完成后，设定一个任务
    setTimeout(fn,interval);
},interval);
```
这个模式递归调用了 setTimeout ，每次函数执行的时候都会创建一个新的定时器。第二个setTimeout()调用当前执行的函数，并为其设置另外一个定时器。这样做的好处是，在前一个定时器代码执行完之前，不会向队列插入新的定时器代码，确保不会有任何缺失的间隔。而且，它可以保证在下一次定时器代码执行之前，至少要等待指定的间隔，避免了连续的运行。因此 setTimeout 在某程度上比 setInterval 稳定。但无论是 setTimeout 还是 setInterval 都无法解决精准定时的问题。

例如：
```vue
activated() {
  this.StopTimer = true;
  let that = this;
  setTimeout(function fn() {
    if (that.StopTimer) {
      console.log("aaaaa")
      setTimeout(fn, 1000);
    }
  }, 1000)
},
deactivated() {
  this.StopTimer = false;
}
```

## 注意
在定时器任务中，var timer=setTimeout(function(){})执行后，清除定时任务clearTimeout(timer)和timer=null是有区别的，timer只是一个定时任务的一个标示量，设置为null仅仅是改变了timer变量的值，对设定的任务没有影响，只有通过clearTimeout(timer)才是真的清除定时任务

## 扩展
HTML5标准规定，setTimeout的最短时间间隔是4毫秒；setInterval的最短间隔时间是10毫秒，也就是说，小于10毫秒的时间间隔会被调整到10毫秒

大多数电脑显示器的刷新频率是60HZ，大概相当于每秒钟重绘60次。因此，最平滑的动画效的最佳循环间隔是1000ms/60，约等于16.6ms

为了节电，对于那些不处于当前窗口的页面，浏览器会将时间间隔扩大到1000毫秒。另外，如果笔记本电脑处于电池供电状态，Chrome和IE10+浏览器，会将时间间隔切换到系统定时器，大约是16.6毫秒

# js遍历数组并原地删除的问题
最近在项目中遇到，前端获取后台返回的数组后，需要对数组进行加工，删除特定的元素。

这里使用的删除函数是：splice()
```js
/**
 * 有效的方式 - 改变下标，控制遍历
 */
for (var i = 0; i < arr.length; i++) {
　　if (...) {
　　　　arr.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
　　　　i--; // 如果不减，将漏掉一个元素
　　}
}

/**
 * 无效的方式 - for .. in 无法控制遍历
 */
for (var i in arr) {
　　if (...) {
　　　　arr.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
　　　　i--; // 没有效果，怎么都会漏掉一个元素
　　}
}
```
## js 字符串数组转换成数字数组
```js
['1','2','3'].map(Number)
```

# js获取屏幕、浏览器、页面的高度宽度
本篇主要介绍Web环境中屏幕、浏览器及页面的高度、宽度信息。

## 介绍
### 容器
- 一个页面的展示，从外到内的容器为：屏幕、浏览器以及页面本身。
- HTML元素展现在页面内，页面展现在浏览器内，而浏览器展现在屏幕内。
- 通过Js的一些对象可以获取这些容器的高度、宽度。
### 物理尺寸和分辨率
- 容器的尺寸是指当前分辨率下的高度、宽度，而不是物理高度、宽度。
- 如：一个22寸的显示器，屏幕分辨率为1366 * 768，那么获取到的屏幕高度为1366px，宽度为768px。

### 展示图

![](https://raw.githubusercontent.com/NaisWang/images/master/20220227161629.png)

注意：图中的body根据HTML的文档渲染模式不同指定的body也不同。
```js
// 标准模式时(document.compatMode == 'CSS1Compat')，body = document.documentElement
var body = (document.compatMode && document.compatMode == 'CSS1Compat') ? document.documentElement : document.body
```

## 屏幕信息

![](https://raw.githubusercontent.com/NaisWang/images/master/20220227161736.png)

```js
screen.height ：屏幕高度。
screen.width ：屏幕宽度。
screen.availHeight ：屏幕可用高度。即屏幕高度减去上下任务栏后的高度，可表示为软件最大化时的高度。
screen.availWidth ：屏幕可用宽度。即屏幕宽度减去左右任务栏后的宽度，可表示为软件最大化时的宽度。
任务栏高/宽度 ：可通过屏幕高/宽度 减去 屏幕可用高/宽度得出。
如：任务栏高度 = screen.height - screen.availHeight 。
```

## 浏览器信息

![](https://raw.githubusercontent.com/NaisWang/images/master/20220227161804.png)

```js
window.outerHeight ：浏览器高度。
window.outerWidth ：浏览器宽度。
window.innerHeight ：浏览器内页面可用高度；此高度包含了水平滚动条的高度(若存在)。可表示为浏览器当前高度去除浏览器边框、工具条后的高度。
window.innerWidth ：浏览器内页面可用宽度；此宽度包含了垂直滚动条的宽度(若存在)。可表示为浏览器当前宽度去除浏览器边框后的宽度。
工具栏高/宽度 ：包含了地址栏、书签栏、浏览器边框等范围。如：高度，可通过浏览器高度 - 页面可用高度得出，即：window.outerHeight - window.innerHeight。
```

## 页面信息

![](https://raw.githubusercontent.com/NaisWang/images/master/20220227161845.png)

```js
document.body.offsetHeight ：body总高度。
document.body.offsetWidth ：body总宽度。
document.body.clientHeight ：body展示的高度；表示body在浏览器内显示的区域高度。
document.body.clientWidth ：body展示的宽度；表示body在浏览器内显示的区域宽度。
滚动条高度/宽度 ：如高度，可通过浏览器内页面可用高度 - body展示高度得出，即window.innerHeight - body.clientHeight。
```

