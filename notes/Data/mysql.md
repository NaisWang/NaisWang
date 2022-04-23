# 基础知识
## 启动 MySQL 服务
```SQL
service mysql start
service mysql stop
service mysql status
service mysql restart
```

## 配置mysql允许远程连接的方法
首先使用`netstat -ano | grep 3306`命令来查看

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423184902.png)

以上Local Address为`127.0.0.1:3306`,表示mysql-server服务只监听了本机的loopback地址的3306端口(如果某个服务只监听了回环地址，那么只能在本机进行访问，无法通过tcp/ip 协议进行远程访问), 所以此时只能进行本地连接mysql，而不能进行远程连接。

若此时我不是本地以root用户连接mysql(mysql部署在1.117.40.114服务器上)，会报如下错误：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423191514.png)

为了使mysql-server应用监听本机的所有ip地址，我们需要修改`/etc/mysql/mysql.conf.d/mysqld.cnf`文件，找到`bind-address = 127.0.0.1`, mysql-server通过读取bind-address的值来决定监听本机的什么ip地址。我们可以通过注释掉这句代码来让mysql-server监听本地的所有ip地址。注释掉后，运行`sudo service mysql restart`重启服务，然后执行`netstat -ano | grep 3306`命令，如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423185752.png)

此时发现Local Address变为来`:::3306`，表示有服务监听了该本机的所有ip地址的3306端口

此时我们向服务器的3306端口发送请求，就能被mysql-server监听到，并做一些处理。但是现在有一个问题就是mysql有用户权限管理，即设置哪些ip能使用什么mysql用户来进行访问。

通过如下可以看到mysql的用户权限管理：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423190531.png)

以上设置了有哪些主机host能够访问，并且只能以什么用户user访问。

若此时我不是本地以root用户连接mysql，会报如下错误：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423191415.png)

所以为了能让所有ip能购以user用户来访问，我们可以运行如下语句：

```mysql
update user set host = ’%’ where user = ’root’;
```

host为%表示所有ip

设置完成且重启mysql服务后，我可以成功地在从不是本地以root用户连接mysql，如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220423191841.png)

## 创建表
```sql
create table if not exist user(
  id int(10) unsigned not null primary key auto_increment,
	email char(129) unique,
	phone char(129), 
  playtime int(11) not null default 0 comment '游戏时常',
  streamid char(40) default '0',
  gender enum('男','女'), -- 枚举类型
	-- unique(email, phone), 表级定义
  -- primary key(id), 表级定义
  -- primary key(id,email) 复合主键
	key `playtime_index` (`playtime`) USING BTREE, -- 给playtime属性添加普通索引，索引名为playtime_index, 且采用btree方式
  unique key `phone_unique_index` (`phone`), -- 给phone属性添加唯一索引，索引名未phone_unique_index
  constranint fk_user_stream foreign key(streamid) references stream_table(id) -- 其中constraint是用来给约束命名的，方便后面通过约束名来删除此约束，此处给外键约束命名为fk_user_stream
) ENGINE=InnoDB AUTO_INCREMENT=0 default CHARSET=utf8 comment='表注释';
```

## 查询条件
| 查询条件            | 谓词                                 |
| ------------------- | ------------------------------------ |
| 比较                | =,>,<,>=,<=,!=,<>,!>,!<              |
| 确定范围            | between and(闭区间)，not between and |
| 确定集合            | in, not in                           |
| 字符匹配            | like, not like                       |
| 空值                | is null, is not null                 |
| 多重条件(逻辑运算)) | and, or                              |
```sql
select * from employee where salary <> 90000; -- <>等价于!=

select * from employee where salary between 80000 and 90000; -- 查询salary在[80000, 90000]区间的
select * from employee where salary not between 80000 and 90000;

select * from employee where salary in (85000, 80000);

select * from employee where name like 'He%'; -- %为匹配任意长度(可以为0)字符串
select * from employee where name like 'Ja_n'; -- _为匹配任意单字符
select * from employee where name like 'Ja_n%';
select * from employee where salary like '90_0'; -- 其中salary为int型，但仍可以使用字符匹配

select * from employee where salary is not null;

select * from employee where salary >= 85000 and name like 'Ma%';
```

# 数据类型
## int数据类型
### bigint
从 -2^63 (-9223372036854775808) 到 2^63-1 (9223372036854775807) 的整型数据（所有数字）。存储大小为 8 个字节。

**bigint已经有长度了，在mysql建表中的length，只是用于显示的位数**

### int
从 -2^31 (-2,147,483,648) 到 2^31 – 1 (2,147,483,647) 的整型数据（所有数字）。存储大小为 4 个字节。int 的 SQL-92 同义字为 integer。

### smallint
从 -2^15 (-32,768) 到 2^15 – 1 (32,767) 的整型数据。存储大小为 2 个字节。

### tinyint
从 0 到 255 的整型数据。存储大小为 1 字节。

## Boolean类型
### MySQL BOOLEAN数据类型简介
MySQL没有内置的布尔类型。 但是它使用TINYINT(1)。 为了更方便，MySQL提供BOOLEAN或BOOL作为TINYINT(1)的同义词。
在MySQL中，0被认为是false，非零值被认为是true。 要使用布尔文本，可以使用常量TRUE和FALSE来分别计算为1和0。 请参阅以下示例：
```sql
SELECT true, false, TRUE, FALSE, True, False;
-- 1 0 1 0 1 0
```
执行上面代码，得到以下结果 - 
```sql
mysql> SELECT true, false, TRUE, FALSE, True, False;
+------+-------+------+-------+------+-------+
| TRUE | FALSE | TRUE | FALSE | TRUE | FALSE |
+------+-------+------+-------+------+-------+
|    1 |     0 |    1 |     0 |    1 |     0 |
+------+-------+------+-------+------+-------+
1 row in set
```
MySQL BOOLEAN示例MySQL将布尔值作为整数存储在表中。为了演示，让我们来看下面的tasts表：

```sql
USE testdb;

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN
);
```

上面创建表语句中，即使将completed列指定为BOOLEAN类型，当显示表定义时，它是却是TINYINT(1)类型，如下所示：
```sql
DESCRIBE tasks;
```
以下语句向tasts表中插入2行数据：
```sql
INSERT INTO tasks(title,completed)
VALUES('Master MySQL Boolean type',true),
      ('Design database table',false);
```
在将数据保存到布尔列之前，MySQL将其转换为1或0，以下查询从tasks表中检索数据：
```sql
SELECT 
    id, title, completed
FROM
    tasks; 

+----+---------------------------+-----------+
| id | title                     | completed |
+----+---------------------------+-----------+
|  1 | Master MySQL Boolean type |         1 |
|  2 | Design database table     |         0 |
+----+---------------------------+-----------+
2 rows in set
```
如上所见， true 和 false 分别被转换为1和0。
因为Boolean类型是TINYINT(1)的同义词，所以可以在布尔列中插入1和0以外的值。如下示例：
```sql
INSERT INTO tasks(title,completed)
VALUES('Test Boolean with a number',2);
```
上面语句，工作正常~，查询tasts表中的数据，如下所示 - 
```sql
mysql> SELECT 
    id, title, completed
FROM
    tasks; 
+----+----------------------------+-----------+
| id | title                      | completed |
+----+----------------------------+-----------+
|  1 | Master MySQL Boolean type  |         1 |
|  2 | Design database table      |         0 |
|  3 | Test Boolean with a number |         2 |
+----+----------------------------+-----------+
3 rows in set
```
如果要将结果输出为true和false，可以使用IF函数，如下所示：
```sql
SELECT 
    id, 
    title, 
    IF(completed, 'true', 'false') completed
FROM
    tasks;
```
执行上面查询语句，得到结果如下所示 - 
```sql
+----+----------------------------+-----------+
| id | title                      | completed |
+----+----------------------------+-----------+
|  1 | Master MySQL Boolean type  | true      |
|  2 | Design database table      | false     |
|  3 | Test Boolean with a number | true      |
+----+----------------------------+-----------+
3 rows in set
```
MySQL BOOLEAN运算符要在tasts表中获取所有完成的任务，可以执行以下查询：
```sql
SELECT 
    id, title, completed
FROM
    tasks
WHERE
    completed = TRUE;
```
执行上面查询语句，得到结果如下所示 - 
```sql
+----+---------------------------+-----------+
| id | title                     | completed |
+----+---------------------------+-----------+
|  1 | Master MySQL Boolean type |         1 |
+----+---------------------------+-----------+
1 row in set
```
如您所见，它只返回completed列的值为1的任务。要解决它，必须使用IS运算符：
```sql
SELECT 
    id, title, completed
FROM
    tasks
WHERE
    completed IS TRUE;
```
执行上面查询语句，得到结果如下所示 - 
```sql
+----+----------------------------+-----------+
| id | title                      | completed |
+----+----------------------------+-----------+
|  1 | Master MySQL Boolean type  |         1 |
|  3 | Test Boolean with a number |         2 |
+----+----------------------------+-----------+
2 rows in set
```
在这个例子中，我们使用IS运算符来测试一个与布尔值的值。
要获得待处理(未完成)的任务，请使用IS FALSE或IS NOT TRUE，如下所示：
```sql
SELECT 
    id, title, completed
FROM
    tasks
WHERE
    completed IS NOT TRUE;
```
执行上面查询语句，得到结果如下所示 - 
```sql
+----+-----------------------+-----------+
| id | title                 | completed |
+----+-----------------------+-----------+
|  2 | Design database table |         0 |
+----+-----------------------+-----------+
1 row in set
```

## DATETIME 和 TIMESTAMP
MySQL 数据库中常见的日期类型有 YEAR、DATE、TIME、DATETIME、TIMESTAMEP。因为业务绝大部分场景都需要将日期精确到秒，所以在表结构设计中，常见使用的日期类型为DATETIME 和 TIMESTAMP。接下来，我就带你深入了解这两种类型，以及它们在设计中的应用实战。

### DATETIME
类型 DATETIME 最终展现的形式为：`YYYY-MM-DD HH：MM：SS`，固定占用 8 个字节。

从 MySQL 5.6 版本开始，DATETIME 类型支持毫秒，`DATETIME(N)` 中的 N 表示毫秒的精度。

例如，`DATETIME(6)` 表示可以存储 6 位的毫秒值。同时，一些日期函数也支持精确到毫秒，例如常见的函数 NOW、SYSDATE：

```mysql
ql> SELECT NOW(6);
+----------------------------+
| NOW(6)                     |
+----------------------------+
| 2020-09-14 17:50:28.707971 |
+----------------------------+
1 row in set (0.00 sec)
```

用户可以将 `DATETIME` 初始化值设置为当前时间，并设置自动更新当前时间的属性。例如用户表 `User`有`register_date`、`last_modify_date`两个字段的定义：
```mysql
CREATE TABLE User (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sex CHAR(1) NOT NULL,
    password VARCHAR(1024) NOT NULL,
    money INT NOT NULL DEFAULT 0,
    register_date DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    last_modify_date DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CHECK (sex = 'M' OR sex = 'F'),
    PRIMARY KEY(id)
);
```

在上面的表`User` 中，列 `register_date` 表示注册时间，`DEFAULT CURRENT_TIMESTAMP` 表示记录插入时，若没有指定时间，默认就是当前时间。

列 `last_modify_date` 表示当前记录最后的修改时间，`DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)` 表示每次修改都会修改为当前时间。

这样的设计保证当用户的金钱（money 字段）发生了变更，则`last_modify_date` 能记录最后一次用户金钱发生变更时的时间。来看下面的例子：
```mysql
mysql> SELECT name,money,last_modify_date FROM User WHERE name = 'David';
+-------+-------+----------------------------+
| name  | money | last_modify_date           |
+-------+-------+----------------------------+
| David |   100 | 2020-09-13 08:08:33.898593 |
+-------+-------+----------------------------+
1 row in set (0.00 sec)


mysql> UPDATE User SET money = money - 1 WHERE name = 'David';
Query OK, 1 row affected (0.06 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT name,money,last_modify_date FROM User WHERE name = 'David';
+-------+-------+----------------------------+
| name  | money | last_modify_date           |
+-------+-------+----------------------------+
| David |    99 | 2020-09-14 18:29:17.056327 |
+-------+-------+----------------------------+
1 row in set (0.00 sec)
```

可以看到，当用户金额发生修改时，所对应的字段`last_modify_date`也修改成发生变更的时间。

### TIMESTAMP
除了 `DATETIME`，日期类型中还有一种 `TIMESTAMP` 的时间戳类型，其实际存储的内容为‘`1970-01-01 00:00:00`’到现在的毫秒数。在 MySQL 中，由于类型 `TIMESTAMP` 占用 4 个字节，因此其存储的时间上限只能到‘`2038-01-19 03:14:07`’。

同类型 `DATETIME` 一样，从 MySQL 5.6 版本开始，类型 `TIMESTAMP` 也能支持毫秒。与 `DATETIME` 不同的是，若带有毫秒时，类型 `TIMESTAMP` 占用 7 个字节，而 `DATETIME` 无论是否存储毫秒信息，都占用 8 个字节。

类型 `TIMESTAMP` 最大的优点是可以带有时区属性，因为它本质上是从毫秒转化而来。如果你的业务需要对应不同的国家时区，那么类型 `TIMESTAMP` 是一种不错的选择。比如新闻类的业务，通常用户想知道这篇新闻发布时对应的自己国家时间，那么 `TIMESTAMP` 是一种选择。

另外，有些国家会执行夏令时。根据不同的季节，人为地调快或调慢 1 个小时，带有时区属性的 `TIMESTAMP` 类型本身就能解决这个问题。

参数 `time_zone` 指定了当前使用的时区，默认为 `SYSTEM` 使用操作系统时区，用户可以通过该参数指定所需要的时区。

如果想使用 `TIMESTAMP` 的时区功能，你可以通过下面的语句将之前的用户表 `User` 的注册时间字段类型从 `DATETIME(6)` 修改为 `TIMESTAMP(6)`：

```mysql
ALTER TABLE User 
CHANGE register_date 
register_date TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);
```

这时通过设定不同的 `time_zone`，可以观察到不同时区下的注册时间：

```mysql
mysql> SELECT name,regist er_date FROM User WHERE name = 'David';
+-------+----------------------------+
| name  | register_date              |
+-------+----------------------------+
| David | 2018-09-14 18:28:33.898593 |
+-------+----------------------------+
1 row in set (0.00 sec)

mysql> SET time_zone = '-08:00';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT name,register_date FROM User WHERE name = 'David';
+-------+----------------------------+
| name  | register_date              |
+-------+----------------------------+
| David | 2018-09-14 02:28:33.898593 |
+-------+----------------------------+
1 row in set (0.00 sec)
```

