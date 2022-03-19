我们可以使用xlrd与xlwt模块来操作excel文件
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210620140210.png" width="500px"/>

使用xlrd时，不能修改excel内容
使用xlwt时，不能读取excel内容

**xlrd与xlwt中行与列都是从0开始**

具体操作过程如下：
# Python读取Excel文件数据。
有如下excel文件：
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210617105220.png" width="700px"/>


打开PyCharm,，创建python file ,写入以下代码
```py
#读取xls文件,一定要把xlsx后缀改成xls
import xlrd
file_name = xlrd.open_workbook('G:\\info.xls', formatting_info=True)#得到文件
# 设置 formatting_info=True ，当打开表格是保存表格原有的样式(包括单元格背景颜色)，进行保存时，
table =file_name.sheets()[0]#得到sheet页
nrows = table.nrows #总行数
ncols = table.ncols #总列数
i = 0
while i < nrows:
    cell = table.row_values(i)[1] #得到数字列数据
    ctype = table.cell(i, 1).ctype #得到数字列数据的格式
    username=table.row_values(i)[0]
    if ctype == 2 and cell % 1 == 0: #判断是否是纯数字
     password= int(cell)  #是纯数字就转化位int类型
     print('用户名：%s'%username,'密码：%s'%password)
    i=i+1
```

运行后的结果如下
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210617105308.png" width="700px"/>

# python写入Excel文件数据。
打开PyCharm,，创建python file ,写入以下代码
```py
import random
import string
import csv
import xlrd
import xlwt
#注意这里的 excel 文件的后缀是 xls 如果是 xlsx 打开是会提示无效,新建excel表格后要选择文本格式保存
all_str = string.ascii_letters + string.digits
excelpath =('G:\\user.xls')  #新建excel文件
workbook = xlwt.Workbook(encoding='utf-8')  #写入excel文件
sheet = workbook.add_sheet('Sheet1',cell_overwrite_ok=True)  #新增一个sheet工作表
headlist=[u'账号',u'密码',u'邮箱']   #写入数据头
row=0
col=0
for head in headlist:
    sheet.write(row,col,head)
    col=col+1
for i in range(1,4):#写入3行数据
    for j in range(1,3):#写入3列数据
        username = ''.join(random.sample(all_str, 5))+'#$%'
        # password = random.randint(100000, 999999) 生成随机数
        password= ''.join(random.sample(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'z', 'y', 'x', 'w)', 'v', 'u', 't', 's', 'r', 'q', 'p', 'o',
            'n', 'm', 'l', 'k', 'j', 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],8))
        Email=''.join(random.sample(all_str, 5))+'@163.com'
        sheet.write(i,j-1,username)
        sheet.write(i,j,password)
        sheet.write(i,j,Email)
        # sheet.write(i-1, j-1, username)   没有写标题时数据从第一行开始写入
        # sheet.write(i-1, j, password)
    workbook.save(excelpath) #保存
    print(u"生成第[%d]个账号"%(i))
```
（2）运行后的结果如下
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210617105350.png" width="700px"/>

生成Excel文件
<img src="https://gitee.com/NaisWang/images/raw/master/img/20210617105404.png" width="700px"/>

# flask读取excel且修改excel
```py
import xlrd
import xlwt
from xlutils.copy import copy
import io
from flask import request, Response, make_response, jsonify

@app.route("/price_excel/import", methods=['POST', 'GET'])
def import_excel():
    # 读取传来的excel文件
	file = request.files['file']
	f = file.read()

    # 通过xlrd通过excel内容来获取excel。在然后通过copy()来转换成xlwt形式，不直接使用xlwt构建excel的原因是xlwt不支持直接通过excel文件内容来构建excel
	oldWb = xlrd.open_workbook(file_contents=f, formatting_info=True)
	oldws = oldWb.sheets()[0]

    # 将xlrd获取到的内容转换成xlwt，然后对excel镜像修改
	newWb = copy(oldWb) 
	newWs = newWb.get_sheet(0) 

    # 对excel进行修改
    ... 

    # 将修改后的excel转换为字节流
	output = io.BytesIO()
	newWb.save(output)
	response = make_response(output.getvalue())

	response.headers["Content-Type"] = "application/octet-stream; charset=UTF-8"
	response.headers["Content-Disposition"] = "attachment; filename={}".format("export.xls")
	return response
```
