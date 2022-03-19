
# 简介
所谓网页抓取，就是把URL地址中指定的网络资源从网络流中抓取出来。在Python中有很多库可以用来抓取网页，我们先学习`urllib2`。

> urllib2 是 Python2.7 自带的模块(不需要下载，导入即可使用)
urllib2 官方文档：https://docs.python.org/2/library/urllib2.html
urllib2 源码：https://hg.python.org/cpython/file/2.7/Lib/urllib2.py

**在python3中，urllib2 被改为urllib.request**
urllib.request中常用方法：
- `urlopen函数`
- `Request函数`
- `urlretrieve函数`
- `HTTPHandler函数`
- `HTTPSHandler函数`
- `ProxyHandler函数`
- `build_opener函数` 
- `install_opener函数`
- `HTTPCookieProcessor函数`

urllib.parse中常用的方法：
- `urlencode函数`
- `parse_qs函数`
- `urlsplit函数`
- `urlparse函数`

# urlopen函数
我们先来段代码：
```python
# 导入urllib2 库
import urllib.request

# 向指定的url发送请求，并返回服务器响应的类文件对象，这句代码一执行完，这个session就结束了
response = urllib.request.urlopen("http://www.baidu.com/")

# 类文件对象支持 文件对象的操作方法，如read()方法读取文件全部内容，返回字符串
html = response.read()
html1 = response.read().decode('utf-8')

# 打印字符串
print(html)
```
执行写的python代码，将打印结果

实际上，如果我们在浏览器上打开百度主页， 右键选择“查看源代码”，你会发现，跟我们刚才打印出来的是一模一样。也就是说，上面的4行代码就已经帮我们把百度的首页的全部代码爬了下来。

以下对urlopen函数的进行详细讲解：
1. url：请求的url。
2. data：请求的data，如果设置了这个值，那么将变成post请求。
3. 返回值：返回值是一个http.c1ient.HTTPResponse对象，这个对象是一个类文件句柄对象。

**http.client.HTTPResponse对象中常用方法**
- read(): 返回内容
- getcode(): 返回响应码
- geturl(): 返回实际数据的实际url，防止重定向问题
- info(): 返回响应报文的报头

# Request函数
在我们第一个例子里，urlopen()的参数就是一个url地址；

但是如果需要执行更复杂的操作，比如增加HTTP报头，必须创建一个 Request 实例来作为urlopen()的参数；而需要访问的url地址则作为 Request 实例的参数。

我们编辑urllib2_request.py
```python
import urllib.request

# url 作为Request()方法的参数，构造并返回一个Request对象
request = urllib.request.Request("http://www.baidu.com/")

# Request对象作为urlopen()方法的参数，发送给服务器并接收响应
response = urllib.request.urlopen(request)

html = response.read().decode('utf-8')

print(html)
```

运行结果是完全一样的：

新建Request实例，除了必须要有 url 参数之外，还可以设置另外两个参数：
1. data（默认空）：是伴随 url 提交的数据（比如要post的数据），同时 HTTP 请求将从 "GET"方式 改为 "POST"方式。
2. headers（默认空）：是一个字典，包含了需要发送的HTTP报头的键值对。
这两个参数下面会说到。

# urlretrieve函数：
这个函数可以方便的将网页上的一个文件保存到本地。以下代码可以非常方便的将百度的首页下载到本地：
```python
from urllib import request
request.urlretrieve（'http://www.baidu.com/'，'baidu.html'）
```

# urlencode函数：
用浏览器发送请求的时候，如果url中包含了中文或者其他特殊字符，那么浏览器会自动的给我们进行编码。而如果使用代码发送请求，那么就必须手动的进行编码，这时候就应该使用urlencode函数来实现。urlencode 可以把**字典数据**转换为uRL编码的数据。
示例代码如下：
```python
from urllib import parse 
data={'name'：“爬出基础”，‘greet'：‘hello world'，‘age'：180}
as=parse.urlencode(data)
print(qs)
```

输出：`name=E7%88%ACXE8%99%ABXE5%9F%BA%E7%A1%808greet=hel1o+world&age=18e`

# parse_qs函数：
可以将经过编码后的url参数进行解码。示例代码如下：
```python
from ur11ib import parse 
q5=“name=E7%88%ACXE8%99%ABXE5%9F%BA%E7%A1%808greet=hel1o+world&age=18e°
print(parse.parse_qs(as))
```

输出:`{'name'：“爬出基础”，‘greet'：‘hello world'，‘age'：180}`

# urlparse 和urlsplit：
有时候拿到一个url，想要对这个url中的各个组成部分进行分割，那么这时候就可以使用urlparse或者是ur1sp1it来进行分割。urlparse 和urlsplit基本上是一模一样的。唯一不一样的地方是，urlparse 里面多了一个params 属性，而urlsplit没有这个params属性。比如有一个url为：url=
`http://www.baidu.com/s;hel1o?wdepython&usernamesabc#1`，那么urlparse可以获取到hello，而urlsplit不可以获取到。url中的params也用得比较少。示例代码如下：

