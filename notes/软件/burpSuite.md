# 苹果IOS手机设置BurpSuite抓包
1. 添加BP的Proxy Listeners
点击Add添加
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210607221913.png" width="700px"/>
端口填写8080，然后选择Specific address，选手机和电脑同时在的那个IP区段

2. 在Intercept Client Requests中勾选
Intercept requests based on the following rules和Automatically......edited，截图如下
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210607221947.png" width="700px"/>

3. 手机设置代理

4. 在Safari浏览器中打开网址`电脑ip:8080`下载证书
打开网页后点击右上角的CA证书进行下载，省去苹果手机的邮箱操作。

5. 手机管理证书
首先打开设置->通用->关于本机->描述文件
在里面配置好下载的证书
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210607222013.png" width="700px"/>

然后在关于本机->证书信任设置里面开启信任

之后就可以正常抓包了

# 使用BurpSuite进行APP抓包如何绕过代理检测
最近接手到一个项目，对某客户的iosAPP进行渗透测试，虽然说客户发过来的是测试包，但是开了代理检测，我是怎么知道的呢，当然是先猜到了，后面尝试验证了的。因为开了代理检测，所以我在WIFI属性处设置代理就被检测到了。一设置代理打开APP就提示网络，点击前端功能点皆提示网络错误。代理关闭，APP就可以正常使用。
关于APP抓不到包可能是以下问题：

SSL证书没配置好
客户端开启了代理检测
客户端使用了双向证书校验
客户端内嵌了自己的VPN
看到自己遇到的情况，我就猜测可能是前端做了代理检测了。

如果绕过呢？
有没有思考过一个问题？
客户端禁止你使用代理，会不会禁止你使用VPN呢？说到代理，作为一个合格的安全人员你应该会联想到中间人流量劫持、中间人攻击。那么VPN也会有这些吗，有时会有但是安全性相对较高。VPN可以走全局的流量，接入远程内网。一个APP你禁止我的流量走代理，但是你总不能不让我用VPN吧。
于是便有了以下的操作。

BurpSuite开启8080端口http代理，绑定地址为0.0.0.0或者局域网ip。
在苹果手机上安装小飞机（SS），选择协议为http，连接信息填写BurpSuite的。