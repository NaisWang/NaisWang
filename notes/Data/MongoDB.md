# MongoDB简介
- MongoDB是一个NoSQL的数据库
- MongoDB是一款文档型数据库
- 数据库指的就是一个存储数据的仓库
	数据库可以使我们完成对数据的持久化的操作
- MongoDB数据库中存储的数据的基本单位就是文档，
	MongoDB中存储的就是文档，所谓文档其实就是一个“JSON”
- MongoDB中的“JSON”我们称为BSON，比普通的JSON的功能要更加的强大
- MongoDB数据库使用的是JavaScript进行操作的，在MongoDB含有一个对ES标准实现的引擎，
	在MongoDB中所有ES中的语法中都可以使用

# MongoDB数据库的基本概念
- 可以有多个数据库（qq  , taobao）
- 一个数据库中可以有多个集合（表）  (  users ,   products)
- 一个集合中可以有多个文档（表记录） (  {name:"张三", age:15},)   。 一个文档就类似于js对象，每个字段就是它的属性
- 文档结构很灵活，没有任何限制I
- MongoDB非常灵活，不需要像MySQL一样先创建数据库、表、设计表结构
  - 在这里只需要：当你需要插入数据的时候，只需要指定往哪个数据库的哪个集合操作就可以了
  - 一切都由MongoDB来帮你自动完成

```json
{
    qq:{
        users:[
            {name:"张三", age:15},
            {name:"历史", age:15},
            {name:"盎司", age:15},
            {name:"找iu", age:15},
            ...
        ],
        products:[
            ...
        ],
        ...
    },
    taobao:{
    }
}
```

# 起步

- 官网: http://mongoosejs.com/
- 官方指南:http://mongoosejs.com/docs/guide.html
- 官方API文档:http://mongosejs.com/docs/api.html

安装:

```shell
npm i mongoose
```

hello world:

```js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
mongoose.Promise = global.Promise;

var Cat = mongoose.model('Cat', {name:String});

var kitty = new Cat({name:'zilajian'});
kitty.save(function(err){
    if(err){
        console.log(err);
    }else{
        console.log('meow');
    }
})
```

**关键词：mongodb安装 mongoose使用 robomongo mongoose的CRUD操作 mongoose的查询，增加，修改，删除**

# 工具介绍

**MongoDB**

MongoDB是基于Javascript语言的数据库，存储格式是JSON，而Node也是基于JavaScript的环境（库），所以node和mongoDB的搭配能减少因为数据转换带来的时间空间开销。

**Mongoose**

是MongoDB的一个对象模型工具，它将数据库中的数据转换为JavaScript对象以供你在应用中使用，封装了MongoDB对文档的的一些增删改查等常用方法，让NodeJS操作Mongodb数据库变得更加灵活简单。

**Robomongo**

一个可视化的mongoDB操作软件，类似于mysql的navicat可视化工具。

> 捋一捋它们的关系，mongoDB是一个数据库，mongoose是你在自己代码中操作mongo数据库的接口，而robomongo是mongo数据库的可视化工具，通过它的界面方便直接操作数据库内容。

# 工具安装
## MongoDB安装
**1.安装mongoDB**

到官网<https://www.mongodb.com/download-center#community>下载程序安装，选择custom模式就行。

**2.建立MongoDB环境**
需要自己建立db目录作为数据库环境，在命令行窗口中输入
```
$ md \data\db
```
建立db文件夹后，在命令窗口中进入安装目录的bin文件夹执行mongod.exe，把数据库安装在datadb中。mongoDB会检测你的根目录是否有datadb文件夹，如果有会默认安装到这个文件夹里面。
```shell
 $ cd C:\Program Files\MongoDB\Server\3.2\bin
 $ mongod.exe
```
当然也可以直接在系统根目录下创建datadb文件夹，然后在mongoDB安装文件夹中双击执行mongod.exe。
**3.启动MongoDB服务器**
```
mongod --dbpath 路径 --port 端口号
```
命令行工具中输入：
```
 $ cd C:\Program Files\MongoDB\Server\3.2\bin
 $ mongod.exe
```

