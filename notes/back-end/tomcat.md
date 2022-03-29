![](https://raw.githubusercontent.com/NaisWang/images/master/20220327145103.png)

tomcat内部采用的就是多线程，上百个客户端访问同一个web应用，tomcat接入后都是把后续的处理扔给一个新的线程来处理，这个新的线程最后调用到我们的servlet程序，比如doGet或者doPost方法。
如果不采用多线程机制，上百个人同时访问一个web应用的时候，tomcat就得排队串行处理了，那样客户端根本是无法忍受那种访问速度的。
