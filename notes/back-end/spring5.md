![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124021.png)

# 课程内容介绍
1. Spring框架概述
2. IOC容器
（1）IOC底层原理
（2）IOC接口（BeanFactory）
（3）IOC操作Bean管理（基于xml）
（4）IOC操作Bean管理（基于注解）
3. Aop
4. JdbcTemplate
5. 事务管理
6. Spring5新特性

# spring5框架概述
1. Spring是轻量级的开源的JavaEE框架
2. Spring可以解决企业应用开发的复杂性
3. Spring有两个核心部分：IOC和Aop
 （1）IOC (inversion of control)：控制反转，把创建对象过程交给Spring进行管理
 （2）Aop (aspect oriented programming)：面向切面，不修改源代码进行功能增强
4. Spring特点
（1）方便解耦，简化开发
（2）Aop编程支持
（3）方便程序测试
（4）方便和其他框架进行整合
（5）方便进行事务操作
（6）降低API开发难度


![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124034.png)

# spring入门案例
1. 创建一个普通类
```java
public class User {
	public void add(){
		System.out.println("add.....");
	}
}
```
2. 创建spring配置文件，在配置文件中配置创建的对象
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	   xsi:schemaLocation="http://www.springframework.org/schema/beans
						   http://www.springframework.org/schema/beans/spring-beans.xsd">
<!--配置 User 对象创建-->
	<bean id="user" class="com.atguigu.spring5.User"></bean>
</beans>
```

3. 运行测试代码编写
```java
@Test
public void testdemo(){
	// loading the spring configuration
	ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beam1.xml");

	// get the objection created by the spring
	User user = applicationContext.getBean("user", User.class);
	user.add();
}
```

# IOC 概念和原理
1. 什么是 IOC
（1）控制反转，把对象创建和对象之间的调用过程，交给 Spring 进行管理
（2）使用 IOC 目的：为了耦合度降低
（3）以上的入门案例就是 IOC 实现
2. IOC 底层原理
（1）xml解析、工厂模式、反射

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124047.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124058.png)

# IOC 接口
1. IOC思想基于IOC容器完成， IOC容器底层就是对象工厂
2. Spring提供IOC容器实现两种方式：（两个接口）
（1）BeanFactory： IOC容器基本实现，是 Spring 内部的使用接口; 加载配置文件时候不会创建对象 ，在获取对象（使用）才去创建对象
```java
	BeanFactory applicationContext = new ClassPathXmlApplicationContext("beam1.xml");//此时不会创建对象
	User user = applicationContext.getBean("user", User.class);//此时才创建对象
```
（2）ApplicationContext： BeanFactory 接口的子接口，提供更多更强大的功能，默认情况下加载配置文件时候就会把在配置文件对象进行创建
```java
	ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beam1.xml");//此时创建对象
```
在实际开发中推荐是用ApplicationContext
3. ApplicationContext 接口有实现类

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124107.png)

# IOC操作bean管理
## 概念
1. 什么是Bean管理
Bean管理指的是两个操作
（1）Spring 创建对象
（2）Spirng 注入属性, 即给对象中的变量赋值
2. Bean 管理操作有两种方式
（1）基于 xml 配置文件方式实现
（2）基于注解方式实现

## 基于XML方式
### 基于 xml 方式创建对象
```xml
<bean id="user" class="com.atguigu.spring5.User"></bean>
```
（1）在 spring 配置文件中，使用 bean 标签，标签里面添加对应属性，就可以实现对象创建
（2）在 bean 标签有很多属性，介绍常用的属性
* id 属性：唯一标识
* class 属性：类全路径（包类路径）, 不能是接口的	
（3）创建对象时候，默认也是执行无参数构造方法完成对象创建, 若类中没有无参构造方法(每个类都会默认有一个无参构造，除非你重写了一个有参构造从而覆盖了无参构造)， 则会报如下错

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124118.png)

### 基于xml方式注入属性
DI: Dependence injection, 依赖注入, 就是注入属性
- 第一种注入方式，使用set方法进行注入
1. 创建类，定义属性和对应的set方法
```java
public class Book {
	//创建属性
	private String bname;
	private String bauthor;
	//创建属性对应的 set 方法
	public void setBname(String bname) {
	this.bname = bname;
	}
	public void setBauthor(String bauthor) {
	this.bauthor = bauthor;
	}
}
``` 	
2. 在 spring 配置文件配置对象创建，配置属性注入
```xml
<!--2 set 方法注入属性-->
<bean id="book" class="com.atguigu.spring5.Book">
	<!--使用 property 完成属性注入
		name：类里面属性名称
		value：向属性注入的值-->
	<property name="bname" value="易筋经"></property>
	<property name="bauthor" value="达摩老祖"></property>
</bean>
```

- set注入方法的简化: p名称空间注入 （了解即可）
1. 添加p名称空间在配置文件中

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124138.png)

2. 进行属性注入，在 bean 标签里面进行操作
```xml
<bean id="book" class="com.atguigu.spring5.Book" p:bname="九阳神功" p:bauthor="无名氏"></bean>
```

- 第二种注入方式， 使用有参构造进行注入
1. 创建类，定义属性，创建属性对应有参数构造方法
```java
public class Orders {
	//属性
	private String oname;
	private String address;
	//有参数构造
	public Orders(String oname,String address) {
		this.oname = oname;
		this.address = address;
	}
}
```
2. 在 spring 配置文件中进行配置
```xml
<!--3 有参数构造注入属性-->
<!-- 如果没有constructor-arg标签，则会默认调用无参构造来创建对象 -->
<bean id="orders" class="com.atguigu.spring5.Orders">
	<constructor-arg name="oname" value="电脑"></constructor-arg>
	<constructor-arg name="address" value="China"></constructor-arg>
</bean>
```

### 基于xml注入其他类型属性
1. 字面量
   - 将属性设置为null
   ```xml
   <property name="address">
	 <null/>
   </property>
   ```
   - 属性值中包含特殊符号
   ```xml
   <!-- 情况： 以下情况，编译器会把属性值中的<<>>当中xml标签， 所以会报错 -->
   <!-- 这种情况是xml文件的通病，解决方法都是一样的 -->
	<property name="address" value="<<南京>>">
	</property>

	<!-- 解决方法 -->
	<!-- 方法一：将<>特殊字符进行转移  <：&lt  >: &gt -->
	<property name="address" value="&lt&lt南京&gt&gt">
	</property>

	<!-- 方法二： 使用CDATA方法，将带符号内容写到CDATA, 这是xml自带的方法 -->
	<property name="address">
		<value><![CDATA[<<南京>>]]></value>
	</property>
   ```
2. 注入属性-外部bean与内部bean
内部bean与外部bean都是用于给属性为对象类型的值赋值的情况
```java
public class UserService {
	//创建 UserDao 类型属性，生成 set 方法
	private UserDao userDao;  //userDao类中的有一个userName属性
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}
	public void add() {
		System.out.println("service add...............");
		userDao.update();
	}
}
```
- 外部bean方式
```xml
<bean id="userService" class="com.atguigu.spring5.service.UserService">
	<!--注入 userDao 对象
		name 属性：类里面属性名称
		ref 属性：创建userDao对象bean标签id值
		正是因为使用了的ref来创建对象值，所以称为外部bean; 与内部bean相区分
	-->
	<property name="userDao" ref="userDao"></property>

</bean>
<bean id="userDao" class="com.atguigu.spring5.dao.UserDao">
	<property name="userName" value="zhangsan"></property>
</bean>
```
- 内部bean方式
```xml
<bean id="userService" class="com.atguigu.spring5.service.UserService">
	<property name="userDao">
		<bean id="userDao" class="com.atguigu.spring5.dao.UserDao"></bean>
	</property>

	<!-- 给userDao类中的userName赋值, 此时userService类中要有getUserDao()方法，否则会报错，因为底层会调用这个方法来得到userDao; 注：不是级联赋值的情况，不需要设置get方法-->
	<!-- 这个就是级联赋值，即给对象内的对象的属性赋值 -->
	<!-- 外部bean也是这样用的 -->
	<property name="userDao.userName" value="zhangsan"></property>
