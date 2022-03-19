Jackson可以轻松的将Java对象转换成json对象和xml文档，同样也可以将json、xml转换成Java对象
maven 安装
```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-core</artifactId>
  <version>2.9.6</version>
</dependency>

<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-annotations</artifactId>
  <version>2.9.6</version>
</dependency>

<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.9.6</version>
</dependency>
```
# ObjectMapper
ObjectMapper类是Jackson库的主要类。它称为ObjectMapper的原因是因为它将JSON映射到Java对象（反序列化），或将Java对象映射到JSON（序列化）。它使用JsonParser和JsonGenerator的实例实现JSON实际的读/写。

## 获取ObjectMapper对象的几种方法
1. 通过JsonParser类中的getCodec()方法：
```java
ObjectMapper mapper = (ObjectMapper) p.getCodec();
```

2. 直接new ObjectMapper();


**ObjectMapper如何将JSON字段与Java字段匹配的三种方式**
1. Jackson通过将JSON字段的名称与Java对象中的getter和setter方法相匹配，将JSON对象的字段映射到Java对象中的字段。Jackson删除了getter和setter方法名称的“get”和“set”部分，并将剩余名称的第一个字符转换为小写。
2. Jackson还可以通过java反射进行匹配
3. 通过注解或者其它方式进行自定义的序列化和反序列化程序。

## 转Java对象
**主要是使用ObjectMapper中的readValue方法**

1. Read Object From JSON String
```java
ObjectMapper objectMapper = new ObjectMapper();
String carJson = "{ \"brand\" : \"Mercedes\", \"doors\" : 5 }";
Car car = objectMapper.readValue(carJson, Car.class);
```

2. Read Object From JSON Reader
```java
ObjectMapper objectMapper = new ObjectMapper();
String carJson =  "{ \"brand\" : \"Mercedes\", \"doors\" : 4 }";
Reader reader = new StringReader(carJson);
Car car = objectMapper.readValue(reader, Car.class);
```

3. Read Object From JSON File
```java
ObjectMapper objectMapper = new ObjectMapper();
File file = new File("data/car.json");
Car car = objectMapper.readValue(file, Car.class);
```

4. Read Object From JSON via URL
```java
ObjectMapper objectMapper = new ObjectMapper();
URL url = new URL("file:data/car.json");
Car car = objectMapper.readValue(url, Car.class);
```

5. Read Object From JSON InputStream
```java
ObjectMapper objectMapper = new ObjectMapper();
InputStream input = new FileInputStream("data/car.json");
Car car = objectMapper.readValue(input, Car.class);
```

6. Read Object From JSON Byte Array
```java
ObjectMapper objectMapper = new ObjectMapper();
String carJson =  "{ \"brand\" : \"Mercedes\", \"doors\" : 5 }";
byte[] bytes = carJson.getBytes("UTF-8");
Car car = objectMapper.readValue(bytes, Car.class);
```

7. Read Object Array From JSON Array String
```java
String jsonArray = "[{\"brand\":\"ford\"}, {\"brand\":\"Fiat\"}]";
ObjectMapper objectMapper = new ObjectMapper();
Car[] cars2 = objectMapper.readValue(jsonArray, Car[].class);
```

8. Read Object List From JSON Array String
```java
String jsonArray = "[{\"brand\":\"ford\"}, {\"brand\":\"Fiat\"}]";
ObjectMapper objectMapper = new ObjectMapper();
List<Car> cars1 = objectMapper.readValue(jsonArray, new TypeReference<List<Car>>(){});
```

9. Read Map from JSON String
```java
String jsonObject = "{\"brand\":\"ford\", \"doors\":5}";
ObjectMapper objectMapper = new ObjectMapper();
Map<String, Object> jsonMap = objectMapper.readValue(jsonObject, new TypeReference<Map<String,Object>>(){});
```

## 转Json
**主要是使用ObjectMapper中的write方法**
ObjectMapper write有三个方法
- writeValue()
- writeValueAsString()
- writeValueAsBytes()

```java
ObjectMapper objectMapper = new ObjectMapper();
Car car = new Car();
car.brand = "BMW";
car.doors = 4;
//写到文件中
objectMapper.writeValue( new FileOutputStream("data/output-2.json"), car);
//写到字符串中
String json = objectMapper.writeValueAsString(car);
```

