# SpringMVC概述
• Spring 为展现层提供的基于 MVC 设计理念的优秀的Web 框架，是目前最主流的 MVC 框架之一
• Spring3.0 后全面超越 Struts2，成为最优秀的 MVC 框架
• Spring MVC 通过一套 MVC 注解，让 POJO (Plain Ordinary Java Object)成为处理请求的控制器，而无须实现任何接口。
• 支持 REST 风格的 URL 请求
• 采用了松散耦合可插拔组件结构，比其他 MVC 框架更具扩展性和灵活性

## springmvc是什么
1）一种轻量级的、基于MVc的Web层应用框架。偏前端而不是基于业务逻辑层。Spring框架的一个后续产品。

## SpringMVC能干什么
1）天生与Spring 框架集成，如：（IOC，AOP）
2）支持Restful风格
3）进行更简洁的web层开发
4）支持灵活的URL到页面控制器的映射
5）非常容易与其他视图技术集成
6）因为模型数据不存放在特定的APl里，而是放在一个Model里（Map数据结构实现，因此很容易被其他框架使用I了
7）非常灵活的数据验证、格式化和数据绑定机制、能使用任何对象进行数据绑定，不必实现特定框架的API
8）更加简单、强大的异常处理
9）对静态资源的支持
10）支持灵活的本地化、主题等解析

## SpringMVC怎么玩
1）将Web层进行了职责解耦，基于请求响应模型
2）常用主要组件
①DispatcherServlet：前端控制器, 本质就是servlet。 对客户端发送的所有请求进行统一管理与处理
②Controller：处理器/页面控制器，做的是MVC中的C的事情，但控制逻辑转移到前端控制器了，用于对请求进行处理
③HandlerMapping：请求映射到处理器，找谁来处理，如果映射成功返回一个andlerExecutionChain 对象（包含一个Handler 处理器（页面控制器）对象、多个Handlerlntercepfor 拦截器对象）
④ViewResolver：视图解析器，找谁来处理返回的页面。把逻辑视图解析为具体的View，进行这种策略模式，很容易更换其他视图技术；
⑤LocalResolver：本地化、国际化
⑥MultipartResolver：文件上传解析器
⑦ HandlerExceptionResolver：异常处理器

# HelloWorld
步骤：
1. 导入jar包
commons-logging-1.1.3.jar
spring-aop-4.0.0.RELEASE.jar
spring-beans-4.0.0.RELEASE.jar
spring-context-4.0.0.RELEASE.jar
spring-core-4.0.0.RELEASE.jar
spring-expression-4.0.0.RELEASE.jar
spring-web-4.0.0.RELEASE.jar
spring-webmvc-4.0.0.RELEASE.jar
>Notes: 在maven中，spring-webmvc依赖中包含spring-aop,spring-beans,spring-core,spring-context,spring-expressiong,spring-web

2. 在web.xml中配置springMVC的核心（前端）控制器DispatcherServlet
当DispatcherServlet被加载时，DispatcherServlet会自动加载springmvc配置文件，此时的配置文件有默认的位置和名称，其默认位置：WEB-INF下，默认名称 \<servlet-name>-servlet.xml，例如以下配置方式的文件名：springMVC-servlet.xml
```xml
    <servlet>
      <servlet-name>springMVC</servlet-name>
      <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    </servlet>
    <servlet-mapping>
      <servlet-name>springMVC</servlet-name>
      <url-pattern>/</url-pattern>
    </servlet-mapping>
```

修改DispatchServlet默认配置
```xml
    <servlet>
		<servlet-name>springMVC</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<!-- 修改DispatcherServlet中的contextConfigLocation属性值, 将配置文件路径设置成为resource路径下的springMVC.xml -->
			<param-name>contextConfigLocation</param-name>
			<!-- 这里之所以加classpath的原因是，webapp有两个路径，分别是resource路径与webapp路径， 加classpath表示resource路径 -->
			<param-value>classpath:springMVC.xml</param-value>
		</init-param>

		<!-- 设置servlet的加载时间
			servlet默认在第一次访问时加载，若设置此标签，会将servlet的加载时间提前到项目启动时
			此标签要写正整数， 写成负整数或0与没有设置是一样的效果，只有设置为正整数才会将servlet的加载时间提前到项目启动时, 就算时提前到项目启动时，也还是最后被加载的
			值越小优先级越高
			多个servlet的优先级不能相同，否则会报错-->
		<load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
      <servlet-name>springMVC</servlet-name>
      <url-pattern>/</url-pattern>
    </servlet-mapping>
```

>note:
 `<url-pattern>/</url-pattern>`于 `<url-pattern>/*</url-pattern>`的区别
 配置成 / 时，DispatcherServlet会不会截获静态资源请求，例如.jsp
 配置成 /* 时，DispatcherServlet会截获所有请求，包括.jsp
 对于DispatchServlet中的配置，配置成 / 而不要配置成 /*

当加载springMVC-servlet.xml配置文件，springMVC就会根据配置文件来扫描组件找到控制曾； springMVC-servlet.xml内容如下
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context/spring-context.xsd
                           http://www.springframework.org/schema/context">
    <!--扫描组件-->
    <context:component-scan base-package="com.atguigu.test"></context:component-scan>

    <!--配置视图解析器-->
	<bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<!-- 作用: 在控制层返回的视图名称前加上prefix， 后面加上suffix -->
		<!-- 例如： 控制层返回的视图名称为hellowWorld,  经过视图解析器后变成/WEB-INF/view/hellowWorld.jsp -->
        <property name="prefix" value="/WEB-INF/view"></property>
        <property name="suffix" value=".jsp"></property>
    </bean>
</beans>
```
3. 创建一个POJ0，在此类上加上@Controller注解，springMVC就会将此类作为控制层加载，让其处理请求响应
```java
@Controller
public class Test {
	@RequestMapping("/hello") //加斜杠表示相对于项目， 不加斜线表示相对当前位置， 注source文件夹下的所有文件的当前位置都是相对于项目， 即在source文件夹下的文件加斜杠于不加斜杠都一样
	public String helloWorld(){
		System.out.println("jfkdjfkdjf");
		return "helloworld"; //返回的是视图名称
	}
}
```

# @RequestMapping
在控制器的类定义及方法定义处都可标注@RequestMapping
– 类定义处：提供初步的请求映射信息，对该类中的所有方法都有效。相对于 WEB 应用的根目录
– 方法处：提供进一步的细分映射信息。相对于类定义处的URL。若类定义处未标注 @RequestMapping，则方法处标记的 URL 相对于WEB 应用的根目录

DispatcherServlet截获请求后，就通过控制器上 @RequestMapping 提供的映射信息确定请求所对应的处理方法。

## 映射请求参数、请求方法或请求头
标准的 HTTP 请求报头
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210104095435.png" width="700px"/>

@RequestMapping 除了可以使用请求 URL 映射请求外，还可以使用请求方法、请求参数及请求头映射请求
@RequestMapping 的 value、method、params 及 headers 分别表示请求 URL、请求方法、请求参数及请求头的映射条件，他们之间是与的关系，联合使用多个条件可让请求映射更加精确化。
params 和 headers 支持简单的表达式：
>param1 : 表示请求必须包含名为 param1 的请求参数
!param1 : 表示请求不能包含名为 param1 的请求参数
param1 != value1: 表示请求包含名为 param1 的请求参数，但其值不能为 value1
{“param1=value1”, “param2”}: 请求必须包含名为 param1 和param2的两个请求参数，且 param1 参数的值必须为 value1
headers用法和params一样
```java
@RequestMapping(value="/test", method=RequestMethod.POST, params={"username", "age!=12"}, headers={"Accept-Language=zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US"})
```

## @GetMapping和@PostMapping等新注释
Spring的复杂性不是来自于它处理的对象，而是来自于自身，不断演进发展的Spring会带来时间维度上复杂性，比如SpringMVC以前版本的@RequestMapping，到了新版本被下面新注释替代，相当于增加的选项：
```
@GetMapping
@PostMapping
@PutMapping
@DeleteMapping
@PatchMapping
```
从命名约定我们可以看到每个注释都是为了处理各自的传入请求方法类型，即@GetMapping用于处理请求方法的GET类型，@PostMapping用于处理请求方法的POST类型等。

如果我们想使用传统的@RequestMapping注释实现URL处理程序，那么它应该是这样的：
```java
@RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
```
新方法可以简化为：
```java
@GetMapping("/get/{id}")
```

**原理**
所有上述注释都已在内部注释了@RequestMapping以及方法元素中的相应值。
例如，如果我们查看@GetMapping注释的源代码，我们可以看到它已经通过以下方式使用RequestMethod.GET进行了注释：
```java
@Target({ java.lang.annotation.ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = { RequestMethod.GET })
public @interface GetMapping {
   // abstract codes
}
```
所有其他注释都以相同的方式创建，即@PostMapping使用RequestMethod.POST进行注释，@ PutMapping使用RequestMethod.PUT进行注释等。

## Ant
springMVC支持Ant方式的请求路径
Ant 风格资源地址支持 3 种匹配符
> ?：匹配文件名中的一个字符
  *：匹配文件名中的任意字符
  `**`：匹配多层路径

列如：
– /user/*/createUser: 匹配
/user/aaa/createUser、/user/bbb/createUser 等 URL
– /user/**/createUser: 匹配
/user/createUser、/user/aaa/bbb/createUser 等 URL
– /user/createUser??: 匹配
/user/createUseraa、/user/createUserbb 等 URL  
```java
@RequestMapping(value="/*/fff??/**/testff")
```

