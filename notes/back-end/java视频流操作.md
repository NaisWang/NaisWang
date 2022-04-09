# Java后端实现视频分段渐进式播放
## 为什么需要分段播放？
如果一个视频文件很大，例如一部1GB的电影，服务端直接将整个文件响应给客户端是会抛异常的，浏览器也没办法一下子接收这么大的文件，视频播放会出问题。
其次，直接响应一个完整的视频，无疑会浪费服务器的带宽，用户点击播放，很少会完整的观看完视频，可能看一下片头不感兴趣就不看了，亦或是想直接快进到高潮部分，跳过前面的情节等等，服务端应该根据用户的需求，只响应用户真正需要的视频片段就可以了。
服务器带宽是很珍贵的稀缺资源，应该尽可能的节约。

## Http请求头Range
Range请求头是HTTP1.1才加入的，它为并行下载以及断点续传提供了技术支持。
如下是一个HTTP请求头示例：
```
Accept: */*
Accept-Encoding: identity;q=1, *;q=0
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive
Host: localhost:8080
Range: bytes=0-1024
```
Range请求头的意思是告诉服务端，这次请求客户端只需要资源的第0-1024个字节的区间数据，服务端只需要响应这部分数据就可以了。

**原理：**
使用`<video>`标签的src属性指向服务器链接，当服务器响应的HTTP状态码为206时，浏览器会自动开启分段式播放，在每次的HTTP请求头中**自动加入**Range请求头，服务端**只需要**根据前端传过来的Range信息截取视频的指定区间来响应即可。

## 实战：
前端：
```html
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
</head>
<body>
  <video controls> //一定要加controls
    <source src="/play" type="video/mp4">
  </video>
  <!-- 或 -->
  <!-- <video src="/play" controls> -->
  <!-- </video> -->
</body>
</html>
```
后端：
```java
	@GetMapping("play")
	public void play(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.reset();
		File file = new File(this.getClass().getResource("/static/322185980-1-16.mp4").getPath());
		long fileLength = file.length();
		// 随机读文件
		RandomAccessFile randomAccessFile = new RandomAccessFile(file, "r");

		//获取从那个字节开始读取文件
		String rangeString = request.getHeader("Range");
		long range=0;
    if (StrUtil.isNotBlank(rangeString)) {
			range = Long.valueOf(rangeString.substring(rangeString.indexOf("=") + 1, rangeString.indexOf("-")));
		}
		//获取响应的输出流
		OutputStream outputStream = response.getOutputStream();
		//设置内容类型
		response.setHeader("Content-Type", "video/mp4");
		//返回码需要为206，代表只处理了部分请求，响应了部分数据
		response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);

		// 移动访问指针到指定位置
		randomAccessFile.seek(range);
		// 每次请求只返回1MB的视频流
		byte[] bytes = new byte[1024 * 1024];
		int len = randomAccessFile.read(bytes);
		//设置此次相应返回的数据长度
		response.setContentLength(len);
		//设置此次相应返回的数据范围,  Content-Range的格式为[要下载的开始位置]-[结束位置]/[文件总大小]；
		response.setHeader("Content-Range", "bytes "+range+"-"+(fileLength-1)+"/"+fileLength);
		// 将这1MB的视频流响应给客户端
		outputStream.write(bytes, 0, len);
		outputStream.close();
		randomAccessFile.close();

		System.out.println("返回数据区间:【"+range+"-"+(range+len)+"】");
	}
```
读取视频文件的指定位置数据，主要还是用到了JDK提供的java.io.RandomAccessFile类
视频的请求过程是这样的：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409122308.png)

后端控制台输出：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409122317.png)
