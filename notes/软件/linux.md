# 进程、进程组、作业、session
## 进程、进程组与作业
每个进程都会属于一个进程组，进程组中可以包含一个或多个进程。进程组中有一个进程组长，组长的进程 ID 是进程组 ID(PGID)
```bash
$ ps -o pid,pgid,ppid,comm | cat
  PID  PGID  PPID  COMMAND
10179  10179 10177 bash
10263  10263 10179 ps
10264  10263 10179 cat
```
下边通过简单的示例来理解进程组
- bash：进程和进程组ID都是 10179，父进程其实是 sshd(10177)
- ps：进程和进程组ID都是 10263，父进程是 bash(10179)，因为是在 Shell 上执行的命令
- cat：进程组 ID 与 ps 的进程组 ID 相同，父进程同样是 bash(10179)

容易理解 Bash 就是Shell进程，Shell 父进程是 sshd；ps 与 cat 通过管道符号一起运行，属于一个进程组，其父进程都是 Bash；一个进程组也被称为「作业」。

## session
我们常见的 Linux session 一般是指 shell session。Shell session 是终端中当前的状态，在终端中只能有一个 session。当我们打开一个新的终端时，总会创建一个新的 shell session。

就进程间的关系来说，session 由一个或多个进程组组成。一般情况下，来自单个登录的所有进程都属于同一个 session。我们可以通过下图来理解进程、进程组和 session 之间的关系：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425205747.png)

会话是由会话中的第一个进程创建的，一般情况下是打开终端时创建的 shell 进程。该进程也叫 session 的领头进程。Session 中领头进程的 PID 也就是 session 的 SID。我们可以通过下面的命令查看 SID：

```bash
$ ps -o pid,ppid,pgid,sid,tty,comm
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425205822.png)

Session 中的每个进程组被称为一个 job，有一个 job 会成为 session 的前台 job(foreground)，其它的 job 则是后台 job(background)。每个 session 连接一个控制终端(control terminal)，控制终端中的输入被发送给前台 job，从前台 job 产生的输出也被发送到控制终端上。同时由控制终端产生的信号，比如 ctrl + z 等都会传递给前台 job。

一般情况下 session 和终端是一对一的关系，当我们打开多个终端窗口时，实际上就创建了多个 session。

Session 的意义在于多个工作(job)在一个终端中运行，其中的一个为前台 job，它直接接收该终端的输入并把结果输出到该终端。其它的 job 则在后台运行。

### session 的诞生与消亡
通常，新的 session 由系统登录程序创建，session 中的领头进程是运行用户登录 shell 的进程。新创建的每个进程都会属于一个进程组，当创建一个进程时，它和父进程在同一个进程组、session 中。

将进程放入不同 session 的惟一方法是使用 setsid 函数使其成为新 session 的领头进程。这还会将 session 领头进程放入一个新的进程组中。

当 session 中的所有进程都结束时 session 也就消亡了。实际使用中比如网络断开了，session 肯定是要消亡的。另外就是正常的消亡，比如让 session 的领头进程退出。一般情况下 session 的领头进程是 shell 进程，如果它处于前台，我们可以使用 exit 命令或者是 ctrl + d 让它退出。或者我们可以直接通过 kill 命令杀死 session 的领头进程。这里面的原理是：当系统检测到挂断(hangup)条件时，内核中的驱动会将 SIGHUP 信号发送到整个 session。通常情况下，这会杀死 session 中的所有进程。

### session 与终端的关系
如果 session 关联的是伪终端，这个伪终端本身就是随着 session 的建立而创建的，session 结束，那么这个伪终端也会被销毁。

如果 session 关联的是 tty1-6，tty 则不会被销毁。因为该终端设备是在系统初始化的时候创建的，并不是依赖该会话建立的，所以当 session 退出，tty 仍然存在。只是 init 系统在 session 结束后，会重启 getty 来监听这个 tty。

### nohup
如果我们在 session 中执行了 nohup 等类似的命令，当 session 消亡时，相关的进程并不会随着 session 结束，原因是这些进程不再受 SIGHUP 信号的影响。比如我们执行下面的命令：
```bash
$ nohup sleep 1000 >/dev/null 2>&1 & 
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425205922.png)

此时 sleep 进程的 sid 和其它进程是相同的，还可以通过 pstree 命令看到进程间的父子关系：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425205939.png)

如果我们退出当前 session 的领头进程(bash)，sleep 进程并不会退出，这样我们就可以放心的等待该进程运行结果了。

nohup 并不改变进程的 sid，同时也说明在这种情况中，虽然 session 的领头进程退出了，但是 session 依然没有被销毁(至少 sid 还在被引用)。重新建立连接，通过下面的命令查看 sleep 进程的信息，发现进程的 sid 依然是 7837：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425210005.png)

但是此时的 sleep 已经被系统的 1 号进程 systemd 收养了：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425210037.png)

### setsid
setsid 会创建一个新的 session，它的目的是让进程在后台执行命令，实现方式就是让命令进程运行在一个新的与终端脱离的 session 中。看下面的示例：
```bash
$ setsid sleep 1000
```
查找之下居然没有发现 sleep 进程的踪迹：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425210108.png)

通过 grep 查询 sleep 进程的 PID：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425210123.png)

去查看 sleep 进程所在的 sid，发现是一个新的 session ID，并且没有关联终端：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425210137.png)

当一个进程通过调用 setsid 成为一个新的 session 领头进程时，它会与控制终端断开连接。

此时通过 pstree 查看进程间的关系，发现 sleep 进程直接被系统的 1 号进程 systemd 收养了：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220425210153.png)

# 服务相关操作
## service 命令
service 命令用于对系统服务进行管理，比如启动（start）、停止（stop）、重启（restart）、重新加载配置（reload）、查看状态（status）等。不同的 Linux 发行版一般均会带有此命令，比如 RHEL、CentOS、SUSE、Ubuntu、Fedora 等。
service 命令是系统管理员命令，需要管理员权限才可以执行。service 命令本质上是一个 Shell 脚本，地址一般为 /sbin/service。
**命令格式**
```bash
service SCRIPT [start|stop|restart|status] [OPTIONS]
service --status-all
service --help | -h | --version
```
SCRIPT 表示管理服务的脚本，存放在 /etc/init.d/SCRIPT。服务脚本 SCRIPT 应该至少支持 start 命令和 stop 命令。
**OPTIONS选项说明**
```
--status-all
	按字母顺序执行所有初始化脚本并传递 status 命令，显示所有的服务状态
-h, --help
	显示帮助信息
--version
	显示版本信息
```
**常用示例**
1. 查看所有服务当前的运行状态。
```bash
service --status-all
```
2. 将 MySQL 注册为系统服务，使用 service 命令管理。需要将MySQL的管理脚本mysql.server更名为mysqld放在 /etc/init.d/目录。
```bash
# 开启
service mysqld start

# 关闭
service mysqld stop

# 重启
service mysqld restart
```

# 进程相关操作
## ctrl+z
ctrl + z可以将一个正在前台执行的命令放到后台，即前台进程的挂起

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213306.png)

## ctrl+c
前台进程的终止

## &
& 最经常被用到这个用在一个命令的最后，可以把这个命令放到后台执行

## top
Linux top命令用于实时显示 process 的动态。

### 实例
- 显示进程信息
```bash
# top
```
- 以累积模式显示程序信息
```bash
# top -S
```
- 设置信息更新次数
```bash
//表示更新两次后终止更新显示
top -n 2
```
- 设置信息更新时间
```bash
//表示更新周期为3秒
# top -d 3
```
- 显示指定的进程信息
```bash
//显示进程号为139的进程信息，CPU、内存占用率等
# top -p 139
```
- 显示更新十次后退出
```bash
top -n 10
```

## jobs
jobs列出<font color="red">当前shell环境</font>中已启动的任务状态，若未指定jobsid，则显示所有活动的任务状态信息；
jobs命令用于显示Linux中的任务列表及任务状态，包括后台运行的任务。该命令可以显示任务号及其对应的进程号。其中，任务号是以普通用户的角度进行的，而进程号则是从系统管理员的角度来看的。一个任务可以对应于一个或者多个进程号。

参数：
-l：显示进程号；
-p：仅任务对应的显示进程号；
-n：显示任务状态的变化；
-r：仅输出运行状态（running）的任务；
-s：仅输出停止状态（stoped）的任务。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213321.png)

<font color="red">注：</font> 切换到tmux的shell中的或是开启子shell， 然后再执行jobs命名会发现没有bin/spark-shell进程挂起， 这是因为jobs只列出的当前shell环境中的已启动的任务状态。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213335.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213350.png)

## ps
列出系统中正在运行的进程；

不加参数执行ps命令：展示当前shell中运行的进程情况，很少使用。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213401.png)

默认展示了4列信息：
PID: 运行着的命令(CMD)的进程编号
TTY: terminal type that the user is logged into 
TIME: 运行着的该命令所占用的CPU处理时间
CMD: 该进程所运行的命令

ps常使用的参数：
-A ：所有的进程均显示出来，与 -e 具有同样的效用；
-a ：显示现行终端机下的所有进程，包括其他用户的进程；
-u ：查看特定用户进程；
由于输出的内容太多，ps一般使用情况是`ps aux | grep %要查询的东西%`, 注意，`aux`前没有`-`

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213411.png)

## pstree
pstree shows running processes as a tree.  The tree is rooted at either pid or init if pid is omitted.  If a user name is specified, all process trees rooted at processes owned by that user are shown.

pstree visually merges identical branches by putting them in square brackets and prefixing them with the repetition count, e.g.
```
 init-+-getty
      |-getty
      |-getty
      `-getty
```
becomes
```
 init---4*[getty]
```
Child threads of a process are found under the parent process and are shown with the process name in curly braces, e.g.
```
 icecast2---13*[{icecast2}]
```

例子：
```bash
#pstree  -up

systemd(1)-+-agetty(2021)
           |-agetty(2022)
           |-bash(23254,ffy)
           |-chronyd(1180,chrony)
           |-crond(1277)---crond(25734)---sogou-agent(25736)---sleep(25759)
           |-dbus-daemon(1123,dbus)
           
           |-python(25707,dlj)-+-python(25778)-+-{python}(25781)
           |                   |               |-{python}(25783)
           |                   |               |-{python}(25784)
           |                   |               |-{python}(27547)
           |                   |               `-{python}(27548)
           |                   |-python(25779)-+-{python}(25785)
           |                   |               |-{python}(25786)
           |                   |               `-{python}(25788)
           |                   |-python(25780)-+-{python}(27549)
           |                   |               |-{python}(27550)
           |                   |               |-{python}(27551)
           |                   |               |-{python}(27552)
           |                   |               |-{python}(27553)
           |                   |               |-{python}(27554)
           |                   |               `-{python}(27555)
           |                   |-python(25782)-+-{python}(29319)
           |                   |               |-{python}(29320)
           |                   |               |-{python}(29321)
           |                   |               |-{python}(29322)
           |                   |               |-{python}(29323)
           |                   |               |-{python}(29324)
           |                   |               `-{python}(29325)
           |                   `-python(25787)
           
```
- 可以看到所有的进程都是依附在systemd这个进程下面，它的进程PID是1，因为它是由Linux内核主动调用的一个进程。
- 可以从中看出来进程所属的用户为dlj，每个进程的pid
- 而且，25707这个进程有5个子进程，分别为25778,25779,25780,25782,25787
- 25778这个进程也有几个子线程，分别为,25781，25783,25784,27547,27548

## fg
fg将后台中的命令调至前台继续运行如果后台中有多个命令，可以用`fg %jobnumber`将选中的命令调出， `%jobnumber`是通过jobs命令查到的后台正在执行的命令的序号(不是pid)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213425.png)

## bg
bg将一个在后台暂停的命令，变成继续执行， 即使一个进程在后台

如果后台中有多个命令，可以用bg %jobnumber将选中的命令调出，%jobnumber是通过jobs命令查到的后台正在执行的命令的序号(不是pid) 

## kill
Linux kill 命令用于删除执行中的程序或工作。

kill 可将指定的信息送至程序。预设的信息为 SIGTERM(15)，可将指定程序终止。若仍无法终止该程序，可使用 SIGKILL(9) 信息尝试强制删除程序。程序或工作的编号可利用 ps 指令或 jobs 指令查看。

### 实例
- 杀死进程
```bash
# kill 12345
```
- 强制杀死进程
```bash
# kill -KILL 123456
```
- 发送SIGHUP信号，可以使用一下信号
```bash
# kill -HUP pid
```
- 彻底杀死进程
```bash
# kill -9 123456
```
- 显示信号
```bash
# kill -l
1) SIGHUP     2) SIGINT     3) SIGQUIT     4) SIGILL     5) SIGTRAP
6) SIGABRT     7) SIGBUS     8) SIGFPE     9) SIGKILL    10) SIGUSR1
11) SIGSEGV    12) SIGUSR2    13) SIGPIPE    14) SIGALRM    15) SIGTERM
16) SIGSTKFLT    17) SIGCHLD    18) SIGCONT    19) SIGSTOP    20) SIGTSTP
21) SIGTTIN    22) SIGTTOU    23) SIGURG    24) SIGXCPU    25) SIGXFSZ
26) SIGVTALRM    27) SIGPROF    28) SIGWINCH    29) SIGIO    30) SIGPWR
31) SIGSYS    34) SIGRTMIN    35) SIGRTMIN+1    36) SIGRTMIN+2    37) SIGRTMIN+3
38) SIGRTMIN+4    39) SIGRTMIN+5    40) SIGRTMIN+6    41) SIGRTMIN+7    42) SIGRTMIN+8
43) SIGRTMIN+9    44) SIGRTMIN+10    45) SIGRTMIN+11    46) SIGRTMIN+12    47) SIGRTMIN+13
48) SIGRTMIN+14    49) SIGRTMIN+15    50) SIGRTMAX-14    51) SIGRTMAX-13    52) SIGRTMAX-12
53) SIGRTMAX-11    54) SIGRTMAX-10    55) SIGRTMAX-9    56) SIGRTMAX-8    57) SIGRTMAX-7
58) SIGRTMAX-6    59) SIGRTMAX-5    60) SIGRTMAX-4    61) SIGRTMAX-3    62) SIGRTMAX-2
63) SIGRTMAX-1    64) SIGRTMAX
```
- 杀死指定用户所有进程
```bash
#kill -9 $(ps -ef | grep hnlinux) //方法一 过滤出hnlinux用户进程 
#kill -u hnlinux //方法二
```

## Linux让进程（正在运行）在后台运行：nohup/&//setid/disown/
咱们常常会碰到这样的问题，用 telnet/ssh 登陆了远程的 Linux 服务器，运行了一些耗时较长的任务， 结果却因为网络的不稳定致使任务中途失败。如何让命令提交后不受本地关闭终端窗口/网络断开链接的干扰呢？下面举了一些例子， 您能够针对不一样的场景选择不一样的方式来处理这个问题。

若是只是临时有一个命令须要长时间运行，什么方法能最简便的保证它在后台稳定运行呢？

> hangup 名称的来由
> 在 Unix 的早期版本中，每一个终端都会经过 modem 和系统通信。当用户 logout 时，modem 就会挂断（hang up）电话。 同理，当 modem 断开链接时，就会给终端发送 hangup 信号来通知其关闭全部子进程。

咱们知道，当用户注销（logout）或者网络断开时，终端会收到 HUP（hangup）信号从而关闭其全部子进程。所以，咱们的解决办法就有两种途径：要么让进程忽略 HUP 信号，要么让进程运行在新的会话里从而成为不属于此终端的子进程。

### nohup
nohup 无疑是咱们首先想到的办法。顾名思义，nohup 的用途就是让提交的命令忽略 hangup 信号。让咱们先来看一下 nohup 的帮助信息
```
NOHUP(1)                        User Commands                        NOHUP(1)

NAME
       nohup - run a command immune to hangups, with output to a non-tty

SYNOPSIS
       nohup COMMAND [ARG]...
       nohup OPTION

DESCRIPTION
       Run COMMAND, ignoring hangup signals.

       --help display this help and exit

       --version
              output version information and exit
```
可见，nohup 的使用是十分方便的，只需在要处理的命令前加上 nohup 便可，标准输出和标准错误缺省会被重定向到 nohup.out 文件中。通常咱们可在结尾加上”&”来将命令同时放入后台运行，也可用`>filename 2>&1`来更改缺省的重定向文件名。

nohup 示例
```bash
[root@pvcent107 ~]# nohup ping www.ibm.com &
[1] 3059
nohup: appending output to `nohup.out'
[root@pvcent107 ~]# ps -ef |grep 3059
root      3059   984  0 21:06 pts/3    00:00:00 ping www.ibm.com
root      3067   984  0 21:06 pts/3    00:00:00 grep 3059
[root@pvcent107 ~]#
```

### setsid
nohup 无疑能经过忽略 HUP 信号来使咱们的进程避免中途被中断，但若是咱们换个角度思考，若是咱们的进程不属于接受 HUP 信号的终端的子进程，那么天然也就不会受到 HUP 信号的影响了。setsid 就能帮助咱们作到这一点。让咱们先来看一下 setsid 的帮助信息：
```
SETSID(8)                 Linux Programmer’s Manual                 SETSID(8)

