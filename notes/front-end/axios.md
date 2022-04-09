# Axios简介
Axios是前端通信框架，用来实现异步通信。 因为vue的边界很明确，就是为了处理DOM，所以并不具备通信能力，为了解决通信问题，vue作者又开发了一个名为vue-resource的插件，不过在进入2.0版本后停止了对该插件的维护并推荐了Axios框架，当然也可以直接选择使用JQuery提供的AJAX通信功能.
其功能特点如下：
- 从浏览器中创建XMLHttpRequests
- 从node.js创建http请求
- 支持Promise API
- 拦截请求和响应
- 转换请求数据和响应树
- 取消请求
- 自动转换JSON数据
- 客户端支持防御XSRF(跨站请求伪造)

# 为什么要使用Axios
由于Vue.js是一个视图层框架并且作者（尤雨溪）严格遵守 soc（关注度分离原则），所以Vue.js并不包含AJAX的通信功能，为了解决通信问题，作者单独开发了一个名为vue-resource的插件，不过在进入2.0版本以后停止了对该插件的维护并推荐了Axios框架

# 实战
咱们开发的接口大部分都是采用JSON格式，可以先在项目里模拟一段JSON数据，数据内容如下：
```json
{
  "name": "百度",
  "url": "http://www.baidu.com",
}
```
创建一个名为data.json的文件并填入上面的内容，放在项目的根目录下，

创建html：
```html
<div id="example">
  <div>
    名称:{{info.name}}
  </div>
  <div>
    链接:<a v-bind:href="info.url" target="_blank">{{info.url}}</a>
  </div>
</div>
```

js文件
```js
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>

<script type="text/javascript">
  var example = new Vue({
    el:"#example",
    data(){
      return{
        info:{
          name:'',
          url:''
        }
      }
    },
    mounted(){
      axios
        .get('data.json')
        .then(response => this.info=response.data);
    }
  })
</script>
```

# URL查询参数(query string)处理
我们在调用 axios 的 get 请求的时候，很多时候会用params附上请求参数，注使用params时，不会覆盖掉url中已经携带了的请求参数：例如如下的代码
```js
axios({
  method: 'get',
  url: '/base/get?c=3&d=4',
  params: {
    a: 1,
    b: 2
  }
})
```
最终，我们需要将上面的请求变成`/base/get?c=3&d=4&a=1&b=2`的形式发送给服务端，服务端才能正确解析 url 中的请求参数，所以，我们需要把 params 对象中的 key 和 value 正确的拼接到 url 上。

上面的例子比较简单，我们看几个复杂的例子
## 参数值为数组
```js
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: ['bar', 'baz']
  }
})
```
最终请求的 url 是`/base/get?foo[]=bar&foo[]=baz'`。

**axios get请求传递数组参数出现 [ ] 解决方法**
解决方法：运用qs处理 (以下范例)
```js
import qs from "qs"

axios.get(url, {
    method: 'get',
    url: '/base/get',
    params: {
      foo: ['bar', 'baz']
    }
    paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
    }
})
```
此时请求的url是`/base/get?foo=bar&foo=baz`

若arrayFormat: 'comma', 则此时的请求的url是`/base/get?foo[0]=bar&foo[1]=baz`


## 参数值为对象
```js
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: {
      bar: 'baz'
    }
  }
})
```
最终请求的 url 是`/base/get?foo=%7B%22bar%22:%22baz%22%7D`，foo 后面拼接的是 {"bar":"baz"} encode 后的结果。

参数值为 Date 类型
```js
const date = new Date()

axios({
  method: 'get',
  url: '/base/get',
  params: {
    date
  }
})
```
最终请求的 url 是 /base/get?date=2019-04-01T05:55:39.030Z，date 后面拼接的是 date.toISOString() 的结果。

## 特殊字符支持
对于字符 @、:、$、,、、`[`、`]`，我们是允许出现在 url 中的，不希望被 encode。
```js
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: '@:$, '
  }
})
```
最终请求的 url 是 /base/get?foo=@:$+，注意，我们会把空格 转换成 +。

## 空值忽略
对于值为 null 或者 undefined 的属性，我们是不会添加到 url 参数中的。
```js
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: 'bar',
    baz: null
  }
})
```
最终请求的 url 是`/base/get?foo=bar`。

