# Performance面板
运行时性能表现（runtime performance）指的是当你的页面在浏览器运行时的性能表现，而不是在下载页面的时候的表现。这篇指南将会告诉你怎么用Chrome DevTools Performance功能去分析运行时性能表现。在RAIL性能评估模型下，你可以在这篇指南中可以学到怎么去用这个performance功能去分析Response, Animation, 以及 Idle 这三个性能指标。

在这篇指南中，我们会用Performance工具去分析一个现有的在线DEMO，然后教会你怎么去分析，从而找到性能瓶颈。

打开Chrome的匿名模式。匿名模式可以保证Chrome在一个相对干净的环境下运行。比如说，你安装了许多chrome插件，这些插件可能会影响我们分析性能表现。
在匿名模式下打开右边这个链接，[DEMO](https://googlechrome.github.io/devtools-samples/jank/)，这个网页就是我们要用来分析的DEMO。这个页面里都是很多上下移动的蓝色小方块。
按下Command+Opiton+I（Mac）或者Control+shift+I (Windows, Linux) 来打开Devtools

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162656.png)

## 模拟移动设备的CPU
移动设备的CPU一般比台式机和笔记本弱很多。当你想分析页面的时候，可以用CPU控制器（CPU Throttling）来模拟移动端设备CPU。
- 在DevTools中，点击 Performance 的 tab。
- 确保 Screenshots checkbox 被选中
- 点击 Capture Settings（⚙️）按钮，DevTools会展示很多设置，来模拟各种状况
- 对于模拟CPU，选择2x slowdown，于是Devtools就开始模拟两倍低速CPU

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162706.png)

## 设置DEMO
为了使得这个DEMO有相对统一的运行表现（不同的读者，机器的性能千差万别）。这个DEMO提供了自定义功能，用来确保这个DEMO的统一表现。
- 一直点击 Add 10 这个按钮直到你能很明显看到蓝色小方块移动变慢，在性能比较好的机器上，大概要点击20次左右。
- 点击 Optimize按钮，你会发现蓝色小方块会变的很快而且动画变得平滑。
- 点击 un-optimize 按钮，蓝色小方块又会变成之前的模样。

## 性能分析操作流程
1. 在谷歌浏览器调式模式下，切换到 performance 选项卡。点击刷新图标（或者Ctrl+Shift+E快捷键）。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162715.png)

2. 出现如下网页分析进度条。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162724.png)

3. 自动停止后，会出现性能分析图。

**注意点1**：需要勾选屏幕快照选项，才会出现如下屏幕快照截图（一般是默认勾选）。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162734.png)

**注意点2**：整个分析图出现的时间轴就是前面步骤中分析进度条的时间，而默认出现的区域时间轴是首屏加载时间。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162744.png)

如图所示：
（1）以上红色框出的部分（也是整个时间轴）就是前面分析进度条的分析时间。
（2）以上绿色框出的部分是首屏加载时间。
（3）首屏加载时间刻度与选项卡 Summary 的 Total 总时间一致。
（4）如下图可通过左右边界来调整时间轴区域。时间轴区域 2 是 时间轴区域 1 的放大版，便于查看时间轴区间的各项指标性能情况。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162754.png)

## 性能分析图详解
如下所示，把整张分析图划分成 3 个区域。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162806.png)

### 区域1：网页性能总览图
总览图包含 FPS（每秒帧数情况）、CPU（CPU占用情况）、NET（网络资源情况）、HEAP（JS占用情况）一共四项指标。

**FPS**：全称 Frames Per Second，表示每秒传输帧数，是速度单位，用来分析动画的一个主要性能指标。1fps = 0.304 meter/sec(米/秒)。如下图所示，绿色竖线越高，FPS 越高。 红色表示长时间帧，可能出现卡顿。

如果能够达到 >=60fps(帧)/s 的刷新频率，就可以避免出现卡顿。
尽量保证页面要有高于每秒60fps(帧)的刷新频率，这与大多数显示器的刷新率相吻合(60Hz)。如果网页动画能够做到每秒60帧，就会跟显示器同步刷新，达到最佳的视觉效果。

这意味着，一秒之内进行 60 次重新渲染，每次重新渲染的时间不能超过1/60=0.01666s（秒）；`0.01666s*1000=16.66ms（毫秒）`。

不同帧的体验：
帧率能够达到 50 ～ 60 FPS 的动画将会相当流畅，让人倍感舒适；
帧率在 30 ～ 50 FPS 之间的动画，因各人敏感程度不同，舒适度因人而异；
帧率在 30 FPS 以下的动画，让人感觉到明显的卡顿和不适感；
帧率波动很大的动画，亦会使人感觉到卡顿。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162832.png)

