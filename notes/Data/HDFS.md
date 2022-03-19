# HDFS上的用户
## 说明
在hdfs创建一个目录时，你可以创建将中这个目录的owner的指定为这个节点上没有的用户.
## 案例
我用三个ubuntuServer133、ubunutServer134、ubuntuServer135三个节点搭建起了一个hadoop集群，并且创建一个user为whz6的目录，注：这三台节点上都没有user为whz6
![](https://raw.githubusercontent.com/whz123/images/master/20190813080654.png =900x)
![](https://raw.githubusercontent.com/whz123/images/master/20190813081125.png =900x)
然后我们将建立好的hadoop集群配置配置到另一台节点上，在这个节点上创建一个user为whz6的用户，然后切换到whz6用户来单独启动datanode（前提是这个hadoop目录的owner为whz6），此时这个节点就会自动添加到这个集群中
![](https://raw.githubusercontent.com/whz123/images/master/20190813081819.png)
![](https://raw.githubusercontent.com/whz123/images/master/20190813081501.png)
然后使用这个用户发送文件到/whz6的目录上
![](https://raw.githubusercontent.com/whz123/images/master/20190813082021.png)
如果这个whz6用户操作其他用户的目录，则会报错
![](https://raw.githubusercontent.com/whz123/images/master/20190813082117.png)