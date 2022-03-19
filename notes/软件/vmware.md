# 虚拟机安装
在虚拟机上装系统就分为2步：买电脑与装系统
其中买电脑就是硬件方面，安装个虚拟机（vmware），然后对其进行硬件配置

## 买电脑
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129172910.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129173415.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129173456.png"/>

## 装系统
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129173620.png"/>

然后点击启动虚拟机，来进行安装系统，
如果一启动虚拟机就报如下错误：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129173655.png"/>

报如上错误的原因是，真实机没有开启虚拟化设置
解决方法：进入bios，然后进行如下设置
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129173720.png"/>

问题解决后，然后进行系统安装
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129174142.png"/>

PS：在VMware中会遇到2个名称
1. 虚拟机名：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129174554.png"/>

2. 主机名
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129174632.png"/>

注：
可以通过命令hostname的方式来查看主机名
一定要注意：主机名中不要含有特殊字符，例如：‘_', 因为主机名就类似于url，而url中有很多保留字

在ubuntu下修该主机名
1. 临时生效

```
1. root@jiqing:~# hostname jq
2. root@jiqing:~# hostname
3. jq
```
重新打开一个窗口生效。
2. 永久生效
ubuntu下：
```
1、root@jiqing:~# vim /etc/hostname
2、修改/etc/cloud/cloud.cfg
sudo nano /etc/cloud/cloud.cfg
This will cause the set+update hostname module to not operate (if true)
preserve_hostname: true  #这里是将false改成true
```
Centos下：
```
 vim    /etc/sysconfig/network
  注：修改后要重启计算机才能生效
  命令： 重启：reboot        关机：  halt
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129175108.png"/>

<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129175159.png"/>

如果启动虚拟机时，出现如下问题：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129190920.png"/>

解决方法：
打开Windows powershell（管理员）
关闭：bcdedit /set hypervisorlaunchtype off
然后重启电脑即可

开启：bcdedit /set hypervisorlaunchtype auto

# VMware设置虚拟机与物理主机处于同一网段
在使用VMware的过程中，有时候需要让虚拟机与物理主机处于同一个局域网段，这时候就需要用桥接模式。
方法：
1、打开VMware上方菜单栏的 编辑→虚拟网络编辑器
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191129201623.png"/>

然后将虚拟中的网络模式改成桥接模式即可

# vmware虚拟机三种网络模式、桥接、NAT、仅主机
vmware为我们提供了三种网络工作模式，它们分别是：Bridged（桥接模式）、NAT（网络地址转换模式）、Host-Only（仅主机模式）。

打开vmware虚拟机，我们可以在选项栏的“编辑”下的“虚拟网络编辑器”中看到VMnet0（桥接模式）、VMnet1（仅主机模式）、VMnet8（NAT模式），那么这些都是有什么作用呢？其实，我们现在看到的VMnet0表示的是用于桥接模式下的虚拟交换机；VMnet1表示的是用于仅主机模式下的虚拟交换机；VMnet8表示的是用于NAT模式下的虚拟交换机。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204130524.png"/>
同时，在主机上对应的有VMware Network Adapter VMnet1和VMware Network Adapter VMnet8两块虚拟网卡，它们分别作用于仅主机模式与NAT模式下。在“网络连接”中我们可以看到这两块虚拟网卡，如果将这两块卸载了，可以在vmware的“编辑”下的“虚拟网络编辑器”中点击“还原默认设置”，可重新将虚拟网卡还原。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204130558.png"/>
小伙伴看到这里，肯定有疑问，为什么在真机上没有VMware Network Adapter VMnet0虚拟网卡呢？那么接下来，我们就一起来看一下这是为什么。

## 1. Bridged(桥接模式)
什么是桥接模式？桥接模式就是将主机网卡与虚拟机虚拟的网卡利用虚拟网桥进行通信。在桥接的作用下，类似于把物理主机虚拟为一个交换机，所有桥接设置的虚拟机连接到这个交换机的一个接口上，物理主机也同样插在这个交换机当中，所以所有桥接下的网卡与网卡都是交换模式的，相互可以访问而不干扰。在桥接模式下，虚拟机ip地址需要与主机在同一个网段，如果需要联网，则网关与DNS需要与主机网卡一致。其网络结构如下图所示：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204130709.png"/>
接下来，我们就来实际操作，如何设置桥接模式。

首先，安装完系统之后，在开启系统之前，点击“编辑虚拟机设置”来设置网卡模式。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204130734.png"/>
点击“网络适配器”，选择“桥接模式”，然后“确定”
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204130801.png"/>
在进入系统之前，我们先确认一下主机的ip地址、网关、DNS等信息。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204130856.png"/>
然后，进入系统编辑网卡配置文件，命令为vi /etc/sysconfig/network-scripts/ifcfg-eth0
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204130940.png"/>
添加内容如下：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131004.png"/>
编辑完成，保存退出，然后重启虚拟机网卡，使用ping命令ping外网ip，测试能否联网。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131030.png"/>
能ping通外网ip，证明桥接模式设置成功。

那主机与虚拟机之间的通信是否正常呢？我们就用远程工具来测试一下。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131058.png"/>
主机与虚拟机通信正常。

这就是桥接模式的设置步骤，相信大家应该学会了如何去设置桥接模式了。桥接模式配置简单，但如果你的网络环境是ip资源很缺少或对ip管理比较严格的话，那桥接模式就不太适用了。如果真是这种情况的话，我们该如何解决呢？接下来，我们就来认识vmware的另一种网络模式：NAT模式。

## 2. NAT（地址转换模式）
刚刚我们说到，如果你的网络ip资源紧缺，但是你又希望你的虚拟机能够联网，这时候NAT模式是最好的选择。NAT模式借助虚拟NAT设备和虚拟DHCP服务器，使得虚拟机可以联网。虚拟机的IP只需要配置NAT网段中的IP，访问外部host可以通过宿主主机IP访问，<font color="red">它不需要有外部网络独立的IP</font>，其网络结构如下图所示：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131141.png"/>
在NAT模式中，主机网卡直接与虚拟NAT设备相连，然后虚拟NAT设备与虚拟DHCP服务器一起连接在虚拟交换机VMnet8上，这样就实现了虚拟机联网。那么我们会觉得很奇怪，为什么需要虚拟网卡VMware Network Adapter VMnet8呢？原来我们的VMware Network Adapter VMnet8虚拟网卡主要是为了实现主机与虚拟机之间的通信。在之后的设置步骤中，我们可以加以验证。
<font color="red">注： 如果真机使用的是WIFI， 虚拟机使用NAT模式时， 则我们需要打开真机的无线网卡网络共享， 否则， 虚拟机无法通信</font>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191217200115.png"/>
首先，设置虚拟机中NAT模式的选项，打开vmware，点击“编辑”下的“虚拟网络编辑器”，设置NAT参数及DHCP参数。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191218191141.png"/>
将虚拟机的网络连接模式修改成NAT模式，点击“编辑虚拟机设置”。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131258.png"/>
点击“网络适配器”，选择“NAT模式”
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131325.png"/>
然后开机启动系统，编辑网卡配置文件，命令为vi /etc/sysconfig/network-scripts/ifcfg-eth0
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131346.png"/>
具体配置如下：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131408.png"/>
编辑完成，保存退出，然后重启虚拟机网卡，动态获取ip地址，使用ping命令ping外网ip，测试能否联网。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131432.png"/>
之前，我们说过VMware Network Adapter VMnet8虚拟网卡的作用，那我们现在就来测试一下。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131458.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131514.png"/>
如此看来，虚拟机能联通外网，确实不是通过VMware Network Adapter VMnet8虚拟网卡，那么为什么要有这块虚拟网卡呢？

之前我们就说VMware Network Adapter VMnet8的作用是主机与虚拟机之间的通信，接下来，我们就用远程连接工具来测试一下。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131533.png"/>
然后，将VMware Network Adapter VMnet8启用之后，发现远程工具可以连接上虚拟机了。

那么，这就是NAT模式，利用虚拟的NAT设备以及虚拟DHCP服务器来使虚拟机连接外网，而VMware Network Adapter VMnet8虚拟网卡是用来与虚拟机通信的。

## 3. Host-Only（仅主机模式）
Host-Only模式其实就是NAT模式去除了虚拟NAT设备，然后使用VMware Network Adapter VMnet1虚拟网卡连接VMnet1虚拟交换机来与虚拟机通信的，Host-Only模式将虚拟机与外网隔开，使得虚拟机成为一个独立的系统，只与主机相互通讯。其网络结构如下图所示：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131608.png"/>
通过上图，我们可以发现，如果要使得虚拟机能联网，我们可以将主机网卡共享给VMware Network Adapter VMnet1网卡，从而达到虚拟机联网的目的。接下来，我们就来测试一下。

首先设置“虚拟网络编辑器”，可以设置DHCP的起始范围。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131627.png"/>
设置虚拟机为Host-Only模式。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131647.png"/>
开机启动系统，然G后设置网卡文件。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131704.png"/>
保存退出，然后重启网卡，利用远程工具测试能否与主机通信。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131728.png"/>
主机与虚拟机之间可以通信，现在设置虚拟机联通外网。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131820.png"/>
我们可以看到上图有一个提示，强制将VMware Network Adapter VMnet1的ip设置成192.168.137.1，那么接下来，我们就要将虚拟机的DHCP的子网和起始地址进行修改，点击“虚拟网络编辑器”
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131838.png"/>
重新配置网卡，将VMware Network Adapter VMnet1虚拟网卡作为虚拟机的路由。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131857.png"/>
重启网卡，然后通过 远程工具测试能否联通外网以及与主机通信。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191204131917.png"/>
测试结果证明可以使得虚拟机连接外网。
以上就是关于vmware三种网络模式的工作原理及配置详解。

# This Virtual Machine AppearstobBe in Use错误
When you get the following error on VMware, try to do the following workaround.

Error:
```
This virtual machine appears to be in use.

If this virtual machine is not in use, press the "Take Ownership"  button to obtain ownership of it. Otherwise, press the 'Cancel' button to avoid damaging it.
```

Solution:
```
Turn off the VM.
Close VMware Workstation.
Open the folder where VMware files are located indicated in the error message.
Remove any .lck or .lock files.
Run VMware Workstation.
Start the VM.
Karim BuzdarVirt
```
