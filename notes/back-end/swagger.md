Swagger 是一个规范且完整的框架，用于生成、描述、调用和可视化RESTful风格的 Web 服务。
Swagger 的目标是对`REST API`定义一个标准且和语言无关的接口，可以让人和计算机拥有无须访问源码、文档或网络流量监测就可以发现和理解服务的能力。当通过 Swagger 进行正确定义，用户可以理解远程服务并使用最少实现逻辑与远程服务进行交互。与为底层编程所实现的接口类似，Swagger 消除了调用服务时可能会有的猜测。

**Swagger 的优势**
- 支持 API 自动生成同步的在线文档：使用 Swagger 后可以直接通过代码生成文档，不再需要自己手动编写接口文档了，对程序员来说非常方便，可以节约写文档的时间去学习新技术。
- 提供 Web 页面在线测试 API：光有文档还不够，Swagger 生成的文档还支持在线测试。参数和格式都定好了，直接在界面上输入参数对应的值即可在线测试接口。

# springboot集成Swagger
**在项目中使用Swagger需要如下2个依赖：**
```xml
<!-- swagger2依赖  -->
<dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger2</artifactId>
  <version>2.9.2</version>
</dependency>
<!-- 官方swagger-ui依赖 该依赖的api网页访问路径为localhost:8080/swagger-ui.html  -->
<dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger-ui</artifactId>
  <version>2.9.2</version>
</dependency>

<!-- 第三方swagger-ui依赖 该依赖的api网页访问路径为localhost:8080/doc.html  -->-->
<!-- <dependency>
	<groupId>com.github.xiaoymin</groupId>
	<artifactId>swagger-bootstrap-ui</artifactId>
	<version>1.9.6</version>
</dependency> -->
```

**添加Swagger配置文件**
```java
@Configuration
@EnableSwagger2 // 开启Swagger2
public class SwaggerConfig{
}
```
启动程序，访问`localhost:8080/swagger-ui.html`会出现下面页面：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409123040.png)

## 修改Swagger配置
**SwaggerConfig配置文件**
```java 
@Configuration
@EnableSwagger2 // 开启Swagger2
public class SwaggerConfig {

	//配置Swagger的Docket的bean实例, 对应
	@Bean
	public Docket docket1() {
		//作者信息
		Contact contact = new Contact("whz", "http://naiswang.gitee.io", "1152957995@qq.com");
	  //swagger-ui.html首页中的展现信息
		ApiInfo apiInfo = new ApiInfo(
											 "whz的swaggerAPI文档",
											 "talking is cheap",
											 "v1.0",
											 "https://naiswang.gitee.io",
											 contact,
											 "Apache2.0",
											 "http://www.apache.org/licenses/LICENSE-2.0",
											 new ArrayList());
		return new Docket(DocumentationType.SWAGGER_2)
				.apiInfo(apiInfo)//修改的swagger-ui.html首页中的展现信息
				// .enable(false) //enable()用来设置是否开启Swagger, 如果设为false, 则swagger不能在浏览器中访问
				.groupName("第一个组") //设置这个Docket的分组名， 没有Docket实例可以设置自己的分组名
				/**
				 * 下面的.select().apis().paths()是要连着一起写的。用来设置swagger扫描接口方式
				 */
				.select()
				/**
				 * RequestHandlerSelector: 配置扫描接口的方式, 该类有如下静态方法
				 * basePackget(包全路径): 指定要扫描的包
				 * any(): 扫描全部
				 * none(): 不扫描
				 * withClassAnnotation(能用在类上的注解的class对象): 扫描类上的注解
				 * withClassAnnotation(能用在方法上的注解的class对象): 扫描方法上的注解
				 */
				.apis(RequestHandlerSelectors.basePackage("com.example.swagger2.controller"))
				//.apis(RequestHandlerSelectors.any())
				//.apis(RequestHandlerSelectors.none())
				//.apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))
				//.apis(RequestHandlerSelectors.withMethodAnnotation(RequestMapping.class))
				/**
				 * paths(): 设置过滤路径
				 */
				//.paths(PathSelectors.ant("/example/**"))
				.build();
	}
	@Bean
	public Docket docket2(){
		return new Docket(DocumentationType.SWAGGER_2).groupName("第二个组");
	}
}
```
**Controller层**
```java
@Api(tags="HelloworldController")
@RestController
public class HelloworldController {

	@ApiOperation("这是/hello的api") //这个注解是给api添加注释的
	@RequestMapping("/hello")
	public String hello(){
		return "hello";
	}

	//只要我们的Controller方法的返回值存在实体类，这个实体类就会添加到swaggger的models中
	@PostMapping(value="/user")
	public User user(){
		return new User();
	}

	@GetMapping("/hello1")
	public String hello1(@ApiParam("这是用户名") String username){ // @ApiParam注解是给参数添加注释的
		return "hello" + username;
	}
}
```
**Pojo**
```java
//@Api("文档说明") //与@ApiModel()功能一样
@ApiModel("这是个User类") // 设置User类被添加到swagger中Models后的User类的文档说明。
public class User {

	@ApiModelProperty("这是User类的用户名") //设置User类被添加到swagger中Models后的name属性的文档说明
	private String name;

	@ApiModelProperty("这是User类的年龄") // 设置User类被添加到swagger中Models后的age属性的文档说明
	private int age;

	public User(){ }
	public User(String name, int age){
		this.name = name;
		this.age = age;
	}
	public int getAge() {return age;}
	public String getName() { return name; }
}
```
效果如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409123052.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409123102.png)