NAME
       setsid - run a program in a new session

SYNOPSIS
       setsid program [ arg ... ]

DESCRIPTION
       setsid runs a program in a new session.
```
可见 setsid 的使用也是很是方便的，也只需在要处理的命令前加上 setsid 便可

setsid 示例
```bash
[root@pvcent107 ~]# setsid ping www.ibm.com
[root@pvcent107 ~]# ps -ef |grep www.ibm.com
root     31094     1  0 07:28 ?        00:00:00 ping www.ibm.com
root     31102 29217  0 07:29 pts/4    00:00:00 grep www.ibm.com
[root@pvcent107 ~]#
```

值得注意的是，上例中咱们的进程 ID(PID)为31094，而它的父 ID（PPID）为1（即为 init 进程 ID），并非当前终端的进程 ID。请将此例与nohup 例中的父 ID 作比较。

### &
这里还有一个关于 subshell 的小技巧。咱们知道，将一个或多个命名包含在`()`中就能让这些命令在子 shell 中运行中，从而扩展出不少有趣的功能，咱们如今要讨论的就是其中之一。

当咱们将`&`也放入`()`内以后，咱们就会发现所提交的做业并不在做业列表中，也就是说，是没法经过jobs来查看的。让咱们来看看为何这样就能躲过 HUP 信号的影响吧。

subshell 示例
```bash
[root@pvcent107 ~]# (ping www.ibm.com &)
[root@pvcent107 ~]# ps -ef |grep www.ibm.com
root     16270     1  0 14:13 pts/4    00:00:00 ping www.ibm.com
root     16278 15362  0 14:13 pts/4    00:00:00 grep www.ibm.com
[root@pvcent107 ~]#
```

从上例中能够看出，新提交的进程的父 ID（PPID）为1（init 进程的 PID），并非当前终端的进程 ID。所以并不属于当前终端的子进程，从而也就不会受到当前终端的 HUP 信号的影响了

### disown
咱们已经知道，若是事先在命令前加上 nohup 或者 setsid 就能够避免 HUP 信号的影响。可是若是咱们未加任何处理就已经提交了命令，该如何补救才能让它避免 HUP 信号的影响呢？

这时想加 nohup 或者 setsid 已经为时已晚，只能经过做业调度和 disown 来解决这个问题了。让咱们来看一下 disown 的帮助信息：
```
disown [-ar] [-h] [jobspec ...]
    Without options, each jobspec is  removed  from  the  table  of
    active  jobs.   If  the -h option is given, each jobspec is not
    removed from the table, but is marked so  that  SIGHUP  is  not
    sent  to the job if the shell receives a SIGHUP.  If no jobspec
    is present, and neither the -a nor the -r option  is  supplied,
    the  current  job  is  used.  If no jobspec is supplied, the -a
    option means to remove or mark all jobs; the -r option  without
    a  jobspec  argument  restricts operation to running jobs.  The
 return value is 0 unless a jobspec does  not  specify  a  valid
    job.
```
能够看出，咱们能够用以下方式来达成咱们的目的。 

**灵活运用 CTRL-z**

在咱们的平常工做中，咱们能够用 CTRL-z 来将当前进程挂起到后台暂停运行，执行一些别的操做，而后再用 fg 来将挂起的进程从新放回前台（也可用 bg 来将挂起的进程放在后台）继续运行。这样咱们就能够在一个终端内灵活切换运行多个任务，这一点在调试代码时尤其有用。由于将代码编辑器挂起到后台再从新放回时，光标定位仍然停留在上次挂起时的位置，避免了从新定位的麻烦。

- 用disown -h jobspec来使某个做业忽略HUP信号。
- 用disown -ah 来使全部的做业都忽略HUP信号。
- 用disown -rh 来使正在运行的做业忽略HUP信号。

须要注意的是，当使用过 disown 以后，会将把目标做业从做业列表中移除，咱们将不能再使用jobs来查看它，可是依然可以用ps -ef查找到它。

可是还有一个问题，这种方法的操做对象是做业，若是咱们在运行命令时在结尾加了”&”来使它成为一个做业并在后台运行，那么就万事大吉了，咱们能够经过jobs命令来获得全部做业的列表。可是若是并无把当前命令做为做业来运行，如何才能获得它的做业号呢？答案就是用 CTRL-z（按住Ctrl键的同时按住z键）了！

CTRL-z 的用途就是将当前进程挂起（Suspend），而后咱们就能够用jobs命令来查询它的做业号，再用bg jobspec来将它放入后台并继续运行。须要注意的是，若是挂起会影响当前进程的运行结果，请慎用此方法。

disown 示例1（若是提交命令时已经用“&”将命令放入后台运行，则能够直接使用“disown”）
```bash
[root@pvcent107 build]# cp -r testLargeFile largeFile &
[1] 4825
[root@pvcent107 build]# jobs
[1]+  Running                 cp -i -r testLargeFile largeFile &
[root@pvcent107 build]# disown -h %1
[root@pvcent107 build]# ps -ef |grep largeFile
root      4825   968  1 09:46 pts/4    00:00:00 cp -i -r testLargeFile largeFile
root      4853   968  0 09:46 pts/4    00:00:00 grep largeFile
[root@pvcent107 build]# logout
```

disown 示例2（若是提交命令时未使用“&”将命令放入后台运行，可以使用 CTRL-z 和“bg”将其放入后台，再使用“disown”）
```bash
[root@pvcent107 build]# cp -r testLargeFile largeFile2

[1]+  Stopped                 cp -i -r testLargeFile largeFile2
[root@pvcent107 build]# bg %1
[1]+ cp -i -r testLargeFile largeFile2 &
[root@pvcent107 build]# jobs
[1]+  Running                 cp -i -r testLargeFile largeFile2 &
[root@pvcent107 build]# disown -h %1
[root@pvcent107 build]# ps -ef |grep largeFile2
root      5790  5577  1 10:04 pts/3    00:00:00 cp -i -r testLargeFile largeFile2
root      5824  5577  0 10:05 pts/3    00:00:00 grep largeFile2
[root@pvcent107 build]#
```

# 文件相关操作
## grep
Linux grep 命令用于查找文件里符合条件的字符串。

grep 指令用于查找内容包含指定的范本样式的文件，如果发现某文件的内容符合所指定的范本样式，预设 grep 指令会把含有范本样式的那一列显示出来。若不指定任何文件名称，或是所给予的文件名为 -，则 grep 指令会从标准输入设备读取数据。

### 实例
1. 在当前目录中，查找后缀有 file 字样的文件中包含 test 字符串的文件，并打印出该字符串的行。此时，可以使用如下命令：
```bash
grep test *file 
```
结果如下所示：
```bash
$ grep test test* #查找前缀有“test”的文件包含“test”字符串的文件  
testfile1:This a Linux testfile! #列出testfile1 文件中包含test字符的行  
testfile_2:This is a linux testfile! #列出testfile_2 文件中包含test字符的行  
testfile_2:Linux test #列出testfile_2 文件中包含test字符的行 
```

2. 以递归的方式查找符合条件的文件。例如，查找指定目录/etc/acpi 及其子目录（如果存在子目录的话）下所有文件中包含字符串"update"的文件，并打印出该字符串所在行的内容，使用的命令为：
```bash
grep -r update /etc/acpi 
```
输出结果如下：
```bash
$ grep -r update /etc/acpi #以递归的方式查找“etc/acpi”  
#下包含“update”的文件  
/etc/acpi/ac.d/85-anacron.sh:# (Things like the slocate updatedb cause a lot of IO.)  
Rather than  
/etc/acpi/resume.d/85-anacron.sh:# (Things like the slocate updatedb cause a lot of  
IO.) Rather than  
/etc/acpi/events/thinkpad-cmos:action=/usr/sbin/thinkpad-keys--update 
```

3. 反向查找。前面各个例子是查找并打印出符合条件的行，通过"-v"参数可以打印出不符合条件行的内容。
查找文件名中包含 test 的文件中不包含test 的行，此时，使用的命令为：
```bash
grep -v test *test*
```
结果如下所示：
```bash
$ grep-v test* #查找文件名中包含test 的文件中不包含test 的行  
testfile1:helLinux!  
testfile1:Linis a free Unix-type operating system.  
testfile1:Lin  
testfile_1:HELLO LINUX!  
testfile_1:LINUX IS A FREE UNIX-TYPE OPTERATING SYSTEM.  
testfile_1:THIS IS A LINUX TESTFILE!  
testfile_2:HELLO LINUX!  
testfile_2:Linux is a free unix-type opterating system.  
```

## ag命令
Ag 是类似ack， grep的工具, 它来在文件中搜索相应关键字。

```bash
#在当前目录下寻找内容包含"小明"的文件，并列出所在的行数:
ag 小明

#在指定目录中寻找内容包含"foo"的文件:
ag foo [指定目录] 

#在当前目录下寻找内容包含"foo"的文件，但只列出文件名:
ag -l foo

#忽略大小写，寻找内容包含"ABC"的文件，并只输出匹配的内容，而非整行:
ag -i -o ABC

#在文件名包含"小红"的文件中寻找"小明":
ag 小明 -G 小红

#使用正则表达式来匹配文件内容:
ag '{{^ba(r|z)$}}'

#输出文件名包含"小明"的文件名:
ag -g 小明
```

## awk命令
AWK 是一种处理文本文件的语言，是一个强大的文本分析工具。

### 实例
log.txt文本内容如下：
```txt
2 this is a test
3 Are you like awk
This's a test
10 There are orange,apple,mongo
```

#### 用法一
```bash
awk '{[pattern] action}' {filenames}   # 行匹配语句 awk '' 只能用单引号
```
实例：
```bash
# 每行按空格或TAB分割，输出文本中的1、4项
 $ awk '{print $1,$4}' log.txt
 ---------------------------------------------
 2 a
 3 like
 This's
 10 orange,apple,mongo
 # 格式化输出
 $ awk '{printf "%-8s %-10s\n",$1,$4}' log.txt
 ---------------------------------------------
 2        a
 3        like
 This's
 10       orange,apple,mongo
``` 

#### 用法二：
```bash
awk -F  #-F相当于内置变量FS, 指定分割字符
```
实例：
```bash
# 使用","分割
 $  awk -F, '{print $1,$2}'   log.txt
 ---------------------------------------------
 2 this is a test
 3 Are you like awk
 This's a test
 10 There are orange apple
 # 或者使用内建变量
 $ awk 'BEGIN{FS=","} {print $1,$2}'     log.txt
 ---------------------------------------------
 2 this is a test
 3 Are you like awk
 This's a test
 10 There are orange apple
 # 使用多个分隔符.先使用空格分割，然后对分割结果再使用","分割
 $ awk -F '[ ,]'  '{print $1,$2,$5}'   log.txt
 ---------------------------------------------
 2 this test
 3 Are awk
 This's a
 10 There apple
```

#### 用法三：
```bash
awk -v  # 设置变量
```
实例：
```bash
 $ awk -va=1 '{print $1,$1+a}' log.txt
 ---------------------------------------------
 2 3
 3 4
 This's 1
 10 11
 $ awk -va=1 -vb=s '{print $1,$1+a,$1b}' log.txt
 ---------------------------------------------
 2 3 2s
 3 4 3s
 This's 1 This'ss
 10 11 10s
```

## sed命令
Linux sed 命令是利用脚本来处理文本文件。

sed 可依照脚本的指令来处理、编辑文本文件。Sed 主要用来自动编辑一个或多个文件、简化对文件的反复操作、编写转换程序等。




## find
Linux find 命令用来在指定目录下查找文件。

任何位于参数之前的字符串都将被视为欲查找的目录名。如果使用该命令时，不设置任何参数，则 find 命令将在当前目录下查找子目录与文件。并且将查找到的子目录和文件全部进行显示。

### 实例
1. 将当前目录及其子目录下所有文件后缀为 .c 的文件列出来:
```bash
# find . -name "*.c"
```

2. 将当前目录及其子目录中的所有文件列出：
```bash
# find . -type f
```

3. 将当前目录及其子目录下所有最近 20 天内更新过的文件列出:
```bash
# find . -ctime -20
```

4. 查找 /var/log 目录中更改时间在 7 日以前的普通文件，并在删除之前询问它们：
```bash
# find /var/log -type f -mtime +7 -ok rm {} \;
```

5. 查找当前目录中文件属主具有读、写权限，并且文件所属组的用户和其他用户具有读权限的文件：
```bash
# find . -type f -perm 644 -exec ls -l {} \;
```

6. 查找系统中所有文件长度为 0 的普通文件，并列出它们的完整路径：
```bash
# find / -type f -size 0 -exec ls -l {} \;
```

## which
Linux which命令用于查找文件。

which指令会在环境变量$PATH设置的目录里查找符合条件的文件。也就是说，使用which命令，就可以看到某个系统命令是否存在，以及执行的到底是哪一个位置的命令。

### 实例
使用指令"which"查看指令"bash"的绝对路径，输入如下命令：
```bash
$ which bash
```
上面的指令执行后，输出信息如下所示：
```bash
/bin/bash                   #bash可执行程序的绝对路径 
```

## whereis
whereis命令 用来定位指令的二进制程序、源代码文件和man手册页等相关文件的路径。

和find相比，whereis查找的速度非常快，这是因为linux系统会将 系统内的所有文件都记录在一个数据库文件中，当使用whereis和下面即将介绍的locate时，会从数据库中查找数据，而不是像find命令那样，通 过遍历硬盘来查找，效率自然会很高。 但是该数据库文件并不是实时更新，默认情况下时一星期更新一次，因此，我们在用whereis和locate 查找文件时，有时会找到已经被删除的数据，或者刚刚建立文件，却无法查找到，原因就是因为数据库文件没有被更新。

### 语法
```bash
whereis(选项)(参数)
```

- -b：只查找二进制文件；
- -B<目录>：只在设置的目录下查找二进制文件；
- -f：不显示文件名前的路径名称；
- -m：只查找说明文件；
- -M<目录>：只在设置的目录下查找说明文件；
- -s：只查找原始代码文件；
- -S<目录>只在设置的目录下查找原始代码文件；
- -u：查找不包含指定类型的文件。

参数：要查找的二进制程序、源文件和man手册页的指令名。

### 实例
将相关的文件都查找出来
```bash
[root@localhost ~]# whereis tomcat
tomcat:

[root@localhost ~]# whereis svn
svn: /usr/bin/svn /usr/local/svn /usr/share/man/man1/svn.1.gz
```
说明：tomcat没安装，找不出来，svn安装找出了很多相关文件

只将二进制文件查找出来 
```bash
[root@localhost ~]# whereis -b svn
svn: /usr/bin/svn /usr/local/svn

[root@localhost ~]# whereis -m svn
svn: /usr/share/man/man1/svn.1.gz

[root@localhost ~]# whereis -s svn
svn:
```
说明：whereis -m svn查出说明文档路径，whereis -s svn找source源文件。

## locate命令
Linux locate命令用于查找符合条件的文档，他会去保存文档和目录名称的数据库内，查找合乎范本样式条件的文档或目录。

一般情况我们只需要输入 locate your_file_name 即可查找指定文件。

### 实例
查找 passwd 文件，输入以下命令：
```bash
locate passwd
```
搜索 etc 目录下所有以 sh 开头的文件 ：
```bash
locate /etc/sh
```
忽略大小写搜索当前用户目录下所有以 r 开头的文件 ：
```bash
locate -i ~/r
```

### 附加说明
- locate 与 find 不同: find 是去硬盘找，locate 只在 /var/lib/slocate 资料库中找。
- locate 的速度比 find 快，它并不是真的查找，而是查数据库，一般文件数据库在 /var/lib/slocate/slocate.db 中，所以 locate 的查找并不是实时的，而是以数据库的更新为准，一般是系统自己维护，也可以手工升级数据库 ，命令为：
```bash
updatedb
```

## nl
nl命令在linux系统中用来计算文件中行号。

nl可以将输出的文件内容自动的加上行号！其默认的结果与 cat -n 有点不太一样， nl 可以将行号做比较多的显示设计，包括位数与是否自动补齐 0 等等的功能。

### 实例
1. 实例一用 nl 列出 log.log 的内容命令：
```bash
[yiibai@localhost test]$ cat log.log
this is line 1.
this is line 2.
this is line 3.
this is line 4.

this is line 5.

-----------------end
[yiibai@localhost test]$ nl log.log
     1  this is line 1.
     2  this is line 2.
     3  this is line 3.
     4  this is line 4.

     5  this is line 5.

     6  -----------------end
