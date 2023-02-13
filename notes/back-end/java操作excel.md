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

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409122437.png)


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

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409122447.png)

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

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409122458.png)

官方文档：https://www.yuque.com/easyexcel/doc/easyexcel

EasyExcle将excel文件看成如下接口：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409122508.png)

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

# Java实现Excel导入和导出

![](https://raw.githubusercontent.com/NaisWang/images/master/FireShot.png)

![](https://raw.githubusercontent.com/NaisWang/images/master/FireShotCapture105.png)

## 环境准备
###  Maven 依赖
本次工具类的封装主要依赖于阿里巴巴的JSON包，以及表格处理的POI包，所以我们需要导入这两个库的依赖包，另外，我们还需要文件上传的相关包，毕竟我们在浏览器页面，做Excel导入时，是上传的Excel文件。
```xml
<!-- 文件上传 -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpmime</artifactId>
	<version>4.5.7</version>
</dependency>
<!-- JSON -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.41</version>
</dependency>
<!-- POI -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>3.16</version>
</dependency>
```

### 类文件
#### ExcelUtils

```java
package com.zyq.util.excel;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URL;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import com.zyq.entity.User;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.ClientAnchor.AnchorType;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.DataValidationConstraint;
import org.apache.poi.ss.usermodel.DataValidationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * Excel导入导出工具类
 *
 * @author sunnyzyq
 * @date 2021/12/17
 */
public class ExcelUtils {

    private static final String XLSX = ".xlsx";
    private static final String XLS = ".xls";
    public static final String ROW_MERGE = "row_merge";
    public static final String COLUMN_MERGE = "column_merge";
    private static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private static final String ROW_NUM = "rowNum";
    private static final String ROW_DATA = "rowData";
    private static final String ROW_TIPS = "rowTips";
    private static final int CELL_OTHER = 0;
    private static final int CELL_ROW_MERGE = 1;
    private static final int CELL_COLUMN_MERGE = 2;
    private static final int IMG_HEIGHT = 30;
    private static final int IMG_WIDTH = 30;
    private static final char LEAN_LINE = '/';
    private static final int BYTES_DEFAULT_LENGTH = 10240;
    private static final NumberFormat NUMBER_FORMAT = NumberFormat.getNumberInstance();


    public static <T> List<T> readFile(File file, Class<T> clazz) throws Exception {
        JSONArray array = readFile(file);
        return getBeanList(array, clazz);
    }

    public static <T> List<T> readMultipartFile(MultipartFile mFile, Class<T> clazz) throws Exception {
        JSONArray array = readMultipartFile(mFile);
        return getBeanList(array, clazz);
    }

    public static JSONArray readFile(File file) throws Exception {
        return readExcel(null, file);
    }

    public static JSONArray readMultipartFile(MultipartFile mFile) throws Exception {
        return readExcel(mFile, null);
    }

    private static <T> List<T> getBeanList(JSONArray array, Class<T> clazz) throws Exception {
        List<T> list = new ArrayList<>();
        Map<Integer, String> uniqueMap = new HashMap<>(16);
        for (int i = 0; i < array.size(); i++) {
            list.add(getBean(clazz, array.getJSONObject(i), uniqueMap));
        }
        return list;
    }

    /**
     * 获取每个对象的数据
     */
    private static <T> T getBean(Class<T> c, JSONObject obj, Map<Integer, String> uniqueMap) throws Exception {
        T t = c.newInstance();
        Field[] fields = c.getDeclaredFields();
        List<String> errMsgList = new ArrayList<>();
        boolean hasRowTipsField = false;
        StringBuilder uniqueBuilder = new StringBuilder();
        int rowNum = 0;
        for (Field field : fields) {
            // 行号
            if (field.getName().equals(ROW_NUM)) {
                rowNum = obj.getInteger(ROW_NUM);
                field.setAccessible(true);
                field.set(t, rowNum);
                continue;
            }
            // 是否需要设置异常信息
            if (field.getName().equals(ROW_TIPS)) {
                hasRowTipsField = true;
                continue;
            }
            // 原始数据
            if (field.getName().equals(ROW_DATA)) {
                field.setAccessible(true);
                field.set(t, obj.toString());
                continue;
            }
            // 设置对应属性值
            setFieldValue(t,field, obj, uniqueBuilder, errMsgList);
        }
        // 数据唯一性校验
        if (uniqueBuilder.length() > 0) {
            if (uniqueMap.containsValue(uniqueBuilder.toString())) {
                Set<Integer> rowNumKeys = uniqueMap.keySet();
                for (Integer num : rowNumKeys) {
                    if (uniqueMap.get(num).equals(uniqueBuilder.toString())) {
                        errMsgList.add(String.format("数据唯一性校验失败,(%s)与第%s行重复)", uniqueBuilder, num));
                    }
                }
            } else {
                uniqueMap.put(rowNum, uniqueBuilder.toString());
            }
        }
        // 失败处理
        if (errMsgList.isEmpty() && !hasRowTipsField) {
            return t;
        }
        StringBuilder sb = new StringBuilder();
        int size = errMsgList.size();
        for (int i = 0; i < size; i++) {
            if (i == size - 1) {
                sb.append(errMsgList.get(i));
            } else {
                sb.append(errMsgList.get(i)).append(";");
            }
        }
        // 设置错误信息
        for (Field field : fields) {
            if (field.getName().equals(ROW_TIPS)) {
                field.setAccessible(true);
                field.set(t, sb.toString());
            }
        }
        return t;
    }

    private static <T> void setFieldValue(T t, Field field, JSONObject obj, StringBuilder uniqueBuilder, List<String> errMsgList) {
        // 获取 ExcelImport 注解属性
        ExcelImport annotation = field.getAnnotation(ExcelImport.class);
        if (annotation == null) {
            return;
        }
        String cname = annotation.value();
        if (cname.trim().length() == 0) {
            return;
        }
        // 获取具体值
        String val = null;
        if (obj.containsKey(cname)) {
            val = getString(obj.getString(cname));
        }
        if (val == null) {
            return;
        }
        field.setAccessible(true);
        // 判断是否必填
        boolean require = annotation.required();
        if (require && val.isEmpty()) {
            errMsgList.add(String.format("[%s]不能为空", cname));
            return;
        }
        // 数据唯一性获取
        boolean unique = annotation.unique();
        if (unique) {
            if (uniqueBuilder.length() > 0) {
                uniqueBuilder.append("--").append(val);
            } else {
                uniqueBuilder.append(val);
            }
        }
        // 判断是否超过最大长度
        int maxLength = annotation.maxLength();
        if (maxLength > 0 && val.length() > maxLength) {
            errMsgList.add(String.format("[%s]长度不能超过%s个字符(当前%s个字符)", cname, maxLength, val.length()));
        }
        // 判断当前属性是否有映射关系
        LinkedHashMap<String, String> kvMap = getKvMap(annotation.kv());
        if (!kvMap.isEmpty()) {
            boolean isMatch = false;
            for (String key : kvMap.keySet()) {
                if (kvMap.get(key).equals(val)) {
                    val = key;
                    isMatch = true;
                    break;
                }
            }
            if (!isMatch) {
                errMsgList.add(String.format("[%s]的值不正确(当前值为%s)", cname, val));
                return;
            }
        }
        // 其余情况根据类型赋值
        String fieldClassName = field.getType().getSimpleName();
        try {
            if ("String".equalsIgnoreCase(fieldClassName)) {
                field.set(t, val);
            } else if ("boolean".equalsIgnoreCase(fieldClassName)) {
                field.set(t, Boolean.valueOf(val));
            } else if ("int".equalsIgnoreCase(fieldClassName) || "Integer".equals(fieldClassName)) {
                try {
                    field.set(t, Integer.valueOf(val));
                } catch (NumberFormatException e) {
                    errMsgList.add(String.format("[%s]的值格式不正确(当前值为%s)", cname, val));
                }
            } else if ("double".equalsIgnoreCase(fieldClassName)) {
                field.set(t, Double.valueOf(val));
            } else if ("long".equalsIgnoreCase(fieldClassName)) {
                field.set(t, Long.valueOf(val));
            } else if ("BigDecimal".equalsIgnoreCase(fieldClassName)) {
                field.set(t, new BigDecimal(val));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static JSONArray readExcel(MultipartFile mFile, File file) throws IOException {
        boolean fileNotExist = (file == null || !file.exists());
        if (mFile == null && fileNotExist) {
            return new JSONArray();
        }
        // 解析表格数据
        InputStream in;
        String fileName;
        if (mFile != null) {
            // 上传文件解析
            in = mFile.getInputStream();
            fileName = getString(mFile.getOriginalFilename()).toLowerCase();
        } else {
            // 本地文件解析
            in = new FileInputStream(file);
            fileName = file.getName().toLowerCase();
        }
        Workbook book;
        if (fileName.endsWith(XLSX)) {
            book = new XSSFWorkbook(in);
        } else if (fileName.endsWith(XLS)) {
            POIFSFileSystem poifsFileSystem = new POIFSFileSystem(in);
            book = new HSSFWorkbook(poifsFileSystem);
        } else {
            return new JSONArray();
        }
        JSONArray array = read(book);
        book.close();
        in.close();
        return array;
    }

    private static JSONArray read(Workbook book) {
        // 获取 Excel 文件第一个 Sheet 页面
        Sheet sheet = book.getSheetAt(0);
        return readSheet(sheet);
    }

    private static JSONArray readSheet(Sheet sheet) {
        // 首行下标
        int rowStart = sheet.getFirstRowNum();
        // 尾行下标
        int rowEnd = sheet.getLastRowNum();
        // 获取表头行
        Row headRow = sheet.getRow(rowStart);
        if (headRow == null) {
            return new JSONArray();
        }
        int cellStart = headRow.getFirstCellNum();
        int cellEnd = headRow.getLastCellNum();
        Map<Integer, String> keyMap = new HashMap<>();
        for (int j = cellStart; j < cellEnd; j++) {
            // 获取表头数据
            String val = getCellValue(headRow.getCell(j));
            if (val != null && val.trim().length() != 0) {
                keyMap.put(j, val);
            }
        }
        // 如果表头没有数据则不进行解析
        if (keyMap.isEmpty()) {
            return (JSONArray) Collections.emptyList();
        }
        // 获取每行JSON对象的值
        JSONArray array = new JSONArray();
        // 如果首行与尾行相同，表明只有一行，返回表头数据
        if (rowStart == rowEnd) {
            JSONObject obj = new JSONObject();
            // 添加行号
            obj.put(ROW_NUM, 1);
            for (int i : keyMap.keySet()) {
                obj.put(keyMap.get(i), "");
            }
            array.add(obj);
            return array;
        }
        for (int i = rowStart + 1; i <= rowEnd; i++) {
            Row eachRow = sheet.getRow(i);
            JSONObject obj = new JSONObject();
            // 添加行号
            obj.put(ROW_NUM, i + 1);
            StringBuilder sb = new StringBuilder();
            for (int k = cellStart; k < cellEnd; k++) {
                if (eachRow != null) {
                    String val = getCellValue(eachRow.getCell(k));
                    // 所有数据添加到里面，用于判断该行是否为空
                    sb.append(val);
                    obj.put(keyMap.get(k), val);
                }
            }
            if (sb.length() > 0) {
                array.add(obj);
            }
        }
        return array;
    }

    private static String getCellValue(Cell cell) {
        // 空白或空
        if (cell == null || cell.getCellTypeEnum() == CellType.BLANK) {
            return "";
        }
        // String类型
        if (cell.getCellTypeEnum() == CellType.STRING) {
            String val = cell.getStringCellValue();
            if (val == null || val.trim().length() == 0) {
                return "";
            }
            return val.trim();
        }
        // 数字类型
        if (cell.getCellTypeEnum() == CellType.NUMERIC) {
            // 科学计数法类型
            return NUMBER_FORMAT.format(cell.getNumericCellValue()) + "";
        }
        // 布尔值类型
        if (cell.getCellTypeEnum() == CellType.BOOLEAN) {
            return cell.getBooleanCellValue() + "";
        }
        // 错误类型
        return cell.getCellFormula();
    }

    public static <T> void exportTemplate(HttpServletResponse response, String fileName, Class<T> clazz) {
        exportTemplate(response, fileName, fileName, clazz, false);
    }

    public static <T> void exportTemplate(HttpServletResponse response, String fileName, String sheetName,
                                          Class<T> clazz) {
        exportTemplate(response, fileName, sheetName, clazz, false);
    }

    public static <T> void exportTemplate(HttpServletResponse response, String fileName, Class<T> clazz,
                                          boolean isContainExample) {
        exportTemplate(response, fileName, fileName, clazz, isContainExample);
    }

    public static <T> void exportTemplate(HttpServletResponse response, String fileName, String sheetName,
                                          Class<T> clazz, boolean isContainExample) {
        // 获取表头字段
        List<ExcelClassField> headFieldList = getExcelClassFieldList(clazz);
        // 获取表头数据和示例数据
        List<List<Object>> sheetDataList = new ArrayList<>();
        List<Object> headList = new ArrayList<>();
        List<Object> exampleList = new ArrayList<>();
        Map<Integer, List<String>> selectMap = new LinkedHashMap<>();
        for (int i = 0; i < headFieldList.size(); i++) {
            ExcelClassField each = headFieldList.get(i);
            headList.add(each.getName());
            exampleList.add(each.getExample());
            LinkedHashMap<String, String> kvMap = each.getKvMap();
            if (kvMap != null && kvMap.size() > 0) {
                selectMap.put(i, new ArrayList<>(kvMap.values()));
            }
        }
        sheetDataList.add(headList);
        if (isContainExample) {
            sheetDataList.add(exampleList);
        }
        // 导出数据
        export(response, fileName, sheetName, sheetDataList, selectMap);
    }

    private static <T> List<ExcelClassField> getExcelClassFieldList(Class<T> clazz) {
        // 解析所有字段
        Field[] fields = clazz.getDeclaredFields();
        boolean hasExportAnnotation = false;
        Map<Integer, List<ExcelClassField>> map = new LinkedHashMap<>();
        List<Integer> sortList = new ArrayList<>();
        for (Field field : fields) {
            ExcelClassField cf = getExcelClassField(field);
            if (cf.getHasAnnotation() == 1) {
                hasExportAnnotation = true;
            }
            int sort = cf.getSort();
            if (map.containsKey(sort)) {
                map.get(sort).add(cf);
            } else {
                List<ExcelClassField> list = new ArrayList<>();
                list.add(cf);
                sortList.add(sort);
                map.put(sort, list);
            }
        }
        Collections.sort(sortList);
        // 获取表头
        List<ExcelClassField> headFieldList = new ArrayList<>();
        if (hasExportAnnotation) {
            for (Integer sort : sortList) {
                for (ExcelClassField cf : map.get(sort)) {
                    if (cf.getHasAnnotation() == 1) {
                        headFieldList.add(cf);
                    }
                }
            }
        } else {
            headFieldList.addAll(map.get(0));
        }
        return headFieldList;
    }

    private static ExcelClassField getExcelClassField(Field field) {
        ExcelClassField cf = new ExcelClassField();
        String fieldName = field.getName();
        cf.setFieldName(fieldName);
        ExcelExport annotation = field.getAnnotation(ExcelExport.class);
        // 无 ExcelExport 注解情况
        if (annotation == null) {
            cf.setHasAnnotation(0);
            cf.setName(fieldName);
            cf.setSort(0);
            return cf;
        }
        // 有 ExcelExport 注解情况
        cf.setHasAnnotation(1);
        cf.setName(annotation.value());
        String example = getString(annotation.example());
        if (!example.isEmpty()) {
            if (isNumeric(example)) {
                cf.setExample(Double.valueOf(example));
            } else {
                cf.setExample(example);
            }
        } else {
            cf.setExample("");
        }
        cf.setSort(annotation.sort());
        // 解析映射
        String kv = getString(annotation.kv());
        cf.setKvMap(getKvMap(kv));
        return cf;
    }

    private static LinkedHashMap<String, String> getKvMap(String kv) {
        LinkedHashMap<String, String> kvMap = new LinkedHashMap<>();
        if (kv.isEmpty()) {
            return kvMap;
        }
        String[] kvs = kv.split(";");
        if (kvs.length == 0) {
            return kvMap;
        }
        for (String each : kvs) {
            String[] eachKv = getString(each).split("-");
            if (eachKv.length != 2) {
                continue;
            }
            String k = eachKv[0];
            String v = eachKv[1];
            if (k.isEmpty() || v.isEmpty()) {
                continue;
            }
            kvMap.put(k, v);
        }
        return kvMap;
    }

    /**
     * 导出表格到本地
     *
     * @param file      本地文件对象
     * @param sheetData 导出数据
     */
    public static void exportFile(File file, List<List<Object>> sheetData) {
        if (file == null) {
            System.out.println("文件创建失败");
            return;
        }
        if (sheetData == null) {
            sheetData = new ArrayList<>();
        }
        export(null, file, file.getName(), file.getName(), sheetData, null);
    }

    /**
     * 导出表格到本地
     *
     * @param <T>      导出数据类似，和K类型保持一致
     * @param filePath 文件父路径（如：D:/doc/excel/）
     * @param fileName 文件名称（不带尾缀，如：学生表）
     * @param list     导出数据
     * @throws IOException IO异常
     */
    public static <T> File exportFile(String filePath, String fileName, List<T> list) throws IOException {
        File file = getFile(filePath, fileName);
        List<List<Object>> sheetData = getSheetData(list);
        exportFile(file, sheetData);
        return file;
    }

    /**
     * 获取文件
     *
     * @param filePath filePath 文件父路径（如：D:/doc/excel/）
     * @param fileName 文件名称（不带尾缀，如：用户表）
     * @return 本地File文件对象
     */
    private static File getFile(String filePath, String fileName) throws IOException {
        String dirPath = getString(filePath);
        String fileFullPath;
        if (dirPath.isEmpty()) {
            fileFullPath = fileName;
        } else {
            // 判定文件夹是否存在，如果不存在，则级联创建
            File dirFile = new File(dirPath);
            if (!dirFile.exists()) {
                dirFile.mkdirs();
            }
            // 获取文件夹全名
            if (dirPath.endsWith(String.valueOf(LEAN_LINE))) {
                fileFullPath = dirPath + fileName + XLSX;
            } else {
                fileFullPath = dirPath + LEAN_LINE + fileName + XLSX;
            }
        }
        System.out.println(fileFullPath);
        File file = new File(fileFullPath);
        if (!file.exists()) {
            file.createNewFile();
        }
        return file;
    }

    private static <T> List<List<Object>> getSheetData(List<T> list) {
        // 获取表头字段
        List<ExcelClassField> excelClassFieldList = getExcelClassFieldList(list.get(0).getClass());
        List<String> headFieldList = new ArrayList<>();
        List<Object> headList = new ArrayList<>();
        Map<String, ExcelClassField> headFieldMap = new HashMap<>();
        for (ExcelClassField each : excelClassFieldList) {
            String fieldName = each.getFieldName();
            headFieldList.add(fieldName);
            headFieldMap.put(fieldName, each);
            headList.add(each.getName());
        }
        // 添加表头名称
        List<List<Object>> sheetDataList = new ArrayList<>();
        sheetDataList.add(headList);
        // 获取表数据
        for (T t : list) {
            Map<String, Object> fieldDataMap = getFieldDataMap(t);
            Set<String> fieldDataKeys = fieldDataMap.keySet();
            List<Object> rowList = new ArrayList<>();
            for (String headField : headFieldList) {
                if (!fieldDataKeys.contains(headField)) {
                    continue;
                }
                Object data = fieldDataMap.get(headField);
                if (data == null) {
                    rowList.add("");
                    continue;
                }
                ExcelClassField cf = headFieldMap.get(headField);
                // 判断是否有映射关系
                LinkedHashMap<String, String> kvMap = cf.getKvMap();
                if (kvMap == null || kvMap.isEmpty()) {
                    rowList.add(data);
                    continue;
                }
                String val = kvMap.get(data.toString());
                if (isNumeric(val)) {
                    rowList.add(Double.valueOf(val));
                } else {
                    rowList.add(val);
                }
            }
            sheetDataList.add(rowList);
        }
        return sheetDataList;
    }

    private static <T> Map<String, Object> getFieldDataMap(T t) {
        Map<String, Object> map = new HashMap<>();
        Field[] fields = t.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                String fieldName = field.getName();
                field.setAccessible(true);
                Object object = field.get(t);
                map.put(fieldName, object);
            }
        } catch (IllegalArgumentException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return map;
    }

    public static void exportEmpty(HttpServletResponse response, String fileName) {
        List<List<Object>> sheetDataList = new ArrayList<>();
        List<Object> headList = new ArrayList<>();
        headList.add("导出无数据");
        sheetDataList.add(headList);
        export(response, fileName, sheetDataList);
    }

    public static void export(HttpServletResponse response, String fileName, List<List<Object>> sheetDataList) {
        export(response, fileName, fileName, sheetDataList, null);
    }

    public static void export(HttpServletResponse response, String fileName, String sheetName,
                              List<List<Object>> sheetDataList) {
        export(response, fileName, sheetName, sheetDataList, null);
    }

    public static void export(HttpServletResponse response, String fileName, String sheetName,
                              List<List<Object>> sheetDataList, Map<Integer, List<String>> selectMap) {
        export(response, null, fileName, sheetName, sheetDataList, selectMap);
    }

    public static <T, K> void export(HttpServletResponse response, String fileName, List<T> list, Class<K> template) {
        // list 是否为空
        boolean lisIsEmpty = list == null || list.isEmpty();
        // 如果模板数据为空，且导入的数据为空，则导出空文件
        if (template == null && lisIsEmpty) {
            exportEmpty(response, fileName);
            return;
        }
        // 如果 list 数据，则导出模板数据
        if (lisIsEmpty) {
            exportTemplate(response, fileName, template);
            return;
        }
        // 导出数据
        List<List<Object>> sheetDataList = getSheetData(list);
        export(response, fileName, sheetDataList);
    }

    public static void export(HttpServletResponse response, String fileName, List<List<Object>> sheetDataList, Map<Integer, List<String>> selectMap) {
        export(response, fileName, fileName, sheetDataList, selectMap);
    }

    private static void export(HttpServletResponse response, File file, String fileName, String sheetName,
                               List<List<Object>> sheetDataList, Map<Integer, List<String>> selectMap) {
        // 整个 Excel 表格 book 对象
        SXSSFWorkbook book = new SXSSFWorkbook();
        // 每个 Sheet 页
        Sheet sheet = book.createSheet(sheetName);
        Drawing<?> patriarch = sheet.createDrawingPatriarch();
        // 设置表头背景色（灰色）
        CellStyle headStyle = book.createCellStyle();
        headStyle.setFillForegroundColor(IndexedColors.GREY_80_PERCENT.index);
        headStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headStyle.setAlignment(HorizontalAlignment.CENTER);
        headStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
        // 设置表身背景色（默认色）
        CellStyle rowStyle = book.createCellStyle();
        rowStyle.setAlignment(HorizontalAlignment.CENTER);
        rowStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        // 设置表格列宽度（默认为15个字节）
        sheet.setDefaultColumnWidth(15);
        // 创建合并算法数组
        int rowLength = sheetDataList.size();
        int columnLength = sheetDataList.get(0).size();
        int[][] mergeArray = new int[rowLength][columnLength];
        for (int i = 0; i < sheetDataList.size(); i++) {
            // 每个 Sheet 页中的行数据
            Row row = sheet.createRow(i);
            List<Object> rowList = sheetDataList.get(i);
            for (int j = 0; j < rowList.size(); j++) {
                // 每个行数据中的单元格数据
                Object o = rowList.get(j);
                int v = 0;
                if (o instanceof URL) {
                    // 如果要导出图片的话, 链接需要传递 URL 对象
                    setCellPicture(book, row, patriarch, i, j, (URL) o);
                } else {
                    Cell cell = row.createCell(j);
                    if (i == 0) {
                        // 第一行为表头行，采用灰色底背景
                        v = setCellValue(cell, o, headStyle);
                    } else {
                        // 其他行为数据行，默认白底色
                        v = setCellValue(cell, o, rowStyle);
                    }
                }
                mergeArray[i][j] = v;
            }
        }
        // 合并单元格
        mergeCells(sheet, mergeArray);
        // 设置下拉列表
        setSelect(sheet, selectMap);
        // 写数据
        if (response != null) {
            // 前端导出
            try {
                write(response, book, fileName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            // 本地导出
            FileOutputStream fos;
            try {
                fos = new FileOutputStream(file);
                ByteArrayOutputStream ops = new ByteArrayOutputStream();
                book.write(ops);
                fos.write(ops.toByteArray());
                fos.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 合并当前Sheet页的单元格
     *
     * @param sheet      当前 sheet 页
     * @param mergeArray 合并单元格算法
     */
    private static void mergeCells(Sheet sheet, int[][] mergeArray) {
        // 横向合并
        for (int x = 0; x < mergeArray.length; x++) {
            int[] arr = mergeArray[x];
            boolean merge = false;
            int y1 = 0;
            int y2 = 0;
            for (int y = 0; y < arr.length; y++) {
                int value = arr[y];
                if (value == CELL_COLUMN_MERGE) {
                    if (!merge) {
                        y1 = y;
                    }
                    y2 = y;
                    merge = true;
                } else {
                    merge = false;
                    if (y1 > 0) {
                        sheet.addMergedRegion(new CellRangeAddress(x, x, (y1 - 1), y2));
                    }
                    y1 = 0;
                    y2 = 0;
                }
            }
            if (y1 > 0) {
                sheet.addMergedRegion(new CellRangeAddress(x, x, (y1 - 1), y2));
            }
        }
        // 纵向合并
        int xLen = mergeArray.length;
        int yLen = mergeArray[0].length;
        for (int y = 0; y < yLen; y++) {
            boolean merge = false;
            int x1 = 0;
            int x2 = 0;
            for (int x = 0; x < xLen; x++) {
                int value = mergeArray[x][y];
                if (value == CELL_ROW_MERGE) {
                    if (!merge) {
                        x1 = x;
                    }
                    x2 = x;
                    merge = true;
                } else {
                    merge = false;
                    if (x1 > 0) {
                        sheet.addMergedRegion(new CellRangeAddress((x1 - 1), x2, y, y));
                    }
                    x1 = 0;
                    x2 = 0;
                }
            }
            if (x1 > 0) {
                sheet.addMergedRegion(new CellRangeAddress((x1 - 1), x2, y, y));
            }
        }
    }

    private static void write(HttpServletResponse response, SXSSFWorkbook book, String fileName) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        String name = new String(fileName.getBytes("GBK"), "ISO8859_1") + XLSX;
        response.addHeader("Content-Disposition", "attachment;filename=" + name);
        ServletOutputStream out = response.getOutputStream();
        book.write(out);
        out.flush();
        out.close();
    }

    private static int setCellValue(Cell cell, Object o, CellStyle style) {
        // 设置样式
        cell.setCellStyle(style);
        // 数据为空时
        if (o == null) {
            cell.setCellType(CellType.STRING);
            cell.setCellValue("");
            return CELL_OTHER;
        }
        // 是否为字符串
        if (o instanceof String) {
            String s = o.toString();
            if (isNumeric(s)) {
                cell.setCellType(CellType.NUMERIC);
                cell.setCellValue(Double.parseDouble(s));
                return CELL_OTHER;
            } else {
                cell.setCellType(CellType.STRING);
                cell.setCellValue(s);
            }
            if (s.equals(ROW_MERGE)) {
                return CELL_ROW_MERGE;
            } else if (s.equals(COLUMN_MERGE)) {
                return CELL_COLUMN_MERGE;
            } else {
                return CELL_OTHER;
            }
        }
        // 是否为字符串
        if (o instanceof Integer || o instanceof Long || o instanceof Double || o instanceof Float) {
            cell.setCellType(CellType.NUMERIC);
            cell.setCellValue(Double.parseDouble(o.toString()));
            return CELL_OTHER;
        }
        // 是否为Boolean
        if (o instanceof Boolean) {
            cell.setCellType(CellType.BOOLEAN);
            cell.setCellValue((Boolean) o);
            return CELL_OTHER;
        }
        // 如果是BigDecimal，则默认3位小数
        if (o instanceof BigDecimal) {
            cell.setCellType(CellType.NUMERIC);
            cell.setCellValue(((BigDecimal) o).setScale(3, RoundingMode.HALF_UP).doubleValue());
            return CELL_OTHER;
        }
        // 如果是Date数据，则显示格式化数据
        if (o instanceof Date) {
            cell.setCellType(CellType.STRING);
            cell.setCellValue(formatDate((Date) o));
            return CELL_OTHER;
        }
        // 如果是其他，则默认字符串类型
        cell.setCellType(CellType.STRING);
        cell.setCellValue(o.toString());
        return CELL_OTHER;
    }

    private static void setCellPicture(SXSSFWorkbook wb, Row sr, Drawing<?> patriarch, int x, int y, URL url) {
        // 设置图片宽高
        sr.setHeight((short) (IMG_WIDTH * IMG_HEIGHT));
        // （jdk1.7版本try中定义流可自动关闭）
        try (InputStream is = url.openStream(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buff = new byte[BYTES_DEFAULT_LENGTH];
            int rc;
            while ((rc = is.read(buff, 0, BYTES_DEFAULT_LENGTH)) > 0) {
                outputStream.write(buff, 0, rc);
            }
            // 设置图片位置
            XSSFClientAnchor anchor = new XSSFClientAnchor(0, 0, 0, 0, y, x, y + 1, x + 1);
            // 设置这个，图片会自动填满单元格的长宽
            anchor.setAnchorType(AnchorType.MOVE_AND_RESIZE);
            patriarch.createPicture(anchor, wb.addPicture(outputStream.toByteArray(), HSSFWorkbook.PICTURE_TYPE_JPEG));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String formatDate(Date date) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT);
        return format.format(date);
    }

    private static void setSelect(Sheet sheet, Map<Integer, List<String>> selectMap) {
        if (selectMap == null || selectMap.isEmpty()) {
            return;
        }
        Set<Entry<Integer, List<String>>> entrySet = selectMap.entrySet();
        for (Entry<Integer, List<String>> entry : entrySet) {
            int y = entry.getKey();
            List<String> list = entry.getValue();
            if (list == null || list.isEmpty()) {
                continue;
            }
            String[] arr = new String[list.size()];
            for (int i = 0; i < list.size(); i++) {
                arr[i] = list.get(i);
            }
            DataValidationHelper helper = sheet.getDataValidationHelper();
            CellRangeAddressList addressList = new CellRangeAddressList(1, 65000, y, y);
            DataValidationConstraint dvc = helper.createExplicitListConstraint(arr);
            DataValidation dv = helper.createValidation(dvc, addressList);
            if (dv instanceof HSSFDataValidation) {
                dv.setSuppressDropDownArrow(false);
            } else {
                dv.setSuppressDropDownArrow(true);
                dv.setShowErrorBox(true);
            }
            sheet.addValidationData(dv);
        }
    }

    private static boolean isNumeric(String str) {
        if ("0.0".equals(str)) {
            return true;
        }
        for (int i = str.length(); --i >= 0; ) {
            if (!Character.isDigit(str.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    private static String getString(String s) {
        if (s == null) {
            return "";
        }
        if (s.isEmpty()) {
            return s;
        }
        return s.trim();
    }

}
```

#### ExcelImport

```java
package com.zyq.util.excel;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author sunnyzyq
 * @date 2021/12/17
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcelImport {

    /** 字段名称 */
    String value();

    /** 导出映射，格式如：0-未知;1-男;2-女 */
    String kv() default "";

    /** 是否为必填字段（默认为非必填） */
    boolean required() default false;

    /** 最大长度（默认255） */
    int maxLength() default 255;

    /** 导入唯一性验证（多个字段则取联合验证） */
    boolean unique() default false;

}
```

#### ExcelExport

```java
package com.zyq.util.excel;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author sunnyzyq
 * @date 2021/12/17
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcelExport {

    /** 字段名称 */
    String value();

    /** 导出排序先后: 数字越小越靠前（默认按Java类字段顺序导出） */
    int sort() default 0;

    /** 导出映射，格式如：0-未知;1-男;2-女 */
    String kv() default "";

    /** 导出模板示例值（有值的话，直接取该值，不做映射） */
    String example() default "";

}
```
 
#### ExcelClassField
```java
package com.zyq.util.excel;
 
import java.util.LinkedHashMap;
 
/**
 * @author sunnyzyq
 * @date 2021/12/17
 */
@Data
public class ExcelClassField {
 
    /** 字段名称 */
    private String fieldName;
 
    /** 表头名称 */
    private String name;
 
    /** 映射关系 */
    private LinkedHashMap<String, String> kvMap;
 
    /** 示例值 */
    private Object example;
 
    /** 排序 */
    private int sort;
 
    /** 是否为注解字段：0-否，1-是 */
    private int hasAnnotation;
 
}
```
 
