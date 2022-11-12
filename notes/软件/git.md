# Git起步
## 三种状态
现在请注意，如果你希望后面的学习更顺利，请记住下面这些关于 Git 的概念。 Git 有三种状态，你的文件可能处于其中之一： `已提交（committed）`、`已修改（modified）`和`已暂存（staged）`。
- `已修改`表示修改了文件，但还没保存到数据库中。
- `已暂存`表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。
- `已提交`表示数据已经安全地保存在本地数据库中。

## git三个分区
<div class="container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/mZrQtouBSnw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

这会让我们的 Git 项目拥有三个分区：工作区、暂存区（索引区）以及 Git 目录。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105016.png)

- `工作区`操作系统上的文件，所有代码开发编辑都在这上面完成。
- `索引区`可以理解为一个暂存区域，
- `Git仓库目录`由Git 对象记录着每一次提交的快照，以及链式结构记录的提交变更历史。

我们来看一下更新一个文件的内容这个过程会发生什么事。

![](https://raw.githubusercontent.com/NaisWang/images/master/724a-imkzenp1240383.gif)

运行`echo "333" > a.txt`将a.txt的内容从111修改成333，此时如上图可以看到，此时索引区域和git仓库没有任何变化。

![](https://raw.githubusercontent.com/NaisWang/images/master/feb2-.gif)

运行git add a.txt将a.txt加入到索引区域，此时如上图所示，git在仓库里面新建了一个blob object，储存了新的文件内容。并且更新了索引将a.txt指向了新建的blob object。

![](https://raw.githubusercontent.com/NaisWang/images/master/60e3-imkzenp1239489.gif)

运行git commit -m 'update'提交这次修改。如上图所示
Git首先根据当前的索引生产一个tree object，充当新提交的一个快照。
创建一个新的commit object，将这次commit的信息储存起来，并且parent指向上一个commit，组成一条链记录变更历史。
将master分支的指针移到新的commit结点。

## 初次运行 Git 前的配置 
 既然已经在系统上安装了 Git，你会想要做几件事来定制你的 Git 环境。 每台计算机上只需要配置一次，程序升级时会保留配置信息。 你可以在任何时候再次通过运行命令来修改它们。

Git 自带一个`git config`的工具来帮助设置控制 Git 外观和行为的配置变量。 这些变量存储在三个不同的位置：
-`/etc/gitconfig`文件: 包含系统上每一个用户及他们仓库的通用配置。 如果在执行`git config`时带上 `--system`选项，那么它就会读写该文件中的配置变量。（由于它是系统配置文件，因此你需要管理员或超级用户权限来修改它。）
- `~/.gitconfig`或`~/.config/git/config`文件：只针对当前用户。 你可以传递`--global`选项让 Git 读写此文件，这会对你系统上 所有 的仓库生效。

- 当前使用仓库的 Git 目录中的`config`文件（即 .git/config）：针对该仓库。 你可以传递`--local` 选项让 Git 强制读写此文件，虽然默认情况下用的就是它。。 （当然，你需要进入某个 Git 仓库中才能让该选项生效。）

每一个级别会覆盖上一级别的配置，所以`.git/config`的配置变量会覆盖`/etc/gitconfig`中的配置变量。

在 Windows 系统中，Git 会查找`$HOME`目录下（一般情况下是`C:\Users\$USER`）的`.gitconfig`文件。 Git 同样也会寻找`/etc/gitconfig`文件，但只限于`MSys`的根目录下，即安装 Git 时所选的目标位置。 如果你在 Windows 上使用 Git 2.x 以后的版本，那么还有一个系统级的配置文件，Windows XP 上在 `C:\Documents and Settings\All Users\Application Data\Git\config`，Windows Vista 及更新的版本在`C:\ProgramData\Git\config`。此文件只能以管理员权限通过`git config -f <file>`来修改。

你可以通过以下命令查看所有的配置以及它们所在的文件：
```shell
$ git config --list --show-origin
```

### 用户信息
安装完 Git 之后，要做的第一件事就是设置你的用户名和邮件地址。 这一点很重要，因为每一个 Git 提交都会使用这些信息，它们会写入到你的每一次提交中，不可更改：
```shell
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```
再次强调，如果使用了`--global`选项，那么该命令只需要运行一次，因为之后无论你在该系统上做任何事情， Git 都会使用那些信息。 当你想针对特定项目使用不同的用户名称与邮件地址时，可以在那个项目目录下运行没有`--global`选项的命令来配置。

很多 GUI 工具都会在第一次运行时帮助你配置这些信息

### 文本编辑器
既然用户信息已经设置完毕，你可以配置默认文本编辑器了，当 Git 需要你输入信息时会调用它。 如果未配置，Git 会使用操作系统默认的文本编辑器。

如果你想使用不同的文本编辑器，例如 Emacs，可以这样做：
```shell
$ git config --global core.editor emacs
```
在 Windows 系统上，如果你想要使用别的文本编辑器，那么必须指定可执行文件的完整路径。 它可能随你的编辑器的打包方式而不同。

对于 Notepad++，一个流行的代码编辑器来说，你可能想要使用 32 位的版本， 因为在本书编写时 64 位的版本尚不支持所有的插件。 如果你在使用 32 位的 Windows 系统，或在 64 位系统上使用 64 位的编辑器，那么你需要输入如下命令：
```shell
$ git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

### 分页器
配置项`core.pager`用于指定 Git 运行诸如`git log`、`git diff`等所使用的分页器，可以设置成`more`或者任何你喜欢的分页器（默认用的是`less`，也就是在新窗口打开）, 当然你也可以什么都不用，设置空字符串：
```shell
$ git config --global core.pager ''
```
### 别名
Git 并不会在你输入部分命令时自动推断出你想要的命令。 如果不想每次都输入完整的 Git 命令，可以通过`git config`文件来轻松地为每一个命令设置一个别名。 这里有一些例子你可以试试：
```shell
$ git config --global alias.ci commit
```
这意味着，当要输入`git commit`时，只需要输入`git ci`。 随着你继续不断地使用 Git，可能也会经常使用其他命令，所以创建别名时不要犹豫。
在创建你认为应该存在的命令时这个技术会很有用。 例如，为了解决取消暂存文件的易用性问题，可以向 Git 中添加你自己的取消暂存别名：
```shell
$ git config --global alias.unstage 'reset HEAD --'
```
这会使下面的两个命令等价：
```shell
$ git unstage fileA
$ git reset HEAD -- fileA
```

### 检查配置信息
如果想要检查你的配置，可以使用`git config --list`命令来列出所有 Git 当时能找到的配置。
```shell
$ git config --list
user.name=John Doe
user.email=johndoe@example.com
color.status=auto
color.branch=auto
color.interactive=auto
color.diff=auto
...
```
你可能会看到重复的变量名，因为 Git 会从不同的文件中读取同一个配置（例如：`/etc/gitconfig`与`~/.gitconfig`）。 这种情况下，Git 会使用它找到的每一个变量的最后一个配置。

你可以通过输入`git config <key>`： 来检查 Git 的某一项配置
```shell
$ git config user.name
John Doe
```

>Note
由于 Git 会从多个文件中读取同一配置变量的不同值，因此你可能会在其中看到意料之外的值而不知道为什么。 此时，你可以查询 Git 中该变量的 原始 值，它会告诉你哪一个配置文件最后设置了该值：
```shell
$ git config --show-origin rerere.autoUpdate
file:/home/johndoe/.gitconfig	false
```

### 获取帮助
若你使用 Git 时需要获取帮助，有三种等价的方法可以找到 Git 命令的综合手册（manpage）：
```shell
$ git help <verb>
$ git <verb> --help
$ man git-<verb>
```
例如，要想获得`git config`命令的手册，执行
```shell
$ git help config
```
这些命令很棒，因为你随时随地可以使用而无需联网。 如果你觉得手册或者本书的内容还不够用，你可以尝试在 Freenode IRC 服务器 https://freenode.net 上的`#git`或`#github`频道寻求帮助。 这些频道经常有上百人在线，他们都精通 Git 并且乐于助人。

此外，如果你不需要全面的手册，只需要可用选项的快速参考，那么可以用`-h`选项获得更简明的 “help” 输出：
```shell
$ git add -h
usage: git add [<options>] [--] <pathspec>...

    -n, --dry-run         dry run
    -v, --verbose         be verbose

    -i, --interactive     interactive picking
    -p, --patch           select hunks interactively
    -e, --edit            edit current diff and apply
    -f, --force           allow adding otherwise ignored files
    -u, --update          update tracked files
    --renormalize         renormalize EOL of tracked files (implies -u)
    -N, --intent-to-add   record only the fact that the path will be added later
    -A, --all             add changes from all tracked and untracked files
    --ignore-removal      ignore paths removed in the working tree (same as --no-all)
    --refresh             don't add, only refresh the index
    --ignore-errors       just skip files which cannot be added because of errors
    --ignore-missing      check if - even missing - files are ignored in dry run
    --chmod (+|-)x        override the executable bit of the listed files
```


# Git底层命令
## 初始化新仓库
命令：git init
解析：要对现有的某个项目开始用 Git 管理，只需到此项目所在的目录，执行：git init
作用：初始化后，在当前目录下会出现一个名为 .git 的目录，所有 Git 需要的数据和资源都存放在这个目录中。不过目前，仅仅是按照既有的结构框架初始化好了里边所有的文件和目录，但我们还没有开始跟踪管理项目中的任何一个文件。

## .git 目录
|目录/文件|说明|
|---|---|
|hooks/| 目录包含客户端或服务端的钩子脚本(hook scripts)|
|info/| 包含一个全局性排除（global exclude）文件， 用以放置那些不希望被记录在`.gitignore`文件中的忽略模式(ignored patterns)|
|logs| 保存日志信息|
|objects/| 目录存储所有数据内容；|
|refs/| 目录存储指向数据（分支、远程仓库和标签等）的提交对象的指针|
|config| 文件包含项目特有的配置选项|
|description| 用来显示对仓库的描述信息|
|HEAD |文件指示目前被检出的分支|
|index| 文件保存暂存区信息|

## git对象
git对象包括三种：blog对象（数据对象）、Tree对象（树对象）、Commit对象（提交对象）
<font color="red">git对象一旦创建，就不会被更改</font>

### Blob对象
Git 的核心部分是一个**简单的键值对数据库**。即Git对象是Map类型；你可以向该数据库插入任意类型的内容，它会返回一个键值，通过该键值可以在任意时刻再次检索该内容, **其中key是value的hash值**
Git 是一个内容寻址文件系统，听起来很酷。但这是什么意思呢？ 这意味着，Git 的核心部分是一个简单的键值对数据库（key-value data store）。 你可以向 Git 仓库中插入任意类型的内容，它会返回一个唯一的键，通过该键可以在任意时刻再次取回该内容。

可以通过底层命令`git hash-object`来演示上述效果——该命令可将任意数据保存于`.git/objects`目录（即对象数据库），并返回指向该数据对象的唯一的键。

首先，我们需要初始化一个新的 Git 版本库，并确认`objects`目录为空：
```shell
$ git init test
Initialized empty Git repository in /tmp/test/.git/
$ cd test
$ find .git/objects
.git/objects
.git/objects/info
.git/objects/pack
$ find .git/objects -type f
```
可以看到 Git 对`objects`目录进行了初始化，并创建了`pack`和`info`子目录，但均为空。 接着，我们用`git hash-object`创建一个新的数据对象并将它手动存入你的新Git数据库中：
```shell
$ echo 'test content' | git hash-object -w --stdin
d670460b4b4aece5915caf5c68d12f560a9fe3e4
```
在这种最简单的形式中，`git hash-object`会接受你传给它的东西，而它只会返回可以存储在Git仓库中的唯一键。 `-w`选项会指示该命令不要只返回键，还要将该对象写入数据库中。 最后，`--stdin`选项则指示该命令从标准输入读取内容；若不指定此选项，则须在命令尾部给出待存储文件的路径。

此命令输出一个长度为 40 个字符的校验和。 这是一个`SHA-1`哈希值——一个将待存储的数据外加一个头部信息（header）一起做`SHA-1`校验运算而得的校验和。后文会简要讨论该头部信息。 现在我们可以查看Git是如何存储数据的：
```
$ find .git/objects -type f
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
```
如果你再次查看`objects`目录，那么可以在其中找到一个与新内容对应的文件。 这就是开始时Git存储内容的方式——一个文件对应一条内容， 以该内容加上特定头部信息一起的`SHA-1`校验和为文件命名。 校验和的前两个字符用于命名子目录，余下的`38`个字符则用作文件名。

一旦你将内容存储在了对象数据库中，那么可以通过`cat-file`命令从Git那里取回数据。 这个命令简直就是一把剖析Git对象的瑞士军刀。 为`cat-file`指定`-p`选项可指示该命令自动判断内容的类型，并为我们显示大致的内容：
```shell
$ git cat-file -p d670460b4b4aece5915caf5c68d12f560a9fe3e4
test content
```
至此，你已经掌握了如何向 Git 中存入内容，以及如何将它们取出。 我们同样可以将这些操作应用于文件中的内容。 例如，可以对一个文件进行简单的版本控制。 首先，创建一个新文件并将其内容存入数据库：
```shell
$ echo 'version 1' > test.txt
$ git hash-object -w test.txt
83baae61804e65cc73a7201a7252750c76066a30
```
接着，向文件里写入新内容，并再次将其存入数据库：
```shell
$ echo 'version 2' > test.txt
$ git hash-object -w test.txt
1f7a7a472abf3dd9643fd615f6da379c4acb3e3a
```
对象数据库记录下了该文件的两个不同版本，当然之前我们存入的第一条内容也还在：
```shell
$ find .git/objects -type f
.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a
.git/objects/83/baae61804e65cc73a7201a7252750c76066a30
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
```
现在可以在删掉 test.txt 的本地副本，然后用 Git 从对象数据库中取回它的第一个版本：
```shell
$ rm test.txt
$ git cat-file -p 83baae61804e65cc73a7201a7252750c76066a30 > test.txt
$ cat test.txt
version 1
```
或者第二个版本：
```shell
$ rm test.txt
$ git cat-file -p 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a > test.txt
$ cat test.txt
version 2
```
然而，记住文件的每一个版本所对应的`SHA-1`值并不现实；另一个问题是，在这个（简单的版本控制）系统中，文件名并没有被保存——我们仅保存了文件的内容。 上述类型的对象我们称之为`数据对象（blob object）`。 利用`git cat-file -t`命令，可以让Git告诉我们其内部存储的任何对象类型，只要给定该对象的`SHA-1`值：
```shell
$ git cat-file -t 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a
blob
```

#### blob对象储存的是全新的文件快照还是储存文件的变更部分
Git储存的是全新的文件快照，而不是文件的变更记录。也就是说，就算你只是在文件中添加一行，Git也会新建一个全新的blob object。那这样子是不是很浪费空间呢?
这其实是Git在空间和时间上的一个取舍，思考一下你要checkout一个commit，或对比两个commit之间的差异。如果Git储存的是问卷的变更部分，那么为了拿到一个commit的内容，Git都只能从第一个commit开始，然后一直计算变更，直到目标commit，这会花费很长时间。而相反，Git采用的储存全新文件快照的方法能使这个操作变得很快，直接从快照里面拿取内容就行了。
当然，在涉及网络传输或者Git仓库真的体积很大的时候，Git会有垃圾回收机制gc，不仅会清除无用的object，还会把已有的相似object打包压缩

### 树对象
接下来要探讨的 Git 对象类型是树对象（tree object），它能解决文件名保存的问题，也允许我们将多个文件组织到一起。 Git 以一种类似于 UNIX 文件系统的方式存储内容，但作了些许简化。 所有内容均以树对象和数据对象的形式存储，其中树对象对应了 UNIX 中的目录项，数据对象则大致上对应了`inodes`或文件内容。 一个树对象包含了一条或多条树对象记录（tree entry），每条记录含有一个指向数据对象或者子树对象的 SHA-1 指针，以及相应的模式、类型、文件名信息。 例如，某项目当前对应的最新树对象可能是这样的：
```shell
$ git cat-file -p master^{tree}
100644 blob a906cb2a4a904a152e80877d4088654daad0c859      README
100644 blob 8f94139338f9404f26296befa88755fc2598c289      Rakefile
040000 tree 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0      lib
```

`master^{tree}`语法表示`master`分支上最新的提交所指向的树对象。 请注意，`lib`子目录（所对应的那条树对象记录）并不是一个数据对象，而是一个指针，其指向的是另一个树对象：
```shell
$ git cat-file -p 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0
100644 blob 47c6340d6459e05787f644c2447d2595f5d3a54b      simplegit.rb
```
>Note
你可能会在某些 shell 中使用 master^{tree} 语法时遇到错误。
在 Windows 的 CMD 中，字符 ^ 被用于转义，因此你必须双写它以避免出现问题：git cat-file -p master^^{tree}。 在 PowerShell 中使用字符 {} 时则必须用引号引起来，以此来避免参数解析错误：git cat-file -p 'master^{tree}'。
在 ZSH 中，字符 ^ 被用在通配模式（globbing）中，因此你必须将整个表达式用引号引起来：git cat-file -p "master^{tree}"。

从概念上讲，Git 内部存储的数据有点像这样：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105310.png)


你可以轻松创建自己的树对象。 通常，Git 根据某一时刻暂存区（即 index 区域，下同）所表示的状态创建并记录一个对应的树对象， 如此重复便可依次记录（某个时间段内）一系列的树对象。 因此，为创建一个树对象，首先需要通过暂存一些文件来创建一个暂存区。 可以通过底层命令`git update-index`为一个单独文件——我们的`test.txt`文件的首个版本——创建一个暂存区。 利用该命令，可以把`test.txt`文件的首个版本人为地加入一个新的暂存区。 必须为上述命令指定`--add`选项，因为此前该文件并不在暂存区中（我们甚至都还没来得及创建一个暂存区呢）； 同样必需的还有`--cacheinfo`选项，文件模式、`SHA-1`与文件名,因为将要添加的文件位于 Git 数据库中，而不是位于当前目录下。如果将要添加的文件不位于Git数据库中，而在当前目录下，那么只需要写上文件名即可,例`git update-index --add new.txt`
```shell
$ git update-index --add --cacheinfo 100644 83baae61804e65cc73a7201a7252750c76066a30 test.txt
```

本例中，我们指定的文件模式为 100644，表明这是一个普通文件。 其他选择包括：100755，表示一个可执行文件；120000，表示一个符号链接。 这里的文件模式参考了常见的 UNIX 文件模式，但远没那么灵活——上述三种模式即是 Git 文件（即数据对象）的所有合法模式（当然，还有其他一些模式，但用于目录项和子模块）。

现在，可以通过`git write-tree`命令将暂存区内容写入一个树对象。 此处无需指定`-w`选项——如果某个树对象此前并不存在的话，当调用此命令时， 它会根据当前暂存区状态自动创建一个新的树对象：
```shell
$ git write-tree
d8329fc1cc938780ffdd9f94e0d364e0ea74f579
$ git cat-file -p d8329fc1cc938780ffdd9f94e0d364e0ea74f579
100644 blob 83baae61804e65cc73a7201a7252750c76066a30      test.txt
```
不妨用之前见过的`git cat-file`命令验证一下它确实是一个树对象：
```shell
$ git cat-file -t d8329fc1cc938780ffdd9f94e0d364e0ea74f579
tree
```
接着我们来创建一个新的树对象，它包括 test.txt 文件的第二个版本，以及一个新的文件：
```shell
$ echo 'new file' > new.txt
$ git update-index --add --cacheinfo 100644 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a test.txt
$ git update-index --add new.txt
```
暂存区现在包含了 test.txt 文件的新版本，和一个新文件：new.txt。 记录下这个目录树（将当前暂存区的状态记录为一个树对象），然后观察它的结构：
```shell
$ git write-tree
0155eb4229851634a0f03eb265b69f5a2d56f341
$ git cat-file -p 0155eb4229851634a0f03eb265b69f5a2d56f341
100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt
```
我们注意到，新的树对象包含两条文件记录，同时 test.txt 的 SHA-1 值（1f7a7a）是先前值的“第二版”。 只是为了好玩：你可以将第一个树对象加入第二个树对象，使其成为新的树对象的一个子目录。 通过调用`git read-tree` 命令，可以把树对象读入暂存区。 本例中，可以通过对该命令指定`--prefix`选项，将一个已有的树对象作为子树读入暂存区：
```shell
$ git read-tree --prefix=bak d8329fc1cc938780ffdd9f94e0d364e0ea74f579
$ git write-tree
3c4e9cd789d88d8d89c1073707c3585e41b0e614
$ git cat-file -p 3c4e9cd789d88d8d89c1073707c3585e41b0e614
040000 tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579      bak
100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt
```
如果基于这个新的树对象创建一个工作目录，你会发现工作目录的根目录包含两个文件以及一个名为`bak`的子目录，该子目录包含`test.txt`文件的第一个版本。 可以认为Git内部存储着的用于表示上述结构的数据是这样的：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105027.png)

### 提交对象
如果你做完了以上所有操作，那么现在就有了三个树对象，分别代表我们想要跟踪的不同项目快照。 然而问题依旧：若想重用这些快照，你必须记住所有三个`SHA-1`哈希值。 并且，你也完全不知道是谁保存了这些快照，在什么时刻保存的，以及为什么保存这些快照。 而以上这些，正是提交对象（commit object）能为你保存的基本信息。

可以通过调用`commit-tree`命令创建一个提交对象，为此需要指定一个树对象的`SHA-1`值，以及该提交的父提交对象（如果有的话）。 我们从之前创建的第一个树对象开始：
```shell
$ echo 'first commit' | git commit-tree d8329f
fdf4fc3344e67ab068f836878b6c4951e3b15f3d
```
由于创建时间和作者数据不同，你现在会得到一个不同的散列值。 请将本章后续内容中的提交和标签的散列值替换为你自己的校验和。 现在可以通过`git cat-file`命令查看这个新提交对象：
```shell
$ git cat-file -p fdf4fc3
tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579
author Scott Chacon <schacon@gmail.com> 1243040974 -0700
committer Scott Chacon <schacon@gmail.com> 1243040974 -0700

first commit
```
提交对象的格式很简单：它先指定一个顶层树对象，代表当前项目快照； 然后是可能存在的父提交（前面描述的提交对象并不存在任何父提交）； 之后是作者/提交者信息（依据你的`user.name`和`user.email`配置来设定，外加一个时间戳）； 留空一行，最后是提交注释。

接着，我们将创建另两个提交对象，它们分别引用各自的上一个提交（作为其父提交对象）：
```shell
$ echo 'second commit' | git commit-tree 0155eb -p fdf4fc3
cac0cab538b970a37ea1e769cbbde608743bc96d
$ echo 'third commit'  | git commit-tree 3c4e9c -p cac0cab
1a410efbd13591db07496601ebc7a059dd55cfe9
```
这三个提交对象分别指向之前创建的三个树对象快照中的一个。 现在，如果对最后一个提交的`SHA-1`值运行`git log`命令，会出乎意料的发现，你已有一个货真价实的、可由`git log`查看的Git提交历史了：
```shell
$ git log --stat 1a410e
commit 1a410efbd13591db07496601ebc7a059dd55cfe9
Author: Scott Chacon <schacon@gmail.com>
Date:   Fri May 22 18:15:24 2009 -0700

	third commit

 bak/test.txt | 1 +
 1 file changed, 1 insertion(+)

commit cac0cab538b970a37ea1e769cbbde608743bc96d
Author: Scott Chacon <schacon@gmail.com>
Date:   Fri May 22 18:14:29 2009 -0700

	second commit

 new.txt  | 1 +
 test.txt | 2 +-
 2 files changed, 2 insertions(+), 1 deletion(-)

commit fdf4fc3344e67ab068f836878b6c4951e3b15f3d
Author: Scott Chacon <schacon@gmail.com>
Date:   Fri May 22 18:09:34 2009 -0700

    first commit

 test.txt | 1 +
 1 file changed, 1 insertion(+)
```
太神奇了： 就在刚才，你没有借助任何上层命令，仅凭几个底层操作便完成了一个 Git 提交历史的创建。 这就是每次我们运行 git add 和 git commit 命令时，Git 所做的工作实质就是将被改写的文件保存为数据对象， 更新暂存区，记录树对象，最后创建一个指明了顶层树对象和父提交的提交对象。 这三种主要的 Git 对象——数据对象、树对象、提交对象——最初均以单独文件的形式保存在 .git/objects 目录下。 下面列出了目前示例目录内的所有对象，辅以各自所保存内容的注释：
```shell
$ find .git/objects -type f
.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1
```
如果跟踪所有的内部指针，将得到一个类似下面的对象关系图：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105037.png)


