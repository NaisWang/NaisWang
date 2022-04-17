# 服务相关操作
## service 命令
service 命令用于对系统服务进行管理，比如启动（start）、停止（stop）、重启（restart）、重新加载配置（reload）、查看状态（status）等。不同的 Linux 发行版一般均会带有此命令，比如 RHEL、CentOS、SUSE、Ubuntu、Fedora 等。
service 命令是系统管理员命令，需要管理员权限才可以执行。service 命令本质上是一个 Shell 脚本，地址一般为 /sbin/service。
**命令格式**
```shell
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
```shell
service --status-all
```
2. 将 MySQL 注册为系统服务，使用 service 命令管理。需要将MySQL的管理脚本mysql.server更名为mysqld放在 /etc/init.d/目录。
```shell
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
```shell
# top
```
- 以累积模式显示程序信息
```shell
# top -S
```
- 设置信息更新次数
```shell
//表示更新两次后终止更新显示
top -n 2
```
- 设置信息更新时间
```shell
//表示更新周期为3秒
# top -d 3
```
- 显示指定的进程信息
```shell
//显示进程号为139的进程信息，CPU、内存占用率等
# top -p 139
```
- 显示更新十次后退出
```shell
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
不加参数执行ps命令：展示当前终端中运行的进程情况，很少使用。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213401.png)

默认展示了4列信息：
PID: 运行着的命令(CMD)的进程编号
TTY: 命令所运行的位置（终端）
TIME: 运行着的该命令所占用的CPU处理时间
CMD: 该进程所运行的命令

ps常使用的参数：
-A ：所有的进程均显示出来，与 -e 具有同样的效用；
-a ：显示现行终端机下的所有进程，包括其他用户的进程；
-u ：查看特定用户进程；
-x ：通常与 a 这个参数一起使用，可列出较完整信息
由于输出的内容太多，ps一般使用情况是   ps -aux | grep %要查询的东西%

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213411.png)

## fg
fg将后台中的命令调至前台继续运行如果后台中有多个命令，可以用 fg %jobnumber将选中的命令调出， %jobnumber是通过jobs命令查到的后台正在执行的命令的序号(不是pid)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220406213425.png)

## bg
bg将一个在后台暂停的命令，变成继续执行， 即使一个进程在后台
如果后台中有多个命令，可以用bg %jobnumber将选中的命令调出，%jobnumber是通过jobs命令查到的后台正在执行的命令的序号(不是pid) 

## kill
Linux kill 命令用于删除执行中的程序或工作。

kill 可将指定的信息送至程序。预设的信息为 SIGTERM(15)，可将指定程序终止。若仍无法终止该程序，可使用 SIGKILL(9) 信息尝试强制删除程序。程序或工作的编号可利用 ps 指令或 jobs 指令查看。

### 实例
- 杀死进程
```shell
# kill 12345
```
- 强制杀死进程
```shell
# kill -KILL 123456
```
- 发送SIGHUP信号，可以使用一下信号
```shell
# kill -HUP pid
```
- 彻底杀死进程
```shell
# kill -9 123456
```
- 显示信号
```shell
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
```shell
#kill -9 $(ps -ef | grep hnlinux) //方法一 过滤出hnlinux用户进程 
#kill -u hnlinux //方法二
```


# 文件相关操作
## grep
Linux grep 命令用于查找文件里符合条件的字符串。

grep 指令用于查找内容包含指定的范本样式的文件，如果发现某文件的内容符合所指定的范本样式，预设 grep 指令会把含有范本样式的那一列显示出来。若不指定任何文件名称，或是所给予的文件名为 -，则 grep 指令会从标准输入设备读取数据。

### 实例
1. 在当前目录中，查找后缀有 file 字样的文件中包含 test 字符串的文件，并打印出该字符串的行。此时，可以使用如下命令：
```shell
grep test *file 
```
结果如下所示：
```shell
$ grep test test* #查找前缀有“test”的文件包含“test”字符串的文件  
testfile1:This a Linux testfile! #列出testfile1 文件中包含test字符的行  
testfile_2:This is a linux testfile! #列出testfile_2 文件中包含test字符的行  
testfile_2:Linux test #列出testfile_2 文件中包含test字符的行 
```

