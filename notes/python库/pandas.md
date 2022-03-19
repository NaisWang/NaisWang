# 为什么要学习pandas
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022202922.png"/>

# pandas的常用数据类型
1. Series 一维， 带标签数组 
2. DataFrame 二维， Series容器
# Series
## Series创建
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022203915.png"/>

<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022204025.png"/>

对于Series，可以使用list（）来将其转变成list，  而对于DataFrame， 使用list()得到的是列名形成的列表

## Series切片和索引
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022204410.png"/>

## Series的索引和值
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022204809.png"/>

<font color='red'>注： Series 类似于 一位数组， 一行多列， 但是没有columns方法</font>
列如：
```python
print(t)
# Out
# 0    yes
# 1    yes
# 2     no
# 3     no
# 4     no

print(type(t))
# Out
# <class 'pandas.core.series.Series'>

print(t.shape)
# Out
# (5,)

```
## value_counts()
pandas 的value_counts()函数可以对Series里面的每个值进行计数并且排序。
返回类型为Series
现有一个DataFrame
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025200520.png">

如果我们想知道，每个区域出现了多少次，可以简单如下：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025200540.png">

每个区域都被计数，并且默认从最高到最低做降序排列。

如果想用升序排列，可以加参数ascending=True：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025200557.png">

如果想得出的计数占比，可以加参数normalize=True：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025200614.png">

空值是默认剔除掉的。value_counts()返回的结果是一个Series数组，可以跟别的数组进行运算。

value_count()跟透视表里（pandas或者excel）的计数很相似，都是返回一组唯一值，并进行计数。这样能快速找出重复出现的值。



# 读取外部文件
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022205552.png"/>
Pandas的读取数据和文件的函数
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025123314.png"/>

## 常用函数
read_csv() 读取以‘，’分割的文件到DataFrame
read_table()读取以‘/t’分割的文件到DataFrame
实质上是通用的，在实际使用中可以通过对sep参数的控制来对任何文本文件读取。
1.参数说明
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025123438.png"/>

2.实例：
文本内容为：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025123517.png"/> 

1）该文本中的分割符既有空格又有制表符（‘/t’），sep参数用‘/s+’，可以匹配任何空格。
代码如下：
```pyton
import pandas as pd
df_txt = pd.read_csv('BSEP_NMC_ATME_SOB_EAQI_ACHN_LNO_P9_20160101060000000.TXT',sep='\s+')
print df_txt
```
结果：
```
                                            diamond
98286 31 102 34  1 20  34   0.217 6  41 21       19
98249 31 102 23  1 12  23   0.496 17 29 18        3
98204 31 102 43  1 16  43   0.162 29 19 14        2
98138 41 80  119 3 90  9999 3.864 73 7  12       21
98105 41 80  206 5 156 160  4.388 81 40 40       26
98067 38 105 36  1 25  9999 0.822 14 40 40       31
98025 38 105 26  1 18  26   0.879 16 75 75       27
99980 38 105 24  1 13  17   0.199 4  76 77       22
98502 47 88  29  1 4   10   2.637 3  90 88        3
```
（2）为行和列添加索引
用参数names添加列索引，用index_col添加行索引
```python
import pandas as pd
df_txt = pd.read_csv('BSEP_NMC_ATME_SOB_EAQI_ACHN_LNO_P9_20160101060000000.TXT',sep='\s+',
                     names=['1','2','3','4','5','6','7','8','9','10','11'],index_col=0)
print df_txt
```
结果如下：
```
            2      3      4    5      6       7      8     9    10    11
1                                                                       
diamond   NaN    NaN    NaN  NaN    NaN     NaN    NaN   NaN   NaN   NaN
98286    31.0  102.0   34.0  1.0   20.0    34.0  0.217   6.0  41.0  21.0
98249    31.0  102.0   23.0  1.0   12.0    23.0  0.496  17.0  29.0  18.0
98204    31.0  102.0   43.0  1.0   16.0    43.0  0.162  29.0  19.0  14.0
98138    41.0   80.0  119.0  3.0   90.0  9999.0  3.864  73.0   7.0  12.0
98105    41.0   80.0  206.0  5.0  156.0   160.0  4.388  81.0  40.0  40.0
98067    38.0  105.0   36.0  1.0   25.0  9999.0  0.822  14.0  40.0  40.0
98025    38.0  105.0   26.0  1.0   18.0    26.0  0.879  16.0  75.0  75.0
99980    38.0  105.0   24.0  1.0   13.0    17.0  0.199   4.0  76.0  77.0
98502    47.0   88.0   29.0  1.0    4.0    10.0  2.637   3.0  90.0  88.0
```
（3）我们不想要diamond那一行，可以用header来控制
代码如下：
```python
import pandas as pd
df_txt = pd.read_csv('BSEP_NMC_ATME_SOB_EAQI_ACHN_LNO_P9_20160101060000000.TXT',sep='\s+',
                     names=['1','2','3','4','5','6','7','8','9','10','11'],index_col=0,header=1)
print df_txt
```
结果如下：
```
        1    2    3  4    5     6      7   8   9  10  11
98249  31  102   23  1   12    23  0.496  17  29  18   3
98204  31  102   43  1   16    43  0.162  29  19  14   2
98138  41   80  119  3   90  9999  3.864  73   7  12  21
98105  41   80  206  5  156   160  4.388  81  40  40  26
98067  38  105   36  1   25  9999  0.822  14  40  40  31
98025  38  105   26  1   18    26  0.879  16  75  75  27
99980  38  105   24  1   13    17  0.199   4  76  77  22
98502  47   88   29  1    4    10  2.637   3  90  88   3
```
# DataFrame
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023083745.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023082113.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023083858.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023085344.png"/>