### Blob对象与树对象与提交对象的区别
blob对象与树对象与提交对象都会以文件的形式存放在.git/object目录下
- blob对象：保存文件内容
- tree对象：保存目录结构、文件权限、文件名、其他tree对象、blob对象的引用
- commit对象：保存上一个commit、对应快照、作者、提交信息、其他tree对象blob对象的引用
其关系图如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105047.png)


#### 为什么要把文件的权限和文件名储存在tree object里面而不是blob object呢？
想象一下修改一个文件的命名。如果将文件名保存在blob里面，那么Git只能多复制一份原始内容形成一个新的blob object。而Git的实现方法只需要创建一个新的tree object将对应的文件名更改成新的即可，原本的blob object可以复用，节约了空间。

### Git怎么保证历史记录不可篡改？
通过SHA1哈希算法和哈希树来保证。假设你偷偷修改了历史变更记录上一个文件的内容，那么这个问卷的blob object的SHA1哈希值就变了，与之相关的tree object的SHA1也需要改变，commit的SHA1也要变，这个commit之后的所有commit SHA1值也要跟着改变。又由于Git是分布式系统，即所有人都有一份完整历史的Git仓库，所以所有人都能很轻松的发现存在问题。

## 查看暂存区
Git暂存区index文件位于.git目录下，当使用编辑器打开此文件的时候，发现里面全是乱码, Git提供了查看此文件内容的命令:`git ls-files`

#### git ls-files
参数说明（括号里是简写）
- `--cached(-c)`显示暂存区中的文件，git ls-files命令默认的参数
- `--deleted(-d)`显示删除的文件
- `--modified(-m)`显示修改过的文件
- `--other(-o)`显示没有被git跟踪的文件
- `--stage(-s)`显示mode以及文件对应的Blob对象，进而我们可以获取暂存区中对应文件里面的内容。

实例
1.如何查看暂存区中有哪些文件？
```shell
$ git ls-files
README
Rakefile
lib/simplegit.rb
```

2. 如何查看暂存区中文件内容对应的Blob对象？
```shell
$ git ls-files -s
100644 a906cb2a4a904a152e80877d4088654daad0c859 0	README
100644 8f94139338f9404f26296befa88755fc2598c289 0	Rakefile
100644 47c6340d6459e05787f644c2447d2595f5d3a54b 0	lib/simplegit.rb
```

# Git高层命令
## 获取Git仓库
通常有两种获取 Git 项目仓库的方式：
- 将尚未进行版本控制的本地目录转换为 Git 仓库；
- 从其它服务器 克隆 一个已存在的 Git 仓库。

两种方式都会在你的本地机器上得到一个工作就绪的 Git 仓库。

### 在已存在目录中初始化仓库
如果你有一个尚未进行版本控制的项目目录，想要用 Git 来控制它，那么首先需要进入该项目目录中
```shell
$ git init
```
该命令将创建一个名为 .git 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。 但是，在这个时候，我们仅仅是做了一个初始化的操作，你的项目里的文件还没有被跟踪。 

如果在一个已存在文件的文件夹（而非空文件夹）中进行版本控制，你应该开始追踪这些文件并进行初始提交。 可以通过`git add`命令来指定所需的文件来进行追踪，然后执行`git commit`：
```shell
$ git add *.c
$ git add LICENSE
$ git commit -m 'initial project version'
```
稍后我们再逐一解释这些指令的行为。 现在，你已经得到了一个存在被追踪文件与初始提交的 Git 仓库。

### 克隆现有的仓库
如果你想获得一份已经存在了的 Git 仓库的拷贝，比如说，你想为某个开源项目贡献自己的一份力，这时就要用到`git clone`命令。 如果你对其它的 VCS 系统（比如说 Subversion）很熟悉，请留心一下你所使用的命令是"clone"而不是"checkout"。 这是 Git 区别于其它版本控制系统的一个重要特性，Git 克隆的是该 Git 仓库服务器上的几乎所有数据，而不是仅仅复制完成你的工作所需要文件。 当你执行`git clone`命令的时候，默认配置下远程 Git 仓库中的每一个文件的每一个版本都将被拉取下来。 事实上，如果你的服务器的磁盘坏掉了，你通常可以使用任何一个克隆下来的用户端来重建服务器上的仓库 （虽然可能会丢失某些服务器端的钩子（hook）设置，但是所有版本的数据仍在，详见 在服务器上搭建 Git ）。

克隆仓库的命令是`git clone <url>`。 比如，要克隆 Git 的链接库`libgit2`，可以用下面的命令：
```shell
$ git clone https://github.com/libgit2/libgit2
```
这会在当前目录下创建一个名为`“libgit2”`的目录，并在这个目录下初始化一个`.git`文件夹， 从远程仓库拉取下所有数据放入`.git`文件夹，然后从中读取最新版本的文件的拷贝。 如果你进入到这个新建的`libgit2`文件夹，你会发现所有的项目文件已经在里面了，准备就绪等待后续的开发和使用。

如果你想在克隆远程仓库的时候，自定义本地仓库的名字，你可以通过额外的参数指定新的目录名：
```shell
$ git clone https://github.com/libgit2/libgit2 mylibgit
```
这会执行与上一条命令相同的操作，但目标目录名变为了`mylibgit`。

Git 支持多种数据传输协议。 上面的例子使用的是`https://`协议，不过你也可以使用`git://`协议或者使用`SSH`传输协议，比如`user@server:path/to/repo.git`。 在服务器上搭建 Git 将会介绍所有这些协议在服务器端如何配置使用，以及各种方式之间的利弊。


## 记录每次更新到仓库
现在我们的机器上有了一个 真实项目 的 Git 仓库，并从这个仓库中检出了所有文件的 工作副本。 通常，你会对这些文件做些修改，每当完成了一个阶段的目标，想要将记录下它时，就将它提交到到仓库。

请记住，你工作目录下的每一个文件都不外乎这两种状态：**已跟踪** 或 **未跟踪**。 已跟踪的文件是指那些被纳入了版本控制的文件，在上一次快照中有它们的记录，在工作一段时间后， 它们的状态可能是未修改，已修改或已放入暂存区。简而言之，已跟踪的文件就是 Git 已经知道的文件。

工作目录中除已跟踪文件外的其它所有文件都属于未跟踪文件，它们既不存在于上次快照的记录中，也没有被放入暂存区。 初次克隆某个仓库的时候，工作目录中的所有文件都属于已跟踪文件，并处于未修改状态，因为 Git 刚刚检出了它们， 而你尚未编辑过它们。

编辑过某些文件之后，由于自上次提交后你对它们做了修改，Git 将它们标记为已修改文件。 在工作时，你可以选择性地将这些修改过的文件放入暂存区，然后提交所有已暂存的修改，如此反复。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105058.png)

### 检查当前文件状态
可以用`git status`命令查看哪些文件处于什么状态。 如果在克隆仓库后立即使用此命令，会看到类似这样的输出：
```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working directory clean
```
这说明你现在的工作目录相当干净。换句话说，所有已跟踪文件在上次提交后都未被更改过。 此外，上面的信息还表明，当前目录下没有出现任何处于未跟踪状态的新文件，否则 Git 会在这里列出来。 最后，该命令还显示了当前所在分支，并告诉你这个分支同远程服务器上对应的分支没有偏离。 现在，分支名是“master”,这是默认的分支名。 我们在 Git 分支 中会详细讨论分支和引用。

现在，让我们在项目下创建一个新的 README 文件。 如果之前并不存在这个文件，使用`git status`命令，你将看到一个新的未跟踪文件：
```shell
$ echo 'My Project' > README
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Untracked files:
  (use "git add <file>..." to include in what will be committed)

    README

nothing added to commit but untracked files present (use "git add" to track)
```
在状态报告中可以看到新建的 README 文件出现在`Untracked files`下面。 未跟踪的文件意味着 Git 在之前的快照（提交）中没有这些文件；Git 不会自动将之纳入跟踪范围，除非你明明白白地告诉它“我需要跟踪该文件”。 这样的处理让你不必担心将生成的二进制文件或其它不想被跟踪的文件包含进来。 不过现在的例子中，我们确实想要跟踪管理 README 这个文件。

### 跟踪新文件
使用命令`git add`开始跟踪一个文件。 所以，要跟踪README文件，运行：
```shell
$ git add README
```
此时再运行`git status`命令，会看到README文件已被跟踪，并处于暂存状态：
```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)

    new file:   README
```
只要在`Changes to be committed`这行下面的，就说明是已暂存状态。 如果此时提交，那么该文件在你运行`git add`时的版本将被留存在后续的历史记录中。 你可能会想起之前我们使用`git init`后就运行了`git add <files>`命令，开始跟踪当前目录下的文件。`git add`命令使用文件或目录的路径作为参数；如果参数是目录的路径，该命令将递归地跟踪该目录下的所有文件。

### 暂存已修改的文件
现在我们来修改一个已被跟踪的文件。 如果你修改了一个名为`CONTRIBUTING.md`的已被跟踪的文件，然后运行`git status`命令，会看到下面内容：
```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```
文件`CONTRIBUTING.md`出现在`Changes not staged for commit`这行下面，说明已跟踪文件的内容发生了变化，但还没有放到暂存区。 要暂存这次更新，需要运行`git add`命令。 这是个多功能命令：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。 将这个命令理解为“精确地将内容添加到下一次提交中”而不是“将一个文件添加到项目中”要更加合适。 现在让我们运行 `git add`将“CONTRIBUTING.md”放到暂存区，然后再看看`git status`的输出：
```shell
$ git add CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md
```
现在两个文件都已暂存，下次提交时就会一并记录到仓库。 假设此时，你想要在 CONTRIBUTING.md 里再加条注释。 重新编辑存盘后，准备好提交。 不过且慢，再运行`git status`看看：
```shell
$ vim CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```
怎么回事？ 现在`CONTRIBUTING.md`文件同时出现在暂存区和非暂存区。 这怎么可能呢？ 好吧，实际上 Git 只不过暂存了你运行`git add`命令时的版本。 如果你现在提交，CONTRIBUTING.md 的版本是你最后一次运行`git add`命令时的那个版本，而不是你运行`git commit`时，在工作目录中的当前版本。 所以，运行了 `git add`之后又作了修订的文件，需要重新运行`git add`把最新版本重新暂存起来：
```shell
$ git add CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md
```

### 状态简览
`git status`命令的输出十分详细，但其用语有些繁琐。 Git 有一个选项可以帮你缩短状态命令的输出，这样可以以简洁的方式查看更改。 如果你使用`git status -s`命令或`git status --short`命令，你将得到一种格式更为紧凑的输出。
```shell
$ git status -s
 M README
MM Rakefile
A  lib/git.rb
M  lib/simplegit.rb
?? LICENSE.txt
```
新添加的未跟踪文件前面有`??`标记，新添加到暂存区中的文件前面有`A`标记，修改过的文件前面有`M`标记。 输出中有两栏，左栏指明了暂存区的状态，右栏指明了工作区的状态。例如，上面的状态报告显示： README 文件在工作区已修改但尚未暂存，而`lib/simplegit.rb`文件已修改且已暂存。`Rakefile`文件已修，暂存后又作了修改，因此该文件的修改中既有已暂存的部分，又有未暂存的部分。

### 忽略文件
一般我们总会有些文件无需纳入 Git 的管理，也不希望它们总出现在未跟踪文件列表。 通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。 在这种情况下，我们可以创建一个名为`.gitignore`的文件，列出要忽略的文件的模式。 来看一个实际的`.gitignore`例子：
```shell
$ cat .gitignore
*.[oa]
*~
```
第一行告诉 Git 忽略所有以`.o`或`.a`结尾的文件。一般这类对象文件和存档文件都是编译过程中出现的。 第二行告诉 Git 忽略所有名字以波浪符（~）结尾的文件，许多文本编辑软件（比如 Emacs）都用这样的文件名保存副本。 此外，你可能还需要忽略 log，tmp 或者 pid 目录，以及自动生成的文档等等。 要养成一开始就为你的新仓库设置好`.gitignore`文件的习惯，以免将来误提交这类无用的文件。

文件 .gitignore 的格式规范如下：
- 所有空行或者以`#`开头的行都会被 Git 忽略。
- 可以使用标准的`glob`模式匹配，它会递归地应用在整个工作区中。
- 匹配模式可以以（/）开头防止递归。
- 匹配模式可以以（/）结尾指定目录。
- 要忽略指定模式以外的文件或目录，可以在模式前加上叹号（!）取反。

所谓的`glob`模式是指`shell`所使用的简化了的正则表达式。 星号（*）匹配零个或多个任意字符；`[abc]`匹配任何一个列在方括号中的字符 （这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）； 问号（?）只匹配一个任意字符；如果在方括号中使用短划线分隔两个字符， 表示所有在这两个字符范围内的都可以匹配（比如`[0-9]`表示匹配所有 0 到 9 的数字）。 使用两个星号`（**）`表示匹配任意中间目录，比如`a/**/z`可以匹配 a/z 、 a/b/z 或 a/b/c/z 等。

