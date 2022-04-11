# JDK体系结构
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131332.png)

# JVM整体架构
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131351.png)

## java中的编译器和解释器
Java中引入了虚拟机的概念，即在机器和编译程序之间加入了一层抽象的虚拟机器。这台虚拟的机器在任何平台上都提供给编译程序一个的共同的接口。编译程序只需要面向虚拟机，生成虚拟机能够理解的代码，然后由解释器来将虚拟机代码转换为特定系统的机器码执行。在Java中，这种供虚拟机理解的代码叫做字节码（即扩展为.class的文件），它不面向任何特定的处理器，只面向虚拟机。每一种平台的解释器是不同的，但是实现的虚拟机是相同的。Java源程序经过编译器编译后变成字节码，字节码由虚拟机解释执行，虚拟机将每一条要执行的字节码送给解释器，解释器将其翻译成特定机器上的机器码，然后在特定的机器上运行，这就是上面提到的Java的特点的编译与解释并存的解释。

**流程：**
java源代码 --> 编译器 --> jvm可执行的java字节码(即虚拟指令) --> jvm --> jvm中解释器 --> 机器码

# 编译期
通过javac命名将java文件编译成.class文件

# javap命令
javap是jdk自带的反解析工具。它的作用就是根据class字节码文件，反解析出当前类对应的code区（汇编指令）、本地变量表、异常表和代码行偏移量映射表、常量池等等信息。
当然这些信息中，有些信息（如本地变量表、指令和代码行偏移量映射表、常量池中方法的参数名称等等）需要在使用javac编译成class文件时，指定参数才能输出，比如，你直接javac xx.java，就不会在生成对应的局部变量表等信息，如果你使用`javac -g xx.java`就可以生成所有相关信息了。如果你使用的eclipse，则默认情况下，eclipse在编译时会帮你生成局部变量表、指令和代码行偏移量映射表等信息的。
通过反编译生成的汇编代码，我们可以深入的了解java代码的工作机制。比如我们可以查看i++；这行代码实际运行时是先获取变量i的值，然后将这个值加1，最后再将加1后的值赋值给变量i。
通过局部变量表，我们可以查看局部变量的作用域范围、所在槽位等信息，甚至可以看到槽位复用等信息。

javap的用法格式：
```
javap <options> <classes>
```
其中classes就是你要反编译的class文件。
在命令行中直接输入javap或javap -help可以看到javap的options有如下选项：
```
 -help  --help  -?        输出此用法消息
 -version                 版本信息，其实是当前javap所在jdk的版本信息，不是class在哪个jdk下生成的。
 -v  -verbose             输出附加信息（包括行号、本地变量表，反汇编等详细信息）
 -l                         输出行号和本地变量表
 -public                    仅显示公共类和成员
 -protected               显示受保护的/公共类和成员
 -package                 显示程序包/受保护的/公共类 和成员 (默认)
 -p  -private             显示所有类和成员
 -c                       对代码进行反汇编
 -s                       输出内部类型签名
 -sysinfo                 显示正在处理的类的系统信息 (路径, 大小, 日期, MD5 散列)
 -constants               显示静态最终常量
 -classpath <path>        指定查找用户类文件的位置
 -bootclasspath <path>    覆盖引导类文件的位置
 ```
一般常用的是-v -l -c三个选项。
`javap -v classxx`，不仅会输出行号、本地变量表信息、反编译汇编代码，还会输出当前类用到的常量池等信息。
`javap -l`会输出行号和本地变量表信息。
`javap -c`会对当前class字节码进行反编译生成汇编代码。

# Class类文件结构
Class文件是一组以8位字节为基础单位的二进制流，各个数据项目严格按照顺序紧凑地排列在Class文件中，中间没有添加任何分隔符，这使得整个Class文件中存储的内容几乎全部都是程序运行的必要数据。根据Java虚拟机规范的规定，Class文件格式采用一种类似于C语言结构体的伪结构来存储，这种伪结构中**只有两种数据类型：无符号数和表**。无符号数属于基本数据类型，以u1、u2、u4、u8来分别代表1、2、4、8个字节的无符号数。表是由多个无符号数或其他表作为数据项构成的符合数据类型，所有的表都习惯性地以`_info`结尾。
下表列出了Class文件中各个数据项的具体含义：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131430.png)
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131444.png)
从表中可以看出，无论是无符号数还是表，当需要描述同一类型但数量不定的多个数据时，经常会在其前面使用一个前置的容量计数器来记录其数量，而便跟着若干个连续的数据项，称这一系列连续的某一类型的数据为某一类型的集合，如：fields_count个field_info表数据便组成了方法表集合

这里需要注意的是：Class的结构不像XML等描述语言，由于它没有任何分隔符号，所以上表的数据项，无论是顺序还是数量，甚至于数据存储的字节序这样的细节，都是被严格限定的，每个字节代表的含义、长度、先后顺序都不允许改变。

## magic与version
每个Class文件的头4个字节称为魔数（magic），它的唯一作用是判断该文件是否为一个能被虚拟机接受的Class文件。它的值固定为0xCAFEBABE。紧接着magic的4个字节存储的是Class文件的次版本号(Minor Version)和主版本号(Major Version)，高版本的JDK能向下兼容低版本的Class文件，但不能运行更高版本的Class文件。

## constant_pool
major_version之后是常量池（constant_pool）的入口，它是Class文件中与其他项目关联最多的数据类型，也是占用Class文件空间最大的数据项目之一。

<font color="red">常量池中主要存放两大类常量：字面量和符号引用。</font>字面量比较接近于Java层面的常量概念，如文本字符串、被声明为final的常量值等。而符号引用总结起来则包括了下面三类常量：
- 类和接口的全限定名（即带有包名的Class名，如：org.lxh.test.TestClass）
- 字段的名称和描述符（private、static等描述符）
- 方法的名称和描述符（private、static等描述符）

虚拟机在加载Class文件时才会进行动态连接，也就是说，Class文件中不会保存各个方法和字段的最终内存布局信息，因此，这些字段和方法的符号引用不经过转换是无法直接被虚拟机使用的。当虚拟机运行时，需要从常量池中获得对应的符号引用，再在类加载过程中的解析阶段将其替换为直接引用，并翻译到具体的内存地址中。

这里说明下符号引用和直接引用的区别与关联：
- **<font color="red">符号引用</font>**：符号引用以一组符号来描述所引用的目标，符号可以是任何形式的字面量，只要使用时能无歧义地定位到目标即可, 比如java/lang/StringBuilder。符号引用与虚拟机实现的内存布局无关，引用的目标并不一定已经加载到了内存中。
- **<font color="red">直接引用</font>**：直接引用可以是直接指向目标的指针、相对偏移量或是一个能间接定位到目标的句柄， 比如指向内存里的java/lang/StringBuilder实例对象的指针。直接引用是与虚拟机实现的内存布局相关的，同一个符号引用在不同虚拟机实例上翻译出来的直接引用一般不会相同。如果有了直接引用，那说明引用的目标必定已经存在于内存之中了。

常量池中的每一项常量都是一个表，在jdk1.7之前共有11种结构各不相同的表结构数据，在jdk1.7中为了更好地支持动态语言调用，又额外增加了3种(CONSTANT_MethodHandle_info, CONSTANT_MethodType_info, CONSTANT_InvokeDynamic_info), 表开始的第一位是一个u1类型的标志位（1-12，缺少2），代表当前这个常量属于的常量类型。14种常量类型所代表的具体含义如下表所示：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131605.png)

这14种常量类型各自均有自己的结构。以CONSTANT_Class_info型常量为例，该结构中有一项name_index属性，该常属性中存放一个索引值，指向常量池中一个CONSTANT_Utf8_info类型的常量，该常量中即保存了该类的全限定名字符串。而CONSTANT_Fieldref_info、CONSTANT_Methodref_info、CONSTANT_InterfaceMethodref_info型常量的结构中都有一项index属性，存放该字段或方法所属的类或接口的描述符CONSTANT_Class_info的索引项。另外，最终保存的诸如Class名、字段名、方法名、修饰符等字符串都是一个CONSTANT_Utf8_info类型的常量，也因此，Java中方法和字段名的最大长度也即是CONSTANT_Utf8_info型常量的最大长度，在CONSTANT_Utf8_info型常量的结构中有一项length属性，它是u2类型的，即占用2个字节，那么它的最大的length即为65535。因此，Java程序中如果定义了超过64KB英文字符的变量或方法名，将会无法编译。

**常量池中14种常量项的结构总表**

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131620.png)

**为什么需要常量池？**
一个java源文件中的类、接口，编译后产生一个字节码文件。而java中的字节码需要数据支持，通常这种数据会很大以至于不能直接存到字节码里，换另一种方式，可以存到常量池，这个字节码包含了指向常量池的引用。在动态链接的时候会用到运行时常量池。

## access_flag
在常量池结束之后，紧接着的2个字节代表访问标志（access_flag），这个标志用于识别一些类或接口层次的访问信息，包括：这个Class是类还是接口，是否定义为public类型，abstract类型，如果是类的话，是否声明为final，等等。每种访问信息都由一个十六进制的标志值表示，如果同时具有多种访问信息，则得到的标志值为这几种访问信息的标志值的逻辑或。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131634.png)

## this_class、super_class、interfaces
类索引（this_class）和父类索引（super_class）都是一个u2类型的数据，而接口索引集合（interfaces）则是一组u2类型的数据集合，Class文件中由这三项数据来确定这个类的继承关系。类索引、父类索引和接口索引集合都按照顺序排列在访问标志之后，类索引和父类索引两个u2类型的索引值表示，它们各自指向一个类型为COMNSTANT_Class_info的类描述符常量，通过该常量中的索引值找到定义在COMNSTANT_Utf8_info类型的常量中的全限定名字符串。而接口索引集合就用来描述这个类实现了哪些接口，这些被实现的接口将按implements语句（ 如果这个类本身是个接口，则应当是extend语句）后的接口顺序从左到右排列在接口的索引集合中。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131649.png)

## field_info
字段表（field_info）用于描述接口或类中声明的变量。字段包括了类级变量或实例级变量，但不包括在方法内声明的变量。java中描述一个字段可以包含的信息有：字段的作用域(public、private、protected修饰符),是实例变量还是类变量(static修饰符),可变性(final修饰符), 并发可见性(volatile修饰符), 可否被序列化(transient修饰符), 字段基本类型，字段名称等。上述这些信息中，各个修饰符都是布尔值，要么有某个修饰符，要么没有，很适合使用标志位来表示，而字段叫什么名字、字段被定义成什么数据类型，这些都是无法固定的，只能引用常量池中的常量来描述。下面是字段表的最终格式：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131702.png)
字段修饰符放在access_flags项目中，它与类和接口中的access_flags项目是非常类似的，都是一个u2的数据类型，其中可以设置的标志位和含义见下图：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131717.png)

name_index和descriptor_index都是对常量池的引用，分别代表字段的简单名称及字段和方法的JNI描符符。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131730.png)

**最后需要注意一点：字段表集合中不会列出从父类或接口中继承而来的字段，但有可能列出原本Java代码中不存在的字段。比如在内部类中为了保持对外部类的访问性，会自动添加指向外部类实例的字段。**

## method_info
方法表（method_info）的结构与属性表的结构相同，方法里的Java代码，经过编译器编译成字节码指令后，存放在方法属性表集合中一个名为“Code”的属性里，关于属性表的项目，同样会在后面详细介绍。

**与字段表集合相对应，如果父类方法在子类中没有被覆写，方法表集合中就不会出现来自父类的方法信息。但同样，有可能会出现由编译器自动添加的方法，最典型的便是类构造器`<clinit>`方法和实例构造器`<init>`方法。**

在Java语言中，要重载一个方法，除了要与原方法具有相同的简单名称外，还要求必须拥有一个与原方法不同的特征签名，特征签名就是一个方法中各个参数在常量池中的字段符号引用的集合，也就是因为返回值不会包含在特征签名之中，因此Java语言里无法仅仅依靠返回值的不同来对一个已有方法进行重载。

## attribute_info
属性表（attribute_info）在前面已经出现过多系，在Class文件、字段表、方法表中都可以携带自己的属性表集合，以用于描述某些场景专有的信息。

属性表集合的限制没有那么严格，不再要求各个属性表具有严格的顺序，并且只要不与已有的属性名重复，任何人实现的编译器都可以向属性表中写入自己定义的属性信息，但Java虚拟机运行时会忽略掉它不认识的属性。Java虚拟机规范中预定义了9项虚拟机应当能识别的属性（JDK1.5后又增加了一些新的特性，因此不止下面9项），如下是其中一些属性中的关键常用的部分：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131740.png)

对于每个属性，它的名称都需要从常量池中引用一个CONSTANT_Utf8_info类型的常量来表示，每个属性值的结构是完全可以自定义的，只需说明属性值所占用的位数长度即可。一个符合规则的属性表至少应具有“attribute_name_info”、“attribute_length”和至少一项信息属性。

### Code属性
前面已经说过，Java程序方法体中的代码讲过Javac编译后，生成的字节码指令便会存储在Code属性中，但并非所有的方法表都必须存在这个属性，比如接口或抽象类中的方法就不存在Code属性。如果方法表有Code属性存在，那么它的结构将如下表所示：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131752.png)