```python
# sort function
df.sort_values(by="Column_name", ascending=False)
```

## pandas之取行或者列
If the value in the square bracket conforms to the slice syntax, then it means the rows are picked and manipulated. Note, the value must conform to the slice syntax, otherwise an error will be reported.
If the value in the square bracket is string type and don't conform to the slice syntax, then it mean the columns are picked and manipulated. If you want to pick incontinuous columns, you must use the list containing these columns' names that you want to pick.
For example:
```python
print(t1)
#Out
#    W  X   Y   Z
# a  0  1   2   3
# b  4  5   6   7
# c  8  9  10  11

print(t1[1])
#Out
# KeyError: 1
# Because it don't conform to the slice syntax.

print(t1[1:3])
#Out
#   W  X   Y   Z
# b  4  5   6   7
# c  8  9  10  11

print(t1["b":"c"])
#Out
#    W  X   Y   Z
# b  4  5   6   7
# c  8  9  10  11

print(t1["W"])
#Out
# a    0
# b    4
# c    8

print(t1[["W", "Y"]])
#Out
#    W   Z
# a  0   3
# b  4   7
# c  8  11

```
## 增加一行，一列
优雅的增加一行，一定要优雅！
```pyton
df=DataFrame(np.arange(16).reshape((4,4)),index=['a','b','c','d'],columns=['one','two','three','four'])  

df.loc['new_raw'] = '3'
# 不要使用iloc, 否则会报错
df
Out[84]: 
        one two three four
a         0   1     2    3
b         4   5     6    7
c         8   9    10   11
d        12  13    14   15
new_raw   3   3     3    3
```

优雅的增加一列，一定要优雅！
```python
df['new_colu']='12'#向 DataFrame 添加一列，该列为同一值
df
Out[93]: 
        one two three four new_colu
a         0   1     2    3       12
b         4   5     6    7       12
c         8   9    10   11       12
d        12  13    14   15       12
new_raw   3   3     3    3       12
```
# pandas之loc与iloc
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023164036.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023165131.png"/>

# pandas之布尔索引
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023165506.png"/>

<font color='red'>布尔索引一定要与loc使用，不能与iloc使用</font>

# pandas之字符串方法
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023165626.png"/>

# drop函数
用法：DataFrame.drop(labels=None,axis=0, index=None, columns=None, inplace=False)

参数说明：
labels 就是要删除的行列的名字，用列表给定
axis 默认为0，指删除行，因此删除columns时要指定axis=1；
index 直接指定要删除的行
columns 直接指定要删除的列
inplace=False，默认该删除操作不改变原数据，而是返回一个执行删除操作后的新dataframe；
inplace=True，则会直接在原数据上进行删除操作，删除后无法返回。

