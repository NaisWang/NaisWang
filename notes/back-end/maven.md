# Ant
1. Ant和Maven都是项目构建工具
2. 在项目的运行编译打包等过程需要依赖于Ant构建工具

# 分布式
1. 传统项目部署：
1.1 新建一个项目，通过不同的包来区分不同的模块
1.2 把这一个项目发布到服务器（tomcat）中
2. 分布式项目部署(适合于高负载情况下)
2.1 完整的项目拆分成多个项目，把拆分后的项目分别部署到对应的服务器(tomcat)中的过程叫做分布式项目部署把一个

# Maven简介
基于Ant的构建工具，Ant有的功能Maven都有,额外添加了其他功能

## Maven约定的工程目录：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220222144233.png)

## 运行原理图

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408234938.png)

1. 本地仓库：计算机中的一个文件夹，通过setting.xml来自定义是哪个文件夹
```xml
<localRepository>F:\RepMaven</localRepository>
```

2. 中央仓库：网上地址：https://reop1.maven.org/maven2/ 由于是国外的网站，所以下载速度慢，所以在setting.xml中配置成国内的镜像（阿里云）
```xml
<mirror>
      <id>alimaven</id>
      <name>aliyun maven</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
      <mirrorOf>central</mirrorOf>
    </mirror>
    <mirror>
      <id>repo2</id>
      <name>repo2 maven</name>
      <url>http://repo2.maven.org/maven2</url>
      <mirrorOf>central</mirrorOf>
    </mirror>
```
3. 保证JDK版本于开发环境一致，所以在setting.xml文件中配置JDK版本
```xml
<profile>
      <id>jdk-1.8</id>
      <activation>
        <activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
      </activation>
      <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
      </properties>
    </profile>
```

## pom.xml中标签说明
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <!-- 指定了当前POM的版本 -->
  <modelVersion>4.0.0</modelVersion>

  <!-- 项目坐标信息 -->
  <!-- 项目主标识，用于定义当前项目属于的实际项目，格式与项目创建的包是一样的，公司域名反写-->
  <groupId>com.jsun.demo</groupId>
  <!-- 项目名或模块名或项目名+模块名组成 -->
  <artifactId>demo-maven01</artifactId>
  <!-- 当前项目版本号，一般由三个数字组成，第一个0表示大版本号，第二个0表示分支版本号，第三个1表示小版本号 -->
  <!-- SNAPSHOT代表当前版本类型为快照版本，还有alpha内部版本、beta公测版本、release发布版本、ga正式版本等 -->
  <version>0.0.1-SNAPSHOT</version>
  <!-- maven打包方式，默认为jar，还有：pom,maven-plugin,war,rar,zip -->
  <packaging>jar</packaging>

  <!-- 用在子模块中，实现对父模块的继承 -->
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.2.5.RELEASE</version>
  </parent>

  <!-- 聚合多个maven项目，同时对所有聚合项目进行编译 -->
  <modules>
    <module></module>
  </modules>

  <!-- 项目描述名，url，详细描述，产生项目文档使用 -->
  <name>Maven01</name>
  <url>http://maven.apache.org</url>
  <description>测试maven项目</description>

  <!-- 开发人员列表，项目发布使用 -->
  <developers>
    <!-- 某个项目开发者的信息 -->
    <developer>
        <!-- 项目开发者的唯一标识符 -->
        <id>001</id>
        <!-- 项目开发者的全名 -->
        <name>jsun</name>
        <!-- 项目开发者的email -->
        <email> jsun@163.com </email>
        <!-- 项目开发者的主页的URL -->
        <url />

        <!-- 项目开发者在项目中扮演的角色，角色元素描述了各种角色 -->
        <roles>
            <role>developer</role>
        </roles>

        <!-- 项目开发者所属组织 -->
        <organization>com-jsun</organization>
        <!-- 项目开发者所属组织的URL -->
        <organizationUrl> http://demo.jsun.com/jsun</organizationUrl>   
    </developer>
  </developers>


  <!-- 许可证信息， -->
  <licenses>
    <license>
        <name></name>
        <!-- 官方的license正文页面的URL -->
        <url></url>
        <!-- 项目分发的主要方式：repo，可以从Maven库下载，manual，用户必须手动下载和安装依赖 -->
        <distribution></distribution>
        <!-- 关于license的补充信息 -->
        <comments></comments>
    </license>
  </licenses>

  <!-- 项目所属组织信息 -->
  <organization>
      <name></name>
      <url></url>
  </organization>


  <!-- 属性列表，相当于定义的公共常量，引用方式比如：${project.build.sourceEncoding} -->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <junit.version>3.8.1</junit.version>
  </properties>

  <!-- 依赖列表 -->
  <dependencies>
    <!-- 具体依赖项，下面主要包含依赖的坐标、类型、范围等信息 -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-core</artifactId>
      <version>1.2.6</version>

      <!-- 依赖的类型 -->
      <type>jar</type>


      <!-- 项目如果要使用某个框架或依赖，需要把相关jar包引用到classpath中，maven项目提供了三个classpath：编译、测试、运行 -->
      <!-- 依赖的范围用于控制依赖于三种classpath关系的，包括：compile、provided、runtime、test、system、import -->
      <!-- 
        compile:默认范围，编译、测试、运行都有效
        provided:编译和测试有效，最后运行不会被加入
        runtime:在测试和运行的时候有效，编译不会被加入，比如jdbc驱动jar
        test:测试阶段有效，比如junit
        system:与provided一致，编译和测试阶段有效，但与系统关联，可移植性差
        import:导入的范围，它只是用在dependencyManagement中，表示从其它的pom中导入dependency的配置
       -->
      <!-- 表示当前依赖只能在测试代码中引用使用，在主代码中引用使用则报错 -->
      <scope>test</scope>


      <!-- 排除依赖传递列表，比如A依赖B，B依赖C，但是A并没有使用C的功能，可以把C排除-->
      <exclusions>
        <exclusion></exclusion>
      </exclusions>
    </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <!-- 主动设置禁止自己被传递，只在当前项目中使用 -->
            <optional>true</optional>
        </dependency>

    <dependency>
        <groupId>net.sf.json-lib</groupId>
        <artifactId>json-lib</artifactId>
        <!-- 在相同版本下针对不同的环境或者jdk使用的jar,如果配置了这个元素，则会将这个元素名在加在最后来查找相应的jar，
        具体解释查看：http://www.cnblogs.com/lovingprince/archive/2010/09/19/2166273.html -->
        <classifier>jdk15</classifier>
        <version>2.4</version>
    </dependency>
  </dependencies>

  <!-- 使用dependencyManagement标签管理依赖，实际管理的是依赖的版本号，让
