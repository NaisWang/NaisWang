# 1. 安装pyautogui库
```shell
pip3 install pyautogui
```
[pyautogui官网](https://muxuezi.github.io/posts/doc-pyautogui.html)

# 2. 常用方法
## 2.1 yautogui.click()
这个函数是用于模拟鼠标的点击动作，比如：pyautogui.click(100,500)就是让鼠标移动到（100，500）这个位置然后点击。

## 2.2 pyautogui.doubleClick()
这个函数和上一个很像，确实，这是双击，注意这里的C是大写的，用法和上面一样

## 2.3 pyautogui.typewrite()
```python3
pyautogui.typewrite(['1','7','0','6','3','0','0','1','tab'],'0.25')
```
前面的数字就是分别打出数字，‘tab’是键盘上的TAB功能键，注意两边是用[ ]括起来的。后面的’0.25‘是时间，意思就是打出这几个数字需要多少时间，可大可小很好用。
`pyautogui.typewrite('154642',0.25)`也可以这么用，直接打出这几个数字，不需要那么复杂，但是这个不能打出键盘功能键。
## 2.4 pyautogui.position()
直接在python的idle中输入pyautogui.position()就行了，它就会返回鼠标的位置。

## 2.5 PyAutoGUI键盘表：
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20200111174123.png"/>

# 3. 输入中文
我想了一个凑合能用的办法，但是不适合大范围输入，如果只要输入个姓名，性别啥的可以完成。
```python
pyautogui.typewrite(['l','i','h','a','i','g','u','a','n','1',],'0.25')
```

大家可以先切入中文输入法试一下，前面的字母就是用中文输入法输入拼音，后面的'1'就是打字中的选择喽。大家能理解这个意思就行了，是不是感觉很粗糙，嘿嘿嘿。

# 4. 实战
<img width="500px" src="https://gitee.com/naiswang/images/raw/master/20200111174656.png"/>