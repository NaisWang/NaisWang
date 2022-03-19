# VS Code中使用LaTex
LaTeX是个性化的排版软件，在现的科研论文写作中应用非常广泛。在MacOS环境下使用LaTeX可以借助Visual Studio Code，进行较简易的配置后即可获得很好的使用体验。
主要步骤如下所示：
1. 安装MacTex
Mac 可以用 Homebrew 安装
```
brew install --cask mactex-no-gui
```
2. 在VSCode中安装插件： LaTeX Workshop (version 8.7.2), 安装后重启以启用代码。
3. VS Code插件配置：LaTeX Workshop默认使用pdfLaTeX进行编译，在这种配置方法下会报错。所以我们要改为XeLaTeX编译。 <br>
修改配置过程如下：Command+Shift+P打开settings.json。<br>
在中括号内加入：
```
  // LaTeX
// 不在保存的时候自动编译
  "latex-workshop.latex.autoBuild.run": "never",
// 编译工具
  "latex-workshop.latex.tools": [
      {
          "name": "xelatex",
          "command": "xelatex",
          "args": [
              "-synctex=1",
              "-interaction=nonstopmode",
              "-file-line-error",
              "-pdf",
              "%DOCFILE%"
          ]
      },
      {
          "name": "pdflatex",
          "command": "pdflatex",
          "args": [
              "-synctex=1",
              "-interaction=nonstopmode",
              "-file-line-error",
              "%DOCFILE%"
          ]
      },
      {
          "name": "bibtex",
          "command": "bibtex",
          "args": [
              "%DOCFILE%"
          ]
      }
  ],
// 编译命令
  "latex-workshop.latex.recipes": [
      {
          "name": "xelatex",
          "tools": [
              "xelatex"
          ],
      },
      {
          "name": "xelatex*2",
          "tools": [
              "xelatex",
              "xelatex"
          ],
      },
      {
          "name": "pdflatex",
          "tools": [
              "pdflatex"
          ]
      },
      {
          "name": "xe->bib->xe->xe",
          "tools": [
              "xelatex",
              "bibtex",
              "xelatex",
              "xelatex"
          ]
      },
      {
          "name": "pdf->bib->pdf->pdf",
          "tools": [
              "pdflatex",
              "bibtex",
              "pdflatex",
              "pdflatex"
          ]
      }
  ],
latex-workshop.latex.tools 下面的是编译工具，latex-workshop.latex.recipes 下面的是编译命令，可以根据需要自行修改，其中第一个 recipes 是 默认的编译命令。
```json
   ｛
 "latex-workshop.latex.recipes": [
      {
        "name": "xelatex",
        "tools": [
          "xelatex"
        ]
      },
      {
        "name": "xe*2",
        "tools": [
          "xelatex",
          "xelatex"
        ]
      },
      {
        "name": "xelatex -> bibtex -> xelatex*2",
        "tools": [
          "xelatex",
          "bibtex",
          "xelatex",
          "xelatex"
        ]
      }
    ],
    "latex-workshop.latex.tools": [
      {
        "name": "latexmk",
        "command": "latexmk",
        "args": [
          "-synctex=1",
          "-interaction=nonstopmode",
          "-file-line-error",
          "-pdf",
          "%DOC%"
        ]
      },
      {
        "name": "xelatex",
        "command": "xelatex",
        "args": [
          "-synctex=1",
          "-interaction=nonstopmode",
          "-file-line-error",
          "%DOC%"
        ]
      },
      {
        "name": "bibtex",
        "command": "bibtex",
        "args": [
          "%DOCFILE%"
        ]
      }
    ],
    "latex-workshop.view.pdf.viewer": "tab"
