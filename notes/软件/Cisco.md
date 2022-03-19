# 1. 模式转换命令
1. 用户模式----特权模式,使用命令`enable`, 简写: `en`
用户模式:查看初始化的信息. 终端显示为： `Switch>`
特权模式:查看所有信息、调试、保存配置信息. 终端显示为:`Switch#`
在该模式下可以使用show、clear、ping等命令

2. 特权模式----全局配置模式,使用命令`config t`, 简写: `conf t`
全局配置模式：配置所有信息、针对整个路由器或交换机的所有接口. 终端显示为:`Switch(config)#`

3. 全局配置模式----接口模式,
对单个接口进行操作：
&nbsp;&nbsp;使用命令`interface+接口类型+接口号`, interface可以简写成`int` 终端显示为:`Switch(config-if)#`
对多个接口进行操作：
&nbsp;&nbsp;使用命令`interface range +接口类型+访问`， 例如：`Switch(config)#interface range fastethernet 0/4 - 6` 终端显示为：`Switch(config-if-range)#`
接口模式：针对某一个接口的配置

4. 全局配置模式----VLAN模式,使用命令`vlan+vlan的id` ， 如果该id没有，则会自动创建
VLAN模式： 针对某一个VLAN ID进行配置。 终端显示： `Switch(config-vlan)#`

5. 全局配置模式----线控模式,使用命令`line+接口类型+接口号`
线控模式：对路由器进行控制的接口配置

退回当前模式： 使用`exit`命令
退回到特权模式： 使用`end`命令

# 2. 基本配置命令
## 2.1 三层交换机配置命令
```
Switch#show mac-a    -->查看交换表
Switch#clear mac-a   -->清空交换表
Switch(config)#no spanning-tree vlan 1  -->关闭交换机中的生成树协议STP

# 配置端口VLAN
Switch(config)#vlan 3           -->对vlan id为3的vlan进行操作， 由于没有id为3的vlan，所以会自动创建
Switch(config-vlan)#name Vlan3  -->将其命名为Vlan3
Switch#show vlan brief          -->查看vlan信息

Switch(config)#interface range fastethernet 0/4 - 6   --> 对接口为fastethernet类型的0/4都0/6的端口进行配置
Switch(config-if-range)#switchport mode access        --> 切换这个端口的模式为Access模式
Switch(config-if-range)#switchport access vlan 2      --> 将这些端口的Vlan ID设置为2
```

## 2.2 路由器配置命令
```
Router#show arp  -->查看arp表
Router#clear arp  -->清空arp表

路由信息协议 RIP
Router(config)# router rip
Router(config-router)# network <直接相连的要用 rip 协议的有类别网络号>
Router# show ip protocols
Router# show ip route
Router# debug ip rip

Router(config)#int g0/0/0
Router(config-if)#ip add 10.0.0.2 255.0.0.0
Router(config-if)#no shut

内部路由选择协议
*使用 router 和 network 命令
Router(config)# router <路由协议 rip | igrp | eigrp | ospf | is-is 等> [自主系统号]
Router(config-router)# network <直接相连的要用此路由协议的网络号>
Router(config-router)# network <直接相连的要用此路由协议的网络号>

内部网关路由协议 IGRP
Router(config)# router igrp <自主系统号>
Router(config-router)# network <直接相连的要用 igrp 协议的有类别网络号>
Router# show ip interface
Router# show ip protocols
Router# show ip route
Router# debug ip rip

外部网关路由协议BGP
Router(config)# router bgp <自主系统号>
Router(config-router)# neighbor <相邻的路由器的接口的ip地址> remote-as <邻居的自主系统号>
Router(config-router)# network <要通告的直连的网络地址> mask <该网络地址的掩码>

```

## 2.5 密码设置
```
service password-encryptin 手工加密所有密码
enable password +密码 配置明文密码
ena sec +密码 配置密文密码
line vty 0 4/15 进入 telnet 接口
password +密码 配置 telnet 密码
line aux 0 进入 AUX 接口
password +密码 配置密码
line con 0 进入 CON 接口
password +密码 配置密码
bandwidth+数字 配置带宽
在 Cisco 设备上修改控制端口密码：
R1(config)# line console 0
R1(config-line)# login
R1(config-line)# password Lisbon
R1(config)# enable password Lilbao
R1(config)# login local
R1(config)# username student password cisco
在 Cisco 设备上设置控制台及 vty 端口的会话超时：
R1(config)# line console 0
R1(config-line)# exec-timeout 5 10
R1(config)# line vty 0 4
R1(config-line)# exec-timeout 5 2
```

## 2.6 NVRAM
```
show startup config 查看 NVRAM 中的配置信息
copy run-config atartup config 保存信息到 NVRAM
write 保存信息到 NVRAM
erase startup-config 清除 NVRAM 中的配置信息
description+信息 配置接口听描素信息
```

## 2.7 提示语
banner motd # +信息 + # 配置路由器或交换机的描素信息


## 2.8 vlan
```
vlan database 进入 VLAN 数据库模式
vlan +vlan 号+ 名称 创建 VLAN
switchport access vlan +vlan 号 为 VLAN 为配接口
interface vlan +vlan 号 进入 VLAN 接口模式
ip add +ip 地址 为 VLAN 配置管理 IP 地址
```

## 2.9 VTP 中继
```
vtp+service/tracsparent/client 配置 SW 的 VTP 工作模式
vtp +domain+域名 配置 SW 的 VTP 域名
vtp +password +密码 配置 SW 的密码
switchport mode trunk 启用中继
no vlan +vlan 号 删除 VLAN
```

## 2.11 CISCO 命令集——路由选择协议及排障
*ip route 命令
Router(config)# ip route <目录网络或子网号> [子网掩码] <下一路由器 IP 地址 | 从本地出口
的地址> [管理距离 0~255，默认为 1]
（注：静态地址配置）
*ip default-network 命令
Router(config)# ip default-network <目标网络号>
(注：配合路由协使用，用其中的一个动态路由号作默认路由配置)
Router(config)# ip route 0.0.0.0 0.0.0.0 <下一路由器 IP 地址 | 从本地出口的地址>
(注：只有一个公网地址时，在出口路由器上的配置)