我们再看一个`.gitignore`文件的例子：
```text
# 忽略所有的 .a 文件
*.a

# 但跟踪所有的 lib.a，即便你在前面忽略了 .a 文件
!lib.a

# 只忽略当前目录下的 TODO 文件，而不忽略 subdir/TODO
/TODO

# 忽略任何目录下名为 build 的文件夹
build/

# 忽略 doc/notes.txt，但不忽略 doc/server/arch.txt
doc/*.txt

# 忽略 doc/ 目录及其所有子目录下的 .pdf 文件
doc/**/*.pdf
```
>Tip
GitHub 有一个十分详细的针对数十种项目及语言的`.gitignore`文件列表， 你可以在 https://github.com/github/gitignore 找到它。

>Note
在最简单的情况下，一个仓库可能只根目录下有一个`.gitignore`文件，它递归地应用到整个仓库中。 然而，子目录下也可以有额外的`.gitignore`文件。子目录中的`.gitignore`文件中的规则只作用于它所在的目录中。 （Linux 内核的源码库拥有 206 个`.gitignore`文件。）

多个`.gitignore`文件的具体细节超出了本书的范围，更多详情见 man gitignore 。

### 查看已暂存和未暂存的修改
如果`git status`命令的输出对于你来说过于简略，而你想知道具体修改了什么地方，可以用`git diff`命令。 稍后我们会详细介绍`git diff`，你通常可能会用它来回答这两个问题：当前做的哪些更新尚未暂存？ 有哪些更新已暂存并准备好下次提交？ 虽然`git status`已经通过在相应栏下列出文件名的方式回答了这个问题，但`git diff`能通过文件补丁的格式更加具体地显示哪些行发生了改变。

假如再次修改 README 文件后暂存，然后编辑 CONTRIBUTING.md 文件后先不暂存， 运行`status`命令将会看到：
```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    modified:   README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```
要查看尚未暂存的文件更新了哪些部分，不加参数直接输入`git diff`：
```shell
$ git diff
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index 8ebb991..643e24f 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -65,7 +65,8 @@ branch directly, things can get messy.
 Please include a nice description of your changes when you submit your PR;
 if we have to read the whole diff to figure out why you're contributing
 in the first place, you're less likely to get feedback and have your change
-merged in.
+merged in. Also, split your changes into comprehensive chunks if your patch is
+longer than a dozen lines.

 If you are starting to work on a particular area, feel free to submit a PR
 that highlights your work in progress (and note in the PR title that it's
```
此命令比较的是工作目录中当前文件和暂存区域快照之间的差异。 也就是修改之后还没有暂存起来的变化内容。

若要查看已暂存的将要添加到下次提交里的内容，可以用`git diff --staged`命令。 这条命令将比对已暂存文件与最后一次提交的文件差异：
```shell
$ git diff --staged
diff --git a/README b/README
new file mode 100644
index 0000000..03902a1
--- /dev/null
+++ b/README
@@ -0,0 +1 @@
+My Project
```
请注意，`git diff`本身只显示尚未暂存的改动，而不是自上次提交以来所做的所有改动。 所以有时候你一下子暂存了所有更新过的文件，运行`git diff`后却什么也没有，就是这个原因。

像之前说的，暂存 CONTRIBUTING.md 后再编辑，可以使用`git status`查看已被暂存的修改或未被暂存的修改。 如果我们的环境（终端输出）看起来如下：
```shell
$ git add CONTRIBUTING.md
$ echo '# test line' >> CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    modified:   CONTRIBUTING.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```
现在运行`git diff`看暂存前后的变化：
```shell
$ git diff
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index 643e24f..87f08c8 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -119,3 +119,4 @@ at the
 ## Starter Projects

 See our [projects list](https://github.com/libgit2/libgit2/blob/development/PROJECTS.md).
+# test line
```
然后用`git diff --cached`查看已经暂存起来的变化（ --staged 和 --cached 是同义词）：
```shell
$ git diff --cached
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index 8ebb991..643e24f 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -65,7 +65,8 @@ branch directly, things can get messy.
 Please include a nice description of your changes when you submit your PR;
 if we have to read the whole diff to figure out why you're contributing
 in the first place, you're less likely to get feedback and have your change
-merged in.
+merged in. Also, split your changes into comprehensive chunks if your patch is
+longer than a dozen lines.

 If you are starting to work on a particular area, feel free to submit a PR
 that highlights your work in progress (and note in the PR title that it's
```

>Note
Git Diff 的插件版本
在本书中，我们使用`git diff`来分析文件差异。 但是你也可以使用图形化的工具或外部`diff`工具来比较差异。 可以使用`git difftool`命令来调用`emerge`或`vimdiff`等软件（包括商业软件）输出`diff`的分析结果。 使用`git difftool --tool-help`命令来看你的系统支持哪些`Git Diff`插件。

### 提交更新
现在的暂存区已经准备就绪，可以提交了。 在此之前，请务必确认还有什么已修改或新建的文件还没有`git add`过， 否则提交的时候不会记录这些尚未暂存的变化。 这些已修改但未暂存的文件只会保留在本地磁盘。 所以，每次准备提交前，先用`git status`看下，你所需要的文件是不是都已暂存起来了， 然后再运行提交命令 `git commit`：
```shell
$ git commit
```
这样会启动你选择的文本编辑器来输入提交说明。
当使用`git commit`进行提交操作时，Git 会先计算每一个子目录（本例中只有项目根目录）的校验和， 然后在 Git 仓库中这些校验和保存为树对象。随后，Git 便会创建一个提交对象，

>Note
启动的编辑器是通过 Shell 的环境变量 EDITOR 指定的，一般为 vim 或 emacs。 当然也可以按照 起步 介绍的方式， 使用`git config --global core.editor`命令设置你喜欢的编辑器。

编辑器会显示类似下面的文本信息（本例选用 Vim 的屏显方式展示）：
```text
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch master
# Your branch is up-to-date with 'origin/master'.
#
# Changes to be committed:
#	new file:   README
#	modified:   CONTRIBUTING.md
#
~
~
~
".git/COMMIT_EDITMSG" 9L, 283C
```
可以看到，默认的提交消息包含最后一次运行`git status`的输出，放在注释行里，另外开头还有一个空行，供你输入提交说明。 你完全可以去掉这些注释行，不过留着也没关系，多少能帮你回想起这次更新的内容有哪些。

>Note
更详细的内容修改提示可以用 -v 选项查看，这会将你所作的更改的 diff 输出呈现在编辑器中，以便让你知道本次提交具体作出哪些修改。

退出编辑器时，<font color="red">Git 会丢弃注释行，用你输入的提交说明生成一次提交。</font>

另外，你也可以在`commit`命令后添加`-m`选项，将提交信息与命令放在同一行，如下所示：
```shell
$ git commit -m "Story 182: Fix benchmarks for speed"
[master 463dc4f] Story 182: Fix benchmarks for speed
 2 files changed, 2 insertions(+)
 create mode 100644 README
```
好，现在你已经创建了第一个提交！ 可以看到，提交后它会告诉你，当前是在哪个分支（master）提交的，本次提交的完整 SHA-1 校验和是什么（463dc4f），以及在本次提交中，有多少文件修订过，多少行添加和删改过。

请记住，提交时记录的是放在暂存区域的快照。 任何还未暂存文件的仍然保持已修改状态，可以在下次提交时纳入版本管理。 每一次运行提交操作，都是对你项目作一次快照，以后可以回到这个状态，或者进行比较。

### 跳过使用暂存区域
尽管使用暂存区域的方式可以精心准备要提交的细节，但有时候这么做略显繁琐。 Git 提供了一个跳过使用暂存区域的方式， 只要在提交的时候，给`git commit`加上`-a`选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过`git add`步骤：
```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md

no changes added to commit (use "git add" and/or "git commit -a")
$ git commit -a -m 'added new benchmarks'
[master 83e38c7] added new benchmarks
 1 file changed, 5 insertions(+), 0 deletions(-)
```
看到了吗？提交之前不再需要`git add`文件“CONTRIBUTING.md”了。 这是因为`-a`选项使本次提交包含了所有修改过的文件。 这很方便，但是要小心，有时这个选项会将不需要的文件添加到提交中。

### 移除文件
`git rm`命令用于删除文件。

如果只是简单地从工作目录中手工删除文件，运行`git status`时就会在`Changes not staged for commit `的提示。
```bash
$ rm PROJECTS.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    PROJECTS.md

no changes added to commit (use "git add" and/or "git commit -a")
```

`git rm`删除文件有以下几种形式：

1. 将文件从暂存区和工作区中删除：
```bash
git rm <file>
```
以下实例从暂存区和工作区中删除`runoob.txt`文件：
```bash
git rm runoob.txt 
```
如果删除之前修改过并且已经放到暂存区域的话，则必须要用强制删除选项`-f`。

强行从暂存区和工作区中删除修改后的 `runoob.txt` 文件：
```bash
git rm -f runoob.txt 
```
如果想把文件从暂存区域移除，但仍然希望保留在当前工作目录中，换句话说，仅是从跟踪清单中删除，使用--cached`选项即可：
```bash
git rm --cached <file>
```
以下实例从暂存区中删除`runoob.txt`文件：
```bash
git rm --cached runoob.txt
```

#### 实例
删除`hello.php`文件：
```bash
$ git rm hello.php 
rm 'hello.php'
$ ls
README
```

文件从暂存区域移除，但工作区保留：
```bash
$ git rm --cached README 
rm 'README'
$ ls
README
```

可以递归删除，即如果后面跟的是一个目录做为参数，则会递归删除整个目录中的所有子目录和文件：
```bash
git rm –r * 
```
进入某个目录中，执行此语句，会删除该目录下的所有文件和子目录。

### 移动文件
不像其它的 VCS 系统，Git 并不显式跟踪文件移动操作。 如果在 Git 中重命名了某个文件，仓库中存储的元数据并不会体现出这是一次改名操作。 不过 Git 非常聪明，它会推断出究竟发生了什么，至于具体是如何做到的，我们稍后再谈。

既然如此，当你看到 Git 的`mv`命令时一定会困惑不已。 要在 Git 中对文件改名，可以这么做：
```shell
$ git mv file_from file_to
```
它会恰如预期般正常工作。 实际上，即便此时查看状态信息，也会明白无误地看到关于重命名操作的说明：
```shell
$ git mv README.md README
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
```
其实，运行`git mv`就相当于运行了下面三条命令：
```shell
$ mv README.md README
$ git rm README.md
$ git add README
```
如此分开操作，Git 也会意识到这是一次重命名，所以不管何种方式结果都一样。 两者唯一的区别是，`mv`是一条命令而非三条命令，直接用`git mv`方便得多。 不过有时候用其他工具批处理重命名的话，要记得在提交前删除旧的文件名，再添加新的文件名。

## 撤消操作
### 重写历史
许多时候，在使用 Git 时，你可能想要修订提交历史。 Git 很棒的一点是它允许你在最后时刻做决定。 你可以在将暂存区内容提交前决定哪些文件进入提交，可以通过 git stash 来决定不与某些内容工作， 也可以重写已经发生的提交就像它们以另一种方式发生的一样。 这可能涉及改变提交的顺序，改变提交中的信息或修改文件，将提交压缩或是拆分， 或完全地移除提交——在将你的工作成果与他人共享之前。

在本节中，你可以学到如何完成这些工作，这样在与他人分享你的工作成果时你的提交历史将如你所愿地展示出来。
> Note
在满意之前不要推送你的工作
Git 的基本原则之一是，由于克隆中有很多工作是本地的，因此你可以 在本地 随便重写历史记录。 然而一旦推送了你的工作，那就完全是另一回事了，除非你有充分的理由进行更改，否则应该将推送的工作视为最终结果。 简而言之，在对它感到满意并准备与他人分享之前，应当避免推送你的工作。

#### 修改最后一次提交
修改你最近一次提交可能是所有修改历史提交的操作中最常见的一个。 对于你的最近一次提交，你往往想做两件事情：简单地修改提交信息， 或者通过添加、移除或修改文件来更改提交实际的内容。
如果，你只是想修改最近一次提交的提交信息，那么很简单：
```
$ git commit --amend
```
上面这条命令会将最后一次的提交信息载入到编辑器中供你修改。 当保存并关闭编辑器后，编辑器会将更新后的提交信息写入新提交中，它会成为新的最后一次提交。
另一方面，如果你想要修改最后一次提交的实际内容，那么流程很相似：首先作出你想要补上的修改， 暂存它们，然后用 git commit --amend 以新的改进后的提交来 替换 掉旧有的最后一次提交，
使用这个技巧的时候需要小心，因为修正会改变提交的 SHA-1 校验和。 它类似于一个小的变基——如果已经推送了最后一次提交就不要修正它。

> Tip
修补后的提交可能需要修补提交信息
当你在修补一次提交时，可以同时修改提交信息和提交内容。 如果你修补了提交的内容，那么几乎肯定要更新提交消息以反映修改后的内容。
另一方面，如果你的修补是琐碎的（如修改了一个笔误或添加了一个忘记暂存的文件）， 那么之前的提交信息不必修改，你只需作出更改，暂存它们，然后通过以下命令避免不必要的编辑器环节即可：
```
$ git commit --amend --no-edit
```

### 取消暂存的文件
接下来的两个小节演示如何操作暂存区和工作目录中已修改的文件。 这些命令在修改文件状态的同时，也会提示如何撤消操作。 例如，你已经修改了两个文件并且想要将它们作为两次独立的修改提交， 但是却意外地输入 `git add *`暂存了它们两个。如何只取消暂存两个中的一个呢？`git status`命令提示了你：
```shell
$ git add *
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
    modified:   CONTRIBUTING.md