[yiibai@localhost test]$
```
说明：文件中的空白行，nl 不会加上行号。

2. 实例二用 nl 列出 log.log 的内容，空本行也加上行号。命令：
```bash
[yiibai@localhost test]$ nl -b a log.log
     1  this is line 1.
     2  this is line 2.
     3  this is line 3.
     4  this is line 4.
     5
     6  this is line 5.
     7
     8  -----------------end
[yiibai@localhost test]$
```

3. 实例三让行号前面自动补上0,统一输出格式。
```bash
[yiibai@localhost test]$ nl -b a -n rz log.log
000001  this is line 1.
000002  this is line 2.
000003  this is line 3.
000004  this is line 4.
000005
000006  this is line 5.
000007
000008  -----------------end
[yiibai@localhost test]$ nl -b a -n rz -w 3 log.log
001     this is line 1.
002     this is line 2.
003     this is line 3.
004     this is line 4.
005
006     this is line 5.
007
008     -----------------end
[yiibai@localhost test]$
```
说明：nl -b a -n rz 命令行号默认为六位，要调整位数可以加上参数 -w 3 调整为3位。

## sort
Linux sort 命令用于将文本文件内容加以排序。

sort 可针对文本文件的内容，以行为单位来排序。

### 实例
在使用 sort 命令以默认的式对文件的行进行排序，使用的命令如下：
```bash
sort testfile 
```
sort 命令将以默认的方式将文本文件的第一列以 ASCII 码的次序排列，并将结果输出到标准输出。

使用 cat 命令显示 testfile 文件可知其原有的排序如下：
```bash
$ cat testfile      # testfile文件原有排序  
test 30  
Hello 95  
Linux 85 
```
使用 sort 命令重排后的结果如下：
```bash
$ sort testfile # 重排结果  
Hello 95  
Linux 85  
test 30 
```
使用 -k 参数设置对第二列的值进行重排，结果如下：
```bash
$ sort testfile -k 2
test 30  
Linux 85 
Hello 95  
```

## wc命令
Linux wc命令用于计算字数。

利用wc指令我们可以计算文件的Byte数、字数、或是列数，若不指定文件名称、或是所给予的文件名为"-"，则wc指令会从标准输入设备读取数据。

### 实例
在默认的情况下，wc将计算指定文件的行数、字数，以及字节数。使用的命令为：
```bash
wc testfile 
```
先查看testfile文件的内容，可以看到：
```bash
$ cat testfile  
Linux networks are becoming more and more common, but scurity is often an overlooked  
issue. Unfortunately, in today’s environment all networks are potential hacker targets,  
fro0m tp-secret military research networks to small home LANs.  
Linux Network Securty focuses on securing Linux in a networked environment, where the  
security of the entire network needs to be considered rather than just isolated machines.  
It uses a mix of theory and practicl techniques to teach administrators how to install and  
use security applications, as well as how the applcations work and why they are necesary. 
```
使用 wc统计，结果如下：
```bash
$ wc testfile           # testfile文件的统计信息  
3 92 598 testfile       # testfile文件的行数为3、单词数92、字节数598 
```
其中，3 个数字分别表示testfile文件的行数、单词数，以及该文件的字节数。
如果想同时统计多个文件的信息，例如同时统计testfile、testfile_1、testfile_2，可使用如下命令：
```bash
wc testfile testfile_1 testfile_2   #统计三个文件的信息 
```
输出结果如下：
```bash
$ wc testfile testfile_1 testfile_2  #统计三个文件的信息  
3 92 598 testfile                    #第一个文件行数为3、单词数92、字节数598  
9 18 78 testfile_1                   #第二个文件的行数为9、单词数18、字节数78  
3 6 32 testfile_2                    #第三个文件的行数为3、单词数6、字节数32  
15 116 708 总用量                    #三个文件总共的行数为15、单词数116、字节数708 
```

## file命令
Linux file命令用于辨识文件类型。

通过file指令，我们得以辨识该文件的类型。

### 实例
显示文件类型：
```bash
[root@localhost ~]# file install.log
install.log: UTF-8 Unicode text

[root@localhost ~]# file -b install.log      <== 不显示文件名称
UTF-8 Unicode text

[root@localhost ~]# file -i install.log      <== 显示MIME类别。
install.log: text/plain; charset=utf-8

[root@localhost ~]# file -b -i install.log
text/plain; charset=utf-8
```

显示符号链接的文件类型
```bash
[root@localhost ~]# ls -l /var/mail
lrwxrwxrwx 1 root root 10 08-13 00:11 /var/mail -> spool/mail

[root@localhost ~]# file /var/mail
/var/mail: symbolic link to `spool/mail'

[root@localhost ~]# file -L /var/mail
/var/mail: directory

[root@localhost ~]# file /var/spool/mail
/var/spool/mail: directory

[root@localhost ~]# file -L /var/spool/mail
/var/spool/mail: directory
```

## more
more 命令类似 cat ，不过会以一页一页的形式显示，更方便使用者逐页阅读，而最基本的指令就是按空白键（space）就往下一页显示，按 b 键就会往回（back）一页显示，而且还有搜寻字串的功能（与 vi 相似），使用中的说明文件，请按 h 。

### 实例
逐页显示 testfile 文档内容，如有连续两行以上空白行则以一行空白行显示。
```bash
more -s testfile
```
从第 20 行开始显示 testfile 之文档内容。
```bash
more +20 testfile
```

## less
less 与 more 类似，less 可以随意浏览文件，支持翻页和搜索，支持向上翻页和向下翻页。

### 实例
1、查看文件
```bash
less log2013.log
```
2、ps查看进程信息并通过less分页显示
```bash
ps -ef |less
```
3、查看命令历史使用记录并通过less分页显示
```bash
[root@localhost test]# history | less
22  scp -r tomcat6.0.32 root@192.168.120.203:/opt/soft
23  cd ..
24  scp -r web root@192.168.120.203:/opt/
25  cd soft
26  ls
……省略……
```
4、浏览多个文件
```bash
less log2013.log log2014.log
```
## head
head 命令可用于查看文件的开头部分的内容，有一个常用的参数 -n 用于显示行数，默认为 10，即显示 10 行的内容。

### 实例
要显示 runoob_notes.log 文件的开头 10 行，请输入以下命令：
```bash
head runoob_notes.log
```
显示 notes.log 文件的开头 5 行，请输入以下命令：
```bash
head -n 5 runoob_notes.log
```
显示文件前 20 个字节:
```bash
head -c 20 runoob_notes.log
```

## tail
tail 命令可用于查看文件的内容，有一个常用的参数 -f 常用于查阅正在改变的日志文件。

`tail -f filename` 会把 filename 文件里的最尾部的内容显示在屏幕上，并且不断刷新，只要 filename 更新就可以看到最新的文件内容。

### 实例
要显示 notes.log 文件的最后 10 行，请输入以下命令：
```bash
tail notes.log         # 默认显示最后 10 行
```
要跟踪名为 notes.log 的文件的增长情况，请输入以下命令：
```bash
tail -f notes.log
```
此命令显示 notes.log 文件的最后 10 行。当将某些行添加至 notes.log 文件时，tail 命令会继续显示这些行。 显示一直继续，直到您按下（Ctrl-C）组合键停止显示。
显示文件 notes.log 的内容，从第 20 行至文件末尾:
```bash
tail -n +20 notes.log
```
显示文件 notes.log 的最后 10 个字符:
```bash
tail -c 10 notes.log
```

### -f/-F参数详解
`tail -f`等同于`--follow=descriptor`，根据文件描述符进行追踪，当文件改名或被删除，追踪停止
`tail -F`等同于`--follow=name --retry`，根据文件名进行追踪，并保持重试，即该文件被删除或改名后，如果再次创建相同的文件名，会继续追踪

#### WSL中tail命令失效问题
tail -f命令可以滚动查看文件不断更新的信息，尤其在查看日志上很有用。
但是在WSL（Windows Subsystem for Linux）中，却有可能无法正常工作。

经查找发现，Linux是通过inotify来获取文件变动的，但是我使用的WSL因为Bug，感知不到文件变动，造成此问题。

解决办法：
```
tail -f ---disable-inotify info.log
```
注意，disable前面是3个横杠。

## diff命令
Linux diff 命令用于比较文件的差异。

diff 以逐行的方式，比较文本文件的异同处。如果指定要比较目录，则 diff 会比较目录中相同文件名的文件，但不会比较其中子目录。

### 实例
实例1：比较两个文件
```bash
[root@localhost test3]# diff log2014.log log2013.log 
3c3
< 2014-03
---
> 2013-03
8c8
< 2013-07
---
> 2013-08
11,12d10
< 2013-11
< 2013-12
```
上面的"3c3"和"8c8"表示log2014.log和log20143log文件在3行和第8行内容有所不同；"11,12d10"表示第一个文件比第二个文件多了第11和12行。


### ”合并格式“的diff
如果两个文件相似度很高，那么上下文格式的diff，将显示大量重复的内容，很浪费空间。1990年，GNU diff率先推出了"合并格式"的diff，将f1和f2的上下文合并在一起显示。
它的使用方法是加入u参数（代表unified）。
```bash
$ diff -u f1 f2
```
显示结果如下：
```bash
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
```bash
　　--- f1 2012-08-29 16:45:41.000000000 +0800
　　+++ f2 2012-08-29 16:45:51.000000000 +0800
```
"---"表示变动前的文件，"+++"表示变动后的文件。
第二部分，变动的位置用两个@作为起首和结束。
```bash
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

## lsof
lsof（list open files）是一个查看当前系统文件的工具。在linux环境下，任何事物都以文件的形式存在，通过文件不仅仅可以访问常规数据，还可以访问网络连接和硬件。如传输控制协议 (TCP) 和用户数据报协议 (UDP) 套接字等，系统在后台都为该应用程序分配了一个文件描述符，该文件描述符提供了大量关于这个应用程序本身的信息。


### 常用选项
- -a 指示其它选项之间为与的关系
- -c <进程名> 输出指定进程所打开的文件
- -d <文件描述符> 列出占用该文件号的进程
- +d <目录>  输出目录及目录下被打开的文件和目录(不递归)
- +D <目录>  递归输出及目录下被打开的文件和目录
- -i <条件>  输出符合条件与网络相关的文件
- -n 不解析主机名
- -p <进程号> 输出指定 PID 的进程所打开的文件
- -P 不解析端口号
- -t 只输出 PID
- -u 输出指定用户打开的文件
- -U 输出打开的 UNIX domain socket 文件
- -h 显示帮助信息
- -v 显示版本信息

### 基本输出
如果不带任何选项执行 lsof 命令，会输出系统中所有 active 进程打开的所有文件，结果就是我们被输出的信息所淹没，这没有任何的意义。我们先让 lsof 命令输出当前 Bash 进程打开的文件，并截取其中的一部分结果来介绍输出内容中都包含哪些信息：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423230908.png)

- COMMAND：程序的名称 
- PID：进程标识符
- USER：进程所有者
- FD：文件描述符，应用程序通过文件描述符识别该文件
- TYPE：文件类型，如 DIR、REG 等
- DEVICE：以逗号分隔设备编号
- SIZE：文件的大小(bytes)
- NODE：索引节点(文件在磁盘上的标识)
- NAME：打开文件的确切名称

下面简单介绍一下 FD 列和 TYPE 列中的常见内容。

FD 列中的常见内容有 cwd、rtd、txt、mem 和一些数字等等。其中 cwd 表示当前的工作目录；rtd 表示根目录；txt 表示程序的可执行文件；mem 表示内存映射文件：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423233617.png)

还有一部分 FD 是以数字表示的，比如标准输入输出文件：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423233629.png)

数字后面的字母表示进程对该文件的读写模式，比如上图中的 u 表示该文件被打开并处于读取/写入模式。除了 u，还有 r 表示只读模式，w 表示只写模式，还可以同时应用 W 表示该进程拥有对文件写操作的锁。下图是截取的 docker daemon 进程打开的文件列表，其中显示了 FD 的不同模式：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423233702.png)

TYPE 列中常见的 REG 和 DIR 分别表示普通文件和目录。而 CHR 和 BLK 则分别表示字符和块设备，unix、fifo 和 IPv4/IPv6 分别表示 UNIX domain 套接字、先进先出(FIFO)队列和 IPv4/IPv6 套接字。

### 查看哪些进程打开了某个文件
直接指定文件的名称作为 lsof 的参加就可以查看哪些进程打开了这个文件，下面的命令查询打开了 /bin/bash 文件的进程：

```bash
$ sudo lsof /bin/bash
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423233819.png)

除了普通文件，也可以是设备等文件(下面命令的输出很长，图示只是截取的一小部分)：

```bash
$ sudo lsof /dev/sda1
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423233845.png)

### 查看哪些进程打开了某个目录及目录下的文件
这里分两种情况，+d 选项不执行递归查询，只查找那些打开了指定目录以及指定目录下文件和目录的进程，比如：

```bash
$ sudo lsof +d /var/log
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423233923.png)

而 +D 选项则会对指定的目录进行递归：

```bash
$ sudo lsof +D /var/log
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423233949.png)

在卸载文件系统时，如果有进程打开了该文件系统中的文件或目录，卸载操作就会失败。因此最好在卸载文件系统前通过 lsof +D 检查文件系统的挂载点，杀掉相关的进程然后再执行卸载操作。

### 查看某个进程打开的所有文件
通过 -p 选项并指定进程的 PID 可以输出该进程打开的所有文件。比如我们想要查看 cron 程序打开的文件，可以先用 ps -C cron 命令查出进程的 PID：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423234007.png)

然后把该 PID 传递给 lsof 命令的 -p 选项：
```bash
$ sudo lsof -p 1152
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423234028.png)

### 组合多个选项
如果为 lsof 命令指定多个选项，这些选项间默认是或的关系。也就是说满足任何一个选项的结果都会被输出。可以添加额外的 -a 选项，它的作用就是让其它选项之间的关系变为与，比如下面的命令：

```bash
$ sudo lsof -a -p $$ -d0,1,2
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423234057.png)

其中的 -p 选项指定了当前进程的 PID，而 -d 选项则用来指定进程打开的文件描述符(可以通过逗号分隔多个文件描述符)。添加 -a 选项后，结果输出为当前进程打开的文件描述符为 0、1、2 的文件。

### 查看指定名称的程序打开的文件
通过 -c 选项可以匹配进程运行的程序(可执行文件)名称。比如我们要查找以字母 cr 开头的程序打开的文件列表：

```bash
$ sudo lsof -c cr
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423234125.png)

还可以同时指定多个 -c 选项，它们之间是或的关系。

如果想对 -c 选项的条件取反，只要在字符串前添加符号 ^ 就可以了，比如：
```bash
$ sudo lsof -c ^cr
```
-c 选项也支持正则表达式，比如下面的命令可以过滤出以 cra 和 cro 开头的程序打开的文件：

```bash
$ sudo lsof -c /cr[ao]/
```

### 查看被打开的与网络相关的文件
-i 选项用来查看被打开的和网络相关的文件，其参数的格式如下：
```
[46][protocol][@hostname|hostaddr][:service|port] 
```
- 46 表示 IP 协议的版本
- protocol 表示网络协议的名称，比如 TCP 或 UDP  
- hostname 或 hostaddr 表示主机地址
- service 指 /etc/services 中的名称，比如 smtp 或多个服务的列表
- port 表示端口号，可以指定一个或多个

-i 选项默认会同时输出 IPv4 和 IPv6 打开的文件：
```bash
$ sudo lsof -i
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423234250.png)

#### 只列出 IPv4 或 IPv6 打开的文件
```bash
$ sudo lsof -i 4
$ sudo lsof -i 6
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423234326.png)

#### 列出与 22 号端口相关的文件
```bash
$ sudo lsof -i:22
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423234344.png)

#### 列出指定范围内被打开的 TCP 端口
```bash
$ sudo -i TCP:1-1024
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423234421.png)

### 查看某个用户打开的所有文件
-u 选项可以指定用户名或 user ID，并且和 -c 选项一样，可以通过逗号分隔多个用户名称或 user ID，也可以通过符号 ^ 对条件取反。

#### 查看某个用户打开的所有文件
```bash
$ sudo lsof -u syslog
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423235447.png)

#### 查看用户 nick 打开的网络相关的文件
```bash
$ sudo lsof -a -i -u nick
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423235529.png)

#### 排除某个用户
```bash
$ sudo lsof -i -u ^nick
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423235548.png)

注意：在有排除条件时，不需要指定 -a 选项。

### 通过lsof恢复删除的文件
如果我们一不小心删除了文件，而又知道这个文本被某个进程打开着，就可以通过 lsof 命令来恢复该文件。具体的原理为：
- 当进程打开了某个文件时，只要该进程保持打开该文件，即使将文件删除，它依然存在于磁盘中。进程并不知道文件已经被删除，它仍然可以通过打开该文件时提供给它的文件描述符进行读取和写入。除了该进程之外，这个文件是不可见的，因为已经删除了其相应的目录索引节点。
- 进程打开的文件描述符就存放在 /proc/PID/fd 目录下。/proc 目录挂载的是在内存中所映射的一块区域，所以这些文件和目录并不存在于磁盘中，因此当我们对这些文件进行读取和写入时，实际上是在从内存中获取相关信息。lsof 程序就是使用这些信息和其他关于内核内部状态的信息来产生其输出。所以 lsof 可以显示进程的文件描述符和相关的文件名等信息。也就是说我们通过访问进程的文件描述符可以找到该文件的相关信息。