所有子项目中引用对应依赖而不用显式的列出版本号；
依赖并不会在当前项目引入 -->
  <dependencyManagement>
    <dependencies>
        <dependency>
          <groupId>junit</groupId>
          <artifactId>junit</artifactId>
          <version>${junit.version}</version>      
        </dependency>
    </dependencies>
  </dependencyManagement>

  <!-- 构建插件 -->
  <build>
    <!-- 
        Maven定制化打包后的包名
        Maven默认的包名为:<finalName>${project.artifactId}-${project.version}</finalName>
        定制化想要的包名,如加上时间戳:<finalName>${project.artifactId}-${maven.build.timestamp}</finalName>
    -->
    <finalName>myProject</finalName>  

    <!-- 将src/main/java目录下src/main/resources目录下适配通配符的文件也打包打进去.因为默认src/main/java下打包时只有class文件,src/main/resources下打包时将各种xml，properites，xsd文件等打包jar或者war里面,防止遗漏部分文件,可以在下面的标签设置 -->
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.properties</include>
            </includes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/*.*</include>
            </includes>
        </resource>
    </resources>

    <!-- 插件列表 -->
    <plugins>
        <!-- Source attach plugin 发布的包或者打包的时候会将源码也同时打出来 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-source-plugin</artifactId>
            <version>2.4</version>
            <executions>
                <execution>
                    <id>attach-sources</id>
                    <phase>package</phase>
                    <goals>
                        <goal>jar</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
        <!-- 指定maven编译的jdk版本,如果不指定,maven3默认用jdk 1.5 maven2默认用jdk1.3 --> 
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <!-- 一般而言，target与source是保持一致的，但是，
                有时候为了让程序能在其他版本的jdk中运行(对于低版本目标jdk，源代码中不能使用低版本jdk中不支持的语法)，
                会存在target不同于source的情况 -->                    
                <source>1.8</source> <!-- 源代码使用的JDK版本 -->                                                                                             
                <target>1.8</target> <!-- 需要生成的目标class文件的编译版本 -->                                                                                     
                <encoding>UTF-8</encoding><!-- 字符集编码 -->
                <skipTests>true</skipTests><!-- 跳过测试 -->                                                                             
                <verbose>true</verbose>
                <showWarnings>true</showWarnings>                                                                                                               
                <fork>true</fork><!-- 要使compilerVersion标签生效，还需要将fork设为true，用于明确表示编译版本配置的可用 -->                                                        
                <executable><!-- path-to-javac --></executable><!-- 使用指定的javac命令，例如：<executable>${JAVA_1_4_HOME}/bin/javac</executable> -->           
                <compilerVersion>1.3</compilerVersion><!-- 指定插件将使用的编译器的版本 -->                                                                         
                <meminitial>128m</meminitial><!-- 编译器使用的初始内存 -->                                                                                      
                <maxmem>512m</maxmem><!-- 编译器使用的最大内存 -->                                                                                              
                <compilerArgument>-verbose -bootclasspath ${java.home}\lib\rt.jar</compilerArgument><!-- 这个选项用来传递编译器自身不包含但是却支持的参数选项 -->               
            </configuration>
        </plugin>

        <!-- The configuration of maven-assembly-plugin; 其中设计的package.xml和pom.xml是同级目录结构文件,文件内容见下面的package.xml文件 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <executions>
                <execution>
                    <id>make-assembly-platform</id>
                    <phase>package</phase>
                    <goals>
                        <goal>single</goal>
                    </goals>
                    <configuration>
                        <descriptors>
                            <descriptor>package.xml</descriptor>
                        </descriptors>
                        <finalName>patch</finalName>
                        <appendAssemblyId>false</appendAssemblyId>
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <!-- findbugs -->
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>findbugs-maven-plugin</artifactId>
            <configuration>
                <!-- <excludeFilterFile>tools/findbugs/findbugs-exclude.xml</excludeFilterFile> -->
                <threshold>High</threshold>
                <effort>Default</effort>
                <findbugsXmlOutput>true</findbugsXmlOutput>
                <findbugsXmlOutputDirectory>target/site/findbugs</findbugsXmlOutputDirectory>
            </configuration>
        </plugin>       

    </plugins>

    <!-- 插件管理列表，与dependencyManagement标签作用相似，管理插件版本号，让子项目继承使用 -->
    <pluginManagement>
        <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <!-- 插件扩展配置 -->
                <!-- 更详细的例子：http://my.oschina.net/zh119893/blog/276090 -->
                <configuration>
                    <!-- 源代码编译版本 -->
                    <source>1.7</source>
                    <!-- 目标平台编译版本 -->
                    <target>1.7</target>
                    <!-- 设置编译字符集编码 -->
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>

        </plugins>
    </pluginManagement>
  </build>
</project>
```

### 表示坐标的标签
Maven 的坐标 使用如下三个向量在 Maven 的仓库中唯一的确定一个 Maven 工程。
- groupid：公司或组织的域名倒序+当前项目名称
- artifactId：当前项目的模块名称
- version：当前模块的版本
```xml
  <groupId>net.lazyegg.maven</groupId>
  <artifactId>Hello</artifactId>
  <version>0.0.1-SNAPSHOT</version>
```

如何通过坐标到仓库中查找 jar 包？将 gav 三个向量连起来
```
net.lazyegg.maven+Hello+0.0.1-SNAPSHOT
```
以连起来的字符串作为目录结构到仓库中查找
```
net/lazyegg/maven/Hello/0.0.1-SNAPSHOT/Hello-0.0.1-SNAPSHOT.jar
```
※ 注意：我们自己的 Maven 工程必须执行安装操作才会进入仓库。安装的命令是：mvn install

### packaging标签
项目的类型，最终会打包成什么类型，有以下类型
– jar：java项目，内部调用或者是作为服务使用, 默认值
– war：web项目,即需要部署的项目
– pom：逻辑父项目，其项目只要含有子项目就必须为pom类型，pom 项目里没有java代码，也不执行任何代码，只是为了聚合工程或传递依赖用的。

```xml
<packaging>war</packaging>
```

### dependencyManagement标签
Maven中的dependencyManagement元素提供了一种管理依赖版本号的方式。在dependencyManagement元素中声明所依赖的jar包的版本号等信息，那么所有子项目再次引入此依赖jar包时则无需显式的列出版本号。Maven会沿着父子层级向上寻找拥有dependencyManagement 元素的项目，然后使用它指定的版本号。
**举例：**
在父项目的POM.xml中配置：
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>1.2.3.RELEASE</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```
此配置即生命了spring-boot的版本信息。

子项目则无需指定版本信息：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**使用优点**
如果有多个子项目都引用同一样依赖，则可以避免在每个使用的子项目里都声明一个版本号。当想升级或切换到另一个版本时，只需要在顶层父容器里更新，而不需要逐个修改子项目；另外如果某个子项目需要另外的一个版本，只需要声明version即可。

**注意事项**
dependencyManagement中定义的只是依赖的声明，并不实现引入，因此子项目需要显式的声明需要用的依赖。

> dependencyManagement的另一个作用：见 `使用import scope解决maven继承（单）问题` 标题

### 聚合相关标签
Maven聚合（或者称为多模块），是为了能够使用一条命令就构建多个模块，例如已经有两个模块，分别为account-email,account-persist，我们需要创建一个额外的模块（假设名字为account-aggregator，然后通过该模块，来构建整个项目的所有模块，accout-aggregator本身作为一个Maven项目，它必须有自己的POM,不过作为一个聚合项目，其POM又有特殊的地方，看下面的配置：
```xml
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
        http://maven.apache.org/maven-v4_0_0.xsd">

        <modelVersion>4.0.0</modelVersion>
        <groupId>com.juvenxu.mvnbook.account</groupId>
        <artifact>account-aggregator</artifact>
        <version>1.0.0-SNAPSHOT</version>
        <packaging>pom</packaging>
        <name>Account Aggregator</name>

        <modules>
            <module>account-email</module>
            <module>account-persist</module>
        </modules>
</project>
```

上面有一个特殊的地方就是packaging,其值为pom,如果没有声明的话，默认为jar，==对于聚合模块来说，其打包方式必须为pom==，否则无法构建。
modules里的每一个module都可以用来指定一个被聚合模块，这里每个module的值都是一个当前pom的相对位置，本例中account-email、account-persist位于account-aggregator目录下，当三个项目同级的时候，上面的两个module应该分别为../account-email和../account-persist

### optional与exclusions标签
**optional标签**
optional是maven依赖jar时的一个选项,表示该依赖是不是可选的.会不会被依赖传递，默认值为false,即表示不是可选的，会被依赖传递

画个图说明问题:

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408234948.png)

一个项目会依赖于 被依赖的项目 中所有`<optional>false</optional>`的依赖。例如上图，project D会依赖于project C中所有`<optional>false</optional>`的依赖。但是对于project D来说，不一定依赖于project A与proejct B, 所以我们应该在project C中的将project A与project B的optional设置成true。此时proejct A, project B就不会出现传递依赖。如果project D需要使用project A与project B，则在project D中显式引入即可

**exclusions标签**
如果 Project C 引入的依赖没有加 <optional>true</optional>，Project D 又需要依赖 Project C，但只用到 Project A 的类怎么办呢？Maven 也是有解决办法的，使用 exclusion 关键字，不多说，上一段代码就懂了:
```xml
<dependencies>
    <dependency>
      <groupId>top.dayarch.demo</groupId>
      <artifactId>Project-C</artifactId>
      <exclusions>
        <exclusion>
          <groupId>top.dayarch.demo</groupId>
          <artifactId>Project-B</artifactId>
        </exclusion>
      </exclusions> 
    </dependency>
</dependencies>
```

### 继承相关标签
maven中继承有两个作用：
- 子项目继承父项目中导入的依赖, 例如我们有一个父项目maven-parent，该父项目拥有一个子项目A，如果在父项目中依赖了junit，那么在子项目A中即便是没有引入junit，在子项目中仍然能够使用junit，因为子项目继承了父项目中的junit依赖
- “一处声明、多出使用”，例如子项目会继承父项目中的`<groupId>`、`<version>`等标签，因此表示子项目坐标时只需要写`<artifactId>`标签

在构建多个模块的时候，往往会多有模块有相同的groupId、version，或者有相同的依赖，例如：spring-core、spring-beans、spring-context和junit等，或者有相同的组件配置，例如：maven-compiler-plugin和maven-resources-plugin配置，在Maven中也有类似Java的继承机制，那就是POM的继承。
继承POM的用法
面向对象设计中，程序员可以通过一种类的父子结构，在父类中声明一些字段和方法供子类继承，这样可以做到“一处声明、多处使用”，类似的我们需要创建POM的父子结构，然后在父POM中声明一些配置，供子POM继承。
下面声明一个父POM，如下：
```xml
<project
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:shemaLocation="http://maven.apache.org/POM/4.0.0
http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.juvenxu.mvnbook.account</groupId>
    <artifactId>account-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>Account Parent</name>
</project>
```
这个父POM中，groupId和version和其它模块一样，它的packaging为pom，这一点和聚合模块一样，==作为父模块的POM，其打包类型也必须为pom==,由于父模块只是为了帮助消除配置的重复，因此它本身不包含除POM之外的项目文件，也就不需要src/main/java之类的文件夹了。
有了父模块，就需要其它模块来继承它。首先将account-email的POM修改如下：
account-email继承account-parent的POM
```xml
<project
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:shemaLocation="http://maven.apache.org/POM/4.0.0
http://maven.apache.org/maven-v4_0_0.xsd">
    <parent>
        <groupId>com.juvenxu.mvnbook.account<groupId>
        <artifactId>account-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../account-parent/pom.xml</relativePath>
    </parent>
    
    <artifactId>account-email</artifactId>
    <name>Account Email</name>
    
    <dependencies>
        ....
    </dependencies>
    <build>
        <plugins>
            ....
        </plugins>
    </build>
</project>
```
- 上面POM中使用parent元素声明父模块，==paren下的子元素groupId、artifactId和version指定了父模块的坐标，这三个元素是必须的==。元素relativePath表示了父模块POM的相对位置。当项目构建时，Maven会首先根据relativePath检查父POM，如果找不到，再从本地仓库查找。relativePath的默认值是../pom.xml,Maven默认父POM在上一层目录下。
- 上面POM没有为account-email声明groupId，version,不过并不代表account-email没有groupId和version，实际上，这个子模块隐式的从父模块继承了这两个元素，这也就消除了不必要的配置。上例中，父子模块使用了相同的groupId和version，如果遇到子模块需要使用和父模块不一样的groupId或者version的情况，可以在子模块中显式声明。对于artifactId元素来说，子模块更应该显式声明，因为如果完全继承groupId、artifactId、version,会造成坐标冲突；另一方面，即使使用不同的groupId或version,同样的artifactId容易造成混淆。
account-persist继承account-parent的POM
```xml
<project
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:shemaLocation="http://maven.apache.org/POM/4.0.0
http://maven.apache.org/maven-v4_0_0.xsd">
    <parent>
        <groupId>com.juvenxu.mvnbook.account<groupId>
        <artifactId>account-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../account-parent/pom.xml</relativePath>
    </parent
    
    <artifactId>account-persist</artifactId>
    <name>Account Persist</name>
    
    <dependencies>
        ....
    </dependencies>
    <build>
        ...
    </build>
</project>
```
最后，同样需要把account-parent加入到聚合模块accountp-aggregator中，代码如下：
将account-parent加入到聚合模块
```xml
<project
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
        http://maven.apache.org/maven-v4_0_0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.juvenxu.mvnbook.account</groupId>
        <artifact>account-aggregator</artifact>
        <version>1.0.0-SNAPSHOT</version>
        <packaging>pom</packaging>
        <name>Account Aggregator</name>
        <modules>
            <module>account-email</module>
            <module>account-persist</module>
            <module>account-parent</module>
        </modules>
</project>
```

#### relativePath标签
relativePath标签是parent的子标签，需要搭配parent标签使用。

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.1.9.RELEASE</version>
    <relativePath/>
</parent>
```
relativePath标签的作用:
- 指定查找该父项目pom.xml的(相对)路径。默认顺序：relativePath > 本地仓库 > 远程仓库
- 没有relativePath标签等同`<relativePath>../pom.xml</relativePath>`, 即默认从当前pom文件的上一级目录找
- `<relativePath/>`表示不从relativePath找, 直接从本地仓库找,找不到再从远程仓库找

### Scope标签
scope标签，他有自己的生存空间，他只能生活在<dependency>标签范围内，想去其他地方，不好意思，去不了。

Scope依赖作用域也可称作依赖范围：maven中的依赖，会根据程序所处的阶段和场景发生变化，所以maven用scope 属性来做限制；
1. compile（默认值）：在编译、运行、测试、打包都有效；
2. provided：编译、测试时有效，运行、打包无效；
3. test：仅在测试时有效；
4. runtime：测试、运行、打包时有效；
5. system：不推荐使用，使用system作用域不会去本地仓库寻找依赖，要指定本地路径；

![](https://raw.githubusercontent.com/NaisWang/images/master/20220408235007.png)

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

#### 使用import scope解决maven继承（单）问题
想必大家在做SpringBoot应用的时候，都会有如下代码：
```xml
<parent>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-parent</artifactId>
	<version>1.3.3.RELEASE</version>
</parent>
```
继承一个父模块，然后再引入相应的依赖
假如说，我不想继承，或者我想继承多个，怎么做？
我们知道Maven的继承和Java的继承一样，是无法实现多重继承的，如果10个、20个甚至更多模块继承自同一个模块，那么按照我们之前的做法，这个父模块的dependencyManagement会包含大量的依赖。如果你想把这些依赖分类以更清晰的管理，那就不可能了，import scope依赖能解决这个问题。你可以把dependencyManagement放到单独的专门用来管理依赖的pom中，然后在需要使用依赖的模块中通过import scope依赖，就可以引入dependencyManagement。例如可以写这样一个用于依赖管理的pom：
```xml
<project>
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.test.sample</groupId>
	<artifactId>base-parent1</artifactId>
	<packaging>pom</packaging>
	<version>1.0.0-SNAPSHOT</version>
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>junit</groupId>
				<artifactid>junit</artifactId>
				<version>4.8.2</version>
			</dependency>
			<dependency>
				<groupId>log4j</groupId>
				<artifactid>log4j</artifactId>
				<version>1.2.16</version>
			</dependency>
		</dependencies>
	</dependencyManagement>
</project>
```
然后其他模块就可以在中通过非继承的方式来引入这段依赖管理配置
```xml
<dependencyManagement>
	<dependencies>
		<dependency>
			<groupId>com.test.sample</groupId>
			<artifactid>base-parent1</artifactId>
			<version>1.0.0-SNAPSHOT</version>
			<type>pom</type>
			<scope>import</scope>
		</dependency>
	</dependencies>
</dependencyManagement>
 
<!-- 添加com.test.sample.base-parent1模块中dependencyManagement标签中声明了的依赖, 如:junit, log4j。其中版本号不需要，会自动继承 -->
<dependency>
	<groupId>junit</groupId>
	<artifactid>junit</artifactId>
</dependency>
<dependency>
	<groupId>log4j</groupId>
	<artifactid>log4j</artifactId>
</dependency>

```
**注意：import scope只能用在dependencyManagement里面**
这样，父模块的pom就会非常干净，由专门的packaging为pom来管理依赖，也契合的面向对象设计中的单一职责原则。此外，我们还能够创建多个这样的依赖管理pom，以更细化的方式管理依赖。这种做法与面向对象设计中使用组合而非继承也有点相似的味道。

### build、plugins标签
### 作用
- 使用maven构建的项目可以直接使用maven build完成项目的编译、测试、打包，无需额外配置。
- build标签描述了如何编译及打包项目，具体的编译和打包工作是通过其中的plugin配置来实现的。当然，plugin不是必须的，即使不添加plugin标签，默认也会引入以下插件：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220222145721.png)

- 如果有需要可以另外进行配置,以下配置了编译时使用的jdk版本。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220222145749.png)

### 分类
在Maven的pom.xml文件中，存在如下两种`<build>`：
- 全局配置（project build）: 针对整个项目的所有情况都有效
- 配置（profile build）: 针对不同的profile配置
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"  
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">  
  ...  
  <!-- "Project Build" contains elements of the BaseBuild set and the Build set-->  
  <build>...</build>  
   
  <profiles>  
    <profile>  
      <!-- "Profile Build" contains elements of the BaseBuild set only -->  
      <build>...</build>  
    </profile>  
  </profiles>  
</project>
```
说明：
- 一种<build>被称为Project Build，即是<project>的直接子元素。
- 另一种<build>被称为Profile Build，即是<profile>的直接子元素。
Profile Build包含了基本的build元素，而Project Build还包含两个特殊的元素，即各种<...Directory>和<extensions>。

### 配置说明
#### 基本元素
示例如下
```xml
<build>  
  <defaultGoal>install</defaultGoal>  
  <directory>${basedir}/target</directory>  
  <finalName>${artifactId}-${version}</finalName> 
  <filters>
   <filter>filters/filter1.properties</filter>
  </filters> 
  ...
</build> 
```
- defaultGoal: 指定执行build任务时，如果没有指定目标，将使用的默认目标。如上配置：在命令行中执行mvn，没有指定目标, 则相当于执行mvn install
- directory: 指定build后产生的目标文件的存放目录，默认在${basedir}/target目录
- finalName: 指定build后产生的目标文件的名称，默认情况为${artifactId}-${version}
- filter: 定义*.properties文件，包含一个properties列表，该列表会应用到支持filter的resources中。也就是说，定义在filter的文件中的name=value键值对，会在build时代替${name}值应用到resources中。maven的默认filter文件夹为${basedir}/src/main/filters

#### Resources配置
用于包含或者排除某些资源文件
```xml
<build>  
        ...  
       <resources>  
          <resource>  
             <targetPath>META-INF/plexus</targetPath>  
             <filtering>true</filtering>  
            <directory>${basedir}/src/main/plexus</directory>  
            <includes>  
                <include>configuration.xml</include>  
            </includes>  
            <excludes>  
                <exclude>**/*.properties</exclude>  
            </excludes>  
         </resource>  
    </resources>  
    <testResources>  
        ...  
    </testResources>  
    ...  
