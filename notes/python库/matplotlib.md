---
title: matplotlib
date: 2019/12/1
update: {{ date }}
categories:
 - back-end
 - python
---
# 什么是matplotlib
1. 能将数据进行可视化，更直观的呈现
2. 使数据更加客观、更具说服力
matplotlib： 最流行的Python底层绘图库，主要做数据可视化图表，名字取材于MATLAB，模仿MATLAB构建

# 折线图
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015131905.png"/>
每个红色的点是坐标，把5个点的坐标连接成一条线，组成了一个折线图
那么到底如何把它通过代码画出来呢？
通过下面的小例子我们来看一下matplotib该如何简单的使用
假设一天中每隔两个小时（range（2，26，2））的气温（C）分别是[15，13，14.5，17，20，25，26，26，27，22，18，15]
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015133548.png"/>
执行后的图形：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015133900.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015134243.png"/>

## 设置图片大小，保存图片、清晰度
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015135554.png"/>
其中figsize表示的时图像的大小，参数分别是宽与高
保存图片代码plt.savefig()一定要在plt.plot()后执行

## 调整X或者Y轴上的刻度
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015141455.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015145418.png"/>
其中rotation=90是指逆时针旋转90度
效果：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015145609.png"/>
可以发现其中的汉字无法显示出来

## 设置中文显示
为什么无法显示中文：
matpfoib默认不支持中文字符，因为默认的英文字体无法显示汉字

查看linux/mac下面支持的字体：
fc-list ->查看支持的字体
fc-list :lang=zh ->查看支持的中文（冒号前面有空格）

那么问题来了：如何修改matplotib的默认字体？
1. 通过matplotlib.rc可以修改，具体方法参见源码（windows/linux）
2. 通过matplotib下的font manager可以解决（windows/linux/mac）
3. 通过plt.rcParams['font.sans-serif'] = ['SimHei'] 来解决
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015154445.png"/>

## 给图像添加描述信息
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015155117.png"/>

## 自定义绘制图形的风格
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015164615.png"/>

## 添加图例
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015165114.png"/>
legend中常用参数
```python
l1, = plt.plot(x, y1, label='linear line')
l2, = plt.plot(x, y2, color='red', linewidth=1.0, linestyle='--', label='square line')

plt.legend(handles=[l1, l2], labels=['up', 'down'],  loc='best')
```
需要注意的是 l1, l2,要以逗号结尾, 因为plt.plot() 返回的是一个列表.

## 实战：
```python
from matplotlib import pyplot as plt
import random
import matplotlib
from matplotlib import font_manager

font = {
	'family': 'MicroSoft Yahei',
	'size': '10'
}
matplotlib.rc("font", **font)

plt.figure(figsize=(10, 5))

x = range(11, 31)
y_1 = [1, 0, 1, 1, 1, 2, 4, 3, 2, 3, 4, 4, 5, 5, 5, 3, 3, 1, 1, 1]
y_2 = [1, 1, 2, 4, 2, 2, 4, 3, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1]

plt.plot(x, y_1, label="自己")
plt.plot(x, y_2, label="同桌")

_x_ticks = ["{} years old".format(i) for i in x]
plt.xticks(x, _x_ticks, rotation=45)

plt.xlabel("time")
plt.ylabel("number")

# Draw grid. The alpha argument indicate the transparency of grid lines
plt.grid(alpha=0.4)

# add the legend. The loc alpha argument indicate the location of the legend. The default is in
# the upper right corner.
plt.legend(loc="upper left")

plt.show()
```
效果：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015164429.png"/>

## 总结
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015165305.png"/>

# 对比常用统计图
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015170041.png"/>

# 绘制散点图