2. 以递归的方式查找符合条件的文件。例如，查找指定目录/etc/acpi 及其子目录（如果存在子目录的话）下所有文件中包含字符串"update"的文件，并打印出该字符串所在行的内容，使用的命令为：
```shell
grep -r update /etc/acpi 
```
输出结果如下：
```shell
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
```shell
grep -v test *test*
```
结果如下所示：
```shell
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

```shell
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
```shell
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
```shell
awk -F  #-F相当于内置变量FS, 指定分割字符
```
实例：
```shell
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
```shell
awk -v  # 设置变量
```
实例：
```shell
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
```shell
# find . -name "*.c"
```

2. 将当前目录及其子目录中的所有文件列出：
```shell
# find . -type f
```

3. 将当前目录及其子目录下所有最近 20 天内更新过的文件列出:
```shell
# find . -ctime -20
```

4. 查找 /var/log 目录中更改时间在 7 日以前的普通文件，并在删除之前询问它们：
```shell
# find /var/log -type f -mtime +7 -ok rm {} \;
```

5. 查找当前目录中文件属主具有读、写权限，并且文件所属组的用户和其他用户具有读权限的文件：
```shell
# find . -type f -perm 644 -exec ls -l {} \;
```

6. 查找系统中所有文件长度为 0 的普通文件，并列出它们的完整路径：
```shell
# find / -type f -size 0 -exec ls -l {} \;
```

## which
Linux which命令用于查找文件。

which指令会在环境变量$PATH设置的目录里查找符合条件的文件。也就是说，使用which命令，就可以看到某个系统命令是否存在，以及执行的到底是哪一个位置的命令。

### 实例
使用指令"which"查看指令"bash"的绝对路径，输入如下命令：
```shell
$ which bash
```
上面的指令执行后，输出信息如下所示：
```shell
/bin/bash                   #bash可执行程序的绝对路径 
```

## whereis
whereis命令 用来定位指令的二进制程序、源代码文件和man手册页等相关文件的路径。

和find相比，whereis查找的速度非常快，这是因为linux系统会将 系统内的所有文件都记录在一个数据库文件中，当使用whereis和下面即将介绍的locate时，会从数据库中查找数据，而不是像find命令那样，通 过遍历硬盘来查找，效率自然会很高。 但是该数据库文件并不是实时更新，默认情况下时一星期更新一次，因此，我们在用whereis和locate 查找文件时，有时会找到已经被删除的数据，或者刚刚建立文件，却无法查找到，原因就是因为数据库文件没有被更新。

### 语法
```shell
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
```shell
[root@localhost ~]# whereis tomcat
tomcat:

[root@localhost ~]# whereis svn
svn: /usr/bin/svn /usr/local/svn /usr/share/man/man1/svn.1.gz
```
说明：tomcat没安装，找不出来，svn安装找出了很多相关文件

只将二进制文件查找出来 
```shell
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
```shell
locate passwd
```
搜索 etc 目录下所有以 sh 开头的文件 ：
```shell
locate /etc/sh
```
忽略大小写搜索当前用户目录下所有以 r 开头的文件 ：
```shell
locate -i ~/r
```

### 附加说明
- locate 与 find 不同: find 是去硬盘找，locate 只在 /var/lib/slocate 资料库中找。
- locate 的速度比 find 快，它并不是真的查找，而是查数据库，一般文件数据库在 /var/lib/slocate/slocate.db 中，所以 locate 的查找并不是实时的，而是以数据库的更新为准，一般是系统自己维护，也可以手工升级数据库 ，命令为：
```shell
updatedb
```

## nl
nl命令在linux系统中用来计算文件中行号。

nl可以将输出的文件内容自动的加上行号！其默认的结果与 cat -n 有点不太一样， nl 可以将行号做比较多的显示设计，包括位数与是否自动补齐 0 等等的功能。

