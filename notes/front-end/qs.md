# qs简介
qs是一个流行的查询参数序列化和解析库。可以将一个普通的object序列化成一个查询字符串，或者反过来将一个查询字符串解析成一个object,帮助我们查询字符串解析和序列化字符串。

**安装**
`npm install qs`
`import qs from qs`

# 数组解析和序列化
数组序列化有几种方式：indices, brackets, repeat, comma，用来控制字符串的生成格式。来看下面的例子：
```js
s.stringify({ a: ['b', 'c'] }, { arrayFormat: 'indices' })
// 'a[0]=b&a[1]=c'
qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'brackets' })
// 'a[]=b&a[]=c'
qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'repeat' })
// 'a=b&a=c'
qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'comma' })
// 'a=b,c'
```
上面的四种方式，序列化得到的结果越来越精简，但是当面对嵌套数组时，却会导致不同程度的信息丢失，而且丢失的越来越严重。以四种方式对`{ a: [['b'], 'c'] }`stringify 再 parse为例：
```js
qs.parse(qs.stringify({ a: [['b'], 'c'] }, { arrayFormat: 'indices' })) // { a: [['b'], 'c'] }
qs.parse(qs.stringify({ a: [['b'], 'c'] }, { arrayFormat: 'brackets' })) // {a: ["b", "c"]}
qs.parse(qs.stringify({ a: [['b'], 'c'] }, { arrayFormat: 'repeat' })) // {a: ["b", "c"]}
qs.parse(qs.stringify({ a: [['b'], 'c'] }, { arrayFormat: 'comma' })) // {a: "b,c"}
```
所以当数据里有嵌套时最好使用indices模式，好在这也是默认模式。

# ignoreQueryPrefix和addQueryPrefix
ignoreQueryPrefix这个参数可以自动帮我们过滤掉location.search前面的`?`，然后再解析，addQueryPrefix设为true可以在序列化的时候给我们加上?
```js
// 解析
qs.parse('?x=1') // {?x: "1"}
qs.parse('?x=1', {ignoreQueryPrefix: true}) //  {x: "1"}

// 序列化
qs.stringify({x: "1"}) //  x=1
qs.parse({x: "1"}, {addQueryPrefix: true}) //  ?x=1
```

# delimiter
```js
delimiter可以控制将哪种字符作为分隔符，由于cookie的格式是使用;来分隔，一个有用的例子是用来解析cookie：

document.cookie // "_ga=GA1.2.806176131.1570244607; _jsuid=1335121594; _gid=GA1.2.1453554609.1575990858"
qs.parse(document.cookie, {delimiter:'; '})
```
