# 常见包下的类
| 包                | 类                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| java.lang         | Math, String, StringBuffer, Integer, Comparable, Iterable, Thread,Runnable, Runtime, Exception     |
| java.lang.reflect | Field, InvocationHandler, Proxy, Method                                                            |
| java.lang.annotation |  ElementType, Retention, RetentionPolicy, Target等                                            |
| java.util         | Arrays, 所有集合类(如ArrayList)，所有Map类(如HashMap)，Collections，Comparator, Iterator，Optional |
| java.io           | File, InputStream, IOException                                                                     |

程序运行时会自动引入`Java.lang.*`

# classpath和jar
## classpath

在Java中，我们经常听到classpath这个东西。网上有很多关于“如何设置classpath”的文章，但大部分设置都不靠谱。

到底什么是classpath？

classpath是JVM用到的一个环境变量，它用来指示JVM如何搜索class。

因为Java是编译型语言，源码文件是.java，而编译后的.class文件才是真正可以被JVM执行的字节码。因此，JVM需要知道，如果要加载一个abc.xyz.Hello的类，应该去哪搜索对应的Hello.class文件。

所以，classpath就是一组目录的集合，它设置的搜索路径与操作系统相关。例如，在Windows系统上，用;分隔，带空格的目录用""括起来，可能长这样：
```
C:\work\project1\bin;C:\shared;"D:\My Documents\project1\bin"
```

在Linux系统上，用:分隔，可能长这样：
```
/usr/shared:/usr/local/bin:/home/liaoxuefeng/bin
```

现在我们假设classpath是`.;C:\work\project1\bin;C:\shared`，当JVM在加载`abc.xyz.Hello`这个类时，会依次查找：
- <当前目录>\abc\xyz\Hello.class
- C:\work\project1\bin\abc\xyz\Hello.class
- C:\shared\abc\xyz\Hello.class

注意到.代表当前目录。如果JVM在某个路径下找到了对应的class文件，就不再往后继续搜索。如果所有路径下都没有找到，就报错。

classpath的设定方法有两种：
- 在系统环境变量中设置classpath环境变量，不推荐；
- 在启动JVM时设置classpath变量，推荐。

我们强烈不推荐在系统环境变量中设置classpath，那样会污染整个系统环境。在启动JVM时设置classpath才是推荐的做法。实际上就是给java命令传入-classpath或-cp参数：
```
java -classpath .;C:\work\project1\bin;C:\shared abc.xyz.Hello
```
或者使用-cp的简写：
```
java -cp .;C:\work\project1\bin;C:\shared abc.xyz.Hello
```
没有设置系统环境变量，也没有传入-cp参数，那么JVM默认的classpath为.，即当前目录：
```
java abc.xyz.Hello
```
上述命令告诉JVM只在当前目录搜索Hello.class。

在IDE中运行Java程序，IDE自动传入的-cp参数是当前工程的bin目录和引入的jar包。

通常，我们在自己编写的class中，会引用Java核心库的class，例如，String、ArrayList等。这些class应该上哪去找？

有很多“如何设置classpath”的文章会告诉你把JVM自带的rt.jar放入classpath，但事实上，根本不需要告诉JVM如何去Java核心库查找class，JVM怎么可能笨到连自己的核心库在哪都不知道？

>不要把任何Java核心库添加到classpath中！JVM根本不依赖classpath加载核心库！

更好的做法是，不要设置classpath！默认的当前目录.对于绝大多数情况都够用了。

假设我们有一个编译后的Hello.class，它的包名是com.example，当前目录是C:\work，那么，目录结构必须如下：

C:\work
└─ com
   └─ example
      └─ Hello.class
运行这个Hello.class必须在当前目录下使用如下命令：
```
C:\work> java -cp . com.example.Hello
```

JVM根据classpath设置的.在当前目录下查找com.example.Hello，即实际搜索文件必须位于com/example/Hello.class。如果指定的.class文件不存在，或者目录结构和包名对不上，均会报错

## jar包
如果有很多.class文件，散落在各层目录中，肯定不便于管理。如果能把目录打一个包，变成一个文件，就方便多了。

jar包就是用来干这个事的，它可以把package组织的目录层级，以及各个目录下的所有文件（包括.class文件和其他文件）都打成一个jar文件，这样一来，无论是备份，还是发给客户，就简单多了。

jar包实际上就是一个zip格式的压缩文件，而jar包相当于目录。如果我们要执行一个jar包的class，就可以把jar包放到classpath中：
```
java -cp ./hello.jar abc.xyz.Hello
```
这样JVM会自动在hello.jar文件里去搜索某个类。

那么问题来了：如何创建jar包？

因为jar包就是zip包，所以，直接在资源管理器中，找到正确的目录，点击右键，在弹出的快捷菜单中选择“发送到”，“压缩(zipped)文件夹”，就制作了一个zip文件。然后，把后缀从.zip改为.jar，一个jar包就创建成功。

假设编译输出的目录结构是这样：

package_sample
└─ bin
   ├─ hong
   │  └─ Person.class
   │  ming
   │  └─ Person.class
   └─ mr
      └─ jun
         └─ Arrays.class
这里需要特别注意的是，jar包里的第一层目录，不能是bin，而应该是hong、ming、mr。如果在Windows的资源管理器中看，应该长这样：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130249.png)

如果长这样：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130315.png)

说明打包打得有问题，JVM仍然无法从jar包中查找正确的class，原因是hong.Person必须按hong/Person.class存放，而不是bin/hong/Person.class。

jar包还可以包含一个特殊的/META-INF/MANIFEST.MF文件，MANIFEST.MF是纯文本，可以指定Main-Class和其它信息。JVM会自动读取这个MANIFEST.MF文件，如果存在Main-Class，我们就不必在命令行指定启动的类名，而是用更方便的命令：
```
java -jar hello.jar
```
jar包还可以包含其它jar包，这个时候，就需要在MANIFEST.MF文件里配置classpath了。

在大型项目中，不可能手动编写MANIFEST.MF文件，再手动创建zip包。Java社区提供了大量的开源构建工具，例如Maven，可以非常方便地创建jar包。

### META-INF/MANIFEST.MF文件
打开Java的JAR文件我们经常可以看到文件中包含着一个META-INF目录， 这个目录下会有一些文件，其中必有一个MANIFEST.MF，这个文件描述了该Jar文件的很多信息，下面将详细介绍MANIFEST.MF文件的内 容，先来看struts.jar中包含的MANIFEST.MF文件内容：
```
Manifest-Version: 1.0
Created-By: Apache Ant 1.5.1
Extension-Name: Struts Framework
Specification-Title: Struts Framework
Specification-Vendor: Apache Software Foundation
Specification-Version: 1.1
Implementation-Title: Struts Framework
Implementation-Vendor: Apache Software Foundation
Implementation-Vendor-Id: org.apache
Implementation-Version: 1.1
Class-Path:  commons-beanutils.jar commons-collections.jar commons-dig
 ester.jar commons-logging.jar commons-validator.jar jakarta-oro.jar s
 truts-legacy.jar
```
如果我们把MANIFEST中的配置信息进行分类，可以归纳出下面几个大类：

#### 一般属性
1. Manifest-Version
用来定义manifest文件的版本，例如：Manifest-Version: 1.0
2. Created-By
声明该文件的生成者，一般该属性是由jar命令行工具生成的，例如：Created-By: Apache Ant 1.5.1
3. Signature-Version
定义jar文件的签名版本
4. Class-Path
应用程序或者类装载器使用该值来构建内部的类搜索路径

#### 应用程序相关属性
1. Main-Class
定义jar文件的入口类，该类必须是一个可执行的类，一旦定义了该属性即可通过 java -jar x.jar来运行该jar文件。

#### 小程序(Applet)相关属性
1. Extendsion-List
该属性指定了小程序需要的扩展信息列表，列表中的每个名字对应以下的属性
2. `<extension>-Extension-Name`
3. `<extension>-Specification-Version`
4. `<extension>-Implementation-Version`
5. `<extension>-Implementation-Vendor-Id`
6. `<extension>-Implementation-URL`

#### 扩展标识属性
1. Extension-Name
该属性定义了jar文件的标识，例如Extension-Name: Struts Framework

#### 包扩展属性
1. Implementation-Title   定义了扩展实现的标题
2. Implementation-Version   定义扩展实现的版本
3. Implementation-Vendor   定义扩展实现的组织  
4. Implementation-Vendor-Id   定义扩展实现的组织的标识
5. Implementation-URL :   定义该扩展包的下载地址(URL)
6. Specification-Title   定义扩展规范的标题
7. Specification-Version   定义扩展规范的版本
8. Specification-Vendor   声明了维护该规范的组织
9. Sealed   定义jar文件是否封存，值可以是true或者false (这点我还不是很理解)

#### 签名相关属性
签名方面的属性我们可以来参照JavaMail所提供的mail.jar中的一段
Name: javax/mail/Address.class
Digest-Algorithms: SHA MD5 
SHA-Digest: AjR7RqnN//cdYGouxbd06mSVfI4=
MD5-Digest: ZnTIQ2aQAtSNIOWXI1pQpw==

这段内容定义类签名的类名、计算摘要的算法名以及对应的摘要内容(使用BASE方法进行编码)

#### 自定义属性
除了前面提到的一些属性外，你也可以在MANIFEST.MF中增加自己的属性以及响应的值，例如J2ME程序jar包中就可能包含着如下信息

MicroEdition-Configuration: CLDC-1.0
MIDlet-Name: J2ME_MOBBER Midlet Suite
MIDlet-Info-URL: http://www.javayou.com
MIDlet-Icon: /icon.png
MIDlet-Vendor: Midlet Suite Vendor
MIDlet-1: mobber,/icon.png,mobber
MIDlet-Version: 1.0.0
MicroEdition-Profile: MIDP-1.0
MIDlet-Description: Communicator

关键在于我们怎么来读取这些信息呢？其实很简单，JDK给我们提供了用于处理这些信息的API，详细的信息请见java.util.jar包中，我们可以通 过给JarFile传递一个jar文件的路径，然后调用JarFile的getManifest方法来获取Manifest信息。

更详细关于JAR文件的规范请见
http://java.sun.com/j2se/1.3/docs/guide/jar/jar.html
中文说明
http://www-900.ibm.com/developerWorks/cn/java/j-jar/

### jar工具
为了用 JAR 文件执行基本的任务，要使用作为java Development Kit 的一部分提供的 Java Archive Tool ( jar 工具)。用 jar 命令调用 jar 工具。

|功能 |命令|
|--|--|
|用一个单独的文件创建一个 JAR 文件 | jar cf jar-file input-file...|
|用一个目录创建一个 JAR 文件 | jar cf jar-file dir-name|
|创建一个未压缩的 JAR 文件 |jar cf0 jar-file dir-name|
|更新一个 JAR 文件 | jar uf jar-file input-file...|
|查看一个 JAR 文件的内容 | jar tf jar-file|
|提取一个 JAR 文件的内容 | jar xf jar-file|
|从一个 JAR 文件中提取特定的文件 | jar xf jar-file archived-file...|
|运行一个打包为可执行 JAR 文件的应用程序 | java -jar app.jar|

## 小结
JVM通过环境变量classpath决定搜索class的路径和顺序；
不推荐设置系统环境变量classpath，始终建议通过-cp命令传入；
jar包相当于目录，可以包含很多.class文件，方便下载和使用；
MANIFEST.MF文件可以提供jar包的信息，如Main-Class，这样可以直接运行jar包。

# 使用java编译多个文件
例如当前的java项目结构如下：
```shell
wanghengzhi@:~/Temp/java/spring$ tree
.
└── whz
    └── com
        ├── java
        │   ├── AppConfig.java
        │   └── Test.java
        └── spring
            ├── Component.java
            ├── ComponentScan.java
            ├── Configuration.java
            ├── NotConfigurationException.java
            └── WhzApplicationContext.java

4 directories, 7 files
```
其中Test.java代码如下：
```java
package whz.com.java;

import whz.com.spring.WhzApplicationContext;
import whz.com.spring.NotConfigurationException;
import whz.com.java.AppConfig;

public class Test{
  public static void main(String[] args) throws NotConfigurationException{
    WhzApplicationContext whzApplicationContext = new WhzApplicationContext(AppConfig.class);
    whzApplicationContext.getBean(null);
  }
}
```
我们可以使用如下命令来编译这个项目
```shell
wanghengzhi@:~/Temp/java/spring$ javac -d classes $(find . -name '*.java')
```
编译完成后的目录结构如下:
```shell
wanghengzhi@:~/Temp/java/spring$ tree
.
├── classes
│   └── whz
│       └── com
│           ├── java
│           │   ├── AppConfig.class
│           │   └── Test.class
│           └── spring
│               ├── Component.class
│               ├── ComponentScan.class
│               ├── Configuration.class
│               ├── NotConfigurationException.class
│               └── WhzApplicationContext.class
└── whz
    └── com
        ├── java
        │   ├── AppConfig.java
        │   └── Test.java
        └── spring
            ├── Component.java
            ├── ComponentScan.java
            ├── Configuration.java
            ├── NotConfigurationException.java
            └── WhzApplicationContext.java

9 directories, 14 files
```

# java中的数据类型与类型转换
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130336.png)

Java基本类型基本： byte,short,char  <  int  <  long  <  float  <  double
表达式中的类型会自动提升到表达式中类型最高的一级
基本类型比较大小时，比较符两边的类型会自动提升到较高的一级
```java
int a = 5;
double b = 5.0;
System.out.println(a == b) //true
```

java基本类型中基本高的不能自动转换为级别低的， 如果不进行强转，则会报错。
使用`-=`, `+=`, `/=`, `%=`会自动完成完成强转转换，而`=`不行

java中的整形常量默认为int型，声明long型常量可以在后面加`l`或`L`
java中的浮点型常量默认为double型，声明float型常量可以在后面加`f`或`F`

## float f = 3.5是否正确
不正确

## short s1=1; s1=s1+1有错吗？ short s1=1; s1+=1有错吗
第一个有错，第二个没错

## Switch是否能作用在byte、long、string上
在java5以前，switch(expr)中，expr只能是byte、short、int、char。从java5开始，java中引入了枚举型，expr也可以是enum类型，从java7开始，expr还可以是String。
其实，expr准确的说，数值型的只可以是int类型，但是 byte, short, char 都可以自动转换成 int 类型，所以expr也可以是byte, short, char。当然了，对应的包装类也是可以自动转换，所以x也可以是包装类型的。
无论哪个版本的JDK，都是不支持 long，float，double，boolean 这个一定要注意！
因为在Float/Double上执行精确的相等匹配通常是个坏主意。

# 包装类
Java中每一种基本类型都会对应一个唯一的包装类，基本类型与其包装类都可以通过包装类中的静态或者成员方法进行转换。每种基本类型及其包装类的对应关系如下，值得注意的是，所有的包装类都是final修饰的，也就是它们都是无法被继承和重写的。

| 基本数据类型 | 包装类    |
| ------------ | --------- |
| byte         | Byte      |
| short        | Short     |
| int          | Integer   |
| long         | Long      |
| float        | Float     |
| double       | Double    |
| char         | Character |
| boolean      | Boolean   |


## 包装类与基本类型的转换（装箱与拆箱）
- 自动装箱：自动将基本类型用它们对应的包装类包装起来；
- 自动拆箱：自动将包装类型转换为基本数据类型；
注：包装类数组与基本类型数组之间不会自动转换，并且也不能强转。因为数组是引用类型，引用类型之间的转换必须要满足<a href="#convert">转换的条件</a>
```java
int a = 1;
Integer b = a; // a类型会自动装箱
int c = b; //b类型会自动拆箱

int[] d = (int[])new Integer[1]; //报错，不能Integer[]不能强转为int[]
Integer e = (Integer[])new int[1];//报错，不能int[]不能强转为Integer[]
```
从源代码的角度来看，基础类型和包装类型都可以通过赋值语法赋值给对立的变量类型，如下面的代码所示。
```java
Integer a = 1;
int a = new Integer(1);
```
这种语法是可以通过编译的。但是，Java作为一种强类型的语言，对象直接赋值给引用类型变量，而基础数据只能赋值给基本类型变量，这个是毫无异议的。那么基本类型和包装类型为什么可以直接相互赋值呢？这其实是Java中的一种“语法糖”。“语法糖”是指计算机语言中添加的某种语法，这种语法对语言的功能并没有影响，但是更方便程序员使用。通常来说使用语法糖能够增加程序的可读性，从而减少程序代码出错的机会（来自百度百科）。换句话说，这其实是一种障眼法，那么实际上是怎么样的呢？下面是Integer a = 1;语句编译的字节码。
```
0: iconst_1
1: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
4: astore_1
```
首先，生成一个常量1，然后调用Integer.valueOf(int)方法返回Integer对象，最后将对象的地址（引用）赋值给变量a。Integer a = 1;其实相当于Integer a = Integer.valueOf(1);。

其他的包装类都是类似的，下表是所有包装类中的类型转换方法。

| 包装类    | 基本类型转包装类          | 包装类转基本类型               |
| --------- | ------------------------- | ------------------------------ |
| Byte      | Byte.valueOf(byte)        | byteInstance.byteValue()       |
| Short     | Short.valueOf(short)      | shortInstance.shortValue()     |
| Integer   | Integer.valueOf(int)      | integerInstance.intValue()     |
| Long      | Long.valueOf(long)        | longInstance.longValue()       |
| Float     | Float.valueOf(float)      | floatInstance.floatValue()     |
| Double    | Double.valueOf(double)    | doubleInstance.doubleValue()   |
| Character | Character.valueOf(char)   | charInstance.charValue()       |
| boolean   | Boolean.valueOf(booleann) | booleanInstance.booleanValue() |


## “莫名其妙”的NullPointException
在笔者开发经历中，碰到过不少因为请求参数或者接口定义字段设置为int（或者其他基本类型）而导致NullPointException。代码大致地运行步骤如下所示，当然不会跟这个完全一样。
```java
Integer a = null;
...
int b = a; // 抛出NullPointException
```
上面的代码可以编译通过，但是会抛出空指针异常（NullPointException）。前面已经说过了，int b = a实际上是int b = a.intValue()，由于a的引用值为null，在空对象上调用方法就会抛出NullPointException。

## 两个包装类引用相等性(享元模式)
在Java中，“==”符号判断的内存地址所对应的值得相等性，具体来说，基本类型判断值是否相等，引用类型判断其指向的地址是否相等。看看下面的代码，两种类似的代码逻辑，但是得到截然不用的结果。
```java
Integer a1 = 1;
Integer a2 = 1;
System.out.println(a1 == a2); // true

Integer b1 = 222;
Integer b2 = 222;
System.out.println(b1 == b2); // false

Integer c1 = new Integer(1);
Integer c2 = 1;
System.out.println(c1 == c2); // false

Integer d1 = new Integer(1);
Integer d2 = new Integer(1)
System.out.println(d1 == d2); // false
```
这个必须从源代码中才能找到答案。Integer类中的valueOf()方法的源代码如下：
```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high) // 判断实参是否在可缓存范围内，默认为[-128, 127]
        return IntegerCache.cache[i + (-IntegerCache.low)]; // 如果在，则取出初始化的Integer对象
    return new Integer(i); // 如果不在，则创建一个新的Integer对象
}
```
由于1属于[-128, 127]集合范围内，所以valueOf()每次都会取出同一个Integer对象，故第一个“”判断结果为true；而222不属于[-128, 127]集合范围内，所以valueOf()每次都会创建一个新的Integer对象，由于两个新创建的对象的地址不一样，故第一个“”判断结果为false。

# 基本类型及引用类型的大小比较问题
## 基本类型的比较
直接使用>、>=、<、<=、==即可；

## 引用类型的比较
**引用类型使用>、>=、<、<=会报错**。如下：
```java
String a = "ac";
String b = "dd"
if(a > b){ //会报错, 说不支持>操作符
  System.out.println("jfkdfj");
}
```
我们应该使用使用Comparable接口中的compareTo() 方法进行比较或使用 Comparator接口中的compare()方法进行比较。
正确的比较方法：
```java
String a = "ac";
String b = "dd"
if(a.compareTo(b)){ 
  System.out.println("jfkdfj");
}
```

**引用类型使用==时，是比较的对象地址。而不是调用equals或compareTo方法**
```java
class Person{
  public boolean equals(Object object){return true;}
}
public class Te {
  public static void main(String[] args) throws Exception{
    Person a = new Person();
    Person b = new Person();
    System.out.println(a==b);//false
  }
}
```

# &和&&区别(位运算、逻辑运算、短路运算)
首先&运算符有两种用法：一种是位运算符，另一种是逻辑运算符
而&&是短路运算符，逻辑与跟短路与的差别是非常巨大的，虽然二者都要求运算符左右两端的布尔值都是true整个表达式的值才是true。&&之所以称为短路运算，是因为如果&&左边的表达式的值是false，右边的表达式会被直接短路掉，不会进行运算。而逻辑运算符一定是会把两端都算一边
注意：`|`的`||`的区别也是如此
```java
public static void main(String[] args){
  int a = 10;
  int b =1;
  System.out.println(a > 1 | ++b >= 2);//true
  System.out.println(b); //2
}
```

# JNI字段描述符基础知识
```java
int[] a = {1};
Integer[] b = {1};
System.out.println(a.getClass().getName()); // 输出：[I
System.out.println(b.getClass().getName()); // 输出：[Ljava.lang.Integer;
```
上述的`[I`与`[Ljava.lang.Integer`就是*JNI字段描述符【Java Native Interface FieldDescriptors】*，它是一种对 Java 数据类型、数组、方法的编码。此外，在 Android 逆向分析中，通过反汇编得到的 smali 文件，里面的代码也会遵循这种方式，即 Dalvik 字节码。本文就记录一些数据类型、数组、方法的编码方式以及解释说明，方便以后查阅。

**基本概念**
这种编码方式把 Java 中的基本数据类型、数组、对象都使用一种规范来表示：
- 八种基本数据类型都使用一个大写字母表示
- void 使用 V 表示
- 数组使用左方括号表示
- 方法使用一组圆括号表示，参数在括号里，返回类型在括号右侧
- 对象使用 L 开头，分号结束，中间是类的完整路径，包名使用正斜杠分隔
- 基本编码

