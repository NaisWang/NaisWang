
# Scrapy框架
- Scrapy是用纯Python实现一个为了爬取网站数据、提取结构性数据而编写的应用框架，用途非常广泛。
- 框架的力量，用户只需要定制开发几个模块就可以轻松的实现一个爬虫，用来抓取网页内容以及各种图片，非常之方便。
- Scrapy 使用了 Twisted`['twɪstɪd]`(其主要对手是Tornado)异步网络框架来处理网络通讯，可以加快我们的下载速度，不用自己去实现异步框架，并且包含了各种中间件接口，可以灵活的完成各种需求。

# Scrapy架构图
(绿线是数据流向)
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210605153918.png" width="700px"/>

- `Scrapy Engine(引擎)`: 负责`Spider`、`ItemPipeline`、`Downloader`、`Scheduler`中间的通讯，信号、数据传递等。
- `Scheduler(调度器)`: 它负责接受`引擎`发送过来的Request请求，并按照一定的方式进行整理排列，入队，当`引擎`需要时，交还给`引擎`。
- `Downloader（下载器）`：负责下载`Scrapy Engine(引擎)`发送的所有Requests请求，并将其获取到的Responses交还给`Scrapy Engine(引擎)`，由`引擎`交给`Spider`来处理，
- `Spider（爬虫）`：它负责处理所有Responses,从中分析提取数据，获取Item字段需要的数据，并将需要跟进的URL提交给`引擎`，再次进入`Scheduler(调度器)`，
- `Item Pipeline(管道)`：它负责处理`Spider`中获取到的Item，并进行进行后期处理（详细分析、过滤、存储等）的地方.
- `Downloader Middlewares（下载中间件）`：你可以当作是一个可以自定义扩展下载功能的组件。
- `Spider Middlewares（Spider中间件）`：你可以理解为是一个可以自定扩展和操作`引擎`和`Spider`中间`通信`的功能组件（比如进入`Spider`的Responses;和从`Spider`出去的Requests）

## Scrapy的运作流程

代码写好，程序开始运行...

1. `引擎`：Hi！`Spider`, 你要处理哪一个网站？
2. `Spider`：老大要我处理xxxx.com。
3. `引擎`：你把第一个需要处理的URL给我吧。
4. `Spider`：给你，第一个URL是xxxxxxx.com。
5. `引擎`：Hi！`调度器`，我这有request请求你帮我排序入队一下。
6. `调度器`：好的，正在处理你等一下。
7. `引擎`：Hi！`调度器`，把你处理好的request请求给我。
8. `调度器`：给你，这是我处理好的request
9. `引擎`：Hi！下载器，你按照老大的`下载中间件`的设置帮我下载一下这个request请求
10. `下载器`：好的！给你，这是下载好的东西。（如果失败：sorry，这个request下载失败了。然后`引擎`告诉`调度器`，这个request下载失败了，你记录一下，我们待会儿再下载）
11. `引擎`：Hi！`Spider`，这是下载好的东西，并且已经按照老大的`下载中间件`处理过了，你自己处理一下（注意！这儿responses默认是交给`def parse()`这个函数处理的）
12. `Spider`：（处理完毕数据之后对于需要跟进的URL），Hi！`引擎`，我这里有两个结果，这个是我需要跟进的URL，还有这个是我获取到的Item数据。
13. `引擎`：Hi ！`管道` 我这儿有个item你帮我处理一下！`调度器`！这是需要跟进URL你帮我处理下。然后从第四步开始循环，直到获取完老大需要全部信息。
14. `管道``调度器`：好的，现在就做！

**注意！只有当调度器中不存在任何request了，整个程序才会停止，（也就是说，对于下载失败的URL，Scrapy也会重新下载。）**

制作 Scrapy 爬虫 一共需要4步：

- 新建项目 (scrapy startproject xxx)：新建一个新的爬虫项目
- 明确目标 （编写items.py）：明确你想要抓取的目标
- 制作爬虫 （spiders/xxspider.py）：制作爬虫开始爬取网页
- 存储内容 （pipelines.py）：设计管道存储爬取内容

## 入门案例

安装和文档：

1. 安装：通过pip install scrapy即可安装。
2. Scrapy官方文档：http://doc.scrapy.org/en/latest
3. Scrapy中文文档：http://scrapy-chs.readthedocs.io/zh_CN/latest/index.html
4. 注意：
   1. 在ubuntu上安装scrapy之前，需要先安装以下依赖：
      sudo apt-get install python-dev python-pip 1ibxml2-dev 1ibxslt1-dev z1iblg-dev 1ibffi-dev libss1-dev，然后再通过pip install scrapy 安装。
   2. 如果在windous系统下，提示这个错误ModulelNlotFoundError:No module named 'win32api'，那么使用以下命令可以解决：pip install pypiwin32。

学习目标

- 创建一个Scrapy项目
- 定义提取的结构化数据(Item)
- 编写爬取网站的 Spider 并提取出结构化数据(Item)
- 编写 Item Pipelines 来存储提取到的Item(即结构化数据)

一. 新建项目(scrapy startproject)

- 在开始爬取之前，必须创建一个新的Scrapy项目。进入自定义的项目目录中，运行下列命令：

```shell
scrapy startproject mySpider
```

- 其中， mySpider 为项目名称，可以看到将会创建一个 mySpider 文件夹，目录结构大致如下：

