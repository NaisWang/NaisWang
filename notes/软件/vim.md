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

![](https://gitee.com/NaisWang/images/raw/master/img/20211130183951.png)


# 用Alt键来映射
这次在用Vim的时候，想设置以下快捷键，但是Alt+key（`<A+key>`)的设置一直不成功，后来在网上找了一下资料才明白原来将"`<A+key>`"的输入格式欢畅"^[key"就可以了，输入方式为：按下 Crtl+v后在按下 esc ，再按下key（你想设置的键），这样vim中显示为：^[key, 这样就搞定了……
　注：这种方式再gvim、idea中不行，再gvim中直接使用\<M-key>或\<A-key>

# vim中json文件中双引号隐藏问题
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

# 键映射中nore含义
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