```
在`“Changes to be committed”`文字正下方，提示使用`git reset HEAD <file>...`来取消暂存。 所以，我们可以这样来取消暂存 CONTRIBUTING.md 文件：
```shell
$ git reset HEAD CONTRIBUTING.md
Unstaged changes after reset:
M	CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```
这个命令有点儿奇怪，但是起作用了。 CONTRIBUTING.md 文件已经是修改未暂存的状态了。

### 撤消对文件的修改
如果你并不想保留对 CONTRIBUTING.md 文件的修改怎么办？ 你该如何方便地撤消修改——将它还原成上次提交时的样子（或者刚克隆完的样子，或者刚把它放入工作目录时的样子）？ 幸运的是，`git status`也告诉了你应该如何做。 在最后一个例子中，未暂存区域是这样：
```shell
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```
它非常清楚地告诉了你如何撤消之前所做的修改。 让我们来按照提示执行：
```shell
$ git checkout -- CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
```
可以看到那些修改已经被撤消了。

> Important
请务必记得`git checkout -- <file>`是一个危险的命令。 你对那个文件在本地的任何修改都会消失——Git 会用最近提交的版本覆盖掉它。 除非你确实清楚不想要对那个文件的本地修改了，否则请不要使用这个命令。

如果你仍然想保留对那个文件做出的修改，但是现在仍然需要撤消，我们将会在 Git 分支 介绍保存进度与分支，这通常是更好的做法。

记住，在 Git 中任何 已提交 的东西几乎总是可以恢复的。 甚至那些被删除的分支中的提交或使用 `--amend`选项覆盖的提交也可以恢复 （阅读 数据恢复 了解数据恢复）。 然而，任何你未提交的东西丢失后很可能再也找不到了。

### reset
`git reset --soft 提交对象A`: 设置HEAD与HEAD指向的分支的指向为`提交对象A`, 而不改变索引区的指向，即不修改.git/index文件内容, 也不改变本地目录
`git reset 提交对象A`: 设置HEAD与HEAD指向的分支的指向为`提交对象A`, 同时根据`提交对象A`指向的内容来改变索引区的指向，即修改.git/index文件内容, 但不改变本地目录
`git reset --herd 提交对象A`: 设置HEAD与HEAD指向的分支的指向为`提交对象A`, 同时根据`提交对象A`指向的内容来改变索引区的指向以及本地目录

### checkout
运行`git checkout [branch]`与运行`git reset --hard [branch]`非常相似，不过有两点重要的区别。

首先不同于`reset --hard`，`checkout`对工作目录是安全的，它会通过检查来确保不会将已更改的文件弄丢。 其实它还更聪明一些。它会在工作目录中先试着简单合并一下，这样所有 还未修改过的 文件都会被更新。 而`reset --hard`则会不做检查就全面地替换所有东西。

第二个重要的区别是`checkout`如何更新`HEAD`。 reset 会移动 HEAD 分支的指向，而 checkout 只会移动 HEAD 自身来指向另一个分支。
例如，假设我们有 master 和 develop 分支，它们分别指向不同的提交；我们现在在 develop 上（所以 HEAD 指向它）。 如果我们运行 git reset master，那么 develop 自身现在会和 master 指向同一个提交。 而如果我们运行 git checkout master 的话，develop 不会移动，HEAD 自身会移动。 现在 HEAD 将会指向 master。
所以，虽然在这两种情况下我们都移动 HEAD 使其指向了提交 A，但 做法 是非常不同的。 reset 会移动 HEAD 分支的指向，而 checkout 则移动 HEAD 自身。

### reflog
`git reflog`与`git log`的区别
`git log`: 如果不适用--all参数, 只会展示当前分支指向的提交对象以及其所有祖先提交对象
`git reflog`会展示所有的提交对象


## Git Diff
### "合并格式"的diff
如果两个文件相似度很高，那么上下文格式的diff，将显示大量重复的内容，很浪费空间。1990年，GNU diff率先推出了"合并格式"的diff，将f1和f2的上下文合并在一起显示。
它的使用方法是加入u参数（代表unified）。
```shell
$ diff -u f1 f2
```
显示结果如下：
```shell
　　--- f1 2012-08-29 16:45:41.000000000 +0800
　　+++ f2 2012-08-29 16:45:51.000000000 +0800
　　@@ -1,7 +1,7 @@
　　 a
　　 a
　　 a
　　-a
　　+b
　　 a
　　 a
　　 a
```
它的第一部分，也是文件的基本信息。
```shell
　　--- f1 2012-08-29 16:45:41.000000000 +0800
　　+++ f2 2012-08-29 16:45:51.000000000 +0800
```
"---"表示变动前的文件，"+++"表示变动后的文件。
第二部分，变动的位置用两个@作为起首和结束。
```shell
　　@@ -1,7 +1,7 @@
```
前面的"-1,7"分成三个部分：减号表示第一个文件（即f1），"1"表示第1行，"7"表示连续7行。合在一起，就表示下面是第一个文件从第1行开始的连续7行。同样的，"+1,7"表示变动后，成为第二个文件从第1行开始的连续7行。

第三部分是变动的具体内容。
```
　　 a
　　 a
　　 a
　　-a
　　+b
　　 a
　　 a
　　 a
```
除了有变动的那些行以外，也是上下文各显示3行。它将两个文件的上下文，合并显示在一起，所以叫做"合并格式"。每一行最前面的标志位，空表示无变动，减号表示第一个文件删除的行，加号表示第二个文件新增的行。

### git格式的diff
版本管理系统git，使用的是合并格式diff的变体。
```shell
　　$ git diff
```
显示结果如下：
```shell
　　diff --git a/f1 b/f1
　　index 6f8a38c..449b072 100644
　　--- a/f1
　　+++ b/f1
　　@@ -1,7 +1,7 @@
　　 a
　　 a
　　 a
　　-a
　　+b
　　 a
　　 a
　　 a
```
第一行表示结果为git格式的diff。
```shell
　　diff --git a/f1 b/f1
```
进行比较的是，a版本的f1（即变动前）和b版本的f1（即变动后）。

第二行表示两个版本的git哈希值（index区域的6f8a38c对象，与工作目录区域的449b072对象进行比较），最后的六位数字是对象的模式（普通文件，644权限）。
```
　　index 6f8a38c..449b072 100644
```
第三行表示进行比较的两个文件。
```
　　--- a/f1
　　+++ b/f1
```
"---"表示变动前的版本，"+++"表示变动后的版本。

后面的行都与官方的合并格式diff相同。
```
　　@@ -1,7 +1,7 @@
　　 a
　　 a
　　 a
　　-a
　　+b
　　 a
　　 a
　　 a
```
### git diff 命令常用技巧
#### git diff
当我们直接修改了工作区中的文件之后，在添加到暂存区之前，想要看看修改了那些内容，保证修改正确性。这时候运行 git diff 即可，将会显示暂存区与工作区文件的差异。如下图就是一个示例：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105111.png)

可以看到工作区的 test.txt 文件比暂存区 test.txt 文件新增了一行内容。

#### git diff commit
比较「工作区」与「给定提交 ID」的差异。

有时候你需要将工作区的改动和历史中某个提交点的内容进行对比，这个命令就有用了。例如，我要将目前工作区的内容和当前分支的最新一次的提交进行比较，运行 git diff 3f0c1b 或者 git diff HEAD 即可：

#### git diff --cached commit
比较「暂存区」与「给定提交 ID」的差异。

因为已经将修改内容添加到暂存区了，这时候直接运行 git diff 就看不到差异了。因为我们手速快，已经将工作区修改的文件通过 git add 命令添加到暂存区了，这时候，又想要知道暂存区的变更和给定提交点的差异。只需要加上 --cached 选项即可。

例如，我现在将上面的修改已经添加到了暂存区，运行 git diff --cached HEAD 即可将暂存区内容与最新一次提交进行比较

> 如果省略 commit，那么，就是默认指 HEAD。

#### git diff commit1 commit2
比较指定的两次提交 「commit1」与 「commit2」的差异。

#### 补丁 patch
补丁名是自定义的，通常带有 patch 命名，这样命名比较通俗易懂。

前面介绍的 4 中比较差异的场景，我们可以通过比较差异的命令加上`> patch`这样的方式导出补丁文件。这里的 patch 就是自定义的补丁名。
我们来进行一个示例。使用`git diff HEAD~ HEAD`> patch 导出上一次提交和这一次提交差异的补丁。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105123.png)

运行上述命令之后，会生成一个叫 patch 补丁文件。

怎么用这个补丁呢？示例：
```shell
# 切换至倒数第 2 个提交
git reset --hard HEAD~
# 应用一下补丁
git apply patch
```
这时候刚刚差异的内容就会在相应的文件夹进行修改了，但是并不会生成提交。

>补丁文件可以发给其他人，只需执行 git apply patch 就可以实现打补丁的效果喽。

在打补丁之前，可以先检验补丁能否应用，执行 git apply --check patch 即可。如果没有任何输出，那么表示可以顺利打补丁。

#### 限制路径
如果只要显示 src 文件夹下的差异，指定文件夹名即可， `git diff --stat HEAD~ HEAD src`, 比较HEAD~与HEAD下的src文件夹的差异
如果只要显示 test.txt 文件的差异，指定文件即可， `git diff HEAD~ HEAD src/test.txt`，比较HEAD~与HEAD下的src/test.txt文件的差异

### git diff中的a/和b/前缀含义
如 git diff man中所述页，a/et b/代表区分来源和目的地的前缀.
实际上，您可以选择:
```
--no-prefix
```
不显示任何源或目标前缀.
```
--src-prefix=<prefix>
```
显示给定的源前缀，而不是"a/".
```
--dst-prefix=<prefix>
```
显示给定的目标前缀，而不是"b/"

## Git中的~和^
简言之，单独使用时，~表示纵深位置，^表示横向位置。
为什么加单独使用限定呢，多个符号叠加的语义是增加纵深。如`HEAD^^`==`HEAD~~`==`HEAD~2`

### 为何需要 ~ 和 ^
不知道大家有没体会到，我们经常需要根据一个提交去查找它的祖先提交，如查找 HEAD 的第三个祖先提交。
要找到对应的提交，我们可以直接通过 git log，然后手动选中第三个提交。
```
$ git log --graph --oneline
* a19bf31 D
* 85ce81b C
* 73d1f3b B
* 078e0e6 A
...
```
然后我们选中 078e0e6 (A) 这个提交，接着进行余下的操作。
这种方式虽然可以实现我们的需求，如果我们想要 HEAD 的第 10 个祖先提交呢？那是要把 log 打印出来，然后一条一条慢慢找吗？这样的话就太低效了。
我们需要有一种方式，根据一个提交快速找到它的祖先提交，因此，我们就需要 ~ 和 ^ 这两个符号拉。

### ~ 的作用
如果我们想要 HEAD 的第 10 个祖先提交，我们直接用 HEAD~10 就可以了。`<rev>~<n>`用来表示一个提交的第 n 个祖先提交，如果不指定 n，那么默认为 1。另外，HEAD~~~ 和 HEAD~3 是等价的。
``` 
$ git rev-parse HEAD
a19bf31 (D)
$ git rev-parse HEAD~0
a19bf31 (D)
$ git rev-parse HEAD~
85ce81b (C)
$ git rev-parse HEAD~1
85ce81b (C)
$ git rev-parse HEAD~~
73d1f3b (B)
$ git rev-parse HEAD~3
078e0e6 (A) 
```

### ^ 的作用
先看看下面这幅图：
``` 
$ git log --graph --oneline
* f44239d D
* 7a3fb3d C
|\
| * 07b920c B
|/
* 71bd2cf A
...
```
我们知道，很多情况下一个提交并不是只有一个父提交。就如上图表示那样，7a3fb3d (C) 就有两个父提交：
```
07b920c (B)
71bd2cf (A)。
```
这时候，我们是不能通过 ~ 去找到 07b920c (B) 这个提交的。如果一个提交有多个父提交，那么 ~ 只会找第一个父提交, **在`git log --oneline --graph`命令输出中父提交的产生先后顺序是从左至右的**,那么我们应该怎么找到 07b920c (B) 呢？答案是：HEAD~^2
`<rev>^<n>` 用来表示一个提交的第 n 个父提交，如果不指定 n，那么默认为 1。和 ~ 不同的是，HEAD^^^ 并不等价于 HEAD^3，而是等价与 HEAD^1^1^1。
``` 
$ git rev-parse HEAD~
7a3fb3d (C)
$ git rev-parse HEAD~^
71bd2cf (A)
$ git rev-parse HEAD~^0
7a3fb3d (C)
$ git rev-parse HEAD~^2
07b920c (B)
$ git rev-parse HEAD~^3
fatal: ambiguous argument 'HEAD~^3': unknown revision or path not in the working tree.
$ git rev-parse HEAD^2
fatal: ambiguous argument 'HEAD^2': unknown revision or path not in the working tree.
```

### ~ 与 ^ 的关系
我们知道，~ 获取第一个祖先提交，^ 可以获取第一个父提交。
其实第一个祖先提交就是第一个父提交，反之亦然。
因此，当 n 为 1 时，~ 和 ^ 其实是等价的。
譬如：HEAD~~~ 和 HEAD^^^ 是等价的。

# Git分支
## 分支简介
为了真正理解 Git 处理分支的方式，我们需要回顾一下 Git 是如何保存数据的。

或许你还记得 起步 的内容， Git 保存的不是文件的变化或者差异，而是一系列不同时刻的 快照 。

在进行提交操作时，Git 会保存一个提交对象（commit object）。 知道了 Git 保存数据的方式，我们可以很自然的想到——该提交对象会包含一个指向暂存内容快照的指针。 但不仅仅是这样，该提交对象还包含了作者的姓名和邮箱、提交时输入的信息以及指向它的父对象的指针。 首次提交产生的提交对象没有父对象，普通提交操作产生的提交对象有一个父对象， 而由多个分支合并产生的提交对象有多个父对象，

为了更加形象地说明，我们假设现在有一个工作目录，里面包含了三个将要被暂存和提交的文件。 暂存操作会为每一个文件计算校验和（使用我们在 起步 中提到的 SHA-1 哈希算法），然后会把当前版本的文件快照保存到 Git 仓库中 （Git 使用 blob 对象来保存它们），最终将校验和加入到暂存区域等待提交：
```shell
$ git add README test.rb LICENSE
$ git commit -m 'The initial commit of my project'
```
当使用`git commit`进行提交操作时，Git 会先计算每一个子目录（本例中只有项目根目录）的校验和， 然后在 Git 仓库中这些校验和保存为树对象。随后，Git 便会创建一个提交对象， 它除了包含上面提到的那些信息外，还包含指向这个树对象（项目根目录）的指针。 如此一来，Git 就可以在需要的时候重现此次保存的快照。

现在，Git 仓库中有五个对象：三个`blob`对象（保存着文件快照）、一个`树`对象 （记录着目录结构和 blob 对象索引）以及一个`提交`对象（包含着指向前述树对象的指针和所有提交信息）。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105138.png)

做些修改后再次提交，那么这次产生的提交对象会包含一个指向上次提交对象（父对象）的指针。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105150.png)

<font color="red">Git 的分支，其实本质上仅仅是指向提交对象的可变指针。</font> Git 的默认分支名字是 master。 在多次提交操作之后，你其实已经有一个指向最后那个提交对象的 master 分支。 master 分支会在每次提交时自动向前移动。

>Note
Git 的 master 分支并不是一个特殊分支。 它就跟其它分支完全没有区别。 之所以几乎每一个仓库都有 master 分支，是因为 git init 命令默认创建它，并且大多数人都懒得去改动它。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105200.png)

### 分支创建
Git 是怎么创建新分支的呢？ 很简单，它只是为你创建了一个可以移动的新的指针。 比如，创建一个 testing 分支， 你需要使用`git branch`命令：
```shell
$ git branch testing
```
这会在当前所在的提交对象上创建一个指针。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105210.png)

那么，Git 又是怎么知道当前在哪一个分支上呢？ 也很简单，它有一个名为`HEAD`的特殊指针。 请注意它和许多其它版本控制系统（如 Subversion 或 CVS）里的 HEAD 概念完全不同。 在 Git 中，它是一个指针，指向当前所在的本地分支（译注：将`HEAD`想象为当前分支的别名）。 在本例中，你仍然在`master`分支上。 因为`git branch`命令仅仅 创建 一个新分支，并不会自动切换到新分支中去。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105222.png)

你可以简单地使用`git log`命令查看各个分支当前所指的对象。 提供这一功能的参数是`--decorate`。
```shell
$ git log --oneline --decorate
f30ab (HEAD -> master, testing) add feature #32 - ability to add new formats to the central interface
34ac2 Fixed bug #1328 - stack overflow under certain conditions
98ca9 The initial commit of my project
```
正如你所见，当前`master`和`testing`分支均指向校验和以`f30ab`开头的提交对象。

### 分支切换
要切换到一个已存在的分支，你需要使用`git checkout`命令。 我们现在切换到新创建的`testing`分支去：
```shell
$ git checkout testing
```
这样 HEAD 就指向 testing 分支了。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105233.png)

那么，这样的实现方式会给我们带来什么好处呢？ 现在不妨再提交一次：
```shell
$ vim test.rb
$ git commit -a -m 'made a change'
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105243.png)

如图所示，你的`testing`分支向前移动了，但是`master`分支却没有，它仍然指向运行`git checkout`时所指的对象。 这就有意思了，现在我们切换回`master`分支看看：
```shell
$ git checkout master
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409105254.png)

这条命令做了两件事。 一是使`HEAD`指回`master`分支，二是将工作目录恢复成`master`分支所指向的快照内容。 也就是说，你现在做修改的话，项目将始于一个较旧的版本。 本质上来讲，这就是忽略`testing`分支所做的修改，以便于向另一个方向进行开发。

> Note
<font color="red">分支切换会改变你工作目录中的文件，也会改变暂存区中的内容</font>
在切换分支时，一定要注意你工作目录里的文件会被改变。 如果是切换到一个较旧的分支，你的工作目录会恢复到该分支最后一次提交时的样子。 如果 Git 不能干净利落地完成这个任务，它将禁止切换分支。但是当一个文件<font color="red">第一次</font>创建并未追踪，或者<font color="red">第一次</font>将其放入暂存区中但未提交时，分支是可以切换成功的，但是会导致这个文件依然存在其他分支中的工作目录中，从而污染其他分支
所以切换分支前，当前分支一定是干净的（以提交状态）， 使用`git status`查看，
```shell
$ git status
On branch test
nothing to commit, working tree clean
```
上述输出说明当前分支是干净的


我们不妨再稍微做些修改并提交：
```shell
$ vim test.rb
$ git commit -a -m 'made other changes'
```
现在，这个项目的提交历史已经产生了分叉（参见 项目分叉历史）。 因为刚才你创建了一个新分支，并切换过去进行了一些工作，随后又切换回`master`分支进行了另外一些工作。 上述两次改动针对的是不同分支：你可以在不同分支间不断地来回切换和工作，并在时机成熟时将它们合并起来。 而所有这些工作，你需要的命令只有`branch`、`checkout`和`commit`。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104740.png)

你可以简单地使用 git log 命令查看分叉历史。 运行`git log --oneline --decorate --graph --all`，它会输出你的提交历史、各个分支的指向以及项目的分支分叉情况。
```shell
$ git log --oneline --decorate --graph --all
* c2b9e (HEAD, master) made other changes
| * 87ab2 (testing) made a change
|/
* f30ab add feature #32 - ability to add new formats to the
* 34ac2 fixed bug #1328 - stack overflow under certain conditions
* 98ca9 initial commit of my project
```
由于 Git 的分支实质上仅是包含所指对象校验和（长度为 40 的 SHA-1 值字符串）的文件，所以它的创建和销毁都异常高效。 创建一个新分支就相当于往一个文件中写入 41 个字节（40 个字符和 1 个换行符），如此的简单能不快吗？

这与过去大多数版本控制系统形成了鲜明的对比，它们在创建分支时，将所有的项目文件都复制一遍，并保存到一个特定的目录。 完成这样繁琐的过程通常需要好几秒钟，有时甚至需要好几分钟。所需时间的长短，完全取决于项目的规模。 而在 Git 中，任何规模的项目都能在瞬间创建新分支。 同时，由于每次提交都会记录父对象，所以寻找恰当的合并基础（译注：即共同祖先）也是同样的简单和高效。 这些高效的特性使得 Git 鼓励开发人员频繁地创建和使用分支。

接下来，让我们看看你为什么应该这样做。

>Note
创建新分支的同时切换过去
通常我们会在创建一个新分支后立即切换过去，这可以用`git checkout -b <newbranchname>`一条命令搞定。


### git切换分支内容相互影响解决方案
#### 问题描述：
在 dev 分支开发需求过程中，突然插入 另一个紧急需求，需要新建 fix 分支处理紧急需求，切换到fix分支后，发现 dev分支中更改的内容也存在。

#### 问题原因:
如果当前分支所做的修改没有提交的话去其他分支也会看到相同的修改。

#### 解决办法：
1. 如果当前功能已开发完成，直接 git add => git commit => git status 检查工作区和暂存区是干净的，然后 git push 提交到远程仓库即可。
2. 但很多情况下，是当前功能尚未开发完成，不能直接提交，这个时候可以先把当前分支工作现场保存起来，等开发完紧急需求之后，再切回来继续开发当前需求。操作如下：

git add 后，使用 git stash 隐藏当前工作区，此时git status检查 工作区是干净的，就可以切到新的分支了；那git stash隐藏之后如何恢复工作现场呢？可先用 git stash list 查看隐藏的工作现场，然后再恢复。

恢复有两种方式：
1. git stash apply 恢复最近保存的现场，但是stash内容不会删除(git stash list还会显示保存的信息)，需要使用 git stash drop 来删除；
2. git stash pop 恢复现场的同时也把stash中内容删掉(git stash list 不会显示保存的信息)；
如果之前保存了多个工作场景，即 git stash list 下有多条信息，可通过
```
git stash apply stash@{0}
git stash apply stash@{1}
...
git stash pop stash@{0}
git stash pop stash@{1}
```
完整流程参考：
```bash
# 在dev 分支
$ git add .
$ git commit -m '注释'

# 把文件修改藏起来，将工作区清理干净
$ git stash

# 再创建 fix 分支
$ git checkout -b fix

# 在fix分支 验证，工作区很干净
$ git status
On branch fix
nothing to commit, working tree clean


# 在 fix 分支上干完活后，切回dev 分支，
## 在dev分支， 恢复之前隐藏的文件
$ git stash apply stash@{0}

## 删除隐藏的备份
git stash drop
```

## 分支的新建与合并
让我们来看一个简单的分支新建与分支合并的例子，实际工作中你可能会用到类似的工作流。 你将经历如下步骤：
- 开发某个网站。
- 为实现某个新的用户需求，创建一个分支。
- 在这个分支上开展工作。

正在此时，你突然接到一个电话说有个很严重的问题需要紧急修补。 你将按照如下方式来处理：
- 切换到你的线上分支（production branch）。
- 为这个紧急任务新建一个分支，并在其中修复它。
- 在测试通过之后，切换回线上分支，然后合并这个修补分支，最后将改动推送到线上分支。
- 切换回你最初工作的分支上，继续工作。

### 新建分支
首先，我们假设你正在你的项目上工作，并且在`master`分支上已经有了一些提交。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104058.png)

现在，你已经决定要解决你的公司使用的问题追踪系统中的 #53 问题。 想要新建一个分支并同时切换到那个分支上，你可以运行一个带有`-b`参数的`git checkout`命令：
```shell
$ git checkout -b iss53
Switched to a new branch "iss53"
```
它是下面两条命令的简写：
```shell
$ git branch iss53
$ git checkout iss53
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104109.png)