### 实例
1. 实例一用 nl 列出 log.log 的内容命令：
```shell
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
```shell
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
```shell
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

## scp
Linux scp 命令用于 Linux 之间复制文件和目录。

scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。scp 是加密的，rcp 是不加密的，scp 是 rcp 的加强版。

### 实例
1. 从本地复制到远程
```shell
scp local_file remote_username@remote_ip:remote_folder 
或者 
scp local_file remote_username@remote_ip:remote_file 
或者 
scp local_file remote_ip:remote_folder 
或者 
scp local_file remote_ip:remote_file 
```
- 第1,2个指定了用户名，命令执行后需要再输入密码，第1个仅指定了远程的目录，文件名字不变，第2个指定了文件名；
- 第3,4个没有指定用户名，命令执行后需要输入用户名和密码，第3个仅指定了远程的目录，文件名字不变，第4个指定了文件名；
应用实例：
```shell
scp /home/space/music/1.mp3 root@www.runoob.com:/home/root/others/music 
scp /home/space/music/1.mp3 root@www.runoob.com:/home/root/others/music/001.mp3 
scp /home/space/music/1.mp3 www.runoob.com:/home/root/others/music 
scp /home/space/music/1.mp3 www.runoob.com:/home/root/others/music/001.mp3 
```

复制目录命令格式：
```shell
scp -r local_folder remote_username@remote_ip:remote_folder 
或者 
scp -r local_folder remote_ip:remote_folder 
```
- 第1个指定了用户名，命令执行后需要再输入密码；
- 第2个没有指定用户名，命令执行后需要输入用户名和密码；
应用实例：
```shell
scp -r /home/space/music/ root@www.runoob.com:/home/root/others/ 
scp -r /home/space/music/ www.runoob.com:/home/root/others/ 
```
上面命令将本地 music 目录复制到远程 others 目录下。

2. 从远程复制到本地
从远程复制到本地，只要将从本地复制到远程的命令的后2个参数调换顺序即可，如下实例
```shell
scp root@www.runoob.com:/home/root/others/music /home/space/music/1.mp3 
scp -r www.runoob.com:/home/root/others/ /home/space/music/
```
说明
- 如果远程服务器防火墙有为scp命令设置了指定的端口，我们需要使用 -P 参数来设置命令的端口号，命令格式如下：
```shell
#scp 命令使用端口号 4588
scp -P 4588 remote@www.runoob.com:/usr/local/sin.sh /home/administrator
```
- 使用scp命令要确保使用的用户具有可读取远程服务器相应文件的权限，否则scp命令是无法起作用的。

3. 其他
```shell
scp work@192.168.0.10:/home/work/source.txt /home/work/   #把192.168.0.10机器上的source.txt文件拷贝到本地的/home/work目录下
scp work@192.168.0.10:/home/work/source.txt work@192.168.0.11:/home/work/   #把192.168.0.10机器上的source.txt文件拷贝到192.168.0.11机器的/home/work目录下
```

## sort
Linux sort 命令用于将文本文件内容加以排序。

sort 可针对文本文件的内容，以行为单位来排序。

### 实例
在使用 sort 命令以默认的式对文件的行进行排序，使用的命令如下：
```shell
sort testfile 
```
sort 命令将以默认的方式将文本文件的第一列以 ASCII 码的次序排列，并将结果输出到标准输出。

使用 cat 命令显示 testfile 文件可知其原有的排序如下：
```shell
$ cat testfile      # testfile文件原有排序  
test 30  
Hello 95  
Linux 85 
```
使用 sort 命令重排后的结果如下：
```shell
$ sort testfile # 重排结果  
Hello 95  
Linux 85  
test 30 
```
使用 -k 参数设置对第二列的值进行重排，结果如下：
```shell
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
```shell
wc testfile 
```
先查看testfile文件的内容，可以看到：
```shell
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
```shell
$ wc testfile           # testfile文件的统计信息  
3 92 598 testfile       # testfile文件的行数为3、单词数92、字节数598 
```
其中，3 个数字分别表示testfile文件的行数、单词数，以及该文件的字节数。
如果想同时统计多个文件的信息，例如同时统计testfile、testfile_1、testfile_2，可使用如下命令：
```shell
wc testfile testfile_1 testfile_2   #统计三个文件的信息 
```
输出结果如下：
```shell
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
```shell
more -s testfile
```
从第 20 行开始显示 testfile 之文档内容。
```shell
more +20 testfile
```

## less
less 与 more 类似，less 可以随意浏览文件，支持翻页和搜索，支持向上翻页和向下翻页。

