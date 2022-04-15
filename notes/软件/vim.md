# vim命令的组成
vim中命令是由`重复次数 + 命令 + 范围`组成的。

# 文本对象
vim中的文本对象可以分为3大类：paragraphs、sentences、words

## paragraphs
每一段以空行分隔

## sentences
以`[.|？|!][<Space>|<Enter>|<Tab>]`结尾，算一句

## words
在vim中words分为2种，分别是`小词`、`大词`：
- `小词`: 小词分为如下三种
    - 第一种小词：连在一起的字符 只有`字母`、`_` 的词，例如`aaa`、`aaa_aaa`都是一个小词
    - 第二种小词：连在一起的字符 只有`汉字`的词，例如`发发发`、`番窠倒臼番窠倒臼`都是一个小词
    - 第三种小词：连在一起的字符 不包含`字母`、`_`、`汉字`与`空格` 的词， 例如`[]`、`{}`都是一个小词
    - 实战：`{ab_dd}`可以拆分为3个小词，分别是`{`、`ab_dd`、`}`； `{ab&dc}`可以拆分为5个小词，分别是`{`、`ab`、`&`、`dc`、`}`；`{ab否&dd}`可以拆分为6个小词，分别是`{`、`ab`、`否`、`&`、`dd`、`}`
- `大词`：连在一起字符 不包含`空格` 的词， 例如`fkdjfk_d&**方法*^^**`是一个大词

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409131430.png)


# 在vim中直接执行linux命令
:!cmd
不退出vim 执行命令 cmd

:r !cmd
不退出vim执行命令cmd,并将cmd的输出内容插入当前文本中。

:shell
切换到shell里（此时并没有退出vim，可以理解成vim转入后台），你可以在shell中做任何操作，退出shell（比如用exit）后，会切换回原来的vim中

# 信息查看
":messages" 命令可以查看以前给出的消息

# 命令总结
| 单字母 | 是否作为某命令的前缀 | 类型 | 作用| 在可视块模式中 | 执行完后是否进入插入模式 |  
|--|--|--|--|--|--|
|w|否|移动|将光标移动到当前光标后的第二个小词的开头处|一样|否|
|W|否|移动|将光标移动到当前光标后的第二个大词的开头处|一样|否|
|e|否|移动|将光标移动到当前光标后的第一个小词的末尾处|一样|否|
|E|否|移动|将光标移动到当前光标后的第一个大词的末尾处|一样|否|
|b|否|移动|将光标移动到当前光标前的第一个小词的开头处|一样|否|
|B|否|移动|将光标移动到当前光标前的第一个大词的开头处|一样|否|
|ge|否|移动|将光标移动到当前光标前的第二个小词的末尾处|一样|否|
|gE|否|移动|将光标移动到当前光标前的第二个大词的末尾处|一样|否|
|$|否|移动|将光标移动到当前行的最后一个字符（包括空格）|一样|否|
|0|否|移动|将光标移动到当前行的第一个字符（包括空格）|一样|否|
|^|否|移动|将光标移动到当前行的第一个字符（不包括空格）|一样|否|
|H|否|移动|将光标移动到本页顶部|一样|否|
|M|否|移动|将光标移动到本页中部|一样|否|
|L|否|移动|将光标移动到本页底部|一样|否|
|{|否|移动|将光标移动到上一个空行处|一样|否|
|}|否|移动|将光标移动到下一个空行处|一样|否|
|(|否|移动|将光标移动到上一句开头处|一样|否|
|)|否|移动|将光标移动到下一句开头处|一样|否|
|gi|否|移动|将光标移动到最后一次变成插入模式的地方|一样|是|
|d|是|删除|后接范围来进行删除|删除可视化部分|否|
|D|否|删除|删除当前光标后的所有字符|删除可视化部分的所有行|否|
|c|是|删除|后接范围来进行删除|删除可视化部分|是|
|C|否|删除|删除当前光标后的所有字符|删除可视化部分的所有行|是|
|s|否|删除|删除当前光标处的字符|删除可视化部分|是|
|S|否|删除|删除当前行|删除可视化部分的所有行|是|
|x|否|删除|删除当前光标处的字符|删除可视化部分|否|
|X|否|删除|删除当前光标处的前一个字符|删除可视化部分的所有行|否|


