# Nosql概述
## 为什么用Nosql
先聊一下数据库的发展史：
1. 单机MySQL的年代！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418162547.png" width="700px"/>
90年代，一个基本的网站访问量一般不会太大，单个数据库完全足够！
那个时候，更多的去使用静态网页 Html ~ 服务器根本没有太大的压力！
思考一下，这种情况下：整个网站的瓶颈是什么？
- 数据量如果太大、一个机器放不下了！
- 数据的索引 （B+ Tree），一个机器内存也放不下
- 访问量（读写混合），一个服务器承受不了~
只要你开始出现以上的三种情况之一，那么你就必须要晋级！

2. 使用Memcached（缓存） + MySQL + 垂直拆分 （读写分离）时代
由于网站在80%的情况下都是在读，每次都要去查询数据库的话就十分的麻烦！所以说我们希望减轻数据的压
力，我们可以使用缓存来保证效率！
发展过程： 优化数据结构和索引--> 文件缓存（IO）---> Memcached（当时最热门的技术！）
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418162719.png" width="700px"/>

3. 使用分库分表 + 水平拆分 + MySQL集群的年代
技术和业务在发展的同时，对人的要求也越来越高！早年间，由于mysql使用的是MyISAM，而MyISAM只支持表锁，使得高并发下很容易出现严重的锁问题，后来，mysql转用Innodb, Innodb支持行锁，使得高并发下不是很容易出现锁问题，后来，mysql又推出了集群功能，很好满足哪个年代的所有需求！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418171310.png" width="700px"/>

4. 如今的时代: Nosql + RDBMS
随着互联网web2.0网站的兴起，传统的关系数据库在处理web2.0网站，特别是超大规模和高并发的SNS类型的web2.0纯动态网站已经显得力不从心，出现了很多难以克服的问题，而非关系型的数据库则由于其本身的特点得到了非常迅速的发展。NoSQL数据库的产生就是为了解决大规模数据集合多重数据种类带来的挑战，特别是大数据应用难题。

## 什么是Nosql
oSQL最常见的解释是“non-relational”， “Not Only SQL”也被很多人接受。NoSQL仅仅是一个概念，泛指非关系型的数据库，区别于关系数据库，它们不保证关系数据的ACID特性
NoSQL有如下优点：
- 易扩展，NoSQL数据库种类繁多，但是一个共同的特点都是去掉关系数据库的关系型特性。数据之间无关系，这样就非常容易扩展。无形之间也在架构的层面上带来了可扩展的能力。
- 大数据量，高性能，NoSQL数据库都具有非常高的读写性能，尤其在大数据量下，同样表现优秀。这得益于它的无关系性，数据库的结构简单
- 灵活的数据模型: NoSQL无须事先为要存储的数据建立字段，随时可以存储自定义的数据格式。而在关系数据库里，增删字段是一件非常麻烦的事情。如果是非常大数据量的表，增加字段简直就是——个噩梦。这点在大数据量的Web 2.0时代尤其明显
- 高可用: NoSQL在不太影响性能的情况，就可以方便地实现高可用的架构。比如Cassandra、HBase模型，通过复制模型也能实现高可用

## Nosql的四大分类
**1. 键值(Key-Value)存储数据库**
这一类数据库主要会使用到一个哈希表，这个表中有一个特定的键和一个指针指向特定的数据。Key/value模型对于IT系统来说的优势在于简单、易部署。但是如果数据库管理员(DBA)只对部分值进行查询或更新的时候，Key/value就显得效率低下了。举例如：Tokyo Cabinet/Tyrant， Redis， Voldemort， Oracle BDB。

**2. 列存储数据库**
这部分数据库通常是用来应对分布式存储的海量数据。键仍然存在，但是它们的特点是指向了多个列。这些列是由列家族来安排的。如：Cassandra， HBase， Riak.

**3. 文档型数据库**
文档型数据库的灵感是来自于Lotus Notes办公软件的，而且它同第一种键值存储相类似。该类型的数据模型是版本化的文档，半结构化的文档以特定的格式存储，比如JSON。文档型数据库可以看作是键值数据库的升级版，允许之间嵌套键值，在处理网页等复杂数据时，文档型数据库比传统键值数据库的查询效率更高。如：CouchDB， MongoDb. 国内也有文档型数据库SequoiaDB，已经开源。

**4. 图形(Graph)数据库**
图形结构的数据库同其他行列以及刚性结构的SQL数据库不同，它是使用灵活的图形模型，并且能够扩展到多个服务器上。NoSQL数据库没有标准的查询语言(SQL)，因此进行数据库查询需要制定数据模型。许多NoSQL数据库都有REST式的数据接口或者查询API。如：Neo4J， InfoGrid， Infinite Graph。

不同分类特点对比
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418185023.png" width="700px"/>

# Redis入门
Redis（Remote Dictionary Server )，即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API

与memcached一样，为了保证效率，数据都是缓存在内存中。区别的是redis会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了master-slave(主从)同步。

Redis支持主从同步。数据可以从主服务器向任意数量的从服务器上同步，从服务器可以是关联其他从服务器的主服务器。这使得Redis可执行单层树复制。存盘可以有意无意的对数据进行写操作。由于完全实现了发布/订阅机制，使得从数据库在任何地方同步树时，可订阅一个频道并接收主服务器完整的消息发布记录。同步对读取操作的可扩展性和数据冗余很有帮助。

## Linux下安装
Redis推荐都是在Linux服务器上搭建的
1. 下载安装包！ redis-5.0.8.tar.gz 
2. 解压Redis的安装包！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191731.png" width="700px"/>
3. 进入解压后的文件，可以看到我们redis的配置文件
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191743.png" width="700px"/>
4. 基本的环境安装
```shell
yum install gcc-c++ 
make
make install
```
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191815.png" width="700px"/>
5. redis的默认安装路径 /usr/local/bin
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191833.png" width="700px"/>
6. 将redis配置文件。复制到我们当前目录下
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191851.png" width="700px"/>
7. redis默认不是后台启动的，修改配置文件！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191906.png" width="700px"/>
8. 启动Redis服务！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191919.png" width="700px"/>
9. 使用redis-cli 进行连接测试！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191935.png" width="700px"/>
10. 查看redis的进程是否开启！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418191949.png" width="700px"/>
11. 如何关闭Redis服务呢？ shutdown
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418192012.png" width="700px"/>

## 测试性能 redis-benchmark 是一个压力测试工具！
官方自带的性能测试工具！
redis-benchmark 命令参数！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418192453.png" width="700px"/>

我们来简单测试下：
```shell
# 测试：100个并发连接 100000请求 
redis-benchmark -h localhost -p 6379 -c 100 -n 100000
```
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418192602.png" width="700px"/>
如何查看这些分析呢？
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418192615.png" width="700px"/>

## 基础的知识
redis默认有16个数据库
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418194720.png" width="700px"/>
默认使用的是第0个

```shell
127.0.0.1:6379> select 3 # 切换数据库 
OK

127.0.0.1:6379[3]> DBSIZE # 查看DB大小！ 
(integer) 0

127.0.0.1:6379[3]> keys * # 查看数据库所有的key 
1) "name"

127.0.0.1:6379[3]> flushdb # 清除当前数据库
OK

127.0.0.1:6379[3]> keys * 
(empty list or set)
```

### 为什么redis是单线程的
注意：redis 单线程指的是网络请求模块使用了一个线程，即一个线程处理所有网络请求，其他模块仍用了多个线程。
因为CPU不是Redis的瓶颈。Redis的瓶颈最有可能是机器内存或者网络带宽，既然单线程容易实现，而且CPU不会成为瓶颈，那就顺理成章地采用单线程的方案了。关于redis的性能，官方网站也有，普通笔记本轻松处理每秒几十万的请求

### Redis为什么这么快
- 完全基于内存，绝大部分请求是纯粹的内存操作，非常快速。数据存在内存中，类似于HashMap，HashMap的优势就是查找和操作的时间复杂度都是O(1)；
- 采用单线程，避免了不必要的上下文切换和竞争条件，也不存在多进程或者多线程导致的切换而消耗 CPU，不用去考虑各种锁的问题，不存在加锁释放锁操作，没有因为可能出现死锁而导致的性能消耗

# redis五大数据类型
Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件MQ。 它支持多种类型的数据结构，如 字符串（strings）， 散列（hashes）， 列表（lists）， 集合（sets）， 有序集合（sorted sets） 与范围查询， bitmaps， hyperloglogs 和 地理空间（geospatial） 索引半径查询。 Redis 内置了 复制（replication），LUA脚本（Lua scripting）， LRU驱动事件（LRU eviction），事务（transactions） 和不同级别的 磁盘持久化（persistence）， 并通过Redis哨兵（Sentinel）和自动 分区（Cluster）提供高可用性（high availability）。

后面如果遇到不会的命令，可以在官网查看帮助文档！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210418200927.png" width="700px"/>

## Redis-Key
**keys ***
```shell
127.0.0.1:6379> keys * # 查看所有的key 
1) "age" 
2) "name" 
```

**exists与move**
```shell
127.0.0.1:6379> EXISTS name # 判断当前的key是否存在 
(integer) 1 
127.0.0.1:6379> EXISTS name1 
(integer) 0 

127.0.0.1:6379> move name 1 # 移除当前的key, 后面的1表示当前数据库
(integer) 1 
127.0.0.1:6379> keys * 
1) "age" 
```

**expire与ttl**
```shell
127.0.0.1:6379> EXPIRE name 10 # 设置key的过期时间，单位是秒
(integer) 1
127.0.0.1:6379> ttl name # 查看当前key的剩余时间 
(integer) 3 
127.0.0.1:6379> ttl name 
(integer) 2 
127.0.0.1:6379> ttl name 
(integer) -2 
127.0.0.1:6379> EXISTS name
(integer) 0 
```
**对象作为key**
`set user:1 {name:zhangsan,age:3}`: 设置一个`user:1`对象,值为json字符
```shell
127.0.0.1:6379> mset user:1:name zhangsan user:1:age 2 
OK
127.0.0.1:6379> mget user:1:name user:1:age 
1) "zhangsan" 
2) "2"
```

## String类型
**set、get与getset**
```shell
127.0.0.1:6379> set name kuangshen # 设置key为name的值为kuangsheng
OK
127.0.0.1:6379> get name #查看key为name的值
"kuangsheng" 

127.0.0.1:6379> getset name whz # 如果不存在key为whz的项，则返回 nil 
(nil)
127.0.0.1:6379> getset age 16 # 如果存在key为age的项，设置它的值为16
"16"
```

**mset与mget**
```shell
127.0.0.1:6379> mset k1 v1 k2 v2 k3 v3 # 同时设置多个值 
OK
127.0.0.1:6379> keys * 
1) "k1" 
2) "k2" 
3) "k3" 
127.0.0.1:6379> mget k1 k2 k3 # 同时获取多个值 
1) "v1" 
2) "v2" 
3) "v3"
```

**setex、setnx与msetnx**
setex (set with expire) :设置过期时间 
setnx (set if not exist)
msetnx : 批量setnx
```shell
127.0.0.1:6379> setex key3 30 "hello" # 设置key3 的值为 hello,30秒后过期
OK

127.0.0.1:6379> setnx mykey "redis" # 如果mykey 不存在，创建mykey 
(integer) 1
127.0.0.1:6379> setnx mykey "MongoDB" # 如果mykey存在，创建失败！ 
(integer) 0

127.0.0.1:6379> msetnx mykey v1 k4 v4 # msetnx 是一个原子性的操作，要么一起成功，要么一起 失败！
(integer) 0
```