```python
frame.drop(['Ohio'], axis = 1)
```
# 错误数据的处理
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023170045.png"/>
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191023171343.png"/>
The how paramter has two values, any and all respectively. 'Any' represents to delete these rows containing Nan value. 'All' represents to delete these rows with all elements are Nan value. And the default is 'Any'.
The inplace paramter expresses whether modify the value in original object.
Note: The fillna function also has the inplace paramter. And the default value of inplace is False.
```python
print(t1)
# Out
#    W    X   Y   Z
# a  0  1.0   2   3
# b  4  NaN   6   7
# c  8  9.0  10  11

a = t1.dropna(axis=0, how="all", inplace=False)
print(a)
#Out
#    W    X   Y   Z
# a  0  1.0   2   3
# b  4  NaN   6   7
# c  8  9.0  10  11

a = t1.dropna(axis=0, how="any", inplace=False)
print(a)
# Out
#    W    X   Y   Z
# a  0  1.0   2   3
# c  8  9.0  10  11

print(t1)
#Out
#    W    X   Y   Z
# a  0  1.0   2   3
# b  4  NaN   6   7
# c  8  9.0  10  11
# Thus it can be seen that when the inplace is Flase the t1 don't change.

t1.dropna(axis=0, how="any", inplace=True)
print(t1)
# Out
#    W    X   Y   Z
# a  0  1.0   2   3
# c  8  9.0  10  11

```

```python
print(t1)
# Out
#    W    X   Y   Z
# a  0  1.0   2   3
# b  4  NaN   6   7
# c  8  9.0  NaN  11

print(pd.notna(t1["X"]))
# Out
# a     True
# b    False
# c     True

t2 = t1[pd.notna(t1["X"])]
print(t2)
# Out
#    W    X   Y   Z
# a  0  1.0   2   3
# c  8  9.0  NaN  11

print(t1.mean())
# Out
# W    4.0
# X    5.0
# Y    4.0
# Z    7.0

print(t1.fillna(t1.mean(),inplace=True))
# Out
#    W    X   Y   Z
# a  0  1.0   2   3
# b  4  5.0   6   7
# c  8  9.0   4   11

t1.iloc[1,1] = np.nan
t1.iloc[2,2] = np.nan
print(t1)
# Out
#    W    X   Y   Z
# a  0  1.0   2   3
# b  4  NaN   6   7
# c  8  9.0  NaN  11

t1["Y"] =  t1["Y"].fillna(t1["Y"].mean())
print(t1)
# Out
#    W    X   Y   Z
# a  0  1.0   2   3
# b  4  NaN   6   7
# c  8  9.0   4  11

```

# 数据合并
## join
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025184051.png">

## merge
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025184127.png">

## concat
concat函数是在pandas底下的方法，可以将数据根据不同的轴作简单的融合
```python 
pd.concat(objs, axis=0, join='outer', join_axes=None, ignore_index=False,
       keys=None, levels=None, names=None, verify_integrity=False)
```
参数说明
objs: series，dataframe或者是panel构成的序列lsit
axis： 需要合并链接的轴，0是行，1是列
join：连接的方式 inner，或者outer

1.1 相同字段的表首尾相接
```python
# 现将表构成list，然后在作为concat的输入
In [4]: frames = [df1, df2, df3]
In [5]: result = pd.concat(frames)
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025185855.png">

要在相接的时候在加上一个层次的key来识别数据源自于哪张表，可以增加key参数
```python
In [6]: result = pd.concat(frames, keys=['x', 'y', 'z'])
```
效果如下
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025185945.png">

1.2 横向表拼接（行对齐）
1.2.1 axis
当axis = 1的时候，concat就是行对齐，然后将不同列名称的两张表合并
```python
In [9]: result = pd.concat([df1, df4], axis=1)
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190034.png">

1.2.2 join
加上join参数的属性，如果为’inner’得到的是两表的交集，如果是outer，得到的是两表的并集。
```python
In [10]: result = pd.concat([df1, df4], axis=1, join='inner')
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190125.png">

1.2.3 join_axes
如果有join_axes的参数传入，可以指定根据那个轴来对齐数据
例如根据df1表对齐数据，就会保留指定的df1表的轴，然后将df4的表与之拼接
```python
In [11]: result = pd.concat([df1, df4], axis=1, join_axes=[df1.index])
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190230.png">

1.3 append
append是series和dataframe的方法，使用它就是默认沿着列进行凭借（axis = 0，列对齐）
```python
In [12]: result = df1.append(df2)
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190315.png">

1.4 无视index的concat
如果两个表的index都没有实际含义，使用ignore_index参数，置true，合并的两个表就睡根据列字段对齐，然后合并。最后再重新整理一个新的index。
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190333.png">

1.5 合并的同时增加区分数据组的键
前面提到的keys参数可以用来给合并后的表增加key来区分不同的表数据来源

1.5.1 可以直接用key参数实现
```python
In [27]: result = pd.concat(frames, keys=['x', 'y', 'z'])
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190402.png">