</bean>
```
 
 ### 基于xml注入集合属性
 ```java
public class Stu{
	private String[] courses;
	private List<String> list;
	private Map<String, String> maps;
	private Set<String> sets;
	/..set方法../
}
 ```
 ```xml
 <bean id="stu" class="com.atguigu.spring5.Stu">
	<property name="courses">
		<array>
			<value>java</value>	
			<value>bigData</value>	
		</array>
	</property>
	<property name="list">
		<list>
			<value>zhangsan</value>	
			<value>lishi</value>	
		</list>
	</property>
	<property name="maps">
		<map>
			<entry key="java" value="java"></entry>
			<entry key="php" value="php"></entry>
		</map>
	</property>
	<property name="sets">
		<set>
			<value>mysql</value>	
			<value>redis</value>	
		</set>
	</property>
</bean>
 ```
 - 在集合里面设置对象类型值
```java
public class Stu1{
	// 其中Course为一个类, 含有cname属性
	private List<Course> courseList; 
	/..set方法../
}
```
```xml
<property name="courseList">
	<list>
		<ref bean="course1"></ref>	
		<ref bean="course2"></ref>	
	</list>
</property>
<bean id="course1" class="com.atguigu.spring5.Course">
	<property name="cname" value="spring"></property>
</bean>
<bean id="course2" class="com.atguigu.spring5.Course">
	<property name="cname" value="mybatis"></property>
</bean>
```
- 把集合注入公共部分提取出来
先在 spring 配置文件中引入名称空间util

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124150.png)

然后使用 util 标签完成 list 集合注入提取
```xml
<!--1 提取 list 集合类型属性注入-->
<util:list id="bookList">
	<value>易筋经</value>
	<value>九阴真经</value>
	<value>九阳神功</value>
</util:list>

<!--2 提取 list 集合类型属性注入使用-->
<bean id="book" class="com.atguigu.spring5.collectiontype.Book">
	<property name="list" ref="bookList"></property>
</bean>
<bean id="book2" class="com.atguigu.spring5.collectiontype.Book">
	<property name="list" ref="bookList"></property>
</bean>
```

### FactoryBean
1. Spring 有两种类型 bean，一种普通bean，另外一种工厂bean（FactoryBean）
* 普通bean：在配置文件中定义 bean 类型就是返回类型, 上面的例子都是普通bean
* 工厂bean：在配置文件定义bean类型可以和返回类型不一样; 需要实现spring中自带的FactoryBean接口
2. 工程bean的实现
第一步 创建类，让这个类作为工厂bean，实现接口FactoryBean
第二步 实现接口里面的方法，在实现的方法中定义返回的bean类型
```java
public class MyBean implements FactoryBean<Course>{
	//定义返回bean的类型
	@Override
	public Course getObject() throws Exception{
		Course course = new Course();
		course.setCname("abc");
		return course;
	}
	@Override
	public Class<?> getObjectType(){
		return null;
	}
	@Override
	public boolean isSingleton(){
		return false;
	}
}
```
```xml
<bean id="myBean" class="com.atguigu.spring5.MyBean"></bean>
```
```java
@Test
public void test(){
	ApplicationContext context = new ClassPathXmlApplicationContext("bean3.xml");
	//虽然spring配置文件中的class是MyBean, 但是返回的是Course, 如果把下面的Course改成MyBean， 则会报Course无法转成MyBean的错误
	Course course = context.getBean("myBean", Course.class);
}
```

### bean作用域 
在 Spring 里面，设置创建bean实例有两种情况，分别是单实例与多实例， 默认情况下， bean是单实例对象

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124219.png)

- 设置单实例或多实例的方法
（1）在 spring 配置文件 bean 标签里面有属性（ scope）用于设置单实例还是多实例
（2）scope 属性值
第一个值 默认值， singleton，表示是单实例对象
第二个值 prototype，表示是多实例对象
（3）singleton 和 prototype 区别
第一 singleton 单实例， prototype 多实例
第二 设置 scope 值是 singleton 时候，加载 spring 配置文件时候就会创建单实例对象, 设置 scope 值是 prototype 时候，不是在加载 spring 配置文件时候创建 对象，在调用getBean 方法时候创建多实例对象

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124231.png)

### bean生命周期
（1）通过构造器创建 bean 实例（无参数构造）
（2）为 bean 的属性设置值和对其他 bean 引用（调用 set 方法）
（3）如果配置了bean后置处理器,则把bean实例传递bean后置处理器的方法 postProcessBeforeInitialization
（4）如果配置了初始化方法, 则调用 bean 的初始化的方法
（5）如果配置了bean后置处理器,把 bean 实例传递bean后置处理器的方法 postProcessAfterInitialization
（6） bean 可以使用了（对象获取到了）
（7）如果配置了销毁方法, 则当容器关闭时候，调用 bean 的销毁的方法
注：一个配置文件中配置了bean后置处理器，则该配置文件中所有的bean创建时都会执行该bean后置处理器方法
```java
public class Orders{
	public Orders(){
		System.out.println("第一步 执行无参数构造创建bean实例");
	}
	private String oname;
	public void setOname(String oname){
		this.oname = oname;
		System.out.println("第二步  调用set方法设置属性值");
	}
	//创建执行的初始化的方法
	public void initMethod(){
		System.out.println("第四步  执行初始化的方法");
	}
	//创建执行的销毁的方法
	public void destroyMethod(){
		System.out.println("第六步  执行销毁的方法");
	}
}


//创建类，实现接口 BeanPostProcessor，创建后置处理器
public class MyBeanPost implements BeanPostProcessor {
	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("第三步 在初始化之前执行的方法");
		return bean;
	}
	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("第五步 在初始化之后执行的方法");
		return bean;
	}
}


@Test
public void testBean(){
	ApplicationContext context = new ClassPathXmlApplicationContext("bean4.xml");
	Orders orders = context.getBean("orders", Orders.class);
	System.out.println("第四步 获取创建 bean 实例对象");
	System.out.println(orders);
	//手动让 bean 实例销毁
	(ClassPathXmlApplicationContext)context.close();
}
```
```xml
<bean id="orders" class="com.atguigu.spring5.bean.Orders" init-method="initMethod" destroy-method="destroyMethod">
	<property name="oname" value="手机"></property>
</bean>

<!--配置后置处理器, 配置后该配置文件中的所有bean创建时都会执行后置处理器-->
<bean id="myBeanPost" class="com.atguigu.spring5.bean.MyBeanPost"></bean>
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124240.png)

### xml自动装配
自动装配：根据指定装配规则（属性名称或者属性类型）， Spring 自动将匹配的属性值进行注入
bean标签属性 autowire，配置自动装配
autowire属性常用两个值：
byName 根据属性名称注入 ，注入值bean的id值和类属性名称一样
byType 根据属性类型注入, 在该xml中只能有一个该类型的bean，不能有有多个，否则编译器不知道要匹配哪一个bean，从而报错
1. 根据属性名称自动注入
```xml
<bean id="emp" class="com.atguigu.spring5.autowire.Emp" autowire="byName">
<bean id="dept" class="com.atguigu.spring5.autowire.Dept"></bean>
```
2. 根据属性类型自动注入
```xml
<bean id="emp" class="com.atguigu.spring5.autowire.Emp" autowire="byType"></bean>
<bean id="dept" class="com.atguigu.spring5.autowire.Dept"></bean>
```