</build>
```
- resources: 一个resources元素的列表。每一个都描述与项目关联的文件是什么和在哪里
- targetPath: 指定build后的resource存放的文件夹，默认是basedir。通常被打包在jar中的resources的目标路径是META-INF
- filtering: true/false，表示为这个resource，filter是否激活
- directory: 定义resource文件所在的文件夹，默认为${basedir}/src/main/resources
- includes: 指定哪些文件将被匹配，以*作为通配符
- excludes: 指定哪些文件将被忽略
- testResources: 定义和resource类似，只不过在test时使用

#### plugins配置
用于指定使用的插件
```xml
<build>  
    ...  
    <plugins>  
        <plugin>  
            <groupId>org.apache.maven.plugins</groupId>  
            <artifactId>maven-jar-plugin</artifactId>  
            <version>2.0</version>  
            <extensions>false</extensions>  
            <inherited>true</inherited>  
            <configuration>  
                <classifier>test</classifier>  
            </configuration>  
            <dependencies>...</dependencies>  
            <executions>...</executions>  
        </plugin>  
    </plugins>  
</build>  
```

#### pluginManagement配置
pluginManagement的配置和plugins的配置是一样的，只是用于继承，使得可以在孩子pom中使用。

父pom：
```xml
<build>  
    ...  
    <pluginManagement>  
        <plugins>  
            <plugin>  
              <groupId>org.apache.maven.plugins</groupId>  
              <artifactId>maven-jar-plugin</artifactId>  
              <version>2.2</version>  
                <executions>  
                    <execution>  
                        <id>pre-process-classes</id>  
                        <phase>compile</phase>  
                        <goals>  
                            <goal>jar</goal>  
                        </goals>  
                        <configuration>  
                            <classifier>pre-process</classifier>  
                        </configuration>  
                    </execution>  
                </executions>  
            </plugin>  
        </plugins>  
    </pluginManagement>  
    ...  
