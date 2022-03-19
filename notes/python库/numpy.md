---
title: numpy
date: 2019/12/1
update: {{ date }}
categories:
 - back-end
 - python
---
numpy:
一个在Python中做科学计算的基础库，重在数值计算，也是大部分PYTHON科学计算库的基础库，多用于在大型、多维数组上执行数值运算
# Numpy创建数组
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015203922.png">

```python
# create a numpy array with the all elements' values as 0
zeros_data = np.zeros((2,3))
#Out
# [[0. 0. 0.]
#  [0. 0. 0.]]

# create a numpy array with the all elements' values as 1
ones_data = np.ones((2,3))
#Out
# [[1. 1. 1.]
#  [1. 1. 1.]]

# create a square array with ones on the diagonal and zeros elsewhere.
eye_data = np.eye(3)
#Out
# [[1. 0. 0.]
#  [0. 1. 0.]
#  [0. 0. 1.]]

# create a Arithmetic array
# The linspace function can have three paramters. The first parameter indicates the begin number. The second parameter indicates the end number. The third parameter indicates the amount of number.
arithmetic_data = np.linspace(1,5,10)
print(arithmetic_data)
# Out
# [1.         1.44444444 1.88888889 2.33333333 2.77777778 3.22222222
#  3.66666667 4.11111111 4.55555556 5.        ]

```

# numpy中常见的更多自带的数据类型
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015204319.png">

# 数据类型的操作
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015204903.png">

注： `a.astype()`并不会在修改a， 要想修改a, 可以使用`a = a.astype(np.int8)`

# 数组的形状
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015211852.png">
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015210106.png">
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015212155.png">

# 数组与数的计算
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015212653.png">

# 数组与数组的计算
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015212727.png">
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015212843.png">
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015212929.png">
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015212957.png">
原因： numpy的数组广播原则

# numpy数组的广播原则hj
广播原则：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015215310.png">
如何计算后缘维度的轴长度？ 可以使用代码`A.shape[-1]`， 即矩阵维度元组中的最后一位置的值，就是矩阵维度的最后一个维度， 比如（3，4，2）的 后缘维度的轴长度为2

<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015215811.png">

根据广播原则分析：arr1的shape为(3,4,2),arr2的shape为(4,2)，它们的后缘轴长度都为(4,2)，所以可以在0轴进行广播，arr2的shape变为(3,4,2).
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191015215846.png">

# numpy中多维数组的轴（axis）
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191017164530.png">
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191017164627.png">
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191017164839.png">

多维数组的轴（axis=）是和该数组的size（或者shape）的元素是相对应的；
```python
>>> np.random.seed(123)
>>> X = np.random.randint(0, 5, [3, 2, 2])
>>> print(X)

[[[5 2]
  [4 2]]

 [[1 3]
  [2 3]]

 [[1 1]
  [0 1]]]

>>> X.sum(axis=0)
array([[7, 6],
       [6, 6]])

>>> X.sum(axis=1)
array([[9, 4],
       [3, 6],
       [1, 2]])

>>> X.sum(axis=2)
array([[7, 6],
       [4, 5],
       [2, 1]])
```
如果将三维数组的每一个二维看做一个平面（plane，X[0, :, :], X[1, :, :], X[2, :, :]），三维数组即是这些二维平面层叠（stacked）出来的结果。则（axis=0）表示全部平面上的对应位置，（axis=1），每一个平面的每一列，（axis=2），每一个平面的每一行。

# numpy读取数据
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191018082356.png">

# numpy中的转置
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191018141121.png">

# numpy索引和切片
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020155329.png">

```python
# take multiple lines that aren't consecutive
print(a[[1,2]])
# Out
# [[ 4  5  6  7]
# [ 8  9 10 11]]

# take multiple columns that aren't consecutive
print(a[1:3,[1,2]])
# Out
# [[ 5  6]
# [ 9 10]]

# take multiple non-adjacent points
print(a[[1,2],[0,2]])
# Out
# [ 4 10]

```

Note: when you get the consecutive rows rows or columns, it will return the reference to the numpy, not the value of the numpy. Note that must be consecutive, if not, it will return the value of the numpy, not the reference to numpy;
For example:
```python
t
#Out
# [[ 0  1  2  3  4  5]
#  [ 6  7  8  9 10 11]
#  [12 13 14 15 16 17]
#  [18 19 20 21 22 23]]

# ---------------------------------------------------------------------------
# The case of not taking the consecutive rows or columns
a = t[:, [1,3]]
# Out
# [[ 1  3]
#  [ 7  9]
#  [13 15]
#  [19 21]]

a[[0], [0]] = 2
print(a)
#Out
# [[ 2  3]
#  [ 7  9]
#  [13 15]
#  [19 21]]

print(t)
#Out
# [[ 0  1  2  3  4  5]
#  [ 6  7  8  9 10 11]
#  [12 13 14 15 16 17]
#  [18 19 20 21 22 23]]

# ---------------------------------------------------------------------------
# The case of taking the consecutive rows
b = t[:, 1:3]
print(b)
#Out
# [[ 1  2]
#  [ 7  8]
#  [13 14]
#  [19 20]]

b[[0], [0]] = 2
print(b)
# Out
# [[ 2  2]
#  [ 7  8]
#  [13 14]
#  [19 20]]

print(t)
#Out
# [[ 0  2  2  3  4  5]
#  [ 6  7  8  9 10 11]
#  [12 13 14 15 16 17]
#  [18 19 20 21 22 23]]

```
# numpy中数组的修改
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020162125.png">

## numpy中布尔索引
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020162403.png">

the t[t<10] return a array containing these numbers that satisfy the condition t<10;
For example:
```python
t
# Out
#[[ 0  1  2  3  4  5]
# [ 6  7  8  9 10 11]
# [12  2 14 15 16 17]
# [18 19 20 21 22 23]]

t[t<10]
# Out
# array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 2])
```
## numpy中三元运算
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020162620.png">
## numpy中的clip
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020162732.png">
## numpy中的nan和inf
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020164653.png">
### numpy中的nan的注意点
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020165324.png">

```python
t
#Out
#[ 2. nan 14. 20.]

np.isnan(t)
#Out
#[False  True False False]

```
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020165845.png">

## numpy中常用统计函数
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191020170140.png">

```pyton
# Get the indexs of maximum or minimum on each rows or columns. Return a array
np.argmax(t.axis=0)
np.argmin(t.axis=1)
```

## 数组的拼接
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022193005.png">

## 数组的行列交换
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022193409.png">

## numpy生成随机数
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022202223.png">
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022202311.png">

## numpy中的copy和view
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20191022202555.png">