## PathVariable映射URL绑定的占位符
带占位符的 URL 是 Spring3.0 新增的功能，该功能在SpringMVC向REST目标挺进发展过程中具有里程碑的意义
通过 @PathVariable 可以将 URL 中占位符参数绑定到控制器处理方法的入参中：URL 中的 {xxx} 占位符可以通过@PathVariable("xxx")绑定到操作方法的形参中。
```java
@RequestMapping("/testRe/{id}/{username}")
public String testREST(@PathVariable("id")Integer id, @PathVariable("username")String user){
	System.out.println("id:"+id+",username="+username);
	return "success";
}
```
如果@PathVAriable后接的是Map,则会将url中的键值对全部放进map中，例如，上面的代码和下面的等价
```java
@RequestMapping("/testRe/{id}/{username}")
public String testREST(@PathVariable Map<String, String> pv){
	System.out.println(pv);
	return "success";
}
```
或
```java
@RequestMapping("/testRe/{id}/{username}")
public String testREST(@PathVariable("id")Integer id, @PathVariable("username")String user, @PathVariable Map<String, String> pv){
	System.out.println(pv);
	System.out.println("id:"+id+",username="+username);
	return "success";
}
```

## consumes属性和produces属性
- consumes属性：指定处理请求的提交内容类型（Content-Type）
- produces属性：指定响应体类型和响应体编码
**produces的例子**
produces第一种使用，返回json数据，下边的代码可以省略produces属性，因为我们已经使用了注解@responseBody就是返回值是json数据：
```java
@Controller  
@RequestMapping(value = "/pets/{petId}", method = RequestMethod.GET, produces="application/json")  
@ResponseBody 
```
produces第二种使用，返回json数据的字符编码为utf-8.：
```java
@RequestMapping(value = "/pets/{petId}", produces="MediaType.APPLICATION_JSON_VALUE"+";charset=utf-8")  
@ResponseBody  
```
**consumes的例子**
```java
//仅处理request Content-Type为“application/json”类型的请求。指定处理请求的 提交内容类型 （Content-Type）
@RequestMapping(value = "/pets", method = RequestMethod.POST, consumes="application/json")  
```

# REST
• REST：即 Representational State Transfer。（资源）表现层状态转化。是目前最流行的一种互联网软件架构。它结构清晰、符合标准、易于理解、扩展方便，所以正得到越来越多网站的采用
• 表现层（Representation）：把资源具体呈现出来的形式，叫做它的表现层（Representation）。比如，文本可以用 txt 格式表现，也可以用 HTML 格式、XML 格式、JSON 格式表现，甚至可以采用二进制格式。
• 状态转化（State Transfer）：每发出一个请求，就代表了客户端和服务器的一次交互过程。HTTP协议，是一个无状态协议，即所有的状态都保存在服务器端。因此，如果客户端想要操作服务器，必须通过某种手段，让服务器端发生“状态转化”（State Transfer）。而这种转化是建立在表现层之上的，所以就是 “表现层状态转化”。具体说，就是 HTTP 协议里面，四个表示操作方式的动词：GET、POST、PUT、DELETE。它们分别对应四种基本操作：GET 用来获取资源，POST 用来新建资源，PUT 用来更新资源，DELETE 用来删除资源。

示例：
>– /order/1 HTTP GET ：得到 id = 1 的 order   
– /order/1 HTTP DELETE：删除 id = 1的 order   
– /order/1 HTTP PUT：更新id = 1的 order   
– /order HTTP POST：新增 order

## HiddenHttpMethodFilter
由于浏览器 form 表单<font color="red">只</font>支持GET与POST 请求，而DELETE、PUT 等 method 并不支持，Spring3.0 添加了一个过滤器HiddenHttpMethodFilter，可以将这些请求转换为标准的 http 方法，使得支持 GET、POST、PUT 与DELETE 请求

HiddenHttpMethodFilter对请求作出转换的2个条件
1. 请求必须是POST请求
2. 请求中必须含有_method参数
若不符合上述条件， HiddenHttpMethodFilter不会对请求进行转换
若符合上述条件，则经过转换后，真正的请求方式就是_method的值

例子
配置HiddenHttpMethodFilter过滤器
```xml
<filter>
	<filter-name>HiddenHttpMethodFilter</filter-name>
	<filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
</filter>
<filter-mapping>
	<filter-name>HiddenHttpMethodFilter</filter-name>
	<!-- 注意：此处应该为/* -->
	<url-pattern>/*</url-pattern> 
</filter-mapping>
```
```html
<form action="testRest" method="POST">
	<input type="hidden" name="_method" value="PUT"/>
	<input type="submit" value="测试PUT"/>
</form>
<form action="testRest/1001" method="POST">
	<input type="hidden" name="_method" value="DELETE"/>
	<input type="submit" value="测试DELETE"/>
</form>
```
```java
@RequestMapping(value="/testRest", method=RequestMethod.PUT)
public String updateUser(){
	System.out.println("PUT");
	return "success";
}

@RequestMapping(value="/testRest/{id}", method=RequestMethod.DELETE)
public String deleteUser(@PathVariable("id")Integer id){
	System.out.println("DELETE");
	return "success";
}
```

## ajax发送PUT和DELETE请求
虽然ajax支持PUT和DELETE请求，但是在解析参数方面需要注意，如果直接使用ajax自带的PUT和DELETE方式，且以表单形式发送数据时，springmvc会无法识别其键值对， 例如：
```js
  $.ajax({
    url: "/ssm/emp1",
    data: {"name":"hwz", "gender":[1,2,3]},
    type: "delete",
    success: function (data) {
      console.log(data);
    }
  })
```
```java
@ResponseBody
@RequestMapping(value = "/emp1", method = RequestMethod.DELETE)
public Boolean delete1(String name){
	System.out.println(name);
	return false;
}
```
上述controller能拦截ajax请求，但是无法将请求参数name封装入参name中
此时我们可以使用contentType=application/json的形式发送json字符串，然后使用@RequestBody来接收

如果我们就是想让ajax发送put、delete请求，且contentType=application/x-www-form-urlencoded, 且controller能识别键值对的话，我们可以使用HiddenHttpMethodFilter， 使用方法与form表单发送put、delete请求一样, 要配置HiddenHttpMethodFilter过滤器，配置方法一样
```js
  $.ajax({
    url: "/ssm/emp1",
    data: {_method:"DELETE", "name":"hwz", "gender":[1,2,3]},
    type: "post",
    success: function (data) {
      console.log(data);
    }
  })
```

```java
@ResponseBody
@RequestMapping(value = "/emp1", method = RequestMethod.DELETE)
public Boolean delete1(String name){
	System.out.println(name);
	return false;
}
```
此时controller就是识别键值对，从而把请求参数name匹配到入参name中

## controller接收的键值对中值为数组的情形
```js
  $.ajax({
    url: "/ssm/emp1",
    data: {_method:"DELETE", "name":"hwz", "gender":[1,2,3]},
    type: "post",
    success: function (data) {
      console.log(data);
    }
  })
```
此时From Data数据如下：
```
_method: DELETE
name: hwz
gender[]: 1
gender[]: 2
gender[]: 3
```
所以controller要接受gender，必须要以gender[]为名， 如下
```java
@ResponseBody
@RequestMapping(value = "/emp1", method = RequestMethod.DELETE)
public String delete1(@RequestParam("gender[]") Integer[] gender){
	return false;
}
```

如果不想让gender变成gender[], 我们在ajax中添加属性traditional:true, 如下：
```js
  $.ajax({
    url: "/ssm/emp1",
    data: {_method:"DELETE", "name":"hwz", "gender":[1,2,3]},
    type: "post",
	traditional: true,
    success: function (data) {
      console.log(data);
    }
  })
```
此时From Data数据如下：
```
_method: DELETE
name: hwz
gender: 1
gender: 2
gender: 3
```
此时就controller可以直接使用Integer[] gender接收了，而不需要使用@RequestParam("gender[]")


# 请求处理方法签名
Spring MVC 通过分析处理方法的签名，将HTTP请求信息绑定到处理方法的相应参数中。
- Spring MVC 对控制器处理方法签名的限制是很宽松的，几乎可以按喜欢的任何方式对方法进行签名。
- 必要时可以对方法及方法入参标注相应的注解（@PathVariable、@RequestParam、@RequestHeader 等）、SpringMVC 框架会将 HTTP 请求的信息绑定到相应的方法入参中，并根据方法的返回值类型做出相应的后续处理

## @RequestParam
在处理方法入参处使用 @RequestParam 可以把请求参数传递给请求方法
– value：参数名
– required：是否必须。默认为 true, 表示请求参数中必须包含对应的参数，若不存在，将抛出异常
如果请求中的参数名与servlet拦截方法中的入参名相同时，会自动匹配，若不同，则不会匹配，此时就可以借助@RequestParam来指定映射关系使其匹配
- defaultValue : 若形参所获得的值为null, 则赋值其一个默认值， 主要用于分页与模糊查询中

