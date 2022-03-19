# 简介
开发中经常会设计到excel的处理，如导出Excel，导入Excel到数据库中！
操作Excel目前比较流行的就是Apache POI和阿里巴巴的easyExcel！

# Apache POI
Apache POI是Apache软件基金会的开放源码函式库，POl提供API给Java程序对Microsoft Office格式档案读和写的功能。

## 基本功能
- HSSF: 提供读写Microsoft Excel格式(后缀名为xls)档案的功能，
- XSSF: 提供读写Microsoft Excel OOXM格式(后缀名为xlsx)档案的功能。
- HWPF: 提供读写Microsoft Word各式档案的功能。
- HSLF: 提供读写Microsoft PowerPoint格式档案的功能。
- HDGF: 提供读写Microsoft visio格式档案的功能。

**xls和xlsx有什么区别**
- 文件格式不同。xls 是一个特有的二进制格式，其核心结构是复合文档类型的结构，而 xlsx 的核心结构是 XML 类型的结构，采用的是基于 XML 的压缩方式，使其占用的空间更小。xlsx 中最后一个 x 的意义就在于此。
- 版本不同。xls是excel2003及以前版本生成的文件格式，而xlsx是excel2007及以后版本生成的文件格式。
- 兼容性不同。xlsx格式是向下兼容的，可兼容xls格式。

## 基本读写操作实战
**引入依赖**
```xml
<!-- xls  -->
<dependency>
  <groupId>org.apache.poi</groupId>
  <artifactId>poi</artifactId>
  <version>3.9</version>
</dependency>

<!-- xlsx  -->
<dependency>
  <groupId>org.apache.poi</groupId>
  <artifactId>poi-ooxml</artifactId>
  <version>3.9</version>
</dependency>
```

**写核心代码：**
```java
public static void testWrite() throws Exception{
  //创建xls类型的工作簿
  Workbook workbook = new HSSFWorkbook(); 
  // //创建xlsx类型的工作簿
  // Workbook workbook = new XSSFWorkbook();
  // //创建xlsx类型的工作簿
  // Workbook workbook = new SXSSFWorkbook();

  //创建一个工作表
  Sheet sheet = workbook.createSheet("whz");
  //创建第一行
  Row row1 = sheet.createRow(0);
  //在第一行上创建第一个单元格
  Cell cell1 = row1.createCell(0);
  cell1.setCellValue("今日新增观众");
  //在第一行上创建第二个单元格
  Cell cell2 = row1.createCell(1);
  cell2.setCellValue("888");

  //创建第二行
  Row row2 = sheet.createRow(1);
  Cell cell3 = row2.createCell(0);
  cell3.setCellValue("统计时间");
  Cell cell4 = row2.createCell(1);
  cell4.setCellValue("2010-2-1");

  //生成excel文件
  FileOutputStream fileOutputStream = new FileOutputStream("L://测试表.xls");
  workbook.write(fileOutputStream);
  fileOutputStream.close();
}
```

**效果**
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210506162330.png" width="700px"/>


**读核心代码：**
```java
public void testRead() throws Exception{
  //获取文件流
  FileInputStream inputStream = new FileInputStream("L://测试表.xls");
  //得到工作簿
  Workbook workbook = new HSSFWorkbook(inputStream);
  //得到工作表
  Sheet sheet = workbook.getSheetAt(0);
  //得到行
  Row row = sheet.getRow(0);
  //得到单元格
  Cell cell = row.getCell(1);
  //读取单元格的值，一定要注意类型
  System.out.println(cell.getStringCellValue());

  inputStream.close();
}
```

## 大数据量的写入
### 大文件写HSSF
缺点：最多只能处理65536行，否则会抛出异常
```
java.lang.IllegalArgumentException:Invalid row number（65536）outside allowable range（0..65535）
```
优点：过程中写入缓存，不操作磁盘，最后一次性写入磁盘，速度快