**基本编码如下表格，并配有解释说明：**
| Java 类型            | JNI 字段描述符                                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| boolean              | Z                                                                                                                                                          |
| byte                 | B                                                                                                                                                          |
| char                 | C                                                                                                                                                          |
| short                | S                                                                                                                                                          |
| int                  | I                                                                                                                                                          |
| long                 | J                                                                                                                                                          |
| float                | F                                                                                                                                                          |
| double               | D                                                                                                                                                          |
| void                 | V                                                                                                                                                          |
| 引用类型(包括包装类) | 以 L 开头，以；结尾，中间是使用 / 隔开的完整包名、类型。例如：Ljava/lang/String;。如果是内部类，添加 $ 符号分隔，例如：Landroid/os/FileUtils$FileStatus;。 |
| 数组                 | [                                                                                                                                                          |
| 方法                 | 使用 () 表示，参数在圆括号里，返回类型在圆括号右侧，例如：(II) Z，表示 boolean func (int i,int j)。                                                        |

**举例说明**
**数据类型**
- [I：表示 int 一维数组，即 int[]。
- `[Ljava/lang/Integer：表示Integer一维数组，即Integer[]`
- [[I:表示 int 二维数组，即 `int[][]`。 
- Ljava/lang/String;：表示 String 类型，即 java.lang.String。
- [Ljava/lang/Object;：表示 Object 一维数组，即 java.lang.Object []。
- Z：表示 boolean 类型。
- V：表示 void 类型。

**方法**
- () V：表示参数列表为空，返回类型为 void 的方法，即 void func ()。
- (II) V：表示参数列表为 int、int，返回类型为 void 的方法，即 void func (int i,int j)。
- (Ljava/lang/String;Ljava/lang/String;) I：表示参数列表为 String、String，返回类型为 int 的方法，即 int func (String i,String j)。
- ([B) V：表示参数列表为 byte []，返回类型为 void 的方法，即 void func (byte [] bytes)。
- (ILjava/lang/Class;) J：表示参数列表为 int、Class，返回类型为 long 的方法，即 long func (int i,Class c)。

# 实参与形参
- 形参出现在函数定义中，在整个函数体内都可以使用， 离开该函数则不能使用。
- 实参出现在主调函数中，进入被调函数后，实参变量也不能使用。 

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131057.png)

# 成员变量(域)与局部变量
- 成员变量有2次初始化的机会，第一次是在“准备阶段”，执行系统初始化，对类变量设置零值，另一次则是在“初始化”阶段，赋予程序员在代码中定义的初始值
- 和成员变量初始化不同的是，局部变量不存在系统初始化过程，这意味着一旦定义了局部变量则必须要人为的初始化，否则无法使用
```java
public void test(){
  int i;
  System.out.println(i);
}
```
这样的代码是错误的
但注意：局部变量数组new后，会默认进行初始化：
```java
public class Te {
  public static void main(String[] args) {
    Test t = new Test();
    t.test();
  }
}
class Test{
  public void test(){
    int[] arr = new int[4];
    System.out.println(Arrays.toString(arr)); //输出：[0, 0, 0, 0]
  }
}
```

# 类变量与全局变量
**类变量**
类变量也称为静态变量，是和类关联在一起，随着类的加载而加载，他们称为类数据在逻辑上的一部分。
类变量被类的所有实例共享，即使没有类实例时你也可以访问它, 如下，null能访问count
```java
public class Test{
  public static void main(String[] args){
    Order order = null;
    oder.hello();
    System.out.println(order.count);  // 输出：1
  }
}
class Order{
  public static int count = 1; 
  public static void hello(){
    System.out.println("hello:");
  }
}
```

**全局常量**
声明为`static final`的变量称为全局常量，此时与类变量不同的是，全局常量在编译成class文件就将其赋值了
如下:
```java
public class Math{
  public static int a = 1; 
  public static final int b = 1; 

  public static void main(String[] args){
    
  }
}
```
其字节码文件
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131109.png)

# final与static final的区别
当使用final修饰变量时，该变量只能在定义处、静态代码块、构造函数中赋值
当使用static final修饰变量时，该变量只能在定义处、静态代码块中赋值

# this和super的用法总结
## this
this 是自身的一个对象，代表对象本身，可以理解为：指向对象本身的一个指针。
this 的用法在 Java 中大体可以分为3种：
1. **普通的直接引用**
这种就不用讲了，this 相当于是指向当前对象本身。

2. **形参与成员名字重名，用 this 来区分** 
```java
class Person {
    private int age = 10;
    public Person(){
    System.out.println("初始化年龄："+age);
}
    public int GetAge(int age){
        this.age = age;
        return this.age;
    }
}
 
public class test1 {
    public static void main(String[] args) {
        Person Harry = new Person();
        System.out.println("Harry's age is "+Harry.GetAge(12));
    }
}
```
}
运行结果：
```
初始化年龄：10
Harry's age is 12
```
可以看到，这里 age 是 GetAge 成员方法的形参，this.age 是 Person 类的成员变量。

3. **引用构造函数**
this(参数)：调用本类中另一种形式的构造函数（应该为构造函数中的第一条语句）。

## super
super 可以理解为是指向自己超（父）类对象的一个指针，而这个超类指的是离自己最近的一个父类。
super 也有三种用法：
1. **普通的直接引用**
与 this 类似，super 相当于是指向当前对象的父类，这样就可以用 super.xxx 来引用父类的成员。

2. **子类中的成员变量或方法与父类中的成员变量或方法同名**
```java
class Country {
    String name;
    void value() {
       name = "China";
    }
}
  
class City extends Country {
    String name;
    void value() {
        name = "Shanghai";
        super.value();      //调用父类的方法
        System.out.println(name);
        System.out.println(super.name);
    }
  
    public static void main(String[] args) {
        City c=new City();
        c.value();
    }
}
```
运行结果：
```
Shanghai
China
```

可以看到，这里既调用了父类的方法，也调用了父类的变量。若不调用父类方法 value()，只调用父类变量 name 的话，则父类 name 值为默认值 null。
3. **引用构造函数**
super(参数)：调用父类中的某一个构造函数（应该为构造函数中的第一条语句）。

## super 和 this的异同
- **有参构造器的第一条语句，不会隐含地调用this();**
- 调用super()必须写在子类构造方法的第一行，否则编译不通过。**每个子类构造方法的第一条语句，都是隐含地调用 super()**，如果父类没有这种形式的构造函数，那么在编译的时候就会报错。
- super() 和 this() 只能放在构造方法内第一行。
- this 和 super 不能同时出现在一个构造函数里面，因为this必然会调用其它的构造函数，其它的构造函数必然也会有 super 语句的存在，所以在同一个构造函数里面有相同的语句，就失去了语句的意义，编译器也不会通过
- this() 和 super() 都指的是对象，所以，均不可以在 static 环境中使用。包括：static 变量,static 方法，static 语句块。
- 从本质上讲，this 是一个指向本对象的指针, 然而 super 是一个 Java 关键字
```java
class Person {
	Person(){
		System.out.println("Person无参构造");
	}
	Person(String name){
		System.out.println("Person有参构造");
  }
}
class Student extends Person {
  Student(){
		System.out.println("Student无参构造");
  }
  Student(String name){
		System.out.println("Student有参构造");
  }
}
public class Te {
  public static void main(String[] args) {
    Person p = new Person("whz");
    System.out.println("******");
    Student s = new Student("whz");
    System.out.println("******");
    Student s1 = new Student();
  }
}
```
运行结果：
```
Person有参构造
******
Person无参构造
Student有参构造
******
Person无参构造
Student无参构造
```

# String与StringBuffer
## String
- String是final类，是不可继承的
- String实现了Serializable接口，表示字符串是支持序列化的
- String实现了Comparable接口，表示String可以表示大小

定义字符串的两种方式：
- String s1 = "whz";  // 字面量的定义方式
- String s2 = new String("whz"); 

### String存储结构的变更
String在jdk8及以前内部是用`final char[] value`来存储字符串数据的。但在jdk9之后改为`byte[]`来存储数据，与String相关的类，例如AbstractStringBuilder, StringBuilder, StringBuffer都做了这个改变
这样做的原因如下：
众所周知，在大多数Java程序的堆里，String占用的空间最大，并且绝大多数String只有Latin-1字符，这些Latin-1字符只需要1个字节就够了。JDK9之前，JVM因为String使用char数组存储，每个char占2个字节，所以即使字符串只需要1字节/字符，它也要按照2字节/字符进行分配，浪费了一半的内存空间。

JDK9是怎么解决这个问题的呢？
一个字符串出来的时候判断，它是不是只有Latin-1字符，如果是，就按照1字节/字符的规格进行分配内存，如果不是，就按照2字节/字符的规格进行分配（UTF-16编码），提高了内存使用率

### String的不可变性
- 当对字符串重修赋值时，需要重写指定内存区域赋值，不能使用原有的value进行赋值
- 对现有的字符串进行连接操作时，也需要重写指定内存区域赋值，不能使用原有的value进行赋值
- 当调用string的replace()方法修改指定字符或字符串时，也需要重新指定内存区域赋值，不能使用原有的value进行赋值

通过字面量的方式(区别于new)给一个字符串赋值，此时的字符串值声明在字符串常量池中
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131122.png)

### String底层Hashtable结构
<font color="red">String的字符串常量池是一个固定大小的HashTable</font>, 默认值大小长度是1009。如果放进字符串常量池的String非常多，就会造成Hash冲突严重，从而导致链表会很长，而链表长了后直接会造成的影响就是当调用String.intern时性能会大幅下降
使用`-XX:StringTableSize`可设置StringTable的长度

### 字符串拼接操作
- 常量与常量的拼接结果在字符串常量池中，原理是编译器优化
- 字符串常量池中是不会存在相同内容的常量
- 只要其中一个是变量，则相当于在堆空间中new String(), 结果就在堆中。变量拼接的原理是使用StringBuilder来new String后append()
- 如果拼接的结果调用intern()方法，则主动将常量池中还没有的字符串对象放入字符串常量池中，并返回次对象地址
```java
public static void test1(){
  String s1 = "a" + "b" + "c";
  String s2 = "abc";
  System.out.println(s1 == s2); // true
  System.out.println(s1.equals(s2)); // true
}
```
```java
public static void test2(){
  String s1 = "javaee";
  String s2 = "hadoop";

  String s3 = "javaeehadoop";
  String s4 = s1 + "hadoop";
  String s5 = "javaee" + "hadoop";

  System.out.println(s3 == s4); // false
  System.out.println(s3 == s5); // true
  System.out.println(s4 == s5); // false
}
```

### new String("ab")创建几个对象
最多创建两个对象：一个是new关键字在堆空间创建的， 如果字符串常量池中有"ab", 则不许创建对象，如果没有，则会在字符串常量池中创建一个

### intern()
`str.intern()`用来判断字符串常量池中是否存在str字符串，如果存在，则返回字符串常量池中str字符串的地址，反之，则在字符串常量池中加载一份str字符串，并返回该地址
```java
public static void test3(){
  String s1 = "javaee";
  String s2 = "ee";
  String s3 = "java" + s2;
  String s4 = s3.intern();
  String s5 = new String("javaee").intern();

  System.out.println(s4 == s1); //true
  System.out.println(s5 == s1); //true
}
```
对于上述的`String s5 = new String("javaee").intern()`，会先在堆中创建一个"javaee"的string对象，然后判断字符串常量池中是否有"javaee"的字符串，如果有，则返回该地址给s5，反之，则在字符串常量池中创建一个“javaee”字符串，并返回该地址给s5

### String中的hashCode()
```java
public static void main(String[] args){
  String a = new String("aa");
  String b = new String("aa");
  System.out.println(a == b); //false
  System.out.println(a.hashCode() == b.hashCode()); //true

  String[] c = new String[]{"aa"};
  String[] d = new String[]{"aa"};
  System.out.println(c == d); //false
  System.out.println(c.hashCode() == d.hashCode()); //flase
}
```

# Varargs 可变参数使用
Java1.5提供了一个叫varargs的新功能，就是可变长度的参数。可变参数底层就是一个数组
"Varargs"是"variable number of arguments"的意思。有时候也被简单的称为"variable arguments"
定义实参个数可变的方法：只要在一个形参的"类型"与"参数名"之间加上三个连续的"."（即"..."，英文里的句中省略号），就可以让它和不确定个实参相匹配。
以下实例创建了 sumvarargs() 方法来统计所有数字的值：
```java
public class Te {
  public static void main(String[] args) {
    get(1);// 传入一个实参
    System.out.println("****");
    get(2,3); //传入多个实参
    System.out.println("****");
    get(new int[]{4,2}); // 传入一个数组
  }

  public static void get(int... arr){
    for(int i = 0; i < arr.length; i++)
      System.out.println(arr[i]);
  }
}
```

## 泛型可变参数
泛型类型为可变参数数组中元素的类型

当使用泛型可变参数时；传入数组会有如下两种情况：
- 情况一：当数组的元素的类型是引用类型时：数组实参的引用直接赋给形参，此时泛型类型为数组实参中元素的类型
```java
public static void main(String[] args) throws Exception{
  Integer[] nums = {3, 30, 34, 5, 9};
  test(nums); //此时泛型类型为Integer
}
public static <T> void test(T... a){
  System.out.println(a.length); //输出：5
  System.out.println(a[0].getClass().getName());//输出：java.lang.Integer;
  System.out.println(a.getClass().getName());//输出：[Ljava.lang.Integer;
}
```
- 情况二：当数组的元素的类型是基本类型时，<font color="red">由于泛型不支持基本类型</font>，所以不能将数组实参的引用直接赋给形参，而是将数组实参作为一个元素存放到可变形参中，此时可变形参为一个该基本类型的二维数组， 所以泛型类型为该基本类型的数组
```java
public static void main(String[] args) throws Exception{
  int[] nums = {3, 30, 34, 5, 9};
  test(nums); //此时泛型类型为int[]
}
public static <T> void test(T... a){
  System.out.println(a.length); // 输出：1
  System.out.println(a[0].getClass().getName()); //输出：[I
  System.out.println(a.getClass().getName()); //输出：[[I
}
```
Arrays中的asList()方法就是为`static <T> List<T> asList(T... a)`
所以我们可以进行如下操作
```java
int[] nums = {3, 30, 34, 5, 9};
List<int[]> list = Arrays.asList(nums);
```

# 引用类型之间的转换
<span id="convert"></span>

## 子类与父类之间的转换
### 子类转父类
java中子类转换父类,实际上依然是子类；此时不需要强制转换。 但引用只能调用父类中定义的方法和变量；但如果子类中重写了父类中的一个方法，那么在调用这个方法的时候，将还是会调用子类中的这个方法；
```java
class Animal{
  public void call(){
    System.out.println("Animal");
  }
}

class Dog extends Animal{
  public void call(){
    System.out.println("Dog");
  }
}

public static void test9(){
  Animal dog = new Dog();
  dog.call();
}
```
输出
```
Dog
```

### 父类转子类
只有满足`父类实例 instanceof 子类`，才能实现父类转子类，即只有父类对象本身就是用子类new出来的时候, 才可以在将来被强制转换为子类对象。但仍需要强制转换,否则会报错
```java
// Base是Derived的父类
Base derivedInstance = new Derived();
Base baseInstance = new Base();

Derived good = (Derived)derivedInstance; // OK
Derived fail = (Derived)baseInstance; // Throws InvalidCastException
```

```java
class Animal{
  public void call(){
    System.out.println("Animal");
  }
}

class Dog extends Animal{
  public void call(){
    System.out.println("Dog");
  }
}

public static void test9(){
  Animal dog = new Dog();
  if(dog instanceof Dog){
    Dog dog1 = (Dog) dog;
    dog1.call();
  }
}
```

## instanceof的作用
`A instanceof B`的作用：
假设A对象是由C类new出来的，则该语句的作用是判断C类实例是否是B的实例或者是B的子类的实例
```java
class Animal{
  public void call(){
    System.out.println("Animal");
  }
}

class Dog extends Animal{
  public void call(){
    System.out.println("Dog");
  }
}

public static void test9(){
  Animal dog = new Dog();
  System.out.println(dog instanceof Dog); // 输出：true

  Animal dog = new Animal();
  System.out.println(dog instanceof Dog); // 输出：false
}
```

## 有关数组之间的强转
```java
public void test(){
  Object[] ob = new String[]{"aa", "cc"};
  if(ob instanceof String[]){
    System.out.println("能强转成String[]");
    String[] str = (String[])ob;
  }else{
    System.out.println("不能强转成String[]");
  }
}
```
注：
```java
public void test(){
  List<String> list = new ArrayList();
  list.add("jaaa");
  list.add("jfkdfj");
  list.add("lala");

  Object[] ob = list.toArray();
  if(!(ob instanceof String[])){
    System.out.println("不能强转成String[]");
  }
}
```
可知`String[] ob = (String[])list.toArray()`会报错
如果想要实现List转成String类型的数组，可以的使用List中的`<T> T[] toArray(T[] a)`方法,如下
```java
public void test(){
  List<String> list = new ArrayList();
  list.add("jaaa");
  list.add("jfkdfj");
  list.add("lala");

  String[] str = list.toArray(new String[0]);
```


# 接口多继承
- 一个类只能extends一个父类，但可以implements多个接口
- 一个接口则可以同时extends多个接口，却不能implements任何接口

===>> Java中的接口是支持多继承的。

# 检查异常、非检查异常、运行时异常、非运行时异常的区别
- Java把所有的非正常情况分为两种：异常（Exception）和错误（Error），它们都继承Throwable父类。
- Java的异常（Exception和Error）分为检查异常和非检查的异常。
- 其中根据Exception异常进行分类，可分为运行时异常和非运行时异常。

Java异常体系结构如下图所示：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409103127.png)

## Error
一般是指java虚拟机相关的问题，如系统崩溃、虚拟机出错误、动态链接失败等，这种错误无法恢复或不可能捕获，将导致应用程序中断，通常应用程序无法处理这些错误，因此应用程序不应该捕获Error对象，也无须在其throws子句中声明该方法抛出任何Error或其子类。

## 检查异常于非检查异常
Java的异常（Exception和Error）分为检查异常和非检查的异常。

### 检查异常
就是编译器要求你必须处理的异常。比如我们在编程某个文件的读于写时，编译器要求你必须要对某段代码try....catch... 或者 throws exception，这就是检查异常，简单的来说，你代码还没有运行，编码器就会检查你的代码，对可能出现的异常必须做出相对的处理。（比如当文件不存在时..）

#### 如何处理检查异常
1. 继续往上抛出，（这是一个消极的方法），一直可以抛到java虚拟机来处理，通过throw exception抛出。
2. 用try...catch捕获

> 对于检查时的异常必须处理，或者必须捕获或者必须抛出

#### 检查异常大概有哪些
除了RuntimeException与其派生类(子类),以及错误(Error)。其他的差不多都是检查异常。

### 非检查异常
编译器不要求强制处置的异常，虽然有可能出现错误，但是我不会在编译的时候检查。

#### 如何处理非检查异常
1. try....catch捕获
2. 继续抛出
3. 不处理

这类异常一般我们是不处理的，因为会很判断会出现什么问题，而且有些异常你也无法运行时处理，比如空指针。

#### 非检查异常有哪些
RuntimeException与其子类，以及错误(Error)

## 运行时异常和非运行时异常
其中根据Exception异常进行分类，可分为运行时异常和非运行时异常。

### 运行时异常
都是RuntimeException类及其子类异常，如NullPointerException(空指针异常)、IndexOutOfBoundsException(下标越界异常)等，这些异常是非检查异常，程序中可以选择捕获处理，也可以不处理。这些异常一般是由程序逻辑错误引起的，程序应该从逻辑角度尽可能避免这类异常的发生。

运行时异常的特点是Java编译器不会检查它，也就是说，当程序中可能出现这类异常，即使没有用try-catch语句捕获它，也没有用throws子句声明抛出它，也会编译通过

### 非运行时异常
是RuntimeException以外的异常，类型上都属于Exception类及其子类。从程序语法角度讲是必须进行处理的异常，如果不处理，程序就不能编译通过。如IOException、SQLException等以及用户自定义的Exception异常，一般情况下不要自定义检查异常。

# finally关键字
来看看下面这个test1()方法：
```java
public int test1() {
  try {
    return 1;
  } finally {
    return 2;
  }
}
```
方法test1将返回2；

怎么解释呢？再来看看下面这个test2()方法：
```java
public int test2() {
  int i = 1;
  try {
    System.out.println("try语句块中");
    return 1;
  } finally {
    System.out.println("finally语句块中");
    return 2;
  }
}
运行结果是：
```
try语句块中
finally语句块中
2
```

从运行结果中可以发现，try中的return语句调用的函数先于finally中调用的函数执行，也就是说return语句先执行，finally语句后执行，所以，返回的结果是2。return并不是让函数马上返回，而是return语句执行后，将把返回结果放置进函数栈中，此时函数并不是马上返回，它要执行finally语句后才真正开始返回。

# 异常栈
## 异常栈的阅读方法
- 异常栈中每个异常都由异常名+细节信息+路径组成。异常名从行首开始（或紧随”Caused by”），紧接着是细节信息（为增强可读性，需要提供恰当的细节信息），从下一行开始，跳过一个制表符，就是路径中的一个位置，一行一个位置。
- 异常栈中的异常是以FILO的顺序打印，位于打印内容最下方的异常最早被抛出，逐渐导致上方异常被抛出。位于打印内容最上方的异常最晚被抛出，且没有再被捕获。从上到下数，第i+1个异常是第i个异常被抛出的原因cause，以“Caused by”开头。
- 异常中的路径描述打印顺序也是FILO的顺序打印，位于打印内容最下方的路径是最早经过的，逐渐导致上方路径被经过。从上到下数，第i+1个路径是第i个路径被经过的原因
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131153.png)

## 实战：
```java
public class Main {
  public static void main(String[] args) {
    try {
      process1();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  static void process1() {
    try {
      process2();
    } catch (NullPointerException e) {
      throw new IllegalArgumentException();
    }
  }

  static void process2() {
    throw new NullPointerException();
  }
}
```
运行后，打印出的异常栈类似：
```
java.lang.IllegalArgumentException
    at Main.process1(Main.java:15)
    at Main.main(Main.java:5)
```
这说明新的异常丢失了原始异常信息，我们已经看不到原始异常NullPointerException的信息了。
为了能追踪到完整的异常栈，在构造异常的时候，把原始的Exception实例传进去，新的Exception就可以持有原始Exception信息。对上述代码改进如下：

```java
public class Main {
  public static void main(String[] args) {
    try {
      process1();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  static void process1() {
    try {
      process2();
    } catch (NullPointerException e) {
      throw new IllegalArgumentException(e); //改进地方
    }
  }

  static void process2() {
    throw new NullPointerException();
  }
}
```
运行上述代码，打印出的异常栈类似：
```
java.lang.IllegalArgumentException: java.lang.NullPointerException
    at Main.process1(Main.java:15)
    at Main.main(Main.java:5)
Caused by: java.lang.NullPointerException
    at Main.process2(Main.java:20)
    at Main.process1(Main.java:13)
```
注意到Caused by: Xxx，说明捕获的IllegalArgumentException并不是造成问题的根源，根源在于NullPointerException，是在Main.process2()方法抛出的。
在代码中获取原始异常可以使用Throwable.getCause()方法。如果返回null，说明已经是“根异常”了。
有了完整的异常栈的信息，我们才能快速定位并修复代码的问题。


# 内部类
广义上的内部类可以分为下面四种：
- 成员内部类
- 静态内部类
- 方法(局部)内部类
- 匿名内部类

## 成员内部类
- 在一个类中除了可以定义成员变量、成员方法，还可以定义类，这样的类就被称为成员内部类，这个类所在的类称为外部类
- 成员内部类可以访问外部类的所有成员，外部类要访问成员内部类的成员，必须要创建一个成员内部类的对象，再通过指向这个对象的引用来访问
- 当成员内部类拥有和外部类同名的成员变量或者方法时，在成员内部类中，默认情况下访问的是成员内部类的成员
- 如果访问外部类的同名成员，需要以`外部类.this.成员变量/方法`形式来访问
- 成员内部类是依附外部类而存在的，如果要创建成员内部类的对象，前提是必须存在一个外部类的对象
- 创建成员内部类对象的三种方法
```java
// 第一种
Outer.Inner in = new Outer().new Inner();

//第二种
Outer out = new Outer();
Outer.Inner in = out.new Inner();

//第三种
Outer out = new Outer();
Outer.Inner in = out.getInnerInstance();
```

## 静态内部类
- 可以使用static关键字来修饰一个成员内部类，此时就称为静态内部类。它可以在不创建外部类对象的情况下被实例化，创建静态内部类对象的具体语法格式如下
```java
Outer.Inner in = new Outer.Inner();
```
- 静态内部类只能访问外部类的静态成员
- 静态内部类中可以定义静态成员，而非静态内部类中不能定义静态成员

## 方法内部类
- 方法内部类是在成员方法中定义的类，只能在当前方法中被使用
- 方法内部类对象不能使用该内部类所在方法中的非final局部变量, 但注意，在jdk1.7之前需要手动将方法内部类使用的变量设置为final, 而在jdk1.7之后，jvm会自动将其设置为final, 而不需要手动添加final

## 匿名内部类
- 匿名内部类就是没有名字的方法内部类，不使用关键字class、extends、implements没有构造方法
- 一定是在new的后面，用其隐含**实现一个接口或者继承一个类**
```java
class Dog{
  public void get(){
    System.out.println("fdfd");
  }
}
public class Te<T> {
  public static void main(String[] args) throws Exception{
    Dog dog = new Dog(){
      public void get(){
        System.out.println("aaa");
      }
    };
    dog.get();//输出: aaa
  }
}
```

### 诡异的Java匿名内部类写法
在很多时候，我们需要在类的内部初始化一个静态的Map或者List，然后保存一下常量值提供给类内部方法使用。 我们通常的做法是：

首先初始化一个Map的静态变量，然后在静态块添加常量值：
```java
private final static Map<String, String> CONSTANT = new HashMap<String, String>();
static {
	CONSTANT.put("1", "one");
	CONSTANT.put("2", "two");
}
```

#### 一、你也许会陌生的匿名内部类写法
```java
private final static Map<String, String> CONSTANT =
     new HashMap<String, String>() {
	{
		put("1", "one");
		put("2", "two");
	}
};
```

#### 二、先看看我们熟悉的写法
如果对于这种方式比较陌生，那先看两个熟悉的
- 熟悉1
```java
new Thread() {
    public void run() {
        System.out.println("Thread running!");
    };
}.start();
```
上面这段代码的意思就是，声明一个Thread的子类并重写Thread的run()方法， 然后创建一个该子类的实例然后调用其start()方法。 由于声明的该Thread的子类没有名字，所以叫匿名类。 又由于没有名字的类只能存在于一个类或者一个方法内部，所以又称为匿名内部类。

- 熟悉2
```java
Thread thread = new Thread() {
    public void run() {
        System.out.println("Thread running!");
    };
};
thread.start();
```
唯一的区别就是不是直接创建子类并调用其方法，而是声明一个该子类的父类引用thread，然后通过该父类引用调用子类方法。 创建完匿名类的实例后，没有立即执行start()，创建实例和执行实例的方法分开。

两者的区别相当于：
```java
//1
new User().setName("Boyce Zhang");
//2
User user = new User();
user.setName("Boyce Zhang");
```

#### 三、那个陌生的写法究竟是个什么鬼？
我们将熟悉的写法稍加改变
```java
new Thread() {
    public void run() {
        System.out.println("Thread running!");
    };
    {
        start();
    }
};
```
实际上这种写法就是在匿名子类的类局部代码块中调用其类方法。局部代码块内的语句是在创建该类的实例后由类加载器隐式立即执行的。相当于：
```java
public class MyThread extends Thread {
    {
        start();
    }
    public void run() {
        System.out.println("Thread running!");
    };
}
```
所以三种方式在执行的时刻上略微的差别之外，效果并没有太大的区别。

这样一来，前面初始化Map的方式就不难理解了:
```java
private final static Map<String, String> CONSTANT = new HashMap<String, String>() {
    {
        put("1", "one");
        put("2", "two");
    }
};
```
原理就是： 
声明并实例化一个HashMap的子类（子类没有重写父类HashMap的任何方法），并且在子类的类局部代码块调用父类HashMap的put()方法。 最后声明一个Map接口引用CONSTANT指向实例化的HashMap子类的实例。 根据前面的例子我们知道，类局部代码块中的put()方法调用将在HashMap的匿名子类被实例化后由类加载器隐式的执行。

#### 四、举一反三
其实,对于Java的任何类或接口，都可以声明一个匿名类继承或实现它。如：
```java
//重写父类方法，局部代码块调用自己重写过的父类方法。
List<String> list = new ArrayList<String>() {
    public boolean add(String e) {
        System.out.println("Cannot add anything!");
    }

    //代码块的顺序在前后都无所谓，可以出现在类范围的任何位置。
    {
        add("Boyce Zhang");
    }
};

//局部代码块调用父类方法。
dao.add(new User(){
    {
        setName("Boyce Zhang");
        setAge(26);
    }
});

//重写父类方法
ThreadLocal<User> threadLocal = new ThreadLocal<User>() {
    protected String initialValue() {
        return new User("Boyce Zhang", 26);
    }
};
```
在匿名类的内部我们不但可以实现或重写其父类的方法。 而且也可以在其类的局部代码块中执行自己的方法或者其父类的方法。 这并不是匿名内部类的特殊语法，而是Java的语法，对于任何类都适用。


#### 五、这种写法的优缺点分析
这种写法常常就是用在实例化一个类后立即执行某些方法做一些类实例的数据初始化什么的。 
其作用和先实例化一个类，在使用其引用调用需要立即调用的方法是一样的，如：
```java
Map<String, String> map = new HashMap<String, String>();
map.put("1", "one");
map.put("2", "two");
```
这种语法的优点就是简单，实例化一个类后立即做一些事情，比较方便。 效果有一点儿像Javascript里的即时函数一样。但是有本质的区别。 因为Javascript没有类的概念，或者说Javascript中function就是类，类就是function， 所以即时函数是加载完后执行整个function。而Java的局部代码块是可以选择执行类的任何方法。

当然这种写法也有其缺点： 
每一个内部类的实例都会隐性的持有一个指向外部类的引用（静态内部类除外）， 这样一方面是多余的引用浪费，另一方面当串行化这个子类实例时外部类也会被不知不觉的串行化， 如果外部类没有实现serialize接口时，就会报错。


# 日期时间API
## JDK8之前日期时间API
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131224.png)

### java.lang.System类
System类提供的`public static long currentTimeMilis()`用来返回当前时间与1970年1月1日0时0分0秒之间以毫秒为单位的时间差。
**此方法适于计算时间差。**

- 计算世界时间的主要标准有：
>UTC（Coordinated Universal Time）
>GMT（Greenwich Mean Time）
>CST（Central Standard Time）

### java.util.Date类
表示特定的瞬间，精确到毫秒
**构造器**
- Date()：使用无参构造器创建的对象可以获取本地当前时间。
- Date(long date)

**常用方法**
- getTime()：返回自1970年1月1日00:00:00 GMT以来此Date对象表示的毫秒数。
- toString()：把此Date对象转换为以下形式的String: dow mon dd hh:mm:ss zzz yyyy其中：dow是一周中的某一天（Sun，Mon，Tue Wed，Thu，Fri，Sat），zzz是时间标准。
- 其它很多方法都过时了。

### java.text.SimpleDateFormat类
- Date类的API不易于国际化，大部分被废弃了，java.text.SimpleDateFormat类是一个不与语言环境有关的方式来格式化和解析日期的具体类。
- 它允许进行格式化：日期->文本。解析：文本->日期
**格式化：**
- SimpleDateFormat()：默认的模式和语言环境创建对象
- public SimpleDateFormat(String pattern)：该构造方法可以用参数pattern指定的格式创建一个对象，该对象调用：
- public String format（Date date）：方法格式化时间对象date
**解析：**
- public Date parse(String source)：从给定字符串的开始解析文本，以生成一个日期。

### java.util.Calendar（日历）类
Calendar是一个抽象基类，主用用于完成日期字段之间相互操作的功能。

**获取Calendar实例的方法**
- 使用Calendar.getlnstance()方法
- 调用它的子类GregorianCalendar的构造器。

一个Calendar的实例是系统时间的抽象表示，通过get(int field)方法来取得想要的时间信息。比如YEAR、MONTH、DAY_OF_WEEK、HOUR_OF_DAY、MINUTE、SECOND
- public void set(int field，int value)
- public void add(int field，int amount)
- public final Date getTime()
- public final void setTime(Date date)

注意:
- 获取月份时：一月是0，二月是1，以此类推，12月是11
- 获取星期时：周口是1，周二是2，。。。。周六是7

## jdk8中的新日期时间API
### 新日期时间API出现的背景
如果我们可以跟别人说：“我们在1502643933071见面，别晚了！”， 那么就再简单不过了。但是我们希望时间与昼夜和四季有关，于是事情就变复杂了。JDK1.0中包含了一个java.util.Date类，但是它的大多数方法已经在JDK1.1引入Calendar类之后被弃用了。而Calendar并不比Date好多少。它们面临的问题是：
- 可变性：像日期和时间这样的类应该是不可变的。
- 偏移性：Date中的年份是从1900开始的，而月份都从0开始。
- 格式化：格式化只对Date有用，Calendar则不行。
- 此外，它们也不是线程安全的；不能处理间秒等。
总结：对日期和时间的操作一直是Java程序员最痛苦的地方之一。

第三次引入的API是成功的，并且Java 8中引入的java.time APl已经纠正了过去的缺陷，将来很长一段时间内它都会为我们服务。
Java8吸收了Joda-Time的精华，以一个新的开始为Java创建优秀的APl。
新的java.time中包含了所有关于本地日期（LocalDate）、本地时间（LocalTime）、本地日期时间（LocalDateTime）、时区（ZonedDateTime）和持续时间（Duration）的类。历史悠久的Date类新增了tolnstant（）方法，用于把Date转换成新的表示形式。这些新增的本地化时间口期API大大简化了日期时间和本地化的管理。

### LocalDate、LocalTime、LocalDateTime
LocalDate、LocalTime、LocalDateTimel类是其中较重要的几个类，它们的实例是**不可变的对象**，分别表示使用ISO-8601日历系统的日期、时间、日期和时间。
它们提供了简单的本地日期或时间，并不包含当前的时间信息，也不包含与时区相关的信息。
- LocalDate代表IOS格式（yyyy-MM-dd）的日期，可以存储生日、纪念日等日期。
- LocalTime表示一个时间，而不是日期。
- LocalDateTime是用来表示日期和时间的，**这是一个最常用的类之一**。

### DateTimeFormatter
java.time.format.DateTimeFormatter类：该类提供了三种格式化方法：
- 预定义的标准格式。如： ISO_LOCAL_DATE_TIME；ISO_LOCAL_DATE；ISO_LOCAL_TIME
- 本地化相关的格式。如：ofLocalizedDateTime(FormatStyle.LONG)
- 自定义的格式。如：ofPattern("yyyy-MM-dd hh:mm:ss E”)

| 方法                       | 描述                                                |
| -------------------------- | --------------------------------------------------- |
| ofPattern(String pattern)  | 静态方法，返回一个指定字符串格式的DateTimeFormatter |
| format(TemporalAccessor t) | 格式化一个日期、时间，返回字符串                    |
| parse(CharSequence text)   | 将指定格式的字符序列解析为一个日期、时间            |

## 前言
jdk8之前日期时间相关的操作大多用的是Date类或者Calendar类。
比如：
```java
Date date = new Date();
SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
System.out.println(df.format(date)); //2020-09-22 09:19:44
```

Date类或者Calendar类的缺点：
- 非线程安全 ： java.util.Date 是非线程安全的，所有的日期类都是可变的，这是Java的日期类最大的问题之一。
- 设计很差 ：Java的日期时间类的定义并不一致，在 java.util 和 java.sql 的包中都有日期类，此外用于格式化和解析的类在 java.text 包中定义。java.util.Date 同时包含日期和时间，而 java.sql.Date 仅包含日期，将其纳入java.sql包并不合理。另外这两个类都有相同的名字，这本身就是一个非常糟糕的设计。
- 时区处理麻烦 ： 日期类并不提供国际化，没有时区支持，因此Java引入了java.util.Calendar 和 java.util.TimeZone 类，但他们同样存在上述所有的问题。
- jd8以后增加了 LocalDate和 Zoned，能更方便优雅的处理日期时间，本文主要介绍这两者。

### 获取当前时间
- LocalDate获取当前年、月、日
```java
LocalDate nowdata = LocalDate.now();
System.out.println(nowdata);   //2021-04-06。获取当前年月日
System.out.println(nowdata.getYear());//2021。获取年份
System.out.println(nowdata.getMonth().getValue());//4。获取月份
System.out.println(nowdata.getDayOfMonth());//6。获取今天几号
System.out.println(nowdata.getDayOfWeek().getValue());//2。获取今天星期几
System.out.println(nowdata.getDayOfYear());//96。获取今天是今年的第几天
```

- LocalTime获取当前时、分、秒
```java
LocalTime nowTime = LocalTime.now();
System.out.println(nowTime.getHour());//9。获取当前时间的小时
System.out.println(nowTime.getMinute());//40。获取当前时间的分钟
System.out.println(nowTime.getSecond());//44。获取当前时间的秒
```

- LocalDateTime获取当前年、月、日、时、分、秒
（LocalDateTime相当于LocalDate + LocalTime的合体）
```java
LocalDateTime localDateTime = LocalDateTime.now();
System.out.println(localDateTime.getYear());//2021。年
System.out.println(localDateTime.getMonth().getValue());//4。月
System.out.println(localDateTime.getDayOfMonth());//6。日
System.out.println(localDateTime.getHour());//9。时
System.out.println(localDateTime.getMinute());//51。分
System.out.println(localDateTime.getSecond());//11。秒
System.out.println(localDateTime.getDayOfYear());//96。今天是今年的第几天
System.out.println(localDateTime.getDayOfWeek().getValue());//2。今天是星期几
```

### 日期和时间格式化
- LocalDate格式化
```java
LocalDate getdata = LocalDate.now();
DateTimeFormatter f1 = DateTimeFormatter.ofPattern("yyyy.MM.dd");
System.out.println(getdata.format(f1));//2021.04.06
```

- LocalTime格式化
```java
LocalTime getTime = LocalTime.now();
DateTimeFormatter f1 = DateTimeFormatter.ofPattern("HH-mm-ss");
System.out.println(getTime.format(f1));//16-27-08
```

- LocalDateTime 格式化
```java
LocalDateTime localDateTime = LocalDateTime.now();
DateTimeFormatter f1 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
System.out.println(localDateTime.format(f1));//2021-04-06 10:04:32
```
```java
LocalDateTime localDateTime = LocalDateTime.now();
DateTimeFormatter f2 = DateTimeFormatter.ofPattern("yyyy.MM.dd-HH:mm");
System.out.println(localDateTime.format(f2));//2021.04.06-10:04
```
```java
LocalDateTime localDateTime = LocalDateTime.now();
System.out.println(localDateTime.toString());//2021-04-06T11:33:59.617
```

### 添加时区：
```java
LocalDateTime localDateTime = LocalDateTime.now();
OffsetDateTime date =localDateTime.atOffset(ZoneOffset.ofHours(+8));
System.out.println(date.toString());//2021-04-06T10:55:09.599+08:00
```
注意：
LocalDateTime 当秒数刚好为0的时候格式化后秒会被省略，格式化要指定到秒。
```java
LocalDateTime localDateTime = LocalDateTime.parse("2021-04-06T10:00:00");

String time = localDateTime.toString();
System.out.println(time);//2021-04-06T10:00

DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String time1 = localDateTime.format(f);
System.out.println(time1);//2021-04-06 10:00:00
```

## 字符串与LocalDate、LocalTime、LocalDateTime之间的互换
- 日期字符串转LocalDate类型
```java
LocalDate getdata = LocalDate.parse("2021-04-06");//年月日用-分开，月份和日期如果小于10要补零,否则会报错
System.out.println(getdata);//2021-04-06
```
- 时间字符串转LocalTime类型
```java
//时间字符串转LocalTime类型
LocalTime gettime = LocalTime.parse("16:59:09");//时分秒用:分开，时分秒如果小于10要补零
System.out.println(gettime);
```
- 日期时间字符串转LocalDateTime类型
（年月日之间要用-分割，时分秒用:分割，日期和时间之间用T分割）
```java
LocalDateTime localDateTime = LocalDateTime.parse("2021-04-06T10:13:12");
System.out.println(localDateTime);//2021-04-06T10:13:12
```
- LocalDate、LocalTime、LocalDateTime类型转为字符串直接toString
```java
LocalDate nowdata = LocalDate.now();
System.out.println(nowdata.toString());//2021-04-16

LocalTime nowTime = LocalTime.now();
System.out.println(nowTime.toString());//16:16:04.372

LocalDateTime localDateTime = LocalDateTime.now();
System.out.println(localDateTime.toString());//2021-04-16T16:16:04.373
```
## 判断平年和闰年
- 指定具体年月日
```java
LocalDate localDate = LocalDate.of(1999,1,7);//设置指定日期
boolean bo = localDate.isLeapYear();//闰年为ture,平年是false
System.out.println(bo);//false
```
- 指定年份
```java
boolean bo1 = IsoChronology.INSTANCE.isLeapYear(1999);//指定年份
System.out.println(bo);//false
```

## 判断指定日期是不是星期一
```java
LocalDate localDate = LocalDate.of(2021,1,25);
System.out.println(localDate.getDayOfWeek()== DayOfWeek.MONDAY);//true
```
## 计算指定日期的月份有多少天
```java
LocalDate endDate = LocalDate.of(2021, 2, 1);
int monthDay = endDate.lengthOfMonth();
System.out.println(monthDay);//输出28，2021年2月有28天
```
## 比较两个时间的早晚
```java
LocalTime gettimeStart = LocalTime.parse("00:01:40");
LocalTime gettimeEnd = LocalTime.parse("00:03:20");
//-1表示早于，1表示晚于，0则相当
int value = gettimeStart.compareTo(gettimeEnd);
System.out.println(value);
```
## 计算两个时间相差多久
```java
LocalTime gettimeStart = LocalTime.parse("00:01:40");
LocalTime gettimeEnd = LocalTime.parse("00:03:20");
System.out.println("相差: "+HOURS.between(gettimeStart, gettimeEnd)+"小时");//相差: 0小时
System.out.println("相差: "+MINUTES.between(gettimeStart, gettimeEnd)+"分钟");//相差: 1分钟
System.out.println("相差: "+SECONDS.between(gettimeStart, gettimeEnd)+"秒");//相差: 100秒
```
如果要计算出xx:xx:xx秒这样的结果：
```java
/**
     * 计算两个时间的时间差
     *
     * @param startime 开始时间，如：00:01:09
     * @param endtime  结束时间，如：00:08:27
     * @return  返回xx:xx:xx形式，如：00:07:18
     */
    public static String calculationEndTime(String startime, String endtime) {
        LocalTime timeStart = LocalTime.parse(startime);
        LocalTime timeEnd = LocalTime.parse(endtime);
        long hour = HOURS.between(timeStart, timeEnd);
        long minutes = MINUTES.between(timeStart, timeEnd);
        long seconds = SECONDS.between(timeStart, timeEnd);
        minutes = minutes > 59 ? minutes % 60 : minutes;
        String hourStr = hour < 10 ? "0" + hour : String.valueOf(hour);
        String minutesStr = minutes < 10 ? "0" + minutes : String.valueOf(minutes);
        long getSeconds = seconds - (hour * 60 + minutes) * 60;
        String secondsStr = getSeconds < 10 ? "0" + getSeconds : String.valueOf(getSeconds);
        return hourStr + ":" + minutesStr + ":" + secondsStr;
    }
```

## 比较两个日期的早晚
```java
LocalDate startDate = LocalDate.of(2020, 1, 18);
LocalDate endDate = LocalDate.of(2021, 5, 17);
Period period = Period.between(startDate, endDate);
//判断startDate是不是早于endDate，早于则false，否则true
System.out.println(period.isNegative());//false
```

## 计算两个日期相隔多久
```java
LocalDate startDate = LocalDate.of(2020, 9, 27);
        LocalDate endDate = LocalDate.of(2030, 10, 2);
        System.out.println("总相差的天数:" + startDate.until(endDate, ChronoUnit.DAYS));//总相差的天数:3657
        System.out.println("总相差的月数:" + startDate.until(endDate, ChronoUnit.MONTHS));//总相差的月数:120
        System.out.println("总相差的年数:" + startDate.until(endDate, ChronoUnit.YEARS));//总相差的年数:10
        Period period = Period.between(startDate, endDate);
        System.out.println(
            "相差:" + period.getYears() + " 年 " +
                   period.getMonths() + " 个月 " +
                   period.getDays() + " 天");  //相差:10 年 0 个月 5 天
```

## 比较两个日期时间的早晚
```java
        LocalDateTime date = LocalDateTime.parse("2019-03-03T12:30:30");
        LocalDateTime date1 = LocalDateTime.parse("2017-03-03T12:30:30");
        System.out.println(date.isAfter(date1));//true
        System.out.println(date.isBefore(date1));//false
        System.out.println(date.isEqual(date1));//false
``` 

## 计算某年某月有几个星期五
```java
public static void main(String[] args) {
        int a=numberOfDaysOfWeekInMonth(DayOfWeek.FRIDAY, YearMonth.of(2020, 9));
        System.out.println(a);
}

public static int numberOfDaysOfWeekInMonth(DayOfWeek dow, YearMonth yearMonth) {
      LocalDate startOfMonth = yearMonth.atDay(1);
      LocalDate first = startOfMonth.with(TemporalAdjusters.firstInMonth(dow));
      LocalDate last = startOfMonth.with(TemporalAdjusters.lastInMonth(dow));
      return (last.getDayOfMonth() - first.getDayOfMonth()) / 7 + 1;
  }
```
说明：
- DayOfWeek.FRIDAY： DayOfWeek枚举类中的星期五
- YearMonth.of：此方法接收一个年份和月份，返回一个YearMonth类型
- yearMonth.atDay：此方法接收一个指定的号数（范围1到366），返回LocalDate类型（即年月日）
- with：方法返回此日期的调整副本。
- TemporalAdjusters.firstInMonth：接收一个星期几参数，返回当前月份中第一个星期几的年月日
- TemporalAdjusters.lastInMonth：接收一个星期几参数，返回当前月份中最后一个星期的年月日

# 集合
## 什么是集合
- 概念：对象的容器，定义了对多个对象进行操作的常用方法。可实现数组的功能。
- 和数组区别：
  - 数组长度固定，集合长度不固定
  - 数组可以存储基本类型和引用类型，集合只能存储引用类型，
- 位置：`java.util.*`；

## Collection体系集合
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130431.png)

## Collection父接口
Collection接口实现了Iterable接口
- 特点：代表一组任意类型的对象，无序、无下标、不能重复。
- 常见方法：
  - boolean add（Object obj）/添加一个对象。
  - boolean addA11（Collection o）/将一个集合中的所有对象添加到此集合中。
  - void clear（）//清空此集合中的所有对象，但对象还是存在内存中
  - boolean contains（Object o）//检查此集合中是否包含o对象
  - boolean equals（Object o）∥比较此集合是否与指定对象相等。
  - boolean isEmpty（）//判断此集合是否为空
  - boolean remove（Object o）//在此集合中移除o对象， 是根据对象中的equals方法来判断的
  - int size（）/返回此集合中的元素个数
  - Iterator\<E> iterator() //返回该集合迭代器
  - Object[] toArray（）/将此集合转换成数组。
[详细](https://docs.oracle.com/javase/8/docs/api/java/util/Collection.html)

### 遍历Collection
由于Collection是没有下标的，所以是不可能通过for循环下标来遍历Collection的。 
遍历Collection常用两种方法
1. 增强For
```java
for(Object object : collection){
	System.out.println(object);
}
```
2. 使用迭代器Iterator
迭代其是一个接口， 是专门用来遍历集合的，其有只有三种方法，分别是
- boolean hasNext(): 如果仍有元素可以迭代，则返回true
- E next(): 返回迭代的下一个元素
- void remove(): 从迭代器指向的collection中移除迭代器返回的最后一个元素
```java
Iterator it = collection.iterator();
while(it.hasNext()){
	Object s = it.next();
	System.out.println(s);
}
```
注：在使用的迭代器遍历集合的过程中，是不能使用集合自带的删除方法进行删除操作的，即`collection.remove(o)`操纵，否则会报如下错误
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130454.png)
但是我们可以使用的迭代器中的remove方法来进行删除

### Iterator与Iterable的区别
Iterator与Iterable都是接口，他们是紧密相连的，Iterator是迭代器，用来遍历集合的。Collection接口实现了Iterable接口，而没有实现Iterator接口。因为Iterable接口中有一个方法`Iterator<T> iterator()`, 调用这个方法就可以返回一个Iterator类型对象，然后就可以遍历集合了
Map没有实现Iterable接口，所以Map也就没有Iterator()方法，但是Map有keySet()和entrySet()方法，这两个方法可以转为Set，由于Set实现了Collection，所以从而就有了Iterator()方法

注：在jdk1.8后，Iterable接口添加了`void forEach(Comsumer<? super T> action)`方法，所以集合可以直接使用forEach方法来遍历元素
```java
public static void test10(){
  ArrayList<Integer> list = new ArrayList();
  list.add(13);
  list.add(12);
  list.add(14);
  list.forEach(System.out::println);
}
```

为什么我们不直接Implement Iterator 呢？
答: 如果Collection直接实现Iterator这个接口的时候，则当我们new 一个新的对象的时候，这个对象中就包含了当前迭代位置的数据（指针），当这个对象在不同的方法或者类中传递的时候，当前传递的对象的迭代的位置是不可预知的，那么我们在调用next（）方法的时候也就不知道是指到那一个元素。如果其中加上了一个reset（）方法呢？用来重置当前迭代的位置这样Collection也只能同时存在一个当前迭代位置的对象。所有不能直接选择实现 Iterator。 实现Iteratable ，里面的方法Iterator() 可以在同一个对象每次调用的时候都产生一个新的Iterator对象。这样多个迭代器就不会互相干扰了。

## List子接口
- 特点：有序、有下标、元素可以重复。
- 常用方法：
  - void add（int index，Object o）/在index位置插入对象o。
  - boolean addA11（int index，Collection c）//将一个集合中的元素添加到此集合中的index位置。
  - Object get（int index）//返回集合中指定位置的元素。
  - int	indexOf(Object o) //返回对象o在集合中的下标
  - ListIterator\<E> listIterator() // 返回列表迭代器
  - List subList（int fromIndex，int toIndex）//返回fromIndex和toIndex之间的集合元素。
[详细](https://docs.oracle.com/javase/8/docs/api/java/util/List.html)

### 遍历List
由于List是有下标的，所以可以使用for循环遍历下标的方式遍历List；
当然也可以使用增强for， 迭代器Iterator方法来遍历； 并且List除了有迭代器Iterator, 还有特有的列表迭代器ListIterator

**ListIterator**
允许程序员按任一方向遍历列表、选代期间修改列表，并获得迭代器在列表中的当前位置。Listlterator没有当前元素；它的光标位置始终位于调用previous0所返回的元素和调用next0所返回的元素之间。长度为n的列表的迭代器有n+l个可能的指针位置
ListIterator接口有如下方法
- void add(E e) : 将指定的元素插入列表
- boolean hasNext() : 以正向遍历列表时，如果列表迭代器有多个元素，则返回true
- boolean hasPrevious() : 如果以逆向遍历列表，列表迭代器有多个元素，则返回true.
- E next() : 返回列表中的下一个元素
- int nextIndex() : 返回对next的后续调用所返回元素的索引。
- E previous() : 返回列表中的前一个元素
- int previousIndex() : 返回对previous的后续调用所返回元素的索引。
- void remove() : 从列表中移除由next或previous返回的最后一个元素
- void set(E e): 用指定元素替换next或previous返回的最后一个元素

### List实现类-ArrayList
ArrayList是通过数据结构实现，查询快，增删慢， 运行效率快，线程不安全. jdk1.2版本添加进来， 
```java
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, Serializable
```
因为是底层是数组，所以ArrayList在初始化的时候，有初始大小10（注意：如果创建集合时，没有向集合中任何元素，此时大小为0，添加元素后才变成10），插入新元素的时候，会判断是否需要扩容，扩容的步长是0.5倍原容量，扩容方式是利用数组的复制，因此有一定的开销


### List实现类-Vector
数组结构实现，必须开辟连续空间，查询快，增删慢；运行效率慢， 线程安全； jdk1.0版本加进来

### List实现类-LinkedList
**双向**链表结构实现，无需开辟连续空间，查询慢，增删快；
其中也含有ListIterator
```java
public class LinkedList<E>
extends AbstractSequentialList<E>
implements List<E>, Deque<E>, Cloneable, Serializable
```
由于LinkedList实现了Deque, 而Deque继承了Queue，所以可以使用LinkedList来实现Queue

## Set子接口
特点：无序、无下标、元素不可重复
方法：全部是继承自Collection中的方法，自己没有额外添加方法

### Set实现类，HashSet
存储过程(判断相等依据)：
1. 执行hashCode方法计算元素存放位置，如果此位置为空，则直接保存，如果不为空执行第二步
2. 执行equals方法，如果返回true，则认为是重复，否则，形成链表
```java
class Person{
  String name;
  int age;

  public Person(String name, int age){
    this.name = name;
    this.age = age;
  }

  public String toString(){
    return name+" "+age;
  }

  public int hashCode(){
    return age;
  }

  public boolean equals(Object person){
    if(person instanceof Person)
      return hashCode() == person.hashCode();
    return false
  }
}

public static void test8(){
  HashSet<Person> set = new HashSet();

  set.add(new Person("whz", 12));
  set.add(new Person("hz", 18));
  set.add(new Person("hxz", 18));

  System.out.println("----");
    
  for(Person person : set){
    System.out.println(person);
  }
}
```
输出
```
hz 18
whz 12
```

### Set实现类，TreeSet
- 存储结构：红黑树
- 基于排列顺序实现元素不重复
- 实现了SortedSet接口，对集合元素自动排序
- 元素对象的类型必须实现Comparable接口，指定排序规则。如果compareTo()方法返回值为0，则认为是重复元素

## 集合的toString()
LinkedList，ArrayList, HashSet, TreeSet等集合都间接地继承了AbstractCollection中的重写了的toString()方法，其源码如下
```java
public String toString() {
    Iterator<E> it = iterator();
    if (! it.hasNext())
        return "[]";

    StringBuilder sb = new StringBuilder();
    sb.append('[');
    for (;;) {
        E e = it.next();
        sb.append(e == this ? "(this Collection)" : e);
        if (! it.hasNext())
            return sb.append(']').toString();
        sb.append(',').append(' ');
    }
}
```
与数组的toString()区别开来
```java
public static void main(String[] args) throws Exception{
  int[] ar = new int[]{1, 2, 3};
  System.out.println(ar.toString());// 输出: [I@1eb44e46

  List<Integer> list = new LinkedList();
  list.add(1);
  list.add(2);
  list.add(3);
  System.out.println(list.toString()); //输出: [1, 2, 3]
}
```

## 获取List的方式
### 常规方式
这种就是我们平常用的最多最平常的方式了，没什么好说的，后面缺失的泛型类型在 JDK 7 之后就
可以不用写具体的类型了，改进后会自动推断类型。
```java
List<String> languages = new ArrayList<>();
languages.add("Java");
languages.add("PHP");
languages.add("Python");
System.out.println(languages);
```

### Arrays 工具类
```java
import static java.util.Arrays.asList;

List<String> jdks = asList("JDK6", "JDK8", "JDK10");
System.out.println(jdks);
```
注意，上面的 asList 是 Arrays 的静态方法，这里使用了静态导入。**这种方式添加的是不可变的 List, 即不能添加、删除等操作，需要警惕.**
如果要可变，那就使用 ArrayList 再包装一下，如下面所示。
```java
List<String> numbers = new ArrayList<>(Arrays.asList("1", "2", "3"));
numbers.add("4");
System.out.println(numbers);
```
包装一下，这就是可变的 ArrayList 了。

#### Arrays.asList(..)注意点
**Arrats.asList()返回的集合不能做增删操作，可以做修改操作**

如下代码执行时会抛出了java.lang.UnsupportedOperationException异常
```java
String[] icarr = ic.split(",");
List<String> iconlist = Arrays.asList(icarr);
int len = iconlist.size();
for (int b = 0; b < len; b++) {
  if (icon.equals(ne.get(b))) {
    iconlist.remove(b);
    break;
  }
}
```
异常在 iconlist.remove(b);这一行，当时很奇怪哈，百度了下，发现是由于asList引起的异常，使用asList返回的是Arrays的内部类ArrayList
```java
@SafeVarargs
@SuppressWarnings("varargs")
public static <T> List<T> asList(T... a) {
   return new ArrayList<>(a);
}
 
 
private static class ArrayList<E> extends AbstractList<E>
    implements RandomAccess, java.io.Serializable
{
    private static final long serialVersionUID = -2764017481108945198L;
    private final E[] a;
 
    ArrayList(E[] array) {
        a = Objects.requireNonNull(array);
    }
```
**她继承的是父类AbstractList里面的add和remove方法只是抛出异常**
```java
public void add(int index, E element) {
        throw new UnsupportedOperationException();
    }
 
public E remove(int index) {
        throw new UnsupportedOperationException();
    }
```
而java.util.ArrayList是这样的
```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    private static final long serialVersionUID = 8683452581122892189L;
    private static final int DEFAULT_CAPACITY = 10;
    private static final Object[] EMPTY_ELEMENTDATA = {};
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
```
他重写了父类的add和remove方法
```java
public boolean add(E e) {
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        elementData[size++] = e;
        return true;
    }
 
public E remove(int index) {
        rangeCheck(index);
 
        modCount++;
        E oldValue = elementData(index);
 
        int numMoved = size - index - 1;
        if (numMoved > 0)
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved);
        elementData[--size] = null; // clear to let GC do its work
 
        return oldValue;
    }
```
所以原因就在于，使用asList方法继承的父类的add和remove，只会抛出UnsupportedOperationException异常，java.util.ArrayList重写了父类的add和remove

**解决方法**
```java
String[] icarr = ico.split(",");
List<String> iconlist = new ArrayList<>(Arrays.asList(icarr));
```

### Collections 工具类
```java
List<String> apples = Collections.nCopies(3, "apple");
System.out.println(apples);
```
**这种方式添加的是不可变的、复制某个元素N遍的工具类**，以上程序输出：[apple, apple, apple]
老规则，如果要可变，使用 ArrayList 包装一遍。
```java
List<String> dogs = new ArrayList<>(Collections.nCopies(3, "dog"));
dogs.add("dog");
System.out.println(dogs);
```
还有初始化单个对象的 List 工具类，这种方式也是不可变的，集合内只能有一个元素，
这种也用得很少啊。
```java
List<String> cat = Collections.singletonList("cat");
System.out.println(cat);
```
还有一个创建空 List 的工具类，没有默认容量，节省空间，但不知道实际工作中有什么鸟用。
```java
List<String> cat = Collections.emptyList("cat");
```

### 匿名内部类
```java
List<String> names = new ArrayList<>() {{
    add("Tom");
    add("Sally");
    add("John");
}};

System.out.println(names);
```

### JDK8 Stream
```java
import  java.util.stream.Collectors;

List<String> colors = Stream.of("1", "4", "2").collect(Collectors.toList());
System.out.println(colors);
```
Stream 是 JDK 8 推出来的新概念，比集合还要更强大，还可以和集合互相转换。

### JDK 9 List.of
```java
List<String> cups = List.of("A", "B", "C");
System.out.println(cups);
```
这是 JDK 9 里面新增的 List 接口里面的静态方法，同样也是不可变的。

## int数组和Integer数组以及List＜Integer＞集合三者的相互转化
**int数组转List<Integer>集合 以及 List<Integer>集合转int数组**
```java
int[] nums = {3, 30, 34, 5, 9};
List<Integer> list = new ArrayList(Arrays.asList(nums));
```

# Map集合体系
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130525.png)

## Map父接口
特点：存储一对数据（Key-Value），无序、无下标，键不可重复，值可重复。
方法：
- `V put(K key, V value)`:将对象存入到集合中，关联键值。key重复则覆盖原值。
- `Object get(Object key)`:根据键获取对应的值。
- `Collection<V> values()`: 返回包含所有值的Collection集合。
- `Set<Map.Entry<K,V>> entrySet()` :的返回值也是返回一个Set集合，此集合的类型为Map.Entry。
- `Set<K> keySet()`:返回值是Map中key值的集合

Map.Entry是Map声明的一个内部接口，此接口为泛型，定义为Entry<K,V>。它表示Map中的一个实体（一个key-value对）

遍历Map的方式：
```java
public static void main(String[] args) throws Exception{
  Map<String, String> map = new HashMap<String, String>();
  map.put("key1", "value1");
  map.put("key2", "value2");
  map.put("key3", "value3");
  map.put("key3", "value3");

  //通过Map.keySet遍历key和value：
  for(String key : map.keySet()){
    System.out.println("key=" + key + " and value=" + map.get(key));
  }

  //通过Map.entrySet遍历key和value
  Set<Map.Entry<String, String>> entrySet = map.entrySet();
  for(Map.Entry<String, String> entry : entrySet){
    System.out.println("key=" + entry.getKey() + " and value=" + entry.getValue());
  }

  //通过Map.values()遍历所有的value，但不能遍历key
  for(String v : map.values()){
    System.out.println("key="+v );
  }
}
```

## Map实现类：HashMap
jdk1.2版本，线程不安全，运行效率快，允许null作为key或是value

- HashMap刚创建时，table是nu11，为了节省空间，当添加第一个素是，table容量调整为16
- 当元素个数大于阈值`（16*0.75=12）`时，会进行扩容，扩容后大小为原来的2倍。目的是减少调整元素的个数。
- jdk1.8当每个链表长度大于8，并且元素个数大于等于64时，会调整为红黑树，目的提高执行效率
- jdk1.8当链表长度小于6时，调整成链表
- jdk1.8以前，链表时头插入，jdk1.8以后时是尾插入

## Map实现类：Hashtable
jdk1.0版本，线程安全，运行效率慢，不允许null作为key或是value

## Map实现类：Properties
Hashtable的子类，要求key和value都是String。通常用于属性配置文件的读取
存取数据时，建议使用setProperty(String key, String value)方法和getProperty(String key)方法
```java
Properties pros = new Properties();
pros.load(new FileInputStream("jdbc.properties"));
String user = pros.getProperty("user");
System.out.println(user);
```

## Map实现类：TreeMap
实现了SortedMap接口(是Map的子接口)，可以对key自动排序

## 判重
HashMap中判断key是否重复的方法与HashSet判重方法一样，且解决hash冲突的方式都是链地址法
TreeSet中判断key是否重复的方法与TreeSet判重方法一样

# Collections工具类
概念：集合工具类，定义了除了存取以外的集合常用方法。
方法：
- public static void reverse(List<?> list)//反转集合中元素的顺序
- public static void shuffle(List<?>list)//随机重置集合元素的顺序
- public static void sort(List\<T>list)//升序排序（元素类型必须实现Comparable接口）
- public static \<T> void copy(List<? super T> dest, List<? extends T> src) //将集合sc复制到dest中
[详情](https://docs.oracle.com/javase/7/docs/api/java/util/Collections.html)

# 泛型
Java泛型是JDK1.5中引入的一个新特性，其本质是参数化类型，把类型作为参数传递。
常见形式有泛型类、泛型接口、泛型方法。
- 语法：
`<T,..>`称为类型占位符。表示一种引用类型。如果编写多个，使用逗号隔开
- 好处：
  - 提高代码的重用性
  - 防止类型转换异常，提高代码的安全性

## 泛型的类型可以为数组
**由于泛型表示的是引用类型**，而数组也是引用类型，所以泛型可以为数组

```java
class Student<T>{
  ArrayList<T> list = new ArrayList();
  public void add(T a){
    list.add(a);
  }
}
public class Te {
  public static void main(String[] args) {
    Student<int[]> st = new Student();
    st.add(new int[]{1,2});
    System.out.println(st.list.toString()); //输出：[[I@6504e3b2]
  }
}
```
```java
public static int[][] get(){
  ArrayList<int[]> list = new ArrayList();
  list.add(new int[]{1,2});
  list.add(new int[]{2});
  Integer[] arr;
  return list.toArray(new int[list.size()][]); 
}
```

## 没有指定泛型类型时
注：new泛型类，或实现泛型接口时，如果没有指定泛型，则泛型类或泛型接口中的泛型类型默认为Object
例如，如果没有指定泛型的话，则ArrayList可以添加任意类型的元素，并且默认所有类型都是Object
```java
public static void test10(){
  ArrayList list = new ArrayList();
  list.add(1);
  list.add("fff");
  list.add(true);
  System.out.println(list); //输出：[1, ff, true]
}
```

又例如:
```java
public static void main(String[] args){
  List<Integer> list = Arrays.asList(new Integer[]{1,3,5,2,6,3});
  Collections.sort(list, new Comparator(){
    public int compare(Object a, Object b){
      return (Integer)a < (Integer)b ? 1 : -1;
    }
  });
  System.out.println(list);
}
```
此代码为正确写法
由于没有指定Comparator的泛型，所以其抽象方法`int compare(T o1, T o2)`会变成`int compare(Object o1, Object o2)`，所以在没有指定Comparator的泛型的情况下实现compare方法时，写成`int compare(Integer o1, Integer o2)`, 则会报我们没有实现接口的抽象方法的错误。
如果指定Comparator的泛型为Integer，则其抽象方法`int compare(T o1, T o2)`会变成`int compare(Integer o1, Integer o2)`


```java
public static void test10(){
  ArrayList list = new ArrayList();
  list.add(new Person("whz", 12));

  System.out.println(((Person)list.get(0)).getAge()); //输出12

  System.out.println(list.get(0).getAge()); //报Object类型没有getAge()方法错误
}
```


<font color="red">虽然没有指定泛型类型与指定泛型为Object的底层效果一样，但是在编译器看来，这是不一样的；不同点如下：</font>

- 一个没有指定泛型类型的变量赋值与另一个指定了泛型类型的变量之间可以相互赋值
- 两个都指定了泛型类型且泛型类型不同的变量之间是不同相互赋值的
```java
List a = new ArrayList();
List<Integer> b = a;//编译通过

ArrayList<String> d = (ArrayList<String>)List.of("aaa", "bbb"); // 编译通过

List<Integer> c = new ArrayList();
List<Object> d = c;//编译不通过error: incompatible types: List<Integer> cannot be converted to List<Object>
```

### 声明泛型类/接口时，加<类名>与不加<类名>
**情况一：**
```java
List a = new ArrayList<String>();
a.add("jfdkf");
a.add("jfdkjf");
a.add(11);
```
`List a = new ArrayList<String>()`：会现在堆中生成一个泛型类型为String的ArrayList对象，然后赋给一个泛型类型为Object的引用变量a；所以a变量的泛型类型还是Object

**情况二：**
```java
List<String> a = new ArrayList();
a.add("jfdkf");
a.add("jfdkjf");
a.add(11);// error: incompatible types: int cannot be converted to String
```
`List<String> a = new ArrayList();`会先在堆中生成一个泛型类型为Object的ArrayList对象，然后赋给一个泛型类型为String的引用变量a；所以a变量的泛型类型为String

**实战**
以ArrayList中的`ArrayList(Collection<? extends E> c)`为例：
```java
List<String> a = new ArrayList();
a.add("aaa");
List<Integer> b = new ArrayList(a);
```
`List<Integer> b = new ArrayList(a);`: 因为`new ArrayList(a)`中ArrayList类的泛型类型为Object，即构造参数中`ArrayList(Collection<? extends E> c)`中的`E`为Object，所以a集合中的泛型类型符合`? extends E`，所以能创建一个ArrayList对象，然后将引用赋给泛型类型为Integer的引用变量b
。如果是`List<Integer> b = ne ArrayList<Integer>(a)`：则编译就不会通过了


## 泛型类
语法： 类名\<T,...>
```java
public class MyGeneric<T>{
  // 注: 泛型是不能new的， 即不能写成 T t = new T();
  T t;

  public void show(T t){
    System.out.println(t);
  }
  public T getT(){
    return t;
  }
}
```
```java
public class TestGeneric{
  public static void main(String[] args){
    MyGeneric<String> myGeneric = new MyGeneric<String>;
    myGeneric.t =  "hello";
    myGeneric.show("jfkdjfkd")
    String string = myGeneric.getT();
  }
}
```

## 泛型接口
语法: 接口名\<T,...>
```java
public interface MyInterface<T>{
  String name = "zhangsan";

  T server(T t);
}
```
实现泛型接口的两种方式：
1. 
```java
public class MyInterfaceImpl implements MyInterface<String>{
  @Override
  public String server(String t){
    System.out.println(t);
    return t;
  }
} 
```
2. 
```java
public class MyInterfaceImpl<T> implements MyInterface<T>{
  @Override
  public T server(T t){
    System.out.println(t);
    return t;
  }
} 
```

## 泛型方法
语法：`[访问修饰符] [static] <T> [void|T|类名] 方法名(参数)`

泛型方法与泛型类或泛型接口可以分开使用，即泛型方法不一定是位于泛型类中的。

以下两种情况中，泛型方法中的泛型类型是根据调用泛型方法时传入的参数确定的
- 泛型方法不是位于泛型类/接口
- 泛型方法位于泛型类/接口中，且泛型方法中的泛型符号与泛型类/接口中的泛型符号不同

当泛型方法是位于泛型类/接口中，且泛型方法中的泛型符号与泛型类/接口中的泛型符号相同时，则泛型方法中的泛型类型与泛型类/接口中的泛型类型相同

所有泛型方法声明都有一个类型参数声明部分（由尖括号分隔），该类型参数声明部分在方法返回类型之前，方法修饰符之后
```java
public class MyGenericMethod{
  public <T> T show(T t){
    System.out.println(t);
    return t;
  }
}
```
```java
static <T> void fromArrayToCollection(T[] a, Collection<T> c) {
    for (T o : a) {
        c.add(o); // Correct
    }
}
```
```java
interface Collection<E> {
    public <T> boolean containsAll(Collection<T> c);
    public <T extends E> boolean addAll(Collection<T> c);
    // Hey, type variables can have bounds too!
}
```
```java
public class TestGeneric{
  public static void main(String[] args){
    MyGenericMethod myGeneric = new MyGenericMethod();
    myGeneric.show("jfdkfjk"); 
    myGeneric.show(111); 
  }
}
```

## 泛型通配符
当使用泛型类或者接口时，传递的数据中，泛型类型不确定，可以通过通配符<?>表示
```java
class Parent{}

class Son extends Parent{}

class BoxUtils{
	public static void setBox(Box<Parent> box){
		System.out.println(box);
	}
}

public static void main(String[] args){
	Box<Parent> box = new Box<Parent>();
	BoxUtils.setBox(box);

	Box<Son> box1 = new Box<Son>();
	BoxUtils.setBox(box1); //编译时候出错
}
```

使用泛型通配符解决上述问题
```java
class BoxUtils{
	public static void setBox(Box<?> box){
		System.out.println(box);
	}
}
public static void main(String[] args){
	Box<Son> box1 = new Box<Son>();
	BoxUtils.setBox(box1); 
}
```

### 泛型上下限
JAVA的泛型中可以指定一个泛型的上限和下限
- 泛型的上限：
格式：类型名称<? extends 类>对象名称
意义：只能接收该类型及其子类
- 泛型的下限：
格式：类型名称<? super 类>对象名称
意义：只能接收该类型及其父类

注：泛型上下限是用于使用泛型类/接口/方法时，而不能用于创建泛型类/接口/方法。

### 调用泛型中的方法
```java
class Person<T> {
  public void show(T t) {
    t.show();
  }
}
class Worker {
  public void show() {
    System.out.println("get worker");
  }
}
```
光是`Person<T>`这个泛型类型的声明就无法编译通过。就不用说实例化`Person<Worker>`的地方了。为啥呢？因为`Person<T>`这个声明的意思实际上是：有一个泛型参数T，它可以被实例化为任意java.lang.Object的子类。实际上跟下面这个声明是等价的：
```java
class Person<T extends Object> {
  public void show(T t) {
    t.show(); // doesn't compile
  }
}
```
于是在`Person<T>`类型声明内，T类型可用的部分只有“java.lang.Object”这个上限类型所拥有的信息，也就是说调用`t.toString()`、`t.hashCode()`、`t.getClass()`之类的Object上有的方法都OK，但是调用`t.show()`则不行——因为作为T参数上限的Object类型没有show()方法。于是编译`Person<T>`这个类型声明的时候，类型检查就通不过，直接就失败了。要让这个例子能通过要怎么做呢？改变泛型参数T的类型信息即可。
例如说使它的上限变为更加具体的类型：
```java
interface IShowable {
  void show();
}

class Person<T extends IShowable> {
  public void show(T t) {
    t.show();
  }
}

class Worker implements IShowable {
  public void show() {
    System.out.println("get worker");
  }
}
```
这样在`Person<T>`这个泛型类型的声明中，泛型参数T就带有了足够的类型信息来表明它必须实现IShowable接口，于是T就可以使用`IShowable.show()`方法了。

**注意点**
```java
public class Main1{
  public static void main(String[] args){
    Student st = new Student(); 
    test(st); 
  }

  public static <T extends Person> void test(T t){
    System.out.println(t.age);  // 输出2
    //System.out.println(t.id); //编译报错
  }
}

class Person{
  public int age = 2;
}

class Student extends Person{
  public int id = 1;
}
```

使用`<T extends Person>`，则编译时，T就只能使用Person中的属性与方法，这是因为在编译时，编译器无法知道有哪些类是继承了Person， 所以不能使用Person子类中的属性与方法，否则会报错

## 泛型擦除
所谓泛型，就是指在定义一个类、接口或者方法时可以指定类型参数。这个类型参数我们可以在使用类、接口或者方法时动态指定。

使用泛型可以给我们带来如下的好处：
- 编译时类型检查：当我们使用泛型时，加入向容器中存入非特定对象在编译阶段就会报错。假如不使用泛型，可以向容器中存入任意类型，容易出现类型转换异常。
- 不需要进行类型强制转换：使用泛型后容器可以记住存入容器中的对象的类型；
- 代码可读性提升：使用泛型后开发人员看一眼就知道容器中存放的是何种对象。

有了上面的泛型擦除知识后，我们就可以理解下面的现象了：

1. 泛型类的class对象相同
```java
public static void main(String[] args) {  
    List<String> ls = new ArrayList<String>();  
    List<Integer> li = new ArrayList<Integer>();  
    System.out.println(ls.getClass() == li.getClass());  
}  
```

2. 不能对泛型数组进行初始化
```java
List<String>[] list = new List<String>[];  
```

3. instanceof 不允许存在泛型参数
```java
List<String> list = new ArrayList<String>();  
//在运行时list的泛型参数会被删除，所以判断不了类型
System.out.println(list instanceof List<String>)
```

# 比较器
在java中经常会涉及到对象数组的排序问题，那么就涉及到对象之间的比较问题
java实现对象排序的方式有两种：
- 自然排序：`java.lang.Comparable<T>`
- 定制排序：`java.util.Comparator<T>`

**Comparable与Comparator都是函数式接口**

## 自然排序：Comparable
- Comparable接口强行对实现它的每个类的对象进行整体排序，这种排序被称为类的自然排序
- 实现Comparable接口的类必须要实现compareTo(Object obj)方法。对于执行`e1.compareTo(e2)`,有下面三种情况
  - 如果这个方法返回正整数，表示e1对象大于e2对象；
  - 如果这个方法返回0，表示e1对象等于e2对象；
  - 如果这个方法返回负整数，表示e1对象小于e2对象；
- 实现Comparable接口的对象列表(和数组)可以同通过Collections.sort或Arrays.sort进行自动排序。实现此接口的对象可以用作有序映射中的键或有序集合中的元素，无需指定比较器
- 对于类C的每一个e1和e2来说，当且仅当e1.compareTo(e2)==0与e1.equals(e2)具有相同的boolean值时，类C的自然排序才叫做与equals一致。建议(虽然不是必须的)最好使自然排序与equals一致
```java
class Person implements Comparable<Person>{
    String name; 
    int age;
    @Override
     public int compareTo(Person person) {
          return name.compareTo(person.name);
          //return this.name - person.name;
     }
}
ArrayList<Person> list = new ArrayList<Person>();
// 添加对象到ArrayList中
list.add(new Person("aaa", 10));
list.add(new Person("bbb", 20));
list.add(new Person("ccc", 30));
list.add(new Person("ddd", 40));
Collections.sort(list); //这里会自动调用Person中重写的compareTo方法。
```

## 定制排序：Comparator
- 当元素的类型没有实现java.lang.Comparable接口而又不方便修改代码，或者实现了java.lang.Comparable接口的排序规则不适合当前的操作，那么可以考虑使用Comparator的对象来排序，强行对多个对象进行整体排序的比较
- 重写compare(Object o1, Object o2)方法，比较o1和o2的大小, 有三种情况：
  - 如果方法返回正整数，则表示o1大于o2;
  - 如果返回0，表示相等；
  - 返回负整数，表示o1小于o2
- 可以将Comparator传递给sort方法(如Collections.sort或Arrays.sort), 从而允许在排序顺序上实现精确控制
- 还可以使用Comparator来控制某些数据结构(如有序set或有序映射)的顺序，或者为那些没有自然顺序的对象collection提供排序
```java
public class ComparatorDemo {
    public static void main(String[] args) {
        List<Person> people = Arrays.asList(
                new Person("Joe", 24),
                new Person("Pete", 18),
                new Person("Chris", 21)
        );

        //第一种方式
        Collections.sort(people, new LexicographicComparator());
        System.out.println(people);
        //[{name=Chris, age=21}, {name=Joe, age=24}, {name=Pete, age=18}]


        //第二种方式
        Collections.sort(people, new Comparator<Person>() {
            @Override
            public int compare(Person a, Person b) {
                // TODO Auto-generated method stub
                 return a.age < b.age ? -1 : a.age == b.age ? 0 : 1;
            }
        });
        System.out.println(people);
        //[{name=Pete, age=18}, {name=Chris, age=21}, {name=Joe, age=24}]
    }
}
class LexicographicComparator implements Comparator<Person> {
    @Override
    public int compare(Person a, Person b) {
        return a.name.compareToIgnoreCase(b.name);
    }
}
class Person {
    String name;
    int age;
    Person(String n, int a) {
        name = n;
        age = a;
    }
    @Override
    public String toString() {
        return String.format("{name=%s, age=%d}", name, age);
    }
}
```

## 比较器比较原理
要比较两个元素A与B的大小，会调用compare(A, B)或A.compareTo(B)方法，返回为正数表明A大; 返回负数表明B大；返回0表明一样大

例如实现降序排序
```java
public static void main(String[] args){
  List<Integer> list = Arrays.asList(new Integer[]{1,3,5,2,6});
  Collections.sort(list, (a, b) -> a < b ? 1 : -1);
  System.out.println(list);
}
```


# 枚举类
枚举是一个被命名的整型常数的集合，枚举在日常生活中很常见，例如表示星期的SUNDAY、MONDAY、TUESDAY、WEDNESDAY、THURSDAY、FRIDAY、SATURDAY就是一个枚举。通俗来说，枚举就是一个对象的所有可能取值的集合

- 枚举类的实现
  - JDK1.5之前需要自定义枚举类
  - JDK 1.5 新增的 enum 关键字用于定义枚举类

- 若枚举只有一个对象, 则可以作为一种单例模式的实现方式。

- 枚举类的属性
  - 枚举类对象的属性不应允许被改动, 所以应该使用 private final 修饰
  - 枚举类的使用 private final 修饰的属性应该在构造器中为其赋值
  - 若枚举类显式的定义了带参数的构造器, 则在列出枚举值时也必须对应的传入参数

- 自定义枚举类
  - <font color="red">私有化类的构造器，保证不能在类的外部创建其对象</font>
  - 在类的内部创建枚举类的实例。声明为：public static final 
  - 对象如果有实例变量，应该声明为private final，并在构造器中初始化
```java
class Season{
    private final String SEASONNAME;//季节的名称
    private final String SEASONDESC;//季节的描述
    private Season(String seasonName,String seasonDesc){
        this.SEASONNAME = seasonName;
        this.SEASONDESC = seasonDesc;
    }
    
    //枚举类实例
    public static final Season SPRING = new Season("春天", "春暖花开");
    public static final Season SUMMER = new Season("夏天", "夏日炎炎");
    public static final Season AUTUMN = new Season("秋天", "秋高气爽");
    public static final Season WINTER = new Season("冬天", "白雪皑皑");
}
```

## 使用enum定义枚举类
使用说明
- 使用 enum 定义的枚举类默认继承了 java.lang.Enum类，因此不能再继承其他类
- 枚举类的构造器只能使用 private 权限修饰符
- 枚举类的所有实例必须在枚举类中显式列出,以`,`分隔`;`结尾。列出的实例系统会自动添加 public static final 修饰
- 必须在枚举类的第一行声明枚举类对象
- JDK 1.5 中可以在 switch 表达式中使用Enum定义的枚举类的对象作为表达式, case 子句可以直接使用枚举值的名字, 无需添加枚举类作为限定。
```java
public enum SeasonEnum {
    //枚举类实例
    SPRING("春天","春风又绿江南岸"),
    SUMMER("夏天","映日荷花别样红"),
    AUTUMN("秋天","秋水共长天一色"),
    WINTER("冬天","窗含西岭千秋雪");

    private final String seasonName;
    private final String seasonDesc;
    private SeasonEnum(String seasonName, String seasonDesc) {
        this.seasonName = seasonName;
        this.seasonDesc = seasonDesc; 
    }
    public String getSeasonName() {
        return seasonName;
    }
    public String getSeasonDesc() {
        return seasonDesc; 
    } 
}
```

**Enum类的主要方法**
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130539.png)
- values()方法：返回枚举类型的对象数组。该方法可以很方便地遍历所有的枚举值。
- valueOf(String str)：可以把一个字符串转为对应的枚举类对象。要求字符串必须是枚举类对象的“名字”。如不是，会有运行时异常：IllegalArgumentException。 
- toString()：返回当前枚举类对象常量的名称

**实现接口的枚举类**
- 和普通 Java 类一样，枚举类可以实现一个或多个接口
- 若每个枚举值在调用实现的接口方法呈现相同的行为方式，则只要统一实现该方法即可。
- 若需要每个枚举值在调用实现的接口方法呈现出不同的行为方式, 则可以让每个枚举值分别来实现该方法

情况一：在Enum类中实现抽象方法
```java
interface Info{
  void show();
}

enum SeasonEnum implements Info{
  SPRING("spring", "jfkdfj"),
  SUMMER("summer", "hkfjdk");

  private final String seasonName;
  private final String seasonDesc;

  private SeasonEnum(String seasonName, String seasonDesc){
    this.seasonName = seasonName;
    this.seasonDesc = seasonDesc;
  }
  @Override
  public void show(){
    System.out.println("fjfj");
  }
}
```
情况二：让枚举类的对象分别实现接口中的抽象方法
```java
interface Info{
  void show();
}

enum SeasonEnum implements Info{
  SPRING("spring", "jfkdfj"){
    @Override
    public void show(){
      System.out.println("fjkdjf");
    }
  },
  SUMMER("summer", "hkfjdk"){
    @Override
    public void show(){
      System.out.println("fjfj");
    }
  };
  private final String seasonName;
  private final String seasonDesc;
  private SeasonEnum(String seasonName, String seasonDesc){
    this.seasonName = seasonName;
    this.seasonDesc = seasonDesc;
  }
}
```

# 注解
<font color="red">注解一定要配合反射使用才能起作用，否则注解没点作用</font>

- 从 JDK 5.0 开始, Java 增加了对元数据(MetaData) 的支持, 也就是Annotation(注解) 
- Annotation 其实就是代码里的特殊标记, 这些标记可以在编译, 类加载, 运行时被读取, 并执行相应的处理。通过使用 Annotation, 程序员可以在不改变原有逻辑的情况下, 在源文件中嵌入一些补充信息。代码分析工具、开发工具和部署工具可以通过这些补充信息进行验证或者进行部署。
- Annotation 可以像修饰符一样被使用, 可用于修饰包,类, 构造器, 方法, 成员变量, 参数, 局部变量的声明, 这些信息被保存在 Annotation 的 “name=value” 对中
- 在JavaSE中，注解的使用目的比较简单，例如标记过时的功能，忽略警告等。在JavaEE/Android中注解占据了更重要的角色，例如用来配置应用程序的任何切面，代替JavaEE旧版中所遗留的繁冗代码和XML配置等。 
- 未来的开发模式都是基于注解的，JPA是基于注解的，Spring2.5以上都是基于注解的，Hibernate3.x以后也是基于注解的，现在的Struts2有一部分也是基于注解的了，注解是一种趋势，一定程度上可以说：框架 = 注解 + 反射 + 设计模式。
- 使用 Annotation 时要在其前面增加 @ 符号, 并把该 Annotation 当成一个修饰符使用。用于修饰它支持的程序元素

示例一：生成文档相关的注解
@author 标明开发该类模块的作者，多个作者之间使用,分割
@version 标明该类模块的版本
@see 参考转向，也就是相关主题
@since 从哪个版本开始增加的
@param 对方法中某参数的说明，如果没有参数就不能写
@return 对方法返回值的说明，如果方法的返回值类型是void就不能写
@exception 对方法可能抛出的异常进行说明 ，如果方法没有用throws显式抛出的异常就不能写
其中
@param @return 和 @exception 这三个标记都是只用于方法的。
@param的格式要求：@param 形参名 形参类型 形参说明
@return 的格式要求：@return 返回值类型 返回值说明
@exception的格式要求：@exception 异常类型 异常说明
@param和@exception可以并列多个

```java
package com.annotation.javadoc;
/**
* @author shkstart
* @version 1.0
* @see Math.java
*/
public class JavadocTest {
  /**
  * 程序的主方法，程序的入口
  * @param args String[] 命令行参数
  */
  public static void main(String[] args) {
  }
  /**
  * 求圆面积的方法
  * @param radius double 半径值
  * @return double 圆的面积
  */
  public static double getArea(double radius){
    return Math.PI * radius * radius; 
  }
}
```

## 自定义注解
- 定义新的 Annotation 类型使用 @interface 关键字
- 自定义注解自动继承了java.lang.annotation.Annotation接口
- Annotation 的成员变量在 Annotation 定义中以无参数方法的形式来声明。其方法名和返回值定义了该成员的名字和类型。我们称为配置参数。类型只能是八种基本数据类型、String类型、Class类型、enum类型、Annotation类型、以上所有类型的数组。 
- 可以在定义Annotation的成员变量时为其指定初始值, 指定成员变量的初始值可使用 default 关键字
- 如果只有一个参数成员，建议使用参数名为value
- 如果定义的注解含有配置参数，那么使用时**必须**指定参数值，除非它有默认值。格式是“参数名=参数值”. 如果仅给value属性赋值时，此时value属性可以省略，只写属性值。
- 没有成员定义的Annotation称为标记，例如@Override注解。 包含成员变量的 Annotation 称为元数据 Annotation

```java
@MyAnnotation(value="尚硅谷")
public class MyAnnotationTest {
  public static void main(String[] args) {
    Class clazz = MyAnnotationTest.class;
    Annotation a = clazz.getAnnotation(MyAnnotation.class);
    MyAnnotation m = (MyAnnotation) a;
    String info = m.value();
    System.out.println(info);
  } 
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface MyAnnotation{
  String value() default "auguigu"; 
}
```

## 元注解
JDK 的元注解用于修饰其他注解定义
JDK5.0提供了4个标准的meta-annotation类型，分别是：
- Retention
- Target
- Documented
- Inherited

**@Retention**
@Retention: 只能用于修饰一个 Annotation 定义, 用于指定该Annotation的生命周期, @Rentention包含一个RetentionPolicy类型的成员变量, 使用@Rentention时必须为该 value 成员变量指定值: 
- RetentionPolicy.SOURCE:在源文件中有效（即源文件保留），编译器直接丢弃这种策略的注释
- RetentionPolicy.CLASS:在class文件中有效（即class保留） ， 当运行Java程序时, JVM不会保留注解。 这是默认值
- RetentionPolicy.RUNTIME:在运行时有效（即运行时保留），当运行 Java 程序时, JVM 会保留注释。程序可以通过反射获取该注释。

*只有声明为RUNTIME的注解，才能通过反射获取*

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130603.png)

**@Targe**
@Target: 用于修饰 Annotation 定义, 用于指定被修饰的 Annotation 能用于修饰哪些程序元素。 @Target 也包含一个名为 value 的成员变量
| 取值(ElementType) |                                            |
| ----------------- | ------------------------------------------ |
| CONSTRUCTOR       | 用于描述构造器                             |
| FIELD             | 用于描述域                                 |
| LOCAL_VARIABLE    | 用于描述局部变量                           |
| METHOD            | 用于描述方法                               |
| PACKAGE           | 用于描述包                                 |
| PARAMETER         | 用于描述参数                               |
| TYPE              | 用于描述类、接口（包括注解类型）或enum声明 |

**@Documented**
@Documented: 用于指定被该元 Annotation 修饰的 Annotation 类将被javadoc 工具提取成文档。默认情况下，javadoc是不包括注解的。 
定义为Documented的注解必须设置Retention值为RUNTIME。 

**@Inherited**
@Inherited: 被它修饰的 Annotation 将具有继承性。如果某个类使用了被@Inherited 修饰的 Annotation, 则其子类将自动具有该注解。
比如：如果把标有@Inherited注解的自定义的注解标注在类级别上，子类则可以继承父类类级别的注解

**利用反射获取注解信息**


# 反射
Reflection（反射）是被视为动态语言的关键，反射机制允许程序在执行期借助于Reflection API取得任何类的内部信息，并能直接操作任意对象的内部属性及方法。
加载完类之后，在堆内存中就产生了一个Class类型的对象（一个类只有一个Class对象），**我们可以通过这个对象看到类的结构**。这个对象就像一面镜子，透过这个镜子看到类的结构，所以，我们形象的称之为：反射。

正常方式：引入需要的“包类”名称 -》 通过new实例化 -》 取得实例化对象
反射方式：实例化对象 -》 getClass()方法 -》 取得完整的“包类”名称

>补充： 动态语言 vs 静态语言
- 动态语言：是一类在运行时可以改变其结构的语言：例如新的函数、对象、甚至代码可以被引进，已有的函数可以被删除或是其他结构上的变化。通俗点说就是在运行时代码可以根据某些条件改变自身结构。
主要动态语言：Object-C、C#、JavaScript、PHP、Python、Erlang。
- 静态语言：与动态语言相对应的，运行时结构不可变的语言就是静态语言。如Java、C、C++。
Java不是动态语言，但Java可以称之为“准动态语言”。即Java有一定的动态性，我们可以利用反射机制、字节码操作获得类似动态语言的特性。
Java的动态性让编程的时候更加灵活！

**java反射机制提供的功能**
- 在运行时判断任意一个对象所属的类
- 在运行时构造任意一个类的对象
- 在运行时判断任意一个类所具有的成员变量和方法
- 在运行时调用任意一个对象的成员变量和方法
- 在运行时获取泛型信息
- 在运行时处理注解
- 生成动态代理

**反射相关的主要API**
- java.lang.Class：代表一个类
- java.lang.reflect.Method：代表类的方法
- java.lang.reflect.Field：代表类的成员变量
- java.lang.reflect.Constructor：代表类的构造器

## Class类的实例
- Class类：我们平时在开发中定义的类是用来描述业务逻辑的；比如Teacher.java，Student.java等，而Class类用来描述我们所定义的业务逻辑的类，也就是描述类的类。
- Class类的实例：其实就是JVM中的字节码对象，一个字节码文件有一个字节码对象，一个Class实例表示在JVM中的某个类或者接口，且一个加载的类在JVM中<font color="red">只会</font>有一个Class实例。 类的实例化就是先通过这个类的Class类的实例，即字节码对象来创建的。所以每个类的实例都会记得自己是由哪个Class实例所生成的

每一个类都有都有一个Class对象，也就是说每个类都有一个字节码对象，有一个字节码文件。当第一次使用类的时候，该类的字节码文件会被加载到JVM中，创建一个字节码对象；此时，该字节码对象就是一个Class实例。
既然每一个类都有一个Class对象，那么这些Class对象之间是如何区分它所表示的是哪一个类的字节码的呢？为了解决这个问题，Java 为Class提供了泛型：`Class<T>`。
- java.lang.String类的字节码类型：`Class<java.lang.String>`;
- java.util.Date类的字节码类型：`Class<java.util.Date>`;
- java.util.ArrayList类的字节码类型：`Class<java.util.ArrayList>`;

**Class类的常用方法**
| 方法名                                           | 功能说明                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| static Class forName(String name)                | 返回指定类名 name 的 Class 对象                                     |
| Object newInstance()                             | 调用缺省构造函数，返回该Class对象的一个实例                         |
| getName()                                        | 返回此Class对象所表示的实体（类、接口、数组类、基本类型或void）名称 |
| Class getSuperClass()                            | 返回当前Class对象的父类的Class对象                                  |
| Class [] getInterfaces()                         | 获取当前Class对象的接口                                             |
| ClassLoader getClassLoader()                     | 返回该类的类加载器                                                  |
| Class getSuperclass()                            | 返回表示此Class所表示的实体的超类的Class                            |
| Constructor[] getConstructors()                  | 返回一个包含某些Constructor对象的数组                               |
| Field[] getDeclaredFields()                      | 返回Field对象的一个数组                                             |
| Method getMethod(String name,Class … paramTypes) | 返回一个Method对象，此对象的形参类型为paramType                     |

**获取Class实例/字节码对象的方法**
```java
//方式一：类名.class
Class<Person> clazz1 = Person.class;
Class clazz2 = Person.class;

//方式二：通过调用字节码对象的实例的getClass()方法
Person p1 = new Person();
Class clazz2 = p1.getClass();

//方式三：调用Class类的静态方法forName(String classPath)
Class clazz3 = Class.forName("com.atguigu.java.Person");

//方式四：使用类加载器ClassLoader
ClassLoader classLoader = ReflectionTest.class.getClassLoader();
Class clazz4 = classLoader.loadClass("com.atguigu.java.Person");
```

**哪些类型可以有Class对象？**
- class： 外部类，成员(成员内部类，静态内部类)，局部内部类，匿名内部类
- interface：接口
- []：数组
- enum：枚举
- annotation：注解@interface
- primitive type：基本数据类型
- void

```java
Class c1 = Object.class;
Class c2 = Comparable.class;
Class c3 = String[].class;
Class c4 = int[][].class;
Class c5 = ElementType.class;
Class c6 = Override.class;
Class c7 = int.class;
Class c8 = void.class;
Class c9 = Class.class;
int[] a = new int[10];
int[] b = new int[100];
Class c10 = a.getClass();
Class c11 = b.getClass();
// 只要元素类型与维度一样，就是同一个Class
System.out.println(c10 == c11);
```

## 获取字节码对象的完整结构
- 实现的全部接口
public Class<?>[] getInterfaces() 
确定此对象所表示的类或接口实现的接口。

- 所继承的父类
public Class<? Super T> getSuperclass()
返回表示此 Class 所表示的实体（类、接口、基本类型）的父类的Class。

- 全部的构造器
public Constructor\<T>[] getConstructors()
返回此 Class 对象所表示的类的所有public构造方法。
public Constructor\<T>[] getDeclaredConstructors()
返回此 Class 对象表示的类声明的所有构造方法。
public Constructor\<T> getConstructor(Class<?>... parameterTypes)
返回此 Class 对象表示的类声明的指定的构造方法。
  - Constructor类中：
    取得修饰符: public int getModifiers();
    取得方法名称: public String getName();
    取得参数的类型：public Class<?>[] getParameterTypes();
    实例化对象：T newInstance(Object... initargs)
```java
//1.根据全类名获取对应的Class对象
String name = "atguigu.java.Person";
Class clazz = Class.forName(name);
//2.调用指定参数结构的构造器，生成Constructor的实例
Constructor con = clazz.getConstructor(String.class,Integer.class);
//3.通过Constructor的实例创建对应类的对象，并初始化类属性
Person p2 = (Person) con.newInstance("Peter",20);
System.out.println(p2);
```

- 全部的方法
public Method[] getDeclaredMethods()
返回此Class对象所表示的类或接口的全部方法
public Method[] getMethods() 
返回此Class对象所表示的类或接口的public的方法
  - Method类中：
    public Class<?> getReturnType()取得全部的返回值
    public Class<?>[] getParameterTypes()取得全部的参数
    public int getModifiers()取得修饰符
    public Class<?>[] getExceptionTypes()取得异常信息

- 全部的Field
public Field[] getFields() 
返回此Class对象所表示的类或接口的public的Field。 
public Field[] getDeclaredFields() 
返回此Class对象所表示的类或接口的全部Field。 
  - Field方法中：
    public int getModifiers() 以整数形式返回此Field的修饰符
    public Class<?> getType() 得到Field的属性类型
    public String getName() 返回Field的名称。
    public void set(Object obj, Object value) 设置当前属性值
    public Object get(Object obj) 获取当前属性值

- Annotation相关
Annotation[]	getAnnotations() 获取所有注解，包括父类
Annotation[] getDeclaredAnnotations()  获取直接声明在类上面的所有注解
`<A extends Annotation>` A	getDeclaredAnnotation(`Class<A>` annotationClass) 获取直接声明在类上面的指定类型的注解
T getAnnotation(`Class\<T>` annotationClass) 获取指定类型的注解
boolean	isAnnotationPresent(Class<? extends Annotation> annotationClass) 如果此元素上存在指定类型的注释，则返回 true，否则返回 false。

- 泛型相关
获取父类泛型类型：Type getGenericSuperclass()
泛型类型：ParameterizedType
获取实际的泛型类型参数数组：getActualTypeArguments()


- 类所在的包
Package getPackage()

## 调用运行时类的指定结构
### 调用指定方法
通过反射，调用类中的方法，通过Method类完成。步骤：
1. 通过Class类的getMethod(String name,Class…parameterTypes)方法取得一个Method对象，并设置此方法操作时所需要的参数类型。参数说明：
  - name: method的名称
  - parameterTypes：method的参数类型的列表（参数顺序需按声明method时的参数列表排列）
2. 之后使用Object invoke(Object obj, Object[] args)进行调用，并向方法中传递要设置的obj对象的参数信息,说明：
  - Object: 对应原方法的返回值，若原方法无返回值，此时返回null
  - obj: 从中调用底层方法的对象（简单的说就是调用谁的方法用谁的对象), 若原方法若为静态方法，此时形参Object obj可为null
  - args: 用于方法调用的参数, 若原方法形参列表为空，则Object[] args为null

注意：若原方法声明为private, 则需要在调用此invoke()方法前，显式调用方法对象的setAccessible(true)方法，将可访问private的方法。

例子：
```java
import java.lang.reflect.Method;
public class Main {
  public static void main(String[] args) throws Exception{
    String[] names = { "tom", "tim", "allen", "alice" };
    Class<?> clazz = Test.class;

    Method method  = clazz.getMethod("sayHi", String.class);
    for (String name : names) {
      method.invoke(clazz.newInstance(), name);
    }
  }
}

class Test {
  public void sayHi(String name) {
    System.out.println("Hi" + name);
  }
}
```
输出：
```txt
Hitom
Hitim
Hiallen
Hialice
```

### 调用指定属性
在反射机制中，可以直接通过Field类操作类中的属性，通过Field类提供的set()和get()方法就可以完成设置和取得属性内容的操作。
- public Field getField(String name) 返回此Class对象表示的类或接口的指定的public的Field。 
- public Field getDeclaredField(String name)返回此Class对象表示的类或接口的指定的Field。 

在Field中：
- public Object get(Object obj) 取得指定对象obj上此Field的属性内容
- public void set(Object obj,Object value) 设置指定对象obj上此Field的属性内容

### 关于setAccessible方法的使用
- Method和Field、Constructor对象都有setAccessible()方法。
- setAccessible启动和禁用访问安全检查的开关。 
- 参数值为true则指示反射的对象在使用时应该取消Java语言访问检查。 提高反射的效率。如果代码中必须用反射，而该句代码需要频繁的被调用，那么请设置为true。 使得原本无法访问的私有成员也可以访问
- 参数值为false则指示反射的对象应该实施Java语言访问检查
```java
Class clazz = Person.class;   
Field name = clazz.getDeclaredField("name"); 
name.setAccessible(true);
Person p = (Person)clazz.newInstance();
name.set(p, "whz");
System.out.println(name.get(p));
```

### InvocationHandler接口
InvocationHandler接口是由代理对象的调用处理程序实现的接口，每个代理对象都有一个关联的调用处理程序，当在代理实例上调用方法时，方法调用将被编码并分派到其调用处理程序的Invoke方法, 该接口就只有一个方法`Object invoke(Ojbect proxy, Method method, Object[] args)`，
参数：
- proxy: 调用该方法的代理对象
- method: 所述方法对应于调用代理实例上的接口方法的实例。
- args：包含的方法调用传递代理对象的参数值的对象，或null。

# java实现代理
有关代理的知识可以见`设计模式.md`笔记

## jdk动态代理
所谓的jdk动态代理就是使用使用jdk反射包(java.lang.reflect)中的类和接口来实现动态代理的功能。主要是使用反射包中的三个类：InvocationHandler、Method、Proxy

我们来比较Java的class和interface的区别：
- 可以实例化class（非abstract）；
- 不能实例化interface。
所有interface类型的变量总是通过某个实例向上转型并赋值给接口类型变量的：
```java
CharSequence cs = new StringBuilder();
```
有没有可能不编写实现类，直接在运行期创建某个interface的实例呢？

这是可能的，因为Java标准库提供了一种动态代理（Dynamic Proxy）的机制：可以在运行期动态创建某个interface的实例。

什么叫运行期动态创建？听起来好像很复杂。所谓动态代理，是和静态相对应的。我们来看静态代码怎么写：

定义接口：
```java
public interface Hello {
    void morning(String name);
}
```
编写实现类：
```java
public class HelloWorld implements Hello {
    public void morning(String name) {
        System.out.println("Good morning, " + name);
    }
}
```
创建实例，转型为接口并调用：
```java
Hello hello = new HelloWorld();
hello.morning("Bob");
```

这种方式就是我们通常编写代码的方式。

还有一种方式是动态代码，我们仍然先定义了接口Hello，但是我们并不去编写实现类，而是直接通过JDK提供的一个`Proxy.newProxyInstance()`创建了一个Hello接口对象。这种没有实现类但是在运行期动态创建了一个接口对象的方式，我们称为动态代码。JDK提供的动态创建接口对象的方式，就叫动态代理。

一个最简单的动态代理实现如下：
```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class Main {
    public static void main(String[] args) {
        InvocationHandler handler = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println(method);
                if (method.getName().equals("morning")) {
                    System.out.println("Good morning, " + args[0]);
                }
                return null;
            }
        };
        Hello hello = (Hello) Proxy.newProxyInstance(
            Hello.class.getClassLoader(), // 传入ClassLoader
            new Class[] { Hello.class }, // 传入要实现的接口
            handler); // 传入处理调用方法的InvocationHandler
        hello.morning("Bob");
    }
}

interface Hello {
    void morning(String name);
}
```

在运行期动态创建一个interface实例的方法如下：
1. 定义一个InvocationHandler实例，它负责实现接口的方法调用；
2. 通过Proxy.newProxyInstance()创建interface实例，它需要3个参数：
  1. 使用的ClassLoader，通常就是接口类的ClassLoader；
  2. 需要实现的接口数组，至少需要传入一个接口进去；
  3. 用来处理接口方法调用的InvocationHandler实例。
3. 将返回的Object强制转型为接口。

动态代理实际上是JVM在运行期动态创建class字节码并加载的过程，它并没有什么黑魔法，把上面的动态代理改写为静态实现类大概长这样：
```java
public class HelloDynamicProxy implements Hello {
    InvocationHandler handler;
    public HelloDynamicProxy(InvocationHandler handler) {
        this.handler = handler;
    }
    public void morning(String name) {
        handler.invoke(
           this,
           Hello.class.getMethod("morning", String.class),
           new Object[] { name });
    }
}
```
其实就是JVM帮我们自动编写了一个上述类（不需要源码，可以直接生成字节码），并不存在可以直接实例化接口的黑魔法。

**小结:**
- Java标准库提供了动态代理功能，允许在运行期动态创建一个接口的实例；
- 动态代理是通过Proxy创建代理对象，然后将接口方法“代理”给InvocationHandler完成的。


# 嵌套类
内部类分为成员内部类、静态嵌套类、方法内部类、匿名内部类。

几种内部类的共性：
- 内部类仍然是一个独立的类，在编译之后会内部类会被编译成独立的.class文件，但是前面冠以外部类的类命和$符号。
- 内部类不能用普通的方式访问。内部类是外部类的一个成员，因此内部类可以自由地访问外部类的成员变量，无论是否是private的。

## 成员内部类
- 成员内部类可以访问外部类的所有成员，外部类要访问成员内部类的成员时，必须要先创建一个成员内部类，再通过指向这个对象的引用来访问
- 当成员内部类拥有和外部类同名的成员变量或者方法时，默认情况下访问的是成员内部类的成员
- 如果要访问外部类的同名成员，需要按照`外部类.this.成员变量（方法）`形式来访问
- 成员内部类是依附外部类而存在的，如果要创建成员内部类的对象，前提是必须存在一个外部类的对象
- 创建成员内部类对象一般有如下2种方式：
  - Outer.Inner in1 = new Outer().new Inner()
  - Outer.Inner in2 = new Outer().getInnerInstance();

## 静态内部类
- 静态内部类可以在不创建外部类对象的情况下被实例化。创建静态内部类对象的语法格式：`Outer.Inner in = new Outer.Inner()`
- 静态内部类只能访问外部类的静态成员
- 静态内部类中能定义静态成员，而非静态内部类中不能定义静态成员

## 方法内部类
- 方法内部类为在成员方法中定义的类，只能在当前方法中被使用
- 方法内部类对象不能使用该内部类所在方法中的非final局部变量

## 匿名内部类
- 匿名内部类必须要继承一个父类或者实现一个接口，没有class关键字，直接使用new来生成一个隐式的对象引用。
- 只有一个实例

### 继承式的匿名内部类
```java
class Car {
  public void drive(){
      System.out.println("Driving a car!");
  }
}
  
class Test{
  public static void main(String[] args) {
      Car car = new Car(){
          public void drive(){
              System.out.println("Driving another car!");
          }
      };
      car.drive();
  }
}
```
结果输出了：Driving another car! 

Car引用变量不是引用Car对象，而是Car匿名子类的对象。

### 接口式的匿名内部类。
```Java
interface  Vehicle {
    public void drive();
}
    
class Test{
    public static void main(String[] args) {
        Vehicle v = new Vehicle(){
            public void drive(){
                System.out.println("Driving a car!");
            }
        };
        v.drive();
    }
}
```
上面的代码很怪，好像是在实例化一个接口。事实并非如此，接口式的匿名内部类是实现了一个接口的匿名类。而且只能实现一个接口。

### 参数式的匿名内部类。
```java
class Bar{
    void doStuff(Foo f){}
}
interface Foo{
    void foo();
}
class Test{
    static void go(){
        Bar b = new Bar();
        b.doStuff(new Foo(){
            public void foo(){
                System.out.println("foofy");
            }
        });
    }
}
```

# IO流
## File类
- java.io.File类：文件和文件目录路径的抽象表示形式，与平台无关
- File 能新建、删除、重命名文件和目录，<font color="red">但File不能访问文件内容本身。</font>
- 如果需要访问文件内容本身，则需要使用输入/输出流。 
- 想要在Java程序中表示一个真实存在的文件或目录，那么必须有一个File对象，但是Java程序中的一个File对象，可能没有一个真实存在的文件或目录。 
- File对象可以作为参数传递给流的构造器

**常用构造器**
- public File(String pathname) 以pathname为路径创建File对象，可以是绝对路径或者相对路径，如果pathname是相对路径，则默认的当前路径在系统属性user.dir中存储。
  - 绝对路径：是一个固定的路径,从盘符开始
  - 相对路径：是相对于某个位置开始
- public File(String parent,String child) 以parent为父路径，child为子路径创建File对象。
- public File(File parent,String child) 根据一个父File对象和子文件路径创建File对象

**路径分隔符**
- 路径中的每级目录之间用一个路径分隔符隔开。
- 路径分隔符和系统有关：
  - windows和DOS系统默认使用“\”来表示
  - UNIX和URL使用“/”来表示
- Java程序支持跨平台运行，因此路径分隔符要慎用。
- 为了解决这个隐患，File类提供了一个常量：
`public static final String separator`。根据操作系统，动态的提供分隔符。

举例
```java
File file1 = new File("d:\\atguigu\\info.txt");
File file2 = new File("d:"+File.separator+"atguigi"+File.separator+"info.txt");
File file3 = new File("d:/atguigu");
```

**File类常用方法**
File类的获取功能
- public String getAbsolutePath()：获取绝对路径
- public String getPath() ：获取路径
- public String getName() ：获取名称
- public String getParent()：获取上层文件目录路径。若无，返回null
- public long length() ：获取文件长度（即：字节数）。不能获取目录的长度。 
- public long lastModified() ：获取最后一次的修改时间，毫秒值
- public String[] list() ：获取指定目录下的所有文件或者文件目录的名称数组
- public File[] listFiles() ：获取指定目录下的所有文件或者文件目录的File数组

File类的重命名功能
- public boolean renameTo(File dest):把文件重命名为指定的文件路径

File类的判断功能
- public boolean isDirectory()：判断是否是文件目录
- public boolean isFile() ：判断是否是文件
- public boolean exists() ：判断是否存在
- public boolean canRead() ：判断是否可读
- public boolean canWrite() ：判断是否可写
- public boolean isHidden() ：判断是否隐藏

File类的创建功能
- public boolean createNewFile() ：创建文件。若文件存在，则不创建，返回false
- public boolean mkdir() ：创建文件目录。如果此文件目录存在，就不创建了。如果此文件目录的上层目录不存在，也不创建。 
- public boolean mkdirs() ：创建文件目录。如果上层文件目录不存在，一并创建
注意事项：如果你创建文件或者文件目录没有写盘符路径，那么，默认在项目路径下。 

File类的删除功能
- public boolean delete()：删除文件或者文件夹
删除注意事项：Java中的删除不走回收站。 要删除一个文件目录，请注意该文件目录内不能包含文件或者文件目录

## IO流
**流的分类**
- 按操作数据单位不同分为：字节流(8 bit)，字符流(16 bit)
- 按数据流的流向不同分为：输入流（设备->程序），输出流（程序->设备）。 我们可以把创建的流对象比作成设备，例如输入流InputStream，就是将InputStream实例（比作设备）中的数据输送到程序中。输出流OutputStream，就是将程序中的数据输送到OutputStream实例（比作设备）中
- 按流的角色的不同分为：节点流，处理流
  - 节点流(文件流)：可以从或向一个特定的地方（节点）读写数据。如FileReader、随机存取文件流
  - 处理流：是对一个已存在的流的连接和封装，通过所封装的流的功能调用实现数据读写。如BufferedReader。处理流的构造方法总是要带一个其他的流对象做参数。处理流包括缓冲流、转换流、标准输入流、标准输出流、打印流、数据流、对象流等

| 抽象基类 | 字节流       | 字符流 |
| -------- | ------------ | ------ |
| 输入流   | InputStream  | Reader |
| 输出流   | OutputStream | Writer |

Java的IO流共涉及40多个类，实际上非常规则，都是从如下4个抽象基类派生的。
由这四个类派生出来的子类名称都是以其父类名作为子类名后缀。

**IO流的体系**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130630.png)

**InputStream**
- `int read()` 从输入流中读取数据的下一个字节。返回 0 到 255 范围内的 int 字节值。如果因为已经到达流末尾而没有可用的字节，则返回值 -1。 
- `int read(byte[] b)` 从此输入流中将最多 b.length 个字节的数据读入一个 byte 数组中。如果因为已经到达流末尾而没有可用的字节，则返回值 -1。否则以整数形式返回实际读取的字节数。 
- `int read(byte[] b, int off,int len)` 将输入流中最多len个数据字节读入byte数组。尝试读取len个字节，但读取的字节也可能小于该值。以整数形式返回实际读取的字节数。如果因为流位于文件末尾而没有可用的字节，则返回值 -1。 
- `public void close() throws IOException`  关闭此输入流并释放与该流关联的所有系统资源

**Reader**
- `int read()` 读取单个字符。作为整数读取的字符，范围在 0 到 65535 之间 (0x00-0xffff)（2个字节的Unicode码），如果已到达流的末尾，则返回 -1 
- `int read(char[] cbuf)` 将字符读入数组。如果已到达流的末尾，则返回 -1。否则返回本次读取的字符数。 
- `int read(char[] cbuf,int off,int len)`将字符读入数组的某一部分。存到数组cbuf中，从off处开始存储，最多读len个字符。如果已到达流的末尾，则返回 -1。否则返回本次读取的字符数。 
- `public void close() throws IOException` 关闭此输入流并释放与该流关联的所有系统资源

**OutputStream**
- `void write(int b)` 将指定的字节写入此输出流。write 的常规协定是：向输出流写入一个字节。要写入的字节是参数 b 的八个低位。b 的 24 个高位将被忽略。 即写入0~255范围的。 
- `void write(byte[] b)` 将 b.length 个字节从指定的 byte 数组写入此输出流。write(b) 的常规协定是：应该与调用`write(b, 0, b.length)`的效果完全相同。 
- `void write(byte[] b,int off,int len)` 将指定 byte 数组中从偏移量 off 开始的 len 个字节写入此输出流。 
- `public void flush()throws IOException` 刷新此输出流并强制写出所有缓冲的输出字节，调用此方法指示应将这些字节立即写入它们预期的目标。 
- `public void close() throws IOException` 关闭此输出流并释放与该流关联的所有系统资源。

**Writer**
- `void write(int c)` 写入单个字符。要写入的字符包含在给定整数值的 16 个低位中，16 高位被忽略。 即写入0 到 65535 之间的Unicode码。
- `void write(char[] cbuf)`写入字符数组。 
- `void write(char[] cbuf,int off,int len)`写入字符数组的某一部分。从off开始，写入len个字符
- `void write(String str)`写入字符串。 
- `void write(String str,int off,int len)`写入字符串的某一部分。 
- `void flush()` 刷新该流的缓冲，则立即将它们写入预期目标。 
- `public void close() throws IOException` 关闭此输出流并释放与该流关联的所有系统资源。

### 节点流(文件流)
**读取文件**
```java
FileReader fr = null;
try {
  fr = new FileReader(new File("c:\\test.txt"));
  char[] buf = new char[1024];
  int len;
  while ((len = fr.read(buf)) != -1) {
    System.out.print(new String(buf, 0, len));
  }
} catch (IOException e) {
  System.out.println("read-Exception :" + e.getMessage());
} finally {
  if (fr != null) {
    try {
      fr.close();
    } catch (IOException e) {
      System.out.println("close-Exception :" + e.getMessage());
    } 
  } 
}
```
**写入文件**
```java
FileWriter fw = null;
try {
  fw = new FileWriter(new File("Test.txt"));
  fw.write("atguigu-songhongkang");
} catch (IOException e) {
  e.printStackTrace();
} finally {
  if (fw != null)
    try {
      fw.close();
    } catch (IOException e) {
      e.printStackTrace();
  } 
}
```

### 随机存取文件流 RandomAccessFile类 (节点流)
- RandomAccessFile 声明在java.io包下，但直接继承于java.lang.Object类。并且它实现了DataInput、DataOutput这两个接口，也就意味着这个类既可以读也可以写。
- RandomAccessFile 类支持 “随机访问” 的方式，程序可以直接跳到文件的任意地方来读、写文件；支持只访问文件的部分内容， 可以向已存在的文件后追加内容
- RandomAccessFile 对象包含一个记录指针，用以标示当前读写处的位置。
- RandomAccessFile 类对象可以自由移动记录指针：
  - long getFilePointer()：获取文件记录指针的当前位置
  - void seek(long pos)：将文件记录指针定位到 pos 位置
- 构造器
  - public RandomAccessFile(File file, String mode) 
  - public RandomAccessFile(String name, String mode) 
- 创建 RandomAccessFile 类实例需要指定一个 mode 参数，该参数指定 RandomAccessFile 的访问模式：
  - r: 以只读方式打开
  - rw：打开以便读取和写入
  - rwd:打开以便读取和写入；同步文件内容的更新
  - rws:打开以便读取和写入；同步文件内容和元数据的更新
- 如果模式为只读r。则不会创建文件，而是会去读取一个已经存在的文件，如果读取的文件不存在则会出现异常。 如果模式为rw读写。如果文件不存在则会去创建文件，如果存在则不会创建

**读取文件**
```java
RandomAccessFile raf = new RandomAccessFile(“test.txt”, “rw”）;
raf.seek(5);
byte [] b = new byte[1024];

int off = 0;
int len = 5;
raf.read(b, off, len);

String str = new String(b, 0, len);
System.out.println(str);
raf.close();
```
**写入文件**
```java
RandomAccessFile raf = new RandomAccessFile("test.txt", "rw");
raf.seek(5);

//先读出来
String temp = raf.readLine();

raf.seek(5);
raf.write("xyz".getBytes());
raf.write(temp.getBytes());

raf.close();
```

**注意点**
- 定义文件路径时，注意：可以用`/`或者`\\`。 
- 在写入一个文件时，如果使用构造器FileOutputStream(file)，则目录下有同名文件将被覆盖。
- 如果使用构造器FileOutputStream(file,true)，则目录下的同名文件不会被覆盖，在文件内容末尾追加内容。
- 在读取文件时，必须保证该文件已存在，否则报异常。 
- 字节流操作字节，比如：.mp3，.avi，.rmvb，mp4，.jpg，.doc，.ppt
- 字符流操作字符，只能操作普通文本文件。最常见的文本文件：.txt，.java，.c，.cpp 等语言的源代码。尤其注意.doc,excel,ppt这些不是文本文件。

### 缓冲流
- <font color="red">为了提高数据读写的速度</font>，Java API提供了带缓冲功能的流类，在使用这些流类时，会创建一个内部缓冲区数组，缺省使用8192个字节(8Kb)的缓冲区。
- 缓冲流要“套接”在相应的节点流之上，根据数据操作单位可以把缓冲流分为：
  - BufferedInputStream 和 BufferedOutputStream
  - BufferedReader 和 BufferedWriter
- 当读取数据时，数据按块读入缓冲区，其后的读操作则直接访问缓冲区
- 当使用BufferedInputStream读取字节文件时，BufferedInputStream会一次性从文件中读取8192个(8Kb)，存在缓冲区中，直到缓冲区装满了，才重新从文件中读取下一个8192个字节数组。 
- 向流中写入字节时，不会直接写到文件，先写到缓冲区中直到缓冲区写满，BufferedOutputStream才会把缓冲区中的数据一次性写到文件里。使用方法flush()可以强制将缓冲区的内容全部写入输出流
- 关闭流的顺序和打开流的顺序相反。当关闭最外层流时，会自动关闭内层节点流，所以只要关闭最外层流即可.
- flush()方法的使用：手动将buffer中内容写入文件
- 如果是带缓冲区的流对象的close()方法，不但会关闭流，还会在关闭流之前刷新缓冲区，关闭后不能再写出
```java
BufferedReader br = null;
BufferedWriter bw = null;
try {
  // 创建缓冲流对象：它是处理流，是对节点流的包装
  br = new BufferedReader(new FileReader("d:\\IOTest\\source.txt"));
  bw = new BufferedWriter(new FileWriter("d:\\IOTest\\dest.txt"));
  String str;
  while ((str = br.readLine()) != null) { // 一次读取字符文本文件的一行字符
    bw.write(str); // 一次写入一行字符串
    bw.newLine(); // 写入行分隔符
  }
  bw.flush(); // 刷新缓冲区
} catch (IOException e) {
  e.printStackTrace();
} finally {
  // 关闭IO流对象
  try {
    if (bw != null) {
      bw.close(); // 关闭过滤流时,会自动关闭它所包装的底层节点流
    }
  } catch (IOException e) {
      e.printStackTrace();
  }
  try {
    if (br != null) {
      br.close();
    }
  } catch (IOException e) {
    e.printStackTrace();
  } 
}
```

### 转换流
- 转换流提供了在字节流和字符流之间的转换
- Java API提供了两个转换流：
  - InputStreamReader: 将InputStream转换为Reader
  - OutputStreamWriter： 将OutputStream转化为Writer
- 字节流中的数据都是字符时，转成字符流操作更高效。 
- 很多时候我们使用转换流来处理文件乱码问题。实现编码和解码的功能。

**InputStreamReader**
- 实现将字节的输入流按**指定字符集**转换为字符的输入流。
- 需要和InputStream“套接”。
- 构造器
  - public InputStreamReader(InputStream in)
  - public InputSreamReader(InputStream in,String charsetName)
如： Reader isr = new InputStreamReader(System.in, "gbk");

**OutputStreamWriter**
- 将字节的输出流按**指定字符集**转换为字符的输出流。
- 需要和OutputStream“套接”。
- 构造器 
  - public OutputStreamWriter(OutputStream out)
  - public OutputSreamWriter(OutputStream out,String charsetName)

```java
public void testMyInput() throws Exception {
  FileInputStream fis = new FileInputStream("dbcp.txt");
  FileOutputStream fos = new FileOutputStream("dbcp5.txt");

  InputStreamReader isr = new InputStreamReader(fis, "GBK");
  OutputStreamWriter osw = new OutputStreamWriter(fos, "GBK");

  BufferedReader br = new BufferedReader(isr);
  BufferedWriter bw = new BufferedWriter(osw);

  String str = null;
  while ((str = br.readLine()) != null) {
    bw.write(str);
    bw.newLine();
    bw.flush();
  }
  bw.close();
  br.close();
}
```

### 标准输入、输出流
- `System.in`和`System.out`分别代表了系统标准的输入和输出设备
- 默认输入设备是：键盘, 输出设备是：显示器
- System.in的类型是InputStream
- System.out的类型是PrintStream，其是OutputStream的子类，FilterOutputStream 的子类
- 重定向：通过System类的setIn，setOut方法对默认设备进行改变。
  - public static void setIn(InputStream in)
  - public static void setOut(PrintStream out)
```java
System.out.println("请输入信息(退出输入e或exit):");
// 把"标准"输入流(键盘输入)这个字节流包装成字符流,再包装成缓冲流
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String s = null;
try {
  while ((s = br.readLine()) != null) { // 读取用户输入的一行数据 --> 阻塞程序
    if ("e".equalsIgnoreCase(s) || "exit".equalsIgnoreCase(s)) {
      System.out.println("安全退出!!");
      break; 
    }
    // 将读取到的整行字符串转成大写输出
    System.out.println("-->:" + s.toUpperCase());
    System.out.println("继续输入信息");
  }
} catch (IOException e) {
  e.printStackTrace();
} finally {
  try {
    if (br != null) {
      br.close(); // 关闭过滤流时,会自动关闭它包装的底层节点流
    }
  } catch (IOException e) {
    e.printStackTrace();
  } 
}
```

### 打印流
- 实现将基本数据类型的数据格式转化为字符串输出
- 打印流：PrintStream和PrintWriter
- 提供了一系列重载的print()和println()方法，用于多种数据类型的输出
- PrintStream和PrintWriter的输出不会抛出IOException异常
- PrintStream和PrintWriter有自动flush功能
- PrintStream 打印的所有字符都使用平台的默认字符编码转换为字节。在需要写入字符而不是写入字节的情况下，应该使用 PrintWriter 类。 
- System.out返回的是PrintStream的实例
```java
PrintStream ps = null;
try {
  FileOutputStream fos = new FileOutputStream(new File("D:\\IO\\text.txt"));
  // 创建打印输出流,设置为自动刷新模式(写入换行符或字节 '\n' 时都会刷新输出缓冲区)
  ps = new PrintStream(fos, true);
  if (ps != null) {// 把标准输出流(控制台输出)改成文件
    System.setOut(ps);
  }
  for (int i = 0; i <= 255; i++) { // 输出ASCII字符
    System.out.print((char) i);
    if (i % 50 == 0) { // 每50个数据一行
      System.out.println(); // 换行
    } 
  }
} catch (FileNotFoundException e) {
  e.printStackTrace();
} finally {
  if (ps != null) {
    ps.close();
  }
}
```

### 数据流
- 为了方便地操作Java语言的基本数据类型和String的数据，可以使用数据流。
- 数据流有两个类：(用于读取和写出基本数据类型、String类的数据）
  - DataInputStream 和 DataOutputStream
  - 分别“套接”在 InputStream 和 OutputStream 子类的流上 
```java
DataOutputStream dos = null;
try { // 创建连接到指定文件的数据输出流对象
  dos = new DataOutputStream(new FileOutputStream("destData.dat"));
  dos.writeUTF("我爱北京天安门"); // 写UTF字符串
  dos.writeBoolean(false); // 写入布尔值
  dos.writeLong(1234567890L); // 写入长整数
  System.out.println("写文件成功!");
} catch (IOException e) {
  e.printStackTrace();
} finally { // 关闭流对象
  try {
    if (dos != null) {
      // 关闭过滤流时,会自动关闭它包装的底层节点流
      dos.close();
    }
  } catch (IOException e) {
    e.printStackTrace();
  } 
}
```
```java
DataInputStream dis = null;
try {
  dis = new DataInputStream(new FileInputStream("destData.dat"));
  String info = dis.readUTF();
  boolean flag = dis.readBoolean();
  long time = dis.readLong();
  System.out.println(info);
  System.out.println(flag);
  System.out.println(time);
} catch (Exception e) {
  e.printStackTrace();
} finally {
  if (dis != null) {
    try {
      dis.close();
    } catch (IOException e) {
      e.printStackTrace();
    } 
  } 
}
```

### 对象流
- ObjectInputStream和OjbectOutputSteam
用于存储和读取基本数据类型数据或对象的处理流。它的强大之处就是可以把Java中的对象写入到数据源中，也能把对象从数据源中还原回来。
- 序列化：用ObjectOutputStream类保存基本类型数据或对象的机制
- 反序列化：用ObjectInputStream类读取基本类型数据或对象的机制
- ObjectOutputStream和ObjectInputStream不能序列化static和transient修饰的成员变量

**对象的序列化**
- 对象序列化机制允许把内存中的Java对象转换成平台无关的二进制流，从而允许把这种二进制流持久地保存在磁盘上，或通过网络将这种二进制流传输到另一个网络节点。//当其它程序获取了这种二进制流，就可以恢复成原来的Java对象
- 序列化的好处在于可将任何实现了Serializable接口的对象转化为字节数据，
使其在保存和传输时可被还原
- 序列化是 RMI（Remote Method Invoke – 远程方法调用）过程的参数和返回值都必须实现的机制，而 RMI 是 JavaEE 的基础。因此序列化机制是JavaEE 平台的基础
- 如果需要让某个对象支持序列化机制，则必须让对象所属的类及其属性是可序列化的，为了让某个类是可序列化的，该类必须实现Serializable接口或Externalizable接口。否则，会抛出NotSerializableException异常
- 凡是实现Serializable接口的类都有一个表示序列化版本标识符的静态变量：`private static final long serialVersionUID`, serialVersionUID用来表明类的不同版本间的兼容性。简言之，其目的是以序列化对象进行版本控制，有关各版本反序列化时是否兼容。如果类没有显示定义这个静态常量，它的值是Java运行时环境根据类的内部细节自动生成的。若类的实例变量做了修改，serialVersionUID 可能发生变化。故建议，显式声明。
如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130645.png)

- 简单来说，Java的序列化机制是通过在运行时判断类的serialVersionUID来验证版本一致性的。在进行反序列化时，JVM会把传来的字节流中的serialVersionUID与本地相应实体类的serialVersionUID进行比较，如果相同就认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常。(InvalidCastException)

**使用对象流序列化对象**
- 若某个类实现了 Serializable 接口，该类的对象就是可序列化的：
  - 创建一个 ObjectOutputStream
  - 调用 ObjectOutputStream 对象的 writeObject(对象) 方法输出可序列化对象
  - 注意写出一次，操作flush()一次
- 反序列化
  - 创建一个 ObjectInputStream
  - 调用 readObject() 方法读取流中的对象
强调：如果某个类的属性不是基本数据类型或 String 类型，而是另一个引用类型，那么这个引用类型必须是可序列化的，否则拥有该类型的Field 的类也不能序列化

```java
//序列化：将对象写入到磁盘或者进行网络传输。
//要求对象必须实现序列化
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("data.txt"));
Person p = new Person("韩梅梅", 18, "中华大街", new Pet());
oos.writeObject(p);
oos.flush();
oos.close();

//反序列化：将磁盘中的对象数据源读出。
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("data.txt"));
Person p1 = (Person)ois.readObject();
System.out.println(p1.toString());
ois.close();
```

## 序列化与反序列化
通过transient关键字来引进说明序列化与反序列化
**transient作用一：**
当是通过继承Serializable接口实现序列化,Serializable自动化完成序列时
- transient关键字只能修饰变量，而不能修饰方法和类。注意，本地变量是不能被transient关键字修饰的。
- 被transient关键字修饰的变量不再能被序列化。
- 一旦变量被transient修饰，变量将不再是对象持久化的一部分，该变量内容在序列化后无法获得访问。也可以认为在将持久化的对象反序列化后，被transient修饰的变量将按照普通类成员变量一样被初始化。
```java
public class TransientTest implements Serializable {
	private transient int aa = 1;  
	private int bb = 4;
	public static void main(String[] args) throws Exception {
		TransientTest transientTest = new TransientTest();
		transientTest.aa = 11;
		transientTest.bb = 22;
		ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(new File("D:\\serilb.txt")));
		oos.writeObject(transientTest);
 
		ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("D:\\serilb.txt")));
		TransientTest inverseSeriObject = (TransientTest) ois.readObject();
		System.out.println("aa----> " + inverseSeriObject.aa);  //被transient修饰的变量反序列化后，变量值被系统赋予默认初始值0（对象赋值为null)
		System.out.println("bb----> " + inverseSeriObject.bb);  //被无修饰的变量反序列化后，变量值被保留
	}
}
```
输出结果：
```
aa----> 0
bb----> 22
```

**transient作用二：**
当是通过该继承Externalizable接口实现序列化,Externalizable自动化完成序列时
我们知道在Java中，对象的序列化可以通过实现两种接口来实现，若操作的是一个Serializable对象，则所有的序列化将会自动进行，若操作的是 一个Externalizable对象，则没有任何东西可以自动序列化，需要在writeExternal方法中进行手工指定所要序列化的变量，这与是否被transient修饰无关。因此第二个例子输出的是变量在声明时初始化的内容，而不是系统默认初始值0（或者对象赋值为null）

```java
public class TransientTest2 implements Externalizable{
	private transient int aa = 1;  
	private int bb = 4;
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		TransientTest2 transientTest = new TransientTest2();
		transientTest.aa = 11;
		transientTest.bb = 22;
		ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(new File("D:\\externalserilb.txt")));
		oos.writeObject(transientTest);
 
		ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("D:\\externalserilb.txt")));
		TransientTest2 inverseSeriObject = (TransientTest2) ois.readObject();
		System.out.println("aa----> " + inverseSeriObject.aa);  //被transient修饰的变量反序列化后，序列的是声明时赋予的初始，创建对象后的改变无效
		System.out.println("bb----> " + inverseSeriObject.dd);  //被无修饰的变量反序列化后，序列的是声明时赋予的初始，创建对象后的改变无效
	}
	@Override
	public void writeExternal(ObjectOutput out) throws IOException {
		out.writeObject(aa);
		out.writeObject(bb);
	}
	@Override
	public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
		int aa = (int)in.readObject();
		int bb = (int)in.readObject();
	}
}
```
输出：
```
aa----> 1
bb----> 4
```

### 序列化与反序列化中的static
序列化与反序列化都是针对与对象的，而不是类的，所以被静态变量或静态方法都是不能被序列化的。
```java
class Person implements Serializable{
  static int a;
  static int b = 10;

