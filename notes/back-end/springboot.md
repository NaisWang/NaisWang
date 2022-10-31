# SpringBoot的优点
- 创建独立Spring引用
- 内嵌web服务器
- 自动starter依赖，简化构建配置
- 提供生产级别的监控、健康检查及外部化配置
- 无代码生成，无需编写xml

# Hello World
需求：浏览器发送/hello请求，响应Hello World
**引入Maven依赖**
```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>2.3.4.RELEASE</version>
</parent>

<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
</dependencies>
```
**创建主程序**
```java
/**
* @SpringBootApplication的作用是说明这是一个SpringBoot应用
*  必须要加这个注解
*/
@SpringBootApplication
public class MainApplication{
  public static void main(String[] args){
    SpringApplication.run(MainApplication.class, args);
  }
}
```
**编写业务**
```java
@RestController //等价于写上@ResponseBody与@Controller
public class HelloController{

  @RequestMapping("/hello")
  public String handle(){
    return "hello World";
  }
}
```
**测试**
直接运行main方法即可，无需配置tomcat服务器
**简化配置**
我们可以将所有的有关springboot配置写在application.propertes文件中
例如：
```xml
server.port=8888
```
**简化部署**
在没使用springboot之前，如果我们向将项目打包部署到tomcat上的话，必须要使用`<packaging>war</packaging>`将其打包成war包，然后将其部署到tomcat上。

而在使用springboot提供的如下插件后，我们可以将其打包成jar包，而这个jar包中包含了tomcat的服务器，可以直接只用`java -jar`来运行这个web应用
添加如下插件
```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
  </plugins>
</build>
```

# 自动配置
- 自动配好Tomcat
- 自动配好SpringMVC
- 自动配好Web常见功能，如：字符编码问题、文件上传视图解析器
- 默认包扫描机制：从启动类所在包开始，扫描当前包及其子级包下的所有文件。

# 底层注解
Full模式与Lite模式
- Full模式：将@Configuration中的proxyBeanMethods设置成true，此时每次使用通过IOC容器获得到的MyConfig实例，调用@Bean标注的方法时，springboot会检查IOC容器中是否有该实例，如果有，就返回IOC容器中的实例
- Lite模式：将@Configuration中的proxyBeanMethods设置成false，此时每次使用通过IOC容器获得到的MyConfig实例，调用@Bean标注的方法时，springboot不会检查IOC容器中是否有该实例，而是直接new一个

**何时使用Full模式，何时使用Lite模式**
- 配置类组件之间无依赖关系用Lite模式加速容器启动过程，减少判断 
- 配置类组件之间有依赖关系，方法会被调用得到之前单实例组件，用Full模式

**@Configuration, @Import, @ImportResource, @ConditionalOnBean, @Bean, @ConfigurationProperties, @EnableConfigurationPropertiesa组件的使用**
```java
public class Pet {
	public String name;
	public Pet(){}
	public Pet(String name){this.name = name;}
	public void setName(String name) {this.name = name;}
}
public class Student {
	public int id;
	public String name;
	public Student(){}
	public Student(int id, String name){	this.id = id; this.name = name;}
}
public class User {
	public String name;
	public int age;
	public User(){}
	public User(String name, int age){this.name = name;this.age = age;}
	public void setName(String name) {this.name = name;}
	public void setAge(int age) {this.age = age;}
}

```
Car.java
```java
/**
 * @ConfigurationProperties的作用是读取配置文件，通过反射给对象的属性注入值
 * 激活@ConfigurationProperties的两种方法:
 * 第一种方法是使用@Component,即让springboot将该组件添加到IOC容器中
 * 第二种方法是在配置类上添加注解@EnableConfigurationPropertiesa(Car.class),该注解有两个作用:一是激活Car类上的@ConfigurationProperties注解，二是将Car类添加到IOC容器中，
 */
@Component
@ConfigurationProperties(prefix = "mycar")
public class Car {
	public String brand;
	public int price;
	public Car(){ }
	public Car(String brand, int price){
		this.brand = brand;
		this.price = price;
	}
	public void setBrand(String brand){this.brand = brand;}
	public void setPrice(int price){this.price = price;}
}
```

application.properites
```xml
# 应用名称
spring.application.name=mpdemo101

mycar.brand=BYD
mycar.price=100
```

beans.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
  <bean id="user4" class="com.atguigu.bean.User">
    <property name="name" value="te"></property>
    <property name="age" value="28"></property>
  </bean>
  <bean id="pet1" class="com.atguigu.bean.Pet">
    <property name="name" value="lll"></property>
  </bean>