移动命令技巧：
- 如果你想要到达后面某个词处或后面某个词的开头，则使用w或W
- 如果你想到达后面某个单词的末尾处，则使用e或E
- 如果你想要到达前面某个词处或前面某个词的开头，则使用b或B
- 如果你想要到达前面某个词的末尾处，则使用ge或gE

## 可视模式
- gv: 重选上次的高亮选区:
- o: 切换高亮选区的活动端

## 跳转命令
### jump list
每跳过一下vim都会把你跳过的位置存入jump list中。我们可以使用`Ctrl-o`来跳转到上一个位置, 使用`Ctrl-i`来跳转到下一个位置

原理：jump list相当于与一个队列，有一个指针指向当前是位于jump list到什么位置, 如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325204708.png)

表示上一个位置是第7行，上上个位置是第6行。当使用2次`Ctrl-o`后，jump list如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325204908.png)

此时使用1次`Ctrl-i`后，jump list如下:

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325205030.png)

此时再使用2次`Ctrl-o`后，jump list如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325205135.png)

此时若使用跳转命令gg的话，会将跳转后的位置存入jump list的尾部，而不是当前指向的位置的后面，如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325205344.png)

### change list
每修改一次代码，vim都会把你修改的位置存入change list中。我们可以使用`g;`来跳转到上一个修改的地方，使用`g,`来跳转到下一个修改的地方

原理：与jump list一样

假如现在change list如下:

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325210209.png)

当使用2次`g;`后，change list如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325210326.png)

此时使用1次`g,`后，change list如下:

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325210357.png)

此时再使用2次`g;`后，change list如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325210525.png)

此时若使用`r`命令将当前字符进行替换的话，会将此修改的位置存入change list的尾部，而不是当前指向的位置的后面，如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220325210718.png)

### 其他
- `'.`: 跳转到最后一次编辑的地方
- `.^`: 跳转到最后一次退出插入模式的地方

## 搜索
- `*`: 向下 全字匹配
- `#`: 向上 全字匹配
- `g*`: 向下 普通匹配
- `g#`: 向上 普通匹配

```
:s/Ubuntu/Debian/g
```
当前行替换

```
:%s/<search_term>/<replace_term>/g
```
全文替换

```
:'<,'>s/<search_term>/<replace_term>/g
```
可视化模式下替换

# .操作
`.`表示重复该操作: 上次普通模式进入插入模式的操作 到 进入这次普通模式的操作