从上述例子中，你可以看到，中国的时区是 `+08:00`，美国的时区是 `-08:00`，因此改为美国时区后，可以看到用户注册时间比之前延迟了 16 个小时。当然了，直接加减时区并不直观，需要非常熟悉各国的时区表。

在 MySQL 中可以直接设置时区的名字，如：

```mysql
mysql> SET time_zone = 'America/Los_Angeles';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT NOW();
+---------------------+
| NOW()               |
+---------------------+
| 2020-09-14 20:12:49 |
+---------------------+
1 row in set (0.00 sec)

mysql> SET time_zone = 'Asia/Shanghai';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT NOW();
+---------------------+
| NOW()               |
+---------------------+
| 2020-09-15 11:12:55 |
+---------------------+
1 row in set (0.00 sec)
```

讲到这儿，想必你已经了解了时间字段类型，接下来我将分享在真实业务设计中如何使用好时间类型。

### DATETIME vs TIMESTAMP vs INT，怎么选？

在做表结构设计时，对日期字段的存储，开发人员通常会有 3 种选择：DATETIME、TIMESTAMP、INT。

INT 类型就是直接存储 `1970-01-01 00:00:00` 到现在的毫秒数，本质和 `TIMESTAMP` 一样，因此用 `INT` 不如直接使用 `TIMESTAMP`。

当然，有些同学会认为 `INT` 比 `TIMESTAMP` 性能更好。但是，由于当前每个 `CPU` 每秒可执行上亿次的计算，所以无须为这种转换的性能担心。更重要的是，在后期运维和数据分析时，使用 INT 存储日期，是会让 DBA 和数据分析人员发疯的，INT的可运维性太差。

也有的同学会热衷用类型 `TIMESTEMP` 存储日期，因为类型 `TIMESTAMP` 占用 4 个字节，比 `DATETIME` 小一半的存储空间。

但若要将时间精确到毫秒，`TIMESTAMP` 要 7 个字节，和 `DATETIME` 8 字节差不太多。另一方面，现在距离 `TIMESTAMP` 的最大值‘`2038-01-19 03:14:07`’已经很近，这是需要开发同学好好思考的问题。

> 总的来说，我建议你使用类型 `DATETIME`。对于时区问题，可以由前端或者服务这里做一次转化，不一定非要在数据库中解决。


### 不要忽视 TIMESTAMP 的性能问题

前面已经提及，`TIMESTAMP` 的上限值 `2038` 年很快就会到来，那时业务又将面临一次类似千年虫的问题。另外，`TIMESTAMP` 还存在潜在的性能问题。

虽然从毫秒数转换到类型 `TIMESTAMP` 本身需要的 CPU 指令并不多，这并不会带来直接的性能问题。但是如果使用默认的操作系统时区，则每次通过时区计算时间时，要调用操作系统底层系统函数 `__tz_convert()`，而这个函数需要额外的加锁操作，以确保这时操作系统时区没有修改。所以，当大规模并发访问时，由于热点资源竞争，会产生两个问题。

- 性能不如 `DATETIME`：`DATETIME` 不存在时区转化问题。
- 性能抖动：海量并发时，存在性能抖动问题。

为了优化 `TIMESTAMP` 的使用，强烈建议你使用显式的时区，而不是操作系统时区。比如在配置文件中显示地设置时区，而不要使用系统时区：

```mysql
[mysqld]
time_zone = "+08:00"
```

最后，通过命令 `mysqlslap` 来测试 `TIMESTAMP`、`DATETIME` 的性能，命令如下：

```shell
# 比较time_zone为System和Asia/Shanghai的性能对比
mysqlslap -uroot --number-of-queries=1000000 --concurrency=100 --query='SELECT NOW()'
```

最后的性能对比如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220417235600.png)

从表中可以发现，显式指定时区的性能要远远好于直接使用操作系统时区。所以，日期字段推荐使用 `DATETIME`，没有时区转化。即便使用 `TIMESTAMP`，也需要在数据库中显式地配置时区，而不是用系统时区。

### 表结构设计规范：每条记录都要有一个时间字段

在做表结构设计规范时，强烈建议你每张业务核心表都增加一个 `DATETIME` 类型的 `last_modify_date` 字段，并设置修改自动更新机制， 即便标识每条记录最后修改的时间。

例如，在前面的表 User 中的字段 `last_modify_date`，就是用于表示最后一次的修改时间：

```mysql
CREATE TABLE User (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sex CHAR(1) NOT NULL,
    password VARCHAR(1024) NOT NULL,
    money INT NOT NULL DEFAULT 0,
    register_date DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    last_modify_date DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CHECK (sex = 'M' OR sex = 'F'),
    PRIMARY KEY(id)
);

```

通过字段 `last_modify_date` 定义的 `ON UPDATE CURRENT_TIMESTAMP(6)`，那么每次这条记录，则都会自动更新 `last_modify_date` 为当前时间。

这样设计的好处是：用户可以知道每个用户最近一次记录更新的时间，以便做后续的处理。比如在电商的订单表中，可以方便对支付超时的订单做处理；在金融业务中，可以根据用户资金最后的修改时间做相应的资金核对等。

在后面的内容中，我们也会谈到 MySQL 数据库的主从逻辑数据核对的设计实现，也会利用到`last_modify_date` 字段。

### 总结

日期类型通常就是使用 `DATETIME` 和 `TIMESTAMP` 两种类型，然而由于类型 `TIMESTAMP` 存在性能问题，建议你还是尽可能使用类型`DATETIME`。我总结一下今天的重点内容：

- MySQL 5.6 版本开始 `DATETIME` 和 `TIMESTAMP` 精度支持到毫秒；
- `DATETIME` 占用 8 个字节，`TIMESTAMP` 占用 4 个字节，`DATETIME(6)` 依然占用 8 个字节，`TIMESTAMP(6)` 占用 7 个字节；
- `TIMESTAMP` 日期存储的上限为 `2038-01-19 03:14:07`，业务用 `TIMESTAMP` 存在风险；
- 使用 `TIMESTAMP` 必须显式地设置时区，不要使用默认系统时区，否则存在性能问题，推荐在配置文件中设置参数 `time_zone = '+08:00'`；
- 推荐日期类型使用 `DATETIME`，而不是 `TIMESTAMP` 和 `INT` 类型；
- 表结构设计时，每个核心业务表，推荐设计一个 `last_modify_date` 的字段，用以记录每条记录的最后修改时间。


## MySQL类型float double decimal的区别 
float数值类型用于表示单精度浮点数值，而double数值类型用于表示双精度浮点数值，
float和double都是浮点型，而decimal是定点型；

MySQL 浮点型和定点型可以用类型名称后加（M,D）来表示，
- M表示该值的总共长度，D表示小数点后面的长度，
- M和D又称为精度和标度，如float(7,4), 可显示为-999.9999，
- MySQL保存值时进行四舍五入，如果插入999.00009，则结果为999.0001。

> - 精度：指数字的位数。 例如：数 123.45 的精度是 5
> - 标度：指小数点后的数字位数。 例如：数 123.45 的标度是 2。

☆FLOAT和DOUBLE在不指 定精度时，默认会按照实际的精度来显示，而DECIMAL在不指定精度时，默认整数为10，小数为0。

测试1：
```sql
CREATE TABLE test1 (
f FLOAT(5,2) DEFAULT NULL,
d DOUBLE(5,2) DEFAULT NULL,
de DECIMAL(5,2) DEFAULT NULL
);
```
测试1:
```sql
INSERT INTO test1(f,d,de) VALUES(1.23,1.23,1.23);
```
数据插入正确：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182540.png)

测试2:
```sql
INSERT INTO test1(f,d,de) VALUES(1.234,1.234,1.23);
```
数据插入都正确，但是f和d由于标度的限制，舍去了最后一位。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182549.png)

测试3.
```sql
INSERT INTO test1(f,d,de) VALUES(1.234,1.234,1.234);
```
插入成功,但是有警告

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182600.png)

测试4:
把f，d,de的精度和标度去掉。
```sql
INSERT INTO test1(f,d,de) VALUES(1.234,1.234,1.234);
```
插入正确【f和d的数据正确插入，而de被截断】，同时也会有3一样的提示！
浮点数如果不写精度和标度，则会按照实际显示，如果有精度和标度，则会将数据四舍五入后插入，系统不报错，定点数如果不设置精度和标度，刚按照默认的（10,0）进行操作，如果数据超过了精度和标度值，则会警告!

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182612.png)


测试5：
数据求SUM()时会出现不同的结果，float和double求SUM都会出现很多小数点，而decimal求SUM得到的是精准数值：
```sql
SELECT SUM(f),SUM(d),SUM(de) FROM test1;
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182622.png)

测试6：
float列类型默认长度查不到结果，必须指定精度
```sql
SELECT * FROM test1  WHERE f = 1.234;
```
查不到任何一列。


# 常见函数
## 日期函数
**datediff()函数**
MySQL DATEDIFF函数计算两个DATE，DATETIME或TIMESTAMP值之间的天数。
MySQL DATEDIFF函数的语法如下：
```sql
datediff(date_expression_1,date_expression_2);
```
DATEDIFF函数接受两个任何有效日期或日期时间值的参数。如果您传递DATETIME或TIMESTAMP值，则DATEDIFF函数仅将日期部分用于计算，并忽略时间部分。
```sql
mysql> SELECT DATEDIFF('2017-08-17','2017-08-08');
+-------------------------------------+
| DATEDIFF('2017-08-17','2017-08-08') |
+-------------------------------------+
|                                   9 |
+-------------------------------------+
```

**year(date)**
返回日期的年份，范围为1000〜9999，或者0日期。
```sql
mysql> SELECT YEAR('98-02-03');
+---------------------------------------------------------+
| YEAR('98-02-03')                                        |
+---------------------------------------------------------+
| 1998                                                    |
+---------------------------------------------------------+
```

# 4 Ways to Replace NULL with a Different Value in MySQL
In MySQL, sometimes you don’t want NULL values to be returned as NULL. Sometimes you want NULL values to be returned with a different value, such as “N/A”, “Not Applicable”, “None”, or even the empty string “”.

Fortunately there are several ways to do this in MySQL.

Here are four:
- The `IFNULL()` function
- The `COALESCE()` function
- The `IF()` function combined with the IS NULL (or IS NOT NULL) operator
- The `CASE` expression combined with the `IS NULL` (or `IS NOT NULL`) operator
Examples of these options are below.

## Sample Data
First, let’s grab some sample data:
```sql
USE Solutions;
SELECT TaskCode
From Tasks;
```
Result:
```
+----------+
| TaskCode |
+----------+
| gar123   |
| NULL     |
| NULL     |
| dog456   |
| NULL     |
| cat789   |
+----------+
```
So we have three NULL values and three `non-NULL` values.

## The IFNULL() Function
Given its name, this is probably the most obvious option for replacing NULL values in MySQL. This function is basically the equivalent of `ISNULL()` in SQL Server.

The `IFNULL()` function allows you to provide two arguments. The first argument is returned only if it is not NULL. If it is NULL, then the second argument is returned instead.

Here’s an example of using `IFNULL()` against our sample data set:
```sql
SELECT IFNULL(TaskCode, 'N/A') AS Result 
FROM Tasks;
```
Result:

```
+--------+
| Result |
+--------+
| gar123 |
| N/A    |
| N/A    |
| dog456 |
| N/A    |
| cat789 |
+--------+
```
Here, we simply replaced NULL values with N/A.

## The COALESCE() Function
This function is similar to the `IFNULL()` function, but slightly different. This function adheres to the ANSI  SQL standard, and it is widely deployed across various RDBMSs .

The way it works is, you provide as many arguments as you need. `COALESCE()` will then return the first `non-NULL` value in the list, or NULL if there are no `non-NULL` values.

Like this:
```sql
SELECT COALESCE(TaskCode, 'N/A') AS Result 
FROM Tasks;
```
Result:
```
+--------+
| Result |
+--------+
| gar123 |
| N/A    |
| N/A    |
| dog456 |
| N/A    |
| cat789 |
+--------+
```
So we get exactly the same result as previously.

However, the difference with this function is that, as mentioned, you can provide a list of arguments. The `COALESCE()` function will take whichever is the first non-NULL value.

So for example, we could add `NULL` as the first argument and place `None` before `N/A` and look what happens:

```sql
SELECT COALESCE(NULL, TaskCode, 'None', 'N/A') AS Result 
FROM Tasks;
```

Result:
```
+--------+
| Result |
+--------+
| gar123 |
| None   |
| None   |
| dog456 |
| None   |
| cat789 |
+--------+
```
It skipped the first `NULL` as expected, then it skipped any NULL values in the `TaskCode` column, before settling on `None`.  The `N/A` value didn’t get used in this case because `None` came first and it’s a non-NULL value.


## The IF() Function Combined with IS NULL/IS NOT NULL
The `IS NULL` and `IS NOT NULL` operators allow you to test for NULL values, and present a different value depending on the outcome.

We can use these operators inside the `IF()` function, so that non-NULL values are returned, and NULL values are replaced with a value of our choosing.

Example:
```sql
SELECT IF(TaskCode IS NOT NULL, TaskCode, 'N/A') AS Result 
FROM Tasks;
```

Result:
```
+--------+
| Result |
+--------+
| gar123 |
| N/A    |
| N/A    |
| dog456 |
| N/A    |
| cat789 |
+--------+
```
So the same result as with the `IFNULL()` and `COALESCE()` functions.

And of course, we could swap `IS NOT NULL` with `IS NULL`. If we do that, we would need to swap the subsequent arguments too:

```sql
SELECT IF(TaskCode IS NULL, 'N/A', TaskCode) AS Result 
FROM Tasks;
```

## The CASE Expression Combined with IS NULL/IS NOT NULL
Another way to do it is to use the `CASE` expression:
```sql
SELECT 
    CASE 
        WHEN TaskCode IS NOT NULL THEN TaskCode 
        ELSE 'N/A' 
    END AS Result
FROM Tasks;
```
Result:
```
+--------+
| Result |
+--------+
| gar123 |
| N/A    |
| N/A    |
| dog456 |
| N/A    |
| cat789 |
+--------+
```
As with the previous example, this could be rewritten to use `IS NULL` instead of `IS NOT NULL`:
```
SELECT 
    CASE 
        WHEN TaskCode IS NULL THEN 'N/A' 
        ELSE TaskCode 
    END AS Result
