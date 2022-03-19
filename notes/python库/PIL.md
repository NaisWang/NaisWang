---
title: python模块之PIL模块
date: 2019/12/1
update: {{ date }}
categories:
 - back-end
 - python
---
# PIL里的类了
```python
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
from PIL import ImageFilter
```

# PIL常用方法
```python
open()  #打开图片

new(mode,size,color)   #创建一张空白图片

save("test.gif","GIF")   #保存（新图片路径和名称，保存格式）

size   #获取图片大小

thumbnail(weight,high)   #缩放图片大小（宽，高）

load() # 返回图片的像素矩阵， 矩阵中的每一个元素都是一个四元组， 代表这个像素的RGB与透明度

show()    #显示图片

blend(img1,img2,alpha)   #两张图片相加，alpha表示img1和img2的比例参数。

crop()   #剪切，提取某个矩阵大小的图像。它接收一个四元素的元组作为参数，各元素为（left, upper, right, lower），坐标系统的原点（0, 0）是左上角。

rotate(45)    #逆时针旋转45度

transpose()    #旋转图像
    transpose(Image.FLIP_LEFT_RIGHT)       #左右对换。
    transpose(Image.FLIP_TOP_BOTTOM)       #上下对换。
    transpose(Image.ROTATE_90)             #旋转 90 度角。
    transpose(Image.ROTATE_180)            #旋转 180 度角。
    transpose(Image.ROTATE_270)            #旋转 270 度角。

paste(im,box)#粘贴box大小的im到原先的图片对象中。

convert()    #用来将图像转换为不同色彩模式。

filters()     #滤镜
    BLUR   #虚化
    EMBOSS
resize((128,128))     #resize成128*128像素大小

convert("RGBA")    #图形类型转换

getpixel((4,4))   #获取某个像素位置的值

putpixel((4,4),(255,0,0))    #写入某个像素位置的值
```
# PIL应用
我们主要用PIL来生成一张验证码的随机图，下面，我们就一步步来做一个小示例

1. 生成一张固定尺寸固定颜色的图片
```python
from PIL import Image
# 获取一个Image对象，参数分别是RGB模式。宽150，高30，红色
image = Image.new('RGB',(150,30),'red')
# 保存到硬盘，名为test.png格式为png的图片
image.save(open('test.png','wb'),'png')
```
2. 生成一张随机颜色的图片
```python
from PIL import Image
import random
def getRandomColor():
    '''获取一个随机颜色(r,g,b)格式的'''
    c1 = random.randint(0,255)
    c2 = random.randint(0,255)
    c3 = random.randint(0,255)
    return (c1,c2,c3)
# 获取一个Image对象，参数分别是RGB模式。宽150，高30，随机颜色
image = Image.new('RGB',(150,30),getRandomColor())
# 保存到硬盘，名为test.png格式为png的图片
image.save(open('test.png','wb'),'png')
```
3. 生成一张带有固定字符串的随机颜色的图片

