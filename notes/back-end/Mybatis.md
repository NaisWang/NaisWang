# MyBatis简介
- MyBatis 是支持定制化 SQL、存储过程以及高级映射的优秀的持久层框架。
- MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。
- MyBatis可以使用简单的XML或注解用于配置和原始映射，在实际开发中，常用xml方式，因为sql语句经常变化，如果用注解的话，是将sql语句写在类里面，从而导致每次修改sql语句，都要找到对应的类。将接口和Java的POJO（Plain Old Java Objects，普通的Java对象）映射成数据库中的记录
- MyBatis是一个半自动的ORM(Object Relation Mapping)框架

## Mybatis历史
原是Apache的一个开源项目iBatis, 2010年6月这个项目由Apache Software Foundation 迁移到了Google Code，随着开发团队转投Google Code旗下， iBatis3.x正式更名为MyBatis ，代码于2013年11月迁移到Github（下载地址见后）。iBatis一词来源于“internet”和“abatis”的组合，是一个基于Java的持久层框架。 iBatis提供的持久层框架包括SQL Maps和Data Access Objects（DAO）

## 现有持久化技术对比
1. JDBC
– SQL夹在Java代码块里，耦合度高导致硬编码内伤
– 维护不易且实际开发需求中sql是有变化，频繁修改的情况多见 
2. Hibernate和JPA
– 长难复杂SQL，对于Hibernate而言处理也不容易
– 内部自动生产的SQL，不容易做特殊优化。
– 基于全映射的全自动框架，大量字段的POJO进行部分映射时比较困难。导致数据库性能下降。
3. MyBatis
- 对开发人员而言，核心sql还是需要自己优化
- sql和java编码分开，功能边界清晰，一个专注业务、一个专注数据。

# HelloWorld
1. 导入jar
myBatis.jar, mysql-connector-java.jar, log4j.jar
2. 创建MyBatis的核心(全局)配置文件MyBatis-config.xml，并配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org//dtd//mybatis-3.config.dtd">
<configuration>
	<!-- 设置连接数据库的环境
		可以在<environments>标签下配置多个连接数据库的环境，通过default属性来配置使用哪个环境
		transactionManager, dataSource都必须要有
	 -->
	 <environments default="development">
		<environment id="development">
			<!-- 该标签type有两个值：JDBC,  MANAGED -->
			<!-- JDBC: 使用JDBC原生的事务管理方式，即提交和回滚都需要受体处理 -->
			<transactionManager type="JDBC"/>
			<!-- 该标签type有三个值：POOLED, UNPOOLED, JNDI -->
			<dataSource type="POOLED">
				<property name="driver" value="com.mysql.jdbc.Driver" />
				<property name="url" value="jdbc:mysql://localhost:3306/ssm?serverTimezone=UTC" />
				<property name="username" value="root" />
				<property name="password" value="123456" />

			</dataSource>
		</environment>
	</environments>

	<!-- 引入映射文件 -->
	<mappers>
		<mapper resource="UserMapper.xml"/>
	</mappers>
</configuration>
```
3. 创建mapper接口
```java
package com.atguigu.mapper

public interface UserMapper {
	User getUserById(String uid);
}
```
4. 创建映射文件XXXMapper.xml, 并配置. 
实现XXXMaper.xml与mapper接口两个绑定:
(1) 接口全限定名要和映射文件的namespace保持一致
(2) 接口中方法名和SQL语句的id保持一致
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.atguigu.mapper.UserMapper">
	<select id="getUserById" resultType="com.atguigu.bean.User"> 
		select * from user where uid = #{id}
	</select>
</mapper>
```
5. 获取mybatis操作数据库的会话对象sqlSession
```java
public void test() throws IOException{
	//获取会话对象sqlSession
	InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
	SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(is);
	SqlSession sqlSession = sqlSessionFactory.openSession();
	try{
		//getMapper()的作用：通过动态代理动态生成UserMapper的代理实现类
		UserMapper mapper = sqlSession.getMapper(UserMapper.class);
		System.out.println(mapper.getClass().getName());
		User user = mapper.getUserById("1");
		System.out.println(user);
	}finally{
		sqlSession.close();
	}
}
```
SqlSession 的实例不是线程安全的，因此是不能被共享的。 SqlSession每次使用完成后需要正确关闭，这个关闭操作是必须的
SqlSession可以直接调用方法的id进行数据库操作，但是我们一般还是推荐使用SqlSession获取到Dao接口的代理类，执行代理对象的方法，可以更安全的进行类型检查操作

# MyBatis全局配置文件
MyBatis 的配置文件包含了影响 MyBatis 行为甚深的设置（settings）和属性（properties）信息。文档的顶层结构如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124807.png)

## properties属性
xml中使用${}方式获取property值: 使用`<properties>`标签
第一种方式, 直接设置
```xml
<properties>
	<property name="jdbc.driver" value="com.mysql.jdbc.Driver"/>
</properties>

<property name="driver" value="${jdbc.driver}" />
```

第二种方式：创建properties文件
```property
jdbc.driver=com.mysql.jdbc.Driver
```
```xml
<!-- resource: 在类路径下访问资源文件
	 url: 在网络路径或磁盘路径下访问资源文件-->
<properties resources="jdbcProperties"></properties>

<property name="driver" value="${jdbc.driver}" />
```

## setting属性
这是 MyBatis 中极为重要的调整设置，它们会改变MyBatis 的运行时行为。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124815.png)

```xml
<settings>
	<setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```

## typeAliases别名处理器
类型别名是为 Java 类型设置一个短的名字，可以方便我们引用某个类。
```xml
<typeAliases>
	<typeAlias type="com.atguigu.bean.Employee" alias="employee"/>
</typeAliases>
```
类很多的情况下，可以批量设置别名这个包下的每一个类创建一个默认的别名，就是简单类名小写。
```xml
<typeAliases>
	<package name="com.atguigu.bean" />
</typeAliases>
```
也可以使用@Alias注解为其指定一个别名
```java
@Alias("emp")
public class Employee{
```

## typeHandlers类型处理器
无论是 MyBatis 在预处理语句（PreparedStatement）中设置一个参数时，还是从结果集中取出一个值时， 都会用类型处理器将获取的值以合适的方式转换成 Java 类型。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124825.png)

### 日期类型的处理
日期和时间的处理，JDK1.8以前一直是个头疼的问题。我们通常使用JSR310规范领导者Stephen Colebourne创建的Joda-Time来操作。1.8已经实现全部的JSR310规范了。
日期时间处理上，我们可以使用MyBatis基于JSR310（Date and Time API）编写的各种日期时间类型处理器。 MyBatis3.4以前的版本需要我们手动注册这些处理器，以后的版本都是自动注册的

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124834.png)

### 自定义类型处理器
我们可以重写类型处理器或创建自己的类型处理器来处理不支持的或非标准的类型。 
• 步骤：
1）实现org.apache.ibatis.type.TypeHandler接口或者继承org.apache.ibatis.type.BaseTypeHandler
2）指定其映射某个JDBC类型（可选操作）
3）在mybatis全局配置文件中注册

## plugins插件
插件是MyBatis提供的一个非常强大的机制，我们可以通过插件来修改MyBatis的一些核心行为。插件通过动态代理机制，可以介入四大对象的任何一个方法的执行。后面会有专门的章节我们来介绍mybatis运行原理以及插件
```java
Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed)
ParameterHandler (getParameterObject, setParameters) 
ResultSetHandler (handleResultSets, handleOutputParameters) 
StatementHandler (prepare, parameterize, batch, update, query)
```

