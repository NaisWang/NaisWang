---
title: Nmap的使用
date: 2019/11/29
update: {{ date }}
categories:
 - net
---
# nmap介绍
Nmap是一款开源、免费的网络探测、安全审计的工具。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926093208.png"/>
nmap官网下载： http://nmap.org/

# Nmap列举远程机器开放的端口
## 原理
Nmap扫描原理示意图
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926094216.png"/>

## Nmap列举远程机器开放的端口
1. 使用nmap scanme.nmap.org来列举该站点的端口信息，以下给出zenamp下扫描结果，也可以是使用命令行下的nmap来探测。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926094426.png"/>
2. nmap进行探测之前要把域名通过DNS服务器解析为IP地址，我们也可以使用指定的DNS服务器进行解析。使用--dns-servers参数来指定。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926122709.png"/>
其中8.8.8.8为谷歌的DNS
3. 如果有些网站打得开,却ping不通,这很有可能是网站服务器为了防止DoS攻击，通常在防火墙里设置拦截ICMP报文，而ping报文正是ICMP报文的一种，当然ping不通了 网站却打得开
对于已经知道主机存活或者防火墙开启的机器，可以使用-Pn参数来停止探测之前的ICMP请求。已达到不触发防火墙安全机制。

<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926122927.png"/>
4. 对于默认的端口范围，并不能满足日常工作需要。可以使用-p m-n来指定探测端口范围为m-n之间的所有端口。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926123049.png"/> 
## 端口状态
- Open表示端口处于开放状态；
- Closed 表示端口处于关闭状态；
- Filterd 表示端口处于过滤无法收到返回的probe状态；
- UnFilterd 表示端口收到返回的probe，但是无法确认；
- Opend/UnFilterd 表示端口处于开放或者是过滤状态；
- Closed/UnFilterd 表示端口处于关闭或者未过滤状态。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926123316.png"/>

## Nmap扫描技术查看
在命令行中，输入nmap -h来查看nmap自带的帮助信息。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926123623.png"/>

# 识别目标机器上的服务的指纹
## 服务指纹
为了确保有一个成功的渗透测试或网络设备监控，必须需要知道目标系统中服务的指纹信息。服务指纹信息包括服务端口、服务名和版本等。
通过分析目标往Nmap发送的数据包中某些协议标记、选项和数据，我们可以推断发送这些数据包的操作系统等。
nmap通过向目标主机发送多个UDP与TCP数据包并分析其响应来进行操作系统指纹识别工作。
## Nmap识别服务指纹
使用命令nmap -sV IP地址 来识别目标机器的服务信息。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926124048.png"/>
## Nmap侵略性的探测
1. 使用命令`nmap -A -v -T4 IP地址`来探测目标机器的操作系统、服务等信息。
其中-A: 表示namp使用侵略性的探测
-v: 表示持续输出返回的解析， 如果不加这个参数， 那就只能通过按回车键来查看返回的解析
-T4: 表示加快速度来进行探测，  其中的值为1~5
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926124540.png"/>
2. 使用`nmap -sC -sV -O IP地址`来探测目标机器的操作系统、服务等信息。
其中sc参数表示使用Nmap脚本进行探测，sV表示探测目标机器上的服务信息，O表示探测目标机器的操作系统信息。-sC: equivalent to --script=default
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926125002.png"/>

# 发现局域网中存活主机
## 主机发现
一个局域网中肯定是连接着多台设备，那么我们如何获取哪些设备正在开机状态呢？
使用ping ip地址进行探测，但是如果一个网络很大的情况下，这样的手工探测显得很费劲。

可以使用不同的工具来进行批量探测，在探测之前需要明白CIDR的含义。
CIDRCIDR（无类别域间路由，Classless Inter-Domain Routing），可以快速表示一个网络。
比如：172.16.1.1/24表示在172.168.1.1-172.16.1.255之间的所有主机IP地址。
## Nmap主机发现
1. 使用Nmap命令：`nmap -sP CIDR`对该网络中所有主机进行ping扫描，以探测主机存活性。扫描过程中使用了TCP SYN扫描、ICMP echo Request来探测主机存活。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926125611.png"/>
2. 使用Nmap命令：`nmap -sn CIDR`对该网络中所有主机进行ping扫描，以探测主机存活性。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926125836.png"/>
## 结果输出
使用Nmap命令：`nmap -sn CIDR -oX test.xml`对该网络中所有主机进行ping扫描，以探测主机存活性。 同时将结果输出到test.xml文件中，以便后续使用。