```python
# draw the scatter chart
plt.scatter(x, y_1, label="自己")
plt.scatter(x, y_2, label="同桌")
```
散点图plt.scatter的一些属性：
x：指定散点图的x轴数据；
y：指定散点图的y轴数据；
s：指定散点图点的大小，默认为20，通过传入新的变量，实现气泡图的绘制；
c：可用于不同类别的颜色，指定散点图点的颜色，默认为蓝色；可以是一个颜色列表。
marker：指定散点图点的形状，默认为圆形；
cmap：指定色图，只有当c参数是一个浮点型的数组的时候才起作用；
alpha：设置散点的透明度；
linewidths：设置散点边界线的宽度；
edgecolors：设置散点边界线的颜色；

# 绘制条形图
```python
# draw the bar chart
# the bar and barh functions represent the horizontal and vertical distribution of the bars respectively
# the width or the height indicates the thickness of bar
plt.bar(x, y_1, width=0.3, label="自己")
plt.barh(x, y_1, height=0.3, label="自己")
```

实战
```
from matplotlib import pyplot as plt
import matplotlib

font = {
	'family': 'MicroSoft Yahei',
	'size': '10'
}
matplotlib.rc("font", **font)

a = ["理球耀起3：终极之战", "教刻尔克", "戴蛛侠：英雄归来", "战狼2"]
b_16 = [1222, 44, 42, 221]
b_15 = [232, 424, 142, 121]
b_14 = [5222, 241, 32, 21]

bar_width = 0.2

y_14 = range(len(a))
y_15 = [i + bar_width for i in range(len(a))]
y_16 = [i + bar_width * 2 for i in range(len(a))]

plt.barh(y_14, b_14, height=bar_width, label="14")
plt.barh(y_15, b_15, height=bar_width, label="15")
plt.barh(y_16, b_16, height=bar_width, label="16")

plt.yticks(y_15, a)
plt.grid()
plt.legend()
plt.show()
```
效果
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015193116.png"/>

# 直方图
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015202711.png"/>

# 更多的图形样式
matplotlib支持的图形是非常多的，如果有其他的需求，我们可以查看一下url地址：
http://matplotlib.org/gallery/index.html

# add_subplot方法
```python
import matplotlib.pyplot as plt
from numpy import *
fig = plt.figure()
ax = fig.add_subplot(349)
ax.plot(x,y)
plt.show()
```
引數349的意思是：將畫布分割成3行4列，影象畫在從左到右從上到下的第9塊

# Matplotlib中的annotate（注解）的用法
annotate用于在图形上给数据添加文本注解，而且支持带箭头的划线工具，方便我们在合适的位置添加描述信息。

参数说明：
```
Axes.annotate(s, xy, *args, **kwargs)
s：注释文本的内容
xy：被注释的坐标点，二维元组形如(x,y)
xytext：注释文本的坐标点，也是二维元组，默认与xy相同
xycoords：被注释点的坐标系属性，
```
## xycoords
|属性值|含义 |
|'figure points'|以绘图区左下角为参考，单位是点数|
|'figure pixels'|以绘图区左下角为参考，单位是像素数|
|'figure fraction'|以绘图区左下角为参考，单位是百分比|
|'axes points'|以子绘图区左下角为参考，单位是点数（一个figure可以有多个axex，默认为1个）|
|'axes pixels'|以子绘图区左下角为参考，单位是像素数|
|'axes fraction'|以子绘图区左下角为参考，单位是百分比|
|'data'|以被注释的坐标点xy为参考 (默认值)|
|'polar'|不使用本地数据坐标系，使用极坐标系|

## textcoords
注释文本的坐标系属性，默认与xycoords属性值相同，也可设为不同的值。除了允许输入xycoords的属性值，还允许输入以下两种：
|属性值|含义|
|'offset points'|相对于被注释点xy的偏移量（单位是点）|
|'offset pixels'|相对于被注释点xy的偏移量（单位是像素）|

## arrowprops
箭头的样式，dict（字典）型数据，如果该属性非空，则会在注释文本和被注释点之间画一个箭头。如果不设置'arrowstyle' 关键字，则允许包含以下关键字：