### 外部属性文件
1. 直接配置数据库信息
（1）配置德鲁伊连接池
（2）引入德鲁伊连接池依赖 jar 包
```xml
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
	<property name="driverClassName" value="com.mysql.jdbc.Driver"></property>
	<property name="url" value="jdbc:mysql://localhost:3306/userDb"></property>
	<property name="username" value="root"></property>
	<property name="password" value="root"></property>
</bean>
```
2. 引入外部属性文件配置数据库连接池
创建外部属性文件， properties 格式文件，写数据库信息
```conf
prop.driverClass=com.mysql.jdbc.Driver
prop.url=jdbc:mysql://localhost:3306/userDb
prop.userName=root
prop.password=root
```
把外部properties属性文件引入到spring配置文件中
```xml
<!-- 引入 context 名称空间 -->
<beans xmlns="http://www.springframework.org/schema/beans"
	   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	   xmlns:context="http://www.springframework.org/schema/context"
	   xsi:schemaLocation="http://www.springframework.org/schema/beans
						   http://www.springframework.org/schema/beans/spring-beans.xsd
						   http://www.springframework.org/schema/context
						   http://www.springframework.org/schema/context/spring-context.xsd">

<!-- 在 spring 配置文件使用标签引入外部属性文件 -->
<!--引入外部属性文件-->
<context:property-placeholder location="classpath:jdbc.properties"/>
<!--配置连接池-->
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
	<property name="driverClassName" value="${prop.driverClass}"></property>
	<property name="url" value="${prop.url}"></property>
	<property name="username" value="${prop.userName}"></property>
	<property name="password" value="${prop.password}"></property>
</bean>
```

## 基于注解
1. 什么是注解
（1）注解是代码特殊标记，格式： @注解名称(属性名称=属性值, 属性名称=属性值..)
（2）使用注解，注解作用在类上面，方法上面，属性上面
（3）使用注解目的：简化 xml 配置
2. Spring针对Bean管理中创建对象提供注解
（1） @Component
（2） @Service
（3） @Controller
（4） @Repository
* 上面四个注解功能是完全一样的，都可以用来创建bean实例
### 基于注解方式实现对象创建
第一步 引入依赖 spring-aop.jar
第二步 开启组件扫描, 要先引入context命名空间
```xml
<!--开启组件扫描, 开启后，会扫描所有配置要扫描的类，如果扫描到注解，则会根据注解来创建类	
1 如果扫描多个包，多个包使用逗号隔开或直接扫描该多个包的上层目录
-->
<context:component-scan base-package="com.atguigu.dao,com.atguigu.service"></context:component-scan>
或
<context:component-scan base-package="com.atguigu"></context:component-scan>
```
第三步 创建类，在类上面添加创建对象注解
```java
//在注解里面value属性值可以省略不写， 默认值是类名称，首字母小写; 例如UserService -- userService
//如果只设置其中的value属性，则可以写成@Component("userService"), 这种省略技巧是java中注解通用的
@Component(value = "userService") //该注解等价于<bean id="userService" class=".."/>
public class UserService {
	public void add() {
		System.out.println("service add.......");
	}
}
```
开启组件扫描细节配置
```xml
<!--
use-default-filters="false" 表示现在不使用默认 filter，自己配置 filter
context:include-filter ，设置扫描哪些内容
context:exclude-filter ，设置不扫描哪些内容
-->
<!-- 这个表示只扫描com.atguigu包下的Controller注解的类 -->
<context:component-scan base-package="com.atguigu" use-defaultfilters="false">
	<context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
	<context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
</context:component-scan>

<!-- 这个表示不扫描com.atguigu包下的Controller注解的类 -->
<context:component-scan base-package="com.atguigu" use-defaultfilters="false">
	<context:exclude-filter type="annotation"expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
```
### 基于注解方式实现属性注入
（1）@Autowired：根据属性类型进行自动装配
第一步 把service和dao对象创建，在service和dao类添加创建对象注解
第二步 在 service 注入 dao 对象，在 service类添加 dao 类型属性，在属性上面使用注解
```java
@Service
public class UserService {
	//定义 dao 类型属性
	//不需要添加 set 方法
	//添加注入属性注解
	@Autowired
	private UserDao userDao;

	public void add() {
		System.out.println("service add.......");
		userDao.add();
	}
}
```
spring发现@Autowired注解时，会根据当前bean类型，寻找在spring中是否存在该类型的bean，找到直接注入，如果找不到还会检查是否有子孙类、实现类存在，如果存在唯一的则自动注入，如果还是没有找到或找到多个无法注入，则还会按照属性名对应id去查找对应的bean，如果存在则注入，如果还是没有找到则抛出异常。也可以额外配置@Qualifier(value="dog1")注解强制要求按照id寻找bean，则此时会直接使用给定的id寻找bean，而不会进行基于类型的匹配。

（2）@Qualifier：根据名称进行注入
这个@Qualifier 注解的使用要和上面@Autowired 一起使用
```java
//定义 dao 类型属性
//不需要添加 set 方法//添加注入属性注解
@Autowired //根据类型进行注入
@Qualifier(value = "userDaoImpl1") //根据名称进行注入,其中的value值就是名称值
private UserDao userDao;
```
（3） @Resource：可以根据类型注入，也可以根据名称注入
注：Resource的包是javax.annotation.Resource, 是javax中的，而不是spring中的, 所以spring不推荐使用Resource
```java
//@Resource //根据类型进行注入
@Resource(name = "userDaoImpl1") //根据名称进行注入
private UserDao userDao;
```
（4） @Value：注入普通类型属性
```java
@Value(value = "abc")
private String name;
```
### 完全注解开发
（1）创建配置类，替代 xml 配置文件
```java
@Configuration //作为配置类，替代 xml 配置文件
@ComponentScan(basePackages = {"com.atguigu"})
public class SpringConfig {
}
```
（2）编写测试类
```java
@Test
public void testService2() {
	//加载配置类
	ApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);
	UserService userService = context.getBean("userService", UserService.class);
	System.out.println(userService);
	userService.add();
}
```
这种开发在实际开发中，使用的是springboot, 其实springboot本质上就是spring

# AOP
## 什么是 AOP
（1）面向切面编程（方面）， 利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。
（2）通俗描述：不通过修改源代码方式，在主干功能里面添加新功能
（3）使用登录例子说明 AOP

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124250.png)

## AOP底层原理
AOP底层使用的是动态代理
（1）有两种情况动态代理
第一种 有接口情况，使用 JDK 动态代理
创建接口实现类代理对象，增强类的方法

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124258.png)

第二种 没有接口情况，使用 CGLIB 动态代理
创建子类的代理对象，增强类的方法

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124310.png)

## AOP(JDK动态代理)
JDK提供了实现动态代理的相关组件。包括如下：
接口 InvocationHandler；
类 Proxy；
它们都在java.lang.reflect包中。
InvocationHandler是代理实例的调用处理程序 实现的接口。 该接口只有一个方法：Object invoke(Object proxy,Method method,Object[] args)throws Throwable。直接的理解为：当调用被代理对象的某个方法时，实际上会在该接口的实现类上调用invoke方法。也就是说，invoke方法就是代替原来执行的方法。
Proxy 提供用于创建动态代理类和实例的静态方法，创建出来的代理类实例都是Proxy的子类。它的这两个方法是比较重要的：getProxyClass动态生成代理类，newProxyInstance整合了getProxyClass方法并通过构造方法反射获得代理类的实例。当调用代理实例的方法时，该方法实际上就是调用其内部的InvocationHandler的invoke()方法