**attribute_name_index，attribute_length**
attribute_name_index是一项指向CONSTANT_Utf8_info型常量的索引，常量值固定为“Code”，它代表了该属性的名称。attribute_length指示了属性值的长度，由于属性名称索引与属性长度一共是6个字节，所以属性值的长度固定为整个属性表的长度减去6个字节。

**max_stack，max_locals**
max_stack代表了操作数栈深度的最大值，max_locals代表了局部变量表所需的存储空间，它的单位是Slot，并不是在方法中用到了多少个局部变量，就把这些局部变量所占Slot之和作为max_locals的值，原因是局部变量表中的Slot可以重用。

**code_length**
code_length和code用来存储Java源程序编译后生成的字节码指令。code用于存储字节码指令的一系列字节流，它是u1类型的单字节，因此取值范围为0x00到0xFF，那么一共可以表达256条指令，目前，Java虚拟机规范已经定义了其中200条编码值对应的指令含义。code_length虽然是一个u4类型的长度值，理论上可以达到2^32-1，但是虚拟机规范中限制了一个方法不允许超过65535条字节码指令，如果超过了这个限制，Javac编译器将会拒绝编译。

**exception_table**
字节码指令之后是这个方法的显式异常处理表集合（exception_table），它对于Code属性来说并不是必须存在的。它的格式如下表所示：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131805.png)

它包含四个字段，这些字段的含义为：如果字节码从第start_pc行到第end_pc行之间（不含end_pc行）出现了类型为catch_type或其子类的异常（catch_type为指向一个CONSTANT_Class_info型常量的索引），则转到第handler_pc行继续处理，当catch_pc的值为0时，代表人和的异常情况都要转到handler_pc处进行处理。异常表实际上是Java代码的一部分，编译器使用异常表而不是简单的跳转命令来实现Java异常即finally处理机制，也因此，finally中的内容会在try或catch中的return语句之前执行

Code属性是Class文件中最重要的一个属性，如果把一个Java程序中的信息分为代码和元数据两部分，那么在整个Class文件里，Code属性用于描述代码，所有的其他数据项目都用于描述元数据。

### Exception属性
这里的Exception属是在方法表中与Code属性平级的一项属性，不要与Code属性中的exception_table产生混淆。Exception属性的作用是列举出方法中可能抛出的受查异常，也就是方法描述时在throws关键字后面列举的异常。它的结构很简单，只有attribute_name_index、attribute_length、number_of_exceptions、exception_index_table四项，从字面上便很容易理解，这里不再详述。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131815.png)

# 类加载
<font color="red">注：加载不等于类加载，加载只是类加载中的一个阶段</font>

其中类加载的过程包括了加载(Loading)、验证(Verification)、准备(Preparation)、解析(Resolution)、初始化(Initialization)五个阶段。在这五个阶段中，加载、验证、准备和初始化这四个阶段发生的顺序是确定的，而解析阶段则不一定，它在某些情况下可以在初始化阶段之后开始，这是为了支持Java语言的运行时绑定（也成为动态绑定或晚期绑定）。另外注意这里的几个阶段是按顺序开始，而不是按顺序进行或完成，因为这些阶段通常都是互相交叉地混合进行的，通常在一个阶段执行的过程中调用或激活另一个阶段。

这里简要说明下Java中的绑定：绑定指的是把一个方法的调用与方法所在的类(方法主体)关联起来，对java来说，绑定分为静态绑定和动态绑定：
- 静态绑定：即前期绑定。在程序执行前方法已经被绑定，此时由编译器或其它连接程序实现。针对java，简单的可以理解为程序编译期的绑定。java当中的方法只有final，static，private和构造方法是前期绑定的。
- 动态绑定：即晚期绑定，也叫运行时绑定。在运行时根据具体对象的类型进行绑定。在java中，几乎所有的方法都是后期绑定的。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131828.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131838.png)

<span id="loading"></span>

## 加载
加载时类加载过程的第一个阶段，在加载阶段，虚拟机需要完成以下三件事情：
1. 通过一个类的全限定名来获取其定义的二进制字节流。
2. 将这个字节流所代表的存储结构转化为方法区的运行时数据结构。
3. 在Java堆中生成一个代表这个类的java.lang.Class对象，**作为对方法区中这些数据的访问入口。**
注意，这里第1条中的二进制字节流并不只是单纯地从Class文件中获取，比如它还可以从Jar包中获取、从网络中获取（最典型的应用便是Applet）、由其他文件生成（JSP应用）等。

相对于类加载的其他阶段而言，加载阶段（准确地说，是加载阶段获取类的二进制字节流的动作）是可控性最强的阶段，因为开发人员既可以使用系统提供的类加载器来完成加载，也可以自定义自己的类加载器来完成加载。

加载阶段完成后，虚拟机外部的二进制字节流就按照虚拟机所需的格式存储在方法区之中，而且在Java堆中也创建一个java.lang.Class类的对象，这样便**可以通过该对象访问方法区中的这些数据，**俗称反射


### 类加载器
说到加载，不得不提到类加载器，下面就具体讲述下类加载器。

类型的加载是通过类加载器来进行加载的，类加载器虽然只用于实现类的加载动作，但它在Java程序中起到的作用却远远不限于类的加载阶段。对于任意一个类，都需要由它的类加载器和这个类本身一同确定其在就Java虚拟机中的唯一性，也就是说，即使两个类来源于同一个Class文件，只要加载它们的类加载器不同，那这两个类就必定不相等。这里的“相等”包括了代表类的Class对象的equals（）、isAssignableFrom（）、isInstance（）等方法的返回结果，也包括了使用instanceof关键字对对象所属关系的判定结果。

从Java虚拟机的角度来说，只存在两种不同的类加载器：
- 启动类加载器（Bootstrap ClassLoader），这个类加载器使用C++语言实现（HotSpot虚拟机中），是虚拟机自身的一部分；
- 所有其他的类加载器，这些类加载器都有Java语言实现，独立于虚拟机外部，并且全部继承自java.lang.ClassLoader。

从开发者的角度，类加载器可以细分为：
- 系统级别
  - 启动类加载器(根类加载器)：Bootstrap ClassLoader
  - 扩展类加载器：Extension ClassLoader
  - 应用程序类加载器（系统类加载器）：Application ClassLoader
- 用户级别
通过继承ClassLoader, 来自定义类加载器

### 启动类加载器(根类加载器)：Bootstrap ClassLoader
根类加载器是最底层的类加载器，是虚拟机的一部分，它是由C++语言实现的，且没有父加载器，也没有继承java.lang.ClassLoader类，他主要负责加载由系统属性“sun.boot.class.path”指定的路径下的核心类库（即`<JAVA_HOME>\jre\lib`）,出于安全考虑，根类加载器只加载java、javax、sun开头的类。
```java
public class Main{
  public static void main(String[] args){
    ClassLoader cl = Object.class.getClassLoader(); 
    System.out.println(cl); //输出Null， 不代表Object没有类加载器，而是代表Object的类加载器为启动类加载器，而在java中，启动类加载器输出为null
  }
}
```

### 扩展类加载器：Extension ClassLoade
扩展类加载器是指由SUN公司实现的sun.misc.Launcher$ExtClassLoader类（JDK9是jdk.internal.loader.ClassLoaders$PlatformClassLoader类），它是由java语言编写，父加载器是启动类加载器，负责加载`<JAVA_HOME>\jre\lib\ext`目录下的类库或者系统变量“java.ext.dirs”指定的目录下的类库。
以下是ExtClassLoader加载目录源码：
```java
private static File[] getExtDirs(){
  String s = System.getProperty(java.ext.dirs);
  File[] dirs;
  if( s != null){
    StringTokenizer st = new StringTokenizer(s, File.pathSeparator);
    int count = st.countTokens();
    dirs = new File[count];
    for(int i = 0; i < count; i++){
      dirs[i] = new Files(st.nextToken());
    }
  }else{
    dirs = new File[0];
  }
  return dirs;
}
```
例如我当前`<JAVA_HOME>\jre\lib\ext`目录如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131850.png)
其中dnsns.jar包如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329131908.png)
我们可以发现DNSNameService类的一定是通过扩展类类加载器来加载的；我们可以通过如下代码来验证
```java
ClassLoader cl = DNSNameService.class.getClassLoader();
System.out.println("DNSNameService"); // 输出为sun.misc.Launcher$ExtClassLoader@677327b6
```

### 应用程序类加载器（系统类加载器）：Application ClassLoader
系统类加载器也称之为应用类加载器，也是纯java类，是原SUN公司实现的sun.misc.Launcher$AppClassLoader类（JDK9是jdk.internal.loader.ClassLoaders$AppClassLoader）。它的父加载器是扩展类加载器。他负责从classpath环境变量或者系统属性java.class.path所指定的目录中加载类。它是用户自定义的类加载器的默认父加载器。一般情况下，是由该类加载器来加载我们自己写的java程序，可以通过ClassLoader.getSystemClassLoader()直接获取。
```java
public class Main{
  public static void main(String[] args){
    ClassLoader cl = Main.class.getClassLoader(); 
    System.out.println(cl); //输出：sun.misc.Launcher$AppClassLoader
  }
}
```

### 小结
在程序开发中，类的加载几乎是由上述3种类加载器相互配合执行的，同时我们还可以自定义类加载器、需要注意的是，java虚拟机对class文件采用的是按需加载的方式，也就是说需要使用该类时才会将它的class文件加载到内存生成class对象，而且加载某个类的class文件时，java虚拟机采用的是双亲委派模式，即把加载类的请求交由父加载器处理，它一种任务委派模式。

#### 类加载层级结构
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132012.png)
该模型要求除了顶层的启动类加载器外，其余的类加载器都应该有自己的父类加载器，而这种父子关系一般通过组合（Composition）关系来实现，而不是通过继承（Inheritance）。

通过java代码来得到每个加载器加载了那些类
```java
	/**
启动类加载器加载的职责
*/
public static void bootClassLoaderLoadingPath(){
	//获取启动类加载器加载的目录
	String bootStrapLoadingPath = System.getProperty("sun.boot.class.path");
	//把加载的目录转为集合
	List<String> bootLoadingPathList = Arrays.asList(bootStrapLoadingPath.split(";"));

	for(String bootPath:bootLoadingPathList){
		System.out.println("[启动类加载器----加载的目录]"+bootPath);
	}
} 

/**
扩展类加载器加载的职责
*/
public static void extClassLoaderLoadingPath(){
	//获取扩展类加载器加载的目录
	String extClassLoadingPath = System.getProperty("java.ext.dirs");
	//把加载的目录转为集合
	List<String> extLoadingPathList = Arrays.asList(extClassLoadingPath.split(";"));

	for(String exPath:extLoadingPathList){
		System.out.println("[扩展类加载器----加载的目录]"+extPath);
	}
} 

/**
系统类加载器加载的职责
*/
public static void extClassLoaderLoadingPath(){
	//获取系统类加载器加载的目录
	String appClassLoadingPath = System.getProperty("java.class.path");
	//把加载的目录转为集合
	List<String> appClassLoadingPathList = Arrays.asList(appClassLoadingPath.split(";"));

	for(String appPath:appClassLoadingPathList){
		System.out.println("[系统类加载器----加载的目录]"+appPath);
	}
} 
```

#### 双亲委派模型
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132024.png)
这种层次关系称为类加载器的双亲委派模型。我们把每一层上面的类加载器叫做当前层类加载器的父加载器，当然，它们之间的父子关系并不是通过继承关系来实现的，而是使用组合关系来复用父加载器中的代码。该模型在JDK1.2期间被引入并广泛应用于之后几乎所有的Java程序中，但它并不是一个强制性的约束模型，而是Java设计者们推荐给开发者的一种类的加载器实现方式。

双亲委派模型的工作流程是：如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把请求委托给父加载器去完成，依次向上，因此，所有的类加载请求最终都应该被传递到顶层的启动类加载器中，只有当父加载器在它的搜索范围中没有找到所需的类时，即无法完成该加载，子加载器才会尝试自己去加载该类。

**使用双亲委派机制的好处：**
1. 可以避免类的重复加载，当父类加载器已经加载了该类时，就没有必要子ClassLoader再加载一次。
2. 考虑到安全因素，java核心api中定义类型不会被随意替换，假设通过网络传递一个名为java.lang.Object的类，通过双亲委派模式传递到启动类加载器，而启动类加载器在核心java API发现这个名字的类，发现该类已被加载，并不会重新加载网络传递过来的java.lang.Object，而直接返回已加载过多Object.class，这样便可以防止核心API库被随意篡改。
```java
//注意包名
package java.lang;

public class Main{
  public static void main(String[] args){
  }
}
```
以上代码编译时，会报如下错误：
```
Main.java:1: 错误: 程序包已存在于另一个模块中: java.base
package java.lang;
```
因为java.lang包属于核心包，只能由启动类类加载器进行加载，而根据类加载的双亲委派机制，启动类类加载器是加载不到这个Main类的，所以只能由AppClassLoader进行加载，而这又不是允许的，所以会报以上错误；

**演示类加载器的父子关系**
```java
public class Main{
  public static void main(String[] args){
    ClassLoader loader = Main.class.getClassLoader(); 
    while(loader != null){
      System.out.println(loader);
      loader = loader.getParent();
    }
  }
}
```
输出结果：
```
sun.misc.Launcher$AppClassLoader@18b4aac2
sun.misc.Launcher$ExtClassLoader@1b6d3586
```