|   关键字    |                       说明                       |
| ---------- | ------------------------------------------------ |
| width      | 箭头的宽度（单位是点）                               |
| headwidth  | 箭头头部的宽度（点）                                |
| headlength | 箭头头部的长度（点）                                |
| shrink     | 箭头两端收缩的百分比（占总长）                       |
| ?          | 任何 matplotlib.patches.FancyArrowPatch中的关键字 |

如果设置了‘arrowstyle’关键字，以上关键字就不能使用。允许的值有：

| 箭头的样式 |                     属性                      |
| --------- | --------------------------------------------- |
| '-'       | None                                          |
| '->'      | head_length=0.4,head_width=0.2                |
| '-['      | widthB=1.0,lengthB=0.2,angleB=None            |
| '         | -                                             |
| '-        | >'                                            |
| '<-'      | head_length=0.4,head_width=0.2                |
| '<->'     | head_length=0.4,head_width=0.2                |
| '<        | -'                                            |
| '<        | -                                             |
| 'fancy'   | head_length=0.4,head_width=0.4,tail_width=0.4 |
| 'simple'  | head_length=0.5,head_width=0.5,tail_width=0.2 |
| 'wedge'   | tail_width=0.3,shrink_factor=0.5              |

## FancyArrowPatch的关键字包括:

|       Key       |                                      Description                                      |
| --------------- | ------------------------------------------------------------------------------------- |
| arrowstyle      | 箭头的样式                                                                             |
| connectionstyle | 连接线的样式                                                                           |
| relpos          | 箭头起始点相对注释文本的位置，默认为 (0.5, 0.5)，即文本的中心，（0，0）表示左下角，（1，1）表示右上角 |
| patchA          | 箭头起点处的图形（matplotlib.patches对象），默认是注释文字框                                 |
| patchB          | 箭头终点处的图形（matplotlib.patches对象），默认为空                                        |
| shrinkA         | 箭头起点的缩进点数，默认为2                                                              |
| shrinkB         | 箭头终点的缩进点数，默认为2                                                              |
| mutation_scale  | default is text size (in points)                                                      |
| mutation_aspect | default is 1.                                                                         |
| ?               | any key for matplotlib.patches.PathPatch                                              |

## annotation_clip 
annotation_clip : 布尔值，可选参数，默认为空。设为True时，只有被注释点在子图区内时才绘制注释；设为False时，无论被注释点在哪里都绘制注释。仅当xycoords为‘data’时，默认值空相当于True。


返回值：
Annotation对象

## 示例：
```python
一个基本的注释示例，设置了箭头的颜色和缩进，感兴趣的话可以以此为基础尝试更多的属性和样式。
import numpy as np
import matplotlib.pyplot as plt
 
fig, ax = plt.subplots()
 
# 绘制一个余弦曲线
t = np.arange(0.0, 5.0, 0.01)
s = np.cos(2*np.pi*t)
line, = ax.plot(t, s, lw=2)
 
# 绘制一个黑色，两端缩进的箭头
ax.annotate('local max', xy=(2, 1), xytext=(3, 1.5),
            xycoords='data',
            arrowprops=dict(facecolor='black', shrink=0.05)
            )
ax.set_ylim(-2, 2)
plt.show()
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191027111744.png"/>

坐标转换示例——在本例中，我们学习用不同的坐标体系绘制注释。
```python
import numpy as np
import matplotlib.pyplot as plt
 
# 以步长0.005绘制一个曲线
x = np.arange(0, 10, 0.005)
y = np.exp(-x/2.) * np.sin(2*np.pi*x)
 
fig, ax = plt.subplots()
ax.plot(x, y)
ax.set_xlim(0, 10)
ax.set_ylim(-1, 1)
 
# 被注释点的数据轴坐标和所在的像素
xdata, ydata = 5, 0
xdisplay, ydisplay = ax.transData.transform_point((xdata, ydata))
 
