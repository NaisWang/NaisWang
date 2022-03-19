# 简介
lxml 是 一个HTML/XML的解析器，主要的功能是如何解析和提取 HTML/XML 数据。
lxml和正则一样，也是用C实现的，是一款高性能的 Python HTML/XML 解析器，我们可以利用之前学习的XPath语法，来快速的定位特定元素以及节点信息。
lxml python 官方文档：http://lxml.de/index.html
需要安装C语言库，可使用 pip 安装：`pip install lxml` （或通过wheel方式安装）

lxml.etree中常用函数：
- `HTML函数`
- `tostring函数`
- `parse函数`
- `HTMLParser函数`

# 初步使用
我们利用它来解析 HTML 代码，简单示例：
```python
# 使用 lxml 的 etree 库
from lxml import etree 
text = '''
<div>
    <ul>
         <li class="item-0"><a href="link1.html">first item</a></li>
         <li class="item-1"><a href="link2.html">second item</a></li>
         <li class="item-inactive"><a href="link3.html">third item</a></li>
         <li class="item-1"><a href="link4.html">fourth item</a></li>
         <li class="item-0"><a href="link5.html">fifth item</a> # 注意，此处缺少一个 </li> 闭合标签
     </ul>
 </div>
'''

#利用etree.HTML，将字符串解析为HTML文档
html = etree.HTML(text) 

# 按字符串序列化HTML文档, result不是字符串
result = etree.tostring(html) 

print(result)
```

输出结果：
```html
<html><body>
<div>
    <ul>
         <li class="item-0"><a href="link1.html">first item</a></li>
         <li class="item-1"><a href="link2.html">second item</a></li>
         <li class="item-inactive"><a href="link3.html">third item</a></li>
         <li class="item-1"><a href="link4.html">fourth item</a></li>
         <li class="item-0"><a href="link5.html">fifth item</a></li>
</ul>
 </div>
</body></html>
```
lxml 可以自动修正 html 代码，例子里不仅补全了 li 标签，还添加了 body，html 标签。

# 文件读取：
除了直接读取字符串，lxml还支持从文件里读取内容。我们新建一个hello.html文件：

```html
<div>
    <ul>
         <li class="item-0"><a href="link1.html">first item</a></li>
         <li class="item-1"><a href="link2.html">second item</a></li>
         <li class="item-inactive"><a href="link3.html"><span class="bold">third item</span></a></li>
         <li class="item-1"><a href="link4.html">fourth item</a></li>
         <li class="item-0"><a href="link5.html">fifth item</a></li>
     </ul>
 </div>
```

再利用etree.parse()方法来读取文件。
```python
from lxml import etree

# 读取外部文件 hello.html
parser = etree.HTMLParser(encoding='utf-8')
html = etree.parse('./hello.html', parser=parser)

result = etree.tostring(html, pretty_print=True)

print(result)
```

输出结果与之前相同：
```html
<html><body>
<div>
    <ul>
         <li class="item-0"><a href="link1.html">first item</a></li>
         <li class="item-1"><a href="link2.html">second item</a></li>
         <li class="item-inactive"><a href="link3.html">third item</a></li>
         <li class="item-1"><a href="link4.html">fourth item</a></li>
         <li class="item-0"><a href="link5.html">fifth item</a></li>
</ul>
 </div>
</body></html>
```
# lxml使用XPATH语法
**1. 获取所有的 `<li>` 标签**
```python
from lxml import etree

html = etree.parse('hello.html')
print type(html)  # 显示etree.parse() 返回类型

# result是列表
result = html.xpath('//li')

print result  # 打印<li>标签的元素列表
print len(result)
print type(result)
print type(result[0])
```

输出结果：
```
<type 'lxml.etree._ElementTree'>
[<Element li at 0x1014e0e18>, <Element li at 0x1014e0ef0>, <Element li at 0x1014e0f38>, <Element li at 0x1014e0f80>, <Element li at 0x1014e0fc8>]
5
<type 'list'>
<type 'lxml.etree._Element'>
```

**2. 继续获取`<li>` 标签的所有 `class`属性**
```python
from lxml import etree

html = etree.parse('hello.html')
result = html.xpath('//li/@class')

print result
```

运行结果
```
['item-0', 'item-1', 'item-inactive', 'item-1', 'item-0']
```

**3. 继续获取`<li>`标签下`hre` 为 `link1.html` 的 `<a>` 标签**
```python
from lxml import etree

html = etree.parse('hello.html')
result = html.xpath('//li/a[@href="link1.html"]')

for tr in result:
    print(etree.tostring(tr, encoding='utf-8').decode('utf-8'))
```
