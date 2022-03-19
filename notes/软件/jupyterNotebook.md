# jupyter notebook配置
生成配置文件
jupyter notebook --generate-config
修改默认配置文件
vi ~/.jupyter/jupyter_notebook_config.py
```
c.NotebookApp.ip='*' #设置访问notebook的ip，*表示所有IP，这里设置ip为都可访问  
c.NotebookApp.open_browser = False # 禁止notebook启动时自动打开浏览器(在linux服务器一般都是ssh命令行访问，没有图形界面的。所以，启动也没啥用)  
c.NotebookApp.port =8889 #指定访问的端口，默认是8888。
```

# 添加其他环境
建立虚拟环境scrapy
```python
mkvirtualenv scrapy
```
进入虚拟环境scrapy
```python
workon scrapy
```
安装jupyter，具体操作略过
```python
(scrapy) pip install jupyter
```
安装ipykernel，添加kernel
python -m ipykernel install --user --name 环境名称 --display-name "显示的名称"

```python
(scrapy) pip install ipykernel
(scrapy) python -m ipykernel install --user --name scrapy --display-name "Python2(scrapy)"
```

之后重启jupyter notebook 就可以了。

在Jupyter Notebook面板Kernel >> Change Kernel >> 你就能看到刚刚添加的内核Python2(scrapy) 了。