## swagger包含的注解
### @Api
- 作用：用来指定接口的描述文字
- 修饰范围：作用在类上
```java
@Api(tags = "短信Controller")
@RestController
public class TestController {
    ....
}
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409123113.png)

### @ApiOperation
- 作用：用来对接口中具体方法做描述
- 修饰范围：作用在方法上
```java
@ApiOperation(value = "接口总体描述",notes = "<span style='color:red;'>详细描述：</span>&nbsp;方法详细描述信息")
@GetMapping("/")
public String login(String... index) {
    return "Hello login ~";
}
```
- value：用来对接口的总体描述
- notes：用来对接口的详细描述


![](https://raw.githubusercontent.com/NaisWang/images/master/20220409123123.png)

### @ApiImplicitParams
- 作用：用来对接口中参数进行说明
- 修饰范围：作用在方法上
- 参数：@ApiImplicitParam数组

#### @ApiImplicitParam
- 作用：修饰接口方法里面的参
- 修饰范围：作用方法上
- 参数：
  - name：方法参数名称
  - value：方法参数的描述
  - dataType：方法参数数据类型
  - defaultValue ：方法参数默认值（给测试人员做测试用的）
  - paramType ：
    - 默认query：对应方式一
    - path：对应方式二
    - body：对应方式三

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409123132.png)

**方式一：url？id=1&user='qlh'后面参数**
```js
@ApiOperation(value = "接口总体描述", notes = "<span style='color:red;'>详细描述：</span>&nbsp;方法详细描述信息")
@ApiImplicitParams({
        @ApiImplicitParam(name = "username", value = "用户名", dataType = "String", defaultValue = "qlh"),
        @ApiImplicitParam(name = "password", value = "密码", dataType = "String", defaultValue = "123")
})
@PostMapping("/")
public String login(String username, String password) {
    return "Hello login ~";
}
```

**方式二：url/1/2路径后 传参 在路径中获取参数**
```java
@ApiOperation(value = "接口总体描述", notes = "<span style='color:red;'>详细描述：</span>&nbsp;方法详细描述信息")
@ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "id", dataType = "String", defaultValue = "qlh",paramType = "path"),
        @ApiImplicitParam(name = "name", value = "姓名", dataType = "String", defaultValue = "123",paramType = "path")
})
@PostMapping("/index/{id}/{name}")
public String index(@PathVariable("id") String id, @PathVariable("name") String name) {
    return "Hello World ~";
}
```

**方式三：在body中传参**
```java
@ApiOperation(value = "接口总体描述", notes = "<span style='color:red;'>详细描述：</span>&nbsp;方法详细描述信息")
@ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "id", dataType = "String", defaultValue = "xxx", paramType = "body"),
        @ApiImplicitParam(name = "name", value = "姓名", dataType = "String", defaultValue = "123", paramType = "body")
})
@PostMapping("/index")
public String index(@RequestBody Map<String, Object> map) {
    return "Hello World ~";
}
```
### @ApiResponses
- 作用：用于接口的响应结果
- 修改范围：作用在接口方法上
- 参数：@ApiResponse数组
```java
@ApiResponses({
        @ApiResponse(),
        @ApiResponse(),
        ...
})
```
### @ApiResponse
- 作用：在ApiResponses里面对响应码以及响应内容进行设置
- 修饰范围：作用接口方法上
- 参数：
  - code：响应状态码
  - message：响应状态码对应的响应内容

```java
@ApiResponse(code = 10001, message = "签名错误"),
@ApiResponse(code = 10002, message = "sql错误"),
@ApiResponse(code = 10003, message = "服务怠机,请稍后重试"),
```

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409123141.png)

### @ApiIgnore
- 作用：忽略类，方法，参数。（忽略的意思：在swagger-ui.html中不显示）
- 修改范围：作用在类，方法，参数上
```java
@ApiIgnore
```

### @ApiModel
- 作用：用来对实体类进行说明
- 修饰范围：作用在类上
```java
@ApiModel(value="类名",description = "实体类描述")
```

### @ApiModelProperty
- 作用：用来对实体类中的属性进行说明
- 修饰范围：作用在类中的属性上
```java
@ApiModelProperty(value = "类属性描述",required = true,example = "属性举例",notes = "备注")
```

# Swagger配置鉴权token
众所周知swagger在API文档生成及测试方面非常方便，但是很多的API调用都需要用到token验证，本文就介绍两中自动添加token的方法。以下的配置代码都是在swagger config类里边。

**全站统一header设置**
在swagger UI上出现一个Authorize按钮，一次输入header参数，全站使用。
```java
	@Bean
	public Docket createRestApi(){
		return new Docket(DocumentationType.SWAGGER_2)
							.apiInfo(apiInfo())
							.select()
							.apis(RequestHandlerSelectors.basePackage("com.example.server.controller"))
							.paths(PathSelectors.any())
							.build()

							//全站统一header设置
							.securityContexts(securityContexts())
							.securitySchemes(securitySchemes());

	}

	private ApiInfo apiInfo(){
		return new ApiInfoBuilder()
				.title("云E办接口文档")
				.description("云E办接口文档")
				.contact(new Contact("xxxx", "http://localhost:8081/doc.html", "xxx@xxx.com"))
				.version("1.0")
				.build();
	}

	/**
	*下面四个方法都是用于全站统一header设置
	*/
	private List<ApiKey> securitySchemes(){
		//设置请求头信息
		List<ApiKey> result = new ArrayList<>();
		ApiKey apiKey = new ApiKey("Authorization", "Authorization", "Header");
		result.add(apiKey);
		return result;
	}

	private List<SecurityContext> securityContexts(){
		//设置需要登陆认证的路径
		List<SecurityContext> result = new ArrayList<>();
		result.add(getContextByPath("/hello/.*"));
		return result;
	}

	//注：此处的SecurityContext是springfox.documentation.spi.service.contexts包下的
	private SecurityContext getContextByPath(String pathRegex){
		return SecurityContext.builder()
				.securityReferences(defaultAuth())
				.forPaths(PathSelectors.regex(pathRegex))
				.build();
	}

	private List<SecurityReference> defaultAuth(){
		List<SecurityReference> result = new ArrayList<>();
		AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
		AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
		authorizationScopes[0] = authorizationScope;
		result.add(new SecurityReference("Authorization", authorizationScopes));
		return result;
	}