### 实例
1、查看文件
```shell
less log2013.log
```
2、ps查看进程信息并通过less分页显示
```shell
ps -ef |less
```
3、查看命令历史使用记录并通过less分页显示
```shell
[root@localhost test]# history | less
22  scp -r tomcat6.0.32 root@192.168.120.203:/opt/soft
23  cd ..
24  scp -r web root@192.168.120.203:/opt/
25  cd soft
26  ls
……省略……
```
4、浏览多个文件
```shell
less log2013.log log2014.log
```
## head
head 命令可用于查看文件的开头部分的内容，有一个常用的参数 -n 用于显示行数，默认为 10，即显示 10 行的内容。

### 实例
要显示 runoob_notes.log 文件的开头 10 行，请输入以下命令：
```shell
head runoob_notes.log
```
显示 notes.log 文件的开头 5 行，请输入以下命令：
```shell
head -n 5 runoob_notes.log
```
显示文件前 20 个字节:
```shell
head -c 20 runoob_notes.log
```

## tail
tail 命令可用于查看文件的内容，有一个常用的参数 -f 常用于查阅正在改变的日志文件。

`tail -f filename` 会把 filename 文件里的最尾部的内容显示在屏幕上，并且不断刷新，只要 filename 更新就可以看到最新的文件内容。

### 实例
要显示 notes.log 文件的最后 10 行，请输入以下命令：
```shell
tail notes.log         # 默认显示最后 10 行
```
要跟踪名为 notes.log 的文件的增长情况，请输入以下命令：
```shell
tail -f notes.log
```
此命令显示 notes.log 文件的最后 10 行。当将某些行添加至 notes.log 文件时，tail 命令会继续显示这些行。 显示一直继续，直到您按下（Ctrl-C）组合键停止显示。
显示文件 notes.log 的内容，从第 20 行至文件末尾:
```shell
tail -n +20 notes.log
```
显示文件 notes.log 的最后 10 个字符:
```shell
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
```shell
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

# 用户相关命令
## id命令
inux id命令用于显示用户的ID，以及所属群组的ID。

### 例子
```shell
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
```shell
#usermod -G staff newuser2
```

2. 修改 newuser 的用户名为 newuser1
```shell
#usermod -l newuser1 newuser
```

## 添加普通用户到 sudo 组
正常电脑使用或者服务器维护中，我们一般不直接使用 root 账号，如果你现在只有一个 root 账号可以通过下面命令新建一个用户：
```shell
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
```shell
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
```shell
wget http://www.coonote.com/testfile.zip
```
以下的例子是从网络下载一个文件并保存在当前目录，在下载的过程中会显示进度条，包含（下载完成百分比，已经下载的字节，当前下载速度，剩余下载时间）。

2. 下载并以不同的文件名保存
```shell
wget -O wordpress.zip http://www.coonote.com/download.aspx?id=1080
```
wget默认会以最后一个符合/的后面的字符来命令，对于动态链接的下载通常文件名会不正确。

错误：下面的例子会下载一个文件并以名称download.aspx?id=1080保存:
```shell
wget http://www.coonote.com/download?id=1
```
即使下载的文件是zip格式，它仍然以download.php?id=1080命令。

正确：为了解决这个问题，我们可以使用参数-O来指定一个文件名：
```shell
wget -O wordpress.zip http://www.coonote.com/download.aspx?id=1080
```

3. 测试下载链接
当你打算进行定时下载，你应该在预定时间测试下载链接是否有效。我们可以增加--spider参数进行检查。
```shell
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
```shell
wget -i filelist.txt
```
首先，保存一份下载链接文件：
```shell
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

```shell
curl URL --silent
```

这条命令是将下载文件输出到终端，所有下载的数据都被写入到stdout。

使用选项-O将下载的数据写入到文件，必须使用文件的绝对地址：

```shell
curl https://www.coonote.com/robot.txt --silent -O