下面的 demo 演示如何通过 lsof 命令恢复被误删的 /var/log/syslog 文件。

先删除日志文件 /var/log/syslog，记着要提前备份一下这个文件，以防万一：
```bash
$ sudo rm /var/log/syslog
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423235848.png)

从上面的信息可以看到 PID 为 1141 的进程打开着该文件，文件描述符为 7，并且显示该文件已经被删除了。接下来我们通过 1141 号进程的文件文件描述符来查看该文件的内容：

```bash
$ sudo tail -n 5 /proc/1141/fd/7
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423235908.png)

上图说明文件 /var/log/syslog 文件的内容还在，并且可以通过文件描述符访问，接下来通过 IO 重定向的方式重新创建 /var/log/syslog 文件就可以了：
```bash
$ sudo sh -c 'cat /proc/1141/fd/7 > /var/log/syslog' 
```
然后修复文件的权限属性并重启 rsyslog 服务：

```bash
$ sudo chown syslog:adm /var/log/syslog
$ sudo systemctl restart rsyslog.service
```
这样就完成了 /var/log/syslog 文件的恢复工作。对于许多应用程序，尤其是日志文件和数据库文件，都可以通过这种方式来恢复。

### 以root权限运行
因为lsof命令会访问核心内存和各种文件，所以lsof有些功能只有在root权限下才能正常执行。

例如：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423224838.png)

`lsof -i`命令在非root下没有输出任何东西

## du
du （英文全拼：disk usage）命令用于显示目录或文件的大小。

du 会显示指定的目录或文件所占用的磁盘空间。

语法
```
du [-abcDhHklmsSx][-L <符号连接>][-X <文件>][--block-size][--exclude=<目录或文件>][--max-depth=<目录层数>][--help][--version][目录或文件]
```

参数说明：
- -a或-all 显示目录中个别文件的大小。
- -b或-bytes 显示目录或文件大小时，以byte为单位。
- -c或--total 除了显示个别目录或文件的大小外，同时也显示所有目录或文件的总和。
- -D或--dereference-args 显示指定符号连接的源文件大小。
- -h或--human-readable 以K，M，G为单位，提高信息的可读性。
- -H或--si 与-h参数相同，但是K，M，G是以1000为换算单位。
- -k或--kilobytes 以1024 bytes为单位。
- -l或--count-links 重复计算硬件连接的文件。
- -L<符号连接>或--dereference<符号连接> 显示选项中所指定符号连接的源文件大小。
- -m或--megabytes 以1MB为单位。
- -s或--summarize 仅显示总计。
- -S或--separate-dirs 显示个别目录的大小时，并不含其子目录的大小。
- -x或--one-file-xystem 以一开始处理时的文件系统为准，若遇上其它不同的文件系统目录则略过。
- -X<文件>或--exclude-from=<文件> 在<文件>指定目录或文件。
- --exclude=<目录或文件> 略过指定的目录或文件。
- --max-depth=<目录层数> 超过指定层数的目录后，予以忽略。
- --help 显示帮助。
- --version 显示版本信息。

### 实例
1. 显示目录或者文件所占空间:
```bash
# du
608     ./test6
308     ./test4
4       ./scf/lib
4       ./scf/service/deploy/product
4       ./scf/service/deploy/info
12      ./scf/service/deploy
16      ./scf/service
4       ./scf/doc
4       ./scf/bin
32      ./scf
8       ./test3
1288    .
```
只显示当前目录下面的子目录的目录大小和当前目录的总的大小，最下面的1288为当前目录的总大小

2. 显示指定文件所占空间
```bash
# du log2012.log 
300     log2012.log
```

3. 方便阅读的格式显示test目录所占空间情况：
```bash
# du -h test
608K    test/test6
308K    test/test4
4.0K    test/scf/lib
4.0K    test/scf/service/deploy/product
4.0K    test/scf/service/deploy/info
12K     test/scf/service/deploy
16K     test/scf/service
4.0K    test/scf/doc
4.0K    test/scf/bin
32K     test/scf
8.0K    test/test3
1.3M    test
```

## whereis命令


# 用户相关命令
## id命令
inux id命令用于显示用户的ID，以及所属群组的ID。

### 例子
```bash
[root@localhost ~]# id
uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel)
```
解释：用户root的UID号码 = 0，GID号码 = 0。用户root是下面组的成员：
- root组GID号是：0
- bin组GID号是：1
- daemon组GID号是：2
- sys组GID号是：3
- adm组GID号是：4
- disk组GID号是：6
- wheel组GID号是：10



## usermod
usermod命令:用来修改用户帐号的各项设定。

语法：`usermod [-LU][-c <备注>][-d <登入目录>][-e <有效期限>][-f <缓冲天数>][-g <群组>][-G <群组>][-l <帐号名称>][-s <shell>][-u <uid>][用户帐号]`

参数：
- -a<追加> 必须与-G选项一起使用，把用户追加到某些组中。
- -c<备注> 修改用户帐号的备注文字。
- -d<登入目录> 修改用户登入时的目录。
- -e<有效期限> 修改帐号的有效期限。
- -f<缓冲天数> 修改在密码过期后多少天即关闭该帐号。
- -g<群组> 修改用户所属的群组。
- -G<群组> 修改用户所属的附加群组。
- -l<帐号名称> 修改用户帐号名称。
- -L 锁定用户密码，使密码无效。
- -s<shell> 修改用户登入后所使用的shell。
- -u<uid> 修改用户ID。
- -U 解除密码锁定。

应用举例：
1. 将 newuser2 添加到组 staff 中
```bash
#usermod -G staff newuser2
```

2. 修改 newuser 的用户名为 newuser1
```bash
#usermod -l newuser1 newuser
```

## 添加普通用户到 sudo 组
正常电脑使用或者服务器维护中，我们一般不直接使用 root 账号，如果你现在只有一个 root 账号可以通过下面命令新建一个用户：
```bash
useradd -m steven   //steven 是我的用户名
```
然后通过下面命令设置密码：
```sehll
passwd steven    //为刚创建的用户设置密码
```
把普通用户增加到 sudo 组 通常使用两种方法:

**第一种： 修改 /etc/sudoers 文件**
```
...

# User privilege specification
root    ALL=(ALL:ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL   //增加属于自己的用户名

...
```

**第二种：直接执行命令添加用户到 sudo**
```bash
usermod -a -G sudo steven    //注意改成你自己的用户名
```

## useradd与adduser
useradd与adduser都是创建新的用户
- 在CentOs下useradd与adduser是没有区别的都是在创建用户，在home下自动创建目录，没有设置密码，需要使用passwd命令修改密码。
- Ubuntu下useradd与adduser有所不同
     - useradd在使用该命令创建用户是不会在/home下自动创建与用户名同名的用户目录，而且不会自动选择shell版本，也没有设置密码，那么这个用户是不能登录的，需要使用passwd命令修改密码。
     - adduser在使用该命令创建用户是会在/home下自动创建与用户名同名的用户目录，系统shell版本，会在创建时会提示输入密码，更加友好。

# 网络相关命令
## wget
Linux wget命令用来从指定的URL下载文件。wget非常稳定，它在带宽很窄的情况下和不稳定网络中有很强的适应性，如果是由于网络的原因下载失败，wget会不断的尝试，直到整个文件下载完毕。如果是服务器打断下载过程，它会再次联到服务器上从停止的地方继续下载。这对从那些限定了链接时间的服务器上下载大文件非常有用。

### 实例
1. 使用wget下载单个文件
```bash
wget http://www.coonote.com/testfile.zip
```
以下的例子是从网络下载一个文件并保存在当前目录，在下载的过程中会显示进度条，包含（下载完成百分比，已经下载的字节，当前下载速度，剩余下载时间）。

2. 下载并以不同的文件名保存
```bash
wget -O wordpress.zip http://www.coonote.com/download.aspx?id=1080
```
wget默认会以最后一个符合/的后面的字符来命令，对于动态链接的下载通常文件名会不正确。

错误：下面的例子会下载一个文件并以名称download.aspx?id=1080保存:
```bash
wget http://www.coonote.com/download?id=1
```
即使下载的文件是zip格式，它仍然以download.php?id=1080命令。

正确：为了解决这个问题，我们可以使用参数-O来指定一个文件名：
```bash
wget -O wordpress.zip http://www.coonote.com/download.aspx?id=1080
```

3. 测试下载链接
当你打算进行定时下载，你应该在预定时间测试下载链接是否有效。我们可以增加--spider参数进行检查。
```bash
wget --spider URL
```
如果下载链接正确，将会显示:
```
Spider mode enabled. Check if remote file exists.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Remote file exists and could contain further links,
but recursion is disabled -- not retrieving.
```
这保证了下载能在预定的时间进行，但当你给错了一个链接，将会显示如下错误:
```
wget --spider url
Spider mode enabled. Check if remote file exists.
HTTP request sent, awaiting response... 404 Not Found
Remote file does not exist -- broken link!!!
```
你可以在以下几种情况下使用--spider参数：
- 定时下载之前进行检查
- 间隔检测网站是否可用
- 检查网站页面的死链接

4. 下载多个文件
```bash
wget -i filelist.txt
```
首先，保存一份下载链接文件：
```bash
cat > filelist.txt
url1
url2
url3
url4
```
接着使用这个文件和参数-i下载。

## curl
Linux curl命令是一个利用URL规则在命令行下工作的文件传输工具。它支持文件的上传和下载，所以是综合传输工具，但按传统，习惯称curl为下载工具。作为一款强力工具，curl支持包括HTTP、HTTPS、ftp等众多协议，还支持POST、cookies、认证、从指定偏移处下载部分文件、用户代理字符串、限速、文件大小、进度条等特征。做网页处理流程和数据检索自动化，curl可以祝一臂之力。

### 实例

#### 文件下载
curl命令可以用来执行下载、发送各种HTTP请求，指定HTTP头部等操作。如果系统没有curl可以使用yum install curl安装，也可以下载安装。curl是将下载文件输出到stdout，将进度信息输出到stderr，不显示进度信息使用--silent选项。

```bash
curl URL --silent
```

这条命令是将下载文件输出到终端，所有下载的数据都被写入到stdout。

使用选项-O将下载的数据写入到文件，必须使用文件的绝对地址：

```bash
curl https://www.coonote.com/robot.txt --silent -O

```

选项-o将下载数据写入到指定名称的文件中，并使用--progress显示进度条：

```bash
curl https://www.coonote.com/robot.txt -o filename.iso --progress
######################################### 100.0%
```

#### 快速将请求导成curl格式

**方式一：在浏览器中**

![](https://raw.githubusercontent.com/NaisWang/images/master/Screen%20Shot%202022-04-17%20at%2015.30.03.jpg)

**方式二：在postman中**

![](https://raw.githubusercontent.com/NaisWang/images/master/Screen%20Shot%202022-04-17%20at%2015.32.41.jpg)

## netstat
netstat命令是一个监控TCP/IP网络的非常有用的工具，它可以显示路由表、实际的网络连接以及每一个网络接口设备的状态信息。

语法：
```bash
netstat [选项]
```
参数：
- -a或--all：显示所有连线中的Socket；
- -A<网络类型>或--<网络类型>：列出该网络类型连线中的相关地址；
- -c或--continuous：持续列出网络状态；
- -C或--cache：显示路由器配置的快取信息；
- -e或--extend：显示网络其他相关信息；
- -F或--fib：显示FIB；
- -g或--groups：显示多重广播功能群组组员名单；
- -h或--help：在线帮助；
- -i或--interfaces：显示网络界面信息表单；
- -l或--listening：显示监控中的服务器的Socket；
- -M或--masquerade：显示伪装的网络连线；
- -n或--numeric：直接使用ip地址，而不通过域名服务器；
- -N或--netlink或--symbolic：显示网络硬件外围设备的符号连接名称；
- -o或--timers：显示计时器；
- -p或--programs：显示 PID/Program name, 注意：mac下-p为指定协议
- -r或--route：显示Routing Table；
- -s或--statistice：显示网络工作信息统计表；
- -t或--tcp：显示TCP传输协议的连线状况；
- -u或--udp：显示UDP传输协议的连线状况；
- -v或--verbose：显示指令执行过程；
- -V或--version：显示版本信息；
- -w或--raw：显示RAW传输协议的连线状况；
- -x或--unix：此参数的效果和指定"-A unix"参数相同；
- -ip或--inet：此参数的效果和指定"-A inet"参数相同。

### 实例1：列出所有端口
命令：
- netstat -a      # 列出所有端口
- netstat -at     # 列出所有TCP端口
- netstat -au    # 列出所有UDP端口
- netstat -ax    # 列出所有unix端口
- netstat -atnlp    # 直接使用ip地址列出所有处理监听状态的TCP端口，且加上程序名

输出：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423113523.png)

> Mac中的netstat是简化版本，参数支持的不多，并且原有-p参数为输出相应程序名，mac下-p为指定协议，且无法知晓pid。综上所述mac下最好还是用lsof

### 输出说明
#### Proto
`Proto`:协议名（tcp协议还是udp协议)；
#### recv-Q与send-Q
- `recv-Q`:网络接收队列, 表示收到的数据已经在本地接收缓冲，但是还有多少没有被进程取走，recv()如果接收队列Recv-Q一直处于阻塞状态，可能是遭受了拒绝服务 denial-of-service 攻击；
- `send-Q`:网路发送队列, 对方没有收到的数据或者说没有Ack的, 还是本地缓冲区。 如果发送队列Send-Q不能很快的清零，可能是有应用向外发送数据包过快，或者是对方接收数据包不够快；

这两个值通常应该为0，如果不为0可能是有问题的。packets在两个队列里都不应该有堆积状态。可接受短暂的非0情况。