**append与strlen**
```shell
127.0.0.1:6379> get key1
"v1"
127.0.0.1:6379> APPEND key1 "hello" # 追加字符串，如果当前key不存在，就相当于set key 
(integer) 7
127.0.0.1:6379> get key1
"v1hello"
127.0.0.1:6379> STRLEN key1 # 获取字符串的长度！
(integer) 7
```

**getrange与setrange**
```shell
127.0.0.1:6379> get key1 
"hello,kuangshen"
127.0.0.1:6379> GETRANGE key1 0 3 # 截取字符串 [0,3] 
"hell"
127.0.0.1:6379> GETRANGE key1 0 -1 # 获取全部的字符串 和 get key是一样的 
"hello,kuangshen"

127.0.0.1:6379> get key2 
"abcdefg" 
127.0.0.1:6379> SETRANGE key2 1 xx # 替换指定位置开始的字符串！ 
(integer) 7 
127.0.0.1:6379> get key2 
"axxdefg"
```

**incr、decr、incrby、decrby**
```shell
127.0.0.1:6379> get views 
"0"
127.0.0.1:6379> incr views # 自增1 
(integer) 1
127.0.0.1:6379> get views 
"1"
127.0.0.1:6379> decr views # 自减1 
(integer) 0 
127.0.0.1:6379> decr views 
(integer) -1 
127.0.0.1:6379> get views 
"-1"
127.0.0.1:6379> INCRBY views 10 # 可以设置步长，指定增量！ 
(integer) 9
127.0.0.1:6379> DECRBY views 5
(integer) 4 
```


## List类型
在redis里面，我们可以把list玩成栈、队列、阻塞队列！
**所有的list命令都是用l或r开头的**

**lpush、lrange、rpush、rrange、lpop、rpop、lindex、llen、linsert、lset、rpoplpush**
```shell
127.0.0.1:6379> LPUSH mylist one # 表示将one插入mylist列表的左边
(integer) 1 
127.0.0.1:6379> LPUSH mylist two 
(integer) 2 
127.0.0.1:6379> LPUSH mylist three 
(integer) 3

127.0.0.1:6379> LRANGE mylist 0 1 # 获取mylist列表的从左开始的0到1的元素
1) "three" 
2) "two" 

127.0.0.1:6379> LRANGE mylist 0 -1 # 获取mylist列表的从左开始的所有元素
1) "three" 
2) "two" 
3) "one"

127.0.0.1:6379> Rpush mylist four # 将four插入mylist列表的右边
(integer) 4
127.0.0.1:6379> LRANGE mylist 0 -1 
1) "three" 
2) "two" 
3) "one" 
4) "four"

127.0.0.1:6379> Lpop mylist # 移除mylist左边的第一个元素
"three"
127.0.0.1:6379> Rpop mylist # 移除mylist右边的第一个元素
"four"
127.0.0.1:6379> LRANGE mylist 0 -1 
1) "two" 
2) "one"

127.0.0.1:6379> lindex mylist 1 # 通过下标获得list中的某一个值！,注：没有rindex
"one"

127.0.0.1:6379> Llen mylist # 返回列表的长度 
(integer) 2 

127.0.0.1:6379> linsert mylist before two other # 在mylist列表中的two元素前面插入other
(integer) 3
127.0.0.1:6379> LRANGE mylist 0 -1 
1) "other" 
2) "two" 
3) "one"

127.0.0.1:6379> lset mylist 1 whz # 更新下标为1的值为whz
OK
127.0.0.1:6379> lrange mylist 0 -1
1) "other"
2) "whz"
3) "one"

127.0.0.1:6379> rpoplpush mylist list2 # 将mylist列表中的右边第一个元素移到list2列表的左边
"one"
127.0.0.1:6379> lrange mylist 0 -1
1) "other"
2) "whz"
127.0.0.1:6379> lrange list2 0 -1
1) "one"
```

**lrem与trim**
lrem ：移除list集合中指定个数的value，精确匹配
ltrim：通过下标截取指定的长度，此时lis列表变为截取下来的元素
```shell
127.0.0.1:6379> LRANGE list 0 -1 
1) "three" 
2) "three" 
3) "two" 
4) "one"
5) "four"
6) "four"
127.0.0.1:6379> lrem list 1 three # 移除list列表中1个值为three的元素
(integer) 1 
127.0.0.1:6379> LRANGE list 0 -1 
1) "three" 
2) "two" 
3) "one"
4) "four"
5) "four"
127.0.0.1:6379> lrem list 2 four # 移除list列表中2个值为four的元素
(integer) 1 
127.0.0.1:6379> LRANGE list 0 -1 
1) "three" 
2) "two" 
3) "one"

127.0.0.1:6379> ltrim list 1 2 # 截取list列表中[1,2]区间的元素
OK
127.0.0.1:6379> LRANGE list 0 -1 
1) "two" 
2) "one"
```

## Set类型
set类型是无序不重复集合。
**所有的set命令都是用s开头的**

**sadd、smemebers、sismember、scard、srem、srandmember、spop、smove**
```shell
127.0.0.1:6379> sadd myset "hello" # 向myset集合中添加hello
(integer) 1
127.0.0.1:6379> sadd myset "kuangshen" 
(integer) 1 
127.0.0.1:6379> sadd myset "lovekuangshen" 
(integer) 1

127.0.0.1:6379> SMEMBERS myset # 查看myset集合中的所有值 
1) "hello" 
2) "lovekuangshen" 
3) "kuangshen"

127.0.0.1:6379> SISMEMBER myset hello # 判断某一个值是不是在myset集合中！ 
(integer) 1 
127.0.0.1:6379> SISMEMBER myset world 
(integer) 0

127.0.0.1:6379> scard myset # 获取myset集合中的内容元素个数！ 
(integer) 4

127.0.0.1:6379> srem myset hello # 移除myset集合中的指定元素 
(integer) 1 
127.0.0.1:6379> SMEMBERS myset 
1) "lovekuangshen2" 
2) "lovekuangshen" 
3) "kuangshen"

127.0.0.1:6379> SRANDMEMBER myset # 从myset集合中随机抽选出一个元素 
"kuangshen"
127.0.0.1:6379> SRANDMEMBER myset 2 # 从myset集合中随机抽选出2个元素 
1) "lovekuangshen" 
2) "lovekuangshen2"

127.0.0.1:6379> spop myset # 随机删除myset集合中的一个元素
"lovekuangshen2"
127.0.0.1:6379> SMEMBERS myset 
1) "lovekuangshen" 
2) "kuangshen"


127.0.0.1:6379> smove myset myset2 "kuangshen" # 将myset集合中的kuangsheng元素移动到myset2集合中
(integer) 1
```

**sdiff、sinter、sunion**
```shell
127.0.0.1:6379> SDIFF mylist1 mylist2 # 求mylist1集合与mylist2集合之间的差集
1) "b" 
2) "a" 
127.0.0.1:6379> SINTER mylist1 mylist2 # 求mylist1集合与mylist2集合之间的交集 
1) "c" 
127.0.0.1:6379> SUNION mylist1 mylist2 # 求mylist1集合与mylist2集合之间的交集 
1) "b" 
2) "c" 
3) "e" 
4) "a"
5) "d"
```

## Hash类型
hash类型的值为map集合
**所有的hash命令都是用h开头的**

**hset、hget、hmset、hgetall、hdel、hlen、hexists、hkeys、hvals**
```shell
127.0.0.1:6379> hset myhash field1 kuangshen # 向myhash中添加一个key为field1，value为kuangshen的元素
(integer) 1
127.0.0.1:6379> hget myhash field1 # 获取myhash中key为field1的value
"kuangshen"

127.0.0.1:6379> hmset myhash field1 hello field2 world # set多个值
OK
127.0.0.1:6379> hmget myhash field1 field2 # 获取多个字段值 
1) "hello" 
2) "world"


127.0.0.1:6379> hgetall myhash # 获取全部的数据， 
1) "field1" 
2) "hello" 
3) "field2" 
4) "world"

127.0.0.1:6379> hdel myhash field1 # 删除myhash中指定key字段！对应的value值也就消失了
(integer) 1 
127.0.0.1:6379> hgetall myhash 
1) "field2" 
2) "world"

127.0.0.1:6379> hlen myhash # 获取myhash表的字段数量！ 
(integer) 1

127.0.0.1:6379> HEXISTS myhash field2 # 判断myhash中指定字段是否存在！ 
(integer) 1 
127.0.0.1:6379> HEXISTS myhash field3 
(integer) 0

127.0.0.1:6379> hkeys myhash # 只获得所有field 
1) "field2" 
127.0.0.1:6379> hvals myhash # 只获得所有value 
1) "world" 
```

**hincrby、hdecrby、hsetnx**
```shell
127.0.0.1:6379> hset myhash field3 5 
(integer) 1 
127.0.0.1:6379> HINCRBY myhash field3 1 
(integer) 6 
127.0.0.1:6379> hdecrby myhash field3 -1 
(integer) 5 

127.0.0.1:6379> hsetnx myhash field4 hello # 如果不存在则可以设置 
(integer) 1 
127.0.0.1:6379> hsetnx myhash field4 world # 如果存在则不能设置
(integer) 0
```

## Zset类型
有序集合, 在set基础上添加了一个socre属性，我们可以根据这个score属性来排序
**zadd、zrange、zrevrange、zrangebyscore、zrem、zcount**
```shell
127.0.0.1:6379> zadd salary 2500 xiaohong # 向salary中添加一个score为2500的xiaohong元素
(integer) 1 
127.0.0.1:6379> zadd salary 5000 zhangsan 500 kaungshen   # 一次添加多个
(integer) 2

127.0.0.1:6379> ZRANGE myset 0 -1 # 按score从小到大输出所有元素
1) "kaungshen"
2) "xiaohong"
3) "zhangsan"
127.0.0.1:6379> ZRANGE salary 1 2 # 按socre从小到大输出[1,2]内的元素
1) "xiaohong"
2) "zhangsan"
127.0.0.1:6379> ZREVRANGE salary 0 -1 # 按score从大到小输出所有元素
1) "zhangsan"
2) "xiaohong"
3) "kaungshen"

127.0.0.1:6379> ZRANGEBYSCORE salary -inf 2500  # 显示工资小于2500员工的升序排序！ 
1) "kaungshen" 
2) "xiaohong"

127.0.0.1:6379> ZRANGEBYSCORE salary -inf 2500 withscores # 显示工资小于2500员工的升序排序！ 并且附带score
1) "kaungshen" 
2) "500" 
3) "xiaohong" 
4) "2500"

127.0.0.1:6379> zcard salary # 获取有序集合中的个数 
(integer) 3
127.0.0.1:6379> zcount salary -inf 2500 # 获取指定score在(-inf, 2500]区间内的成员数量！
(integer) 2 

127.0.0.1:6379> zrem salary xiaohong # 移除有序集合中的指定元素 
(integer) 1 
127.0.0.1:6379> zrange salary 0 -1 
1) "kaungshen" 
2) "zhangsan" 
```