```
重点是在原先swagger的Docket对象后面添加securitySchemes方法与securityContext方法。

统一header字段设置
这样就在每次调用API的时候把Authorization、Authorization作为header内容发送给服务端。服务端就可以用这些字段进行必要的认证。

# 模板
```java
package com.example.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.List;

/**
 * Swagger2配置
 * @author : whz
 */
@Configuration
@EnableSwagger2
public class Swagger2Config {

	@Bean
	public Docket createRestApi(){
		return new Docket(DocumentationType.SWAGGER_2)
							.apiInfo(apiInfo())
							.select()
							.apis(RequestHandlerSelectors.basePackage("com.example.server.controller"))
							.paths(PathSelectors.any())
							.build()

							//全站统一header设置
							.securityContexts(securityContexts())
							.securitySchemes(securitySchemes());

	}

	private ApiInfo apiInfo(){
		return new ApiInfoBuilder()
				.title("机器管理接口文档")
				.description("机器管理接口文档")
				.contact(new Contact("xxxx", "http://localhost:8080/doc.html", "xxx@xxx.com"))
				.version("1.0")
				.build();
	}

	/**
	*下面四个方法都是用于全站统一header设置
	*/
	private List<ApiKey> securitySchemes(){
		//设置请求头信息
		List<ApiKey> result = new ArrayList<>();
		ApiKey apiKey = new ApiKey("Authorization", "Authorization", "Header");
		result.add(apiKey);
		return result;
	}

	private List<SecurityContext> securityContexts(){
		//设置需要登陆认证的路径
		List<SecurityContext> result = new ArrayList<>();
		result.add(getContextByPath("/hello/.*"));
		return result;
	}

	//注：此处的SecurityContext是springfox.documentation.spi.service.contexts包下的
	private SecurityContext getContextByPath(String pathRegex){
		return SecurityContext.builder()
				.securityReferences(defaultAuth())
				.forPaths(PathSelectors.regex(pathRegex))
				.build();
	}

	private List<SecurityReference> defaultAuth(){
		List<SecurityReference> result = new ArrayList<>();
		AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
		AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
		authorizationScopes[0] = authorizationScope;
		result.add(new SecurityReference("Authorization", authorizationScopes));
		return result;
	}
}

```