  String name; 
  public Person(String name, int age){
    this.name = name;
    a = 8;
  }
  public String toString(){
    return "a: " + Person.a + ", b: " + Person.b;
  }
}
```
```java
public class Te {
  public static void main(String[] args) throws Exception{
   ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("data.txt"));
   Person p = new Person("whzl", 12);
   oos.writeObject(p);
   oos.flush();
   oos.close();
    
   ObjectInputStream ois = new ObjectInputStream(new FileInputStream("data.txt"));
   Person p1 = (Person)ois.readObject();
   System.out.println(p1.toString());
   ois.close(); 
  }
}
```
上述代码中输出的是：`a: 8, b: 10`
很奇怪，静态变量不是不能反序列化吗，为什么上面代码还能反序化得到a的值。这是因为变量a是类变量，是所有Person类共有的，此处a的值是从方法区中获到的。我们可以先编译运行序列化操作，再编译运行反序列化操作，此时会发现输出的结果为:`a: 0, b: 10`, 即可以证明a变量的值是从方法区中获到的，而不是反序列化获取的。

## NIO.2中Path、Paths、Files类的使用
**NIO**
- Java NIO (New IO，Non-Blocking IO)是从Java 1.4版本开始引入的一套新 的IO API，可以替代标准的Java IO API。NIO与原来的IO有同样的作用和目的，但是使用的方式完全不同，NIO支持面向缓冲区的(IO是面向流的)、基于通道的IO操作。NIO将以更加高效的方式进行文件的读写操作。
- Java API中提供了两套NIO，一套是针对标准输入输出NIO，另一套就是网络编程NIO。

**NIO.2(也叫AIO（Asynchronous I/O）)**
随着 JDK 7 的发布，Java对NIO进行了极大的扩展，增强了对文件处理和文件系统特性的支持，以至于我们称他们为 NIO.2。因为 NIO 提供的一些功能，NIO已经成为文件处理中越来越重要的部分。

- 早期的Java只提供了一个File类来访问文件系统，但File类的功能比较有限，所提供的方法性能也不高。而且，大多数方法在出错时仅返回失败，并不会提供异常信息。
- NIO. 2为了弥补这种不足，引入了Path接口，代表一个平台无关的平台路径，描述了目录结构中文件的位置。**Path可以看成是File类的升级版本**，实际引用的资源也可以不存在。
- 在以前IO操作都是这样写的:
```java
import java.io.File;
File file = new File("index.html");
```
- 但在Java7 中，我们可以这样写：
```java
import java.nio.file.Path; 
import java.nio.file.Paths; 
Path path = Paths.get("index.html");
```
- 同时，NIO.2在java.nio.file包下还提供了Files、Paths工具类，Files包含了大量静态的工具方法来操作文件；Paths则包含了两个返回Path的静态工厂方法。
- Paths 类提供的静态 get() 方法用来获取 Path 对象：
  - static Path get(String first, String … more) : 用于将多个字符串串连成路径
  - static Path get(URI uri): 返回指定uri对应的Path路径
  
# JDK1.8新特性
## 函数式接口
**函数式接口**
函数式接口：接口中<font color="red">只有一个</font>抽象方法的接口，称为函数式接口，为了避免后来的人在这个接口中增加接口函数导致其有多个接口函数需要被实现，变成"非函数接口”，我们可以在这个上面加上一个声明@FunctionalInterface, 这样别人就无法在里面添加新的接口函数了
**注：在jdk1.8中，接口中可以可以有多个默认方法和静态方法。**

**注:**java中还有**标识接口**：没有声明任何方法、属性的接口叫做标识接口，标识接口对实现他的类没有任何的语义要求,仅仅是冲到一个标示的作用,用来表明实现它的类属于一个特定的类型。Java中自带标识接口有Cloneable 和 Serializable等.在使用的时候可以用instanceof来判断实例对象的类型是否实现了一个特定的标识接口.


java内置函数式接口
| 函数式接口                                                 | 参数类型          | 返回类型          | 用途                                                                            |
| ---------------------------------------------------------- | ----------------- | ----------------- | ------------------------------------------------------------------------------- |
| `Consumer<T>` 消费型接口                                   | T                 | void              | 对类型为T的对象应用操作，包含方法：void accept(T t)                             |
| `Supplier<T>` 供给型接口                                   | 无                | T                 | 返回类型为T的对象，包含方法：T get()                                            |
| `Function<T, R>` 函数型接口                                | T                 | R                 | 对类型为T的对象应用操作，并返回结果。结果是R类型的对象。包含方法：R apply(T t)  |
| `Predicate<T>` 断定型接口                                  | T                 | boolean           | 对类型为T的对象应用操作，并返回结果。包含方法：boolean test(T t)                |
| `BiFunction<T, U, R>`                                      | T,U               | R                 | 对类型为T,U参数应用操作，返回R类型的结果。包含方法：R apply(T t, U u)           |
| `UnaryOperator<T>(Function子接口)`                         | T                 | T                 | 对类型为T的对象进行一元运算，并返回T类型的结果。包含方法为：T apply(T t)        |
| `BinaryOperator<T>(BiFunction子接口)`                      | T,T               | T                 | 对类型为T的对象进行二元运算，并返回T类型的结果。包含方法为: T apply(T t1, T t2) |
| `BiConsumer<T, U>`                                         | T, U              | void              | 对类型为T，U参数应用操作。包含方法为：void accept(T t, U u)                     |
| `BiPredicate<T, U>`                                        | T, U              | boolean           | 包含方法为： boolean test(T t, U u)                                             |
| `ToIntFunction<T>, ToLongFunction<T>, ToDoubleFunction<T>` | T                 | int, long, double | 分别计算int，long，double值的函数                                               |
| `IntFunction<R>, LongFunction<R>, DoubleFunction<R>`       | int, long, double | R                 | 参数分别为int, long, double类型的函数                                           |

```java
public static void main(String[] args){
  happy(400, new Consumer<Double>(){
    public void accept(Double a){
      System.out.println(a);
    }
  });

  happy(500, money -> System.out.println(money + "aa"));

  test();
}