# redis三种特殊数据类型
## Geospatial 地理位置
朋友的定位，附近的人，打车距离计算？
Redis 的 Geo 在Redis3.2 版本就推出了！ 这个功能可以推算地理位置的信息，两地之间的距离，方圆
几里有哪些人

这个Geospatial类型只有6个命令，且全部以geo开头
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419161928.png" width="700px"/>

**geoadd**
 getadd命令为添加地理位置
 ```shell
127.0.0.1:6379> geoadd china:city 116.40 39.90 beijing # 往china:city中添加beijing，经度为116.40, 经度为39.90
(integer) 1 
127.0.0.1:6379> geoadd china:city 121.47 31.23 shanghai 
(integer) 1 
127.0.0.1:6379> geoadd china:city 106.50 29.53 chongqi 114.05 22.52 shengzhen 
(integer) 2 
127.0.0.1:6379> geoadd china:city 120.16 30.24 hangzhou 108.96 34.26 xian 
(integer) 2
 ```

**geopos**
```shell
127.0.0.1:6379> GEOPOS china:city beijing # 获取指定的城市的经度和纬度！ 
1) 1) "116.39999896287918091" 
   2) "39.90000009167092543" 
127.0.0.1:6379> GEOPOS china:city beijing chongqi 
1) 1) "116.39999896287918091" 
   2) "39.90000009167092543" 
2) 1) "106.49999767541885376" 
   2) "29.52999957900659211"
```

**geodist**
```shell
127.0.0.1:6379> GEODIST china:city beijing shanghai km # 查看上海到北京的直线距离,以km为单位
"1067.3788" 
127.0.0.1:6379> GEODIST china:city beijing chongqi km # 查看重庆到北京的直线距离 
"1464.0708"
```

**georadius**
```shell
127.0.0.1:6379> GEORADIUS china:city 110 30 1000 km # 以110，30 这个经纬度为中心，寻找方圆1000km内的城市 
1) "chongqi" 
2) "xian" 
3) "shengzhen" 
4) "hangzhou" 
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km 
1) "chongqi" 
2) "xian" 
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km withdist # 显示到中间距离的位置 
1) 1) "chongqi" 
   2) "341.9374" 
2) 1) "xian" 
   2) "483.8340" 
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km withcoord # 显示他人的定位信息 
1) 1) "chongqi" 
   2) 1) "106.49999767541885376" 
      2) "29.52999957900659211" 
2) 1) "xian" 
   2) 1) "108.96000176668167114" 
      2) "34.25999964418929977" 
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km withdist withcoord count 1 # 筛选出指定的结果！ 
1) 1) "chongqi" 
   2) "341.9374" 
   3) 1) "106.49999767541885376" 
      2) "29.52999957900659211" 
127.0.0.1:6379> GEORADIUS china:city 110 30 500 km withdist withcoord count 2 
1) 1) "chongqi" 
   2) "341.9374" 
   3) 1) "106.49999767541885376" 
      2) "29.52999957900659211" 
2) 1) "xian" 
   2) "483.8340" 
   3) 1) "108.96000176668167114" 
      2) "34.25999964418929977"
```

**georadiusbymember**
```shell
## 找出位于指定元素周围的其他元素！ 
127.0.0.1:6379> GEORADIUSBYMEMBER china:city beijing 1000 km # 找出以beijing为中心，方圆1000km内的城市
1) "beijing" 
2) "xian" 
127.0.0.1:6379> GEORADIUSBYMEMBER china:city shanghai 400 km 
1) "hangzhou" 
2) "shanghai"
```

**geohash**
```shell
127.0.0.1:6379> geohash china:city beijing chongqi # 将二维的经纬度转换为一维的字符串，如果两个字符串越接近，那么则距离越近！ 
1) "wx4fbxxfke0" 
2) "wm5xzrybty0"
```

注：GEO 底层的实现原理其实就是 Zset！我们可以使用Zset命令来操作geo！
```shell
127.0.0.1:6379> ZRANGE china:city 0 -1 # 查看地图中全部的元素 
1) "chongqi" 
2) "xian" 
3) "shengzhen" 
4) "hangzhou" 
5) "shanghai" 
6) "beijing" 
127.0.0.1:6379> zrem china:city beijing # 移除指定元素！ 
(integer) 1 
127.0.0.1:6379> ZRANGE china:city 0 -1 
1) "chongqi" 
2) "xian" 
3) "shengzhen" 
4) "hangzhou" 
5) "shanghai"
```

## Hyperloglog
Redis 2.8.9 版本就更新了 Hyperloglog 数据结构！, Hyperloglog是专门用来统计基数(不重复的元素)
优点：占用的内存是固定，统计2^64 不同的元素，只需要废 12KB内存！如果要从内存角度来比较的话 Hyperloglog 首选！

不过Hyperloglog有0.81%错误率
如果允许容错，那么可以使用 Hyperloglog ！
如果不允许容错，就使用 set 或者自己的数据类型即可

**pfadd、pfcount、pfmerge**
```shell
127.0.0.1:6379> PFADD mykey a b c d d e # 创建第一组元素mykey
(integer) 1
127.0.0.1:6379> PFCOUNT mykey # 统计 mykey 元素的基数数量
(integer) 5
127.0.0.1:6379> PFADD mykey1 a f g # 创建第二组元素 mykey1
(integer) 1
127.0.0.1:6379> PFCOUNT mykey1
(integer) 3
127.0.0.1:6379> PFMERGE mykey3 mykey mykey1 # 合并两组 mykey mykey1 => mykey3 并集
OK
127.0.0.1:6379> PFCOUNT mykey3
(integer) 7
```

## Bitmap
Bitmap 位图数据结构！ 操作二进制位来进行记录，就只有0 和 1 两个状态！

**setbit、getbit、bitcount**
```shell
127.0.0.1:6379> SETBIT sign 0 1 # 将sign的二进制第0位设置成1
(integer) 0
127.0.0.1:6379> SETBIT sign 2 0 # 将sign的二进制第2位设置成0
(integer) 0
127.0.0.1:6379> setbit sign 1 1
(integer) 0

127.0.0.1:6379> GETBIT sign 0 # 获取sign的二进制的第0位数据
(integer) 1
127.0.0.1:6379> GETBIT sign 2
(integer) 0

127.0.0.1:6379> BITCOUNT sign # 获取sign的二进制中有多少个1
(integer) 2
```

# Redis事务
Redis事务相关命令：
- MULTI ：开启事务，redis会将后续的命令逐个放入队列中，然后使用EXEC命令来原子化执行这个命令系列。
- EXEC：执行事务中的所有操作命令。
- DISCARD：取消事务，放弃执行事务块中的所有命令。
- WATCH：监视一个或多个key,如果事务在执行前，这个key(或多个key)被其他命令修改，则事务被中断，不会执行事务中的任何命令。
- UNWATCH：取消WATCH对所有key的监视。

redis的事务：
- 开启事务（multi）
- 命令入队（......）
- 执行事务（exec）

下面具体看一下事务命令的使用：
**正常执行事务**
```shell
127.0.0.1:6379> multi # 开启事务 
OK
# 命令入队 
127.0.0.1:6379> set k1 v1
QUEUED 
127.0.0.1:6379> set k2 v2 
QUEUED 
127.0.0.1:6379> get k2 
QUEUED 
127.0.0.1:6379> set k3 v3 
QUEUED 
127.0.0.1:6379> exec # 执行事务 
1) OK 
2) OK 
3) "v2" 
4) OK
```

**放弃事务！**
```shell
127.0.0.1:6379> multi # 开启事务 
OK
127.0.0.1:6379> set k1 v1 
QUEUED 
127.0.0.1:6379> set k2 v2 
QUEUED 
127.0.0.1:6379> set k4 v4 
QUEUED 127.0.0.1:6379> DISCARD # 取消事务 OK
127.0.0.1:6379> get k4 # 事务队列中命令都不会被执行！ 
(nil)
```

**编译型异常（代码有问题！ 命令有错！） ，事务中所有的命令都不会被执行！**
```shell
127.0.0.1:6379> multi OK
127.0.0.1:6379> set k1 v1 
QUEUED 
127.0.0.1:6379> set k2 v2 
QUEUED 
127.0.0.1:6379> set k3 v3 
QUEUED 
127.0.0.1:6379> getset k3 # 错误的命令 
(error) ERR wrong number of arguments for 'getset' command 
127.0.0.1:6379> set k4 v4 
QUEUED 
127.0.0.1:6379> set k5 v5 
QUEUED 
127.0.0.1:6379> exec # 执行事务报错！ 
(error) EXECABORT Transaction discarded because of previous errors. 
127.0.0.1:6379> get k5 # 所有的命令都不会被执行！ 
(nil)
```

**运行时异常， 如果事务队列中存在语法性，那么执行命令的时候，其他命令是可以正常执行的，错误命令抛出异常！**
```shell
127.0.0.1:6379> set k1 "v1" 
OK
127.0.0.1:6379> multi 
OK
127.0.0.1:6379> incr k1 # 执行的时候会失败！ 
QUEUED 
127.0.0.1:6379> set k2 v2 
QUEUED 
127.0.0.1:6379> set k3 v3 
QUEUED 
127.0.0.1:6379> get k3 
QUEUED 
127.0.0.1:6379> exec 
1) (error) ERR value is not an integer or out of range # 虽然第一条命令报错了，但是 依旧正常执行成功了！ 
2) OK 
3) OK 
4) "v3" 
127.0.0.1:6379> get k2 
"v2" 
127.0.0.1:6379> get k3 
"v3"
```

**为什么Redis不支持事务回滚？**
以上两个例子总结出，多数事务失败是由语法错误或者数据结构类型错误导致的，语法错误说明在命令入队前就进行检测的，而类型错误是在执行时检测的，Redis为提升性能而采用这种简单的事务，这是不同于关系型数据库的，特别要注意区分。

## watch监视（面试常问）
可以使用watch来实现redis的乐观锁操作
**事务执行时，watch监视的对象没有发生变化时**
```shell
127.0.0.1:6379> set money 100 
OK
127.0.0.1:6379> set out 0 
OK
127.0.0.1:6379> watch money # 监视 money 对象 
OK
127.0.0.1:6379> multi # 事务正常结束，数据期间没有发生变动，这个时候就正常执行成功！ 
OK
127.0.0.1:6379> DECRBY money 20 
QUEUED 
127.0.0.1:6379> INCRBY out 20 
QUEUED 
127.0.0.1:6379> exec 
1) (integer) 80 
2) (integer) 20
```


**事务执行时，watch监视的对象被另一个线程修改时**
```shell
127.0.0.1:6379> watch money # 监视 money 
OK
127.0.0.1:6379> multi 
OK
127.0.0.1:6379> DECRBY money 10 
QUEUED 
127.0.0.1:6379> INCRBY out 10 
QUEUED 
127.0.0.1:6379> exec # 执行之前，由于另外一个线程，修改了我们的值，这个时候，就会导致事务执行失败！
(nil)
```

如果修改失败，获取最新的值就好
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419174246.png" width="700px"/>


# Redis.conf详解
**设置单位大小**
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419195044.png" width="700px"/>

**引入外部配置文件**
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419195105.png" width="700px"/>

**有关网络的设置**
```conf
bind 127.0.0.1 # 绑定的ip 
protected-mode yes # 保护模式 
port 6379 # 端口设置
```

