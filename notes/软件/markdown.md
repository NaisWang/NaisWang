# markdown数学公式
笔者认为所谓插入数学公式其实就是引入一种规则，然后通过模板？渲染成公式，不知道这个理解对不对，不对望指正。其实你以前可能就看到过有的博客本该出现公式的时候不显示，点击后会链接到一个 new tab 然后显示一张公式的图片，有时却出现一大堆的代码。这里就是通过这段代码解析成公式然后显示的。

这里我们选取 MathJax 引擎。
引入脚本，把下面代码插入 MD 文件里面，如果你怕这份在线文件源别人访问不到的话，可以把这个下下来自己做一个源，这样比较稳定缺点是要自己手动更新源。

```
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=default"></script>
```

复制代码好了到这里就可以插入公式了，如果你懂 LaTeX 的话那看一两个例子就知道了，不懂也没关系，自己写一写代码就知道了，可以找一个可以预览 MD 的工具一直尝试。
## 插入方式
这里分两种，一种是行间插入，另一种是另取一行
### 行间插入
```
\\(a + b\\)
$a+b$
```
复制代码这里是行间插入公式 a + b : \(a + b\)，特点就是通过( 和 ) 包含公式，然后为了模板引擎能够区分该 ( 不是普通文本的 ( 而是公式的 (，通过 \\ 转义一下。这样应该就很好理解这个语法构成了。注意这里方式不唯一，这是笔者喜欢的方式，其他的使用方式自行搜索。下面的介绍同样是这样。
PS: 这里掘金使用的是 $a + b$ : ，如果对您的阅读产生印象，请看最后说明，这里就不做一一更改了。谢谢。
### 另取一行
```
$$a + b$$
```
$$a + b$$

这里是另取一行
在mathjax中 \\ 表示换行的意思

特点就是通过$$包含公式。

笔者认为第二种方式更好，以下没看 JS 源码纯属猜测：行间的需要考虑到当前行的行高并对公式进行处理，而另取一行就更简单一些，可能解析起来更快。最最最最最最主要是看起来漂亮 ^_^ 不太要考虑空间不够换行。
## 基本类型的插入

### 上、下标
先看结果再总结语法吧。
```
$$x_1$$

$$x_1^2$$

$$x^2_1$$

$$x_{22}^{(n)}$$

$${}^*x^*$$

$$x_{balabala}^{bala}$$
```
$$x_1$$

$$x_1^2$$

$$x^2_1$$

$$x_{22}^{(n)}$$

$${}^*x^*$$

$$x_{balabala}^{bala}$$


可以看到 x 元素的上标通过 ^ 符号后接的内容体现，下标通过 _ 符号后接的内容体现，多于一位是要加 {} 包裹的。
笔者习惯先下标后上标的写法，和我的书写习惯一致：x_{balabala}^{bala}，不管你使用哪一种风格，最好自己注意统一，不要混用。
### 分式
```
$$\frac{x+y}{2}$$

$$\frac{1}{1+\frac{1}{2}}$$
```
$$\frac{x+y}{2}$$

$$\frac{1}{1+\frac{1}{2}}$$

这里就出现了一个 frac{}{} 函数的东西，同样，为了区分这是函数不是几个字母，通过 \frac 转义，于是 frac 被解析成函数，然后第一个 {} 里面的被解析成分子，第二个 {} 被解析成分母。这里可以试试分数的行间解析。我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果我要看行间填充效果。
### 根式
```
$$\sqrt{2}<\sqrt[3]{3}$$

$$\sqrt{1+\sqrt[p]{1+a^2}}$$

$$\sqrt{1+\sqrt[^p\!]{1+a^2}}$$
```
$$\sqrt{2}<\sqrt[3]{3}$$

$$\sqrt{1+\sqrt[p]{1+a^2}}$$

$$\sqrt{1+\sqrt[^p\!]{1+a^2}}$$

读到这里你已经了解了函数的概念，那么这历久很简单了，语法就是 sqrt[]{} 。[] 中代表是几次根式，{} 代表根号下的表达式。第二和第三个的区别在于为了美观微调位置 ^_^。
### 求和、积分
```
$$\sum_{k=1}^{n}\frac{1}{k}$$

$\sum_{k=1}^n\frac{1}{k}$

$$\int_a^b f(x)dx$$

$\int_a^b f(x)dx$
```
$$\sum_{k=1}^{n}\frac{1}{k}$$

$\sum_{k=1}^n\frac{1}{k}$

$$\int_a^b f(x)dx$$

$\int_a^b f(x)dx$



这里很容易看出求和函数表达式 sum_{起点}^{终点}表达式，积分函数表达式 int_下限^上限 被积函数d被积量。还有一个有趣的是行间的公式都被压缩了。
### 空格
```
紧贴 $a\!b$
没有空格 $ab$
小空格 a\,b
中等空格 a\;b
大空格 a\ b
quad空格 $a\quad b$
两个quad空格 $a\qquad b$
```
紧贴 $a\!b$
没有空格 $ab$
小空格 a\,b
中等空格 a\;b
大空格 a\ b
quad空格 $a\quad b$
两个quad空格 $a\qquad b$


这个直接看上面的文字，介绍很清楚，主要指微调距离，使得公式更加漂亮。请比较下面的积分公式：
```
$$\int_a^b f(x)\mathrm{d}x$$

$$\int_a^b f(x)\,\mathrm{d}x$$
```
$$\int_a^b f(x)\mathrm{d}x$$

$$\int_a^b f(x)\,\mathrm{d}x$$

### 公式界定符
```
\\( ( \\)
\\( ) \\)
\\( [ \\)
\\( ] \\)
\\( \\{ \\)
\\( \\} \\)
\\( | \\)
\\( \\| \\)
掘金：
$ ( $
$ ) $
$ [ $
$ ] $
$ \{ $
$ \} $
$ | $
$ \| $
```
主要符号有 ( ) [ ] { } | | 那么如何使用呢？ 通过 \left 和 \right 后面跟界定符来对同时进行界定。

$$\left(\sum_{k=\frac{1}{2}}^{N^2}\frac{1}{k}\right)$$
### 矩阵
```
$$\begin{matrix}1 & 2\\\\3 &4\end{matrix}$$

$$\begin{pmatrix}1 & 2\\\\3 &4\end{pmatrix}$$

$$\begin{bmatrix}1 & 2\\\\3 &4\end{bmatrix}$$

$$\begin{bmatrix}1 & 2\\\\3 &4\end{bmatrix}$$

$$\begin{vmatrix}1 & 2\\\\3 &4\end{vmatrix}$$

$$\left|\begin{matrix}1 & 2\\\\3 &4\end{matrix}\right|$$

$$\begin{vmatrix}1 & 2\\\\3 &4\end{vmatrix}$$
```
$$\begin{matrix}1 & 2\\\\3 &4\end{matrix}$$

$$\begin{pmatrix}1 & 2\\\\3 &4\end{pmatrix}$$

$$\begin{bmatrix}1 & 2\\\\3 &4\end{bmatrix}$$

$$\begin{bmatrix}1 & 2\\\\3 &4\end{bmatrix}$$

$$\begin{vmatrix}1 & 2\\\\3 &4\end{vmatrix}$$

$$\left|\begin{matrix}1 & 2\\\\3 &4\end{matrix}\right|$$

$$\begin{vmatrix}1 & 2\\\\3 &4\end{vmatrix}$$
类似于 left right，这里是 begin 和 end。而且里面有具体的矩阵语法，& 区分行间元素，\\\\ 代表换行。可以理解为 HTML 的标签之类的。

### 排版数组
```
$$
\mathbf{X} =
\left( \begin{array}{ccc}
x\_{11} & x\_{12} & \ldots \\\\
x\_{21} & x\_{22} & \ldots \\\\
\vdots & \vdots & \ddots
\end{array} \right)
$$
```
$$
\mathbf{X} =
\left( \begin{array}{ccc}
x\_{11} & x\_{12} & \ldots \\\\
x\_{21} & x\_{22} & \ldots \\\\
\vdots & \vdots & \ddots
\end{array} \right)
$$

## 常用公式举例

### 多行公式
主要是各种方程的表达
#### 长公式
```
$$
\begin{multline}
x = a+b+c+{} \\\\
d+e+f+g
\end{multline}
$$
```
$$
\begin{multline}
x = a+b+c+{} \\\\
d+e+f+g
\end{multline}
$$

```
$$
\begin{aligned}
x ={}& a+b+c+{} \\\\
&d+e+f+g
\end{aligned}
$$
```
$$
\begin{aligned}
x ={}& a+b+c+{} \\\\
&d+e+f+g
\end{aligned}
$$

####  公式组

```
$$
\begin{gather}
a = b+c+d \\\\
x = y+z
\end{gather}
$$
```
其中 一个\\表示一个\n

$$
\begin{gather}
a = b+c+d \\\\
x = y+z
\end{gather}
$$
```
$$
\begin{align}
a &= b+c+d \\\\
x &= y+z
\end{align}
$$
```
其中 & 表示对齐符

$$
\begin{align}
a &= b+c+d \\\\
x &= y+z
\end{align}
$$

$$
\begin{aligned}
a &= b+c+d \\\\
x &= y+z
\end{aligned}
$$
#### 分段函数
```
$$
y=\begin{cases}
-x,\quad x\leq 0 \\\\
x,\quad x>0
\end{cases}
$$
```
$$
y=\begin{cases}
-x,\quad x\leq 0 \\\\
x,\quad x>0
\end{cases}
$$
里面用到了 \(\leq\) 符号，下一章会介绍常用数学符号。
## 数组的其他使用
### 划线
```
$$
\left(\begin{array}{|c|c|}
1 & 2 \\\\
\\hline
3 & 4
\end{array}\right)
$$
```
$$
\left(\begin{array}{|c|c|}
1 & 2 \\\\
\\hline
3 & 4
\end{array}\right)
$$
### 制表
```
$$
\begin{array}{|c|c|}
\hline
{1111111111} & 2 \\\\
\hline
3 & 4 \\\\
\hline
\end{array}
$$
```
$$
\begin{array}{|c|c|}
\hline
{1111111111} & 2 \\\\
\hline
3 & 4 \\\\
\hline
\end{array}
$$
可以看到，其实其他很多东西都可以很灵活的表达出来。碰到其他有趣的我会继续写出来的。

## 常用数学符号
这里提供一个文档下载，如果上面的链接失效，也可以到我的 GitHub 下载 pdf 版。下面举几个例子。
希腊字母
```
$$
\begin{array}{|c|c|c|c|c|c|c|c|}
\hline
{\alpha} & {\backslash alpha} & {\theta} & {\backslash theta} & {o} & {o} & {\upsilon} & {\backslash upsilon} \\\\
\hline
{\beta} & {\backslash beta} & {\vartheta} & {\backslash vartheta} & {\pi} & {\backslash pi} & {\phi} & {\backslash phi} \\\\
\hline
{\gamma} & {\backslash gamma} & {\iota} & {\backslash iota} & {\varpi} & {\backslash varpi} & {\varphi} & {\backslash varphi} \\\\
\hline
{\delta} & {\backslash delta} & {\kappa} & {\backslash kappa} & {\rho} & {\backslash rho} & {\chi} & {\backslash chi} \\\\
\hline
{\epsilon} & {\backslash epsilon} & {\lambda} & {\backslash lambda} & {\varrho} & {\backslash varrho} & {\psi} & {\backslash psi} \\\\
\hline
{\varepsilon} & {\backslash varepsilon} & {\mu} & {\backslash mu} & {\sigma} & {\backslash sigma} & {\omega} & {\backslash omega} \\\\
\hline
{\zeta} & {\backslash zeta} & {\nu} & {\backslash nu} & {\varsigma} & {\backslash varsigma} & {} & {} \\\\
\hline
{\eta} & {\backslash eta} & {\xi} & {\backslash xi} & {\tau} & {\backslash tau} & {} & {} \\\\
\hline
{\Gamma} & {\backslash Gamma} & {\Lambda} & {\backslash Lambda} & {\Sigma} & {\backslash Sigma} & {\Psi} & {\backslash Psi} \\\\
\hline
{\Delta} & {\backslash Delta} & {\Xi} & {\backslash Xi} & {\Upsilon} & {\backslash Upsilon} & {\Omega} & {\backslash Omega} \\\\
\hline
{\Omega} & {\backslash Omega} & {\Pi} & {\backslash Pi} & {\Phi} & {\backslash Phi} & {} & {} \\\\
\hline
\end{array}
$$
```

$$
\begin{array}{|c|c|c|c|c|c|c|c|}
\hline
{\alpha} & {\backslash alpha} & {\theta} & {\backslash theta} & {o} & {o} & {\upsilon} & {\backslash upsilon} \\\\
\hline
{\beta} & {\backslash beta} & {\vartheta} & {\backslash vartheta} & {\pi} & {\backslash pi} & {\phi} & {\backslash phi} \\\\
\hline
{\gamma} & {\backslash gamma} & {\iota} & {\backslash iota} & {\varpi} & {\backslash varpi} & {\varphi} & {\backslash varphi} \\\\
\hline
{\delta} & {\backslash delta} & {\kappa} & {\backslash kappa} & {\rho} & {\backslash rho} & {\chi} & {\backslash chi} \\\\
\hline
{\epsilon} & {\backslash epsilon} & {\lambda} & {\backslash lambda} & {\varrho} & {\backslash varrho} & {\psi} & {\backslash psi} \\\\
\hline
{\varepsilon} & {\backslash varepsilon} & {\mu} & {\backslash mu} & {\sigma} & {\backslash sigma} & {\omega} & {\backslash omega} \\\\
\hline
{\zeta} & {\backslash zeta} & {\nu} & {\backslash nu} & {\varsigma} & {\backslash varsigma} & {} & {} \\\\
\hline
{\eta} & {\backslash eta} & {\xi} & {\backslash xi} & {\tau} & {\backslash tau} & {} & {} \\\\
\hline
{\Gamma} & {\backslash Gamma} & {\Lambda} & {\backslash Lambda} & {\Sigma} & {\backslash Sigma} & {\Psi} & {\backslash Psi} \\\\
\hline
{\Delta} & {\backslash Delta} & {\Xi} & {\backslash Xi} & {\Upsilon} & {\backslash Upsilon} & {\Omega} & {\backslash Omega} \\\\
\hline
{\Omega} & {\backslash Omega} & {\Pi} & {\backslash Pi} & {\Phi} & {\backslash Phi} & {} & {} \\\\
\hline
\end{array}
$$

写太累了😂😂😂。。。其他的详见 [PDF](https://github.com/mk43/BlogResource/blob/master/LaTex/LATEX%E6%95%B0%E5%AD%A6%E7%AC%A6%E5%8F%B7%E8%A1%A8.pdf)。