FROM Tasks;
```

# MySQL的语句执行顺序
sql执行顺序：
- from 
- join 
- on 
- where 
- group by (开始使用select中的别名，后面的语句中都可以使用)
- over()
- avg,sum.... 
- having 
- select 
- distinct 
- order by
- limit 

从这个顺序中我们不难发现，所有的 查询语句都是从from开始执行的，在执行过程中，<font color='red'>每个步骤都会为下一个步骤生成一个`虚拟表`</font>，这个虚拟表将作为下一个执行步骤的输入。 

第一步：首先对from子句中的前两个表执行一个笛卡尔乘积，此时生成虚拟表vt1（选择相对小的表做基础表）。 
第二步：接下来便是应用on筛选器，on 中的逻辑表达式将应用到 vt1 中的各个行，筛选出满足on逻辑表达式的行，生成虚拟表 vt2 。
第三步：如果是inner join，则直接到第4步。 如果是outer join 那么这一步就将添加外部行，left outer jion 就把左表在第二步中过滤的行添加进来，如果是right outer join 那么就将右表在第二步中过滤掉的行添加进来，这样生成虚拟表vt3 。
第四步：如果 from 子句中的表数目多余两个表，那么就将vt3和第三个表连接从而计算笛卡尔乘积，生成虚拟表，该过程就是一个重复1-3的步骤，最终得到一个新的虚拟表 vt3。 
第五步：应用where筛选器，对上一步生产的虚拟表引用where筛选器，生成虚拟表vt4。on和where的最大区别在于，如果在on应用逻辑表达式那么在第三步outer join中还可以把移除的行再次添加回来，而where的移除的最终的。
第六步：group by 子句将中的唯一的值组合成为一组，得到虚拟表vt5。如果应用了group by，<font color='red'>那么后面的所有步骤与聚合函数(count、sum、avg等)与开窗函数都只能对vt5操作。</font>原因在于最终的结果集中只为每个组包含一行。这一点请牢记。 
第七步：应用cube或者rollup选项，为vt5生成超组，生成vt6. 
第八步：应用having筛选器，生成vt7。having筛选器是第一个也是为唯一一个应用到已分组数据的筛选器。
第九步：处理select子句。将vt7中的在select中出现的列筛选出来。生成vt8. 
第十步：应用distinct子句，vt8中移除相同的行，生成vt9。事实上如果应用了group by子句那么distinct是多余的，原因同样在于，分组的时候是将列中唯一的值分成一组，同时只为每一组返回一行记录，那么所以的记录都将是不相同的。 
第十一步：应用order by子句。按照order_by_condition排序vt9，此时返回的一个游标，而不是虚拟表。sql是基于集合的理论的，集合不会预先对他的行排序，它只是成员的逻辑集合，成员的顺序是无关紧要的。对表进行排序的查询可以返回一个对象，这个对象包含特定的物理顺序的逻辑组织。这个对象就叫游标。正因为返回值是游标，那么使用order by 子句查询不能应用于表表达式。排序是很需要成本的，除非你必须要排序，否则最好不要指定order by，最后，在这一步中是第一个也是**唯一一个**可以使用select列表中别名的步骤。 
第十二步：应用top选项。此时才返回结果给请求者即用户。 

**注：如果一个操作需要操作虚拟表5，而现在没有虚拟表5，则他会找最近生成的一个虚拟表**

# 窗口函数
环境搭建
```sql
create table business(
  name varchar(10) not null,
  orderdate varchar(30) not null,
  cost int(5) not null
)

insert into business (name, orderdate, cost) values("jack","2017-01-01",10)$
insert into business (name, orderdate, cost) values("tony","2017-01-02",15)$
insert into business (name, orderdate, cost) values("jack","2017-02-03",23)$
insert into business (name, orderdate, cost) values("tony","2017-01-04",29)$
insert into business (name, orderdate, cost) values("jack","2017-01-05",46)$
insert into business (name, orderdate, cost) values("jack","2017-04-06",42)$
insert into business (name, orderdate, cost) values("tony","2017-01-07",50)$
insert into business (name, orderdate, cost) values("jack","2017-01-08",55)$
insert into business (name, orderdate, cost) values("mart","2017-04-08",62)$
insert into business (name, orderdate, cost) values("mart","2017-04-09",68)$
insert into business (name, orderdate, cost) values("neil","2017-05-10",12)$
insert into business (name, orderdate, cost) values("mart","2017-04-11",75)$
insert into business (name, orderdate, cost) values("neil","2017-06-12",80)$
insert into business (name, orderdate, cost) values("mart","2017-04-13",94)$
```

**开窗函数使聚合函数发生的变化有如下2个**
- 开窗函数会使得聚合函数对分组或没分组后的表的每行数据都执行一次，而不是每个组执行一次

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182632.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182640.png)

- 首先，开窗函数相当于重新赋予聚合函数所要操作的数据集的范围(窗口范围)，且窗口范围可能会随着行的变化而变化

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182648.png)

需求一：查询在2017年4月份购买过的顾客及总人数

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182658.png)

**设置分区**
`over(partition by 属性名1，属性名2...)`

当没有设置分区时，则默认分区是整个表

需求：查询顾客的购买明细即购买总额

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182705.png)

需求: 查询顾客的购买明细及月购买总额

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182719.png)

**分区内部排序**
`over(order by 属性名 [desc])`
> 注：
当order by指定时，但没有指定窗口范围，则默认的窗口范围是从分区的起点到当前行,即默认是`rows between unbounded preceding and current row`
当既没有使用order by, 也没有指定窗口范围时，则默认的窗口范围是分区的起点到终点，即默认是`rows between unbounded preceding and unbounded following`

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182737.png)

<font color="red">分区与窗口范围是不同的, 窗口范围是指的聚合函数能使用一个分区中的哪些数据</font>

需求：
查询顾客的购买明细且将每个顾客的cost按照日期进行累加

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182749.png)

**注：order by相同值问题**
当使用`over(order by age)`, 则会把age相同的多行数据看成同一行数据
如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182758.png)

**设置窗口范围**
语法: `rows between 行1 and 行2`
- `current row`: 当前行
- `n preceding`: 往前n行数据
- `n following`: 往后n行数据
- `unbounded preceding`: 表示从前面的起点
- `unbounded following`: 表示从后面的终点

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182807.png)

注：
`over()`中如果`oder by`关键字与`rows`关键字同时出现，则`rows`关键字**必须**要在`order by`关键值后面

**获取分区中指定行的数据**
- `lag(列名, n, [默认值])`: 获取指定列的往前第n行数据，如果没有，则用设置的默认值
- `lead(列名, n, [默认值])`: 获取指定列的往后第n行数据，如果没有，则用设置的默认值
- `ntile(n)`: 将分区分成n个组，各个组有编号，编号从1开始，对于每一行，ntile返回此行所属的组的编号。注意：n必须为int类型

上面的函数必要要与开窗函数over()一起使用。

需求：查询每个顾客上次的购买时间

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182816.png)

需求：查询前20%时间的订单信息

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182826.png)

## 排名函数
<font color='red'>必须要与over()一起使用</font>

三大排名函数：
- rank()：排序相同时会重复，总数不会变
- dense_rank()：排序相同时会重复，总数会减少
- row_number()：会根据顺序计算

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182837.png)

# MySQL UNION 操作符
MySQL UNION 操作符用于连接两个以上的 SELECT 语句的结果组合到一个结果集合中。多个 SELECT 语句会删除重复的数据。

## 语法
MySQL UNION 操作符语法格式：
```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
UNION [ALL | DISTINCT]
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```
- expression1, expression2, ... expression_n: 要检索的列。
- tables: 要检索的数据表。
- WHERE conditions: 可选， 检索条件。
- DISTINCT: 可选，删除结果集中重复的数据。默认情况下 UNION 操作符已经删除了重复数据，所以 DISTINCT 修饰符对结果没啥影响。
- ALL: 可选，返回所有结果集，包含重复数据。

## 演示数据库
在本教程中，我们将使用 RUNOOB 样本数据库。
下面是选自 "Websites" 表的数据：
```sql
mysql> SELECT * FROM Websites;
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+
```
下面是 "apps" APP 的数据：
```sql
mysql> SELECT * FROM apps;
+----+------------+-------------------------+---------+
| id | app_name   | url                     | country |
+----+------------+-------------------------+---------+
|  1 | QQ APP     | http://im.qq.com/       | CN      |
|  2 | 微博 APP | http://weibo.com/       | CN      |
|  3 | 淘宝 APP | https://www.taobao.com/ | CN      |
+----+------------+-------------------------+---------+
3 rows in set (0.00 sec)
```

## SQL UNION 实例
下面的 SQL 语句从 "Websites" 和 "apps" 表中选取所有不同的country（只有不同的值）：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182848.png)
注释：UNION 不能用于列出两个表中所有的country。如果一些网站和APP来自同一个国家，每个国家只会列出一次。UNION 只会选取不同的值。请使用 UNION ALL 来选取重复的值！

## SQL UNION ALL 实例
下面的 SQL 语句使用 UNION ALL 从 "Websites" 和 "apps" 表中选取所有的country（也有重复的值）：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182857.png)

## 带有 WHERE 的 SQL UNION ALL
下面的 SQL 语句使用 UNION ALL 从 "Websites" 和 "apps" 表中选取所有的中国(CN)的数据（也有重复的值）：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182909.png)

# Mysql中使用count加条件统计
## 前言
最近发现在处理Mysql问题时，count()函数频繁上镜，常常出现在分组统计的情景下，但是有时候并不是使用group by分好组就可以直接统计了，比如说一个常见的需求，统计每个班级男生所占的比例，这种情况一般会按照班级分组，但是分组内不但要统计班级的人数，还要统计男生的人数，也就是说统计是有条件的，之前确实没有考虑过怎样实心，后来查询了资料，总结在这里，方便日后查找使用。
Mysql中count()函数的一般用法是统计字段非空的记录数，所以可以利用这个特点来进行条件统计，注意这里如果字段是NULL就不会统计，但是false是会被统计到的，记住这一点，我们接下来看看几种常见的条件统计写法。

## 准备工作
新建一个Mysql数据表a，包含id和num两个字段
```sql
mysql> create table a(id int, num int);
Query OK, 0 rows affected (0.04 sec)
```
插入测试数据，为了看count()函数的效果，我们插入两个空数据
```sql
mysql> insert into a values (1,100),(2,200),(3,300),(4,300),(8,null),(9,null);
Query OK, 6 rows affected (0.01 sec)
Records: 6  Duplicates: 0  Warnings: 0
```
查询表a中的数据，与后面的统计做比较
```sql
mysql> select * from a;
+----+------+
| id | num  |
+----+------+
|  1 |  100 |
|  2 |  200 |
|  3 |  300 |
|  4 |  300 |
|  8 | NULL |
|  9 | NULL |
+----+------+
6 rows in set (0.09 sec)
```
调用count()函数看效果，如果使用`count(*)`会查询出所有的记录数，但如果使用count(num)发现只有4条数据，num为NULL的记录并没有统计上
```sql
mysql> select count(*) from a;
+----------+
| count(*) |
+----------+
|        6 |
+----------+
1 row in set (0.03 sec)

mysql> select count(num) from a;
+------------+
| count(num) |
+------------+
|          4 |
+------------+
1 row in set (0.04 sec)
```

## 条件统计
count()函数中使用条件表达式加or null来实现，作用就是当条件不满足时，函数变成了count(null)不会统计数量
```sql
mysql> select count(num > 200 or null) from a;
+--------------------------+
| count(num > 200 or null) |
+--------------------------+
|                        2 |
+--------------------------+
1 row in set (0.22 sec)
```
count()函数中使用if表达式来实现，当条件满足是表达式的值为非空，条件不满足时表达式值为NULL;
```sql
mysql> select count(if(num > 200, 1, null)) from a;
+-------------------------------+
| count(if(num > 200, 1, null)) |
+-------------------------------+
|                             2 |
+-------------------------------+
1 row in set (0.05 sec)
```
count()函数中使用case when表达式来实现，当条件满足是表达式的结果为非空，条件不满足时无结果默认为NULL;
```sql
mysql> select count(case when num > 200 then 1 end) from a;
+---------------------------------------+
| count(case when num > 200 then 1 end) |
+---------------------------------------+
|                                     2 |
+---------------------------------------+
1 row in set (0.07 sec)
```
## 总结
使用count()函数实现条件统计的基础是对于值为NULL的记录不计数，常用的有以下三种方式，假设统计num大于200的记录
```sql
select count(num > 200 or null) from a;
select count(if(num > 200, 1, null)) from a
select count(case when num > 200 then 1 end) from a
```

# mysql中any_value()函数
对于如下mysql语句:
```sql
SELECT 
    province_code,
    province_name
FROM t_mip_base_area
GROUP BY province_code
```
则报：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220223170445.png)

总结：
1. MySQL5.7之后，sql_mode中ONLY_FULL_GROUP_BY模式默认设置为打开状态。
2. ONLY_FULL_GROUP_BY的语义就是确定select target list中的所有列的值都是明确语义，简单的说来，在此模式下，target list中的值要么是来自于聚合函数（sum、avg、max等）的结果，要么是来自于group by list中的表达式的值
3. MySQL提供了any_value()函数来抑制ONLY_FULL_GROUP_BY值被拒绝
4. any_value()会选择被分到同一组的数据里第一条数据的指定列值作为返回数据

正确写法：
```sql
SELECT 
    province_code,
    any_value(province_name)