#### Local Address与Foreign Address
- Local Address 部分的0.0.0.0:873表示有服务监听该主机上所有ip地址的873端口(0.0.0.0表示本地所有ip)，比如你的主机是有172.172.230.210和172.172.230.11两个ip地址，那么0.0.0.0:873此时表示监听172.172.230.210,172.172.230.211,127.0.0.1三个地址的873端口
- <font color="red"> 127.0.0.1:25这个表示有服务监听本机的loopback地址的25端口(如果某个服务只监听了回环地址，那么只能在本机进行访问，无法通过tcp/ip 协议进行远程访问)</font>。[实战演练-配置mysql允许远程连接的方法](https://naiswang.github.io/#/notes/Data/mysql.md#启动-mysql-服务)
- 192.168.1.81:2288这是因为我们在启动的时候指定了192.168.1.81:2288参数，如果不指定的话，会监听0.0.0.0：2288

- `Foreign Address`: 与本机端口通信的外部socket。显示规则与Local Address相同

##### 案例
![](https://raw.githubusercontent.com/NaisWang/images/master/20230113101313.png)

上述表示 有个服务正在监听本地192.168.0.199:55225地址与远程120.77.80.215:3306地址进行tcp4通信，并且这个服务正处于ESTABLESHED状态


#### State
链路状态，共有11种

state列共有12中可能的状态，前面11种是按照TCP连接建立的三次握手和TCP连接断开的四次挥手过程来描述的。
- `LISTEN` ：首先服务端需要打开一个socket进行监听，状态为LISTEN. The socket is listening for incoming  connections. 侦听来自远方TCP端口的连接请求
- `SYN_SENT`：客户端通过应用程序调用connect进行activeopen.于是客户端tcp发送一个SYN以请求建立一个连接.之后状态`SYN_SENT`。The socket is actively attempting to establish aconnection. 在发送连接请求后等待匹配的连接请求
- `SYN_RECV`：服务端应发出ACK确认客户端的 SYN,同时自己向客户端发送一个SYN.之后状态置为`SYN_RECV`。 A connection request has been received from the network. 在收到和发送一个连接请求后等待对连接请求的确认
- `ESTABLISHED`：代表一个打开的连接，双方可以进行或已经在数据交互了。 The socket has an established connection. 代表一个打开的连接，数据可以传送给用户
- `FIN_WAIT1`：主动关闭(activeclose)端应用程序调用close，于是其TCP发出FIN请求主动关闭连接，之后进入`FIN_WAIT1`状态. The socket is closed, and the connection is shutting down. 等待远程TCP的连接中断请求，或先前的连接中断请求的确认
- `CLOSE_WAIT`：被动关闭(passiveclose)端TCP接到FIN后，就发出ACK以回应FIN请求(它的接收也作为文件结束符传递给上层应用程序),并进入`CLOSE_WAIT`. The remote end has shut down, waiting for the socketto close. 等待从本地用户发来的连接中断请求
- `FIN_WAIT2`：主动关闭端接到ACK后，就进入了FIN-WAIT-2. Connection is closed, and the socket is waiting for a shutdownfrom the remote end. 从远程TCP等待连接中断请求
- `LAST_ACK`：被动关闭端一段时间后，接收到文件结束符的应用程 序将调用CLOSE关闭连接。这导致它的TCP也发送一个 FIN,等待对方的ACK.就进入了LAST-ACK. The remote end has shut down, and the socket is closed. Waiting foracknowledgement. 等待原来发向远程TCP的连接中断请求的确认
- `TIME_WAIT`：在主动关闭端接收到FIN后，TCP 就发送ACK包，并进入TIME-WAIT状态。 Thesocket is waiting after close to handle packets still in the network.等待足够的时间以确保远程TCP接收到连接中断请求的确认
- `CLOSING`：比较少见. Bothsockets are shut down but we still don’t have all our datasent. 等待远程TCP对连接中断的确认 
- `CLOSED`：被动关闭端在接受到ACK包后，就进入了closed的状态。连接结束.The socket is not being used. 没有任何连接状态 
- `UNKNOWN`：未知的Socket状态。Thestate of the socket is unknown.


备注
- SYN: (同步序列编号,SynchronizeSequence Numbers)该标志仅在三次握手建立TCP连接时有效。表示一个新的TCP连接请求。
- ACK: (确认编号,AcknowledgementNumber)是对TCP请求的确认标志,同时提示对端系统已经成功接收所有数据。
- FIN: (结束标志,FINish)用来结束一个TCP回话.但对应端口仍处于开放状态,准备接收后续数据。

### 实例2：显示每个协议的统计信息

命令：
- netstat -s     # 显示所有端口的统计信息
- netstat -st    # 显示所有TCP的统计信息
- netstat -su    # 显示所有UDP的统计信息

### 常用输出
`netstat -anp`

![](https://raw.githubusercontent.com/NaisWang/images/master/20220428141919.png)

## traceroute
Linux traceroute命令用于显示数据包到主机间的路径。

traceroute指令让你追踪网络数据包的路由途径，预设数据包大小是40Bytes，用户可另行设置。

参数说明：
- -d 使用Socket层级的排错功能。
- -f<存活数值> 设置第一个检测数据包的存活数值TTL的大小。
- -F 设置勿离断位。
- -g<网关> 设置来源路由网关，最多可设置8个。
- -i<网络界面> 使用指定的网络界面送出数据包。
- -I 使用ICMP回应取代UDP资料信息。
- -m<存活数值> 设置检测数据包的最大存活数值TTL的大小。
- -n 直接使用IP地址而非主机名称。
- -p<通信端口> 设置UDP传输协议的通信端口。
- -r 忽略普通的Routing Table，直接将数据包送到远端主机上。
- -s<来源地址> 设置本地主机送出数据包的IP地址。
- -t<服务类型> 设置检测数据包的TOS数值。
- -v 详细显示指令的执行过程。
- -w<超时秒数> 设置等待远端主机回报的时间。
- -x 开启或关闭数据包的正确性检验。

### 实例
显示到达目的地的数据包路由
```bash
# traceroute www.google.com
traceroute: Warning: www.google.com has multiple addresses; using 66.249.89.99
traceroute to www.l.google.com (66.249.89.99), 30 hops max, 38 byte packets
1 192.168.0.1 (192.168.0.1) 0.653 ms 0.846 ms 0.200 ms
2 118.250.4.1 (118.250.4.1) 36.610 ms 58.438 ms 55.146 ms
3 222.247.28.177 (222.247.28.177) 54.809 ms 39.879 ms 19.186 ms
4 61.187.255.253 (61.187.255.253) 18.033 ms 49.699 ms 72.147 ms
5 61.137.2.177 (61.137.2.177) 32.912 ms 72.947 ms 41.809 ms
6 202.97.46.5 (202.97.46.5) 60.436 ms 25.527 ms 40.023 ms
7 202.97.35.69 (202.97.35.69) 40.049 ms 66.091 ms 44.358 ms
8 202.97.35.110 (202.97.35.110) 42.140 ms 70.913 ms 41.144 ms
9 202.97.35.14 (202.97.35.14) 116.929 ms 57.081 ms 60.336 ms
10 202.97.60.34 (202.97.60.34) 54.871 ms 69.302 ms 64.353 ms
11 * * *
12 209.85.255.80 (209.85.255.80) 95.954 ms 79.844 ms 76.052 ms
   MPLS Label=385825 CoS=5 TTL=1 S=0
13 209.85.249.195 (209.85.249.195) 118.687 ms 120.905 ms 113.936 ms
14 72.14.236.126 (72.14.236.126) 115.843 ms 137.109 ms 186.491 ms
15 nrt04s01-in-f99.1e100.net (66.249.89.99) 168.024 ms 140.551 ms 161.127 ms
```


## SSH
### ssh基础使用
ssh客户端是一种使用Secure Shell(ssh)协议连接到运行了ssh服务端的远程服务器上。ssh是目前较可靠，专为远程登录会话和其他网络服务提供安全性的协议。它有如下优点：
- 有效防止远程管理过程中的信息泄漏
- 传输 数据加密，能够防止DNS和IP欺骗
- 传输 数据压缩，加快传输速度

OpenSSH 是 SSH协议的免费开源实现。OpenSSH提供了服务端程序(openssh-server)和客户端工具(openssh-client)。Mac和Linux中默认已安装ssh客户端，可直接在终端中使用ssh命令。Windows则需手动安装ssh客户端，较常用的Windows SSH客户端有PuTTY和XShell。

OpenSSH服务端常用命令
```bash
# 安装服务端/客户端(Ubuntu)
$ sudo apt install openssh-server/openssh-client

# 查看ssh服务是否开启
$ netstat -tlp | grep ssh

# 启动/停止/重启 ssh服务
$ sudo /etc/init.d/ssh start/stop/restart
```

```bash
# 命令格式
$ ssh [-options] [user@hostname]
```
- -p: 指定ssh端口号,默认端口为22
- -i: 使用指定私钥文件连接服务器(免密登录)
- user远程服务器登录的用户名，默认为当前用户
- hostname远程服务器地址。可以是IP/域名/别名
- exit或logout命令均可退出当前登录

```bash
# 以colin用户登录192.168.1.196的到ssh服务器
$ ssh colin@192.168.1.196

# 以colin用户登录到192.168.1.198的ssh服务器，使用2222端口
$ ssh -p 2222 colin@192.168.1.198
```

### ssh高级配置
ssh配置信息都保存在~/.ssh中。ssh服务端配置文件默认为/etc/ssh/sshd_config。可以按需修改默认22端口等配置。

|配置文件|作用|
|--|--|
|known_hosts|作为客户端。记录曾连接服务器授权。ssh第一次连接一台服务器会有一个授权提示，确认授权后会记录在此文件中，下次连接记录中的服务器时则不再需要进行授权确认提示|
|authorized_keys|作为服务端。保存中客户端的免密连接的公钥文件|
|config|作为客户端。记录连接服务器配置的别名|

#### 服务器别名
远程管理命令(如ssh,scp等)连接一台服务器时一般都需要提供 服务器地址、端口、用户名 ，每次输入比较繁琐，我们可以把经常使用的服务器连接参数打包记录到配置文件中并为其设置一个简单易记的别名。这样我们就可以通过别名方便的访问服务器，而不需要提供地址、端口、用户名等信息了。

配置方法：创建或打开 ~/.ssh/config，在文件追加服务器配置信息。一台服务器配置格式如下
```
Host ColinMac
  HostName 192.168.1.196
  User colin
  Port 22
```
以上配置中只有HostName是必选项，其他都可按需省略。配置完成后远程管理命令中就可以直接使用别名访问了，如
```
$ ssh ColinMac
$ scp 123.txt ColinMac:Desktop
```

#### 免密登录
```bash
# 命令格式
$ ssh-keygen [-options]
```
|options|含义|
|--|--|
|-t	|指定加密类型,默认为非对称加密(rsa), 所有可选项[dsa,ecdsa,ed25519,rsa]|
|-f	|密钥文件名。|
|-C	|注释，将附加在密钥文件尾部|

远程管理命令(如ssh,scp等)每次都需要提供用户密码保证安全。除此之外，我们也可配置使指定加密算法验证密钥文件的方式，避免每次输入密码。配置免密登录后，ssh连接和scp等远程管理命令都不需要再输密码。生成密钥时若指定了文件名，连接服务器时需要通过-i指定要验证的密钥文件,形如：ssh -i file user@host。默认文件名则可省略。默认配置只需以下两步：
```bash
# 客户端生成密钥对
$ ssh-keygen

# 上传公钥到服务器
$ ssh-copy-id user@hostname   # 文件会自动上传为服务器特定文件 ～/.ssh/authorized_keys
```
完成以上步骤后直接使用ssh ColinUbuntu即可登录，服务器地址和密码均不用录入。


#### 免密钥文件登录
出于安全考虑，大部分服务器提供商如要求使用密钥文件进行远程登录，如GCP和AWS。下面我们以GCP为例来看如何简化连接操作,这搞起来吧...

##### 生成密钥对
```bash
$ ssh-keygen -t rsa -f ~/.ssh/[KEY_FILENAME] -C [USERNAME]
$ chmod 400 ~/.ssh/[KEY_FILENAME]
```

##### 上传公钥
在Compute Engine页面左侧菜单找到元数据,将上一步生成的公钥文件(KEY_FILENAME_pub)内容添加到SSH密钥中即可。

![](https://raw.githubusercontent.com/NaisWang/images/master/20211221181658.png)

##### 连接GCP
使用以下命令登录即可
```bash
$ ssh -i ~/.ssh/KEY_FILENAME [USERNAME]@[IP_ADDRESS]
```

##### 简化登录
以上是GCP官方步骤，使用IdentityFile方式进行登录，每次ssh登录都要通过-i选项指定私钥路径比较繁琐，我们可以将密钥文件添加到ssh客户端config中以简化连接命令。
```
Host *
 AddKeysToAgent yes
 UseKeychain yes  # only for mac

Host tu
   HostName IP_ADDRESS
   Port 22
   User USERNAME
   IdentityFile ~/.ssh/gcp
```
按照以上配置添加到～/.ssh/config中
```bash
# 后台运行ssh-agent
$ eval "$(ssh-agent -s)"
# 添加密钥到ssh-agent
$ ssh-add -K ~/.ssh/gcp
```
完成以上配置后，连接服务器只需使用 ssh tu即可。


## scp命令
- Linux scp 命令用于 Linux 之间复制文件和目录。
- scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。
- scp 是加密的，rcp 是不加密的，scp 是 rcp 的加强版。

### 语法
```bash
scp [-1246BCpqrv] [-c cipher] [-F ssh_config] [-i identity_file]
[-l limit] [-o ssh_option] [-P port] [-S program]
[[user@]host1:]file1 [...] [[user@]host2:]file2
```
简易写法:
```bash
scp [可选参数] file_source file_target 
```
参数说明：
- -1： 强制scp命令使用协议ssh1
- -2： 强制scp命令使用协议ssh2
- -4： 强制scp命令只使用IPv4寻址
- -6： 强制scp命令只使用IPv6寻址
- -B： 使用批处理模式（传输过程中不询问传输口令或短语）
- -C： 允许压缩。（将-C标志传递给ssh，从而打开压缩功能）
- -p：保留原文件的修改时间，访问时间和访问权限。
- -q： 不显示传输进度条。
- -r： 递归复制整个目录。
- -v：详细方式显示输出。scp和ssh(1)会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。
- -c cipher： 以cipher将数据传输进行加密，这个选项将直接传递给ssh。
- `-F ssh_config`： 指定一个替代的ssh配置文件，此参数直接传递给ssh。
- `-i identity_file`： 从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh。
- `-l limit`： 限定用户所能使用的带宽，以Kbit/s为单位。
- `-o ssh_option`： 如果习惯于使用`ssh_config(5)`中的参数传递方式，
- -P port：注意是大写的P, port是指定数据传输用到的端口号
- -S program： 指定加密传输时所使用的程序。此程序必须能够理解ssh(1)的选项。

### 实例
1. 从本地复制到远程
命令格式：
```bash
scp local_file remote_username@remote_ip:remote_folder 
#或者 
scp local_file remote_username@remote_ip:remote_file 
#或者 
scp local_file remote_ip:remote_folder 
#或者 
scp local_file remote_ip:remote_file 
```
- 第1,2个指定了用户名，命令执行后需要再输入密码，第1个仅指定了远程的目录，文件名字不变，第2个指定了文件名；
- 第3,4个没有指定用户名，命令执行后需要输入用户名和密码，第3个仅指定了远程的目录，文件名字不变，第4个指定了文件名；
应用实例：
```bash
scp /home/space/music/1.mp3 root@www.runoob.com:/home/root/others/music 
scp /home/space/music/1.mp3 root@www.runoob.com:/home/root/others/music/001.mp3 
scp /home/space/music/1.mp3 www.runoob.com:/home/root/others/music 
scp /home/space/music/1.mp3 www.runoob.com:/home/root/others/music/001.mp3 
```
复制目录命令格式：
```
scp -r local_folder remote_username@remote_ip:remote_folder 
#或者 
scp -r local_folder remote_ip:remote_folder 
```
- 第1个指定了用户名，命令执行后需要再输入密码；
- 第2个没有指定用户名，命令执行后需要输入用户名和密码；
应用实例：
```
scp -r /home/space/music/ root@www.runoob.com:/home/root/others/ 
scp -r /home/space/music/ www.runoob.com:/home/root/others/ 
```
上面命令将本地 music 目录复制到远程 others 目录下。

2. 从远程复制到本地
从远程复制到本地，只要将从本地复制到远程的命令的后2个参数调换顺序即可，如下实例
```
scp root@www.runoob.com:/home/root/others/music /home/space/music/1.mp3 
scp -r www.runoob.com:/home/root/others/ /home/space/music/
```

### 说明
1. 如果远程服务器防火墙有为scp命令设置了指定的端口，我们需要使用 -P 参数来设置命令的端口号，命令格式如下：
```bash
#scp 命令使用端口号 4588
scp -P 4588 remote@www.runoob.com:/usr/local/sin.sh /home/administrator
```
2. 使用scp命令要确保使用的用户具有可读取远程服务器相应文件的权限，否则scp命令是无法起作用的。

## rsync命令
rsync 是一个常用的 Linux 应用程序，用于文件同步。

它可以在本地计算机与远程计算机之间，或者两个本地目录之间同步文件（但不支持两台远程计算机之间的同步）。它也可以当作文件复制工具，替代`cp`和`mv`命令。

它名称里面的`r`指的是 remote，rsync 其实就是"远程同步"（remote sync）的意思。与其他文件传输工具（如 FTP 或 scp）不同，rsync 的最大特点是会检查发送方和接收方已有的文件，仅传输有变动的部分（默认规则是文件大小或修改时间有变动）。

### 安装
如果本机或者远程计算机没有安装 rsync，可以用下面的命令安装。
```bash
# Debian
$ sudo apt-get install rsync

# Red Hat
$ sudo yum install rsync

# Arch Linux
$ sudo pacman -S rsync
```
注意，传输的双方都必须安装 rsync。

### 基本用法
#### -r参数
本机使用 rsync 命令时，可以作为`cp`和`mv`命令的替代方法，将源目录同步到目标目录。
```bash
$ rsync -r source destination
```
上面命令中，`-r`表示递归，即包含子目录。注意，`-r`是必须的，否则 `rsync` 运行不会成功。`source`目录表示源目录，`destination`表示目标目录。

如果有多个文件或目录需要同步，可以写成下面这样。
```bash
$ rsync -r source1 source2 destination
```
上面命令中，`source1`、`source2`都会被同步到`destination`目录。

#### -a参数
`-a`参数可以替代`-r`，除了可以递归同步以外，还可以同步元信息（比如修改时间、权限等）。由于 rsync 默认使用文件大小和修改时间决定文件是否需要更新，所以`-a`比`-r`更有用。下面的用法才是常见的写法。
```bash
$ rsync -a source destination
```
目标目录`destination`如果不存在，rsync 会自动创建。执行上面的命令后，源目录`source`被完整地复制到了目标目录`destination`下面，即形成了`destination/source`的目录结构。

如果只想同步源目录`source`里面的内容到目标目录`destination`，则需要在源目录后面加上斜杠。
```bash
$ rsync -a source/ destination
```
上面命令执行后，`source`目录里面的内容，就都被复制到了`destination`目录里面，并不会在`destination`下面创建一个`source`子目录。

#### -n参数
如果不确定 rsync 执行后会产生什么结果，可以先用`-n`或`--dry-run`参数模拟执行的结果。
```bash
$ rsync -anv source/ destination
```
上面命令中，`-n`参数模拟命令执行的结果，并不真的执行命令。`-v`参数则是将结果输出到终端，这样就可以看到哪些内容会被同步。

####  --delete参数
默认情况下，rsync 只确保源目录的所有内容（明确排除的文件除外）都复制到目标目录。它不会使两个目录保持相同，并且不会删除文件。如果要使得目标目录成为源目录的镜像副本，则必须使用`--delete`参数，这将删除只存在于目标目录、不存在于源目录的文件。
```bash
$ rsync -av --delete source/ destination
```
上面命令中，`--delete`参数会使得`destination`成为`source`的一个镜像。

### 排除文件
#### --exclude参数
有时，我们希望同步时排除某些文件或目录，这时可以用`--exclude`参数指定排除模式。
```bash
$ rsync -av --exclude='*.txt' source/ destination
# 或者
$ rsync -av --exclude '*.txt' source/ destination
```
上面命令排除了所有 TXT 文件。

注意，rsync 会同步以"点"开头的隐藏文件，如果要排除隐藏文件，可以这样写`--exclude=".*"`。

如果要排除某个目录里面的所有文件，但不希望排除目录本身，可以写成下面这样。
```bash
$ rsync -av --exclude 'dir1/*' source/ destination
```
多个排除模式，可以用多个`--exclude`参数。
```bash
$ rsync -av --exclude 'file1.txt' --exclude 'dir1/*' source/ destination
```
多个排除模式也可以利用 Bash 的大扩号的扩展功能，只用一个`--exclude`参数。
```bash
$ rsync -av --exclude={'file1.txt','dir1/*'} source/ destination
```
如果排除模式很多，可以将它们写入一个文件，每个模式一行，然后用`--exclude-from`参数指定这个文件。
```bash
$ rsync -av --exclude-from='exclude-file.txt' source/ destination
```

#### --include参数
`--include`参数用来指定必须同步的文件模式，往往与`--exclude`结合使用。
```bash
$ rsync -av --include="*.txt" --exclude='*' source/ destination
```
上面命令指定同步时，排除所有文件，但是会包括 TXT 文件。

### 远程同步
#### SSH 协议
rsync 除了支持本地两个目录之间的同步，也支持远程同步。它可以将本地内容，同步到远程服务器。
```bash
$ rsync -av source/ username@remote_host:destination
```
也可以将远程内容同步到本地。
```bash
$ rsync -av username@remote_host:source/ destination
```
rsync 默认使用 SSH 进行远程登录和数据传输。

由于早期 rsync 不使用 SSH 协议，需要用`-e`参数指定协议，后来才改的。所以，下面`-e ssh`可以省略。
```bash
$ rsync -av -e ssh source/ user@remote_host:/destination
```
但是，如果 ssh 命令有附加的参数，则必须使用`-e`参数指定所要执行的 SSH 命令。
```bash
$ rsync -av -e 'ssh -p 2234' source/ user@remote_host:/destination
```
上面命令中，`-e`参数指定 SSH 使用2234端口。

#### rsync 协议
除了使用 SSH，如果另一台服务器安装并运行了 rsync 守护程序，则也可以用`rsync://`协议（默认端口873）进行传输。具体写法是服务器与目标目录之间使用双冒号分隔`::`。
```bash
$ rsync -av source/ 192.168.122.32::module/destination
```
注意，上面地址中的module并不是实际路径名，而是 rsync 守护程序指定的一个资源名，由管理员分配。
如果想知道 rsync 守护程序分配的所有 module 列表，可以执行下面命令。
```bash
$ rsync rsync://192.168.122.32
```
rsync 协议除了使用双冒号，也可以直接用`rsync://`协议指定地址。
```bash
$ rsync -av source/ rsync://192.168.122.32/module/destination
```

### rsync和scp区别
- scp是相当于复制，黏贴，如果有的话是覆盖，比较耗时间，不智能。
- rsync是复制，如果有重复的文件，会直接跳过，而且他自己的算法优化。
- scp是把文件全部复制过去，当文件修改后还是把所有文件复制过去，rsync 第一次是把所有文件同步过去，当文件修改后，只把修改的文件同步过去。

# linux一行执行多条命令 shell
要实现在一行执行多条Linux命令，分三种情况：
## 1、&&

举例：
```bash
lpr /tmp/t2 && rm /tmp/t2
```
第2条命令只有在第1条命令成功执行之后才执行。当&&前的命令“lpr /tmp/t2”成功执行后"rm /tmp/t2"才执行，根据命令产生的退出码判断是否执行成功（0成功，非0失败）。

## 2、||

举例：
```bash
cp /tmp/t2 /tmp/t2.bak || rm /tmp/t2
```
只有||前的命令“cp /tmp/t2 /tmp/t2.bak”执行不成功（产生了一个非0的退出码）时，才执行后面的命令。

## 3、;

举例：
```bash
cp /tmp/t2 /tmp/t2.bak; echo "hello world"
```
顺序执行多条命令，当;号前的命令执行完（不管是否执行成功），才执行;后的命令。

例子：
```bash
## 下述方式会报错
wanghengzhi@:/opt/homebrew/etc/myredis$ redis-server redis6379.conf & ;redis-server redis6380.conf & ;redis-server redis6381.conf & ;redis-server redis6389.conf & ;redis-server redis6390.conf & ;redis-server redis6391.conf &
-bash: syntax error near unexpected token `;'


## 正确方式如下
wanghengzhi@:/opt/homebrew/etc/myredis$ (redis-server redis6379.conf &); (redis-server redis6380.conf &); (redis-server redis6381.conf &); (redis-server redis6389.conf &); (redis-server redis6390.conf &); redis-server redis6391.conf &
```


## 扩展:
- `&` 表示任务在后台执行
- `&&`表示前一条命令执行成功时，才执行后一条命令
- `|`表示管道，上一条命令的输出，作为下一条命令参数
- `||`表示上一条命令执行失败后，才执行下一条命令
- `;`各命令的执行给果，不会影响其它命令的执行

# 管道相关命令
## xargs
- xargs（英文全拼： eXtended ARGuments）是给命令传递参数的一个过滤器，也是组合多个命令的一个工具。
- xargs 可以将管道或标准输入（stdin）数据转换成命令行参数，也能够从文件的输出中读取数据。
- xargs 也可以将单行或多行文本输入转换为其他格式，例如多行变单行，单行变多行。
- xargs 默认的命令是 echo，这意味着通过管道传递给 xargs 的输入将会包含换行和空白，不过通过 xargs 的处理，换行和空白将被空格取代。
- xargs 是一个强有力的命令，它能够捕获一个命令的输出，然后传递给另外一个命令。
- 之所以能用到这个命令，关键是由于很多命令不支持|管道来传递参数，而日常工作中有有这个必要，所以就有了 xargs 命令，例如：
```bash
find /sbin -perm +700 |ls -l       #这个命令是错误的
find /sbin -perm +700 |xargs ls -l   #这样才是正确的
```
xargs 一般是和管道一起使用。


# shell脚本
## $(),``, ${}
### $( )与``
在bash中，$( )与``（反引号）都是用来作命令替换的。

命令替换与变量替换差不多，都是用来重组命令行的，先完成引号里的命令行，然后将其结果替换出来，再重组成新的命令行。
```bash
[root@localhost ~]# echo today is $(date "+%Y-%m-%d")
today is 2017-11-07
[root@localhost ~]# echo today is `date "+%Y-%m-%d"`
today is 2017-11-07
```
$( )与｀｀在操作上，这两者都是达到相应的效果，但是建议使用$( )，因为｀｀很容易与''搞混乱，尤其对初学者来说，而$( )比较直观。

最后，$( )的弊端是，并不是所有的类unix系统都支持这种方式，但反引号是肯定支持的。
```bash
[root@localhost ~]#  echo Linux `echo Shell `echo today is `date "+%Y-%m-%d"```
Linux Shellecho today is 2017-11-07     #过多使用``会有问题
[root@localhost ~]# echo Linux `echo Shell $(echo today is $(date "+%Y-%m-%d"))`
Linux Shell today is 2017-11-07    ``和$()混合使用
[root@localhost ~]# echo Linux $(echo Shell $(echo today is $(date "+%Y-%m-%d")))
Linux Shell today is 2017-11-07    #多个$()同时使用也不会有问题
```

### ${ }变量替换
一般情况下，$var与${var}是没有区别的，但是用${ }会比较精确的界定变量名称的范围
```bash
[root@localhost ~]# A=Linux
[root@localhost ~]# echo $AB    #表示变量AB

[root@localhost ~]# echo ${A}B    #表示变量A后连接着B
```

## 单引号与双引号
- 单引号（'''）括起字符可以保留引号中每个字符的字面值。单引号之间可能不会出现单引号，即使前面有反斜杠也是如此
- 双引号中的信息会保留字面量，但是同时会对$,`,，这些符号做出特殊的解析。就是双引号中的变量和转义，和函数操作可以被正常解析出来。


# linux软件安装
## 编译安装
事实上，使用类似gcc的编译器来进行编译的过程并不简单，因为一个软件并不会仅有一个程序文件，而是有一堆程序代码文件。所以除了每个主程序与子程序均需要写上一条编译过程的命令外，还需要写上最终的链接程序。程序代码短的时候还好，如果是类似WWW服务器软件（例如Apache），或是类似内核的源代码，动辄数百MB的数据量，编译命令会写到疯掉，这个时候，我们就可以使用make这个命令的相关功能来进行编译过程的简化。
当执行make 时，make 会在当前的目录下查找Makefile（or makefile）这个文本文件，而Makefle里面则记录了源代码如何编译的详细信息。make会自动地判别源代码是否经过变动了，而自动更新执行文件，是软件工程师相当好用的一个辅助工具。
咦，make是一个程序，会去找Makefile，那Makefile怎么写？通常软件开发商都会字来检测用户的操作环境，以及该操作环境是否有软件开发商所需要的其他功能，该检测后，就会主动地建立这个Makefile的规则文件，通常这个检测程序的文件名为configure或是config。

**至于make与configure运行流程的相关性**，如下图：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213439.png)

你要进行的任务其实只有两个，一个是执行configure来建立Makefile, 这个步骤一定要成功。成功之后再以make来调用所需要的数据进行编译即可

### 实战
1. 安装gcc和make和两个工具，把源码包变成可以执行的程序

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213453.png)

2. tar解包，释放源代码至指定目录。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213505.png)

**以下所有步骤都要在解压目录下执行。**
3. 执行`./configure`
  
![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213521.png)

**`prefix=PREFIX`，选择安装目录**

4. make编译，生成可执行的二进制程序文件

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213540.png)