1. 使用 JDK 动态代理，使用 java.lang.reflect.Proxy 类里面的方法创建代理对象
（1）调用 newProxyInstance 方法
static Object newProxyInstance(ClassLoader loader, 类<?>[] interfaces, InvocationHandler h)
该方法返回指定接口的代理类的实例，该接口将方法调用分派给指定的调用处理程序
方法有三个参数：
第一参数，类加载器
第二参数，增强方法所在的类，这个类实现的接口，支持多个接口
第三参数，实现这个接口 InvocationHandler，创建代理对象，写增强的部分
2. 编写JDK动态代理代码
（1）创建接口，定义方法
```java
public interface UserDao{
	public int add(int a, int b);
	public String update(String id);
}
```
（2）创建接口实现类，实现方法
```java
public classUserDaoImpl implements UserDao{
	@Override
	public int add(int a, int b){
		return a+b;
	}
	@Override
	public int update(String id){
		return id;
	}
}
```
（3）使用 Proxy 类创建接口代理对象
```java
public class JDKProxy{
	public static void main(String[] args){
		//创建接口实现类代理对象
		Class[] interfaces = {UserDao.class};
		UserDao user = new UserDao();
		UserDao dao = (UserDao)Proxy.newProxyInstance(JDKProxy.class.getClassLoader(), interfaces, new UserDaoProxy(userDao));
		int result = dao.add(1, 2);
		System.out.println("result:"+result);
	}
}

//创建代理对象代码
class UserDaoProxy implements InvocationHandler{
	//把创建的是谁的代理对象，把谁传递过来
	//通过有参构造方式进行传递
	private Object obj;
	public UserDaoProxy(Object obj){
		this.obj = obj;
	}

	//增强的逻辑
	//第一个参数：代理对象
	//第二个参数：表示当前执行的是那个方法
	//第三个参数：表示当前执行的方法中的参数
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable{
		//方法执行前
		System.out.println("方法之前执行..."+method.getName()+":传递的参数..."+Arrays.toString(args));
		//被增强的方法执行
		Object res = method.invoke(obj, args);
		//方法之后
		System.out.println("方法之后执行..."+obj);
		return res;
	}
}
```
## AOP术语
1. 连接点： 类里面可以被增强的方法，称为连接点
2. 切入点：实际被真正增强的方法，称为切入点
3. 通知(增强)：实际增强的逻辑部分称为通知(增强)
   通知有多种类型：1. 前置通知：在切入点前执行
                 2. 后置通知：在切入点后执行
                 3. 环绕通知：在切入点前后执行
                 4. 异常通知：发生异常时执行
                 5. 最终通知：类似于finally,无论是否发生异常，都在最后执行
4. 切面：是动作，是把通知应用到切入点的过程, 即将通知绑定到切入点的过程 [详细使用](#advisor)

## AOP操作(准备工作)
1. Spring 框架一般都是基于 AspectJ 实现 AOP 操作
（1） AspectJ 不是 Spring 组成部分，是独立 AOP 框架，一般把 AspectJ 和 Spirng 框架一起使用，进行 AOP 操作
2. 基于 AspectJ 实现 AOP 操作
（1）基于 xml 配置文件实现
（2）基于注解方式实现（在实际开发中常用）
3. aop相关依赖包：
springsource.net.sf.cglib.jar
springsource.org.aopalliance.jar
springsource.org.aspectj.weaver.jar
spring-aspects.jar
4. 切入点表达式
（1）切入点表达式作用：知道对哪个类里面的哪个方法进行增强
（2）语法结构： execution([权限修饰符] [返回类型(可省略)] [类全路径] [方法名称] ([参数列表]))
举例 1：对 com.atguigu.dao.BookDao 类里面的 add 进行增强
execution(* com.atguigu.dao.BookDao.add(..))
举例 2：对 com.atguigu.dao.BookDao 类里面的所有的方法进行增强
execution(* com.atguigu.dao.BookDao.* (..))
举例 3：对 com.atguigu.dao 包里面所有类，类里面所有方法进行增强
execution(* com.atguigu.dao.\*.* (..))

## AOP 操作（AspectJ 注解）
1. 创建类，在类里面定义方法
```java
//被增强的类
@Component
public class User {
	public void add() {
		System.out.println("add.......");
	}
}
```
2. 创建增强类（编写增强逻辑）
在增强类的里面，在作为通知方法上面添加通知类型注解，使用切入点表达式配置
```java
//增强的类
@Component
@Aspect //该注解的作用：生成代理对象
public class UserProxy{
	//前置通知
	//@Before 注解表示作为前置通知
	@Before(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
	public void before() {
		System.out.println("before.........");
	}

	//后置通知（返回通知）, 在return后才执行
	@AfterReturning(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
	public void afterReturning(){
		System.out.println("afterReturning.........");
	}

	//最终通知
	@After(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
	public void after(){
		System.out.println("after.........");
	}

	//异常通知
	@AfterThrowing(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
	public void afterThrowing(){
		System.out.println("afterThrowing.........");
	}

	//环绕通知
	@Around(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
	public void around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable{
		System.out.println("环绕前.........");
		proceedingJoinPoint.proceed();// 被增强的方法执行
		System.out.println("环绕后.........");
	}
}
```
3. 在spring配置文件中，开启注解扫描，以及开启生成代理对象
```xml
<!-- 开启注解扫描 -->
<context:component-scan basepackage="com.atguigu.spring5.aopanno"></context:component-scan>

<!-- 开启 Aspect 生成代理对象-->
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124321.png)

- 相同的切入点提取
```java
//相同切入点抽取
@Pointcut(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
public void pointdemo() {
}

@Before(value = "pointdemo()")
public void before() {
	System.out.println("before.........");
}
```
 
- 有多个增强类对同一个方法进行增强，设置增强类优先级
```java
@Component
@Aspect
@Order(1)
public class PersonProxy
```
- 完全使用注解开发
创建配置类，不需要创建 xml 配置文件
```java
@Configuration
@ComponentScan(basePackages = {"com.atguigu"})
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class ConfigAop {
}
```

## AOP 操作（AspectJ 配置文件）
1. 创建两个类，增强类和被增强类，创建方法
2. 在 spring 配置文件中创建两个类对象
```xml
<!--创建对象-->
<bean id="book" class="com.atguigu.spring5.aopxml.Book"></bean>
<bean id="bookProxy" class="com.atguigu.spring5.aopxml.BookProxy"></bean>
```
3. 在 spring 配置文件中配置切入点
```xml
<aop:config>
	<!--切入点-->
	<aop:pointcut id="p" expression="execution(* com.atguigu.spring5.aopxml.Book.buy(..))"/>

	<!--配置切面-->
	<aop:aspect ref="bookProxy">
		<!--增强作用在具体的方法上-->
		<aop:before method="before" pointcut-ref="p"/>
	</aop:aspect>
</aop:config>
```

# JdbcTemplate
什么是JdbcTemplate: Spring 框架对JDBC进行封装，使用JdbcTemplate方便实现对数据库操作
需要使用的jar包：
mysql-connector-java.jar
spring-jdbc.jar
spring-tx.jar : 有关事务的包
spring-orm.jar : spring需要与MyBatis等其他数据库框架整合时，需要引入

## JdbcTemplate准备
```xml
<!-- 组件扫描 -->
<context:component-scan base-package="com.atguigu"></context:component-scan>

<!-- 在 spring 配置文件配置数据库连接池 -->
<!-- 数据库连接池 -->
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource"
destroy-method="close">
	<property name="url" value="jdbc:mysql:///user_db" /> 
	<property name="username" value="root" />
	<property name="password" value="root" />
	<property name="driverClassName" value="com.mysql.jdbc.Driver" />
</bean>

<!-- 配置 JdbcTemplate 对象，注入 DataSource -->
<!-- JdbcTemplate 对象 -->
<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
	<!--注入 dataSource-->
	<property name="dataSource" ref="dataSource"></property>
</bean>
```
```java
@Service
public class BookService{
	@Autowired
	private BookDao bookDao;
}

@Repository
public class BookDaoImpl implements BookDao{
	//注入JdbcTemplate
	@Autowired
	private JdbcTemplate jdbcTemplate;
}
```
## JdbcTemplate 操作数据库（添加、修改、删除）
1. 对应数据库创建实体类
```java
public class User{
	private String userId;
	private String username;
	private String ustatus;
	/..set, get../
}
```
2. 编写 service 和 dao
（1）在 dao 进行数据库添加操作
（2）调用 JdbcTemplate 对象里面 update(String sql, Object... args)方法实现添加操作
update方法的第一个参数：sql语句
           第二个参数：可变参数，设置sql语句值
```java
@Service
public class BookService{
	@Autowired
	private BookDao bookDao;

	//添加的方法
	public void addBook(Book book){
		bookDao.add(book);
	}

	//修改的方法
	public void updateBook(Book book){
		bookDao.updateBook(book);
	}

	//删除操作
	public void delete(Book book){
		bookDao.delete(book);
	}

}

@Repository
public class BookDaoImpl implements BookDao{
	//注入JdbcTemplate
	@Autowired
	private JdbcTemplate jdbcTemplate;

	//添加的方法
	@Override
	public void add(Book book){
		//创建sql语句
		String sql = "insert into t_book values(?, ?, ?)";
		//调用方法实现
		Object[] args = {book.getUserId(), book.getUsername(), book.getUstatus()};
		int update = jdbcTemplate.update(sql, args);
		System.out.println(update);
	}

	//修改的方法
	@Override
	public void updateBook(Book book){
		String sql = "update t_book set username=?, ustatus=? where user_id =?";
		Object[] args = {book.getUsername(), book.getUstatus(), book.getUserId()};
		int update = jdbcTemplate.update(sql, args);
		System.out.println(update);
	}

	//删除操作
	@Override
	public void delete(String id){
		String sql = "delete from t_book where user_id=?";
		int update = jdbcTemplate.update(sql, id);
		System.out.println(update);
	}
}

```
3. 测试类
```java
@Test
public void testJdbcTemplate(){
	ApplicationContext context = new ClassPathXmlApplicationContext("bean1.xml");
	BookService bookService = context.getBean("bookService", BookService.class);

	Book book = new Book();
	book.setUserId("1");
	book.setUsername("java");
	book.setUstatus("a");
	bookService.addBook(book);
}
```
## JdbcTemplate 操作数据库（查询返回某个值）
使用的方法：queryForObject(String sql, Class<T> requiredType)
第一个参数：sql语句
第二个参数：返回类型Class
```java
@Override
public int selectCount(){
	String sql = "select count(*) from t_book";
	Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
	return count;
}
```
## JdbcTemplate 操作数据库（查询返回对象）
使用的方法：queryForObject(String sql, RowMapper<T> rowMapper, Object... args)
第一个参数：sql语句
第二个参数：RowMapper是接口，针对返回不同类型数据，使用这个接口里面实现类完成数据封装
第三个参数：sql语句值
```java
public Book findBookInfo(String id){
	String sql = "select * from t_book where user_id = ?";
	//调用方法
	Book book = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<Book>(Book.class), id);
	return book;
}
```
## JdbcTemplate 操作数据库（查询返回集合）
使用的方法：query(String sql, RowMapper<T> rowMapper, Object... args)
第一个参数：sql语句
第二个参数：RowMapper是接口，针对返回不同类型数据，使用这个接口里面实现类完成数据封装
第三个参数：sql语句值
```java
public List<Book> findAllBook(){
	String sql = "select * from t_book";
	//调用方法
	List<Book> bookList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<Book>(Book.class));
	return bookList;
}
```

## JdbcTemplate 操作数据库（批量操作）
使用的方法：batchUpdate(String sql, List<Object[]> batchArgs)
第一个参数：sql语句
第二个参数：List集合, 批量操作的sql语句值
```java
public void batchAddBook(List<Object[]> batchArgs){
	String sql = "insert into t_book values(?, ?, ?)";
	int[] ints = jdbcTemplate.batchUpdate(sql, batchArgs);
	System.out.println(Arrays.toString(ints));
}
```

# 事务
## 事务操作
1. 事务最好添加到 JavaEE 三层结构里面 Service 层（业务逻辑层）
2. 在 Spring 进行事务管理操作
有两种方式： 编程式事务管理和声明式事务管理（使用） 
3. Spring事务管理API
提供一个接口，代表事务管理器，这个接口针对不同的框架提供不同的实现类

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124334.png)

## 编程式事务管理

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124344.png)

## 声明式事务管理
有两种方式：
1. 基于注解方式（使用）
2. 基于 xml 配置文件方式
在 Spring 进行声明式事务管理，底层使用 AOP 原理

### 注解声明式事务管理
1. 在 spring 配置文件配置事务管理器
```xml
<!--创建事务管理器-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<!--注入数据源-->
	<property name="dataSource" ref="dataSource"></property>