例子：
请求中包含参数名为name的参数
```java
@RequestMapping(value="/testRest")
public String updateUser(@RequestParam(value="name")String studentName){
	return "success";
}
```
上述例子中，如果没有配置@RequestParam，则时入参studentName时不会匹配到请求中的name参数的， 如果入参是name, 则不需要使用@RequestParam, 也是自动匹配， 如下
```java
@RequestMapping(value="/testRest")
public String updateUser(String name){
	return "success";
}
```

如果@RequestParam后接的是Map, 则会将请求参数中的所有键值对全部放进map中
```java
@RequestMapping(value="/testRest")
public String updateUser(@RequestParam Map<String, String> kv){
	return "success";
}
```
或
```java
@RequestMapping(value="/testRest")
public String updateUser(@RequestParam(value="name")String studentName, @RequestParam Map<String, String> kv){
	return "success";
}
```

## @RequestHeader
请求头包含了若干个属性，服务器可据此获知客户端的信息，通过 @RequestHeader 即可将请求头中的属性值绑定到处理方法的入参中
用法与@RequestParam一样
```java
@RequestMapping(value="/testRest")
public String updateUser(@RequestHeader("Accept-Encoding")String encoding){
	return "success";
}
```
如果@RequestHeader后接的是Map, 则会将请求头中的的所有键值对全部放进map中
```java
@RequestMapping(value="/testRest")
public String updateUser(@RequestHeader("Accept-Encoding")String encoding, @RequestHeader Map<String, String> kv){
	System.out.println(kv);
	return "success";
}
```

## @CookieValue
@CookieValue 可让处理方法入参绑定某个 Cookie 值
用法与@RequestParam一样
```java
@RequestMapping(value="/testRest")
public String updateUser(@CookieValue("sessionId")String sessionId){
	return "success";
}
```
获取cookie对象
```java
@RequestMapping(value="/testRest")
public String updateUser(@CookieValue("sessionId") Cookies sessionIdCookie){
	System.out.println(sessionIdCookie.getName() + "====>" sessionIdCookie.getValue());
	return "success";
}
```