**CPU**：CPU 资源。此面积图指示消耗 CPU 资源的事件类型。
下图中颜色分别为（与数据统计中的颜色数据表示一致）：
蓝色(Loading)：表示网络通信和 HTML 解析时间。
黄色(Scripting)：表示 JavaScript 执行时间。
紫色(Rendering)：表示样式计算和布局（重排）时间。
绿色(Painting)：表示重绘时间。
灰色(other)：表示其它事件花费的时间。
白色(Idle)：表示空闲时间。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162842.png)

**NET**：每条彩色横杠表示一种资源。横杠越长，检索资源所需的时间越长。 每个横杠的浅色部分表示等待时间（从请求资源到第一个字节下载完成的时间）。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162850.png)

**HEAP**：JavaScrip 执行的时间分布。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162859.png)


### 区域2：各项指标的区块图

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162910.png)

- `Network`：表示每个服务器资源的加载情况。
- `Frames`：表示每幅帧的运行情况。
- `Timings`：上图中有 4 条虚线，分别表示如下。
  - DCL（DOMContentLoaded）表示 HTML 文档加载完成事件。当初始 HTML 文档完全加载并解析之后触发，无需等待样式、图片、子 frame 结束。作为明显的对比，load 事件是当个页面完全被加载时才触发。
  - FP（First Paint）首屏绘制，页面刚开始渲染的时间。
  - FCP（First Contentful Paint）首屏内容绘制，首次绘制任何文本，图像，非空白canvas 或 SVG 的时间点。
  - FMP（First Meaningful Paint）首屏有意义的内容绘制，这个“有意义”没有权威的规定，本质上是通过一种算法来猜测某个时间点可能是 FMP。有的理解为是最大元素绘制的时间，即同LCP（Largest Contentful Paint ）。 其中 FP、FCP、FMP 是同一条虚线，三者时间不一致。比如首次渲染过后，有可能出现 JS 阻塞，这种情况下 FCP 就会大于 FP。
  - L（Onload）页面所有资源加载完成事件。
  - LCP（Largest Contentful Paint ）最大内容绘制，页面上尺寸最大的元素绘制时间。

- `Main`：表示主线程。
  - 主线线程主要负责：
  - Javascript 的计算与执行；
  - CSS 样式计算；
  - Layout 布局计算；
  - 将页面元素绘制成位图（paint），也就是光栅化（Raster）；
  - 将位图给合成线程。

- `Raster`：光栅化（处理光栅图，即位图）。
- `GPU`：表示 GPU 占用情况。
- `Chrome_childIOThread`：子线程。
- `Compositor`：合成线程。
  - 合成线程主要负责：
  - 将位图（GraphicsLayer 层）以纹理（texture）的形式上传给 GPU；
  - 计算页面的可见部分和即将可见部分（滚动）；
  - CSS 动画处理；
  - 通知 GPU 绘制位图到屏幕上。

- `JS Heap`：表示 JS 占用的内存大小。
- `Documents`：表示文档数。
- `Nodes`：表示 Node 节点数。
- `Listeners`：表示监听数。
- `GPU Memory`：表示 GPU 占用数。
下面的 4 条折线图是以上 4 个指标（没有 GPU 消耗）对应的时间消耗的内存大小与节点数量。若将某项指标前面的勾选去掉则不会出现对应的折线。
注意这个折线图只有在点击 Main 主线程的时候才会有，选择其他的指标时折线图区域时空白。

## 区域3：数据统计与汇总

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162919.png)

- Summary：表示各指标时间占用统计报表；
- Bottom-Up：表示事件时长排序列表（倒序）；
- Call tree：表示事件调用顺序列表；
- Event Log：表示事件发生的顺序列表；

**Loading 事件：**
| 内容             | 说明                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| Parse HTML       | 浏览器解析 HTML                                                        |
| Finish Loading   | 网络请求完成                                                           |
| Receive Data     | 请求的响应数据到达事件，如果响应数据很大（拆包），可能会多次触发该事件 |
| Receive Response | 响应头报文到达时触发                                                   |
| Send Request     | 发送网络请求时触发                                                     |

**Scripting 事件：**
| 内容                    | 说明                                                 |
| ----------------------- | ---------------------------------------------------- |
| Animation Frame Fired   | 一个定义好的动画帧发生并开始回调处理时触发           |
| Cancel Animation Frame  | 取消一个动画帧时触发                                 |
| GC Event                | 垃圾回收时触发                                       |
| DOMContentLoaded        | 当页面中的DOM内容加载并解析完毕时触发                |
| Evaluate Script         | A script was evaluated.                              |
| Event                   | JS 事件                                              |
| Function Call           | 浏览器进入 JS 引擎时触发                             |
| Install Timer           | 创建计时器（调用setTimeout()和setInterval()）时触发  |
| Request Animation Frame | A requestAnimationFrame() call scheduled a new frame |
| Remove Timer            | 清除计时器触发                                       |
| Time                    | 调用 console.time() 触发                             |
| Time End                | 调用 console.timeEnd() 触发                          |
| Timer Fired             | 定时器激活回调后触发                                 |
| XHR Ready State Change  | 当一个异步请求为就绪状态后触发                       |
| XHR Load                | 当一个异步请求完成加载后触发                         |

