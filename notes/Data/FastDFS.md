# 简介
FastDFS是一个开源的轻量级分布式文件系统，它对文件进行管理，功能包括：文件存储、文件同步、文件访问（文件上传、文件下载）等，解决了大容量存储和负载均衡的问题。特别适合以文件为载体的在线服务，如相册网站、视频网站等等。但不适合单个文件大于1G的视频网站

FastDFS为互联网量身定制，充分考虑了冗余备份、负载均衡、线性扩容等机制，并注重高可用、高性能等指标，使用FastDFS很容易搭建一套高性能的文件服务器集群提供文件上传、下载等服务。

## 跟踪器(tracker)和存储节点(storage)
FastDFS服务端有两个角色：**跟踪器（tracker）**和**存储节点（storage）**。

跟踪器主要做调度工作，在访问上起负载均衡的作用。

存储节点存储文件，完成文件管理的所有功能：就是这样的存储、雨步和提供存取接口，FastDFS同时对文件的metadata进行管理。所谓文件的metadata就是文件的相关属性，以键值对（key value）方式表示，如：
width=1024，其中的key为width，value为1024。文件metadata是文件属性列表，可以包含多个键值对。

跟踪器和存储节点都可以由一台或多台服务器构成。跟踪器和存储节点中的服务器均可以随时增加或下线而不会影响线上服务。其中跟踪器中的所有服务器都是对等的，可以根据服务器的压力情况随时增加或减少。

为了支持大容量，存储节点（服务器）采用了分卷（或分组）的组织方式。存储系统由一个或多个卷组成，卷与卷之间的文件是相互独立的，所有卷的文件容量累加就是整个存储系统中的文件容量。一个卷可以由一台或多台存储服务器组成，一个卷下的存储服务器中的文件都是相同的，卷中的多台存储服务器起到了冗余备份和负载均衡的作用。

在卷中增加服务器时，同步已有的文件由系统自动完成，同步完成后，系统自动将新增服务器切换到线上提供服务。当存储空间不足或即将耗尽时，可以动态添加卷。只需要增加一台或多台服务器，并将它们配置为一个新的卷，这样就扩大了存储系统的容量。

FastDFS中的文件标识分为两个部分：卷名和文件名，二者缺一不可。

## 架构图
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511112915.png" width="700px"/>

### 上传流程
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511113201.png" width="700px"/>

1. client询问tracker上传到的storage，不需要附加参数；
2. tracker返回一台可用的storage；
3. client直接和storage通讯完成文件上传

### 下载流程
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511113544.png" width="700px"/>
1. client询问tracker下载文件的storage，参数为文件标识（组名和文件名）；
2. tracker返回一台可用的storage；
3. client直接和storage通讯完成文件下载。

## 术语介绍
- `TrackerServer`：跟踪服务器，主要做调度工作，在访问上起负载均衡的作用。记录storage server的状态，是连接Client和Storage server的枢纽。
- `Storage Server`：存储服务器，文件和meta data都保存到存储服务器上
- `group`：组，也称为卷。同组内服务器上的文件是完全相同的
- `文件标识`：包括两部分：组名和文件名（包含路径）
- `meta data`：文件相关属性，键值对（Key Value Pair）方式，如：width=1024，heigth=768

## 同步机制
同一组/卷内的storage server之间是对等的，文件上传、删除等操作可以在任意一台storage server上进行；
文件同步只在同组内的storage server之间进行，采用push方式，即源服务器同步给目标服务器；源头数据才需要同步，备份数据不需要再次同步，否则就构或环路了；
上述第二条规则有个例外，就是新增加一台storage server时，由已有的一台storage server将已有的所有数据（包括源头数据和备份数据）同步给该新增服务器