## POJO对象绑定请求参数值
当请求参数格式为`request String Parameters`或`Form Data`时，Spring MVC 会按请求参数和 POJO 属性名进行自动匹配，自动为该对象填充属性值。支持级联属性。如：dept.deptId、dept.address.tel等
**注：没包括`request payload`格式,该格式的自动匹配需要借助@RequestBody注解**，详细见[使用JSON](##@RequestBody注解)

```html
<form action="param" method="post">
username:<input type="text" name="username"/>
password:<input type="text" name="password"/>
city:<input type="text" name="address.city"/>
</form>
```
```java
@RequestMapping(value="/param", method=RequestMethod.POST)
public String param(User user){
	return "success";
}
```

## 使用Servlet原生API作为参数
MVC 的 Handler 方法可以接受的ServletAPI类型的参数
>HttpServletRequest
HttpServletResponse
HttpSession
java.security.Principal
org.springframework.security.core.Authentication
Locale
InputStream
OutputStream
Reader
Writer
```java
@RequestMapping(value="/param", method=RequestMethod.POST)
public String param(User user, HttpServletRequest req, HttpServletResponse resp){
	req.setAttribute("msg", "succcess");
	String username = req.getParameter("username");
	return "success";
}
```

**获取request域中的数据的两种方法：**使用HttpServletRequest, 或@RequestAttribute
```java
@ResponseBody
@RequestMapping("/success")
public String param(@RequestAttribute("msg") String msg, HttpServletRequest req){
	System.out.println(msg);
	System.out.println(req.getAttribute("msg"));
	return "page";
}

```

# 使用JSON
## java中json使用步骤
第一步：加入jar包
jackson-annotations.jar
jackson-core.jar
jackson-databind.jar
jackson包的作用：会自动将JSON转换为java对象，或者将java对象转换为json
第二步：编写目标方法，使其返回JSON对应的对象或集合， 在该方法上添加@ResponseBody, 有了这个注解，springmvc就知道，该方法是作为响应体来实现功能，而不是用来实现页面跳转的
```java
@ResponseBody
@RequestMapping("/getUsers")
public List<User> testAjax(){
	List<User> users = new ArrayList<>();
	users.add(new User(1, "a", new DAte(), 1000));
	users.add(new User(2, "b", new DAte(), 2000));
	return users;
}
```
注：
1. 如果不适用jackson包的情况下，返回java对象，是不会自动将其转换为json的，而js是无法识别java对象的，否有会报406错误
2. 使用JSON, 一定要开启mvc驱动`<mvc: annotation-driven />`
3. 缺少上面任何一步， 都会导致406

## @RequestBody注解
@RequestBody作用方法参数上，表明该参数用来接收请求体，例如：
前端：
```html
<form action="/testRequestBody" method="post">
	<input name="username" value="tomcat">
	<input name="password" value="123456">
	<input type="submit">
<form>
```
后端:
```java
@RequestMapping("/testRequestBody")
public String testRequestBody(@RequestBody String body){
	System.out.println("请求体:" + body);
	return "success"
}
```
后端输出：
```
请求体：username=tomcat&password=123456
```

但是此时如果我将form表单中的method改为get，使其发送get请求，那么后端输出如下：
```
请求体：
```
可以看出后端方法中的body参数没有匹配到，应为请求体中没有数据

### 当请求体为json数据时
**springmvc是不能够将请求体中的json数据中的键值对匹配到对应的形参中的；**
例如：
```js
$.ajax({
		url : '/test',
		type : 'post',
		data : "{username:'whz',pwd:'123'}",  //这里是对象
		contentType: 'application/json',  //规定传的值是json
		success : function(data){......}
)};
```
```java
@RequestMapping("/test")
public String test(String uername, String pwd){
	System.out.println("username:"+ username);
	System.out.println("pwd:" + pwd);
	return "success"
}
```
后端输出：
```
username:
pwd:
```
可以看出后端方法中的username参数与pwd参数都没有匹配到请求体中json数据中对应的键值对

**为了解决上述问题，我们可以使用@RequestBody注解，先接收到请求体，然后将请求体中的json字符串转换为java对象，进而获取其中的属性，如下：**
```java
@RequestMapping("/test")
public String test(@RequestBody String body){

	//将json字符串body变量转化为java对象
	...

	return "success"
}
```

### @RequestBody注解修饰pojo类型参数
当@RequestBody注解修饰的参数的类型为pojo时，会有一个**自动**转换过程，将请求体中数据转换为对应的pojo对象。其转换规则可如下 :
- 请求体中的数据为json数据时： springmvc会自动通过使用HandlerAdapter配置的HttpMessageConverters来将json字符串转换为java对象，**注：这个转换过程需要导入jackson包**
- 请求体中的数据为一个个键值对时： 此转换过程不需要导入其他包

```java
@ResponseBody
@RequestMapping(value = "/test1")
	public Boolean test1(@RequestBody User user){
		return false;
	}
}

@ResponseBody
@RequestMapping(value = "/test2")
	public Boolean test2(@RequestBody List<User> users){
		return false;
	}
}
```

### 如何使用@RequestBody传递多个不同对象
如果使用spring mvc同客户端通信，完全使用json数据格式，需要增加RequestBody注解，函数参数为自定义类
```java
@Controller
public class TestController{
  @RequestMapping("\test")
  @ResponseBody
  public RetureResult test(@RequestBody User user){
    return new ReturnResult();
  }  
}
```
这样的话，可以将接收到的json格式的数据转换为指定的数据对象user。比如{name:"test"}，name为User类的属性域。通过ResponseBody注解，可以返回json格式的数据。
有时接收json格式数据时，我们可能需要将其转换为多个对象。
以下方式是错误的。原因是request的content-body是以流的形式进行读取的，读取完一次后，便无法再次读取了。
```java
@Controller
public class TestController{
  @RequestMapping("\test")
  @ResponseBody
  public RetureResult test(@RequestBody User user,@RequestBody Address address){
    return new ReturnResult();
  }  
}
```

#### 解决方案1：
增加一个包装类，将所需要类写入，增加get，set方法
```java
@Controller
public class TestController{
  @RequestMapping("\test")
  @ResponseBody
  public RetureResult test(@RequestBody Param param){
    User user=param.getUser();
    Address address=param.getAddress();
    return new ReturnResult();
  }  
}
class Param{
 
    private User user;
    private Address address;  
 
    public User getUser() {
        return user;
    }
 
    public void setUser(User user) {
        this.user = user;
    }
 
    public Address getAddress() {
        return address;
    }
 
    public void setAddress(Address address) {
        this.address = address;
    }
}
```
此时传输的json数据格式变为`{user:{name:"test"},address:{location:"新华路"}}`。

由于只是在TestController中增加一个包装类，不会影响其他的类以及已经定义好的model类，因此可以非常方便的达到接收多个对象参数的目的。

#### 解决方案2：
将接收参数定义为Map`<String, Object>`，然后使用map转object工具，转换成需要的对象。
此时，即使自定义的Param类中的属性即使比json数据中的属性少了，也没关系。
其中JSONUtils为自定义的工具类，可使用常见的fastjson等工具包包装实现。
```java
@Controller
public class TestController{
  @RequestMapping("\test")
  @ResponseBody
  public Object test(@RequestBody Map<String, Object> models){
　　　User user=JsonXMLUtils.map2object((Map<String, Object>)models.get("user"),User.class); 
　　　Address address=JsonXMLUtils.map2object((Map<String, Object>)models.get("address"),Address.class); 
　　　return models; 
　}
}
```
```java
import com.alibaba.fastjson.JSON;
 
public class JsonXMLUtils {
    public static String obj2json(Object obj) throws Exception {
        return JSON.toJSONString(obj);
    }
 
    public static <T> T json2obj(String jsonStr, Class<T> clazz) throws Exception {
        return JSON.parseObject(jsonStr, clazz);
    }
 
    public static <T> Map<String, Object> json2map(String jsonStr)     throws Exception {
            return JSON.parseObject(jsonStr, Map.class);
    }
  
    public static <T> T map2obj(Map<?, ?> map, Class<T> clazz) throws Exception {
        return JSON.parseObject(JSON.toJSONString(map), clazz);
    }
}
```
# @JsonFormat和@DateTimeFormat的作用
## @DatetimeFormat
@DatetimeFormat是将String转换成Date，一般前台给后台传值时用
```java
import org.springframework.format.annotation.DateTimeFormat;

/**
	* 前台传后台时, 字符串自动封装成日期
	*/
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
private Date birth;
``` 

## @JsonFormat
@JsonFormat(pattern=”yyyy-MM-dd”) 将Date转换成String 一般后台传值给前台时
```java
import com.fasterxml.jackson.annotation.JsonFormat;

/**
	* 后台返给前台时, 日期自动格式化
	*/
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
private Date birth;
``` 

注意
@JsonFormat不仅可以完成后台到前台参数传递的类型转换，还可以实现前台到后台类型转换。
当content-type为application/json时，优先使用@JsonFormat的pattern进行类型转换。而不会使用@DateTimeFormat进行类型转换。	

# 处理模型数据
Spring MVC 提供了以下几种途径输出模型数据：
– ModelAndView: 处理方法返回值类型为 ModelAndView时, 方法体即可通过该对象添加模型数据
– Map 及 Model: 入参为org.springframework.ui.Model、org.springframework.ui.ModelMap 或 java.uti.Map 时，处理方法返回时，Map中的数据会自动添加到模型中。
– @SessionAttributes: 将模型中的某个属性暂存到HttpSession中，以便多个请求之间可以共享这个属性
– @ModelAttribute: 方法入参标注该注解后, 入参的对象就会放到数据模型中

## ModelAndView
控制器处理方法的返回值如果为 ModelAndView, 则其既包含视图信息，也包含模型数据信息。
ModelAndView中的方法
• 添加模型数据:
– MoelAndView addObject(String attributeName, Objectattribute Value)
– ModelAndView addAllObject(Map<String, ?> modelMap)
• 设置视图:
– void setView(View view)
– void setViewName(String viewName)j
```java
@RequestMapping(value="/param", method=RequestMethod.POST)
public ModelAndView param(){
	ModelAndView mav = new ModelAndView();
	mav.addObject("username", "root");//往request作用域中放值
	mav.setViewName("success");//设置视图名称，实现页面跳转
	return mav;
}
```

## Map 及 Model
Spring MVC 在内部使用了一个org.springframework.ui.Model 接口存储模型数据
具体步骤
– Spring MVC 在调用方法前会创建一个隐含的模型对象作为模型数据的存储容器。
– 如果方法的入参为 Map 或 Model 类型，Spring MVC 会将隐含模型的引用传递给这些入参。在方法体内，开发者可以通过这个入参对象访问到模型中的所有数据，也可以向模型中添加新的属性数据
```java
@RequestMapping(value="/param", method=RequestMethod.POST)
public String param(Map<String, Object> map){
	map.put("username", "admin");//向request作用域中放值
	return "success";
}
```
```java
@RequestMapping(value="/param", method=RequestMethod.POST)
public String param(Model model){
	model.addAttribute("username", "zhangsan");//向request作用域中放值
	return "success";
}
```

## @SessionAttributes
若希望在多个请求之间共用某个模型属性数据，即将数据放入session域中， 则可以在控制器类上标注一个 @SessionAttributes, Spring MVC将在模型中对应的属性暂存到 HttpSession 中。
• @SessionAttributes 除了可以通过属性名指定需要放到会话中的属性外，还可以通过模型属性的对象类型指定哪些模型属性需要放到会话中
– @SessionAttributes(types=User.class) 会将隐含模型中所有类型为 User.class 的属性添加到session域中。
– @SessionAttributes(value={“user1”, “user2”}) 会将属性名为user1与user2的属性添加到session域中
– @SessionAttributes(types={User.class, Dept.class})
– @SessionAttributes(value={“user1”, “user2”},types={Dept.class})
注：该注解只能放在类的上面，而不能放在方法上面
```java
@SessionAttributes(value={"user"}, types={String.class})
@Controller
public class SpringMVCTest{

	@RequestMapping(value="/param", method=RequestMethod.POST)
	public String param(Map<String, Object> map){
		User user = new User("Tom", "1234", "tom@atguigi", 14);
		// 由于@SessionAttributes的作用，一下操作将user,school属性添加到session域中了
		map.put("user", user);
		map.put("school", "atguigu");
		return "success";
	}
}
```

# 视图和视图解析器 
请求处理方法执行完成后，最终返回一个 ModelAndView对象。对于那些返回 String，View 或 ModeMap 等类型的处理方法，Spring MVC 也会在内部将它们装配成一个ModelAndView 对象，它包含了逻辑名和模型对象的视图
• Spring MVC 借助视图解析器（ViewResolver）得到最终的视图对象（View），最终的视图可以是 JSP ，也可能是Excel、JFreeChart 等各种表现形式的视图
• 对于最终究竟采取何种视图对象对模型数据进行渲染，处理器并不关心，处理器工作重点聚焦在生产模型数据的工作上，从而实现 MVC 的充分解耦
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210104102008.png" width="700px"/>

## 视图
视图的作用是渲染模型数据，将模型里的数据以某种形式呈现给客户
为了实现视图模型和具体实现技术的解耦，Spring 在org.springframework.web.servlet 包中定义了一个高度抽象的View接口
视图对象由视图解析器负责实例化。由于视图是无状态的，所以他们不会有线程安全的问题
常用的视图实现类
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210104102105.png" width="700px"/>

## 视图解析器
SpringMVC 为逻辑视图名的解析提供了不同的策略，可以在 Spring WEB 上下文中配置一种或多种解析策略，并指定他们之间的先后顺序。每一种映射策略对应一个具体的视图解析器实现类。
• 视图解析器的作用比较单一：将逻辑视图解析为一个具体的视图对象。
• 所有的视图解析器都必须实现 ViewResolver 接口：
常用的视图解析器实现类
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210104102258.png" width="700px"/>

程序员可以选择一种视图解析器或混用多种视图解析器
• 每个视图解析器都实现了 Ordered 接口并开放出一个 order 属性，可以通过 order 属性指定解析器的优先顺序，order 越小优先级越高。
• SpringMVC 会按视图解析器顺序的优先顺序对逻辑视图名进行解析，直到解析成功并返回视图对象，否则将抛出 ServletException 异常

### InternalResourceViewResolver
JSP 是最常见的视图技术，可以使用InternalResourceViewResolver 作为视图解析器：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210104102416.png" width="700px"/>

若项目中使用了 JSTL，则 SpringMVC 会自动把视图由InternalResourceView 转为 JstlView
• 若使用 JSTL 的fmt标签则需要在 SpringMVC 的配置文件中配置国际化资源文件
```xml
<bean id="messageSource" class="org.springframework.context.support.ResourceBundleMessageSource">
	<property name="basename" value="i18n"></property>
</bean>
```

若希望直接响应通过SpringMVC渲染的页面，可以使用 mvc:viewcontroller 标签实现; 即配置直接转发的页面，而不需要经过Handler的方法
```xml
<mvc:view-controller path="springmvc/testJstlView" view-name="success"/>
```

## 重定向与转发
一般情况下，控制器方法返回字符串类型的值会被当成逻辑视图名处理
• 如果返回的字符串中带 forward: 或 redirect: 前缀时，SpringMVC 会对他们进行特殊处理：将 forward: 和redirect: 当成指示符，其后的字符串作为 URL 来处理
– redirect:success.jsp：会完成一个到 success.jsp 的重定向的操作
– forward:success.jsp：会完成一个到 success.jsp 的转发操作， 等价于不加前缀

### 重定向与转发的区别
**请求转发(forward):**
serlvet原生语法: request对象.getRequestDispatcher(String path).forward(request,response);
特点:
- 浏览器地址栏路径没变,依然是AServlet的资源名称.
- 只发送了一个请求.
- 共享同一个请求,在请求中共享数据.
- **只能访问当前应用中的资源,不能跨域跳转.**
- 可以访问WEB-INF中的资源.

**转发（服务器行为）过程**：客户端浏览器发送http请求-->web服务器接收此请求后调用内部的方法在容器内部完成请求处理和转发动作-->将目标资源发生给客户。转发的路径必须是同一个web容器下的url，其不能转向到其他web路径上去，中间传递的是自己容器内的request。在客户端浏览器地址栏中的地址不会发生变化，显示的仍然是其第一次访问的路径。转发行为是浏览器只做了一次访问请求。（后端代码如：request.getRequestDispatcher("xxx.jsp").forward(request,response)）。

**URL重定向(redirect):**
servlet原生语法:response对象.sendRedirect(String path);
特点:
- 浏览器地址栏发生变化,变成BServlet的资源名称.
- 发送两个请求.
- 因为是不同的请求,所以不能共享请求中的数据.
- **可以跨域访问资源.**
- 不可以访问WEB-INF中的资源

**重定向（客户端行为）过程**：　客户端浏览器发送http请求-->web服务器接收后发送302状态码响应及对应新的地址给客户浏览器-->客户端浏览器发现是302响应，则自动再发送一个新的http请求，请求新的url地址-->服务器根据新的请求去寻找资源并发送给客户。这里的地址可以重定向到任意的url，既然是浏览器重新发送请求，则不存在request传递的概念。在客户端浏览器路径显示的是重定向后的路径，客户能观察到地址的变化。重定向行为是浏览器做了至少两次访问请求。（后端代码如：response.sendRedirect("xxx.jsp")）；

两者形象的示例：（假使你要去办理某个证照）
重定向：你先去了A局，A局的人说：“这个事情不归我们管，去B局”，然后你就从A局退出来，自己去了B局；
转发：你先去了A局，A局看了以后，知道这个事情其实是B局办理的，但B局的人没有把你退回来，而是让你休息等会，自己去联系了B局的人让他们办好了给你送过来。

**请求转发和重定向的选择?**
- 若需要共享请求中的数据,只能使用请求转发.
- 若需要访问WEB-INF中的资源,只能使用请求转发.
- 若需要跨域访问,只能使用URL重定向.
- 请求转发可能造成表单的重复提交问题.
- 其他时候,任选.

## 乱码问题
在web.xml中添加过滤器CharacterEncodingFilter
```xml
<filter>
	<filter-name>CharacterEncodingFilter</filter-name>
	<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
	<init-param>
		<param-name>encoding</param-name>
		<param-value>UTF-8</param-value>
	</init-param>
</filter>
<filter-mapping>
	<filter-name>CharacterEncodingFilter</filter-name>
	<url-pattern>/*</url-pattern>
</filter-mapping>
```
注：CharacterEncodingFilter的拦截顺序必须要放在所有拦截器的第一个，否则还是会出现乱码问题。这是因为
request对象的parameter并不是一开始就解析的，它是等你第一次调用getParameter*等凡和获得请求参数有关的方法的时候才解析的
paramter一旦被解析过一次，那就不会再次被解	析
所以如果在CharacterEncodingFilter之前有另外一个filter，而这个filter调用了getParameter*方法，那么就有可能使用错误的encoding来解析，从而造成乱码问题。

# 加载静态资源
优雅的 REST 风格的资源URL 不希望带 .html 或 .do 等后缀
若将 DispatcherServlet 请求映射配置为 /，则 Spring MVC 将捕获WEB 容器的所有请求，包括静态资源的请求， SpringMVC 会将他们当成一个普通请求处理，因找不到对应处理器将导致错误。
可以在 SpringMVC 的配置文件中配置 `<mvc:default-servlethandler/>` 的方式解决静态资源的问题：
– `<mvc:default-servlet-handler/>` 将在 SpringMVC 上下文中定义一个DefaultServletHttpRequestHandler，它会对进入 DispatcherServlet 的请求进行筛查，如果发现是没有经过映射的请求，就将该请求交由 WEB应用服务器默认的 Servlet 处理，如果不是静态资源的请求，才由DispatcherServlet 继续处理
– 一般 WEB 应用服务器默认的 Servlet 的名称都是 default。若所使用的WEB 服务器的默认 Servlet 名称不是 default，则需要通过 defaultservlet-name 属性显式指定

注：使用`<mvc: default-servlet-handler/>`需要开启mvc驱动`<mvc: annotation-driven />`

**注：WEB-INF下的静态资源是不能通过url来访问的**，原因如下
由于WEB-INF目录下资源文件安全性都是很高的。它是不能直接通过浏览器来访问。
只能通过服务器来访问------所以WEB-INF目录下一般存放的是lib文件夹（项目需要用到的jar包），服务器的配置文件web.xml，以及一些访问安全性较高的jsp/html页面（通常是后台管理页面）。
如果要访问WEB-INF下的jsp/html页面，只能通过请求转发（经过控制层）来访问。
所以即使做了静态资源放行的配置，通过浏览器访问WEB-INF下的静态资源还是会报404。

# 自定义参数转换规则
## 处理器获取参数逻辑
当一个请求到来时，在处理器执行的过程中，它首先会从HTTP请求和上下文环境来得到参数，如果是简易的参数它会以简单的转换器进行转换，而这些简单的转换器是SpringMVC自身已经提供了的。但是如果转换HTTP请求体（Body），它就会调用`HttpMessageConverter`接口的方法对请求体的信息进行转换，首先它会判断能否对请求体进行转换，如果可以就会将其转换为Java类型。

HttpMessageConverter接口源码
```java
package org.springframework.http.converter;

public interface HttpMessageConverter<T> {
    //是否可读，其中clazz为Java类型，mediaType为http请求类型
    boolean canRead(Class<?> var1, @Nullable MediaType var2);
    
	//判断clazz类型是否能够转换为mediaType媒体类型
    boolean canWrite(Class<?> var1, @Nullable MediaType var2);
	
    //可支持的媒体类型列表
    List<MediaType> getSupportedMediaTypes();

    //当canRead()验证通过后，读入http请求信息
    T read(Class<? extends T> var1, HttpInputMessage var2) throws IOException, HttpMessageNotReadableException;
    
	//当canWrite()方法验证通过后，写入响应
    void write(T var1, @Nullable MediaType var2, HttpOutputMessage var3) throws IOException, HttpMessageNotWritableException;
}
```
上面的HttpMessageConverter接口只是将HTTP请求体转换为对应的Java对象，而对于HTTP参数和其他内容，还没有讨论。例如，以性别参数来说，前端可能传递给控制器的是一个整数，而控制器参数却是一个枚举，这样就需要提供自定义的参数转换规则。

在SpringMVC中，是通过WebDataBinder机制来获取参数的，它的主要作用是解析http请求的上下文，然后再控制器的调用之前转换参数并且提供验证的功能，为调用控制器的方法做准备。处理器会从HTTP请求中读取数据，然后通过三种接口来进行各类参数转换，者三种接口是Converter，Fomatter，GenericConverter。在SpringMVC的机制中这三种接口的实现类都采用了注册机的机制，默认的情况下SpringMVC已经在注册机内注册了许多的转换器，这样就可以实现大部分的数据类型的转换，所以在大部分的情况下下无需开发者再提供转换器。当下需要自定义转换规则时，只需要在注册机上注册自己的转换器就可以了。

实际上，WebDataBinder机制还有一个重要的功能，那就是验证转换结果。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210625154810.png" width="500px"/>

可以看到控制器的参数是处理器通过Converter、Formatter和GenericConverter这三个接口转换出来的。

- Converter：普通的转换器，例如有一个Integer类型的控制器参数，而从HTTP对应的为字符串，对应的Convert就会将字符串转换为Integer类型。
- Formatter：格式化转换器，类似日期字符串就是通过它按照约定的格式转换为日期。
- GenericConverter：将HTTP参数转换为数组。

## 转换器注册
对于数据类型转换，SpringMVC提供了一个服务机制去管理，它就是ConversionService接口。在默认情况下下，会使用这个接口的子类DefaultFormattingConversionService对象来管理这些转换器类。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210625154851.png" width="500px"/>

可以看出，Converter、Formatter和GenericConverter可以通过注册机接口进行注册，这样处理器就可以获取对应的转换器来实现参数的转换。

上面讨论的是普通的SpringMVC的参数转换规则，而在spring boot中还提供了特殊的机制来管理这些转换器。Spring Boot的自动配置类WebMvcAutoConfiguration还定义了一个内部类WebMvcAutoConfigurationAdapter，代码如下

```java
      public void addFormatters(FormatterRegistry registry) {
            
            //在IoC容器中获取Converter类型的Bean，然后获得迭代器
            Iterator var2 = this.getBeansOfType(Converter.class).iterator();
			//遍历迭代器，然后注册到服务类中
            while(var2.hasNext()) {
                Converter<?, ?> converter = (Converter)var2.next();
                registry.addConverter(converter);
            }
			
            //在IoC容器中获取GenericConverter类型的Bean，然后获得迭代器
            var2 = this.getBeansOfType(GenericConverter.class).iterator();
			//遍历迭代器，然后注册到服务类中
            while(var2.hasNext()) {
                GenericConverter converter = (GenericConverter)var2.next();
                registry.addConverter(converter);
            }
			
            //在IoC容器中获取Formatter类型的Bean，然后获得迭代器
            var2 = this.getBeansOfType(Formatter.class).iterator();
			//遍历迭代器，然后注册到服务类中
            while(var2.hasNext()) {
                Formatter<?> formatter = (Formatter)var2.next();
                registry.addFormatter(formatter);
            }

        }
```
可以看到，在spring boot的初始化中，会将对应用户自定义的Convert、Formatter和GenericConverter的实现类所传就的spring bean自动地注册到DefaultFormattingConversionService对象中。这样对于开发者，只需要自定义Convert、Formatter和GenericConverter的接口Bean，spring boot就通过这个方法将它们注册到ConversionService对象中。其中，格式化Formatter接口在实际开发中使用率较低。

## 一对一转换器（Converter）
Converter是一对一转换器，也就是从一种类型转换为另外一种类型，其接口定义十分简单。如下

Converter接口源码
```java
package org.springframework.core.convert.converter;

import org.springframework.lang.Nullable;

@FunctionalInterface
public interface Converter<S, T> {
    
    //转换方法，S代表原类型，T代表目标类型
    @Nullable
    T convert(S var1);
}
```
这个接口类型有原类型（S）和目标类型（T）两种，它们通过convert方法进行转换。

例如，http的类型为字符串（String）型，而控制器参数为Long型，那么就可以通过Spring内部提供的StringToNumber进行转换。

示例：假设前端要传递一个用户信息，这个用户信息的格式是{id}-{personName}-{note}，而控制器的参数是Person对象。这里需要一个从String转换为Person的转换器。
```java
package com.lay.mvc.converter;

import com.lay.mvc.entity.Person;
import org.springframework.core.convert.converter.Converter;

@Component
public class StringToPersonConverter implements Converter<String, Person> {
    //转换方法
    @Override
    public Person convert(String s) {
        Person person=new Person();
        String[] strArr=s.split("-");
        Long id=Long.parseLong(strArr[0]);
        String personName=strArr[1];
        String note=strArr[2];
        person.setId(id);
        person.setPersonName(personName);
        person.setNote(note);
        return person;
    }
}
```

这里类标注了注解@Component，并且实现了Converter接口，这样Spring就会将这个类扫描并且装配到IoC容器中。

控制器验证
```java
   @GetMapping("/converter")
    @ResponseBody
    public Person getPersonByConverter(Person person){
        return person;
    }
```

## GenericConverter集合和数组转换
GenericConverter是数组转换器。因为SpringMVC自身提供了一些数组转换器，需要自定义的并不多，所以这里只介绍SpringMVC自定义的数组转换器。

假设需要同时新增多个用户，这样便需要传递一个用户列表（List）给控制器。此时SpringMVC会使用StringToCellectionConverter转换它，这个类实现了GenericConverter接口，并且是SpringMVC内部已经注册的数据转换器。它首先会把字符串用逗号分隔称为一个个的子字符串，然后根据原类型为String，目标类型泛型为Person类，找到对应的Converter进行转换，将字符串转换为Person对象。
```java
    @GetMapping("/converterList")
    @ResponseBody
    public List<Person> personList(List<Person> personList){
        return personList;
    }
```
这里参数使用了一个个逗号分隔，StringToCollectionConverter在处理时就通过逗号分隔，然后通过之前自定义的转换器StringToPerson将其变为用户对象，在组成一个列表List传递给控制器。

# 拦截器
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210108154156.png" width="700px"/>

Spring MVC也可以使用拦截器对请求进行拦截处理，用户可以自定义拦截器来实现特定的功能，自定义的拦截器必须实现HandlerInterceptor接口
– preHandle()：这个方法在业务处理器处理请求之前被调用，在该方法中对用户请求 request 进行处理。如果程序员决定该拦截器对请求进行拦截处理后还要调用其他的拦截器，或者是业务处理器去进行处理，则返回true；如果程序员决定不需要再调用其他的组件去处理请求，则返回false。
– postHandle()：这个方法在业务处理器处理完请求后，但是DispatcherServlet 向客户端返回响应前被调用，在该方法中对用户请求request进行处理。
– afterCompletion()：这个方法在 DispatcherServlet 完全处理完请求后被调用，可以在该方法中进行一些资源清理的操作。

实例：
配置拦截器
```xml
<mvc:interceptors>
	<!-- 默认拦截所有请求 -->
	<bean class="com.atguigu.interceptor.FirstInterceptor"></bean>

	<!-- 设置自定义拦截方式 -->
	<mvc:interceptor>
		<bean class="com.atguigu.interceptor.FirstInterceptor1"></bean>
		<mvc:mapping path="test"/>
		<mvc:exclude-mapping path="test1"/>
	</mvc:interceptor>
</mvc:interceptors>
```
```java
public class FirstInterceptor implements HandlerInterceptor{
	...
}
```

当有多个拦截器时： 
preHandle: 按照拦截器数组的正向顺序执行
postHandle: 按照拦截器的反向顺序执行
afterCompletion: 按照拦截器数组的反向顺序执行

当多个拦截器的preHandle有不同值时
1. 第一个返回false, 第二个返回false： 只有第一个preHandle会执行
2. 第一个返回true， 第二个返回false： 两个拦截器的preHandle都会执行，但两个拦截器的postHandle都不会执行，而afterCompletion只有第一个执行(返回false的拦截器之前的所有afterCompletion)
3. 第一个返回false, 第二个返回true：只有第一个的preHandle会执行

# 异常处理
Spring MVC 通过 HandlerExceptionResolver 处理程序的异常，包括 Handler 映射、数据绑定以及目标方法执行时发生的异常。
SpringMVC 提供的 HandlerExceptionResolver 的实现类
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210108213449.png" width="700px"/>


## SimpleMappingExceptionResolver
如果希望对所有异常进行统一处理，可以使用SimpleMappingExceptionResolver，它将异常类名映射为视图名，即发生异常时使用对应的视图报告异常
```xml
<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
	<property name="exceptionMappings">
		<props>
		<!-- 其中error为视图名称， 当发生NullPointerException异常时，跳转到视图名称为error的页面 -->
		 <prop key="java.lang.NullPointerException">error</prop>
		</props>
	</property>
</bean>
```

# spring与sringmvc整合
如果不使用spring, 而全部使用springmvc, 虽然springmvc能实现spring所有功能， 但是这样的话，需要将spring所管理的内容都交给springmvc管理，这样会造成逻辑混乱。

如果即使用spring也是用springmvc, 那spring的配置文件应该什么时候加载？怎样加载？
spring配置文件加载一定要在springmvc配置文件加载之前，因为， springmvc配置文件扫描控制层组件@Controller时，遇到自动装配时， 可能涉及到dao等层对象， 而这些层对象在spring配置文件加载后才创建，所以如果springmvc配置文件扫描在spring之前， 由于springmvc扫描组件，自动装配时，由于dao等层对象还没创建，所以会报错。
springmvc配置文件是在DispatcherServlet被加载时，被加载， 所以spring配置文件的加载一定要在servlet加载之前，在servlet加载之前的有过滤器，监听器等， 我们不能在加载过滤器时加载spring配置文件，因为每收到一个请求，过滤器就会加载一次，所以如果把spring配置文件加载时机放在过滤器加载中，则会导致spring配置文件加载多次，从而导致创建多个bean对象。
我们可以把spring配置文件加载放在监听器中， 其实spring已经为我们想好了，我们可以创建一个ContextLoaderListener监听器，这个监听器加载的时候，会自动加载spring配置文件。
注spring配置文件的默认位置是在WEB-INF下的applicationContext.xml;  我们可以在使用`<context-param>`来修改； 具体web.xml配置如下：
```xml
<!-- <context-param>执行在<listener>之前 -->
<!-- 修改spring配置文件为source目录下的spring.xml -->
<context-param>
	<param-name>contextConfigLocation</param-name>
	<param-value>classpath:spring.xml</param-value>
</context-param>

<listener>
	<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>

```

一定要防止bean被创建两次，即一个bean对象在spring配置文件扫描组件时创建了，又在springmvc配置文件扫描组件时创建了。 即Spring 的 IOC 容器不应该扫描 SpringMVC 中的 bean, 对应的SpringMVC 的 IOC 容器不应该扫描 Spring 中的 bean。我们可以使用`<context:exclude-filter>`标签
springmvc配置文件
```xml
<context:component-scan base-package="com.ssm.user" use-default-filters="false">
	<context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
```
以上配置指示扫描器单单扫描context:include-filter指定的类即@Controller注解指定的类，因为已经指定use-default-filters="false"不使用默认的filters，默认filters为全部的注解包括了@Controller、@Service等，所以默认情况下只要没有显示指定为不使用默认的filers.context:component-scan base-package指定的扫描器都会对相应的注解进行扫描。因此可以说use-default-filters="false"属性是专门和context:include-filter子标签一起使用，这样可以更加自由地指定哪些注解由扫描器扫描。其意思相当于：只扫描@xxx注解的标志的类。
相应地在spring配置文件内，配置包扫描时则是
```xml
<context:component-scan base-package="com.ssm.user">
		<context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
```
指定不扫描哪些注解标识的类，此时不用再使用use-default-filters指定，以为该属性默认为true，即该扫描器相关的注解@Controller、@Service等标识的类都会被扫描到，所以不用显示指定，只需使用子标签context:exclude-filter指定不扫描哪些注解标识的类即可。
总的来说就是属性use-default-filters="false"和context:include-filter子标签一起使用，其意为：只扫描指定注解的类。子标签context:exclude-filter直接使用，其意为不扫描指定注解标识的类，其他相关注解标识类全部扫描。

## spring和springmvc容器的关系
spring和springmvc容器的关系: spring是父容器， springmvc是子容器。 
规定： 子容器能够调用访问父容器中的bean, 而父容器不能够调用子容器中的bean

# @MatrixVariable
RFC3986定义URI的路径(Path)中可包含name-value片段，扩充了以往仅能通过查询字符串(Query String)设置可选参数的囧境。
假如现在需要设计一个用于“搜索某部门某些员工可选信息中的部分信息”的API，我们分别使用查询字符串和路径name-value方式来设计对比，看看具体效果：

查询字符串方式：`/api/v1/users/optional-info?dept=321&name=joh*&fields=hometown,birth`
问题：其中的dept和name理应属于users路径，而fields则属于optional-info路径，但现在全部都要挤在查询字符串中。
路径name-value方式：`/api/v1/users/depts=321;name=joh*/optional-fields/fields=hometown,birth`
可以看出路径name-value的方式逻辑上更在理些。

**@MatrixVariable注解属性说明**
在正式开始前我们先死记硬背一下注解的属性吧。
- `pathVar`： 用于指定name-value参数所在的路径片段名称
- `name`： 用于指定name-value参数的参数名
- `required`： 是否为必填值，默认为false
- `defaultValue`	： 设置默认值

**启用@MatrixVariable**
虽然从Spring 3.2就已经支持@MatrixVariable特性，但直至现在其依然为默认禁用的状态。我们需要手工配置开启才能使用。
```java
@Configuration                                              
public class SpringBootConfig implements WebMvcConfigurer { 
   @Override
   public void configurePathMatch(PathMatchConfigurer configurer) {
      UrlPathHelper urlPathHelper = new UrlPathHelper();
      urlPathHelper.setRemoveSemicolonContent(false); 
      configurer.setUrlPathHelper(urlPathHelper); 
	 }
} 
```

**参数仅有一个值的玩法**
注意：多个name-value间以分号分隔，如name=joh*;dept=321。
```java
/* 
 1. 获取单个路径片段中的参数
 请求URI为 /Demo2/66;color=red;year=2020
*/  
@RequestMapping(path="/Demo1/{id}", method=RequestMethod.GET)
public String test1(@PathVariable String id, @MatrixVariable String color, @MatrixVariable String year){}

/*              
 2. 获取单个路径片段中的参数
 请求URI为 /Demo2/color=red;year=2020
*/
@RequestMapping(path="/Demo1/{id}", method=RequestMethod.GET) 
public String test2(@MatrixVariable String color, @MatrixVariable String year){} 
/* 
 3. 获取不同路径片段中的参数 
 请求URI为 /Demo2/66;color=red;year=2020/pets/77;color=blue;year=2019 
*/  
@RequestMapping(path="/Demo2/{id1}/pets/{id2}", method=RequestMethod.GET)
public String test3(@PathVariable String id1, @PathVariable String id2,
  @MatrixVariable(name="color", pathVar="id1") String color1, @MatrixVariable(name="year", pathVar="id1") String year1,
  @MatrixVariable(name="color", pathVar="id2") String color2, @MatrixVariable(name="year", pathVar="id2") String year2){}

/*   
 4. 获取不同路径片段中的参数 
 请求URI为 /Demo2/color=red;year=2020/pets/77;color=blue;year=2019
*/ 
@RequestMapping(path="/Demo2/{id1}/pets/{id2}", method=RequestMethod.GET)
public String test4(@PathVariable String id2, 
  @MatrixVariable(name="color", pathVar="id1") String color1, @MatrixVariable(name="year", pathVar="id1") String year1,
  @MatrixVariable(name="color", pathVar="id2") String color2, @MatrixVariable(name="year", pathVar="id2") String year2){}
/*       
 5. 通过Map获取所有或指定路径下的所有参数 
*/              
@RequestMapping(path="/Demo3/{id1}/pets/{id2}", method=RequestMethod.GET) 
public String test5(@MatrixVariable Map<String, Object> all, @MatrixVariable(pathVar="id1") Map<String, Object> mapId1) {}
```

**参数有多个值的玩法**
若参数值不是单个，那么可以通过两种方式传递：
- 值之间通过逗号分隔，如dept=321,123
- 重名name-value对，如dept=321;dept=123
```java
/* 
 请求为/Demo1/color=123,321
 那么color值为123,321
*/ 
@RequestMapping(path="/Demo1/{id}", method=RequestMethod.GET) 
public String test1(@MatrixVariable Integer[] color){} 
/*  
 请求为/Demo1/color=123;color=321 
 那么color值为123,321 
*/   
@RequestMapping(path="/Demo1/{id}", method=RequestMethod.GET)
public String test1(@MatrixVariable Integer[] color){}
```

**那些要注意的坑**
在参数多值的情况下还有如下3个坑，请各位多加注意：
- String参数类型可以接受通过逗号和通过重名name-value传递的所有值，而其它类型只能获取第一个值。
```java
/*
 请求为/Demo1/color=123,321
 那么color值为123,321
*/  
@RequestMapping(path="/Demo1/{id}", method=RequestMethod.GET)
public String test1(@MatrixVariable String color){

/*    
 请求为/Demo1/color=123;color=321 
 那么color值为123,321 
*/  
@RequestMapping(path="/Demo1/{id}", method=RequestMethod.GET)
public String test1(@MatrixVariable String color){}

/* 
 请求为/Demo1/color=123;color=321 
 那么color值为123
*/ 
@RequestMapping(path="/Demo1/{id}", method=RequestMethod.GET)
public String test1(@MatrixVariable Integer color){} 
```

- Map<String, Object[]>只能获取参数中的第一个值而已。
```java
/*
 请求为/Demo1/color=123,321
 那么color值为123 
*/  
@RequestMapping(path="/Demo1/{id}", method=RequestMethod.GET)
public String test1(@MatrixVariable Map<String, Integer[]> color){} 
```

- 不同路径片段中出现名称相同的参数，那么必须通过pathVar标识所有相同参数所属路径，否则URI匹配失败。
```java
// 以下handler仅标识第二个参数的pathVar，而没有标识第一个，那么也是会匹配失败的。
@RequestMapping(path="/Demo2/{id1}/pets/{id2}", method=RequestMethod.GET)
public String test2(@MatrixVariable String color, @MatrixVariable(name="color", pathVar="id2") String color2){}
```

# @ControllerAdvice注解
@ControllerAdvice，是Spring3.2提供的新注解,它是一个Controller增强器,可对controller中被 @RequestMapping注解的方法加一些逻辑处理。主要作用有一下三种
- 通过@ControllerAdvice注解可以将对于控制器的全局配置放在同一个位置。
- 注解了@ControllerAdvice的类的方法可以使用@ExceptionHandler、@InitBinder、@ModelAttribute注解到方法上。
  - @ExceptionHandler：用于全局处理控制器里的异常，进行全局异常处理
  - @InitBinder：用来设置WebDataBinder，用于自动绑定前台请求参数到Model中，全局数据预处理。
  - @ModelAttribute：本来作用是绑定键值对到Model中，此处让全局的@RequestMapping都能获得在此处设置的键值对 ，全局数据绑定。
- @ControllerAdvice注解将作用在所有注解了@RequestMapping的控制器的方法上。

## 全局异常处理：
需要配合@ExceptionHandler使用。
当将异常抛到controller时,可以对异常进行统一处理,规定返回的json格式或是跳转到一个错误页面
```java
/**
 * @ClassName:CustomExceptionHandler
 * @Description: 全局异常捕获
 * @Author: 
 * @Date: 2020/5/25、13:38
 */
@Slf4j
@RestControllerAdvice //等于@ControllerAdvice与@ResponseBody
public class WebControllerAdvice {
    @ResponseBody
    @ExceptionHandler
    public Map errorHandler(Exception ex) {
        Map errorMap = new HashMap();
        errorMap.put("code", 400);
        //判断异常的类型,返回不一样的返回值
        if (ex instanceof MissingServletRequestParameterException) {
            errorMap.put("msg", "缺少必需参数：" + ((MissingServletRequestParameterException) ex).getParameterName());
        } else if (ex instanceof MyException) {
            errorMap.put("msg", "这是自定义异常");
        }
        return errorMap;
    }
```
自定义异常
```java
/**
 * @ClassName:MyException
 * @Description: 定义异常
 * @Author: 
 * @Date: 2020/5/25、13:44
 */
public class MyException extends RuntimeException {
    private long code;
    private String msg;

    public MyException(Long code, String msg) {
        super(msg);
        this.code = code;
        this.msg = msg;
    }
    public MyException(String msg) {
        super(msg);
        this.msg = msg;
    }
}
```
测试Controller
```java
@RestController
public class TestController {
    @RequestMapping("testException")
    public String testException() throws Exception{
        throw new MissingServletRequestParameterException("name","String");
    }

    @RequestMapping("testMyException")
    public String testMyException() throws MyException{
        throw new MyException("i am a myException");
    }
```
测试结果：
```
{"msg":"缺少必需参数：name","code":400}
{"msg":"这是自定义异常","code":400}
```
## 全局数据绑定
全局数据绑定功能可以用来做一些初始化的数据操作，我们可以将一些公共的数据定义在添加了 @ControllerAdvice 注解的类中，这样，在每一个 Controller 的接口中，就都能够访问导致这些数据。使用步骤，首先定义全局数据，如下：
```java
/**
 * @ClassName:MyGlobalDataHandler
 * @Description: 全局数据
 * @Author: 
 * @Date: 2020/5/25、14:01
 */
@ControllerAdvice
public class MyGlobalDataHandler {
    @ModelAttribute(name = "md")
    public Map<String,Object> getGlobalData(){
        HashMap<String, Object> map = new HashMap<>();
        map.put("age", 99);
        map.put("gender", "男");
        return map;
    }
```
使用 @ModelAttribute 注解标记该方法的返回数据是一个全局数据，默认情况下，这个全局数据的 key 就是返回的变量名，value 就是方法返回值，当然开发者可以通过 @ModelAttribute 注解的 name 属性去重新指定 key。定义完成后，在任何一个Controller 的接口中，都可以获取到这里定义的数据：
```java
    @GetMapping("/hello")
    public String hello(Model model) {
        Map<String, Object> map = model.asMap();
        System.out.println(map);
        int i = 1 / 0;
        return "hello controller advice";
    }
```
运行结果
```
{md={gender=男, age=99}}
2020-05-25 14:04:44.388 - [WARN ] - [org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver:logException:197] - Resolved [java.lang.ArithmeticException: / by zero] 
```
## 全局数据预处理
考虑我有两个实体类，Book 和 Author，分别定义如下：
```java
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Book extends BaseEntity {
    private String name;
    private Long price;
}
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Author  extends BaseEntity {
    private String name;
    private Long price;
}
```
如果我定义一个数据添加接口，如下：
```java
@PostMapping("/book")
public void addBook(Book book, Author author) {
    System.out.println(book);
    System.out.println(author);
}
```
这个时候，添加操作就会有问题，因为两个实体类都有一个 name 属性，从前端传递时 ，无法区分。此时，通过 @ControllerAdvice 的全局数据预处理可以解决这个问题
解决步骤如下:
1. 给接口中的变量取别名:
```java
@PostMapping("/book")
public void addBook(@ModelAttribute("b") Book book, @ModelAttribute("a") Author author) {
    System.out.println(book);
    System.out.println(author);
}
```
2. 进行请求数据预处理
在 @ControllerAdvice 标记的类中添加如下代码:
```java
@InitBinder("b")
public void b(WebDataBinder binder) {
    binder.setFieldDefaultPrefix("b.");
}
@InitBinder("a")
public void a(WebDataBinder binder) {
    binder.setFieldDefaultPrefix("a.");
}
```
`@InitBinder("b")`注解表示该方法用来处理和Book和相关的参数,在方法中,给参数添加一个b前缀,即请求参数要有b前缀.
3. 发送请求
请求发送时,通过给不同对象的参数添加不同的前缀,可以实现参数的区分.
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210423220158.png" width="700px"/>

# springmvc请求处理源码
要想分析springmvc源码，得先从最原始方式来创建Controller类，如下：
```java
public class HelloController implements Controller{
	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception{
		ModelAndView mv = new ModelAndView();
		mv.setViewName("success");
		mv.addObject("hello", "whz");
		return mv;
	}
}
```
web.xml
```xml
<servlet>
	<servlet-name>springDespatcherServlet</servlet-name>
	<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
	<init-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>classpath:springmvc.xml</param-value>
	</init-param>
	<load-on-startup>1</load-on-startup>
</serlvet>

<servlet-mapping>
	<servlet-name>springDispatcherServlet</servlet-name>
	<url-pattern>/</url-pattern>
</servlet-mapping>
```

springmvc.xml
```xml
<!--
	 声明处理器映射器
	 目的：选择哪一个处理器来处理当前请求
 -->
<bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"></bean>

<!-- 
	声明处理器适配器
	目的：调用处理器的处理请求的方法
 -->
<bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"></bean>

<!-- 
	配置视图解析器
	目的：处理视图信息
 -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
	<property name="prefix" value="/WEB-INF/views/"></property>
	<property name="suffix" value=".jsp"></property>
</bean>

<!-- 声明处理器 -->
<bean name="/helloworld" class="com.baiqi.springmvc.HelloController"></bean>
```

流程图：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210505114347.png" width="700px"/>
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210505114327.png" width="700px"/>
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210505114410.png" width="700px"/>

**其中上述流程图关键方法位于doDispatch方法**
```java
  protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null; // 处理器(Controller)执行链
    boolean multipartRequestParsed = false;
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

    try {
      try {
        ModelAndView mv = null;
        Object dispatchException = null;

        try {

					//检查是否为文件上传请求
          processedRequest = this.checkMultipart(request);
          multipartRequestParsed = processedRequest != request;

					//获取处理当前请求的处理器执行链
          mappedHandler = this.getHandler(processedRequest);

					//如果处理器执行链为null， 则表明没有Controller能处理当前请求，则会抛异常
          if (mappedHandler == null) {
            this.noHandlerFound(processedRequest, response);
            return;
          }

					//拿到能执行 处理器中的所有方法 的适配器， 可把这个适配器看成反射工具，通过这个反射工具就可以执行处理器Controller中的所有方法
          HandlerAdapter ha = this.getHandlerAdapter(mappedHandler.getHandler());

					//获取当前请求的请求方式
          String method = request.getMethod();
          boolean isGet = "GET".equals(method);
          if (isGet || "HEAD".equals(method)) {
            long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
            if ((new ServletWebRequest(request, response)).checkNotModified(lastModified) && isGet) {
              return;
            }
          }

          if (!mappedHandler.applyPreHandle(processedRequest, response)) {
            return;
          }

					//通过处理器适配器来调用处理器Controller中的方法
					//将执行Controller中的方法后的返回值作为mv的view属性值，即作为视图名
					//所以可以看出，无论Controller中的方法的返回值是什么，最终适配器调用该方法完后，都会将执行完后的信息封装成ModelAndView对象
          mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

          if (asyncManager.isConcurrentHandlingStarted()) {
            return;
          }

					//如果mv中的view属性为空，即视图名为空，则设置默认的视图名
          this.applyDefaultViewName(processedRequest, mv);

          mappedHandler.applyPostHandle(processedRequest, response, mv);

        } catch (Exception var20) {
          dispatchException = var20;
        } catch (Throwable var21) {
          dispatchException = new NestedServletException("Handler dispatch failed", var21);
        }

				//根据获得到的ModelAndView, 跳转到目标页面，而且ModelAndView中的数据可以从请求域中获取
        this.processDispatchResult(processedRequest, response, mappedHandler, mv, (Exception)dispatchException);
      } catch (Exception var22) {
        this.triggerAfterCompletion(processedRequest, response, mappedHandler, var22);
      } catch (Throwable var23) {
        this.triggerAfterCompletion(processedRequest, response, mappedHandler, new NestedServletException("Handler processing failed", var23));
      }

    } finally {
      if (asyncManager.isConcurrentHandlingStarted()) {
        if (mappedHandler != null) {
          mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
        }
      } else if (multipartRequestParsed) {
        this.cleanupMultipart(processedRequest);
      }

    }
  }

```
doDispatch()方法核心过程如下：
1. 通过getHandler()来获取处理当前请求的处理器执行链
2. 如果处理器执行链为null， 则表明没有Controller能处理当前请求，则会抛异常
3. 通过getHandlerAdapter()拿到能执行 处理器中的所有方法 的适配器， 可把这个适配器看成反射工具，通过这个反射工具就可以执行处理器Controller中的所有方法
4. 通过处理器适配器来调用处理器Controller中的方法， 且获取ModelAndView对象
5. 根据获得到的ModelAndView, 跳转到目标页面，而且ModelAndView中的数据可以从请求域中获取

## getHandler()细节
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210505120108.png" width="700px"/>

## getHandlerAdater()细节
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210505132457.png" width="700px"/>

## springmvc中的九大组件
springmvc中的九大组件指的是DispatcherServlet类中的9个属性，如下：
```java
//文件上传解析器
private MultipartResolver multipartResolver;

//区域信息解析器，跟国际化有关
private LocaleResolver localeResolver;

//主题解析器，用来主题效果更换
private ThemeResolver themeResolver;

//处理器映射器
private List<HandlerMapping> handlerMappings;

//处理器适配器
private List<HandlerAdapter> handlerAdapters;

//异常处理解析器
private List<HandlerExceptionResolver> handlerExceptionResolvers;

private RequestToViewNameTranslator viewNameTranslator;

//实现springmvc中允许重定向携带数据的功能
private FlashMapManager flashMapManager;

//视图解析器
private List<ViewResolver> viewResolvers;
```
springmvc在工作的时候，关键功能都是由这些组件完成的；
共同点：九大组件全部都是接口，接口就是规范，提供了强大的扩展性；

### 九大组件初始化
DispatcherServlet类中的initStrategies()方法用来初始化九大组件
```java
protected void initStrategies(ApplicationContext context) {
	this.initMultipartResolver(context);
	this.initLocaleResolver(context);
	this.initThemeResolver(context);
	this.initHandlerMappings(context);
	this.initHandlerAdapters(context);
	this.initHandlerExceptionResolvers(context);
	this.initRequestToViewNameTranslator(context);
	this.initViewResolvers(context);
	this.initFlashMapManager(context);
}
```