## ObjectMapper的设置
```java
ObjectMapper objectMapper = new ObjectMapper();
//去掉默认的时间戳格式     
objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
//设置为东八区
objectMapper.setTimeZone(TimeZone.getTimeZone("GMT+8"));
// 设置输入:禁止把POJO中值为null的字段映射到json字符串中
objectMapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
 //空值不序列化
objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
//反序列化时，属性不存在的兼容处理
objectMapper.getDeserializationConfig().withoutFeatures(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
//序列化时，日期的统一格式
objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
//序列化日期时以timestamps输出，默认true
objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
//序列化枚举是以toString()来输出，默认false，即默认以name()来输出
objectMapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING,true);
//序列化枚举是以ordinal()来输出，默认false
objectMapper.configure(SerializationFeature.WRITE_ENUMS_USING_INDEX,false);
//类为空时，不要抛异常
objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
//反序列化时,遇到未知属性时是否引起结果失败
objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
 //单引号处理
objectMapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
//解析器支持解析结束符
objectMapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
```

# JsonNode
sonNode类，完整路径为com.fasterxml.jackson.databind.JsonNode，是Jackson的json树模型(对象图模型)

## Json字符串转换成JsonNode对象 
```java
ObjectMapper mapper = new ObjectMapper();  
JsonNode jsonNode = mapper.readTree(json);
```

## 获取jsonNode的所有的key值
jsonNode的fieldNames方法是获取jsonNode的所有的key值
```java
Iterator<String> keys = jsonNode.fieldNames();  
while(keys.hasNext()){  
    String key = keys.next();  
    System.out.println("key键是:"+key);  
}
```

## 根据key值获取对应的jsonNode字段
**方法一：使用get**
on对象一样，JsonNode可以多个字段。假设我们解析下面json值JsonNode:
```json
{
    "field1" : "value1",
    "field2" : 999
}
json有两个字段，如果你用jsonNode表示上面json对象，则可以获得其两个字段：
```java
JsonNode field1 = jsonNode.get("field1");
JsonNode field2 = jsonNode.get("field2");
```
注意，即使两个字段是字符串类型，但get方法总是返回JsonNode类型表示字段。

**方法二：使用at方法获取JsonNode字段**

Jackson JsonNode有个特殊方法是at()方法。at方法可以在给定JsonNode作为根节点Json对象图中访问任何字段。
示例如下：
```json
{
  "identification" :  {
        "name" : "James",
        "ssn: "ABC123552"
    }
}
```
如果该json对应的JsonNode可以通过at方法访问其name字段：
```java
JsonNode nameNode = jsonNode.at("/identification/name");
```
注意at方法的参数：字符串"/identification/name"，这是json路径表达式。路径表达式指定了完整的从JsonNode的根到要访问字段的路径，与文件系统的路径很相似。但需要提醒的是必须以/开头。

at方法返回要访问的字段的JsonNode，如果没有找到则返回null。

## 转换JsonNode字段
Jackson JsonNode类提供一组方法可以转换字段值至其他数据类型。如long、字符串等。请看示例：
```java
String f2Str = jsonNode.get("f2").asText();
double f2Dbl = jsonNode.get("f2").asDouble();
int    f2Int = jsonNode.get("f2").asInt();
long   f2Lng = jsonNode.get("f2").asLong();
```
如果f2字段包含值为123456，则其有可能呗转换为字符串，double，int，long类型。

## 遍历JsonNode
如果是一个JsonNode数组，使用jsonNode.elements();读取数组中每个node， 如果不是JsonNode数组，使用jsonNode.elements();返回jsonNode的values
```java
Iterator<JsonNode> elements = jsonNode.elements();  
 while(elements.hasNext()){  
     JsonNode node = elements.next();  
     System.out.println(node.toString()); 
 }
```

# ObjectNode
## JsonNode与ObjectNode的区别
The Jackson JsonNode对象不可变，这意味着不能直接构建JsonNode实例的对象图，但你可以创建JsonNode 的子类ObjectNode实例的对象图。作为JsonNode 的子类，ObjectNode可以在任何使用了JsonNode之处使用

Jackson的JsonNode和ObjectNode两个类，前者是不可变的，一般用于读取。后者可变，一般用于创建Json对象图。

## 操作ObjectNode
由于JsonNode是不可变的。为了创建JsonNode对象图，你需要改变图中的JsonNode实例，如设置属性值和子JsonNode实例。因为其不可变性，不能直接进行操作，替代的是其子类ObjectNode，下面详细进行说明。

### 设置ObjectNode属性
首先创建ObjectNode实例：
```java
ObjectMapper objectMapper = new ObjectMapper();
ObjectNode objectNode = objectMapper.createObjectNode();
```
为了设置ObjectNode对象属性，需要调用set方法。传入字段名和JsonNode作为参数。
```java
ObjectMapper objectMapper = new ObjectMapper();
ObjectNode parentNode = objectMapper.createObjectNode();

