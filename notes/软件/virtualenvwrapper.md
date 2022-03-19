# virtuawenv
virtualenv 是一个可以在同一计算机中隔离多个python版本的工具。有时，两个不同的项目可能需要不同版本的python，如 python2.7/ python3.5 ，但是如果都装到一起，经常会导致问题。所以需要一个工具能够将这两种或几种不同版本的环境隔离开来，需要哪个版本就切换到哪个版本做为默认版本。virtualenv 既是满足这个需求的工具。它能够用于创建独立的Python环境，多个Python相互独立，互不影响。
1. 安装
```shell
pip install virtualenv
```
2. 创建虚拟环境
```shell
virtualenv venv
```
为环境指定Python解释器:
```shell
virtualenv -p c:\python27\python.exe venv
```
3. 激活虚拟环境
```shell
activate venv
```
4. 停止虚拟环境
```shell
deactivate
```
5. 删除虚拟环境
直接删除目录即可.
```shell
rmvirtualenv venv　
```

# virtualenvwrapper
virtualenvwrapper是virtualenv的扩展管理包，用于更方便管理虚拟环境，它可以做：
1、将所有虚拟环境整合在一个目录下
2、管理（新增，删除，复制）虚拟环境
3、切换虚拟环境
       关于Virtualenvwrapper和anaconda的安装配置教程，网上有太多太多的，我在自己的其他博客中也有提到，这里就不做赘述啦，只谈正题。

1. 安装virtualenvwrapper
```shell
pip install virtualenvwrapper-win
```
2. 创建虚拟环境
默认创建的虚拟根目录位于C:\Users\username\envs,可以通过环境变量 WORKON_HOME 来定制。
通过计算机-->属性-->高级系统设置-->环境变量-->在系统变量中新建“变量名”：WORKON_HOME,变量值：“你自定义的路径”。
```shell
mkvirtualenv testvir
```
创建了一个名为testvir的虚拟环境，这时就会在你的WORKON_HOME目录下面创建一个名为testvir的文件夹

3. 命令
所有的命令可使用：virtualenvwrapper --help 进行查看，这里列出几个常用的：
```shell
创建基本环境：mkvirtualenv [环境名]
删除环境：rmvirtualenv [环境名] 或者直接删除对应的目录即可
激活环境：workon [环境名]
退出环境：deactivate
列出所有环境：workon 或者 lsvirtualenv -b
进入虚拟环境的site-packages目录: cdsitepackages
列出site-packages目录的所有软件包: lssitepackages
进入虚拟环境目录: cdvirtualenv
```

# 在cygwin或powershell中激活virtualenvwrapper
以管理员身份启动PowerShell，并执行Set-ExecutionPolicy RemoteSigned，可以使用TAB键自动补全。
```shell
PS C:\WINDOWS\system32> Set-ExecutionPolicy RemoteSigned

执行策略更改
执行策略可帮助你防止执行不信任的脚本。更改执行策略可能会产生安全风险，如
http://go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies
帮助主题所述。是否要更改执行策略?
[Y] 是(Y)  [A] 全是(A)  [N] 否(N)  [L] 全否(L)  [S] 暂停(S)  [?] 帮助
(默认值为“N”):Y
```
之后就会显示上面的选项，输入Y，再回车。

最后进入你要激活的虚拟环境中， 运行Script脚本下的active即可。
注意：在cygwin中要使用source ./active。  并且再~/.zshrc做如下更改：
```config
plugins=(virtualenv)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status virtualenv)
```
注意在cygwin中使用python虚拟环境时中的pip查找有关原配置的是在cygwin中的$HOME下查找的， 即$HOME/pip/pip.init中找的（这个HOME是cygwin中的HOME，而不是window的HOME） ，所以要将window下的HOME目录下的pip移到cygwin中的HOME目录下
在cygwin下创建一个workon.sh
```shell
#!/usr/bin/zsh.exe
if test -z $1; then
	workon.bat
else
	envPath="F:/envs/$1/Scripts/"
	if [ ! -d $envPath ]; then
		echo "ERROR: the $1 doesn't exist!"
	else
		prePaht=`pwd`
		cd $envPath
		source ./activate
		cd $prePaht
	fi
fi
```
然后给这个shell起一个别名
```bash
alias workon=". workon.sh"
```
注： 由于activate中有如下代码：
```python
if ! [ -z "${_OLD_VIRTUAL_PATH:+_}" ] ; then
    PATH="$_OLD_VIRTUAL_PATH"
    export PATH
    unset _OLD_VIRTUAL_PATH
fi
```
但是在idea中的terminal的环境中这个_OLD_VIRTUAL_PATH默认值为window上的PATH
所以在~/.zshrc上如下代码， 使其变成cygwin中的PATH
```conf
export _OLD_VIRTUAL_PATH=$PATH
```

# 在pycharm中使用
我们先随便新建一个名为“test”的项目：
下面选择解释器，在选择解释器的时候，我们就可以用Virtualenv和conda来创建虚拟环境，或是利用他们已经创建好的虚拟环境
![](https://gitee.com/naiswang/images/raw/master/20190922194521.png =600x)

我们先选择conda方式来创建：
![](https://gitee.com/naiswang/images/raw/master/20190922194557.png =600x)

这样就可以创建项目喽！
我们再使用virtualenv来创建：
![](https://gitee.com/naiswang/images/raw/master/20190922194630.png =600x)
这里有几点说明：
Name中填写新虚拟环境的名字，或者使用默认名字，方便以后安装第三方包和其他项目使用；
在Location中填写新环境的文件目录;
在Base interpreter下拉框中选择Python解释器；
勾选Inherit global site-packages可以使用base interpreter中的第三方库，不选将和外界完全隔离；
勾选Make available to all projects可将此虚拟环境提供给其他项目使用。
使用Python一定要用好虚拟环境，pycharm真的是太赞啦，直接给集成了两大虚拟环境配置工具，省去了很多步骤。