**Rendering 事件：**
| 内容              | 说明                              |
| ----------------- | --------------------------------- |
| Invalidate layout | 当 DOM 更改导致页面布局失效时触发 |
| Layout            | 页面布局计算执行时触发            |
| Recalculate style | Chrome 重新计算元素样式时触发     |
| Scroll            | 内嵌的视窗滚动时触发              |

**Painting事件：**
| 内容             | 说明                                  |
| ---------------- | ------------------------------------- |
| Composite Layers | Chrome 的渲染引擎完成图片层合并时触发 |
| Image Decode     | 一个图片资源完成解码后触发            |
| Image Resize     | 一个图片被修改尺寸后触发              |
| Paint            | 合并后的层被绘制到对应显示区域后触发  |

## 分析报告
一旦你得到了页面的性能表现报告，那么就可以用它来分析页面的性能，从而找到性能瓶颈。

### 分析每一秒的帧
FPS（frames per second）是用来分析动画的一个主要性能指标。能保持在60的FPS的话，那么用户体验就是不错的。
- 观察FPS图表，如果你发现了一个红色的长条，那么就说明这些帧存在严重问题，有可能导致非常差的用户体验。一般来说，绿色的长条越高，说明FPS越高，用户体验越好。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162928.png)

- 就在FPS图表下方，你会看到CPU图表。在CPU图表中的各种颜色与Summary面板里的颜色是相互对应的，Summary面板就在Performance面板的下方。CPU图表中的各种颜色代表着在这个时间段内，CPU在各种处理上所花费的时间。如果你看到了某个处理占用了大量的时间，那么这可能就是一个可以找到性能瓶颈的线索。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162937.png)

- 把鼠标移动到FPS，CPU或者NET图表之上，DevToos就会展示这个时间点界面的截图。左右移动鼠标，可以重发当时的屏幕录像。这被称为scrubbing, 他可以用来分析动画的各个细节。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162946.png)

- 在Frames图表中，把鼠标移动到绿色条状图上，Devtools会展示这个帧的FPS。每个帧可能都在60以下，都没有达到60的标准。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162956.png)

当然这个对于DEMO，可以相当容易观察到性能的问题。但是在现实使用场景下，就不是那么容易观察到了。所以要把常常使用这些工具来分析页面。

小功能：显示实时FPS面板
另外一个好用的小工具就是实时FPS面板，它可以实时展示页面的FPS指标
按下 Command+Shift+P（Mac）或者 Control+Shift+P(Windows, Linux) 打开命令菜单
输入Rendering，点选Show Rendering
在Rendering面板里，激活FPS Meter。FPS实时面板就出现在页面的右上方。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163006.png)

### 定位瓶颈
现在已经确定到这个页面的动画性能表现不太好，那么下一步就是找到为什么
- 注意Summary面板，你会发现CPU花费了大量的时间在rendering上。因为提高性能就是一门做减法的艺术，你的目标就是减少rendering的时间

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163015.png)

- 展开Main图表，Devtools展示了主线程运行状况。X轴代表着时间。每个长条代表着一个event。长条越长就代表这个event花费的时间越长。Y轴代表了调用栈（call stack）。在栈里，上面的event调用了下面的event。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163025.png)

- 在性能报告中，有很多的数据。可以通过双击，拖动等等动作来放大缩小报告范围，从各种时间段来观察分析报告。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163034.png)

- 在事件长条的右上角出，如果出现了红色小三角，说明这个事件是存在问题的，需要特别注意。
- 双击这个带有红色小三角的的事件。在Summary面板会看到详细信息。注意reveal这个链接，双击它会让高亮触发这个事件的event。如果点击了app.js:94这个链接，就会跳转到对应的代码处。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163045.png)

- 在app.update这个事件的长条下方，有很多被触发的紫色长条。如果放大这些事件长条，你会看到它们每个都带有红色小三角。点击其中一个紫色事件长条，Devtools在Summary面板里展示了更多关于这个事件的信息。确实，这里有很多reflow的警告。
- 在summary面板里点击app.js:70链接，Devtools会跳转到需要优化的代码处

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163056.png)

OK！Devtools里面还有很多很多指标需要你去探索，但是，对于怎么用Devtools去分析网页的运行时性能表现，你现在已经有了一个基本的概念。








