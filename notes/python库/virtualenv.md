# virtualenv详解
在开发Python应用程序的时候，系统安装的Python3只有一个版本：3.4。所有第三方的包都会被pip安装到Python3的site-packages目录下。

如果我们要同时开发多个应用程序，那这些应用程序都会共用一个Python，就是安装在系统的Python 3。如果应用A需要jinja 2.7，而应用B需要jinja 2.6怎么办？

这种情况下，每个应用可能需要各自拥有一套“独立”的Python运行环境。virtualenv就是用来为一个应用创建一套“隔离”的Python运行环境。

首先，我们用pip安装virtualenv：
```shell
$ pip3 install virtualenv
```
然后，假定我们要开发一个新的项目，需要一套独立的Python运行环境，可以这么做：

第一步，创建目录：
```shell
Mac:~ michael$ mkdir myproject
Mac:~ michael$ cd myproject/
Mac:myproject michael$
```
第二步，创建一个独立的Python运行环境，命名为venv：
```shell
Mac:myproject michael$ virtualenv --no-site-packages venv
Using base prefix '/usr/local/.../Python.framework/Versions/3.4'
New python executable in venv/bin/python3.4
Also creating executable in venv/bin/python
Installing setuptools, pip, wheel...done.
```
命令virtualenv就可以创建一个独立的Python运行环境，我们还加上了参数--no-site-packages，这样，已经安装到系统Python环境中的所有第三方包都不会复制过来，这样，我们就得到了一个不带任何第三方包的“干净”的Python运行环境。

新建的Python环境被放到当前目录下的venv目录。有了venv这个Python环境，可以用source进入该环境：
```shell
Mac:myproject michael$ source venv/bin/activate
(venv)Mac:myproject michael$
```
注意到命令提示符变了，有个(venv)前缀，表示当前环境是一个名为venv的Python环境。

下面正常安装各种第三方包，并运行python命令：
```shell
(venv)Mac:myproject michael$ pip install jinja2
...
Successfully installed jinja2-2.7.3 markupsafe-0.23
(venv)Mac:myproject michael$ python myapp.py
...
```
在venv环境下，用pip安装的包都被安装到venv这个环境下，系统Python环境不受任何影响。也就是说，venv环境是专门针对myproject这个应用创建的。

退出当前的venv环境，使用deactivate命令：
```shell
(venv)Mac:myproject michael$ deactivate 
Mac:myproject michael$ 
```
此时就回到了正常的环境，现在pip或python均是在系统Python环境下执行。

完全可以针对每个应用创建独立的Python运行环境，这样就可以对每个应用的Python环境进行隔离。

virtualenv是如何创建“独立”的Python运行环境的呢？原理很简单，就是把系统Python复制一份到virtualenv的环境，用命令source venv/bin/activate进入一个virtualenv环境时，virtualenv会修改相关环境变量，让命令python和pip均指向当前的virtualenv环境。

## 虚拟环境的原理
上面的实操指南，只要照做，就能把虚拟环境用起来。 用多了，自然能够理解它。 virtualenv是如何创建一个隔离的Python虚拟环境？这个环境有什么特点？

这个环境的特点有二：
- Python版本固定。即使系统的Python升级了，虚拟环境中的仍然不受影响，保留开发状态。
- 所有Python软件包，都只在这个环境生效。一旦退出，则回到用户+系统的默认环境中。

这两个特点，由两个小手段实现。

- 改变当前Shell的`PATH`。
- 改变Python运行时的`sys.path`。
以下为`python:alpine`镜像中，以root用户演示的例子。

### 改变PATH
首先看一下它的目录结构：
```bash
# ls venv
bin      include  lib
# ls /usr/local
bin      include  lib      share
```
环境内所有的新内容，都在这个新生成目录下。 bin是可执行文件的位置，include是C/C++的头文件位置，lib是库文件位置。 它和`/usr/local`内的主要目录几乎相同，也和`~/.local`下类似。

魔法都在两个`PATH`中。

```bash
# echo $PATH
/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# . venv/bin/activate
(venv) # echo $PATH
/root/venv/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```
显然，这个`activate`，为当前`PATH`增加了`venv/bin`这个位置在最前方，因此虚拟环境中的可执行文件拥有最高优先级。 而`lib`与`include`，仅仅是`bin`下面的可执行文件做相对路径运算来寻找的位置。 所以，改变了`PATH`，就改变了很多事。