</build>
```

则在子pom中，我们只需要配置：
```xml
<build>  
    ...  
    <plugins>  
        <plugin>  
            <groupId>org.apache.maven.plugins</groupId>  
            <artifactId>maven-jar-plugin</artifactId>  
        </plugin>  
    </plugins>  
    ...  
</build>  
```
这样大大简化了孩子pom的配置

# Maven中常见命令
1. clean：清理编译后的目录，即target目录
2. complie: 编译，只编译main下的java目录与resource目录，不编译test目录与webapp目录
3. test-complie: 编译main与test目录中的代码
4. test: 运行test里边的代码
5. package: 将项目打包,包括webapp目录，打包的名字为该项目的artifactId+version+packaging
6. install: 发布项目到本地仓库，多用在打jar包上，打成jar包后可以被其他项目使用
7. tomcat: run： 一键构建项目，即把项目放在tomcat上
8. site: maven将项目生成静态描述文件html形式，执行完该命令后可在target目录下找到生成的site目录

# 生命周期
## 什么是 Maven 的生命周期？
Maven 生命周期定义了各个构建环节的执行顺序，有了这个清单，Maven 就可以自动化的执行构建命令了。

Maven 有三套相互独立的生命周期，分别是：
- Clean Lifecycle 在进行真正的构建之前进行一些清理工作
- Default Lifecycle 构建的核心部分，编译，测试，打包，安装，部署等等
- Site Lifecycle 生成项目报告，站点，发布站点
它们是相互独立的，你可以仅仅调用 clean 来清理工作目录，仅仅调用 site 来生成站点。当然你也可以直接运行 mvn clean install site 运行所有这三套生命周期。 每套生命周期都由一组阶段(Phase)组成，我们平时在命令行输入的命令总会对应于一个特定的阶段。比如，运行 mvn clean，这个 clean 是 Clean 生命周期的一个阶段。有 Clean 生命周期，也有 clean 阶段。


## Clean 生命周期
Clean 生命周期一共包含了三个阶段：
- pre-clean 执行一些需要在 clean 之前完成的工作
- clean 移除所有上一次构建生成的文件
- post-clean 执行一些需要在 clean 之后立刻完成的工作


## Site 生命周期
- pre-site 执行一些需要在生成站点文档之前完成的工作
- site 生成项目的站点文档
- post-site 执行一些需要在生成站点文档之后完成的工作，并且为部署做准备
- site-deploy 将生成的站点文档部署到特定的服务器上 这里经常用到的是 site 阶段和 site-deploy 阶段，用以生成和发布 Maven 站点，这可是 Maven 相当强大 的功能，Manager 比较喜欢，文档及统计数据自动生成，很好看。


## Default 生命周期
Default 生命周期是 Maven 生命周期中最重要的一个，绝大部分工作都发生在这个生命周期中（列出一些重要阶段）

- validate：验证工程是否正确，所有需要的资源是否可用。
- compile：编译项目的源代码。
- test：使用合适的单元测试框架来测试已编译的源代码。这些测试不需要已打包和布署。
- package：把已编译的代码打包成可发布的格式，比如 jar、war 等。
- integration-test：如有需要，将包处理和发布到一个能够进行集成测试的环境。
- verify：运行所有检查，验证包是否有效且达到质量标准。
- install：把包安装到maven本地仓库，可以被其他工程作为依赖来使用。
- deploy：在集成或者发布环境下执行，将最终版本的包拷贝到远程的repository，使得其他的开发者或者工程可以共享


## 生命周期与自动化构建
运行任何一个阶段的时候，它前面的所有阶段都会被运行，例如我们运行 mvn install 的时候，代码会被编译，测试，打包。这就是 Maven 为什么能够自动执行构建过程的各个环节的原因。此外，Maven 的插件机制是完全依赖 Maven 的生命周期的，因此理解生命周期至关重要。


# Maven的依赖传递、依赖冲突及解决方法
## Maven中jar包冲突产生原因
MAVEN项目运行中如果报如下错误：
```
Caused by:java.lang.NoSuchMethodError
Caused by: java.lang.ClassNotFoundException
```
十有八九是Maven jar包冲突造成的。那么jar包冲突是如何产生的？

首先我们需要了解jar包依赖的传递性。

### 依赖传递

当我们需要A的依赖的时候，就会在pom.xml中引入A的jar包；而引入的A的jar包中可能又依赖B的jar包，这样Maven在解析pom.xml的时候，会依次将A、B 的jar包全部都引入进来。

举个例子：

在Spring Boot应用中导入Hystrix和原生Guava的jar包：
```xml
<!--原生Guava API-->
<dependency>
	<groupId>com.google.guava</groupId>
	<artifactId>guava</artifactId>
	<version>20.0</version>