# 设置注释文本的样式和箭头的样式
bbox = dict(boxstyle="round", fc="0.8")
arrowprops = dict(
    arrowstyle = "->",
    connectionstyle = "angle,angleA=0,angleB=90,rad=10")
 
# 设置偏移量
offset = 72
# xycoords默认为'data'数据轴坐标，对坐标点（5,0）添加注释
# 注释文本参考被注释点设置偏移量，向左2*72points，向上72points
ax.annotate('data = (%.1f, %.1f)'%(xdata, ydata),
            (xdata, ydata), xytext=(-2*offset, offset), textcoords='offset points',
            bbox=bbox, arrowprops=arrowprops)
 
# xycoords以绘图区左下角为参考，单位为像素
# 注释文本参考被注释点设置偏移量，向右0.5*72points，向下72points
disp = ax.annotate('display = (%.1f, %.1f)'%(xdisplay, ydisplay),
            (xdisplay, ydisplay), xytext=(0.5*offset, -offset),
            xycoords='figure pixels',
            textcoords='offset points',
            bbox=bbox, arrowprops=arrowprops)
 
 
plt.show()
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191027111829.png"/>
极坐标上的注释——在此例中，我们会在极坐标系绘图，并在极坐标系设置被注释点，以绘图区的百分比为参数放置注释文本。
```python
import numpy as np
import matplotlib.pyplot as plt
 
# 绘制一个极地坐标，再以0.001为步长，画一条螺旋曲线
fig = plt.figure()
ax = fig.add_subplot(111, polar=True)
r = np.arange(0,1,0.001)
theta = 2 * 2*np.pi * r
line, = ax.plot(theta, r, color='#ee8d18', lw=3)
 
# 对索引为800处画一个圆点，并做注释
ind = 800
thisr, thistheta = r[ind], theta[ind]
ax.plot([thistheta], [thisr], 'o')
ax.annotate('a polar annotation',
            xy=(thistheta, thisr),  # 被注释点遵循极坐标系，坐标为角度和半径
            xytext=(0.05, 0.05),    # 注释文本放在绘图区的0.05百分比处
            textcoords='figure fraction',
            arrowprops=dict(facecolor='black', shrink=0.05),# 箭头线为黑色，两端缩进5%
            horizontalalignment='left',# 注释文本的左端和低端对齐到指定位置
            verticalalignment='bottom',
            )
plt.show()
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191027111912.png"/>

不同样式的注释文本示例
```python
import matplotlib.pyplot as plt
 
# 设置绘图区标题
fig = plt.figure()
fig.suptitle('bold figure suptitle', fontsize=14, fontweight='bold')
 
# 设置子绘图区标题
ax = fig.add_subplot(111)
fig.subplots_adjust(top=0.85)
ax.set_title('axes title')
 
# 设置x y坐标轴的标识
ax.set_xlabel('xlabel')
ax.set_ylabel('ylabel')
 
# 红色、透明度0.5、边框留白10
ax.text(3, 8, 'boxed italics text in data coords', style='italic',
        bbox={'facecolor':'red', 'alpha':0.5, 'pad':10})
 
# 文字中有数学公式
ax.text(2, 6, r'an equation: $E=mc^2$', fontsize=15)
 
# 文字中有ASCII码
ax.text(3, 2, 'unicode: Institut f\374r Festk\366rperphysik')
 
# 转换坐标系
ax.text(0.95, 0.01, 'colored text in axes coords',
        verticalalignment='bottom', horizontalalignment='right',
        transform=ax.transAxes,
        color='green', fontsize=15)
 
# 在2,1处画个圆点，添加注释
ax.plot([2], [1], 'o')
ax.annotate('annotate', xy=(2, 1), xytext=(3, 4),
            arrowprops=dict(facecolor='black', shrink=0.05))
 