```bash
# ls -hl venv/bin/
total 88
-rw-r--r--    1 root     root        2.0K Mar 31 08:06 activate
-rw-r--r--    1 root     root        1.1K Mar 31 08:06 activate.csh
-rw-r--r--    1 root     root        3.0K Mar 31 08:06 activate.fish
-rw-r--r--    1 root     root        1.5K Mar 31 08:06 activate.ps1
-rw-r--r--    1 root     root         986 Mar 31 08:06 activate.xsh
-rw-r--r--    1 root     root        1.5K Mar 31 08:06 activate_this.py
-rwxr-xr-x    1 root     root         238 Mar 31 08:06 easy_install
-rwxr-xr-x    1 root     root         238 Mar 31 08:06 easy_install-3.7
-rwxr-xr-x    1 root     root         220 Mar 31 08:06 pip
-rwxr-xr-x    1 root     root         220 Mar 31 08:06 pip3
-rwxr-xr-x    1 root     root         220 Mar 31 08:06 pip3.7
-rwxr-xr-x    1 root     root       35.8K Mar 31 08:06 python
-rwxr-xr-x    1 root     root        2.3K Mar 31 08:06 python-config
lrwxrwxrwx    1 root     root           6 Mar 31 08:06 python3 -> python
lrwxrwxrwx    1 root     root           6 Mar 31 08:06 python3.7 -> python
-rwxr-xr-x    1 root     root         216 Mar 31 08:06 wheel
```

由于优先级最高，所以环境里的`python`、`pip`等，包括后来用`pip`安装的可执行文件，都使用的是`venv`下的。

### 改变sys.path

```bash
(venv) # python -m site
sys.path = [
    '/root',
    '/root/venv/lib/python37.zip',
    '/root/venv/lib/python3.7',
    '/root/venv/lib/python3.7/lib-dynload',
    '/usr/local/lib/python3.7',
    '/root/venv/lib/python3.7/site-packages',
]
USER_BASE: '/root/.local' (doesn't exist)
USER_SITE: '/root/.local/lib/python3.7/site-packages' (doesn't exist)
ENABLE_USER_SITE: False
(venv) # deactivate
# python -m site
sys.path = [
    '/root',
    '/usr/local/lib/python37.zip',
    '/usr/local/lib/python3.7',
    '/usr/local/lib/python3.7/lib-dynload',
    '/usr/local/lib/python3.7/site-packages',
]
USER_BASE: '/root/.local' (doesn't exist)
USER_SITE: '/root/.local/lib/python3.7/site-packages' (doesn't exist)
ENABLE_USER_SITE: True
```

可见，sys.path发生了翻天覆地的变化。 除了当前路径`/root`和标准库`/usr/local/lib/python3.7`被保留以外，其它位置都换成了`venv`下的。 这就是为什么`pip list`看不见什么软件包的原因，也是环境隔离的最大秘密。

## 标准库venv
从Python 3.3开始，标准库中就自带了一个venv模块，拥有virtualenv的部分功能。 因此，也可以通过以下命令来创建虚拟环境。
```bash
python3 -m venv venv
```

但还是推荐使用`virtualenv`。 `venv`只能创建当前版本的虚拟环境，不能创建其它Python 3.x的版本，以及Python 2的环境。

这个 venv 的原理，还是和上面我们说过的一样。但是 Python3 有一些提升，它的 Python 可执行文件是一个软连接了，用一个 `pyvenv.cfg` 来标志出 home 的位置。

```txt
├── myenv
│   ├── bin
│   │   ├── activate
│   │   ├── activate.csh
│   │   ├── activate.fish
│   │   ├── easy_install
│   │   ├── easy_install-3.7
│   │   ├── pip
│   │   ├── pip3
│   │   ├── pip3.7
│   │   ├── python -> python3
│   │   └── python3 -> /usr/local/bin/python3
│   ├── include
│   ├── lib
│   │   └── python3.7
│   └── pyvenv.cfg
```
它的文件内容如下：

```txt
File: myenv/pyvenv.cfg
home = /usr/local/bin
include-system-site-packages = false
version = 3.7.3
```
如果 `include-system-site-packages` 为 `true`，解释器启动的时候就会将系统的库添加到 `sys.path` 里面，这样我们在虚拟环境就可以 `import` 系统中安装的包了。

