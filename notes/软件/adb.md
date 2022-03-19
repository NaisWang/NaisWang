# adb识别手机
当插上手机， 并且启动了USB调试模式，  在电脑上如果出现如下情况即可连接成功

<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191223112921.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191223113031.png"/>

如果没有， 则说明电脑上没有该手机的驱动器， 那么可以在网上下载手机对应的驱动器， 或者是手机对应的手机助手，以下以vivo x9与华为为例
vivo：

在网上下载vivo x9的驱动器
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191223113403.png"/>

华为：
在网上下载华为手机助手
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191223113741.png"/>

# 使用adb卸载vivo自带手机应用
1. 连接安卓设备
我们把安卓设备用USB连接PC,手机进入USB调式模式，有些手机进入USB调试模式需要打开开发者模式，而有些手机不需要， 然后在PC上打开CMD，进入adb目录，输入adb devices回车，如果连接正确，如图，会显示已连接设备。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191215083517.png"/>

如果手机没有显示是否确定进行USB弹框， 那么你可以何使用`adb kill-server`关闭adb服务，然后使用`adb start-server`启动adb服务并查看连接设备
注： 如果设备后面显示的是`unauthorized`,此时相当于电脑无法识别该手机， 这是由于手机没有进入USB调试模式而引起的
2. 进入安卓shell
```
adb shell
```
3. 模糊搜索要卸载的程序的包名并删除
```
pm list packages | grep '查询的英文包名（模糊查询）'
pm uninstall -k --user 0 xxxx   输入全包名xxxx  不加引号  卸载应用
```
-k 表示保存数据，如不需要，可去掉 -k，--user 指定用户 id，Android 系统支持多个用户，默认用户只有一个，id=0。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191215083740.png"/>
注意： vivo好像做了一个系统盘监控，有还原功能，卸载了，但一重启，就又都回来了，但可以通过ADB停用，不需要卸载，将不需要的应用停用后，重新启动也不会回来，图标也会消失，需要用的时候再启用，这样也不错。
adb shell pm disable-user 应用包名 --> 停用
adb shell pm enable 应用包名 --> 启用

```
# delete the GameCentre
pm uninstall -k --user 0 com.vivo.game
pm disable-user com.vivo.game
# vivocloud
pm uninstall -k --user 0 com.bbk.cloud
pm disable-user com.bbk.cloud
# childrenmode
pm uninstall -k --user 0 com.vivo.childrenmode
pm disable-user com.vivo.childrenmode
# vivo.com
pm uninstall -k --user 0 com.vivo.space
pm disable-user com.vivo.space
# iReader
pm uninstall -k --user 0 com.chaozh.iReader
pm disable-user com.chaozh.iReader
# iMusic
pm uninstall -k --user 0 com.android.bbkmusic
pm disable-user com.android.bbkmusic
# Browser
pm uninstall -k --user 0 com.vivo.browser
pm disable-user com.vivo.browser
# Skills
pm uninstall -k --user 0 com.vivo.Tips
pm disable-user com.vivo.Tips
# Email
pm uninstall -k --user 0 com.vivo.email
pm disable-user com.vivo.email
# Notes
pm uninstall -k --user 0 com.android.notes
pm disable-user com.android.notes
# VideoPlayer
pm uninstall -k --user 0 com.android.VideoPlayer
pm disable-user com.android.VideoPlayer
# appstore
pm uninstall -k --user 0 com.bbk.appstore
pm disable-user com.bbk.appstore
```

# adb服务器版本与此客户端不匹配错误
```
adb server version (31) doesn't match this client (36) adb server version (32) doesn't match this client (36); killing...
```
这是由于您使用版本为31的adb启动adb服务器，然后尝试使用版本版本为36连接到此服务器。
由于版本不一致， 从而会报错