**通用General设置**
```conf
daemonize yes # 以守护进程的方式运行，默认是 no，我们需要自己开启为yes！ 

pidfile /var/run/redis_6379.pid # 如果以后台的方式运行，我们就需要指定一个 pid 文件！ 

# 日志 
# Specify the server verbosity level. 
# This can be one of:
# debug (a lot of information, useful for development/testing) 
# verbose (many rarely useful info, but not a mess like the debug level) 
# notice (moderately verbose, what you want in production probably)
# warning (only very important / critical messages are logged) 
loglevel notice logfile "" # 日志的文件位置名 
databases 16 # 数据库的数量，默认是 16 个数据库 
```

**有关快照设置**
```conf
# 如果900s内，如果至少有一个1 key进行了修改，我们及进行持久化操作 
save 900 1 
# 如果300s内，如果至少10 key进行了修改，我们及进行持久化操作 
save 300 10 
# 如果60s内，如果至少10000 key进行了修改，我们及进行持久化操作 
save 60 10000 

stop-writes-on-bgsave-error yes # 持久化如果出错，是否还需要继续工作！ 
rdbcompression yes # 是否压缩 rdb 文件，需要消耗一些cpu资源！ 
rdbchecksum yes # 保存rdb文件的时候，进行错误的检查校验！ 
dir ./ # rdb 文件保存的目录！
```

**有关安全的设置**
可以再配置文件中设置
```conf
requirepass "whz" # 设置redis的密码为whz
```
设置完成后，我们需要使用auth命令登陆后，才能操作redis中的数据
```shell
127.0.0.1:6379> ping 
(error) NOAUTH Authentication required. 
127.0.0.1:6379> auth whz # 使用密码进行登录！ 
OK
```

**内存、用户限制**
```conf
maxclients 10000 # 设置能连接上redis的最大客户端的数量 

maxmemory <bytes> # redis 配置最大的内存容量 

maxmemory-policy noeviction # 内存到达上限之后的处理策略，有如下6种策略：
                              1、volatile-lru：只对设置了过期时间的key进行LRU（默认值） 
                              2、allkeys-lru ： 删除lru算法的key 
                              3、volatile-random：随机删除即将过期key 
                              4、allkeys-random：随机删除 
                              5、volatile-ttl ： 删除即将过期的 
                              6、noeviction ： 永不过期，返回错误
```

**append only模式，aof配置**
```conf
appendonly no # 默认是不开启aof模式的，默认是使用rdb方式持久化的，在大部分所有的情况下， rdb完全够用！ 
appendfilename "appendonly.aof" # 持久化的文件的名字 

# appendfsync always # 每次修改都会 sync。消耗性能 
appendfsync everysec # 每秒执行一次 sync，可能会丢失这1s的数据！ 
# appendfsync no # 不执行 sync，这个时候操作系统自己同步数据，速度最快！
```

**通过命令行方式设置配置**
```shell
127.0.0.1:6379> config get requirepass # 获取redis的密码 
1) "requirepass" 
2) "" 
127.0.0.1:6379> config set requirepass "123456" # 设置redis的密码
OK
127.0.0.1:6379> config get requirepass # 发现所有的命令都没有权限了 
(error) NOAUTH Authentication required. 
127.0.0.1:6379> ping 
(error) NOAUTH Authentication required. 
127.0.0.1:6379> auth 123456 # 使用密码进行登录！ 
OK127.0.0.1:6379> config get requirepass 
1) "requirepass" 
2) "123456"
```

# Redis持久化
面试和工作，持久化都是重点！

Redis 是内存数据库，如果不将内存中的数据库状态保存到磁盘，那么一旦服务器进程退出，服务器中的数据库状态也会消失。所以Redis提供了2种持久化策略，分别是RDB(默认)与AOF

## RDB(Redis DataBase)
RDB其实就是把数据以快照的形式保存在磁盘上。什么是快照呢，你可以理解成把当前时刻的数据拍成一张照片保存下来。

RDB持久化是指在指定的时间间隔内将内存中的数据集快照写入磁盘。也是默认的持久化方式，这种方式是就是将内存中数据以快照的方式写入到二进制文件中,默认的文件名为dump.rdb， 我们可以在配置文件种进行配置。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419204852.png" width="700px"/>

### 触发机制
**1. save触发方式**
该命令会阻塞当前Redis服务器，执行save命令期间，Redis不能处理其他命令，直到RDB过程完成为止。具体流程如下：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419205028.png" width="700px"/>
执行完成时候如果存在老的RDB文件，就用新的替代掉旧的。我们的客户端可能都是几万或者是几十万，这种方式显然不可取。

**2. bgsave触发方式**
执行该命令时，Redis会在后台异步进行快照操作，快照同时还可以响应客户端请求。具体流程如下：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419205130.png" width="700px"/>
具体操作是Redis进程执行fork操作创建子进程，RDB持久化过程由子进程负责，完成后自动结束。阻塞只发生在fork阶段，一般时间很短。基本上 Redis 内部所有的RDB操作都是采用 bgsave 命令。

**3. 自动触发**
自动触发是由我们的配置文件来完成的。在redis.conf配置文件中，里面有如下配置，我们可以去设置：
- save：这里是用来配置触发 Redis的 RDB 持久化条件，也就是什么时候将内存中的数据保存到硬盘。比如“save m n”。表示m秒内数据集存在n次修改时，**自动触发bgsave**，而不是save。

默认如下配置：
```conf
# 如果900s内，如果至少有一个1 key进行了修改，我们及进行持久化操作 
save 900 1 
# 如果300s内，如果至少10 key进行了修改，我们及进行持久化操作 
save 300 10 
# 如果60s内，如果至少10000 key进行了修改，我们及进行持久化操作 
save 60 10000 

stop-writes-on-bgsave-error yes # 默认值为yes。当启用了RDB且最后一次后台保存数据失败，Redis是否停止接收数据。这会让用户意识到数据没有正确持久化到磁盘上，否则没有人会注意到灾难（disaster）发生了。如果Redis重启了，那么又可以重新开始接收数据了

rdbcompression yes # 是否压缩 rdb 文件，需要消耗一些cpu资源！ 
rdbchecksum yes # 在存储快照后，我们还可以让redis使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能。
dir ./ # rdb 文件保存的目录！
```

**其他情况触发**
- 执行 flushall 命令，也会触发我们的rdb规则！
- 退出redis，也会产生 rdb 文件！


**save与bgsave对比**
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419205733.png" width="700px"/>

### 从rdb文件中恢复数据
redis启动的时候会自动从配置文件中指定rdb存储目录中找dump.rdb文件， 然后从rdb文件中恢复其中的数据！

### RDB 的优势和劣势
优势：
- RDB文件紧凑，全量备份，非常适合用于进行备份和灾难恢复。
- 生成RDB文件的时候，redis主进程会fork()一个子进程来处理所有保存工作，主进程不需要进行任何磁盘IO操作。
- RDB 在恢复大数据集时的速度比 AOF 的恢复速度要快。
缺点：
RDB快照是一次全量备份，存储的是内存数据的二进制序列化形式，存储上非常紧凑。当使用bgsave进行快照持久化时，会开启一个子进程专门负责快照持久化，子进程会拥有父进程的内存数据，父进程修改内存数据时，子进程不会反应出来，所以在快照持久化期间修改的数据不会被保存，可能丢失数据。


## AOF机制
全量备份总是耗时的，有时候我们提供一种更加高效的方式AOF，工作机制很简单，redis会将每一个收到的写命令都通过write函数追加到文件中。通俗的理解就是日志记录

Aof默认保存的是 appendonly.aof 文件，可以通过配置文件进行修改
aof默认是不开启的，我们需要手动进行配置！我们只需要将 appendonly 改为yes就开启了 aof！
重启，redis 就可以生效了

如果这个 aof 文件有错位，这时候 redis 是启动不起来的吗，我们需要修复这个aof文件
redis 给我们提供了一个工具`redis-check-aof --fix`
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419212151.png" width="700px"/>
如果文件正常，重启就可以直接恢复了！

### 持久化原理
他的原理看下面这张图：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419211855.png" width="700px"/>
每当有一个写命令过来时，就直接保存在我们的AOF文件中。

### 文件重写原理
AOF的方式也同时带来了另一个问题。持久化文件会变的越来越大。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419212854.png" width="700px"/>
如果 aof 文件大于 64m，太大了！ fork一个新的进程来将我们的文件进行重写！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419212912.png" width="700px"/>

### AOF三种触发机制
```conf
# appendfsync always # 每次修改都会 sync。消耗性能 
appendfsync everysec # 每秒执行一次 sync，可能会丢失这1s的数据！ 
# appendfsync no # 不执行 sync，这个时候操作系统自己同步数据，速度最快！
```

### AOF的优势和劣势
优点：
- AOF可以更好的保护数据不丢失
- 一般AOF会每隔1秒，通过一个后台线程执行一次fsync操作，最多丢失1秒钟的数据。
- AOF日志文件没有任何磁盘寻址的开销，写入性能非常高，文件不容易破损。
- AOF日志文件即使过大的时候，出现后台重写操作，也不会影响客户端的读写。
- AOF日志文件的命令通过非常可读的方式进行记录，这个特性非常适合做灾难性的误删除的紧急恢复。比如某人不小心用flushall命令清空了所有数据，只要这个时候后台rewrite还没有发生，那么就可以立即拷贝AOF文件，将最后一条flushall命令给删了，然后再将该AOF文件放回去，就可以通过恢复机制，自动恢复所有数据

- 缺点：
- 对于同一份数据来说，AOF日志文件通常比RDB数据快照文件更大，恢复的速度也比rdb慢
- AOF开启后，支持的写QPS会比RDB支持的写QPS低，因为AOF一般会配置成每秒fsync一次日志文件，当然，每秒一次fsync，性能也还是很高的

## 总结
- RDB 持久化方式能够在指定的时间间隔内对你的数据进行快照存储
- AOF 持久化方式记录每次对服务器写的操作，当服务器重启的时候会重新执行这些命令来恢复原始的数据，AOF命令以Redis 协议追加保存每次写的操作到文件末尾，Redis还能对AOF文件进行后台重写，使得AOF文件的体积不至于过大。
- 只做缓存，如果你只希望你的数据在服务器运行的时候存在，你也可以不使用任何持久化
- 同时开启两种持久化方式
  - 在这种情况下，当redis重启的时候会优先载入AOF文件来恢复原始的数据，因为在通常情况下AOF文件保存的数据集要比RDB文件保存的数据集要完整。
  - RDB 的数据不实时，同时使用两者时服务器重启也只会找AOF文件，那要不要只使用AOF呢？作者建议不要，因为RDB更适合用于备份数据库（AOF在不断变化不好备份），快速重启，而且不会有AOF可能潜在的Bug，留着作为一个万一的手段。