### ClassLoader
所有的类加载器（除了启动类类加载器）都必须继承java.lang.ClassLoader。它是一个抽象类，主要的方法如下：

#### loadClass
在ClassLoader的源码中，有一个方法loadClass(String name, boolean resolve), 这里就是双亲委派模式多代码实现。从源码中我们可以观察到它的执行顺序。需要注意的是，只有父类加载器加载不到类时，才会调用findClass方法进行类的查找，所以，在定义自己的类加载器时，不要覆盖该方法，而应该覆盖掉findClass方法。
```java
protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // 若本加载器之前是否已加载过，直接取缓存，native方法实现
            Class c = findLoadedClass(name);
            if (c == null) {
                try {
                    // 只要有父加载器就先委派父加载器来加载
                    if (parent != null) {
                        // 注意此处递归调用
                        c = parent.loadClass(name, false);
                    } else {
                        // ext的parent为null，因为Bootstrap是无法被程序被访问的，默认parent为null时其父加载器就是Bootstrap
                        // 此时直接用native方法调用启动类加载加载，若找不到则抛异常
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // 对ClassNotFoundException不做处理，仅用作退出递归
                }

                if (c == null) {
                    // 如果父加载器无法加载那么就在本类加载器的范围内进行查找
                    // findClass找到class文件后将调用defineClass方法把字节码导入方法区，同时缓存结果
                    c = findClass(name);
                }
            }
            // 是否解析，默认false
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```
过程讲解：
使用指定的二进制名称来加载类，此loadClass方法的默认实现将按以下顺序搜索类：
1. 调用findLoadedClass(String)来检查是否已经加载类
2. 在父类加载器上调用loadClass方法。如果父类加载器为null，则使用虚拟机的内置加载器
3. 调用findClass(String)方法查找类
如果使用上述步骤找到类，并且resolve标志为true，则此方法将在得到的Class对象上调用resolveClass(Class)方法。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132035.png)

#### findClass
在自定义类加载时，一般我们需要覆盖这个方法，且ClassLoader中给出了一个默认的错误实现, 如下：
```java
protected class<?> findClass(String name) throws ClassNotFoundException{
  throw new ClassNotFoundException(name);
}
```

#### defineClass
该方法的签名如下。用来将byte字节解析成虚拟机能够识别的Class对象。defineClass()方法通过与findClass()方法一起使用。在自定义类加载器时，会直接覆盖ClassLoader的findClass()方法获取要加载的类的字节码，然后调用defineClass()方法生产Class对象。
```java
protected final class<?> defineClass(String name, byte[] b, int off, int len) throws ClassFormatError
```

#### resolveClass
连接指定的类，类加载器可以使用此方法来连接类


### URLClassLoader
在java.net包中，JDK提供了一个更加易用的类加载器器URLClassLoader，它扩展了ClassLoader，能够从本地或者网络上指定的位置加载类，我们可以使用该类作为自定义的类加载器使用。

构造方法：
- public URLClassLoader(URL[] urls): 指定要加载的类所在的URL地址，父类加载器默认为应用程序加载器
- public URLClassLoader(URL[] urls, ClassLoader parent): 指定要加载的类所在的URL地址，并制定父类加载器

#### 案例1: 加载磁盘上的类
1. 首先在D盘上创建一个Demo类，如下：
```java
package com.itheima;

public class Demo{
  ... 
}
```
2. 使用`javac -d . Demo.java`命令编译
3. 然后使用如下方式来加载这个Demo字节码文件
```java
public class URLClassLoaderDemo{
  public static void main(String[] args) throws Exception{
    File file = new File("d:/");
    URL uri = file.toURL();
    URL url = uri.toURL();
    URLClassLoader classLoader = new URLClassLoader(new URL[]{url});
    System.out.println(classLoader.getParent());
    Class aClass = classLoader.loadClass("com.itheima.Demo");
    Object obj = aClass.newInstance();
  }
}
```

#### 案例2:加载网络上的类
```java
public static void main(String[] args) throws Exception{
  URL url = new URL("http://localhost:8080/examples/");
  URLClassLoader classLoader = new URLClassLoader(new URL[]{url});
  System.out.println(classLoader.getParent());
  Class aClass = classLoader.loadClass("com.itheima.Demo");
  aClass.newInstance();
}
```

### 自定义类加载器
我们如果需要自定义类加载器，只需要继承ClassLoader类，并覆盖掉findClass方法即可。
#### 自定义文件类加载器
1. 在`~/Temp/java/classLoaderTest`目录下有如下类：
```
wanghengzhi@:~/Temp/java/classLoaderTest$ lla
total 24
drwxr-xr-x   5 wanghengzhi  staff   160 11  2 14:20 .
drwxr-xr-x  18 wanghengzhi  staff   576 11  2 13:53 ..
-rw-r--r--   1 wanghengzhi  staff   101 11  2 14:17 Demo.java
-rw-r--r--   1 wanghengzhi  staff   322 11  2 14:18 Main.java
-rw-r--r--   1 wanghengzhi  staff  1044 11  2 14:17 MyFileClassLoader.java
wanghengzhi@:~/Temp/java/classLoaderTest$ 
```
2. Demo.java文件如下：
```java
package com.whz;

public class Demo{
  public Demo(){
    System.out.println("Demo instance");
  }
}
```
3. MyFileClassLoader.java文件如下：
```java
package com.whz;

import java.io.*;

//1.继承ClassLoader类
//2.重写findClass方法 
public class MyFileClassLoader extends ClassLoader{
  private String directory;
  public MyFileClassLoader(String directory){
    this.directory = directory;
  }

  public MyFileClassLoader(String directory, ClassLoader parent){
    super(parent);
    this.directory = directory;
  }

  @Override
  protected Class<?> findClass(String name) throws ClassNotFoundException{
    try{
      //将类名转换为目录
      String file = directory + name.replaceAll(",", File.separator) + ".class";
      //构建输入流
      InputStream in = new FileInputStream(file);
      //构建字节输出流
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      byte[] buf = new byte[1024];
      int len = -1;
      while((len = in.read(buf)) != -1){
        baos.write(buf,0,len);
      }
      byte[] data = baos.toByteArray();
      in.close();
      baos.close();
      return defineClass(name, data, 0, data.length);
    }catch(IOException e){
      throw new RuntimeException(e);
    }
  }
}
```
3. Main.java文件如下：
```java
package com.whz;

import com.whz.MyFileClassLoader;

public class Main{
  public static void main(String[] args) throws Exception{
    MyFileClassLoader myFileClassLoader = new MyFileClassLoader("~/Temp/java/classLoaderTest");
    Class clazz = myFileClassLoader.loadClass("com.whz.Demo");
    clazz.newInstance();
  } 
}
```

4. 编译\运行项目
```shell
wanghengzhi@:~/Temp/java/classLoaderTest$ javac -d . $(find . -name '*.java')
注: ./Main.java使用或覆盖了已过时的 API。
注: 有关详细信息, 请使用 -Xlint:deprecation 重新编译。
wanghengzhi@:~/Temp/java/classLoaderTest$ tree
.
├── Demo.java
├── Main.java
├── MyFileClassLoader.java
└── com
    └── whz
        ├── Demo.class
        ├── Main.class
        └── MyFileClassLoader.class

2 directories, 6 files
wanghengzhi@:~/Temp/java/classLoaderTest$ java com/whz/Main
Demo instance
wanghengzhi@:~/Temp/java/classLoaderTest$ 
```

### 类的显示与隐式加载
类的加载方式是指虛拟机将class文件加载到内存的方式。
- 显式加载是指在java代码中通过调用ClassLoader加载class对象，比如Class.forName(String name);this.getClass().getClassLoader().loadClass()加载类。
- 隐式加载指不需要在java代码中明确调用加载的代码，而是通过虚拟机自动加载到内存中。比如在加载某个class时，该class引用了另外一个类的对象了那么这个对象的字节码文件就会被虛拟机自动加载到内存中。

### 线程上下文类加载器
在java中存在着很多的服务提供者接口SPI，全称Service Prcrider Interface，是java提供的一套用来被第三方实现或者扩展的API，这些接口一般由第三方提供实现，常见的SPI有JDBC、INDI等。这些SPI的接口（比如JDBC中的java.sql.Driver）属于核心类库，一般存在rt.jar包中，由根类加载器加载。而第三方实现的代码一般作为依赖jar包存放在classpath路径下，由于SPI接口中的代码需要加载具体的第三方实现类并调用其相关方法，SPI的接口类是由根类加载器加载的，Bootstrap类加载器无法直接加载位于classpath下的具体实现类。由于双亲委派模式的存在，Bootstrap类加载器也无法反向委托AppClassLoader加载SPI的具体实现类。在这种情况下，java提供了线程上下文类加载器用于解决以上问题
线程上下文类加载器可以通过java.lang.Thread的getContextClassLoader(来获取，或者通过set ContextClassLoader(ClassLoader cl)来设置线程的上下文类加载器。如果没有手动设置上下文类加载器，线程将继承其父线程的上下文类加载器，初始线程的上下文类加载器是系统类加载器 (AppClassLoader），在线程中运行的代码可以通过此类加载品来加载类或资源。
显然这种加载类的方式破坏了双亲委托模型，但它使得java类加载器变得更加灵活。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132046.png)

## 类的链接过程
当类的字节码文件被加载进JVM内存之后，JVM便会创建一个对应的Class对象（也可以叫字节码对象），把字节码指令中对常量池中的**符号引用转换为直接引用**，接着把类的字节码指令合并到JRE中。链接包含三个步骤：验证、准备、解析

### 验证
验证的目的是为了确保Class文件中的字节流包含的信息符合当前虚拟机的要求，而且不会危害虚拟机自身的安全。不同的虚拟机对类验证的实现可能会有所不同，但大致都会完成以下四个阶段的验证：文件格式的验证、元数据的验证、字节码验证和符号引用验证。

### 准备
准备阶段是**正式为类变量分配内存并设置类变量初始值的阶段，这些内存都将在方法区中分配**。对于该阶段有以下几点需要注意：
1. 这时候进行内存分配的仅包括类变量（static），而不包括实例变量，实例变量会在对象实例化时随着对象一块分配在Java堆中。
2. 这里所设置的初始值通常情况下是数据类型默认的零值（如0、0L、null、false等），而不是被在Java代码中被显式地赋予的值。
假设一个类变量的定义为：`public static int value = 3；`
那么变量value在准备阶段过后的初始值为0，而不是3，因为这时候尚未开始执行任何Java方法，而把value赋值为3的putstatic指令是在程序编译后，存放于类构造器`<clinit>()`方法之中的，所以把value赋值为3的动作将在初始化阶段才会执行。
3. 如果类字段的属性表中存在ConstantValue属性，即同时被final和static修饰，那么在准备阶段变量value就会被初始化为ConstValue属性所指定的值。
假设上面的类变量value被定义为： `public static final int value = 3；`
编译时Javac将会为value生成ConstantValue属性，在准备阶段虚拟机就会根据ConstantValue的设置将value赋值为3。我们可以理解为static final常量在编译期（编译成class文件）就将其结果放入了调用它的类的常量池中

### 解析
**解析阶段是虚拟机将常量池中的符号引用转化为直接引用的过程**。在Class类文件结构一文中已经比较过了符号引用和直接引用的区别和关联，这里不再赘述。前面说解析阶段可能开始于初始化之前，也可能在初始化之后开始，虚拟机会根据需要来判断，到底是在类被加载器加载时就对常量池中的符号引用进行解析（初始化之前），还是等到一个符号引用将要被使用前才去解析它（初始化之后）。

对同一个符号引用进行多次解析请求时很常见的事情，虚拟机实现可能会对第一次解析的结果进行缓存（在运行时常量池中记录直接引用，并把常量标示为已解析状态），从而避免解析动作重复进行。

解析动作主要针对类或接口、字段、类方法、接口方法四类符号引用进行，分别对应于常量池中的CONSTANT_Class_info、CONSTANT_Fieldref_info、CONSTANT_Methodref_info、CONSTANT_InterfaceMethodref_info四种常量类型。
1. 类或接口的解析：判断所要转化成的直接引用是对数组类型，还是普通的对象类型的引用，从而进行不同的解析。
2. 字段解析：对字段进行解析时，会先在本类中查找是否包含有简单名称和字段描述符都与目标相匹配的字段，如果有，则查找结束；如果没有，则会按照继承关系从上往下递归搜索该类所实现的各个接口和它们的父接口，还没有，则按照继承关系从上往下递归搜索其父类，直至查找结束，查找流程如下图所示：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132059.png)
最后需要注意：理论上是按照上述顺序进行搜索解析，但在实际应用中，虚拟机的编译器实现可能要比上述规范要求的更严格一些。如果有一个同名字段同时出现在该类的接口和父类中，或同时在自己或父类的接口中出现，编译器可能会拒绝编译
3. 类方法解析：对类方法的解析与对字段解析的搜索步骤差不多，只是多了判断该方法所处的是类还是接口的步骤，而且对类方法的匹配搜索，是先搜索父类，再搜索接口。
4. 接口方法解析：与类方法解析步骤类似，知识接口不会有父类，因此，只递归向上搜索父接口就行了。