</bean>
```
2. 在 spring 配置文件，开启事务注解
```xml
<!-- （1）在 spring 配置文件引入名称空间 tx -->
<beans xmlns="http://www.springframework.org/schema/beans"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xmlns:context="http://www.springframework.org/schema/context"
		xmlns:aop="http://www.springframework.org/schema/aop"
		xmlns:tx="http://www.springframework.org/schema/tx"
		xsi:schemaLocation="http://www.springframework.org/schema/beans
							http://www.springframework.org/schema/beans/spring-beans.xsd
							http://www.springframework.org/schema/context
							http://www.springframework.org/schema/context/spring-context.xsd
							http://www.springframework.org/schema/aop
							http://www.springframework.org/schema/aop/spring-aop.xsd
							http://www.springframework.org/schema/tx
							http://www.springframework.org/schema/tx/spring-tx.xsd">

<!-- （2）开启事务注解 -->
<!--开启事务注解-->
<tx:annotation-driven transactionmanager="transactionManager"></tx:annotation-driven>
```
3. 在 service 类上面（ 或者 service 类里面方法上面）添加事务注解
使用注解@Transactional; 在 service 类上面（ 或者 service 类里面方法上面）添加事务注解
如果把这个注解添加类上面，这个类里面所有的方法都添加事务
如果把这个注解添加方法上面，为这个方法添加事务
```java
@Service
@Transactional
public class UserService {
```



### 完全注解声明式事务管理
创建配置类，使用配置类替代 xml 配置文件
SpringIOC 容器管理一个或者多个bean，这些bean都需要在@Configuration注解下进行创建，在一个方法上使用@Bean注解就表明这个方法需要交给Spring进行管理。
```java
@Configuration //告诉spring，这是一个配置类
@ComponentScan(basePackages = "com.atguigu") //组件扫描
@EnableTransactionManagement //开启事务
public class TxConfig {
	//创建数据库连接池
	@Bean
	public DruidDataSource getDruidDataSource() {
		DruidDataSource dataSource = new DruidDataSource();
		dataSource.setDriverClassName("com.mysql.jdbc.Driver");
		dataSource.setUrl("jdbc:mysql:///user_db");
		dataSource.setUsername("root");
		dataSource.setPassword("root");
		return dataSource;
	}
	//创建 JdbcTemplate 对象
	@Bean
	public JdbcTemplate getJdbcTemplate(DataSource dataSource) {
		//到 ioc 容器中根据类型找到 dataSource
		JdbcTemplate jdbcTemplate = new JdbcTemplate();
		//注入 dataSource
		jdbcTemplate.setDataSource(dataSource);return jdbcTemplate;
	}
	//创建事务管理器
	@Bean
	public DataSourceTransactionManager getDataSourceTransactionManager(DataSource dataSource) {
		DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
		transactionManager.setDataSource(dataSource);
		return transactionManager;
	}
}
```
### 声明式事务管理参数配置
在 service 类上面添加注解@Transactional，在这个注解里面可以配置事务相关参数

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124355.png)

**1. propagation：事务传播行为**
事务传播行为指的就是当一个事务方法被另一个事务方法调用时，这个事务方法应该如何进行。 
例如：methodA事务方法调用methodB事务方法时，methodB是继续在调用者methodA的事务中运行呢，还是为自己开启一个新事务运行，这就是由methodB的事务传播行为决定的。
Spring定义了七种传播行为

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124403.png)

- required(默认值) ：如果methodA有事务，则methodB使用的时methodA中的事务
- required_NEW: 无论methodA是否有事务，methodB都会创建新的事务

**2. ioslation：事务隔离级别**
事务有特性成为隔离性，多事务操作之间不会产生影响。不考虑隔离性产生很多问题，常见的有三个读问题：脏读、不可重复读、虚（幻）读
- 脏读：一个未提交事务读取到另一个未提交事务（由事务回滚导致）的数据
- 不可重复读：一个未提交事务读取到另一提交事务修改数据
- 虚读：一个未提交事务读取到另一提交事务添加数据
通过设置事务隔离级别，解决读问题

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124415.png)

**3. timeout：超时时间**
（1）事务需要在一定时间内进行提交，如果没在规定时间提交，则进行回滚
（2）默认值是 -1，即不设置超时， 设置时间以秒单位进行计算
**4. readOnly：是否只读**
（1）读：查询操作，写：添加修改删除操作
（2）readOnly 默认值 false，表示可以查询，可以添加修改删除操作
（3）设置 readOnly 值是 true，设置成 true 之后，只能查询
**6. rollbackFor：回滚**
设置出现哪些异常进行事务回滚
**7. noRollbackFor：不回滚**
设置出现哪些异常不进行事务回滚

### XML 声明式事务管理
在 spring 配置文件中进行配置
第一步 配置事务管理器
第二步 配置通知
第三步 配置切入点和切面
<span id="advisor"></span>

```xml
<!-- 1.配置事务管理器-->
<bean id="transactionManager1" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<!-- 注入数据源 -->
	<property name="dataSource" ref="dataSource"></property>
</bean>

<!-- 2. 配置通知 -->
<tx:advice id="txadvice" transcation-manager="transactionManager1">
	<!-- 配置事务参数 -->
	<tx:attributes>
		<!-- 配置符合规则的方法事务的参数-->
		<!-- 配置方法名为accountMoney的事务的propagation参数为REQUIRED
		     由于我们通过aop:advisor将切入点与通知绑定在一起，所以spring会在切入点下找accountMoney方法-->
		<tx:method name="accountMoney" propagation="REQUIRED"/>