### 大文件写XSSF
缺点：写数据时速度非常慢，非常耗内存，也会发生内存溢出，如100万条
优点：可以写较大的数据量，如20万条

### 大文件写SXSSF
优点：可以写非常大的数据量，如100万条甚至更多条，写数据速度快，占用更少的内存

**注意：**
过程中会产生临时文件，如下，
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210506164113.png" width="300px"/>

我们可以在在关闭输出流之后，使用下面代码来清除临时文件
```java
((SXSWorkbook) workbook).dispose();
```

默认由100条记录被保存在内存中，如果超过这数量，则最前面的数据被写入临时文件如果想自定义内存中数据的数量，可以使用`new SXSSFWorkbook(数量)`

SXSSFWorkbook-来至官方的解释：实现“BigGridDemo”策略的流式XSSFWorkbook版本。这允许写入非常大的文件而不会耗尽内存，因为任何时候只有可配置的行部分被保存在内存中。
请注意，仍然可能会消耗大量内存，这些内存基于您正在使用的功能，例如合并区域，注释……仍然只存储在内存中，因此如果广泛使用，可能需要大量内存。


# EasyExcel 
EasyExcel是阿里巴巴开源的一个excel处理框架，以使用简单、节省内存著称。
EasyExcel能大大减少占用内存的主要原因是在解析Excel时没有将文件数据一次性全部加载到内存中，而是从磁盘上一行行读取数据，逐个解析。
下图是EasyExcel和POI在解析Excel时的对比图。
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210506155224.png" width="700px"/>

官方文档：https://www.yuque.com/easyexcel/doc/easyexcel

EasyExcle将excel文件看成如下接口：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210506162815.png" width="700px"/>

# EasyPOI
为了解决上述poi的缺点，国内有很多开源项目对poi进行了封装，大大减少代码量，使其能够更简单的被我们使用并提高开发效率，例如EasyPoi,Excel4]等优秀的开源项目。我们这次以EasyPoi为例
easypoi功能如同名字easy，主打的功能就是容易，让一个没见接触过poi的人员就可以方便的写出Excel导出，Excel模板导出，Excel导入，Word模板导出，通过简单的注解和模板语言（熟悉的表达式语法）.完成以前复杂的写法。

独特的功能:
- 基于注解的导入导出,修改注解就可以修改Excel
- 支持常用的样式自定义
- 基于map可以灵活定义的表头字段
- 支持一堆多的导出,导入
- 支持模板的导出,一些常见的标签,自定义标签
- 支持HTML/Excel转换,如果模板还不能满足用户的变态需求,请用这个功能
- 支持word的导出,支持图片,Excel

更多教程可以参考官方API：http://easypoi.mydoc.io/#text_202979

## 注解
easypoi起因就是Excel的导入导出,最初的模板是实体和Excel的对应,model--row,filed--col 这样利用注解我们可以和容易做到excel到导入导出 经过一段时间发展,现在注解有5个类分别是
- `@Excel`: 作用到filed上面,是对Excel一列的一个描述
- `@ExcelCollection`: 表示一个集合,主要针对一对多的导出,比如一个老师对应多个科目,科目就可以用集合表示
- `@ExcelEntity`: 表示一个继续深入导出的实体,但他没有太多的实际意义,只是告诉系统这个对象里面同样有导出的字段
- `@ExcelIgnore`: 和名字一样表示这个字段被忽略跳过这个导导出
- `@ExcelTarget` 这个是作用于最外层的对象,描述这个对象的id,以便支持一个对象可以针对不同导出做出不同处理