```python
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import random
def getRandomColor():
    '''获取一个随机颜色(r,g,b)格式的'''
    c1 = random.randint(0,255)
    c2 = random.randint(0,255)
    c3 = random.randint(0,255)
    return (c1,c2,c3)

# 获取一个Image对象，参数分别是RGB模式。宽150，高30，随机颜色
image = Image.new('RGB',(150,30),getRandomColor())

# 获取一个画笔对象，将图片对象传过去
draw = ImageDraw.Draw(image)

# 获取一个font字体对象参数是ttf的字体文件的目录，以及字体的大小
font=ImageFont.truetype("kumo.ttf",size=32)

# 在图片上写东西,参数是：定位，字符串，颜色，字体
draw.text((20,0),'fuyong',getRandomColor(),font=font)

# 保存到硬盘，名为test.png格式为png的图片
image.save(open('test.png','wb'),'png')
```
效果：
![](https://gitee.com/naiswang/images/raw/master/20190926191451.png)


4. 生成一张带有随机字符串随机颜色的图片

```python
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import random

def getRandomColor():
    '''获取一个随机颜色(r,g,b)格式的'''
    c1 = random.randint(0,255)
    c2 = random.randint(0,255)
    c3 = random.randint(0,255)
    return (c1,c2,c3)


def getRandomStr():
    '''获取一个随机字符串，每个字符的颜色也是随机的'''
    random_num = str(random.randint(0, 9))
    random_low_alpha = chr(random.randint(97, 122))
    random_upper_alpha = chr(random.randint(65, 90))
    random_char = random.choice([random_num, random_low_alpha, random_upper_alpha])
    return random_char

# 获取一个Image对象，参数分别是RGB模式。宽150，高30，随机颜色
image = Image.new('RGB',(150,30),getRandomColor())

# 获取一个画笔对象，将图片对象传过去
draw = ImageDraw.Draw(image)

# 获取一个font字体对象参数是ttf的字体文件的目录，以及字体的大小
font=ImageFont.truetype("kumo.ttf",size=26)

for i in range(5):
    # 循环5次，获取5个随机字符串
    random_char = getRandomStr()

    # 在图片上一次写入得到的随机字符串,参数是：定位，字符串，颜色，字体
    draw.text((10+i*30, 0),random_char , getRandomColor(), font=font)

# 保存到硬盘，名为test.png格式为png的图片
image.save(open('test.png','wb'),'png')
```
效果：
![](https://gitee.com/naiswang/images/raw/master/20190926191604.png)


# 实战：跳一跳外挂
```python
import subprocess
from PIL import Image
import random
import os
import time

img_height = 0
img_wight = 0
img_pixel = ()

chess_center = ()
dish_center = ()

img = 0


def get_screenShot():
	process = subprocess.Popen("adb shell screencap -p", shell=True, stdout=subprocess.PIPE)
	screen_shot = process.stdout.read()
	# 命令行显示的干扰
	screen_shot = screen_shot.replace(b"\r\n", b"\n")
	with open("fff.png", "wb") as fp:
		fp.write(screen_shot)
	global img
	img = Image.open("fff.png")
	global img_wight
	global img_height
	global img_pixel
	img_wight, img_height = img.size
	img_pixel = img.load()


def find_chess():
	chess_left = ()
	chess_right = ()
	flag = False
	leftflag: bool = False
	for y in range(600, img_height):
		if flag:
			break
		for x in range(270, img_wight):
			pixel = img_pixel[x, y]
			if 51 <= pixel[0] <= 54 and 51 <= pixel[1] <= 54 and 55 <= pixel[2] <= 59 and leftflag == False:
				chess_left = (x, y)
				leftflag = True
				continue
			elif leftflag:
				chess_right = (x - 1, y)
				flag = True
				break
	global chess_center
	chess_center = (int((chess_left[0] + chess_right[0]) / 2), chess_left[1]+208)


def find_dish():
	bd = img_pixel[100, 400]
	for y in range(400, img_height):
		for x in range(100, img_wight):
			pixel = img_pixel[x, y]
			if pixel[0] >= bd[0] + 5 or pixel[0] <= bd[0] - 5 or pixel[1] >= bd[1] + 5 or pixel[1] <= bd[1] - 5 or \
					pixel[2] >= bd[2] + 5 or pixel[
				2] <= bd[2] - 5:
				global dish_center
				dish_center = (x, y+131)
				return
			bd = pixel

def jump(distance):
	press_time = distance * 1.392
	press_time = int(max(press_time, 200))
	point = (random.randint(253, 860), random.randint(1520, 1839))
	cmd = "adb shell input swipe {x1} {y1} {x2} {y2} {time}".format(
		x1=point[0],
		y1=point[1],
		x2=point[0] + random.randint(10, 20),
		y2=point[1] + random.randint(10, 20),
		time=press_time
	)
	os.system(cmd)


if __name__ == '__main__':
	while True:
		get_screenShot()
		find_chess()
		find_dish()
		print("{x} -> {y}".format(x=chess_center, y=dish_center))
		distance = (((dish_center[0] - chess_center[0]) ** 2) + ((dish_center[1] - chess_center[1]) ** 2)) ** 0.5
		# img.putpixel(dish_center, (255, 255, 255))
		# img.putpixel(chess_center, (255, 255, 255))
		# img.show()
		jump(distance)
		time.sleep(random.randint(1, 2))
```