**Nginx（engine x）是一个高性能HTTP和反向代理web服务器**，同时也提供了IMAP/POP3/SMTP服务.Nginx是由伊戈尔素耶夫为俄罗斯访问量第二的Rambler.ru站点开发的，第一个公开版本0.1.0发布于2004年10月4日。2011年6月1日，nginx1.0.4发布。

其特点是占有内存少，并发能力强，事实上nginx的并发能力在同类型的网页服务器中表现较好，中国大结使用nginx网站用户有：百度、京东、新浪、网易、腾讯、宝等.在全球活跃的网站中有12.18%的使用比率，大约为2220万个网站。

Nginx是一个安装非常的简单、配置文件非常简洁（还能够支持perl语法）、Bug非常少的服务。Nginx启动特别容易，并且几乎可以做到7*24不间断运行，即使运行数个月也不需要重新启动.你还能够不问断服务的情况下进行软件版本的升级.

Nginx代码完全用C语言从头写成。官方数据测试表明能够支持高达50000个并发连接数的响应。

# Nginx常用功能
## Http代理，反向代理 
Http代理，反向代理：作为web服务器最常用的功能之一，尤其是反向代理。
Nginx在做反向代理时，提供性能稳定，并且能够提供配置灵活的转发功能。Nginx可以根据不同的正则匹配，采取不同的转发策略，比如图片文件结尾的走文件服务器，动态页面走web服务器，只要你正则写的没问题，又有相对应的服务器解决方案，你就可以随心所欲的玩。并且Nginx对返回结果进行错误页跳转，异常判断等。如果被分发的服务器存在异常，他可以**将请求重新转发**给另外一台服务器，然后自动去除异常服务器。
## 负载均衡
Nginx提供的负载均衡策略有2种：内置策略和扩展策略。内置策略为轮询，加权轮询，Ip hash。扩展策略，就天马行空，只有你想不到的没有他做不到的啦，你可以参照所有的负载均衡算法，给他一一找出来做下实现。

**轮询**
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511143125.png" width="700px"/>

**加权轮询**
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511143151.png" width="700px"/>

**ip hash**
iphash对客户端请求的ip进行hash操作，然后根据hash结果将同一个客户端ip的请求分发给同一台服务器进行处理，可以解决session不共享的问题。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511143232.png" width="700px"/>


## 动静分离
动静分离，在我们的软件开发中，有些请求是需要后台处理的，有些请求是不需要经过后台处理的（如：css、html、jpg、js等文件），这些不需要经过后台处理的文件称为静态文件。让动态网站里的动态网页根据一定规则把不变的资源和经常变的资源区分开来，动静资源做好了拆分以后，我们就可以根据静态资源的特点将其做缓存操作，提高资源响应的速度。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511143513.png" width="700px"/>


# LINUX安装nginx
1. 安装Nginx
```shell
apt-get install nginx
```
2. 配置nginx.conf
```shell
# 打开配置文件
vi /usr/local/nginx/conf/nginx.conf
```
将端口号改成8089，因为可能apeache占用80端口，apeache端口尽量不要修改，我们选择修改nginx端口。

localhost修改为你服务器ip地址。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511143908.png" width="500px"/>

3. 启动nginx
```shell
/usr/local/nginx/sbin/nginx -s reload
```
如果出现报错：nginx: [error] open() ＂/usr/local/nginx/logs/nginx.pid＂ failed

则运行： /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf

再次启动即可！
查看nginx进程是否启动：`ps -ef | grep nginx`

4. 若想使用外部主机连接上虚拟机访问端口192.168.131.2，需要关闭虚拟机的防火墙：
centOS6及以前版本使用命令： systemctl stop iptables.service
centOS7关闭防火墙命令： systemctl stop firewalld.service
随后访问该ip即可看到nginx界面。

5. 访问服务器ip查看（备注，由于我监听的仍是80端口，所以ip后面的端口号被省略）
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511144016.png" width="700px"/>

# nginx常用命令
**linux下nginx常用命令**
`nginx`: 启动
`nginx -s stop`: 停止
`nginx -s quit`: 安全退出
`nginx -s reload`: 重启

**window下命令启动/停止nginx**
查看Nginx的版本号：nginx -v
启动Nginx：start nginx， 注意：不要直接运行`nginx.exe`命令来启动nginx,否则会导致不能在cmd界面关闭nginx
快速停止或关闭Nginx：nginx -s stop
正常停止或关闭Nginx：nginx -s quit
配置文件修改重装载命令：nginx -s reload