# 安装
1. FastDFS 需要下载如下的软件包：
[fastdfs](https://github.com/happyfish100/fastdfs/releases)
[fastdfs-nginx-module](https://github.com/happyfish100/fastdfs-nginx-module)
[libfastcommon](https://github.com/happyfish100/libfastcommon)
[nginx](http://nginx.org/download/nginx-1.15.9.tar.gz)

2. 先安装依赖
```shell
# 更新源
sudo apt-get update
# 安装c++ 依赖库
sudo apt-get install build-essential
sudo apt-get install libtool
# 安装openssl 依赖 用于nginx
sudo apt-get install openssl
# 安装pcre 依赖
sudo apt-get install libpcre3 libpcre3-dev
# 安装zlib 依赖 当时把1看成L nginx时会报错
sudo apt-get install zlib1g-dev
```

3. 安装 libfastcommon
libfastcommon是一款从FastDFS项目中剥离出来的C基础库
```shell
# 解压 libfastcommon-master.zip
unzip libfastcommon-master.zip
# 进入 libfastcommon-master/
cd libfastcommon-master
# 执行命令 如果报错的话可能是依赖没装好
./make.sh
./make.sh install
```

3. 安装 fastdfs
```shell
# 回到用户主目录，解压fastdfs-xx.zip
cd ..
unzip fastdfs-xx.zip
# 进入解压后的fastdfs-xx，执行命令
cd fastdfs-xx
./make.sh
./make.sh install
```

4. 配置tracker
```shell
# 复制tracker.conf.sample
sudo cp /etc/fdfs/tracker.conf.sample /etc/fdfs/tracker.conf

# 创建/home/naiswang/fastdfs/tracker目录
mkdir -p /home/naiswang/fastdfs/tracker

# 编辑/etc/fdfs/tracker.con配置文件， 修改base_path
base_path = /home/naiswang/fastdfs/tracker
```

5. 配置存储storage
```shell
# 复制storage.conf.sample
sudo cp /etc/fdfs/storage.conf.sample /etc/fdfs/storage.conf

# 创建/home/naiswang/fastdfs/storage目录
mkdir -p /home/naiswang/fastdfs/storage

# 编辑/etc/fdfs/storage.conf配置文件
base_path = /home/naiswang/fastdfs/storage
store_path0 = /home/naiswang/fastdfs/storage/store # 指定storage的存储目录
tracker_server = 服务器ip:22122
```

6. 启动tracker 和 storage
```shell
sudo /usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf start
sudo /usr/bin/fdfs_storaged /etc/fdfs/storage.conf start
# 启动 成功 的话会有
# fdfs_trackerd already running, pid: 11111
```

## 测试安装状态
```shell
cp /etc/fdfs/client.conf.sample /etc/fdfs/client.conf
```

编辑/etc/fdfs/client.conf配置文件 修改内容
```conf
base_path = /home/xxx/fastdfs/tracker
tracker_server = ip:22122
```

上传文件测试 /xx/xx.png为上传的图片
```shell
/usr/bin/fdfs_upload_file /etc/fdfs/client.conf /xx/xx.png
```

返回字符串路径表示成功
```shell
/group1/M00/00/00/wKgDb17S6NWAMK-UAACdyH9JNRs343.PNG
```

## 安装Nginx并添加fastdfs模块
### FastDFS为什么要结合Nginx：
我们在使用FastDFS部署一个分布式文件系统的时候，通过FastDFS的客户端API来进行文件的上传、下载、删除等操作。同时通过FastDFS的HTTP服务器来提供HTTP服务。但是FastDFS的HTTP服务较为简单，无法提供负载均衡等高性能的服务，所以FastDFS的开发者，为我们提供了Nginx上使用的FastDFS模块（也可以叫FastDFS的Nginx模块）。其使用非常简单。
FastDFS通过Tracker服务器,将文件放在Storage服务器存储,但是同组之间的服务器需要复制文件,有延迟的问题.假设Tracker服务器将文件上传到了192.168.1.80,文件ID已经返回客户端,这时,后台会将这个文件复制到192.168.1.30,如果复制没有完成,客户端就用这个ID在192.168.1.30取文件,肯定会出现错误。这个fastdfs-nginx-module可以重定向连接到源服务器取文件,避免客户端由于复制延迟的问题,出现错误。