![img](http://www.nikola.ltd/s/python/Spider/file/images/7.2.png)

下面来简单介绍一下各个主要文件的作用：

> scrapy.cfg ：项目的配置文件
>
> mySpider/ ：项目的Python模块，将会从这里引用代码
>
> mySpider/items.py ：项目的目标文件
>
> mySpider/pipelines.py ：项目的管道文件
>
> mySpider/settings.py ：项目的设置文件
>
> mySpider/spiders/ ：存储爬虫代码目录

二、明确目标(mySpider/items.py)

我们打算抓取：http://www.itcast.cn/channel/teacher.shtml 网站里的所有讲师的姓名、职称和个人信息。

1. 打开mySpider目录下的items.py
2. Item 定义结构化数据字段，用来保存爬取到的数据，有点像Python中的dict，但是提供了一些额外的保护减少错误。
3. 可以通过创建一个 scrapy.Item 类， 并且定义类型为 scrapy.Field的类属性来定义一个Item（可以理解成类似于ORM的映射关系）。
4. 接下来，创建一个ItcastItem 类，和构建item模型（model）。

```python
import scrapy

class ItcastItem(scrapy.Item):
    name = scrapy.Field()
    level = scrapy.Field()
    info = scrapy.Field()
```

三、制作爬虫 （spiders/itcastSpider.py）

**爬虫功能要分两步：**

1. 爬数据

- 在当前目录下输入命令，将在`mySpider/spider`目录下创建一个名为`itcast`的爬虫，并指定爬取域的范围：

```
scrapy genspider itcast "itcast.cn"
```

- 打开 mySpider/spider目录里的 itcast.py，默认增加了下列代码:

```python
import scrapy

class ItcastSpider(scrapy.Spider):
    name = "itcast"
    allowed_domains = ["itcast.cn"]
    start_urls = (
        'http://www.itcast.cn/',
    )

    def parse(self, response):
        pass
```

其实也可以由我们自行创建itcast.py并编写上面的代码，只不过使用命令可以免去编写固定代码的麻烦

要建立一个Spider， 你必须用scrapy.Spider类创建一个子类，并确定了三个强制的属性 和 一个方法。

- `name = ""` ：这个爬虫的识别名称，必须是唯一的，在不同的爬虫必须定义不同的名字。
- `allow_domains = []` 是搜索的域名范围，也就是爬虫的约束区域，规定爬虫只爬取这个域名下的网页，不存在的URL会被忽略。
- `start_urls = ()` ：爬取的URL元祖/列表。爬虫从这里开始抓取数据，所以，第一次下载的数据将会从这些urls开始。其他子URL将会从这些起始URL中继承性生成。
- `parse(self, response)` ：解析的方法，每个初始URL完成下载后将被调用，调用的时候传入从每一个URL传回的Response对象来作为唯一参数，主要作用如下：
  1. 负责解析返回的网页数据(response.body)，提取结构化数据(生成item)
  2. 生成需要下一页的URL请求。
  3. response对象内部有xpath方法

将start_urls的值修改为需要爬取的第一个url

```python
start_urls = ("http://www.itcast.cn/channel/teacher.shtml",)
```

修改parse()方法

```python
def parse(self, response):
    with open("teacher.html", "w") as f:
        f.write(response.text)
```

然后运行一下看看，在mySpider目录下执行：

```python
scrapy crawl itcast
```

是的，就是 itcast，看上面代码，它是 ItcastSpider 类的 name 属性，也就是使用 `scrapy genspider`命令的爬虫名。

一个Scrapy爬虫项目里，可以存在多个爬虫。各个爬虫在执行时，就是按照 name 属性来区分。

运行之后，如果打印的日志出现 `[scrapy] INFO: Spider closed (finished)`，代表执行完成。 之后当前文件夹中就出现了一个 teacher.html 文件，里面就是我们刚刚要爬取的网页的全部源代码信息。

```python
# 注意，Python2.x默认编码环境是ASCII，当和取回的数据编码格式不一致时，可能会造成乱码；
# 我们可以指定保存内容的编码格式，一般情况下，我们可以在代码最上方添加：
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
# 这三行代码是Python2.x里解决中文编码的万能钥匙，经过这么多年的吐槽后Python3学乖了，默认编码是Unicode了...(祝大家早日拥抱Python3)
```

2. 取数据

- 爬取整个网页完毕，接下来的就是的取过程了，首先观察页面源码：

![img](http://www.nikola.ltd/s/python/Spider/file/images/teacher_html.png)

```html
<div class="li_txt">
    <h3>  xxx  </h3>
    <h4> xxxxx </h4>
    <p> xxxxxxxx </p>
```

是不是一目了然？直接上XPath开始提取数据吧。

- 我们之前在mySpider/items.py 里定义了一个ItcastItem类。 这里引入进来

```python
  from mySpider.items import ItcastItem
```

- 然后将我们得到的数据封装到一个 `ItcastItem` 对象中，可以保存每个老师的属性：

```python
from mySpider.items import ItcastItem

def parse(self, response):
    #open("teacher.html","wb").write(response.body).close()

    # 存放老师信息的集合
    items = []

    for each in response.xpath("//div[@class='li_txt']"):
        # 将我们得到的数据封装到一个 `ItcastItem` 对象
        item = ItcastItem()
        #extract()方法返回的都是unicode字符串
        name = each.xpath("h3/text()").extract()
        title = each.xpath("h4/text()").extract()
        info = each.xpath("p/text()").extract()

        #xpath返回的是包含一个元素的列表
        item['name'] = name[0]
        item['title'] = title[0]
        item['info'] = info[0]

        items.append(item)

    # 直接返回最后数据
    return items
```

- 我们暂时先不处理管道，后面会详细介绍。

保存数据

scrapy保存信息的最简单的方法主要有四种，-o 输出指定格式的文件，，命令如下：

```python
# json格式，默认为Unicode编码
scrapy crawl itcast -o teachers.json

# json lines格式，默认为Unicode编码
scrapy crawl itcast -o teachers.jsonl

# csv 逗号表达式，可用Excel打开
scrapy crawl itcast -o teachers.csv

# xml格式
scrapy crawl itcast -o teachers.xml
```

思考

如果将代码改成下面形式，结果完全一样。

请思考 yield 在这里的作用：

```python
from mySpider.items import ItcastItem

def parse(self, response):
    #open("teacher.html","wb").write(response.body).close()

    # 存放老师信息的集合
    #items = []

    for each in response.xpath("//div[@class='li_txt']"):
        # 将我们得到的数据封装到一个 `ItcastItem` 对象
        item = ItcastItem()
        #extract()方法返回的都是unicode字符串
        name = each.xpath("h3/text()").extract()
        title = each.xpath("h4/text()").extract()
        info = each.xpath("p/text()").extract()

        #xpath返回的是包含一个元素的列表
        item['name'] = name[0]
        item['title'] = title[0]
        item['info'] = info[0]

        #items.append(item)

        #将获取的数据交给pipelines
        yield item

    # 返回数据，不经过pipeline
    #return items
```

由于我们每次运行时，都要在命令行中运行，为了更方便，我们可以在项目根目录下创建一个start.py，用来运行执行这些命令

```python
from scrapy import cmdline

cmdline.execute(["scrapy", "crawl", "itcast"])
```

## pipelines.py

前面的博文我们都是使用”-o *.josn”参数将提取的item数据输出到json文件，若不加此参数提取到的数据则不会输出。其实当Item在Spider中被收集之后，它将会被传递到Item Pipeline，这些Item Pipeline组件按定义的顺序处理Item。当我们创建项目时，scrapy会生成一个默认的pipelines.py，如：

```python
vim pipelines.py
class DoubanPipeline(object):
    def process_item(self, item, spider):
        return item但是我们没有具体定义，因此执行爬虫并不会输出结果。
```

下面我们还是通过定义pipeline，使提取到的item通过pipeline输出到json文件、mongodb数据库。
本文爬虫以scrapy爬虫之crawlspide爬取豆瓣近一周同城活动为例，在此我们更新item、item pipeline即可。

### 输出到json文件

1. 定义item

```python
def filter_string(x):
    str = x.split(':')
    return str[1].strip()
class tongcheng(scrapy.Item):
        #主题
        title = scrapy.Field()
        #时间
        time = scrapy.Field()
        #地址
        address = scrapy.Field(output_processor=Join())
        #票价
        money = scrapy.Field()
        #感兴趣人数
        intrest = scrapy.Field()
        #参加人数
        join = scrapy.Field()
```



2. 定义item pipeline

```python
#以json格式输出
from scrapy.exporters import JsonItemExporter
#以jl格式输出
#from scrapy.exporters import JsonLinesItemExporter
#以csv格式输出 
#from scrapy.exporters import CsvItemExporter
class tongcheng_pipeline_json(object):
   
    #可选实现，当spider被开启时，这个方法被调用，常用于初始化操作(常见开启数据库连接,打开文件)
    def open_spider(self, spider):
        #输出到tongcheng_pipeline.json文件
        self.file = open('tongcheng_pipeline.json', 'wb')
        self.exporter = JsonItemExporter(self.file, encoding='utf-8')
        self.exporter.start_exporting()
    
    #可选实现，当spider被关闭时，这个方法被调用，常用于关闭数据库连接
    def close_spier(selef, spider):
        self.exporter.finish_exporting()
        self.file.close()
    
    # 当yield过来数据时调用
    # item是要处理的item对象， spider当前要处理的spider对象
    # 返回item就会继续给优先级低的item pipeline二次处理， 如果直接抛出DropItem的异常就直接丢弃该item
    def process_item(self, item, spider):
        self.exporter.export_item(item)
        return item
```

使用JsonLinesItemExporter保存数据

```python
 1 # -*- coding: utf-8 -*-
 2 from scrapy.exporters import JsonLinesItemExporter
 3 
 4 
 5 class DemoPipeline(object):
 6     def __init__(self):
           # 将下面代码写在open_spider方法中也可以
 7         self.fp = open("duanzi.json", "wb")
 8         self.exporter = JsonLinesItemExporter(self.fp, ensure_ascii=False, encoding='utf-8')
 9 
10     def open_spider(self, spider):
11         pass
12 
13     def process_item(self, item, spider):
14         self.exporter.export_item(item)
15         return item
16 
17     def close_spider(self, spider):
18         self.fp.close()
```

JsonItemExporter和JsonLinesItemExporter的区别：

JsonItemExporter：每次把数据添加到内存中，最后统一写入到磁盘文件中。好处是，存储的是一个满足json规则的数据。坏处是如果数据量比较大，那么比较耗内存。

JsonLinesItemExporter：每次调用export_item的时候就把这个item存储到磁盘中.坏处是一个字典一行,整个文件不是一个满足json格式的文件.好处是每次数据都直接存到磁盘文件中,不会耗内存,数据相对安全.

3. 激活item pipeline
   我们的pipeline定义后，需要在配置文件中添加激活才能使用，因此我们需要配置settings.py。

```python
ITEM_PIPELINES = {
    #默认使用这个，但我们没有定义，因此注释掉。
    #'douban.pipelines.DoubanPipeline': 300,
    #在此添加我们新定义的pipeline
    'douban.pipelines.tongcheng_pipeline_json': 300,
}
```

<font color="red">注：</font>如果遇到`TypeError: Object of type Selector is not JSON serializable`错f误，原因如下：

在scrap中`anything.xpath('...')` is a selector, not a string you are missing to add the `.extract_first()` method.

```py
anything.xpath('...').extract_first()
```

4. 启动爬虫

scrapy crawl tongcheng
#打印信息中会显示

```
2018-01-20 10:48:10 [scrapy.middleware] INFO: Enabled item pipelines:
['douban.pipelines.tongcheng_pipeline_json']
....

#查看tongcheng_pipeline.json文件
cat tongcheng_pipeline.json
[{"money": ["263元"], "address": "深圳  深圳市少年宫剧场 深圳市福田区福中一路市少年宫", "join": ["69 "], "intrest": ["174 "], "title": ["孟京辉戏剧作品《一个陌生女人的来信》深圳站"]},{"money": ["93 - 281元"], "address": "深圳  南山文体中心剧院 小剧场 深圳市南山区南山大道南山文体中心", "join": ["4 "], "intrest": ["11 "],"title": ["2018第五届城市戏剧节 诗·歌·舞变奏三幕剧《木心·人曲》-深圳"]}.....]
```

如上显示，则说明我们的爬虫调用了配置文件中的pipeline，
并将提取的item输出到tongcheng_pipeline.json文件了。

注意

1. 在settings.py中设置的pipeline，会被project中的所有爬虫按照优先级默认调用，例如：

```python
ITEM_PIPELINES = {
    'douban.pipelines.DoubanPipeline': 300,
    'douban.pipelines.movieTop250_crawlspider_json': 200,
    'douban.pipelines.tongcheng_pipeline_json': 100,
}
```

当我们”scrapy crawl tongcheng”时，会按照优先级从低到高也就是100、200、300顺序调用pipeline，从打印信息中可以看到：

```
2018-01-20 10:48:10 [scrapy.middleware] INFO: Enabled item pipelines:
['douban.pipelines.tongcheng_pipeline_json',
douban.pipelines.movieTop250_crawlspider_json,
douban.pipelines.DoubanPipeline]
```



2. 不同spider绑定pipeline

由于一个project中有多个不同功能的爬虫，我们需要将爬虫绑定不同的pipeline，以将提取的内容保存到不同地方。如何实现？
我们知道scrapy运行会调用不同的配置文件，按照优先级从高到低为：

```
1.Command line options (most precedence)
2.Settings per-spider
3.Project settings module
4.Default settings per-command
5.Default global settings (less precedence
```

我们使用的settings.py属于“Project settings module”
，因此我们需要使用优先级比它高的配置文件即可实现绑定pipeline，例如“Settings per-spider”。

vim tongcheng.py

```python
#在下面添加custom_settings即可
class TongchengSpider(CrawlSpider):
    name = 'tongcheng'
    allowed_domains = ['douban.com']
    start_urls = ['https://www.douban.com/location/shenzhen/events/week-all']
    custom_settings = {
        'ITEM_PIPELINES': {
            'douban.pipelines.tongcheng_pipeline_json': 300,
        }
    }
    rules = (
        Rule(LinkExtractor(allow=r'start=10')),
        Rule(LinkExtractor(allow=r'https://www.douban.com/event/\d+/'),callback='parse_item'),
    )   
    
    def parse_item(self, response):
        loader = ItemLoader(item=tongcheng(),selector=response)
        info = loader.nested_xpath('//div[@class="event-info"]')
        info.add_xpath('title','h1[@itemprop="summary"]/text()')
        info.add_xpath('time','div[@class="event-detail"]/ul[@class="calendar-strs"]/li/text()')
        info.add_xpath('address','div[@itemprop="location"]/span[@class="micro-address"]/span[@class="micro-address"]/text()')
        info.add_xpath('money','div[@class="event-detail"]/span[@itemprop="ticketAggregate"]/text()')
        info.add_xpath('intrest','div[@class="interest-attend pl"]/span[1]/text()')
        info.add_xpath('join','div[@class="interest-attend pl"]/span[3]/text()')

   			 yield loader.load_item()
```


通过custom_settings我们可以绑定tongcheng_pipeline_json
，从而避免调用setttings.py中的所有pipeline。

## Spider

Spider类定义了如何爬取某个(或某些)网站。包括了爬取的动作(例如:是否跟进链接)以及如何从网页的内容中提取结构化数据(爬取item)。 换句话说，Spider就是您定义爬取的动作及分析某个网页(或者是有些网页)的地方。

`class scrapy.Spider`是最基本的类，所有编写的爬虫必须继承这个类。

主要用到的函数及调用顺序为：

`__init__()` : 初始化爬虫名字和start_urls列表

`start_requests() 调用make_requests_from url()`:生成Requests对象交给Scrapy下载并返回response

`parse()` : 解析response，并返回Item或Requests（需指定回调函数）。Item传给Item pipline持久化 ， 而Requests交由Scrapy下载，并由指定的回调函数处理（默认parse())，一直进行循环，直到处理完所有的数据为止。

源码参考

```python
#所有爬虫的基类，用户定义的爬虫必须从这个类继承
class Spider(object_ref):

    #定义spider名字的字符串(string)。spider的名字定义了Scrapy如何定位(并初始化)spider，所以其必须是唯一的。
    #name是spider最重要的属性，而且是必须的。
    #一般做法是以该网站(domain)(加或不加 后缀 )来命名spider。 例如，如果spider爬取 mywebsite.com ，该spider通常会被命名为 mywebsite
    name = None

    #初始化，提取爬虫名字，start_ruls
    def __init__(self, name=None, **kwargs):
        if name is not None:
            self.name = name
        # 如果爬虫没有名字，中断后续操作则报错
        elif not getattr(self, 'name', None):
            raise ValueError("%s must have a name" % type(self).__name__)

        # python 对象或类型通过内置成员__dict__来存储成员信息
        self.__dict__.update(kwargs)

        #URL列表。当没有指定的URL时，spider将从该列表中开始进行爬取。 因此，第一个被获取到的页面的URL将是该列表之一。 后续的URL将会从获取到的数据中提取。
        if not hasattr(self, 'start_urls'):
            self.start_urls = []

    # 打印Scrapy执行后的log信息
    def log(self, message, level=log.DEBUG, **kw):
        log.msg(message, spider=self, level=level, **kw)

    # 判断对象object的属性是否存在，不存在做断言处理
    def set_crawler(self, crawler):
        assert not hasattr(self, '_crawler'), "Spider already bounded to %s" % crawler
        self._crawler = crawler

    @property
    def crawler(self):
        assert hasattr(self, '_crawler'), "Spider not bounded to any crawler"
        return self._crawler

    @property
    def settings(self):
        return self.crawler.settings

    #该方法将读取start_urls内的地址，并为每一个地址生成一个Request对象，交给Scrapy下载并返回Response
    #该方法仅调用一次
    def start_requests(self):
        for url in self.start_urls:
            yield self.make_requests_from_url(url)

    #start_requests()中调用，实际生成Request的函数。
    #Request对象默认的回调函数为parse()，提交的方式为get
    def make_requests_from_url(self, url):
        return Request(url, dont_filter=True)

    #默认的Request对象回调函数，处理返回的response。
    #生成Item或者Request对象。用户必须实现这个类
    def parse(self, response):
        raise NotImplementedError

    @classmethod
    def handles_request(cls, request):
        return url_is_from_spider(request.url, cls)

    def __str__(self):
        return "<%s %r at 0x%0x>" % (type(self).__name__, self.name, id(self))

    __repr__ = __str__
```

### 主要属性和方法

- name

  > 定义spider名字的字符串。
  >
  > 例如，如果spider爬取 mywebsite.com ，该spider通常会被命名为 mywebsite

- allowed_domains

  > 包含了spider允许爬取的域名(domain)的列表，可选。

- start_urls

  > 初始URL元祖/列表。当没有制定特定的URL时，spider将从该列表中开始进行爬取。

- start_requests(self)

  > 该方法必须返回一个可迭代对象(iterable)。该对象包含了spider用于爬取（默认实现是使用 start_urls 的url）的第一个Request。
  >
  > 当spider启动爬取并且未指定start_urls时，该方法被调用。

- parse(self, response)

  > 当请求url返回网页没有指定回调函数时，默认的Request对象回调函数。用来处理网页返回的response，以及生成Item或者Request对象。

- log(self, message[, level, component])

  > 使用 scrapy.log.msg() 方法记录(log)message。 更多数据请参见 [logging](http://www.nikola.ltd/s/python/Spider/file/part04/4.7.html)

案例：腾讯招聘网自动翻页采集

- 创建一个新的爬虫：

```
scrapy genspider tencent "tencent.com"
```

- 编写items.py

获取职位名称、详细信息、

```python
class TencentItem(scrapy.Item):
    name = scrapy.Field()
    detailLink = scrapy.Field()
    positionInfo = scrapy.Field()
    peopleNumber = scrapy.Field()
    workLocation = scrapy.Field()
    publishTime = scrapy.Field()
```

- 编写tencent.py

```python
# tencent.py

from mySpider.items import TencentItem
import scrapy
import re

class TencentSpider(scrapy.Spider):
    name = "tencent"
    allowed_domains = ["hr.tencent.com"]
    start_urls = [
        "http://hr.tencent.com/position.php?&start=0#a"
    ]

    def parse(self, response):
        for each in response.xpath('//*[@class="even"]'):

            item = TencentItem()
            name = each.xpath('./td[1]/a/text()').extract()[0]
            detailLink = each.xpath('./td[1]/a/@href').extract()[0]
            positionInfo = each.xpath('./td[2]/text()').extract()[0]
            peopleNumber = each.xpath('./td[3]/text()').extract()[0]
            workLocation = each.xpath('./td[4]/text()').extract()[0]
            publishTime = each.xpath('./td[5]/text()').extract()[0]

            #print name, detailLink, catalog, peopleNumber, workLocation,publishTime

            item['name'] = name.encode('utf-8')
            item['detailLink'] = detailLink.encode('utf-8')
            item['positionInfo'] = positionInfo.encode('utf-8')
            item['peopleNumber'] = peopleNumber.encode('utf-8')
            item['workLocation'] = workLocation.encode('utf-8')
            item['publishTime'] = publishTime.encode('utf-8')

            curpage = re.search('(\d+)',response.url).group(1)
            page = int(curpage) + 10
            url = re.sub('\d+', str(page), response.url)

            # 发送新的url请求加入待爬队列，并调用回调函数 self.parse
            yield scrapy.Request(url, callback = self.parse)

            # 将获取的数据交给pipeline
            yield item
```

- 编写pipeline.py文件

```python
import json

#class ItcastJsonPipeline(object):
class TencentJsonPipeline(object):

    def __init__(self):
        #self.file = open('teacher.json', 'wb')
        self.file = open('tencent.json', 'wb')

    def process_item(self, item, spider):
        content = json.dumps(dict(item), ensure_ascii=False) + "\n"
        self.file.write(content)
        return item

    def close_spider(self, spider):
        self.file.close()
```

- 在 setting.py 里设置ITEM_PIPELINES

```python
ITEM_PIPELINES = {
    #'mySpider.pipelines.SomePipeline': 300,
    #"mySpider.pipelines.ItcastJsonPipeline":300
    "mySpider.pipelines.TencentJsonPipeline":300
}
```

- 执行爬虫：`scrapy crawl tencent`

思考

请思考 parse()方法的工作机制：

```python
1. 因为使用的yield，而不是return。parse函数将会被当做一个生成器使用。scrapy会逐一获取parse方法中生成的结果，并判断该结果是一个什么样的类型；
2. 如果是request则加入爬取队列，如果是item类型则使用pipeline处理，其他类型则返回错误信息。
3. scrapy取到第一部分的request不会立马就去发送这个request，只是把这个request放到队列里，然后接着从生成器里获取；
4. 取尽第一部分的request，然后再获取第二部分的item，取到item了，就会放到对应的pipeline里处理；
5. parse()方法作为回调函数(callback)赋值给了Request，指定parse()方法来处理这些请求 scrapy.Request(url, callback=self.parse)
6. Request对象经过调度，执行生成 scrapy.http.response()的响应对象，并送回给parse()方法，直到调度器中没有Request（递归的思路）
7. 取尽之后，parse()工作结束，引擎再根据队列和pipelines中的内容去执行相应的操作；
8. 程序在取得各个页面的items前，会先处理完之前所有的request队列里的请求，然后再提取items。
7. 这一切的一切，Scrapy引擎和调度器将负责到底。
```

## Request

Request 部分源码：

```python
# 部分代码
class Request(object_ref):

    def __init__(self, url, callback=None, method='GET', headers=None, body=None, 
                 cookies=None, meta=None, encoding='utf-8', priority=0,
                 dont_filter=False, errback=None):

        self._encoding = encoding  # this one has to be set first
        self.method = str(method).upper()
        self._set_url(url)
        self._set_body(body)
        assert isinstance(priority, int), "Request priority not an integer: %r" % priority
        self.priority = priority

        assert callback or not errback, "Cannot use errback without a callback"
        self.callback = callback
        self.errback = errback

        self.cookies = cookies or {}
        self.headers = Headers(headers or {}, encoding=encoding)
        self.dont_filter = dont_filter

        self._meta = dict(meta) if meta else None

    @property
    def meta(self):
        if self._meta is None:
            self._meta = {}
        return self._meta
```

其中，ff比较常用的参数：

```python
url: 就是需要请求，并进行下一步处理的url

callback: 指定该请求返回的Response，由那个函数来处理。

method: 请求一般不需要指定，默认GET方法，可设置为"GET", "POST", "PUT"等，且保证字符串大写

headers: 请求时，包含的头文件。一般不需要。内容一般如下：
        # 自己写过爬虫的肯定知道
        Host: media.readthedocs.org
        User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64; rv:33.0) Gecko/20100101 Firefox/33.0
        Accept: text/css,*/*;q=0.1
        Accept-Language: zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3
        Accept-Encoding: gzip, deflate
        Referer: http://scrapy-chs.readthedocs.org/zh_CN/0.24/
        Cookie: _ga=GA1.2.1612165614.1415584110;
        Connection: keep-alive
        If-Modified-Since: Mon, 25 Aug 2014 21:59:35 GMT
        Cache-Control: max-age=0

meta: 比较常用，在不同的请求之间传递数据使用的。字典dict型

        request_with_cookies = Request(
            url="http://www.example.com",
            cookies={'currency': 'USD', 'country': 'UY'},
            meta={'dont_merge_cookies': True}
        )

encoding: 使用默认的 'utf-8' 就行。

dont_filter: 表明该请求不由调度器过滤。这是当你想使用多次执行相同的请求,忽略重复的过滤器。默认为False。

errback: 指定错误处理函数
```

Request中中的meta使用案例：

```python
    def login(self, response):
              post_data = {
                 "USERNAME": ADMIN_LIST[yx],
                 "PASSWORD": PASSWORD_LIST[yx],
                 "RANDOMCODE": ""
             }
             yield scrapy.Request(captcha_url, meta={"post_data": post_data, "yx": yx}, callback=self.login_after_captcha)
    def login_after_captcha(self, response):
        post_data = response.meta.get("post_data", {})
        post_data["RANDOMCODE"] = captcah_code
        post_url = "http://kdjw.hnust.edu.cn/kdjw/Logon.do?method=logon"
        yx = response.meta.get("yx")	
```

## Response

```python
# 部分代码
class Response(object_ref):
    def __init__(self, url, status=200, headers=None, body='', flags=None, request=None):
        self.headers = Headers(headers or {})
        self.status = int(status)
        self._set_body(body)
        self._set_url(url)
        self.request = request
        self.flags = [] if flags is None else list(flags)

    @property
    def meta(self):
        try:
            return self.request.meta
        except AttributeError:
            raise AttributeError("Response.meta not available, this response " \
                "is not tied to any request")
```

大部分参数和上面的差不多：

```python
status: 响应码
_set_body(body)： 响应体
_set_url(url)：响应url
self.request = request
```

Reponse对象的主要属性：

1. meta：从其他请求传过来的et。属性，可以用来保持多个请求之间的数据连接。
2. encoding：返回当前字符串编码和解码的格式。
3. text：将返回来的数据作为unicode字符串返回。
4. body：将返回来的数据作为bytes 字符串返回。
5. xpath: xapth选择器。
6. css: css选择器。

### urljoin方法

response.urljoin(该链接)就好了，urljoin用的是请求初始页得到的response作为base_url，拼接得到需要链接的完整url,如果你的链接本身就是完整的，该方法就不起作用，所以该方法通用的。

```python
urls = uibox.xpath(".//ul/li/a/img/@src").getall()
urls1 = list(map(lambda x:response.urljoin(x),urls))
```

### css方法

```python
# 获取#SafeCodeImg 下的img标签的中的src属性值
captcha_url = response.css("#SafeCodeImg img::attr('src')").get()

# 获取title标签的文本内容
response.css('title::text').extract_first()
```



### 发送POST请求

- 可以使用 `yield scrapy.FormRequest(url, formdata, callback)`方法发送POST请求。
- 如果希望程序执行一开始就发送POST请求，可以重写Spider类的`start_requests(self)` 方法，并且不再调用start_urls里的url。并且去掉parse方法，因为爬虫启动的时候，会想start_urls发送get请求，然后回调parse方法

```python
class mySpider(scrapy.Spider):
    # start_urls = ["http://www.example.com/"]

    def start_requests(self):
        url = 'http://www.renren.com/PLogin.do'
 
        # FormRequest 是Scrapy发送POST请求的方法
        yield scrapy.FormRequest(
            url = url,
            formdata = {"email" : "mr_mao_hacker@163.com", "password" : "axxxxxxxe"},
            callback = self.parse_page
        )
    def parse_page(self, response):
        # do something
```

<font color="red">注：如果使用Request或Response方式请求时，如果没有指定callback, 那么它会默认为callback为parse方法</font>

## 请求参数meta、headers、cookies

对于scrapy请参数，会经常用到，不过没有深究

今天我就来探索下scrapy请求时所携带的3个重要参数`headers`, `cookies`, `meta`

### 原生参数

首先新建`myscrapy`项目，新建`my_spider`爬虫

通过访问：http://httpbin.org/get 来测试请求参数

将爬虫运行起来

```python
# -*- coding: utf-8 -*-

from scrapy import Spider, Request
import logging


class MySpider(Spider):
    name = 'my_spider'
    allowed_domains = ['httpbin.org']
    start_urls = [
        'http://httpbin.org/get'
    ]

    def parse(self, response):
        self.write_to_file("*" * 40)
        self.write_to_file("response text: %s" % response.text)
        self.write_to_file("response headers: %s" % response.headers)
        self.write_to_file("response meta: %s" % response.meta)
        self.write_to_file("request headers: %s" % response.request.headers)
        self.write_to_file("request cookies: %s" % response.request.cookies)
        self.write_to_file("request meta: %s" % response.request.meta)

    def write_to_file(self, words):
        with open("logging.log", "a") as f:
            f.write(words)


if __name__ == '__main__':
    from scrapy import cmdline
    cmdline.execute("scrapy crawl my_spider".split())
12345678910111213141516171819202122232425262728293031
```

保存到文件中的信息如下：

```
response text: 
{
    "args":{},
    "headers":{
        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding":"gzip,deflate",
        "Accept-Language":"en",
        "Connection":"close",
        "Host":"httpbin.org",
        "User-Agent":"Scrapy/1.5.1 (+https://scrapy.org)"
    },
    "origin":"223.72.90.254",
    "url":"http://httpbin.org/get"
}

response headers: 
{
    b'Server': [b'gunicorn/19.8.1'], 
    b'Date': [b'Sun, 22 Jul 2018 10:03:15 GMT'], 
    b'Content-Type': [b'application/json'], 
    b'Access-Control-Allow-Origin': [b'*'], 
    b'Access-Control-Allow-Credentials': [b'true'], 
    b'Via': [b'1.1 vegur']
}

response meta: 
{
    'download_timeout': 180.0, 
    'download_slot': 'httpbin.org', 
    'download_latency': 0.5500118732452393
}

request headers: 
{
    b'Accept': [b'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'], b'Accept-Language': [b'en'], 
    b'User-Agent': [b'Scrapy/1.5.1 (+https://scrapy.org)'], 
    b'Accept-Encoding': [b'gzip,deflate']
}

request cookies: 
{}

request meta: 
{
    'download_timeout': 180.0, 
    'download_slot': 'httpbin.org', 
    'download_latency': 0.5500118732452393
}123456789101112131415161718192021222324252627282930313233343536373839404142434445464748
```

### meta

通过上面的输出比较，发现 response 和 request 的`meta`参数是一样的，meta的功能就是从request携带信息，将其传递给response的

修改下代码，测试下传递效果

```python
# -*- coding: utf-8 -*-

from scrapy import Spider, Request
import logging


class MySpider(Spider):
    name = 'my_spider'
    allowed_domains = ['httpbin.org']
    start_urls = [
        'http://httpbin.org/get'
    ]

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url, meta={"uid": "this is uid of meta"})

    def parse(self, response):
        print("request meta: %s" % response.request.meta.get("uid"))
        print("response meta: %s" % response.meta.get("uid"))1234567891011121314151617181920
```

输出如下

```
request meta: this is uid of meta
response meta: this is uid of meta12
```

看来获取request中`meta`这两种方式都可行，这里的meta类似字典，可以按照字典获取key-value的形式获取对应的值
当然代理设置也是通过meta的
以下是一个代理中间件的示例

```python
import random


class ProxyMiddleware(object):       
    def process_request(self, request, spider):
        proxy=random.choice(proxies)
        request.meta["proxy"] = proxy1234567
```

### headers

按照如下路径，打开scrapy的`default_settings`文件

```python
from scrapy.settings import default_settings1
```

发现是这么写的

```python
USER_AGENT = 'Scrapy/%s (+https://scrapy.org)' % import_module('scrapy').__version__

DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en',
}
```

修改下请求头，看服务器返回的信息

```python
# -*- coding: utf-8 -*-

from scrapy import Spider, Request
import logging


class MySpider(Spider):
    name = 'my_spider'
    allowed_domains = ['httpbin.org']
    start_urls = [
        'http://httpbin.org/get',
    ]

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url, headers={"User-Agent": "Chrome"})

    def parse(self, response):
        logging.debug("*" * 40)
        logging.debug("response text: %s" % response.text)
        logging.debug("response headers: %s" % response.headers)
        logging.debug("request headers: %s" % response.request.headers)


if __name__ == '__main__':
    from scrapy import cmdline
    cmdline.execute("scrapy crawl my_spider".split())
```

输出如下

```
response text: 
{
    "args":{},
    "headers":
    {
        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding":"gzip,deflate",
        "Accept-Language":"en",
        "Connection":"close",
        "Host":"httpbin.org",
        "User-Agent":"Chrome"
    },
    "origin":"122.71.64.121",
    "url":"http://httpbin.org/get"
}

response headers: 
{
    b'Server': [b'gunicorn/19.8.1'], 
    b'Date': [b'Sun, 22 Jul 2018 10:29:26 GMT'], 
    b'Content-Type': [b'application/json'], 
    b'Access-Control-Allow-Origin': [b'*'], 
    b'Access-Control-Allow-Credentials': [b'true'], 
    b'Via': [b'1.1 vegur']
}


request headers: 
{
    b'User-Agent': [b'Chrome'], 
    b'Accept': [b'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'], b'Accept-Language': [b'en'], 
    b'Accept-Encoding': [b'gzip,deflate']
}
```

看到 request 和 服务器接收到并返回的的 headers（`User-Agent`）变化了，说明已经把默认的`User-Agent`修改了

看到`default_settings`中默认使用了中间件`UserAgentMiddleware`

```
'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': 500,1
```

源码如下

```python
class UserAgentMiddleware(object):
    """This middleware allows spiders to override the user_agent"""

    def __init__(self, user_agent='Scrapy'):
        self.user_agent = user_agent

    @classmethod
    def from_crawler(cls, crawler):
        o = cls(crawler.settings['USER_AGENT'])
        crawler.signals.connect(o.spider_opened, signal=signals.spider_opened)
        return o

    def spider_opened(self, spider):
        self.user_agent = getattr(spider, 'user_agent', self.user_agent)

    def process_request(self, request, spider):
        if self.user_agent:
            request.headers.setdefault(b'User-Agent', self.user_agent)
```

仔细阅读源码，发现无非就是对`User-Agent`读取和设置操作，仿照源码写自己的中间件

这里使用`fake_useragent`库来随机获取请求头，详情可参看：
https://blog.csdn.net/mouday/article/details/80476409

middlewares.py 编写自己的中间件

```python
from fake_useragent import UserAgent


class UserAgentMiddleware(object):
    def process_request(self, request, spider):
        ua = UserAgent()
        user_agent = ua.chrome
        request.headers.setdefault(b'User-Agent', user_agent)12345678
```

settings.py 用自己的中间件替换默认中间件

```python
DOWNLOADER_MIDDLEWARES = {
    'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
    'myscrapy.middlewares.UserAgentMiddleware': 500
}1234
```

输出如下：

```
request headers: 
{
    b'Accept': [b'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'], b'Accept-Language': [b'en'], 
    b'User-Agent': [b'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36'], 
    b'Accept-Encoding': [b'gzip,deflate']
}123456
```

关于scrapy请求头设置，可以参考我之前的文章：
https://blog.csdn.net/mouday/article/details/80776030

### cookies

上面的信息中少了个`response.cookies`，如果添加上回报错：

```
AttributeError: 'TextResponse' object has no attribute 'cookies'1
```

说明响应是不带cookies参数的

通过 http://httpbin.org/cookies 测试cookies

```python
# -*- coding: utf-8 -*-

from scrapy import Spider, Request
import logging


class MySpider(Spider):
    name = 'my_spider'
    allowed_domains = ['httpbin.org']
    start_urls = [
        'http://httpbin.org/cookies'
    ]


    def start_requests(self):
        for url in self.start_urls:
            yield Request(url, cookies={"username": "pengshiyu"})

    def parse(self, response):
        logging.debug("*" * 40)
        logging.debug("response text: %s" % response.text)
        logging.debug("request headers: %s" % response.request.headers)
        logging.debug("request cookies: %s" % response.request.cookies)


if __name__ == '__main__':
    from scrapy import cmdline
    cmdline.execute("scrapy crawl my_spider".split())
```

返回值如下：

```
response text: 
{
    "cookies":
        {
        "username":"pengshiyu"
        }
}

request headers: 
{
    b'Accept': [b'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'], b'Accept-Language': [b'en'], 
    b'User-Agent': [b'Scrapy/1.5.1 (+https://scrapy.org)'], 
    b'Accept-Encoding': [b'gzip,deflate'], 
    b'Cookie': [b'username=pengshiyu']
}

request cookies: 
{
    'username': 'pengshiyu'
}1234567891011121314151617181920
```

服务器端已经接收到我的cookie值了，不过request的`headers`也包含了相同的cookie，保存到了键为`Cookie`下面

其实并没有什么cookie，浏览器请求的·cookies·被包装到了·headers·中发送给服务器端
既然这样，在headers中包含`Cookie`试试

```python
 def start_requests(self):
        for url in self.start_urls:
            yield Request(url, headers={"Cookie": {"username": "pengshiyu"}})123
```

返回结果

```
response text: 
{
    "cookies":{}
}

request headers: 
{
    b'Accept': [b'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'], b'Accept-Language': [b'en'], 
    b'User-Agent': [b'Scrapy/1.5.1 (+https://scrapy.org)'], 
    b'Accept-Encoding': [b'gzip,deflate']
}


request cookies: 
{}
```

cookies 是空的，设置失败

我们找到 `default_settings` 中的cookie中间件

```python
'scrapy.downloadermiddlewares.cookies.CookiesMiddleware': 7001
class CookiesMiddleware(object):
    """This middleware enables working with sites that need cookies"""

    def __init__(self, debug=False):
        self.jars = defaultdict(CookieJar)
        self.debug = debug

    @classmethod
    def from_crawler(cls, crawler):
        if not crawler.settings.getbool('COOKIES_ENABLED'):
            raise NotConfigured
        return cls(crawler.settings.getbool('COOKIES_DEBUG'))

    def process_request(self, request, spider):
        if request.meta.get('dont_merge_cookies', False):
            return

        cookiejarkey = request.meta.get("cookiejar")
        jar = self.jars[cookiejarkey]
        cookies = self._get_request_cookies(jar, request)
        for cookie in cookies:
            jar.set_cookie_if_ok(cookie, request)

        # set Cookie header
        request.headers.pop('Cookie', None)
        jar.add_cookie_header(request)
        self._debug_cookie(request, spider)

    def process_response(self, request, response, spider):
        if request.meta.get('dont_merge_cookies', False):
            return response

        # extract cookies from Set-Cookie and drop invalid/expired cookies
        cookiejarkey = request.meta.get("cookiejar")
        jar = self.jars[cookiejarkey]
        jar.extract_cookies(response, request)
        self._debug_set_cookie(response, spider)

        return response

    def _debug_cookie(self, request, spider):
        if self.debug:
            cl = [to_native_str(c, errors='replace')
                  for c in request.headers.getlist('Cookie')]
            if cl:
                cookies = "\n".join("Cookie: {}\n".format(c) for c in cl)
                msg = "Sending cookies to: {}\n{}".format(request, cookies)
                logger.debug(msg, extra={'spider': spider})

    def _debug_set_cookie(self, response, spider):
        if self.debug:
            cl = [to_native_str(c, errors='replace')
                  for c in response.headers.getlist('Set-Cookie')]
            if cl:
                cookies = "\n".join("Set-Cookie: {}\n".format(c) for c in cl)
                msg = "Received cookies from: {}\n{}".format(response, cookies)
                logger.debug(msg, extra={'spider': spider})

    def _format_cookie(self, cookie):
        # build cookie string
        cookie_str = '%s=%s' % (cookie['name'], cookie['value'])

        if cookie.get('path', None):
            cookie_str += '; Path=%s' % cookie['path']
        if cookie.get('domain', None):
            cookie_str += '; Domain=%s' % cookie['domain']

        return cookie_str

    def _get_request_cookies(self, jar, request):
        if isinstance(request.cookies, dict):
            cookie_list = [{'name': k, 'value': v} for k, v in \
                    six.iteritems(request.cookies)]
        else:
            cookie_list = request.cookies

        cookies = [self._format_cookie(x) for x in cookie_list]
        headers = {'Set-Cookie': cookies}
        response = Response(request.url, headers=headers)

        return jar.make_cookies(response, request)
```

观察源码，发现以下几个方法

```python
# process_request
jar.add_cookie_header(request)   # 添加cookie到headers

# process_response
jar.extract_cookies(response, request)  # 提取出cookie

# _debug_cookie 
request.headers.getlist('Cookie')  # 从headers获取cookie

# _debug_set_cookie
response.headers.getlist('Set-Cookie')  # 从headers获取Set-Cookie1234567891011
```

几个参数：

```python
# settings
COOKIES_ENABLED
COOKIES_DEBUG

# meta
dont_merge_cookies
cookiejar

# headers
Cookie
Set-Cookie1234567891011
```

使用最开始cookie部分的代码，为了看的清晰，我删除了headers中其他参数，下面逐个做测试

1、COOKIES_ENABLED

COOKIES_ENABLED = True (默认)

```
response text: 
{
    "cookies":{"username":"pengshiyu"}
}

request headers: 
{
    b'Cookie': [b'username=pengshiyu']
}

request cookies: 
{
    'username': 'pengshiyu'
}
```

一切ok
COOKIES_ENABLED = False

```
response text: 
{
    "cookies":{}
}

request headers: 
{}

request cookies: 
{
    'username': 'pengshiyu'
}
```

虽然request的cookies有内容，不过headers没有加进去，所以服务器端没有获取到cookie

`注意`：查看请求的真正cookie，应该在request的header中查看

2、COOKIES_DEBUG
COOKIES_DEBUG = False (默认)

```
DEBUG: Crawled (200) <GET http://httpbin.org/cookies> (referer: None)1
```

COOKIES_DEBUG = True
多输出了下面一句，可以看到我设置的cookie

```
[scrapy.downloadermiddlewares.cookies] DEBUG: Sending cookies to: <GET http://httpbin.org/cookies>
Cookie: username=pengshiyu12
```

当然，debug模式下服务器肯定能正常接收我的cookie

3、dont_merge_cookies
设置`meta={"dont_merge_cookies": True}` 默认为 False

```
response text: 
{
    "cookies":{}
}

request headers: 
{}

request cookies: 
{
    'username': 'pengshiyu'
}
```

服务器并没有接收到我的cookie

4、cookiejar
直接通过`response.request.meta.get("cookiejar")`获取

```
response text: 
{"cookies":{"username":"pengshiyu"}}

request headers: 
{b'Cookie': [b'username=pengshiyu']}

request cookies: 
{'username': 'pengshiyu'}

request cookiejar: 
None
```

啥也没有

5、Cookie
直接获取：`response.request.headers.get("Cookie"))`

```
headers Cookie: 
b'username=pengshiyu'
```

看来这里已经被处理成字节串了

修改Request请求参数
`cookies={"username": "pengshiyu", "password": "123456"}`

```python
# response.request.headers.get("Cookie"))
headers Cookie: 
b'username=pengshiyu; password=123456'

# request.headers.getlist('Cookie')
headers Cookies: 
[b'username=pengshiyu; password=123456']1234567
```

很明显，两个获取方式，一个获取的是字符串，一个获取的是列表

6、Set-Cookie

同样，我通过以下

```python
response.headers.get("Set-Cookie")
response.headers.getlist("Set-Cookie")
```

还是啥都没有

```
headers Set-Cookie: None
headers Set-Cookies: []
```

不过，到目前为止，cookie设置的大概流程应该如下：

```python
request cookies: {'username': 'pengshiyu', 'password': '123456'}
request cookiejar: None
request Cookie: b'username=pengshiyu; password=123456'
response text: {"cookies":{"password":"123456","username":"pengshiyu"}}
response Set-Cookie: None
response Set-Cookies: []
```

7、接收服务器传递过来的cookie

将请求链接改为 ：’http://httpbin.org/cookies/set/key/value’
开启 COOKIES_DEBUG
在debug中看到如下变化

```
Sending cookies to: <GET http://httpbin.org/cookies/set/key/value>
Cookie: username=pengshiyu; password=123456

Received cookies from: <302 http://httpbin.org/cookies/set/key/value>
Set-Cookie: key=value; Path=/

Redirecting (302) to <GET http://httpbin.org/cookies> from <GET http://httpbin.org/cookies/set/key/value>

Sending cookies to: <GET http://httpbin.org/cookies>
Cookie: key=value; username=pengshiyu; password=12345612345678910
```

日志看出他进行了两次请求，看到中间的cookie变化：

```
发送 -> 接收 -> 发送
```

第二次发送的cookie包含了第一次请求时服务器端传递过来的cookie，说明scrapy对服务器端和客户端的cookie进行了管理

最后的cookie输出

```
request cookies: {'username': 'pengshiyu', 'password': '123456'}
request cookiejar: None
request Cookie: b'key=value; username=pengshiyu; password=123456'
response text: {"cookies":{"key":"value","password":"123456","username":"pengshiyu"}}
response Set-Cookie: None12345
```

request的cookies并没有变化，而request.headers.get(“Cookie”)已经发生了变化

8、接收服务器传递过来的 同key键cookie
将请求链接换为：httpbin.org/cookies/set/username/pengpeng

```
Sending cookies to: <GET http://httpbin.org/cookies/set/username/pengpeng>
Cookie: username=pengshiyu

Received cookies from: <302 http://httpbin.org/cookies/set/username/pengpeng>
Set-Cookie: username=pengpeng; Path=/

Redirecting (302) to <GET http://httpbin.org/cookies> from <GET http://httpbin.org/cookies/set/username/pengpeng>

Sending cookies to: <GET http://httpbin.org/cookies>
Cookie: username=pengshiyu12345678910
```

发现虽然收到了`username=pengpeng`但是，第二次发请求的时候，又发送了原来的的cookie`username=pengshiyu`

这说明客户端设置的cookie优先级高于服务器端传递过来的cookie

9、取消使用中间件CookiesMiddleware

```
DOWNLOADER_MIDDLEWARES = {
    'scrapy.downloadermiddlewares.cookies.CookiesMiddleware': None
}123
```

请求链接：http://httpbin.org/cookies

```
request cookies: {'username': 'pengshiyu'}
request cookiejar: None
request Cookie: None
response text: {"cookies":{}}
response Set-Cookie: None
response Set-Cookies: []123456
```

这个效果类似`COOKIES_ENABLED = False`

10、自定义cookie池

```
class RandomCookiesMiddleware(object):
    def process_request(self, request, spider):
        cookies = []
        cookie = random.choice(cookies)
        request.cookies = cookie
123456
```

同样需要设置

```
DOWNLOADER_MIDDLEWARES = {
    'myscrapy.middlewares.RandomCookiesMiddleware': 600
}123
```

注意到scrapy的中间件`CookiesMiddleware`值是700,为了cookie设置生效，需要在这个中间件启用之前就设置好自定义的cookie，优先级按照从小到大的顺序执行，所以我们自己自定义的cookie中间件需要小于 `< 700`

```
'scrapy.downloadermiddlewares.cookies.CookiesMiddleware': 700,1
```

### 总结

| 参数    | 设置                                                                                                      | 获取                                                                                               | 说明                                                           |
| ------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| meta    | Request(url, meta={“uid”: “100”}) request.meta[“uid”] = “100”                                             | response.request.meta.get(“uid”) response.meta.get(“uid”)                                          | 携带request参数给response,或设置代理                           |
| headers | Request(url, headers={“User-Agent”: “chrome”}) request.headers[“User-Agent”]=”chrome” USER_AGENT=”chrome” | response.request.headers.get(“User-Agent”)                                                         | 设置客户端请求头参数                                           |
| cookies | Request(url, cookies={“username”: “pengshiyu”} ) request.cookies = {“username”: “pengshiyu”}              | response.request.cookies response.request.headers.get(“Cookie”) response.headers.get(‘Set-Cookie’) | 客户端请求头中的Cookie参数，管理客户端与服务器端之间的会话识别 |

常用的中间件如下

```python
import random
from fake_useragent import UserAgent


class RandomUserAgentMiddleware(object):
    def process_request(self, request, spider):
        ua = UserAgent()
        user_agent = ua.chrome
        request.headers.setdefault(b'User-Agent', user_agent)


class RandomProxyMiddleware(object):
    def process_request(self, request, spider):
        proxies = []
        proxy = random.choice(proxies)
        request.meta["proxy"] = proxy


class RandomCookiesMiddleware(object):
    def process_request(self, request, spider):
        cookies = []
        cookie = random.choice(cookies)
        request.cookies = cookie
```

当然，cookies 和 proxies 需要结合自己的情况补全

### 模拟登陆

使用FormRequest.from_response()方法[模拟用户登录](http://docs.pythontab.com/scrapy/scrapy0.24/topics/request-response.html#topics-request-response-ref-request-userlogin)

> 通常网站通过 实现对某些表单字段（如数据或是登录界面中的认证令牌等）的预填充。
>
> 使用Scrapy抓取网页时，如果想要预填充或重写像用户名、用户密码这些表单字段， 可以使用 FormRequest.from_response() 方法实现。
>
> 下面是使用这种方法的爬虫例子:

```python
import scrapy

class LoginSpider(scrapy.Spider):
    name = 'example.com'
    start_urls = ['http://www.example.com/users/login.php']

    def parse(self, response):
        return scrapy.FormRequest.from_response(
            response,
            formdata={'username': 'john', 'password': 'secret'},
            callback=self.after_login
        )

    def after_login(self, response):
        # check login succeed before going on
        if "authentication failed" in response.body:
            self.log("Login failed", level=log.ERROR)
            return

        # continue scraping with authenticated session...
```

## 知乎爬虫案例

zhihuSpider.py爬虫代码

```python
#!/usr/bin/env python
# -*- coding:utf-8 -*-
from scrapy.spiders import CrawlSpider, Rule
from scrapy.selector import Selector
from scrapy.linkextractors import LinkExtractor
from scrapy import Request, FormRequest
from zhihu.items import ZhihuItem

class ZhihuSipder(CrawlSpider) :
    name = "zhihu"
    allowed_domains = ["www.zhihu.com"]
    start_urls = [
        "http://www.zhihu.com"
    ]
    rules = (
        Rule(LinkExtractor(allow = ('/question/\d+#.*?', )), callback = 'parse_page', follow = True),
        Rule(LinkExtractor(allow = ('/question/\d+', )), callback = 'parse_page', follow = True),
    )

    headers = {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4",
        "Connection": "keep-alive",
        "Content-Type":" application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2125.111 Safari/537.36",
        "Referer": "http://www.zhihu.com/"
    }

    #重写了爬虫类的方法, 实现了自定义请求, 运行成功后会调用callback回调函数
    def start_requests(self):
        return [Request("https://www.zhihu.com/login", meta = {'cookiejar' : 1}, callback = self.post_login)]

    def post_login(self, response):
        print 'Preparing login'
        #下面这句话用于抓取请求网页后返回网页中的_xsrf字段的文字, 用于成功提交表单
        xsrf = response.xpath('//input[@name="_xsrf"]/@value').extract()[0]
        print xsrf
        #FormRequeset.from_response是Scrapy提供的一个函数, 用于post表单
        #登陆成功后, 会调用after_login回调函数
        return [FormRequest.from_response(response,   #"http://www.zhihu.com/login",
                            meta = {'cookiejar' : response.meta['cookiejar']},
                            headers = self.headers,  #注意此处的headers
                            formdata = {
                            '_xsrf': xsrf,
                            'email': '123456@qq.com',
                            'password': '123456'
                            },
                            callback = self.after_login,
                            dont_filter = True
                            )]

    def after_login(self, response) :
        for url in self.start_urls :
            yield self.make_requests_from_url(url)

    def parse_page(self, response):
        problem = Selector(response)
        item = ZhihuItem()
        item['url'] = response.url
        item['name'] = problem.xpath('//span[@class="name"]/text()').extract()
        print item['name']
        item['title'] = problem.xpath('//h2[@class="zm-item-title zm-editable-content"]/text()').extract()
        item['description'] = problem.xpath('//div[@class="zm-editable-content"]/text()').extract()
        item['answer']= problem.xpath('//div[@class=" zm-editable-content clearfix"]/text()').extract()
        return item
```

Item类设置

```python
from scrapy.item import Item, Field

class ZhihuItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    url = Field()  #保存抓取问题的url
    title = Field()  #抓取问题的标题
    description = Field()  #抓取问题的描述
    answer = Field()  #抓取问题的答案
    name = Field()  #个人用户的名称
```

setting.py 设置抓取间隔

```python
BOT_NAME = 'zhihu'

SPIDER_MODULES = ['zhihu.spiders']
NEWSPIDER_MODULE = 'zhihu.spiders'
DOWNLOAD_DELAY = 0.25   #设置下载间隔为250ms
```

## Settings

Scrapy设置(settings)提供了定制Scrapy组件的方法。可以控制包括核心(core)，插件(extension)，pipeline及spider组件。比如 设置Json Pipeliine、LOG_LEVEL等。

参考文档：http://scrapy-chs.readthedocs.io/zh_CN/1.0/topics/settings.html#topics-settings-ref

内置设置参考手册

- `BOT_NAME`

  - 默认: 'scrapybot'
  - 当您使用 startproject 命令创建项目时其也被自动赋值。

- `CONCURRENT_ITEMS`

  - 默认: 100
  - Item Processor(即 Item Pipeline) 同时处理(每个response的)item的最大值。

- `CONCURRENT_REQUESTS`

  - 默认: 16
  - Scrapy downloader 并发请求(concurrent requests)的最大值。

-  `DEFAULT_REQUEST_HEADERS`

  - 默认: 如下

    ```
    {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en',
    }
    ```

    Scrapy HTTP Request使用的默认header。

- `DEPTH_LIMIT`

  - 默认: 0
  - 爬取网站最大允许的深度(depth)值。如果为0，则没有限制。

- `DOWNLOAD_DELAY`

  - 默认: 0
  - 下载器在下载同一个网站下一个页面前需要等待的时间。该选项可以用来限制爬取速度， 减轻服务器压力。同时也支持小数:

  `DOWNLOAD_DELAY = 0.25 # 250 ms of delay`

  - 默认情况下，Scrapy在两个请求间不等待一个固定的值， 而是使用0.5到1.5之间的一个随机值 * DOWNLOAD_DELAY 的结果作为等待间隔。

- `DOWNLOAD_TIMEOUT`

  - 默认: 180
  - 下载器超时时间(单位: 秒)。

- `ITEM_PIPELINES`

  - 默认: {}

  - 保存项目中启用的pipeline及其顺序的字典。该字典默认为空，值(value)任意，不过值(value)习惯设置在0-1000范围内，值越小优先级越高。

    ```
    ITEM_PIPELINES = {
    'mySpider.pipelines.SomethingPipeline': 300,
    'mySpider.pipelines.ItcastJsonPipeline': 800,
    }
    ```

- `LOG_ENABLED`

  - 默认: True
  - 是否启用logging。

- `LOG_ENCODING`

  - 默认: 'utf-8'
  - logging使用的编码。

- `LOG_LEVEL`

  - 默认: 'DEBUG'
  - log的最低级别。可选的级别有: CRITICAL、 ERROR、WARNING、INFO、DEBUG 。

- `USER_AGENT`

  - 默认: "Scrapy/VERSION (+[http://scrapy.org](http://scrapy.org/))"
  - 爬取的默认User-Agent，除非被覆盖。

- `PROXIES`： 代理设置

  - 示例：

    ```
    PROXIES = [
      {'ip_port': '111.11.228.75:80', 'password': ''},
      {'ip_port': '120.198.243.22:80', 'password': ''},
      {'ip_port': '111.8.60.9:8123', 'password': ''},
      {'ip_port': '101.71.27.120:80', 'password': ''},
      {'ip_port': '122.96.59.104:80', 'password': ''},
      {'ip_port': '122.224.249.122:8088', 'password':''},
    ]
    ```

-  `COOKIES_ENABLED = False`

  - 禁用Cookies
  
- `ROBOTSTXT_OBEY = True`

  ​     通俗来说， robots.txt 是遵循 Robot协议 的一个文件，它保存在网站的服务器中，它的作用是，告诉搜索引擎爬虫，本网站哪些目录下的网页 不希望 你进行爬取收录。在Scrapy启动后，会在第一时间访问网站的 robots.txt 文件，然后决定该网站的爬取范围。

  当然，我们并不是在做搜索引擎，而且在某些情况下我们想要获取的内容恰恰是被 robots.txt 所禁止访问的。所以，某些时候，我们就要将此配置项设置为 False ，拒绝遵守 Robot协议 ！  

## CrawlSpiders

> 通过下面的命令可以快速创建 CrawlSpider模板 的代码：
>
> ```
> scrapy genspider -t crawl [爬虫名] [域名]
> ```

上一个案例中，我们通过正则表达式，制作了新的url作为Request请求参数，现在我们可以换个花样...

```
class scrapy.spiders.CrawlSpider
```

它是Spider的派生类，Spider类的设计原则是只爬取start_url列表中的网页，而CrawlSpider类定义了一些规则(rule)来提供跟进link的方便的机制，从爬取的网页中获取link并继续爬取的工作更适合。

### 源码参考

```python
class CrawlSpider(Spider):
    rules = ()
    def __init__(self, *a, **kw):
        super(CrawlSpider, self).__init__(*a, **kw)
        self._compile_rules()

    #首先调用parse()来处理start_urls中返回的response对象
    #parse()则将这些response对象传递给了_parse_response()函数处理，并设置回调函数为parse_start_url()
    #设置了跟进标志位True
    #parse将返回item和跟进了的Request对象    
    def parse(self, response):
        return self._parse_response(response, self.parse_start_url, cb_kwargs={}, follow=True)

    #处理start_url中返回的response，需要重写
    def parse_start_url(self, response):
        return []

    def process_results(self, response, results):
        return results

    #从response中抽取符合任一用户定义'规则'的链接，并构造成Resquest对象返回
    def _requests_to_follow(self, response):
        if not isinstance(response, HtmlResponse):
            return
        seen = set()
        #抽取之内的所有链接，只要通过任意一个'规则'，即表示合法
        for n, rule in enumerate(self._rules):
            links = [l for l in rule.link_extractor.extract_links(response) if l not in seen]
            #使用用户指定的process_links处理每个连接
            if links and rule.process_links:
                links = rule.process_links(links)
            #将链接加入seen集合，为每个链接生成Request对象，并设置回调函数为_repsonse_downloaded()
            for link in links:
                seen.add(link)
                #构造Request对象，并将Rule规则中定义的回调函数作为这个Request对象的回调函数
                r = Request(url=link.url, callback=self._response_downloaded)
                r.meta.update(rule=n, link_text=link.text)
                #对每个Request调用process_request()函数。该函数默认为indentify，即不做任何处理，直接返回该Request.
                yield rule.process_request(r)

    #处理通过rule提取出的连接，并返回item以及request
    def _response_downloaded(self, response):
        rule = self._rules[response.meta['rule']]
        return self._parse_response(response, rule.callback, rule.cb_kwargs, rule.follow)

    #解析response对象，会用callback解析处理他，并返回request或Item对象
    def _parse_response(self, response, callback, cb_kwargs, follow=True):
        #首先判断是否设置了回调函数。（该回调函数可能是rule中的解析函数，也可能是 parse_start_url函数）
        #如果设置了回调函数（parse_start_url()），那么首先用parse_start_url()处理response对象，
        #然后再交给process_results处理。返回cb_res的一个列表
        if callback:
            #如果是parse调用的，则会解析成Request对象
            #如果是rule callback，则会解析成Item
            cb_res = callback(response, **cb_kwargs) or ()
            cb_res = self.process_results(response, cb_res)
            for requests_or_item in iterate_spider_output(cb_res):
                yield requests_or_item

        #如果需要跟进，那么使用定义的Rule规则提取并返回这些Request对象
        if follow and self._follow_links:
            #返回每个Request对象
            for request_or_item in self._requests_to_follow(response):
                yield request_or_item

    def _compile_rules(self):
        def get_method(method):
            if callable(method):
                return method
            elif isinstance(method, basestring):
                return getattr(self, method, None)

        self._rules = [copy.copy(r) for r in self.rules]
        for rule in self._rules:
            rule.callback = get_method(rule.callback)
            rule.process_links = get_method(rule.process_links)
            rule.process_request = get_method(rule.process_request)

    def set_crawler(self, crawler):
        super(CrawlSpider, self).set_crawler(crawler)
        self._follow_links = crawler.settings.getbool('CRAWLSPIDER_FOLLOW_LINKS', True)
```

CrawlSpider继承于Spider类，除了继承过来的属性外（name、allow_domains），还提供了新的属性和方法:

### rules

CrawlSpider使用rules来决定爬虫的爬取规则，并将匹配后的url请求提交给引擎。所以在正常情况下，CrawlSpider不需要单独手动返回请求了。

在rules中包含一个或多个Rule对象，每个Rule对爬取网站的动作定义了某种特定操作，比如提取当前相应内容里的特定链接，是否对提取的链接跟进爬取，对提交的请求设置回调函数等。

如果多个rule匹配了相同的链接，则根据规则在本集合中被定义的顺序，第一个会被使用。

```python
class scrapy.spiders.Rule(
        link_extractor, 
        callback = None, 
        cb_kwargs = None, 
        follow = None, 
        process_links = None, 
        process_request = None
)
```

- `link_extractor`：是一个Link Extractor对象，用于定义需要提取的链接。

- `callback`： 从link_extractor中每获取到链接时，参数所指定的值作为回调函数，该回调函数接受一个response作为其第一个参数。

  > 注意：当编写爬虫规则时，避免使用parse作为回调函数。由于CrawlSpider使用parse方法来实现其逻辑，如果覆盖了 parse方法，crawl spider将会运行失败。

- `follow`：是一个布尔(boolean)值，指定了根据该规则从response提取的链接是否需要跟进。 如果callback为None，follow 默认设置为True ，否则默认为False。

- `process_links`：指定该spider中哪个的函数将会被调用，从link_extractor中获取到链接列表时将会调用该函数。该方法主要用来过滤。

- `process_request`：指定该spider中哪个的函数将会被调用， 该规则提取到每个request时都会调用该函数。 (用来过滤request)

### LinkExtractors

```python
class scrapy.linkextractors.LinkExtractor
```

Link Extractors 的目的很简单: 提取链接｡

每个LinkExtractor有唯一的公共方法是 extract_links()，它接收一个 Response 对象，并返回一个 scrapy.link.Link 对象。

Link Extractors要实例化一次，并且 extract_links 方法会根据不同的 response 调用多次提取链接｡

```python
class scrapy.linkextractors.LinkExtractor(
    allow = (),
    deny = (),
    allow_domains = (),
    deny_domains = (),
    deny_extensions = None,
    restrict_xpaths = (),
    tags = ('a','area'),
    attrs = ('href'),
    canonicalize = True,
    unique = True,
    process_value = None
)
```

主要参数：

- `allow`：满足括号中“正则表达式”的URL会被提取，如果为空，则全部匹配。
- `deny`：满足括号中“正则表达式”的URL一定不提取（优先级高于allow）。
- `allow_domains`：会被提取的链接的domains。
- `deny_domains`：一定不会被提取链接的domains。
- `restrict_xpaths`：使用xpath表达式，和allow共同作用过滤链接。

### 爬取规则(Crawling rules)

继续用腾讯招聘为例，给出配合rule使用CrawlSpider的例子:

1. 首先运行

   ```sh
    scrapy shell "http://hr.tencent.com/position.php?&start=0#a"
   ```

2. 导入LinkExtractor，创建LinkExtractor实例对象。：

   ```python
    from scrapy.linkextractors import LinkExtractor
   
    page_lx = LinkExtractor(allow=('position.php?&start=\d+'))
   ```

   > allow : LinkExtractor对象最重要的参数之一，这是一个正则表达式，必须要匹配这个正则表达式(或正则表达式列表)的URL才会被提取，如果没有给出(或为空), 它会匹配所有的链接｡
   >
   > deny : 用法同allow，只不过与这个正则表达式匹配的URL不会被提取)｡它的优先级高于 allow 的参数，如果没有给出(或None), 将不排除任何链接｡

3. 调用LinkExtractor实例的extract_links()方法查询匹配结果：

   ```python
    page_lx.extract_links(response)
   ```

4. 没有查到：

   ```python
    []
   ```

5. 注意转义字符的问题，继续重新匹配：

   ```python
    page_lx = LinkExtractor(allow=('position\.php\?&start=\d+'))
    # page_lx = LinkExtractor(allow = ('start=\d+'))
   
    page_lx.extract_links(response)
   ```

![img](http://www.nikola.ltd/s/python/Spider/file/images/tencent_rule.png)

### CrawlSpider 版本

那么，scrapy shell测试完成之后，修改以下代码

```python
#提取匹配 'http://hr.tencent.com/position.php?&start=\d+'的链接
page_lx = LinkExtractor(allow = ('start=\d+'))

rules = [
    #提取匹配,并使用spider的parse方法进行分析;并跟进链接(没有callback意味着follow默认为True)
    Rule(page_lx, callback = 'parse', follow = True)
]
```

**这么写对吗？**

**不对！千万记住 callback 千万不能写 parse，再次强调：由于CrawlSpider使用parse方法来实现其逻辑，如果覆盖了 parse方法，crawl spider将会运行失败。**

```python
#tencent.py

import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from mySpider.items import TencentItem

class TencentSpider(CrawlSpider):
    name = "tencent"
    allowed_domains = ["hr.tencent.com"]
    start_urls = [
        "http://hr.tencent.com/position.php?&start=0#a"
    ]

    page_lx = LinkExtractor(allow=("start=\d+"))

    rules = [
        Rule(page_lx, callback = "parseContent", follow = True)
    ]

    def parseContent(self, response):
        for each in response.xpath('//*[@class="even"]'):
            name = each.xpath('./td[1]/a/text()').extract()[0]
            detailLink = each.xpath('./td[1]/a/@href').extract()[0]
            positionInfo = each.xpath('./td[2]/text()').extract()[0]

            peopleNumber = each.xpath('./td[3]/text()').extract()[0]
            workLocation = each.xpath('./td[4]/text()').extract()[0]
            publishTime = each.xpath('./td[5]/text()').extract()[0]
            #print name, detailLink, catalog,recruitNumber,workLocation,publishTime

            item = TencentItem()
            item['name']=name.encode('utf-8')
            item['detailLink']=detailLink.encode('utf-8')
            item['positionInfo']=positionInfo.encode('utf-8')
            item['peopleNumber']=peopleNumber.encode('utf-8')
            item['workLocation']=workLocation.encode('utf-8')
            item['publishTime']=publishTime.encode('utf-8')

            yield item

    # parse() 方法不需要重写     
    # def parse(self, response):                                              
    #     pass
```

运行： `scrapy crawl tencent`

## Logging

Scrapy提供了log功能，可以通过 logging 模块使用。

> 可以修改配置文件settings.py，任意位置添加下面两行，效果会清爽很多。

```
LOG_FILE = "TencentSpider.log"
LOG_LEVEL = "INFO"
```

### Log levels

- Scrapy提供5层logging级别:
- CRITICAL - 严重错误(critical)
- ERROR - 一般错误(regular errors)
- WARNING - 警告信息(warning messages)
- INFO - 一般信息(informational messages)
- DEBUG - 调试信息(debugging messages)

### logging设置 

通过在setting.py中进行以下设置可以被用来配置logging:

1. `LOG_ENABLED` 默认: True，启用logging
2. `LOG_ENCODING` 默认: 'utf-8'，logging使用的编码
3. `LOG_FILE` 默认: None，在当前目录里创建logging输出文件的文件名
4. `LOG_LEVEL` 默认: 'DEBUG'，log的最低级别
5. `LOG_STDOUT` 默认: False 如果为 True，进程所有的标准输出(及错误)将会被重定向到log中。例如，执行 print "hello" ，其将会在Scrapy log中显示。

## Scrapy Shell

Scrapy终端是一个交互终端，我们可以在未启动spider的情况下尝试及调试代码，也可以用来测试XPath或CSS表达式，查看他们的工作方式，方便我们爬取的网页中提取的数据。

如果安装了 IPython ，Scrapy终端将使用 IPython (替代标准Python终端)。 IPython 终端与其他相比更为强大，提供智能的自动补全，高亮输出，及其他特性。（推荐安装IPython）

### 启动Scrapy Shell

进入项目的根目录，执行下列命令来启动shell:

```python
scrapy shell "http://www.itcast.cn/channel/teacher.shtml"
```

![img](http://www.nikola.ltd/s/python/Spider/file/images/scrapy_shell.png)

Scrapy Shell根据下载的页面会自动创建一些方便使用的对象，例如 Response 对象，以及 `Selector 对象 (对HTML及XML内容)`。

- 当shell载入后，将得到一个包含response数据的本地 response 变量，输入 `response.body`将输出response的包体，输出 `response.headers` 可以看到response的包头。
- 输入 `response.selector` 时， 将获取到一个response 初始化的类 Selector 的对象，此时可以通过使用 `response.selector.xpath()`或`response.selector.css()` 来对 response 进行查询。
- Scrapy也提供了一些快捷方式, 例如 `response.xpath()`或`response.css()`同样可以生效（如之前的案例）。

### Selectors选择器

Scrapy Selectors 内置 XPath 和 CSS Selector 表达式机制

Selector有四个基本的方法，最常用的还是xpath:

- xpath(): 传入xpath表达式，返回该表达式所对应的所有节点的selector list列表
- extract(): 序列化该节点为Unicode字符串并返回list
- css(): 传入CSS表达式，返回该表达式所对应的所有节点的selector list列表，语法同 BeautifulSoup4
- re(): 根据传入的正则表达式对数据进行提取，返回Unicode字符串list列表

XPath表达式的例子及对应的含义:

```html
/html/head/title: 选择<HTML>文档中 <head> 标签内的 <title> 元素
/html/head/title/text(): 选择上面提到的 <title> 元素的文字
//td: 选择所有的 <td> 元素
//div[@class="mine"]: 选择所有具有 class="mine" 属性的 div 元素
```

尝试Selector

我们用腾讯社招的网站http://hr.tencent.com/position.php?&start=0#a举例：

```python
# 启动
scrapy shell "http://hr.tencent.com/position.php?&start=0#a"

# 返回 xpath选择器对象列表
response.xpath('//title')
[<Selector xpath='//title' data=u'<title>\u804c\u4f4d\u641c\u7d22 | \u793e\u4f1a\u62db\u8058 | Tencent \u817e\u8baf\u62db\u8058</title'>]

# 使用 extract()方法返回 Unicode字符串列表
response.xpath('//title').extract()
[u'<title>\u804c\u4f4d\u641c\u7d22 | \u793e\u4f1a\u62db\u8058 | Tencent \u817e\u8baf\u62db\u8058</title>']

# 打印列表第一个元素，终端编码格式显示
print response.xpath('//title').extract()[0]
<title>职位搜索 | 社会招聘 | Tencent 腾讯招聘</title>

# 返回 xpath选择器对象列表
response.xpath('//title/text()')
<Selector xpath='//title/text()' data=u'\u804c\u4f4d\u641c\u7d22 | \u793e\u4f1a\u62db\u8058 | Tencent \u817e\u8baf\u62db\u8058'>

# 返回列表第一个元素的Unicode字符串
response.xpath('//title/text()')[0].extract()
u'\u804c\u4f4d\u641c\u7d22 | \u793e\u4f1a\u62db\u8058 | Tencent \u817e\u8baf\u62db\u8058'

# 按终端编码格式显示
print response.xpath('//title/text()')[0].extract()
职位搜索 | 社会招聘 | Tencent 腾讯招聘

response.xpath('//*[@class="even"]')
职位名称:

print site[0].xpath('./td[1]/a/text()').extract()[0]
TEG15-运营开发工程师（深圳）
职位名称详情页:

print site[0].xpath('./td[1]/a/@href').extract()[0]
position_detail.php?id=20744&keywords=&tid=0&lid=0
职位类别:

print site[0].xpath('./td[2]/text()').extract()[0]
技术类
```

以后做数据提取的时候，可以把现在Scrapy Shell中测试，测试通过后再应用到代码中。

当然Scrapy Shell作用不仅仅如此，但是不属于我们课程重点，不做详细介绍。

官方文档：http://scrapy-chs.readthedocs.io/zh_CN/latest/topics/shell.html

## 反反爬虫相关机制

Some websites implement certain measures to prevent bots from crawling them, with varying degrees of sophistication. Getting around those measures can be difficult and tricky, and may sometimes require special infrastructure. Please consider contacting commercial support if in doubt.

(有些些网站使用特定的不同程度的复杂性规则防止爬虫访问，绕过这些规则是困难和复杂的，有时可能需要特殊的基础设施，如果有疑问，请联系商业支持。)

> 来自于Scrapy官方文档描述：http://doc.scrapy.org/en/master/topics/practices.html#avoiding-getting-banned

通常防止爬虫被反主要有以下几个策略：

- 动态设置User-Agent（随机切换User-Agent，模拟不同用户的浏览器信息）

- 禁用Cookies（也就是不启用cookies middleware，不向Server发送cookies，有些网站通过cookie的使用发现爬虫行为）

  - 可以通过`COOKIES_ENABLED` 控制 CookiesMiddleware 开启或关闭

- 设置延迟下载（防止访问过于频繁，设置为 2秒 或更高）

- Google Cache 和 Baidu Cache：如果可能的话，使用谷歌/百度等搜索引擎服务器页面缓存获取页面数据。

- 使用IP地址池：VPN和代理IP，现在大部分网站都是根据IP来ban的。

- 使用 [Crawlera](https://scrapinghub.com/crawlera)（专用于爬虫的代理组件），正确配置和设置下载中间件后，项目所有的request都是通过crawlera发出。

  ```python
    DOWNLOADER_MIDDLEWARES = {
        'scrapy_crawlera.CrawleraMiddleware': 600
    }
  
    CRAWLERA_ENABLED = True
    CRAWLERA_USER = '注册/购买的UserKey'
    CRAWLERA_PASS = '注册/购买的Password'
  ```

  

### 设置下载中间件（Downloader Middlewares）

下载中间件是处于引擎(crawler.engine)和下载器(crawler.engine.download())之间的一层组件，可以有多个下载中间件被加载运行。

1. 当引擎传递请求给下载器的过程中，下载中间件可以对请求进行处理 （例如增加http header信息，增加proxy信息等）；
2. 在下载器完成http请求，传递响应给引擎的过程中， 下载中间件可以对响应进行处理（例如进行gzip的解压等）

要激活下载器中间件组件，将其加入到 DOWNLOADER_MIDDLEWARES 设置中。 该设置是一个字典(dict)，键为中间件类的路径，值为其中间件的顺序(order)。

这里是一个例子:

```python
DOWNLOADER_MIDDLEWARES = {
    'mySpider.middlewares.MyDownloaderMiddleware': 543,
}
```

编写下载器中间件十分简单。每个中间件组件是一个定义了以下一个或多个方法的Python类:

```python
class scrapy.contrib.downloadermiddleware.DownloaderMiddleware
```

process_request(self, request, spider)

- 当每个request通过下载中间件时，该方法被调用。
- process_request() 必须返回以下其中之一：一个 None 、一个 Response 对象、一个 Request 对象或 raise IgnoreRequest:
  - 如果其返回 None ，Scrapy将继续处理该request，执行其他的中间件的相应方法，直到合适的下载器处理函数(download handler)被调用， 该request被执行(其response被下载)。
  - 如果其返回 Response 对象，Scrapy将不会调用 任何 其他的 process_request() 或 process_exception() 方法，或相应地下载函数； 其将返回该response。 已安装的中间件的 process_response() 方法则会在每个response返回时被调用。
  - 如果其返回 Request 对象，Scrapy则停止调用 process_request方法并重新调度返回的request。当新返回的request被执行后， 相应地中间件链将会根据下载的response被调用。
  - 如果其raise一个 IgnoreRequest 异常，则安装的下载中间件的 process_exception() 方法会被调用。如果没有任何一个方法处理该异常， 则request的errback(Request.errback)方法会被调用。如果没有代码处理抛出的异常， 则该异常被忽略且不记录(不同于其他异常那样)。
- 参数:
  - `request (Request 对象)` – 处理的request
  - `spider (Spider 对象)` – 该request对应的spider

process_response(self, request, response, spider)

当下载器完成http请求，传递响应给引擎的时候调用

- process_request() 必须返回以下其中之一: 返回一个 Response 对象、 返回一个 Request 对象或raise一个 IgnoreRequest 异常。
  - 如果其返回一个 Response (可以与传入的response相同，也可以是全新的对象)， 该response会被在链中的其他中间件的 process_response() 方法处理。
  - 如果其返回一个 Request 对象，则中间件链停止， 返回的request会被重新调度下载。处理类似于 process_request() 返回request所做的那样。
  - 如果其抛出一个 IgnoreRequest 异常，则调用request的errback(Request.errback)。 如果没有代码处理抛出的异常，则该异常被忽略且不记录(不同于其他异常那样)。
- 参数:
  - `request (Request 对象)` – response所对应的request
  - `response (Response 对象)` – 被处理的response
  - `spider (Spider 对象)` – response所对应的spider

### 使用案例：

1. 创建`middlewares.py`文件。

Scrapy代理IP、Uesr-Agent的切换都是通过`DOWNLOADER_MIDDLEWARES`进行控制，我们在`settings.py`同级目录下创建`middlewares.py`文件，包装所有请求。

```python
# middlewares.py

#!/usr/bin/env python
# -*- coding:utf-8 -*-

import random
import base64

from settings import USER_AGENTS
from settings import PROXIES

# 随机的User-Agent
class RandomUserAgent(object):
    def process_request(self, request, spider):
        useragent = random.choice(USER_AGENTS)

        request.headers.setdefault("User-Agent", useragent)

class RandomProxy(object):
    def process_request(self, request, spider):
        proxy = random.choice(PROXIES)

        if proxy['user_passwd'] is None:
            # 没有代理账户验证的代理使用方式
            request.meta['proxy'] = "http://" + proxy['ip_port']
        else:
            # 对账户密码进行base64编码转换
            base64_userpasswd = base64.b64encode(proxy['user_passwd'])
            # 对应到代理服务器的信令格式里
            request.headers['Proxy-Authorization'] = 'Basic ' + base64_userpasswd
            request.meta['proxy'] = "http://" + proxy['ip_port']
```

> 为什么HTTP代理要使用base64编码：
>
> HTTP代理的原理很简单，就是通过HTTP协议与代理服务器建立连接，协议信令中包含要连接到的远程主机的IP和端口号，如果有需要身份验证的话还需要加上授权信息，服务器收到信令后首先进行身份验证，通过后便与远程主机建立连接，连接成功之后会返回给客户端200，表示验证通过，就这么简单，下面是具体的信令格式：

```
CONNECT 59.64.128.198:21 HTTP/1.1
Host: 59.64.128.198:21
Proxy-Authorization: Basic bGV2I1TU5OTIz
User-Agent: OpenFetion
```

> 其中`Proxy-Authorization`是身份验证信息，Basic后面的字符串是用户名和密码组合后进行base64编码的结果，也就是对username:password进行base64编码。

```
HTTP/1.0 200 Connection established
```

> OK，客户端收到收面的信令后表示成功建立连接，接下来要发送给远程主机的数据就可以发送给代理服务器了，代理服务器建立连接后会在根据IP地址和端口号对应的连接放入缓存，收到信令后再根据IP地址和端口号从缓存中找到对应的连接，将数据通过该连接转发出去。

2. 修改settings.py配置USER_AGENTS和PROXIES

- 添加USER_AGENTS：

```python
　　USER_AGENTS = [
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)",
    "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.04506.30)",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)",
    "Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0",
    "Mozilla/5.0 (X11; Linux i686; U;) Gecko/20070322 Kazehakase/0.4.5"
    ]
```

- 添加代理IP设置PROXIES：

  免费代理IP可以网上搜索，或者付费购买一批可用的私密代理IP：

```python
PROXIES = [
    {'ip_port': '111.8.60.9:8123', 'user_passwd': 'user1:pass1'},
    {'ip_port': '101.71.27.120:80', 'user_passwd': 'user2:pass2'},
    {'ip_port': '122.96.59.104:80', 'user_passwd': 'user3:pass3'},
    {'ip_port': '122.224.249.122:8088', 'user_passwd': 'user4:pass4'},
]
```

- 除非特殊需要，禁用cookies，防止某些网站根据Cookie来封锁爬虫。

```
COOKIES_ENABLED = False
```

- 设置下载延迟

```
DOWNLOAD_DELAY = 3
```

- 最后设置setting.py里的DOWNLOADER_MIDDLEWARES，添加自己编写的下载中间件类。

```python
DOWNLOADER_MIDDLEWARES = {
    #'mySpider.middlewares.MyCustomDownloaderMiddleware': 543,
    'mySpider.middlewares.RandomUserAgent': 1,
    'mySpider.middlewares.ProxyMiddleware': 100
}
```

## 下载图片和文件

Scrapy为下载item中包含的文件（比如在爬取到产品时，同时也想保存对应的图片）提供了一个可重用的item pipelines。这些oipeline 有些共同的方法和结构（我们称之为media pipeline）。一般来说你会使用Files Pipeline或者Images Pipeline。

Scrapy内置下载文件方法的好处：

1. 避免重新下载最近已经下载过的文件。
2. 可以方便的指定文件存储的路径。
3. 可以将下载的图片转换成通用的格式。比如png或jpg。
4. 可以方便的生成缩略图。
5. 可以方便的检测图片的宽和高，确保他们满足最小限制。
6. 异步下载，效率非常高。

### Files Pipeline

当使用Fi1es Pipeline下载文件的时候，按照以下步骤来完成：

1. 定义好一个Item，然后在这个iten中定义两个属性，分另别为file-urls以及fi1es。file-urls是用来存储需要下载的文件的url链接，需要给一个列表。
2. 当文件下载完成后，会把文件下载的相关信息存储到item的files属性中。比如下载路径、下载的url和文件的校验码等。
3. 在配置文件 settings.py 中配置FILES_STORE，这个配置是用来设置文件下载下来的路径。
4. 启动pipeline：在ITEPLPIPELINES中设置scrapy.pipelines.files.FilesPipeline：1。

### Images Pipeline

当使用Images Pipeline 下载文件的时候，按照以下步疆来完成：

1. 定义好一个Item，然后在这个item中定义两个属性，分别为image_urls以及images。image-urls是用来存储需要下载的图片的url链接，需要给一个列表。
2. 当文件下载完成后，会把文件下载的相关信息存储到item的images属性中。比如下载路径、下载的url和图片的校验码等。
3. 在配置文件settings.py 中配置IMAGES_STORE，这个配置是用来设置图片下载下来的路径。
4. 启动pipeline：在ITEL_PIPELINES 中设置 scrapy.pipelines.images.ImagesPipeline：1

其中ImagePipeline中的file_path方法返回的路径是`'full/%s.jpg' % (image_guid)` , 所以直接使用ImagePipeline， 而不是重写ImagePipeline中的方法，那么下载的图片都会下载到你配置的的IMAGES_STORE目录下的full目录下

### 实现下载图片到本地

items.py

```python
class BmwItem(scrapy.Item):
    category = scrapy.Field()
    image_urls = scrapy.Field()
    images = scrapy.Field()
```

bwmspilder.py

```python
# -*- coding: utf-8 -*-
import scrapy
from bmw.items import BmwItem

class Bmw5Spider(scrapy.Spider):
    name = 'bmw5'
    allowed_domains = ['car.autohome.com.cn']
    start_urls = ['https://car.autohome.com.cn/pic/series/65.html']

    def parse(self, response):
        uiboxs = response.xpath("//div[@class='uibox']")[1:]
        for uibox in uiboxs:
            category = uibox.xpath(".//div[@class='uibox-title']/a/text()").get()
            urls = uibox.xpath(".//ul/li/a/img/@src").getall()
            urls = list(map(lambda x:response.urljoin(x),urls))
            item = BmwItem(partname=partname,urls=urls)
            yield item
```

pipeline.py

```python
class BMWImagePipeline(ImagePipeline):
    # item参数是爬取生成的item对象,从中提取url字段,然后加入到调用队列中,等待下载。
    # 所以方法是在发送下载请求之前调用的，用来搜集下载链接
    def get_media_requests(self, item, info):
        request_objs = super(BWMImagesPipeline, self).get_media_requests(item, info)
        for request_obj in request_objs:
            request_obj.item = item
        return request_objs
    
    # request表示当前下载对应的request对象(request.__dict__查看属性),该方法用来保存文件名
    # 者个方法是在图片要被存储的时候调用，来获取这个图片存储的路径
    def file_path(self, request, response=None, info=None):
        path = super(BMWImagesPipeline, self).file_path(request, response, info)
        category = request.item.get('category')
        category_path = os.path.join(images_store, category)
        if not os.path.exists(category_path):
            os.mkdir(category_path)
        image_name = path.replace("full/", "")
        image_path = os.path.join(category_path, image_name)
        return image_path
```

setting.py

```python
ITEM_PIPELINES={
    'bmw.pipelines.BMWImagesPipeline':1
}
```

# 动态获取验证码方法
如果一个验证码是有由于一个动态链接生成的。 因为验证码是由动态链接生成的，所以你获取这个验证码时只能通过想找个动态链接发起请求才能获取到， 但是如果你向这个动态链接发送请求时， 返回给你的又是另一个随机生成的验证码，与你登录页面的不一样。  为了解决这个问题， 就必须要借助Cookie。
首先你先请求登录页面时， 这个服务器会向你返回Cookie,  获取这个Cookie,  然后带着这个Cookie去获取请求验证码的url， 获取验证码， 然后登录即可
案例如下：
```python
# -*- coding: utf-8 -*-
import scrapy
from PIL import Image
from urllib import request


class WeiboLoginSpider(scrapy.Spider):
	name = 'weibo_login'
	allowed_domains = []
	start_urls = ["http://kdjw.hnust.edu.cn:8080/kdjw/"]
	login_url = "http://kdjw.hnust.edu.cn:8080/kdjw/Logon.do?method=logon"
	captcha_url = "http://kdjw.hnust.edu.cn:8080/kdjw/verifycode.servlet"

	def start_requests(self):
		return [scrapy.Request("http://kdjw.hnust.edu.cn:8080/kdjw/", callback=self.get_captcha_cookies)]

	def get_captcha_cookies(self, response):
		cookies_str = response.headers.get("Set-Cookie")
		cookies = {"Cookie": cookies_str}
		return [scrapy.Request(url=self.captcha_url, cookies=cookies, callback=self.parse_login)]

	def parse_login(self, response):
		cookies_str = response.headers.get("Set-Cookie")
		cookies = {"Cookie": cookies_str}
		with open("fff.jpg", "wb") as fp:
			fp.write(response.body)
			fp.close()
		image = Image.open('fff.jpg')
		image.show()
		captcha = input("Please input the captcha")
		data1 = {
			"USERNAME": "1705050109",
			"PASSWORD": "037031",
			"RANDOMCODE": captcha,
			"useDogCode": "",
			"x": '0',
			"y": '0',
			"dlfl": "0"
		}
		return [scrapy.FormRequest(url=self.login_url, cookies=cookies, formdata=data1, callback=self.parse_main,
								   dont_filter=True)]

	def parse_main(self, response):
		print(response.text)
		print(response.url)
```