![](https://raw.githubusercontent.com/NaisWang/images/master/20220415205707.png)

# normal命令
Vim normal命令的使用形式为`:{range}norm[al][!] {commands}`，表示在 `{range}`指定的范围内的每行执行若干 普通模式命令 `{commands}`。`{commands}` 不能以空格开始，除非在空格前面加个计数 1。

例如:
- `:normal ggdd` 会将光标移动到文件的第一行( gg) 并删除它( dd )
- `:%normal A;` %代表整个文件范围，在每行的结尾添加一个分号
- `:%normal i//` 在每行的开头添加//

## 避免vim映射
normal命令中的可选参数`!` 用于指示vim在当前命令中不使用任何vim映射；如果没有显式使用 `!` 选项，即便是执行一个非递归映射 (noremap) 命令，它的参数仍有可能被重新映射。

例如，假设已经设置了vim映射 `:nnoremap G dd`，则在vim普通模式按下 `G` 将执行命令 `dd`，即会删除一整行；此时，若在vim命令行模式下执行命令 `:normal G` 同样将删除当前行而不会跳转到当前文件的末行。

为了在即便 `G` 命令已经被设置了映射的条件下也能在vim `normal`命令中不改变 `G` 命令原始的含义，需要使用 `:normal! G`。通过 `!` 选项显式指示Vim在当前命令中不使用任何vim映射。

## 配合.使用
假设想在某个文件的一系列行尾添加一个分号`;`，使用vim重复操作命令 `.` 当然可以完成这一任务。但是如果想对100行内容执行末尾加分号的操作，如果使用 `.` 命令，则需要按100次 `j.`，这显然不是一个好的方法。

为了完成上述任务，vim教程网介绍一种使用 normal 命令执行 `.` 命令的新方法。

首先使用命令 `A;` 在光标所在当前行末尾增加 `;`, 然后按 `j` 跳到下一行末尾后按 `V` 进入vim块选择可视化模式，然后按 `G` 跳转到文件尾行，从而完成目标行的选择, 最后，在vim命令行模式下执行命令 `:'<,'>normal .`

`:'<,'>normal .` 命令可以解读为 对高亮选区中的每一行 执行普通模式下的 `.` 命令。无论是操作 100 行还是 1000 行文本，这种方法都能高效地完成任务，而且在可视模式中选中这些行可以摆脱计数的负担。

![](https://raw.githubusercontent.com/NaisWang/images/master/691e0c29gy1fv6131ex74g20j40bqjtz.gif)

注：`'<,'>` 代表高亮选区的范围。在可视化模式下选择完范围后，如果按下 `:` 键，vim命令行上就会自动填充 `:'<,'>`

## 配合宏使用
假设希望将以下文本内容的每个行编号修改为单括号，并将首个单词首字母大小。

转换成vim下的操作就是：需要将每行首个 . 字符修改成 )，再将下一个单词的首字母变为大写。
```
6. six
7. seven
8. eight
// break up the monotony
9. nine
10. ten
```

为了高效地实现上述文本转换，首先，在vim普通模式下录制宏 `qa0f.r)w~q`，然后按键 `jVG` 选择操作区域后，再执行命令 `:'<,'>normal @a` 即可完成任务。

`:normal @a` 命令指示 Vim 在高亮选区中的每一行上执行保存在寄存器a中的宏内容。虽然宏操作在第 4 行会被中断 (`f.`没有在该行找到目标字符 `.`)，但并不会影响后续行上宏的执行。

![](https://raw.githubusercontent.com/NaisWang/images/master/691e0c29gy1fv6137yhw2g20ja08r76k.gif)

## normal命令下的<C-O>作用
`:%normal A;^OI#`: 其中`^O`是按了`<C-O>`出现的字符，表示回到普通模式。这行命令的作用是在普通模式下按`A;`, 由于按了`A`, 所以此时是插入模式，然后通过`<C-O>`即`^O`回到普通模式下，再按`I#`

# 配置文件
## 用Alt键来映射
这次在用Vim的时候，想设置以下快捷键，但是Alt+key（`<A+key>`)的设置一直不成功，后来在网上找了一下资料才明白原来将"`<A+key>`"的输入格式欢畅"^[key"就可以了，输入方式为：按下 Crtl+v后在按下 esc ，再按下key（你想设置的键），这样vim中显示为：^[key, 这样就搞定了……
　注：这种方式再gvim、idea中不行，再gvim中直接使用\<M-key>或\<A-key>

## vim中json文件中双引号隐藏问题
在vim中如果json文件中的双引号被隐藏了， 这是因为你将vim中的`conceallevel`设置成了2
可以通过如下代码来查看`conceallevel`的值最后是由谁修改的
```
:verbose set conceallevel
```
> 注： verbose命令可以让你看到是谁最后修改了conceallevel
一般`conceallevel`被设置成2是由`indentline`插件造成的， 所以上面的命令行输出结果可能如下：
```
conceallevel=2
    Last set from ~/.vim/plugged/indentLine/after/plugin/indentLine.vim
```
这表明确实是由`indentline`插件造成的
所以你可以通过在`.vimrc`文件中添加如下代码来解决：
```
let g:indentLine_conceallevel = 0
```
但是当期设置为0时， 将不会显示缩进线；
所以最好的办法时：在编辑json文件时设置为0，而编译其他文件文件时设置为2
```vim
autocmd FileType json,markdown let g:indentLine_conceallevel=0
autocmd FileType javascript,python,c,cpp,java,vim,shell let g:indentLine_conceallevel=2
```

## 键映射中nore含义
默认的map就是递归的

递归的映射。其实很好理解，也就是如果键a被映射成了b，c又被映射成了a，如果映射是递归的，那么c就被映射成了b。
```
:map a b
:map c a
```
对于c效果等同于
```
:map c b

```
如果是 nore 的映射，即非递归映射，按下 c 只等于按 a。