- 性能建议
  - 因为RDB文件只用作后备用途，建议只在Slave上持久化RDB文件，而且只要15分钟备份一次就够了，只保留 save 900 1 这条规则。
  -  如果Enable AOF ，好处是在最恶劣情况下也只会丢失不超过两秒数据，启动脚本较简单只load自己的AOF文件就可以了，代价一是带来了持续的IO，二是AOF rewrite 的最后将 rewrite 过程中产生的新数据写到新文件造成的阻塞几乎是不可避免的。只要硬盘许可，应该尽量减少AOF rewrite的频率，AOF重写的基础大小默认值64M太小了，可以设到5G以上，默认超过原大小100%大小重写可以改到适当的数值。
  - 如果不Enable AOF ，仅靠 Master-Slave Repllcation 实现高可用性也可以，能省掉一大笔IO，也减少了rewrite时带来的系统波动。代价是如果Master/Slave 同时倒掉，会丢失十几分钟的数据，启动脚本也要比较两个 Master/Slave 中的 RDB文件，载入较新的那个，微博就是这种架构。

# Redis发布订阅
Redis 发布订阅 (pub/sub) 是一种消息通信模式：发送者 (pub) 发送消息，订阅者 (sub) 接收消息。

Redis 客户端可以订阅任意数量的频道。

下图展示了频道 channel1 ， 以及订阅这个频道的三个客户端 —— client2 、 client5 和 client1 之间的关系：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419215317.png" width="700px"/>
当有新消息通过 PUBLISH 命令发送给频道 channel1 时， 这个消息就会被发送给订阅它的三个客户端：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419215333.png" width="700px"/>

**Redis 发布订阅命令， 下表列出了 redis 发布订阅常用命令：**
|序号	| 命令及描述|
|--|--|
|1 |	PSUBSCRIBE pattern [pattern ...]  订阅一个或多个符合给定模式的频道。|
|2 | PUBSUB subcommand [argument [argument ...]] 查看订阅与发布系统状态。|
|3 |	PUBLISH channel message 将信息发送到指定的频道。|
|4 | PUNSUBSCRIBE [pattern [pattern ...]] 退订所有给定模式的频道。|
|5 | SUBSCRIBE channel [channel ...] 订阅给定的一个或多个频道的信息。|
|6	| UNSUBSCRIBE [channel [channel ...]] 指退订给定的频道。|

**实例**
以下实例演示了发布订阅是如何工作的，需要开启两个 redis-cli 客户端。
在我们实例中我们创建了订阅频道名为 runoobChat:
```shell
# 第一个 redis-cli 客户端
redis 127.0.0.1:6379> SUBSCRIBE runoobChat

Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "redisChat"
3) (integer) 1
# 等待读取推送的信息
```
现在，我们先重新开启个 redis 客户端，然后在同一个频道 runoobChat 发布两次消息，订阅者就能接收到消息。
```shell
# 第二个 redis-cli 客户端
redis 127.0.0.1:6379> PUBLISH runoobChat "Redis PUBLISH test"
(integer) 1

redis 127.0.0.1:6379> PUBLISH runoobChat "Learn redis by runoob.com"
(integer) 1

# 订阅者的客户端会显示如下消息
1) "message"  # 消息
2) "runoobChat" # 是哪个频道的信息
3) "Redis PUBLISH test" # 消息的具体内容
1) "message"
2) "runoobChat"
3) "Learn redis by runoob.com"
```

**redis发布订阅原理**
通过 SUBSCRIBE 命令订阅某频道后，redis-server 里维护了一个字典，字典的键就是一个个 频道！，而字典的值则是一个链表，链表中保存了所有订阅这个 channel 的客户端。SUBSCRIBE 命令的关键，就是将客户端添加到给定 channel 的订阅链表中。
通过 PUBLISH 命令向订阅者发送消息，redis-server 会使用给定的频道作为键，在它所维护的channel字典中查找记录了订阅这个频道的所有客户端的链表，遍历这个链表，将消息发布给所有订阅者。

redis发布订阅功能并不是特别使用，稍微复杂的场景我们还是会使用消息中间件 MQ

# Redis主从复制
主从复制，是指将一台Redis服务器的数据，复制到其他的Redis服务器。前者称为主节点(master/leader)，后者称为从节点(slave/follower)；数据的复制是单向的，只能由主节点到从节点。Master以写为主，Slave 以读为主。

<font color="red">默认情况下，每台Redis服务器都是主节点；</font>

一个主节点可以有多个从节点(或没有从节点)，但一个从节点只能有一个主节点。

<font color="red">redis中主机可以读写，而从节点只能读</font>
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419225807.png" width="700px"/>
主节点如果断开连接，从节点依旧可以读，只是这个集群就失去了写操作。如果主节点重新连接了，从节点仍然可以读取主节点的信息。

**主从复制的作用主要包括：**
- 数据冗余：主从复制实现了数据的热备份，是持久化之外的一种数据冗余方式。
- 故障恢复：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复；实际上是一种服务
的冗余。
- 负载均衡：在主从复制的基础上，配合读写分离，可以由主节点提供写服务，由从节点提供读服务（即写Redis数据时应用连接主节点，读Redis数据时应用连接从节点），分担服务器负载；尤其是在写少读多的场景下，通过多个从节点分担读负载，可以大大提高Redis服务器的并发量。
- 高可用（集群）基石：除了上述作用以外，主从复制还是哨兵和集群能够实施的基础，因此说主从复制是Redis高可用的基础。

**一般来说，要将Redis运用于工程项目中，只使用一台Redis是万万不能的（宕机），原因如下：**
- 从结构上，单个Redis服务器会发生单点故障，并且一台服务器需要处理所有的请求负载，压力较大；
- 从容量上，单个Redis服务器内存容量有限，就算一台Redis服务器内存容量为256G，也不能将所有内存用作Redis存储内存，一般来说，单台Redis最大使用内存不应该超过20G。电商网站上的商品，一般都是一次上传，无数次浏览的，说专业点也就是"多读少写"。
对于这种场景，我们可以使如下这种架构：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419222638.png" width="700px"/>

主从复制，读写分离！ 80% 的情况下都是在进行读操作！减缓服务器的压力！架构中经常使用！ 一主二从！
只要在公司中，主从复制就是必须要使用的，因为在真实的项目中不可能单机使用Redis！

## 一主二从
1. 配置3个redis服务器的配置文件，修改对应的信息：
- 端口
- pid 名字
- log文件名字
- dump.rdb 名字
修改完毕之后，启动我们的3个redis服务器，可以通过进程信息查看！
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419223702.png" width="700px"/>

我可以通过`info replication`命令来查看当前redis主从信息
```shell
127.0.0.1:6379> info replication # 查看当前redis主从信息
# Replication 
role:master # 角色为master 
connected_slaves:0 # 没有从机 
master_replid:b63c90e6c501143759cb0e7f450bd1eb0c70882a 
master_replid2:0000000000000000000000000000000000000000 
master_repl_offset:0 
second_repl_offset:-1 
repl_backlog_active:0 
repl_backlog_size:1048576 
repl_backlog_first_byte_offset:0 
repl_backlog_histlen:0
```


2. 默认情况下，每台Redis服务器都是主节点； 所以我们一般情况下只用配置从机就好了！
我们将6379端口的redis设置为主节点，将6380、6381端口设置为从节点
```shell
127.0.0.1:6380> SLAVEOF 127.0.0.1 6379 # 将127.0.0.1上的6379端口的redis设置为它的主节点
OK127.0.0.1:6380> info replication 
# Replication 
role:slave # 当前角色是从机 
master_host:127.0.0.1 # 它的主节点机的信息 
master_port:6379
master_link_status:up
master_last_io_seconds_ago:3 
master_sync_in_progress:0 
slave_repl_offset:14 
slave_priority:100 
slave_read_only:1 connected_slaves:0 
master_replid:a81be8dd257636b2d3e7a9f595e69d73ff03774e
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:14 second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:14
```
```shell
# 查看6379端口的redis！ 
127.0.0.1:6379> info replication 
# Replication role:master 
connected_slaves:1 # 多了从机的配置 
slave0:ip=127.0.0.1,port=6380,state=online,offset=42,lag=1 # 多了从机的配置 
master_replid:a81be8dd257636b2d3e7a9f595e69d73ff03774e 
master_replid2:0000000000000000000000000000000000000000 
master_repl_offset:42 
second_repl_offset:-1 
repl_backlog_active:1
repl_backlog_size:1048576 
repl_backlog_first_byte_offset:1
repl_backlog_histlen:42
```

真实的从主配置应该在配置文件中配置，这样的话是永久的，我们这里使用的是命令，暂时的, 重启后，所有redis服务器就又变成了主节点

**通过配置文件配置主从(永久的)**
```conf
replicaof 127.0.0.1 6379 #将当前节点设置为指定节点的从节点
masterauth <master-password>   #如果主节点有密码的话要在这设置密码
```


## 主从复制原理
Slave启动成功连接到master后会发送一个sync同步命令
Master接收到命令，启动后台的存盘进程，同时收集所有接收到的用于修改数据的命令，在后台进程执行完毕后，master将传送整个数据文件到slave，并完成一次完全同步
- 全量复制：slave服务在接收到数据库文件数据后，将其存盘并加载到内存中
- 增量复制：Master继续将新的所有收集到的修改命令依次传送给slave，完成同步
只要重新连接master，一次全量复制将自动执行


## 层层链路
将6379端口的redis设为为6380端口的redis的主节点， 又将6380端口的redis设为6381端口的redis的主节点；此时在6380端口上的redis上使用`info replication`查看可得知，6380还是从节点，而不是主节点；
在6379端口上的redis上使用`info replication`查看可得知，6379只有一个从节点6380
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419230501.png" width="700px"/>


## 哨兵模式
在没有使用哨兵之前， 如果主机断开了连接，我们只能使用`SLAVEOF no one`让自己变成主机！其他的节点只能手动连接到最新的这个主节点（手动），这不是一种推荐的方式，更多时候，我们优先考虑哨兵模式，Redis从2.8开始正式提供了Sentinel（哨兵） 架构来解决这个问题
哨兵模式能够后台监控主机是否故障，如果故障了根据投票数自动将从节点转换为主节点。

哨兵模式是一种特殊的模式，首先Redis提供了哨兵的命令，哨兵是一个独立的进程，作为进程，它会独
立运行。其原理是哨兵通过发送命令，等待Redis服务器响应，从而监控运行的多个Redis实例。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419232332.png" width="700px"/>

这里的哨兵有两个作用
- 通过发送命令，让Redis服务器返回监控其运行状态，包括主服务器和从服务器。
- 当哨兵监测到master宕机，会自动将slave切换成master，然后通过发布订阅模式通知其他的从服务器，修改配置文件，让它们切换主机。

然而一个哨兵进程对Redis服务器进行监控，可能会出现问题，为此，我们可以使用多个哨兵进行监控。各个哨兵之间还会进行监控，这样就形成了多哨兵模式。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419232411.png" width="700px"/>

假设主服务器宕机，哨兵1先检测到这个结果，系统并不会马上进行`failover[故障转移]`过程，仅仅是哨兵1主观的认为主服务器不可用，这个现象成为主观下线。当后面的哨兵也检测到主服务器不可用，并且数量达到一定值时，那么哨兵之间就会进行一次投票，投票的结果由一个哨兵发起，进行failover操作。切换成功后，就会通过发布订阅模式，让各个哨兵把自己监控的从服务器实现切换主机，这个过程称为客观下线。