# Nginx基本配置
nginx配置文件的结构如下：
```conf
...              #全局块

events {         #events块
   ...
}

http      #http块
{
    ...   #http全局块
    server        #server块
    { 
        ...       #server全局块
        location [PATTERN]   #location块
        {
            ...
        }
        location [PATTERN] 
        {
            ...
        }
    }
    server
    {
      ...
    }
    ...     #http全局块
}
```
- 全局块：配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。
- events块：配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。
- http块：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
- server块：配置虚拟主机的相关参数，一个http中可以有多个server。
- location块：配置请求的路由，以及各种页面的处理情况。

下面给大家上一个配置文件，作为理解。
```conf
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
#worker_processes 2;  #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }

    //必须使⽤虚拟机配置站点,	每个虚拟机使⽤⼀个server{}段
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #提供服务的域名或主机名

        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
        error_page 404 https://www.baidu.com; #错误页
    }

    //第⼆个虚拟主机配置
    server	{
      ...
    }
}
```
上面是nginx的基本配置，需要注意的有以下几点：
1. 几个常见配置项：
- $remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；
- $remote_user ：用来记录客户端用户名称；
- $time_local ： 用来记录访问时间与时区；
- $request ： 用来记录请求的url与http协议；
- $status ： 用来记录请求状态；成功是200；
- $body_bytes_s ent ：记录发送给客户端文件主体内容大小；
- $http_referer ：用来记录从那个页面链接访问过来的；
- $http_user_agent ：记录客户端浏览器的相关信息；
2. 惊群现象：一个网路连接到来，多个睡眠的进程被同时叫醒，但只有一个进程能获得链接，这样会影响系统性能。
3. 每个指令必须有分号结束。


# Nginx 反向代理与负载均衡详解
## Nginx 代理服务的配置说明
1. 设置 404 页面导向地址
```conf
error_page 404 https://www.runnob.com; #错误页
proxy_intercept_errors on;    #如果被代理服务器返回的状态码为400或者大于400，设置的error_page配置起作用。默认为off。
```
2. 如果我们的代理只允许接受get，post请求方法的一种
```conf
proxy_method get;    #支持客户端的请求方法。post/get；
```
3. 设置支持的http协议版本
```conf
proxy_http_version 1.0 ; #Nginx服务器提供代理服务的http协议版本1.0，1.1，默认设置为1.0版本
```
4. 如果你的nginx服务器给2台web服务器做代理，负载均衡算法采用轮询，那么当你的一台机器web程序iis关闭，也就是说web不能访问，那么nginx服务器分发请求还是会给这台不能访问的web服务器，如果这里的响应连接时间过长，就会导致客户端的页面一直在等待响应，对用户来说体验就打打折扣，这里我们怎么避免这样的情况发生呢。这里我配张图来说明下问题。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511151035.png" width="700px"/>

如果负载均衡中其中web2发生这样的情况，nginx首先会去web1请求，但是nginx在配置不当的情况下会继续分发请求道web2，然后等待web2响应，直到我们的响应时间超时，才会把请求重新分发给web1，这里的响应时间如果过长，用户等待的时间就会越长。
下面的配置是解决方案之一。
```conf
proxy_connect_timeout 1;   #nginx服务器与被代理的服务器建立连接的超时时间，默认60秒
proxy_read_timeout 1; #nginx服务器向被代理服务器组发出read请求后，等待响应的超时间，默认为60秒。
proxy_send_timeout 1; #nginx服务器向被代理服务器组发出write请求后，等待响应的超时间，默认为60秒。
proxy_ignore_client_abort on;  #客户端断网时，nginx服务器是否中断对被代理服务器的请求。默认为off。
```
5. 如果使用upstream指令配置了一组服务器作为被代理服务器，服务器中的访问算法遵循配置的负载均衡规则，同时可以使用该指令配置在发生哪些异常情况时，将请求顺次交由下一组服务器处理。
```conf
proxy_next_upstream timeout;  #反向代理upstream中设置的服务器组出现故障时，被代理服务器返回的状态值。
```
状态值可以是：error|timeout|invalid_header|http_500|http_502|http_503|http_504|http_404|off
- error：建立连接或向被代理的服务器发送请求或读取响应信息时服务器发生错误。
- timeout：建立连接，想被代理服务器发送请求或读取响应信息时服务器发生超时。
- invalid_header:被代理服务器返回的响应头异常。
- off:无法将请求分发给被代理的服务器。
- http_400，....:被代理服务器返回的状态码为400，500，502，等。

