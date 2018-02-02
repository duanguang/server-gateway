const {HttpConfig}=require('../../constants/httpConfig')
module.exports=app=>{
    class ConfigController extends app.Controller{
        // async search(){          
        //   let result= await this.batchProxyPromise([
        //       {keys:'bankAccount',method:'get',url:'http://transfer.banggood.cn:8088/purchase-pay/pay/getBankAccount'},
        //        {keys:'currenyRate',method:'get',url:'http://transfer.banggood.cn:8088/purchase-pay/external/getCurrenyRate'},
        //     ]) 
        //     this.success(result)    
        // }
        async mergeRequest(){
            const { body } = this.ctx.request;
            let result;
            if(body.hasKeys&&typeof body.hasKeys==='object'){
                const {currHasKey,preHasKey}=body.hasKeys;
                this.service.cache.del(preHasKey);
                if(currHasKey){
                    result=this.service.cache.get(currHasKey);
                    if(!result){
                        result = await this.batchProxy(body.parms)
                        this.service.cache.create(currHasKey,result);
                    }
                }
            }
            else{
                result = await this.batchProxy(body.parms)
            }
            this.success(result)
        }
        async show(){
            // console.log(`${this.ctx.params[0].replace(' ','')}${decodeURIComponent(this.queryParms())}`)
            let parms = this.ctx.originalUrl.split('?');
            let query = parms.length === 2 ? `${parms[1]}` : ''
            let queryList=query.split('&');
            let host='';
            let filter=queryList.filter((item)=>item.indexOf('host')<0).join('&');
            queryList.map((item)=>{
                if(item.indexOf('host')>-1){
                    host=decodeURIComponent(item.replace('host=',''));
                }
            })
            if(host){
                if(filter){
                    filter='?'+filter;
                }
                await this.proxy(`${host}${filter}`, 'get');
            }
            else{
                await this.proxy(`${this.ctx.params[0]}${this.queryParms()}`, 'get');
            }
            //await this.proxy(`${HttpConfig.domainCompliance}/${this.ctx.params[0]}${this.queryParms()}`, 'get');
           // this.success('未设置host')
        }
        async create(){
            const { body } = this.ctx.request;
            let error={success:true,message:'请设置转发接口',hasPermission:true,code:'',data:''};
            if(typeof body==='object'){
                if(body.host){
                    await this.proxy(body.host,'post')
                }else{
                    this.success(error)
                }
            }else{
                this.success(error)
                // await this.proxy(this.ctx.params[0],'post')
            }
        } 
    }
    return ConfigController;  
}