1.5.2 传入字典来增加分组键
```python
In [28]: pieces = {'x': df1, 'y': df2, 'z': df3}
In [29]: result = pd.concat(pieces)
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190427.png">


1.6 在dataframe中加入新的行
append方法可以将 series 和 字典就够的数据作为dataframe的新一行插入。

```python
In [34]: s2 = pd.Series(['X0', 'X1', 'X2', 'X3'], index=['A', 'B', 'C', 'D'])

In [35]: result = df1.append(s2, ignore_index=True)
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190500.png">

表格列字段不同的表合并
如果遇到两张表的列字段本来就不一样，但又想将两个表合并，其中无效的值用nan来表示。那么可以使用ignore_index来实现。
```python
In [36]: dicts = [{'A': 1, 'B': 2, 'C': 3, 'X': 4},
   ....:          {'A': 5, 'B': 6, 'C': 7, 'Y': 8}]
   ....: 

In [37]: result = df1.append(dicts, ignore_index=True)
```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191025190527.png">

# SettingWithCopyWarning问题
这段时间一直在用pandas，今天运行前人代码发现报了一个warning：
```
SettingWithCopyWarning:
A value is trying to be set on a copy of a slice from a DataFrame
See the caveats in the documentation: http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-view-versus-copy
```
网上查了下，发现有这个问题的人还不少，但是感觉大家都没太说到点上，到底这个错误是如何产生的以及如何避免。不少方法基本上都是想办法绕过这个warning或者直接禁用掉warning提示，这样并不知道其中的原理，只是避而不见，确实不是一个好的变成习惯。后来上google上搜，看到了一个youtube视频和一篇外文Blog解释得还是非常清楚的。Youtube视频解释的比较简略，blog解释的更详细了一些。
现在总结如下：

## SettingWithCopyWarning出现的原因
链式赋值/Chained Assignment
SettingWithCopyWarning会在什么时候出现呢，简而言之就是在链式赋值的时候出现。
以下例子数据以此为例：
```python
df1 = pd.DataFrame(np.random.random(20).reshape((10,2)), columns=list('AB'))
df1
```
结果如下
```
A	B
0	0.407007	0.286344
1	0.140339	0.036872
2	0.450920	0.320719
3	0.783196	0.987610
4	0.011362	0.263995
5	0.968380	0.628029
6	0.465733	0.618144
7	0.441445	0.426087
8	0.831295	0.911736
9	0.447908	0.653442
```
什么是链式
链式就是进行多次同类型的操作，比如a = b = c = 4就是一个链式操作。在这里的链式操作主要是指，对于一个pandas格式的表，选取两次或者以上次数的其中结果。
比如选取其中A值小于0.3的行得到：
```python
df1[df1.A < 0.3]
```
结果如下：
```
    A        	B
1	0.140339	0.036872
4	0.011362	0.263995
```
那么选取其中所有A<0.3的B列值可以写为：
```python
df1[df1.A < 0.3].B
```
得到：
```
1 0.036872
4 0.263995
Name: B, dtype: float64
```
以上中，先选取左右A<0.3的行，其次再从中选取B列，上述操作将其分为两部，那么这样就是链式操作。

那么链式赋值呢？
如果此时要进行：选取其中所有A<0.3的B列值并将其赋值为1，如果进行：
```python
df1[df1.A < 0.3].B = 1
```
此时就会报错SettingWithCopyWarning的Warning
如果此时再查看df1里面的值，会发现完全没有改变。
【所以此时这个爆warning是非常有意义的，如果单纯的忽略掉则会导致程序错误。】

根据会提示用loc函数。
用loc函数如下：
```python
df1.loc[df1.A<0.3, 'B'] = 1
```
运行完后再查看就会发现df1里面的对应着都变为1了。

出现的原因
官方的解释是，pandas这个机制设计如此，凡事出现链式赋值的情况，pandas都是不能够确定到底返回的是一个引用还是一个拷贝。所以遇到这种情况就干脆报warning

更隐蔽的链式赋值
有些时候比如将链式给拆解成为多步的时候，就是一些隐式的情况。
比如：
```python
df2 = df1.loc[df1.A<0.3]
df2.loc[1,'B'] = 2
```
虽然这两步每步都用了loc，但是凡是把取值（GET）操作分为两步的，仍然是链式赋值的状态，所以仍然会报warning。
不过再次查看df2发现df2的值确实已经改变过来了，查看df1的值，发现df1的值没有变。
所以之前那次用loc取出的就是引用，这次就变成拷贝了。也就是说链式赋值是一个要避免的状态。
如果明确说要用拷贝怎么办，就是如下：
```python
df2 = df1.loc[df1.A<0.3].copy()
```
假阴性
有些情况下，出现了链式拷贝但是不会报错，所以会出现假阴性【相对应的，也会出现假阳性，即报错了，但是实际上没有链式赋值出现，但是这种一般出现在早起pandas版本中，现在新版本应该不会有了】
比如下面个：
```python
df1.loc[df1.A<0.3, ('A','B')].B = 3
df1
```
此时没有报warning，但是再查看df1发现仍然没有任何改变。

