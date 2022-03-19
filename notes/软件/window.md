# 修改键盘布局
效果
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210517143314.png" width="700px"/>

**步骤：**
创建如下2个文件：
文件名：keyword.txt
```
Caps Lock: Esc;
Esc: `;
`: Caps Lock;
Semicolon: Backspace;
Backspace: \;
\: /;
/: Semicolon; 
```
上述文件的作用：把Esc键换成Caps Lock键， 把Caps Lock键换成Esc键； 其他同理

文件名：keyword.py
```python
import sys
import os

save_format = "reg"    #这个值可以修改，有两个选项(bat和reg)，可选择生成bat批处理文件或者reg注册表脚本文件,功能一样

class CountError(Exception):    #文本文件格式错误异常
    pass

class FileFormatError(Exception):    #save_format值异常
    pass


if save_format not in ["bat","reg"]:
    raise FileFormatError("The variable 'save_format'`s value must be 'bat' or 'reg'.")


if __name__ == "__main__":
    
    if not os.path.isdir("layout_"+save_format):
        os.mkdir("layout_"+save_format)

    if len(sys.argv) == 1:
        if save_format == "bat":
            with open("layout_bat/recover.bat",'w', encoding="utf-8") as f:
                f.write('@echo off\nreg delete "hklm\\system\\currentcontrolset\\control\\keyboard layout" /v "ScanCode Map" /f\necho "键位已恢复，重启系统后生效"\npause')
            input("恢复文件recover.bat已生成至layout_bat文件夹下，以管理员身份右键执行该文件后重启系统生效。\n按回车键退出程序...")

        else:
            with open("layout_reg/recover.reg",'w', encoding="utf-8") as f:
                f.write('Windows Registry Editor Version 5.00\n[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Keyboard Layout]\n"ScanCode Map"=hex:00,00,00,00,00,00,00,00,01,00,00,00,00,00,00,00')
            input("恢复文件recover.reg已生成至layout_reg文件夹下，双击执行该文件后重启系统生效。\n按回车键退出程序...")

    elif len(sys.argv) == 2:
        scan_code_dict = {
            "00 00":"None",
            "01 00":"Esc",    #即Esc键的扫描码是"0001"
            "02 00":"1",
            "03 00":"2",
            "04 00":"3",
            "05 00":"4",
            "06 00":"5",
            "07 00":"6",
            "08 00":"7",
            "09 00":"8",
            "0a 00":"9",
            "0b 00":"0",
            "0c 00":"-",
            "0d 00":"=",
            "0e 00":"Backspace",
            "0f 00":"Tab",
            "10 00":"Q",
            "11 00":"W",
            "12 00":"E",
            "13 00":"R",
            "14 00":"T",
            "15 00":"Y",
            "16 00":"U",
            "17 00":"I",
            "18 00":"O",
            "19 00":"P",
            "1a 00":"[",
            "1b 00":"]",
            "1c 00":"Enter",
            "1d 00":"Left Ctrl",
            "1e 00":"A",
            "1f 00":"S",
            "20 00":"D",
            "21 00":"F",
            "22 00":"G",
            "23 00":"H",
            "24 00":"J",
            "25 00":"K",
            "26 00":"L",
            "27 00":"Semicolon",    #由评论区指出，键盘上的“;”应该用其他值代替，否则会与配置文本文件中的“;”混淆
            "28 00":"'",
            "29 00":"`",
            "2a 00":"Left Shift",
            "2b 00":"\\",
            "2c 00":"Z",
            "2d 00":"X",
            "2e 00":"C",
            "2f 00":"V",
            "30 00":"B",
            "31 00":"N",
            "32 00":"M",
            "33 00":",",
            "34 00":".",
            "35 00":"/",
            "36 00":"Right Shift",
            "37 00":"n*",
            "38 00":"Left Alt",
            "39 00":"Space",
            "3a 00":"Caps Lock",
            "3b 00":"F1",
            "3c 00":"F2",
            "3d 00":"F3",
            "3e 00":"F4",
            "3f 00":"F5",
            "40 00":"F6",
            "41 00":"F7",
            "42 00":"F8",
            "43 00":"F9",
            "44 00":"F10",
            "45 00":"Num Lock",
            "46 00":"Scroll Lock",
            "47 00":"n7",
            "48 00":"n8",
            "49 00":"n9",
            "4a 00":"n-",
            "4b 00":"n4",
            "4c 00":"n5",
            "4d 00":"n6",
            "4e 00":"n+",
            "4f 00":"n1",
            "50 00":"n2",
            "51 00":"n3",
            "52 00":"n0",
            "53 00":"n.",
            "57 00":"F11",
            "58 00":"F12",

            
            "1c e0":"nEnter",
            "1d e0":"Right Ctrl",
            "37 e0":"PrtSc",
            "38 e0":"Right Alt",
            "47 e0":"Home",
            "48 e0":"Up",
            "49 e0":"Page Up",
            "4b e0":"Left",
            "4d e0":"Right",
            "4f e0":"End",
            "50 e0":"Down",
            "51 e0":"Page Down",
            "52 e0":"Insert",
            "53 e0":"Delete",
            "5b e0":"Left Windows",
            "5c e0":"Right Windows",
            }

        fun_key_dict = dict((m.upper(),n) for n,m in scan_code_dict.items())    #键值互换,键值全大写
        content = '00 00 00 00 00 00 00 00'
        
        #用于暂时保存映射前后的键位，判断这次键位修改是否有风险
        before_map_set = set()
        after_map_set = set()

        with open(sys.argv[1], encoding="utf-8") as f:
            p = f.read().strip().split(';')
            p.remove('')
            content += ' {:0>2x} 00 00 00'.format(len(p)+1)
            try:
                for i in p:
                    if len(i.strip().split(':')) == 2:
                        before_map_set.add(i.split(':')[0].strip().upper())
                        after_map_set.add(i.split(':')[1].strip().upper())
                        content += ' '+fun_key_dict[i.split(':')[1].strip().upper()]+' '+fun_key_dict[i.split(':')[0].strip().upper()]
                    else:
                        raise CountError
                content += ' 00 00 00 00'
            except KeyError:
                print("文件中键名称有误")
                
            except CountError:
                print("文件中未按格式书写")
            else:
                if before_map_set != after_map_set:
                    run = input("此次键位替换存在风险，{}键功能将在键盘上无对应按键，是否继续？(输入y继续，否则退出程序)".format(str(before_map_set-after_map_set)[1:-1]))
                    if run != 'y':
                        sys.exit()

                if save_format == "bat":
                    with open("layout_bat/"+'.'.join(sys.argv[1].split('\\')[-1].split('.')[:-1])+'.bat','w', encoding="utf-8") as g:
                        g.write('@echo off\nreg add "hklm\\system\\currentcontrolset\\control\\keyboard layout" /v "ScanCode Map" /t REG_BINARY /d "{}" /f\necho "键位已完成修改，重启系统后生效"\npause'.format(''.join(content.split())))
                    input("...\n{}文件已生成至layout_bat目录下，右键以管理员身份执行该文件后重启系统生效。\n按回车键退出程序...".format('.'.join(sys.argv[1].split('\\')[-1].split('.')[:-1])+'.'+save_format))

                else:
                    with open("layout_reg/"+'.'.join(sys.argv[1].split('\\')[-1].split('.')[:-1])+'.reg','w', encoding="utf-8") as g:
                        g.write('Windows Registry Editor Version 5.00\n[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Keyboard Layout]\n"ScanCode Map"=hex:{}'.format(','.join(content.split())))

                    input("...\n{}文件已生成至layout_reg目录下，双击执行该文件后重启系统生效。\n按回车键退出程序...".format('.'.join(sys.argv[1].split('\\')[-1].split('.')[:-1])+'.'+save_format))
    else:
        input("传入参数错误，按回车键退出程序...")
```

然后运行`python keyword.py keyword.txt`，会在当前运行目录下生成一个layout_reg目录，且该目录下会生成一个recover.reg文件，运行这个reg文件既可以完成换键

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