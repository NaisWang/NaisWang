# 禁用自带快捷键
操作步骤如下：
1、 右键开始—运行，输入regedit，点击确定打开注册表；
2、 定位到
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
3、 右键Advanced—新建—字符串值，命名为DisabledHotkeys；
4、 双击打开DisabledHotkeys，如果要禁用Win+A，数值数据改成A，确定
5、 如果要禁用多个快捷键，比如Win+A，Win+B等等，数值数据改成ABCDE，依次类推；
6、 最后注销或重启系统生效，如果要恢复，只需删除数值数据的字母，或直接删除DisabledHotkeys，再次重启即可。

# 删除右键内容
1. 进入Computer\HKEY_CLASSES_ROOT\Directory\Background\shell
2. 分辨率、小工具、个性化具体路径：
HKEY_CLASSES_ROOT\DesktopBackground\Shell\Display；
HKEY_CLASSES_ROOT\DesktopBackground\Shell\Gadgets；
HKEY_CLASSES_ROOT\DesktopBackground\Shell\Personalize。
以上东西删除可以需要权限， 赋权操作如下：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191030162220.png"/>

3. 显卡设置路径
HKEY_CLASSES_ROOT\Directory\background\shellex\ContextMenuHandlers
删除显卡对应的文件夹即可：
ace --> AMD
igfxDTCM --> Intel
NvCplDesktopContext --> NVIDIA

# 重装window系统
1. 下载微pe，运行pe软件，将软件装入u盘（内存卡也行）中，此时微pe会自动将该u盘分为2个区，一个区是放了该微pe系统，另一个是空闲的，可以用来存放其他任何东西
2. 下载win10镜像， 存入到u盘中，可以去“MSDN我告诉你”网站下载，下载完成后务必进行SHA1校验（推荐使用iHasher软件），与网站核对一致后再使用，这样是为了防止数据在传输的过程中丢失
3. 在需要安装系统的电脑上插入u盘，修改bios中的引导向为u盘启动，进入pe系统（如果电脑不能识别该u盘，则在bios中的boot secure选项设置成disable，然后将csm选项（具体什么不记得了）设置成enable即可）
4. 进入pe系统后，点击window系统安装器软件，选择安装在u盘的win10镜像，选择要安装位置的盘符（一定要将该盘符格式化），其余选项默认即可， 然后运行进行系统映像
5. 系统映像完成后，一般需要手动进行引导修复，具体操作：点击dimm++软件，该软件顶部会显示出识别出来的系统，点击要引导修复的系统后，下面的工具箱中有一个引导修复功能，点击即可
6. 以上步骤执行完成后，就可以拔掉u盘，重启电脑，修改bios的引导向， 系统安装完成
7. 由于下载的win10镜像可能不够好，所以可能新系统导致缺少一些驱动，例如无线网卡驱动，会导致无法使用无线网。如果电脑现在无法上网，可以先在其他电脑上下载一个驱动精灵到u盘中，然后再拷贝到无法上网的电脑上。点击驱动精灵，它会识别出当前电脑缺少无线网卡驱动，点击修复即可，此过程不需要网络。其他的驱动不建议使用驱动精灵来安装，建议使用易升更新系统的方式来解决

注：不要在原先是win10的电脑上安装win7， 因为一些较新的硬件对win7不支持，只对win10支持，从而导致安装win7后鼠标或键盘不能使用

# 激活win10
1. 在运行窗口输入: slmgr.vbs -xpr 来查看当前电脑激活状态。注：- 前面有空格
2. 下载hwidgen软件即可，运行该软件，采用数字激活，这样可永久激活
3. 激活完成后，再次使用上面命令来查看激活状态，此时应该显示永久激活

# 使用cmd命令行查看wifi密码
```
netsh wlan show profiles
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191130181003.png"/>

```
 netsh wlan show profile name="广告招租" key=clear
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191130181111.png"/>

# Windows下如何查看某个端口被谁占用
## 查看被占用端口对应的 PID
输入命令：
```
netstat -aon|findstr "8081"
```
回车执行该命令，最后一位数字就是 PID, 这里是 9088。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210518154352.png" width="700px"/>

## 查看指定 PID 的进程
继续输入命令：
```
tasklist|findstr "9088"
```
回车执行该命令。
查看是哪个进程或者程序占用了 8081 端口，结果是：node.exe。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210518154435.png" width="700px"/>

## 结束进程
强制（/F参数）杀死 pid 为 9088 的所有进程包括子进程（/T参数）：
```
taskkill /T /F /PID 9088 
```

# 查看系统保留端口
windows 系统保留了一些端口给系统使用，我们用下面的命令可以查看：
```
netsh interface ipv4 show excludedportrange protocol=tcp
```
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210522090756.png" width="700px"/>

如果其他应用想要占用这些系统保留端口，会出现如下错误：
```
An attempt was made to access a socket in a way forbidden by its access permissions.
```