你继续在 #53 问题上工作，并且做了一些提交。 在此过程中，`iss53`分支在不断的向前推进，因为你已经检出到该分支 （也就是说，你的`HEAD`指针指向了`iss53`分支）
```shell
$ vim index.html
$ git commit -a -m 'added a new footer [issue 53]'
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104118.png)

现在你接到那个电话，有个紧急问题等待你来解决。 有了 Git 的帮助，你不必把这个紧急问题和`iss53`的修改混在一起， 你也不需要花大力气来还原关于 53# 问题的修改，然后再添加关于这个紧急问题的修改，最后将这个修改提交到线上分支。 你所要做的仅仅是切换回`master`分支。

但是，在你这么做之前，要留意你的工作目录和暂存区里那些还没有被提交的修改， 它可能会和你即将检出的分支产生冲突从而阻止 Git 切换到该分支。 最好的方法是，在你切换分支之前，保持好一个干净的状态。 有一些方法可以绕过这个问题（即，暂存（stashing） 和 修补提交（commit amending））， 我们会在 贮藏与清理 中看到关于这两个命令的介绍。 现在，我们假设你已经把你的修改全部提交了，这时你可以切换回 master 分支了：
```shell
$ git checkout master
Switched to branch 'master'
```
这个时候，你的工作目录和你在开始 #53 问题之前一模一样，现在你可以专心修复紧急问题了。 请牢记：当你切换分支的时候，Git 会重置你的工作目录，使其看起来像回到了你在那个分支上最后一次提交的样子。 Git 会自动添加、删除、修改文件以确保此时你的工作目录和这个分支最后一次提交时的样子一模一样。

接下来，你要修复这个紧急问题。 我们来建立一个`hotfix`分支，在该分支上工作直到问题解决：
```shell
$ git checkout -b hotfix
Switched to a new branch 'hotfix'
$ vim index.html
$ git commit -a -m 'fixed the broken email address'
[hotfix 1fb7853] fixed the broken email address
 1 file changed, 2 insertions(+)
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104128.png)

你可以运行你的测试，确保你的修改是正确的，然后将 hotfix 分支合并回你的 master 分支来部署到线上。 你可以使用 git merge 命令来达到上述目的：
```shell
$ git checkout master
$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
```
在合并的时候，你应该注意到了`“快进（fast-forward）”`这个词。 由于你想要合并的分支`hotfix`所指向的提交 C4 是你所在的提交 C2 的直接后继， 因此 Git 会直接将指针向前移动。换句话说，当你试图合并两个分支时， 如果顺着一个分支走下去能够到达另一个分支，那么 Git 在合并两者的时候， 只会简单的将指针向前推进（指针右移），因为这种情况下的合并操作没有需要解决的分歧——这就叫做 `“快进（fast-forward）”`。

现在，最新的修改已经在`master`分支所指向的提交快照中，你可以着手发布该修复了。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104154.png)

关于这个紧急问题的解决方案发布之后，你准备回到被打断之前时的工作中。 然而，你应该先删除`hotfix`分支，因为你已经不再需要它了 ——`master`分支已经指向了同一个位置。 你可以使用带`-d`选项的`git branch`命令来删除分支：
```shell
$ git branch -d hotfix
Deleted branch hotfix (3a0874c).
```
现在你可以切换回你正在工作的分支继续你的工作，也就是针对 #53 问题的那个分支（iss53 分支）。
```shell
$ git checkout iss53
Switched to branch "iss53"
$ vim index.html
$ git commit -a -m 'finished the new footer [issue 53]'
[iss53 ad82d7a] finished the new footer [issue 53]
1 file changed, 1 insertion(+)
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104204.png)

你在`hotfix`分支上所做的工作并没有包含到`iss53`分支中。 如果你需要拉取`hotfix`所做的修改，你可以使用`git merge master`命令将`master`分支合并入`iss53`分支，或者你也可以等到`iss53`分支完成其使命，再将其合并回`master`分支。

### 分支的合并
假设你已经修正了 #53 问题，并且打算将你的工作合并入`master`分支。 为此，你需要合并`iss53`分支到`master`分支，这和之前你合并`hotfix`分支所做的工作差不多。 你只需要检出到你想合并入的分支，然后运行`git merge`命令：
```shell
$ git checkout master
Switched to branch 'master'
$ git merge iss53
Merge made by the 'recursive' strategy.
index.html |    1 +
1 file changed, 1 insertion(+)
```

这和你之前合并`hotfix`分支的时候看起来有一点不一样。 在这种情况下，你的开发历史从一个更早的地方开始分叉开来（diverged）。** 因为，`master`分支所在提交并不是`iss53`分支所在提交的直接祖先，Git 不得不做一些额外的工作。 出现这种情况的时候，Git 会使用两个分支的末端所指的快照（C4 和 C5）以及这两个分支的公共祖先（C2），做一个简单的三方合并**。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104214.png)

和之前将分支指针向前推进所不同的是，Git 将此次三方合并的结果做了一个新的快照并且自动创建一个新的提交指向它。 这个被称作一次合并提交，它的特别之处在于他有不止一个父提交。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104223.png)

既然你的修改已经合并进来了，就不再需要`iss53`分支了。 现在你可以在任务追踪系统中关闭此项任务，并删除这个分支。
```shell
$ git branch -d iss53
```

### 遇到冲突时的分支合并
有时候合并操作不会如此顺利。 如果你在两个不同的分支中，对同一个文件的同一个部分进行了不同的修改，Git 就没法干净的合并它们。 如果你对 #53 问题的修改和有关`hotfix`分支的修改都涉及到同一个文件的同一处，在合并它们的时候就会产生合并冲突：
```shell
$ git merge iss53
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```
此时 Git 做了合并，但是没有自动地创建一个新的合并提交对象, 如下

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104233.png)

此时我在test分支上，使用`git merge master`, 发生了冲突，此时的提交的历史如下, 可以发现提交历史没有发生改变：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104242.png)

此时需要手动解决合并产生的冲突。解决完冲突且commit后，git会自动完成未完成merge操作，以下是解决完冲突且commit后的log

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104257.png)

你可以在合并冲突后的任意时刻使用`git status`命令来查看那些因包含合并冲突而处于未合并（unmerged）状态的文件：
```shell
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)

    both modified:      index.html

no changes added to commit (use "git add" and/or "git commit -a")
```
任何因包含合并冲突而有待解决的文件，都会以未合并状态标识出来。 Git 会在有冲突的文件中加入标准的冲突解决标记，这样你可以打开这些包含冲突的文件然后手动解决冲突。 出现冲突的文件会包含一些特殊区段，看起来像下面这个样子：
```shell
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
 please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
```

这表示`HEAD`所指示的版本（也就是你的`master`分支所在的位置，因为你在运行`merge`命令的时候已经检出到了这个分支）在这个区段的上半部分（======= 的上半部分），而`iss53`分支所指示的版本在 ======= 的下半部分。 为了解决冲突，你必须选择使用由 ======= 分割的两部分中的一个，或者你也可以自行合并这些内容。 例如，你可以通过把这段内容换成下面的样子来解决冲突：
```html
<div id="footer">
please contact us at email.support@github.com
</div>
```
上述的冲突解决方案仅保留了其中一个分支的修改，并且`<<<<<<<`,`=======`, 和`>>>>>>>`这些行被完全删除了。 在你解决了所有文件里的冲突之后，对每个文件使用`git add`命令来将其标记为冲突已解决。 一旦暂存这些原本有冲突的文件，Git 就会将它们标记为冲突已解决。

如果你想使用图形化工具来解决冲突，你可以运行`git mergetool`，该命令会为你启动一个合适的可视化合并工具，并带领你一步一步解决这些冲突：
```shell
$ git mergetool

This message is displayed because 'merge.tool' is not configured.
See 'git mergetool --tool-help' or 'git help config' for more details.
'git mergetool' will now attempt to use one of the following tools:
opendiff kdiff3 tkdiff xxdiff meld tortoisemerge gvimdiff diffuse diffmerge ecmerge p4merge araxis bc3 codecompare vimdiff emerge
Merging:
index.html

Normal merge conflict for 'index.html':
  {local}: modified file
  {remote}: modified file
Hit return to start merge resolution tool (opendiff):
```
如果你想使用除默认工具（在这里 Git 使用`opendiff`做为默认的合并工具，因为作者在 Mac 上运行该程序） 外的其他合并工具，你可以在 “下列工具中（one of the following tools）” 这句后面看到所有支持的合并工具。 然后输入你喜欢的工具名字就可以了。

> Note
如果你需要更加高级的工具来解决复杂的合并冲突，我们会在 高级合并 介绍更多关于分支合并的内容。

等你退出合并工具之后，Git 会询问刚才的合并是否成功。 如果你回答是，Git 会暂存那些文件以表明冲突已解决： 你可以再次运行`git status`来确认所有的合并冲突都已被解决：
```shell
$ git status
On branch master
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)

Changes to be committed:

    modified:   index.html
```
如果你对结果感到满意，并且确定之前有冲突的的文件都已经暂存了，这时你可以输入`git commit`来完成合并提交。 默认情况下提交信息看起来像下面这个样子：
```shell
Merge branch 'iss53'

Conflicts:
    index.html
#
# It looks like you may be committing a merge.
# If this is not correct, please remove the file
#	.git/MERGE_HEAD
# and try again.


# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch master
# All conflicts fixed but you are still merging.
#
# Changes to be committed:
#	modified:   index.html
#
```
如果你觉得上述的信息不够充分，不能完全体现分支合并的过程，你可以修改上述信息， 添加一些细节给未来检视这个合并的读者一些帮助，告诉他们你是如何解决合并冲突的，以及理由是什么。

### fast-forward(快速合并)
其实指的是源分支和目标分支之间没有分叉（单词 diverge），这种情况下合并**一定**是没有冲突的。且这种情况下合并**一定**是快速合并, 并且快速合并只发生在这种情况下
如下图中的master分支与feature分支合并是快速合并

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104306.png)

如果是下图中的场景，无法通过 HEAD 的快速移动实现分支的合并！

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104315.png)

### cherry-pick
对于多分支的代码库，将代码从一个分支转移到另一个分支是常见需求。
这时分两种情况。一种情况是，你需要另一个分支的所有代码变动，那么就采用合并（git merge）。另一种情况是，你只需要部分代码变动（某几个提交），这时可以采用 Cherry pick。
#### 基本用法
git cherry-pick命令的作用，就是将指定的提交（commit）应用于其他分支。
```shell
$ git cherry-pick <commitHash>
```
上面命令就会将指定的提交commitHash，应用于当前分支。这会在当前分支产生一个新的提交，当然它们的哈希值会不一样。
举例来说，代码仓库有master和feature两个分支。
```
    a - b - c - d   Master
         \
           e - f - g Feature
````
现在将提交f应用到master分支。
```shell
# 切换到 master 分支
$ git checkout master

# Cherry pick 操作
$ git cherry-pick f
```
上面的操作完成以后，代码库就变成了下面的样子。
```
    a - b - c - d - f   Master
         \
           e - f - g Feature
```
从上面可以看到，master分支的末尾增加了一个提交f。
git cherry-pick命令的参数，不一定是提交的哈希值，分支名也是可以的，表示转移该分支的最新提交。
```shell
$ git cherry-pick feature
```
上面代码表示将feature分支的最近一次提交，转移到当前分支。

#### 转移多个提交
Cherry pick 支持一次转移多个提交。
```shell
$ git cherry-pick <HashA> <HashB>
```
上面的命令将 A 和 B 两个提交应用到当前分支。这会在当前分支生成两个对应的新提交。
如果想要转移一系列的连续提交，可以使用下面的简便语法。
```shell
$ git cherry-pick A..B 
```
上面的命令可以转移从 A 到 B 的所有提交。它们必须按照正确的顺序放置：提交 A 必须早于提交 B，否则命令将失败，但不会报错。
注意，使用上面的命令，提交 A 将不会包含在 Cherry pick 中。如果要包含提交 A，可以使用下面的语法。
```shell
$ git cherry-pick A^..B 
```

#### 代码冲突
如果操作过程中发生代码冲突，Cherry pick 会停下来，让用户决定如何继续操作。
（1）`--continue`
用户解决代码冲突后，第一步将修改的文件重新加入暂存区（git add .），第二步使用下面的命令，让 Cherry pick 过程继续执行。
```shell
$ git cherry-pick --continue
```
（2）`--abort`
发生代码冲突后，放弃合并，回到操作前的样子。
（3）`--quit`
发生代码冲突后，退出 Cherry pick，但是不回到操作前的样子。

### 变基
在 Git 中整合来自不同分支的修改主要有三种方法：merge 、cherry-pick以及 rebase。 在本节中我们将学习什么是“变基”，怎样使用“变基”，并将展示该操作的惊艳之处，以及指出在何种情况下你应避免使用它。

变基的基本操作
请回顾之前在 分支的合并 中的一个例子，你会看到开发任务分叉到两个不同分支，又各自提交了更新。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104325.png)

之前介绍过，整合分支最容易的方法是 merge 命令。 它会把两个分支的最新快照（C3 和 C4）以及二者最近的共同祖先（C2）进行三方合并，合并的结果是生成一个新的快照（并提交）。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104335.png)

其实，还有一种方法：你可以提取在 C4 中引入的补丁和修改，然后在 C3 的基础上应用一次。 在 Git 中，这种操作就叫做 变基（rebase）。 你可以使用 rebase 命令将提交到某一分支上的所有修改都移至另一分支上，就好像“重新播放”一样。

在这个例子中，你可以检出 experiment 分支，然后将它变基到 master 分支上：
```shell
$ git checkout experiment
$ git rebase master
First, rewinding head to replay your work on top of it...
Applying: added staged command
```
它的原理是首先找到这两个分支（即当前分支 experiment、变基操作的目标基底分支 master） 的最近共同祖先 C2，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件， 然后将当前分支指向目标基底 C3, 最后以此将之前另存为临时文件的修改依序应用。 （译注：写明了 commit id，以便理解，下同）

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104345.png)

现在回到 master 分支，进行一次快进合并。
```shell
$ git checkout master
$ git merge experiment
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104357.png)

此时，C4' 指向的快照就和 the merge example 中 C5 指向的快照一模一样了。 这两种整合方法的最终结果没有任何区别，但是变基使得提交历史更加整洁。 你在查看一个经过变基的分支的历史记录时会发现，尽管实际的开发工作是并行的， 但它们看上去就像是串行的一样，提交历史是一条直线没有分叉。

一般我们这样做的目的是为了确保在向远程分支推送时能保持提交历史的整洁——例如向某个其他人维护的项目贡献代码时。 在这种情况下，你首先在自己的分支里进行开发，当开发完成时你需要先将你的代码变基到 origin/master 上，然后再向主项目提交修改。 这样的话，该项目的维护者就不再需要进行整合工作，只需要快进合并便可。


### 合并原理
git merge文件是以行为单位进行一行一行进行合并的，但是有些时候并不是两行内容不一样git就会报冲突，因为git会帮我们自动进行取舍，分析出哪个结果才是我们所期望的，如果git都无法进行取舍的时候才会报冲突，这个时候才需要我们进行人工干预。那git是如何帮我们进行merge操作的呢?

在介绍git merge算法前，先来看一个比较简单的算法：Two-way merge。

#### Two-way merge
Two-way merge解决的问题是：如何把两个文件进行合并。

举个例子，假设你和另外一个人同时修改了一个文件，这时merging算法看到了这两个文件，如下图：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104407.png)

merging算法发现两个文件大部分都一样，只有30行不一样，
- 在Yours的版本里内容是：Print("hello")
- 在Mine的版本里内容是：Print("bye")
但是merging算法怎么知道是你修改了30行还是另外一个人修改了？可能会有以下几种情况：
- Mine版本没有修改，Yours版本修改了内容（从Print("bye") 修改 Print("hello"))
- Yours版本没有修改，Mine版本修改了内容（从Print("hello") 修改 Print("bye")）
- Yours和Mine都修改了内容，（Yours从???修改成Print("hello")；Mine从???修改成Print("bye")
- Yours和Mine都增加了一行
对于一个merge算法来说，该怎么处理上述4中情况呢？
- Mine版本没有修改，Yours版本修改了内容 => 应该选Yours版本
- Yours版本没有修改，Mine版本修改了内容 => 应该选Mine版本
- Yours和Mine都修改了内容 => 需要手动解决冲突
- Yours和Mine都增加了一行 => 需要手动解决冲突
由于缺乏必要的信息，Two-way merge根本无法帮助我们解决冲突，TA只能帮助我们发现冲突，需要手动解决冲突。

如果让merging算法知道更多一些信息，merging算法是否可以帮助我们自动解决一些简单的冲突呢？下面来看一下Three-way merge算法。

#### Three-way merge
Three-way merge是在Two-way merge的基础上又增加了一个信息，即两个需要合并的文件修改前的版本。如下图所示，merge算法现在知道三个信息：
- Mine：需要合并的一个文件
- Yours：另一个需要合并的文件
- Base：两个文件修改前的版本

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104422.png)

这时merging算法发现：
- 修改前的Base版本里的内容是：Print("bye")
- 在Yours的版本里内容是：Print("hello")
- 在Mine的版本里内容是：Print("bye")
说明Yours对这一行做了修改，而Mine对这行没有做修改，因此对Yours和Mine进行merge后的结果应该采用Yours的修改，于是就变成Print("hello")。

这就是Three-way merge的大致原理。

#### Three-way merge的一个复杂案例
我们来看一个更加复杂的案例，如下图：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104433.png)

按行对比两个文件后，merging算法发现有3个地方不一样，分别是：
- 30行：上文描述的冲突案例
- 51行：有一个for循环被同时修改
- 70行：Mine的版本里面新增了一行

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104446.png)

我们来看一下这三种冲突改怎么解决：
- 30行：只有Yours修改了，因此使用Yours的版本
- 51行：Yours和Mine都修改了，需要手工解决冲突
- 70行：Mine新增了一行，因此使用Mine的版本

#### 实战
假设我们有2个branch：
- main：master branch
- task001：我们正在开发的branch
我们在task001上开发了一段时间，需要把main上的修改合并到task001，这时可以运行
```shell
$ git checkout task001
$ git merge main
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104459.png)

merge后结果如下

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104509.png)

merge的过程其实就是使用Three-way merge，其中
- Base = commit 1
- Mine = commit 4
- Yours = commit 3
merge后会生成一个新的merge节点commit 5，并且commit 5会同时依赖commit 3和commit 4。


#### Recursive three-way merge
一般情况下Base会选择Yours和Mine节点的最近的公共祖先。
但是有的时候最近的公共祖先不是唯一的，例如出现如下图所示的情况：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104519.png)

merge X'' Y'和X' Y''的时候发现有两个节点都符合最近的公共祖先，即：
- X' Y
- X Y'
我们称这种情况为：Criss-cross-merge，这时就需要用到Recursive three-way merge算法，具体步骤如下：
1. 先把候选的两个最近的公共祖先递归调用merge，生成成一个虚拟的节点
2. 然后让这个虚拟节点作为Base
如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104529.png)

<font color="red">git软件中使用的就是Recursive three-way merge算法。</font>




## 分支管理
现在已经创建、合并、删除了一些分支，让我们看看一些常用的分支管理工具。
`git branch`命令不只是可以创建与删除分支。 如果不加任何参数运行它，会得到当前所有分支的一个列表：
```shell
$ git branch
  iss53
* master
  testing
```
注意`master`分支前的`*`字符：它代表现在检出的那一个分支（也就是说，当前`HEAD`指针所指向的分支）。 这意味着如果在这时候提交，`master`分支将会随着新的工作向前移动。 如果需要查看每一个分支的最后一次提交，可以运行`git branch -v`命令：
```shell
$ git branch -v
  iss53   93b412c fix javascript issue
* master  7a98805 Merge branch 'iss53'
  testing 782fd34 add scott to the author list in the readmes
```
`--merged`与`--no-merged`这两个有用的选项可以过滤这个列表中已经合并或尚未合并到当前分支的分支。 如果要查看哪些分支已经合并到当前分支，可以运行`git branch --merged`:
```shell
$ git branch --merged
  iss53
* master
```
因为之前已经合并了`iss53`分支，所以现在看到它在列表中。 在这个列表中分支名字前没有`*`号的分支通常可以使用`git branch -d`删除掉；你已经将它们的工作整合到了另一个分支，所以并不会失去任何东西。

