'use strict';
module.exports = app => {
  class AbstractController extends app.Controller {
    success(data) {
      this.ctx.status = 200,
        this.ctx.body = data
    }
    isJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj = JSON.parse(str);
          if (typeof obj == 'object' && obj) {
            return true;
          } else {
            return false;
          }

        } catch (e) {
          console.log('error：' + str + '!!!' + e);
          return false;
        }
      }
    }
    async proxyBatch(url,key,desc, method='get'){
      let result;
      try{
        const header = this.ctx.headers
        // delete headers.host // 提交的header.host是mocker的host，需要删除
         if (header['cookie']) { // 如果请求头带有此字段，则设置cookie
           header.cookie = header['cookie']
         }
         if (header['api-cookie']) {
           header.cookie = header['api-cookie']
           delete header['api-cookie']
         }
         const headers= {cookie:header.cookie?header.cookie:''}
         const opts = { // body数据，暂时只支持json格式，未来可以从header中判断
           headers,
           dataType: 'application/json',
         }
         opts.method = method;
         result = await this.ctx.curl(url, opts)
         result['entity']=key;
         result['desc']=desc;
         return result;
      }
      catch(error){
        result={};
        result['entity']=key;
        result['desc']=desc;
        result['data']=error;
        return result;
      }
      
    }
    async proxy(url, method='get') {
      try{
        const headers = this.ctx.headers
       // delete headers.host // 提交的header.host是mocker的host，需要删除
        if (headers['cookie']) { // 如果请求头带有此字段，则设置cookie
          headers.cookie = headers['cookie']
        }
        if (headers['api-cookie']) {
          headers.cookie = headers['api-cookie']
          delete headers['api-cookie']
        }
        const opts =method==='get'? { 
          //data: this.ctx.request.body,// body数据，暂时只支持json格式，未来可以从header中判断
          headers:{cookie:headers.cookie?headers.cookie:''},
          dataType: 'application/json',
          timeout: 10000,
        }:{
          data: this.ctx.request.body,
          headers:{cookie:headers.cookie?headers.cookie:''},
          dataType: 'application/json',
          timeout: 10000,
        }
        opts.method = method
        const result = await this.ctx.curl(url, opts)
        this.ctx.status = result.status
        delete result.headers['content-encoding'] // 设置了gzip encoding的话，转发请求将会出错，先取消此请求头的返回
        this.ctx.set(result.headers)
        this.ctx.body = result.data
      }
      catch(error){
        this.success(error);
      }
    }
   async batchProxy(bath) {
      let result = {};
      let primise = [];
      if (bath && bath instanceof Array) {
        const textPromises = bath.map(async item => {
          const response = await this.proxyBatch(item.url, item.keys,item.desc,item.method);
          return response;
        });
        for (let item of textPromises) {
          let items=await item;
          result[items.entity]={};
          let data=items.data.toString();
          if (this.isJSON(data)) data = JSON.parse(data);
          result[items.entity]['data'] = data;
          result[items.entity]['desc']=items.desc;
          
        }
      }
      return result
    }
    async batchProxyPromise(bath) {
      let result = {};
      let primise = [];
      if (bath && bath instanceof Array) {
        for (let item of bath) {
          let p =  new Promise(async (resolve, reject) => {
            const httpResult= await this.proxyBatch(item.url, item.keys,item.desc, item.method);
            resolve({ key: item.keys, data:httpResult.data ,desc:item.desc});
          });
          primise.push(p);
        }
       await Promise.all(primise).then( (values)=> {
          values.map((item) => {
            result[item.key]={};
            let data=item.data.toString();
            if (this.isJSON(data)) data = JSON.parse(data);
            result[item.key]['data'] = data;
            result[item.key]['desc']=item.desc;
          })
        });
      }
      return result
    }
    queryParms(){
      let parms = this.ctx.originalUrl.split('?');
      let query = parms.length === 2 ? `?${parms[1]}` : ''
      return query;
    }
  }
  app.Controller = AbstractController
}