在浏览器中输入网址：<http://localhost:27017/> 。如果服务启动成功会看到以下一段话：It looks like you are trying to access MongoDB over HTTP on the native driver port.

**4.连接MongoDB，即启动mongodb客服端**
命令行工具中输入mongo.exe，回车。
如果出现这个警告：2016-07-16T14:49:02.827+0800 I CONTROL [main] Hotfix KB2731284 or later update is not installed, will zero-out data files那是因为Windows缺少一个补丁，从[这个链接](http://hotfixv4.microsoft.com/Windows 7/Windows Server2008 R2 SP1/sp2/Fix405791/7600/free/451413_intl_x64_zip.exe)下周补丁451413_intl_x64_zip，然后解压安装包，在你解压的目录下找到Windows6.1-KB2731284-v3-x64.mus安装文件。安装重启即可。
## MongoDB基本命令
```
use 数据库 -> 进入指定的数据库
show dbs -> 显示所有的数据库
show collections -> 显示数据库中所有的集合
db  -> 显示当前所在的数据库
```

## Robomongo安装以及使用
直接到[官网https://robomongo.org/](https://robomongo.org/)下载安装，安装成功后运行，第一次运行，需要新创建一个连接，如图创建test，点击save保存连接。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163412.png)

选择test，点击connect连接数据库。robomongo会自己搜索你系统里面安装的mongodb并与其连接。如图

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163422.png)

连接成功后，显示你的数据库，在这个节目可以对数据库进行操作。如图：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163432.png)

## Mongoose安装与加载
首先假定你已经安装了 Node.js，命令行工具输入：
```
$ npm install mongoose -g
```
在使用的文件中require("mongoose");即可。

# 使用Mongoose进行CRUD操作

## 使用基本步骤

Mongose基于mongodb的原生方法，自己定义了一套操作MongoDB数据库的接口，比原生方法更加简单方便。为了更加直观，下面的步骤结合例子来讲。假如我需要做一个教务系统，需要存储学生Student的信息，学生信息通常包含姓名name，学号id，电话phone，登录日期date等。我把学生的信息存在mongodb的myDB数据库中，集合的名字叫students。如图：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163441.png)

id这个域你可以自己定义，但如果你没有定义，系统会自动给你加上。下面先介绍在node中通过mongoose对mongodb进行操作的必须前提步骤：
**1.node连接数据库**
```js
mongoose.connect('mongodb://user:pass@ip:port/database');
```
这只是最基本的连接，我们一般还会加一些设置，是否开启调试模式，连接提示等。通常我会这么写：
```js
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

/*调试模式是mongoose提供的一个非常实用的功能，用于查看mongoose模块对mongodb操作的日志，一般开发时会打开此功能，以便更好的了解和优化对mongodb的操作。*/
mongoose.set('debug', true);

/*一般默认没有user和password*/
var db=mongoose.connect('mongodb://localhost/myDB');

db.connection.on("error", function (error) {  
  console.log("数据库连接失败：" + error); 
}); 

db.connection.on("open", function () {  
  console.log("数据库连接成功"); 
});
```

没有mongoose.Promise = global.Promise会出现如下错误（这个错误没有什么影响）：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163459.png)

意思是mongoose自带的promise过期了，然后需要使用v8引擎的promise。

**2.定义模式（Schema）**