JsonNode childNode = readJsonIntoJsonNode();

parentNode.set("child1", childNode);
```
readJsonIntoJsonNode()方法，是我们自己实现的，用来负责生产一些JsonNode对象，我们准备作为ObjectNode的子节点。

### 设置ObjectNode属性值为原始数据类型值
ObjectNode类也提供一组方法用于设置属性值为原始数据类型。相对于转换原始值为JsonNode再进行设置要简单。请看示例：
```java
objectNode.put("field1", "value1");
objectNode.put("field2", 123);
objectNode.put("field3", 999.999);
```

# @JsonSerialize和@JsonDeserialize的使用详解
## 背景
在项目中处理数据时需要对所有的金额格式化操作，具体做法是，后端接收的金额类数据单位需要由万元转换为元在存入数据库，而返回到前端的金额类数据又必须由元转换为万元返回，以便保持数据一致。
如果用传统方式，在保存和返回时加上转换的处理，需要复杂且繁琐的操作，jackson提供了JsonSerialize和JsonDeserialize注解来优雅的解决这个问题，项目采用的springboot框架，而springboot框架默认配置json转换工具就是jackson。如此，使用注解解决问题很nice了。

## 注解简介：
1. `@JsonSerialize`：json序列化注解，用于字段或get方法上，作用于getter()方法，将java对象序列化为json数据。
```java
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL) //include里面包含了序列化的范围和作用的规则，本行作用是属性为null的时候不进行序列化操作。
 
@JsonSerialize(using = Bean.class) //Bean 为实现类,Bean需要继承JsonSerializer<>,泛型就是作用字段的类型。
```
2. `@JsonDeserialize`：json反序列化注解，用于字段或set方法上，作用于setter()方法，将json数据反序列化为java对象。使用方法同@JsonSerialize类似。
3. 常用于对数据进行简单的特殊处理，比如本次项目实践用到的，对金额类数据进行格式化操作。

需要注意的是，该注解只在json序列化和反序列化的时候触发，其他时候并不生效！

注意：json序列化及反序列化注解通常用在前后端传值上，作用于get,set方法上，但并不是重写get,set方法，而是类似于补充，追加。
理解注解的作用和触发很重要，这能帮助我们知道该怎样来使用它！

## 项目实践：
1. 使用
```java
@JsonSerialize(using = BudgetSerializer.class)
@JsonDeserialize(using = BudgetDeserializer.class)
private BigDecimal applyBudget;
```
由于字段用于存储金额，所以采用了BigDecimal类。

2. 自定义实现类

首先需要自定义序列化及反序列化实现类，继承JsonSerializer<BigDecimal>类和JsonDeserializer<BigDecimal>，由于字段采用BigDecimal，所以泛型也使用BigDecimal。
**BudgetSerializer：**
```java
@Slf4j
public class BudgetSerializer extends JsonSerializer<BigDecimal> {
 
    @Override
    public void serialize(BigDecimal s, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        BigDecimal format = s;
        if (format != null) {
            // 元转万元
            format = format.divide(new BigDecimal("10000"), 4, BigDecimal.ROUND_HALF_DOWN);
            log.debug("元格式化万元：前 {}, 后 {}", s, format);
        }
 
        jsonGenerator.writeNumber(format);
    }
}
```
作用：在返回给前端金额参数的时候，把数据库中的数据由元格式化为万元，就是除10000的操作。

**BudgetDeserializer：**
```java
@Slf4j
public class BudgetDeserializer extends JsonDeserializer<BigDecimal> {
    @Override
    public BigDecimal deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
        try {
            if (jsonParser == null || jsonParser.getText() == null) {
                return null;
            }
            String s = jsonParser.getText();
            BigDecimal format = new BigDecimal(StringUtils.isBlank(s) ? "0" : s);
 
            // 万元转元
            format = format.multiply(new BigDecimal("10000"));
            log.debug("万元格式化元：前 {}, 后 {}", s, format);
            return format;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
```
作用：在后端接收前端金额参数的时候，把前端的数据由万元格式化为元，就是乘10000的操作。