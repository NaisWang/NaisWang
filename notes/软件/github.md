# 在github上高效搜索
in:name example    名字中有“example”
in:readme example    readme中有“example”
in:description example    描述中有“example”

stars:>1000    star>1000
forks:>1000    fork>1000
pushed:>2019-09-01     2019年9月1日后有更新的

language:java    用Java编写的项目

可以通过高级搜索了解这些参数 https://github.com/search/advanced

您无法使用以下通配符作为搜索查询的一部分：. , : ; / \ ` ' " = * ! ? # $ & + ^ | ~ < > ( ) { } [ ] @. 搜索只会忽略这些符号

[官方文档](https://docs.github.com/cn/search-github/searching-on-github/searching-code)


# 比较不同提交对象之间的不同
在你的项目地址url后加上compare即可

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409162609.png)

每个仓库的比较视图包含两个下拉菜单：base 和 compare。
base 应被视为比较的起点，而 compare 被视为终点。 在比较期间，可随时通过单击 Edit（编辑）来更改 base 和 compare 点。