FROM t_mip_base_area
GROUP BY province_code
```

# 索引
MySQL官方对索引的定义为：索引（index）是帮助MySQL高效获取数据的数据结构（有序）。在数据之外，数据库系统还维护者满足特定查找算法的数据结构，这些数据结构以某种方式引用（指向）数据， 这样就可以在这些数据结构上实现高级查找算法，这种数据结构就是索引。如下面的==示意图==所示 : 

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182920.png)

左边是数据表，一共有两列七条记录，最左边的是数据记录的物理地址（注意逻辑上相邻的记录在磁盘上也并不是一定物理相邻的）。为了加快Col2的查找，可以维护一个右边所示的二叉查找树，每个节点分别包含索引键值和一个指向对应数据记录物理地址的指针，这样就可以运用二叉查找快速获取到相应数据。
一般来说索引本身也很大，不可能全部存储在内存中，因此索引往往以索引文件的形式存储在磁盘上。索引是数据库中用来提高性能的最常用的工具。

**索引优势劣势**
优势
- 类似于书籍的目录索引，提高数据检索的效率，降低数据库的IO成本。
- 通过索引列对数据进行排序，降低数据排序的成本，降低CPU的消耗。

劣势
- 实际上索引也是一张表，该表中保存了主键与索引字段，并指向实体类的记录，所以索引列也是要占用空间的。
- 虽然索引大大提高了查询效率，同时却也降低更新表的速度，如对表进行INSERT、UPDATE、DELETE。因为更新表时，MySQL 不仅要保存数据，还要保存一下索引文件每次更新添加了索引列的字段，都会调整因为更新所带来的键值变化后的索引信息。

**索引结构**
索引是在MySQL的存储引擎层中实现的，而不是在服务器层实现的。所以每种存储引擎的索引都不一定完全相同，也不是所有的存储引擎都支持所有的索引类型的。MySQL目前提供了以下4种索引：
- BTREE 索引 ： 最常见的索引类型，大部分索引都支持 B 树索引。
- HASH 索引：只有Memory引擎支持 ， 使用场景简单 。
- R-tree 索引（空间索引）：空间索引是MyISAM引擎的一个特殊索引类型，主要用于地理空间数据类型，通常使用较少，不做特别介绍。
- Full-text （全文索引） ：全文索引也是MyISAM的一个特殊索引类型，主要用于全文索引，InnoDB从Mysql5.6版本开始支持全文索引。

MyISAM、InnoDB、Memory三种存储引擎对各种索引类型的支持

| 索引        | InnoDB引擎      | MyISAM引擎 | Memory引擎 |
| ----------- | --------------- | ---------- | ---------- |
| BTREE索引   | 支持            | 支持       | 支持       |
| HASH 索引   | 不支持          | 不支持     | 支持       |
| R-tree 索引 | 不支持          | 支持       | 不支持     |
| Full-text   | 5.6版本之后支持 | 支持       | 不支持     |

我们平常所说的索引，如果没有特别指明，都是指B+树（多路搜索树，并不一定是二叉的）结构组织的索引。其中聚集索引、复合索引、前缀索引、唯一索引默认都是使用 B+tree 索引，统称为 索引。

**索引类型**
- 普通索引：这是最基本的索引类型，而且它没有唯一性之类的限制
- 唯一性索引：这种索引和前面的“普通索引”基本相同，但有一个区别：索引列的所有值都只能出现一次，即必须唯一。创建索引时指定unique即可创建唯一性索引

**主键始终被索引。对于MyISAM和InnoDB，这是相同的，并且通常对所有支持索引的存储引擎都是如此。**

**索引分类**
- 单值索引 ：即一个索引只包含单个列，一个表可以有多个单列索引
- 复合索引 ：即一个索引包含多个列

## 索引语法
索引在创建表的时候，可以同时创建， 也可以随时增加新的索引。
准备环境:
```SQL
create database demo_01 default charset=utf8mb4;

use demo_01;