</beans>
```

Myconfig.java
```java
/**
 * 配置类里面使用@Bean注解在方法上给容器注册组件，默认是单实例
 * IOC容器中也会生成配置类的实例,但该配置类组件的id默认不是类名
 * @Configuration注解中有一个proxyBeanMethods值，该值默认为true，该作用是表示通过IOC容器获得到的MyConfig实例，调用@Bean标注的方法所得到的实例都是容器中的实例，而不会单独new一个新实例。但是单独通过new得到的MyConifg, 调用@Bean标注的方法所得到的实例都是容器中的实例，会单独new一个新实例
 * @Import({类名.class, ...})给容器中自动添加指定的组件，组件的id默认为全类名。注：使用@Import添加的组件一定要有无参构造，否则会报错
 */
@Import({Student.class, User.class})
@ImportResource("classpath:beans.xml")//用于将beans.xml文件中的bean加载到IOC容器中
@Configuration(proxyBeanMethods = true)  //告诉SpringBoot这是一个配置类 == 配置文件
public class MyConfig {

	@Bean("tom") // 将组件的id设置成"tom"
	public Pet tomcatPet(){
		return new Pet("tomcat");
	}

	@ConditionalOnBean(name = "tom") //当IOC容器中有id为tom的组件是，才会向IOC容器中添加下面的组件. 要额外注意组件的加载顺序
	@Bean // 给容器中添加组件，以方法名作为组件的id，返回类型作为组件类型，返回的值作为容器中的实例
	public User user01(){
		return new User("whz", 10);
	}
}
```

Mpdemo101Application.java
```java
@SpringBootApplication
public class Mpdemo101Application {

	public static void main(String[] args) {
		//返回IOC容器
		ConfigurableApplicationContext run = SpringApplication.run(Mpdemo101Application.class, args);

		//查看容器里面的组件
		String[] names = run.getBeanDefinitionNames();
		for(String name : names){
			System.out.println(name);
		}

		//从容器中获取组件
		User user = run.getBean("user01", User.class);
		System.out.println(user.name+" "+user.age); //输出：whz 10

		//证明配置类里面使用@Bean注解在方法上给容器注册组件，默认是单实例
		Pet tom01 = run.getBean("tom", Pet.class);
		Pet tom02 = run.getBean("tom", Pet.class);
		System.out.println(tom01 == tom02); //输出：true

		//证明IOC容器中也会生成配置类的实例
		MyConfig config = run.getBean(MyConfig.class);
		System.out.println(config); //输出：com.atguigu.config.MyConfig$$EnhancerBySpringCGLIB$$9b8399d3@f88bfbe

		//证明@Configuration注解中有一个proxyBeanMethods值，该值默认为true，该作用是表示通过IOC容器获得到的MyConfig实例，调用@Bean标注的方法所得到的实例都是容器中的实例，而不会单独new一个新实例
		User user1 = config.user01();
		User user2 = config.user01();
		System.out.println(user1 == user2); //输出：true

		//证明单独通过new得到的MyConifg, 调用@Bean标注的方法所得到的实例都是容器中的实例，会单独new一个新实例
		MyConfig config1 = new MyConfig();
		User user3 = config1.user01();
		System.out.println(user1 == user3); //输出：false

		//证明@Import({类名.class, ...})能给容器中自动添加指定的组件
		Student stu = run.getBean(Student.class);
		System.out.println(stu);// 输出：com.atguigu.bean.Student@ed91d8d

		//证明通过@Import({类名.class, ...})给容器中自动添加指定的组件，组件的id默认为全类名
		String[] beanNamesForType = run.getBeanNamesForType(User.class);
		for(String s : beanNamesForType){
			System.out.print(s+"  "); //输出：com.atguigu.bean.User  user01  user4
		}

		//证明@ImportResource("classpath:beans.xml")用于将beans.xml文件中的bean加载到IOC容器中
		User user4 = run.getBean("user4", User.class);
		System.out.println(user4.name); //输出：te
		Pet pet1 = run.getBean("pet1", Pet.class);
		System.out.println(pet1.name); //输出：lll

		//证明@ConfigurationProperties的作用是读取配置文件，通过反射给对象的属性注入值
		Car car = run.getBean(Car.class);
		System.out.println(car.brand+" "+car.price); //输出：BYD 100
	}
}
```

# yaml
springboot支持两种文件类型的配置文件，一种是properties类型，另一种是yaml类型
我们可以同时写上两个配置文件，一个是properties，一种是yaml, 它们都会被springboot读取

注：springboot默认配置文件名为application, 如果是其他名字，springboot会无法识别该文件是配置文件


YAML 是 "YAML Ain't Markup Language"（YAML 不是一种标记语言）的递归缩写。在开发的这种语言时，YAML 的意思其实是："Yet Another Markup Language"（仍是一种标记语言）。 

非常适合用来做以数据为中心的配置文件 

**基本语法**
- `key: value` kv之间有空格 
- 大小写敏感 
- 使用缩进表示层级关系 缩进不允许使用tab，只允许空格 
- 缩进的空格数不重要，只要相同层级的元素左对齐即可 
- '#'表示注释 
- 字符串无需加引号，如果要加，''与""表示字符串内容会被不转义/转义 

**数据类型**
- 字面量：单个的、不可再分的值。date、boolean、string、number、null 
```yaml
k: v
```
- 对象：键值对的集合。map、hash、object 
```yaml
#行内写法:
k: {k1:v1, k2:v2, k3:v3} 
#或
k:
 k1: v1
 k2: v2
 k3: v3