```

选项-o将下载数据写入到指定名称的文件中，并使用--progress显示进度条：

```shell
curl https://www.coonote.com/robot.txt -o filename.iso --progress
######################################### 100.0%
```

#### 快速将请求导成curl格式

**方式一：在浏览器中**

![](https://raw.githubusercontent.com/NaisWang/images/master/Screen%20Shot%202022-04-17%20at%2015.30.03.jpg)

**方式二：在postman中**

![](https://raw.githubusercontent.com/NaisWang/images/master/Screen%20Shot%202022-04-17%20at%2015.32.41.jpg)


## SSH
### ssh基础使用
ssh客户端是一种使用Secure Shell(ssh)协议连接到运行了ssh服务端的远程服务器上。ssh是目前较可靠，专为远程登录会话和其他网络服务提供安全性的协议。它有如下优点：
- 有效防止远程管理过程中的信息泄漏
- 传输 数据加密，能够防止DNS和IP欺骗
- 传输 数据压缩，加快传输速度

OpenSSH 是 SSH协议的免费开源实现。OpenSSH提供了服务端程序(openssh-server)和客户端工具(openssh-client)。Mac和Linux中默认已安装ssh客户端，可直接在终端中使用ssh命令。Windows则需手动安装ssh客户端，较常用的Windows SSH客户端有PuTTY和XShell。

OpenSSH服务端常用命令
```shell
# 安装服务端/客户端(Ubuntu)
$ sudo apt install openssh-server/openssh-client

# 查看ssh服务是否开启
$ netstat -tlp | grep ssh

# 启动/停止/重启 ssh服务
$ sudo /etc/init.d/ssh start/stop/restart
```

```shell
# 命令格式
$ ssh [-options] [user@hostname]
```
- -p: 指定ssh端口号,默认端口为22
- -i: 使用指定私钥文件连接服务器(免密登录)
- user远程服务器登录的用户名，默认为当前用户
- hostname远程服务器地址。可以是IP/域名/别名
- exit或logout命令均可退出当前登录

```shell
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
```shell
# 命令格式
$ ssh-keygen [-options]
```
|options|含义|
|--|--|
|-t	|指定加密类型,默认为非对称加密(rsa), 所有可选项[dsa,ecdsa,ed25519,rsa]|
|-f	|密钥文件名。|
|-C	|注释，将附加在密钥文件尾部|

远程管理命令(如ssh,scp等)每次都需要提供用户密码保证安全。除此之外，我们也可配置使指定加密算法验证密钥文件的方式，避免每次输入密码。配置免密登录后，ssh连接和scp等远程管理命令都不需要再输密码。生成密钥时若指定了文件名，连接服务器时需要通过-i指定要验证的密钥文件,形如：ssh -i file user@host。默认文件名则可省略。默认配置只需以下两步：
```shell
# 客户端生成密钥对
$ ssh-keygen

# 上传公钥到服务器
$ ssh-copy-id user@hostname   # 文件会自动上传为服务器特定文件 ～/.ssh/authorized_keys
```
完成以上步骤后直接使用ssh ColinUbuntu即可登录，服务器地址和密码均不用录入。


#### 免密钥文件登录
出于安全考虑，大部分服务器提供商如要求使用密钥文件进行远程登录，如GCP和AWS。下面我们以GCP为例来看如何简化连接操作,这搞起来吧...

##### 生成密钥对
```shell
$ ssh-keygen -t rsa -f ~/.ssh/[KEY_FILENAME] -C [USERNAME]
$ chmod 400 ~/.ssh/[KEY_FILENAME]
```

##### 上传公钥
在Compute Engine页面左侧菜单找到元数据,将上一步生成的公钥文件(KEY_FILENAME_pub)内容添加到SSH密钥中即可。