## 类初始化
类初始化是类加载过程的最后一步，到了此阶段，才真正开始执行类中定义的Java程序代码。在准备阶段，类变量已经被赋过一次系统要求的初始值，而在初始化阶段，则是根据程序员通过程序指定的主观计划去初始化类变量和其他资源，或者可以从另一个角度来表达：初始化阶段是执行类构造器`<clinit>()`方法的过程。

类初始化只进行一次（前提是被同一类加载器加载），后续使用 new 等实例化对象时都不在进行初始化了，但是需要进行实例初始化，所以类初始化只运行一次。初始化的都是属于类（而不是实例）的内容（静态），所以对所有实例共享。

这里简单说明下`<clinit>()`方法的执行规则:
- `<clinit>()`方法是由编译器自动收集类中的<font color="red">所有类变量的赋值动作和静态语句块(static{})中的语句合</font>并产生的，编译器收集的顺序是由语句在源文件中出现的顺序所决定的，静态语句块中只能访问到定义在静态语句块之前的变量，定义在它之后的变量，在前面的静态语句中可以赋值，但是不能访问。
- `<clinit>()`方法与实例构造器`<init>()`方法（类的构造函数）不同，它不需要显式地调用父类构造器，虚拟机会保证在子类的`<clinit>()`方法执行之前，父类的`<clinit>()`方法已经执行完毕。因此，在虚拟机中第一个被执行的`<clinit>()`方法的类肯定是java.lang.Object。
- `<clinit>()`方法对于类或接口来说并不是必须的，如果一个类中没有静态语句块，也没有对类变量的赋值操作，那么编译器可以不为这个类生成`<clinit>()`方法。
- 接口中不能使用静态语句块，但仍然有类变量（final static）初始化的赋值操作，因此接口与类一样会生成`<clinit>()`方法。但是接口与类不同的是：执行接口的`<clinit>()`方法不需要先执行父接口的`<clinit>()`方法，只有当父接口中定义的变量被使用时，父接口才会被初始化。另外，接口的实现类在初始化时也一样不会执行接口的`<clinit>()`方法。
- 虚拟机会保证一个类的`<clinit>()`方法在多线程环境中被正确地加锁和同步，如果多个线程同时去初始化一个类，那么只会有一个线程去执行这个类的`<clinit>()`方法，其他线程都需要阻塞等待，直到活动线程执行`<clinit>()`方法完毕。如果在一个类的`<clinit>()`方法中有耗时很长的操作，那就可能造成多个线程阻塞，在实际应用中这种阻塞往往是很隐蔽的。

### 触发类初始化
虚拟机规范严格规定了有且只有四种情况必须立即对类进行初始化：
- 遇到new、getstatic、putstatic、invokestatic这四条字节码指令时，如果类还没有进行过初始化，则需要先触发其初始化。生成这四条指令最常见的Java代码场景是：使用new关键字实例化对象时、读取或设置一个类的静态字段（static）时（被static修饰又被final修饰的，已在编译期把结果放入常量池的静态字段除外）、以及调用一个类的静态方法时。
- 使用Java.lang.refect包的方法对类进行反射调用时，如果类还没有进行过初始化，则需要先触发其初始化。
- 当初始化一个类的时候，如果发现其父类还没有进行初始化，则需要先触发其父类的初始化。
- 当虚拟机启动时，用户需要指定一个要执行的主类，虚拟机会先执行该主类。
虚拟机规定只有这四种情况才会触发类的初始化，称为对一个类进行**主动引用**，除此之外所有引用类的方式都不会触发其初始化，称为被动引用。下面举一些例子来说明**被动引用**。
1. 通过子类引用父类中的静态字段，这时对子类的引用为被动引用，因此不会初始化子类，只会初始化父类
```java
class Father{
	public static int m = 33;
	static{
		System.out.println("父类被初始化");
	}
}
 
class Child extends Father{
	static{
		System.out.println("子类被初始化");
	}
}
 
public class StaticTest{
	public static void main(String[] args){
		System.out.println(Child.m);
	}
}
```
执行后输出的结果如下：
```
父类被初始化
33
```
对于静态字段，只有直接定义这个字段的类才会被初始化，因此，通过其子类来引用父类中定义的静态字段，只会触发父类的初始化而不会触发子类的初始化。

2. static常量在编译阶段会存入调用它的类的常量池中，本质上没有直接引用到定义该常量的类，因此不会触发定义常量的类的初始化
```java
class Test{
	public static final String NAME = "我是常量";
	static{
		System.out.println("初始化Const类");
	}
}
 
public class FinalTest{
	public static void main(String[] args){
		System.out.println(Test.NAME);
	}
}
```
执行后输出的结果如下：
```
我是常量
```
虽然程序中引用了Test类的static常量NAME，但是在编译阶段将此static常量的值“我是常量”存储到了调用它的类FinalTest的常量池中（见[准备过程](#准备)），对常量Test.NAME的引用实际上转化为了FinalTest类对自身常量池的引用。也就是说，实际上FinalTest的Class文件之中并没有Test类的符号引用入口，这两个类在编译成Class文件后就不存在任何联系了。

3. 通过数组定义来引用类，不会触发类的初始化
```java
class Const{
	static{
		System.out.println("初始化Const类");
	}
}
 
public class ArrayTest{
	public static void main(String[] args){
		Const[] con = new Const[5];
	}
}
```
执行后不输出任何信息，说明Const类并没有被初始化。
但这段代码里触发了另一个名为“LLConst”的类的初始化，它是一个由虚拟机自动生成的、直接继承于java.lang.Object的子类，创建动作由字节码指令newarray触发，很明显，这是一个对数组引用类型的初初始化，而该数组中的元素仅仅包含一个对Const类的引用，并没有对其进行初始化。如果我们加入对con数组中各个Const类元素的实例化代码，便会触发Const类的初始化，如下：
```java
class Const{
	static{
		System.out.println("初始化Const类");
	}
}
 
public class ArrayTest{
	public static void main(String[] args){
		Const[] con = new Const[5];
		for(Const a:con)
			a = new Const();
	}
}
```
这样便会得到如下输出结果：
```
初始化Const类
```
根据四条规则的第一条，这里的new触发了Const类。


# 实例初始化
实例初始化 `<init>`：也就是实例化对象时(即new一个对象)每次都会进行的过程，初始化属于实例的内容（非静态），没有实例所拥有的实例内容是不共享的，独有的。

构造器：保证实例正确的初始化，能被使用。
所以，既然子类继承了父类，那么子类调用构造函数初始化的，就需要调用父类的构造器，不管是显示调用父类构造器还是 JVM 自动调用，这样才能保证子类正确的被构造。
那么，实例初始化的过程到底是如何的呢？
- JVM 收集实例**非静态变量和 {} 域**组合成实例初始化方法`<init>()`；
- 实例初始化时首先执行 `<init>()` 方法，然后执行构造函数；
- 子类通过构造函数构造实例时会首先调用父类的 `<init>()` 方法和父类的构造函数，如果没有显示调用父类的构造函数，那么 JVM 会自动调用父类的无参构造函数，保证父类构造函数一定被调用，然后再是子类自己的 `<init>()` 方法和构造函数；
至此，实例就构造完毕了；

# java的类/实例初始化顺序
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132110.png)

实例一：
组合的初始化
```java
class Window {
    static {
        System.out.println("Window static");
    }
    Window (){
        System.out.println("Window()");
    }
    Window (int marker) {
        System.out.println("Window(" + marker + ")");
    }
}
class House {
    static {
        System.out.println("House static");
    }
    Window w1 = new Window(1);// Before constructor
    House() {
        System.out.println("House()");
        w3 = new Window(33);
    }
    Window w2 = new Window(2);
    void f() {
        System.out.println("f()");
    }
    Window w3 = new Window(3);
}
public class OrderOfInitialization {
    static{
      System.out.println("Te");
    }
    public static void main(String[] args) {
        House h = new House();
        h.f();
    }
}
```
输出：
```
Te
House static
Window static
Window(1)
Window(2)
Window(3)
House()
Window(33)
f()
```

示例二：
继承的初始化
```java
class Person {
    private int i = 8;
    protected int j;
    static {
        System.out.println("Person 静态初始化子句");
    }
    {
        System.out.println("Person 实例初始化子句");
    }
    Person () {
        System.out.println("Person()");
    }
    Person(int i) {
        System.out.println("Person(int), i=" + i);
    }
    int k = printInit("Person.k 初始化");
    static int m = printInit("static Person.m 初始化");
    {
        System.out.println("Person 后置实例初始化语句");
    }
    static int printInit(String s) {
        System.out.println(s);
        return 47;
    }
}

public class Student extends Person {
    Student () {
        super(1);
        System.out.println("Student()");
    }
    Student(int i) {
        this();
        System.out.println("Student(int), i=" + i);
    }
    public static void main(String[] args) {
        new Person(3);
        System.out.println("--------------------------");
        Student student = new Student(2);
    }

    public static int marker = printInit("Student.marker 初始化");

    {
        System.out.println("Student 实例初始化域");
    }
}
```
输出：
```txt
Person 静态初始化子句
static Person.m 初始化
Student.marker 初始化
Person 实例初始化子句
Person.k 初始化
Person 后置实例初始化语句
Person(int), i=3
--------------------------
Person 实例初始化子句
Person.k 初始化
Person 后置实例初始化语句
Person(int), i=1
Student 实例初始化域
Student()
Student(int), i=2
```
(静态变量，静态初始化块) -> (变量，初始化块) -> (构造器)
加载(静态变量，静态初始化块)的过程是类初始化过程
加载(变量，初始化块)、构造器的过程是实例初始化过程

>注：
静态变量与静态初始化块的执行顺序与所写的顺序一致
变量与初始化块的执行顺序与所写的顺序一致

# Java内存区域
Java虚拟机在执行Java程序的过程中会把他所管理的内存划分为若干个不同的数据区域。Java虚拟机规范将JVM所管理的内存分为以下几个运行时数据区：**程序计数器、Java虚拟机栈、本地方法栈、Java堆、方法区**。下面详细阐述各数据区所存储的数据类型。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132120.png)
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132133.png)

## 程序计数器（Program Counter Register）
一块较小的内存空间，它是当前线程所执行的字节码的行号指示器，字节码解释器工作时通过改变该计数器的值来选择下一条需要执行的字节码指令，分支、跳转、循环等基础功能都要依赖它来实现。**每条线程都有一个独立的的程序计数器，各线程间的计数器互不影响，因此该区域是线程私有的。**

当线程在执行一个Java方法时，该计数器记录的是正在执行的虚拟机字节码指令的地址，当线程在执行的是Native方法（调用本地操作系统方法）时，该计数器的值为空。另外，**该内存区域是唯一一个在Java虚拟机规范中没有规定任何OOM（内存溢出：OutOfMemoryError）情况的区域**。

## Java虚拟机栈（Java Virtual Machine Stacks）
Java虚拟机栈(Java Virtual Machine Stack), 早期也叫Java栈。每个线程在创建时都会创建一个虚拟机栈，它的生命周期也与线程相同。

虚拟机栈描述的是Java方法执行的内存模型：每个方法被执行的时候都会同时创建一个栈帧，栈它是用于支持续虚拟机进行方法调用和方法执行的数据结构。对于执行引擎来讲，活动线程中，只有栈顶的栈帧是有效的，称为当前栈帧，这个栈帧所关联的方法称为当前方法，执行引擎所运行的所有字节码指令都只针对当前栈帧进行操作。**栈帧用于存储局部变量表、操作数栈、动态链接、方法返回地址和一些额外的附加信息。在编译程序代码时，栈帧中需要多大的局部变量表、多深的操作数栈都已经完全确定了，并且写入了方法表的Code属性之中。因此，一个栈帧需要分配多少内存，不会受到程序运行期变量数据的影响，而仅仅取决于具体的虚拟机实现**。
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132142.png)

对于虚拟栈来说，是不存在垃圾回收问题的

**在Java虚拟机规范中，对这个区域规定了两种异常情况：** 
java虚拟机规范允许java栈的大小是动态的或者是固定不变的
- 如果采用固定大小的Java虚拟机栈，那每一个线程的Java虚拟机栈容量可以在线程创建的时候独立选定。如果线程请求分配的栈容量超过Java虚拟机栈允许的最大容量，Java虚拟机将会抛出一个StackOverflowError异常。
- 如果Java虚拟机栈可以动态扩展，并且在尝试扩展的时候无法申请到足够的内存，或者在创建新的线程时没有足够的内存去创建对应的虚拟机栈，那Java虚拟机将会抛出一个OutOfMemoryError异常。

**设置栈内存大小**
我们可以使用参数-Xss选项来设置线程的最大栈空间
用k或K表示KB，m或M表示MB，g或G表示GB。 如果什么都不加，则表示bytes
例如: 下面都是表示设置成1024KB大小
```
-Xss1m
-Xss1024k
-Xss1048576
```

**实例：**
```java
public class Math{

  public static int count = 1;

  public static void main(String[] args){
    try{
      count++; 
      main(args);
    }catch(StackOverflowError e){
      System.out.println("输出："+count);
    }
  }
}
```
```shell
javac Math.java && java -Xss1m Math
输出：17946

javac Math.java && java -Xss5m Math
输出：123063
```