## environments环境
MyBatis可以配置多种环境，比如开发、测试和生产环境需要有不同的配置。
每种环境使用一个environment标签进行配置并指定唯一标识符
可以通过environments标签中的default属性指定一个环境的标识符来快速的切换环境
其中transactionManager, dataSource必须要配置，否则会报错

### transactionManager
type： JDBC | MANAGED | 自定义
– JDBC：使用了 JDBC 的提交和回滚设置，依赖于从数据源得到的连接来管理事务 JdbcTransactionFactory
– MANAGED：不提交或回滚一个连接、让容器来管理事务的整个生命周期（比如 JEE 应用服务器的上下文）。 ManagedTransactionFactory
– 自定义：实现TransactionFactory接口，type=全类名/别名

### dataSource
type： UNPOOLED | POOLED | JNDI | 自定义
– UNPOOLED：不使用连接池，UnpooledDataSourceFactory
– POOLED：使用连接池， PooledDataSourceFactory
– JNDI： 在EJB 或应用服务器这类容器中查找指定的数据源
– 自定义：实现DataSourceFactory接口，定义数据源的获取方式。

• 实际开发中我们使用Spring管理数据源，并进行
事务控制的配置来覆盖上述配置

## databaseIdProvider环境
MyBatis 可以根据不同的数据库厂商执行不同的语句。
```xml
<!-- type="DB_VENDOR"：vendorDatabaseIdProvider, 作用就是得到数据库厂商的标识(驱动getDatabaseProductName())， mybatis就能根据数据库厂商标识来执行不同的sql
MySQL, Oracle, SQL Server,... -->
<databaseIdProvider type="DB_VENDOR">
	<!-- 为不同的数据库厂商起别名 -->
	<property name="MySQL" value="mysql"/>
	<property name="Oracle" value="oracle"/>
	<property name="SQL Server" value="sqlserver"/>
</databaseIdProvider>
```

- Type： DB_VENDOR
使用MyBatis提供的VendorDatabaseIdProvider解析数据库厂商标识。也可以实现DatabaseIdProvider接口来自定义。 
  - Property-name：数据库厂商标识
  - Property-value：为标识起一个别名，方便SQL语句使用databaseId属性引用

使用：通过databaseId属性
```xml
<select id="getEmpsByDeptId" resultType="Emp" databaseId="mysql">
  ...
</select>
```

## mapper映射
将sql映射到全局配置中
- 注册配置文件
resource: 引用类路径下的sql映射文件，例：mybatis/mapper/EmpMapper.xml
url: 引用网络路径或磁盘路径下的sql文件， 例：file://var/mappers/EmpMapper.xml
- 注册接口
class: 引用(注册)接口
  - 有sql映射文件，映射文件名必须哟啊和接口同名，并且放在与接口同一目录下
  - 没有sql映射文件，所有的sql都是利用注解写在接口上
```xml
<mapper class="com.atguigu.mybatis.EmpMapper>
```
- 批量注入
```xml
<mappers>
	<package name="com.atguigu.dao"/>
</mappers>
```
这种方式要求SQL映射文件名必须和接口名相同并且在同一目录下

# MyBatis-映射文件
映射文件指导着MyBatis如何进行数据库增删改查，有着非常重要的意义；
- cache –命名空间的二级缓存配置
- cache-ref – 其他命名空间缓存配置的引用。
- resultMap – 自定义结果集映射
- parameterMap – 已废弃！老式风格的参数映射
- sql –抽取可重用语句块。
- insert – 映射插入语句
- update – 映射更新语句
- delete – 映射删除语句
- select – 映射查询语句

## insert、update、delete元素

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124843.png)

## CRUD
Emp.java
```java
public class Emp {
	private Integer eid;
	private String ename;
	private int age;
	private String sex;
	/**set, get, constructor**/
}
```