![](https://raw.githubusercontent.com/NaisWang/images/master/20211221181658.png)

##### 连接GCP
使用以下命令登录即可
```shell
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
```shell
# 后台运行ssh-agent
$ eval "$(ssh-agent -s)"
# 添加密钥到ssh-agent
$ ssh-add -K ~/.ssh/gcp
```
完成以上配置后，连接服务器只需使用 ssh tu即可。

# 管道相关命令
## xargs
- xargs（英文全拼： eXtended ARGuments）是给命令传递参数的一个过滤器，也是组合多个命令的一个工具。
- xargs 可以将管道或标准输入（stdin）数据转换成命令行参数，也能够从文件的输出中读取数据。
- xargs 也可以将单行或多行文本输入转换为其他格式，例如多行变单行，单行变多行。
- xargs 默认的命令是 echo，这意味着通过管道传递给 xargs 的输入将会包含换行和空白，不过通过 xargs 的处理，换行和空白将被空格取代。
- xargs 是一个强有力的命令，它能够捕获一个命令的输出，然后传递给另外一个命令。
- 之所以能用到这个命令，关键是由于很多命令不支持|管道来传递参数，而日常工作中有有这个必要，所以就有了 xargs 命令，例如：
```shell
find /sbin -perm +700 |ls -l       #这个命令是错误的
find /sbin -perm +700 |xargs ls -l   #这样才是正确的
```
xargs 一般是和管道一起使用。


# shell脚本
## $(),``, ${}
### $( )与``
在bash中，$( )与``（反引号）都是用来作命令替换的。

命令替换与变量替换差不多，都是用来重组命令行的，先完成引号里的命令行，然后将其结果替换出来，再重组成新的命令行。
```shell
[root@localhost ~]# echo today is $(date "+%Y-%m-%d")
today is 2017-11-07
[root@localhost ~]# echo today is `date "+%Y-%m-%d"`
today is 2017-11-07
```
$( )与｀｀在操作上，这两者都是达到相应的效果，但是建议使用$( )，因为｀｀很容易与''搞混乱，尤其对初学者来说，而$( )比较直观。

最后，$( )的弊端是，并不是所有的类unix系统都支持这种方式，但反引号是肯定支持的。
```shell
[root@localhost ~]#  echo Linux `echo Shell `echo today is `date "+%Y-%m-%d"```
Linux Shellecho today is 2017-11-07     #过多使用``会有问题
[root@localhost ~]# echo Linux `echo Shell $(echo today is $(date "+%Y-%m-%d"))`
Linux Shell today is 2017-11-07    ``和$()混合使用
[root@localhost ~]# echo Linux $(echo Shell $(echo today is $(date "+%Y-%m-%d")))
Linux Shell today is 2017-11-07    #多个$()同时使用也不会有问题
```

### ${ }变量替换
一般情况下，$var与${var}是没有区别的，但是用${ }会比较精确的界定变量名称的范围
```shell
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
```shell
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
```shell
[root@localhost ~]# rpm -ivh a.rpm b.rpm c.rpm
```

### RPM包的升级
使用如下命令即可实现 RPM 包的升级：
```shell
[root@localhost ~]# rpm -Uvh 包全名
-U（大写）选项的含义是：如果该软件没安装过则直接安装；若没安装则升级至最新版本。

[root@localhost ~]# rpm -Fvh 包全名
-F（大写）选项的含义是：如果该软件没有安装，则不会安装，必须安装有较低版本才能升级。
```

### RPM包的卸载
RPM 软件包的卸载很简单，使用如下命令即可：
```shell
[root@localhost ~]# rpm -e 包名
```
`-e`选项表示卸载，也就是 erase 的首字母。

**RPM 软件包的卸载要考虑包之间的依赖性**。例如，我们mod_ssl软件包依赖httpd软件包，那么在卸载时，就必须先卸载 mod_ssl，然后卸载 httpd，否则会报错。
软件包卸载和拆除大楼是一样的，本来先盖的 2 楼，后盖的 3 楼，那么拆楼时一定要先拆除 3 楼。

如果卸载 RPM 软件不考虑依赖性，执行卸载命令会包依赖性错误，例如：
```shell
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
```shell
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
```shell
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
```shell
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
```shell
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
```shell
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
```shell
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```
2. 编辑源列表文件
```shell
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
:!cmd
不退出vim 执行命令 cmd

:r !cmd
不退出vim执行命令cmd,并将cmd的输出内容插入当前文本中。

:shell
切换到shell里（此时并没有退出vim，可以理解成vim转入后台），你可以在shell中做任何操作，退出shell（比如用exit）后，会切换回原来的vim中

## 信息查看
":messages" 命令可以查看以前给出的消息

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
Vim normal命令的使用形式为`:{range}norm[al][!] {commands}`，表示在 `{range}`指定的范围内的每行执行若干 普通模式命令 `{commands}`。`{commands}` 不能以空格开始，除非在空格前面加个计数 1。

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