public static void happy(double money, Consumer<Double> con){
  con.accept(money);
}
```

## Lambda表达式
<font color="red">Lambda表达式本身就是一个函数接口的实例。</font>
Lambda表达式需要“函数式接口”的支持

**Lambda表达式基础语法**
java8中引入了一个新的操作符`->`, 该操作符称为箭头操作符或Lambda操作符。箭头操作符将Lambda表达式拆分为两个部分,左侧：Lambda表达式的参数列表； 右侧：Lambda表达式中所需要执行的功能，即Lambda体
```java
// 1. 不需要参数,返回值为 5  
() -> 5  
  
// 2. 接收一个参数(数字类型),返回其2倍的值  
x -> 2 * x  
  
// 3. 接受2个参数(数字),并返回他们的差值  
(x, y) -> x – y  
  
// 4. 接收2个int型整数,返回他们的和  
(int x, int y) -> x + y  
  
// 5. 接受一个 string 对象,并在控制台打印,不返回任何值(看起来像是返回void)  
(String s) -> System.out.print(s)
```

我们经常使用Lambda表达式来实现匿名内部类

## 方法引用
Java 方法引用是Java 8随着Lambda表达式引入的新特性。可以直接引用已有Java类或对象的方法或构造器。方法引用可以看成是Lambda表达式深层次的表达。换句话说，方法引用就是Lambda表达式，也就是函数式接口的一个实例。
格式：使用操作符`::`将类或对象与方法名分隔开
有如下三种主要使用情况
- 对象名::非静态方法名
- 类名::静态方法名
- 类名::非静态方法名
注：没有`对象名::静态方法名`情况

**针对于`对象名::实例方法名`与`类名::静态方法名`的情况**
其使用条件为Lambda 表达式的主体仅包含一个表达式，且 Lambda 表达式只调用了一个已经存在的方法；且函数式接口中的抽象方法的参数列表和返回值类型，必须与方法引用的方法的参数列表和返回值类型保持一致

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130712.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130743.png)

**针对于`类名::实例方法名`**
其使用条件为Lambda 表达式的主体仅包含一个表达式，且 Lambda 表达式只调用了一个已经存在的方法；函数式接口中的返回值类型与方法引用的方法的返回值类型保持一致，且其参数列表对应关系分下列2种情况
- 当函数式接口中的抽象方法的参数列表有2个参数(记为A, B)，但方法引用的方法的参数列表只有1个(记为C)时
此时方法引用中的类名必须为A的数据类型，且C的数据类型要与B相同
```java
public static void test2(){
  // Lambda表达式形式
  Comparator<String> com = (s1, s2) -> s1.compareTo(s2);
  System.out.println(com.compare("aa", "bb"));

  // 方法引用形式
  Comparator<String> com1 = String :: compareTo;
  System.out.println(com.compare("aa", "bb"));
}
```
- 当函数式接口中的抽象方法的参数列表有1个参数(记为A)，但方法引用的方法为空参时
此时方法引用中的类名必须为A的数据类型
```java
public static void test3(){
  // Lambda表达式形式
  Person p = new Person("whz", 11);
  Function<Person, String> func1 = e -> e.getName();
  System.out.println(func1.apply(p));

  // 方法引用形式
  Function<Person, String> func2 = Person :: getName;
  System.out.println(func1.apply(p));
}
```

### 构造器引用与数组引用
和方法引用类似
```java
public static void test5(){
  // Lambda表达式
  Supplier<Person> su = () -> new Person();
  System.out.println(su.get());

  // 构造器表达式
  Supplier<Person> su1 = Person :: new;
  System.out.println(su.get());

  // Lambda表达式
  Function<Integer, String[]> fun1 = length -> new String[length];
  String[] arr1 = fun1.apply(5);
  System.out.println(Arrays.toString(arr1));

  // 数组引用
  Function<Integer, String[]> fun2 = String[] :: new;
  String[] arr2 = fun2.apply(5);
  System.out.println(Arrays.toString(arr2));
}
```

## Stream
java1.8中有二个非常重要的新特性，分别是Lambda与Stream
Stream API(java.util.stream)把真正的函数式编程风格引入到java中。
Stream API对集合数据进行操作，提供了高效且易于使用的处理数据的方式

为什么要使用Stream API
- 在实际开发中，项目中多数据源都来自Mysql, Oracle等。但现在数据源可以更多了，有MongDB, Redis等，而这些Nosql的数据就需要Java层面去处理
- Stream和Collection集合的区别：Collection是一种静态的内存数据结构，而Stream是有关计算的。前者是主要面向内存，存储在内存中，后者主要是面向CPU，通过CPU实现计算。

注意：
- Stream自己不会存储元素
- Stream不会改变源对象，相反，他们会返回一个持有结果的新Stream
- Stream操作是延迟执行的，这意味着他们会等到需要结果的时候才执行

**Stream的操作三个步骤**
1. 创建Stream
  一个数据源（如集合、数组），获取一个流
2. 中间操作
  一个中间操作链，对数据源的数据进行处理
3. 终止操作
  一旦执行终止操作，就执行中间操作链，并产生结果，之后，不会再被使用

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130808.png)

### 创建方式
**1. 通过集合**
java8中Collection接口被扩展，提供了两个获取流的方法
- default Stream\<E> stream() : 返回一个顺序流 
- default parallel\<E> parallelStream(): 返回一个并行流
```java
public static void test6(){
  List<Person> persons = new ArrayList();
  persons.add(new Person("whz", 12));
  persons.add(new Person("hz", 19));
  persons.add(new Person("thz", 17));
  persons.add(new Person("lhz", 15));

  //创建一个顺序流
  Stream<Person> stream = persons.stream();

  //创建一个并行流
  Stream<Person> parallelStream = persons.parallelStream();
}
```
**2.通过Arrays**
java8中的Arrays的静态方法stream()可以获取数组流
- static \<T> Stream\<T> stream(T[] array) :返回一个流
重载形式，能够处理对应基本类型的数组
- static IntStream stream(int[] array)
- static LongStream stream(long[] array)
- static DoubleStream stream(double[] array)
```java
public static void test6(){
  Person[] persons = new Person[]{p1, p2, p3};
  Stream<Employee> stream = Arrays.stream(persons);

  int[] arr = new int[]{1, 5, 6, 9};
  IntStream intStream = Arrays.stream(arr);
}
```
**3.通过Stream的of()**
可以调用Stream类静态方法of(), 通过显示值创建一个流，它可以接收任意数量的参数
- static \<T> Stream\<T> of(T... values) : 返回一个流
```java
Stream<Integer> stream = Stream.of(1, 2, 3, 4);
```
**4.通过Stream.iterate()和Stream.generate()**
可以通过通过Stream.iterate()和Stream.generate(), 创建无限流
- static \<T> Stream\<T> iterate(final T seed, final UnaryOperator\<T> f)
- static \<T> Stream\<T> generate(Supplier\<T> s)


### Stream的中间操作
多个中间操作可以连接起来形成一个流水线，除非流水线上触发终止操作，否则中间操作不会执行任何的处理！而在终止操作时一次性全部处理，称为“惰性求值”。

**筛选与切片**
| 方法                | 描述                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| filter(Predicate p) | 接受Lambda，从流中去除某些元素                                                           |
| distinct()          | 筛选，通过流所生成元素的hashCode()和equals()去除重复元素                                 |
| limit(long maxSize) | 截断流，使其元素不超过给定数量                                                           |
| skip(long n)        | 跳过元素，返回一个扔掉了前n个元素的流。若流中元素不足n个，则返回一个空流，与limit(n)互补 |
```java
public static void test7(){
  List<Person> persons = new ArrayList();
  persons.add(new Person("whz", 12));
  persons.add(new Person("whz", 12));
  persons.add(new Person("hz", 12));
  persons.add(new Person("yd", 18));
  persons.add(new Person("la", 19));
  
  Stream<Person> personStream = persons.stream();

  personStream.filter(e -> e.getAge() < 18).limit(3).forEach(System.out :: println);
}
```
输出
```
whz 12
whz 12
hz 12
```

**映射**
| 方法                            | 描述                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------- |
| map(Function f)                 | 接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素   |
| flatMap(Function f)             | 接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流 |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的DoubleStream   |
| mapToInt(ToIntFunction f)       | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的IntStream      |
| mapToLong(ToLongFunction f)     | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的LongStream     |
```java
public static void test12(){
  List<String> list = Arrays.asList("aa", "bb", "cc", "dd");
  list.stream().map(str -> str.toUpperCase()).forEach(System.out :: println);
}
```
输出
```java
AA
BB
CC
DD
```
**排序**
| 方法                   | 描述                               |
| ---------------------- | ---------------------------------- |
| sorted()               | 产生一个新流，其中按自然顺序排序   |
| sorted(Comparator com) | 产生一个新流，其中按比较器顺序排序 |

**终止操作**
终端操作会从流的流水线生成结果。其结果可以是任何不是流的值，例如：List，Integer，Boolean，甚至是void
流进行了终止操作后，不能再次使用

| 方法                                 | 描述                                                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| allMatch(Predicate p)                | 检测是否匹配所有元素                                                                                       |
| anyMatch(Predicate p)                | 检测是否至少匹配一个元素                                                                                   |
| noneMatch(Predicate p)               | 检测是否没有匹配所有元素                                                                                   |
| findFirst()                          | 返回第一个元素                                                                                             |
| findAny()                            | 返回当前流中的任意元素                                                                                     |
| count()                              | 返回流中元素总数                                                                                           |
| max(Comparator c)                    | 返回流中最大值                                                                                             |
| min(Comparator c)                    | 返回流中最小值                                                                                             |
| forEach(Comsumer c)                  | 内部迭代(使用Collection接口需要用户去做迭代，称为外部迭代。相反，Stream API使用内部迭代--它帮你把迭代做了) |
| reduce(T identify, BinaryOperator b) | 可以将流中元素反复结合起来，得到一个值，返回T，第一个参数为初始值                                          |
| reduce(BinaryOperator b)             | 可以将流中元素反复结合起来，得到一个值，返回Optional<T>                                                    |
| collect(Collector c)                 | 将流转换为其他形式，接收一个Collector接口的实现，用于给Stream中元素做汇总的方法                            |
```java
public static void test10(){
  ArrayList list = new ArrayList();
  list.add(12);
  list.add(13);
  list.add(14);
  System.out.println(list.stream().allMatch(e -> (int)e > 13));
}
```
```java
public static void test10(){
  ArrayList<Integer> list = new ArrayList();
  list.add(13);
  list.add(12);
  list.add(14);

  System.out.println(list.stream().reduce(1, Integer::sum));//输出：40
  System.out.println(list.stream().reduce(Integer::sum));//输出：Optional[39]
}
```
**有关collect(Collector c)的注意点**
Collector接口中方法的实现决定了如何对流执行收集的操作(如收集到List, Set, Map)
Collectors实现类提供了很多静态方法，可以方便地创建常见收集器实例，具体方法与实例如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130822.png)
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130850.png)

```java
public static void test10(){
  ArrayList<Integer> list = new ArrayList();
  list.add(13);
  list.add(12);
  list.add(14);
  List<Integer> l = list.stream().collect(Collectors.toList());
  l.forEach(System.out::println);
}
```
## Optional类
Optional类的出现就是为了避免空指针异常
Optional\<T> 类是一个容器，它可以保存类型T的值，代表这个值存在，或者仅仅保存null，表示这个值不存在。 
Optional类提供了很多有用的方法，这样我们就可以不用显示进行空值检测
- 创建Optional类对象的方法
  - Optional.of(T t): 创建一个Optional实例，t必须非空
  - Optional.empty(): 创建一个空的Optional实例
  - Optional.ofNullable(T t): t可以为null
- 判断Optional容器中是否包含对象
  - boolean isParent(): 判断是否包含对象
  - void ifParent(Comsumer<? super T> consumer): 如果有值，就执行Consumer接口的实现代码，并且该值会最为参数传给它。
- 获取Optional容器的对象
  - T get(): 如果调用对象包含值，返回该值，否则抛异常
  - T orElse(T other): 如果有值则将其返回，否则返回指定的other对象
  - T orElseGet(Supplier<? extends T> other): 如果有值则将其返回，否则返回有Supplier接口实现提供的对象
  - T orElseThrow(Supplier<? extends X> exceptionSupplier): 如果有值则将其返回，否则抛出由Supplier接口实现提供的异常 
```java
public static void test13(){
  Person p = null;
  Optional<Person> optional = Optional.ofNullable(p);
  Person p1 = optional.orElse(new Person("whz", 12));
  System.out.println(p1.getAge()); //输出：12
} 
```
java, javascript中使用split()方法对零长度字符串切分后数组长度为1，而不是为0

# javaWeb三大组件与拦截器
javaWeb的三大组件式：监听器、过滤器、Servlet
javaWeb运行流程图：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220327145409.png)

## 监听器
web监听器式Servlet中一种特殊的类，能帮助开发者监听web中的特定事件，比如ServletContext, HttpSession, ServletRequest的创建和销毁；变量的创建、销毁和修改等。可以在某些动作前后增加处理，实现监控。

### 八大监听器
**ServletContextListener**
Servlet的上下文监听，它主要实现监听ServletContext的创建和删除。该接口提供了两种方法
- contextInitialized(ServletContextEvent event);   通知正在收听的对象，应用程序已经被加载和初始化。
- contextDestroyed(ServletCotextEvent event);   通知正在收听的对象，应用程序已经被载出，即关闭。

**ServletAttributeListener**
主要实现监听ServletContext属性的增加，删除和修改。该接口提供了一下3个方法
- attributeAdded(ServletContextAttributeEvent event);   当有对象加入Application的范围时，通知正在收听的对象
- attributeReplaced(ServletContextAttributeEvent event); 当在application的范围有对象取代另一个对象的时，通知正在收听的对象
- attributeRemoved(ServletContextAttributeEvent event); 当有对象从application的范围移除时，通知正在收听的对象

**HttpSessionListener**
HTTP会话监听，该接口实现监听HTTP会话创建、销毁。该接口提供了一下两种方法
- sessionCreated(HttpSessionEvent event); 通知正在收听的对象，session已经被加载及初始化
- sessionDestoryed(HttpSessionEvent event) 通知正在收听的对象，session已经被载出（HttpSessionEvent类的主要方法是getSession(),可以使用该方法回传一个session对象）

**HttpSessionActivationListener**
该接口实现监听HTTP会话active和passivate。 该接口提供了一下3个方法
- attributeAdded（HttpSessionBindingEvent event）;  当有对象加入session的范围时，通知正在收听的对象
- attributeReplaced（HttpSessionBindingEvent event）;当在session的范围有对象取代另一个对象时，通知正在收听的对象。
- attributeRemoved(HttpSessionBindingEvent event); 当有对象从session的范围有对象取代另一个对象时，通知正在收听的对象 其中HttpSessionBindingEvent类主要有三个方法：getName()、getSession()和getValue()

**HttpBindingListener**
接口实现监听HTTP会话中对象的绑定信息。它是唯一不需要在web.xml中设定Listener的。该接口提供了以下2个方法
- valueBound(HttpSessionBindingEvent event); 当有对象加入session的范围时会被自动调用
- valueUnBound(HttpSessionBindingEvent event); 当有对象从session的范围内移除时会被自动调用

**HttpSessionAttributeListener**
该接口实现监听HTTP会话中属性的设置请求。该接口提供了以下两个方法。
- sessionDidActivate（HttpSessionEvent event);通知正在收听的对象，它的session已经变为有效状态。
- sessionWillPassivate(HttpSessionEvent event); 通知正在收听的对象，它的session已经变为无效状态

**ServletRequestListener**
该接口提供了以下两个方法。
- requestInitalized(ServletRequestEvent event) 通知正在收听的对象，ServletRequest已经被加载及初始化
- requestDestroyed(ServletRequestEvent event) 通知正在收听的对象，ServletRequest已经被载出，即关闭

**ServletRequestAttributeListener**
该接口提供了一下三种方法
- attributeAdded（ServletRequestAttributeEvent event） 当有对象加入request的范围时，通知正在收听的对象
- attributeReplaced(ServletRequestAttributeEvent event); 当在request的范围内有对象取代两一个对象时，通知正在收听的对象
- attributeRemoved（ServletRequestAttributeEvent event）; 当有对象从request的范围移除时，通知正在收听的对象

## 过滤器
它的作用是：拦截请求，**过滤响应**
**Filter接口源码**
```java
public interface Filter {