## 丢弃 url 中的哈希标记
```
axios({
  method: 'get',
  url: '/base/get#hash',
  params: {
    foo: 'bar'
  }
})
```
最终请求的 url 是`/base/get?foo=bar`


## 保留 url 中已存在的参数
```js
axios({
  method: 'get',
  url: '/base/get?foo=bar',
  params: {
    bar: 'baz'
  }
})
```
最终请求的 url 是 /base/get?foo=bar&bar=baz

# Axios发送请求时params和data的区别
- `params`是添加到url的请求字符串中的
- `data`是添加到请求体（body）中的

# axios拦截器接口配置与使用
页面发送http请求，很多情况我们要对请求和其响应进行特定的处理；例如每个请求都附带后端返回的token，拿到response之前loading动画的展示等。如果请求数非常多，这样处理起来会非常的麻烦，程序的优雅性也会大打折扣。在这种情况下，axios为开发者提供了这样一个API：拦截器。拦截器分为 请求（request）拦截器和 响应（response）拦截器。
- 请求拦截器：请求拦截器的作用是在请求发送前进行一些操作，例如在每个请求体里加上token，统一做了处理如果以后要改也非常容易。
- 响应拦截器：响应拦截器的作用是在接收到响应后进行一些操作，例如在服务器返回登录状态失效，需要重新登录的时候，跳转到登录页等。

## axios配置拦截器
**axios的基础配置**

项目目录如下图所示：

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409131459.png)

其中，api一般存放的为页面的请求，这些请求都需要统一经过请求拦截器的处理，这部分不是重点，随便拿出一个文件来进行展示，一看就能懂

![](https://raw.githubusercontent.com/NaisWang/images/master/20220409131510.png)

重点在于request文件的编写，一下request.js文件代码， 分为3部分：axios基础配置、请求拦截器配置、响应拦截器配置
```js
// ====
// ==== axios基础配置
// ====
//   在http.js中引入axios
import axios from 'axios'   //引入 axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，某些请求会用得到
import { Message } from 'element-ui'    //引入 element-ui 的 Message 模块，用于信息提示
import store from '@/store'     //引入 vuex 中的数据
import { getToken } from '@/utils/auth'   //引入拿到的权限tocken

// create an axios instance   创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // request timeout  设置请求超时时间
  responseType: "json",
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
})


// ====
// ==== axios请求拦截器配置
// ====
service.interceptors.request.use(
  config => {
    // 在发送请求之前做什么
    if (config.method === "post") {
      // 序列化
      // config.data = qs.stringify(config.data);
      // config.data = JSON.stringify(config.data);
      // 温馨提示,若是贵公司的提交能直接接受json 格式,可以不用 qs 来序列化的
    }else {
          if (store.getters.token) {
               // 若是有做鉴权token , 就给头部带上token
               // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
               // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage (隐身模式)的使用
                config.headers['X-Token'] = getToken()
          }
    }
    return config;
  },
  error => {
    // 对请求错误做些什么，自己定义
    Message({                  //使用element-ui的message进行信息提示
      showClose: true,
      message: error,
      type: "warning"
    });
    return Promise.reject(error);
  }
)

// ====
// ==== axios响应拦截器配置
// ====
service.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                      Message({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    store.commit('loginSuccess', null);
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;

                // 404请求不存在
                case 404:
                    Message({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Message({
                        message: error.response.data,message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    }
});


// ====
// ==== 暴露axios实例
// ====
export default service;
```

## 在项目中调用拦截器
axios封装好之后，调用就很简单了。我们把接口统一写在api文件夹中。（如果你的业务非常复杂，建议把不同模块或组件的请求分开写到不同的文件里，这样方便维护）。
```js
//   api.js
import request from '@/utils/request'

export function userSearch(name) {
  return request({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}
```
然后在具体的组件中进行调用即可
```js
import { userSearch} from '@/api/api'
export default {
  data() {
    return {
        name: '大大大大大西瓜G'
    }
  },
  methods:{
      getUserInfo () {
          userSearch(this.name).then(res => {
              //对拿到的res.data进行一番操作或者渲染
          })
      }
  },
  mounted() {
      this.getUserInfo ();
  }
}
```