查看所有包含未合并工作的分支，可以运行`git branch --no-merged`：
```shell
$ git branch --no-merged
  testing
```
这里显示了其他分支。 因为它包含了还未合并的工作，尝试使用`git branch -d`命令删除它时会失败：
```shell
$ git branch -d testing
error: The branch 'testing' is not fully merged.
If you are sure you want to delete it, run 'git branch -D testing'.
```
如果真的想要删除分支并丢掉那些工作，如同帮助信息里所指出的，可以使用`-D`选项强制删除它。

> Tip
上面描述的选项 --merged 和 --no-merged 会在没有给定提交或分支名作为参数时， 分别列出已合并或未合并到 当前 分支的分支。
你总是可以提供一个附加的参数来查看其它分支的合并状态而不必检出它们。 例如，尚未合并到 master 分支的有哪些？
```shell
$ git checkout testing
$ git branch --no-merged master
  topicA
  featureB
```

## 强制修改分支位置
我使用相对引用最多的就是移动分支。可以直接使用`-f`选项让分支指向另一个提交。例如:
```shell
git branch -f master HEAD~3
```
上面的命令会将 master 分支强制指向 HEAD 的第 3 级父提交。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104538.png)

## 分支开发工作流
现在你已经学会新建和合并分支，那么你可以或者应该用它来做些什么呢？ 在本节，我们会介绍一些常见的利用分支进行开发的工作流程。而正是由于分支管理的便捷， 才衍生出这些典型的工作模式，你可以根据项目实际情况选择一种用用看。


### 长期分支
因为 Git 使用简单的三方合并，所以就算在一段较长的时间内，反复把一个分支合并入另一个分支，也不是什么难事。 也就是说，在整个项目开发周期的不同阶段，你可以同时拥有多个开放的分支；你可以定期地把某些主题分支合并入其他分支中。

许多使用 Git 的开发者都喜欢使用这种方式来工作，比如只在 master 分支上保留完全稳定的代码——有可能仅仅是已经发布或即将发布的代码。 他们还有一些名为 develop 或者 next 的平行分支，被用来做后续开发或者测试稳定性——这些分支不必保持绝对稳定，但是一旦达到稳定状态，它们就可以被合并入 master 分支了。 这样，在确保这些已完成的主题分支（短期分支，比如之前的 iss53 分支）能够通过所有测试，并且不会引入更多 bug 之后，就可以合并入主干分支中，等待下一次的发布。

事实上我们刚才讨论的，是随着你的提交而不断右移的指针。 稳定分支的指针总是在提交历史中落后一大截，而前沿分支的指针往往比较靠前。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104548.png)

通常把他们想象成流水线（work silos）可能更好理解一点，那些经过测试考验的提交会被遴选到更加稳定的流水线上去。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104601.png)

你可以用这种方法维护不同层次的稳定性。 一些大型项目还有一个 proposed（建议） 或 pu: proposed updates（建议更新）分支，它可能因包含一些不成熟的内容而不能进入 next 或者 master 分支。 这么做的目的是使你的分支具有不同级别的稳定性；当它们具有一定程度的稳定性后，再把它们合并入具有更高级别稳定性的分支中。 再次强调一下，使用多个长期分支的方法并非必要，但是这么做通常很有帮助，尤其是当你在一个非常庞大或者复杂的项目中工作时。

### 主题分支
主题分支对任何规模的项目都适用。 主题分支是一种短期分支，它被用来实现单一特性或其相关工作。 也许你从来没有在其他的版本控制系统（VCS）上这么做过，因为在那些版本控制系统中创建和合并分支通常很费劲。 然而，在 Git 中一天之内多次创建、使用、合并、删除分支都很常见。

你已经在上一节中你创建的 iss53 和 hotfix 主题分支中看到过这种用法。 你在上一节用到的主题分支（iss53 和 hotfix 分支）中提交了一些更新，并且在它们合并入主干分支之后，你又删除了它们。 这项技术能使你快速并且完整地进行上下文切换（context-switch）——因为你的工作被分散到不同的流水线中，在不同的流水线中每个分支都仅与其目标特性相关，因此，在做代码审查之类的工作的时候就能更加容易地看出你做了哪些改动。 你可以把做出的改动在主题分支中保留几分钟、几天甚至几个月，等它们成熟之后再合并，而不用在乎它们建立的顺序或工作进度。

考虑这样一个例子，你在 master 分支上工作到 C1，这时为了解决一个问题而新建 iss91 分支，在 iss91 分支上工作到 C4，然而对于那个问题你又有了新的想法，于是你再新建一个 iss91v2 分支试图用另一种方法解决那个问题，接着你回到 master 分支工作了一会儿，你又冒出了一个不太确定的想法，你便在 C10 的时候新建一个 dumbidea 分支，并在上面做些实验。 你的提交历史看起来像下面这个样子：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104611.png)

现在，我们假设两件事情：你决定使用第二个方案来解决那个问题，即使用在 iss91v2 分支中方案。 另外，你将 dumbidea 分支拿给你的同事看过之后，结果发现这是个惊人之举。 这时你可以抛弃 iss91 分支（即丢弃 C5 和 C6 提交），然后把另外两个分支合并入主干分支。 最终你的提交历史看起来像下面这个样子：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104620.png)

我们将会在 分布式 Git 中向你揭示更多有关分支工作流的细节， 因此，请确保你阅读完那个章节之后，再来决定你的下个项目要使用什么样的分支策略（branching scheme）。
请牢记，当你做这么多操作的时候，这些分支全部都存于本地。 当你新建和合并分支的时候，所有这一切都只发生在你本地的 Git 版本库中 —— 没有与服务器发生交互。

## 贮藏与清理
有时，当你在项目的一部分上已经工作一段时间后，所有东西都进入了混乱的状态， 而这时你想要切换到另一个分支做一点别的事情。 问题是，你不想仅仅因为过会儿回到这一点而为做了一半的工作创建一次提交。 针对这个问题的答案是`git stash`命令。

贮藏（stash）会处理工作目录的脏的状态——即跟踪文件的修改与暂存的改动——然后将未完成的修改保存到一个栈上， 而你可以在任何时候重新应用这些改动（甚至在不同的分支上）。

>Note
迁移到`git stash push`
截至 2017 年 10 月下旬，Git 邮件列表上进行了广泛讨论，该讨论中弃用了`git stash save`命令， 代之以现有`git stash push`命令。主因是`git stash push`引入了贮藏选定的`路径规范`的选项， 而有些东西`git stash save`不支持。
`git stash save`不会很快就消失，所以不用担心它突然不见。 不过你可能想要迁移到`push`来获取新功能。

### 贮藏工作
为了演示贮藏，你需要进入项目并改动几个文件，然后可以暂存其中的一个改动。 如果运行`git status` ，可以看到有改动的状态：
```shell
$ git status
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   index.html

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   lib/simplegit.rb
```
**现在想要切换分支，但是还不想要提交之前的工作, 而当你没有提交变动时,git是不会让你切换分支的，会报错**。此时你就可以贮藏修改。 将新的贮藏推送到栈上，运行`git stash`或`git stash push`：
```shell
$ git stash
Saved working directory and index state \
  "WIP on master: 049d078 added the index file"
HEAD is now at 049d078 added the index file
(To restore them type "git stash apply")
```
可以看到工作目录是干净的了：
```shell
$ git status
# On branch master
nothing to commit, working directory clean
```
此时，你可以切换分支并在其他地方工作；你的修改被存储在栈上。 要查看贮藏的东西，可以使用`git stash list`：
```shell
$ git stash list
stash@{0}: WIP on master: 049d078 added the index file
stash@{1}: WIP on master: c264051 Revert "added file_size"
stash@{2}: WIP on master: 21d80a5 added number to log
```
在本例中，有两个之前的贮藏，所以你接触到了三个不同的贮藏工作。 可以通过原来 stash 命令的帮助提示中的命令将你刚刚贮藏的工作重新应用：`git stash apply`。 如果想要应用其中一个更旧的贮藏，可以通过名字指定它，像这样：`git stash apply stash@{2}`。 如果不指定一个贮藏，Git 认为指定的是最近的贮藏：
```shell
$ git stash apply
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   index.html
	modified:   lib/simplegit.rb

no changes added to commit (use "git add" and/or "git commit -a")
```
可以看到 Git 重新修改了当你保存贮藏时撤消的文件。 在本例中，当尝试应用贮藏时有一个干净的工作目录，并且尝试将它应用在保存它时所在的分支。 并不是必须要有一个干净的工作目录，或者要应用到同一分支才能成功应用贮藏。 可以在一个分支上保存一个贮藏，切换到另一个分支，然后尝试重新应用这些修改。 当应用贮藏时工作目录中也可以有修改与未提交的文件——如果有任何东西不能干净地应用，Git 会产生合并冲突。

文件的改动被重新应用了，但是之前暂存的文件却没有重新暂存。 想要那样的话，必须使用`--index`选项来运行`git stash apply`命令，来尝试重新应用暂存的修改。 如果已经那样做了，那么你将回到原来的位置：
```shell
$ git stash apply --index
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   index.html

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   lib/simplegit.rb
```
应用选项只会尝试应用贮藏的工作——在堆栈上还有它。 可以运行`git stash drop`加上将要移除的贮藏的名字来移除它：
```shell
$ git stash list
stash@{0}: WIP on master: 049d078 added the index file
stash@{1}: WIP on master: c264051 Revert "added file_size"
stash@{2}: WIP on master: 21d80a5 added number to log
$ git stash drop stash@{0}
Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)
```
也可以运行`git stash pop`来应用贮藏然后立即从栈上扔掉它。

### 贮藏的创意性使用
有几个贮藏的变种可能也很有用。 第一个非常流行的选项是`git stash`命令的`--keep-index`选项。 它告诉 Git 不仅要贮藏所有已暂存的内容，同时还要将它们保留在索引中。
```shell
$ git status -s
M  index.html
 M lib/simplegit.rb

$ git stash --keep-index
Saved working directory and index state WIP on master: 1b65b17 added the index file
HEAD is now at 1b65b17 added the index file

$ git status -s
M  index.html
```
另一个经常使用贮藏来做的事情是像贮藏跟踪文件一样贮藏未跟踪文件。 默认情况下，`git stash`只会贮藏已修改和暂存的`已跟踪`文件。 如果指定`--include-untracked `或`-u`选项，Git 也会贮藏任何未跟踪文件。 然而，在贮藏中包含未跟踪的文件仍然不会包含明确 忽略 的文件。 要额外包含忽略的文件，请使用`--all`或`-a`选项。
```shell
$ git status -s
M  index.html
 M lib/simplegit.rb
?? new-file.txt

$ git stash -u
Saved working directory and index state WIP on master: 1b65b17 added the index file
HEAD is now at 1b65b17 added the index file

$ git status -s
$
```
最终，如果指定了`--patch`标记，Git 不会贮藏所有修改过的任何东西， 但是会交互式地提示哪些改动想要贮藏、哪些改动需要保存在工作目录中。
```shell
$ git stash --patch
diff --git a/lib/simplegit.rb b/lib/simplegit.rb
index 66d332e..8bb5674 100644
--- a/lib/simplegit.rb
+++ b/lib/simplegit.rb
@@ -16,6 +16,10 @@ class SimpleGit
         return `#{git_cmd} 2>&1`.chomp
       end
     end
+
+    def show(treeish = 'master')
+      command("git show #{treeish}")
+    end

 end
 test
Stash this hunk [y,n,q,a,d,/,e,?]? y

Saved working directory and index state WIP on master: 1b65b17 added the index file
```
从贮藏创建一个分支
如果贮藏了一些工作，将它留在那儿了一会儿，然后继续在贮藏的分支上工作，在重新应用工作时可能会有问题。 如果应用尝试修改刚刚修改的文件，你会得到一个合并冲突并不得不解决它。 如果想要一个轻松的方式来再次测试贮藏的改动，可以运行`git stash branch <new branchname>`以你指定的分支名创建一个新分支，检出贮藏工作时所在的提交，重新在那应用工作，然后在应用成功后丢弃贮藏：
```shell
$ git stash branch testchanges
M	index.html
M	lib/simplegit.rb
Switched to a new branch 'testchanges'
On branch testchanges
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   index.html

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   lib/simplegit.rb

Dropped refs/stash@{0} (29d385a81d163dfd45a452a2ce816487a6b8b014)
```
这是在新分支轻松恢复贮藏工作并继续工作的一个很不错的途径。

### 清理工作目录
对于工作目录中一些工作或文件，你想做的也许不是贮藏而是移除。 git clean 命令就是用来干这个的。

清理工作目录有一些常见的原因，比如说为了移除由合并或外部工具生成的东西， 或是为了运行一个干净的构建而移除之前构建的残留。

你需要谨慎地使用这个命令，因为它被设计为从工作目录中移除未被追踪的文件。 如果你改变主意了，你也不一定能找回来那些文件的内容。 一个更安全的选项是运`git stash --all`来移除每一样东西并存放在栈中。

你可以使用`git clean`命令去除冗余文件或者清理工作目录。 使用`git clean -f -d`命令来移除工作目录中所有未追踪的文件以及空的子目录。`-f`意味着“强制（force）”或“确定要移除”，使用它需要 Git 配置变量`clean.requireForce`没有显式设置为`false`。

如果只是想要看看它会做什么，可以使用`--dry-run`或`-n`选项来运行命令， 这意味着“做一次演习然后告诉你 将要 移除什么”。
```shell
$ git clean -d -n
Would remove test.o
Would remove tmp/
```
默认情况下，`git clean`命令只会移除没有忽略的未跟踪文件。 任何与`.gitignore`或其他忽略文件中的模式匹配的文件都不会被移除。 如果你也想要移除那些文件，例如为了做一次完全干净的构建而移除所有由构建生成的`.o`文件， 可以给`clean`命令增加一个`-x`选项。
```shell
$ git status -s
 M lib/simplegit.rb
?? build.TMP
?? tmp/

$ git clean -n -d
Would remove build.TMP
Would remove tmp/

$ git clean -n -d -x
Would remove build.TMP
Would remove test.o
Would remove tmp/
```
如果不知道`git clean`命令将会做什么，在将`-n`改为`-f`来真正做之前总是先用`-n`来运行它做双重检查。 另一个小心处理过程的方式是使用`-i`或`“interactive”`标记来运行它。

这将会以交互模式运行`clean`命令。
```shell
$ git clean -x -i
Would remove the following items:
  build.TMP  test.o
*** Commands ***
    1: clean                2: filter by pattern    3: select by numbers    4: ask each             5: quit
    6: help
What now>
```
这种方式下可以分别地检查每一个文件或者交互地指定删除的模式。

>Note
在一种奇怪的情况下，可能需要格外用力才能让 Git 清理你的工作目录。 如果你恰好在工作目录中复制或克隆了其他 Git 仓库（可能是子模块），那么即便是`git clean -fd `都会拒绝删除这些目录。这种情况下，你需要加上第二个 -f 选项来强调。

# 打标签
像其他版本控制系统（VCS）一样，Git 可以给仓库历史中的某一个提交打上标签，以示重要。 比较有代表性的是人们会使用这个功能来标记发布结点（ v1.0 、 v2.0 等等）。 在本节中，你将会学习如何列出已有的标签、如何创建和删除新的标签、以及不同类型的标签分别是什么。

## 列出标签
在 Git 中列出已有的标签非常简单，只需要输入`git tag`（可带上可选的`-l`选项`--list`）：
```shell
$ git tag
v1.0
v2.0
```
这个命令以字母顺序列出标签，但是它们显示的顺序并不重要。

你也可以按照特定的模式查找标签。 例如，Git 自身的源代码仓库包含标签的数量超过 500 个。 如果只对 1.8.5 系列感兴趣，可以运行：
```shell
$ git tag -l "v1.8.5*"
v1.8.5
v1.8.5-rc0
v1.8.5-rc1
v1.8.5-rc2
v1.8.5-rc3
v1.8.5.1
v1.8.5.2
v1.8.5.3
v1.8.5.4
v1.8.5.5
```

>Note
按照通配符列出标签需要`-l`或`--list`选项
如果你只想要完整的标签列表，那么运行`git tag`就会默认假定你想要一个列表，它会直接给你列出来， 此时的`-l`或`--list`是可选的。
然而，如果你提供了一个匹配标签名的通配模式，那么`-l`或`--list`就是强制使用的。

## 创建标签
Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）。
- 轻量标签很像一个不会改变的分支——它只是某个特定提交的引用。
- 而附注标签是存储在 Git 数据库中的一个完整对象， 它们是可以被校验的，其中包含打标签者的名字、电子邮件地址、日期时间， 此外还有一个标签信息，并且可以使用 GNU Privacy Guard （GPG）签名并验证。 通常会建议创建附注标签，这样你可以拥有以上所有信息。但是如果你只是想用一个临时的标签， 或者因为某些原因不想要保存这些信息，那么也可以用轻量标签。

### 附注标签
在 Git 中创建附注标签十分简单。 最简单的方式是当你在运行 tag 命令时指定`-a`选项：
```shell
$ git tag -a v1.4 -m "my version 1.4"
$ git tag
v0.1
v1.3
v1.4
```
`-m`选项指定了一条将会存储在标签中的信息。 如果没有为附注标签指定一条信息，Git 会启动编辑器要求你输入信息。

通过使用`git show`命令可以看到标签信息和与之对应的提交信息：
```shell
$ git show v1.4
tag v1.4
Tagger: Ben Straub <ben@straub.cc>
Date:   Sat May 3 20:19:12 2014 -0700

my version 1.4

commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number
```
输出显示了打标签者的信息、打标签的日期时间、附注信息，然后显示具体的提交信息。

### 轻量标签
另一种给提交打标签的方式是使用轻量标签。 轻量标签本质上是将提交校验和存储到一个文件中——没有保存任何其他信息。 创建轻量标签，不需要使用`-a`、`-s`或`-m`选项，只需要提供标签名字：
```shell
$ git tag v1.4-lw
$ git tag
v0.1
v1.3
v1.4
v1.4-lw
v1.5
```
这时，如果在标签上运行`git show`，你不会看到额外的标签信息。 命令只会显示出提交信息：
```shell
$ git show v1.4-lw
commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number
```

### 后期打标签
你也可以对过去的提交打标签。 假设提交历史是这样的：
```shell
$ git log --pretty=oneline
15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
a6b4c97498bd301d84096da251c98a07c7723e65 beginning write support
0d52aaab4479697da7686c15f77a3d64d9165190 one more thing
6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch 'experiment'
0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit function
4682c3261057305bdd616e23b64b0857d832627b added a todo file
166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme
```
现在，假设在 v1.2 时你忘记给项目打标签，也就是在 “updated rakefile” 提交。 你可以在之后补上标签。 要在那个提交上打标签，你需要在命令的末尾指定提交的校验和（或部分校验和）：
```shell
$ git tag -a v1.2 9fceb02
```
可以看到你已经在那次提交上打上标签了：
```shell
$ git tag
v0.1
v1.2
v1.3
v1.4
v1.4-lw
v1.5

