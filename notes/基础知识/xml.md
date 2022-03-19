# xml简介
概念：Extensible Markup Language 可扩展标记语言
可扩展：标签都是自定义的。 `<user>`,`<student>`
语法：
- xml文档的后缀名 .xml
- xml第一行必须定义为文档声明
- xml文档中有且仅有一个根标签
- 属性值必须使用引号(单双都可)引起来
- 标签必须正确关闭
- xml标签名称区分大小写

## 文档声明
xml第一行必须定义为文档声明 `<?xml 属性列表?>`。 第一行空着，将文档声明写在第二行都不行，且<与?之间不能有空格
**属性列表**
version: 版本号，必要的属性

## CDATA区
：在该区域中的数据会被原样展示
格式： `<![CDATA[ 数据 ]]>`

## 约束
在xml技术里，**编写一个文档/文件**来约束一个xml文档的书写规范、称为xml约束。因为没有约束 编写的xml文件格式就不统一
常用的xml约束技术有如下两种
- dtd：一种简单的约束条件，文件后缀为dtd
- schema ：一种复杂的约束条件，文件后缀为xsd

### dtd
```dtd
<!ELEMENT students (student*) >   //声明了标签students，该标签下能有子标签student, 且该子标签可以有多个
<!ELEMENT student (name,age,sex)> //声明了标签student, 该标签下能有子标签name,age,sex,且每个子标签只能出现一次， 且必须按照name->age->sex顺序出现
<!ELEMENT name (#PCDATA)> //声明了标签name, 且该标签体内为字符串
<!ELEMENT age (#PCDATA)>
<!ELEMENT sex (#PCDATA)>
<!ATTLIST student number ID #REQUIRED> //给标签student声明了属性number, 该属性的类型为ID，且该属性是必须的
```
dtd分为外部dtd与内部dtd
**内部dtd**
将约束规则定义在xml文档中，格式`<!DOCTYPE 根标签名 [dtd文件内容]>`
**外部dtd**
将约束的规则定义在外部的dtd文件中
- 本地：`<!DOCTYPE 根标签名 SYSTEM "dtd文件的位置">`
- 网络：`<!DOCTYPE 根标签名 PUBLIC "dtd文件名字" "dtd文件的位置URL">`

使用例子：
引用上面的dtd文件
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE students SYSTEM "student.dtd">
<students>
	<student number="002">
		<name>张三</name>
		<age>18</age>
		<sex>male</sex>
	</student>
	<student number="001">
		<name>jack</name>
		<age>18</age>
		<sex>female</sex>
	</student>
</students>
```

### schema
```xml
<?xml version="1.0"?>
<xsd:schema xmlns="http://www.itcast.cn/xml"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        targetNamespace="http://www.itcast.cn/xml" elementFormDefault="qualified">
	<!-- 定义了标签students, 该标签类型为studentsType -->
    <xsd:element name="students" type="studentsType"/>

	<!-- 声明studentsType类型 -->
    <xsd:complexType name="studentsType">
		<!-- 表示下面标签按如下顺序出现 -->
        <xsd:sequence>
			<!-- student标签类型为studentType, 该标签最少出现0次，最多出现的次数无上限 -->
            <xsd:element name="student" type="studentType" minOccurs="0" maxOccurs="unbounded"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:complexType name="studentType">
		<!-- 表示下面标签按如下顺序出现 -->
        <xsd:sequence>
            <xsd:element name="name" type="xsd:string"/>
            <xsd:element name="age" type="ageType" />
            <xsd:element name="sex" type="sexType" />
        </xsd:sequence>
		<!-- 声明了属性number -->
        <xsd:attribute name="number" type="numberType" use="required"/>
    </xsd:complexType>

    <xsd:simpleType name="sexType">
        <xsd:restriction base="xsd:string">
            <xsd:enumeration value="male"/>
            <xsd:enumeration value="female"/>
        </xsd:restriction>
    </xsd:simpleType>

    <xsd:simpleType name="ageType">
        <xsd:restriction base="xsd:integer">
            <xsd:minInclusive value="0"/>
            <xsd:maxInclusive value="256"/>
        </xsd:restriction>
    </xsd:simpleType>

    <xsd:simpleType name="numberType">
        <xsd:restriction base="xsd:string">
            <xsd:pattern value="heima_\d{4}"/>
        </xsd:restriction>
    </xsd:simpleType>
</xsd:schema> 
```
引入：
1.填写xml文档的根元素
2.引入xsi前缀,  `xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`
3.通过xsi引入xsd文件，并给其xsd命名为`http://www.itcast.cn/xml`, 这个称为**命名空间**。语法为： `xsi:schemaLocation="http://www.itcast.cn/xml  student.xsd"`
4.为命名空间声明一个前缀, 作为标识，例如： `xmlns:a="http://www.itcast.cn/xml"` 此时`<a: table>..</table>`表示的就是使用student.xsd约束的标签； 
注`xmlns="http://www.itcast.cn/xml"`表示给`http://www.itcast.cn/xml`声明了一个默认的命名空间，此时`<table>..</table>`不加前缀，就表示的是使用student.xsd约束的标签

以下是springmvc的配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	   xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
						   http://www.springframework.org/schema/mvc https://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <context:component-scan base-package="com.ssm.crud" use-default-filters="false">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views"></property>
    </bean>

    <mvc:default-servlet-handler/>

    <mvc:annotation-driven/>