### 测试
我们目前的状态是 一主二从！
1. 配置哨兵配置文件 sentinel.conf
```conf
# 哨兵sentinel监控的redis主节点的 ip port
# master-name 可以自己命名的主节点名字 只能由字母A-z、数字0-9 、这三个字符".-_"组成。 
# quorum 配置多少个sentinel哨兵统一认为master主节点失联 那么这时客观上认为主节点失联了 
# sentinel monitor <master-name> <ip> <redis-port> <quorum> 
sentinel monitor mymaster 127.0.0.1 6379
```
2. 启动哨兵！
```shell
[root@kuangshen bin]# redis-sentinel kconfig/sentinel.conf 
26607:X 31 Mar 2020 21:13:10.027 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo 26607:X 31 Mar 2020 21:13:10.027 # Redis version=5.0.8, bits=64, commit=00000000, modified=0, pid=26607, just started 
26607:X 31 Mar 2020 21:13:10.027 # Configuration loaded 
...
26607:X 31 Mar 2020 21:13:10.031 * +slave slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379 
26607:X 31 Mar 2020 21:13:10.033 * +slave slave 127.0.0.1:6381 127.0.0.1 6381 @ myredis 127.0.0.1 6379
```

如果6379端口的主节点断开了，这个时候就会从从机中随机选择一个服务器来当主节点！（这里面有一个投票算法！）
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419233246.png" width="700px"/>
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210419233330.png" width="700px"/>

如果6379端口的主节点此时回来了，只能归并到新的主机6381下，当做从机，这就是哨兵模式的规则！

### 哨兵模式的全部配置
```conf
# Example sentinel.conf 

# 哨兵sentinel实例运行的端口 默认26379 
port 26379 

# 哨兵sentinel的工作目录 
dir /tmp 

# 哨兵sentinel监控的redis主节点的 ip port 
# master-name 可以自己命名的主节点名字 只能由字母A-z、数字0-9 、这三个字符".-_"组成。 
# quorum 配置多少个sentinel哨兵统一认为master主节点失联 那么这时客观上认为主节点失联了 
# sentinel monitor <master-name> <ip> <redis-port> <quorum> 
sentinel monitor mymaster 127.0.0.1 6379 2 

# 当在Redis实例中开启了requirepass foobared 授权密码 这样所有连接Redis实例的客户端都要提供密码
# 设置哨兵sentinel 连接主从的密码 注意必须为主从设置一样的验证密码 
# sentinel auth-pass <master-name> <password> 
sentinel auth-pass mymaster MySUPER--secret-0123passw0rd 

# 指定多少毫秒之后 主节点没有应答哨兵sentinel 此时 哨兵主观上认为主节点下线 默认30秒 
# sentinel down-after-milliseconds <master-name> <milliseconds> 
sentinel down-after-milliseconds mymaster 30000 

# 这个配置项指定了在发生failover主备切换时最多可以有多少个slave同时对新的master进行 同步， 这个数字越小，完成failover所需的时间就越长， 但是如果这个数字越大，就意味着越 多的slave因为replication而不可用。 可以通过将这个值设为 1 来保证每次只有一个slave 处于不能处理命令请求的状态。 
# sentinel parallel-syncs <master-name> <numslaves> 
sentinel parallel-syncs mymaster 1 

# 故障转移的超时时间 failover-timeout 可以用在以下这些方面： 
#1. 同一个sentinel对同一个master两次failover之间的间隔时间。 
#2. 当一个slave从一个错误的master那里同步数据开始计算时间。直到slave被纠正为向正确的master那 里同步数据时。 
#3.当想要取消一个正在进行的failover所需要的时间。 
#4.当进行failover时，配置所有slaves指向新的master所需的最大时间。不过，即使过了这个超时， slaves依然会被正确配置为指向master，但是就不按parallel-syncs所配置的规则来了 
# 默认三分钟 
# sentinel failover-timeout <master-name> <milliseconds>
sentinel failover-timeout mymaster 180000

# SCRIPTS EXECUTION 

#配置当某一事件发生时所需要执行的脚本，可以通过脚本来通知管理员，例如当系统运行不正常时发邮件通知 相关人员。 
#对于脚本的运行结果有以下规则： 
#若脚本执行后返回1，那么该脚本稍后将会被再次执行，重复次数目前默认为10 
#若脚本执行后返回2，或者比2更高的一个返回值，脚本将不会重复执行。 
#如果脚本在执行过程中由于收到系统中断信号被终止了，则同返回值为1时的行为相同。 
#一个脚本的最大执行时间为60s，如果超过这个时间，脚本将会被一个SIGKILL信号终止，之后重新执行。 
#通知型脚本:当sentinel有任何警告级别的事件发生时（比如说redis实例的主观失效和客观失效等等）， 将会去调用这个脚本，这时这个脚本应该通过邮件，SMS等方式去通知系统管理员关于系统不正常运行的信 息。调用该脚本时，将传给脚本两个参数，一个是事件的类型，一个是事件的描述。如果sentinel.conf配 置文件中配置了这个脚本路径，那么必须保证这个脚本存在于这个路径，并且是可执行的，否则sentinel无 法正常启动成功。 
#通知脚本
# shell编程 
# sentinel notification-script <master-name> <script-path> 
sentinel notification-script mymaster /var/redis/notify.s

# 客户端重新配置主节点参数脚本 
# 当一个master由于failover而发生改变时，这个脚本将会被调用，通知相关的客户端关于master地址已 经发生改变的信息。 
# 以下参数将会在调用脚本时传给脚本: 
# <master-name> <role> <state> <from-ip> <from-port> <to-ip> <to-port> 
# 目前<state>总是“failover”, # <role>是“leader”或者“observer”中的一个。 
# 参数 from-ip, from-port, to-ip, to-port是用来和旧的master和新的master(即旧的slave)通 信的
# 这个脚本应该是通用的，能被多次调用，不是针对性的。 
# sentinel client-reconfig-script <master-name> <script-path> 
sentinel client-reconfig-script mymaster /var/redis/reconfig.sh # 一般都是由运维来配 置！
```

### 哨兵模式缺点与优点
优点：
- 主从可以切换，故障可以转移，系统的可用性就会更好
- 哨兵模式就是主从模式的升级，手动到自动，更加健壮！
缺点：
- Redis 不好啊在线扩容的，集群容量一旦到达上限，在线扩容就十分麻烦！
- 实现哨兵模式的配置其实是很麻烦的，里面有很多选择！

# Jedis
Jedis 是 Redis 官方推荐的 java连接开发工具！ 使用Java 操作Redis 中间件！如果你要使用java操作redis，那么一定要对Jedis 十分的熟悉！

**使用：**
1. 导入依赖
```xml
<!--导入jedis的包--> 
<dependencies> 
  <!-- https://mvnrepository.com/artifact/redis.clients/jedis --> 
  <dependency> 
    <groupId>redis.clients</groupId> 
    <artifactId>jedis</artifactId> 
    <version>3.2.0</version> 
  </dependency>
</dependencies> 
```