CREATE TABLE city (
  city_id int(11) NOT NULL AUTO_INCREMENT,
  city_name varchar(50) NOT NULL,
  country_id int(11) NOT NULL,
  PRIMARY KEY (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE country(
  country_id int(11) NOT NULL AUTO_INCREMENT,
  country_name varchar(100) NOT NULL,
  PRIMARY KEY (country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


insert into city (city_id, city_name, country_id) values(1,'西安',1);
insert into city (city_id, city_name, country_id) values(2,'NewYork',2);
insert into city (city_id, city_name, country_id) values(3,'北京',1);
insert into city (city_id, city_name, country_id) values(4,'上海',1);

insert into country (country_id, country_name) values(1,'China');
insert into country (country_id, country_name) values(2,'America');
insert into country (country_id, country_name) values(3,'Japan');
insert into country (country_id, country_name) values(4,'UK');
```

**创建索引**
语法 ： 	
```sql
create 	[UNIQUE|FULLTEXT|SPATIAL]  index 索引名
[USING  索引结构(例如BTREE)]
on 表名(列名,...)
index_col_name : column_name[(length)][ASC | DESC]
```

示例 ： 为city表中的city_name字段创建索引 ；

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182936.png)
​	

**查看索引**
语法： 
```sql
show index from  表名;
```
示例：查看city表中的索引信息；

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182947.png)


**删除索引**
语法 ：
```sql
DROP INDEX 索引名 ON 表名;
```
示例 ： 想要删除city表上的索引idx_city_name，可以操作如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408182956.png)

**修改索引**
```sql
alter  table  表名  add  [unique|index|fulltext] 索引名(列名);
添加[unique|index|fulltext]索引

alter index 旧索引名 rename to 新索引名
重命名索引名
```

# 视图
​视图（View）是一种虚拟存在的表。视图并不在数据库中实际存在，行和列数据来自定义视图的查询中使用的表，并且是在使用视图时动态生成的。通俗的讲，视图就是一条SELECT语句执行后返回的结果集。所以我们在创建视图的时候，主要的工作就落在创建这条SQL查询语句上。

视图相对于普通的表的优势主要包括以下几项。
- 简单：使用视图的用户完全不需要关心后面对应的表的结构、关联条件和筛选条件，对用户来说已经是过滤好的复合条件的结果集。
- 安全：使用视图的用户只能访问他们被允许查询的结果集，对表的权限管理并不能限制到某个行某个列，但是通过视图就可以简单的实现。
- 数据独立：一旦视图的结构确定了，可以屏蔽表结构变化对用户的影响，源表增加列对视图没有影响；源表修改列名，则可以通过修改视图来解决，不会造成对访问者的影响。

**创建或者修改视图**
创建视图的语法为：
```sql
CREATE [OR REPLACE] [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
VIEW view_name [(column_list)]
AS select_statement
[WITH [CASCADED | LOCAL] CHECK OPTION]
```

修改视图的语法为：
```sql
ALTER [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
VIEW view_name [(column_list)]
AS select_statement
[WITH [CASCADED | LOCAL] CHECK OPTION]
```
```
选项 : 
	WITH [CASCADED | LOCAL] CHECK OPTION 决定了是否允许更新数据使记录不再满足视图的条件。
	LOCAL ： 只要满足本视图的条件就可以更新。
	CASCADED ： 必须满足所有针对该视图的所有视图的条件才可以更新。 默认值.
```

示例 , 创建city_country_view视图 , 执行如下SQL : 
```sql
create or replace view city_country_view 
as 
select t.*,c.country_name from country c , city t where c.country_id = t.country_id;
```

查询视图 : 

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183006.png)

**查看视图**
​	从 MySQL 5.1 版本开始，使用 SHOW TABLES 命令的时候不仅显示表的名字，同时也会显示视图的名字，而不存在单独显示视图的 SHOW VIEWS 命令。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183017.png)

同样，在使用 SHOW TABLE STATUS 命令的时候，不但可以显示表的信息，同时也可以显示视图的信息。	

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183028.png)

如果需要查询某个视图的定义，可以使用 SHOW CREATE VIEW 命令进行查看 ： 

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183038.png)

**删除视图**
语法 : 
```sql
DROP VIEW [IF EXISTS] view_name [, view_name] ...[RESTRICT | CASCADE]	
```
示例 , 删除视图city_country_view :
```sql
DROP VIEW city_country_view ;
```

#  select语句中case when例子介绍
实例二：
```sql
SELECT
    CASE parent_id
WHEN 0 THEN
    '00'
WHEN 1 THEN
    '11'
ELSE
    'OTHERS'
END AS parent_id_new ,
parent_id ,
type_id ,
type_name
FROM
    tdb_goods_types
```

实例一：
```sql
SELECT
    CASE
WHEN parent_id < 3 THEN
    '<3'
WHEN parent_id >= 3
AND parent_id < 5 THEN
    '>=3 && <5'
ELSE
    '>=5'
END AS parent_id_new ,
parent_id ,
type_id ,
type_name
FROM
    tdb_goods_types
```


# 过程化sql
## 变量
过程sql中的变量可分为如下两类：
- 系统变量：全局变量、会话变量; 
- 自定义变量：用户变量、局部变量;  

### 系统变量
- 查看所有的系统变量：`show [global|session] variables`
- 查看满足条件的部分系统变量：`show [global|session] variables like '%char%'`
- 查看指定的某个系统变量：`show [@@global|session].系统变量名`
- 为某个系统变量赋值
  - `set [global|session] 系统变量名 = 值`
  - `set [@@global|session].系统变量名 = 值` 

全局变量作用域：服务器每次启动时将所有的全局变量赋初始值，针对于所有的会话有效，但不能跨重启

### 自定义变量
**用户变量**
使用用户变量时，需要加@，且一个变量加了@, 则表示该变量为用户变量

- 作用域：针对于当前会话有效
- 声明：`set @用户变量名=值`， `set @用户变量名:=值`， `select @用户变量名:=值`
- 赋值：可用声明的方式来赋值， 或者`select 字段 into @变量名 from 表名`
- 查值: `select @用户变量`

**用户变量的高级使用**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183047.png)

**局部变量**
- 作用域：仅仅在定义它的begin end中有效，并且应声明在begin end中的第一句
- 声明：
  - `declare 变量名 类型`
  - `declare 变量名 类型 default 值`
- 赋值:
  - `set 局部变量名=值`
  - `set 局部变量名:=值`
  - `select 字段 into 局部变量名 from 表名`
- 查值: `select 局部变量名`

<font color='red'>注意自定义变量赋值符号，使用set时可以用“=”或“：=”，但是使用select时必须用“：=赋值”</font>


## IF语句
语法结构 : 
```sql
if 条件 then
     sql语句
elseif 条件 then
     sql语句
else
     sql语句	
end if;
```
需求： 
```
根据定义的身高变量，判定当前身高的所属的身材类型 
	180 及以上 ----------> 身材高挑
	170 - 180  ---------> 标准身材
	170 以下  ----------> 一般身材
```
示例 : 
```sql
create procedure pro_test6()
begin
  declare  height  int  default  175; 
  declare  description  varchar(50);
  
  if  height >= 180  then
    set description = '身材高挑';
  elseif height >= 170 and height < 180  then
    set description = '标准身材';
  else
    set description = '一般身材';
  end if;
  
  select description ;
end$
```

## case结构
语法结构 : 
```SQL
方式一 : 
CASE 变量名
  WHEN 值1 THEN sql语句
  WHEN 值2 THEN sql语句
  ELSE sql语句
END CASE;

方式二 : 
CASE
  WHEN 条件 THEN sql语句
  WHEN 条件 THEN sql语句
  ELSE sql语句
END CASE;
```

需求:
```
给定一个月份, 然后计算出所在的季度
```
示例  :
```sql
create procedure pro_test9(month int)
begin
  declare result varchar(20);
  case 
    when month >= 1 and month <=3 then 
      set result = '第一季度';
    when month >= 4 and month <=6 then 
      set result = '第二季度';
    when month >= 7 and month <=9 then 
      set result = '第三季度';
    when month >= 10 and month <=12 then 
      set result = '第四季度';
  end case;
  
  select concat('您输入的月份为 :', month , ' , 该月份为 : ' , result) as content ;
end$
```

## while循环
语法结构: 
```sql
while 条件 do
	sql语句
end while;
```
需求:
```
计算从1加到n的值
```
示例  : 
```sql
create procedure pro_test8(n int)
begin
  declare total int default 0;
  declare num int default 1;
  while num<=n do
    set total = total + num;
	set num = num + 1;
  end while;
  select total;
end$
```

## repeat结构
有条件的循环控制语句, 当满足条件的时候退出循环 。while 是满足条件才执行，repeat 是满足条件就退出循环。
语法结构 : 
```SQL
REPEAT
  sql语句
  UNTIL 条件
END REPEAT;
```

需求: 
```
计算从1加到n的值
```

示例  : 
```sql
create procedure pro_test10(n int)
begin
  declare total int default 0;
  
  repeat 
    set total = total + n;
    set n = n - 1;
    until n=0  
  end repeat;
  
  select total ;
end$
```

## loop语句
LOOP 实现简单的循环，退出循环的条件需要使用其他的语句定义，通常可以使用 LEAVE 语句实现，具体语法如下：
```sql
[标签:] LOOP
  sql语句
END LOOP [标签]
```
如果不在 statement_list 中增加`leave 标签`的语句，那么 LOOP 语句可以用来实现简单的死循环。

## leave语句

用来从标注的流程构造中退出，通常和 BEGIN ... END 或者循环一起使用。下面是一个使用 LOOP 和 LEAVE 的简单例子 , 退出循环：
```SQL
CREATE PROCEDURE pro_test11(n int)
BEGIN
  declare total int default 0;
  
  ins: LOOP
    
    IF n <= 0 then
      leave ins;
    END IF;
    
    set total = total + n;
    set n = n - 1;
  	
  END LOOP ins;
  
  select total;
END$
```


# 存储过程和函数
存储过程和函数是  事先经过编译并存储在数据库中的一段 SQL 语句的集合，调用存储过程和函数可以简化应用开发人员的很多工作，减少数据在数据库和应用服务器之间的传输，对于提高数据处理的效率是有好处的。	
存储过程和函数的区别在于函数必须有返回值，而存储过程没有。
-	函数 ：必须要指定返回类型
-	过程 ：没有指定返回类型的函数

## 创建存储过程
```sql
CREATE PROCEDURE 过程名 (参数...)
begin
	-- SQL语句
end ;
```
注：mysql不支持如下创建存储过程方式
```sql
create or replace 过程名(参数...)
begin
	-- SQL语句
end ;
```

示例 ：
```sql 
delimiter $

create procedure pro_test1()
begin
	select 'Hello Mysql' ;
end$
```
`delimiter`的作用：该关键字用来声明SQL语句的分隔符 , 告诉 MySQL 解释器，该段命令是否已经结束了，mysql是否可以执行了。默认情况下，delimiter是分号;。在命令行客户端中，如果有一行命令以分号结束，那么回车后，mysql将会执行该命令。

## 调用存储过程
```sql
call procedure_name() ;	
```

## 查看存储过程

```sql
-- 查询db_name数据库中的所有的存储过程
select name from mysql.proc where db='db_name';

-- 查询存储过程的状态信息
show procedure status;

-- 查询某个存储过程的定义
show create procedure test.pro_test1 \G;
```

## 删除存储过程
```sql
DROP PROCEDURE  [IF EXISTS] sp_name ；
```

目前，MySQL还不提供对已存在的存储过程的代码修改

## 传递参数
语法格式 : 
```
create procedure 过程名([in/out/inout] 参数名   参数类型)
...


IN :   该参数可以作为输入，也就是需要调用方传入值 , 默认
OUT:   该参数作为输出，也就是该参数可以作为返回值
INOUT: 既可以作为输入参数，也可以作为输出参数
```

**IN - 输入**
需求 :
```
根据定义的身高变量，判定当前身高的所属的身材类型 
```

示例  : 
```sql
create procedure pro_test5(in height int)
begin
    declare description varchar(50) default '';
  if height >= 180 then
    set description='身材高挑';
  elseif height >= 170 and height < 180 then
    set description='标准身材';
  else
    set description='一般身材';
  end if;
  select concat('身高 ', height , '对应的身材类型为:',description);
end$
```
**OUT-输出**
需求 :
```
根据传入的身高变量，获取当前身高的所属的身材类型  
```

示例:
```SQL 
create procedure pro_test5(in height int , out description varchar(100))
begin
  if height >= 180 then
    set description='身材高挑';
  elseif height >= 170 and height < 180 then
    set description='标准身材';
  else
    set description='一般身材';
  end if;
end$	
```

调用:
```
call pro_test5(168, @description)$

select @description$
```


## 游标/光标
游标是用来存储查询结果集的数据类型 , 在存储过程和函数中可以使用光标对结果集进行循环的处理。光标的使用包括光标的声明、OPEN、FETCH 和 CLOSE，其语法分别如下。
**声明光标：**
```sql
DECLARE 光标名 CURSOR FOR sql查询语句 ;
```

**OPEN 光标：**
```sql
OPEN 光标名 ;
```

**FETCH 光标：**
获取游标当前指针的记录，并传给指定变量列表,**注意变量数必须与MySQL游标返回的字段数一致， 每执行一次fetch操作，光标就会向下移动一行**
当游标已经指向最后一行时继续执行会造成游标溢出。
```sql
FETCH 光标名 INTO  变量名...
```

**CLOSE 光标：**
```sql
CLOSE 光标名;
```

示例 : 
初始化脚本:
``` sql
create table emp(
  id int(11) not null auto_increment ,
  name varchar(50) not null comment '姓名',
  age int(11) comment '年龄',
  salary int(11) comment '薪水',
  primary key(`id`)
)engine=innodb default charset=utf8 ;

insert into emp(id,name,age,salary) values(null,'金毛狮王',55,3800),(null,'白眉鹰王',60,4000),(null,'青翼蝠王',38,2800),(null,'紫衫龙王',42,1800);
```

``` SQL
-- 查询emp表中数据, 并逐行获取进行展示
create procedure pro_test11()
begin
  declare e_id int(11);
  declare e_name varchar(50);
  declare e_age int(11);
  declare e_salary int(11);
  declare emp_result cursor for select * from emp;
  
  open emp_result;
  
  fetch emp_result into e_id,e_name,e_age,e_salary;
  select concat('id=',e_id , ', name=',e_name, ', age=', e_age, ', 薪资为: ',e_salary);
  
  fetch emp_result into e_id,e_name,e_age,e_salary;
  select concat('id=',e_id , ', name=',e_name, ', age=', e_age, ', 薪资为: ',e_salary);
  
  fetch emp_result into e_id,e_name,e_age,e_salary;
  select concat('id=',e_id , ', name=',e_name, ', age=', e_age, ', 薪资为: ',e_salary);

  close emp_result;
end$
```

**通过循环结构 , 获取游标中的数据**
在MySql中，造成游标溢出时会引发mysql预定义的NOT FOUND错误，所以在上面使用下面的代码指定了当引发not found错误时定义一个continue 的事件，指定这个事件发生时修改done变量的值。
```sql
declare continue HANDLER for not found set done = true;  
```
所以在循环时加上了下面这句代码：
```sql
--判断游标的循环是否结束  
if done then  
    leave read_loop;    --跳出游标循环  
end if;  
```
实例：
```sql
create procedure pro_test12()
begin
  DECLARE id int(11);
  DECLARE name varchar(50);
  DECLARE age int(11);
  DECLARE salary int(11);
  DECLARE has_data int default 1;
  
  DECLARE emp_result CURSOR FOR select * from emp;
  DECLARE EXIT HANDLER FOR NOT FOUND set has_data = 0;
  
  open emp_result;
  
  repeat
    fetch emp_result into id , name , age , salary;
    select concat('id为',id, ', name 为' ,name , ', age为 ' ,age , ', 薪水为: ', salary);
    until has_data = 0
  end repeat;
  
  close emp_result;
end$
```



## 存储函数

语法结构:
``` 
CREATE FUNCTION 函数名([参数名 参数类型 ... ]) 
RETURNS 类型名(如int) 
BEGIN
	...
END;
```

案例 : 
定义一个存储函数, 请求满足条件的总记录数 ;
```SQL
create function count_city(countryId int)
returns int
begin
  declare cnum int ;
  
  select count(*) into cnum from city where country_id = countryId;
  
  return cnum;
end$
```

调用: 
```
select count_city(1);
select count_city(2);
```

# 触发器
触发器是与表有关的数据库对象，指在 insert/update/delete 之前或之后，触发并执行触发器中定义的SQL语句集合。触发器的这种特性可以协助应用在数据库端确保数据的完整性 , 日志记录 , 数据校验等操作 。

使用别名OLD和NEW关键字 来引用触发器中发生变化的记录内容，这与其他的数据库是相似的。现在触发器还只支持行级触发，不支持语句级触发。
| 触发器类型      | NEW 和 OLD的使用                                        |
| --------------- | ------------------------------------------------------- |
| INSERT 型触发器 | NEW 表示将要或者已经新增的数据                          |
| UPDATE 型触发器 | OLD 表示修改之前的数据 , NEW 表示将要或已经修改后的数据 |
| DELETE 型触发器 | OLD 表示将要或者已经删除的数据                          |

## 创建触发器
语法结构 : 
```sql
create trigger 触发器名 
before/after insert/update/delete
on 表名 
[ for each row ]  -- 加上这句话表明为行级触发器
begin
	 sql语句
end;
```

示例 
需求
```
通过触发器记录 emp 表的数据变更日志 , 包含增加, 修改 , 删除 ;
```
首先创建一张日志表 : 
```sql
create table emp_logs(
  id int(11) not null auto_increment,
  operation varchar(20) not null comment '操作类型, insert/update/delete',
  operate_time datetime not null comment '操作时间',
  operate_id int(11) not null comment '操作表的ID',
  operate_params varchar(500) comment '操作参数',
  primary key(`id`)
)engine=innodb default charset=utf8;
```

创建 insert 型触发器，完成插入数据时的日志记录 : 
```sql
create trigger emp_logs_insert_trigger
after insert 
on emp 
for each row 
begin
  insert into emp_logs (id,operation,operate_time,operate_id,operate_params) values(null,'insert',now(),new.id,concat('插入后(id:',new.id,', name:',new.name,', age:',new.age,', salary:',new.salary,')'));	
end $
```

创建 update 型触发器，完成更新数据时的日志记录 : 
``` sql
create trigger emp_logs_update_trigger
after update 
on emp 
for each row 
begin
  insert into emp_logs (id,operation,operate_time,operate_id,operate_params) values(null,'update',now(),new.id,concat('修改前(id:',old.id,', name:',old.name,', age:',old.age,', salary:',old.salary,') , 修改后(id',new.id, 'name:',new.name,', age:',new.age,', salary:',new.salary,')'));                                                                      
end $
```

创建delete 行的触发器 , 完成删除数据时的日志记录 : 
```sql
create trigger emp_logs_delete_trigger
after delete 
on emp 
for each row 
begin
  insert into emp_logs (id,operation,operate_time,operate_id,operate_params) values(null,'delete',now(),old.id,concat('删除前(id:',old.id,', name:',old.name,', age:',old.age,', salary:',old.salary,')'));                                                                      
end $
```

测试：
```sql
insert into emp(id,name,age,salary) values(null, '光明左使',30,3500);
insert into emp(id,name,age,salary) values(null, '光明右使',33,3200);

update emp set age = 39 where id = 3;
delete from emp where id = 5;
```

## 删除触发器
语法结构 : 
```sql
drop trigger [schema_name.]trigger_name
```
如果没有指定 schema_name，默认为当前数据库 。

## 查看触发器
可以通过执行 SHOW TRIGGERS 命令查看触发器的状态、语法等信息。
语法结构 ： 
```
show triggers ；
```

# case函数
case函数，流程控制函数。case函数有两个用法

case函数第一个用法的语法
```sql

case value

when compare_calue1 then result1

when compare_calue2 then result2

...

else result

end
```

case函数用value和后面的compare_value1、compare_value2、…依次进行比较，如果value和指定的compare_value1相等，则返回对应的result1，否则返回else后的result

case函数的第二个用法的语法
```sql

case 

when condition1 then result1

where condition2 then result2

...

else result

end
```

condition返回boolean值的条件表达式

```sql
--id小于3的为初级工程师，3~6为中级工程师，其他为高级工程师 

select name, case

when id<=3 then '初级工程师 '

when id <=6 then '中级工程师 '

else '高级工程师' 

end 

from tableName;
```

# with as用法
## With As介绍
WITH AS短语，也叫做子查询部分（subquery factoring），可以让你做很多事情，定义一个SQL片断，该SQL片断会被整个SQL语句所用到。有的时候，是为了让SQL语句的可读性更高些，也有可能是在UNION ALL的不同部分，作为提供数据的部分。 

特别对于UNION ALL比较有用。因为UNION ALL的每个部分可能相同，但是如果每个部分都去执行一遍的话，则成本太高，所以可以使用WITH AS短语，则只要执行一遍即可。如果WITH AS短语所定义的表名被调用两次以上，则优化器会自动将WITH AS短语所获取的数据放入一个TEMP表里，如果只是被调用一次，则不会。而提示materialize则是强制将WITH AS短语里的数据放入一个全局临时表里。很多查询通过这种方法都可以提高速度。

## WITH AS 语法
```sql
[ WITH <common_table_expression> [ ,n ] ] 
<common_table_expression>::= 
        expression_name [ ( column_name [ ,n ] ) ] 
    AS 
        ( CTE_query_definition ) 
```


## With As使用方法
我们数据库中有两个表，一个商品信息表tbSpXinXi，一个库存表tbSpKc。先看一下两个表的结构：

tbSpXinXi

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210347.png)

tbSpKc

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210406.png)


**我们要实现查商品名称最后一个字为"茶"的库存**

最原始的写法，嵌套一个查询语句：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210430.png)

用变量表名的方法：
```sql
declare @tb table(incode varchar(20))
insert into @tb(incode)
select incode from tbSpXinXi where fname like '%茶'

select * from tbSpKc where incode in (select * from @tb)
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210504.png)

接下来我们就直接换成With As的用法
```sql
with row as 
    (    
    select incode from tbSpXinXi where fname like '%茶'
    )
select * from tbSpKc where incode in (select * from row)
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210535.png)

从上面来看，感觉用With As的语句比最原始的写法好像还麻烦了点，因为我这里举的例子只是为了让大家知道怎么用，使用这个可以组合很多类型。

## With As使用时注意的问题

1. With As后面必须直接跟使用With As的SQL语句（如select、insert、update等），否则，With As将失效。如下面的SQL语句将无法正常使用With As。
```sql
with row as 
    (    
    select incode from tbSpXinXi where fname like '%茶'
    )
select * from tbGysXinXi  -- 加上这句下面的row就失效了 
--使用row必须跟在with row as的后面
select * from tbSpKc where incode in (select * from row)
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210613.png)

2. With As后面也可以跟其他的As，但只能使用一个With，多个With As中间用逗号（,）分隔。
```sql
with xinxi as 
    (    
    select incode,fname from tbSpXinXi where fname like '%茶'
    ),
    kc as 
    (
    select * from tbSpKc where 1=1
    )
    
select * from xinxi a,kc b where a.incode=b.incode
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210642.png)

3. 如果With As的表达式名称与某个数据表或视图重名，则紧跟在该With As后面的SQL语句使用的仍然是With As的名称，当然，后面的SQL语句使用的就是数据表或视图了
```sql
with tbSpKc as 
    (    
    select * from tbSpXinXi where incode='14004015'
    )
select * from tbSpKc  -- 使用了名为tbSpKc的公共表表达式 
select * from tbSpKc  -- 原来的tbSpKc表
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210707.png)

4. With As可以引用自身，也可以引用在同一 WITH 子句中预先定义的 公共表达式。但不允许前向引用。 

5. 不能在 CTE_query_definition 中使用以下子句： 
- COMPUTE 或 COMPUTE BY
- ORDER BY（除非指定了 TOP 子句）
- INTO
- 带有查询提示的 OPTION 子句
- FOR XML
- FOR BROWSE

6. 如果将 With As用在属于批处理的一部分的语句中，那么在它之前的语句必须以分号结尾。
```sql
declare @fname varchar(20)
select @fname='%茶'
;with xinxi as --这里前面必须加分号
    (    
    select incode from tbSpXinXi where fname like @fname
    )
select * from tbSpKc where incode in (select * from xinxi) 
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220322210744.png)

# MyISAM与InnoDB
MySQL5.5版本开始Innodb已经成为Mysql的默认引擎(之前是MyISAM)
可以通过`show variables like '%engine%'`语句来查看当前sql引擎 

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183056.png)


## 区别
1. InnoDB支持事务，MyISAM不支持，对于InnoDB每一条SQL语言都默认封装成事务，自动提交，这样会影响速度，所以最好把多条SQL语言放在begin和commit之间，组成一个事务； 
2. InnoDB支持外键，而MyISAM不支持。对一个包含外键的InnoDB表转为MYISAM会失败； 
3.  InnoDB是聚集索引，使用B+Tree作为索引结构，数据文件是和（主键）索引绑在一起的（表数据文件本身就是按B+Tree组织的一个索引结构），必须要有主键，通过主键索引效率很高。但是辅助索引需要两次查询，先查询到主键，然后再通过主键查询到数据。因此，主键不应该过大，因为主键太大，其他索引也都会很大。MyISAM是非聚集索引，也是使用B+Tree作为索引结构，索引和数据文件是分离的，索引保存的是数据文件的指针。主键索引和辅助索引是独立的。
也就是说：InnoDB的B+树主键索引的叶子节点就是数据文件，辅助索引的叶子节点是主键的值；而MyISAM的B+树主键索引和辅助索引的叶子节点都是数据文件的地址指针。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183104.png)

4. InnoDB不保存表的具体行数，执行`select count(*) from table`时需要全表扫描。而MyISAM用一个变量保存了整个表的行数，执行上述语句时只需要读出该变量即可，速度很快（注意不能加有任何WHERE条件）
5. Innodb不支持全文索引，而MyISAM支持全文索引，在涉及全文索引领域的查询效率上MyISAM速度更快高；PS：5.7以后的InnoDB支持全文索引了
6. MyISAM表格可以被压缩后进行查询操作
7. InnoDB支持表、行(默认)级锁，而MyISAM只支持表级锁
8. InnoDB表必须有唯一性索引（如主键）（用户没有指定的话会自己找/生产一个隐藏列Row_id来充当默认主键），而Myisam可以没有
9. Innodb存储文件有frm、ibd，而Myisam是frm、MYD、MYI
Innodb：frm是表定义文件，ibd是数据文件
Myisam：frm是表定义文件，myd是数据文件，myi是索引文件

## 如何选择：
- 是否要支持事务，如果要请选择innodb，如果不需要可以考虑MyISAM；
- 如果表中绝大多数都只是读查询，可以考虑MyISAM，如果既有读也有写，请使用InnoDB。
- 系统奔溃后，MyISAM恢复起来更困难，能否接受；

## InnoDB为什么推荐使用自增ID作为主键？
自增ID可以保证每次插入时B+索引是从右边扩展的，可以避免B+树和频繁合并和分裂（对比使用UUID）。如果使用字符串主键和随机主键，会使得数据随机插入，效率比较差。

## innodb引擎的4大特性
插入缓冲（insert buffer),二次写(double write),自适应哈希索引(ahi),预读(read ahead)

# 数据库中为什么不推荐使用外键约束
首先我们明确一点，外键约束是一种约束，这个约束的存在，会保证表间数据的关系“始终完整”。因此，外键约束的存在，并非全然没有优点。
比如使用外键，可以
- 保证数据的完整性和一致性
- 级联操作方便
- 将数据完整性判断托付给了数据库完成，减少了程序的代码量

然而，鱼和熊掌不可兼得。外键是能够保证数据的完整性，但是会给系统带来很多缺陷。正是因为这些缺陷，才导致我们不推荐使用外键，具体如下

## 性能问题
假设一张表名为user_tb。那么这张表里有两个外键字段，指向两张表。那么，每次往user_tb表里插入数据，就必须往两个外键对应的表里查询是否有对应数据。如果交由程序控制，这种查询过程就可以控制在我们手里，可以省略一些不必要的查询过程。但是如果由数据库控制，则是必须要去这两张表里判断。

## 并发问题
在使用外键的情况下，每次修改数据都需要去另外一个表检查数据,需要获取额外的锁。若是在高并发大流量事务场景，使用外键更容易造成死锁。

## 扩展性问题
这里主要是分为两点
- 做平台迁移方便，比如你从Mysql迁移到Oracle，像触发器、外键这种东西，都可以利用框架本身的特性来实现，而不用依赖于数据库本身的特性，做迁移更加方便。
- 分库分表方便，在水平拆分和分库的情况下，外键是无法生效的。将数据间关系的维护，放入应用程序中，为将来的分库分表省去很多的麻烦。

## 技术问题
使用外键，其实将应用程序应该执行的判断逻辑转移到了数据库上。那么这意味着一点，数据库的性能开销变大了，那么这就对DBA的要求就更高了。很多中小型公司由于资金问题，并没有聘用专业的DBA，因此他们会选择不用外键，降低数据库的消耗。
相反的，如果该约束逻辑在应用程序中，发现应用服务器性能不够，可以加机器，做水平扩展。如果是在数据库服务器上，数据库服务器会成为性能瓶颈，做水平扩展比较困难。

## 总结
不在数据库声明FK，在程序实现上表达关联

# 为什么占位符能防止sql注入
## 非占位符方式 --> 对应mybatis中的${}
前端页面传入后端什么,就直接放入最终的sql语句中,<font color="red">不做任何处理</font>
```sql
delete from userTable t where t.id = ${id}
```
用户正常操作, 传入'123',对应sql为： 
```sql
delete from userTable t where  t.id='123' 
```
黑客破坏性操作,修改查询条件,传入'123' or 1=1, 删掉所有人,对数据造成破坏
```sql
delete from userTable t where  t.id='123' or 1=1
```

## 占位符方式 ---->对应mybatis中的 #{}
前端页面传入后端后,在放入最终的sql语句中之前,需要做处理,<font color="red">给参数用'单引号括起来</font>
```sql
delete from userTable t where t.id=?
```
用户正常操作,传入123, 删掉一个人
```sql
delete from userTable t where  t.id='123' 
```
黑客破坏性操作,修改查询条件,传入'123' or 1=1,不会对数据库造成破坏
```sql
delete from userTable t where  t.id='123 or 1=1'
```

# Mysql InnoDB存储引擎中的事务
**如何开启事务**
- 执行DML语句时，会自动开启事务
- 使用`begin`或`start transaction`命令来手动开启事务

**如何结束事务**
- 执行DML语句时，会自动提交(commit)事务
- 使用`rollback`或`commit`命令使用结束事务

## 事务隔离级别
SQL92 ANSI/ISO标准中给出了数据库开发者开发数据库时，该数据库中的事务应该含有如下4种隔离级别供用户选择
- `Read Uncommitted(未提交读)`：没有解决任何并发问题；事务未提交的数据对其他事务也是可见的，会出现脏读
- `Read Committed(已提交读)`：解决脏读问题；但一个事务开始之后，只能看到已提交的事务所做的修改，会出现不可重复读
- `Repeatable Read(可重复读)`：解决不可重复读问题，在同一个事务中多次读取同样的数据结果是一样的；但这种隔离级别未定义解决幻读的问题
- `Serializable(串行化)`：解决所有问题，是最高的隔离级别，通过强制事务的串行执行

注：以上只是ANSI/ISO标准建议数据库开发者这样开发数据库，但真正的实现还是要看数据库开发者；

### MySQL InnoDB中事务隔离级别

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183114.png)

注：在mysql InnoDB中，`Repeatable Read`就解决了幻读的问题

可以通过`sow global variables like 'tx_isolation'`语句来查看当前使用的事务隔离级别

 
# 查询结果中增加一个字段并指定固定值
```mysql
mysql> select * from user;
+----+------+
| id | name |
+----+------+
|  1 | abc  |
|  2 | xyz  |
+----+------+
2 rows in set (0.00 sec)

mysql> select *,"true" as is_person from user;
+----+------+-----------+
| id | name | is_person |
+----+------+-----------+
|  1 | abc  | true |
|  2 | xyz  | true |
+----+------+-----------+
2 rows in set (0.00 sec)
```

# 单表访问方法
# EXPLAIN解释命令
## EXPLAIN概念
EXPLAIN会向我们提供一些MySQL是执行sql的信息：
- EXPLAIN可以解释说明 SELECT, DELETE, INSERT, REPLACE, and UPDATE 等语句.
- 当EXPLAIN与可解释的语句一起使用时，mysql会显示一些来自于优化器的关于sql执行计划的信息。即mysql解释它是如何处理这些语句的，和表之间是如何连接的。想获取更多关于EXPLAIN如何获取执行计划信息的。
- 当EXPLAIN后面是一个会话的connection_id 而不是一个可执行的语句时，它会展示会话的信息。
- 对于SELECT语句，EXPLAIN会产生额外的执行计划信息，这些信息可以用SHOW WARNINGS显示出来。
- EXPLAIN对于检查设计分区表的查询时非常有用。
- FORMAT选项可以用于选择输出格式，如果没有配置FORMAT选项，默认已表格形式输出。JSON 选项让信息已json格式展示。

## EXPLAIN 输出列信息
EXPLAIN输出的字段信息
第一列:列名, 第二列:FORMAT = JSON时输出中显示的等效属性名称 ,第三列：字段含义

| Column        | JSON Name     | Meaning                                         |
| ------------- | ------------- | ----------------------------------------------- |
| id            | select_id     | select标识号                                    |
| select_type   | None          | select类型                                      |
| table         | table_name    | 这一行数据是关于哪张表的                        |
| partitions    | partitions    | 匹配的分区，对于未分区表，该值为空              |
| type          | access_type   | 使用的连接类别,有无使用索引                     |
| possible_keys | possible_keys | MySQL能使用哪个索引在该表中找到行               |
| key           | key           | MySQL实际决定使用的键（索引）                   |
| key_len       | key_length    | MySQL决定使用的键长度。如果键是NULL，长度为NULL |
| ref           | ref           | 与索引关联的列                                  |
| rows          | rows          | mysql认为执行sql时必须被校验的行数              |
| filtered      | filtered      | 表示此查询条件所过滤的数据的百分比              |
| Extra         | None          | 附加信息                                        |

## id
SELECT标识符。SELECT在查询中的序列号，可以为空。

## select_type
SELECT类型，所有类型在下表中展示，JSON格式的EXPLAIN将SELECT类型公开为query_block的属性，除非它是SIMPLE或PRIMARY。 JSON名称(不适用为None)也显示在表中。

| select_type          | Value                      | JSON Name	Meaning                                                        |
| -------------------- | -------------------------- | ------------------------------------------------------------------------ |
| SIMPLE               | None                       | 简单SELECT(不使用UNION或子查询等)                                        |
| PRIMARY              | None                       | 嵌套查询时最外层的查询                                                   |
| UNION                | None                       | UNION中的第二个或后面的SELECT语句                                        |
| DEPENDENT UNION      | dependent (true)           | UNION中的第二个或以后的SELECT语句，取决于外部查询                        |
| UNION RESULT         | union_result               | UNION的结果                                                              |
| SUBQUERY             | None                       | 子查询中的第一个选择                                                     |
| DEPENDENT SUBQUERY   | dependent (true)           | 子查询中的第一个选择，取决于外部查询                                     |
| DERIVED              | None                       | 派生表（子查询中产生的临时表）                                           |
| MATERIALIZED         | materialized_from_subquery | 物化子查询                                                               |
| UNCACHEABLE SUBQUERY | cacheable (false)          | 无法缓存结果的子查询，必须对外部查询的每一行进行重新计算                 |
| UNCACHEABLE UNION    | cacheable (false)          | UNION中属于不可缓存子查询的第二个或以后的选择(请参 UNCACHEABLE SUBQUERY) |

### 实例
表信息（后面演示用）：
```sql
mysql> show create table t_a;
------+
| t_a   | CREATE TABLE `t_a` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `age` int(20) DEFAULT NULL,
  `code` int(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `age_key` (`age`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk |
+-------+-----------------------------------
------+
1 row in set (0.03 sec)
```

- SIMPLE：简单SELECT(不使用UNION或子查询等)
```sql
mysql> explain select * from t_a where id =1;
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | t_a   | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.03 sec)
```

- PRIMARY：嵌套查询时最外层的查询
```sql
mysql> explain select * from t_a where num >(select num from t_a where id = 3);
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra                    |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
|  1 | PRIMARY     | t_a   | NULL       | range | num_key       | num_key | 5       | NULL  |    6 |   100.00 | Using where; Using index |
|  2 | SUBQUERY    | t_a   | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL                     |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
2 rows in set, 1 warning (0.03 sec)
```
- UNION：UNION中的第二个或后面的SELECT语句
```sql
mysql> explain select * from t_a where id =9 union all select * from t_a;
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
|  1 | PRIMARY     | t_a   | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL        |
|  2 | UNION       | t_a   | NULL       | index | NULL          | num_key | 5       | NULL  |    9 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
2 rows in set, 1 warning (0.04 sec)
```

- DEPENDENT UNION：UNION中的第二个或以后的SELECT语句，取决于外部查询
```sql
mysql> explain select * from t_a where id in (select id from t_a where id >8 union all select id from t_a where id =5);
+----+--------------------+-------+------------+--------+---------------+---------+---------+-------+------+----------+--------------------------+
| id | select_type        | table | partitions | type   | possible_keys | key     | key_len | ref   | rows | filtered | Extra                    |
+----+--------------------+-------+------------+--------+---------------+---------+---------+-------+------+----------+--------------------------+
|  1 | PRIMARY            | t_a   | NULL       | index  | NULL          | num_key | 5       | NULL  |    9 |   100.00 | Using where; Using index |
|  2 | DEPENDENT SUBQUERY | t_a   | NULL       | eq_ref | PRIMARY       | PRIMARY | 8       | func  |    1 |   100.00 | Using where; Using index |
|  3 | DEPENDENT UNION    | t_a   | NULL       | const  | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | Using index              |
+----+--------------------+-------+------------+--------+---------------+---------+---------+-------+------+----------+--------------------------+
3 rows in set, 1 warning (0.08 sec)
```

- UNION RESULT：UNION的结果
```sql
mysql> explain select num from t_a where id = 3 union select num from t_a where id =4;
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
| id | select_type  | table      | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra           |
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
|  1 | PRIMARY      | t_a        | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL            |
|  2 | UNION        | t_a        | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL            |
| NULL | UNION RESULT | <union1,2> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL  | NULL |     NULL | Using temporary |
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
3 rows in set, 1 warning (0.03 sec)
```

- SUBQUERY：子查询中的第一个选择
```sql
mysql> explain select * from t_a where num >(select num from t_a where id = 3);
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra                    |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
|  1 | PRIMARY     | t_a   | NULL       | range | num_key       | num_key | 5       | NULL  |    6 |   100.00 | Using where; Using index |
|  2 | SUBQUERY    | t_a   | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL                     |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
2 rows in set, 1 warning (0.03 sec)
```

- DEPENDENT SUBQUERY：子查询中的第一个选择，取决于外部查询
```sql
mysql> explain select * from t_a where num in(select num from t_a where id = 3 union select num from t_a where id =4);
+----+--------------------+------------+------------+-------+-----------------+---------+---------+-------+------+----------+--------------------------+
| id | select_type        | table      | partitions | type  | possible_keys   | key     | key_len | ref   | rows | filtered | Extra                    |
+----+--------------------+------------+------------+-------+-----------------+---------+---------+-------+------+----------+--------------------------+
|  1 | PRIMARY            | t_a        | NULL       | index | NULL            | num_key | 5       | NULL  |    9 |   100.00 | Using where; Using index |
|  2 | DEPENDENT SUBQUERY | t_a        | NULL       | const | PRIMARY,num_key | PRIMARY | 8       | const |    1 |   100.00 | NULL                     |
|  3 | DEPENDENT UNION    | t_a        | NULL       | const | PRIMARY,num_key | PRIMARY | 8       | const |    1 |   100.00 | NULL                     |
| NULL | UNION RESULT       | <union2,3> | NULL       | ALL   | NULL            | NULL    | NULL    | NULL  | NULL |     NULL | Using temporary          |
+----+--------------------+------------+------------+-------+-----------------+---------+---------+-------+------+----------+--------------------------+
4 rows in set, 1 warning (0.12 sec)
```

- DERIVED：派生表（子查询中产生的临时表）
```sql
mysql> explain select a.id from (select id from t_a where id >8 union all select id from t_a where id =5) a;
+----+-------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
| id | select_type | table      | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra                    |
+----+-------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
|  1 | PRIMARY     | <derived2> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL  |    3 |   100.00 | NULL                     |
|  2 | DERIVED     | t_a        | NULL       | range | PRIMARY       | PRIMARY | 8       | NULL  |    1 |   100.00 | Using where; Using index |
|  3 | UNION       | t_a        | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | Using index              |
+----+-------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+--------------------------+
3 rows in set, 1 warning (0.12 sec)
```

## partitions
查询的记录所属于的分区，对于未分区表，该值为NULL。


## table
显示这一行的数据是关于哪张表的，有时是真实的表名字，有时也可能是以下几种结果
- `<unionM,N>`: 指id为M,N行结果的并集
- `<derivedN>`: 该行是指id值为n的行的派生表结果。派生表可能来自例如from子句中的子查询。
- `<subqueryN>`: 该行是指id值为n的行的物化子查询的结果。

## type
连接使用了哪种类别,有无使用索引,常用的类型有：system, const, eq_ref, ref, range, index, ALL（从左到右，性能越来越差）
- NULL：MySQL在优化过程中分解语句，执行时甚至不用访问表或索引，例如从一个索引列里选取最小值可以通过单独索引查找完成
- system：这个表（也可能是查询出来的临时表）只有一行数据 (= system table). 是const中的一个特例
- const：表最多有一个匹配行，它将在查询开始时被读取。因为仅有一行，在这行的列值可被优化器剩余部分认为是常数。const表很快，因为它们只读取一次！const用于查询条件为PRIMARY KEY或UNIQUE索引并与常数值进行比较时的所有部分。
在下面的查询中，tbl_name可以用于const表：
```sql
SELECT * from tbl_name WHERE primary_key=1；
SELECT * from tbl_name WHERE primary_key_part1=1和 primary_key_part2=2；

--例子
mysql> explain select * from t_a where id =1;
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | t_a   | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.07 sec)
```
- eq_ref：对于前几个表中的每一行组合，最多只能从该组合中中读取一行时。除了system和const，这是最好的连接类型。当连接使用索引的所有部分，并且索引是主键或唯一非空索引时，将使用它。eq_ref可以用于使用= 操作符比较的带索引的列。比较值可以为常量或一个使用在该表前面所读取的表的列的表达式。
在下面的例子中，MySQL可以使用eq_ref联接去处理ref_tables：
```sql
SELECT * FROM ref_table,other_table
  WHERE ref_table.key_column=other_table.column;

SELECT * FROM ref_table,other_table
  WHERE ref_table.key_column_part1=other_table.column
  AND ref_table.key_column_part2=1;

--例子（t_b为t_a的复制表，表结构相同）
mysql> explain select * from t_a,t_b where t_a.code=t_b.code;
+----+-------------+-------+------------+--------+---------------+---------+---------+---------------+------+----------+-------+
| id | select_type | table | partitions | type   | possible_keys | key     | key_len | ref           | rows | filtered | Extra |
+----+-------------+-------+------------+--------+---------------+---------+---------+---------------+------+----------+-------+
|  1 | SIMPLE      | t_a   | NULL       | ALL    | uk_code       | NULL    | NULL    | NULL          |    9 |   100.00 | NULL  |
|  1 | SIMPLE      | t_b   | NULL       | eq_ref | uk_code       | uk_code | 4       | test.t_a.code |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+--------+---------------+---------+---------+---------------+------+----------+-------+
2 rows in set, 1 warning (0.03 sec)
```
- ref：对于每个来自于前面的表的行组合，所有有匹配索引值的行将从这组合中读取。如果联接只使用键的最左边的前缀，或如果键不是UNIQUE或PRIMARY KEY（换句话说，如果联接不能基于关键字查询结果为单个行的话），则使用ref。如果使用的键仅仅匹配少量行，该联接类型是不错的。ref可以用于使用=或<=>操作符的带索引的列。
在下面的例子中，MySQL可以使用ref联接来处理ref_tables：
```sql
SELECT * FROM ref_table WHERE key_column=expr;

SELECT * FROM ref_table,other_table
  WHERE ref_table.key_column=other_table.column;

SELECT * FROM ref_table,other_table
  WHERE ref_table.key_column_part1=other_table.column
  AND ref_table.key_column_part2=1;

--例子（t_b为t_a的复制表，表结构相同）
mysql> explain select * from t_a,t_b where t_a.age=t_b.age;
+----+-------------+-------+------------+------+---------------+---------+---------+--------------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key     | key_len | ref          | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+---------+---------+--------------+------+----------+-------------+
|  1 | SIMPLE      | t_a   | NULL       | ALL  | age_key       | NULL    | NULL    | NULL         |    9 |   100.00 | Using where |
|  1 | SIMPLE      | t_b   | NULL       | ref  | age_key       | age_key | 5       | test.t_a.age |    1 |   100.00 | NULL        |
+----+-------------+-------+------------+------+---------------+---------+---------+--------------+------+----------+-------------+
2 rows in set, 1 warning (0.03 sec)
```
- fulltext：使用FULLTEXT索引执行连接
- ref_or_null：该联接类型ref类似，但是添加了MySQL可以专门搜索包含NULL值的行。在解决子查询中经常使用该联接类型的优化。
在下面的例子中，MySQL可以使用ref_or_null联接来处理ref_tables：
```sql
SELECT * FROM ref_table
  WHERE key_column=expr OR key_column IS NULL;

--例子
mysql> explain select * from t_a where t_a.age =3 or t_a.age is null;
+----+-------------+-------+------------+-------------+---------------+---------+---------+-------+------+----------+-----------------------+
| id | select_type | table | partitions | type        | possible_keys | key     | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+-------+------------+-------------+---------------+---------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | t_a   | NULL       | ref_or_null | age_key       | age_key | 5       | const |    2 |   100.00 | Using index condition |
+----+-------------+-------+------------+-------------+---------------+---------+---------+-------+------+----------+-----------------------+
1 row in set, 1 warning (0.03 sec)
```

- index_merge：该联接类型表示使用了索引合并优化方法。在这种情况下，key列包含了使用的索引的清单，key_len包含了使用的索引的最长的关键元素。
```sql
SELECT * FROM ref_table
  WHERE idx1=expr1 OR idx2 =expr2;

--例子
mysql> explain select * from t_a where t_a.code =3 or t_a.age = 3;
+----+-------------+-------+------------+-------------+-----------------+-----------------+---------+------+------+----------+-------------------------------------------+
| id | select_type | table | partitions | type        | possible_keys   | key             | key_len | ref  | rows | filtered | Extra                                     |
+----+-------------+-------+------------+-------------+-----------------+-----------------+---------+------+------+----------+-------------------------------------------+
|  1 | SIMPLE      | t_a   | NULL       | index_merge | uk_code,age_key | uk_code,age_key | 4,5     | NULL |    2 |   100.00 | Using union(uk_code,age_key); Using where |
+----+-------------+-------+------------+-------------+-----------------+-----------------+---------+------+------+----------+-------------------------------------------+
1 row in set, 1 warning (0.03 sec)
```

- unique_subquery：该类型替换了下面形式的IN子查询的ref：
```sql
value IN (SELECT primary_key FROM single_table WHERE some_expr)
```
unique_subquery是一个索引查找函数，可以完全替换子查询，效率更高。

- index_subquery：该联接类型类似于unique_subquery。可以替换IN子查询，但只适合下列形式的子查询中的非唯一索引：
```sql
value IN (SELECT key_column FROM single_table WHERE some_expr)
```

- range：只检索给定范围的行，使用一个索引来选择行。key列显示使用了哪个索引。key_len包含所使用索引的最长关键元素。在该类型中ref列为NULL。当使用=、<>、>、>=、<、<=、IS NULL、<=>、BETWEEN或者IN操作符，用常量比较关键字列时，可以使用range
```sql
mysql> explain select * from t_a where id > 8;
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | t_a   | NULL       | range | PRIMARY       | PRIMARY | 8       | NULL |    1 |   100.00 | Using where |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.03 sec)
```

- index：该联接类型与ALL相同，除了只有索引树被扫描。这通常比ALL快，因为索引文件通常比数据文件小。当查询只使用作为单索引一部分的列时，MySQL可以使用该联接类型。

- ALL：对于每个来自于先前的表的行组合，进行完整的表扫描。如果表是第一个没标记const的表，这通常不好，并且通常在它情况下很差。通常可以增加更多的索引而不要使用ALL，使得行能基于前面的表中的常数值或列值被检索出。

## possible_keys
possible_keys列指出MySQL能使用哪个索引在该表中找到行。注意，该列完全独立于EXPLAIN输出所示的表的次序。这意味着在possible_keys中的某些键实际上不能按生成的表次序使用。

如果该列是NULL，则没有相关的索引。在这种情况下，可以通过检查WHERE子句看是否它引用某些列或适合索引的列来提高你的查询性能。如果是这样，创造一个适当的索引并且再次用EXPLAIN检查查询

## key
key列显示MySQL实际决定使用的键（索引）。如果没有选择索引，键是NULL。要想强制MySQL使用或忽视possible_keys列中的索引，在查询中使用FORCE INDEX、USE INDEX或者IGNORE INDEX。

## key_len
key_len列显示MySQL决定使用的键长度。如果键是NULL，则长度为NULL。
使用的索引的长度。在不损失精确性的情况下，长度越短越好
例如索引`test`是`class`列与`nameid`列的复合索引, 其中`class`列为int型,占4个字节，`nameid`为smallint型，占2个字节。所以`test`索引的key_len为6

## ref
ref列显示使用哪个列或常数与key一起从表中选择行。

## rows
rows列显示MySQL认为它执行查询时必须检查的行数。

## Extra
该列包含MySQL解决查询的详细信息,下面详细.

### `Distinct`
一旦MYSQL找到了与行相联合匹配的行，就不再搜索了

### `Not exists`
当我们使用左（外）连接时，如果WHERE子句中包含要求被驱动表的某个列等于NULL值的搜索条件，而且那个列又是不允许存储NULL值的，那么在该表的执行计划的Extra列就会提示Not exists额外信息，比如这样：
```sql
mysql> EXPLAIN SELECT * FROM s1 LEFT JOIN s2 ON s1.key1 = s2.key1 WHERE s2.id IS NULL;
+----+-------------+-------+------------+------+---------------+----------+---------+-------------------+------+----------+-------------------------+
| id | select_type | table | partitions | type | possible_keys | key      | key_len | ref               | rows | filtered | Extra                   |
+----+-------------+-------+------------+------+---------------+----------+---------+-------------------+------+----------+-------------------------+
|  1 | SIMPLE      | s1    | NULL       | ALL  | NULL          | NULL     | NULL    | NULL              | 9688 |   100.00 | NULL                    |
|  1 | SIMPLE      | s2    | NULL       | ref  | idx_key1      | idx_key1 | 303     | xiaohaizi.s1.key1 |    1 |    10.00 | Using where; Not exists |
+----+-------------+-------+------------+------+---------------+----------+---------+-------------------+------+----------+-------------------------+
2 rows in set, 1 warning (0.00 sec)
``` 
上述查询中s1表是驱动表，s2表是被驱动表，s2.id列是不允许存储NULL值的，而WHERE子句中又包含s2.id IS NULL的搜索条件，这意味着必定是驱动表的记录在被驱动表中找不到匹配ON子句条件的记录才会把该驱动表的记录加入到最终的结果集，所以对于某条驱动表中的记录来说，如果能在被驱动表中找到1条符合ON子句条件的记录，那么该驱动表的记录就不会被加入到最终的结果集，也就是说我们没有必要到被驱动表中找到全部符合ON子句条件的记录，这样可以稍微节省一点性能。

- `Range checked for each`：没有找到理想的索引，因此对于从前面表中来的每一个行组合，MYSQL检查使用哪个索引，并用它来从表中返回行。这是使用索引的最慢的连接之一

### `Using filesort`
有一些情况下对结果集中的记录进行排序是可以使用到索引的，比如下边这个查询：
```sql
mysql> EXPLAIN SELECT * FROM s1 ORDER BY key1 LIMIT 10;
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------+
| id | select_type | table | partitions | type  | possible_keys | key      | key_len | ref  | rows | filtered | Extra |
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------+
|  1 | SIMPLE      | s1    | NULL       | index | NULL          | idx_key1 | 303     | NULL |   10 |   100.00 | NULL  |
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------+
1 row in set, 1 warning (0.03 sec)
```   
这个查询语句可以利用idx_key1索引直接取出key1列的10条记录，然后再进行回表操作就好了。但是很多情况下排序操作无法使用到索引，只能在内存中（记录较少的时候）或者磁盘中（记录较多的时候）进行排序，设计MySQL的大叔把这种在内存中或者磁盘上进行排序的方式统称为文件排序（英文名：filesort）。如果某个查询需要使用文件排序的方式执行查询，就会在执行计划的Extra列中显示Using filesort提示，比如这样：
```sql
mysql> EXPLAIN SELECT * FROM s1 ORDER BY common_field LIMIT 10;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
|  1 | SIMPLE      | s1    | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 9688 |   100.00 | Using filesort |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
1 row in set, 1 warning (0.00 sec)
``` 
需要注意的是，如果查询中需要使用filesort的方式进行排序的记录非常多，那么这个过程是很耗费性能的，我们最好想办法将使用文件排序的执行方式改为使用索引进行排序。

### `Using index`
当我们的查询列表以及搜索条件中只包含属于某个索引的列，也就是在可以使用索引覆盖的情况下，在Extra列将会提示该额外的信息。如果为Using index, 则表示不需要回表操作，比方说下边这个查询中只需要用到idx_key1而不需要回表操作：
```sql
mysql> EXPLAIN SELECT key1 FROM s1 WHERE key1 = 'a';
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key      | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | s1    | NULL       | ref  | idx_key1      | idx_key1 | 303     | const |    8 |   100.00 | Using index |
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

### `Using index condition`
有些搜索条件中虽然出现了索引列，但却不能使用到索引，比如下边这个查询：
```sql
SELECT * FROM s1 WHERE key1 > 'z' AND key1 LIKE '%a';
``` 
其中的`key1 > 'z'`可以使用到索引，但是`key1 LIKE '%a'`却无法使用到索引，在以前版本的MySQL中，是按照下边步骤来执行这个查询的：
- 先根据`key1 > 'z'`这个条件，从二级索引idx_key1中获取到对应的二级索引记录。
- 根据上一步骤得到的二级索引记录中的主键值进行回表，找到完整的用户记录再检测该记录是否符合`key1 LIKE '%a'`这个条件，将符合条件的记录加入到最后的结果集。
但是虽然key1 LIKE '%a'不能组成范围区间参与range访问方法的执行，但这个条件毕竟只涉及到了key1列，所以设计MySQL的大叔把上边的步骤改进了一下：
- 先根据`key1 > 'z'`这个条件，定位到二级索引idx_key1中对应的二级索引记录。
- 对于指定的二级索引记录，先不着急回表，而是先检测一下该记录是否满足`key1 LIKE '%a'`这个条件，如果这个条件不满足，则该二级索引记录压根儿就没必要回表。
- 对于满足`key1 LIKE '%a'`这个条件的二级索引记录执行回表操作。
我们说回表操作其实是一个随机IO，比较耗时，所以上述修改虽然只改进了一点点，但是可以省去好多回表操作的成本。设计MySQL的大叔们把他们的这个改进称之为`索引条件下推（英文名：Index Condition Pushdown）`。

如果在查询语句的执行过程中将要使用`索引条件下推`这个特性，在Extra列中将会显示`Using index condition`，比如这样：
```sql
mysql> EXPLAIN SELECT * FROM s1 WHERE key1 > 'z' AND key1 LIKE '%b';
  +----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-----------------------+
  | id | select_type | table | partitions | type  | possible_keys | key      | key_len | ref  | rows | filtered | Extra                 |
  +----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-----------------------+
  |  1 | SIMPLE      | s1    | NULL       | range | idx_key1      | idx_key1 | 303     | NULL |  266 |   100.00 | Using index condition |
  +----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-----------------------+
  1 row in set, 1 warning (0.01 sec)
``` 

### `Using temporary`
在许多查询的执行过程中，MySQL可能会借助临时表来完成一些功能，比如去重、排序之类的，比如我们在执行许多包含DISTINCT、GROUP BY、UNION等子句的查询过程中，如果不能有效利用索引来完成查询，MySQL很有可能寻求通过建立内部的临时表来执行查询。如果查询中使用到了内部的临时表，在执行计划的Extra列将会显示Using temporary提示，比方说这样：
```sql
mysql> EXPLAIN SELECT DISTINCT common_field FROM s1;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra           |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
|  1 | SIMPLE      | s1    | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 9688 |   100.00 | Using temporary |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
1 row in set, 1 warning (0.00 sec)
``` 
再比如：
```sql
mysql> EXPLAIN SELECT common_field, COUNT(*) AS amount FROM s1 GROUP BY common_field;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+---------------------------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra                           |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+---------------------------------+
|  1 | SIMPLE      | s1    | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 9688 |   100.00 | Using temporary; Using filesort |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+---------------------------------+
1 row in set, 1 warning (0.00 sec)
``` 
不知道大家注意到没有，上述执行计划的Extra列不仅仅包含Using temporary提示，还包含Using filesort提示，可是我们的查询语句中明明没有写ORDER BY子句呀？这是因为MySQL会在包含GROUP BY子句的查询中默认添加上ORDER BY子句，也就是说上述查询其实和下边这个查询等价：
```sql
EXPLAIN SELECT common_field, COUNT(*) AS amount FROM s1 GROUP BY common_field ORDER BY common_field;
```
如果我们并不想为包含GROUP BY子句的查询进行排序，需要我们显式的写上ORDER BY NULL，就像这样：
```sql
mysql> EXPLAIN SELECT common_field, COUNT(*) AS amount FROM s1 GROUP BY common_field ORDER BY NULL;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra           |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
|  1 | SIMPLE      | s1    | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 9688 |   100.00 | Using temporary |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
1 row in set, 1 warning (0.00 sec)
``` 
这回执行计划中就没有Using filesort的提示了，也就意味着执行查询时可以省去对记录进行文件排序的成本了。

另外，执行计划中出现Using temporary并不是一个好的征兆，因为建立与维护临时表要付出很大成本的，所以我们最好能使用索引来替代掉使用临时表，比方说下边这个包含GROUP BY子句的查询就不需要使用临时表：
```sql
mysql> EXPLAIN SELECT key1, COUNT(*) AS amount FROM s1 GROUP BY key1;
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key      | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | s1    | NULL       | index | idx_key1      | idx_key1 | 303     | NULL | 9688 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
``` 
从Extra的Using index的提示里我们可以看出，上述查询只需要扫描idx_key1索引就可以搞定了，不再需要临时表了。

### `Using where`
当我们使用全表扫描来执行对某个表的查询，并且该语句的WHERE子句中有针对该表的搜索条件时，在Extra列中会提示上述额外信息。比如下边这个查询：
```sql
mysql> EXPLAIN SELECT * FROM s1 WHERE common_field = 'a';
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | s1    | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 9688 |    10.00 | Using where |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
``` 
当使用索引访问来执行对某个表的查询，并且该语句的WHERE子句中有除了该索引包含的列之外的其他搜索条件时，在Extra列中也会提示上述额外信息。比如下边这个查询虽然使用idx_key1索引执行查询，但是搜索条件中除了包含key1的搜索条件key1 = 'a'，还有包含common_field的搜索条件，所以Extra列会显示Using where的提示：
```sql
mysql> EXPLAIN SELECT * FROM s1 WHERE key1 = 'a' AND common_field = 'a';
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key      | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | s1    | NULL       | ref  | idx_key1      | idx_key1 | 303     | const |    8 |    10.00 | Using where |
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

# 表连接中的驱动表与被驱动表
什么是驱动表，什么是被驱动表，这两个概念在查询中有时容易让人搞混，有下面几种情况，大家需要了解。
- 当连接查询没有where条件时，左连接查询时，前面的表是驱动表，后面的表是被驱动表，右连接查询时相反，内连接查询时，哪张表的数据较少，哪张表就是驱动表
- 当连接查询有where条件时，带where条件的表是驱动表，否则是被驱动表


怎么确定我们上面的两种情况呢，执行计划是不会骗人的，我们针对上面情况分别看看执行计划给出的答案, 因为explain语句输出中靠前的表是驱动表

首先第一种情况，student表中3条数据，score表中2条数据，但两张表中只有一条数据是关联的(编号是1),看如下SQL查询
```sql
//左连接查询
explain select * from student s1 left join score s2 on s1.no = s2.no
//右连接查询
explain select * from student s1 right join score s2 on s1.no = s2.no
//内连接查询
explain select * from student s1 inner join score s2 on s1.no = s2.no
```
**执行计划输出中靠前的表是驱动表**，我们看下面三种图中，是不是全度符合情况一，第一张图中s1是驱动表，第二张图中s2是驱动表，第三种途中s2是驱动表

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183125.png)

其次第二种情况，还是上面三种SQL语句，我们分别加上where条件，再来看看执行计划的结果是什么样呢？
```sql
//左连接查询
explain select * from student s1 left join score s2 on s1.no = s2.no where s2. no = 1
//右连接查询
explain select * from student s1 right join score s2 on s1.no = s2.no where s1.no = 1
//内连接查询
explain select * from student s1 inner join score s2 on s1.no = s2.no where s1.no = 1
```
我们看下面三种执行计划结果，全都以where条件为准了，而且跟上面情况一的都相反了,因此情况二也是得到了验证.

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183135.png)

# 连接的原理
搞数据库一个避不开的概念就是Join，翻译成中文就是连接。相信很多小伙伴在初学连接的时候有些一脸懵逼，理解了连接的语义之后又可能不明白各个表中的记录到底是怎么连起来的，以至于在使用的时候常常陷入下边两种误区：
- 误区一：业务至上，管他三七二十一，再复杂的查询也用在一个连接语句中搞定。
- 误区二：敬而远之，上次 DBA 那给报过来的慢查询就是因为使用了连接导致的，以后再也不敢用了。
所以本章就来扒一扒连接的原理



# 连接查询优化
要理解连接查询优化，得先理解连接查询的算法，连接查询常用的一共有两种算法，我们简要说明一下

## Simple Nested-Loop Join Algorithms （简单嵌套循环连接算法）
比如上面的查询中，我们确定了驱动表和被驱动表，那么查询过程如下,很简单，就是双重循环，从驱动表中循环获取每一行数据，再在被驱动表匹配满足条件的行。
```c++
for (row1 : 驱动表) {
    for (row2 : 被驱动表){
        if (conidtion == true){
            send client
        }
    }
}
```
## Index Nested-Loop Join Algorithms （索引嵌套循环连接算法）
上面双重for循环的查询中，相信很多研发人员看到这种情况第一个想法就是性能问题，是的，<font color="red">join查询的优化思路就是小表驱动大表,而且在大表上创建索引(也就是被动表创建索引)</font>，如果驱动表创建了索引,MySQL是不会使用的
```c++
for (row1 : 驱动表) {
    索引在被驱动表中命中，不用再遍历被驱动表了
}
```
## Block Nested-Loop Join Algorithm(基于块的连接嵌套循环算法)
其实很简单就是把一行变成了一批，块嵌套循环（BNL）嵌套算法使用对在外部循环中读取的行进行缓冲，以减少必须读取内部循环中的表的次数。例如，如果将10行读入缓冲区并将缓冲区传递到下一个内部循环，则可以将内部循环中读取的每一行与缓冲区中的所有10行进行比较。这将内部表必须读取的次数减少了一个数量级。

MySQL连接缓冲区大小通过这个参数控制 ： join_buffer_size

MySQL连接缓冲区有一些特征，只有无法使用索引时才会使用连接缓冲区；联接中只有感兴趣的列存储在其联接缓冲区中，而不是整个行；为每个可以缓冲的连接分配一个缓冲区，因此可以使用多个连接缓冲区来处理给定查询；在执行连接之前分配连接缓冲区，并在查询完成后释放连接缓冲区

所以查询时最好不要把 * 作为查询的字段，而是需要什么字段查询什么字段，这样缓冲区能够缓冲足够多的行。

从上面的执行计划中其实我们已经看到了 useing join buffer了，是的，那是因为我们对两张表都有创建索引

## 三种算法优先级
第一种算法忽略，MySQL不会采用这种的，当我们对被驱动表创建了索引，那么MySQL一定使用的第二种算法，当我们没有创建索引或者对驱动表创建了索引，那么MySQL一定使用第三种算法

# 回表查询
本文试验基于MySQL5.6-InnoDB。

什么是回表查询？
这先要从InnoDB的索引实现说起，InnoDB有两大类索引：
- 聚集索引(clustered index)
- 二级索引(secondary index)

**InnoDB聚集索引和普通索引有什么差异？**
InnoDB聚集索引的叶子节点存储行记录，因此， InnoDB必须要有，且只有一个聚集索引：
（1）如果表定义了PK，则PK就是聚集索引；
（2）如果表没有定义PK，则第一个not NULL unique列是聚集索引；
（3）否则，InnoDB会创建一个隐藏的row-id作为聚集索引；

画外音：所以PK查询非常快，直接定位行记录。

InnoDB二级索引的叶子节点存储主键值。
画外音：注意，不是存储行记录头指针，MyISAM的索引叶子节点存储记录指针。
 

举个栗子，不妨设有表：
`t(id PK, name KEY, sex, flag);`
画外音：id是聚集索引，name是二级索引。

表中有四条记录：
```
1, shenjian, m, A
3, zhangsan, m, A
5, lisi, m, A
9, wangwu, f, B
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183148.png)

两个B+树索引分别如上图：
（1）id为PK，聚集索引，叶子节点存储行记录；
（2）name为KEY，二级索引，叶子节点存储PK值，即id；

既然从普通索引无法直接定位行记录，那普通索引的查询过程是怎么样的呢？
**通常情况下，需要扫码两遍索引树。**

例如：
```sql
select * from t where name='lisi';　
```
是如何执行的呢？

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183156.png)