		<!-- 配置方法名以get开头的事务的read-only参数为true-->
		<tx:method name="get*" read-only="true"/>
	</tx:attributes>
</tx:advice>

<!-- 3 配置切入点和切面 -->
<aop:config>
	<!-- 配置切入点 -->
	<aop:pointcut id="pt" expression="execution(* com.atguigu.spring5.service.UserService.*(..))"/>
	<!-- 配置切面, 将pt切入点与teadvice通知绑定在一起 -->
	<aop:advisor advice-ref="txadvice" pointcut-ref="pt"/>
</aop:config>
```

### 触发事务回滚条件
- 通常在方法上加上@transactional注解，此时指的是没有加任何属性的，此时触发回滚条件是：抛出RuntimeException或者Error（常见的非RuntimeException不触发回滚）
- 如果要在抛出 非RuntimeException时也触发回滚机制，需要我们在注解上添加 rollbackFor = { Exception.class }属性

#### 手动回滚事务
有时我们需要捕获一些错误信息，又需要进行事务回滚，这时我们就需要用到Spring提供的事务切面支持类TransactionAspectSupport。
```
@Transactional(rollbackFor = Exception.class)
@Override
public void saveEntity() throws Exception{
    try {
        userDao.saveUser();
        studentDao.saveStudent();
    }catch (Exception e){
        System.out.println("异常了=====" + e);
        //手动强制回滚事务，这里一定要第一时间处理
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    }
}
```
手动回滚事务一定要加上@Transactional，不然会报以下错误：
```
org.springframework.transaction.NoTransactionException: No transaction aspect-managed TransactionStatus in scope
```
想想也是，不开启事务，何来手动回滚，所以@Transactional必不可少。

## @Transactional 注解详解
声明式事务管理建立在AOP之上的。其本质是对方法前后进行拦截，然后在目标方法开始之前创建或者加入一个事务，在执行完目标方法之后根据执行情况提交或者回滚事务。
简而言之，@Transactional注解在代码执行出错的时候能够进行事务的回滚。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220420110219.png)

### 使用说明

![](https://raw.githubusercontent.com/NaisWang/images/master/20220420110303.png)

- 需要在启动类上添加@EnableTransactionManagement注解。
- 当作用于类上时，该类的所有 public 方法将都具有该类型的事务属性，同时，我们也可以在方法级别使用该标注来覆盖类级别的定义。
- 在项目中，@Transactional(rollbackFor=Exception.class)，如果类加了这个注解，那么这个类里面的方法抛出异常，就会回滚，数据库里面的数据也会回滚。
- 在@Transactional注解中如果不配置rollbackFor属性,那么事物只会在遇到RuntimeException的时候才会回滚,加上rollbackFor=Exception.class,可以让事物在遇到非运行时异常时也回滚。

### 注解失效问题

正常情况下，只要在方法上添加@Transactional注解就完事了，但是需要注意的是，虽然使用简单，但是如果不合理地使用注解，还是会存在注解失效的问题。

#### @Transactional应用在非public修饰的方法上

事务拦截器在目标方法执行前后进行拦截，内部会调用方法来获取Transactional 注解的事务配置信息，调用前会检查目标方法的修饰符是否为 public，不是 public则不会获取@Transactional 的属性配置信息。

#### @Transactional注解属性rollbackFor设置错误

rollbackFor 可以指定能够触发事务回滚的异常类型。Spring默认抛出了未检查unchecked异常（继承自 RuntimeException 的异常）或者 Error才回滚事务；其他异常不会触发回滚事务。如果在事务中抛出其他类型的异常，但却期望 Spring 能够回滚事务，就需要指定rollbackFor属性。

#### 同一个类中方法调用，导致@Transactional失效

开发中避免不了会对同一个类里面的方法调用，比如有一个类Test，它的一个方法A，A再调用本类的方法B（不论方法B是用public还是private修饰），但方法A没有声明注解事务，而B方法有。则外部调用方法A之后，方法B的事务是不会起作用的。这也是经常犯错误的一个地方。

那为啥会出现这种情况？其实这还是由于使用Spring AOP代理造成的，因为只有当事务方法被当前类以外的代码调用时，才会由Spring生成的代理对象来管理。

#### 异常被你的catch“吃了”导致@Transactional失效

如果你手动的catch捕获这个异常并进行处理，事务管理器会认为当前事务应该正常commit，就会导致注解失效，如果非要捕获且不失效，就必须在代码块内throw new Exception抛出异常。

#### 数据库引擎不支持事务

开启事务的前提就是需要数据库的支持，我们一般使用的Mysql引擎时支持事务的，所以一般不会出现这种问题。

# IOC相关注解
## @Bean注解
Spring的@Bean注解用于告诉方法，给spring容器添加组件，以方法名作为组件的id，方法的返回类型作为组件类型，方法的返回值作为组件的实例。
```java
@Bean
public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
		return new PropertySourcesPlaceholderConfigurer();
}
```

如果@Bean修饰的方法中的带有参数，则会从IOC容器中默认会以@Autowired形式给参数注入，如果IOC容器中没有该类型，即无法完成注入，则会报`springbean循环依赖`的错。也可以通过@Value，@Qualifier注解来改变注入方式
```java
@Bean(name = "dataSource")
public DataSource dataSource(@Value("${jdbc.driverClass}") String driverClassName,
		@Value("${jdbc.jdbcUrl}") String url, @Value("${jdbc.user}") String username,
		@Value("${jdbc.password}") String password) {
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName(driverClassName);
		dataSource.setUrl(url);
		dataSource.setUsername(username);
		dataSource.setPassword(password);
		return dataSource;
}
@Bean(name = "jdbcTemplate")
public JdbcTemplate jdbcTemplate(@Qualifier(value = "dataSource") DataSource dataSource) {
		return new JdbcTemplate(dataSource);
}
```

因为如果IOC容器中没有这个类型，即无法完成注入，则会报错，所以防止这种情况的产生，我们一般使用`条件注入`的方法,如下
```java
@Bean
@ConditionalOnBean(Person.class)
public Person person(Person p){
	return p;
}
```

## @Conditional注解
### 基本介绍
- @Conditional注解是一个条件装配注解，主要用于限制@Bean注解在什么时候才生效。以指定的条件形式控制bean的创建
- @Conditional可以自定义条件进行装配或者不装配…
- @Conditional本身还是一个父注解，派生出大量的子注解；可以按需加载！
- 因此在学习SpringBoot的时候是非常有必要学习这个注解的使用的，SpringBoot就是按需加载。
- Conditional注解和所有子注解首先必须依托@Configuration配置类注解
- 都可以加载类或者方法上；加载类上的含义所有的方法都按照这个条件装配、加载方法上只有该方法进行条件装配。
- 注：Conditional注解是Spring4.0就有的，旗下的子注解是SpringBoot1.0有的。

### 使用
@Conditional注解源码
```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Conditional {
	
	// 自定义类实现Condition接口，完成给出指定的条件。
	Class<? extends Condition>[] value();

}
```

#### 自定义条件
使用Conditional注解进行条件装配时需要自定义类实现Condition接口（spring包下的，不是JUC包下）

如下实现的效果为：如果存在dog1则不会对条件装配bean进行创建。
```java
public class MyCondition implements Condition {
    /**
     * @param context: 判断条件使用的上下文环境
     * @param metadata: 扫描的注解信息
     */
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 1. 获取bean工厂
        ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
        // 2. 获取运行环境, 可以根据操作系统的环境进行限制bean
        Environment environment = context.getEnvironment();
        // 3. 获取BeanDefinition注册定义表
        context.getRegistry();
        // 4. 获取资源加载器
        context.getResourceLoader();
        // 5. 获取类加载器
        ClassLoader classLoader = context.getClassLoader();
        if (beanFactory.containsBean("dog1")) {
            return false;
        }
        /**
         *      可以根据以上条件进行条件装配
         *      true: 装配
         *      false： 不装配
         */
        return true;
    }
}
```
#### 条件装配测试
```java
@Configuration
public class MyConfig {

