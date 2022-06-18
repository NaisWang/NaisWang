# 编辑器快捷键
## 光标跳转快捷键

| 功能                                       | Jetbrain |
| ------------------------------------------ | -------- |
| Back                                       | ctrl+o       |
| Forward                                    |  ctrl+i      |
| find usage                                 | gR       |
| show usage                                 | gr       |
| 跳转到声明处                               | gd       |
| 跳转到上一个方法Previousmethod             | gk       |
| 跳转到下一个方法Nextmethod                 | gj       |
| 上一个错误或警告                           | g[       |
| 下一个错误或警告                           | g]       |
| 跳转到方法的实现                           | gi       |
| 跳转到父类方法处go to super method         | gs       |
| JumpToLastChange                           | g,       |
| 全局查找                                   | gF或ctrl-shift-f       |
| 翻半页(保留vim操作)                        | ctrl+u/d |

## 提示/查找快捷键

| 功能                               | Jetbrain  |
| -----------------------------      | --------- |
| 显示方法参数信息                   | control+a    |
| quick Documentation                | control+k |
| external Documentation             | control+shift+k |
| 错误/警告描述ErrorDescription      | control+e     |
| show context actions               | control+f |

## 编辑快捷键

| 功能                              | Jetbrain   |
| --------------------------------- | ---------- |
| Generate                          | control+g     |
| 重命名                            | control+r     |
| 快速生成函数注释(Fix doc comment) | control+c     |
| Surround with                     | control+s     |
| 快速导包                          | control+m     |
| 折叠/展开全部                          | zao/zac     |

## 有关窗口的快捷键

| 功能                     | Jetbrain     |
| ------------------------ | ------------ |
| 显示/关闭资源目录窗口    | control+p        |
| 显示/关闭其他非编辑窗口  | control+n        |

---

# IDEA篇
## IntelliJ IDEA的调试功能
[官网](https://www.jetbrains.com/help/idea/debugging-code.html)

### debug面板按钮详解

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327142719.png)

- `show execution point`: 如果你的光标在其他行或其他页面，点击这个按钮可跳转到当前代码执行的行
- `step over`: 一行一行地往下走，如果这一行有方法不会进入方法
- `step into`: 如果当前有方法，可以进入方法内部，一般用于进入自定义方法内部，不会进入官方类库的方法
- `force step into`: 强制进入任何方法内部
- `step out`: 从`step into`进入的方法内退出到方法调用处
- `run to cursor`: 运行到光标处 
- `Resume program`: 会从该断点处继续运行，直到下一个断点处
- `Pause program`: 暂停运行 



### 断点
#### 断点类型
IDEA支持以下几种断点类型：
- 行断点（Line Breakpoints）：遇断点所在的行即停
![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143139.png)

- 方法断点（Method Breakpoints）：如果你看到代码调用了一个接口中的抽象方法，但不知道具体会跑在哪个实现上，便可以在该接口上的抽象方法上设置断点，这样不管哪个子类运行到这个方法都会停下来。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143156.png)

- 异常断点（Exception Breakpoints）：可以在Run -> View Breakpoints中的Java Exception Breakpoints里添加异常的具体类型。这样的话，程序中一旦发生了这种异常马上就会停下来。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143214.png)

- 字段断点（Field Watchpoints）：可以设置在字段上，这样读写字段都可以触发。需要注意的是，默认只有写才会停下，想要让读取时也停下，需要右击断点，在Watch的Field access上打勾才行。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143233.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143247.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143302.png)

<div class="container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/a_AXz-DoGzM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

#### 条件断点
断点是可以设置条件的，这样便可以只在关心的时候停下来。比如说循环里处理一堆字符串，但是只关心特定的字符串，那条件断点便可以派上用场。按住Shift键设置断点，或是右击断点之后选择More来打开以下界面：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143517.png)

上图就是设置条件断点的界面，直接在Condition里输入条件即可，如"ggg".equals(name)。需要注意的是，**Suspend默认是没有打勾的，必须勾选上才能让程序暂停**。另外，辛辛苦苦设置的特定断点，是可以拖拽到别的地方去的，这样就省的到处敲来敲去的了。还有一个小技巧是按住Alt的同时设置断点，可以让断点仅停一次便自动消失。在设置临时断点时有点用。

#### 无断点暂停
如果在很长的循环时不知道程序运行到哪里了，可以在调试时点击调试窗口上的**Pause Program**，这样程序便能在当前执行的地方暂停。另外，**运行到光标（Run to cursor）**也可以在没有设置断点的时候让程序运行到光标所在行时暂停。

### 调试技巧
#### 智能进入（Smart step into）
当调试程序运行到类似这样的句子时，如果你想看的是actor.action方法，那么进入这个方法就相对麻烦一些。
```java
actor.action(actionProvider.provide(action.getName()));
```
这时可以使用调试窗口上的智能进入，程序会弹出一个对话框，我们选择需要的调用处即可。算是一个提升调试效率的小技巧。
官方文档传送门：https://www.jetbrains.com/help/idea/stepping-through-the-program.html#smart-step-into

#### 表达式评估（Evaluate expression）
这应该是大部分人都知道的技巧了，可以通过表达式评估来重新赋值当前的变量，以便让程序运行到其它的分支去。当然也可以在Variables窗口中，右击想要改变的变量，选择Set Value。不过表达式评估里可以轻松增加新变量、动态import新类库等，功能更加强大。
官方文档传送门：https://www.jetbrains.com/help/idea/examining-suspended-program.html#evaluating-expressions