</dependency>

<!--hystrix依赖（包含对Guava的依赖）-->
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
	<version>1.4.4.RELEASE</version>
</dependency>
```
利用Maven Helper插件得到项目导入的jar包依赖树：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220222142545.png)

从图中可以看出Hystrix包含对Guava jar包依赖的引用： Hystrix -> Guava，所以在引入Hystrix的依赖的时候，会将Guava的依赖也引入进来。

### jar包冲突原理
那么jar包是如何产生冲突的？

假设有如下依赖关系：
```
A->B->C->D1(log 15.0)：A中包含对B的依赖，B中包含对C的依赖，C中包含对D1的依赖，假设是D1是日志jar包，version为15.0
```
```
E->F->D2(log 16.0)：E中包含对F的依赖，F包含对D2的依赖，假设是D2是同一个日志jar包，version为16.0
```

当pom.xml文件中引入A、E两个依赖后，根据Maven传递依赖的原则，D1、D2都会被引入，而D1、D2是同一个依赖D的不同版本。

当我们在调用D2中的method1()方法，而D1中是15.0版本（method1可能是D升级后增加的方法），可能没有这个方法，这样JVM在加载A中D1依赖的时候，找不到method1方法，就会报NoSuchMethodError的错误，此时就产生了jar包冲突。

注：如果在调用method2()方法的时候，D1、D2都含有这个方法（且升级的版本D2没有改动这个方法，这样即使D有多个版本，也不会产生版本冲突的问题。）

举个例子：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220222142802.png)

利用Maven Helper插件分析得出：Guava这个依赖包产生冲突。我们之前导入了Guava的原生jar包，版本号是20.0；而现在提示Guava产生冲突，且冲突发生位置是Hystrix所在的jar包，所以可以猜测Hystrix中包含了对Guava不同版本的jar包的引用。

为了验证我们的猜想，使用Maven Helper插件打印出Hystrix依赖的jar tree：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220222142836.png)

可以看到：Hystrix jar中所依赖的Guava jar包是15.0版本的，而我们之前在pom.xml中引入的原生Guava jar包是20.0版本的，这样Guava就有15.0 与20.0这两个版本，因此发生了jar包冲突。

## Maven中jar包冲突的解决方案
Maven 解析 pom.xml 文件时，同一个 jar 包只会保留一个，那么面对多个版本的jar包，需要怎么解决呢？

### Maven默认处理策略
- 最短路径优先: Maven 面对 D1 和 D2 时，会默认选择最短路径的那个 jar 包，即 D2。E->F->D2 比 A->B->C->D1 路径短 1。
- 最先声明优先: 如果路径一样的话，如： A->B->C1, E->F->C2 ，两个依赖路径长度都是 2，那么就选择最先声明。

### 移除依赖：用于排除某项依赖的依赖jar包
（1）我们可以借助Maven Helper插件中的Dependency Analyzer分析冲突的jar包，然后在对应标红版本的jar包上面点击execlude，就可以将该jar包排除出去。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220222143338.png)

再刷新以后冲突就会消失。

（2）手动排除
或者手动在pom.xml中使用`<exclusion>`标签去排除冲突的jar包（上面利用插件Maven Helper中的execlude方法其实等同于该方法）：
```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
		<version>1.4.4.RELEASE</version>
		<exclusions>
			<exclusion>
				<groupId>com.google.guava</groupId>
				<artifactId>guava</artifactId>
			</exclusion>
	</exclusions>