5. make install安装，将编译好的文件复制到安装目录
make install后，进去/mnt/myprm看到以下包证明装完了

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213550.png)


#### 卸载程序
在linux 中用` ./configure && make && make install`后，  一般使用如下方法来删除
**第一种情况：**
使用官方的uninstall
如果源代码提供了uninstall/distclean/veryclean文件，则使用如下代码即可
```
make uninstall
make distclean
make veryclean
```

**第二种情况： 手动删除软件目录**
由于程序是自己编译安装的，所以不会经过rpm数据库，所以没有记录安装。所以卸载就是直接删掉安装目录。

## rpm
### RPM包的安装
安装 RPM 的命令格式为：
```bash
[root@localhost ~]# rpm -ivh /mnt/cdrom/Packages/httpd-2.2.15-15.el6.centos.1.i686.rpm
Preparing...
####################
[100%]
1:httpd
####################
[100%]
```
此命令中各选项参数的含义为：
- -i：安装（install）;
- -v：显示更详细的信息（verbose）;
- -h：打印 #，显示安装进度（hash）;

注意，直到出现两个 100% 才是真正的安装成功，第一个 100% 仅表示完成了安装准备工作。

此命令还可以一次性安装多个软件包，仅需将包全名用空格分开即可，如下所示：
```bash
[root@localhost ~]# rpm -ivh a.rpm b.rpm c.rpm
```

### RPM包的升级
使用如下命令即可实现 RPM 包的升级：
```bash
[root@localhost ~]# rpm -Uvh 包全名
-U（大写）选项的含义是：如果该软件没安装过则直接安装；若没安装则升级至最新版本。

[root@localhost ~]# rpm -Fvh 包全名
-F（大写）选项的含义是：如果该软件没有安装，则不会安装，必须安装有较低版本才能升级。
```

### RPM包的卸载
RPM 软件包的卸载很简单，使用如下命令即可：
```bash
[root@localhost ~]# rpm -e 包名
```
`-e`选项表示卸载，也就是 erase 的首字母。

**RPM 软件包的卸载要考虑包之间的依赖性**。例如，我们mod_ssl软件包依赖httpd软件包，那么在卸载时，就必须先卸载 mod_ssl，然后卸载 httpd，否则会报错。
软件包卸载和拆除大楼是一样的，本来先盖的 2 楼，后盖的 3 楼，那么拆楼时一定要先拆除 3 楼。

如果卸载 RPM 软件不考虑依赖性，执行卸载命令会包依赖性错误，例如：
```bash
[root@localhost ~]# rpm -e httpd
error: Failed dependencies:
httpd-mmn = 20051115 is needed by (installed) mod_wsgi-3.2-1.el6.i686
httpd-mmn = 20051115 is needed by (installed) php-5.3.3-3.el6_2.8.i686
httpd-mmn = 20051115 is needed by (installed) mod_ssl-1:2.2.15-15.el6.
centos.1.i686
httpd-mmn = 20051115 is needed by (installed) mod_perl-2.0.4-10.el6.i686
httpd = 2.2.15-15.el6.centos.1 is needed by (installed) httpd-manual-2.2.
15-15.el6.centos.1 .noarch
httpd is needed by (installed) webalizer-2.21_02-3.3.el6.i686
httpd is needed by (installed) mod_ssl-1:2.2.15-15.el6.centos.1.i686
httpd=0:2.2.15-15.el6.centos.1 is needed by(installed)mod_ssl-1:2.2.15-15.el6.centos.1.i686
```

RPM 软件包的卸载命令支持使用“-nocteps”选项，即可以不检测依赖性直接卸载，但此方式不推荐大家使用，因为此操作很可能导致其他软件也无法征程使用。

### rpm 命令查询
```bash
[root@localhost ~]# rpm -qa
[root@localhost ~]# rpm -q[licdR] 已安装的软件名称
[root@localhost ~]# rpm -qp[licdR] 未安装的某个文件名称
```
- -q：查询软件包是否安装
- -qa：查询系统中所有安装的软件包
- -qi：查询软件包的详细信息
- -ql：命令查询软件包的文件列表
- -qf：命令查询系统文件属于哪个RPM包
- -qR：查询软件包的依赖关系

## yum
### yum查询命令
`ryum list`：查询所有已安装和可安装的软件包。
`yum list 包名`：查询执行软件包的安装情况
`yum search 关键字`：从 yum 源服务器上查找与关键字相关的所有软件包
`yum info 包名`：查询执行软件包的详细信息

### yum安装命令
yum 安装软件包的命令基本格式为：
```bash
[root@localhost yum.repos.d]# yum -y install 包名
```
-y：自动回答 yes。如果不加 -y，那么每个安装的软件都需要手工回答 yes；

### yum 升级命令
使用 yum 升级软件包，需确保 yum 源服务器中软件包的版本比本机安装的软件包版本高。
yum 升级软件包常用命令如下：
`yum -y update`：升级所有软件包。不过考虑到服务器强调稳定性，因此该命令并不常用。
`yum -y update 包名`：升级特定的软件包。

### yum卸载命令
使用 yum 卸载软件包时，会同时卸载所有与该包有依赖关系的其他软件包，即便有依赖包属于系统运行必备文件，也会被 yum 无情卸载，带来的直接后果就是使系统崩溃。
除非你能确定卸载此包以及它的所有依赖包不会对系统产生影响，否则不要使用 yum 卸载软件包。
yum 卸载命令的基本格式如下：
```
[root@localhost yum.repos.d]# yum remove 包名
```

## dpkg
###  DPKG包的安装
安装命令：dpkg -i 包全名
选项
- -i：安装
- --unpack：解开软件包
- --configure：配置软件包

-i 选项所做操作包含解开软件包和配置软件包，相当于这两步操作：
dpkg --unpack 包全名
dpkg --configure 包名

### DPKG包的卸载
卸载命令：dpkg -r|-P 包名
选项
- -r：删除已安装的软件包，但保留配置文件
- -P：删除已安装软件包，完全清除包（含配置文件）

### DPKG包的查询
1. 查询已安装软件包列表，命令：dpkg -l [包名]
选项
- -l：查询已安装软件包列表，包含状态、版本信息
- 包名：查询指定的软件包，如果省略查询全部已安装软件包。包名可使用通配符

2. 列出软件包关联文件，命令：dpkg -L 包名 或 dpkg -c 包全名
选项
- -L：列出已安装软件包关联文件列表
- -c：列出未安装软件包关联文件列表
也可以通过该命令查看软件包文件安装目录位置

3. 显示软件包的详细状态，命令：dpkg -s 包名
选项
- -s 或 --status：显示软件包的详细状态