```python
from urllib import request, parse
url=‘http://ww.baidu.com/s？username=zhiliao'

result=parse.urlsplit(url)
#result =parse.urlparse(url)
print(result)

print（'scheme:"，result.scheme）
print（"netloc:'，result.netloc）
print（"path:'，result.path）
print（'query:"，result.query）
```

# 添加Header信息
在 HTTP Request 中加入特定的 Header，来构造一个完整的HTTP请求消息。
可以通过调用`Request.add_header()` 添加/修改一个特定的header 也可以通过调用`Request.get_header()`来查看已有的header。

**添加一个特定的header**
```python
from urllib import request

url = "http://www.itcast.cn"

#IE 9.0 的 User-Agent
header = {"User-Agent" : "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;"} 
req = request.Request(url, headers = header)

#也可以通过调用Request.add_header() 添加/修改一个特定的header
req.add_header("Connection", "keep-alive")

# 也可以通过调用Request.get_header()来查看header信息
# request.get_header(header_name="Connection")

response = request.urlopen(req)

print(response.code)     #可以查看响应状态码
html = response.read()

print(html)
```

**随机添加/修改User-Agent**
```python
from urllib import request
import random

url = "http://www.itcast.cn"

ua_list = [
    "Mozilla/5.0 (Windows NT 6.1; ) Apple.... ",
    "Mozilla/5.0 (X11; CrOS i686 2268.111.0)... ",
    "Mozilla/5.0 (Macintosh; U; PPC Mac OS X.... ",
    "Mozilla/5.0 (Macintosh; Intel Mac OS... "
]

user_agent = random.choice(ua_list)

request = request.Request(url)

#也可以通过调用Request.add_header() 添加/修改一个特定的header
request.add_header("User-Agent", user_agent)

# get_header()的字符串参数，第一个字母大写，后面的全部小写
request.get_header("User-agent")

response = request.urlopen(request)

html = response.read()
print(html)
```

# Handler处理器和自定义Opener
- opener是 urllib2.OpenerDirector 的实例，我们之前一直都在使用的urlopen，它是一个特殊的opener（也就是模块帮我们构建好的）。
- 但是基本的urlopen()方法不支持代理、cookie等其他的HTTP/HTTPS高级功能。所以要支持这些功能：
  1. 使用相关的 `Handler处理器` 来创建特定功能的处理器对象；
  2. 然后通过 `request.build_opener()`方法使用这些处理器对象，创建自定义opener对象；
  3. 使用自定义的opener对象，调用`open()`方法发送请求。
- 如果程序里所有的请求都使用自定义的opener，可以使用`request.install_opener()` 将自定义的 opener 对象 定义为 全局opener，表示如果之后凡是调用urlopen，都将使用这个opener（根据自己的需求来选择）

## 简单的自定义opener()
```python
from urlib import request

# 构建一个HTTPHandler 处理器对象，支持处理HTTP请求
http_handler = request.HTTPHandler()

# 构建一个HTTPHandler 处理器对象，支持处理HTTPS请求
# http_handler = urllib2.HTTPSHandler()

# 调用urllib2.build_opener()方法，创建支持处理HTTP请求的opener对象
opener = request.build_opener(http_handler)

# 构建 Request请求
request = request.Request("http://www.baidu.com/")

# 调用自定义opener对象的open()方法，发送request请求
response = opener.open(request)

# 获取服务器响应内容
print(response.read())
```

这种方式发送请求得到的结果，和使用`urllib2.urlopen()`发送HTTP/HTTPS请求得到的结果是一样的。

如果在 HTTPHandler()增加 `debuglevel=1`参数，还会将 Debug Log 打开，这样程序在执行的时候，会把收包和发包的报头在屏幕上自动打印出来，方便调试，有时可以省去抓包的工作。
```python
# 仅需要修改的代码部分：

# 构建一个HTTPHandler 处理器对象，支持处理HTTP请求，同时开启Debug Log，debuglevel 值默认 0
http_handler = urllib2.HTTPHandler(debuglevel=1)

# 构建一个HTTPHSandler 处理器对象，支持处理HTTPS请求，同时开启Debug Log，debuglevel 值默认 0
https_handler = urllib2.HTTPSHandler(debuglevel=1)
```