</dependency>
```
mvn分析包冲突命令：
```
mvn dependency:tree
```

### 版本锁定原则：一般用在继承项目的父项目中

正常项目都是多模块的项目，如moduleA和moduleB共同依赖X这个依赖的话，那么可以将X抽取出来，同时设置其版本号，这样X依赖在升级的时候，不需要分别对moduleA和moduleB模块中的依赖X进行升级，避免太多地方（moduleC、moduleD…）引用X依赖的时候忘记升级造成jar包冲突，这也是实际项目开发中比较常见的方法。

首先定义一个父pom.xml，将公共依赖放在该pom.xml中进行声明：
```xml
<properties>
    <spring.version>spring4.2.4</spring.version>
<properties>

<dependencyManagement>
    <dependencies>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-beans</artifactId>
			<version>${spring.versio}</version>
		</dependency>
	</dependencies>
</dependencyManagement>
```

这样如moduleA和moduleB在引用Spring-beans jar包的时候，直接使用父pom.xml中定义的版本号就可以：

moduleA在其pom.xml使用spring-bean的jar包(不用再定义版本)：
```xml
<dependencies>
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-beans</artifactId>
	</dependency>
</dependencies>
```
moduleB在其pom.xml使用spring-bean的jar包如上类似：
```xml
<dependencies>
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-beans</artifactId>
	</dependency>