  public default void init(FilterConfig filterConfig) throws ServletException {}

  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException;

  public default void destroy() {}
}
```
可以看到，在Filter接口中定义了一个doFilter方法，该方法正是过滤器执行过滤动作的方法；
每个过滤器都有权访问filterConfig对象，并从中获取初始化参数；

**Filter的开发主要分为2步：**
1. 编写java类，实现Filter接口及其方法
```java
@WebFilter(filterName = "TestFilter")
public class TestFilter implements Filter {

  public void init(FilterConfig config) throws ServletException {
    System.out.println("TestFilter初始化...");
    Enumeration<String> paramNames = config.getInitParameterNames();
    while (paramNames.hasMoreElements()) {
        String paramName = paramNames.nextElement();
        String paramValue = config.getInitParameter(paramName);
        System.out.println(paramName + "=" + paramValue);
    }
  }

  public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
    chain.doFilter(req, resp);
    System.out.println("TestFilter被执行...");
    // 针对req和resp统一设置字符编码
    req.setCharacterEncoding("UTF-8");
    resp.setCharacterEncoding("UTF-8");
    resp.setContentType("text/html;charset=UTF-8");
    // 放行，顺着过滤链继续往下走，若下一个目标仍是Filter，则执行该Filter的doFilter方法
    // 若下一个目标是Servlet，则调用Servlet的service方法
    chain.doFilter(req, resp);
  }

  public void destroy() {
    System.out.println("TestFilter被销毁！");
  }
}
```
2. 配置需要拦截过滤的web资源
在web.xml 文件中使用`<filter>`和`<filter-mapping>`元素对编写的Filter实现类进行注册，并设置它所能拦截的web资源
```xml
<filter>
  <description>统一字符编码过滤器</description>
  <filter-name>characterEncodingFilter</filter-name>
  <filter-class>com.ys.test.TestFilter</filter-class>
  <!-- 配置TestFilter过滤器的初始化参数 -->
  <init-param>
      <description>初始化参数1</description>
      <param-name>encoding1</param-name>
      <param-value>GBK</param-value>
  </init-param>
  <init-param>
      <description>初始化参数2</description>
      <param-name>encoding2</param-name>
      <param-value>UTF-8</param-value>
  </init-param>