# 端口探测技巧
## 实际场景
在实际环境中，当系统管理员对设备进行管理时，或者渗透测试人员对设备进行检测时，并不一定对所有的服务进行操作。极有可能是对某个或某个范围内的服务进行检测。
如果对所有服务进行探测，那么就会出现耗时长，费力不讨好的情况。针对这样的情况，我们很有必要了解如何使用Nmap来更加灵活的进行服务探测，避免全端口探测对服务器造成压力。
## 端口探测技巧
对某个端口进行探测`nmap -p80 scanme.nmap.org`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926130350.png"/>
对某几个端口进行探测`nmap -p8e,135 scanme.nmap.org`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926130500.png"/>
对某个范围端口进行探测`nmap -p1-100 scanme.nmap.org`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926130607.png"/>
对所有端口进行探测`nmap -p- scanme.nmap.org`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926130750.png"/> 
指定协议探测端口`nmap -p T:25,U:53 scanme.nmap.org`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926130905.png"/>
通过协议名来扫描端口`nmap -p smtp scanme.nmap.org`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926131130.png"/>
通过名称范围扫描`nmap -p s* scanme.nmap.org`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926131324.png"/>
扫描注册在nmap中的端口`nmap -p [1~65535] scanme.nmap.org`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926131422.png"/>

# NSE脚本使用
## NSE介绍
NSE（Nmap Script Engine）Nmap脚本引擎，内置很多可以用来扫描的、针对特定任务的脚本。
通过NSE可以不断拓展Nmap的扫描策略，加强Nmap的功能。
Nmap中使用--script参数来指定调用的脚本，并且脚本存储在Nmap安装路径下的script文件央下，对于kali Linux存储在/usr/share/nmap/script/下。
## NSE的使用
1. 使用Nmap探测Web服务的title信息， `nmap --script 脚本名称 目标`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926131745.png"/>
以上通过Nmap使用http-title脚本进行探测，还可以使用其他脚本进行探测。目前为止可以用的有589个脚本，每个脚本都有其独特的作用。
2. 使用Nmap探测http服务的http头 ` nmap --script http-headers 目标`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926131945.png"/>
3. 对于目标使用多个分类脚本进行探测， 可以更快的找到目标的信息与弱点
使用Namp中的漏洞分类脚本对目标进行探测，使用命令如下：`nmap -sV --script vuln 目标`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926134716.png"/>
4. 使用Nmap中发现和版本信息分类进行探测， 使用命令如下：`nmap -sV --script="version, discovery" 目标`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926134935.png"/>
5. 使用Nmap除了exploit分类之外的其他分类进行探测，使用命令如下：`nmap -sV --script="not exploit" 目标`
6. 使用Nmap中http*的脚本，但是除了（http-brute和http-slowlors），使用命令如下：
`nmap -sV --script"(http*) and not(http-slowlors and http-brute)" 目标`
## NSE调试功能的使用
使用Nmap中exploit，但是在使用的同时开启调试模式。使用命令如下：
`nmap -sV --script exploit -d 3--script-trace 目标`
注意：-d（debug 范围e～9）`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926135410.png"/>

## NSE参数的使用
使用nmap的http-title脚本，并且指定使用对应的User-Agent。命令如下：
`nmap -sV --script http-title --script-args http.useragent="Mozilla 999" <target>`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926135705.png"/>

## NSE更新
`nmap --script-updatedb`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926135802.png"/>
## NSE脚本分类
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926135947.png"/>

# 使用特定网卡进行探测
## 情景介绍
Nmap是一款可拓展性强的工具，并且有些NSE脚本支持嗅探。但是这种功能需要网卡支持混杂模式才可以。或者当计算机上有两张网卡，并且两张网卡对应的不同网络。
Nmap中提供了切换使用特定网卡进行探测的参数-e

## 指定网卡进行探测
1. 使用Nmap命令： `nmap -e interface CIDR`
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926140222.png"/>

2. 查看当前window下的网卡接口
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926142032.png"/>


# 对比扫描结果ndiff
## 情景介绍
对某个网路进行探测的时候，有可能之前有探测过的结果，现在探测过后，需要对之前的结果与现在的结果来对比，找到两次不同点。
监视网络变化，达到网络监控的目的。
## ndiff介绍
在Nmap整个工程中，除了主要的nmap工具之外，还包括很多其他工具。如接下来要使用到的ndif工具。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926140545.png"/>
## 比较Nmap两次扫描结果
使用命令： `ndiff.exe File1 File2`
（File1和File2是Nmap扫描结果的xml格式。-oX）
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926140857.png"/>

# 可视化Nmap的使用
## 可视化Nmap(Zenmap)介绍
-Nmap命令参数复杂，组合类型多种多样，如果使用命令行类型的Nmap需要记忆大量命令，对于网络管理员和渗透测试者都是一项艰巨的任务。但是如果使用可视化Nmap（Zenmap），那么就不存在这样的问题。
在安装Nmap的同时，会自动安装可视化Nmap（Zenmap），可以在安装目录中找到。
## Zenmap的使用
1. 配置扫描策略
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20190926141250.png"/>