</dependencies>
```
以上就是日常开发中解决Maven冲突的几个小方案，当然实际开发中jar包冲突的问题可能远远比这个更复杂，需要具体问题具体处理。

# Maven项目之间的关系
1. 依赖关系 pom.xml中的标签把另一个项目的jar引入到当前的项目中，并且自动下载另一个项目所依赖的其他项目
2. 继承关系
	1. 父项目是pom类型
	2. 主要是为了消除重复配置
	3. 子项目是jar或war，如果子项目还是其他项目的父项目，则子项目也是pom类型
	4. 有继承关系后，子项目中的pom.xml中会出现标签，并且如果子项目中的和与父项目中的相同，则在子项目中可以不配置这标签
	5. 父项目pom.xml中是看不到有哪些子项目的，在逻辑上具有父子关系
3. 聚合关系
	1. 主要是为了方便快速构建项目
	2. 具有聚合关系的父项目中的pom.xml中会有标签
	3. 聚合关系的项目是pom类型
	```xml
    <modules>
        <module>child</module>
    </modules>
	```

# 聚合与继承的关系
多模块中的聚合与继承其实是两个概念，其目的是完全不同的，前者主要是为了方便快速构建项目，后者主要是为了消除重复配置。.
对于聚合模块来说，它知道有哪些被聚合的模块，但那些被聚合的子模块不知道这个聚合模块的存在。
对于继承关系的父POM来说，它不知道哪些子模块继承于它，但那些子模块都必须知道自己的父POM是什么。
在现有的实际项目中，往往会发现一个POM即是聚合POM，又是父POM，这么做主要是为了方便。一般来说，融合使用聚合与继承也没什么问题，例如可以将account-aggretor和account-parent其POM如下：
```xml
<project xmlns="http://maven-apache.org/POM/4.0.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.juvenxu.mvnbook.account</groupId>
    <artifactId>account-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>Account Parent</name>
    <modules>
        <module>account-persist</module>
    </modules>
    <properties>
        <springframework.version>2.5.6</springframework.version>
        <junit.version>4.7</junit.version>
    </properties>
    <dependencyManagement>
        <dependencies>
					...
        </dependencies>
    </dependencyManagement>
    <build>
        <pluginManagement>
            <plugins>
							...
            </plugins>
        </pluginManagement>
    </build
