# server-gateway



## 背景

前后端分离后，组件化，接口化之后，前端跟后端依赖尽存在数据，但在接口化后也带来了一些问题。
1:所有数据都通过一个ajax去拿数据，这在前端交互来说体验不是很好，交互复杂度也会提高很多。
  例如一些常量数据，变动不是很频繁的，这种请求我们可以做一些合并，统一到网关去转发，甚至我们可以做缓存，提高响应速度。
2:不同域接口调用带来cookie跨域问题，虽然我们有cors等一系列解决手段，当前我们选择用网关来解决这一系列问题。
3:在前端工程化后，也带来了一系列问题，比如前端资源包日益庞大，一般我们都会去本地打包时做压缩，然后服务端开启gzip压缩，
  比如tomcat,nginx等都可以做这个事情，tomcat的话我们不想太依赖，那么nginx和网关是前端一个不错的选择。


### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 使用
```bash
1:get请求
  get(`http://localhost:7001/api/config/gateway/`,{protocolTypes: "007001",host:"http://192.168.1.181:8088/cia-j/new-protocol/getDic"},{
    processData: false, 
    dataType: 'json',
    contentType: 'application/json',
   'api-cookie':'111111'
}).then((result)=>{
    return result;
  })
  host:接口地址,protocolTypes:接口所需参数
  api-cookie:cookie信息,网关会从里面拿值，转发到后端接口
2:post请求（基本上跟get一样）网关会去做区分
    post(`http://localhost:7001/api/config/gateway/`,{protocolTypes: "007001",host:"http://192.168.1.181:8088/cia-j/new-protocol/getDic"},{
    processData: false, 
    dataType: 'json',
    contentType: 'application/json',
   'api-cookie':'111111'
}).then((result)=>{
    return result;
  }) 
3:合并请求
    let body={parms:[
  {keys:'接口数据存入键', method: 'get',url: '接口地址', desc: '描述信息'},
   { keys: '接口数据存入键', method: 'get', url: `接口地址`, desc: '描述信息' }
  ],
  hasKeys:{currHasKey:'表示需要缓存的hash',preHasKey:'上一次hash'}}
  我们如果不想要缓存数据，直接去掉hashKeys,
  如果想要变更缓存信息,那么直接currHasKey改变此值,然后preHasKey传入上一次currHasKey值，这样网关就会重新缓存，并清理上一次缓存结果
return post(`http://localhost:7001/api/config/mergeRequest`,body,{
    processData: false, 
    dataType: 'json',
    contentType: 'application/json',
   'api-cookie':'1111111'
}).then((result)=>{
    return result;
  })
  
```

### 部署

```bash
$ npm start
$ npm stop
```

### 单元测试

- [egg-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