### @Excel
这个是必须使用的注解,如果需求简单只使用这一个注解也是可以的,涵盖了常用的Excel需求,需要大家熟悉这个功能,主要分为基础,图片处理,时间处理,合并处理几块,name_id是上面讲的id用法,这里就不累言了
| 属性           | 类型     | 默认值           | 功能                                                                                                                |
| -------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| name           | String   | null             | 列名,支持name_id                                                                                                    |
| needMerge      | boolean  | fasle            | 是否需要纵向合并单元格(用于含有list中,单个的单元格,合并list创建的多个row)                                           |
| orderNum       | String   | "0"              | 列的排序,支持name_id                                                                                                |
| replace        | String[] | {}               | 值得替换 导出是{a_id,b_id} 导入反过来                                                                               |
| savePath       | String   | "upload"         | 导入文件保存路径,如果是图片可以填写,默认是upload/className/ IconEntity这个类对应的就是upload/Icon/                  |
| type           | int      | 1                | 导出类型 1 是文本 2 是图片,3 是函数,10 是数字 默认是文本                                                            |
| width          | double   | 10               | 列宽                                                                                                                |
| height         | double   | 10               | 列高,后期打算统一使用@ExcelTarget的height,这个会被废弃,注意                                                         |
| isStatistics   | boolean  | fasle            | 自动统计数据,在追加一行统计,把所有数据都和输出 这个处理会吞没异常,请注意这一点                                      |
| isHyperlink    | boolean  | false            | 超链接,如果是需要实现接口返回对象                                                                                   |
| isImportField  | boolean  | true             | 校验字段,看看这个字段是不是导入的Excel中有,如果没有说明是错误的Excel,读取失败,支持name_id                           |
| exportFormat   | String   | ""               | 导出的时间格式,以这个是否为空来判断是否需要格式化日期                                                               |
| importFormat   | String   | ""               | 导入的时间格式,以这个是否为空来判断是否需要格式化日期                                                               |
| format         | String   | ""               | 时间格式,相当于同时设置了exportFormat 和 importFormat                                                               |
| databaseFormat | String   | "yyyyMMddHHmmss" | 导出时间设置,如果字段是Date类型则不需要设置 数据库如果是string 类型,这个需要设置这个数据库格式,用以转换时间格式输出 |
| numFormat      | String   | ""               | 数字格式化,参数是Pattern,使用的对象是DecimalFormat                                                                  |
| imageType      | int      | 1                | 导出类型 1 从file读取 2 是从数据库中读取 默认是文件 同样导入也是一样的                                              |
| suffix         | String   | ""               | 文字后缀,如% 90 变成90%                                                                                             |
| isWrap         | boolean  | true             | 是否换行 即支持\n                                                                                                   |
| mergeRely      | int[]    | {}               | 合并单元格依赖关系,比如第二列合并是基于第一列 则{0}就可以了                                                         |
| mergeVertical  | boolean  | fasle            | 纵向合并内容相同的单元格                                                                                            |
| fixedIndex     | int      | -1               | 对应excel的列,忽略名字                                                                                              |
| isColumnHidden | boolean  | false            | 导出隐藏列                                                                                                          |

### @ExcelTarget
限定一个到处实体的注解,以及一些通用设置,作用于最外面的实体
| 属性     | 类型   | 默认值 | 功能         |
| -------- | ------ | ------ | ------------ |
| value    | String | null   | 定义ID       |
| height   | double | 10     | 设置行高     |
| fontSize | short  | 11     | 设置文字大小 |

### @ExcelEntity
标记是不是导出excel 标记为实体类,一遍是一个内部属性类,标记是否继续穿透,可以自定义内部id
| 属性 | 类型   | 默认值 | 功能   |
| ---- | ------ | ------ | ------ |
| id   | String | null   | 定义ID |

### @ExcelCollection
一对多的集合注解,用以标记集合是否被数据以及集合的整体排序
| 属性     | 类型     | 默认值          | 功能                     |
| -------- | -------- | --------------- | ------------------------ |
| id       | String   | null            | 定义ID                   |
| name     | String   | null            | 定义集合列名,支持nanm_id |
| orderNum | int      | 0               | 排序,支持name_id         |
| type     | Class<?> | ArrayList.class | 导入时创建对象使用       |