## 总结
这里总结一下pandas的这个问题：
避免任何形式的链式赋值，有可能会报warning也有可能不会报。而且即使报了，可能有问题，也可能没问题。
如果需要用到多级选取，则用loc
如果需要用到拷贝，则直接加copy()函数

# 常用方法或属性
## columns
获取DataFrame的所有列名，返回的类型是<class 'pandas.core.indexes.base.Index'>
可以将其转换成list
```python
columns_name = list(df.columns)
```
## unique( )
唯一值

```python
In [141]: obj=pd.Series(['c','a','d','a','a','b','b','c','c','c'])

In [142]: obj.unique()
Out[142]: array(['c', 'a', 'd', 'b'], dtype=object)
```
## value_counts()
计数值
```python
In [143]: obj.value_counts()
Out[143]:
c    4
a    3
b    2
d    1
dtype: int64
```
## isin()
成员资格
```
In [144]: obj.isin(['a','b'])
Out[144]:
0    False
1     True
2    False
3     True
4     True
5     True
6     True
7    False
8    False
9    False
dtype: bool
```
## apply()
apply函数是`pandas`里面所有函数中自由度最高的函数。该函数如下：
```python
DataFrame.apply(func, axis=0, broadcast=False, raw=False, reduce=None, args=(), **kwds)
```
该函数最有用的是第一个参数，这个参数是函数，相当于C/C++的函数指针。
这个函数需要自己实现，函数的传入参数根据axis来定，比如axis = 1，就会把一行数据作为Series的数据结构传入给自己实现的函数中，我们在函数中实现对Series不同属性之间的计算，返回一个结果，则apply函数会自动遍历每一行DataFrame的数据，最后将所有结果组合成一个Series数据结构并返回。
```python
#函数应用和映射
import numpy as np
import pandas as pd
df=pd.DataFrame(np.random.randn(4,3),columns=list('bde'),index=['utah','ohio','texas','oregon'])
print(df)
```
```
 b         d         e
utah   -0.451195 -0.183451 -0.297182
ohio    0.443792  0.925751 -1.320857
texas   1.039534 -0.927392  0.611482
oregon  0.938760  1.265244  0.313582
```
```python
#将函数应用到由各列或行形成的一维数组上。DataFrame的apply方法可以实现此功能
f=lambda x:x.max()-x.min()
#默认情况下会以列为单位，分别对列应用函数
t1=df.apply(f)
print(t1)
t2=df.apply(f,axis=1)
print(t2)
```
```
b    1.490729
d    2.192636
e    1.932339
dtype: float64
utah      0.267744
ohio      2.246608
texas     1.966925
oregon    0.951662
dtype: float64
```
```python
#除标量外，传递给apply的函数还可以返回由多个值组成的Series
def f(x):
    return pd.Series([x.min(),x.max()],index=['min','max'])
t3=df.apply(f)
#从运行的结果可以看出，按列调用的顺序，调用函数运行的结果在右边依次追加
print(t3)
```
b         d         e
min -0.451195 -0.927392 -1.320857
max  1.039534  1.265244  0.611482
```
```python
#元素级的python函数，将函数应用到每一个元素
#将DataFrame中的各个浮点值保留两位小数
f=lambda x: '%.2f'%x
t3=df.applymap(f)
print(t3)
```
```
 b      d      e
utah    -0.45  -0.18  -0.30
ohio     0.44   0.93  -1.32
texas    1.04  -0.93   0.61
oregon   0.94   1.27   0.31
```
#注意，这里之所以叫applymap,是因为Series有一个永远元素级函数的map方法
```python
t4=df['e'].map(f)
print(t4)
```
```
utah      -0.30
ohio      -1.32
texas      0.61
oregon     0.31
Name: e, dtype: object
```
## max()、min()
默认是对列进行操作， 可以通过axis参数来改变
```python
n1
# Out
#    A	B	C	D
# a  0	1	2	3
# b  4	5	6	7
# c  8	9	10  11

print(n1.max())
# Out
# A     8
# B     9
# C    10
# D    11
# dtype: int32

print(n1.max(axis=1))
# Out
# a     3
# b     7
# c    11
# dtype: int32
```