## ProxyHandler处理器(代理设置)
使用代理IP，这是爬虫/反爬虫的第二大招，通常也是最好用的。
很多网站会检测某一段时间某个IP的访问次数(通过流量统计，系统日志等)，如果访问次数多的不像正常人，它会禁止这个IP的访问。
所以我们可以设置一些代理服务器，每隔一段时间换一个代理，就算IP被禁止，依然可以换个IP继续爬取。
urllib2中通过ProxyHandler来设置使用代理服务器，下面代码说明如何使用自定义opener来使用代理：
```python
from urlib import request

# 构建了两个代理Handler，一个有代理IP，一个没有代理IP
httpproxy_handler = request.ProxyHandler({"http" : "124.88.67.81:80"})
nullproxy_handler = request.ProxyHandler({})

# 代理开关，表示是否启用代理
proxySwitch = True

# 通过 urllib2.build_opener()方法使用这些代理Handler对象，创建自定义opener对象
# 根据代理开关是否打开，使用不同的代理模式
if proxySwitch:  
    opener = request.build_opener(httpproxy_handler)
else:
    opener = request.build_opener(nullproxy_handler)

req = request.Request("http://httpbin.org/ip")

# 1. 如果这么写，只有使用opener.open()方法发送请求才使用自定义的代理，而urlopen()则不使用自定义代理。
response = opener.open(req)

# 2. 如果这么写，就是将opener应用到全局，之后所有的，不管是opener.open()还是urlopen() 发送请求，都将使用自定义代理。
# request.install_opener(opener)
# response = urlopen(req)

print(response.read())
```

免费的开放代理获取基本没有成本，我们可以在一些代理网站上收集这些免费代理，测试后如果可以用，就把它收集起来用在爬虫上面。