6. 如果你想通过http获取客户的真实ip而不是获取代理服务器的ip地址，那么要做如下的设置。
```conf
proxy_set_header Host $host; #只要用户在浏览器中访问的域名绑定了 VIP VIP 下面有RS；则就用$host ；host是访问URL中的域名和端口  www.taobao.com:80
proxy_set_header X-Real-IP $remote_addr;  #把源IP 【$remote_addr,建立HTTP连接header里面的信息】赋值给X-Real-IP;这样在代码中 $X-Real-IP来获取 源IP
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;#在nginx 作为代理服务器时，设置的IP列表，会把经过的机器ip，代理机器ip都记录下来，用 【，】隔开；代码中用 echo $x-forwarded-for |awk -F, '{print $1}' 来作为源IP
```
7. 下面是我的一个关于代理配置的配置文件部分，仅供参考。
```conf
include       mime.types;   #文件扩展名与文件类型映射表
default_type  application/octet-stream; #默认文件类型，默认为text/plain
#access_log off; #取消服务日志    
log_format myFormat ' $remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
access_log log/access.log myFormat;  #combined为日志格式的默认值
sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。
proxy_connect_timeout 1;   #nginx服务器与被代理的服务器建立连接的超时时间，默认60秒
proxy_read_timeout 1; #nginx服务器想被代理服务器组发出read请求后，等待响应的超时间，默认为60秒。
proxy_send_timeout 1; #nginx服务器想被代理服务器组发出write请求后，等待响应的超时间，默认为60秒。
proxy_http_version 1.0 ; #Nginx服务器提供代理服务的http协议版本1.0，1.1，默认设置为1.0版本。
#proxy_method get;    #支持客户端的请求方法。post/get；
proxy_ignore_client_abort on;  #客户端断网时，nginx服务器是否终端对被代理服务器的请求。默认为off。
proxy_ignore_headers "Expires" "Set-Cookie";  #Nginx服务器不处理设置的http相应投中的头域，这里空格隔开可以设置多个。
proxy_intercept_errors on;    #如果被代理服务器返回的状态码为400或者大于400，设置的error_page配置起作用。默认为off。
proxy_headers_hash_max_size 1024; #存放http报文头的哈希表容量上限，默认为512个字符。
proxy_headers_hash_bucket_size 128; #nginx服务器申请存放http报文头的哈希表容量大小。默认为64个字符。
proxy_next_upstream timeout;  #反向代理upstream中设置的服务器组，出现故障时，被代理服务器返回的状态值。error|timeout|invalid_header|http_500|http_502|http_503|http_504|http_404|off
#proxy_ssl_session_reuse on; 默认为on，如果我们在错误日志中发现“SSL3_GET_FINSHED:digest check failed”的情况时，可以将该指令设置为off。
```
## Nginx 负载均衡详解
首先给大家说下upstream这个配置，这个配置是写一组被代理的服务器地址，然后配置负载均衡的算法。这里的被代理服务器地址有2种写法。
```conf
upstream mysvr { 
    server 192.168.10.121:3333;
    server 192.168.10.122:3333;
}
server {
    ....
    location  ~*^.+$ {         
        proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表         
    }
}
```
然后，就来点实战的东西。

1. **热备**：如果你有2台服务器，当一台服务器发生事故时，才启用第二台服务器给提供服务。服务器处理请求的顺序：AAAAAA突然A挂啦，BBBBBBBBBBBBBB.....
```conf
upstream mysvr { 
    server 127.0.0.1:7878; 
    server 192.168.10.121:3333 backup;  #热备     
}
```
2. **轮询**：nginx默认就是轮询其权重都默认为1，服务器处理请求的顺序：ABABABABAB....
```conf
upstream mysvr { 
    server 127.0.0.1:7878;
    server 192.168.10.121:3333;       
}
```
3. **加权轮询**：跟据配置的权重的大小而分发给不同服务器不同数量的请求。如果不设置，则默认为1。下面服务器的请求顺序为：ABBABBABBABBABB....
```conf
upstream mysvr { 
    server 127.0.0.1:7878 weight=1;
    server 192.168.10.121:3333 weight=2;
}
```
4. **ip_hash**：nginx会让相同的客户端ip请求相同的服务器。
```conf
upstream mysvr { 
    server 127.0.0.1:7878; 
    server 192.168.10.121:3333;
    ip_hash;
}
```
5. 关于nginx负载均衡配置的几个状态参数讲解。
- down: 表示当前的server暂时不参与负载均衡。
- backup: 预留的备份机器。当其他所有的非backup机器出现故障或者忙的时候，才会请求backup机器，因此这台机器的压力最轻。
- max_fails:允许请求失败的次数，默认为1。当超过最大次数时，返回proxy_next_upstream 模块定义的错误。
- fail_timeout: 在经历了max_fails次失败后，暂停服务的时间。max_fails可以和fail_timeout一起使用。
```conf
upstream mysvr { 
    server 127.0.0.1:7878 weight=2 max_fails=2 fail_timeout=2;
    server 192.168.10.121:3333 weight=1 max_fails=2 fail_timeout=1;    
}
```
到这里应该可以说nginx的内置负载均衡算法已经没有货啦。如果你像跟多更深入的了解nginx的负载均衡算法，nginx官方提供一些插件大家可以了解下。