如粉红色路径，需要扫码两遍索引树：
（1）先通过二级索引定位到主键值id=5；
（2）在通过聚集索引定位到行记录；
这就是所谓的`回表查询`，先定位主键值，再定位行记录，它的性能较扫一遍索引树更低。

# 索引覆盖/覆盖索引
覆盖索引是select的数据列只用从索引中就能够取得，不必读取数据行，换句话说查询列要被所建的索引覆盖。 即只需要在一棵索引树上就能获取SQL所需的所有列数据，即explain的输出结果Extra字段为Using index, 能够触发索引覆盖, 无需回表，速度更快。

## 如何实现索引覆盖？
常见的方法是：将被查询的字段，建立到联合索引里去。
建表
```sql
create table user (
    id int primary key,
    name varchar(20),
    sex varchar(5),
    index(name)
)engine=innodb;
```

第一个SQL语句：　　

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183207.png)

```sql
select id,name from user where name='shenjian';　
```
能够命中name索引，索引叶子节点存储了主键id，通过name的索引树即可获取id和name，无需回表，符合索引覆盖，效率较高。

第二个SQL语句：                 

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183218.png)

```sql
select id,name,sex from user where name='shenjian';
```
能够命中name索引，索引叶子节点存储了主键id，但sex字段必须回表查询才能获取到，不符合索引覆盖，需要再次通过id值扫码聚集索引获取sex字段，效率会降低。