```
- 数组：一组按次序排列的值。array、list、queue 、set
```yaml
#行内写法：
k: [v1, v2, v3]
#或
k:
 - v1
 - v2
 - v3
```

**示例**
```java
@ConfigurationProperties(prefix = "person")
@Component
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class Person {
	private String userName;
	private Boolean boss;
	private Date birth;
	private Pet pet;
	private String[] interests;
	private List<String> animal;
	private Map<String, Object> score;
	private Set<Double> salarys;
	private Map<String, List<Pet>> allPets;
}
```

application.yml
```yaml
person:
  userName: whz
  boss: true
  birth: 1999/03/03
  pet:
    name: dog
  interests: [篮球, 台球]
  animal: [猫, 狗]
  score: {english:90, math:100}
  salarys:
    - 8888.8
    - 9999.9
  allPets:
    sick:
      - {name: 阿猫}
      - {name: 阿狗}
    health:
      - {name: 阿福}
```

**编写配置文件显示提示**
编写自定义的类和配置文件一般没有提示，如想要提示，可以添加如下代码
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```
建议添加如下代码，防止打包项目时把spring-boot-configuration-processor打包进去
```xml
<project>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <excludes>
            <exclude>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-configuration-processor</artifactId>
            </exclude>
          </excludes>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

# web开发
## 静态资源目录
在springboot搭建的web应用中的静态资源目录默认有如下四个
- classpath:/static
- classpath:/public
- classpath:/resources
- classpath:/META-INF/resources
接下来，在main/resources下新建static、public和resources三个文件夹，分别放入a.png、b.png和c.png三张图片，如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409125112.png)

启动项目，分别访问：
```
http://localhost:8083/a.png
http://localhost:8083/b.png
http://localhost:8083/c.png
```
发现都能正常访问相应的图片资源。那么说明，Spring Boot 默认会挨个从 public、resources和static 里面找是否存在相应的资源，如果有则直接返回。

**再例如：**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409125124.png)

访问该empImg目录下的1.png图像的url为`localhost:8080/empImg/1.png`

**设置静态路径目录**
我们可以通过`spring.resources.static-locations=[classpath:/hah/, classpath:/hlll/]`来设置静态资源目录

访问过程：请求过来，看有没有DispatcherServlet能处理，如果没有，则交给静态资源处理器处理，如果静态资源处理器不能处理，则报404

**设置静态资源访问前缀**
默认静态资源访问是`/**`
此时访问静态资源的url: `项目根路径/静态资源名`

我们可以通过`spring.mvc.static-path-patterns=/resources/**`来设置成`/resources/**`
此时访问静态资源的url: `项目根路径/resources/静态资源名`

## 欢迎页面与网页图标的支持
springboot会把自动把静态资源目录下的index.html文件当成欢迎页面
当直接访问项目地址时，会自动跳转到欢迎页面

springboot还自动把静态资源目录下的favicon.ico文件当初网页的图标

# 修改springboot默认配置
一般有如下两种方式：
- **自己手动添加组件，取代springboot自动配置类添加的组件**
springboot首先会加载所有的自动配置类(xxxxxAutoConfiguration.java), 每个自动配置类会根据条件是否成立来注入相应的组件，例如使用`CondiciontalOnMissingBean`注解，即注入组件的条件时IOC容器中没有该要注入的组件

所以如果用户自己手动地向IOC容器中添加了组件，则springboot不会再将相应组件添加到IOC容器中

springboot中的HttpEncodingAutoConfiguration.java自动配置类中添加CharacterEncodingFilter组件代码如下：
```java
@Bean
@ConditionalOnMissingBean
public CharacterEncodingFilter characterEncodingFilter(){...}
```

- 修改配置文件
因为springboot的配置类所要添加的组件，默认都会使用`@ConfigurationProperties`来绑定配置文件的形式给属性注入值。由于我们可以通过修改配置文件，来实现自定义组件的属性。
由于导入的包中配置文件与我们的项目的配置文件是共用的， 所以我们如果想要修改某个属性值，可以直接在自己项目的application.properites或application.yaml文件中添加修改即可

# SpringBoot下开启事务
核心是@EnableTransactionManager注解，该注解即为开启事务管理器。
```java
@Configuration
@EnableTransactionManagement
public class TransactionConfiguration {
 
    @Bean
    @Qualifier("transactionManager")
    public PlatformTransactionManager txManager(@Qualifier("dataSource") DataSource dataSource){
        return new DataSourceTransactionManager(dataSource);
    }
}
```
开启后在需要使用事务的类或方法上标注@Transactional即可。

# springboot 解决跨域
## 1.返回新的CorsFilter(全局跨域)
```java
@Configuration
public class GlobalCorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        //1.添加CORS配置信息
        CorsConfiguration config = new CorsConfiguration();
          //放行哪些原始域
          config.addAllowedOrigin("*");
          //是否发送Cookie信息
          config.setAllowCredentials(true);
          //放行哪些原始域(请求方式)
          config.addAllowedMethod("*");
          //放行哪些原始域(头部信息)
          config.addAllowedHeader("*");
          //暴露哪些头部信息（因为跨域访问默认不能获取全部头部信息）
          config.addExposedHeader("*");

        //2.添加映射路径
        UrlBasedCorsConfigurationSource configSource = new UrlBasedCorsConfigurationSource();
        configSource.registerCorsConfiguration("/**", config);

        //3.返回新的CorsFilter.
        return new CorsFilter(configSource);
    }
}
```
## 2. 重写WebMvcConfigurer（全局跨域）
任意配置类，返回一个新的WebMvcConfigurer Bean，并重写其提供的跨域请求处理的接口，目的是添加映射路径和具体的CORS配置信息。
```java
@Configuration
public class GlobalCorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            //重写父类提供的跨域请求处理的接口
            public void addCorsMappings(CorsRegistry registry) {
                //添加映射路径
                registry.addMapping("/**")
                        //放行哪些原始域
                        .allowedOrigins("*")
                        //是否发送Cookie信息
                        .allowCredentials(true)
                        //放行哪些原始域(请求方式)
                        .allowedMethods("GET","POST", "PUT", "DELETE")
                        //放行哪些原始域(头部信息)
                        .allowedHeaders("*")
                        //暴露哪些头部信息（因为跨域访问默认不能获取全部头部信息）
                        .exposedHeaders("Header1", "Header2");
            }
        };
    }
}
```
## 3. 使用注解（局部跨域）
在方法上（@RequestMapping）使用注解 @CrossOrigin ：
```java
@RequestMapping("/hello")
@ResponseBody
@CrossOrigin("http://localhost:8080") 
public String index( ){
    return "Hello World";
}
```
或者在控制器（@Controller）上使用注解 @CrossOrigin ：
```java
@Controller
@CrossOrigin(origins = "http://xx-domain.com", maxAge = 3600)
public class AccountController {

    @RequestMapping("/hello")
    @ResponseBody
    public String index( ){
        return "Hello World";
    }
}
```

## 4. 手工设置响应头（局部跨域 ）
使用HttpServletResponse对象添加响应头（Access-Control-Allow-Origin）来授权原始域，这里Origin的值也可以设置为`*` ，表示全部放行。
```java
@RequestMapping("/hello")
@ResponseBody
public String index(HttpServletResponse response){
    response.addHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    return "Hello World";
}
```

## spring Security下跨域
<font>在结合spring Security使用跨域配置时，一定要在springsecurity配置中加上cors()来开启跨域</font>
```java
 http.cors()
```

# SpringBoot配置文件加载位置和属顺序
## 读取顺序
在编写SpringBoot主配置文件时，文件名可以是application-{profile}.properties或者application-{profile}.yml，但默认使用application-{profile}.properties的配置。当SpringBoot启动时，会依次扫描以下位置的application.properties或者application.yml文件，来作为SpringBoot的默认配置文件：
1. 第一个位置：当前项目的根文件夹下的config文件夹
```
–file:./config/  
```
2. 第二个位置：当前项目的根文件夹下
```
–file:./	
```
3. 第三个位置：类路径下的config文件夹下
```
–classpath:/config/ 
```
4. 第四个位置：类路径下
```
–classpath:/	
```

具体的路径结构如下图所示：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220219113726.png)

## 注意

1. 四个位置的优先级由高到底，高优先级的配置会覆盖低优先级的配置；
2.SpringBoot会从这四个位置全部加载主配置文件；互补配置；（即有相同的配置，采用高优先级的配置文件，没有相同的配置，都生效）
3. 还可以通过spring.config.location配置项来改变默认的配置文件位置，该作用主要用于：

项目打包好以后，可以使用命令行参数的形式，启动项目的时候来指定配置文件的新位置，指定配置文件和默认加载的这些配置文件共同起作用形成互补配置；

例子如下：如采用F盘下的application.properties文件作为SpringBoot的配置文件

```
java -jar spring-boot-helloworld-quick-SNAPSHOT.jar --spring.config.location=F:/application.properties
```