4. 搜索含有指定文件的软件包，命令：dpkg -S 文件名
选项
- -S 或 --search：搜索含有指定文件的软件包。文件名可使用通配符
示例：
```bash
taicw@taicw-PC:~/Downloads$ dpkg -S apache2.conf
apache2: /etc/apache2/apache2.conf
```

5. 搜索系统中损坏的软件包，命令：dpkg -C

## apt
APT 管理软件包，主要由以下几个命令组成：
- apt-get：主要用来安装、升级和卸载软件，智能解决依赖关系(新版可用 apt 命令代替，去掉了"-get")
- apt-cache：查询软件包缓存文件
- apt-file：软件包查找工具，可以查到软件包所含的文件和安装的位置

### apt安装命令
`apt-get install 包名`

### apt升级命令
`apt-get upgrade` 更新所有已安装软件。只是简单的更新包，不管这些依赖，它不能添加新的软件包，或是删除软件包，并且不更改相应软件的配置文件
`apt-get dist-upgrade` 可以根据依赖关系的变化，添加软件包，删除软件包，并且更改相应软件的配置文件，包括升级系统版本

### apt卸载命令
卸载命令：
`apt-get remove 包名`: 删除指定软件，但是保留配置文件
`apt-get --purge remove 包名`:  删除指定软件，同时删除配置文件
`apt-get autoremove`:  删除系统内部不需要的依赖软件(一般指安装其他软件包时通过依赖安装的软件包)。该操作可能存在误删，无特殊需求尽量不要执行该命令

### apt检查命令
`apt-get check 包名`:检查软件包是否有损坏的依赖：

# Unix目录结构的来历
Unix（包含Linux）的初学者，常常会很困惑，不明白目录结构的含义何在。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213602.png)

举例来说，根目录下面有一个子目录/bin，用于存放二进制程序。但是，/usr子目录下面还有/usr/bin，以及/usr/local/bin，也用于存放二进制程序；某些系统甚至还有/opt/bin。它们有何区别？
原来Unix目录结构是历史造成的。1969年，Ken Thompson和Dennis Ritchie在小型机PDP-7上发明了Unix。1971年，他们将主机升级到了PDP-11。当时，他们使用一种叫做RK05的储存盘，一盘的容量大约是1.5MB。没过多久，操作系统（根目录）变得越来越大，一块盘已经装不下了。于是，他们加上了第二盘RK05，并且规定第一块盘专门放系统程序，第二块盘专门放用户自己的程序，因此挂载的目录点取名为/usr。也就是说，根目录"/"挂载在第一块盘，"/usr"目录挂载在第二块盘。除此之外，两块盘的目录结构完全相同，第一块盘的目录（/bin, /sbin, /lib, /tmp...）都在/usr目录下重新出现一次。
后来，第二块盘也满了，他们只好又加了第三盘RK05，挂载的目录点取名为/home，并且规定/usr用于存放用户的程序，/home用于存放用户的数据。
从此，这种目录结构就延续了下来。随着硬盘容量越来越大，各个目录的含义进一步得到明确。
- /：存放系统程序，也就是At&t开发的Unix程序。
- /usr：存放Unix系统商（比如IBM和HP）开发的程序。
- /usr/local：存放用户自己安装的程序。
- /opt：在某些系统，用于存放第三方厂商开发的程序，所以取名为option，意为"选装"。

# windows配置免密码登录linux
1. windows配置ssh
这个我是很久之前安装的了.就是百度一下windows安装openssh即可.然后跟着教程走一波,安装完openssh
2. 生成公钥
```
ssh-keygen
```
生成公钥的位置
  
![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213613.png)

就是这个文件.在ssh/下.这个是公钥.id_rsa是私钥.我们只需要公钥.

3. 发送公钥到linux
```bash
scp ./id_rsa.pub root@192.168.xxx.xxx:~/.ssh/windows_ras.pub
```
scp是个命令,第一个参数是当前要发送的文件,root是linux用户名@后接IP.然后冒号后接这个文件要存放的位置
这样就发送过去了.

4. 配置Linux
cd ~/.ssh #进入到ssh目录.这个目录注意.我们是链接root所以这个家目录应该是root
touch authorized_keys
新建文件用来存放公钥,如果你已经有这个文件了.继续往下追加即可
然后将你的windows公钥追加到这个文件中即可

5. 重启ssh服务
service sshd restart  //重启ssh服务

6. 连接
配置ssh免密钥登录之前如果没有登录过服务器，则第一次使用ssh免密钥登录时，会出现如下情况

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213631.png)

输入yes即可，以后使用ssh免密钥登录就不会出现这种情况了

# 关于shell脚本中执行cd命令无效的分析
## 缘起：
我在shell中写cd目录为什么不会到我想去的目录中? 
shell脚本中使用cd命令进入到指定目录后，然后执行该目录下的命令，在执行shell脚本后发现不能进入到指定目录中，因而后续命令会因为找不到而报错？

## 例子：
编写shell脚本test.sh
```bash
#!/bin/sh
cd Tools/vmware-tools-distrib
pwd
```

在Terminal中执行./test.sh，结果如下：
```bash
soaringlee@ubuntu:~/Desktop$ ./test.sh 
/home/soaringlee/Desktop/Tools/vmware-tools-distrib
soaringlee@ubuntu:~/Desktop$ 
```
因而并没有进入到指定目录中。

在Terminal中执行source test.sh，结果如下：
```bash
soaringlee@ubuntu:~/Desktop$ source test.sh 
/home/soaringlee/Desktop/Tools/vmware-tools-distrib
soaringlee@ubuntu:~/Desktop/Tools/vmware-tools-distrib$ 
```
因此采用source命令执行该脚本，进入到了指定目录中。
采用点命令运行该脚本，也可以实现进入到指定目录中。
```bash
soaringlee@ubuntu:~/Desktop$ . test.sh
/home/soaringlee/Desktop/Tools/vmware-tools-distrib
soaringlee@ubuntu:~/Desktop/Tools/vmware-tools-distrib$
```

## 原因：
采用第一种方法是直接运行该脚本，会创建一个子shell，并在子shell中逐个执行脚本中的指令； 而子shell从父shell中继承了环境变量，但是执行后不会改变父shell的环境变量；可以这样理解：在子shell中的操作和环境变量不会影响父进程，在执行完shell后又回到了父进程。
采用第二种方法运行该脚本，source命令是在当前shell环境下执行该脚本，不会创建子shell，因而可以在shell中进入到指定目录中。
source命令又称为点命令，因为source命名可用 . 来代替作用：在当前shell环境下读取并执行脚本中的命令，通常用于重新执行刚修改过的初始化文件，使之立即生效，而不必注销并登录。


# 设置DNS
常用DNS提供商
`114.114.114.114 / 114.114.115.115`这款国内的 DNS 有着访问速度快，以及稳定的好名声，而且在各省都有服务器

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213648.png)

linux查看DNS一般位于/etc/resolv.conf文件中

## Ubuntu
安装好Ubuntu之后设置了静态IP地址，再重启后就无法解析域名。想重新设置一下DNS，打开/etc/resolv.conf
```
cat /etc/resolv.conf
# Dynamic resolv.conf(5) file for glibc resolver(3) generated by resolvconf(8)
#     DO NOT EDIT THIS FILE BY HAND -- YOUR CHANGES WILL BE OVERWRITTEN
```
内容是一段警告：说这个文件是resolvconf程序动态创建的，不要直接手动编辑，修改将被覆盖。
果不其然，修改后重启就失效了，搜索了Ubuntu下设置DNS的相关资料，总结出两个办法：

### 方法一
通过/etc/network/interfaces，在它的最后增加一句：

```
dns-nameservers 8.8.8.8
```

8.8.8.8是Google提供的DNS服务，这里只是举一个例子，你也可以改成电信运营商的DNS。重启后DNS就生效了，这时候再看/etc/resolv.conf，最下面就多了一行：
```
# Dynamic resolv.conf(5) file for glibc resolver(3) generated by resolvconf(8)
#     DO NOT EDIT THIS FILE BY HAND -- YOUR CHANGES WILL BE OVERWRITTEN
nameserver 8.8.8.8
```
### 方法二
通过修改：/etc/resolvconf/resolv.conf.d/base（这个文件默认是空的）

在里面插入：
```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

如果有多个DNS就一行一个
修改好保存，然后执行
```
resolvconf -u
```
再看/etc/resolv.conf，最下面就多了2行：
```
# Dynamic resolv.conf(5) file for glibc resolver(3) generated by resolvconf(8)
#     DO NOT EDIT THIS FILE BY HAND -- YOUR CHANGES WILL BE OVERWRITTEN
nameserver 8.8.8.8
nameserver 8.8.4.4
```
可以看到我们的设置已经加上了，然后再ping一个域名，当时就可以解析了，无需重启。

## CentOS
直接修改/etc/resolv.conf，内容是：
```
nameserver 8.8.8.8
nameserver 8.8.4.4
```
保存就生效了，重启也没问题。

# 关闭防火墙
**在centos中**
以下命令是在centos中的
- service iptables stop   关闭防火墙
- chkconfig iptables off  禁止防火墙开机自启
- service iptables status 查看防火墙的状态

**Ubuntu中**
-	ufw disable 关闭ubuntu的防火墙
- ufw enable 开启防火墙

**kali中**
```
apt-get install ufw
# 如果安装失败就替换一下apt-get的源
ufw disable
```

# 设置固定ip
1. 修改/etc/network/interfaces文件
在终端输入命令：vim  /etc/network/interfaces，修改文件的内容如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213701.png)

2. 修改/etc/resolv.conf文件
在终端输入命令：vim /etc/resolv.conf，向其中修改如下的内容：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213715.png)

3. 重启网络服务
```
systemctl restart networking
```

# 设置root用户初始密码
## ubuntu
1、ubuntu都是以普通用户安装的，如果你刚安装设置root用户是不允许的。
2、出于安全考虑，默认时Ubuntu的root用户时没有固定密码的，它的密码是随机产生并且动态改变的。
那么：
如何知道新安装的ubuntu默认root密码是多少呢？
既然默认root密码是随机的，即每次开机都有一个新的root密码。我们只需要修改默认root密码即可！
我们可以在终端输入命令 sudo passwd，然后再输入root用户的密码。
```
sudo passwd ：修改root密码
```

# 修改安装源为国内镜像源
## ubuntu
1. 原文件备份
```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```
2. 编辑源列表文件
```bash
sudo vim /etc/apt/sources.list
```
3. 将原来的列表删除，添加如下内容（中科大镜像源）
```text
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial main restricted universe multiverse
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial-security main restricted universe multiverse
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial-proposed main restricted universe multiverse
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial-backports main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial-security main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial-proposed main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial-backports main restricted universe multiverse
```
4. 运行sudo apt-get update

## kali
```
vim /etc/apt/sources.list
```
```
#中科大
deb http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
deb-src http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
#阿里云
deb http://mirrors.aliyun.com/kali kali-rolling main non-free contrib
deb-src http://mirrors.aliyun.com/kali kali-rolling main non-free contrib
#清华大学
deb http://mirrors.tuna.tsinghua.edu.cn/kali kali-rolling main contrib non-free
deb-src https://mirrors.tuna.tsinghua.edu.cn/kali kali-rolling main contrib non-free
```
4. 运行sudo apt-get update

# dotfiles
[~/.dotfiles in 100 Seconds](https://www.youtube.com/watch?v=r_MpUP6aKiQ)

## Manage all your installed software at one place with Homebrew Bundle
In software development, you often manage all your dependencies through a package manager like NPM or NuGet. When it comes to software on our operating systems, we often break with this concept and install software from all various places like App Stores, Websites and more. Homebrew Bundle takes back control.

If you regularly install software on your Mac or Linux machine, that does not come via the official App Stores, you might be familiar with Homebrew, a package manager for operating systems. With the Homebrew Bundle extension, we can even define a list of all installed software in a Brewfile file.

### Generate a Brewfile
A good starting point is to dump all currently via Homebrew installed software into a new Brewfile file.
```
brew bundle dump --describe
```

Within such a Brewfile, you can define a mix of application sources:
- `brew` for regular Homebrew command-line apps
- `cask` for desktop applications
- `mas` for Apple App Store applications
Here is a (shortened) example of some my configuration.
```
tap "homebrew/bundle"
tap "homebrew/cask", "https://mirrors.ustc.edu.cn/homebrew-cask.git"
tap "homebrew/core", "https://mirrors.ustc.edu.cn/homebrew-core.git"
tap "homebrew/services", "https://gitee.com/cunkai/homebrew-services.git"
# Interpreted, interactive, object-oriented programming language
brew "python@3.9"
# Core application library for C
brew "glib"
# Cross-platform make
brew "cmake"
# Toolkit for image loading and pixel buffer manipulation
brew "gdk-pixbuf"
# GIF image/animation creator/editor
brew "gifsicle"
# Open source programming language to build simple/reliable/efficient software
brew "go"
# Image loading and rendering library
brew "imlib2"
# Library for a binary-based efficient data interchange format
brew "msgpack"
# Open source relational database management system
brew "mysql", restart_service: true
# Ambitious Vim-fork focused on extensibility and agility
brew "neovim"
# Display and control your Android device
brew "scrcpy"
# Code-search similar to ack
brew "the_silver_searcher"
# Terminal multiplexer
brew "tmux"
# Display directories as trees (with optional color/HTML output)
brew "tree"
# Full TeX Live distribution without GUI applications
cask "mactex-no-gui"
```

### Install all packages from a Brewfile
Homebrew Bundle works like every other package manager. To install the listed applications or bring them all to the latest version, you just call the following command.
```
brew bundle --file ~/my-folder/Brewfile
```

# vim
## vim命令的组成
vim中命令是由`重复次数 + 命令 + 范围`组成的。

## 文本对象
vim中的文本对象可以分为3大类：paragraphs、sentences、words

### paragraphs
每一段以空行分隔

### sentences
以`[.|？|!][<Space>|<Enter>|<Tab>]`结尾，算一句

### words
在vim中words分为2种，分别是`小词`、`大词`：
- `小词`: 小词分为如下三种
    - 第一种小词：连在一起的字符 只有`字母`、`_` 的词，例如`aaa`、`aaa_aaa`都是一个小词
    - 第二种小词：连在一起的字符 只有`汉字`的词，例如`发发发`、`番窠倒臼番窠倒臼`都是一个小词
    - 第三种小词：连在一起的字符 不包含`字母`、`_`、`汉字`与`空格` 的词， 例如`[]`、`{}`都是一个小词
    - 实战：`{ab_dd}`可以拆分为3个小词，分别是`{`、`ab_dd`、`}`； `{ab&dc}`可以拆分为5个小词，分别是`{`、`ab`、`&`、`dc`、`}`；`{ab否&dd}`可以拆分为6个小词，分别是`{`、`ab`、`否`、`&`、`dd`、`}`
- `大词`：连在一起字符 不包含`空格` 的词， 例如`fkdjfk_d&**方法*^^**`是一个大词

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409131430.png)


## 在vim中直接执行linux命令
- `:!cmd`: 不退出vim 执行命令 cmd
- `:r !cmd`: 不退出vim执行命令cmd,并将cmd的输出内容插入当前文本中。
- `:shell`: 切换到shell里（此时并没有退出vim，可以理解成vim转入后台），你可以在shell中做任何操作，退出shell（比如用exit）后，会切换回原来的vim中

## 信息查看
- `:messages`: 命令可以查看以前给出的消息

## 命令总结
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

### 可视模式
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

#### change list
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

#### 其他
- `'.`: 跳转到最后一次编辑的地方
- `.^`: 跳转到最后一次退出插入模式的地方

### 搜索
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

## .操作
`.`表示重复该操作: 上次普通模式进入插入模式的操作 到 进入这次普通模式的操作

