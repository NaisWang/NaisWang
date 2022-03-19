# 认识Wireshark界面
## 欢迎界面
打开软件，默认进入软件欢迎页面，如下图所示：
![](https://gitee.com/NaisWang/images/raw/master/img/20211021115509.png)
界面列出了当前可以选择的网络形式。如果当前电脑用的有线，则选择以太网；如果是用的WiFi，列表中会出现WiFi，选择即可。

## 主界面
选择网络形式之后，打开的主界面就自动抓取从本机ip发出去或者接受到的网络包。
![](https://gitee.com/NaisWang/images/raw/master/img/20211021115536.png)

整体来说，界面主要分为以下几部分：
- 菜单栏：Wireshark的标准菜单栏。 
- 工具栏：常用功能的快捷图标按钮，提供快速访问菜单中经常用到的项目的功能。
- 过滤器：提供处理当前显示过滤得方法。
- Packet List面板：显示每个数据帧的摘要。这里采用表格的形式列出了当前捕获文件中的所有数据包，其中包括了数据包序号、数据包捕获的相对时间、数据包的源地址和目标地址、数据包的协议以及在数据包中找到的概况信息等。 
- Packet Details面板：分析数据包的详细信息。这个面板分层次地显示了一个数据包中的内容，并且可以通过展开或是收缩来显示这个数据包中所捕获的全部内容。
- Packet Bytes面板：以十六进制和ASCII码的形式显示数据包的内容。这里显 示了一个数据包未经处理的原始样子，也就是在链路上传播时的样子。 
- 状态栏：包含有专家信息、注释、包的数量和Profile。

### 过滤器
当进行数据包捕获时，只有那些满足给定的包含/排除表达式的数据包会被捕获。
常见的过滤条件有：
- 过滤源ip、目的ip——如查找目的地址为192.168.101.8的包，ip.dst==192.168.101.8；查找源地址为ip.src==1.1.1.1。
- 端口过滤——如过滤80端口，在Filter中输入，tcp.port==80，这条规则是把源端口和目的端口为80的都过滤出来。使用tcp.dstport==80只过滤目的端口为80的，tcp.srcport==80只过滤源端口为80的包。
- 协议过滤——比较简单，直接在Filter框中直接输入协议名即可，如过滤HTTP的协议
- http模式过滤——如过滤get包，http.request.method=="GET",过滤post包，http.request.method=="POST"
- 连接符and——过滤两种条件时，使用and连接，如过滤ip为192.168.101.8并且为http协议的，ip.src==192.168.101.8 and http。

### Packet List面板
![](https://gitee.com/NaisWang/images/raw/master/img/20211021115650.png)
列表中的每行显示捕捉文件的一个包。如果您选择其中一行，该包得更多情况会显示在"Packet Detail/包详情"，"Packet Byte/包字节"面板。
Packet List面板中默认包含了几列，如No、Time、Source和Destination等。
- No. 包的编号，编号不会发生改变，即使进行了过滤也同样如此
- Time 包的时间戳。包时间戳的格式可以自行设置
- Source 显示包的源地址。
- Destination 显示包的目标地址。
- Protocal 显示包的协议类型的简写
- Info 包内容的附加信息

### Packet Details面板
![](https://gitee.com/NaisWang/images/raw/master/img/20211021115730.png)

该面板显示包列表面板选中包的协议及协议字段，协议及字段以树状方式组织。可以展开或折叠进行查看。

### Packet Bytes面板
![](https://gitee.com/NaisWang/images/raw/master/img/20211021115754.png)

通常在16进制转储形式中，左侧显示包数据偏移量，中间栏以16进制表示，右侧显示为对应的ASCII字符。