$ git show v1.2
tag v1.2
Tagger: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Feb 9 15:32:16 2009 -0800

version 1.2
commit 9fceb02d0ae598e95dc970b74767f19372d61af8
Author: Magnus Chacon <mchacon@gee-mail.com>
Date:   Sun Apr 27 20:43:35 2008 -0700

    updated rakefile
...
```

## 共享标签
默认情况下，`git push`命令并不会传送标签到远程仓库服务器上。 在创建完标签后你必须显式地推送标签到共享服务器上。 这个过程就像共享远程分支一样——你可以运行`git push origin <tagname>`。
```shell
$ git push origin v1.5
Counting objects: 14, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (12/12), done.
Writing objects: 100% (14/14), 2.05 KiB | 0 bytes/s, done.
Total 14 (delta 3), reused 0 (delta 0)
To git@github.com:schacon/simplegit.git
 * [new tag]         v1.5 -> v1.5
```
如果想要一次性推送很多标签，也可以使用带有`--tags`选项的`git push`命令。 这将会把所有不在远程仓库服务器上的标签全部传送到那里。
```shell
$ git push origin --tags
Counting objects: 1, done.
Writing objects: 100% (1/1), 160 bytes | 0 bytes/s, done.
Total 1 (delta 0), reused 0 (delta 0)
To git@github.com:schacon/simplegit.git
 * [new tag]         v1.4 -> v1.4
 * [new tag]         v1.4-lw -> v1.4-lw
```
现在，当其他人从仓库中克隆或拉取，他们也能得到你的那些标签。

>Note
`git push`推送两种标签
使用`git push <remote> --tags`推送标签并不会区分轻量标签和附注标签， 没有简单的选项能够让你只选择推送一种标签。

## 删除标签
要删除掉你本地仓库上的标签，可以使用命令`git tag -d <tagname>`。 例如，可以使用以下命令删除一个轻量标签：
```shell
$ git tag -d v1.4-lw
Deleted tag 'v1.4-lw' (was e7d5add)
```
注意上述命令并不会从任何远程仓库中移除这个标签，你必须用`git push <remote> :refs/tags/<tagname>`来更新你的远程仓库：

第一种变体是`git push <remote> :refs/tags/<tagname>`：
```shell
$ git push origin :refs/tags/v1.4-lw
To /git@github.com:schacon/simplegit.git
 - [deleted]         v1.4-lw
```
上面这种操作的含义是，将冒号前面的空值推送到远程标签名，从而高效地删除它。

第二种更直观的删除远程标签的方式是：
```shell
$ git push origin --delete <tagname>
```

## 检出标签
如果你想查看某个标签所指向的文件版本，可以使用`git checkout`命令， 虽然这会使你的仓库处于“分离头指针（detached HEAD）”的状态——这个状态有些不好的副作用：
```shell
$ git checkout 2.0.0
Note: checking out '2.0.0'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by performing another checkout.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -b with the checkout command again. Example:

  git checkout -b <new-branch>

HEAD is now at 99ada87... Merge pull request #89 from schacon/appendix-final

$ git checkout 2.0-beta-0.1
Previous HEAD position was 99ada87... Merge pull request #89 from schacon/appendix-final
HEAD is now at df3f601... add atlas.json and cover image
```
在“分离头指针”状态下，如果你做了某些更改然后提交它们，标签不会发生变化， 但你的新提交将不属于任何分支，并且将无法访问，除非通过确切的提交哈希才能访问。 因此，如果你需要进行更改，比如你要修复旧版本中的错误，那么通常需要创建一个新分支：
```shell
$ git checkout -b version2 v2.0.0
Switched to a new branch 'version2'
```
如果在这之后又进行了一次提交，version2 分支就会因为这个改动向前移动， 此时它就会和 v2.0.0 标签稍微有些不同，这时就要当心了。

# 远程
## 远程仓库的使用
为了能在任意 Git 项目上协作，你需要知道如何管理自己的远程仓库。 远程仓库是指托管在因特网或其他网络中的你的项目的版本库。 你可以有好几个远程仓库，通常有些仓库对你只读，有些则可以读写。 与他人协作涉及管理远程仓库以及根据需要推送或拉取数据。 管理远程仓库包括了解如何添加远程仓库、移除无效的远程仓库、管理不同的远程分支并定义它们是否被跟踪等等。 在本节中，我们将介绍一部分远程管理的技能。

>Note
远程仓库可以在你的本地主机上
你完全可以在一个“远程”仓库上工作，而实际上它在你本地的主机上。 词语“远程”未必表示仓库在网络或互联网上的其它位置，而只是表示它在别处。 在这样的远程仓库上工作，仍然需要和其它远程仓库上一样的标准推送、拉取和抓取操作。

### 查看远程仓库
如果想查看你已经配置的远程仓库服务器，可以运行`git remote`命令。 它会列出你指定的每一个远程服务器的简写。 如果你已经克隆了自己的仓库，那么至少应该能看到 `origin`——这是 Git 给你克隆的仓库服务器的默认名字：
```shell
$ git clone https://github.com/schacon/ticgit
Cloning into 'ticgit'...
remote: Reusing existing pack: 1857, done.
remote: Total 1857 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (1857/1857), 374.35 KiB | 268.00 KiB/s, done.
Resolving deltas: 100% (772/772), done.
Checking connectivity... done.
$ cd ticgit
$ git remote
origin
```
你也可以指定选项`-v`，会显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL。
```shell
$ git remote -v
origin	https://github.com/schacon/ticgit (fetch)
origin	https://github.com/schacon/ticgit (push)
```
如果你的远程仓库不止一个，该命令会将它们全部列出。 例如，与几个协作者合作的，拥有多个远程仓库的仓库看起来像下面这样：
```shell
$ cd grit
$ git remote -v
bakkdoor  https://github.com/bakkdoor/grit (fetch)
bakkdoor  https://github.com/bakkdoor/grit (push)
cho45     https://github.com/cho45/grit (fetch)
cho45     https://github.com/cho45/grit (push)
defunkt   https://github.com/defunkt/grit (fetch)
defunkt   https://github.com/defunkt/grit (push)
koke      git://github.com/koke/grit.git (fetch)
koke      git://github.com/koke/grit.git (push)
origin    git@github.com:mojombo/grit.git (fetch)
origin    git@github.com:mojombo/grit.git (push)
```
这表示我们能非常方便地拉取其它用户的贡献。我们还可以拥有向他们推送的权限，这里暂不详述。

注意这些远程仓库使用了不同的协议。我们将会在 在服务器上搭建 Git 中了解关于它们的更多信息。

### 添加远程仓库
我们在之前的章节中已经提到并展示了`git clone`命令是如何自行添加远程仓库的， 不过这里将告诉你如何自己来添加它。 运行`git remote add <shortname> <url>`添加一个新的远程 Git 仓库，同时指定一个方便使用的简写：
```shell
$ git remote
origin
$ git remote add pb https://github.com/paulboone/ticgit
$ git remote -v
origin	https://github.com/schacon/ticgit (fetch)
origin	https://github.com/schacon/ticgit (push)
pb	https://github.com/paulboone/ticgit (fetch)
pb	https://github.com/paulboone/ticgit (push)
```
现在你可以在命令行中使用字符串`pb`来代替整个 URL。 例如，如果你想拉取`Paul`的仓库中有但你没有的信息，可以运行`git fetch pb`：
```shell
$ git fetch pb
remote: Counting objects: 43, done.
remote: Compressing objects: 100% (36/36), done.
remote: Total 43 (delta 10), reused 31 (delta 5)
Unpacking objects: 100% (43/43), done.
From https://github.com/paulboone/ticgit
 * [new branch]      master     -> pb/master
 * [new branch]      ticgit     -> pb/ticgit
```
现在 Paul 的 master 分支可以在本地通过 pb/master 访问到——你可以将它合并到自己的某个分支中， 或者如果你想要查看它的话，可以检出一个指向该点的本地分支。 （我们将会在 Git 分支 中详细介绍什么是分支以及如何使用分支。）

### 从远程仓库中抓取与拉取
就如刚才所见，从远程仓库中获得数据，可以执行：
```shell
$ git fetch <remote>
```
这个命令会访问远程仓库，从中拉取所有你还没有的数据。 执行完成后，你将会拥有那个远程仓库中所有分支的引用，可以随时合并或查看。

如果你使用`clone`命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 “origin” 为简写。 所以，`git fetch origin`会抓取克隆（或上一次抓取）后新推送的所有工作。 必须注意`git fetch`命令只会将数据下载到你的本地仓库——它并不会自动合并或修改你当前的工作。 当准备好时你必须手动将其合并入你的工作。

如果你的当前分支设置了跟踪远程分支（阅读下一节和 Git 分支 了解更多信息）， 那么可以用 git pull 命令来自动抓取后合并该远程分支到当前分支。 这或许是个更加简单舒服的工作流程。默认情况下，git clone 命令会自动设置本地 master 分支跟踪克隆的远程仓库的 master 分支（或其它名字的默认分支）。 运行 git pull 通常会从最初克隆的服务器上抓取数据并自动尝试合并到当前所在的分支。

### 推送到远程仓库
当你想分享你的项目时，必须将其推送到上游。 这个命令很简单：`git push <remote> <branch>`。 当你想要将 master 分支推送到 origin 服务器时（再次说明，克隆时通常会自动帮你设置好那两个名字）， 那么运行这个命令就可以将你所做的备份到服务器：
```shell
$ git push origin master
```
只有当你有所克隆服务器的写入权限，并且之前没有人推送过时，这条命令才能生效。 当你和其他人在同一时间克隆，他们先推送到上游然后你再推送到上游，你的推送就会毫无疑问地被拒绝。 你必须先抓取他们的工作并将其合并进你的工作后才能推送。 阅读 Git 分支 了解如何推送到远程仓库服务器的详细信息。

### 查看某个远程仓库
如果想要查看某一个远程仓库的更多信息，可以使用`git remote show <remote>`命令。 如果想以一个特定的缩写名运行这个命令，例如 origin，会得到像下面类似的信息：
```shell
$ git remote show origin
* remote origin
  Fetch URL: https://github.com/schacon/ticgit
  Push  URL: https://github.com/schacon/ticgit
  HEAD branch: master
  Remote branches:
    master                               tracked
    dev-branch                           tracked
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (up to date)
```
它同样会列出远程仓库的 URL 与跟踪分支的信息。 这些信息非常有用，它告诉你正处于 master 分支，并且如果运行`git pull`， 就会抓取所有的远程引用，然后将远程 master 分支合并到本地 master 分支。 它也会列出拉取到的所有远程引用。

这是一个经常遇到的简单例子。 如果你是 Git 的重度使用者，那么还可以通过`git remote show`看到更多的信息。
```shell
$ git remote show origin
* remote origin
  URL: https://github.com/my-org/complex-project
  Fetch URL: https://github.com/my-org/complex-project
  Push  URL: https://github.com/my-org/complex-project
  HEAD branch: master
  Remote branches:
    master                           tracked
    dev-branch                       tracked
    markdown-strip                   tracked
    issue-43                         new (next fetch will store in remotes/origin)
    issue-45                         new (next fetch will store in remotes/origin)
    refs/remotes/origin/issue-11     stale (use 'git remote prune' to remove)
  Local branches configured for 'git pull':
    dev-branch merges with remote dev-branch
    master     merges with remote master
  Local refs configured for 'git push':
    dev-branch                     pushes to dev-branch                     (up to date)
    markdown-strip                 pushes to markdown-strip                 (up to date)
    master                         pushes to master                         (up to date)
```
这个命令列出了当你在特定的分支上执行 git push 会自动地推送到哪一个远程分支。 它也同样地列出了哪些远程分支不在你的本地，哪些远程分支已经从服务器上移除了， 还有当你执行 git pull 时哪些本地分支可以与它跟踪的远程分支自动合并。

### 远程仓库的重命名与移除
你可以运行`git remote rename`来修改一个远程仓库的简写名。 例如，想要将 pb 重命名为 paul，可以用`git remote rename`这样做：
```shell
$ git remote rename pb paul
$ git remote
origin
paul
```
值得注意的是这同样也会修改你所有远程跟踪的分支名字。 那些过去引用 pb/master 的现在会引用 paul/master。

如果因为一些原因想要移除一个远程仓库——你已经从服务器上搬走了或不再想使用某一个特定的镜像了， 又或者某一个贡献者不再贡献了——可以使用`git remote remove`或 `git remote rm` ：
```shell
$ git remote remove paul
$ git remote
origin
```
一旦你使用这种方式删除了一个远程仓库，那么所有和这个远程仓库相关的远程跟踪分支以及配置信息也会一起被删除。

## 远程分支
远程引用是对远程仓库的引用（指针），包括分支、标签等等。 你可以通过`git ls-remote <remote>`来显式地获得远程引用的完整列表， 或者通过`git remote show <remote>`获得远程分支的更多信息。 然而，一个更常见的做法是利用远程跟踪分支。

**远程跟踪分支是远程分支状态的引用。它们是你无法移动的本地引用。即远程分支不是本地分支，如果使用`git checkout <远程分支名>`, 则HEAD会变成游离状态**。一旦你进行了网络通信， Git 就会为你移动它们以精确反映远程仓库的状态。请将它们看做书签， 这样可以提醒你该分支在远程仓库中的位置就是你最后一次连接到它们的位置。

它们以`<remote>/<branch>`的形式命名。 例如，如果你想要看你最后一次与远程仓库`origin`通信时`master`分支的状态，你可以查看`origin/master`分支。 你与同事合作解决一个问题并且他们推送了一个`iss53`分支，你可能有自己的本地`iss53`分支， 然而在服务器上的分支会以`origin/iss53`来表示。

这可能有一点儿难以理解，让我们来看一个例子。 假设你的网络里有一个在`git.ourcompany.com`的 Git 服务器。 如果你从这里克隆，Git 的 clone 命令会为你自动将其命名为 origin，拉取它的所有数据， 创建一个指向它的 master 分支的指针，并且在本地将其命名为`origin/master`。 Git 也会给你一个与 origin 的 master 分支在指向同一个地方的本地 master 分支，这样你就有工作的基础。

>Note
“origin” 并无特殊含义
远程仓库名字 “origin” 与分支名字 “master” 一样，在 Git 中并没有任何特别的含义一样。 同时 “master” 是当你运行 git init 时默认的起始分支名字，原因仅仅是它的广泛使用， “origin” 是当你运行 git clone 时默认的远程仓库名字。 如果你运行`git clone -o booyah`，那么你默认的远程分支名字将会是`booyah/master`。

克隆之后的服务器与本地仓库。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104629.png)

如果你在本地的 master 分支做了一些工作，在同一段时间内有其他人推送提交到`git.ourcompany.com`并且更新了它的 master 分支，这就是说你们的提交历史已走向不同的方向。 即便这样，只要你保持不与 origin 服务器连接（并拉取数据），你的 origin/master 指针就不会移动。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104637.png)

如果要与给定的远程仓库同步数据，运行`git fetch <remote>`命令（在本例中为`git fetch origin`）。 这个命令查找 “origin” 是哪一个服务器（在本例中，它是 git.ourcompany.com）， 从中抓取本地没有的数据，并且更新本地数据库，移动 origin/master 指针到更新之后的位置。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104650.png)

为了演示有多个远程仓库与远程分支的情况，我们假定你有另一个内部 Git 服务器，仅服务于你的某个敏捷开发团队。 这个服务器位于`git.team1.ourcompany.com`。 你可以运行`git remote add`命令添加一个新的远程仓库引用到当前的项目，这个命令我们会在 Git 基础 中详细说明。 将这个远程仓库命名为`teamone`，将其作为完整 URL 的缩写。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104728.png)

现在，可以运行`git fetch teamone`来抓取远程仓库`teamone`有而本地没有的数据。 因为那台服务器上现有的数据是 origin 服务器上的一个子集， 所以 Git 并不会抓取数据而是会设置远程跟踪分支`teamone/master`指向 teamone 的 master 分支。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104748.png)

### 推送
当你想要公开分享一个分支时，需要将其推送到有写入权限的远程仓库上。 本地的分支并不会自动与远程仓库同步——你必须显式地推送想要分享的分支。 这样，你就可以把不愿意分享的内容放到私人分支上，而将需要和别人协作的内容推送到公开分支。

如果希望和别人一起在名为 serverfix 的分支上工作，你可以像推送第一个分支那样推送它。 运行`git push <remote> <branch>`:
```shell
$ git push origin serverfix
Counting objects: 24, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (15/15), done.
Writing objects: 100% (24/24), 1.91 KiB | 0 bytes/s, done.
Total 24 (delta 2), reused 0 (delta 0)
To https://github.com/schacon/simplegit
 * [new branch]      serverfix -> serverfix
```
这里有些工作被简化了。 Git 自动将`serverfix`分支名字展开为`refs/heads/serverfix:refs/heads/serverfix`， 那意味着，“推送本地的 serverfix 分支来更新远程仓库上的 serverfix 分支。” 我们将会详细学习 Git 内部原理 的 refs/heads/ 部分， 但是现在可以先把它放在儿。你也可以运行`git push origin serverfix:serverfix`， 它会做同样的事——也就是说“推送本地的 serverfix 分支，将其作为远程仓库的 serverfix 分支” 可以通过这种格式来推送本地分支到一个命名不相同的远程分支。 如果并不想让远程仓库上的分支叫做 serverfix，可以运行`git push origin serverfix:awesomebranch`来将本地的 serverfix 分支推送到远程仓库上的 awesomebranch 分支。

>Note
如何避免每次输入密码
如果你正在使用 HTTPS URL 来推送，Git 服务器会询问用户名与密码。 默认情况下它会在终端中提示服务器是否允许你进行推送。
如果不想在每一次推送时都输入用户名与密码，你可以设置一个 “credential cache”。 最简单的方式就是将其保存在内存中几分钟，可以简单地运行`git config --global credential.helper cache`来设置它。
想要了解更多关于不同验证缓存的可用选项，查看 凭证存储。

下一次其他协作者从服务器上抓取数据时，他们会在本地生成一个远程分支 origin/serverfix，指向服务器的 serverfix 分支的引用：
```shell
$ git fetch origin
remote: Counting objects: 7, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 3 (delta 0)
Unpacking objects: 100% (3/3), done.
From https://github.com/schacon/simplegit
 * [new branch]      serverfix    -> origin/serverfix
