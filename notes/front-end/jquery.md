# JQuery给动态添加的元素绑定事件
通常，jQuery 是这样给 HTML 元素绑定事件的：

```js
$('#clickMe').on('click', function () {
    alert("hey it's Sam.");
  }
);
```

事件绑定后，我们点击元素，浏览器就会弹一个对话框。
但是，上述事件绑定只适用页面内已有的元素。jQuery on 文档里是这样说的：

Event handlers are bound only to the currently selected elements. They must exist at the time your code makes the call to .on()

也就是说，如果上述 JavaScript 代码执行时，#clickMe 元素还不存在，是我们后期动态添加的话，则上述事件绑定不会生效 - jQuery 不能给不存在的 DOM 节点绑定事件处理器。

但我们可以把它委托（delegated）给 document：

```js
$(document).on('click', '#clickMe', function(){
  alert("hey it's Sam.");
});
```

Hey document，如果有点击事件发生，请让 #clickMe 执行这个事情处理器。点击事件会冒泡，而 document 总是存在。这样，就达到我们希望的效果。同理，你也可以将事件绑定委托给某些已存在的父节点。

# on()与bind()的差别

JQuery从1.7+版本开始，提供了on()和off()，进行事件处理函数的绑定和取消。这2个API与JQuery最初提供的bind()和unbind()有很多相似的地方，也有一些不同之处。bind和unbind的详细介绍，可以参考这篇文章。
on()和bind()的函数签名如下：

```js
bind(type, [data], fn)
on(type,[selector],[data],fn)
```

可以看到2个函数的区别在于：是否支持selector这个参数值。由于javascript的事件冒泡特性，如果我们在父元素上注册了一个事件处理函数，当子元素上发生这个事件的时候，父元素上的事件处理函数也会被触发。如果使用on的时候，不设置selector，那么on与bind就没有区别了。

```js
<div id="parent">
  <input type="button" value="a" id="a"/>
  <input type="button" value="b" id="b"/>
</div>
```

上面这段代码，如果我们使用bind()在parent上绑定了click事件处理函数，当点击a或者b按钮的时候，都会执行事件处理函数。如果我们希望点击a的时候触发，点击b的时候不触发，那么可以使用on，代码如下：

```js
$("#parent").on("click","#a",function(){
  alert($(this).attr("id"));
});
```

可以看到：on()函数的参数selector就是为了在事件冒泡的时候，让父元素能够过滤掉子元素上发生的事件。如果使用了bind，那么就没有这个能力，子元素上发生的事件一定会触发父元素事件。
还有一点需要注意：on绑定的事件处理函数，对于未来新增的元素一样可以，和delegate效果相同，而bind则不行。

# Jquery与js常见使用总结

## 获取子元素

JS:

```js
var test = document.getElementById("test");
var a = test.getElementsByTagName("div");

// childNodes与children的区别：childNodes会把换行和空格也当成是节点信息
var b = test.childNodes;
var getFirstChild = test.children[0];


// firstChild与firstElementChild的区别：fristChild会把换行和空格也当成是节点信息
var getFirstChild = test.firstChild;
var getFirstChild = test.firstElementChild;

// lastChild与lastElementChild的区别：lastChild会把换行和空格也当成是节点信息
var getLastChildA = test.lastChild;
var getLastChildB = test.lastElementChild;
```

Jquery:

```js
// children和find的区别：children只会查找直接子集，而find会跨越层级查找，一直找到没有为止
$("#test").children(); // 全部直接子节点
$("#ul").children("li")
$("#ul").find("li")
```

## 获取父节点

JS:

```js
var test = document.getElementById("test");
var parent = test.parentNode; // 父节点
```

Jquery:

```js
$("#test1").parent(); // 父节点
$("#test1").parents(); // 全部父节点
$("#test1").parents(".mui-content");
```

## 获取兄弟节点

JS:

```js
var test = document.getElementById("test");
var previous = test.previousSibling; // 上一个兄弟节点
var next = test.nextSibling; // 下一个兄弟节点
```

Jquery:

```js
$("#test1").prev();  // 上一个兄弟节点
$("#test1").prevAll(); // 之前所有兄弟节点
$("#test1").next(); // 下一个兄弟节点
$("#test1").nextAll(); // 之后所有兄弟节点
$("#test1").siblings(); // 所有兄弟节点
$("#test1").siblings("#test2");
```

## 属性操纵

JS:

```js
var test = document.getElementById("test");
test.classList.add("myclass");
test.classList.add("myclass", "anotherClass", "thirdClass")
test.classList.remove("myclass")
test.classList.remove("myclass", "anotherClass")
test.classList.toggle('myclass')
test.classList.contains('myCssClass')

test.getAttribute('align') // "left"
test.setAttribute('align', 'right');
console.log(test.hasAttribute('align')) //true
test.removeAttribute('align');

//data-*属性
console.log(test.dataset.foo)
test.dataset.foo = "baz"
```

Jquery:

```js
$("#test1").addClass("intro")
$("#test1").removeClass("intro");
$("#test1").toggleClass("main")
console.log($("#test1").hasClass("intro")))

$("#test1").attr("width")
$("#test1").attr("width","180")
$("#test1").attr({width:"50",height:"80"})
$("#test1").removeAttr("width")
```

## 样式操作

JS:

```js
var test = document.getElementById("test");
test.style.width = "100px";
test.style.getPropertyValue("width");  
test.style.setProperty("width", "100px", "");
test.style.removeProperty("width")
test.setAttribute('style', 'width: 100px');
test.style.cssText = 'width: 100px';
```

Jquery:

```js
$("#test").css("width");
$("#test").css("width","100px")
$("#test").css({"color":"red", "background-color":"silver", "font-weight":"bold"});
```

## 事件操作

JS:

```js
var test = document.getElementById("test");

//obj.on事件名 = 事件处理函数
test.onclick = function(){
  alert('hi')
};

test.addEventListener("click", function(){
    alert('hi')
});

test.onclick = false

test.removeEventListener("click", function(){
    alert('hi')
});
```

Jquery:

```js
// 自 jQuery 版本 1.7 起，on() 方法是 bind()、live() 和 delegate() 方法的新的替代品
$("#test").on("click", function(){
    alert("The paragraph was clicked.");
});
$("#test").on('click', '#clickMe', function(){
  alert("hey it's Sam.");
});

$("#test").bind("click",function(){
    alert("单击元素");
});

// live方法在版本 1.9 中被移除。请使用on()方法代替
$("#test").live("click",function(){
    $("p").slideToggle();
});


$("#test").delegate("p","click",function(){
  $("p").css("background-color","pink");
});

$("p").off("click");
```