# nginx添加模块
可以通过`nginx -V`命令来查看安装了那些模块

## 给已编译安装完成后的nginx添加模块
本人nginx第一次编译安装时只安装了两个模块，但是在后面学习的时候发现不够用了，去查了一下如何在已经编译安装的基础上添加新的模块，总结如下：

5个步骤实现
1. 进入nginx编译安装的目录
这里的目录是指解压后的源码包里，例如：nginx-1.19.0
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511174909.png" width="700px"/>

2. 执行编译
执行编译前的配置（configure的配置），添加需要的模块，我这里执行的是下面这条语句，按需添加即可，不一定按照我的写
```shell
./configure --prefix=/usr/local/nginx --add-module=第三方模块的目录 
```
可以使用 ./configure --help 命令查询有哪些模块

3. 执行make命令
执行make命令编译，不要执行make install，否则会把之前的nginx全部覆盖

4. 停止服务并替换命令
先停止正在运行的nginx的服务（若不在运行则无视）: `nginx -s stop`
将make之后产生的nginx命令复制到nginx目录
make之后产生的nginx的位置是：objs（如果这个文件夹里没有，那就再sbin里面）
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511175038.png" width="700px"/>

5. 验证是否完成，如果生效会列出新增的模块
```shell
nginx -V
```
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511175134.png" width="700px"/>

## 给通过apt-get安装的nginx添加模块
首先，要知道你原安装的nginx版本，以及原来安装的模块
```shell
/usr/sbin/nginx -V
```
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210511180241.png" width="700px"/>

然后去官网下载一个相同版本的源码包,解压
```shell
cd /opt
tar -xvf nginx-1.14.0.tar.gz
```

进入解压后的源码包,编译
```shell
cd nginx-1.14.0
# 加上你已有的模块，和想要添加的模块
sudo ./configure \
--with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-GkiujU/nginx-1.14.0=. -fstack-
protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -
D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro -Wl,-z,now -
fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-
path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-
path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-
path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-
fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --
http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --
with-debug --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --
with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-
http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --
with-http_geoip_module=dynamic --with-http_gunzip_module --with-http_gzip_static_module 
--with-http_image_filter_module=dynamic --with-http_sub_module --with-
http_xslt_module=dynamic --with-stream=dynamic --with-stream_ssl_module --with-
mail=dynamic --with-mail_ssl_module \  #之前已有
--add-module=/opt/fastdfs-nginx-module-master/src #后来添加，记住是src目录
```

编译完成后执行(不要 make install,不要 make install,不要 make install)
```shell
sudo make
```

替换nginx二进制文件(备份备份备份):
```shell
cp /usr/sbin/nginx /usr/sbin/nginx.bak #备份
cp ./objs/nginx /usr/local/nginx/sbin/ #make编译过后的nginx，替换系统安装
```

添加成功

# nginx解决跨域
由于跨域问题**只**发生在浏览器上， 所以nginx服务器访问其他服务器资源是不存在跨域问题的。
所以当我们不能修改要访问的服务器后端代码，即不能在要访问的服务器上使用CORS来解决跨域问题时， 我们可以让nginx服务器访问这个服务器，此时浏览器就只需要访问nginx服务器即可，但是，虽然nginx服务器与其他服务器资源不存在跨域问题，但是浏览器与nginx服务器之间还是存在跨域问题，如下：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210512224737.png" width="700px"/>

不过，我们可以修改nginx服务器的配置（使用CORS），来解决跨域问题，这就是为什么要引入nginx的原因， 有关在nginx上使用CORS的配置如下：