### 栈帧
栈帧(Stack Frame)是用于支持虚拟机进行方法调用和方法执行的数据结构。栈帧存储了方法的局部变量表、操作数栈、动态连接和方法返回地址等信息。每一个方法从调用至执行完成的过程，都对应着一个栈帧在虚拟机栈里从入栈到出栈的过程。
栈帧是用来存储数据和部分过程结果的数据结构，同时也用来处理动态连接、方法返回值和异常分派。
栈帧随着方法调用而创建，随着方法结束而销毁——无论方法正常完成还是异常完成都算作方法结束。
栈帧的存储空间由创建它的线程分配在Java虚拟机栈之中，每一个栈帧都有自己的本地变量表(局部变量表)、操作数栈和指向当前方法所属的类的运行时常量池的引用。
接下来，详细讲解一下栈帧中的局部变量表、操作数栈、动态连接、方法返回地址等各个部分的数据结构和作用。

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132152.png)
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132202.png)

#### 局部变量表
局部变量表是一组变量值存储空间，用于存放方法参数和方法内部定义的局部变量，其中存放的数据的类型是编译期可知的各种基本数据类型、对象引用（reference）和returnAddress类型（它指向了一条字节码指令的地址）。局部变量表所需的内存空间在编译期间完成分配，即在Java程序被编译成Class文件时，就确定了所需分配的最大局部变量表的容量。当进入一个方法时，这个方法需要在栈中分配多大的局部变量空间是完全确定的，在方法运行期间不会改变局部变量表的大小。

局部变量表的容量以变量槽（Slot）为最小单位。在虚拟机规范中并没有明确指明一个Slot应占用的内存空间大小（允许其随着处理器、操作系统或虚拟机的不同而发生变化），一个Slot可以存放一个32位以内的数据类型：boolean、byte、char、short、int、float、reference和returnAddresss。reference是对象的引用类型，returnAddress是为字节指令服务的，它执行了一条字节码指令的地址。对于64位的数据类型（long和double），虚拟机会以高位在前的方式为其分配两个连续的Slot空间。

虚拟机通过索引定位的方式使用局部变量表，索引值的范围是从0开始到局部变量表最大的Slot数量，对于32位数据类型的变量，索引n代表第n个Slot，对于64位的，索引n代表第n和第n+1两个Slot。

在方法执行时，虚拟机是使用局部变量表来完成参数值到参数变量列表的传递过程的，如果是实例方法（非static），则局部变量表中的第0位索引的Slot默认是用于传递方法所属对象实例的引用，在方法中可以通过关键字“this”来访问这个隐含的参数。其余参数则按照参数表的顺序来排列，占用从1开始的局部变量Slot，参数表分配完毕后，再根据方法体内部定义的变量顺序和作用域分配其余的Slot。

```java
public class Math{
  public static int count = 1;

  public static void main(String[] args){
    Math m = new Math();
    int a = 10;
    System.out.println(m.meth());
  }
  
  public static int meth(){
    int a = 1;
    int b = 2;
    return a+b;
  }
}
```
对应上述代码使用`javac -g Math.java`来编译，加-g参数的目的是让生成的字节码文件带有局部变量表信息。然后使用`javap -v Math.class`来查看字节码文件详细信息，如下
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132217.png)

**注：**
如果当前栈帧是由构造方法或者非静态方法创建的，那么该对象引用this将会放在index为0的slot处，其余的参数按照参数表顺序继续排列,如下是一个非静态方法的局部变量表信息：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132243.png)
**这也就是为什么静态方法中不能使用this的原因所在**；即this变量不存在与静态方法的局部变量表中，即没办法使用this

<font color="red">有关局部变量、实例成员变量、类成员变量的存放位置</font>
实例成员变量的生命周期是跟随对象的。而对象实例化之后，存放在堆中，所以实例成员变量也会存在堆中。
类成员变量的生命周期是跟随类的，而类加载后，存放在方法区中，所以
静态变量(也叫类变量)是存放在方法区中的。
局部变量是属于方法的，也就存在栈中。
**注：局部变量表是不会存放成员变量的**
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132258.png)

**槽位重用**
栈帧中的局部变量表中的槽位是可以重复用的，如果一个局部变量过了其作用域，那么在其作用域之后申明的新的局部变量就很有可能会复用过期局部变量的槽位，从而达到节省资源的目的，如下所示
```java
public void meth1(){
  int a = 0;
  {
    int b = 0;
    b = a + 1;
  }
  int c = a + 1;
}
```
对应的局部变量表：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132311.png)

#### 操作数栈
操作数栈又常被称为操作栈，操作数栈的最大深度也是在编译的时候就确定了。32位数据类型所占的栈容量为1,64为数据类型所占的栈容量为2。当一个方法开始执行时，它的操作栈是空的，在方法的执行过程中，会有各种字节码指令（比如：加操作、赋值元算等）向操作栈中写入和提取内容，也就是入栈和出栈操作。

#### 动态连接
每个栈帧都包含一个指向运行时常量池（在方法区中，后面介绍）中该栈帧所属方法的引用，持有这个引用是为了支持方法调用过程中的动态连接。Class文件的常量池中存在有大量的符号引用，字节码中的方法调用指令就以常量池中指向方法的符号引用为参数。这些符号引用，一部分会在类加载阶段或第一次使用的时候转化为直接引用（如final、static域等），称为静态解析，另一部分将在每一次的运行期间转化为直接引用，这部分称为动态连接。

**实例**
```java
public class Math{

  public static void main(String[] args){
    int a = 10;
    meth();
  }
  
  public static int meth(){
    int a = 1;
    return a;
  }
}
```
对应的字节码文件如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132322.png)

#### 方法返回地址
当一个方法被执行后，有两种方式退出该方法：执行引擎遇到了任意一个方法返回的字节码指令或遇到了异常，并且该异常没有在方法体内得到处理。无论采用何种退出方式，在方法退出之后，都需要返回到方法被调用的位置，程序才能继续执行。方法返回时可能需要在栈帧中保存一些信息，用来帮助恢复它的上层方法的执行状态。一般来说，方法正常退出时，调用者的PC计数器的值就可以作为返回地址，栈帧中很可能保存了这个计数器值，而方法异常退出时，返回地址是要通过异常处理器来确定的，栈帧中一般不会保存这部分信息。

方法退出的过程实际上等同于把当前栈帧出站，因此退出时可能执行的操作有：恢复上层方法的局部变量表和操作数栈，如果有返回值，则把它压入调用者栈帧的操作数栈中，调整PC计数器的值以指向方法调用指令后面的一条指令。

## 堆
Java 中的堆是 JVM 管理的最大的一块内存空间，主要用于存放Java类的实例对象，其被划分为二个不同的区域：年轻代 ( Young )、老年代 ( Old )，其中年轻代 ( Young )又被划分为：Eden、From Survivor和To Survivor三个区域，如下图所示：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132333.png)
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132342.png)

- 堆大小 = 年轻代( Young ) + 老年代( Old )。
- 年轻代 ( Young ) 被细分为 Eden 和 两个 Survivor 区域，为了便于区分，两个 Survivor 区域分别被命名为 from 和 to。默认情况下，Eden : from : to = 8 : 1 : 1 ( 可以通过参数 –XX:SurvivorRatio 来设定 )，即： Eden = 8/10 的年轻代空间大小，from = to = 1/10 的年轻代空间大小。JVM 每次只使用 Eden 和其中的一块 Survivor 区域来为对象服务，所以无论什么时候，总是有一块 Survivor 区域是空闲着的，因此，年轻代实际可用的内存空间为 9/10 ( 即90% )的年轻代空间。
- 工作原理：
  - Eden区为Java对象分配堆内存，当 Eden 区没有足够空间分配时，JVM发起一次Minor GC，将Eden区仍然存活的对象放入Survivor from区，并清空 Eden 区；
  - Eden区被清空后，继续为新的Java对象分配堆内存；
  - 当Eden区再次没有足够空间分配时，JVM对Eden区和Survivor from区同时发起一次 Minor GC，把存活对象放入Survivor to区，同时清空Eden 区和Survivor from区；
  - Eden区继续为新的Java对象分配堆内存，并重复上述过程：Eden区没有足够空间分配时，把Eden区和某个Survivor区的存活对象放到另一个Survivor区；
  - JVM给每个对象设置了一个对象年龄（Age）计数器，每熬过一场Minor GC，对象年龄增加1岁，当它的年龄增加到阈值（默认为15，可以通过-XX：MaxTenuringThreshold 参数自定义该阀值），将被“晋升”到老年代，当 Old 区也被填满时，JVM发起一次 Major GC，对 Old 区进行垃圾回收。如果进行Major Gc后，Old区还是满的，则会导致内存溢出错误

**Minor GC, Major GC, Full GC**
针对HotSpot VM的实现，它里面的GC按照回收区域有分为两大类型：一种是部分收集(Partial GC), 一种是整体收集(Full GC)
- 部分收集：不是完整收集整个Java堆的垃圾收集。其中有分为
  - 新生代收集(Minor GC / Young GC): 只是新生代的垃圾收集
  - 老年代收集(Major GC / Old GC): 只是老年代的垃圾收集。 目前只有CMS GC会有单独收集老年代的行为。注意，很多时候Major GC会和Full GC混合使用，需要具体分辨是老年代回收还是整堆回收
  - 混合收集(Mixed GC): 收集整个新生代以及部分老年代的垃圾回收。目前只有G1 GC会有这种行为
- 整堆收集(Full GC): 收集整个java堆和方法区垃圾收集

**所有的GC操作都会触发全世界的暂停STW（stop-the-world)，停止应用程序的所有用户线程，不过这个过程非常短暂。<font color='red'>所以jvm调优的主要目的就是减少GC的次数，特别时Full GC</font>**

**为什么需要stop the world？不stop thw world 可以吗？**
答：在进行标记的时候，如果工作线程不停止的话，那么肯定会有新对象生成。这些对象是没有被标记的，里面可能有存活的对象，也可能有已经没有被引用的垃圾对象。那么在标记完后，进行回收时。要如何回收？
因为Serial 和 ParNew 是采用的复制算法。回收的时候，是需要把存活对象移到Survivor中的。而那些没有被标记的，有存活的，也有垃圾对象。显然不能全部移动到survivor 中的。
另外如果工作线程没有停止工作，那么工作线程和回收线程是一起执行的。工作线程可能会打乱对象之间的引用关系，这个对回收线程进行标记是有影响的。
所以，在进行新生代回收的时候，是需要stop the world 的。

### 堆大小的设置
堆的大小在jvm启动时就已经设定好了，可以通过`-Xms`和`-Xmx`来进行设置
- `-Xms`:表示堆区的初始内存，等价于-XX:InitialHeapSize。默认为物理内存的1/16, `-X`是jvm的运行参数，`ms`是memory sart 
- `-Xmx`:表示堆区的最大内存，等价于-XX:MaxHeapSize。默认为物理内存的1/4

- 一旦堆区中的内存大小超过`-Xmx`所指定的最大内存时，将会抛出OutOfMemoryError异常
通常会将`-Xms`和`-Xmx`两个参数配置相同的值，其目的是为了能够在java垃圾回收机制清理完堆区后不需要重新分隔计算堆区的大小，从而提高性能

- `-XX:-UseAdaptiveSizePolicy`是关闭自适应的内存分配策略，默认是开启的。如果开启的话，会使得分配给Survivor from区与Survivor to区的内存大小不相等

**为什么需要把java堆分代？不分代就不能正常工作了吗？**
答：其实不分代完全可以，分代的唯一理由就是**优化GC性能**。如果没有分代，那所有的对象都在一块，就如同把一个学校的人都关在一个教室。GC的时候要找到那些对象没用，这样就会对堆的所有区域进行扫描。而很多对象都是朝生夕死的，如果分代的话，把新创建的对象放到某一地方，当GC的时候先把这块存储朝生夕死对象的区域进行回收，这样就会腾出很大的空间出来

**查看堆大小的三种方法**
- 可以使用`java -XX:+PrintGCDetails 类名.class`来运行java程序，可以展示堆的分配以及GC的详细情况，如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132354.png)

- 通过代码获取堆信息
```java
public static void main(String[] args){
  long initialMemory = Runtime.getRuntime().totalMemory() / 1024 / 1024;
  long maxMemory = Runtime.getRuntime().maxMemory() / 1024 / 1024;
  System.out.println("-Xms:" + initialMemory + "M");
  System.out.println("-Xmx:" + maxMemory + "M");
}
```

- 使用`jstat -gc java进程id`命令
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132410.png)

**年轻代与老年代在堆结构的占比**
- 可以修改`-XX:NewRatio`的值来修改其占比
- 默认`-XX:NewRatio=2`, 表示新生代占1，老年代占2，新生代占整个堆的1/3
注：可以通过`jinfo -flag NewRatio 进程id`来查看NewRatio的值，如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132432.png)

### 年轻代与老年代
- 在HotSpot中，Eden空间和另外两个Survivor空间缺省默认所占比例是8:1:1
- 当然可以通过`-XX:SurvivorRatio`调整这个空间比例。比如`-XX:SurvivorRatio=6`
- 几乎所有的java对象都是在Eden区被new出来的， **大对象可能直接分配到老年代中**，所以我们尽量避免程序中出现过多的大对象
- 绝大部分java对象的销毁在新生代进行
- 可以使用`-Xmn`设置新生代最大内存大小，这个参数一般使用默认值就可以

![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132445.png)

