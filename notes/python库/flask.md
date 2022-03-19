# 简介
Flask是一个Python编写的Web 微框架，让我们可以使用Python语言快速实现一个网站或Web服务。本文参考自Flask官方文档，大部分代码引用自官方文档。

# 安装Flask
首先我们来安装Flask。最简单的办法就是使用pip。
```
pip install flask
```
然后打开一个Python文件，输入下面的内容并运行该文件。然后访问localhost:5000，我们应当可以看到浏览器上输出了Hello Flask!。
```py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello Flask!'

if __name__ == '__main__':
    app.run()
```

# 调试模式
我们修改代码中的输出，然后查看浏览器上是否有变化。如果你照做的话，可以看到什么变化都没有。其实Flask内置了调试模式，可以自动重载代码并显示调试信息。这需要我们开启调试模式，方法很简单，设置`FLASK_DEBUG`环境变量，并将值设置为1。
然后再次运行程序，会看到有这样的输出。这时候如果再次修改代码，会发现这次Flask会自动重启。
```
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 157-063-180
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

# 路由
在上面的例子里可以看到路由的使用。如果了解Spring Web MVC的话，应该对路由很熟悉。路由通过使用Flask的app.route装饰器来设置，这类似Java的注解。
```py
@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello, World'
```

# 路径变量
如果希望获取`/article/1`这样的路径参数，就需要使用路径变量。路径变量的语法是`/path/<converter:varname>`。在路径变量前还可以使用可选的转换器，有以下几种转换器。

| 转换器 | 作用                                     |
| ------ | ---------------------------------------- |
| string | 默认选项，接受除了斜杠之外的字符串       |
| int    | 接受整数                                 |
| float  | 接受浮点数                               |
| path   | 和string类似，不过可以接受带斜杠的字符串 |
| any    | 匹配任何一种转换器                       |
| uuid   | 接受UUID字符串                           |

下面是Flask官方的例子。
```py
@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username

@app.route('/post/<int:post_id>')
def show_post(post_id):
    # show the post with the given id, the id is an integer
    return 'Post %d' % post_id
```

# 构造URL
在Web程序中常常需要获取某个页面的URL，在Flask中需要使用url_for('方法名')来构造对应方法的URL。下面是Flask官方的例子。
```
>>> from flask import Flask, url_for
>>> app = Flask(__name__)
>>> @app.route('/')
... def index(): pass
...
>>> @app.route('/login')
... def login(): pass
...
>>> @app.route('/user/<username>')
... def profile(username): pass
...
>>> with app.test_request_context():
...  print url_for('index')
...  print url_for('login')
...  print url_for('login', next='/')
...  print url_for('profile', username='John Doe')
...
/
/login
/login?next=/
/user/John%20Doe
```

# HTTP方法
如果需要处理具体的HTTP方法，在Flask中也很容易，使用route装饰器的methods参数设置即可。
```py
from flask import request

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        do_the_login()
    else:
        show_the_login_form()
```

# 静态文件
Web程序中常常需要处理静态文件，在Flask中需要使用url_for函数并指定static端点名和文件名。在下面的例子中，实际的文件应放在static/文件夹下。
```py
url_for('static', filename='style.css')
```

# 处理请求
在 Flask 中获取请求参数需要使用request等几个全局对象，但是这几个全局对象比较特殊，它们是 Context Locals ，其实就是 Web 上下文中局部变量的代理。虽然我们在程序中使用的是全局变量，但是对于每个请求作用域，它们都是互不相同的变量。理解了这一点，后面就非常简单了。

# Request对象
对于 Web 应用，与客户端发送给服务器的数据交互至关重要。在 Flask 中由全局的 request 对象来提供这些信息，比如说GET在url后面追加参数、POST在body中带参数、又或者是POST的表单提交方式，这时候就需要从request里提取出参数。

request常用的属性和方法
| 属性    | 用途                           | 类型                   |
| ------- | ------------------------------ | ---------------------- |
| data    | 记录请求的数据，并转化成字符串 | *                      |
| form    | 记录请求中的表单数据           | MultiDict              |
| args    | 记录url中的查询参数            | MultiDict              |
| json    | 记录请求中的json数据           |                        |
| cookies | 记录请求中的cookies信息        | Dict                   |
| headers | 记录请求报文头                 | EnvironHeaders         |
| method  |                                | 记录请求使用的HTTP方法 | GET/POST/… |
| files   | 记录上传的文件                 | *                      |
| url     | 记录请求的URL地址              | string                 |

## form
从POST或者PUT请求中解析表单数据。如果GET请求将表单数据编码到url里面，而不是放在表单中传输过来的信息，则不能使用form捕捉。使用form解析后是ImmutableMultiDict(一键多值字典)类型。

## args
获得url中携带的params(参数)，与传输方式（GET or POST）无关。有时候POST请求也会将参数加入到url中，这种情况下也可以得到args属性。使用args解析后也是ImmutableMultiDict(一键多值字典)类型。
form和args的例子：
浏览器默认的将GET请求的表单数据编码到url中，而不会单独发送表单数据。POST请求的表单通过表单数据传到服务端，而不会编码到url中。利用浏览器这样的特性，就可以通过以下这个例子认识到form和args的区别：

## json
如果请求的mimetype是application/json，那么这个参数将会解析json数据，如果不是将会返回None，可以代替上面的get_json()方法。
```py
from flask import request