如果把(name)单列索引升级为联合索引(name, sex)就不同了。
```sql
create table user (
    id int primary key,
    name varchar(20),
    sex varchar(5),
    index(name, sex)
)engine=innodb;
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183228.png)

可以看到：
```sql
select id,name ... where name='shenjian';
 
select id,name,sex ... where name='shenjian';
```
都能够命中索引覆盖，无需回表。

## 哪些场景可以利用索引覆盖来优化SQL
**场景1：全表count查询优化**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408183240.png)

原表为：
```sql
user(PK id, name, sex)；
```
直接：
```sql
select count(name) from user;
```
不能利用索引覆盖。
添加索引：
```sql
alter table user add key(name);
```
就能够利用索引覆盖提效。

**场景2：列查询回表优化**
```sql
select id,name,sex ... where name='shenjian';
```
这个例子不再赘述，将单列索引(name)升级为联合索引(name, sex)，即可避免回表。

**场景3：分页查询**
```sql
select id,name,sex ... order by name limit 500,100;
```
将单列索引(name)升级为联合索引(name, sex)，也可以避免回表。

# Mysql优化
## 查询中尽量避免使用SELECT 星号以及加上LIMIT限制
当服务器响应客户端请求时，客户端必须完整的接收整个返回结果，而不能简单的只取前面几条结果，然后让服务器停止发送。查询应尽可能只返回必要数据，减小通信数据包大小和数量，提高效率。