### 对象分配过程：TLAB
**为什么有TLAB(Thread Local Allocation Buffer)?**
- 堆区是线程共享区域，任何线程都可以访问到堆区中的共享数据
- 由于对象实例的创建在JVM中非常频繁，因此在并发环境下从堆区中划分内存空间是线程不安全的
- 为避免多个线程操作同一地址，需要使用加锁等机制，进而影响分配速度

**什么是TLAB?**
- 从内存模型而不是垃圾收集的角度，对Eden区域继续进而划分，JVM为每个线程分配了一个私有缓存区域，它包含在Eden空间内
- 多线程同时分配内存时，使用TLAB可以避免一系列的非线程安全问题，同时还能够提示内存分配的吞吐量，因此我们可以将这种内存分配方式称之为快速分配策略
- 据我所知所有OpenJDK衍生出来的JVM都提供了TLAB的设计
- 尽管不是所有的对象实例都能够在TLAB中成功分配内存，但JVM确实是将TLAB作为内存分配的首选
- 可以通过`-XX:UseTLAB`设置是否开启TLAB空间，默认是开启的
- 默认情况下，TLAB空间的内存非常小，仅占有整个Eden空间的1%, 当然我们可以通过选项`-XX:TLABWasteTargetPercent`设置TLAB空间所占有Eden空间的百分比
- 一旦对象在TLAB空间分配内存失败时，JVM就会尝试着通过使用加锁机制确保数据操作的原子性，从而直接在Eden空间中分配内存

### 堆空间的常见参数设置
[官网说明](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html)
- -XX:+PrintFlagsInitial: 查看所有的参数的默认初始值
- -XX:+PrintFlagsFinal: 查看所有的参数的最终值(可能会存在修改，不再是初始值)
- -Xms: 初始堆空间内存(默认为物理内存的1/64)
- -Xmx: 最大堆空间内存(默认为物理内存的1/4)
- -Xmn: 设置新生代的大小 (初始值即最大值)
- -XX:NewRatio: 配置新生代与老年代在堆结构的占比
- -XX:SurvivorRatio: 设置新生代中Eden和S0/S1空间的比例
- -XX:MaxTenuringThreshold: 设置新生代垃圾的最大年龄
- -XX:+PrintGCDetails: 输出详细的GC处理日志
- -XX:HandlePromotionFailure: 是否设置空间分配担保

### 逃逸分析
首先堆不是分配对象存储的唯一选择
随着JIT编译期的发展与**逃逸分析技术**逐渐成熟，**栈上分配、标量替换优化技术**将会导致一些微妙的变化，所有的对象都分配到堆上也渐渐变得不那么“绝对”了
在java虚拟机中，对象是在java堆中分配内存的，但是，有一种特殊情况，那就是<font color='red'>如果经过逃逸分析(Escape Analysis)后发现，一个对象并没有逃逸出方法的话，那么就可能被优化成栈上分配。</font>这样就无需在堆上分配内存，由于是分配到虚拟栈上的，所以对象会随着方法执行的结束而移除，因此也无须进行垃圾回收了，这也是最常见的堆外存储技术。**并且将对象分配到虚拟栈上后，这个对象是线程安全的，即对于这个对象的操作可以不考虑同步**

**逃逸分析概叙**
- 使用逃逸分析手段来判断是否可以将一个新的对象分配到栈上
- 逃逸分析是一种可以有效减少java程序中同步负载和内存堆分配压力的跨函数全局数据流分析算法
- 逃逸分析的基本行为就是分析对象动态作用域：
  - 当一个对象在方法中被定义后，对象只在方法内部使用，即方法外部没有指向该对象的变量，则认为没有发送逃逸
  - 当一个对象在方法中被定义后，它被外部方法所引用，则认为发生逃逸。例如作为调用参数传递到其他地方中
- 在jdk6后，HotSpot中默认就开启了逃逸分析， 可以通过`-XX:-DoEscapeAnalysis`关闭逃逸分析
- 可以通过`-XX: +PrintEscapeAnalysis` 查看逃逸分析的筛选结果

```java
//为成员变量赋值，因此发生了逃逸
public void test1(){
  this.obj = new Person();
}

//p对象的作用域仅在当前方法中有效，因此没有发生逃逸
public void test2(){
  Person p = new Person();
}
```

**结论**
开发中能使用局部变量的，就不要在方法外部定义

### 通过逃逸分析实现代码优化
**逃逸分析之标量替换**
- `标量(Scalar)`是指一个无法再分解成更小的数据的数据。Java中的原始数据类型就是标量，标量是存储再虚拟栈中
- 相对的，那些还可以分解的数据叫做`聚合量(Aggregate)`, Java中的对象就是聚合量，因为他可以分解成其他聚合量和标量
- 在JIT阶段，如果经过逃逸分析，发现一个对象不会被外界访问的话，那么经过JIT优化，就会把这个对象拆解成若干个其中包含的若干个成员变量来代替。这个过程就是`标量替换`
- 标量替换默认是开启的，允许将对象打散分配到栈上。也可以通过`-XX:-EliminateAllocations`来关闭标量替换

```java
public static void main(String[] args){
  alloc();
} 
private static void alloc(){
  Point point = new Point();
  System.out.println("point.x="+point.x+"; point.y="+point.y);
}
class Point{
  private int x;
  private int y;
}
```
以上代码，经过逃逸分析，发现point对象没有逃逸，所以经过标量替换，就被替换成两个标量，如下代码所示，由于标量是存储在栈中，从而大大减少堆内存的占用。
```java
private static void alloc(){
  int x = 1;
  int y = 2;
  System.out.println("point.x="+x+"; point.y="+y);
}
```

**例子**
```java
public class Math{

  public static void main(String[] args){
    long start = System.currentTimeMillis();

    for(int i = 0; i < 100000000; i++){
      alloc();
    }
    //查看执行时间
    long end = System.currentTimeMillis();
    System.out.println("花费的时间："+(end - start) + "ms");
    try{
      Thread.sleep(100000);
    }catch(InterruptedException e){
      e.printStackTrace();
    }
  }

  public static void alloc(){
    User use = new User();
  }

  static class User{
  }
}
```
开启了逃逸分析时：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132502.png)

未开启逃逸分析时：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132512.png)

## 本地方法栈
本地方法就是一个Java调用非Java代码的接口
java虚拟机栈用于管理Java方法的调用，而本地方法栈用于管理本地方法的调用

## 方法区
**栈、堆、方法区的交互关系**
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132524.png)

方法区用于存储已被虚拟机加载的类型信息、域信息、方法信息，常量、静态变量、字面量数据、即时编译器编译后的代码缓存等
即方法区主要用于存放两大数据：字面量和符号引用量。 

字符串常量是放在`字符串常量池`中的
<font color="red">在jdk7后，把`字符串常量池`和静态变量放入堆上，而不是方法区中</font>

<font color='red'>注：静态变量与常量如果引用类型， 则方法区存储的是引用，而非实体。其引用的对象实体是存储在堆上。但是如果是字面量数据，则存储的是字面量数据 </font>, 例如`String s = "aa"`采用字面量方式创建字符串，则字面量"aa"存放在字符串常量池上，而不是堆上，但在jdk7后字符串常量池被移动到堆上。

**Hotspot中方法区的演进**
- 方法区是jvm规范官方规定的一个概念，不同jvm对方法区的逻辑实现可能是不一样的，以Hotspot为例，在jdk7以前，是以`永久代(PermGen)`实现方法区，在jdk8开始，使用元空间来实现方法区
- 其他jvm可能就不存在永久代的概念，例如BEA JRockit/ IBM J9虚拟机使用的是元空间
- 当年使用永久代不是一个很好的方法，因为导致java程序更容易OOM(超过-XX:MaxPermSize上限)
- 元空间的本质和永久代类似，都是对JVM规范中的方法区的实现，不过元空间与永久代最大的区别在于：<font color='red'>元空间不在虚拟机设置的内存中，而是使用本地内存</font>
- 永久代与元空间的内部结构不同

**设置方法区内存大小**
在jdk7以前：
- 通过`-XX:PermSize`来设置永久代初始化分配空间。默认值是20.75M
- 通过`-XX:MaxPermSize`来设置永久代最大可分配空间。32位机器默认是64M，64位机器默认是82M
- 当jvm加载的类信息容量超过了这个值，会报`OutOfMemoryError:PermGen space`

在jdk8及以后：
- 通过`-XX:MetaspaceSize`设置元空间初始化分配空间，在window下，默认值是21M
- 通过`-XX:MaxMetaspaceSize`设置元空间最大可分配空间，在window上，默认值是-1，及没有限制
- 与永久代不同，如果不指定大小，默认情况下，虚拟机会耗尽所有的可用系统内存。如果元数据区发生溢出，虚拟机会抛出`OutOfMemoryError:Metaspace`
- 一旦元空间内存使用量超过初始分配的内存大小，Full Gc将会被触发并卸载没用的类(即这些类对应的类加载器不在存活)，然后会自动重新设置元空间总内存大小，这个值取决于Full GC后释放了多少元空间。如果释放的空间不足，那么在不超过MaxMetaspaceSize时，适当提高该值。如果释放空间过多，则适当降低该值
- 如果MaxMetaspaceSize设置过低，则MaxMetaspaceSize的值会自动调整的情况会发生很多次。通过垃圾回收器的日志可以观察到Full GC多次调用。为了避免频繁地GC，建议将`-XX:MetaspaceSize`设置为一个相对较高的值

### 运行时常量池与常量池
运行时常量池是方法区的一部分，Class文件中除了有类的版本、字段、方法、接口等描述信息外，还有一项信息是常量池（Class文件常量池），用于存放编译器生成的各种字面量和符号引用，这部分内容将在类加载后存放到方法区的运行时常量池中。运行时常量池相对于Class文件常量池的另一个重要特征是具备动态性，Java语言并不要求常量一定只能在编译期产生，也就是并非预置入Class文件中的常量池的内容才能进入方法区的运行时常量池，运行期间也可能将新的常量放入池中，这种特性被开发人员利用比较多的是String类的intern（）方法。
 <font color="red">`str.intern()`用来判断字符串常量池中是否存在str字符串，如果存在，则返回字符串常量池中str字符串的地址，反之，则在字符串常量池中加载一份str字符串，并返回该地址</font>

当创建类或接口的运行时常量池时，如果构造运行时常量池所需的内存空间超过了方法区所提供的最大值，则jvm会抛OutOfMemoryError异常

## 对象实例化分析
对内存分配情况分析最常见的示例便是对象实例化:
```
Object obj = new Object();
```
这段代码的执行会涉及java栈、Java堆、方法区三个最重要的内存区域。假设该语句出现在方法体中，及时对JVM虚拟机不了解的Java使用这，应该也知道obj会作为引用类型（reference）的数据保存在Java栈的本地变量表中，而会在Java堆中保存该引用的实例化对象，但可能并不知道，Java堆中还必须包含能查找到此对象类型数据的地址信息（如对象类型、父类、实现的接口、方法等），这些类型数据则保存在方法区中。

另外，由于reference类型在Java虚拟机规范里面只规定了一个指向对象的引用，并没有定义这个引用应该通过哪种方式去定位，以及访问到Java堆中的对象的具体位置，因此不同虚拟机实现的对象访问方式会有所不同，主流的访问方式有两种：使用句柄池和直接使用指针。
通过句柄池访问的方式如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132535.png)
通过直接指针访问的方式如下：
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132546.png)
这两种对象的访问方式各有优势，使用句柄访问方式的最大好处就是reference中存放的是稳定的句柄地址，在对象呗移动（垃圾收集时移动对象是非常普遍的行为）时只会改变句柄中的实例数据指针，而reference本身不需要修改。使用直接指针访问方式的最大好处是速度快，它节省了一次指针定位的时间开销。目前Java默认使用的Hot Spot虚拟机采用的便是是第二种方式进行对象访问的。

# 强引用、软引用、弱引用、虚引用
Java中有四种引用类型：强引用、软引用、弱引用、虚引用。

## Java为什么要设计这四种引用
Java的内存分配和内存回收，都不需要程序员负责，都是由伟大的JVM去负责，一个对象是否可以被回收，主要看是否有引用指向此对象，说的专业点，叫可达性分析。

Java设计这四种引用的主要目的有两个：
1. 可以让程序员通过代码的方式来决定某个对象的生命周期；
2. 有利于垃圾回收。

## 强引用
强引用是最普遍的一种引用，我们写的代码，99.9999%都是强引用：
```java
Object o = new Object();
```
这种就是强引用了，是不是在代码中随处可见，最亲切。
只要某个对象有强引用与之关联，这个对象永远不会被回收，即使内存不足，JVM宁愿抛出OOM，也不会去回收。

那么什么时候才可以被回收呢？当强引用和对象之间的关联被中断了，就可以被回收了。

我们可以手动把关联给中断了，方法也特别简单：
```java
o = null;
```
我们可以手动调用GC，看看如果强引用和对象之间的关联被中断了，资源会不会被回收，为了更方便、更清楚的观察到回收的情况，我们需要新写一个类，然后重写finalize方法，下面我们来进行这个实验：
```java
public class Main {
  public static void main(String[] args) {
     Stu st = new Stu();
     st = null;
     System.gc();
     System.out.println("end....");
  }
}

class Stu {
  @Override
  protected void finalize() throws Throwable {
    System.out.println("Stu被回收了");
  }
}
```
运行结果：
```
end...
Student 被回收了
```
可以很清楚的看到资源被回收了。