    @Bean("user1")
    public User user1(){
        return new User("splay", 22, "男");
    }


    @Bean("dog1")
    //@ConditionalOnBean(name = {"dog2"})
    public Dog dog1(){
        return new Dog("金毛", 4,"公");
    }

    @Bean("dog2")
    @Conditional(value = MyCondition.class)
    public Dog dog2(){
        return new Dog("拉布拉多", 3,"母");
    }
}
```
在dog2上加上条件装配，当扫描到这个bean时会进行条件判断。

### @condition的派生注解
继@Conditional注解后，又基于此注解推出了很多派生注解，比如@ConditionalOnBean、@ConditionalOnMissingBean、@ConditionalOnExpression、@ConditionalOnClass…动态注入bean变得更方便了。

- @ConditionalOnBean作用：判断当前需要注册的bean的实现类否被spring管理，如果被管理则注入，反之不注入
- @ConditionalOnMissingBean作用：判断当前需要注入Spring容器中的bean的实现类是否已经含有，有的话不注入，没有就注入

#### @ConditionalOnBean注解
@ConditionalOnBean作用：判断当前需要注册的bean的实现类否被spring管理，如果被管理则注入，反之不注入

@ConditionalOnBean注解其实也是Conditional注解的特定装配，只不过条件类已经实现好了。@ConditionalOnBean源码如下：
```java
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Conditional(OnBeanCondition.class) //OnBeanCondition是一个Condition接口的实现类
public @interface ConditionalOnBean {

 // 1. 按照bean的类型进行检查
 Class<?>[] value() default {};

 // 2. 按照bean的类型进行检查
 String[] type() default {};

 // 3. 按照bean的注解进行检查
 Class<? extends Annotation>[] annotation() default {};

 // 4. 按照BeanName进行检查
 String[] name() default {};

 // 5. 搜索策略
 SearchStrategy search() default SearchStrategy.ALL;

 // 6. 不详
 Class<?>[] parameterizedContainer() default {};
}
```

##### 条件装配测试（一）
当容器中存在dog1的时候再创建dog2，否则就不会进行创建。
```java
@Configuration
public class MyConfig {

    @Bean("user1")
    public User user1(){
        return new User("splay", 22, "男");
    }


    @Bean("dog1")
    public Dog dog1(){
        return new Dog("金毛", 4,"公");
    }

    @Bean("dog2")
    @ConditionalOnBean(name = {"dog1"})
    public Dog dog2(){
        return new Dog("拉布拉多", 3,"母");
    }
}
```

##### 条件装配测试（二）
在使用时发现条件装配与bean的编写注册顺序有关系，如果先后顺序导致将会出现失败的情况。
```java
@Configuration
public class MyConfig {

    @Bean("user1")
    public User user1(){
        return new User("splay", 22, "男");
    }


    @Bean("dog1")
    @ConditionalOnBean(name = {"dog2"})		//当有dog2组件的时候创建dog1
    public Dog dog1(){
        return new Dog("金毛", 4,"公");
    }

    @Bean("dog2")
    public Dog dog2(){
        return new Dog("拉布拉多", 3,"母");
    }
}
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220502113404.png)

对比上面测试一发现dog1并没有成功创建，猜测创建的时候估计是按照某种顺序进行的！因此在使用条件装配进行创建的时候一定要注意呗依赖的条件是否要先创建的问题！

# spring5新特性
整个 Spring5 框架的代码基于 Java8，运行时兼容 JDK9， 许多不建议使用的类和方
法在代码库中删除
## 日志封装
Spring 5.0 框架自带了通用的日志封装
（1）Spring5已经移除Log4jConfigListener，官方建议使用Log4j2
（2）Spring5框架整合Log4j2
使用方法
第一步：引入jar包 
log4j-api.jar
log4j-core.jar
log4j-slf4j-impl.jar
slf4j-api.jar
第二步：创建log4j2.xml配置文件，文件名必须要为log4j2.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--日志级别以及优先级排序: OFF > FATAL > ERROR > WARN > INFO > DEBUG > TRACE >
ALL -->
<!--Configuration 后面的 status 用于设置 log4j2 自身内部的信息输出，可以不设置，
当设置成 trace 时，可以看到 log4j2 内部各种详细输出-->
<configuration status="INFO">
	<!--先定义所有的 appender-->
	<appenders>
		<!--输出日志信息到控制台-->
		<console name="Console" target="SYSTEM_OUT">
		<!--控制日志输出的格式-->
		<PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
		</console>
	</appenders>

	<!--然后定义 logger，只有定义 logger 并引入的 appender， appender 才会生效-->
	<!--root：用于指定项目的根日志，如果没有单独指定 Logger，则会使用 root 作为
	默认的日志输出-->
	<loggers>
		<root level="info">
			<appender-ref ref="Console"/>
		</root>
	</loggers>
</configuration>
```
然后执行代码即可

- 手动输出日志方法
```java
public class UserLog{
	private static final Logger log = LoggerFactory.getLogger(UserLog.class);

	public static void main(String[] args){
		log.info("hello log4j2");
		log.warn("hello log4j2");
	}
}
```

## @Nullable 注解
@Nullable 注解可以使用在方法上面，属性上面，参数上面，表示方法返回可以为空，属性值可以
为空，参数值可以为空
```java
@Nullable
String getId();

public void getName(@Nullable String name);

@Nullable
private String name;
```

## GenericApplicationContext
Spring5 核心容器支持函数式风格 GenericApplicationContext
函数式风格创建对象，交给 spring 进行管理
```java
public void testGenericApplicationContext(){
	//1. 创建 GenericApplicationContext 对象
	GenericApplicationContext context = new GenericApplicationContext();
	//2. 调用context的方法对象注册
	context.refresh();
	context.registerBean("user1", User.class, ()->new User());
	//3. 获取在spring注册的对象
	User user = (User) context.getBean("user1");
	System.out.println(user); 
}
```

## spring5支持整合JUnit5
### 整合 JUnit4
第一步 引入 Spring 相关针对测试依赖
hamcrest-core.jar
spring-test.jar
junit.jar
第二步 创建测试类，使用注解方式完成
```java
@RunWith(SpringJUnit4ClassRunner.class)//指定用哪个单元测试框架
@ContextConfiguration("classpath:bean1.xml")//加载配置文件, 从而使用spring能识别下面的自动装配注解
public class JTest4{
	@Autowired
	private UserService userService;

	@Test //其注解包： org.junit.Test
	public void test1(){
		userService.accountMoney();
	}
}
```
### Spring5 整合 JUnit5
第一步 引入 JUnit5 的 jar 包
Junit5.jar
第二步 创建测试类，使用注解完成
```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration("classpath:bean1.xml")
public class JTest5 {
	@Autowired
	private UserService userService;

	@Test //其注解包： org.junit.jupiter.api.Test
	public void test1() {
		userService.accountMoney();
	}
}
```
- 使用一个复合注解替代上面两个注解完成整合
```java
@SpringJUnitConfig(locations = "classpath:bean1.xml")
public class JTest5 {
	@Autowired
	private UserService userService;