2. 编码测试：
- 连接数据库
- 操作命令
- 断开连接！
```java
public class TestPing { 
  public static void main(String[] args) { 
    // 1、 new Jedis 对象即可 
    Jedis jedis = new Jedis("127.0.0.1",6379); 
    // jedis 所有的命令就是我们之前学习的所有指令！所以之前的指令学习很重要！ 
    System.out.println(jedis.ping());
  }
}
```
```java
public class TestKey {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        System.out.println("清空数据："+jedis.flushDB());
        System.out.println("判断某个键是否存在："+jedis.exists("username"));
        System.out.println("新增<'username','kuangshen'>的键值对："+jedis.set("username", "kuangshen"));
        System.out.println("新增<'password','password'>的键值对："+jedis.set("password", "password"));
        System.out.print("系统中所有的键如下：");
        Set<String> keys = jedis.keys("*");
        System.out.println(keys);
        System.out.println("删除键password:"+jedis.del("password"));
        System.out.println("判断键password是否存在："+jedis.exists("password"));
        System.out.println("查看键username所存储的值的类型："+jedis.type("username"));
        System.out.println("随机返回key空间的一个："+jedis.randomKey());
        System.out.println("重命名key："+jedis.rename("username","name"));
        System.out.println("取出改后的name："+jedis.get("name"));
        System.out.println("按索引查询："+jedis.select(0));
        System.out.println("删除当前选择数据库中的所有key："+jedis.flushDB());
        System.out.println("返回当前数据库中key的数目："+jedis.dbSize());
        System.out.println("删除所有数据库中的所有key："+jedis.flushAll());
    }
}
```
```java
public class TestString {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        jedis.flushDB();
        System.out.println("===========增加数据===========");
        System.out.println(jedis.set("key1","value1"));
        System.out.println(jedis.set("key2","value2"));
        System.out.println(jedis.set("key3", "value3"));
        System.out.println("删除键key2:"+jedis.del("key2"));
        System.out.println("获取键key2:"+jedis.get("key2"));
        System.out.println("修改key1:"+jedis.set("key1", "value1Changed"));
        System.out.println("获取key1的值："+jedis.get("key1"));
        System.out.println("在key3后面加入值："+jedis.append("key3", "End"));
        System.out.println("key3的值："+jedis.get("key3"));
        System.out.println("增加多个键值对："+jedis.mset("key01","value01","key02","value02","key03","value03"));
        System.out.println("获取多个键值对："+jedis.mget("key01","key02","key03"));
        System.out.println("获取多个键值对："+jedis.mget("key01","key02","key03","key04"));
        System.out.println("删除多个键值对："+jedis.del("key01","key02"));
        System.out.println("获取多个键值对："+jedis.mget("key01","key02","key03"));

        jedis.flushDB();
        System.out.println("===========新增键值对防止覆盖原先值==============");
        System.out.println(jedis.setnx("key1", "value1"));
        System.out.println(jedis.setnx("key2", "value2"));
        System.out.println(jedis.setnx("key2", "value2-new"));
        System.out.println(jedis.get("key1"));
        System.out.println(jedis.get("key2"));

        System.out.println("===========新增键值对并设置有效时间=============");
        System.out.println(jedis.setex("key3", 2, "value3"));
        System.out.println(jedis.get("key3"));
        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(jedis.get("key3"));

        System.out.println("===========获取原值，更新为新值==========");
        System.out.println(jedis.getSet("key2", "key2GetSet"));
        System.out.println(jedis.get("key2"));

        System.out.println("获得key2的值的字串："+jedis.getrange("key2", 2, 4));
    }
}

```
```java
public class TestList {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.flushDB();
        System.out.println("===========添加一个list===========");
        jedis.lpush("collections", "ArrayList", "Vector", "Stack", "HashMap", "WeakHashMap", "LinkedHashMap");
        jedis.lpush("collections", "HashSet");
        jedis.lpush("collections", "TreeSet");
        jedis.lpush("collections", "TreeMap");
        System.out.println("collections的内容："+jedis.lrange("collections", 0, -1));//-1代表倒数第一个元素，-2代表倒数第二个元素,end为-1表示查询全部
        System.out.println("collections区间0-3的元素："+jedis.lrange("collections",0,3));
        System.out.println("===============================");
        // 删除列表指定的值 ，第二个参数为删除的个数（有重复时），后add进去的值先被删，类似于出栈
        System.out.println("删除指定元素个数："+jedis.lrem("collections", 2, "HashMap"));
        System.out.println("collections的内容："+jedis.lrange("collections", 0, -1));
        System.out.println("删除下表0-3区间之外的元素："+jedis.ltrim("collections", 0, 3));
        System.out.println("collections的内容："+jedis.lrange("collections", 0, -1));
        System.out.println("collections列表出栈（左端）："+jedis.lpop("collections"));
        System.out.println("collections的内容："+jedis.lrange("collections", 0, -1));
        System.out.println("collections添加元素，从列表右端，与lpush相对应："+jedis.rpush("collections", "EnumMap"));
        System.out.println("collections的内容："+jedis.lrange("collections", 0, -1));
        System.out.println("collections列表出栈（右端）："+jedis.rpop("collections"));
        System.out.println("collections的内容："+jedis.lrange("collections", 0, -1));
        System.out.println("修改collections指定下标1的内容："+jedis.lset("collections", 1, "LinkedArrayList"));
        System.out.println("collections的内容："+jedis.lrange("collections", 0, -1));
        System.out.println("===============================");
        System.out.println("collections的长度："+jedis.llen("collections"));
        System.out.println("获取collections下标为2的元素："+jedis.lindex("collections", 2));
        System.out.println("===============================");
        jedis.lpush("sortedList", "3","6","2","0","7","4");
        System.out.println("sortedList排序前："+jedis.lrange("sortedList", 0, -1));
        System.out.println(jedis.sort("sortedList"));
        System.out.println("sortedList排序后："+jedis.lrange("sortedList", 0, -1));
    }
}
```
```java
public class TestSet {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.flushDB();
        System.out.println("============向集合中添加元素（不重复）============");
        System.out.println(jedis.sadd("eleSet", "e1","e2","e4","e3","e0","e8","e7","e5"));
        System.out.println(jedis.sadd("eleSet", "e6"));
        System.out.println(jedis.sadd("eleSet", "e6"));
        System.out.println("eleSet的所有元素为："+jedis.smembers("eleSet"));
        System.out.println("删除一个元素e0："+jedis.srem("eleSet", "e0"));
        System.out.println("eleSet的所有元素为："+jedis.smembers("eleSet"));
        System.out.println("删除两个元素e7和e6："+jedis.srem("eleSet", "e7","e6"));
        System.out.println("eleSet的所有元素为："+jedis.smembers("eleSet"));
        System.out.println("随机的移除集合中的一个元素："+jedis.spop("eleSet"));
        System.out.println("随机的移除集合中的一个元素："+jedis.spop("eleSet"));
        System.out.println("eleSet的所有元素为："+jedis.smembers("eleSet"));
        System.out.println("eleSet中包含元素的个数："+jedis.scard("eleSet"));
        System.out.println("e3是否在eleSet中："+jedis.sismember("eleSet", "e3"));
        System.out.println("e1是否在eleSet中："+jedis.sismember("eleSet", "e1"));
        System.out.println("e1是否在eleSet中："+jedis.sismember("eleSet", "e5"));
        System.out.println("=================================");
        System.out.println(jedis.sadd("eleSet1", "e1","e2","e4","e3","e0","e8","e7","e5"));
        System.out.println(jedis.sadd("eleSet2", "e1","e2","e4","e3","e0","e8"));
        System.out.println("将eleSet1中删除e1并存入eleSet3中："+jedis.smove("eleSet1", "eleSet3", "e1"));//移到集合元素
        System.out.println("将eleSet1中删除e2并存入eleSet3中："+jedis.smove("eleSet1", "eleSet3", "e2"));
        System.out.println("eleSet1中的元素："+jedis.smembers("eleSet1"));
        System.out.println("eleSet3中的元素："+jedis.smembers("eleSet3"));
        System.out.println("============集合运算=================");
        System.out.println("eleSet1中的元素："+jedis.smembers("eleSet1"));
        System.out.println("eleSet2中的元素："+jedis.smembers("eleSet2"));
        System.out.println("eleSet1和eleSet2的交集:"+jedis.sinter("eleSet1","eleSet2"));
        System.out.println("eleSet1和eleSet2的并集:"+jedis.sunion("eleSet1","eleSet2"));
        System.out.println("eleSet1和eleSet2的差集:"+jedis.sdiff("eleSet1","eleSet2"));//eleSet1中有，eleSet2中没有
        jedis.sinterstore("eleSet4","eleSet1","eleSet2");//求交集并将交集保存到dstkey的集合
        System.out.println("eleSet4中的元素："+jedis.smembers("eleSet4"));
    }
}
```
```java
public class TestHash {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.flushDB();
        Map<String,String> map = new HashMap<String,String>();
        map.put("key1","value1");
        map.put("key2","value2");
        map.put("key3","value3");
        map.put("key4","value4");
        //添加名称为hash（key）的hash元素
        jedis.hmset("hash",map);
        //向名称为hash的hash中添加key为key5，value为value5元素
        jedis.hset("hash", "key5", "value5");
        System.out.println("散列hash的所有键值对为："+jedis.hgetAll("hash"));//return Map<String,String>
        System.out.println("散列hash的所有键为："+jedis.hkeys("hash"));//return Set<String>
        System.out.println("散列hash的所有值为："+jedis.hvals("hash"));//return List<String>
        System.out.println("将key6保存的值加上一个整数，如果key6不存在则添加key6："+jedis.hincrBy("hash", "key6", 6));
        System.out.println("散列hash的所有键值对为："+jedis.hgetAll("hash"));
        System.out.println("将key6保存的值加上一个整数，如果key6不存在则添加key6："+jedis.hincrBy("hash", "key6", 3));
        System.out.println("散列hash的所有键值对为："+jedis.hgetAll("hash"));
        System.out.println("删除一个或者多个键值对："+jedis.hdel("hash", "key2"));
        System.out.println("散列hash的所有键值对为："+jedis.hgetAll("hash"));
        System.out.println("散列hash中键值对的个数："+jedis.hlen("hash"));
        System.out.println("判断hash中是否存在key2："+jedis.hexists("hash","key2"));
        System.out.println("判断hash中是否存在key3："+jedis.hexists("hash","key3"));
        System.out.println("获取hash中的值："+jedis.hmget("hash","key3"));
        System.out.println("获取hash中的值："+jedis.hmget("hash","key3","key4"));
    }
}
```

**事务操作**
```java
public class TestMulti {
    public static void main(String[] args) {
        //创建客户端连接服务端，redis服务端需要被开启
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.flushDB();

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("hello", "world");
        jsonObject.put("name", "java");
        //开启事务
        Transaction multi = jedis.multi();
        String result = jsonObject.toJSONString();
        try{
            //向redis存入一条数据
            multi.set("json", result);
            //再存入一条数据
            multi.set("json2", result);
            //如果没有引发异常，执行事务
            multi.exec();
        }catch(Exception e){
            e.printStackTrace();
            //如果出现异常，回滚
            multi.discard();
        }finally{
            System.out.println(jedis.get("json"));
            System.out.println(jedis.get("json2"));
            //最终关闭客户端
            jedis.close();
        }
    }
}
```

# springdataRedis
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```
配置
```yml
spring:
  redis:
    # Redis服务器地址
    host: 127.0.0.1
    # Redis服务器端口
    port: 6379
    # Redis服务器密码
    password: root
    database: 0
    # 连接超时时间
    timeout: 10000ms
    lettuce:
      pool:
        # 最大连接数，默认为8
        max-active: 1024
        # 最大连接阻塞等待时间
        max-wait: 10000ms
        # 最大空闲连接，默认为8
        max-idle: 200
        # 最小空闲连接，默认为0
        min-idle: 5

```

**jedis与lettuce的区别**
Jedis是一个优秀的基于Java 语言的Redis 客户端，但是，其不足也很明显：Jedis在实现上是直接连接Redis-Server，在多个线程间共享一个Jedis实例时是线程不安全的，如果想要在多线程场景下使用Jedis，需要使用连接池，每个线程都使用自己的Jedis实例，当连接数量增多时，会消耗较多的物理资源。
Lettuce则完全克服了其线程不安全的缺点：Lettuce是基于Netty的连接（StatefulRedisConnection），Lettuce是一个可伸缩的线程安全的Redis客户端，支持同步、异步和响应式模式。多个线程可以共享一个连接实例，而不必担心多线程并发问题。它基于优秀Netty NIO框架构建，支持Redis的高级功能，如Sentinel，集群，流水线，自动重新连接和Redis 数据模型。

**测试环境是否搭建成功**
```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RedisApplication.class)
class RedisApplicationTests {

	@Autowired
	private RedisTemplate redisTemplate;

	@Autowired
	private StringRedisTemplate stringRedisTemplate;

	@Test
	public void initconn(){
		ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
		ops.set("username", "li");
		ValueOperations<String, String> value = redisTemplate.opsForValue();
		ops.set("name", "wang");
		System.out.println(ops.get("name"));
	}
}
```

## 自定义序列化模板解决序列化问题
默认情况下的模板`RedisTemplate<Object，Object>`，默认序列化使用的是 `JdkSerializationRedisSerializer`，存储二进制字节码。这时需要自定义模板，当自定义模板后又想存储String 字符串时，可以使`StringRedisTemplate`的方式，他们俩并不冲突。

**序列化问题：**
要把java对象做为key-value对保存在redis中，就必须要解决对象的序列化问题。Spring Data Redis给我们提供了一些现成的方案 

JdkSerializationRedisSerializer使用JDK提供的序列化功能。优点是反序列化时不需要提供类型信息（class），但缺点是序列化后的结果非常庞大，是JSON格式的5倍左右，这样就会消耗Redis服务器的大量内存。

Jackson2JsonRedisSerializer使用Jackson库将对象序列化为JSON字符串。优点是速度快，序列化后的字符串短小精悍。但缺点也非常致命，那就是此类的构造函数中有一个类型参数，必须提供要序列化对象的类型信息（.class对象）。通过查看源代码，发现其只在反序列化过程中用到了类型信息。
GenericJackson2JsonRedisSerializer通用型序列化，这种序列化方式不用自己手动指定对象的Class。


**自定义序列化模板**
```java
@Configuration
public class RedisConfig {
	@Bean
	public RedisTemplate<String, Object> redisTemplate(LettuceConnectionFactory lettuceConnectionFactory){
		RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
		//为string类型key设置序列器
		redisTemplate.setKeySerializer(new StringRedisSerializer());
		//为string类型value设置序列器
		redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
		//为hash类型key设置序列器
		redisTemplate.setHashKeySerializer(new StringRedisSerializer());
		//hash类型的value设置序列器
		redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
		redisTemplate.setConnectionFactory(lettuceConnectionFactory);
		return redisTemplate;
	}
}
```
```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RedisApplication.class)
class RedisApplicationTests {

	@Autowired
	private RedisTemplate redisTemplate;

	@Test
	public void testSerial(){
		User user = new User();
		user.setId(1);
		user.setName("zhangsan");
		user.setAge(20);
		ValueOperations ops = redisTemplate.opsForValue();
		ops.set("user", user);
		Object user1 = ops.get("user");
		System.out.println(user1);
	}
}
```
输出：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210420222655.png" width="700px"/>
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210420222713.png" width="700px"/>

## 基本操作
**操作String**
```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RedisApplication.class)
class RedisApplicationTests {

	@Autowired
	private RedisTemplate redisTemplate;