@app.route('/login', methods=['POST', 'GET'])
def login():
    error = None
    if request.method == 'POST':
        if valid_login(request.form['username'],
                       request.form['password']):
            return log_the_user_in(request.form['username'])
        else:
            error = 'Invalid username/password'
    # the code below is executed if the request method
    # was GET or the credentials were invalid
    return render_template('login.html', error=error)
```
如果数据是由GET方法传送过来的，可以使用args属性获取，这个属性也是一个字典。
```py
searchword = request.args.get('key', '')
```

## axios与flask搭配实现文件上传
前端：
```js
update() {
    let param = new FormData();
     
    param.append('file', this.fileList2[0])

    this.fileList2.forEach(item => {
        param.append('files', item.raw)
    })

    let config = {
    headers: {'Content-Type': 'multipart/form-data'},
    responseType: 'blob'
    };
    //this.get_log()
    $http.post('http://127.0.0.1:5000/price_excel/import', param, config)
        .then(resp => {
        this.stopTimer = false;
        this.onSuccess()
        let data = resp.data;
        let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = "价格表.xls"
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.url.revokeObjectURL(href);
        })
}
```
后端：
```py
@app.route("/price_excel/import", methods=['POST', 'GET'])
def import_excel():
	f = request.files.get("file")
	print(f.filename)

	fs = request.files.getlist("files")
	for f in fs:
		print(f.filename)
```

# Sessions
我们可以使用全局对象session来管理用户会话。Sesison 是建立在 Cookie 技术上的，不过在 Flask 中，我们还可以为 Session 指定密钥，这样存储在 Cookie 中的信息就会被加密，从而更加安全。直接看 Flask 官方的例子吧。
```py
from flask import Flask, session, redirect, url_for, escape, request

app = Flask(__name__)

@app.route('/')
def index():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return '''
        <form method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    '''

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))

# set the secret key.  keep this really secret:
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
```

# 文件上传
利用Flask也可以方便的获取表单中上传的文件，只需要利用 request 的files属性即可，这也是一个字典，包含了被上传的文件。如果想获取上传的文件名，可以使用filename属性，不过需要注意这个属性可以被客户端更改，所以并不可靠。更好的办法是利用werkzeug提供的secure_filename方法来获取安全的文件名。
```py
from flask import request
from werkzeug.utils import secure_filename

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['the_file']
        f.save('/var/www/uploads/' + secure_filename(f.filename))
```

# Cookies
Flask也可以方便的处理Cookie。使用方法很简单，直接看官方的例子就行了。下面的例子是如何获取cookie。
```py
from flask import request

@app.route('/')
def index():
    username = request.cookies.get('username')
    # 使用 cookies.get(key) 代替 cookies[key] 避免
    # 得到 KeyError 如果cookie不存在
```
如果需要发送cookie给客户端，参考下面的例子。
```py
from flask import make_response

@app.route('/')
def index():
    resp = make_response(render_template(...))
    resp.set_cookie('username', 'the username')
    return resp
```

# 重定向和错误
redirect和abort函数用于重定向和返回错误页面。
```py
from flask import abort, redirect, url_for

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    abort(401)
    this_is_never_executed()
```
默认的错误页面是一个空页面，如果需要自定义错误页面，可以使用errorhandler装饰器。
```py
from flask import render_template

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404
```

# 响应处理
默认情况下，Flask会根据函数的返回值自动决定如何处理响应：如果返回值是响应对象，则直接传递给客户端；如果返回值是字符串，那么就会将字符串转换为合适的响应对象。我们也可以自己决定如何设置响应对象，方法也很简单，使用make_response函数即可。
```py
@app.errorhandler(404)
def not_found(error):
    resp = make_response(render_template('error.html'), 404)
    resp.headers['X-Something'] = 'A value'
    return resp
```

# 返回json数据
```py
@app.route('/')
def index():
    return dict(name="luotuo", fnas=10000)
```