EmpMapper.java
```java
public interface EmpMapper {
	/**
 	 * 返回值可以设置为int， 此时返回的结果结果表示受影响的行数
	 *       可以设置boolean， 此时表示操作是否成功
	 */
	//根据eid查询一个员工信息
	Emp getEmpByEid(String eid);
	//获取所有的员工信息
	List<Emp> getAllEmp();
	//添加所有员工信息
	void addEmp(Emp emp);
	//修改员工信息
	void updateEmp(Emp emp);
	//删除员工信息
	void deleteEmp(String eid);

}
```
EmpMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mybatis.mapper.EmpMapper">
    <select id="getEmpByEid" resultType="emp">
        select eid, ename, age, sex from emp where eid = #{eid}
    </select>
    <select id="getAllEmp" resultType="emp">
        selecte id, ename, age, sex from emp
    </select>
    <insert id="addEmp">
        insert into emp value(null, #{ename}, #{age}, #{sex})
    </insert>
    <update id="updateEmp">
        update emp set ename = #{ename},age= #{age},sex=#{sex} where eid = #{eid}
    </update>
    <delete id="deleteEmp">
        delete from emp where eid = #{eid}
    </delete>
</mapper>
```

Test.java
```java
@Test
public void test1() throws IOException {
	InputStream resourceAsStream = Resources.getResourceAsStream("mybatis-config.xml");
	SqlSessionFactory build = new SqlSessionFactoryBuilder().build(resourceAsStream);
	SqlSession sqlSession = build.openSession();
	EmpMapper empMapper = sqlSession.getMapper(EmpMapper.class);

	Emp emp = empMapper.getEmpByEid("2");
	System.out.println(emp);

	List<Emp> list = empMapper.getAllEmp();
	System.out.println(list);

	empMapper.addEmp(new Emp(null, "admin", 23, "man"));
	sqlSession.commit();//手动提交事务
	System.out.println(list);

	empMapper.updateEmp(new Emp(2, "zhang", 33, "woman"));
	sqlSession.commit();//手动提交事务

	empMapper.deleteEmp("5");
	sqlSession.commit();//手动提交事务
}
```

## 主键生成方式
若数据库支持自动生成主键的字段（比如 MySQL 和 SQL Server），则可以设置useGeneratedKeys=”true”，然后再把keyProperty 设置到目标属性上。
```xml
<insert id="insertCustomer" databaseId="mysql" useGeneratedKeys="true" KeyProperty="id">
	insert into emp(name, email, age) values (#{name}, #{email}, #{age})
</insert>
```

而对于不支持自增型主键的数据库（例如Oracle），Oracle使用序列来模拟自增。 每次插入的数据的主键是从序列中拿到的值。则可以使用 selectKey 子元素：selectKey元素将会首先运行，id 会被设置，然后插入语句会被调用
```xml
<insert id="insertCustomer" databaseId="oracle">
	<!-- keyProperty的作用：将执行的sql语句的返回结果赋值给javaBean中的哪个属性 
	    order的作用： 用来设置<selectKey>标签的执行时间，有两个值，分别是before与after；before表示在插入sql语句之前执行；after表示在出入sql语句之后执行
		resultType的作用： sql语句的返回结果的类型-->
	<selectKey order="BEFORE" keyProperty="id" resultType="_int">
		<!-- 获取dual数据库中crm表中的下一个序列号 -->
		select crm_seq.nextval from dual
	</selectKey>
	<!-- 下面的#{id}的值，就是从上面得到的 -->
	insert into customers2 (id, last_name, emial, age) values (#{id}, #{lastName}, #{email}, #{age})
</insert>
```

## 参数取值
- #{ }是预编译处理，MyBatis在处理#{ }时，它会将sql中的#{ }替换为？，然后调用PreparedStatement的set方法来赋值，传入字符串后，会在值两边加上单引号，如上面的值 “4,44,514”就会变成“ '4,44,514' ”；
- \${ }是字符串替换， MyBatis在处理\${ }时,它会将sql中的${ }替换为变量的值，底层使用的是Statement。 传入的数据不会加两边加上单引号。
注意：使用${ }会导致sql注入，不利于系统的安全性！

大多情况下，我们取参数值应使用#{}， 但在原生jdbc不支持占位符的地方，我们只能使用${}进行取值，例如表名不支持占位符，所以我们在查询表中的信息时，表名的取值只能为\${}, 即select * from ${table} 

## 参数传递
- 单个参数：mybatis不会做任何处理
#{}可以以任意的名字获取参数值
${}只能以`${value}`或`${_parameter}`获取

- 多个参数：mybatis会做特殊处理
任意多个参数，都会被MyBatis重新包装成一个Map传入。Map的key是param1，param2或者0，1…，值就是参数的值
#{}：可以通过#{0}, #{1}.. 或 #{param1}, #{param2}
`${}`: 只可以通过`${param1}, ${param2}`..

- 命名参数：为参数使用@Param起一个名字，MyBatis就会将这些参数封装进map中，key就是我们自己指定的名字
多个参数同样会被封装成一个map，但此时，map的key可以是@Param注解指定的值
#{}与${}都可以通过键的名字直接获取值，但是要注意\${}的单引号问题

- POJO： 如果多个参数正好是我们业务逻辑的数据模型，我们就可以直接传入pojo
#{pojo的属性名}：取出传入的pojo的属性值
#{}与${}都可以通过属性名直接获取属性值，但是要注意\${}的单引号问题

- Map： 如果多个参数不是我们业务逻辑的数据模型，没有对应的pojo,我们可以传入Map
#{}和${}都可以通过键的名字直接获取值

- List、Set、数组：mybatis会做特殊处理，都会被MyBatis重新包装成一个Map传入。List以list为键，list[0]为键1，list[2]为键二...。Array以array为键. array[0]为键1，array[1]为键2...
我们可以通过@Param修改键名，例如`void deleteMoreByList(@Param("eids")List<Integer> eids)`，此时eids[0]为键...
[有关此点注意的地方](#one)
${list[0]}, ${list[0]}...
${array[0]}, ${array[0]}...

## select元素
Select元素来定义查询操作。
- Id：唯一标识符。用来引用这条语句，需要和接口的方法名一致
- parameterType：参数类型。 可以不传，MyBatis会根据TypeHandler自动推断
- resultType：返回值类型。 别名或者全类名，如果返回的是集合，定义集合中元素的类型。不能和resultMap同时使用

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124852.png)

### select查询的几种情况
```java
//1. 查询单行数据返回单个对象
public Employee getEmployeeById(integer id);

//2. 查询多行数据返回对象的集合
public List<Employee> getAllEmps();

//3. 查询当行数据返回Map集合
public Map<String, Object> getEmployeeByIdReturnMap(Integer id);

//4. 查询多行数据返回Map集合
@MapKey("id")  //指定使用对象的那个属性来充当map的key
public Map<Integer, Employee> getAllEmpsReturnMap();
```

### 自动映射resultMap
- 全局setting设置
autoMappingBehavior默认是PARTIAL，开启自动映射的功能, 此时唯一的要求是列名和javaBean属性名一致，如果autoMappingBehavior设置为null则会取消自动映射。数据库字段命名规范，POJO属性符合驼峰命名法，比如说数据库中字段为last_name,而实体类的属性为lastName。我们可以开启自动驼峰命名规则映射功能，mapUnderscoreToCamelCase=true，默认是开启的。
- 自定义resultMap，实现高级结果集映射

#### resultMap
- id： 用来设置主键的映射关系，底层会优化
- result: 设置非主键的映射关系
- association – 一个复杂的类型关联;许多结果将包成这种类型嵌入结果映射 – 结果映射自身的关联,或者参考一个
- collection：专门用于处理一对多和多对多的关系
```xml
<!-- 自定义某个javaBean的封装规则
	type: 需要自定义映射规则的java类型
	id：唯一id -->
<resultMap type="com.atguigu.mybatis.bean.Emp" id="MyEmp">
	<!-- 指定主键列的封装规则
	   id：定义主键会底层优化
	   column: 指定哪一列
	   property: 指定对应的JavaBean属性 -->
	   <id column="id" property="id"/>
	   <!-- 定义普通列封装规则 -->
	   <result column="last_name" property="lastName"/>

	   <!-- 将Emp中的dept属性中的count属性 对应 表中的dcount列 -->
	   <result column="dcount" property="dept.count"/>


	   <!-- 把Dept中的did属性did属性 对应 表中的did列, 把dname属性 对应 表中的dname列
	        然后把Emp中的dept属性 对应 Dept-->
	   <association property ="dept" javaType="com.atguigu.mybatis.bean.Dept">
			<id column="did" property="did"/>
			<result column="dname" property="dname"/>	
	   </association>

	   <!-- select: 分步查询的SQL的id， 即 接口的全限定名.方法名, 或者是当前xml文件中selct或者sql标签的id
	        column: 即将指定列的值传入目标方法中，注：此列必须在第一次sql查询中查询过，否则会报错 -->
	   <association property ="school" select="com.atguitu.mapper.DeptMapper.getSchoolByDid" column="sid"/>
	   <collection property ="compa" select="com.atguitu.mapper.CompaMapper.getCompaByDid" column="cid"/>

     <collection property="children" ofType="resAll" select="selectRecursionRes" column="{resID=resID,belongTo=belongTo}"/>

	   <!-- 其他不指定的列会自动封装 -->
</resultMap>

<!-- resultMap: 自定义结果集映射规则 -->
<select id="getEmpById" resultMap="MyEmp">
	select * from emp where id=#{id}
</select>
```

#### resultMap继承
```xml
<resultMap id="CocBeanResult" type="CocBean">  
    <result property="name" column="NAME"/>  
    <result property="volume" column="VOLUME"/>  
</resultMap>

//继承CocBeanResult中的映射关系
<resultMap id="simpleRow" type="CocTreeNode" extends="CocBeanResult">  
    <result property="level1" column="LEVEL1"/>  
    <result property="level2" column="LEVEL2"/>  
</resultMap>
```

#### Subquery
Subquery/Inner query/Nested query is a query within another SQL query and embedded within the WHERE clause.
```sql
select * from author where userID in (select id from user)
```
So there are in fact two statements here. Let’s define each select statement and resultMap:

```sql
<resultMap id="AuthorSubMap" type="Author">
	<id property="id" column="author.id" />
	<result property="realName" column="realName" />
	<result property="IDCard" column="IDCard" />
	<association property="user" column="userID" javaType="User" select="findById"/>
</resultMap>
<select id="findById" parameterType="int" resultType="User">
	select * from user where id=#{id}
</select>
<select id="selectAuthorSub" resultMap="AuthorSubMap">
	select * from author 
</select>
```
In the above settings, `<association>` will pass `userID` as parameter to `findById`.

#### collection

`<collection>` element works almost identically to `<association>`. But it is used to map a set of nested results like List.

专门用于处理一对多和多对多的关系
```xml
<!-- 
	ofType: 指定集合中的类型， 不需要指定JavaType
 -->
<collection property="emps" ofType="Emp">
	<id column="eid" property="eid">
	<result column="ename" property="ename">
	<result column="age" property="age">
</collection>
```
```xml
<collection property="roles" ofType="java.lang.String">
	<constructor>
		<arg column="roles"/>
	</constructor>
</collection>
```

#### 分步查询延迟加载
只有collection与association标签才能使用分步查询
延时加载是针对分步查询而使用的
开启延时加载后，当使用分段查询时，如果要得到的数据可以不通过执行分布查询的sql而得到， 那么这个分步查询中的sql就不会执行
```xml
<settings>
	<!-- 开启延时加载 -->
	<setting name="lazyLoadingEnabled" value="true"/>

	<!-- 是否按需加载 -->
	<setting name="aggressiveLazyLoading" value="false"/>
</settings>
```
此时所有的分步查询语句都会延时加载
如果你想设置某个分步查询是否延时加载， 你可以通过设置fetchType属性
fetchType属性有两个属性值, 分别是eager(立即加载)与lazy(延时加载)
```xml
<association property ="school" select="com.atguitu.mapper.DeptMapper.getSchoolByDid" column="sid" fetchType="eager"/>
```

#### Result Maps collection does not contain value for错误
**原因1:  resultMap的指向不正确**

例如: 有如下内容:
```xml
<resultMap type="com.atguigu.mybatis.bean.Emp" id="MyEmp">
    ...
</resultMap>

<select id="getEmpById" resultMap="com.atguigu.mybatis.EmpMapper.MyEmp">
   ...
</select>
```
对应以上xml文件，会报错，因为select语句中的resultMap映射不正确，mybatis会找不到`com.atguigu.mybatis.EmpMapper.MyEmp`。使用resultMap映射时，该值应该是resultMap标签的id值。所以正确书写如下:
```xml
<resultMap type="com.atguigu.mybatis.bean.Emp" id="MyEmp">
    ...
</resultMap>

<select id="getEmpById" resultMap="MyEmp">
   ...
</select>
```



### Mybatis返回对象中包含多个List属性
数据库数据
```sql
mysql> select * from ai_user;
+----+-----------+--------+
| id | user_name | status |
+----+-----------+--------+
|  1 | Answer    |      1 |
|  2 | Iris      |      1 |
+----+-----------+--------+

mysql> select * from ai_name;
+---------+-----------+
| user_id | user_name |
+---------+-----------+
|       1 | Answer    |
|       1 | AI        |
|       1 | AAL       |
|       2 | Iris      |
|       2 | Ellis     |
|       2 | Monta     |
+---------+-----------+

mysql> select * from ai_role;
+---------+-----------------+
| user_id | role_name       |
+---------+-----------------+
|       1 | Admin           |
|       1 | Manager         |
|       1 | Coder           |
|       2 | CustomerService |
+---------+-----------------+
```

实体类
```java
@Data
public class User {
    private Long id;
    private List<String> names;
    private List<String> roles;
}
```

Mapper 层
```java
public interface UserMapper {
    List<User> queryUsers();
}
```

Mapper Sql 映射文件
```xml
<resultMap id="UserMap" type="User">
   <result column="id" property="id" jdbcType="BIGINT" />
    <collection property="names" resultMap="NamesMap" />
    <collection property="roles" resultMap="RolesMap" />
</resultMap>

<resultMap id="NamesMap" type="string">
    <result column="user_name" />
</resultMap>

<resultMap id="RolesMap" type="string">
    <result column="role_name" />
</resultMap>

<select id="queryUsers" resultMap="UserMap">
	SELECT au.id, an.user_name, ar.role_name
    FROM ai_user au
    LEFT JOIN ai_name an ON an.user_id = au.id
    LEFT JOIN ai_role ar ON ar.user_id = au.id
</select>
```

结果输出示例
```txt
{"id":1,"names":["Answer","AI","AAL"],"roles":["Admin","Manager","Coder"]}
{"id":2,"names":["Iris","Ellis","Monta"],"roles":["CustomerService"]}
```

# resultType对应的类中必须要有无参构造方法以及get/set方法
mybatis的返回值的封装方式是先构造一个无参的对象，然后通过set方法一个一个的往里面set值，所以如果不提供无参构造方法，就会报错，同样的，针对需要的属性值也**必须提供get/set方法。**
	
# 动态SQL
动态 SQL是MyBatis强大特性之一。极大的简化我们拼装SQL的操作。
动态 SQL 元素和使用 JSTL 或其他类似基于 XML 的文本处理器相似。
MyBatis 采用功能强大的基于 OGNL 的表达式来简化操作。

## if，where
```xml
<select id="getEmpWhereIf" resultType="com.atguigu.bean.Employee">
	select * from employee where 1=1
	<if test ="id!=null">
		and id=#{id}
	</if>
	<if test="lastName!=null and lastName != ''">
		and lastName= #{lastName}
	</if>
	<if test = "gender==0 or gender==1">
		gender = #{gender}
	</if>
</select>
```
上面写where 1=1 的原因是为了防止出现id==null时，其sql语句为where and ....
解决这个问题，我们除了可以使用添加1=1的方法，我们还可以使用\<where>标签
\<where>的作用：添加where关键字，同时去掉多余的and
```xml
<select id="getEmpWhereIf" resultType="com.atguigu.bean.Employee">
	select * from employee
	<where>
		<if test ="id!=null">
			and id=#{id}
		</if>
		<if test="lastName!=null and lastName != ''">
			and lastName= #{lastName}
		</if>
		<if test = "gender==0 or gender==1">
			gender = #{gender}
		</if>
	</where>
</select>
```

## trim
`trim prefix="" suffix="" prefixOverrides="" suffixOverrides="">`: 截取并拼接
prefix: 在操作的sql语句前加入某些内容
suffix: 在操作的sql语句后加入某些内容
prefixOverrides: 在操作的sql语句前的某些内容去掉
suffixOverrides: 在操作的sql语句后的某些内容去掉
```xml
<select id="getEmpWhereIf" resultType="com.atguigu.bean.Employee">
	select * from employee
	<trim prefix="where" suffixOverrides="and|or">
		<if test ="id!=null">
			id=#{id} and
		</if>
		<if test="lastName!=null and lastName != ''">
			lastName= #{lastName} or
		</if>
		<if test = "gender==0 or gender==1">
			gender = #{gender}
		</if>
	</where>
</select>
```

## set
set的主要用于解决修改操作中sql语句中可能出现逗号的问题
```xml
<update id="updateEmpByConditionSet">
	update employee
	<set>
		<if test="lastName!=null &amp;&amp; lastName!=&quot;&quot;">
			lastName=#{lastName},
		</if>
		<if test="email!=null and email.trim()!=''">
			email=#{email}
		</if>
	</set>
	where id = #{id}
</update>
```

## choose（when, otherwise）
chose主要用于分支判断，类似于java中的switch case, 只会满足所有分支中的一个
```xml
<insert id="insertEmp">
	insert into emp values(
		null,
		#{ename},
		#{age},
		<choose> <!-- 选择某一个when或otherwise拼接SQL -->
			<when test="sex==0">'女'</when>
			<when test="sex==1">'男'</when>
			<otherwise>'不详'</otherwise><!-- 当when都不符合条件，就会选择otherwise拼接SQL -->
		</choose>
	)
</insert>
```

## foreach
`<foreach collection="" item="" close="" open="" separator="" index=""></foreach>`：对一个数组或集合进行遍历
collection: 指定要遍历的集合或数组
item: 设置别名
close: 设置循环体的结束内容
open: 设置循环体的开始内容
separator: 设置每一次循环之间的分隔符
index: 若遍历的时list, index代表下标。 若遍历的是map, index代表键

```java
void deleteMoreByList(List<Integer> eids);
```

<span id="one"></span>
```xml
<delete id="deleteMoreByList">
	delete from emp where eid in
	<!-- 注意collection的值是list，而不是eids， 因为当传输参数为List时，mybatis将其放在map中，且以list为键 -->
	<foreach collection="list" item="eid" separator="," open="(" close=")">
		#{eid}
	</foreach>
</delete>
```
> jdbc默认是不能一次执行多条sql语句；如果想要一次执行多条sql语句，则可以在链接地址url后添加参数？allowMultiQueries=true

## sql片段
`<sql  id=""></sql>`: 设置一段sql片段，即公共sql，可以被当前映射文件中所有的sql语句所访问
`<include refid=""></include>`: 访问某个sql片段
```xml
<sql id="empColumns">select eid, ename, age, sex, did from emp</sql>

<select id="getEmpListByMoreTJ" resultType="Emp">
	<include refid="empColumns"></include>
</select>
```

# MyBatis缓存机制
MyBatis 包含一个非常强大的查询缓存特性,它可以非常方便地配置和定制。缓存可以极大的提升查询效率。
MyBatis系统中默认定义了两级缓存。
一级缓存和二级缓存。
- 默认情况下，只有一级缓存（SqlSession级别的缓存，也称为本地缓存）开启。
- 二级缓存需要手动开启和配置，他是基于namespace级别的缓存。
- 为了提高扩展性。MyBatis定义了缓存接口Cache。我们可以通过实现Cache接口来自定义二级缓存

## 一级缓存
一级缓存(local cache), 即本地缓存, 作用域默认为sqlSession。当Session flush 或 close 后, 该Session 中的所有 Cache 将被清空。
本地缓存不能被关闭, 但可以调用 clearCache() 来清空本地缓存, 或者改变缓存的作用域.
在mybatis3.1之后, 可以配置本地缓存的作用域. 在 mybatis.xml 中配置

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124902.png)

同一次会话期间只要查询过的数据都会保存在当前SqlSession的一个Map， 其中key:hashCode+查询的SqlId+编写的sql查询语句+参数

**一级缓存失效的四种情况**
- 不同的SqlSession对应不同的一级缓存
- 同一个SqlSession但是查询条件不同
- 同一个SqlSession两次查询期间执行了任何一次增删改操作
- 同一个SqlSession两次查询期间手动清空了缓存

## 二级缓存
二级缓存(second level cache)，全局作用域缓存
二级缓存默认不开启，需要手动配置
MyBatis提供二级缓存的接口以及实现，缓存实现要求POJO实现Serializable接口
<font color="red">二级缓存在 SqlSession 关闭或提交之后才会生效</font>

**二级缓存开启步骤**
- 全局配置文件中开启二级缓存
```xml
<setting name="cacheEnabled" value="true"/>
```
- 需要使用二级缓存的映射文件处使用cache配置缓存
```xml
<cache />
```
- 注意：POJO需要实现Serializable接口

**二级缓存相关属性**
eviction=“FIFO”：缓存回收策略：
- LRU – 最近最少使用的：移除最长时间不被使用的对象。
- FIFO – 先进先出：按对象进入缓存的顺序来移除它们。
- SOFT – 软引用：移除基于垃圾回收器状态和软引用规则的对象。
- WEAK – 弱引用：更积极地移除基于垃圾收集器状态和弱引用规则的对象。
- 默认的是 LRU。 

flushInterval：刷新间隔，单位毫秒
- 默认情况是不设置，也就是没有刷新间隔，缓存仅仅调用语句时刷新

size：引用数目，正整数
- 代表缓存最多可以存储多少个对象，太大容易导致内存溢出

readOnly：只读，true/false
- true：只读缓存；会给所有调用者返回缓存对象的相同实例。因此这些对象不能被修改。这提供了很重要的性能优势。
- false：读写缓存；会返回缓存对象的拷贝（通过序列化）。这会慢一些，但是安全，因此默认是 false。

**缓存的相关属性设置**
- 全局setting的cacheEnable： 配置二级缓存的开关。一级缓存一直是打开的。 
- select标签的useCache属性：配置这个select是否使用二级缓存。一级缓存一直是使用的 • 3、sql标签的flushCache属性：
- 增删改默认flushCache=true。sql执行以后，会同时清空一级和二级缓存。查询默认flushCache=false。 
- sqlSession.clearCache()： – 只是用来清除一级缓存。 • 5、当在某一个作用域 (一级缓存Session/二级缓存Namespaces) 进行了 C/U/D 操作后，默认该作用域下所 有 select 中的缓存将被clear

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124917.png)

## 第三方缓存整合
EhCache 是一个纯Java的进程内缓存框架，具有快速、精干等特点，是Hibernate中默认的CacheProvider。
MyBatis定义了Cache接口方便我们进行自定义扩展。
**使用EhCache的步骤**
1. 导入ehcache包，以及整合包，日志包
ehcache-core-2.6.8.jar、mybatis-ehcache-1.0.3.jar
slf4j-api-1.6.1.jar、slf4j-log4j12-1.6.2.jar
2. 编写ehcache.xml配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:noNamespaceSchemaLocation="../config/ehcache.xsd">
 <!-- 磁盘保存路径 -->
 <diskStore path="D:\44\ehcache" />
 
 <defaultCache 
   maxElementsInMemory="1" 
   maxElementsOnDisk="10000000"
   eternal="false" 
   overflowToDisk="true" 
   timeToIdleSeconds="120"
   timeToLiveSeconds="120" 
   diskExpiryThreadIntervalSeconds="120"
   memoryStoreEvictionPolicy="LRU">
 </defaultCache>
</ehcache>
 
<!-- 
属性说明：
l diskStore：指定数据在磁盘中的存储位置。
l defaultCache：当借助CacheManager.add("demoCache")创建Cache时，EhCache便会采用<defalutCache/>指定的的管理策略
 
以下属性是必须的：
l maxElementsInMemory - 在内存中缓存的element的最大数目 
l maxElementsOnDisk - 在磁盘上缓存的element的最大数目，若是0表示无穷大
l eternal - 设定缓存的elements是否永远不过期。如果为true，则缓存的数据始终有效，如果为false那么还要根据timeToIdleSeconds，timeToLiveSeconds判断
l overflowToDisk - 设定当内存缓存溢出的时候是否将过期的element缓存到磁盘上
 
以下属性是可选的：
l timeToIdleSeconds - 当缓存在EhCache中的数据前后两次访问的时间超过timeToIdleSeconds的属性取值时，这些数据便会删除，默认值是0,也就是可闲置时间无穷大
l timeToLiveSeconds - 缓存element的有效生命期，默认是0.,也就是element存活时间无穷大
 diskSpoolBufferSizeMB 这个参数设置DiskStore(磁盘缓存)的缓存区大小.默认是30MB.每个Cache都应该有自己的一个缓冲区.
l diskPersistent - 在VM重启的时候是否启用磁盘保存EhCache中的数据，默认是false。
l diskExpiryThreadIntervalSeconds - 磁盘缓存的清理线程运行间隔，默认是120秒。每个120s，相应的线程会进行一次EhCache中数据的清理工作
l memoryStoreEvictionPolicy - 当内存缓存达到最大，有新的element加入的时候， 移除缓存中element的策略。默认是LRU（最近最少使用），可选的有LFU（最不常使用）和FIFO（先进先出）
 -->
```
3. 配置cache标签`<cache type="org.mybatis.caches.ehcache.EhcacheCache"></cache>`

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124929.png)

# MyBatis-逆向工程
MyBatis Generator： • 简称MBG，是一个专门为MyBatis框架使用者定制的代码生成器，可以快速的根据表生成对应的映射文件，接口，以及bean类。支持基本的增删改查，以及QBC风格的条件查询。但是表连接、存储过程等这些复杂sql的定义需要我们手工编写

## MBG使用
**使用步骤：**
- 编写MBG的配置文件（重要几处配置）
  - jdbcConnection配置数据库连接信息
  - javaModelGenerator配置javaBean的生成策略
  - sqlMapGenerator 配置sql映射文件生成策略
  - javaClientGenerator配置Mapper接口的生成策略
  - table 配置要逆向解析的数据表
	- tableName：表名
    - domainObjectName：对应的javaBean名 
- 运行代码生成器生成代码

**注意：**
Context标签
targetRuntime=“MyBatis3“可以生成带条件的增删改查
targetRuntime=“MyBatis3Simple“可以生成基本的增删改查
如果再次生成，建议将之前生成的数据删除，避免xml向后追加内容出现的问题。

**MBG配置文件**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
  PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
  "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
	<context id="DB2Tables" targetRuntime="MyBatis3">
		<!--数据库连接信息配置  -->
		<jdbcConnection driverClass="com.mysql.jdbc.Driver" connectionURL="jdbc:mysql://localhost:3306/bookstore0629" userId="root" password="123456"></jdbcConnection>

		<!-- javaBean的生成策略 -->
		<javaModelGenerator targetPackage="com.atguigu.bean" targetProject=".\src"> <property name="enableSubPackages" value="true" />
			<property name="trimStrings" value="true" />
		</javaModelGenerator>

		<!-- 映射文件的生成策略 -->
		<sqlMapGenerator targetPackage="mybatis.mapper" targetProject=".\conf"> <property name="enableSubPackages" value="true" /></sqlMapGenerator>

		<!-- dao接口java文件的生成策略 -->
		<javaClientGenerator type="XMLMAPPER" targetPackage="com.atguigu.dao" targetProject=".\src">
			<property name="enableSubPackages" value="true" />
		</javaClientGenerator>

		<!-- 数据表与javaBean的映射 -->
		<table tableName="books" domainObjectName="Book"></table>
	</context>
</generatorConfiguration>
```

**生成器代码**
```java
public static void main(String[] args) throws Exception {
	List<String> warnings = new ArrayList<String>();
	boolean overwrite = true;
	File configFile = new File("mbg.xml");
	ConfigurationParser cp = new ConfigurationParser(warnings);
	Configuration config = cp.parseConfiguration(configFile);
	DefaultShellCallback callback = new DefaultShellCallback(overwrite);
	MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
	myBatisGenerator.generate(null);
}
```

**测试查询：**
QBC风格的带条件查询
```java
@Test
public void test01(){
	SqlSession openSession = build.openSession();
	DeptMapper mapper = openSession.getMapper(DeptMapper.class);
	DeptExample example = new DeptExample();
	//所有的条件都在example中封装
	Criteria criteria = example.createCriteria();
	//select id, deptName, locAdd from tbl_dept WHERE 
	//( deptName like ? and id > ? ) 
	criteria.andDeptnameLike("%部%");
	criteria.andIdGreaterThan(2);
	List<Dept> list = mapper.selectByExample(example);
	for (Dept dept : list) {
		System.out.println(dept);
	}
}
```

**MyBatis-工作原理**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124940.png)

## 通过Mybatis-plus的代码生成器
[官网](https://mp.baomidou.com/guide/generator.html#%E6%B7%BB%E5%8A%A0%E4%BE%9D%E8%B5%96)
**通过Mybatis-plus的三个步骤**
- 引入依赖
```xml
<!-- web依赖  -->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- mysql依赖  -->
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<scope>runtime</scope>
</dependency>
<!-- mybatis-plus依赖   -->
<dependency>
	<groupId>com.baomidou</groupId>
	<artifactId>mybatis-plus-boot-starter</artifactId>
	<version>3.3.1</version>
</dependency>
<!-- mybatis-plus代码生成器依赖  -->
<dependency>
	<groupId>com.baomidou</groupId>
	<artifactId>mybatis-plus-generator</artifactId>
	<version>3.3.1</version>
</dependency>
<!-- mybatis-plus代码生成器模板引擎依赖   -->
<dependency>
	<groupId>org.freemarker</groupId>
	<artifactId>freemarker</artifactId>
	<version>2.3.31</version>
</dependency>
```
- **编写主程序**
```java
public class CodeGenerator {
	/**
	 * <p>
	 * 读取控制台内容
	 * </p>
	 */
	public static String scanner(String tip) {
		Scanner scanner = new Scanner(System.in);
		StringBuilder help = new StringBuilder();
		help.append("请输入" + tip + "：");
		System.out.println(help.toString());
		if (scanner.hasNext()) {
			String ipt = scanner.next();
			if (StringUtils.isNotBlank(ipt)) {
				return ipt;
			}
		}
		throw new MybatisPlusException("请输入正确的" + tip + "！");
	}

	public static void main(String[] args) {
		// 代码生成器
		AutoGenerator mpg = new AutoGenerator();

		// 全局配置
		GlobalConfig gc = new GlobalConfig();
		String projectPath = System.getProperty("user.dir");
		gc.setOutputDir(projectPath + "/yeb-generator/src/main/java");
		// 设置作者名字
		gc.setAuthor("whz");
		// 是否打开输出目录
		gc.setOpen(false);
		// xml开启BaseResultMap
		gc.setBaseResultMap(true);
		// xml开启BaseColumnList
		gc.setBaseColumnList(true);
		// 实体属性 Swagger2 注解
		gc.setSwagger2(true);
		mpg.setGlobalConfig(gc);

		// 数据源配置
		DataSourceConfig dsc = new DataSourceConfig();
		dsc.setUrl("jdbc:mysql://localhost:3306/yeb?useUnicode=true&useSSL=false&characterEncoding=utf8&serverTimezone=Asia/Shanghai");
		dsc.setDriverName("com.mysql.jdbc.Driver");
		dsc.setUsername("root");
		dsc.setPassword("whz1152957995");
		mpg.setDataSource(dsc);

		// 包配置
		PackageConfig pc = new PackageConfig();
		pc.setParent("com.example")
														.setEntity("pojo")
														.setMapper("mapper")
														.setService("service")
														.setServiceImpl("service.impl")
														.setController("controller");
		mpg.setPackageInfo(pc);

		// 自定义配置
		InjectionConfig cfg = new InjectionConfig() {
			@Override
			public void initMap() {
				// to do nothing
			}
		};

		// 如果模板引擎是 freemarker
		String templatePath = "/templates/mapper.xml.ftl";
		// 如果模板引擎是 velocity
		// String templatePath = "/templates/mapper.xml.vm";

		// 自定义输出配置
		List<FileOutConfig> focList = new ArrayList<>();
		// 自定义配置会被优先输出
		focList.add(new FileOutConfig(templatePath) {
			@Override
			public String outputFile(TableInfo tableInfo) {
				// 自定义输出文件名 ， 如果你 Entity 设置了前后缀、此处注意 xml 的名称会跟着发生变化！！
				return projectPath + "/yeb-generator/src/main/resources/mapper/" + tableInfo.getEntityName() + "Mapper" + StringPool.DOT_XML;
			}
		});
        /*
        cfg.setFileCreate(new IFileCreate() {
            @Override
            public boolean isCreate(ConfigBuilder configBuilder, FileType fileType, String filePath) {
                // 判断自定义文件夹是否需要创建
                checkDir("调用默认方法创建的目录，自定义目录用");
                if (fileType == FileType.MAPPER) {
                    // 已经生成 mapper 文件判断存在，不想重新生成返回 false
                    return !new File(filePath).exists();
                }
                // 允许生成模板文件
                return true;
            }
        });
        */
		cfg.setFileOutConfigList(focList);
		mpg.setCfg(cfg);

		// 配置模板
		TemplateConfig templateConfig = new TemplateConfig();

		// 配置自定义输出模板
		//指定自定义模板路径，注意不要带上.ftl/.vm, 会根据使用的模板引擎自动识别
		// templateConfig.setEntity("templates/entity2.java");
		// templateConfig.setService();
		// templateConfig.setController();

		templateConfig.setXml(null);
		mpg.setTemplate(templateConfig);

		// 策略配置
		StrategyConfig strategy = new StrategyConfig();
		// 数据库表映射到实体的命名策略
		strategy.setNaming(NamingStrategy.underline_to_camel);
		// 数据库表字段映射到实体的命名策略
		strategy.setColumnNaming(NamingStrategy.no_change);
		//Lombok模型
		strategy.setEntityLombokModel(true);
		//生成 @RestController控制器
		strategy.setRestControllerStyle(true);
		strategy.setInclude(scanner("表名，多个英文逗号分割").split(","));
		strategy.setControllerMappingHyphenStyle(true);
		// 表前缀
		strategy.setTablePrefix("t_");
		mpg.setStrategy(strategy);
		mpg.setTemplateEngine(new FreemarkerTemplateEngine());
		mpg.execute();
	}
}
```
- **运行程序，输入要生成的表明**
运行程序结果如下：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124950.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409124959.png)

# MyBatis-Spring整合
```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
	<!-- 指定mybatis全局配置文件位置 --> 
	<property name="configLocation" value="classpath:mybatis/mybatis-config.xml"></property>
	<!--指定数据源 --> 
	<property name="dataSource" ref="dataSource"></property>
	<!--mapperLocations：所有sql映射文件所在的位置 -->
	<property name="mapperLocations" value="classpath:mybatis/mapper/*.xml"></property>
	<!--typeAliasesPackage：批量别名处理-->
	<property name="typeAliasesPackage" value="com.atguigu.bean"></property>
</bean>

<!--自动的扫描所有的mapper的实现并加入到ioc容器中 -->
<bean id="configure" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
	<!– basePackage:指定包下所有的mapper接口实现自动扫描并加入到ioc容器中 -->
	<property name="basePackage" value="com.atguigu.dao"></property>
</bean>
```

# MyBatis-工作原理

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409125008.png)

# MyBatis-插件开发
MyBatis在四大对象的创建过程中，都会有插件进行介入。插件可以利用动态代理机制一层层的包装目标对象，而实现在目标对象执行目标方法之前进行拦截的效果。
MyBatis 允许在已映射语句执行过程中的某一点进行拦截调用。
默认情况下，MyBatis 允许使用插件来拦截的方法调用包括：
- Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed) 
- ParameterHandler (getParameterObject, setParameters) 
- ResultSetHandler (handleResultSets, handleOutputParameters) 
- StatementHandler (prepare, parameterize, batch, update, query)

## 插件开发步骤
1. 编写插件实现Interceptor接口， 并使用@Intercepts注解完成插件签名
```java
@Intercepts({@Signature(type=StatementHandler.class, method="prepare", args={Connection.class})})
public class MyFirstPlugin implements Interceptor{}
```
2. 在全局配置文件中注册插件
```xml
<plugins>
	<plugin interceptor="com.atguigu.plugin.MyFirstPlugin">
		<property name="username" value="tomcat"/>
	</plugin>
</plugins>
```

## 插件原理
按照插件注解声明，按照插件配置顺序调用插件plugin方法，生成被拦截对象的动态代理
多个插件依次生成目标对象的代理对象，层层包裹，先声明的先包裹；形成代理链
目标方法执行时依次从外到内执行插件的intercept方法。 
多个插件情况下，我们往往需要在某个插件中分离出目标对象。可以借助MyBatis提供的SystemMetaObject类来进行获取最后一层的h以及target属性的值

**Interceptor接口(与spring中的拦截器区分开)**
该接口中的三个方法
- Intercept：拦截目标方法执行
- plugin：生成动态代理对象，可以使用MyBatis提 供的Plugin类的wrap方法
- setProperties：注入插件配置时设置的属性

**常用代码**
从代理链中分离真实被代理对象
```java
//1、分离代理对象。由于会形成多次代理，所以需要通过一个while 循环分离出最终被代理对象，从而方便提取信息
MetaObject metaObject = SystemMetaObject.forObject(target);
while (metaObject.hasGetter("h")) {
	Object h = metaObject.getValue("h");
	metaObject = SystemMetaObject.forObject(h);
}
//2、获取到代理对象中包含的被代理的真实对象
Object obj = metaObject.getValue("target");
//3、获取被代理对象的MetaObject方便进行信息提取
MetaObject forObject = SystemMetaObject.forObject(obj);
```

# 扩展：MyBatis实用场景
## PageHelper插件进行分页
PageHelper是MyBatis中非常方便的第三方分页插件
**使用步骤**
1. 导入相关包pagehelper-x.x.x.jar 和 jsqlparser-0.9.5.jar。 
2. 在MyBatis全局配置文件中配置分页插件。 
```xml
<plugins>
	<plugin interceptor="com.github.pagehelper.PageInterceptor">
		<!-- 使用下面方式配置参数，后面会有所有的参数介绍 -->
		<property name="param1" value="value1">
	</plugin>
</plugins>
```
3. 使用PageHelper提供的方法进行分页
```java
//在查询之前只需要调用PageHelper.startPage, 其中第一个参数为页码， 第二个参数为每页的大小
PageHelper.startPage(1, 10);
//startPage后面紧跟的查询就是一个经过PageHelper处理的分页查询
List<Employee> emps = employeeService.getAll();

//将得到的emps使用pageInfo包装, 包装后，封装了详细的分页信息
PageInfo page = new PageInfo(emps);
```
[详细使用](https://github.com/pagehelper/Mybatis-PageHelper/blob/master/wikis/en/HowToUse.md)

4. 可以使用更强大的PageInfo封装返回结果


## 批量操作
默认的 openSession() 方法没有参数,它会创建有如下特性的
- 会开启一个事务(也就是不自动提交) – 连接对象会从由活动环境配置的数据源实例得到。
- 事务隔离级别将会使用驱动或数据源的默认设置。
- 预处理语句不会被复用,也不会批量处理更新。

openSession 方法的ExecutorType类型的参数，枚举类型:
- ExecutorType.SIMPLE: 这个执行器类型不做特殊的事情（这是默认装配的）。它为每个语句的执行创建一个新的预处理语句。
- ExecutorType.REUSE: 这个执行器类型会复用预处理语句。
- ExecutorType.BATCH: 这个执行器会批量执行所有更新语句

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409125021.png)

批量操作我们是使用MyBatis提供的BatchExecutor进行的，他的底层就是通过jdbc攒sql的方式进行的。我们可以让他攒够一定数量后发给数据库一次。
```java
public void test01() {
	SqlSession openSession = build.openSession(ExecutorType.BATCH);
	UserDao mapper = openSession.getMapper(UserDao.class);
	long start = System.currentTimeMillis();
	for (int i = 0; i < 1000000; i++) {
		String name = UUID.randomUUID().toString().substring(0, 5);
		mapper.addUser(new User(null, name, 13));
	}
	openSession.commit();
	openSession.close();
	long end = System.currentTimeMillis();
	System.out.println("耗时时间："+(end-start));
}
```

**与Spring整合中，我们推荐，额外的配置一个可以专门用来执行批量操作的sqlSession**
```xml
<bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
	<constructor-arg name="sqlSessionFactory" ref="sqlSessionFactoryBean"/>
	<constructor-arg name="executorType" ref="BATCH"/>
</bean>
```
需要用到批量操作的时候，我们可以注入配置的这个批量SqlSession。通过他获取到mapper映射器进行操作。
注意：
- 批量操作是在session.commit()以后才发送sql语句给数据库进行执行的
- 如果我们想让其提前执行，以方便后续可能的查询操作获取数据，我们可以使用sqlSession.flushStatements()方法，让其直接冲刷到数据库进行执行。


# Mybatis注解开发
**增删改查相关注解**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409125030.png)

**结果集映射相关注解**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409125043.png)

## 示例
**表结构**
```sql
/**商品信息*/
create table productinfo(
       id int primary key auto_increment, --主键
       proName varchar(50),--商品名称
       proNo  varchar(50), --商品编号      
       proDescription  varchar(200)--商品描述
);
```
**实体映射**
```java
public class ProductInfo {
    private Integer id;//主键
    private String proName;//商品名称
    private String proNo;//商品编号      
    private String proDescription;//商品描述
}
```
**Dao层接口**
```java
/**Dao层接口*/
public interface ProductInfoDao {    /**保存信息,并返回主键**/

    @Insert("insert into ProductInfo(proName,proNo,proDescription) values(#{proName},#{proNo},#{proDescription})")
    @Options(useGeneratedKeys = true,keyProperty="id",keyColumn="id") 
    //@SelectKey(statement="select @@identity",keyColumn="id",keyProperty="id",before=false,resultType = int.class)
    void saveProducrInfoCatchID(ProductInfo proInfo);    /**获取所有返回LIST*/

    @Select("select * from ProductInfo")
    @Results({
        @Result(id=true,property="id",column="id"),
        @Result(property="proName",column="proName"),
        @Result(property="proNo",column="proNo"),
        @Result(property="proDescription",column="proDescription")
    })    List<ProductInfo> findAllListInfo();    /**根据主键查询*/
    @Select("select * from ProductInfo where id = #{id}")
    ProductInfo findById(int id);    /**根据商品编号模糊查询*/

    @Select("select * from ProductInfo where proNo like concat('%',#{proNo},'%')")
    List<ProductInfo> findProInfoByProNo(String proNo);    //删除

    @Delete("delete from productInfo where id = #{id}")
    void deleteByID(int id);

    //修改
    @Update("update productInfo set proName = #{proName},proNo=#{proNo},proDescription=#{proDescription}    where id = #{id}")
    void updateProduct(ProductInfo info);
}
```
**测试方法**
```java
public class TestDemo {
    private ProductInfoDao dao;
    SqlSession sqlSession = null;
    @Before
    public void setUp() throws Exception{
        sqlSession = MyBatisUtil.getSqlSession();        
				dao = sqlSession.getMapper(ProductInfoDao.class);
    }    
		/**保存信息,并返回主键**/
    @Test
    public void saveProducrInfoCatchID(){
        ProductInfo proInfo = new ProductInfo("电冰箱","002","最新款电冰箱");
        System.out.println("执行前:"+proInfo);
        dao.saveProducrInfoCatchID(proInfo);
				System.out.println("执行后:"+proInfo);
        sqlSession.commit();//提交
    }
    //查询所有
    @Test
    public void  findAllListInfo(){
        List<ProductInfo> list = dao.findAllListInfo();
        if(list != null){
            for (ProductInfo productInfo : list) {
                System.out.println(productInfo);
            }
        }
    }
    /**根据主键查询*/
    @Test
    public void  findById(){
        ProductInfo pro = dao.findById(4);
        System.out.println(pro);
    }
    /**根据商品编号模糊查询*/
    @Test
    public void findProInfoByProNo(){
        List<ProductInfo> list = dao.findProInfoByProNo("001");
        if(list != null){
            for (ProductInfo productInfo : list) {
                System.out.println(productInfo);
            }
        }
    }
    /**简单删除*/
    @Test
    public void deleteByID(){
        dao.deleteByID(7);
    }
    /**简单修改*/
    @Test
    public void updateProductById(){
        //1.查询修改对象
        ProductInfo beforeInfo = dao.findById(6);
        System.out.println("执行前beforeInfo:"+beforeInfo);
        //2.修改值
        beforeInfo.setProDescription("修改了电视");
        //3.执行更新操作
        dao.updateProduct(beforeInfo);
        //4.再查询
        ProductInfo afterInfo = dao.findById(6);
        System.out.println("执行后afterInfo:"+afterInfo);
    }
    @After
    public void setDown(){
        if(sqlSession != null)
            sqlSession.close();
    }
}
```
## @Mapper注解
在没有使用@Mapper注解之前，我们需要使用如下方法手动创建一个Dao层接口示例：
```java
//获取会话对象sqlSession
InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(is);
SqlSession sqlSession = sqlSessionFactory.openSession();

UserMapper mapper = sqlSession.getMapper(UserMapper.class);
```
如果Dao层有非常多个接口，那么上述的方法是十分低效的，由此就有了@Mapper注解

**Mapper注解**
这个注解要配置Spring使用，spring扫描到这个注解后，会自动将实现注解标注的接口，并将其放入Sping容器中
示例：
Dao层接口
```java
@Mapper
public interface test01{
	@Delete("delete from tb-goods where id=#{id}")
	int testdelete(Integer Id);
}
```
测试类
```java
@SpringBootTest
public class test{
	@Autowired
	private test01 test;

	@Test
	public void delete(){
		int rows = test.testdelte(5);
	}
}
```
## MapperScan注解
使用@Mapper注解时，需要在每个接口类上加上@Mapper注解，比较麻烦，解决这个问题用@MapperScan
@MapperScan注解添加位置：是在Springboot启动类上面添加
```java
@SpringBootApplication
@MapperScan("com.winter.dao")
public class SpringbootMybatisDemoApplication {
	public static void main(String[] args) {
			SpringApplication.run(SpringbootMybatisDemoApplication.class, args);
	}
}
```
添加@MapperScan(“com.winter.dao”)注解以后，com.winter.dao包下面的接口类，在编译之后都会生成相应的实现类
**同时,使用@MapperScan注解多个包**
```java
@SpringBootApplication  
@MapperScan({"com.kfit.demo","com.kfit.user"})  
public class App {  
    public static void main(String[] args) {  
       SpringApplication.run(App.class, args);  
    }  
} 
```
**如果如果mapper类没有在Spring Boot主程序可以扫描的包或者子包下面，可以使用如下方式进行配置**
```java
@SpringBootApplication  
@MapperScan({"com.kfit.*.mapper","org.kfit.*.mapper"})  
public class App {  
    public static void main(String[] args) {  
       SpringApplication.run(App.class, args);  
    }  
} 
```

# Mybatis传参- 被逗号分割的字符串
1. String ids = "1,2,3,4,5,6",如ids作为参数传递，查询list返回。mybatis用foreach处理并返回。 
```
SELECT *
		FROM yp_popup_store_info store
		
		WHERE store.store_id in
		<foreach item="item" index="index" collection="ids.split(',')"  open="(" separator="," close=")">
				'${item}'
		</foreach>
```
2.注意： （1）ids不能为null，否则报空指针异常。（2）因为字符串内的值是数值类型，所以 用单引号 将元素扩起来，而且使用$，而不用#