</filter>
<!-- <filter-mapping>的顺序决定了Filter的执行顺序 -->
<filter-mapping>
  <filter-name>characterEncodingFilter</filter-name>
  <!-- 配置要拦截的资源 -->
  <url-pattern>*.do</url-pattern>
  <!-- 配置拦截的类型，若没配置默认为REQUEST -->
  <dispatcher>REQUEST</dispatcher><!-- 请求的 -->
  <dispatcher>FORWARD</dispatcher><!-- 转发的 -->
  <dispatcher>INCLUDE</dispatcher><!-- 包含在页面的 -->
  <dispatcher>ERROR</dispatcher><!-- 出错的 -->
  <dispatcher>ASYNC</dispatcher><!-- 异步的 -->
</filter-mapping>
```
也可以直接在Filter的实现类中使用@WebFilter注解来注册
```java
@WebFilter(filterName = "TestFilter",
        // 配置初始化参数
        initParams = {@WebInitParam(name = "encoding1", value = "GBK"), @WebInitParam(name = "encoding2", value = "UTF-8")},
        // 配置要拦截的资源
        urlPatterns = "*.do",
        // 配置拦截的类型
        dispatcherTypes = {DispatcherType.REQUEST, DispatcherType.FORWARD, DispatcherType.INCLUDE, DispatcherType.ERROR, DispatcherType.ASYNC})