当然，在实际开发中，千万不要重写finalize方法

在实际的开发中，看到有一些对象被手动赋值为NULL，很大可能就是为了“特意提醒”JVM这块资源可以进行垃圾回收了。

## 软引用
下面先来看看如何创建一个软引用：
```java
SoftReference<Student>studentSoftReference=new SoftReference<Student>(new Student());
```
软引用就是把对象用SoftReference包裹一下，当我们需要从软引用对象获得包裹的对象，只要get一下就可以了：

```java
SoftReference<Student>studentSoftReference=new SoftReference<Student>(new Student());
Student student = studentSoftReference.get();
System.out.println(student);

```

### 软引用有什么特点呢
当内存不足，会触发JVM的GC，如果GC后，内存还是不足，就会把软引用的包裹的对象给干掉，也就是只有在内存不足，JVM才会回收该对象。

还是一样的，必须做实验，才能加深印象：
```java
import java.lang.ref.SoftReference;

public class Main {
  public static void main(String[] args) {
    SoftReference<byte[]> softReference = new SoftReference<byte[]>(new byte[10 * 1024 * 1024]);
    System.out.println(softReference.get());
    System.gc();
    System.out.println(softReference.get());

    byte[] bytes = new byte[10 * 1024 * 1024];
    System.out.println(softReference.get());
  }
}
```
我定义了一个软引用对象，里面包裹了byte[]，byte[]占用了10M，然后又创建了10Mbyte[]。

运行程序，需要带上一个参数：`-Xmx15M`, 即如下：
```shell
javac Main.java && java -Xmx15M Main
```
代表最大堆内存是15M。

运行结果：
```
[B@11d7fff
[B@11d7fff
null
```
可以很清楚的看到手动完成GC后，软引用对象包裹的byte[]还活的好好的，但是当我们创建了一个10M的byte[]后，最大堆内存不够了，所以把软引用对象包裹的byte[]给干掉了，如果不干掉，就会抛出OOM。

软引用到底有什么用呢？比较适合用作缓存，当内存足够，可以正常的拿到缓存，当内存不够，就会先干掉缓存，不至于马上抛出OOM。

## 弱引用
弱引用的使用和软引用类似，只是关键字变成了WeakReference：
```java
WeakReference<byte[]> weakReference = new WeakReference<byte[]>(new byte[1024*1024*10]);
System.out.println(weakReference.get());
```
弱引用的特点是不管内存是否足够，只要发生GC，都会被回收：
```java
import java.lang.ref.*;

public class Main {
  public static void main(String[] args) {
    WeakReference<byte[]> weakReference = new WeakReference<byte[]>(new byte[10 * 1024 * 1024]);
    System.out.println(weakReference.get());
    System.gc();
    System.out.println(weakReference.get());
  }
}
```

运行结果：
```
[B@11d7fff
null
```
可以很清楚的看到明明内存还很充足，但是触发了GC，资源还是被回收了。

弱引用在很多地方都有用到，比如ThreadLocal、WeakHashMap。