	@Test
	public void test1() {
		userService.accountMoney();
	}
}
```

# spring bean循环依赖
今天在写业务代码的时候遇到了Spring Bean之间产生循环依赖的问题，报错信息为`the dependencies of some of the beans in the application context form a cycle`。

排查代码，发现是我在A类中通过A类的构造函数注入了B类，而在B类中又通过B类的构造函数注入了A类导致的Spring Bean循环依赖问题。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124425.png)

Spring Bean的循环依赖问题，是指类A通过构造函数注入类B的实例（或者B中声明的Bean），而类B通过构造函数注入类A的实例（或者A中声明的Bean），即将类A和类B的bean配置为相互注入，则Spring IoC容器会在运行时检测到此循环引用，并引发一个`BeanCurrentlyInCreationException`。与典型情况（没有循环依赖）不同，Bean A和Bean B之间的循环依赖关系迫使其中一个Bean在被完全初始化之前被注入到另一个Bean中（典型的一个【先有鸡还是先有蛋】场景）。

解决的方法就是不使用基于构造函数的依赖注入，可通过下面两种方式达到目的：
- 在实例变量上使用@Autowired注解，让Spring决定在合适的时机注入，而非在初始化类的时候就注入。
- 用基于setter方法的依赖注入取代基于构造函数的依赖注入来解决循环依赖。

# IDEA 警告 Field injection is not recommended
前些天在开发过程中，发现 IDEA 在一个 @Autowired 注解上打了一个警告，内容是 Field injection is not recommended。多年面向 Spring 开发的经验告诉我，使用 @Autowired 注解进行依赖注入，肯定是没有问题的。但是我的代码洁癖不允许我这么不明不白的留一个警告在这里。所以，带着我的洁癖，和我的好奇心，我开始研究起了这个警告。

## 警告信息
这个警告，和警告的处理建议，在 IDEA 中是这么写的：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124435.png)

翻译过来是这个意思：
不建议直接在字段上进行依赖注入。
Spring 开发团队建议：在 Java Bean 中永远使用构造方法进行依赖注入。对于必须的依赖，永远使用断言来确认。

## 修改代码
既然 IDE 给了警告，那就先着手修改。一开始，代码是这样子的：
```java
public class AClass{
    @Autowired
    private DependencyClass aDependency;
}
```
根据提示，我将代码修改成了这样子：
```java
public class AClass {
    private final DependencyClass aDependency;

    public AClass(DependencyClass aDependency) {
        this.aDependency = aDependency;
    }
}
```
然后警告就消失了，同时运行没有问题，说明这个修改是可行的。

另外，如果你的项目中引入了 Lombok，那么代码甚至可以精简成这样子：
```java
// 该注解指示Lombok为所有没被初始化过的final的变量创建构造方法
@RequiredArgsConstructor
public class AClass {
    private final DependencyClass aDependency;
}
```
但是，光是改好代码还远远不够，我需要知道，为什么 Spring 团队会提出这一项要求，以及，直接使用 @Autowired 进行依赖注入有什么问题。

## 依赖注入的类型
经过我的了解，Spring 有三种依赖注入的类型。

**基于 field 的注入**
所谓基于 field 的注入，就是在变量上使用 @Autowired 注解进行依赖注入。这是我们最熟悉的一种方式，同时，也正是 Spring 团队所不推荐的方式。它用起来就像这样：
```java
@Autowired
private DependencyClass aDependency;
```

**基于 setter 方法的注入**
通过 setter() 方法，以及在方法上加入 @Autowired 注解，来完成的依赖注入，就是基于 setter 方法的注入。它用起来就像这样：
```java
private DependencyClass aDependency;

@Autowired
public void setADependency(DependencyClass aDependency) {
    this.aDependency = aDependency;
}
```
注：在 Spring 4.3 及以后的版本中，setter 上面的 @Autowired 注解是可以不写的。

**基于构造方法的注入**
将各个必需的依赖全部放在带有 @Autowired 注解构造方法的参数中，并在构造方法中完成对应变量的初始化，这种方式，就是基于构造方法的注入。它用起来就像这样：
```java
public class AClass {
    // 这里 final 修饰符并不是必须的，但是我喜欢这么做
    // 因为这样不仅可以在代码上防止 aDependency 被修改
    // 在语义上也可以表明 aDependency 是不应该被修改的
    private final DependencyClass aDependency;

    @Autowired
    public AClass(DependencyClass aDependency) {
        this.aDependency = aDependency;
    }
}
```
注：在 Spring 4.3 及以后的版本中，如果这个类只有一个构造方法，那么这个构造方法上面也可以不写 @Autowired 注解。

## 基于 field 的注入有什么问题
基于 field 的注入，虽然不是绝对禁止使用，但是它可能会带来一些隐含的问题。比如，在这篇[博客](https://blog.csdn.net/ruangong1203/article/details/50992147)中，作者给出了这样的一个代码：
```java
@Autowired
private User user;

private String school;

public UserAccountServiceImpl(){
    this.school = user.getSchool();
}
```
初看起来好像没有什么问题，User 类会被作为一个依赖被注入到当前类中，同时这个类的 school 属性将在初始化时通过 user.getSchool() 方法来获得值。但是，这个代码在运行时，却会抛出如下的异常：
```
Exception in thread "main" org.springframework.beans.factory.BeanCreationException: Error creating bean with name '...' defined in file [....class]: Instantiation of bean failed; nested exception is org.springframework.beans.BeanInstantiationException: Failed to instantiate [...]: Constructor threw exception; nested exception is java.lang.NullPointerException
```
即，在执行 UserAccountServiceImpl() 这个构造方法时出现了 NPE。

出现这个问题的原因是，Java 在初始化一个类时，是按照**静态变量或静态语句块 –> 实例变量或初始化语句块 –> 构造方法 -> @Autowired 的顺序**，那么显而易见，在执行这个类的构造方法时，user 对象尚未被注入，它的值还是 null，从而产生了 NPE。

此外，在代码质量方面，因为基于 field 的注入用起来实在是太方便了，增加一个依赖只需要声明一个变量，然后给它加上 @Autowired 注解，就可以了。而这份便利，有可能会导致这个类的依赖变得越来越多，功能越来越杂，最终违反了单一功能原则。这虽然不会导致功能异常，但是这将增大后续维护的难度。（话虽然这么说，就算我用了基于构造方法的注入，但是用 Lombok 简化了构造方法，这么一来，增加一个依赖又变得更方便了，只需要加一行变量声明就行，如果在不注重代码质量的时候，这也会加剧类的膨胀。所以最后还是得靠工具和审查流程，以及开发者的自觉，来保证代码质量……）

还有一点我个人的感受，就是基于 field 的注解会占据过多的屏幕空间。按照我个人的代码习惯，每个注入之间都要插入一行空行，来把它们分割开来。这意味着，每个注入都将占据 3 行。如果这个类有过多的依赖，那么很有可能光是依赖注入的部分，就会占据大半个屏幕，这会让我看起来很不舒服。当然，出现这种情况，可能同时也意味着这个类已经过于膨胀，违反单一功能原则了。

# spring与springboot中，如何在static方法里用@Autowire或者@Resource注入的属性
问题：我原本想在5的位置用成员变量2，但是因为位置5所在的方法时static的，怎么办？？

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124446.png)

第一步：在位置1写注解@Component 使当前类成为一个bean对象。(@Controller,@service都行)
第二步：在位置3写个static的变量
第三步：写个@PostConstruct注解注解注释的方法，在这个方法里，将位置2的值赋值给位置3.
第四步：就可以在位置5处用位置2的变量了。
@PostConstruct注解作用：是Java EE 5引入的注解，Spring允许开发者在受管Bean中使用它。当DI容器实例化当前受管Bean时，@PostConstruct注解的方法会被自动触发，从而完成一些初始化工作，示例代码如下。

# 手写spring

以下代码是spring的基本用法，而我们这次就是手写来实现这个效果
```java
public class Test {
  public static void main (String[] args) {
    AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
    UserService userService = applicationContext.get("userService", UserService.class);
    userService.test();
  }
}
```

## 代码