### @ExcelIgnore
忽略这个属性,多使用需循环引用中,无需多解释吧^^

## 实体定义类：
```java
@Data
public class PartyMember implements Serializable{
  @Excel(name = "姓名")
  @NotNull(message = "姓名不能为空")
  private String name;

  @Excel(name = "身份证")
  private String idCard;

  @Excel(name = "入党时间", format = "yyyy-MM-dd")
  private Date joinPartyTime;

  @Excel(name = "党员状态", replace = {"在职_1", "离职_2"}, isImportField = "true")
  private String state;

  @ExcelEntity(name ="民族")
  private Nation nation;

  @ExcelCollection(name = "学生", orderNum = "4")
  private List<StudentEntity> students;
}
```
```java
@Data
public class Nation implements Serializable {

    private Integer id;

    @Excel(name = "民族")
    private String name;
}
```

接下来是工具类的编写：
**注：此处的导入导出是相对程序，而不是相对于excel。即导入是将excel中的数据导入到程序中，导出是将程序中的数据导出到excel中**

## Excel导入介绍
```java
@Test
public void test2() {
    ImportParams params = new ImportParams();
    params.setTitleRows(1);
    params.setHeadRows(1);
    long start = new Date().getTime();
    List<MsgClient> list = ExcelImportUtil.importExcel(
        new File(PoiPublicUtil.getWebRootPath("import/ExcelExportMsgClient.xlsx")),
        MsgClient.class, params);
    System.out.println(new Date().getTime() - start);
    System.out.println(list.size());
    System.out.println(ReflectionToStringBuilder.toString(list.get(0)));
}
```
### ImportParams
ImportParams 参数介绍下
| 属性             | 类型                | 默认值               | 功能                                                                                                                              |
| ---------------- | ------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| titleRows        | int                 | 0                    | 表格标题行数,默认0                                                                                                                |
| headRows         | int                 | 1                    | 表头行数,默认1                                                                                                                    |
| startRows        | int                 | 0                    | 字段真正值和列标题之间的距离 默认0                                                                                                |
| keyIndex         | int                 | 0                    | 主键设置,如何这个cell没有值,就跳过 或者认为这个是list的下面的值， 这一列必须有值,不然认为这列为无效数据                           |
| startSheetIndex  | int                 | 0                    | 开始读取的sheet位置,默认为0                                                                                                       |
| sheetNum         | int                 | 1                    | 上传表格需要读取的sheet 数量,默认为1                                                                                              |
| needSave         | boolean             | false                | 是否需要保存上传的Excel                                                                                                           |
| needVerfiy       | boolean             | false                | 是否需要校验上传的Excel                                                                                                           |
| saveUrl          | String              | "upload/excelUpload" | 保存上传的Excel目录,默认是 如 TestEntity这个类保存路径就是upload/excelUpload/Test/yyyyMMddHHmss* 保存名称上传时间五位随机数       |
| verifyHanlder    | IExcelVerifyHandler | null                 | 校验处理接口,自定义校验                                                                                                           |
| lastOfInvalidRow | int                 | 0                    | 最后的无效行数,不读的行数                                                                                                         |
| readRows         | int                 | 0                    | 手动控制读取的行数                                                                                                                |
| importFields     | String[]            | null                 | 导入时校验数据模板,是不是正确的Excel                                                                                              |
| keyMark          | String              | ":"                  | Key-Value 读取标记,以这个为Key,后面一个Cell 为Value,多个改为ArrayList                                                             |
| readSingleCell   | boolean             | false                | 按照Key-Value 规则读取全局扫描Excel,但是跳过List读取范围提升性能， 仅仅支持titleRows + headRows + startRows 以及 lastOfInvalidRow |
| dataHanlder      | IExcelDataHandler   | null                 | 数据处理接口,以此为主,replace,format都在这后面                                                                                    |