```conf
server {
		listen       8082;
		server_name  localhost;

		#charset koi8-r;

		#access_log  logs/host.access.log  main;

		location / {
			proxy_pass http://localhost:8081;
			if ($request_method = 'GET') {
				add_header Access-Control-Allow-Origin http://localhost:3000;
				add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS,PUT';
				add_header Access-Control-Allow-Credentials true;
				add_header 'Access-Control-Allow-Headers' 'Cookie,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
			}
			if ($request_method = 'POST') {
				add_header Access-Control-Allow-Origin http://localhost:3000;
				add_header Access-Control-Allow-Methods GET,POST,OPTIONS,DELETE,PUT;
				add_header Access-Control-Allow-Credentials true;
				add_header 'Access-Control-Allow-Headers' 'Cookie,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
			}
			if ($request_method = 'DELETE') {
				add_header Access-Control-Allow-Origin http://localhost:3000;
				add_header Access-Control-Allow-Methods GET,POST,OPTIONS,DELETE,PUT;
				add_header Access-Control-Allow-Credentials true;
				add_header 'Access-Control-Allow-Headers' 'Cookie,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
			}
			if ($request_method = 'PUT') {
				add_header Access-Control-Allow-Origin http://localhost:3000;
				add_header Access-Control-Allow-Methods GET,POST,OPTIONS,DELETE,PUT;
				add_header Access-Control-Allow-Credentials true;
				add_header 'Access-Control-Allow-Headers' 'Cookie,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
			}
			if ($request_method = 'OPTIONS') {
				add_header 'Access-Control-Allow-Origin' http://localhost:3000;
				add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, DELETE,PUT';
				add_header Access-Control-Allow-Credentials true;
				#
				# Custom headers and headers various browsers *should* be OK with but aren't
				#
				add_header 'Access-Control-Allow-Headers' 'Cookie,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
				#
				# Tell client that this pre-flight info is valid for 20 days
				#
				add_header 'Access-Control-Max-Age' 2;
				add_header 'Content-Type' 'text/plain charset=UTF-8';
				add_header 'Content-Length' 0;
				return 204;
			}
		}
}

```

注：当nginx服务器向其他资源服务器发送请求时，如果该请求对应的响应状态码为4xx,或5xx时, 则浏览器仍会报如下错误：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210513184615.png" width="700px"/>

此时通过nginx的access.log查看可知，nginx发送请求的对应的响应状态码为500，表明资源服务器出现问题
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210513184732.png" width="700px"/>


# nginx原理
<font color="red">Nginx 在启动后，每一个server会对应一个master进程， master进程所占用的端口号为它所要监听的端口号</font>； 证明如下：

nginx配置文件
```
events{

}

http {
  server {
    listen 8030;
  }
  server {
    listen 8031;
  }
  server {
    listen 8032;
  }
}
```
启动nginx后，使用`netstat -lntup`查看端口占用情况，如下：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210512174904.png" width="700px"/>

## server_name的作用
server_name 为虚拟服务器的识别路径。因此不同的域名会通过请求头中的HOST字段，匹配到特定的server块，转发到对应的应用服务器中去。
<font color="red">注：nginx只能监听本机的端口，不能监听其他机器的，所以server_name设置成其他机器的ip是没有作用，还是使用的本机ip</font>

**案例**
修改nginx.conf
```conf
server {
	listen 80;
	server_name www;
	location / {
		default_type text/html;
		content_by_lua '
			ngx.say("<p>first</p>")
		';
	}
}
 
server {
	listen  80;
	server_name www.zkh.com;
	location / {
		default_type text/html;
		content_by_lua '
			ngx.say("<p>second</p>")
		';        
	}
}
 
server {
	listen 80;
	server_name www.zkh.*;
	location / {
		default_type text/html;
		content_by_lua '
			ngx.say("<p>third</p>")
		';
 
	}
}
 
server {
	listen 80;
	server_name ~\w+.com;
	location / {
		default_type text/html;
		content_by_lua '
			ngx.say("<p>forth</p>")
		';        
	}
}
 
server {
	listen 80;
	server_name ~.*zkh.com;
	location / {
		default_type text/html;
		content_by_lua '
			ngx.say("<p>fifth</p>")
		';
	}
}
```
修改hosts文件
```
118.126.100.138 www.zkh.com
118.126.100.138 www.zkh.org
118.126.100.138 zkh.com
118.126.100.138 zkh.org
```
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210512175600.png" width="700px"/>

### 匹配顺序
server_name与host匹配优先级如下：
1、完全匹配
2、通配符在前的，如*.test.com
3、在后的，如www.test.*
4、正则匹配，如~^\.www\.test\.com$
如果都不匹配
1、优先选择listen配置项后有default或default_server的
2、找到匹配listen端口的第一个server块