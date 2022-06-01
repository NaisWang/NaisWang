# python中字符串下标
![](https://raw.githubusercontent.com/NaisWang/images/master/20211223195218.png)

# Python3 中有六个标准的数据类型
- Number（数字）
- String（字符串）
- List（列表）
- Tuple（元组）
- Set（集合）
- Dictionary（字典）

Python3 的六个标准数据类型中：
- 不可变数据（3 个）：Number（数字）、String（字符串）、Tuple（元组）；
- 可变数据（3 个）：List（列表）、Dictionary（字典）、Set（集合）。

**注：在 Python 中，变量就是变量，它没有类型，我们所说的"类型"是变量所指的内存中对象的类型。**

## Number（数字）
Python3 支持 int、float、bool、complex（复数）。
**在Python 3里，只有一种整数类型 int，表示为长整型，没有 python2 中的 Long。**
像大多数语言一样，数值类型的赋值和计算都是很直观的。

## String（字符串）
Python中的字符串用单引号 ' 或双引号 " 括起来，同时使用反斜杠 \ 转义特殊字符。
字符串的截取的语法格式如下：
```
变量[头下标:尾下标]
```
索引值以 0 为开始值，-1 为从末尾的开始位置。

`加号 + `是字符串的连接符， `星号 * `表示复制当前字符串，与之结合的数字为复制的次数。实例如下：
```py
#!/usr/bin/python3

str = 'Runoob'

print (str)          # 输出字符串
print (str[0:-1])    # 输出第一个到倒数第二个的所有字符
print (str[0])       # 输出字符串第一个字符
print (str[2:5])     # 输出从第三个开始到第五个的字符
print (str[2:])      # 输出从第三个开始的后的所有字符
print (str * 2)      # 输出字符串两次，也可以写成 print (2 * str)
print (str + "TEST") # 连接字符串
```
执行以上程序会输出如下结果：
```
Runoob
Runoo
R
noo
noob
RunoobRunoob
RunoobTEST
```

Python 使用反斜杠 \ 转义特殊字符，如果你不想让反斜杠发生转义，可以在字符串前面添加一个 r，表示原始字符串：
```
>>> print('Ru\noob')
Ru
oob
>>> print(r'Ru\noob')
Ru\noob
>>>
```
与 C 字符串不同的是，Python 字符串不能被改变。向一个索引位置赋值，比如`word[0] = 'm'`会导致错误。
注意：
1. 反斜杠可以用来转义，使用r可以让反斜杠不发生转义。
2. 字符串可以用+运算符连接在一起，用`*`运算符重复。
3. Python中的字符串有两种索引方式，从左往右以0开始，从右往左以-1开始。
4. Python中的字符串不能改变。

## List（列表）
List（列表） 是 Python 中使用最频繁的数据类型。
列表可以完成大多数集合类的数据结构实现。列表中元素的类型可以不相同，它支持数字，字符串甚至可以包含列表（所谓嵌套）。
列表是写在方括号 [] 之间、用逗号分隔开的元素列表。
和字符串一样，列表同样可以被索引和截取，列表被截取后返回一个包含所需元素的新列表。
列表截取的语法格式如下：
```
变量[头下标:尾下标]
```
加号 + 是列表连接运算符，星号 * 是重复操作。如下实例：
```py
#!/usr/bin/python3

list = [ 'abcd', 786 , 2.23, 'runoob', 70.2 ]
tinylist = [123, 'runoob']

print (list)            # 输出完整列表
print (list[0])         # 输出列表第一个元素
print (list[1:3])       # 从第二个开始输出到第三个元素
print (list[2:])        # 输出从第三个元素开始的所有元素
print (tinylist * 2)    # 输出两次列表
print (list + tinylist) # 连接列表
```
以上实例输出结果：
```
['abcd', 786, 2.23, 'runoob', 70.2]
abcd
[786, 2.23]
[2.23, 'runoob', 70.2]
[123, 'runoob', 123, 'runoob']
['abcd', 786, 2.23, 'runoob', 70.2, 123, 'runoob']
```

与Python字符串不一样的是，列表中的元素是可以改变的：
```py
>>> a = [1, 2, 3, 4, 5, 6]
>>> a[0] = 9
>>> a[2:5] = [13, 14, 15]
>>> a
[9, 2, 13, 14, 15, 6]
>>> a[2:5] = []   # 将对应的元素值设置为 []
>>> a
[9, 2, 6]
```
List 内置了有很多方法，例如 append()、pop() 等等，这在后面会讲到。
注意：
1. List写在方括号之间，元素用逗号隔开。
2. 和字符串一样，list可以被索引和切片。
3. List可以使用+操作符进行拼接。
4. List中的元素是可以改变的。

Python 列表截取可以接收第三个参数，参数作用是截取的步长，以下实例在索引 1 到索引 4 的位置并设置为步长为 2（间隔一个位置）来截取字符串：

如果第三个参数为负数表示逆向读取，以下实例用于翻转字符串：
```py
def reverseWords(input):
     
    # 通过空格将字符串分隔符，把各个单词分隔为列表
    inputWords = input.split(" ")
 
    # 翻转字符串
    # 假设列表 list = [1,2,3,4],  
    # list[0]=1, list[1]=2 ，而 -1 表示最后一个元素 list[-1]=4 ( 与 list[3]=4 一样)
    # inputWords[-1::-1] 有三个参数
    # 第一个参数 -1 表示最后一个元素
    # 第二个参数为空，表示移动到列表末尾
    # 第三个参数为步长，-1 表示逆向
    inputWords=inputWords[-1::-1]
 
    # 重新组合字符串
    output = ' '.join(inputWords)
     
    return output
 
if __name__ == "__main__":
    input = 'I like runoob'
    rw = reverseWords(input)
    print(rw)
```
输出结果为：
```
runoob like I
```
###  list列表添加元素的3种方法
#### append()方法添加元素
append() 方法用于在列表的末尾追加元素，该方法的语法格式如下：
```py
listname.append(obj)
```
其中，listname 表示要添加元素的列表；obj 表示到添加到列表末尾的数据，它可以是单个元素，也可以是列表、元组等。

请看下面的演示：
```py
l = ['Python', 'C++', 'Java']
#追加元素
l.append('PHP')
print(l)
#追加元组，整个元组被当成一个元素
t = ('JavaScript', 'C#', 'Go')
l.append(t)
print(l)
#追加列表，整个列表也被当成一个元素
l.append(['Ruby', 'SQL'])
print(l)
```
运行结果为：
```
['Python', 'C++', 'Java', 'PHP']
['Python', 'C++', 'Java', 'PHP', ('JavaScript', 'C#', 'Go')]
['Python', 'C++', 'Java', 'PHP', ('JavaScript', 'C#', 'Go'), ['Ruby', 'SQL']]
```

可以看到，当给 append() 方法传递列表或者元组时，此方法会将它们视为一个整体，作为一个元素添加到列表中，从而形成包含列表和元组的新列表。

#### extend()方法添加元素
extend() 和 append() 的不同之处在于：extend() 不会把列表或者元祖视为一个整体，而是把它们包含的元素逐个添加到列表中。

extend() 方法的语法格式如下：
```py
listname.extend(obj)
```
其中，listname 指的是要添加元素的列表；obj 表示到添加到列表末尾的数据，它可以是单个元素，也可以是列表、元组等，但不能是单个的数字。

请看下面的演示：
```py
l = ['Python', 'C++', 'Java']
#追加元素
l.extend('C')
print(l)
#追加元组，元祖被拆分成多个元素
t = ('JavaScript', 'C#', 'Go')
l.extend(t)
print(l)
#追加列表，列表也被拆分成多个元素
l.extend(['Ruby', 'SQL'])
print(l)
```
运行结果：
```
['Python', 'C++', 'Java', 'C']
['Python', 'C++', 'Java', 'C', 'JavaScript', 'C#', 'Go']
['Python', 'C++', 'Java', 'C', 'JavaScript', 'C#', 'Go', 'Ruby', 'SQL']
```
#### insert()方法插入元素
append() 和 extend() 方法只能在列表末尾插入元素，如果希望在列表中间某个位置插入元素，那么可以使用 insert() 方法。

insert() 的语法格式如下：
```py
listname.insert(index , obj)
```
其中，index 表示指定位置的索引值。insert() 会将 obj 插入到 listname 列表第 index 个元素的位置。

当插入列表或者元祖时，insert() 也会将它们视为一个整体，作为一个元素插入到列表中，这一点和 append() 是一样的。

请看下面的演示代码：
```py
l = ['Python', 'C++', 'Java']
#插入元素
l.insert(1, 'C')
print(l)
#插入元组，整个元祖被当成一个元素
t = ('C#', 'Go')
l.insert(2, t)
print(l)
#插入列表，整个列表被当成一个元素
l.insert(3, ['Ruby', 'SQL'])
print(l)
#插入字符串，整个字符串被当成一个元素
l.insert(0, "http://c.biancheng.net")
print(l)
```
输出结果为：
```
['Python', 'C', 'C++', 'Java']
['Python', 'C', ('C#', 'Go'), 'C++', 'Java']
['Python', 'C', ('C#', 'Go'), ['Ruby', 'SQL'], 'C++', 'Java']
['http://c.biancheng.net', 'Python', 'C', ('C#', 'Go'), ['Ruby', 'SQL'], 'C++', 'Java']
```
提示，insert() 主要用来在列表的中间位置插入元素，如果你仅仅希望在列表的末尾追加元素，那我更建议使用 append() 和 extend()。

## Tuple（元组）
元组（tuple）与列表类似，不同之处在于元组的元素不能修改。元组写在小括号 () 里，元素之间用逗号隔开。
元组中的元素类型也可以不相同：
```py
tuple = ( 'abcd', 786 , 2.23, 'runoob', 70.2  )
tinytuple = (123, 'runoob')

print (tuple)             # 输出完整元组
print (tuple[0])          # 输出元组的第一个元素
print (tuple[1:3])        # 输出从第二个元素开始到第三个元素
print (tuple[2:])         # 输出从第三个元素开始的所有元素
print (tinytuple * 2)     # 输出两次元组
print (tuple + tinytuple) # 连接元组
```
以上实例输出结果：
```
('abcd', 786, 2.23, 'runoob', 70.2)
abcd
(786, 2.23)
(2.23, 'runoob', 70.2)
(123, 'runoob', 123, 'runoob')
('abcd', 786, 2.23, 'runoob', 70.2, 123, 'runoob')
```
元组与字符串类似，可以被索引且下标索引从0开始，-1 为从末尾开始的位置。也可以进行截取（看上面，这里不再赘述）。
其实，可以把字符串看作一种特殊的元组。
```py
>>> tup = (1, 2, 3, 4, 5, 6)
>>> print(tup[0])
1
>>> print(tup[1:5])
(2, 3, 4, 5)
>>> tup[0] = 11  # 修改元组元素的操作是非法的
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment
>>>
```
虽然tuple的元素不可改变，但它可以包含可变的对象，比如list列表。

构造包含 0 个或 1 个元素的元组比较特殊，所以有一些额外的语法规则：
```py
tup1 = ()    # 空元组
tup2 = (20,) # 一个元素，需要在元素后添加逗号
```
string、list 和 tuple 都属于 sequence（序列）。

注意：
1. 与字符串一样，元组的元素不能修改。
2. 元组也可以被索引和切片，方法一样。
3. 注意构造包含 0 或 1 个元素的元组的特殊语法规则。
4. 元组也可以使用+操作符进行拼接。

## Set（集合）
集合（set）是由一个或数个形态各异的大小整体组成的，构成集合的事物或对象称作元素或是成员。
基本功能是进行成员关系测试和删除重复元素。
可以使用大括号 { } 或者 set() 函数创建集合，注意：创建一个空集合必须用 set() 而不是 { }，因为 { } 是用来创建一个空字典。
创建格式：
```
parame = {value01,value02,...}
```
或者
```
set(value)
```
实例
```py
#!/usr/bin/python3

sites = {'Google', 'Taobao', 'Runoob', 'Facebook', 'Zhihu', 'Baidu'}

print(sites)   # 输出集合，重复的元素被自动去掉

# 成员测试
if 'Runoob' in sites :
    print('Runoob 在集合中')
else :
    print('Runoob 不在集合中')


# set可以进行集合运算
a = set('abracadabra')
b = set('alacazam')

print(a)

print(a - b)     # a 和 b 的差集

print(a | b)     # a 和 b 的并集

print(a & b)     # a 和 b 的交集

print(a ^ b)     # a 和 b 中不同时存在的元素
```
以上实例输出结果：
```
{'Zhihu', 'Baidu', 'Taobao', 'Runoob', 'Google', 'Facebook'}
Runoob 在集合中
{'b', 'c', 'a', 'r', 'd'}
{'r', 'b', 'd'}
{'b', 'c', 'a', 'z', 'm', 'r', 'l', 'd'}
{'c', 'a'}
{'z', 'b', 'm', 'r', 'l', 'd'}
```

### frozenset
set(可变集合)与frozenset(不可变集合)的区别
set无序排序且不重复，是可变的，有add（），remove（）等方法。既然是可变的，所以它不存在哈希值。基本功能包括关系测试和消除重复元素. 集合对象还支持union(联合), intersection(交集),difference(差集)和sysmmetric difference(对称差集)等数学运算。不支持索引、切片等序列操作，但仍支持成员关系运算符in-not in、推导式等操作。

frozenset是冻结的集合，它是不可变的，存在哈希值，好处是<font color="red">它可以作为字典的key，也可以作为其它集合的元素。</font>缺点是一旦创建便不能更改，没有add，remove方法。

### python3中集合的并集等操作
Python 的集合（set）运算
数学里集合运算在Python的set中也有对应运算。

#### 子集⊆、真子集⊂
set的运算`<对应于真子集⊂`，`<=`对应于子集⊆
```python
>>> A = {1, 2, 3}
>>> B = {1, 2, 3, 4, 5}
>>> A <= B  #判断是否子集
True
>>> A < B  #判断是否真子集
True
>>> A <= A
True
>>> B < A
False
>>>
```

set类型的内置函数issubset()同样可以判断是否子集:
```python
>>> A.issubset(B)
True
```
#### 超集/包含关系⊇、 ⊃
set的运算>对应于真包含⊃，>=对应于包含⊇，对应的内置函数是issuperset()
```python
>>> A = {1, 2, 3}
>>> B = {1, 2, 3, 4, 5}
>>> B >= A
True
>>> B > A
True
>>> A >= A
True
>>> A > B
False
>>> A.issuperset(B)
False
>>> B.issuperset(A)
True
>>> 
```

#### 不相交集
一个集合中的任何一个元素都不属于另一个集合，可以说这两个集合是不相交集（Disjoint sets），也就是说，交集为空 。判断函数是isdisjoint()
```python
>>> A = {1, 2, 3}
>>> B = {1, 2, 3, 4, 5}
>>> A.isdisjoint(B)
False
>>>
```

#### 两集合的交集
set 的交集 的运算符号是&，采用这个符号是显然的，因为交集运算与位与（bit-wise AND）运算相似。对应的内置函数是intersection()
```python
>>> A = {1, 2, 3, 4, 5}
>>> B = {4, 5, 6, 7, 8}
>>> A & B
set([4, 5])
>>> A.intersection(B)
set([4, 5])
>>> 
```
#### 两集合的并集
set 的并集的运算符号是|，采用这个符号也是显然的，因为并集运算与位或（bit-wise OR）运算相似。对应的内置函数是union()
```python
>>> A = {1, 2, 3, 4, 5}
>>> B = {4, 5, 6, 7, 8}
>>> A | B
set([1, 2, 3, 4, 5, 6, 7, 8])
>>> A.union(B)
set([1, 2, 3, 4, 5, 6, 7, 8])
>>> 
```
#### 差集（减法）运算
set的差集运算，也就是从一个集合里减去另一个集合的所有元素，很直接的用减号表示，内置函数是difference()
```python
>>> A = {1, 2, 3, 4, 5}
>>> B = {4, 5, 6, 7, 8}
>>> A - B
set([1, 2, 3])
>>> A.difference(B)
set([1, 2, 3])
>>> 
```

#### 对称差集（异或）运算
数学上，两个集合的对称差(Symmetric difference)是只属于其中一个集合，而不被两个集合同时包含。 例如：集合{1,2,3}和{3,4}的对称差为{1,2,4}。集合论中的这个运算相当于布尔逻辑中的异或运算。所以在Python里使用了异或的符号（^）表示，内置函数为symmetric_difference()
```python
>>> A = {1, 2, 3, 4, 5}
>>> B = {4, 5, 6, 7, 8}
>>> A ^ B
set([1, 2, 3, 6, 7, 8])
>>> A.symmetric_difference(B)
set([1, 2, 3, 6, 7, 8])
>>> 
```

#### 集合内置函数的几个特点
上面介绍的集合内置函数里，有三个判断函数（is开头的函数）和四个运算函数（intersection, union, difference和symmetric_difference），表示运算的函数有下面几个特点：
1. 可以传递多个参数，表示连续运算
2. 可以传递除集合外的其他可递归类型（iterable）
比如
```python
>>> A = {1, 2, 3, 4, 5}
>>> B = {4, 5, 6, 7, 8}
>>> C = {4, 5, 9, 0}
>>> A.intersection(B, C)    #连续交集运算
set([4, 5])
>>> A & B & C    #连续交集运算
set([4, 5])
>>> 
>>> A = [1, 2, 3, 4, 5]
>>> B = [4, 5, 6, 7, 8]
>>> set(A).union(B)    #和list作并集
set([1, 2, 3, 4, 5, 6, 7, 8])
>>> set('abc').symmetric_difference('cdef')    #字符串也是sequence的一种
set(['a', 'b', 'e', 'd', 'f'])
>>> 
```

#### 集合运算的应用
利用set的运算，我们可以方便的判断两个sequence类型的集合关系：
```python
>>> A = [1, 2, 3]
>>> B = [1, 2, 3, 4, 5]
>>> set(A) <= set (B)   # list转换类型为set
True
>>> set(A).issubset(B)   # list转换类型为set
True
>>> 
```

## Dictionary（字典）
字典（dictionary）是Python中另一个非常有用的内置数据类型。
列表是有序的对象集合，字典是无序的对象集合。两者之间的区别在于：字典当中的元素是通过键来存取的，而不是通过偏移存取。
字典是一种映射类型，字典用 { } 标识，它是一个无序的 键(key) : 值(value) 的集合。
键(key)必须使用不可变类型。
在同一个字典中，键(key)必须是唯一的。
```py
#!/usr/bin/python3

dict = {}
dict['one'] = "1 - 菜鸟教程"
dict[2]     = "2 - 菜鸟工具"

tinydict = {'name': 'runoob','code':1, 'site': 'www.runoob.com'}


print (dict['one'])       # 输出键为 'one' 的值
print (dict[2])           # 输出键为 2 的值
print (tinydict)          # 输出完整的字典
print (tinydict.keys())   # 输出所有键
print (tinydict.values()) # 输出所有值
```
以上实例输出结果：
```
1 - 菜鸟教程
2 - 菜鸟工具
{'name': 'runoob', 'code': 1, 'site': 'www.runoob.com'}
dict_keys(['name', 'code', 'site'])
dict_values(['runoob', 1, 'www.runoob.com'])
```

**构造函数 dict()**可以直接从键值对序列中构建字典如下：
```py
>>> dict([('Runoob', 1), ('Google', 2), ('Taobao', 3)])
{'Runoob': 1, 'Google': 2, 'Taobao': 3}
>>> {x: x**2 for x in (2, 4, 6)}
{2: 4, 4: 16, 6: 36}
>>> dict(Runoob=1, Google=2, Taobao=3)
{'Runoob': 1, 'Google': 2, 'Taobao': 3}
>>>
```
另外，字典类型也有一些内置的函数，例如clear()、keys()、values()等。
注意：
1. 字典是一种映射类型，它的元素是键值对。
2. 字典的关键字必须为不可变类型，且不能重复。
3. 创建空字典使用 { }。

## Python数据类型转换
有时候，我们需要对数据内置的类型进行转换，数据类型的转换，你只需要将数据类型作为函数名即可。
以下几个内置的函数可以执行数据类型之间的转换。这些函数返回一个新的对象，表示转换的值。
| 函数                    | 描述                                                |
| ----------------------- | --------------------------------------------------- |
| `int(x [,base])`        | 将x转换为一个整数                                   |
| float(x)                | 将x转换到一个浮点数                                 |
| `complex(real [,imag])` | 创建一个复数                                        |
| str(x)                  | 将对象 x 转换为字符串                               |
| repr(x)                 | 将对象 x 转换为表达式字符串                         |
| eval(str)               | 用来计算在字符串中的有效Python表达式,并返回一个对象 |
| tuple(s)                | 将序列 s 转换为一个元组                             |
| list(s)                 | 将序列 s 转换为一个列表                             |
| set(s)                  | 转换为可变集合                                      |
| dict(d)                 | 创建一个字典。d 必须是一个 (key, value)元组序列。   |
| frozenset(s)            | 转换为不可变集合                                    |
| chr(x)                  | 将一个整数转换为一个字符                            |
| ord(x)                  | 将一个字符转换为它的整数值                          |
| hex(x)                  | 将一个整数转换为一个十六进制字符串                  |
| oct(x)                  | 将一个整数转换为一个八进制字符串                    |

## 关于全局变量与局部变量
1. 函数内部的变量名如果第一次出现，且出现在=前面，即被视为定义一个局部变量，不管全局域中有没有用到该变量名，函数中使用的将是局部变量，例如：
```py
num = 100
def func():
    num = 123
    print(num)
 
func()
```
输出：
```
123
```
说明函数中定义的num是一个局部变量，会将全局变量覆盖。再例如：

```py
num = 100
def func():
    num += 100
    print(num)
 
func()
```
输出：
```
UnboundLocalError: local variable 'num' referenced before assignment
```
错误提示局部变量num在赋值前被应用，也就是该变量没有定义就使用它，由此再次证明了这里定义了一个局部变量，而不是使用的全局的num。

**总结：函数内部的变量名如果第一次出现，且出现在=前面，即被视为定义一个局部变量。**


2. 函数内部的变量名如果第一次出现，且出现在=后面，且该变量在全局域中已定义，则这里将引用全局变量，如果该变量在全局域中没有定义，当然会出现“变量未定义”的错误。例如：
```py
num = 100
def func():
    x = num + 100
    print(x)
 
func()
```
输出：
```
200
```
表示这里使用的num是全局变量num。

或者其他使用该变量（例如调用成员函数）的情况，也将引用全局变量，例如：
```py
a = [1, 2]
def func():
    a.append(3)
    print(a)
    
func()
```
输出：
```
[1, 2, 3]
```
**总结：只要是使用变量，而该变量在全局域中有定义，而在局部没有定义，则会使用全局变量。**

3. 函数中使用某个变量时，该变量名既有全局变量也有同名的局部变量，则会使用局部变量，例如：
```py
num = 100
def func():
    num = 200
    x = num + 100
    print(x)
 
func()
```
结果：
```
300
```
总结：如果使用的变量在全局域中有定义，在局部域中也有定义，则默认会使用局部变量。

4. 在函数中，如果想给全局变量赋值，则需要用关键字global生命，例如：
```py
num = 100
def func():
    global num
    num = 200
    print(num)
 
func()
print(num)
```
输出：
```
200
200
```
说明函数中给num赋值为200是修改的全局变量，而且这里没有定义新的局部变量，所以后续如果再操作num也是操作的全局变量，例如：
```py
num = 100
def func():
    global num
    num = 200
    num += 100
    print(num)
 
func()
print(num)
```
输出：
```
300
300
```
**总结：如果要在函数中给全局变量赋值，需要用global关键字声明。**

# type()与isinstance()
type函数的用法很简单，就是type(object)，返回的是传入的object的类型。
isinstance的用法为: `isinstance(object,type-or-tuple-or-class) -> bool`, 传入的第一个参数为对象，第二个参数为类型名(int,str,float等)或者类型名的一个列表(如(str, str, int)为一个列表)，返回值为一个布尔变量。
例如：
```py
>>> a, b, c, d = 20, 5.5, True, 4+3j
>>> print(type(a), type(b), type(c), type(d))
<class 'int'> <class 'float'> <class 'bool'> <class 'complex'>

>>>a = 111
>>> isinstance(a, int)
True
```


## 两个函数的异同
**相同点**
都可以判断变量是否属于某个内建类型。

**不同点**
1. type只接受一个参数，不仅可以判断变量是否属于某个类型，还可以直接返回参数类型。而isinstance只能判断是否属于某个已知的类型，不能直接得到变量所属的类型。

2. isinstance可以判断子类实例对象是属于父类的；而type会判断子类实例对象和父类类型不一样。

```py
class A1(object):
    pass

class B1(A1):
    pass

print type(A1()) is A1
print type(B1()) is A1
print isinstance(B1(), A1)
```
输出结果为:
```
True
False
True
```
从以上的分析可以看出，type主要是用来获取未知变量的类型，而instance可以用于继承关系的判断

# 变量前加一个星号与2个星号
在变量前加*，则多余的函数参数会作为一个元组存在args中，如：
```python
def func(*ages):
func(1,2,3) #args表示（1，2，3）这个元组
```
如果使用**前缀，多余的参数会被认为是字典
```python
def func(**args):
func(a='1',b='2',c ='3')#args表示{‘a’:'1','b':'2','c':'3'}
```

给函数传递字典
```python
font = {
 'family' : 'aa',
 'ff':'bbb'
}
matplotlib.rc("font",**font)
# 等价于下面写法
matplotlib.rc("font", family='aa', ff='bbb')
```


# 读取键盘输入
## 读入一行字符串
```
line = input()

line1 = input("请输入:")
```
## 以空格分隔的数据
```
# 用空格获取输入数据的两种方法， map()的返回值是一个迭代器
num1 = list(map(int, input().strip().split()))
num2 = [int(temp) for temp in input().split()]
```


# python3逗号四大用法
## 作为参数或变量间的分隔符  
```python
def function(a,b): #参数分隔
    pass
a,b = 1,2  #变量分隔
```

## 将变量转换成元组
```python
a = 1
b = a,
print(a)  #输出转变前
print(b)  #输出转变后
```
Output
```
1
(1,)
```

## 提取只有一个元素的列表、集合、元组中的元素
```python
a, = (1,)
b, = [1]
c, = set({1})
```
其中a、b、c变量都是int型变量

注： 只有一个元素的列表、集合、元组中的元素， 否则会报错，如下
```python
a, = (1,2)
```
Output
```
ValueError: too many values to unpack (expected 1)
```

# map() 函数
**描述**
map() 会根据提供的函数对指定序列做映射。

第一个参数 function 以参数序列中的每一个元素调用 function 函数，返回包含每次 function 函数返回值的新列表。

**语法**
map() 函数语法：
```
map(function, iterable, ...)
```
**参数**
- function -- 函数
- iterable -- 一个或多个序列

**返回值**
Python 2.x 返回列表。
Python 3.x 返回迭代器。

**实例**
以下实例展示了 map() 的使用方法：

Python2.x 实例
```py
>>> def square(x) :            # 计算平方数
...     return x ** 2
...
>>> map(square, [1,2,3,4,5])   # 计算列表各个元素的平方
[1, 4, 9, 16, 25]
>>> map(lambda x: x ** 2, [1, 2, 3, 4, 5])  # 使用 lambda 匿名函数
[1, 4, 9, 16, 25]

# 提供了两个列表，对相同位置的列表数据进行相加
>>> map(lambda x, y: x + y, [1, 3, 5, 7, 9], [2, 4, 6, 8, 10])
[3, 7, 11, 15, 19]
```

Python3.x 实例
```py
>>> def square(x) :         # 计算平方数
...     return x ** 2
...
>>> map(square, [1,2,3,4,5])    # 计算列表各个元素的平方
<map object at 0x100d3d550>     # 返回迭代器
>>> list(map(square, [1,2,3,4,5]))   # 使用 list() 转换为列表
[1, 4, 9, 16, 25]
>>> list(map(lambda x: x ** 2, [1, 2, 3, 4, 5]))   # 使用 lambda 匿名函数
[1, 4, 9, 16, 25]
>>>
```

# Python 模块
Python 模块(Module)，是一个 Python 文件，以 .py 结尾，包含了 Python 对象定义和Python语句。
模块让你能够有逻辑地组织你的 Python 代码段。
把相关的代码分配到一个模块里能让你的代码更好用，更易懂。
模块能定义函数，类和变量，模块里也能包含可执行的代码。

下例是个简单的模块 support.py：
```py
def print_func( par ):
   print "Hello : ", par
   return
```

## import 语句
**模块的引入**
模块定义好后，我们可以使用 import 语句来引入模块，语法如下：
```
import module1[, module2[,... moduleN]]
```
比如要引用模块 math，就可以在文件最开始的地方用 import math 来引入。在调用 math 模块中的函数时，必须这样引用：
```
模块名.函数名
```
当解释器遇到 import 语句，如果模块在当前的搜索路径就会被导入。

搜索路径是一个解释器会先进行搜索的所有目录的列表。如想要导入模块 support.py，需要把命令放在脚本的顶端：
```py
#!/usr/bin/python
# -*- coding: UTF-8 -*-
 
# 导入模块
import support
 
# 现在可以调用模块里包含的函数了
support.print_func("Runoob")
```
以上实例输出结果：
```
Hello : Runoob
```
一个模块只会被导入一次，不管你执行了多少次import。这样可以防止导入模块被一遍又一遍地执行。

## from…import 语句
Python 的 from 语句让你从模块中导入一个指定的部分到当前命名空间中。语法如下：
```
from modname import name1[, name2[, ... nameN]]
```
例如，要导入模块 fib 的 fibonacci 函数，使用如下语句：
```py
from fib import fibonacci
```
这个声明不会把整个 fib 模块导入到当前的命名空间中，它只会将 fib 里的 fibonacci 单个引入到执行这个声明的模块的全局符号表。

## from…import* 语句
把一个模块的所有内容全都导入到当前的命名空间也是可行的，只需使用如下声明：
```py
from modname import *
```
这提供了一个简单的方法来导入一个模块中的所有项目。然而这种声明不该被过多地使用。

例如我们想一次性引入 math 模块中所有的东西，语句如下：
```
from math import *
```

## 搜索路径
当你导入一个模块，Python 解析器对模块位置的搜索顺序是：
1. 当前目录
2. 如果不在当前目录，Python 则搜索在 shell 变量 PYTHONPATH 下的每个目录。
3. 如果都找不到，Python会察看默认路径。UNIX下，默认路径一般为/usr/local/lib/python/。

模块搜索路径存储在 system 模块的 sys.path 变量中。变量里包含当前目录，PYTHONPATH和由安装过程决定的默认目录。

## Python中的包
包是一个分层次的文件目录结构，它定义了一个由模块及子包，和子包下的子包等组成的 Python 的应用环境。

简单来说，包就是文件夹，但该文件夹下必须存在`__init__.py`文件, 该文件的内容可以为空。`__init__.py`用于标识当前文件夹是一个包。

考虑一个在 package_runoob 目录下的 runoob1.py、runoob2.py、`__init__.py`文件，test.py 为测试调用包的代码，目录结构如下：
```
test.py
package_runoob
|-- __init__.py
|-- runoob1.py
|-- runoob2.py源代码如下：
```
package_runoob/runoob1.py
```py
#!/usr/bin/python
# -*- coding: UTF-8 -*-
 
def runoob1():
   print "I'm in runoob1"
package_runoob/runoob2.py
#!/usr/bin/python
# -*- coding: UTF-8 -*-
 
def runoob2():
   print "I'm in runoob2"
```

现在，在 package_runoob 目录下创建 `__init__.py`：

`package_runoob/__init__.py`
```py
#!/usr/bin/python
# -*- coding: UTF-8 -*-
 
if __name__ == '__main__':
    print '作为主程序运行'
else:
    print 'package_runoob 初始化'
```

然后我们在 package_runoob 同级目录下创建 test.py 来调用 package_runoob 包

test.py

```py
#!/usr/bin/python
# -*- coding: UTF-8 -*-

# 导入 Phone 包
from package_runoob.runoob1 import runoob1
from package_runoob.runoob2 import runoob2
 
runoob1()
runoob2()
```
以上实例输出结果：
```
package_runoob 初始化
I'm in runoob1
I'm in runoob2
```
如上，为了举例，我们只在每个文件里放置了一个函数，但其实你可以放置许多函数。你也可以在这些文件里定义Python的类，然后为这些类建一个包。

# __init__.py 作用详解
`__init__.py`该文件的作用就是相当于把自身整个文件夹当作一个包来管理，每当有外部import的时候，就会自动执行里面的函数。

## 标识该目录是一个python的模块包（module package）

`__init__.py` 文件的作用是将文件夹变为一个Python模块,Python 中的每个模块的包中，都有__init__.py 文件。

通常__init__.py 文件为空，但是我们还可以为它增加其他的功能。我们在导入一个包时，实际上是导入了它的__init__.py文件。这样我们可以在__init__.py文件中批量导入我们所需要的模块，而不再需要一个一个的导入。

## 简化模块导入操作

假设我们的模块包的目录结构如下：

```
.
└── mypackage
    ├── subpackage_1
    │   ├── test11.py
    │   └── test12.py
    ├── subpackage_2
    │   ├── test21.py
    │   └── test22.py
    └── subpackage_3
        ├── test31.py
        └── test32.py
```
如果我们使用最直接的导入方式，将整个文件拷贝到工程目录下，然后直接导入：
```
from mypackage.subpackage_1 import test11
from mypackage.subpackage_1 import test12
from mypackage.subpackage_2 import test21
from mypackage.subpackage_2 import test22
from mypackage.subpackage_3 import test31
from mypackage.subpackage_3 import test32
```
这样的话，看起来就会很麻烦，查找的时候也会麻烦，此时`__init__.py`就起到了简化的作用。

### init.py 是怎么工作的？
实际上，如果目录中包含了`__init__.py`时，当用 import 导入该目录时，会执行`__init__.py`里面的代码。我们在mypackage目录下增加一个`__ init __.py`文件来做一个实验：
```
.
└── mypackage
    ├── __init__.py
    ├── subpackage_1
    │   ├── test11.py
    │   └── test12.py
    ├── subpackage_2
    │   ├── test21.py
    │   └── test22.py
    └── subpackage_3
        ├── test31.py
        └── test32.py
```

`mypackage/__init__.py`里面加一个print，如果执行了该文件就会输出

```py
print("You have imported mypackage")
```

下面直接用交互模式进行 import

```py
>>> import mypackage
You have imported mypackage
```

很显然，`__init__.py`在包被导入时会被执行。

### 控制模块导入
我们再做一个实验，在 mypackage/init.py 添加以下语句：

```py
from subpackage_1 import test11
```

我们导入 mypackage 试试:

```py
>>> import mypackage
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/home/taopeng/Workspace/Test/mypackage/__init__.py", line 2, in <module>
    from subpackage_1 import test11
ImportError: No module named 'subpackage_1'
```

报错了。。。怎么回事？

原来，在我们执行import时，当前目录是不会变的（就算是执行子目录的文件），还是需要完整的包名。

```
from mypackage.subpackage_1 import test11
```

综上，我们可以在init.py 指定默认需要导入的模块

### 偷懒的导入方法
有时候我们在做导入时会偷懒，将包中的所有内容导入

```
from mypackage import *
```

这是怎么实现的呢？ __all__变量就是干这个工作的。`__all__`关联了一个模块列表，当执行 from xx import * 时，就会导入列表中的模块。我们将`__init__.py`修改为 :

```py
__all__ = ['subpackage_1', 'subpackage_2']
```
这里没有包含 subpackage_3，是为了证明`__all__`起作用了，而不是导入了所有子目录。
```py
>>> from mypackage import *
>>> dir()
['__builtins__', '__doc__', '__loader__', '__name__', '__package__', '__spec__', 'subpackage_1', 'subpackage_2']
>>> 
>>> dir(subpackage_1)
['__doc__', '__loader__', '__name__', '__package__', '__path__', '__spec__']
```

**子目录的中的模块没有导入！！！**该例子中的导入等价于:`from mypackage import subpackage_1, subpackage_2`因此，导入操作会继续查找 subpackage_1 和 subpackage_2 中的`__init__.py`并执行。（但是此时不会执行 import *）
我们在 subpackage_1 下添加`__init__.py`文件:

```py
__all__ = ['test11', 'test12']
# 默认只导入test11
from mypackage.subpackage_1 import test11
```

再来导入试试

```py
>>> from mypackage import *
>>> dir()
['__builtins__', '__doc__', '__loader__', '__name__', '__package__', '__spec__', 'subpackage_1', 'subpackage_2']
>>> 
>>> dir(subpackage_1)
['__all__', '__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__path__', '__spec__', 'test11']
```

如果想要导入子包的所有模块，则需要更精确指定。

```py
>>> from mypackage.subpackage_1 import *
>>> dir()
['__builtins__', '__doc__', '__loader__', '__name__', '__package__', '__spec__', 'test11', 'test
```

## 配置模块的初始化操作

在了解了`__init__.py`的工作原理后，应该能理解该文件就是一个正常的python代码文件。因此可以将初始化代码放入该文件中。

## __pycache__目录

- __pycache__ 是模块的缓存文件存放目录
- py代码在执行前，需要被解析器先转换为机器码，然后再执行。
- 所以我们在使用模块（包）时，也需要将模块的代码先转换为机器码然后再交由计算机执行，
- 而为了提高程序运行的性能，python会在编译过一次以后，将代码保存到一个缓存文件中，
- 这样在下次加载这个模块（包）时，就可以不再重新编译而是直接加载缓存中编译好的代码即可。


# python3解决UnicodeDecodeError, 'utf-8' 问题
**问题引出：**
最近在做一个买房自动化分析Python脚本，需要爬取网页。
在使用urllib获取reqest的response的时候，还要进行解码。
见语句：
```python
result = res.decode('utf-8')
```
当执行该语句的时候，会造成异常：
```text
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe5 in position 103339: invalid continuation byte
```

**问题分析**
该情况是由于出现了无法进行转换的 二进制数据 造成的，可以写一个小的脚本来判断下，是整体的字符集参数选择上出现了问题，还是出现了部分的无法转换的二进制块：
以读入文件为例：
```python
f = open("data.txt","rb")#二进制格式读文件
while True:
    line = f.readline()
    if not line:
        break
    else:
        try:
            #print(line.decode('utf8'))
            line.decode('utf8')
            #为了暴露出错误，最好此处不print
        except:
            print(str(line))
```
手写了一段代码，可以通过这段代码的输出来判断哪里出现了问题。

## method 1
如果输出的代码都是hex形式的，可能就是你选择的解码字符集出现了错误。 对于python2.7版本的来说，网上有使用这样一种看上去很霸气，其实很low的方式，来处理：
```python
#coding=utf8
import sys
reload(sys)
sys.setdefaultxxxx("utf8")
```
其实，这可以看作是python2系列版本的小bug,需要自行重新设置一下默认的编码字符集，如果还要这么设置的话，decode()的参数还拿来干嘛。
所以，在python3版本中，就已经取消了这个方法。

## method 2
2.如果是字符集出现错误，建议多选择几种字符集测试一下： 选择的经验是： 如果是爬取到的网页文件，可以查看网页文件的meta标签下的charset属性值。
例如：
```python
<meta charset="UTF-8">
```
也可以使用notepad++打开，查看下右下角的部位，会指示该文件是那种编码。

3.有的情况，是这样的，整个文件是好的，如果用notepad++打开后，能够看到文件是可以打开的，似乎什么问题都没有发生过，但是，用python进行解码的时候，却会出现错误。
我们运行上面的测试脚本，可以看到出现这样的情况：
```html
    <li id="J_menuHistory" data-page="J_pageHistory">
                                    <a><i class="icon-history"></i>播放历史     \0xe5 </a>
```                            
当然，这段代码是我随手写的一个例子，这里，可以注意看到这个0xe5,这是无法转换出来的部分，这是不属于编码字符集中的部分。所以，在进行编码转换的时候，会报错。

## method 3
修改字符集参数，一般这种情况出现得较多是在国标码(GBK)和utf8之间选择出现了问题。
出现异常报错是由于设置了decode()方法的第二个参数errors为严格（strict）形式造成的，因为默认就是这个参数，将其更改为ignore等即可。例如:
line.decode("utf8","ignore")


# python3中浅拷贝与深拷贝的实现方式
python3浅拷贝与深拷贝的实现方式、区别:
```python
list1 = [1,2,3]
list2 = list1
list1[0] = 0
print(list2)
print(list1)
```
打印的结果:
```
[0, 2, 3]
[0, 2, 3]
```
小结:
通过把一个列表变量名赋值给另一个变量名,只是把一个列表变量名list1的指引赋值给另一个变量名list2,使list1和list2都指向[1,2,3],所以当列表中的一个元素改变了,list1和list2都变了.
```python
list1 = [1,2,3]
list2 = list1.copy()
list1[0] = 0
print(list2)
print(list1)
```
打印的结果:
```
[1, 2, 3]
[0, 2, 3]
```
小结:copy函数是又开辟了一个内存空间,里面放有1,2,3,使list2指向新开辟的内存空间,所以list1的元素变化并不影响list2.
```python
list1 = [[4,5,6],2,3]
list2 = list1.copy()
list1[0][0] = 0
print(list2)
print(list1)
```
打印结果:
```
[[0, 5, 6], 2, 3]
[[0, 5, 6], 2, 3]
```
小结:copy函数有个坑,当列表中嵌套小列表时,用copy函数,外面的大列表开辟了一个新的内存空间,但里面的子列表只是赋值了指引,都指向[4,5,6],所以当作为子列表的整体改变时,两个列表互不影响,当作为子列表的元素改变时,两个列表同改变,那么在这种情况下,怎么实现两个列表互不影响呢?
```python
import copy
list1 = [[4,5,6],2,3]
list2 = copy.deepcopy(list1)
list1[0][0] = 0
print(list2)
print(list1)
```
打印结果:
```
[[4, 5, 6], 2, 3]
[[0, 5, 6], 2, 3]
```
小结:当列表中嵌套子列表时,用deepcopy可以开辟大空间同时开辟大空间中的小空间放子列表,实现一个列表中的子列表元素值变化,而另一个列表不变

# python打印和输出
在编程实践中，print 的使用频率非常高，特别是程序运行到某个时刻，要检测产生的结果时，必须用 print 来打印输出。
关于 print 函数，前面很多地方已经提及过，可用于写入标准输出。现在，是时候该深入了。
注意：这里强调的是“print 函数”，而不是“print 语句”。

## 深入 print
在 Python 2.x 中，print 是一个语句，但是在 Python 3.x 中，它是一个函数。如果 2.x 和 3.x 都使用过，你就会发现差异有多么大。
进入 3.x 的交互式 shell，尝试使用“print 语句”：
```python
[wang@localhost ~]$ python
Python 3.5.2 (default, Mar 29 2017, 11:05:07) 
[GCC 4.8.5 20150623 (Red Hat 4.8.5-11)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 
>>> print 'Python'
...
SyntaxError: Missing parentheses in call to 'print'
```

对于大多数人来说，这个错误信息再熟悉不过了。正如上面所提到的那样，print 是 3.x 中的一个函数，与其他函数一样，参数应该被圆括号括起来：
```python
>>> print('Python')
Python
```

## print 函数
要了解 print 函数的用途，可以使用 help() 来寻求帮助：
```python
>>> help(print)
...
Help on built-in function print in module builtins:

print(...)
    print(value, ..., sep=' ', end='\n', file=sys.stdout, flush=False)

    Prints the values to a stream, or to sys.stdout by default.
    Optional keyword arguments:
    file:  a file-like object (stream); defaults to the current sys.stdout.
    sep:   string inserted between values, default a space.
    end:   string appended after the last value, default a newline.
    flush: whether to forcibly flush the stream.
```
将对象输出到文本流文件，由 sep 分开，然后以 end 结束。如果 sep、end、file 和 flush 出现，则必须以关键字参数的形式指定。

## 不使用关键字参数
print 函数可以打印任意数量的值（value1, value2, …），这些值由逗号分隔。
```python
>>> age = 18
>>>
>>> print('age', age)
age 18
```
很容易发现，两个值之间有一个分隔符 - 空格（默认值），这取决于 sep。

## 分隔符
如果要重新定义分隔符，可以通过 sep 来指定。
```python
>>> print('age', age, sep='')  # 去掉空格
age18
>>> 
>>> print('www', 'python', 'org', sep='.')  # 以 . 分割
www.python.org
```
## 结束符
在 print 中，字符串后面会跟一个 \n（换行），前面的示例体现的不是很明显，换一个方式就显示出来了。
```python
>>> for letter in 'Python':
...     print(letter)
... 
P
y
t
h
o
n
```
每打印一个就换行，再打印下一个，这就是 \n 所起的作用。

要改变这种行为，可以给 end 分配一个任意字符串：
```python
>>> for letter in 'Python':
...     print(letter, end='-')
... 
P-y-t-h-o-n->>> 
```
## 输出重定向
默认情况下，print 的输出被发送到标准输出流（sys.stdout）。通过重新定义 file，可以将输出发送到不同的流（例如：文件或 sys.stderr）中。
```python
>>> f = open('data.txt', 'w')
>>> print('I am a Pythonista', file=f)
>>> f.close()
```
可以看到，在交互式 shell 中，没有得到任何输出，输出被发送到文件 data.txt 中：
```shell
[wang@localhost ~]$ cat data.txt 
I am a Pythonista
```
也可以通过这种方式将输出重定向到标准错误（sys.stderr）通道：
```python
>>> import sys
>>> 
>>> print('age: 18', file=sys.stderr)
age: 18
```
输出是否缓冲通常由文件决定，但是如果 flush 是 true，则流将被强制刷新。

# python拼接字符串的七种方式
## 来自C语言的%方式
```python
print('%s %s' % ('Hello', 'world'))
>>> Hello world
```
%号格式化字符串的方式继承自古老的C语言，这在很多编程语言都有类似的实现。上例的%s是一个占位符，它仅代表一段字符串，并不是拼接的实际内容。实际的拼接内容在一个单独的%号后面，放在一个元组里。

类似的占位符还有：%d（代表一个整数）、%f（代表一个浮点数）、%x（代表一个16进制数），等等。%占位符既是这种拼接方式的特点，同时也是其限制，因为每种占位符都有特定意义，实际使用起来太麻烦了。

## format()拼接方式
### 简洁版
```python
s1 = 'Hello {}! My name is {}.'.format('World', 'Python猫')
print(s1)
>>>Hello World! My name is Python猫.
```

### 对号入座版
```python
s2 = 'Hello {0}! My name is {1}.'.format('World', 'Python猫')
s3 = 'Hello {name1}! My name is {name2}.'.format(name1='World', name2='Python猫')
print(s2)
>>>Hello World! My name is Python猫.
print(s3)
>>>Hello World! My name is Python猫.
```
这种方式使用花括号{}做占位符，在format方法中再转入实际的拼接值。容易看出，它实际上是对%号拼接方式的改进。这种方式在Python2.6中开始引入。

上例中，简洁版的花括号中无内容，缺点是容易弄错次序。对号入座版主要有两种，一种传入序列号，一种则使用key-value的方式。实战中，我们更推荐后一种，既不会数错次序，又更直观可读。

## () 类似元组方式
```python
s_tuple = ('Hello', ' ', 'world')
s_like_tuple = ('Hello' ' ' 'world')

print(s_tuple) 
>>>('Hello', ' ', 'world')
print(s_like_tuple) 
>>>Hello world

type(s_like_tuple) >>>str
```
注意，上例中s_like_tuple并不是一个元组，因为元素间没有逗号分隔符，这些元素间可以用空格间隔，也可以不要空格。使用type()查看，发现它就是一个str类型。我没查到这是啥原因，猜测或许()括号中的内容是被Python优化处理了。

这种方式看起来很快捷，<font color="red">但是，括号()内要求元素是真实字符串，不能混用变量，所以不够灵活。</font>

多元素时，不支持有变量
```python
str_1 = 'Hello'
str_2 = (str_1 'world')
>>> SyntaxError: invalid syntax
str_3 = (str_1 str_1)
>>> SyntaxError: invalid syntax
```

但是下面写法不会报错
```python
str_4 = (str_1)
```
## 面向对象模板拼接
```python
from string import Template
s = Template('${s1} ${s2}!') 
print(s.safe_substitute(s1='Hello',s2='world')) 
>>> Hello world!
```
说实话，我不喜欢这种实现方式。浓浓的一股被面向对象思想毒害的臭味。

就不多说了。

## 常用的+号方式
```python
str_1 = 'Hello world！ ' 
str_2 = 'My name is Python猫.'
print(str_1 + str_2)
>>>Hello world！ My name is Python猫.
print(str_1)
>>>Hello world！ 
```
这种方式最常用、直观、易懂，是入门级的实现方式。但是，它也存在两处让人容易犯错的地方。

首先，新入门编程的同学容易犯错，他们不知道字符串是不可变类型，新的字符串会独占一块新的内存，而原来的字符串保持不变。上例中，拼接前有两段字符串，拼接后实际有三段字符串。

其次，一些有经验的老程序员也容易犯错，他们以为当拼接次数不超过3时，使用+号连接符就会比其它方式快（ps：不少Python教程都是如此建议），但这没有任何合理根据。

事实上，在拼接短的字面值时，由于CPython中的 常数折叠 （constant folding）功能，这些字面值会被转换成更短的形式，例如'a'+'b'+'c' 被转换成'abc'，'hello'+'world'也会被转换成'hello world'。这种转换是在编译期完成的，而到了运行期时就不会再发生任何拼接操作，因此会加快整体计算的速度。

常数折叠优化有一个限度，它要求拼接结果的长度不超过20。所以，当拼接的最终字符串长度不超过20时，+号操作符的方式，会比后面提到的join等方式快得多，这与+号的使用次数无关。

<font color="red">注： 如果现有不是str类型的变量a，  执行 `"ff"+a` 操作会报 TypeError: can only concatenate str (not "int") to str 错误
解决方法是将变量a转成str类型： "ff"+str(a)</font>

## join()拼接方式
```python
str_list = ['Hello', 'world']
str_join1 = ' '.join(str_list)
str_join2 = '-'.join(str_list)
print(str_join1) >>>Hello world
print(str_join2) >>>Hello-world
```
str对象自带的join()方法，接受一个序列参数，可以实现拼接。拼接时，元素若不是字符串，需要先转换一下。可以看出，这种方法比较适用于连接序列对象中（例如列表）的元素，并设置统一的间隔符。

当拼接长度超过20时，这种方式基本上是首选。不过，它的缺点就是，不适合进行零散片段的、不处于序列集合的元素拼接。

## f-string方式
详见：[f-string.md](file:///F:/vnote/back-end/python/f-string.md)
```python
name = 'world'
myname = 'python_cat'
words = f'Hello {name}. My name is {myname}.'
print(words)
>>> Hello world. My name is python_cat.
```
f-string方式出自PEP 498（Literal String Interpolation，字面字符串插值），从Python3.6版本引入。其特点是在字符串前加 f 标识，字符串中间则用花括号{}包裹其它字符串变量。

这种方式在可读性上秒杀format()方式，处理长字符串的拼接时，速度与join()方法相当。

尽管如此，这种方式与其它某些编程语言相比，还是欠优雅，因为它引入了一个 f 标识。而其它某些程序语言可以更简练，比如shell：
```shell
name="world"
myname="python_cat"
words="Hello ${name}. My name is ${myname}."
echo $words
>>>Hello world. My name is python_cat.
```

## Summary
总结一下，我们前面说的“字符串拼接”，其实是从结果上理解。若从实现原理上划分的话，我们可以将这些方法划分出三种类型：

格式化类：%、format()、template

拼接类：+、()、join()

插值类：f-string

当要处理字符串列表等序列结构时，采用join()方式；拼接长度不超过20时，选用+号操作符方式；长度超过20的情况，高版本选用f-string，低版本时看情况使用format()或join()方式。

# python执行系统命令的方法
## os.system("cmd")
这是最简单的一种方法，其执行过程中会输出显示cmd命令执行的信息。

例如：print os.system("mkdir test") >>>输出：0

可以看到结果打印出0，表示命令执行成功；否则表示失败（再次执行该命令，输出：子目录或文件 test 已经存在。1）。

## 使用os.popen("cmd")
通过os.popen()返回的是 file read 的对象，对其进行读取read()操作可以看到执行的输出

例如：print os.popen("adb shell ls /sdcard/ | findstr aa.png").read() >>> 输出：aa.png（若aa.png存在，否则输出为空）

## subprocess.Popen("cmd")
subprocess模块被推荐用来替换一些老的模块和函数，如：os.system、os.spawn*、os.popen*等

subprocess模块目的是启动一个新的进程并与之通信，最常用是定义类Popen，使用Popen可以创建进程，并与进程进行复杂的交互。其函数原型为：
```python
class subprocess.Popen(args, bufsize=0, executable=None, stdin=None, stdout=None, stderr=None, preexec_fn=None, close_fds=False, shell=False, cwd=None, env=None, universal_newlines=False, startupinfo=None, creationflags=0)
```
Popen非常强大，支持多种参数和模式，通过其构造函数可以看到支持很多参数。但Popen函数存在缺陷在于，它是一个阻塞的方法，如果运行cmd命令时产生内容非常多，函数就容易阻塞。另一点，Popen方法也不会打印出cmd的执行信息。

以下罗列常用到的参数：

> args：这个参数必须是字符串或者是一个由字符串成员的列表。其中如果是一个字符串列表的话，那第一个成员为要运行的程序的路径以及程序名称；从第二个成员开始到最后一个成员为运行这个程序需要输入的参数。这与popen中是一样的。
> bufsize：一般使用比较少，略过。
> executable：指定要运行的程序，这个一般很少用到，因为要指定运行的程序在args中已经指定了。stdin，stdout ，stderr：分别代表程序的标准输入、标准输出、标准错误处理。可以选择的值有 PIPE，已经存在的打开的文件对象和 NONE。若stdout是文件对象的话，要确保文件对象是处于打开状态。
> shell：shell参数根据要执行的命令情况来定，如果将参数shell设为True，executable将指定程序使用的shell。在windows平台下，默认的shell由COMSPEC环境变量来指定。
程序代码如下：程序片段1：使用文件对象输出执行结果
```python
cmd = "adb shell ls /sdcard/ | findstr aa.png"
fhandle = open(r"e:\aa.txt", "w")
pipe = subprocess.Popen(cmd, shell=True, stdout=fhandle).stdout
fhandle.close()
```
cmd命令执行结果保存在aa.txt文件中
程序片段2：使用管道输出执行结果
```python
pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE).stdout
print pipe.read()
```
控制台打印输出执行结果

# f-string
Python 3.6 提供了一种新的字符串格式化方法：f-strings，不仅比其他格式化方式更易读，更简洁，更不容易出错，而且它们也更快！
看完本文后，你将了解如何以及为何要使用 f-strings。
首先，我们先了解下现有的字符串格式化方法。
在 Python 3.6 之前，字符串格式化方法主要有两种：%格式化 和 str.format()。下面我们简单看下它们的使用方法，以及局限。

## %-格式化
% 格式化方法从 Python 刚开始时就存在了，堪称「一届元老」，但是 Python 官方文档中并不推荐这种格式化方式：

这里描述的格式化操作容易表现出各种问题，导致许多常见错误（例如无法正确显示元组和字典）。
使用较新的格式化字符串文字或 str.format() 可以有助于避免这些错误。这些替代方案还提供了更强大，灵活和可扩展的格式化文本方法。
### 如何使用 %格式化
一般使用方式，要插入多个变量的话，必须使用元组：
```python
>>> name = "hoxis"
>>> age = 18
>>> "hello, %s. you are %s ?" %(name, age)
'hello, hoxis. you are 18 ?'
```
### %格式化的缺陷
上面的代码示例看起来还能读，但是，一旦开始使用多个参数和更长的字符串，你的代码将很快变得不那么容易阅读：
```python
>>> name = "hoxis"
>>> age = 18
>>> country = "China"
>>> hair = "black"
>>> "hello, %s. you are %s ?. Your country is %s, and your hair is %s" %(name, age, country,hair)
'hello, hoxis. you are 18 ?. Your country is China, and your hair is black'
```
可以看出，这种格式化并不是很好，因为它很冗长并且容易导致错误，比如没有正确显示元组或字典。
不过还好我们还有 str.format()。

## str.format()
Python 2.6 中引入了 str.format() 格式化方法：https://docs.python.org/3/library/stdtypes.html#str.format。

### str.format() 的使用
str.format() 是对 %格式化 的改进，它使用普通函数调用语法，并且可以通过 __format__() 方法为对象进行扩展。
使用 str.format() 时，替换字段用大括号进行标记：
```python
>>> "hello, {}. you are {}?".format(name,age)
'hello, hoxis. you are 18?'
```
并且可以通过索引来以其他顺序引用变量：
```python
>>> "hello, {1}. you are {0}?".format(age,name)
'hello, hoxis. you are 18?'
```
或者可以这样：
```python
>>> "hello, {name}. you are {age1}?".format(age1=age,name=name)
'hello, hoxis. you are 18?'
```
从字典中读取数据时还可以使用 **：
```python
>>> person = {"name":"hoxis","age":18}
>>> "hello, {name}. you are {age}?".format(**person)
'hello, hoxis. you are 18?'
```
确实，str.format() 比 %格式化高级了一些，但是它还是有自己的缺陷。

### str.format() 的缺陷
在处理多个参数和更长的字符串时仍然可能非常冗长，麻烦！看看这个：
```python
>>> "hello, {}. you are {} ?. Your country is {}, and your hair is {}".format(name, age, country,hair)
'hello, hoxis. you are 18 ?. Your country is China, and your hair is black'
3 f-Strings
```
还好，现在我们有了 f-Strings，它可以使得字符串格式化更加容易。
f-strings 是指以 f 或 F 开头的字符串，其中以 {} 包含的表达式会进行值替换。

下面从多个方面看下 f-strings 的使用方法，看完后，我相信你会对「人生苦短，我用 Python」有更深地赞同~

## f-Strings 使用方法
```python
>>> name = 'hoxis'
>>> age = 18
>>> f"hi, {name}, are you {age}"
'hi, hoxis, are you 18'
>>> F"hi, {name}, are you {age}"
'hi, hoxis, are you 18'
```
是不是很简洁？！还有更牛叉的！
因为 f-strings 是在运行时计算的，那么这就意味着你可以在其中放置任意合法的 Python 表达式，比如：

运算表达式
```python
>>> f"{ 2 * 3 + 1}"
'7'
```
调用函数
还可以调用函数：
```python
>>> def test(input):
...     return input.lower()
...
>>> name = "Hoxis"
>>> f"{test(name)} is handsome."
'hoxis is handsome.'
```
也可以直接调用内置函数：
```python
>>> f"{name.lower()} is handsome."
'hoxis is handsome.'
```
在类中使用
```python
>>> class Person:
...     def __init__(self,name,age):
...         self.name = name
...         self.age = age
...     def __str__(self):
...         return f"{self.name} is {self.age}"
...     def __repr__(self):
...         return f"{self.name} is {self.age}. HAHA!"
...
>>> hoxis = Person("hoxis",18)
>>> f"{hoxis}"
'hoxis is 18'
>>> f"{hoxis!r}"
'hoxis is 18. HAHA!'
>>> print(hoxis)
hoxis is 18
>>> hoxis
hoxis is 18. HAHA!
```
多行 f-string
```python
>>> name = 'hoxis'
>>> age = 18
>>> status = 'Python'
>>> message = {
...     f'hi {name}.'
...     f'you are {age}.'
...     f'you are learning {status}.'
... }
>>>
>>> message
{'hi hoxis.you are 18.you are learning Python.'}
```
这里需要注意，每行都要加上 f 前缀，否则格式化会不起作用：
```python
>>> message = {
...     f'hi {name}.'
...     'you are learning {status}.'
... }
>>> message
{'hi hoxis.you are learning {status}.'}
```
## 速度对比
其实，f-string 里的 f 也许可以代表 fast，它比 %格式化方法和 str.format() 都要快：
```python
from timeit import timeit

print(timeit("""name = "hoxis"
age = 18
'%s is %s.' % (name, age)""", number = 10000))

print(timeit("""name = "hoxis"
age = 18
'{} is {}.'.format(name, age)""", number = 10000))

print(timeit("""name = "hoxis"
age = 18
f'{name} is {age}.'""", number = 10000))
```
运行结果：
```text
$ python3.6 fstring.py
0.002238000015495345
0.004068000009283423
0.0015349999885074794
```
很明显，f-string 是最快的，并且语法是最简洁的，是不是迫不及待地要试试了？

## 注意事项
### 引号的处理
可以在字符串中使用各种引号，只要保证和外部的引号不重复即可。
以下使用方式都是没问题的：
```python
>>> f"{'hoxis'}"
'hoxis'
>>> f'{"hoxis"}'
'hoxis'
>>> f"""hoxis"""
'hoxis'
>>> f'''hoxis'''
'hoxis'
```
那如果字符串内部的引号和外部的引号相同时呢？那就需要 \ 进行转义：
```python
>>> f"You are very \"handsome\""
'You are very "handsome"'
```
5.2 括号的处理
若字符串中包含括号 {}，那么你就需要用双括号包裹它：
```python
>>> f"{{74}}"
'{74}'

>>> f"{{{74}}}"
'{74}'
```
可以看出，使用三个括号包裹效果一样。

当然，你可以继续增加括号数目，看下有什么其他效果：
```python
>>> f"{{{{74}}}}"
'{{74}}'
>>> f"{{{{{74}}}}}"
'{{74}}'
>>> f"{{{{{{74}}}}}}"
'{{{74}}}'
```
额，那么多括号，看着有点晕了...

## 反斜杠
上面说了，可以用反斜杠进行转义字符，但是不能在 f-string 表达式中使用：
```python
>>> f"You are very \"handsome\""
'You are very "handsome"'
>>> f"{You are very \"handsome\"}"
  File "<stdin>", line 1
SyntaxError: f-string expression part cannot include a backslash
```
你可以先在变量里处理好待转义的字符，然后在表达式中引用变量：
```python
>>> name = '"handsome"'
>>> f'{name}'
'"handsome"'
```
##  注释符号
不能在表达式中出现 #，否则会报出异常；
```python
>>> f"Hoxis is handsome # really"
'Hoxis is handsome # really'
>>> f"Hoxis is handsome {#really}"
  File "<stdin>", line 1
SyntaxError: f-string expression part cannot include '#'
```

# range
它的语法：range(start, stop [,step]) ；start 指的是计数起始值，默认是 0；stop 指的是计数结束值，但不包括 stop ；step 是步长，默认为 1，不可以为 0 。range() 方法生成一段左闭右开的整数范围。
```python
>>> a = range(5) # 即 range(0,5)
range(0, 5)
>>> len(a)
5
>>> for x in a:
>>> print(x,end=" ")
0 1 2 3 4
```

对于 range() 函数，有几个注意点：
（1）它表示的是左闭右开区间；
（2）它接收的参数必须是整数，可以是负数，但不能是浮点数等其它类型；
（3）它是不可变的序列类型，可以进行判断元素、查找元素、切片等操作，但不能修改元素；
（4）它是可迭代对象，却不是迭代器。

```python
# （1）左闭右开
>>> for i in range(3, 6):
>>> print(i,end=" ")
3 4 5

# （2）参数类型
>>> for i in range(-8, -2, 2):
>>> print(i,end=" ")
-8 -6 -4
>>> range(2.2)
----------------------------
TypeError Traceback (most recent call last)
...
TypeError: 'float' object cannot be interpreted as an integer

# （3）序列操作
>>> b = range(1,10)
1
>>> b[:-3]
range(1, 7)
>>> b[0] = 2
TypeError Traceback (most recent call last)
...
TypeError: 'range' object does not support item assignment

# （4）不是迭代器
>>> hasattr(range(3),'__iter__')
True
>>> hasattr(range(3),'__next__')
False
>>> hasattr(iter(range(3)),'__next__')
True
```

# python中__file__
在Python项目中，经常会获取文件的路径。经常会见到如下的语句：
```python
import os
os.path.dirname(__file__)
```
那么这里的__file__是什么用呢？
其实就是当前脚本运行的所在路径。
但是也会分不同的情况。
如果执行命令时使用绝对路径，__file__就是脚本的绝对路径。
如果使用的是相对路径，__file__就是脚本的相对路径。
注：
如果在交互式环境中，则会爆出异常。因为此时__file__并未生成。
```shell
In [2]: import os

In [3]: print os.path.dirname(__file__)
---------------------------------------------------------------------------
NameError                                 Traceback (most recent call last)
<ipython-input-3-b4616cfaa58d> in <module>()
----> 1 print os.path.dirname(__file__)

NameError: name '__file__' is not defined
```

# Python创建二维数组(关于list的一个小坑)
## 遇到的问题
今天写Python代码的时候遇到了一个大坑，差点就耽误我交作业了。。。
问题是这样的，我需要创建一个二维数组，如下：
```python
m = n = 3
test = [[0] * m] * n
print("test =", test)
```
输出结果如下：
```text
test = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
```
是不是看起来没有一点问题？
一开始我也是这么觉得的，以为是我其他地方用错了什么函数，结果这么一试：
```python
m = n = 3
test = [[0] * m] * n
print("test =", test)

test[0][0] = 233
print("test =", test)
```
输出结果如下：
```text
test = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
test = [[233, 0, 0], [233, 0, 0], [233, 0, 0]]
```
是不是很惊讶？！
这个问题真的是折磨我一个中午，去网上一搜，官方文档中给出的说明是这样的：
``` 
Note also that the copies are shallow; nested structures are not copied. This often haunts new Python programmers; consider:

>>> lists = [[]] * 3
>>> lists
[[], [], []]
>>> lists[0].append(3)
>>> lists
[[3], [3], [3]]
What has happened is that [[]] is a one-element list containing an empty list, so all three elements of [[]] * 3 are (pointers to) this single empty list. Modifying any of the elements of lists modifies this single list. You can create a list of different lists this way:

>>>
>>> lists = [[] for i in range(3)]
>>> lists[0].append(3)
>>> lists[1].append(5)
>>> lists[2].append(7)
>>> lists
[[3], [5], [7]]
```
也就是说matrix = [array] * 3操作中，只是创建3个指向array的引用，所以一旦array改变，matrix中3个list也会随之改变。

## 创建二维数组的办法
2.1 直接创建法
```python
test = [0, 0, 0], [0, 0, 0], [0, 0, 0]]
```
简单粗暴，不过太麻烦，一般不用。

2.2 [列表生成法](#a)
```python
test = [[0 for i in range(m)] for j in range(n)]
```
学会使用列表生成式，终生受益。

2.3 使用模块numpy创建
```python
import numpy as np
test = np.zeros((m, n), dtype=np.int)
```

## 列表生成法
列表生成式即List Comprehensions，是Python内置的非常简单却强大的可以用来创建list的生成式。
举个例子，要生成list [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]可以用list(range(1, 11))：
```python
>>> list(range(1, 11))
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```
但如果要生成[1x1, 2x2, 3x3, ..., 10x10]怎么做？方法一是循环：
```python
>>> L = []
>>> for x in range(1, 11):
...    L.append(x * x)
...
>>> L
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```
但是循环太繁琐，而列表生成式则可以用一行语句代替循环生成上面的list：
```python
>>> [x * x for x in range(1, 11)]
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```
写列表生成式时，把要生成的元素x * x放到前面，后面跟for循环，就可以把list创建出来，十分有用，多写几次，很快就可以熟悉这种语法。

for循环后面还可以加上if判断，这样我们就可以筛选出仅偶数的平方：
```python
>>> [x * x for x in range(1, 11) if x % 2 == 0]
[4, 16, 36, 64, 100]
```
还可以使用两层循环，可以生成全排列：
```python
>>> [m + n for m in 'ABC' for n in 'XYZ']
['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']
```
三层和三层以上的循环就很少用到了。
运用列表生成式，可以写出非常简洁的代码。例如，列出当前目录下的所有文件和目录名，可以通过一行代码实现：
```python
>>> import os # 导入os模块，模块的概念后面讲到
>>> [d for d in os.listdir('.')] # os.listdir可以列出文件和目录
['.emacs.d', '.ssh', '.Trash', 'Adlm', 'Applications', 'Desktop', 'Documents', 'Downloads', 'Library', 'Movies', 'Music', 'Pictures', 'Public', 'VirtualBox VMs', 'Workspace', 'XCode']
```
for循环其实可以同时使用两个甚至多个变量，比如dict的items()可以同时迭代key和value：
```python
>>> d = {'x': 'A', 'y': 'B', 'z': 'C' }
>>> for k, v in d.items():
...     print(k, '=', v)
...
y = B
x = A
z = C
```
因此，列表生成式也可以使用两个变量来生成list：
```python
>>> d = {'x': 'A', 'y': 'B', 'z': 'C' }
>>> [k + '=' + v for k, v in d.items()]
['y=B', 'x=A', 'z=C']
```
最后把一个list中所有的字符串变成小写：
```python
>>> L = ['Hello', 'World', 'IBM', 'Apple']
>>> [s.lower() for s in L]
['hello', 'world', 'ibm', 'apple']
```

## list和numpy.array的区别：
关于python中的二维数组，主要有list和numpy.array两种。
好吧，其实还有matrices，但它必须是2维的，而numpy arrays (ndarrays) 可以是多维的。
我们可以通过以下的代码看出二者的区别
```shell
>>import numpy as np
>>a=[[1,2,3],[4,5,6],[7,8,9]]
>>a
[[1,2,3],[4,5,6],[7,8,9]]
>>type(a)
<type 'list'>
>>b=np.array(a)"""List to array conversion"""
>>type(b)
<type 'numpy.array'>
>>b
array=([[1,2,3],
        [4,5,6],
        [7,8,9]])
```
list对应的索引输出情况：
```shell
>>a[1][1]
5
>>a[1]
[4,5,6]
>>a[1][:]
[4,5,6]
>>a[1,1]"""相当于a[1,1]被认为是a[(1,1)],不支持元组索引"""
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: list indices must be integers, not tuple
>>a[:,1]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: list indices must be integers, not tuple
```
numpy.array对应的索引输出情况：
```shell
>>b[1][1]
5
>>b[1]
array([4,5,6])
>>b[1][:]
array([4,5,6])
>>b[1,1]
5
>>b[:,1]
array([2,5,8])
```
由上面的简单对比可以看出， numpy.array支持比list更多的索引方式，这也是我们最经常遇到的关于两者的区别。此外从[Numpy-快速处理数据]上可以了解到“由于list的元素可以是任何对象，因此列表中所保存的是对象的指针。这样为了保存一个简单的[1,2,3]，有3个指针和3个整数对象。”

# python中泛型的使用
```python
from typing import TypeVar, Generic

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        # Create an empty list with items of type T
        self.items: List[T] = []

    def push(self, item: T) -> None:
        self.items.append(item)

    def pop(self) -> T:
        return self.items.pop()

    def empty(self) -> bool:
        return not self.items
```
```python
# Construct an empty Stack[int] instance
stack = Stack[int]()
stack.push(2)
stack.pop()
stack.push('x') # Type error
```

# python中yield用法
yield在函数中的功能类似于return，不同的是yield每次返回结果之后函数并没有退出，而是每次遇到yield关键字后返回相应结果，并保留函数当前的运行状态，等待下一次的调用。如果一个函数需要多次循环执行一个动作，并且每次执行的结果都是需要的，这种场景很适合使用yield实现。
包含yield的函数成为一个生成器，生成器同时也是一个迭代器，支持通过next方法获取下一个值。

yield基本使用：
```python
def func():
    for i in range(0,3):
        yield i
 
f = func()
f.next()
f.next()
```

对于生成器，当调用函数next时，将获取生成器yield后边表达式的值；

当执行完最后一次循环后，结束yield语句，生成器会抛出StopIteration异常；

除了next函数，生成器还支持send函数。该函数可以向生成器传递参数。

```python
def func(n):
    for i in range(0,n):
        val = yield i        
        print val
 
f = func(10)
f.next()
#f.send(None)
f.send(2)
f.send(10)
print f.next()
```

# with用法及原理
with 语句适用于对资源进行访问的场合，确保不管使用过程中是否发生异常都会执行必要的“清理”操作，释放资源，比如文件使用后自动关闭／线程中锁的自动获取和释放等。

## 问题引出
如下代码：
```python
file = open("１.txt")
data = file.read()
file.close()
```
上面代码存在２个问题：
（１）文件读取发生异常，但没有进行任何处理；
（２）可能忘记关闭文件句柄；

改进
```python
try:
    f = open('xxx')
except:
    print('fail to open')
    exit(-1)
try:
    do something
except:
    do something
finally:
    f.close()
```
虽然这段代码运行良好，但比较冗长。
而使用with的话，能够减少冗长，还能自动处理上下文环境产生的异常。如下面代码：
```python
with open("１.txt") as file:
    data = file.read()
```
## with 工作原理
（１）紧跟with后面的语句被求值后，返回对象的“–enter–()”方法被调用，这个方法的返回值将被赋值给as后面的变量；
（２）当with后面的代码块全部被执行完之后，将调用前面返回对象的“–exit–()”方法。
with工作原理代码示例：
```python
class Sample:
    def __enter__(self):
        print "in __enter__"
        return "Foo"
    def __exit__(self, exc_type, exc_val, exc_tb):
        print "in __exit__"
def get_sample():
    return Sample()
with get_sample() as sample:
    print "Sample: ", sample
```
代码的运行结果如下：
```text
in __enter__
Sample:  Foo
in __exit__
```
可以看到，整个运行过程如下：
（１）enter()方法被执行；
（２）enter()方法的返回值，在这个例子中是”Foo”，赋值给变量sample；
（３）执行代码块，打印sample变量的值为”Foo”；
（４）exit()方法被调用；

【注：】exit()方法中有３个参数， exc_type, exc_val, exc_tb，这些参数在异常处理中相当有用。
exc_type：　错误的类型
exc_val：　错误类型对应的值
exc_tb：　代码中错误发生的位置
示例代码：
```python
class Sample():
    def __enter__(self):
        print('in enter')
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print "type: ", exc_type
        print "val: ", exc_val
        print "tb: ", exc_tb
    def do_something(self):
        bar = 1 / 0
        return bar + 10
with Sample() as sample:
    sample.do_something()
```
程序输出结果：
```text
in enter
Traceback (most recent call last):
type:  <type 'exceptions.ZeroDivisionError'>
val:  integer division or modulo by zero
  File "/home/user/cltdevelop/Code/TF_Practice_2017_06_06/with_test.py", line 36, in <module>
tb:  <traceback object at 0x7f9e13fc6050>
    sample.do_something()
  File "/home/user/cltdevelop/Code/TF_Practice_2017_06_06/with_test.py", line 32, in do_something
    bar = 1 / 0
ZeroDivisionError: integer division or modulo by zero

Process finished with exit code 1
```
## 总结
实际上，在with后面的代码块抛出异常时，exit()方法被执行。开发库时，清理资源，关闭文件等操作，都可以放在exit()方法中。
总之，with-as表达式极大的简化了每次写finally的工作，这对代码的优雅性是有极大帮助的。
如果有多项，可以这样写：
```python
With open('1.txt') as f1, open('2.txt') as  f2:
    do something
```

# enumerate()函数的用法
enumerate是翻译过来是枚举的意思，看下它的方法原型：
enumerate(sequence, start=0)，返回一个枚举对象。sequence必须是序列或迭代器iterator，或者支持迭代的对象。enumerate()返回对象的每个元素都是一个元组，每个元组包括两个值，一个是计数，一个是sequence的值，计数是从start开始的，start默认为0。
```python
a=["q","w","e","r"]
c=enumerate(a)
for i in c:
    print(i)
```
输出：
(0, 'q')
(1, 'w')
(2, 'e')
(3, 'r')

```python
a=["q","w","e","r"]
#这里加了个参数2，代表的是start的值
c=enumerate(a,2)
for i in c:
    print(i)
```
输出：
(2, 'q')
(3, 'w')
(4, 'e')
(5, 'r')

enumerate()函数还有一个重要的用法。
```python
a=["q","w","e","r"]
#创建一个空字典
b=dict()
#这里i表示的是索引，item表示的是它的值
for i,item in enumerate(a):
    b[i]=item
print(b)
```
输出：
{0: 'q', 1: 'w', 2: 'e', 3: 'r'}

# pyton调用父类方法
## python 2.x
老式类的方法
优点：简洁。
缺点：不能很好的处理菱形继承。因为你可能会调用两次共享基类的构造函数。
```python
class Human(object):
    def __init__(self, age):
        self.age = age
        print "Human age:%s:" % age


class Student(Human):
    def __init__(self, name, age):
        print "student"
        Human.__init__(self, age)
```
新式类方法
```python
class Human(object):
    def __init__(self, age):
        self.age = age
        print "Human age:%s:" % age


class Student(Human):
    def __init__(self, name, age):
        print "student"
        super(Student, self).__init__(age)
```
## python 3.x
python 3.5之后，super() 等同于 super(<containing classname>, self),不再需要传入这两个参数
```python
class Human(object):
    def __init__(self, age):
        self.age = age
        print("Human age:%s:" % age)


class Student(Human):
    def __init__(self, name, age):
        print("student")
        super().__init__(age)
```

# NameError name 'reload' is not defined 问题
Python 解决 ：NameError: name 'reload' is not defined 问题
解决：NameError: name 'reload' is not defined 问题
## 对于 Python 2.X：
```python
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
```
## 对于 <= Python 3.3：
```python
import imp
imp.reload(sys)
```
注意：
1. Python 3 与 Python 2 有很大的区别，其中Python 3 系统默认使用的就是utf-8编码。
2. 所以，对于使用的是Python 3 的情况，就不需要sys.setdefaultencoding("utf-8")这段代码。
3. 最重要的是，Python 3 的 sys 库里面已经没有 setdefaultencoding() 函数了。

## 对于 >= Python 3.4：
```python
import importlib
importlib.reload(sys)
```

# zip()函数
zip() 函数用于将可迭代的对象作为参数，将对象中对应的元素打包成一个个元组，然后返回由这些元组组成的列表。
如果各个迭代器的元素个数不一致，则返回列表长度与最短的对象相同，利用 * 号操作符，可以将元组解压为列表。
zip 方法在 Python 2 和 Python 3 中的不同：在 Python 3.x 中为了减少内存，zip() 返回的是一个对象。如需展示列表，需手动 list() 转换。
如果需要了解 Pyhton3 的应用，可以参考 Python3 zip()。

## 语法
zip 语法：

zip([iterable, ...])
参数说明：

iterabl -- 一个或多个迭代器;
返回值
返回元组列表。

## 实例
以下实例展示了 zip 的使用方法：
```python
>>>a = [1,2,3]
>>> b = [4,5,6]
>>> c = [4,5,6,7,8]
>>> zipped = zip(a,b)     # 打包为元组的列表
[(1, 4), (2, 5), (3, 6)]
>>> zip(a,c)              # 元素个数与最短的列表一致
[(1, 4), (2, 5), (3, 6)]
>>> zip(*zipped)          # 与 zip 相反，*zipped 可理解为解压，返回二维矩阵式
[(1, 2, 3), (4, 5, 6)]
```

# 多线程
Python3 线程中常用的两个模块为：
- `_thread`
- threading(推荐使用)
thread 模块已被废弃。用户可以使用 threading 模块代替。所以，在 Python3 中不能再使用"thread" 模块。为了兼容性，Python3 将 thread 重命名为 `"_thread"`。

Python中使用线程有两种方式：函数或者用类来包装线程对象。
函数式：调用 `_thread` 模块中的`start_new_thread()`函数来产生新线程。语法如下:
```py
_thread.start_new_thread (function, args[, kwargs] )
```
参数说明:
- function - 线程函数。
- args - 传递给线程函数的参数,他必须是个tuple类型。
- kwargs - 可选参数。

实例
```py
#!/usr/bin/python3

import _thread
import time

# 为线程定义一个函数
def print_time( threadName, delay):
   count = 0
   while count < 5:
      time.sleep(delay)
      count += 1
      print ("%s: %s" % ( threadName, time.ctime(time.time()) ))

# 创建两个线程
try:
   _thread.start_new_thread( print_time, ("Thread-1", 2, ) )
   _thread.start_new_thread( print_time, ("Thread-2", 4, ) )
except:
   print ("Error: 无法启动线程")

while 1:
   pass
```
执行以上程序输出结果如下：
```
Thread-1: Wed Apr  6 11:36:31 2016
Thread-1: Wed Apr  6 11:36:33 2016
Thread-2: Wed Apr  6 11:36:33 2016
Thread-1: Wed Apr  6 11:36:35 2016
Thread-1: Wed Apr  6 11:36:37 2016
Thread-2: Wed Apr  6 11:36:37 2016
Thread-1: Wed Apr  6 11:36:39 2016
Thread-2: Wed Apr  6 11:36:41 2016
Thread-2: Wed Apr  6 11:36:45 2016
Thread-2: Wed Apr  6 11:36:49 2016
```
执行以上程后可以按下 ctrl-c 退出。


# 线程模块
Python3 通过两个标准库`_thread`和`threading`提供对线程的支持。

`_thread`提供了低级别的、原始的线程以及一个简单的锁，它相比于 threading 模块的功能还是比较有限的。

threading 模块除了包含`_thread`模块中的所有方法外，还提供的其他方法：
- threading.currentThread(): 返回当前的线程变量。
- threading.enumerate(): 返回一个包含正在运行的线程的list。正在运行指线程启动后、结束前，不包括启动前和终止后的线程。
- threading.activeCount(): 返回正在运行的线程数量，与len(threading.enumerate())有相同的结果。

除了使用方法外，线程模块同样提供了Thread类来处理线程，Thread类提供了以下方法:
- run(): 用以表示线程活动的方法。
- start():启动线程活动。
- `join([time])`: 等待至线程中止。这阻塞调用线程直至线程的join() 方法被调用中止-正常退出或者抛出未处理的异常-或者是可选的超时发生。
- isAlive(): 返回线程是否活动的。
- getName(): 返回线程名。
- setName(): 设置线程名。 

## 使用 threading 模块创建线程
我们可以通过直接从 threading.Thread 继承创建一个新的子类，并实例化后调用 start() 方法启动新线程，即它调用了线程的 run() 方法：

实例
```py
#!/usr/bin/python3

import threading
import time

exitFlag = 0

class myThread (threading.Thread):
    def __init__(self, threadID, name, counter):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
    def run(self):
        print ("开始线程：" + self.name)
        print_time(self.name, self.counter, 5)
        print ("退出线程：" + self.name)

def print_time(threadName, delay, counter):
    while counter:
        if exitFlag:
            threadName.exit()
        time.sleep(delay)
        print ("%s: %s" % (threadName, time.ctime(time.time())))
        counter -= 1

# 创建新线程
thread1 = myThread(1, "Thread-1", 1)
thread2 = myThread(2, "Thread-2", 2)

# 开启新线程
thread1.start()
thread2.start()
thread1.join()
thread2.join()
print ("退出主线程")
```

以上程序执行结果如下；
```py
开始线程：Thread-1
开始线程：Thread-2
Thread-1: Wed Apr  6 11:46:46 2016
Thread-1: Wed Apr  6 11:46:47 2016
Thread-2: Wed Apr  6 11:46:47 2016
Thread-1: Wed Apr  6 11:46:48 2016
Thread-1: Wed Apr  6 11:46:49 2016
Thread-2: Wed Apr  6 11:46:49 2016
Thread-1: Wed Apr  6 11:46:50 2016
退出线程：Thread-1
Thread-2: Wed Apr  6 11:46:51 2016
Thread-2: Wed Apr  6 11:46:53 2016
Thread-2: Wed Apr  6 11:46:55 2016
退出线程：Thread-2
退出主线程
```

# 线程同步
如果多个线程共同对某个数据修改，则可能出现不可预料的结果，为了保证数据的正确性，需要对多个线程进行同步。

使用 Thread 对象的 Lock 和 Rlock 可以实现简单的线程同步，这两个对象都有 acquire 方法和 release 方法，对于那些需要每次只允许一个线程操作的数据，可以将其操作放到 acquire 和 release 方法之间。如下：

多线程的优势在于可以同时运行多个任务（至少感觉起来是这样）。但是当线程需要共享数据时，可能存在数据不同步的问题。

考虑这样一种情况：一个列表里所有元素都是0，线程"set"从后向前把所有元素改成1，而线程"print"负责从前往后读取列表并打印。

那么，可能线程"set"开始改的时候，线程"print"便来打印列表了，输出就成了一半0一半1，这就是数据的不同步。为了避免这种情况，引入了锁的概念。

锁有两种状态——锁定和未锁定。每当一个线程比如"set"要访问共享数据时，必须先获得锁定；如果已经有别的线程比如"print"获得锁定了，那么就让线程"set"暂停，也就是同步阻塞；等到线程"print"访问完毕，释放锁以后，再让线程"set"继续。

经过这样的处理，打印列表时要么全部输出0，要么全部输出1，不会再出现一半0一半1的尴尬场面。
```py
#!/usr/bin/python3

import threading
import time

class myThread (threading.Thread):
    def __init__(self, threadID, name, counter):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
    def run(self):
        print ("开启线程： " + self.name)
        # 获取锁，用于线程同步
        threadLock.acquire()
        print_time(self.name, self.counter, 3)
        # 释放锁，开启下一个线程
        threadLock.release()

def print_time(threadName, delay, counter):
    while counter:
        time.sleep(delay)
        print ("%s: %s" % (threadName, time.ctime(time.time())))
        counter -= 1

threadLock = threading.Lock()
threads = []

# 创建新线程
thread1 = myThread(1, "Thread-1", 1)
thread2 = myThread(2, "Thread-2", 2)

# 开启新线程
thread1.start()
thread2.start()

# 添加线程到线程列表
threads.append(thread1)
threads.append(thread2)

# 等待所有线程完成
for t in threads:
    t.join()
print ("退出主线程")
```
执行以上程序，输出结果为：
```py
开启线程： Thread-1
开启线程： Thread-2
Thread-1: Wed Apr  6 11:52:57 2016
Thread-1: Wed Apr  6 11:52:58 2016
Thread-1: Wed Apr  6 11:52:59 2016
Thread-2: Wed Apr  6 11:53:01 2016
Thread-2: Wed Apr  6 11:53:03 2016
Thread-2: Wed Apr  6 11:53:05 2016
退出主线程
```