public class TestFilter implements Filter {
    ...
}
```

**过滤链**
如果有多个过滤器的话，这些过滤器会根据设置的先后顺序组装成一条链条，这条链条就称为过滤链
- 这个过滤器链中的过滤器必须按顺序依次执行
- 过滤器链中必须全部通过，才能通过，只要有一个不通过，则无法访问对应的资源

### 拦截方式配置
拦截方式配置也就是指定过滤器的调度模式，主要有下面几种：
**REQUEST**
默认值，浏览器直接请求资源。

**FORWARD**
转发访问资源：RequestDispatcher.forward();
如果目标资源是通过RequestDispatcher的forward()方法访问时，那么该过滤器将被调用。

**INCLUDE**
包含访问资源：RequestDispatcher.include();
如果目标资源是通过RequestDispatcher的include()方法访问时，那么该过滤器将被调用。

**ERROR**
错误跳转资源：被声明式异常处理机制调用的时候；
如果目标资源是通过声明式异常处理机制调用时，那么过滤器被将被调用。

**ASYNC(Servlet3.0新增加)**
支持异步处理

## 拦截器
拦截器，在AOP（Aspect-Oriented Programming）中用于在某个方法或字段被访问之前，进行拦截然后在之前或之后加入某些操作。拦截是AOP的一种实现策略。 
在Webwork的中文文档的解释为——拦截器是动态拦截Action调用的对象。它提供了一种机制可以使开发者可以定义在一个action执行的前后执行的代码，也可以在一个action执行前阻止其执行。同时也是提供了一种可以提取action中可重用的部分的方式。 

**拦截器与过滤器的区别 ：**
 - 拦截器是基于java的反射机制的，而过滤器是基于函数回调。
 - 拦截器不依赖与servlet容器，过滤器依赖与servlet容器。 
 - 拦截器只能对action请求起作用，而过滤器则可以对几乎所有的请求起作用。
 - 拦截器可以访问action上下文、值栈里的对象，而过滤器不能访问。 
 - 在action的生命周期中，拦截器可以多次被调用，而过滤器只能在容器初始化时被调用一次拦截器的代  
 - 码实现。
 - Filter基于回调函数，我们需要实现的filter接口中doFilter方法就是回调函数，而interceptor则基于 
 - java本身的反射机制,这是两者最本质的区别。
 - Filter是依赖于servlet容器的，即只能在servlet容器中执行，很显然没有servlet容器就无法来回调
 - doFilter方法。而interceptor与servlet容器无关。
 - Filter的过滤范围比Interceptor大,Filter除了过滤请求外通过通配符可以保护页面，图片，文件等等，
 - 而Interceptor只能过滤请求。
 - Filter的过滤例外一般是在加载的时候在init方法声明,而Interceptor可以通过在xml声明是guest请求还
 - 是user请求来辨别是否过滤。


# 零碎知识点
## Java 是编译型语言还是解释型语言？
为了兼顾跨平台和运行速度，Java 源代码首先会被编译为字节码文件（.class），但并非是机器语言，而是需要在 JVM 上运行，而 .class 文件在 JVM 上是解释执行的。所以 Java 兼具编译型语言和解释型语言的特点。
为了更高的效率，JVM 还引入了 JIT（just-in-time，即时编译）编译器，在 Java 程序运行时进一步编译，转换成高度优化的机器代码。
现在的很多语言以及不能以编译型语言和解释型语言来区分了，因为很多语言都兼具编译型语言和解释型语言的特点。

## String.getProperty("user.dir")返回的路径
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130922.png)

## 类路径classpath
maven项目中的classpath就是resoucers文件下的目录

## new File()中路径填写
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329130938.png)

## SDK
SDK是Software Development Kit的缩写，中文意思是“软件开发工具包”。这是一个覆盖面相当广泛的名词，可以这么说：辅助开发某一类软件的相关文档、范例和工具的集合都可以叫做“SDK”。SDK是一系列文件的组合，它为软件的开发提供一个平台(它为软件开发使用各种API提供便利)。
JDK(Java Development Kit,Java开发工具包)是Sun Microsystems针对Java开发员的产品。自从Java推出以来，JDK已经成为使用最广泛的Java SDK（Software development kit）。
可以认为jdk只是sdk的一种(子集)，因为它是开发java程序的一个平台，开发其他程序的sdk可以没有jdk。

## java中的split
split(String str)的切分原理是：`源字符串开头到第一个str字符串之间的元素(可以没有元素)`、`每两个str字符之间的元素(可以没有元素)`、`最后一个str字符串到源字符串结束之间的的元素(必须要有元素)`都会被储存
**额外有三种特殊情况：**
- 当源字符串为空串时
- 当源字符串全部是即使分隔符时
- 当源字符串为没有分隔符时

```java
public static void main(String[] args) {

   //当源字符串为空串时
  String[] str1 = "".split("b");
  System.out.println(Arrays.toString(str1));//输出：[]
  System.out.println(str1.length); //输出：1

  //当源字符串全部是即使分隔符时
  String[] str2 = "b".split("b");
  System.out.println(Arrays.toString(str2));//输出：[]
  System.out.println(str2.length); //输出：0
  String[] str3 = "bb".split("b");
  System.out.println(Arrays.toString(str3));//输出：[]
  System.out.println(str3.length); //输出：0

  //当源字符串为没有分隔符时
  String[] str4 = "ac".split("b");
  System.out.println(Arrays.toString(str4));//输出：[ac]
  System.out.println(str4.length);//输出：1

  //源字符串开头到第一个str字符串之间的元素(可以没有元素)、每两个str字符之间的元素(可以没有元素)、最后一个str字符串到源字符串结束之间的的元素(必须要有元素)都会被储存
  String[] str5 = "cb".split("b");
  System.out.println(Arrays.toString(str5));//输出：[c]
  System.out.println(str5.length);//输出：1
  String[] str6 = "bc".split("b");
  System.out.println(Arrays.toString(str6));//输出：[,c]
  System.out.println(str6.length);//输出：2
  String[] str7 = "babbbcb".split("b");
  System.out.println(Arrays.toString(str7));//输出：[,a,,,c]
  System.out.println(str7.length);//输出：5
}
```

## java中字符串方法参数中的start, end
start（包括）~end（不包括）， 即`[start, end)`
示例：
```java
public static void main(String[] args) {
  StringBuffer sb = new StringBuffer("abc");
  System.out.println(sb.delete(0,2)); // 输出: c
  StringBuffer sb1 = new StringBuffer("abc");
  System.out.println(sb1.replace(1,2,"def")); // 输出: adefc
  
  String str = "abcdef";
  System.out.println(str.substring(1, 3)); // 输出: bc
  
}
```

## Ant 风格路径表达式
ANT通配符有三种：
| 通配符 | 说明                    |
| ------ | ----------------------- |
| ?      | 匹配任何单字符          |
| *      | 匹配0或者任意数量的字符 |
| **     | 匹配0或者更多的目录     |

例子：
| URL路径            | 说明                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| /app/*.x           | 匹配(Matches)所有在app路径下的.x文件                                                                     |
| /app/p?ttern       | 匹配(Matches) /app/pattern 和 /app/pXttern,但是不包括/app/pttern                                         |
| /**/example        | 匹配(Matches) /app/example, /app/foo/example, 和 /example                                                |
| /app/**/dir/file.* | 匹配(Matches) /app/dir/file.jsp, /app/foo/dir/file.html,/app/foo/bar/dir/file.pdf, 和 /app/dir/file.java |
| /**/*.jsp          | 匹配(Matches)任何的.jsp 文件                                                                             |

属性：
最长匹配原则(has more characters)
说明，URL请求`/app/dir/file.jsp`，现在存在两个路径匹配模式`/**/*.jsp`和`/app/dir/*.jsp`，那么会根据模式`/app/dir/*.jsp`来匹配

## java中的整型都是采用补码存储
```java
public static void main(string[] args) {
  short a = (short)0b1000000000000001;
  system.out.println(a); // 输出: -32767
}
```
上述的`0b1000 0000 0000 0001`会一个真值的补码形式，对应的原码为`0b1111 1111 1111 1111`，对应的真值是-32767

## Java获取路径的方法汇总
**调用方法来获取路径的关键点是：使用相对路径时，这个方法是相对于哪个目录？**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131238.png)

```java
@SpringBootApplication
public class BilibiliApplication {

	public static void main(String[] args) throws IOException {
		/**
		 * 通过类加载器获取class文件夹下的指定文件的路径
		 * 当使用类加载器的getSystemResource(),getResource()方法且使用相对路径时，一定不能以'/'开头，且是相对于classes目录
		 */
		System.out.println(ClassLoader.getSystemResource("")); //file:/M:/javaEE_project/bilibili/target/classes/
		System.out.println(ClassLoader.getSystemResource("/")); //null
		System.out.println(Thread.currentThread().getContextClassLoader().getResource("")); //file:/M:/javaEE_project/bilibili/target/classes/
		System.out.println(Thread.currentThread().getContextClassLoader().getResource("/")); // null
		System.out.println(BilibiliApplication.class.getClassLoader().getResource("")); //file:/M:/javaEE_project/bilibili/target/classes/
		System.out.println(BilibiliApplication.class.getClassLoader().getResource("/"));// null
		System.out.println(BilibiliApplication.class.getClassLoader().getResource("/application.properties"));// null
		System.out.println(BilibiliApplication.class.getClassLoader().getResource("application.properties"));// file:/M:/javaEE_project/bilibili/target/classes/application.properties
		System.out.println(BilibiliApplication.class.getClassLoader().getResource("static/main.html"));// file:/M:/javaEE_project/bilibili/target/classes/static/main.html
		System.out.println(BilibiliApplication.class.getClassLoader().getResource("com/example/bilibili/BilibiliApplication.class"));//file:/M:/javaEE_project/bilibili/target/classes/com/example/bilibili/BilibiliApplication.class

		/**
		 * 通过字节码对象获取class文件夹下的指定文件的路径
		 * 当使用字节码对象的getResource()方法且使用相对路径时，当以‘/’开头时，是相对于'classes/com/example/bilibili'目录。当不以'/'开头时，是相对于'classes'目录
		 */
		System.out.println(BilibiliApplication.class.getResource(""));//file:/M:/javaEE_project/bilibili/target/classes/com/example/bilibili/
		System.out.println(BilibiliApplication.class.getResource("/"));//file:/M:/javaEE_project/bilibili/target/classes/
		System.out.println(BilibiliApplication.class.getResource("controller/GetController.class"));//file:/M:/javaEE_project/bilibili/target/classes/com/example/bilibili/controller/GetController.class
		System.out.println(BilibiliApplication.class.getResource("/static/main.html"));//file:/M:/javaEE_project/bilibili/target/classes/static/main.html
		System.out.println(BilibiliApplication.class.getResource("/com/example/bilibili/controller/GetController.class"));//file:/M:/javaEE_project/bilibili/target/classes/com/example/bilibili/controller/GetController.class

		/**
		 * 通过File对象获取没有编译时的路径
		 * 当使用File对象且使用相对路径时，当不以'/'开头时，是相对于磁盘目录；当不以'/'开头是，是相对于创建项目时的文件夹
		 */
		System.out.println(new File("").getAbsolutePath());//M:\javaEE_project\bilibilij
		System.out.println(new File("/").getAbsolutePath());//M:\
		File myFile = new File("test.txt");
		if(!myFile.exists()){
			myFile.createNewFile(); //此时会在M:\javaEE_project/bilibili下创建一个test.txt文件
		}

		/**
		 * 通过System.getProperty方式
		 */
		System.out.println(System.getProperty("user.dir"));//M:\javaEE_project\bilibili
		SpringApplication.run(BilibiliApplication.class, args);
	}
}
```

## 版本号的命名
版本号的命名一般都遵循`主/大版本.次/次版本[.小版本]`
例如npm中的包版本为`主/大版本.次/次版本.小版本`
jdk版本为`主/大版本.次/次版本`

## Unsafe类
Unsafe是位于sun.misc包下的一个类，主要提供一些用于执行低级别、不安全操作的方法，如直接访问系统内存资源、自主管理内存资源等，这些方法在提升Java运行效率、增强Java语言底层资源操作能力方面起到了很大的作用。但由于Unsafe类使Java语言拥有了类似C语言指针一样操作内存空间的能力，这无疑也增加了程序发生相关指针问题的风险。在程序中过度、不正确使用Unsafe类会使得程序出错的概率变大，使得Java这种安全的语言变得不再“安全”，因此对Unsafe的使用一定要慎重。


## 原子操作 与 事务的原子性的区别：
百度百科中对原子操作的定义: "原子操作(atomic operation)是不需要synchronized"，这是多线程编程的老生常谈了。所谓原子操作是指不会被线程调度机制打断的操作；这种操作一旦开始，就一直运行到结束，中间不会有任何 context switch (切换到另一个线程)。
而多个事务直接是可以并发执行的，所以事务不是原子操作。事务的原子性只是单单指事务中的所有操作要么都做，要么都不做

## DecimalFormat类
概述
DecimalFormat类能够解析和格式化任意语言环境中的数，包括对西方语言、阿拉伯语和印度语数字的支持。它还支持不同类型的数，包括整数 (123)、定点数 (123.4)、科学记数法表示的数 (1.23E4)、百分数 (12%) 和金额 ($123)。所有这些内容都可以本地化
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131253.png)

代码
```java
public class DecimalFormatTest {
	public static void main(String[] args) {
		/* 整数位和小数位 */
		DecimalFormat format = new DecimalFormat("00000.00");
		System.out.println(format.format(6789.8765));// 06789.88

		/* 整数位分组 */
		DecimalFormat format1 = new DecimalFormat(",####.##");
		System.out.println(format1.format(123456789.9876543));// 1,2345,6789.99

		/* 百分数或千分数 */
		DecimalFormat format2 = new DecimalFormat("#0.00%");
		System.out.println(format2.format(0.008888));// 0.89%
		DecimalFormat format3 = new DecimalFormat("#0.00\u2030");
		System.out.println(format3.format(0.008888));// 8.89‰

		/* 科学计数法 */
		DecimalFormat format4 = new DecimalFormat("0.##E0");
		System.out.println(format4.format(123456789));// 1.23E8

		/* 货币 */
		DecimalFormat format5 = new DecimalFormat("\u00A4#0.##");
		System.out.println(format5.format(0.3456));// ￥0.35

		/* 解析数字 */
		DecimalFormat format6 = new DecimalFormat(",#");
		System.out.println(format6.parse("1,234,567.89$999"));// 1234567.89
	}
}
```
```java
public class DecimalFormatTest2 {
	public static void main(String args[]) {
		double number;
		DecimalFormat df = new DecimalFormat();
		String result;
		
		number = 10.22222;
		df.applyPattern("000.##");
		result = df.format(number);
		System.out.println(number + "格式化为整数最少3位，小数最多2位=" + result);
		
		number = 10000000.22222;
		df.applyPattern(",#00.##");
		result = df.format(number);
		System.out.printf("%f格式化为整数最少2位，整数部分按千分组，小数最多2位=", number);
		System.out.println(result);
		
		number = 0.008888;
		df.applyPattern("0.00%");
		result = df.format(number);
		System.out.println(number + "格式化为百分数="+result);
		df.applyPattern("0.00\u2030");
		result = df.format(number);
		System.out.println(number + "格式化为千分数="+result);
		
		number = 12222.2222;
		df.applyPattern("0.00E0");
		result = df.format(number);
		System.out.println(number + "格式化为科学计数法="+result);
		
		String money = "1,222,333.444￥";
		df.applyPattern(",#");
		try {
			Number num = df.parse(money);
			System.out.println(money + "转化成数字=" + num.doubleValue());
		} catch (Exception exp) {
		}
	}
}
```

## java随机数
广义上讲，Java中的随机数的有三种产生方式：
(01). 通过System.currentTimeMillis()来获取一个当前时间毫秒数的long型数字。
(02). 通过Math.random()返回一个0到1之间的double值。
(03). 通过Random类来产生一个随机数，这个是专业的Random工具类，功能强大。
### 第1种
通过System.currentTimeMillis()来获取随机数。实际上是获取当前时间毫秒数，它是long类型。使用方法如下：
```java
final long l = System.currentTimeMillis();
```
若要获取int类型的整数，只需要将上面的结果转行成int类型即可。比如，获取[0, 100)之间的int整数。方法如下：
```java
final long l = System.currentTimeMillis();
final int i = (int)( l % 100 );
```

### 第2种
通过Random类来获取随机数。
使用方法如下：
1. 创建Random对象。有两种方法可以创建Random对象，如下：
```java
Random random = new Random();//默认构造方法,此时的种子时当前常见对象的实现
Random random1 = new Random(1000);//指定种子数字
```
Random构造器源码：
```java
public Random() {
    this(seedUniquifier() ^ System.nanoTime());
}