# jdk自带调优工具java visualvm
注：这个工具只有在JDK6、JDK7、JDK8版本中才自带，Java VisualVM不再与其他版本JDK捆绑在一起，但您可以从[VisualVM开源项目](https://visualvm.github.io/)站点获取它。

通过命令`jvisualvm`可以调用出调优工具
```java
public class Math{

  byte[] a = new byte[1024 * 100];

  public static void main(String[] args) throws Exception{
    ArrayList<Math> heapTest = new ArrayList();
    while(true){
      heapTest.add(new Math());
      Thread.sleep(10);
    }
  }
}
```
## 虚引用
虚引用又被称为幻影引用，我们来看看它的使用：
```java
ReferenceQueue queue = new ReferenceQueue();
PhantomReference<byte[]> reference = new PhantomReference<byte[]>(new byte[1], queue);
System.out.println(reference.get());
```
虚引用的使用和上面说的软引用、弱引用的区别还是挺大的，我们先不管ReferenceQueue 是个什么鬼，直接来运行：
```
null
```
竟然打印出了null，我们来看看get方法的源码：

```java
public T get() {
    return null;
}

```
这是几个意思，竟然直接返回了null。

这就是虚引用特点之一了：无法通过虚引用来获取对一个对象的真实引用。

那虚引用存在的意义是什么呢？这就要回到我们上面的代码了，我们把代码复制下，以免大家再次往上翻：
```java
ReferenceQueue queue = new ReferenceQueue();
PhantomReference<byte[]> reference = new PhantomReference<byte[]>(new byte[1], queue);
System.out.println(reference.get());
```
创建虚引用对象，我们除了把包裹的对象传了进去，还传了一个ReferenceQueue，从名字就可以看出它是一个队列。

虚引用的特点之二就是 虚引用必须与ReferenceQueue一起使用，当GC准备回收一个对象，如果发现它还有虚引用，就会在回收之前，把这个虚引用加入到与之关联的ReferenceQueue中。

我们来用代码实践下吧：
```java
        ReferenceQueue queue = new ReferenceQueue();
        List<byte[]> bytes = new ArrayList<>();
        PhantomReference<Student> reference = new PhantomReference<Student>(new Student(),queue);
        new Thread(() -> {
            for (int i = 0; i < 100;i++ ) {
                bytes.add(new byte[1024 * 1024]);
            }
        }).start();

        new Thread(() -> {
            while (true) {
                Reference poll = queue.poll();
                if (poll != null) {
                    System.out.println("虚引用被回收了：" + poll);
                }
            }
        }).start();
        Scanner scanner = new Scanner(System.in);
        scanner.hasNext();
    }
```
运行结果：
```
Student 被回收了
虚引用被回收了：java.lang.ref.PhantomReference@1ade6f1
```
我们简单的分析下代码：
1. 第一个线程往集合里面塞数据，随着数据越来越多，肯定会发生GC。
2. 第二个线程死循环，从queue里面拿数据，如果拿出来的数据不是null，就打印出来。

从运行结果可以看到：当发生GC，虚引用就会被回收，并且会把回收的通知放到ReferenceQueue中。

虚引用有什么用呢？在NIO中，就运用了虚引用管理堆外内存。

# jdk自带调优工具java visualvm
注：这个工具只有在JDK6、JDK7、JDK8版本中才自带，Java VisualVM不再与其他版本JDK捆绑在一起，但您可以从[VisualVM开源项目](https://visualvm.github.io/)站点获取它。

通过命令`jvisualvm`可以调用出调优工具
```java
public class Math{

  byte[] a = new byte[1024 * 100];

  public static void main(String[] args) throws Exception{
    ArrayList<Math> heapTest = new ArrayList();
    while(true){
      heapTest.add(new Math());
      Thread.sleep(10);
    }
  }
}
```
java visualvm界面
![](https://raw.githubusercontent.com/NaisWang/images/master/20220329132601.png)

# 调优工具Arthas
强烈建议使用Arthas
[Arthas官网](https://arthas.gitee.io/quick-start.html)

# JVM指令助记符
## 操作数栈
变量到操作数栈：iload,iload_,lload,lload_,fload,fload_,dload,dload_,aload,aload_
操作数栈到变量：istore,istore_,lstore,lstore_,fstore,fstore_,dstore,dstor_,astore,astore_
常数到操作数栈：bipush,sipush,ldc,ldc_w,ldc2_w,aconst_null,iconst_ml,iconst_,lconst_,fconst_,dconst_
把数据装载到操作数栈：baload,caload,saload,iaload,laload,faload,daload,aaload
从操作数栈存存储到数组：bastore,castore,sastore,iastore,lastore,fastore,dastore,aastore
操作数栈管理：pop,pop2,dup,dup2,dup_xl,dup2_xl,dup_x2,dup2_x2,swap
## 运算与转换
加：iadd,ladd,fadd,dadd
减：is ,ls ,fs ,ds 
乘：imul,lmul,fmul,dmul
除：idiv,ldiv,fdiv,ddiv
余数：irem,lrem,frem,drem
取负：ineg,lneg,fneg,dneg
移位：ishl,lshr,iushr,lshl,lshr,lushr
按位或：ior,lor
按位与：iand,land
按位异或：ixor,lxor
类型转换：i2l,i2f,i2d,l2f,l2d,f2d(放宽数值转换),i2b,i2c,i2s,l2i,f2i,f2l,d2i,d2l,d2f(缩窄数值转换)
## 条件转移
有条件转移：ifeq,iflt,ifle,ifne,ifgt,ifge,ifnull,ifnonnull,if_icmpeq,if_icmpene,if_icmplt,if_icmpgt,if_icmple,if_icmpge,if_acmpeq,if_acmpne,lcmp,fcmpl,fcmpg,dcmpl,dcmpg
复合条件转移：tableswitch,lookupswitch
无条件转移：goto,goto_w,jsr,jsr_w,ret
## 类与数组
创建类实便：new
创建新数组：newarray,anewarray,multianwarray
访问类的域和类实例域：getfield,putfield,getstatic,putstatic
获取数组长度：arraylength
检相类实例或数组属性：instanceof,checkcast
## 调度与返回加finally
调度对象的实例方法：invokevirtual
调用由接口实现的方法：invokeinterface
调用需要特殊处理的实例方法：invokespecial
调用命名类中的静态方法：invokestatic
方法返回：ireturn,lreturn,freturn,dreturn,areturn,return
异常：athrow
finally关键字的实现使用：jsr,jsr_w,ret

# JVM指令集
指令码 助记符    说明  
0x00 nop      什么都不做  
0x01 aconst_null 将null推送至操作数栈顶  
0x02 iconst_m1   将int型-1推送至操作数栈顶  
0x03 iconst_0   将int型0推送至操作数栈顶  
0x04 iconst_1   将int型1推送至操作数栈顶  
0x05 iconst_2   将int型2推送至操作数栈顶  
0x06 iconst_3   将int型3推送至操作数栈顶  
0x07 iconst_4   将int型4推送至操作数栈顶  
0x08 iconst_5   将int型5推送至操作数栈顶  
0x09 lconst_0   将long型0推送至操作数栈顶  
0x0a lconst_1   将long型1推送至操作数栈顶  
0x0b fconst_0   将float型0推送至操作数栈顶  
0x0c fconst_1   将float型1推送至操作数栈顶  
0x0d fconst_2   将float型2推送至操作数栈顶  
0x0e dconst_0   将double型0推送至操作数栈顶  
0x0f dconst_1   将double型1推送至操作数栈顶  
0x10 bipush    将单字节的常量值(-128~127)推送至操作数栈顶  
0x11 sipush    将一个短整型常量值(-32768~32767)推送至操作数栈顶  
0x12 ldc      将int, float或String型常量值从常量池中推送至操作数栈顶  
0x13 ldc_w     将int, float或String型常量值从常量池中推送至操作数栈顶（宽索引）  
0x14 ldc2_w    将long或double型常量值从常量池中推送至操作数栈顶（宽索引）  
0x15 iload     将指定的int型局部变量推送至操作数栈顶  
0x16 lload     将指定的long型局部变量推送至操作数栈顶  
0x17 fload     将指定的float型局部变量推送至操作数栈顶  
0x18 dload     将指定的double型局部变量推送至操作数栈顶  
0x19 aload     将指定的引用类型局部变量推送至操作数栈顶  
0x1a iload_0    将第一个int型局部变量推送至操作数栈顶  
0x1b iload_1    将第二个int型局部变量推送至操作数栈顶  
0x1c iload_2    将第三个int型局部变量推送至操作数栈顶  
0x1d iload_3    将第四个int型局部变量推送至操作数栈顶  
0x1e lload_0    将第一个long型局部变量推送至操作数栈顶  
0x1f lload_1    将第二个long型局部变量推送至操作数栈顶  
0x20 lload_2    将第三个long型局部变量推送至操作数栈顶  
0x21 lload_3    将第四个long型局部变量推送至操作数栈顶  
0x22 fload_0    将第一个float型局部变量推送至操作数栈顶  
0x23 fload_1    将第二个float型局部变量推送至操作数栈顶  
0x24 fload_2    将第三个float型局部变量推送至操作数栈顶  
0x25 fload_3    将第四个float型局部变量推送至操作数栈顶  
0x26 dload_0    将第一个double型局部变量推送至操作数栈顶  
0x27 dload_1    将第二个double型局部变量推送至操作数栈顶  
0x28 dload_2    将第三个double型局部变量推送至操作数栈顶  
0x29 dload_3    将第四个double型局部变量推送至操作数栈顶  
0x2a aload_0    将第一个引用类型局部变量推送至操作数栈顶  
0x2b aload_1    将第二个引用类型局部变量推送至操作数栈顶  
0x2c aload_2    将第三个引用类型局部变量推送至操作数栈顶  
0x2d aload_3    将第四个引用类型局部变量推送至操作数栈顶  
0x2e iaload    将int型数组指定索引的值推送至操作数栈顶  
0x2f laload    将long型数组指定索引的值推送至操作数栈顶  
0x30 faload    将float型数组指定索引的值推送至操作数栈顶  
0x31 daload    将double型数组指定索引的值推送至操作数栈顶  
0x32 aaload    将引用型数组指定索引的值推送至操作数栈顶  
0x33 baload    将boolean或byte型数组指定索引的值推送至操作数栈顶  
0x34 caload    将char型数组指定索引的值推送至操作数栈顶  
0x35 saload    将short型数组指定索引的值推送至操作数栈顶  
0x36 istore    将操作数栈顶int型数值存入指定局部变量  
0x37 lstore    将操作数栈顶long型数值存入指定局部变量  
0x38 fstore    将操作数栈顶float型数值存入指定局部变量  
0x39 dstore    将操作数栈顶double型数值存入指定局部变量  
0x3a astore    将操作数栈顶引用型数值存入指定局部变量  
0x3b istore_0   将操作数栈顶int型数值存入第一个局部变量  
0x3c istore_1   将操作数栈顶int型数值存入第二个局部变量  
0x3d istore_2   将操作数栈顶int型数值存入第三个局部变量  
0x3e istore_3   将操作数栈顶int型数值存入第四个局部变量  
0x3f lstore_0   将操作数栈顶long型数值存入第一个局部变量  
0x40 lstore_1   将操作数栈顶long型数值存入第二个局部变量  
0x41 lstore_2   将操作数栈顶long型数值存入第三个局部变量  
0x42 lstore_3   将操作数栈顶long型数值存入第四个局部变量  
0x43 fstore_0   将操作数栈顶float型数值存入第一个局部变量  
0x44 fstore_1   将操作数栈顶float型数值存入第二个局部变量  
0x45 fstore_2   将操作数栈顶float型数值存入第三个局部变量  
0x46 fstore_3   将操作数栈顶float型数值存入第四个局部变量  
0x47 dstore_0   将操作数栈顶double型数值存入第一个局部变量  
0x48 dstore_1   将操作数栈顶double型数值存入第二个局部变量  
0x49 dstore_2   将操作数栈顶double型数值存入第三个局部变量  
0x4a dstore_3   将操作数栈顶double型数值存入第四个局部变量  
0x4b astore_0   将操作数栈顶引用型数值存入第一个局部变量  
0x4c astore_1   将操作数栈顶引用型数值存入第二个局部变量  
0x4d astore_2   将操作数栈顶引用型数值存入第三个局部变量  
0x4e astore_3   将操作数栈顶引用型数值存入第四个局部变量  
0x4f iastore    将操作数栈顶int型数值存入指定数组的指定索引位置  
0x50 lastore    将操作数栈顶long型数值存入指定数组的指定索引位置  
0x51 fastore    将操作数栈顶float型数值存入指定数组的指定索引位置  
0x52 dastore    将操作数栈顶double型数值存入指定数组的指定索引位置  
0x53 aastore    将操作数栈顶引用型数值存入指定数组的指定索引位置  
0x54 bastore    将操作数栈顶boolean或byte型数值存入指定数组的指定索引位置  
0x55 castore    将操作数栈顶char型数值存入指定数组的指定索引位置  
0x56 sastore    将操作数栈顶short型数值存入指定数组的指定索引位置  
0x57 pop      将操作数栈顶数值弹出 (数值不能是long或double类型的)  
0x58 pop2     将操作数栈顶的一个（long或double类型的)或两个数值弹出（其它）  
0x59 dup      复制操作数栈顶数值并将复制值压入操作数栈顶  
0x5a dup_x1    复制操作数栈顶数值并将两个复制值压入操作数栈顶  
0x5b dup_x2    复制操作数栈顶数值并将三个（或两个）复制值压入操作数栈顶  
0x5c dup2     复制操作数栈顶一个（long或double类型的)或两个（其它）数值并将复制值压入操作数栈顶  
0x5d dup2_x1    <待补充>  
0x5e dup2_x2    <待补充>  
0x5f swap     将栈最顶端的两个数值互换(数值不能是long或double类型的)  
0x60 iadd     将操作数栈顶两int型数值相加并将结果压入操作数栈顶  
0x61 ladd     将操作数栈顶两long型数值相加并将结果压入操作数栈顶  
0x62 fadd     将操作数栈顶两float型数值相加并将结果压入操作数栈顶  
0x63 dadd     将操作数栈顶两double型数值相加并将结果压入操作数栈顶  
0x64 isub     将操作数栈顶两int型数值相减并将结果压入操作数栈顶  
0x65 lsub     将操作数栈顶两long型数值相减并将结果压入操作数栈顶  
0x66 fsub     将操作数栈顶两float型数值相减并将结果压入操作数栈顶  
0x67 dsub     将操作数栈顶两double型数值相减并将结果压入操作数栈顶  
0x68 imul     将操作数栈顶两int型数值相乘并将结果压入操作数栈顶  
0x69 lmul     将操作数栈顶两long型数值相乘并将结果压入操作数栈顶  
0x6a fmul     将操作数栈顶两float型数值相乘并将结果压入操作数栈顶  
0x6b dmul     将操作数栈顶两double型数值相乘并将结果压入操作数栈顶  
0x6c idiv     将操作数栈顶两int型数值相除并将结果压入操作数栈顶  
0x6d ldiv     将操作数栈顶两long型数值相除并将结果压入操作数栈顶  
0x6e fdiv     将操作数栈顶两float型数值相除并将结果压入操作数栈顶  
0x6f ddiv     将操作数栈顶两double型数值相除并将结果压入操作数栈顶  
0x70 irem     将操作数栈顶两int型数值作取模运算并将结果压入操作数栈顶  
0x71 lrem     将操作数栈顶两long型数值作取模运算并将结果压入操作数栈顶  
0x72 frem     将操作数栈顶两float型数值作取模运算并将结果压入操作数栈顶  
0x73 drem     将操作数栈顶两double型数值作取模运算并将结果压入操作数栈顶  
0x74 ineg     将操作数栈顶int型数值取负并将结果压入操作数栈顶  
0x75 lneg     将操作数栈顶long型数值取负并将结果压入操作数栈顶  
0x76 fneg     将操作数栈顶float型数值取负并将结果压入操作数栈顶  
0x77 dneg     将操作数栈顶double型数值取负并将结果压入操作数栈顶  
0x78 ishl     将int型数值左移位指定位数并将结果压入操作数栈顶  
0x79 lshl     将long型数值左移位指定位数并将结果压入操作数栈顶  
0x7a ishr     将int型数值右（符号）移位指定位数并将结果压入操作数栈顶  
0x7b lshr     将long型数值右（符号）移位指定位数并将结果压入操作数栈顶  
0x7c iushr     将int型数值右（无符号）移位指定位数并将结果压入操作数栈顶  
0x7d lushr     将long型数值右（无符号）移位指定位数并将结果压入操作数栈顶  
0x7e iand     将操作数栈顶两int型数值作“按位与”并将结果压入操作数栈顶  
0x7f land     将操作数栈顶两long型数值作“按位与”并将结果压入操作数栈顶  
0x80 ior      将操作数栈顶两int型数值作“按位或”并将结果压入操作数栈顶  
0x81 lor      将操作数栈顶两long型数值作“按位或”并将结果压入操作数栈顶  
0x82 ixor     将操作数栈顶两int型数值作“按位异或”并将结果压入操作数栈顶  
0x83 lxor     将操作数栈顶两long型数值作“按位异或”并将结果压入操作数栈顶  
0x84 iinc     将指定int型变量增加指定值（i++, i--, i+=2）  
0x85 i2l      将操作数栈顶int型数值强制转换成long型数值并将结果压入操作数栈顶  
0x86 i2f      将操作数栈顶int型数值强制转换成float型数值并将结果压入操作数栈顶  
0x87 i2d      将操作数栈顶int型数值强制转换成double型数值并将结果压入操作数栈顶  
0x88 l2i      将操作数栈顶long型数值强制转换成int型数值并将结果压入操作数栈顶  
0x89 l2f      将操作数栈顶long型数值强制转换成float型数值并将结果压入操作数栈顶  
0x8a l2d      将操作数栈顶long型数值强制转换成double型数值并将结果压入操作数栈顶  
0x8b f2i      将操作数栈顶float型数值强制转换成int型数值并将结果压入操作数栈顶  
0x8c f2l      将操作数栈顶float型数值强制转换成long型数值并将结果压入操作数栈顶  
0x8d f2d      将操作数栈顶float型数值强制转换成double型数值并将结果压入操作数栈顶  
0x8e d2i      将操作数栈顶double型数值强制转换成int型数值并将结果压入操作数栈顶  
0x8f d2l      将操作数栈顶double型数值强制转换成long型数值并将结果压入操作数栈顶  
0x90 d2f      将操作数栈顶double型数值强制转换成float型数值并将结果压入操作数栈顶  
0x91 i2b      将操作数栈顶int型数值强制转换成byte型数值并将结果压入操作数栈顶  
0x92 i2c      将操作数栈顶int型数值强制转换成char型数值并将结果压入操作数栈顶  
0x93 i2s      将操作数栈顶int型数值强制转换成short型数值并将结果压入操作数栈顶  
0x94 lcmp     比较操作数栈顶两long型数值大小，并将结果（1，0，-1）压入操作数栈顶  
0x95 fcmpl     比较操作数栈顶两float型数值大小，并将结果（1，0，-1）压入操作数栈顶；当其中一个数值为NaN时，将-1压入操作数栈顶  
0x96 fcmpg     比较操作数栈顶两float型数值大小，并将结果（1，0，-1）压入操作数栈顶；当其中一个数值为NaN时，将1压入操作数栈顶  
0x97 dcmpl     比较操作数栈顶两double型数值大小，并将结果（1，0，-1）压入操作数栈顶；当其中一个数值为NaN时，将-1压入操作数栈顶  
0x98 dcmpg     比较操作数栈顶两double型数值大小，并将结果（1，0，-1）压入操作数栈顶；当其中一个数值为NaN时，将1压入操作数栈顶  
0x99 ifeq     当操作数栈顶int型数值等于0时跳转  
0x9a ifne     当操作数栈顶int型数值不等于0时跳转  
0x9b iflt     当操作数栈顶int型数值小于0时跳转  
0x9c ifge     当操作数栈顶int型数值大于等于0时跳转  
0x9d ifgt     当操作数栈顶int型数值大于0时跳转  
0x9e ifle     当操作数栈顶int型数值小于等于0时跳转  
0x9f if_icmpeq   比较操作数栈顶两int型数值大小，当结果等于0时跳转  
0xa0 if_icmpne   比较操作数栈顶两int型数值大小，当结果不等于0时跳转  
0xa1 if_icmplt   比较操作数栈顶两int型数值大小，当结果小于0时跳转  
0xa2 if_icmpge   比较操作数栈顶两int型数值大小，当结果大于等于0时跳转  
0xa3 if_icmpgt   比较操作数栈顶两int型数值大小，当结果大于0时跳转  
0xa4 if_icmple   比较操作数栈顶两int型数值大小，当结果小于等于0时跳转  
0xa5 if_acmpeq   比较操作数栈顶两引用型数值，当结果相等时跳转  
0xa6 if_acmpne   比较操作数栈顶两引用型数值，当结果不相等时跳转  
0xa7 goto     无条件跳转  
0xa8 jsr      跳转至指定16位offset位置，并将jsr下一条指令地址压入操作数栈顶  
0xa9 ret      返回至局部变量指定的index的指令位置（一般与jsr, jsr_w联合使用）  
0xaa tableswitch    用于switch条件跳转，case值连续（可变长度指令）  
0xab lookupswitch   用于switch条件跳转，case值不连续（可变长度指令）  
0xac ireturn    从当前方法返回int 
0xad lreturn    从当前方法返回long 
0xae freturn    从当前方法返回float 
0xaf dreturn    从当前方法返回double 
0xb0 areturn    从当前方法返回对象引用  
0xb1 return    从当前方法返回void 
0xb2 getstatic   获取指定类的静态域，并将其值压入操作数栈顶  
0xb3 putstatic   为指定的类的静态域赋值  
0xb4 getfield   获取指定类的实例域，并将其值压入操作数栈顶  
0xb5 putfield   为指定的类的实例域赋值  
0xb6 invokevirtual   调用实例方法  
0xb7 invokespecial   调用超类构造方法，实例初始化方法，私有方法  
0xb8 invokestatic   调用静态方法  
0xb9 invokeinterface 调用接口方法  
0xba --  
0xbb new      创建一个对象，并将其引用值压入操作数栈顶  
0xbc newarray   创建一个指定原始类型（如int, float, char…）的数组，并将其引用值压入操作数栈顶  
0xbd anewarray   创建一个引用型（如类，接口，数组）的数组，并将其引用值压入操作数栈顶  
0xbe arraylength 获得数组的长度值并压入操作数栈顶  
0xbf athrow    将操作数栈顶的异常抛出  
0xc0 checkcast   检验类型转换，检验未通过将抛出ClassCastException  
0xc1 instanceof 检验对象是否是指定的类的实例，如果是将1压入操作数栈顶，否则将0压入操作数栈顶  
0xc2 monitorenter   获得对象的锁，用于同步方法或同步块  
0xc3 monitorexit    释放对象的锁，用于同步方法或同步块  
0xc4 wide     <待补充>  
0xc5 multianewarray 创建指定类型和指定维度的多维数组（执行该指令时，操作栈中必须包含各维度的长度值），并将其引用值压入操作数栈顶  
0xc6 ifnull    为null时跳转  
0xc7 ifnonnull   不为null时跳转  
0xc8 goto_w    无条件跳转（宽索引）  
0xc9 jsr_w     跳转至指定32位offset位置，并将jsr_w下一条指令地址压入操作数栈顶 
