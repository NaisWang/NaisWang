# uiautomator2简介
通过这个python库可以实现客户端控制手机
[官网介绍](https://github.com/openatx/uiautomator2)

## 安装`uiautomator2`
```
pip3 install uiautomator2
```

安装完后用usb与手机相互连接， 然后运行`python3 -m uiautomator2 init`来启动uiautomator2,如果是第一次使用该命令，则它会在手机安装如下东西
```
app-uiautomator.apk
app-uiautomator-test.apk
atx-agent
minicap
minitouch
```
并且其会安装上面的2个apk, 该应用界面如下
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20200112135353.png"/>
然后点击启动UIAUTOMATOR
注： 如果没有在命令行中运行`python3 -m uiautomator2 init`命令，则手机是无法启动UIAUTOMATOR的
以上操作是为了开启手机的UIAUTOMATOR, 只有开启后，电脑才能通过uiautomator2来操作手机
<font color="red">手机上启动UIAUTOMATOR后， 就可以将手机与电脑断开连接， 因为Uiautomator2可以通过ip地址来操作手机</font>

## 卸载`uiautomator2`
```
adb shell rm /data/local/tmp/minicap
adb shell rm /data/local/tmp/minicap.so
adb shell rm /data/local/tmp/minitouch
adb shell /data/local/tmp/atx-agent server --stop
adb shell rm /data/local/tmp/atx-agent
adb uninstall com.github.uiautomator
adb uninstall com.github.uiautomator.test
```

## 常见方法
[官网链接](https://github.com/openatx/uiautomator2/blob/master/QUICK_REFERENCE.md)
```python
import uiautomator2 as u2

d = u2.connect("--serial-here--") # 只有一个设备也可以省略参数
d = u2.connect() # 一个设备时
d = u2.connect("10.1.2.3") # 通过设备的IP连接(需要在同一局域网且设备上的atx-agent已经安装并启动)

d.app_current() # 获取前台应用 packageName, activity
d.app_start("com.example.app") # 启动应用
d.app_start("com.example.app", stop=True) # 启动应用前停止应用
d.app_stop("com.example.app") # 停止应用

app = d.session("com.example.app") # 启动应用并获取session

# session的用途是操作的同时监控应用是否闪退，当闪退时操作，会抛出SessionBrokenError
app.click(10, 20) # 坐标点击

# 无session状态下操作
d.click(10, 20) # 坐标点击
d.swipe(10, 20, 80, 90) # 从(10, 20)滑动到(80, 90)
d.swipe_ext("right") # 整个屏幕右滑动
d.swipe_ext("right", scale=0.9) # 屏幕右滑，滑动距离为屏幕宽度的90%

d.press("back") # 模拟点击返回键
d.press("home") # 模拟Home键

d.send_keys("hello world") # 模拟输入，需要光标已经在输入框中才可以
d.clear_text() # 清空输入框

# 执行shell命令
output, exit_code = d.shell("ps -A", timeout=60) # 执行shell命令，获取输出和exitCode
output = d.shell("pwd").output # 这样也可以
exit_code = d.shell("pwd").exit_code # 这样也可以

# 元素操作
d.xpath("立即开户").wait() # 等待元素，最长等10s（默认）
d.xpath("立即开户").wait(timeout=10) # 修改默认等待时间

# 常用配置
d.settings['wait_timeout'] = 20 # 控件查找默认等待时间(默认20s)

# xpath操作
d.xpath("立即开户").click() # 包含查找等待+点击操作，匹配text或者description等于立即开户的按钮
d.xpath("//*[@text='私人FM']/../android.widget.ImageView").click()

d.xpath('//*[@text="私人FM"]').get().info # 获取控件信息

for el in d.xpath('//android.widget.EditText').all():
    print("rect:", el.rect) # output tuple: (left_x, top_y, width, height)
    print("bounds:", el.bounds) # output tuple: （left, top, right, bottom)
    print("center:", el.center())
    el.click() # click operation
    print(el.elem) # 输出lxml解析出来的Node

# 监控弹窗(在线程中监控)
d.watcher.when("跳过").click()
d.watcher.start()
```

## 实战: 实现微信自动登录
### 使用可视化工具`weditor`
webditor是一个可视化安卓调试工具，一般用于获取页面控件的定位的
<font color="red"> 注： 在使用`weditor`时， 一定要先启动`UIAUTOMATOR` </font>
```
pip3 install -U weditor
```
使用命令`python -m weditor`来启动， 此时会自动打开浏览器， 输入设备的ip后序列号（可通过adb devices查看）， 点击Connect即可
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20200112135655.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20200112165431.png"/>

### 使用`apowermirror`
apowermirror是用来将手机投屏到电脑上的，需要在手机与电脑上安装`apowermirror`, 该软件有2中方法实现连接： USB与wifi。
注： 在使用USB方法连接时， 由于`apowermirror`会启动该软件自己的有关adb服务， 这就可能会该adb版本与本机安装的adb版本不一致的问题，如果不一致的话， 从而后导致后面如果用本机的adb进行调试时，会出现`adb server version (31) doesn't match this client (36) adb server version (32) doesn't match this client (36); killing...`问题， 此时`apowermirror`会自动断开连接
而使用wifi方式进行连接时，是没有这个问题的， 所以建议使用wifi进行连接
[有关使用wifi连接时， 后自动自动退出的解决方法](https://www.apowersoft.cn/community/topic/30945402.html)

### 编写代码
虽然不需要打开开发者模式， 但是一定要将开发者模式中的`USB debugging`与`USB simulated input`选项打开， 否则会运行代码是会报错：`java.lang.SecurityException: Injecting to another application requires INJECT_EVENTS permission`， 可以通过ATX软件中的开发者选项进入开发者选项
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20200112164445.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20200112152730.png"/>

```python
import uiautomator2
from passwd import passwd

# connect phone
d = uiautomator2.connect("10.142.254.197")

# 下面代码都有有阻塞功能，一定要找到元素并实现功能后才执行下一步
d.xpath('//*[@resource-id="com.bbk.launcher2:id/shortcut_application_zone2"]/android.widget.RelativeLayout[1]/android.widget.ImageView[1]').click()

d(resourceId="com.bbk.launcher2:id/item_title", text="WeChat").click()

d(resourceId="com.tencent.mm:id/m7").set_text(passwd)

d(resourceId="com.tencent.mm:id/d17").click()
```
效果：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20200112170925.gif"/>