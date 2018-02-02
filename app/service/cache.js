const LRU=require('lru-cache');
const DEFAULT_MAX_AGE = 1000*60*60*24*7
const options = {
  max: 500,
  // length: function (n, key) { return n * 2 + key.length },
  // dispose: function (key, n) { n.close() },
  maxAge: DEFAULT_MAX_AGE
}
const Cache = LRU(options)

module.exports=app=>{
    class CacheService extends app.Service{
       create(key,value,maxAge=DEFAULT_MAX_AGE){
           return Cache.set(key,value,maxAge)
       }
       get(key){
          return Cache.get(key); 
       }
       del(key){
           return Cache.del(key);
       }
       has(key){
           return Cache.has(key);
       }
       reset(){
           Cache.reset();
       }
       CacheSingleton(){
           return Cache;
       }
    }
    return CacheService;
}