```
要特别注意的一点是当抓取到新的远程跟踪分支时，本地不会自动生成一份可编辑的副本（拷贝）。 换一句话说，这种情况下，不会有一个新的 serverfix 分支——只有一个不可以修改的 origin/serverfix 指针。

可以运行`git merge origin/serverfix`将这些工作合并到当前所在的分支。 如果想要在自己的`serverfix`分支上工作，可以将其建立在远程跟踪分支之上：
```shell
$ git checkout -b serverfix origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```
这会给你一个用于工作的本地分支，并且起点位于`origin/serverfix`。

#### git push详解
git push命令用于将本地分支的更新，推送到远程主机。它的格式与git pull命令相仿。
```shell
$ git push <远程主机名> <本地分支名>:<远程分支名>
```
注意，分支推送顺序的写法是<来源地>:<目的地>，所以git pull是<远程分支>:<本地分支>，而git push是<本地分支>:<远程分支>。
<font color="red">如果省略远程分支名，则表示将本地分支推送与之同名的远程分支(**不管你是否设置了本地分支跟踪哪个远程分支，都是推送至同名的远程分支**)，如果该远程分支不存在，则会被新建。</font>
```shell
$ git push origin master
```
上面命令表示，将本地的master分支推送到origin主机的master分支(不管master分支是否跟踪了哪个远程分支)。如果后者不存在，则会被新建。

如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支。
```shell
$ git push origin :master
# 等同于
$ git push origin --delete master
```
上面命令表示删除origin主机的master分支。
如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。
```shell
$ git push origin
```
上面命令表示，将当前分支推送到origin主机的对应分支。
如果当前分支只有一个追踪分支，那么主机名都可以省略。
```shell
$ git push
```
如果当前分支与多个主机存在追踪关系，则可以使用-u选项指定一个默认主机，这样后面就可以不加任何参数使用git push。
```shell
$ git push -u origin master
```
上面命令将本地的master分支推送到origin主机，同时指定origin为默认主机，后面就可以不加任何参数使用git push了。
不带任何参数的git push，默认只推送当前分支，这叫做simple方式。此外，还有一种matching方式，会推送所有有对应的远程分支的本地分支。Git 2.0版本之前，默认采用matching方法，现在改为默认采用simple方式。如果要修改这个设置，可以采用git config命令。
```shell
$ git config --global push.default matching
# 或者
$ git config --global push.default simple
```
还有一种情况，就是不管是否存在对应的远程分支，将本地的所有分支都推送到远程主机，这时需要使用--all选项。
```shell
$ git push --all origin
```
上面命令表示，将所有本地分支都推送到origin主机。
如果远程主机的版本比本地版本更新，推送时Git会报错，要求先在本地做git pull合并差异，然后再推送到远程主机。这时，如果你一定要推送，可以使用--force选项。
```shell
$ git push --force origin 
```
上面命令使用--force选项，结果导致远程主机上更新的版本被覆盖。除非你很确定要这样做，否则应该尽量避免使用--force选项。
最后，git push不会推送标签（tag），除非使用--tags选项。
```shell
$ git push origin --tags
```

#### push.default
Git中`push.default`表示只使用`git push`命令而不带任何参数时，其默认push的远程分支，其取值可以是：
- `nothing` - push操作无效，除非显式指定远程分支（想让push变得简单的就不要用这个）
- `current` - push当前分支到远程同名分支，如果远程同名分支不存在则自动创建同名分支（central 和 non-central workflows都适用）
- `upstream` - push当前分支到它的upstream分支上（通常用于central workflow）
- `simple` - simple和upstream是相似的（通常用于central workflow），只有一点不同，simple必须保证本地分支和它的远程 upstream分支同名，否则会拒绝push操作
- `matching` - push所有本地和远程两端都存在的同名分支

central / non-central workflows 是Git的两种常见工作流场景：
- `central workflows` - 集中式工作流，一个分支的push和pull都是同一个远程仓库
- `non-central workflows` - 非集中式工作流，一个分支的push和pull可能分别都有不同的远程仓库
在Git 2.0之前，push.default的内建值被设为'matching'，2.0之后则被更改为了'simple'。

### 跟踪分支
从一个远程跟踪分支检出一个本地分支会自动创建所谓的“跟踪分支”（它跟踪的分支叫做“上游分支”）。 跟踪分支是与远程分支有直接关系的本地分支。 如果在一个跟踪分支上输入 git pull而没有带有任何参数时，Git 能自动地识别去哪个服务器上抓取、合并到哪个分支。

当克隆一个仓库时，它通常会自动地创建一个跟踪 origin/master 的 master 分支。 然而，如果你愿意的话可以设置其他的跟踪分支，或是一个在其他远程仓库上的跟踪分支，又或者不跟踪 master 分支。 最简单的实例就是像之前看到的那样，运行`git checkout -b <branch> <remote>/<branch>`。 这是一个十分常用的操作所以 Git 提供了 `--track`快捷方式：
```shell
$ git checkout --track origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```
由于这个操作太常用了，该捷径本身还有一个捷径。 如果你尝试检出的分支 (a) 不存在且 (b) 刚好只有一个名字与之匹配的远程分支，那么 Git 就会为你创建一个跟踪分支：
```shell
$ git checkout serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```
如果想要将本地分支与远程分支设置为不同的名字，你可以轻松地使用上一个命令增加一个不同名字的本地分支：
```shell
$ git checkout -b sf origin/serverfix
Branch sf set up to track remote branch serverfix from origin.
Switched to a new branch 'sf'
```
现在，本地分支 sf 会自动从 origin/serverfix 拉取。

设置已有的本地分支跟踪一个刚刚拉取下来的远程分支，或者想要修改正在跟踪的上游分支， 你可以在任意时间使用`-u`或`--set-upstream-to`选项运行 git branch 来显式地设置。
如下为设置当前分支跟踪远程分支origin/serverfix
```shell
$ git branch -u origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
```

>Note
上游快捷方式
当设置好跟踪分支后，可以通过简写 @{upstream} 或 @{u} 来引用它的上游分支。 所以在 master 分支时并且它正在跟踪 origin/master 时，如果愿意的话可以使用 git merge @{u} 来取代 git merge origin/master。


如果想要查看设置的所有跟踪分支，可以使用`git branch`的`-vv`选项。 这会将所有的本地分支列出来并且包含更多的信息，如每一个分支正在跟踪哪个远程分支与本地分支是否是领先、落后或是都有。
```shell
$ git branch -vv
  iss53     7e424c3 [origin/iss53: ahead 2] forgot the brackets
  master    1ae2a45 [origin/master] deploying index fix
* serverfix f8674d9 [teamone/server-fix-good: ahead 3, behind 1] this should do it
  testing   5ea463a trying something new
```
这里可以看到`iss53`分支正在跟踪`origin/iss53`并且 “ahead” 是 2，意味着本地有两个提交还没有推送到服务器上。 也能看到 master 分支正在跟踪 origin/master 分支并且是最新的。 接下来可以看到 serverfix 分支正在跟踪 teamone 服务器上的 server-fix-good 分支并且领先 3 落后 1， 领先3表示本地有三次提交还没有推送到远程服务器上；落后1表示远程服务器上有一次提交还没有合并入。 最后看到 testing 分支并没有跟踪任何远程分支。

**需要重点注意的一点是这些数字的值来自于你从每个服务器上最后一次抓取的数据**。 这个命令并没有连接服务器，它只会告诉你关于本地缓存的服务器数据。 如果想要统计最新的领先与落后数字，需要在运行此命令前抓取所有的远程仓库。 可以像这样做：
```shell
$ git fetch --all; git branch -vv
```

#### 跟踪分支的作用
1. 配合不带参数的git push、git pull使用
2. 通过git branch -vv命令可以清楚的知道跟踪分支与它跟踪的远程分支之间的提交状态关系

### 拉取
当 git fetch 命令从服务器上抓取本地没有的数据时，它并不会修改工作目录中的内容。 它只会获取数据然后让你自己合并。 然而，有一个命令叫作 git pull 在大多数情况下它的含义是一个 git fetch 紧接着一个 git merge 命令。 如果有一个像之前章节中演示的设置好的跟踪分支，不管它是显式地设置还是通过 clone 或 checkout 命令为你创建的，git pull 都会查找当前分支所跟踪的服务器与分支， 从服务器上抓取数据然后尝试合并入那个远程分支。

由于`git pull`的魔法经常令人困惑所以通常单独显式地使用 fetch 与 merge 命令会更好一些。

#### git fetch详解
一旦远程主机的版本库有了更新（Git术语叫做commit），需要将这些更新取回本地，这时就要用到`git fetch`命令。
```shell
$ git fetch <远程主机名>
```
上面命令将某个远程主机的更新，**全部**取回本地。
`git fetch`命令通常用来查看其他人的进程，因为它取回的代码对你本地的开发代码没有影响。

默认情况下，`git fetch`取回所有分支（branch）的更新。如果只想取回特定分支的更新，可以指定分支名。
```shell
$ git fetch <远程主机名> <分支名>
```
比如，取回origin主机的master分支。
```shell
$ git fetch origin master
```
所取回的更新，在本地主机上要用"远程主机名/分支名"的形式读取。比如origin主机的master，就要用origin/master读取。
git branch命令的-r选项，可以用来查看远程分支，-a选项查看所有分支。
```shell
$ git branch -r
origin/master

$ git branch -a
* master
  remotes/origin/master
```
上面命令表示，本地主机的当前分支是master，远程分支是origin/master。
取回远程主机的更新以后，可以在它的基础上，使用git checkout命令创建一个新的分支。
```shell
$ git checkout -b newBrach origin/master
```
上面命令表示，在origin/master的基础上，创建一个新分支。
此外，也可以使用git merge命令或者git rebase命令，在本地分支上合并远程分支。
```shell
$ git merge origin/master
# 或者
$ git rebase origin/master
```
上面命令表示在当前分支上，合并`origin/master`。

#### git pull详解
git pull命令的作用是，取回远程主机某个分支的更新，再与本地的指定分支合并。它的完整格式稍稍有点复杂。
```shell
$ git pull <远程主机名> <远程分支名>:<本地分支名>
```
比如，取回origin主机的next分支，与本地的master分支合并，需要写成下面这样。
```shell
$ git pull origin next:master
````
如果远程分支是与当前分支合并，则冒号后面的部分可以省略。
```shell
$ git pull origin next
```
上面命令表示，取回origin/next分支，**再与当前分支合并, 而不管是否有跟踪分支跟踪origin/next分支**。实质上，这等同于先做git fetch，再做git merge。
```shell
$ git fetch origin
$ git merge origin/next
```
在某些场合，Git会自动在本地分支与远程分支之间，建立一种追踪关系（tracking）。比如，在git clone的时候，所有本地分支默认与远程主机的同名分支，建立追踪关系，也就是说，本地的master分支自动"追踪"origin/master分支。
Git也允许手动建立追踪关系。
```shell
git branch --set-upstream master origin/next
```
上面命令指定master分支追踪origin/next分支。
如果当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名。
```shell
$ git pull origin
```
上面命令表示，本地的当前分支自动与对应的origin主机"追踪分支"（remote-tracking branch）进行合并。
如果当前分支只有一个追踪分支，连远程主机名都可以省略。
```shell
$ git pull
````
**上面命令表示，当前分支自动与唯一一个追踪分支进行合并。**
如果合并需要采用rebase模式，可以使用--rebase选项。
```shell
$ git pull --rebase <远程主机名> <远程分支名>:<本地分支名>
```
如果远程主机删除了某个分支，默认情况下，git pull 不会在拉取远程分支的时候，删除对应的本地分支。这是为了防止，由于其他人操作了远程主机，导致git pull不知不觉删除了本地分支。
但是，你可以改变这个行为，加上参数 -p 就会在本地删除远程已经删除的分支。
```shell
$ git pull -p
# 等同于下面的命令
$ git fetch --prune origin 
$ git fetch -p
```

### 删除远程分支
假设你已经通过远程分支做完所有的工作了——也就是说你和你的协作者已经完成了一个特性， 并且将其合并到了远程仓库的 master 分支（或任何其他稳定代码分支）。 可以运行带有`--delete`选项的`git push`命令来删除一个远程分支。 如果想要从服务器上删除 serverfix 分支，运行下面的命令：
```shell
$ git push origin --delete serverfix
To https://github.com/schacon/simplegit
 - [deleted]         serverfix
```
基本上这个命令做的只是从服务器上移除这个指针。 Git 服务器通常会保留数据一段时间直到垃圾回收运行，所以如果不小心删除掉了，通常是很容易恢复的。

# HEAD 的游离状态
HEAD处理游离状态，表示HEAD指向的是某个具体的提交对象而不是分支名

一般我们会使用命令`git checkout <branch_name>`来切换分支，HEAD 就会移动到指定的分支上。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104758.png)

但是，如果我们使用的是`git checkout <commit_id>`来切换到指定的某一次提交，HEAD 就会处于`detached`状态(HEAD detached from XXX)，也就是游离状态。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104808.png)

## HEAD 游离状态的利弊
好处：HEAD 处于游离状态时，开发者可以很方便地在历史版本之间互相切换，比如要回到某次提交，只需要 checkout 对应的 commit id 或者 tag 名即可。
弊端：若在该基础上进行了提交，则会新开一个「匿名分支」；也就是说我们的提交是无法可见保存的，<font color="red">一旦切换到别的分支，原游离状态以后的提交就不可追溯了。</font>

## 实际情景
下面我们来看看实际的例子。
首先查看一下当前的分支情况，当前只有一个 master 分支：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104818.png)

再来查看下近期的 log 日志：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104833.png)

然后假设我要回到倒数第二条 commit 时候的状态，顺便查看下本地工作目录状态以及分支状态：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104843.png)

可以看到，我还没有修改和提交的情况下，切换完成就给我新建了一个分支，并且指明 HEAD 正游离在 2772886 的`<commit id>`上。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104855.png)

如果不做任何修改，想回到 master 分支，直接 git checkout master 即可，而不要 checkout master 主干所对应的`<commit id>`。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104906.png)

顺利回到主干的话，HEAD 的游离状态会取消，原临时游离分支也会消失。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104917.png)

如果是在游离状态做了修改和提交，则：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104929.png)

切换会 master 分支时，在游离状态所做的修改和提交无法追溯：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104943.png)

## 如何解决
其实很简单，刚才有仔细看终端提示的同学就会知道，在切换到游离状态的时候应该新建一个分支，然后我们所有的操作修改和提交都会保存到该分支，HEAD 也就指向了该分支最新提交的 commit id 处，而不会再处于游离状态。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409104956.png)

当在新建分支上修改提交完毕时，就切换回 master 分支，将原分支合并到 master 分支就万事大吉了。 到这里就不再操作演示了，大家都懂。

# Git嵌套问题
## 问题描述
Git 仓库嵌套使用后，被嵌套的 Git 仓库不能被外层 Git 仓库检测到。

这也就意味着你在被嵌套的 Git 仓库中的更改，外层仓库是无感知的。导致这个问题的原因可能如下：

在代码中引入其他 Git 仓库；
Clone 别人的 Demo 并做修改；
不看场景的解决方案就是耍流氓。

## 场景一：在代码中引入其他 Git 仓库
这种情况，需要使用 submodule，过程如下：
```shell
git submodule add https://github.com/chenfengyanyu/fmap-demo.git

# 或者使用 clone
git clone --recursive https://github.com/chenfengyanyu/fmap-demo.git
```
这个操作类似于 Clone ，但是会在父仓库下面新建 .gitmodules 文件，我们看一下内容：
```shell
vi .gitmodules
```
大致如下：
```
[submodule "fmap-demo"]
        path = fmap-demo
        url = https://github.com/chenfengyanyu/fmap-demo.git
```
然后做正常提交就可以了。

需要注意的是，这样的操作只能提交一个引用，类似：fmap-demo @ 90758cf，打开的话，会跳到项目源地址。

## 场景二：Clone 别人的 Demo 并做修改
那么有时候，我们可能会 Clone 到一段代码来作为项目的脚手架，这时候嵌套的话，肯定不希望改子仓库的时候，父仓库毫无感知。那么这种情况如何处理呢？
github
首先，进入子仓库，也就是被嵌套的 Git 仓库，删除 .git 目录：
```
rm -rf .git
```
可以这么理解，一个项目不应该有俩 Git 地址，所以断开子仓库的原有联系，也就是删除 .git 目录。

然后，将你添加的项目拖出当前项目文件，进行提交。之后，再将项目拖回来，返回项目根目录，执行 add 操作：
```
git add fmap-demo
```
这里必须要选择子项目进行 add，此时 add . 和 add * 都无效。
之后正常 commit 和 push，就可以了。

# 常用命令
|命令|说明|
|---|---|
|`git config --list --show-origin`||
|`git config -f <file>`||
|`git config --global user.name "John Doe"`||
|`git config --global user.email johndoe@example.com`||
|`git config --global core.editor emacs`||
|`git config --list`||
|`git config <key>`||
|`git add -h`||
|`git hash-object -w new.txt`| 将new.txt生成一个数据对象，并将其写入Git数据库中|
|`git cat-file -p SHA-1`| 输出数据对象中的内容|
|`git cat-file -t SHA-1`| 输出数据对象中的类型|
|`git ls-files -s`|查看暂存区中的内容|
|`update-index`| 将某个文件放入暂存区中|
|`write-tree`| 将暂存区中的内容生成一个树对象|
|`read-tree`| 将树对象读入暂存区中|
|`git commit-tree 0155eb -p fdf4fc3`| 提交指定的树对象|
|`find .git/objects -type f`||
|`git status -s`| 缩短状态命令的输出|
|`git add`|这是个多功能命令：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。 将这个命令理解为“精确地将内容添加到下一次提交中”而不是“将一个文件添加到项目中”要更加合适|
|`git diff`|此命令比较的是工作目录中当前文件和暂存区域快照之间的差异。 也就是修改之后还没有暂存起来的变化内容。|
|`git diff --staged`或`git diff --cached`| 这条命令将比对已暂存文件与最后一次提交的文件差异|
|`git commit -m "Story 182: Fix benchmarks for speed"`| 提交|
|`git commit -a`| Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 git add 步骤|
|`git rm`|连带从工作目录中删除指定的文件，这样以后就不会出现在未跟踪文件清单中了。|
|`git rm --cached README`| 从暂存区中删除指定文件， 但不将其从本地工作目录中删除|
|`git mv`||
|`git commit --amend`||
|`git reset HEAD CONTRIBUTING.md`||
|`git checkout -- <file>`||
|`git remote -v`||
|`git remote add <shortname> <url>`||
|`git fetch <remote>`||
|`git push <remote> <branch>`||
|`git remote show <remote>`||
|`git remote rename <name1> <name2>`||
|`git remote remove <name>`||
|`git checkout -b <分支名>`||
|`git branch -d  <分支名>`||
|`git branch –merged`|查看哪些分支已经合并到当前分支在这个列表中分支名字前没有*号的分支通常可以使用|
|`git branch --no-merged`|查看所有包含未合并工作的分支|
|`git merge <分支名>`||
|`git branch <分支名>`||
|`git checkout <分支名>`||
|`git checkout -b <newbranchname>`||
|`git log --oneline --decorate --graph --all`||