｝
```
然后就可以进行编译了：
![](https://gitee.com/NaisWang/images/raw/master/img/20211124110955.png)

# 使用 BibTeX 生成参考文献列表
LaTeX 是一些理工专业论文排版的事实标准。既然是论文排版，就不可避免会涉及到参考文献的处理。Oren Patashnik 和 Leslie Lamport 在 1985 年开发的 BibTeX 是在 LaTeX 社区相当流行的参考文献格式化工具。

其实网络上流传的 BibTeX 教程很多，本不用我再来插一句嘴。不过这么多年来，始终有很多朋友会对几个问题反复提问。这让我感到，现有的教程恐怕是不够的。这篇文章尝试将 BibTeX 的基本用法讲解清楚，同时适当地提及一些处理流程，争取在有限的篇幅里，讲清楚 BibTeX 的来龙去脉。

## bst 和 bib 格式简介
BibTeX 涉及到两种特有的辅助的文件格式：`bst` 和 `bib`。

- bst 是 (B)ibliography (ST)yle 的缩写。顾名思义，和 sty 文件是 style 的缩写一样，bst 文件控制着参考文献列表的格式。在这里说的「格式」，主要指参考文献列表中的编号、排序规则、对人名的处理（是否缩写）、月份的处理（是否缩写）、期刊名称的缩写等。
- bib 是 BibTeX 定义的「参考文献数据库」。通常，我们会按照 BibTeX 规定的格式，向 bib 文件写入多条文献信息。在实际使用时，我们就可以根据 bib 文件中定义的文献标记（label），从数据库中调取文献信息，继而排版成参考文献列表。

值得注意的是，bib 是一个数据库，其中的内容并不一定等于 LaTeX 排版参考文献列表时的内容。也就是说，如果 bib 数据库中有 10 条文献信息，并不一定说 LaTeX 排版出来的 PDF 文件中，参考文献列表里也一定有 10 条。实际排版出来的参考文献列表中有多少条文献，实际是哪几条，具体由文中使用的 \cite 命令（以及 \nocite 命令）指定。如果没有使用 \cite 命令调取文献信息，那么即使在 bib 文件中定义了文献信息，也不会展现在参考文献列表中。很多人对此误解甚深，于是经常有人问道「为什么我在 bib 文件里写的文献，不出现在参考文献中」之类的问题。

## BibTeX 的工作流程
介绍中提到，BibTeX 是一个参考文献格式化工具。这个定义，给 BibTeX 的用处做了良好的界定：BibTeX 不是用来排版参考文献的，更不是个排版工具，它只是根据需要，按照（bst 文件规定的）某种格式，将（bib 文件中包含的）参考文献信息，格式化 为 LaTeX 能够使用的列表信息。

清楚了 BibTeX 需要做的事情（用软件工程的话说，就是清楚了 BibTeX 的 API），我们就可以理清 BibTeX 的工作流程。

### 知道需要哪些参考文献信息
既然 BibTeX 会根据需要 格式化数据，那么首先要解决的问题就是：BibTeX 如何了解此处的「需求」。

对 BibTeX 稍有了解的读者可能知道，运行 BibTeX 的命令行命令是：
```bash
bibtex foo.aux # 其中后缀名 .aux 可以省略
```
实际上，BibTeX 正是通过读取 aux 文件中的 \citation{} 标记，来确定用户需要哪些参考文献的。

举个例子，假设用户用 LaTeX 编译了以下代码：
```latex
\documentclass{article}
\begin{document}
bar\cite{baz}
\end{document}
```
如果该文件名为 foo.tex，那么就会生成 foo.aux。其内容大约是：
```latex
\relax
\citation{baz}
```
在这里，\relax 表示休息一会儿，什么也不做；\citation 则是由 tex 文件中的 \cite 命令写入 aux 文件的标记。它说明了：用户需要标记为 baz 的参考文献信息。

当 BibTeX 读入 aux 文件的时候，它就会记录下所有 \citation 命令中的内容（即文献标记——label），这样就知道了用户需要哪些参考文献信息。

### 了解文献列表格式以及读取文献数据库
当 BibTeX 清楚了用户需要哪些文献信息，接下来自然应该搞清楚用户想要什么样的格式。而知道了格式之后，就可以从数据库中抽取所需的文献信息，按照格式准备数据。

为了讲清楚这个步骤，我们对上述 LaTeX 代码做些许的修改。
```latex
\documentclass{article}
\begin{document}
\bibliographystyle{unsrt}
bar\cite{baz}
\bibliography{foobar}
\end{document}
```
同样，我们将它保存为 foo.tex，经由 LaTeX 编译之后得到一个 foo.aux 文件，其内容如下：
```latex
\relax
\bibstyle{unsrt}
\citation{baz}
\bibdata{foobar}
```
简单的对比，不难发现：
- foo.tex 中新增的`\bibliographystyle{unsrt}`与`aux`文件中的`\bibstyle{unsrt}`相对应。
- foo.tex 中新增的`\bibliography{foobar}`与`aux`文件中的`\bibdata{foobar}`相对应。

根据命令的名字，我们很容易猜测各个命令的作用。tex 文件中的 \bibliographystyle 指定了用户期待的参考文献列表格式文件，并将其写入 aux 文件备用，通过 \bibstyle 标记。与此同时，\bibliography 命令则用 \bibdata 在 aux 文件中记录了参考文献数据库的名字（不含扩展名）。

在这里，unsrt 是 unsort 的缩写，它对应着 unsrt.bst 文件，是大多数 TeX 发行版自带的标准格式文件之一；foobar 则对应着 foobar.bib 文件，该文件是用户自己编写或生成的参考文献数据库。

### 实际操作看看
我们假设上述 foobar.bib 文件有如下内容：
```bibtex
@BOOK{
    baz,
    title = {Dummy Book},
    publisher = {Egypt},
    year = {321},
    author = {The King}
}
```
我们在命令行执行以下操作：
```bash
latex foo.tex   # .tex 可以省略
bibtex foo.aux  # .aux 可以省略
```
我们会发现，BibTeX 生成了两个文件：foo.bbl 和 foo.blg。其中 foo.bbl 的内容如下：
```bbl
\begin{thebibliography}{1}