</project>
```
可以看到POM的打包方式为pom,它包含了一个modules元素，表示用来聚合account-persist和account-email两个模块，它还包含了properties、dependencyManagement和pluginManagement元素供子模块继承。



# Maven打jar包插件
现在主流的打包工具有assembly与shade
Assembly插件只能原样打包，将各种依赖库打包在一起。而如果在打包过程中要解决冲突，或者在打包过程中进行某些转换，如剔除License重复等，则需要借助于一个更强大的shade插件。
***
1. maven-assembly-plugin第一种方式
```xml
    1 	      <!-- maven-assembly-plugin -->
    2 	      <!-- 打包方式：mvn package assembly:single  -->
    3 	      <plugin>
    4 	        <groupId>org.apache.maven.plugins</groupId>
    5 	        <artifactId>maven-assembly-plugin</artifactId>
    6 	        <version>2.5.5</version>
    7 	        <configuration>
    8 	          <archive>
    9 	            <manifest>
   10 	              <mainClass>com.test.execute.Test</mainClass>
   11 	            </manifest>
   12 	          </archive>
   13 	          <descriptorRefs>
   14 	            <descriptorRef>jar-with-dependencies</descriptorRef>
   15 	          </descriptorRefs>
   16 	        </configuration>
   17 	      </plugin>
```

```shell
D:\Tools\idea\oa\test\target>java -jar test-jar-with-dependencies.jar
Hello World!
```
2. maven-assembly-plugin第二种方式
```xml
    1 	      <!-- maven-assembly-plugin -->
    2 	      <!-- 打包方式：mvn package -->
    3 	      <plugin>
    4 	        <groupId>org.apache.maven.plugins</groupId>
    5 	        <artifactId>maven-assembly-plugin</artifactId>
    6 	        <version>2.5.5</version>
    7 	        <configuration>
    8 	          <archive>
    9 	            <manifest>
   10 	              <mainClass>com.test.execute.Test</mainClass>
   11 	            </manifest>
   12 	          </archive>
   13 	          <descriptorRefs>
   14 	            <descriptorRef>jar-with-dependencies</descriptorRef>
   15 	          </descriptorRefs>
   16 	        </configuration>
   17 	        <executions>
   18 	          <execution>
   19 	            <id>make-assembly</id>
   20 	            <phase>package</phase>
   21 	            <goals>
   22 	              <goal>single</goal>
   23 	            </goals>
   24 	          </execution>
   25 	        </executions>
   26 	      </plugin>
```
```shell
D:\Tools\idea\oa\test\target>java -jar test-jar-with-dependencies.jar
Hello World!
```

3. maven-shade-plugin
```xml
    1 	      <!-- maven-shade-plugin -->
    2 	      <!-- 打包方式：mvn package -->
    3 	      <plugin>
    4 	        <groupId>org.apache.maven.plugins</groupId>
    5 	        <artifactId>maven-shade-plugin</artifactId>
    6 	        <version>2.4.1</version>
    7 	        <executions>
    8 	          <execution>
    9 	            <phase>package</phase>
   10 	            <goals>
   11 	              <goal>shade</goal>
   12 	            </goals>
   13 	            <configuration>
   14 	              <transformers>
   15 	                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
   16 	                  <mainClass>com.test.execute.Test</mainClass>
   17 	                </transformer>
   18 	              </transformers>
   19 	            </configuration>
   20 	          </execution>
   21 	        </executions>
   22 	      </plugin>
```
```shell
D:\Tools\idea\oa\test\target>java -jar test.jar
Hello World!
D:\Tools\idea\oa\test\target>java -jar test-1.0-SNAPSHOT-shaded.jar
Hello World!
```
<font color="red">注</font>：<mainClass>指定的类为使用java -jar  *.jar 时，默认使用的main类，如果你在使用jar包时，传入相应的类的全限定名称，那么使用的是这个类
例如：D:\Tools\idea\oa\test\target>java -jar test-1.0-SNAPSHOT-shaded.jar com.Nais.hdfs.WordCountDriver
那么会调用test-1.0-SNAPSHOT-shaded.jar中的com.Nais.hdfs.WordCountDriver的main方法