</beans>
```

## xml中的特殊字符的表示
在xml文件中&为特殊字符，需要用转义字符`\&amp`;来表示&
所以在xml文件配置数据库的url时使用

```xml
<property name="url" value="jdbc:mysql://localhost:3306/ssm_crud?serverTimezone=GMT&amp;useSSL=false"></property>
```

但采用.properties时，由于&在.properties中不是特殊字符，所以可以直接写

```properties
jdbc.url=jdbc:mysql://localhost:3306/ssm_crudserverTimezone=GMT&useSSL=false
```

# XPATH
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210605164323.png" width="700px"/>

XPath (XML Path Language) 是一门在 XML 文档中查找信息的语言，可用来在 XML 文档中对元素和属性进行遍历。
W3School官方文档：http://www.w3school.com.cn/xpath/index.asp

XPath 开发工具
1. 开源的XPath表达式编辑工具:XMLQuire(XML格式文件可用)
2. Chrome插件 XPath Helper
3. Firefox插件 try XPath 

## 选取节点
XPath 使用路径表达式来选取 XML 文档中的节点或者节点集。这些路径表达式和我们在常规的电脑文件系统中看到的表达式非常相似。
下面列出了最常用的路径表达式：
| 表达式   | 描述                                                               |
| -------- | ------------------------------------------------------------------ |
| nodename | 选取此节点的所有子节点。                                           |
| /        | 如果是在最前面，代表从根节点选取。否则选择某节点下的某个直接子节点 |
| //       | 从全局节点中选择节点，随意在哪个位置                               |
| .        | 选取当前节点。                                                     |
| ..       | 选取当前节点的父节点。                                             |
| @        | 选取含有指定属性的元素。                                           |

在下面的表格中，我们已列出了一些路径表达式以及表达式的结果：

| 路径表达式      | 结果                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| bookstore       | 选取 bookstore 元素的所有子节点。                                                                        |
| /bookstore      | 选取根元素下的直接子元素bookstore。注释：假如路径起始于正斜杠( / )，则此路径始终代表到某元素的绝对路径！ |
| bookstore/book  | 选取属于 bookstore 的直接子元素的所有 book 元素。                                                        |
| //book          | 选取所有 book 子元素，而不管它们在文档中的位置。                                                         |
| bookstore//book | 选择属于 bookstore 元素的后代的所有 book 元素，而不管它们位于 bookstore 之下的什么位置。                 |
| //@lang         | 选取有lang属性的元素的Lang属性值。                                                                       |

## 谓语（Predicates）
谓语用来查找某个特定的节点或者包含某个指定的值的节点，被嵌在方括号中。
在下面的表格中，我们列出了带有谓语的一些路径表达式，以及表达式的结果：
| 路径表达式                                    | 结果|
| --------------------------------------------- | -------------------------------------------|
| `/bookstore/book[1]`                          | 选取属于 bookstore 子元素的第一个 book 元素。                                             |
| `/bookstore/book[last()]`                     | 选取属于 bookstore 子元素的最后一个 book 元素。                                           |
| `/bookstore/book[last()-1]`                   | 选取属于 bookstore 子元素的倒数第二个 book 元素。                                         |
| `/bookstore/book[position()<3]`               | 选取最前面的两个属于 bookstore 元素的子元素的 book 元素。                                 |
| `//title[@lang]`                              | 选取所有拥有名为 lang 的属性的 title 元素。                                               |
| `//title[@lang=’eng’]`                        | 选取所有 title 元素，且这些元素拥有值为 eng 的 lang 属性。                                |
| `/bookstore/book[price>35.00]`                | 选取 bookstore 元素的所有 book 元素，且其中的 price 元素的值须大于 35.00。                |
| `/bookstore/book[price>35.00]/title`          | 选取 bookstore 元素中的 book 元素的所有 title 元素，且其中的 price 元素的值须大于 35.00。 |
| `/bookstore/book[contains(@class,"fdfd")/ul]` | 选取bookstore元素中的class属性中含有fdfd值的book元素的子元素ul                            |

## 选取未知节点
XPath 通配符可用来选取未知的 XML 元素。
| 通配符 | 描述                 |
| ------ | -------------------- |
| *      | 匹配任何元素节点。   |
| @*     | 匹配任何属性节点。   |
| node() | 匹配任何类型的节点。 |

在下面的表格中，我们列出了一些路径表达式，以及这些表达式的结果：
| 路径表达式    | 结果                              |
| ------------- | --------------------------------- |
| /bookstore/*  | 选取 bookstore 元素的所有子元素。 |
| //*           | 选取文档中的所有元素。            |
| `//title[@*]` | 选取所有带有属性的 title 元素。   |

## 选取若干路径
通过在路径表达式中使用“|”运算符，您可以选取若干个路径。
实例
在下面的表格中，我们列出了一些路径表达式，以及这些表达式的结果：
| 路径表达式                       | 结果                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| //book/title \| //book/price     | 选取 book 元素的所有 title 和 price 元素。                                          |
| //title \| //price               | 选取文档中的所有 title 和 price 元素。                                              |
| /bookstore/book/title \| //price | 选取属于 bookstore 元素的 book 元素的所有 title 元素，以及文档中所有的 price 元素。 |

## XPath的运算符
下面列出了可用在 XPath 表达式中的运算符：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210605133100.png" width="700px"/>