免费短期代理网站举例：
- [西刺免费代理IP](http://www.xicidaili.com/)
- [快代理免费代理](http://www.kuaidaili.com/free/inha/)
- [Proxy360代理](http://www.proxy360.cn/default.aspx)
- [全网代理IP](http://www.goubanjia.com/free/index.shtml)

如果代理IP足够多，就可以像随机获取User-Agent一样，随机选择一个代理去访问网站。
```python
from urlib import request
import random

proxy_list = [
    {"http" : "124.88.67.81:80"},
    {"http" : "124.88.67.81:80"},
    {"http" : "124.88.67.81:80"},
    {"http" : "124.88.67.81:80"},
    {"http" : "124.88.67.81:80"}
]

# 随机选择一个代理
proxy = random.choice(proxy_list)
# 使用选择的代理构建代理处理器对象
httpproxy_handler = request.ProxyHandler(proxy)

opener = request.build_opener(httpproxy_handler)

request = request.Request("http://www.baidu.com/")
response = opener.open(request)
print (response.read())
```

但是，这些免费开放代理一般会有很多人都在使用，而且代理有寿命短，速度慢，匿名度不高，HTTP/HTTPS支持不稳定等缺点（免费没好货）。
所以，专业爬虫工程师或爬虫公司会使用高品质的私密代理，这些代理通常需要找专门的代理供应商购买，再通过用户名/密码授权使用（舍不得孩子套不到狼）。

# cookielib库和HTTPCookieProcessor处理器
在Python处理Cookie，一般是通过`cookielib`模块和 urllib2模块的`HTTPCookieProcessor`处理器类一起使用。

`cookielib模块`：主要作用是提供用于存储cookie的对象
`HTTPCookieProcessor处理器`：主要作用是处理这些cookie对象，并构建handler对象。

## cookielib库
该模块主要的对象有CookieJar、FileCookieJar、MozillaCookieJar、LWPCookieJar。

- `CookieJar`：管理HTTP cookie值、存储HTTP请求生成的cookie、向传出的HTTP请求添加cookie的对象。整个cookie都存储在内存中，对CookieJar实例进行垃圾回收后cookie也将丢失。
- `FileCookieJar(filename,delayload=None,policy=None)`：从CookieJar派生而来，用来创建FileCookieJar实例，检索cookie信息并将cookie存储到文件中。filename是存储cookie的文件名。delayload为True时支持延迟访问访问文件，即只有在需要时才读取文件或在文件中存储数据。
- `MozillaCookieJar(filename,delayload=None,policy=None)`：从FileCookieJar派生而来，创建与`Mozilla浏览器 cookies.txt兼容`的FileCookieJar实例。
- `LWPCookieJar(filename,delayload=None,policy=None)`：从FileCookieJar派生而来，创建与`libwww-perl标准的 Set-Cookie3 文件格式`兼容的FileCookieJar实例。

**其实大多数情况下，我们只用CookieJar()，如果需要和本地文件交互，就用 MozillaCookjar() 或 LWPCookieJar()**

我们来做几个案例：
**1. 获取Cookie，并保存到CookieJar()对象中**
```python
from urllib import request
from http.cookiejar import CookieJar

# 构建一个CookieJar对象实例来保存cookie
cookiejar = CookieJar()

# 使用HTTPCookieProcessor()来创建cookie处理器对象，参数为CookieJar()对象
handler=request.HTTPCookieProcessor(cookiejar)

# 通过 build_opener() 来构建opener
opener = request.build_opener(handler)

# 以get方法访问页面，访问之后会自动保存cookie到cookiejar中
opener.open("http://www.baidu.com")

## 可以按标准格式将保存的Cookie打印出来
cookieStr = ""
for item in cookiejar:
    cookieStr = cookieStr + item.name + "=" + item.value + ";"

## 舍去最后一位的分号
print(cookieStr[:-1])
```

我们使用以上方法将Cookie保存到cookiejar对象中，然后打印出了cookie中的值，也就是访问百度首页的Cookie值。

运行结果如下：
```
BAIDUID=4327A58E63A92B73FF7A297FB3B2B4D0:FG=1;BIDUPSID=4327A58E63A92B73FF7A297FB3B2B4D0;H_PS_PSSID=1429_21115_17001_21454_21409_21554_21398;PSTM=1480815736;BDSVRTM=0;BD_HOME=0
```

**2. 访问网站获得cookie，并把获得的cookie保存在cookie文件中**
```python
from urllib import request
from http.cookiejar import MozillaCookieJar

# 保存cookie的本地磁盘文件名
filename = 'cookie.txt'

# 声明一个MozillaCookieJar(有save实现)对象实例来保存cookie，之后写入文件
cookiejar = MozillaCookieJar(filename)

# 使用HTTPCookieProcessor()来创建cookie处理器对象，参数为CookieJar()对象
handler = request.HTTPCookieProcessor(cookiejar)

# 通过 build_opener() 来构建opener
opener = request.build_opener(handler)

# 创建一个请求，原理同urllib2的urlopen
response = opener.open("http://www.httpbin.org/cookies/set?cource=abc")

# 保存cookie到本地文件, 其中ignore_discard=True的作用是将过期 的cookies也保存
cookiejar.save(ignore_discard=True)
```

**3. 从文件中获取cookies，做为请求的一部分去访问**
```python
from urllib import request
from http.cookiejar import MozillaCookieJar

# 创建MozillaCookieJar(有load实现)实例对象
cookiejar = MozillaCookieJar()

# 从文件中读取cookie内容到变量
cookie.load('cookie.txt'，ignore_discard=True)

# 使用HTTPCookieProcessor()来创建cookie处理器对象，参数为CookieJar()对象
handler = request.HTTPCookieProcessor(cookiejar)

# 通过 build_opener() 来构建opener
opener = request.build_opener(handler)

response = opener.open("http://www.baidu.com")
```

**4. 利用cookielib和post登录人人网**
```python
from urllib import request
from http.cookiejar import CookieJar

# 构建一个CookieJar对象实例来保存cookie
cookiejar = CookieJar()

# 2. 使用HTTPCookieProcessor()来创建cookie处理器对象，参数为CookieJar()对象
cookie_handler = request.HTTPCookieProcessor(cookiejar)

# 3. 通过 build_opener() 来构建opener
opener = request.build_opener(cookie_handler)

# 4. addheaders 接受一个列表，里面每个元素都是一个headers信息的元祖, opener将附带headers信息
opener.addheaders = [("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36")]

# 5. 需要登录的账户和密码
data = {"email":"mr_mao_hacker@163.com", "password":"alaxxxxxime"}  

# 6. 通过urlencode()转码
postdata = request.urlencode(data)

# 7. 构建Request请求对象，包含需要发送的用户名和密码
request = request.Request("http://www.renren.com/PLogin.do", data = postdata)

# 8. 通过opener发送这个请求，并获取登录后的Cookie值，
opener.open(request)

# 9. opener包含用户登录后的Cookie值，可以直接访问那些登录后才可以访问的页面
response = opener.open("http://www.renren.com/410043129/profile")  

# 10. 打印响应内容
print(response.read())
```

模拟登录要注意几点：
1. 登录一般都会先有一个HTTP GET，用于拉取一些信息及获得Cookie，然后再HTTP POST登录。
2. HTTP POST登录的链接有可能是动态的，从GET返回的信息中获取。
3. password 有些是明文发送，有些是加密后发送。有些网站甚至采用动态加密的，同时包括了很多其他数据的加密信息，只能通过查看JS源码获得加密算法，再去破解加密，非常困难。
4. 大多数网站的登录整体流程是类似的，可能有些细节不一样，所以不能保证其他网站登录成功。

当然，我们也可以直接发送账号密码到登录界面模拟登录，但是当网页采用JavaScript动态技术以后，想封锁基于HttpClient的模拟登录就太容易了，甚至可以根据你的鼠标活动的特征准确地判断出是不是真人在操作。所以，想做通用的模拟登录还得选别的技术，比如用内置浏览器引擎的爬虫(关键词：Selenium ，PhantomJS)，这个我们将在以后会学习到。