![](https://raw.githubusercontent.com/NaisWang/images/master/20220415205707.png)

## normal命令
Vim normal命令的使用形式为`:{range}norm[al][!] {commands}`，表示在 `{range}`指定的范围内的每行执行若干普通模式命令 `{commands}`。若未指定，则表示在当前行执行命令。`{commands}` 不能以空格开始，除非在空格前面加个计数 1。

例如:
- `:normal ggdd` 会将光标移动到文件的第一行( gg) 并删除它( dd )
- `:%normal A;` %代表整个文件范围，在每行的结尾添加一个分号
- `:%normal i//` 在每行的开头添加//

### 避免vim映射
normal命令中的可选参数`!` 用于指示vim在当前命令中不使用任何vim映射；如果没有显式使用 `!` 选项，即便是执行一个非递归映射 (noremap) 命令，它的参数仍有可能被重新映射。

例如，假设已经设置了vim映射 `:nnoremap G dd`，则在vim普通模式按下 `G` 将执行命令 `dd`，即会删除一整行；此时，若在vim命令行模式下执行命令 `:normal G` 同样将删除当前行而不会跳转到当前文件的末行。

为了在即便 `G` 命令已经被设置了映射的条件下也能在vim `normal`命令中不改变 `G` 命令原始的含义，需要使用 `:normal! G`。通过 `!` 选项显式指示Vim在当前命令中不使用任何vim映射。

### 配合.使用
假设想在某个文件的一系列行尾添加一个分号`;`，使用vim重复操作命令 `.` 当然可以完成这一任务。但是如果想对100行内容执行末尾加分号的操作，如果使用 `.` 命令，则需要按100次 `j.`，这显然不是一个好的方法。

为了完成上述任务，vim教程网介绍一种使用 normal 命令执行 `.` 命令的新方法。

首先使用命令 `A;` 在光标所在当前行末尾增加 `;`, 然后按 `j` 跳到下一行末尾后按 `V` 进入vim块选择可视化模式，然后按 `G` 跳转到文件尾行，从而完成目标行的选择, 最后，在vim命令行模式下执行命令 `:'<,'>normal .`

`:'<,'>normal .` 命令可以解读为 对高亮选区中的每一行 执行普通模式下的 `.` 命令。无论是操作 100 行还是 1000 行文本，这种方法都能高效地完成任务，而且在可视模式中选中这些行可以摆脱计数的负担。

![](https://raw.githubusercontent.com/NaisWang/images/master/691e0c29gy1fv6131ex74g20j40bqjtz.gif)

注：`'<,'>` 代表高亮选区的范围。在可视化模式下选择完范围后，如果按下 `:` 键，vim命令行上就会自动填充 `:'<,'>`

### 配合宏使用
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

### normal命令下的<C-O>作用
`:%normal A;^OI#`: 其中`^O`是按了`<C-O>`出现的字符，表示回到普通模式。这行命令的作用是在普通模式下按`A;`, 由于按了`A`, 所以此时是插入模式，然后通过`<C-O>`即`^O`回到普通模式下，再按`I#`

## 寄存器
常见文本编辑器都会提供剪切板来支持复制粘贴，Vim 也不例外。 不同的是 Vim 提供了 10 类共 48 个寄存器，提供无与伦比的寄存功能。 最常用到的是匿名寄存器(`"0`)，因为它默认只会存储 `y` 操作拷贝的内容。

一般来讲，可以用 `"{register}y` 来拷贝到 `{register}` 中， 用 `"{register}p` 来粘贴 `{register}` 中的内容。例如： `"ayy` 可以拷贝当前行到寄存器 `a` 中，而 `"ap` 则可以粘贴寄存器 `a` 中的内容。

在 Vim 中可通过 :reg 来查看每个寄存器当前的值。

## 配置文件
### 用Alt键来映射
这次在用Vim的时候，想设置以下快捷键，但是Alt+key（`<A+key>`)的设置一直不成功，后来在网上找了一下资料才明白原来将"`<A+key>`"的输入格式欢畅"^[key"就可以了，输入方式为：按下 Crtl+v后在按下 esc ，再按下key（你想设置的键），这样vim中显示为：^[key, 这样就搞定了……
　注：这种方式再gvim、idea中不行，再gvim中直接使用\<M-key>或\<A-key>

### vim中json文件中双引号隐藏问题
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

### 键映射中nore含义
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

## ex命令之g命令
Vim's global (`:h :g` for more info) command is a useful tool to quickly perform Ex command within the file you're currently editing (some common example of Ex commands are: `d` (delete), `t` (copy), `s` (substitute), `m` (move), etc). Used properly, it can save you a lot of time typing.

`g` follows the syntax:
```
:[range]g[lobal]/{pattern}/[cmd]
```
Here I will cover basic, slightly more advanced, and advanced use cases. If this is your first time using `g`, you don't have to follow the advanced one yet, feel free to come back later after getting more experience with it. Learning Vim takes a lot of muscle memories. I am still learning new something new about Vim all the time! 🤓

### When to use it?

Anytime you find yourself repeating the same Ex command in one file, you should start thinking, "How can I do this in one stroke with `:g`?"

### Basic use cases

Let's start with basic use cases, going to more sophisticated ones.

Suppose you have a file with many "const" and you need to delete them all:
```
const hello = "world";
const foo = "bar";
const baz = "qux";
// and many more const...
```
Run :g/const/d and they are gone!

What just happened?

We gave `g` a pattern: `"const"` string. It found all lines (`g` is line-based) that matches the pattern. It performed `d` (deletion) to those matches.

`g` by default will perform `p` (print) if no command is passed. Try it: `:g/const/.`

It also accepts ranges. Let's say you want to get rid of all empty lines between lines 10 and 20. You can do this by:
```
:10,20g/^$/d
```
Note: `^$` is a regex pattern for blank lines.

### Slightly more advanced use cases

Let's move on to more fancy use cases.

Suppose you have the following and want to reverse the line order:
```
const one = 1;
const two = 2;
const three = 3;
const four = 4;
```
To do that with :g, you can do:

```
:global/^/m 0
```

We'd get:

```
const four = 4;
const three = 3;
const two = 2;
const one = 1;
```

Pretty cool, but how did it work?

`m 0` moves (see `:h :m` for details) a line into target line number (line 0). If you want to do it yourself manually, you can go to line 1, run :m 0, then go to next line, run `:m 0`, then next line, run `:m 0`, etc. You'll notice the lines are gradually being put on top of the latest one. The difference is, `g` does it for you in one move. (btw, `^` is a pattern for beginning of line; here it selects all lines in a file).

Pretty cool! 😎

You can combine `g` with substitute (`s`):

```
good, bad, ugly
you're so good it's bad
nothing bad here
```

If we want to substitute all "bad"s into "nice", but only on the lines that contain "good", we can do:

```
:g/good/s/bad/nice/g
```

We'd get:

```
good, nice, ugly
you're so good it's nice
nothing bad here
```

### Advanced use cases

`g` can be used with macros. The syntax is :

```
:g/keyword/norm! @q
```

Let's say we have a the following:

```
import lib1
import lib2

const something = 'else';

import lib3
// ...and many more imports
```
Our tasks are:
1. wrap all libs with {}
2. capitalize the l in lib

We can create macro to do our tasks. But we don't want to execute our macro on lines not containing `import`. Does that mean we have to apply our macros individually on each line we want to do it on?

Well, with `g`, we can select to apply our macros only to lines containing "import"! Imagine the time saving if you have to do it on 100+ lines!

Assuming we have vim-surround installed (for quick brackets wrap), here's how we can do it!

- Record a macro to do tasks 1 and 2. With our cursor on "i" in `import lib1`, run:
```
qq0w~ysiw{q
// qq = record macro in q register
// 0 = go to beginning of line
// w = jump one word
// ~ = capitalize letter under cursor
// ysiw{ = vim-surround: add {} around lib1
// q = exit recording
```
- Undo the changes so our line is back to our original state: `import lib1`
- Now execute the macro on only lines containing "import" with :g!
```
:g/import/norm! @q
```
And there you have it:
```
import { Lib1 }
import { Lib2 }

const something = 'else';

import { Lib3 }
// and more...
```

## vim正则表达式
毋庸多言，在vim中正则表达式得到了十分广泛的应用。 最常用的`/` 和 `:s` 命令中，正则表达式都是不可或缺的。 下面对vim中的正则表达式的一些难点进行说明。

### 关于magic
vim中有个magic的设定。设定方法为：
```
:set magic " 设置magic 
:set nomagic " 取消magic
```

vim毕竟是个编辑器，正则表达式中包含的大量元字符如果原封不动地引用（像perl 那样）， 势必会给不懂正则表达式的人造成麻烦，比如 `/foo(1)` 命令， 大多数人都用它来查找`foo(1)`这个字符串， 但如果按照正则表达式来解释，被查找的对象就成了`foo1` 了。

于是，vim就规定，正则表达式的元字符必须用反斜杠进行转义才行， 如上面的例子，如果确实要用正则表达式，就应当写成 `/foo\(1\)` 。 但是，像 `.` `*` 这种极其常用的元字符，都加上反斜杠就太麻烦了。 而且，众口难调，有些人喜欢用正则表达式，有些人不喜欢用……

为了解决这个问题，vim设置了 `magic` 这个东西。简单地说， magic就是设置哪些元字符要加反斜杠哪些不用加的。 简单来说：

- `magic (\m)`：除了 `$` `.` `*` `^` 之外其他元字符都要加反斜杠。
- `nomagic (\M)`：除了 `$` `^` 之外其他元字符都要加反斜杠。

这个设置也可以在正则表达式中通过 `\m` `\M` 开关临时切换。 
- `\m` 后面的正则表达式会按照 `magic` 处理
- `\M` 后面的正则表达式按照 nomagic 处理， 而忽略实际的magic设置。


例如：
- `/\m.*` # 查找任意字符串
- `/\M.*` # 查找字符串 `.*` （点号后面跟个星号）

另外还有更强大的 `\v` 和 `\V`。
- `\v` （即 `very magic` 之意）：任何元字符都不用加反斜杠
- `\V` （即 `very nomagic` 之意）：任何元字符都必须加反斜杠

例如：
- `/\v(a.c){3}$` # 查找行尾的`abcaccadc`
- `/\m(a.c){3}$` # 查找行尾的`(abc){3}`
- `/\M(a.c){3}$` # 查找行尾的`(a.c){3}`
- `/\V(a.c){3}$` # 查找任意位置的`(a.c){3}$`

默认设置是 magic，vim也推荐大家都使用magic的设置，在有特殊需要时，直接通过 `\v\m\M\V` 即可。

## 搜索替换中的&
在搜索替换中&前面匹配到的内容，如下例子:

```
abcdef
```
对于以上文本，使用`:s/abc/&123`后，内容会变成如下：
```
abc123def
```

## 常用场景
### c键与d键区分开
如果要进入插入模式，则使用c键，反之，则使用d键

1. 重写当前整行
```
1. fff
2. nfffff
3. ddddd
```
假如现在光标在第2行，且我要重写第2行，则按`cc`

2. 重写当前光标后面的数据
```
1. abcdef
```
假如现在光标在c字母处，且我要重写后面的数据，则按`C`

### 善用f键与t键
f键与t键常与d、c、y、v键搭配使用

### 善用r键与R键

### 测试题 
```
ACDSee             000001   499.95  ACD Systems, Ltd.
Internet Explorer  000004  1999.50  Microsoft Corp.
Vi IMproved        000015     0.00  Bram Moolenaar
FlashFXP           000204   199.00  CEDsoft
```
1. 使用`C`将`ACD Systems, Ltd`重写成`MDC Coll`
2. 使用`ciw`键将`Microsoft`重写成`Apple`
3. 使用`ytC`键复制第2行的`Explorer  000004  1999.50  Apple `到下一行
4. 使用`ctM`将第3行的`000015     0.00  Bram Moolenaar`修改成`0000dddMoolenaar`
5. 使用`r`将第4行的`FlashFXP`修改成`FldshFXP`
6. 使用`R`将第4行的`CEDsoft`修改成`Cabcdet`

最终效果如下
```
ACDSee             000001   499.95  MDC Coll
Internet Explorer  000004  1999.50  Apple Corp.
Explorer  000004  1999.50  Apple 
Vi IMproved        0000dddMoolenaar
FldshFXP           000204   199.00  Cabcdet
```

# tmux
## 会话管理
### 新建会话
第一个启动的 Tmux 窗口，编号是`0`，第二个窗口的编号是`1`，以此类推。这些窗口对应的会话，就是 0 号会话、1 号会话。
使用编号区分会话，不太直观，更好的方法是为会话起名。
```
$ tmux new -s <session-name>
```
上面命令新建一个指定名称的会话。

### 分离会话
在 Tmux 窗口中，按下`Ctrl+b d`或者输入`tmux detach`命令，就会将当前会话与窗口分离。
```
$ tmux detach
```
上面命令执行后，就会退出当前 Tmux 窗口，但是会话和里面的进程仍然在后台运行。
`tmux ls`命令可以查看当前所有的 Tmux 会话。
```
$ tmux ls
# or
$ tmux list-session
```
### 接入会话
`tmux attach`命令用于重新接入某个已存在的会话。
```
# 使用会话编号
$ tmux attach -t 0

# 使用会话名称
$ tmux attach -t <session-name>
```

### 杀死会话
`tmux kill-session`命令用于杀死某个会话。
```
# 使用会话编号
$ tmux kill-session -t 0

# 使用会话名称
$ tmux kill-session -t <session-name>
```
### 切换会话
`tmux switch`命令用于切换会话。
```
# 使用会话编号
$ tmux switch -t 0

# 使用会话名称
$ tmux switch -t <session-name>
```
### 重命名会话
`tmux rename-session`命令用于重命名会话。
```
$ tmux rename-session -t 0 <new-name>
```
上面命令将0号会话重命名。

### 会话快捷键
下面是一些会话相关的快捷键。
- `Ctrl+b d`：分离当前会话。
- `Ctrl+b s`：列出所有会话。
- `Ctrl+b 2`：列出所有窗口。
- `Ctrl+b $`：重命名当前会话。

## 最简操作流程
综上所述，以下是 Tmux 的最简操作流程。
1. 新建会话`tmux new -s my_session`。
2. 在 Tmux 窗口运行所需的程序。
3. 按下快捷键`Ctrl+b d`将会话分离。
4. 下次使用时，重新连接到会话`tmux attach-session -t my_session`。

## 窗格操作
Tmux 可以将窗口分成多个窗格（pane），每个窗格运行不同的命令。以下命令都是在 Tmux 窗口中执行。

### 划分窗格
`tmux split-window`命令用来划分窗格。
```
# 划分上下两个窗格
$ tmux split-window

# 划分左右两个窗格
$ tmux split-window -h
```

### 移动光标
`tmux select-pane`命令用来移动光标位置。
```
# 光标切换到上方窗格
$ tmux select-pane -U

# 光标切换到下方窗格
$ tmux select-pane -D

# 光标切换到左边窗格
$ tmux select-pane -L

# 光标切换到右边窗格
$ tmux select-pane -R
```

### 交换窗格位置
`tmux swap-pane`命令用来交换窗格位置。
```
# 当前窗格上移
$ tmux swap-pane -U

# 当前窗格下移
$ tmux swap-pane -D
```

### 窗格快捷键
下面是一些窗格操作的快捷键。

- `Ctrl+b %`: 划分左右两个窗格。
- `Ctrl+b "`: 划分上下两个窗格。
- `Ctrl+b <arrow key>`: 光标切换到其他窗格。`<arrow key>`是指向要切换到的窗格的方向键，比如切换到下方窗格，就按方向键↓。
- `Ctrl+b ;`: 光标切换到上一个窗格。
- `Ctrl+b o`: 光标切换到下一个窗格。
- `Ctrl+b {`: 当前窗格与上一个窗格交换位置。
- `Ctrl+b }`: 当前窗格与下一个窗格交换位置。
- `Ctrl+b Ctrl+o`: 所有窗格向前移动一个位置，第一个窗格变成最后一个窗格。
- `Ctrl+b Alt+o`: 所有窗格向后移动一个位置，最后一个窗格变成第一个窗格。
- `Ctrl+b x`: 关闭当前窗格。
- `Ctrl+b !`: 将当前窗格拆分为一个独立窗口。
- `Ctrl+b z`: 当前窗格全屏显示，再使用一次会变回原来大小。
- `Ctrl+b Ctrl+<arrow key>`: 按箭头方向调整窗格大小。
- `Ctrl+b q`: 显示窗格编号。

## 窗口管理
除了将一个窗口划分成多个窗格，Tmux 也允许新建多个窗口。
### 新建窗口
`tmux new-window`命令用来创建新窗口。
```
$ tmux new-window

# 新建一个指定名称的窗口
$ tmux new-window -n <window-name>
```
### 切换窗口
`tmux select-window`命令用来切换窗口。
```
# 切换到指定编号的窗口
$ tmux select-window -t <window-number>

# 切换到指定名称的窗口
$ tmux select-window -t <window-name>
```
### 重命名窗口
`tmux rename-window`命令用于为当前窗口起名（或重命名）。
```
$ tmux rename-window <new-name>
```
### 窗口快捷键
下面是一些窗口操作的快捷键。
- `Ctrl+b c`: 创建一个新窗口，状态栏会显示多个窗口的信息。
- `Ctrl+b p`: 切换到上一个窗口（按照状态栏上的顺序）。
- `Ctrl+b n`: 切换到下一个窗口。
- `Ctrl+b <number>`: 切换到指定编号的窗口，其中的`<number>`是状态栏上的窗口编号。
- `Ctrl+b w`: 从列表中选择窗口。
- `Ctrl+b ,`: 窗口重命名。

## 其他命令
下面是一些其他命令。
```
# 列出所有快捷键，及其对应的 Tmux 命令
$ tmux list-keys

# 列出所有 Tmux 命令及其参数
$ tmux list-commands

# 列出当前所有 Tmux 会话的信息
$ tmux info

# 重新加载当前的 Tmux 配置
$ tmux source-file ~/.tmux.conf
```