public Random(long seed) {
    if (getClass() == Random.class)
        this.seed = new AtomicLong(initialScramble(seed));
    else {
        // subclass might have overriden setSeed
        this.seed = new AtomicLong();
        setSeed(seed);
    }
}
```
随机数是种子经过计算生成的。
• 不含参的构造函数每次都使用当前时间作为种子，随机性更强
• 而含参的构造函数其实是伪随机，更有可预见性
注：如果2个Random对象的种子相同的话，那么它们生成的随机数也是一样的
```java
public class test1 {
	public static void main(String[] args) {
		Random ran = new Random(111);
		Random ran1 = new Random(111);
		System.out.println(ran.nextDouble());
		System.out.println(ran.nextDouble());
		System.out.println("------------------------");
		System.out.println(ran1.nextDouble());
		System.out.println(ran1.nextDouble());
	}
}
```
output
```
0.7213825824542086
0.38178681319155416
------------------------
0.7213825824542086
0.38178681319155416
```

(02) 通过Random对象获取随机数。Random支持的随机值类型包括：boolean, byte, int, long, float, double。
比如，获取[0, 100)之间的int整数。方法如下：
```java
int i2 = random.nextInt(100);
```
Random 的函数接口
```java
boolean nextBoolean()         // 返回下一个“boolean类型”伪随机数。 
void    nextBytes(byte[] buf) // 生成随机字节并将其置于字节数组buf中。 
double  nextDouble()          // 返回一个“[0.0, 1.0) 之间的double类型”的随机数。 
float   nextFloat()           // 返回一个“[0.0, 1.0) 之间的float类型”的随机数。 
int     nextInt()             // 返回下一个“int类型”随机数。 
int     nextInt(int n)        // 返回一个“[0, n) 之间的int类型”的随机数。 
long    nextLong()            // 返回下一个“long类型”随机数。 
synchronized double nextGaussian()   // 返回下一个“double类型”的随机数，它是呈高斯（“正常地”）分布的 double 值，其平均值是 0.0，标准偏差是 1.0。 
synchronized void setSeed(long seed) // 使用单个 long 种子设置此随机数生成器的种子。
```

### 第3种
通过Math.random()来获取随机数。实际上，它返回的是0(包含)到1(不包含)之间的double值。使用方法如下：
```java
final double d = Math.random();
```
若要获取int类型的整数，只需要将上面的结果转行成int类型即可。比如，获取[0, 100)之间的int整数。方法如下：
```java
final double d = Math.random();
final int i = (int)(d*100);
```
注：Math.random()的内部原理还是通过调用Random的nextDouble()方法
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131212.png)

注：由于使用Math.random()的底层的Random对象是静态的，从而使得在一个代码里执行执行多个代码Math.random（）的产生的随机数更加具有随机性

## 对象和对象引用的区别
在Java中，有一组名词经常一起出现，它们就是“对象和对象引用”，很多朋友在初学Java的时候可能经常会混淆这2个概念，觉得它们是一回事，事实上则不然。今天我们就来一起了解一下对象和对象引用之间的区别和联系。

### 何谓对象？
在Java中有一句比较流行的话，叫做“万物皆对象”，这是Java语言设计之初的理念之一。要理解什么是对象，需要跟类一起结合起来理解。下面这段话引自《Java编程思想》中的一段原话：
“按照通俗的说法，每个对象都是某个类（class）的一个实例（instance），这里，‘类’就是‘类型’的同义词。”
从这一句话就可以理解到对象的本质，简而言之，它就是类的实例，比如所有的人统称为“人类”，这里的“人类”就是一个类（物种的一种类型），而具体到每个人，比如张三这个人，它就是对象，就是“人类”的实例。

### 何谓对象引用？
我们先看一段话：
“每种编程语言都有自己的数据处理方式。有些时候，程序员必须注意将要处理的数据是什么类型。你是直接操纵元素，还是用某种基于特殊语法的间接表示（例如C/C++里的指针）来操作对象。所有这些在 Java 里都得到了简化，一切都被视为对象。因此，我们可采用一种统一的语法。尽管将一切都“看作”对象，但操纵的标识符实际是指向一个对象的“引用”（reference）。”　　
这段话来自于《Java编程思想》，很显然，从这段话可以看出对象和对象引用不是一回事，是两个完全不同的概念。举个例子，我们通常会用下面这一行代码来创建一个对象：
```java
Person person = new Person("张三");
```
有人会说，这里的person是一个对象，是Person类的一个实例。
也有人会说，这里的person并不是真正的对象，而是指向所创建的对象的引用。
到底哪种说法是对的？我们先不急着纠结哪种说法是对的，再看两行代码：
```java
Person person;
person = new Person("张三");
```
这两行代码实现的功能和上面的一行代码是完全一样的。大家都知道，在Java中new是用来在堆上创建对象用的，如果person是一个对象的话，那么第二行为何还要通过new来创建对象呢？由此可见，person并不是所创建的对象，是什么？上面的一段话说的很清楚，“操纵的标识符实际是指向一个对象的引用”，也就是说person是一个引用，是指向一个可以指向Person类的对象的引用。真正创建对象的语句是右边的new Person("张三");
再看一个例子：
```java
Person person;
person = new Person("张三");
person = new Person("李四");
```
这里让person先指向了“张三”这个对象，然后又指向了“李四”这个对象。也就是说，Person person，这句话只是声明了一个Person类的引用，它可以指向任何Person类的实例。这个道理就和下面这段代码一样：
```java
int a;
a=2;
a=3;
```
这里先声明了一个int类型的变量a，先对a赋值为2，后面又赋值为3.也就是说int类型的变量a，可以让它的值为2，也可以为3，只要是合法的int类型的数值即可。
也就是说，一个引用可以指向多个对象，而一个对象可不可以被多个引用所指呢？答案当然是可以的。
比如：
```java
Person person1 = new Person("张三");
Person person2 = person1;
```
person1和person2都指向了“张三”这个对象。

## replace与replaceAll的区别
一、简述
【replace】的参数是 char 和 CharSequence，既支持字符的替换，也支持字符串的替换(CharSequence即字符串序列的意思，也就是字符串)。
【replaceAll】的参数是 regex，即基于规则表达式的替换。比如：可以通过`replaceAll("\\d", "*")`把一个字符串所有的数字字符都换成星号。

二、异同
- 相同点：都是全部替换，即把源字符串中的某一字符或字符串全部换成指定的字符或字符串。
- 不同点：replaceAll 支持正则表达式，因此会对参数进行解析(两个参数均是)。replace 不支持正则，`replace("\\d","*")`就是替换`"\\d"`的字符串，而不会解析为正则。
- 另外还有一个不同点：\在 Java 中是一个转义字符，所以需要用两个代表一个。例如`System.out.println( "\\" );`只打印出一个\。但是\也是正则表达式中的转义字符，需要用两个代表一个。所以`\\\\`被 Java 转换成`\\`，`\\`又被正则表达式转换成\，因此用 replaceAll 替换\为`\\`，就要用`replaceAll("\\\\","\\\\\\\\")`，而 replace 则为`replace("\\","\\\\")`。
- 如果只想替换第一次出现的，可以使用 replaceFirst()，这个方法也是基于规则表达式的替换，但与 replaceAll() 不同的是，只替换第一次出现的字符串。

## VO、DTO、DO、BO
### 概念
- VO (View Object)，用于表示一个与前端进行交互的视图对象，它的作用是把某个指定页面(或组件)的所有数据封装起来。实际上，这里的 VO 只包含前端需要展示的数据，对于前端不需要的数据，比如数据创建和修改的时间等字段，出于减少传输数据量大小和保护数据库结构不外泄的目的，不应该在 VO 中体现出来。
- DTO(Data Transfer Object)，用于表示一个数据传输对象，DTO 通常用于展示层(Controller)和服务层(Service)之间的数据传输对象。DTO 与 VO 概念相似，并且通常情况下字段也基本一致。但 DTO 与 VO 又有一些不同，这个不同主要是设计理念上的，比如 API 服务需要使用的 DTO 就可能与 VO 存在差异。
- DO(Data Object) ，持久化对象，它跟持久层(Dao)的数据结构形成一一对应的映射关系。如果持久层是关系型数据库，那么数据库表中的每个字段就对应PO的一个属性，常是entity实体类。
- BO（Business Object）：业务对象，就是从现实世界中抽象出来的有形或无形的业务实体。

阿里Java开发手册分层领域模型：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220222094822.png)

### 为什么会存在Vo？

项目中，看到别人直接把DTO，写上swagger注释，直接返回前端。那么思考一下，为什么不建议这么做，不直接把DTO返回给前端。

- 从开发过程讲，前后端首先会以vo和param作为返回、传参的协议的定义，再定义协议之前，都没有实际的业务逻辑的处理，也就不会存在dto。
- 从项目的整体考虑，如果把dto作为传给前端的对象，那么service层返回dto，service层的所有的方法不一定都是public方法，也有private方法，如果private方法也返回dto，那么也就是说有些dto不是提供给前端的，有些是给前端的，这样就会乱，没有了隔离性。
- 从字段的修改来说，service层的方法是可以共用的，一个service方法返回的dto，可能会被很多个controlller方法使用到，即使目前不会，将来也可能会，dto会有很多参数，比如包含了主表信息，子表信息，而传给前端的vo只有dto的一部分信息，而且不同请求给前端看到的数据不一样，所以dto是共用的，vo是个性化的，如果直接把dto提供给前端，将会导致耦合性非常大，一旦一个接口的需求变了，修改了dto，增加了一个字段，将会导致接口直接把这个新增的字段返回给了前端，导致（接口输出数据多余，和不安全性）。同理，如果由于某个需求，把dto展示给前端的接口说要删除某一个字段，那么因为这个dto被很多接口引用，一删除就会导致出问题。

所以，总整体性结构而言：vo是必须存在的，不能把dto直接返回给前端。高内聚，低耦合。

### VO可以复用吗？

比如，一个接口需要VO，另一个接口需要VO加上别的一些数据，这种情况，是继承VO使用，还是再写一个VO？

答案：VO最好不要复用。VO目的就是解耦，应该是并列关系的，如果存在复用，那么就可能导致，一方修改影响另一方。一旦存在继承关系，继承来继承去，最后关系就会变得很乱，不好维护。

### Controller层接收的参数是VO还是DTO？

![](https://raw.githubusercontent.com/NaisWang/images/master/20220222095004.png)

希望大家根据公司情况来定，我们公司前端交互是统一VO的。

Controller层接收的应该是VO，但是根据情况而定，尤其是前后分离，有特定的前端开发人员时，因为DTO往往会添加很多额外的数据信息，打个比方，用户新增，往往前端传递的是账户名、密码、创建人标识等等很少的信息，但是DTO作为一个中转数据，会添加例如更新人、用户状态等等其他的信息，如果前端传递的是DTO，如此多的额外信息会给前端造成很多问题。如果是小项目的话，前后端都是一个人在进行，那就无所谓了，后端需要哪些，不需要哪些心里有数，传递DTO就无所谓了。

一般的数据传递是，前端传递VO给接口(Controller)，接口将VO转为DTO传递给service，service将DTO分解为DO，调用领域服务进行调度，然后逆向转为VO或者其他的返回结果，传递给前台。

### 判断某个Class对象是否实现了某个接口或类
```java
import java.io.Serializable;
 
public class IsAssignableFromTest implements Serializable{
 
    /** 序列号 */
    private static final long serialVersionUID = 5716955136475665579L;
 
    public static void main(String[] args) {
        
        //测试是否实现了父类
        boolean re1= Object.class.isAssignableFrom(IsAssignableFromTest.class);
        //测试是否实现了接口
        boolean re2=Serializable.class.isAssignableFrom(IsAssignableFromTest.class);
        
        System.out.println("re1:"+re1+" re2:"+re2);
    }
}
```
结果：re1:true re2:true 