\bibitem{baz}
The King.
\newblock {\em Dummy Book}.
\newblock Egypt, 321.

\end{thebibliography}
```
显然，这就是一个标准的 LaTeX 环境。对 LaTeX 参考文献排版稍有了解的读者可能知道 thebibliography 环境正是 LaTeX 中手工编排参考文献时使用的环境。因此，foo.bbl 就是 BibTeX 格式化输出的结果，LaTeX 只需要将该文件的内容读入，就能在相应的位置输出格式化之后的参考文献列表了。

接下来，我们看看 foo.blg 的内容。blg 实际是 BibTeX Log 的缩写，亦即这是一个日志文件。
```
This is BibTeX, Version 0.99d (TeX Live 2015)
Capacity: max_strings=35307, hash_size=35307, hash_prime=30011
The top-level auxiliary file: foo.aux
The style file: unsrt.bst
Database file #1: foobar.bib
You've used 1 entry,
...
```
我们看到，BibTeX 打出的日志文件中，记录了读入 aux/bst/bib 文件的情况。特别地，记录了所需的参考文献条目（entry）的数量（此处为 1）。

日志中值得注意的地方是在提到 bib 文件时，使用了 #1 的标记。既然存在 #1，那么合理推测也可以存在 #2。也就是说，BibTeX 可能支持两个或更多的 bib 数据库共同工作。具体如何实现，请读者自己阅读相关资料（手册或 Google 检索）后实验。

紧接着，我们再执行一次 LaTeX：
```bash
latex foo.tex
```
首先，来看看 aux 文件会发生什么变化：
```latex
\relax
\bibstyle{unsrt}
\citation{baz}
\bibdata{foobar}
\bibcite{baz}{1}
```
相比上一次的 foo.aux，在读入 BibTeX 之后，LaTeX 向 aux 文件写入了更多的信息。这里 \bibcite{baz}{1} 将 baz 这一参考文献标记（label）与参考文献编号（数字 1）绑定起来了。

接下来，我们看看 dvi 文件的内容：
![](https://gitee.com/NaisWang/images/raw/master/img/20211129103709.png)

不难发现，由于读入了 foo.bbl 文件，参考文献列表已经正确展现出来了。然而，正文中依然有一个问号。

实际上，LaTeX 需要 aux 文件中的 \bibcite 命令，将参考文献标记与参考文献编号关联起来，从而在 tex 文件中的 \cite 命令位置填上正确的参考文献编号。我们注意到，在我们第二次执行 LaTeX 命令编译之前，foo.aux 文件中是没有这些信息的，直到编译完成，这些信息才被正确写入。因此，第二次执行 LaTeX 命令时，LaTeX 还不能填入正确的文献编号，于是就写入了一个问号作为占位符。

解决这个问题的办法也很简单——此时 aux 文件中已经有了需要的信息，再编译一遍就好了。
```bash
latex foo.tex
```
如果没有意外，此时的`foo.dvi`文件应该看起来一切正常了。

### 小结
- BibTeX 是一个参考文献格式化工具，它会根据需要，按照（bst 文件规定的）某种格式，将（bib 文件中包含的）参考文献信息，格式化 为 LaTeX 能够使用的列表信息。
- 正确使用 BibTeX 处理参考文献，需要先用 (Xe/PDF)LaTeX 编译 tex 文件，生成 aux 辅助文件。
- 执行 BibTeX 将读入 aux 文件，搞清楚用户需要哪些文献。
- 紧接着，BibTeX 根据 aux 文件中的内容，找到正确的 bst 和 bib 文件，并将参考文献信息格式化为 LaTeX 的 thebibliography 环境，作为 bbl 文件输出。
- 第二次执行 (Xe/PDF)LaTeX 将会读入新生成的 bbl 文件，同时更新 aux 文件。
- 此时，参考文献列表将会正常展示，但是正文中的引用标记显示为问号。
- 第三次执行 (Xe/PDF)LaTeX 将会读入 bbl 文件和更新过后的 aux 文件。此时，参考文献相关内容都正常显示。

因此，总的来说，想要正确使用 BibTeX 协同 LaTeX 处理参考文献，需要编译四次：
```bash
(xe/pdf)latex foo.tex   # 表示使用 latex, pdflatex 或 xelatex 编译，下同
bibtex foo.aux
(xe/pdf)latex foo.tex
(xe/pdf)latex foo.tex
```

# LaTeX 相关工具网站
## 查询符号代码
http://detexify.kirelabs.org/classify.html 允许你用鼠标绘制符号的样子，然后为你查询对应的代码和所需的宏包。

## 手写公式识别为 LaTeX 公式代码
 http://webdemo.visionobjects.com/home.html 有多个功能，其中之一就是能将手写的公式识别为 LaTeX 代码。测试表明识别公式效率一般，准确度尚可，对于复杂矩阵几乎无力识别。

## 在线 LaTeX 编译
math.sinica 是台湾中央研究院的支持中文的在线编译，支持中文。

## 输入 LaTeX 产生数学公式图片
http://www.codecogs.com/latex/eqneditor.php 以及 http://www.sciweavers.org/free-online-latex-equation-editor

# TeX 家族
带有 TeX 的词，仅仅是本文就已经提到了 TeX, LaTeX, XeLaTeX。通常中国学生面对不了解意思的一群形近单词，都会有一种「本能的恐惧」（笑~）。因此，「大神们」在为新手介绍 TeX 的时候，如果互相争论 「XXTeX 比 YYTeX 好」或者是「XXTeX 的 YYTeX 如何如何」，往往会蹦出下面这些带有 TeX 的词汇：
TeX, pdfTeX, XeTeX, LuaTeX, LaTeX, pdfLaTeX, XeLaTeX …

事实上，这部分的内容太过复杂，我自己的了解也实在有限。所以下面这部分的内容也只能是对我了解到的知识的一个概括，甚至可能有些许谬误。所以大家只需要将这部分的内容当做是一个参考就可以了。

## TeX - LaTeX
TeX 是高德纳（Donald Ervin Knuth，1938年1月10日 --）教授愤世嫉俗追求完美做出来的排版引擎，同时也是该引擎使用的标记语言（Markup Language）的名称。这里所谓的引擎，是指能够实现断行、分页等操作的程序（请注意这并不是定义）；这里的标记语言，是指一种将控制命令和文本结合起来的格式，它的主体是其中的文本而控制命令则实现一些特殊效果（同样请注意这并不是定义）。

> 你可以在这里找到关于 TeX 引擎的具体描述；
> 你可以在这里找到关于标记语言的具体描述。

而 LaTeX 则是 L. Lamport （1941年2月7日 -- ） 教授开发的基于 TeX 的排版系统。实际上 LaTeX 利用 TeX 的控制命令，定义了许多新的控制命令并封装成一个可执行文件。这个可执行文件会去解释 LaTeX 新定义的命令成为 TeX 的控制命令，并最终交由 TeX 引擎进行排版。

> 实际上，LaTeX 是基于一个叫做 plain TeX 的格式的。plain TeX 是高德纳教授为了方便用户，自己基于原始的 TeX 定义的格式，但实际上 plain TeX 的命令仍然十分晦涩。至于原始的 TeX 直接使用的人就更少了，因此 plain TeX 格式逐渐就成为了 TeX 格式的同义词，尽管他们事实上是不同的。

因此在 TeX - LaTeX 组合中，
1. 最终进行断行、分页等操作的，是 TeX 引擎；
2. LaTeX 实际上是一个工具，它将用户按照它的格式编写的文档解释成 TeX 引擎能理解的形式并交付给 TeX 引擎处理，再将最终结果返回给用户。

## pdfTeX - pdfLaTeX
TeX 系统生成的文件是 dvi 格式，虽然可以用其他程序将其转换为例如 pdf 等更为常见的格式，但是毕竟不方便。

> dvi 格式是为了排版而产生的，它本身并不支持所谓的「交叉引用」，pdfTeX 直接输出 pdf 格式的文档，这也是 pdfTeX 相对 TeX 进步（易用性方面）的地方。

为了解决这个问题，Hàn Thế Thành 博士在他的博士论文中提出了 pdfTeX 这个对 TeX 引擎的扩展。二者最主要的差别就是 pdfTeX 直接输出 pdf 格式文档，而 TeX 引擎则输出 dvi 格式的文档。

pdfLaTeX 这个程序的主要工作依旧是将 LaTeX 格式的文档进行解释，不过此次是将解释之后的结果交付给 pdfTeX 引擎处理。

## XeTeX - XeLaTeX
高德纳教授在实现 TeX 的当初并没有考虑到中日韩等字符的处理，而只支持 ASCII 字符。这并不是说中日韩字符就无法使用 TeX 引擎排版了，事实上 TeX 将每个字符用一个框包括起来（这被称为盒子）然后将一个个的盒子按照一定规则排列起来，因而 TeX 的算法理论上适用于任何字符。ASCII 字符简单理解，就是在半角模式下你的键盘能直接输出的字符。

在 XeTeX 出现之前，为了能让 TeX 系统排版中文，国人曾使用了 天元、CCT、CJK 等手段处理中文。其中 天元和CCT 现在已经基本不用，CJK 因为使用时间长且效果相对较好，现在还有人使用。

不同于 CJK 等方式使用 TeX 和 pdfTeX 这两个不直接支持 Unicode 字符的引擎，XeTeX 引擎直接支持 Unicode 字符。也就是说现在不使用 CJK 也能排版中日韩文的文档了，并且这种方式要比之前的方式更加优秀。

XeLaTeX 和 XeTeX 的关系与 pdfLaTeX 和 pdfTeX 的关系类似，这里不再赘述。

使用 XeTeX 引擎需要使用 UTF-8 编码。

## LuaTeX
LuaTeX 是正在开发完善的一个 TeX 引擎，相对它的前辈们还相当的不完善，这里不赘述。

## CTeX - MiKTeX - TeX Live
之前介绍了 TeX, LaTeX, pdfTeX, pdfLaTeX, XeTeX, XeLaTeX, LuaTeX 等，他们都是 TeX 家族的一部分。但是作为一个能够使用的 TeX 系统，仅仅有他们还是不够的。CTeX, MiKTeX, TeX Live 都是被称为「发行」的软件合集。他们包括了上述各种引擎的可执行程序，以及一些文档类、模板、字体文件、辅助程序等等。其中 CTeX 是建立在 MiKTeX 的基础之上的。

## 总结
TeX - pdfTeX - XeTeX - LuaTeX 都是排版引擎，按照先进程度递增（LuaTeX 尚未完善）。

LaTeX 是一种格式，基于 TeX 格式定义了很多更方便使用的控制命令。上述四个引擎都有对应的程序将 LaTeX 格式解释成引擎能处理的内容。

CTeX, MiKTeX, TeX Live 都是 TeX 的发行，他们是许许多多东西的集合。

# 组织你的文章
## 作者、标题、日期
保存并用 XeLaTeX 编译如下文档，查看效果：
```latex
\documentclass[UTF8]{ctexart}
\title{你好，world!}
\author{Liam}
\date{\today}
\begin{document}
\maketitle
你好，world!
\end{document}
```
在 document 环境中，除了原本的你好，world!，还多了一个控制序列`maketitle`。这个控制序列能将在导言区中定义的标题、作者、日期按照预定的格式展现出来。

## 章节和段落
保存并用 XeLaTeX 编译如下文档，查看效果：
```latex
\documentclass[UTF8]{ctexart}
\title{你好，world!}
\author{Liam}
\date{\today}
\begin{document}
\maketitle
\section{你好中国}
中国在East Asia.
\subsection{Hello Beijing}
北京是capital of China.
\subsubsection{Hello Dongcheng District}
\paragraph{Tian'anmen Square}
is in the center of Beijing
\subparagraph{Chairman Mao}
is in the center of 天安门广场。
\subsection{Hello 山东}
\paragraph{山东大学} is one of the best university in 山东。
\end{document}
```
在文档类 article/ctexart 中，定义了五个控制序列来调整行文组织结构。他们分别是
- \section{·}
- \subsection{·}
- \subsubsection{·}
- \paragraph{·}
- \subparagraph{·}

在report/ctexrep中，还有\chapter{·}；在文档类book/ctexbook中，还定义了\part{·}。

## 插入目录
在上一节的文档中，找到 \maketitle，在它的下面插入控制序列 \tableofcontents，保存并用 XeLaTeX 编译两次，观察效果：
```latex
\documentclass[UTF8]{ctexart}
\title{你好，world!}
\author{Liam}
\date{\today}
\begin{document}
\maketitle
\tableofcontents
\section{你好中国}
中国在East Asia.
\subsection{Hello Beijing}
北京是capital of China.
\subsubsection{Hello Dongcheng District}
\paragraph{Tian'anmen Square}
is in the center of Beijing
\subparagraph{Chairman Mao}
is in the center of 天安门广场。
\subsection{Hello 山东}
\paragraph{山东大学} is one of the best university in 山东。
\end{document}
```

# 插入数学公式
为了使用 AMS-LaTeX 提供的数学功能，我们需要在导言区加载 amsmath 宏包：
```latex
\usepackage{amsmath}
```
## 数学模式
LaTeX 的数学模式有两种：行内模式 (inline) 和行间模式 (display)。前者在正文的行文中，插入数学公式；后者独立排列单独成行，并自动居中。
在行文中，使用 $ ... $ 可以插入行内公式，使用 \[ ... \] 可以插入行间公式，如果需要对行间公式进行编号，则可以使用 equation 环境：
```latex
\begin{equation}
...
\end{equation}
```
行内公式也可以使用`\(...\)`或者 \begin{math} ... \end{math} 来插入，但略显麻烦。
无编号的行间公式也可以使用 \begin{displaymath} ... \end{displaymath} 或者 \begin{equation*} ... \end{equation*} 来插入，但略显麻烦。（equation* 中的 * 表示环境不编号）
也有 plainTeX 风格的 $$ ... $$ 来插入不编号的行间公式。但是在 LaTeX 中这样做会改变行文的默认行间距，不推荐。请参考[我的回答](https://www.zhihu.com/question/27589739/answer/37237684)。

## 上下标
示例代码（请保存后，使用 XeLaTeX 编译，查看效果）：
```latex
\documentclass{article}
\usepackage{amsmath}
\begin{document}
Einstein 's $E=mc^2$.

\[ E=mc^2. \]

\begin{equation}
E=mc^2.
\end{equation}
\end{document}
```
在这里提一下关于公式标点使用的规范。行内公式和行间公式对标点的要求是不同的：行内公式的标点，应该放在数学模式的限定符之外，而行间公式则应该放在数学模式限定符之内。

在数学模式中，需要表示上标，可以使用 ^ 来实现（下标则是 _）。它默认只作用于之后的一个字符，如果想对连续的几个字符起作用，请将这些字符用花括号 {} 括起来，例如：
```latex
\[ z = r\cdot e^{2\pi i}. \]
```

## 根式与分式
根式用 \sqrt{·} 来表示，分式用 \frac{·}{·} 来表示（第一个参数为分子，第二个为分母）。
示例代码（请保存后，使用 XeLaTeX 编译，查看效果）：
```latex
\documentclass{article}
\usepackage{amsmath}
\begin{document}
$\sqrt{x}$, $\frac{1}{2}$.

\[ \sqrt{x}, \]

\[ \frac{1}{2}. \]
\end{document}
```
可以发现，在行间公式和行内公式中，分式的输出效果是有差异的。如果要强制行内模式的分式显示为行间模式的大小，可以使用 \dfrac, 反之可以使用 \tfrac。

## 运算符
一些小的运算符，可以在数学模式下直接输入；另一些需要用控制序列生成，如
```latex
\[ \pm\; \times \; \div\; \cdot\; \cap\; \cup\;
\geq\; \leq\; \neq\; \approx \; \equiv \]
```
连加、连乘、极限、积分等大型运算符分别用 \sum, \prod, \lim, \int 生成。他们的上下标在行内公式中被压缩，以适应行高。我们可以用 \limits 和 \nolimits 来强制显式地指定是否压缩这些上下标。例如：
```latex
$ \sum_{i=1}^n i\quad \prod_{i=1}^n $
$ \sum\limits _{i=1}^n i\quad \prod\limits _{i=1}^n $
\[ \lim_{x\to0}x^2 \quad \int_a^b x^2 dx \]
\[ \lim\nolimits _{x\to0}x^2\quad \int\nolimits_a^b x^2 dx \]
```
多重积分可以使用 \iint, \iiint, \iiiint, \idotsint 等命令输入。
```latex
\[ \iint\quad \iiint\quad \iiiint\quad \idotsint \]
```

## 定界符（括号等）
各种括号用 (), [],`\{\}`, \langle\rangle 等命令表示；注意花括号通常用来输入命令和环境的参数，所以在数学公式中它们前面要加 \。因为 LaTeX 中 | 和 \| 的应用过于随意，amsmath 宏包推荐用 \lvert\rvert 和 \lVert\rVert 取而代之。

为了调整这些定界符的大小，amsmath 宏包推荐使用 \big, \Big, \bigg, \Bigg 等一系列命令放在上述括号前面调整大小。

有时你可能会觉得 amsmath 宏包提供的定界符放大命令不太够用。通常这意味着你的公式太过复杂。此时你应当首先考虑将公式中的部分提出去，以字母符号代替以简化公式。如果你真的想要排版如此复杂的公式，你可以参考我这篇博文。
```latex
\[ \Biggl(\biggl(\Bigl(\bigl((x)\bigr)\Bigr)\biggr)\Biggr) \]
\[ \Biggl[\biggl[\Bigl[\bigl[[x]\bigr]\Bigr]\biggr]\Biggr] \]
\[ \Biggl \{\biggl \{\Bigl \{\bigl \{\{x\}\bigr \}\Bigr \}\biggr \}\Biggr\} \]
\[ \Biggl\langle\biggl\langle\Bigl\langle\bigl\langle\langle x
\rangle\bigr\rangle\Bigr\rangle\biggr\rangle\Biggr\rangle \]
\[ \Biggl\lvert\biggl\lvert\Bigl\lvert\bigl\lvert\lvert x
\rvert\bigr\rvert\Bigr\rvert\biggr\rvert\Biggr\rvert \]
\[ \Biggl\lVert\biggl\lVert\Bigl\lVert\bigl\lVert\lVert x
\rVert\bigr\rVert\Bigr\rVert\biggr\rVert\Biggr\rVert \]
```
![](https://gitee.com/NaisWang/images/raw/master/img/20211129110538.png)

## 省略号
省略号用 \dots, \cdots, \vdots, \ddots 等命令表示。\dots 和 \cdots 的纵向位置不同，前者一般用于有下标的序列。
```latex
\[ x_1,x_2,\dots ,x_n\quad 1,2,\cdots ,n\quad
\vdots\quad \ddots \]
```

## 矩阵
amsmath 的 pmatrix, bmatrix, Bmatrix, vmatrix, Vmatrix 等环境可以在矩阵两边加上各种分隔符。
```latex
\[ \begin{pmatrix} a&b\\c&d \end{pmatrix} \quad
\begin{bmatrix} a&b\\c&d \end{bmatrix} \quad
\begin{Bmatrix} a&b\\c&d \end{Bmatrix} \quad
\begin{vmatrix} a&b\\c&d \end{vmatrix} \quad
\begin{Vmatrix} a&b\\c&d \end{Vmatrix} \]
```
效果图：
![](https://gitee.com/NaisWang/images/raw/master/img/20211129110615.png)

使用 smallmatrix 环境，可以生成行内公式的小矩阵。
```latex
Marry has a little matrix $ ( \begin{smallmatrix} a&b\\c&d \end{smallmatrix} ) $.
```
效果图：
![](https://gitee.com/NaisWang/images/raw/master/img/20211129110636.png)

## 多行公式
有的公式特别长，我们需要手动为他们换行；有几个公式是一组，我们需要将他们放在一起；还有些类似分段函数，我们需要给它加上一个左边的花括号。

### 长公式
#### 不对齐
无须对齐的长公式可以使用 multline 环境。
```latex
\begin{multline}
x = a+b+c+{} \\
d+e+f+g
\end{multline}
```
效果：
![](https://gitee.com/NaisWang/images/raw/master/img/20211129110716.png)

如果不需要编号，可以使用 multline* 环境代替。

#### 对齐
需要对齐的公式，可以使用 aligned 次环境来实现，它必须包含在数学环境之内。
```latex
\[\begin{aligned}
x ={}& a+b+c+{} \\
&d+e+f+g
\end{aligned}\]
```
效果图：
![](https://gitee.com/NaisWang/images/raw/master/img/20211129110742.png)

### 公式组
无需对齐的公式组可以使用 gather 环境，需要对齐的公式组可以使用 align 环境。他们都带有编号，如果不需要编号可以使用带星花的版本。
```latex
\begin{gather}
a = b+c+d \\
x = y+z
\end{gather}
\begin{align}
a &= b+c+d \\
x &= y+z
\end{align}
```
效果：
![](https://gitee.com/NaisWang/images/raw/master/img/20211129110812.png)

请注意，不要使用 eqnarray 环境。

### 分段函数
分段函数可以用cases次环境来实现，它必须包含在数学环境之内。
```latex
\[ y= \begin{cases}
-x,\quad x\leq 0 \\
x,\quad x>0
\end{cases} \]
```
效果图：
![](https://gitee.com/NaisWang/images/raw/master/img/20211129110903.png)

# 插入图片和表格
## 图片
关于 LaTeX 插图，首先要说的是：「LaTeX 只支持 .eps 格式的图档」这个说法是错误的。

在 LaTeX 中插入图片，有很多种方式。最好用的应当属利用 graphicx 宏包提供的 \includegraphics 命令。比如你在你的 TeX 源文件同目录下，有名为 a.jpg 的图片，你可以用这样的方式将它插入到输出文档中：
```latex
\documentclass{article}
\usepackage{graphicx}
\begin{document}
\includegraphics{a.jpg}
\end{document}
```
图片可能很大，超过了输出文件的纸张大小，或者干脆就是你自己觉得输出的效果不爽。这时候你可以用 \includegraphics 控制序列的可选参数来控制。比如
```latax
\includegraphics[width = .8\textwidth]{a.jpg}
```
这样图片的宽度会被缩放至页面宽度的百分之八十，图片的总高度会按比例缩放。

## 表格
tabular 环境提供了最简单的表格功能。它用 \hline 命令表示横线，在列格式中用 | 表示竖线；用 & 来分列，用 `\\`来换行；每列可以采用居左、居中、居右等横向对齐方式，分别用 l、c、r 来表示。
```latex
\begin{tabular}{|l|c|r|}
 \hline
操作系统& 发行版& 编辑器\\
 \hline
Windows & MikTeX & TexMakerX \\
 \hline
Unix/Linux & teTeX & Kile \\
 \hline
Mac OS & MacTeX & TeXShop \\
 \hline
通用& TeX Live & TeXworks \\
 \hline
\end{tabular}
```
效果：
![](https://gitee.com/NaisWang/images/raw/master/img/20211129111102.png)

## 浮动体
插图和表格通常需要占据大块空间，所以在文字处理软件中我们经常需要调整他们的位置。figure 和 table 环境可以自动完成这样的任务；这种自动调整位置的环境称作浮动体(float)。我们以 figure 为例。
```latex
\begin{figure}[htbp]
\centering
\includegraphics{a.jpg}
\caption{有图有真相}
\label{fig:myphoto}
\end{figure}
```

htbp 选项用来指定插图的理想位置，这几个字母分别代表 here, top, bottom, float page，也就是就这里、页顶、页尾、浮动页（专门放浮动体的单独页面或分栏）。\centering 用来使插图居中；\caption 命令设置插图标题，LaTeX 会自动给浮动体的标题加上编号。注意 \label 应该放在标题命令之后。

# 版面设置
## 页边距
设置页边距，推荐使用 geometry 宏包。可以在这里查看它的说明文档。
比如我希望，将纸张的长度设置为 20cm、宽度设置为 15cm、左边距 1cm、右边距 2cm、上边距 3cm、下边距 4cm，可以在导言区加上这样几行：
```latex
\usepackage{geometry}
\geometry{papersize={20cm,15cm}}
\geometry{left=1cm,right=2cm,top=3cm,bottom=4cm}
```

## 页眉页脚
设置页眉页脚，推荐使用 fancyhdr 宏包。可以在这里查看它的说明文档。
比如我希望，在页眉左边写上我的名字，中间写上今天的日期，右边写上我的电话；页脚的正中写上页码；页眉和正文之间有一道宽为 0.4pt 的横线分割，可以在导言区加上如下几行：
```latex
\usepackage{fancyhdr}
\pagestyle{fancy}
\lhead{\author}
\chead{\date}
\rhead{152xxxxxxxx}
\lfoot{}
\cfoot{\thepage}
\rfoot{}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\headwidth}{\textwidth}
\renewcommand{\footrulewidth}{0pt}
```

## 首行缩进
CTeX 宏集已经处理好了首行缩进的问题（自然段前空两格汉字宽度）。因此，使用 CTeX 宏集进行中西文混合排版时，我们不需要关注首行缩进的问题。

> 如果你因为某些原因选择不适用 CTeX 宏集（不推荐）进行中文支持和版式设置，则你需要做额外的一些工作。
- 调用 indentfirst 宏包。具体来说，中文习惯于每个自然段的段首都空出两个中文汉字的长度作为首行缩进，但西文行文习惯于不在逻辑节（\section 等）之后缩进。使用改宏包可使 LaTeX 在每个自然段都首行缩进。
- 设置首行缩进长度 \setlength{\parindent}{2\ccwd}。其中 \ccwd 是 xeCJK 定义的宏，它表示当前字号中一个中文汉字的宽度。

## 行间距
我们可以通过 setspace 宏包提供的命令来调整行间距。比如在导言区添加如下内容，可以将行距设置为字号的 1.5 倍：
```latex
\usepackage{setspace}
\onehalfspacing
```

## 段间距
我们可以通过修改长度 \parskip 的值来调整段间距。例如在导言区添加以下内容
```latex
\addtolength{\parskip}{.4em}
```
则可以在原有的基础上，增加段间距 0.4em。如果需要减小段间距，只需将该数值改为负值即可。