#### 弃栈帧（Drop frame）
Visual Studio好的一点是调试时可以拖拽当前执行的位置，方便反复查看。虽然IDEA没有这样的功能，但是它可以使用弃栈帧来把当前调用栈的第一栈帧丢弃掉，相当于重新开始当前调试的方法。使用方法也算简单，在要丢弃的栈帧上右击，选择Drop Frame即可。或者直接单击调试窗口的Drop Frame按钮。不过需要注意的是，如果对象在子方法运行时发生了变化，是不会再变回去的。
官方文档传送门：https://www.jetbrains.com/help/idea/stepping-through-the-program.html#drop-frame

#### 强制抛异常（Throw an exception）
这是IDEA 2018年加入的新功能，可以直接在调试中抛出指定的异常。使用方法跟上面的弃栈帧类似，右击栈帧并选择Throw Exception，然后输入如下代码即可：
```java
throw new NullPointerException()
```
官方文档传送门：https://www.jetbrains.com/help/idea/altering-the-program-s-execution-flow.html#throw_exception

#### 强制返回（Force return）
这是IDEA2015版时增加的功能，类似上面的手动抛异常，只不过是返回一个指定值罢了。使用方法跟上面也都类似，右击栈帧并选择Force Return，然后输入要返回的值即可。如果是void的方法那就更简单了，连返回值都不用输。
官方文档传送门：https://www.jetbrains.com/help/idea/altering-the-program-s-execution-flow.html#force_return

#### 自动载入变化代码（Reload changes）
利用Java虚拟机提供的HotSwap功能，我们可以做到一边调试一边改代码。只要在修改完代码之后，点击Run -> Reload Changed Classes即可。不过HotSwap有一些限制，例如不支持static的字段和方法等。
官方文档传送门：https://www.jetbrains.com/help/idea/altering-the-program-s-execution-flow.html#reload_classes

#### 显示方法返回值（Show method return values）
调试窗口里的Settings -> Show Method Return Values开关可以显示方法的返回值。例如以下方法：
```java
private double random() {
    return Math.random();
}
```
只要在return上设断点然后Step Over，或者在方法内部的任何地方设断点然后Step Out一下，便可以在调用处的变量窗口看到一个类似于这样的值：Test.random() = 0.28735657504865864。在这个方法调用没有赋值给变量时（如if (random() < 10)）还挺有用的。

#### 调试流（Trace Current Stream Chain）
前面说了Visual Studio的好，但是它调试时不能看lambda的值也真是挺恶心的，据说2015版以后开始支持有限的lambda了。IDEA在这方面就做的非常到位。Java 8带来的Stream里面到底是什么，有时候很难知道。通过IDEA提供的这个功能，我们可以很轻松地看到流在各个步骤之间的变化。如下图：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143539.png)

展平模式（Flat Mode）更是提供了全局的视角：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143559.png)

使用这个功能也非常简单，当程序在lambda表达式的任意处停下时，单击调试窗口的Trace Current Stream Chain按钮即可。
官方文档传送门：https://www.jetbrains.com/help/idea/analyze-java-stream-operations.html

#### 调试内存泄漏（Memory View）
内存泄漏是一个比较头疼的问题，好在IDEA提供了内存分析工具，只要单击调试窗口右上角的Restore ‘Memory’ View就能看到内存窗口，然后点击其中的Click to load the classes list就能看到当前内存的对象分布情况。然后可以据此分析到底是哪个类的对象数量看起来有问题。
官方文档传送门：https://www.jetbrains.com/help/idea/analyze-objects-in-the-jvm-heap.html

## IDEA中的Project Structure的几个设置：
### Modules

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143614.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143630.png)

### Facets

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143647.png)

Facets的作用就是配置项目框架类支持。比如我们现在要开发的是一个 web 项目，那就需要 web 相关的 Facet，事实上，如果没有这个配置支持，编译器也不知道这个项目是个 web 项目，也就不会去读取 web.xml 的配置，更无法被 tomcat 这种容器支持。


### Artifacts

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143815.png)

### Project

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143829.png)

### Facets和Artifacts的区别：
Facets 表示这个module有什么特征，比如 Web，Spring和Hibernate等；

Artifact 是maven中的一个概念，表示某个module要如何打包，例如war exploded、war、jar、ear等等这种打包形式；

一个module有了 Artifacts 就可以部署到应用服务器中了！

### 在给项目配置Artifacts的时候有好多个type的选项，exploed是什么意思
explode 在这里你可以理解为展开，不压缩的意思。也就是war、jar等产出物没压缩前的目录结构。建议在开发的时候使用这种模式，便于修改了文件的效果立刻显现出来。

默认情况下，IDEA的 Modules 和 Artifacts 的 output目录 已经设置好了，不需要更改，打成 war包 的时候会自动在 WEB-INF目录 下生产 classes目录，然后把编译后的文件放进去。

artifact你把它理解成“生成的东西”就差不多了。这个词强调的是这是你软件生产过程中某一步的产生物，不像程序本身，或者是配置文件这些，是你手写出来的

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143843.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143901.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220327143938.png)

注意：通常在开发环境下，部署为war exploded，这种方式支持热部署[update classes and resources]。

上图选项中有web application exploded，这个是以文件夹形式（War Exploded）发布项目，选择这个，发布项目时就会自动生成文件夹在指定的output directory,

如果选 web application archive，就是war包形式，每次都会重新打包全部的,将项目打成一个war包在指定位置

# 插件
- Alibaba Java Coding
- Free Mybatis plugin
- IDE Eval Reset
- IdeaVim
- JRebel and XRebel
- Material Theme UI
- RestfulTool