ax.axis([0, 10, 0, 10])
 
plt.show()
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191027111957.png"/>

# 绘制树的图形
```python
# draw decision tree by matplotlib
# define the type of textbox and arrow
decision_node = dict(boxstyle='sawtooth', fc='0.8')
leaf_node = dict(boxstyle='round4', fc='0.8')
arrow_args = dict(arrowstyle='<-')
plt.rcParams['font.sans-serif'] = ['SimHei']

#%%

# get count of leaf nodes
def get_num_leaf(tree):
	num_leaf = 0 # initialize the number of leaf nodes
	feat = next(iter(tree)) # get the first node of decision tree
	feat_value = tree[feat]
	for key in feat_value.keys():
		 if type(feat_value[key]) == dict:
			 num_leaf += get_num_leaf(feat_value[key])
		 else:
			 num_leaf += 1
	return num_leaf
# print(deci_tree)
# get_num_leaf(deci_tree)

#%%

# get max depth of tree
def get_tree_depth(tree):
	max_depth = 0
	feat = next(iter(tree)) # get the first node of decision tree
	feat_value = tree[feat]
	for key in feat_value.keys():
		 if type(feat_value[key]) == dict:
			 this_depth = 1 + get_tree_depth(feat_value[key])
		 else:
			 this_depth = 1
		 if this_depth > max_depth:
			 max_depth = this_depth
	return max_depth

# get_tree_depth(deci_tree)
	

#%%

# draw node 
def plot_node(node_text, text_position, parent_position, node_type):
	create_plot.ax1.annotate(s=node_text, xy=parent_position, xycoords='axes fraction',
							 xytext=text_position, textcoords='axes fraction',
							 va='center', ha='center', bbox=node_type, arrowprops=arrow_args)
	


#%%

def plot_mid_text(cntr_pt, parent_pt, text_string):
	x_mid = (parent_pt[0] - cntr_pt[0])/2 +cntr_pt[0]
	y_mid = (parent_pt[1] - cntr_pt[1])/2 +cntr_pt[1]
	create_plot.ax1.text(x_mid, y_mid, text_string)


#%%

def plot_tree(tree, parent_pt, node_text):
	num_leaf = get_num_leaf(tree)
	depth = get_tree_depth(tree)
	first_str = next(iter(tree))
	print(first_str)
	center_pt = (plot_tree.xOff + (1.0 + float(num_leaf))/2.0/plot_tree.totalW, plot_tree.yOff)
	plot_mid_text(center_pt, parent_pt, node_text)
	plot_node(first_str, center_pt, parent_pt, decision_node)
	second_dict = tree[first_str]
	plot_tree.yOff = plot_tree.yOff - 1.0/plot_tree.totalD
	for key in second_dict.keys():
		if type(second_dict[key]) == dict:
			plot_tree(second_dict[key], center_pt, str(key))
		else:
			plot_tree.xOff = plot_tree.xOff + 1.0/plot_tree.totalW
			plot_node(second_dict[key], (plot_tree.xOff, plot_tree.yOff), center_pt, leaf_node)
			plot_mid_text((plot_tree.xOff, plot_tree.yOff), center_pt, str(key))
	plot_tree.yOff = plot_tree.yOff + 1.0/plot_tree.totalD

#%%

def create_plot(tree):
	fig = plt.figure(1, facecolor='white')
	fig.clf()
	axprops = dict(xticks=[], yticks=[])
	create_plot.ax1 = plt.subplot(111, frameon=False, **axprops)
	plot_tree.totalW = float(get_num_leaf(tree))
	plot_tree.totalD = float(get_tree_depth(tree))
	print(plot_tree.totalW)
	print(plot_tree.totalD)
	plot_tree.xOff = -0.5/plot_tree.totalW
	plot_tree.yOff = 1
	plot_tree(tree, (0.5, 1.0), '')
	plt.show()
	return

create_plot(deci_tree)
```