每个模式映射mongoDB的一个集合（注意映射这个词，下面会讲为什么），它定义（只是定义，不是实现）这个集合里面文档的结构，就是定义这个文档有什么字段，字段类型是什么，字段默认值是什么等。除了定义结构外，还定义文档的实例方法，静态模型方法，复合索引，中间件等。详情自己查看[mongoose官方文档](http://mongoosejs.com/docs/guide.html)。

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*定义模式Student_Schema*/
var Student_Schema = new Schema({
  name: String,
  id: Number,
  phone: String,
  date: Date
}, {
  versionKey: false
});

/*定义模型Student，注意数据库存的是students*/
mongoose.model("Student", Student_Schema);
```

> <font color="red">mongoose是通过model来创建mongodb中对应的collection的，mongoose在内部创建collection时将我们传递的collection名（‘friendimpression’）小写化，同时如果小写化的名称后面没有字母——s,则会在其后面添加一s,针对我们刚建的collection,则会命名为：friendimpressions。并且其复数变化规则遵循英语语法，例如category会变成categories,而不是categorys</font>

{versionKey: false}是干嘛用？如果不加这个设置，我们通过mongoose第一次创建某个集合时，它会给这个集合设定一个versionKey属性值，这个属性值包含这个文档的内部版本，数据库中显示为v，如图：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163508.png)

通过{versionKey: false}可以配置这个参数，让数据库不再添加这个属性，格式是：new Schema({..}, { versionKey: false });

**3.定义模型（Model）**

模型用来实现我们定义的模式，调用mongoose.model来编译Schema得到Model。<font color="red">而这个Model所能访问数据库的字段由Schema来确定，如果Schema中没有指定的字段，那么Model是一定不能访问的这个字段的</font>

```js
/*定义模型Student，数据库存的是students*/
mongoose.model("Student", Student_Schema);
```

为什么上面我强调模式的映射，那是因为模式仅仅是和db中集合文档的结构相对应（映射），它并不直接在数据库中操作这个结构，模型才是直接与数据库打交道的存在，可以这么说：<font color="red">模式是定义结构，模型是实现操作。当我们使用mongoose.model("Student", Student_Schema)创建Student模型对数据进行操作时，数据库会寻找一个名字叫students集合接受Student模型的操作，特别需要注意的是：1.如果是增加（instance.save）操作时，数据库中没有这个集合，数据库会自动创建这个集合存储数据，这个集合产生规则为：把Model名字字母全部变小写和在后面加复数s。2.如果是删改查三个操作数据库中没有这个集合，那就是没有，删除空修改空返回空。</font>

**4.访问模型**

```js
var MyStudent = mongoose.model("Student");
```

到这里，已经基本完成了使用mongoose前提操作了。有没有觉得有点繁琐，其实我也觉得挺繁琐，幸运的是234可以一步创建：

```js
var MyStudent = mongoose.model('Student',{
  name: String,
  id: Number,
  phone: String,
  date: Date
});
```

**5.创建实例（instance）**

```js
var sam = new MyStudent({
    name: "sam976",
    id: 123,
    phone: "18706888888",
    date: Date.now()
});
```

一般只在save（增加）操作中需要。

<font color="red">模型的实例是集合中真实的数据，就是collection中的document，用mysql中的术语来说就是一条记录</font>。模型在数据库中建好了集合和文档结构后，通过实例往里面添加真实的document。

**捋一捋模式、模型、实例的关系**：模式定义了操作和属性，这些操作和属性包括mongoose自带和自定义，而模型和实例可以对模式里面定义的属性和方法进行引用。模型是mongoose用来和数据库直接打交道的中介，实例是往数据库存的真实数据。模式并非必须，那为什么要分开模式和模型呢？我觉得是遵循了软件设计中“定义和实现分开”这个原则。有的文章说模式没有操作数据库的能力，模型才有，对这个观点，我觉得部分对，虽说模式不能直接操作数据库，但模式定义的方法可以被模型用来操作数据库。官方文档是这么说的：

> Schemas not only define the structure of your document and casting of properties, they also define document instance methods, static Model methods, compound indexes and document lifecycle hooks called middleware.

以上是使用mongoose进行增删查改操作都需要经过的前提步骤，下面正式介绍对数据库的增删查改（CRUD）操作。

## CRUD操作

### create and insert
```js
db.collection.insert()     -> insert()可以向集合中插入一个或多个文档
db.collection.insertOne()  -> 向集合中插入一个文档
db.collection.insertMany() -> 向集合中插入多个文档
```
例：
```js
db.stus.insert({name:"猪八戒",age:28,gender:"男"});

db.stus.insert([
    {name:"沙和尚",age:38,gender:"男"},
    {name:"白骨精",age:16,gender:"女"},
    {name:"蜘蛛精",age:14,gender:"女"}
]);

db.stus.insert({_id:"hello",name:"猪八戒",age:28,gender:"男"});

db.stus.find();

ObjectId()
```
使用模型创建sam实例，sam实例调用save方法把document存入数据库的students集合中，代码如下
```js
var MyStudent = mongoose.model("Student");
var sam = new MyStudent({
    name: "sam976",
    id: 123,
    phone: "18706888888",
    date: Date.now()
});
sam.save(function(err) {});
```

通过robomongo查看数据库，可以看到数据已经存放成功，如图

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163521.png)

### read
```js
db.collection.find() -> 可以根据指定条件从集合中查询所有符合条件的文档 返回的是一个数组
db.collection.findOne() -> 查询第一个符合条件的文档, 返回的是一个对象
db.collection.find().count() ->查询符合条件的文档的数量
```

使用MyStudent模型调用find()方法返回students集合的所有内容，第一个参数定义条件，第二个参数是回调函数，回调函数中的docs是返回的是查找结果，结果形式为一个<font color="red">json数据数组[{},{}]。</font>

```js
var MyStudent = mongoose.model("Student");
MyStudent.find({}, function(err, docs) {});
```

比如数据库students集合中，有如下数据：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163530.png)

运行上面代码，结果console.log输出显示如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163542.png)

模型还可以调用其他很多查询的函数，比如
```js
Model.findById(id, [projection], [options], [callback])；
Model.findOne([conditions], [projection], [options], [callback])；
```

篇幅较多，这里不摊开来讲（以后会专门出一篇介绍），可以自己查看[官方文档关于Querying介绍](http://mongoosejs.com/docs/models.html)

### update
```js
db.collection.update(查询条件,新对象) ->默认情况下会使用新对象来替换旧的对象
- 如果需要修改指定的属性，而不是替换需要使用“修改操作符”来完成修改
    $set 可以用来修改文档中的指定属性
    $unset 可以用来删除文档的指定属性
- update()默认只会修改一个

db.collection.updateMany() ->同时修改多个符合条件的文档

db.collection.updateOne() ->修改一个符合条件的文档    

db.collection.replaceOne() ->替换一个文档
```

使用MyStudent模型调用update()方法完成更新，第一个参数是条件（也就是where name="sam976"），第二个参数修改的内容。
```js
var MyStudent = mongoose.model("Student");
MyStudent.update({name:"sam976"},{id:456,phone:"12345678910"}, function(error){});
```
运行如上代码前，如图

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163600.png)

运行如上代码后，如图

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163610.png)

### delete
```js
db.collection.remove() -> 删除一个或多个，可以第二个参数传递一个true，则只会删除一个
        - 如果传递一个空对象作为参数，则会删除所有的
db.collection.deleteOne()
db.collection.deleteMany()
db.collection.drop() 删除集合
db.dropDatabase() 删除数据库
```
使用MyStudent模型调用remove()方法删除文档。
```js
var MyStudent = mongoose.model("Student");
MyStudent.remove({ name: 'sam976' }, function (err) {});
```

## sort和投影
```js
//查询文档时，默认情况是按照_id的值进行排列（升序）
//sort()可以用来指定文档的排序的规则,sort()需要传递一个对象来指定排序规则 1表示升序 -1表示降序
//limit skip sort 可以以任意的顺序进行调用
db.emp.find({}).sort({sal:1,empno:-1});

//在查询时，可以在第二个参数的位置来设置查询结果的 投影
db.emp.find({},{ename:1 , _id:0 , sal:1});
```

## 示例
test.comments

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163620.png)

```js
//发表评论功能
router.post('/api/postcomment/:id',function(req, res){
    var commentId =  req.params.id
    var comment  = {}
    comment.user_name = "userName"
    comment.content = req.body.content
    comment.add_time = new Date().toLocaleString()
    var Schema = mongoose.Schema
    var commentsSchema = new Schema({
        id:Number,
        messages:Array
    })
    console.log(comment)
    var comments = mongoose.model("comments",commentsSchema)
    comments.updateOne({id:commentId},{$push:{"messages":comment}}, function(err){
        console.log(err)
    })
    comments.findOne({id:commentId},function(err, docs){
        console.log(docs)
    })
    res.send({
        "status":0,
        "message":"评论提交成功"
    })
})
```

输出：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409163631.png)

## 练习
```js
//1.进入my_test数据库
use my_test

//2.向数据库的user集合中插入一个文档  
db.users.insert({
    username:"sunwukong"
});

//3.查询user集合中的文档
db.users.find();

//4.向数据库的user集合中插入一个文档   
db.users.insert({
    username:"zhubajie"
});

//5.查询数据库user集合中的文档
db.users.find();

//6.统计数据库user集合中的文档数量
db.users.find().count();

//7.查询数据库user集合中username为sunwukong的文档
db.users.find({username:"sunwukong"});

//8.向数据库user集合中的username为sunwukong的文档，添加一个address属性，属性值为huaguoshan
db.users.update({username:"sunwukong"},{$set:{address:"huaguoshan"}});

//9.使用{username:"tangseng"} 替换 username 为 zhubajie的文档
db.users.replaceOne({username:"zhubajie"},{username:"tangseng"});

//10.删除username为sunwukong的文档的address属性
db.users.update({username:"sunwukong"},{$unset:{address:1}});

//11.向username为sunwukong的文档中，添加一个hobby:{cities:["beijing","shanghai","shenzhen"] , movies:["sanguo","hero"]}
//MongoDB的文档的属性值也可以是一个文档，当一个文档的属性值是一个文档时，我们称这个文档叫做 内嵌文档
db.users.update({username:"sunwukong"},{$set:{hobby:{cities:["beijing","shanghai","shenzhen"] , movies:["sanguo","hero"]}}});
db.users.find();

//12.向username为tangseng的文档中，添加一个hobby:{movies:["A Chinese Odyssey","King of comedy"]}
db.users.update({username:"tangseng"},{$set:{hobby:{movies:["A Chinese Odyssey","King of comedy"]}}})

//13.查询喜欢电影hero的文档
//MongoDB支持直接通过内嵌文档的属性进行查询，如果要查询内嵌文档则可以通过.的形式来匹配
//如果要通过内嵌文档来对文档进行查询，此时属性名必须使用引号 
db.users.find({'hobby.movies':"hero"});

//14.向tangseng中添加一个新的电影Interstellar
//$push 用于向数组中添加一个新的元素
//$addToSet 向数组中添加一个新元素 ， 如果数组中已经存在了该元素，则不会添加
db.users.update({username:"tangseng"},{$push:{"hobby.movies":"Interstellar"}});
db.users.update({username:"tangseng"},{$addToSet:{"hobby.movies":"Interstellar"}});
db.users.find();

//15.删除喜欢beijing的用户
db.users.remove({"hobby.cities":"beijing"});

//16.删除user集合
db.users.remove({});
db.users.drop();

show dbs;

//17.向numbers中插入20000条数据 7.2s
for(var i=1 ; i<=20000 ; i++){
    db.numbers.insert({num:i});
}

db.numbers.find()

db.numbers.remove({});

//0.4s
var arr = [];

for(var i=1 ; i<=20000 ; i++){
    arr.push({num:i});
}

db.numbers.insert(arr);

//18.查询numbers中num为500的文档
db.numbers.find({num:500})

//19.查询numbers中num大于5000的文档
db.numbers.find({num:{$gt:500}});
db.numbers.find({num:{$eq:500}});

//20.查询numbers中num小于30的文档
db.numbers.find({num:{$lt:30}});

//21.查询numbers中num大于40小于50的文档
db.numbers.find({num:{$gt:40 , $lt:50}});

//22.查询numbers中num大于19996的文档
db.numbers.find({num:{$gt:19996}});

//23.查看numbers集合中的前10条数据
db.numbers.find({num:{$lte:10}});

//limit()设置显示数据的上限
db.numbers.find().limit(10);
//在开发时，我们绝对不会执行不带条件的查询
db.numbers.find();

//24.查看numbers集合中的第11条到20条数据
/*
    分页 每页显示10条
        1-10     0
        11-20    10
        21-30    20
        。。。
        skip((页码-1) * 每页显示的条数).limit(每页显示的条数);
    skip()用于跳过指定数量的数据    
    MongoDB会自动调整skip和limit的位置
*/
db.numbers.find().skip(10).limit(10);

//25.查看numbers集合中的第21条到30条数据
db.numbers.find().skip(20).limit(10);

db.numbers.find().limit(10).skip(10);

//26.将dept和emp集合导入到数据库中
db.dept.find()
db.emp.find()

//27.查询工资小于2000的员工
db.emp.find({sal:{$lt:2000}});

//28.查询工资在1000-2000之间的员工
db.emp.find({sal:{$lt:2000 , $gt:1000}});

//29.查询工资小于1000或大于2500的员工
db.emp.find({$or:[{sal:{$lt:1000}} , {sal:{$gt:2500}}]});

//30.查询财务部的所有员工
//(depno)
var depno = db.dept.findOne({dname:"财务部"}).deptno;
// var depno = db.dept.find({dname:"财务部"}).deptno;这种将find代替findOne的方法
//是不可行的，因为find()返回的是一个数组，不能直接访问文档的属性，而findONe()返回的是一个文档，
//如果要用find(),则使用var depno = db.dept.find({dname:"财务部"})[0].deptno;
db.emp.find({depno:depno});


//31.查询销售部的所有员工
var depno = db.dept.findOne({dname:"销售部"}).deptno;
db.emp.find({depno:depno});

//32.查询所有mgr为7698的所有员工
db.emp.find({mgr:7698})

//33.为所有薪资低于1000的员工增加工资400元
db.emp.updateMany({sal:{$lte:1000}} , {$inc:{sal:400}});
db.emp.find()

```

## 源码结构

使用mongoose的时候，通常会在项目中创建三个文件：connect.js，mongoose-db.js，app.js。

其中connect.js存放的是连接数据库的操作，我们只需要加载一次即可在程序运行期间一直连接数据库。

mongoose-db.js文件存放模式和模型的生成的代码，没有连接信息，也没有其他额外不相干代码，可以在在mongoose-db.js中把模型exports公开：

```js
var MyStudent = mongoose.model("Student", Student_Schema);
exports.MyStudent=MyStudent;

/*定义其他模型和模式*/
var MyTeacher = mongoose.model("Teacher", Teacher_Schema);
exports.MyTeacher=MyTeacher;
```

然后在app.js中引用：

```js
var MyStudent = require("./mongoose-db").MyStudent;
var MyTeacher = require("./mongoose-db").MyTeacher;
```

app.js存放对数据库的操作，比如CRUD。通过这样的方式，结构比较清晰，代码可读性大大增强。

下面放源码（目的是给自己备份，笑脸...）

> connect.js

```js
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;//为了解决过期的问题
/*调试模式是mongoose提供的一个非常实用的功能，用于查看mongoose模块对mongodb操作的日志，一般开发时会打开此功能，以便更好的了解和优化对mongodb的操作。*/
mongoose.set('debug', true);
/*mongoose会缓存命令，只要connect成功，处于其前其后的命令都会被执行，connect命令也就无所谓放哪里*/
var db=mongoose.connect('mongodb://localhost/myDB');

db.connection.on("error", function (error) {  
  console.log("数据库连接失败：" + error); 
});

db.connection.on("open", function () {  
  console.log("数据库连接成功"); 
```

> mongoose-db.js

```js
require('./connect');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*定义模式Student_Schema*/
var Student_Schema = new Schema({
  name: String,
  id: Number,
  phone: String,
  date: Date

}, {
  versionKey: false
});

/*定义模型Student，数据库存的是students*/
var MyStudent = mongoose.model("Student", Student_Schema);
exports.MyStudent=MyStudent;

/*mongoose.Schema({
  username: {// 真实姓名
    type: String,
    required: true
  },
  password: { // 密码
    type: String,
    required: true
  }
});*/
```

> app.js