	public void testString(){
		ValueOperations ops = redisTemplate.opsForValue();
		//添加一条数据
		ops.set("name", "zhangsan");

		//获取一条数据
		String name = (String) ops.get("name");
		System.out.println(name);

		//层级关系，目录形式存储数据
		ops.set("user:01","lisi");

		//添加多条数据
		Map<String, String> map = new HashMap<>();
		map.put("age", "20");
		map.put("address", "sh");
		ops.multiSet(map);

		//获取多条数据
		List<String> keys = new ArrayList<>();
		keys.add("name");
		keys.add("age");
		keys.add("address");
		List list = ops.multiGet(keys);
		list.forEach(System.out :: println);

		//删除数据
		ops.delete("name");
	}
}
```
**操作Hash**
```java
	public void testHash(){
		HashOperations hashOperations = redisTemplate.opsForHash();
		/**
		 * 添加一条数据
		 * 第一个参数：redis的key
		 * 第二个参数：hash的key
		 * 第三个参数: hash的value
		 */
		hashOperations.put("user", "name", "zhangsan");

		/**
		 * 获取一条数据
		 * 第一个参数：redis的key
		 * 第二个参数：hash的key
		 */
		hashOperations.get("user", "name");

		//添加多条数据
		Map<String, String> map = new HashMap<>();
		map.put("age", "20");
		map.put("address", "sh");
		hashOperations.putAll("user", map);

		//获取多条数据
		List<String> keys = new ArrayList<>();
		keys.add("name");
		keys.add("age");
		keys.add("address");
		List user = hashOperations.multiGet("user", keys);
		user.forEach(System.out :: println);

		//获取hash类型的所有的数据
		Map<String, String> entries = hashOperations.entries("user");
		entries.entrySet().forEach(e -> {
			System.out.println(e.getKey() + "-->" + e.getValue());
		});

		//hash的删除数据
		hashOperations.delete("user", "name", "age");
	}

```
**操作list**
```java
	public void testList(){
		ListOperations listOperations = redisTemplate.opsForList();

		//左添加
		listOperations.leftPush("students", "wangwu");
		listOperations.leftPush("students", "lisi");

		/**
		 * 左添加
		 * 第一个参数：redis的key
		 * 第二个参数：被左添加的数据
		 * 第三个参数：添加的数据，添加到第二个参数的左边
		 */
		listOperations.leftPush("students", "whz", "aaaa");

		//右添加
		listOperations.rightPush("students", "zhaoliu");

		//获取数据
		List list = listOperations.range("students", 0, 2);
		list.forEach(System.out :: println);

		//获取总条数
		Long size = listOperations.size("students");
		System.out.println(size);

		//删除数据
		listOperations.remove("students", 1, "lisi");

		//左弹出
		listOperations.leftPop("students");

		//右弹出
		listOperations.rightPop("students");
	}
```
**操作set**
```java
	public void testSet(){
		SetOperations setOperations = redisTemplate.opsForSet();
		//添加数据
		String[] letters = new String[]{"aaa", "bbb", "ccc", "ddd", "eee"};
		//setOperations.add("letters", "aaa", "bbb", "ccc", "ddd", "eee");
		setOperations.add("letters", letters);

		//获取数据
		Set set = setOperations.members("letters");
		set.forEach(System.out::println);

		//删除数据
		setOperations.remove("letters", "aaa", "bbb");
	}
```
**操作zset**
```java
	public void testZSet(){
		ZSetOperations zSetOperations = redisTemplate.opsForZSet();
		//添加数据
		ZSetOperations.TypedTuple<Object> objectTypedTuple1 = new DefaultTypedTuple<>("zhangsan", 7D);
		ZSetOperations.TypedTuple<Object> objectTypedTuple2 = new DefaultTypedTuple<>("zhangsan", 5D);
		ZSetOperations.TypedTuple<Object> objectTypedTuple3 = new DefaultTypedTuple<>("zhangsan", 8D);
		Set<ZSetOperations.TypedTuple<Object>> tuples = new HashSet<>();
		tuples.add(objectTypedTuple1);
		tuples.add(objectTypedTuple2);
		tuples.add(objectTypedTuple3);
		zSetOperations.add("score", tuples);

		//获取数据
		Set set = zSetOperations.range("score", 0, 2);
		set.forEach(System.out :: println);

		//获取大小
		Long size = zSetOperations.size("score");
		System.out.println(size);
	}
```
**操作key**
```java
	public void testKey(){
		//获取当前数据所有key
		Set keys = redisTemplate.keys("*");
		keys.forEach(System.out :: println);

		ValueOperations ops = redisTemplate.opsForValue();
		// 添加key的时候设置失效时间
		ops.set("code", "test", 30, TimeUnit.SECONDS);

		//给已经存在的key设置失效时间
		redisTemplate.expire("address", 30, TimeUnit.SECONDS);

		//查看一个key的失效时间
		Long expire = redisTemplate.getExpire("code");
		System.out.println(expire);
	}
```

## 整合哨兵
第一种方式：修改配置文件
```yml
spring:
  redis:
    # Redis服务器地址
    host: 127.0.0.1
    # Redis服务器端口
    port: 6379
    # Redis服务器密码
    password: root
    database: 0
    # 连接超时时间
    timeout: 10000ms
    lettuce:
      pool:
        # 最大连接数，默认为8
        max-active: 1024
        # 最大连接阻塞等待时间
        max-wait: 10000ms
        # 最大空闲连接，默认为8
        max-idle: 200
        # 最小空闲连接，默认为0
        min-idle: 5
    # 哨兵模式
    sentinel:
      # 主节点名称
      master: mymaster
      # 节点
      nodes: 127.0.0.1:6379,127.0.0.1:6380, 127.0.0.1:6381
```

第二种方式：添加配置类
```java
@Bean
public RedisSentinelConfiguration redisSentinelConfiguration(){
    RedisSentinelConfiguration redisSentinelConfiguration =
            new RedisSentinelConfiguration()
                .master("mymaster")
                .sentinel("127.0.0.1", 6379)
                .sentinel("127.0.0.1", 6380)
                .sentinel("127.0.0.1", 6381);
    
    //设置密码
    redisSentinelConfiguration.setPassword("root");
    return redisSentinelConfiguration;
}
```

# Redis缓存穿透、缓存击穿和雪崩问题
**在实际开发中，我们一般是把redis当作缓存来使用**
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210420232908.png" width="700px"/>
Redis缓存的使用，极大的提升了应用程序的性能和效率，特别是数据查询方面。但同时，它也带来了一些问题。其中，最要害的问题，就是数据的一致性问题，从严格意义上讲，这个问题无解。如果对数据的一致性要求很高，那么就不能使用缓存。
另外的一些典型问题就是，缓存穿透、缓存雪崩和缓存击穿。目前，业界也都有比较流行的解决方案。

## Key的过期淘汰机制
Redis可以对存储在Redis中的缓存数据设置过期时间，比如我们获取的短信验证码一般十分钟过期，我们这时候就需要在验证码存进Redis时添加一个key的过期时间，但是这里有一个需要格外注意的问题就是：**并非key过期时间到了就一定会被Redis给删除。**
### 定期删除
Redis 默认是每隔100ms就随机抽取一些设置了过期时间的Key，检查其是否过期，如果过期就删除。为什么是随机抽取而不是检查所有key？因为你如果设置的key成千上万，每100毫秒都将所有存在的key检查一遍，会给CPU带来比较大的压力。

### 惰性删除
定期删除由于是随机抽取可能会导致很多过期Key到了过期时间并没有被删除。所以用户在从缓存获取数据的时候，redis会检查这个key是否过期了，如果过期就删除这个key。这时候就会在查询的时候将过期key从缓存中清除。

### 内存淘汰机制
仅仅使用定期删除+惰性删除机制还是会留下一个严重的隐患：如果定期删除留下了很多已经过期的key，而且用户长时间都没有使用过这些过期key，导致过期key无法被惰性删除，从而导致过期key一直堆积在内存里，最终造成Redis内存块被消耗殆尽。那这个问题如何解决呢？这个时候Redis内存淘汰机制应运而生了。Redis内存淘汰机制提供了6种数据淘汰策略：
- volatile-lru：从已设置过期时间的数据集中挑选最近最少使用的数据淘汰。
- volatile-ttl：从已设置过期时间的数据集中挑选将要过期的数据淘汰。
- volatile-random：从已设置过期时间的数据集中任意选择数据淘汰。
- allkeys-lru：当内存不足以容纳新写入数据时移除最近最少使用的key。
- allkeys-random：从数据集中任意选择数据淘汰。
- no-enviction（默认）：当内存不足以容纳新写入数据时，新写入操作会报错。

一般情况下，推荐使用volatile-lru策略，对于配置信息等重要数据，不应该设置过期时间，这样Redis就永远不会淘汰这些重要数据。对于一般数据可以添加一个缓存时间，当数据失效则请求会从DB中获取并重新存入Redis中。

## 缓存击穿
定义：高并发的情况下，某个热门key突然过期，导致大量请求在Redis未找到缓存数据，进而全部去访问DB请求数据，引起DB压力瞬间增大。

解决方案：缓存击穿的情况下一般不容易造成DB的宕机，只是会造成对DB的周期性压力。对缓存击穿的解决方案一般可以这样：
- Redis中的数据不设置过期时间，然后在缓存的对象上添加一个属性标识过期时间，每次获取到数据时，校验对象中的过期时间属性，如果数据即将过期，则异步发起一个线程主动更新缓存中的数据。但是这种方案可能会导致有些请求会拿到过期的值，就得看业务能否可以接受，
- 如果要求数据必须是新数据，则最好的方案则为热点数据设置为永不过期，然后加一个互斥锁保证缓存的单线程写

## 缓存穿透
定义：缓存穿透是指查询缓存和DB中都不存在的数据。比如通过id查询商品信息，id一般大于0，攻击者会故意传id为-1去查询，由于缓存是不命中则从DB中获取数据，这将会导致每次缓存都不命中数据导致每个请求都访问DB，造成缓存穿透。

解决方案：
- 利用互斥锁，缓存失效的时候，先去获得锁，得到锁了，再去请求数据库。没得到锁，则休眠一段时间重试
- 采用异步更新策略，无论key是否取到值，都直接返回。value值中维护一个缓存失效时间，缓存如果过期，异步起一个线程去读数据库，更新缓存。需要做缓存预热（项目启动前，先加载缓存）操作。
- 提供一个能迅速判断请求是否有效的拦截机制，比如，利用布隆过滤器，内部维护一系列合法有效的key。迅速判断出，请求所携带的Key是否合法有效。如果不合法，则直接返回。
- 如果从数据库查询的对象为空，也放入缓存，只是设定的缓存过期时间较短，比如设置为60秒。

## 缓存雪崩
定义：缓存中如果大量缓存在一段时间内集中过期了，这时候会发生大量的缓存击穿现象，所有的请求都落在了DB上，由于查询数据量巨大，引起DB压力过大甚至导致DB宕机。

解决方案：
- 给缓存的失效时间，加上一个随机值，避免集体失效。如果Redis是集群部署，将热点数据均匀分布在不同的Redis库中也能避免全部失效的问题
- 使用互斥锁，但是该方案吞吐量明显下降了。
- 设置热点数据永远不过期。
- 双缓存。我们有两个缓存，缓存A和缓存B。缓存A的失效时间为20分钟，缓存B不设失效时间。自己做缓存预热操作。然后细分以下几个小点
  - 从缓存A读数据库，有则直接返回
  - A没有数据，直接从B读数据，直接返回，并且异步启动一个更新线程。
  - 更新线程同时更新缓存A和缓存B。
