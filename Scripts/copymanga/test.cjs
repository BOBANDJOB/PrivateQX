const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const requestCode=fs.readFileSync(__dirname+'/request.js','utf8'),responseCode=fs.readFileSync(__dirname+'/response.js','utf8');
const origin='https://www.mangacopy.com';
const mobile='Mozilla/5.0 (iPhone; CPU iPhone OS 27_2 like Mac OS X) Mobile/15E148';
const desktop='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Version/27.2 Safari/605.1.15';
async function run(code,request,response,replies=[]){
 const calls=[],done=[];let timers=[];
 const ctx={$request:request,$response:response,$task:{fetch:async options=>{calls.push(options);const r=replies.shift();if(r instanceof Error)throw r;return r||{statusCode:200,headers:{'Content-Type':'text/html'},body:'raw'};}},
 $done:value=>done.push(JSON.parse(JSON.stringify(value))),setTimeout:(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t;},clearTimeout};
 vm.runInNewContext(code,ctx);
 for(let i=0;i<12&&!done.length;i++)await new Promise(r=>setImmediate(r));
 timers.forEach(clearTimeout);assert.equal(done.length,1);return {result:done[0],calls};
}
const req=(ua=mobile,path='/__loon_copymanga__/fetch')=>({url:origin+path,method:'POST',headers:{'User-Agent':ua,Origin:origin,'Content-Type':'application/json',Cookie:'fixture=1'},body:JSON.stringify({url:origin+'/comic/book'})});
test('QX bridge maps fetch options, response envelope and same-host cookie',async()=>{
 const {result,calls}=await run(requestCode,req());assert.equal(result.status,'HTTP/1.1 200 OK');assert.equal(JSON.parse(result.body).data,'raw');assert.equal(calls.length,1);
 assert.equal(calls[0].headers.Cookie,'fixture=1');assert.match(calls[0].headers['User-Agent'],/Windows NT/);
 assert.equal(calls[0].opts.redirection,false);assert.equal(calls[0].opts['auto-cookie'],false);assert.equal(calls[0].opts['skip-cert-verify'],false);
});
test('network timeout stops after one QX fetch',async()=>{const {result,calls}=await run(requestCode,req(),undefined,[new Error('timeout')]);assert.equal(calls.length,1);assert.match(result.status,/502/);});
test('redirect is bounded and validated, restricted response is preserved',async()=>{
 let r=await run(requestCode,req(),undefined,[{statusCode:302,headers:{Location:'https://127.0.0.1/'},body:''}]);assert.equal(r.calls.length,1);assert.match(r.result.status,/502/);
 r=await run(requestCode,req(),undefined,[{statusCode:302,headers:{Location:'/comic/book/chapter/first'},body:''},{statusCode:210,headers:{},body:'restricted'}]);assert.equal(r.calls.length,2);assert.equal(JSON.parse(r.result.body).status,210);
});
test('desktop document, bridge, cache and manifest pass through without network',async()=>{
 for(const p of ['/comic/book/chapter/first','/h5/index','/__loon_copymanga__/fetch','/__loon_copymanga__/manifest.webmanifest']){
  const r=await run(requestCode,req(desktop,p));assert.deepEqual(r.result,{});assert.equal(r.calls.length,0);
  const d=await run(responseCode,{...req(desktop,p),method:'GET'},{statusCode:200,headers:{'Content-Type':'text/html'},body:'<html><head></head><body>native</body></html>'});assert.deepEqual(d.result,{});
 }
});
test('mobile QX injection produces byte-identical browser HTML to Loon',async()=>{
 const loon=fs.readFileSync(process.env.LOON_SOURCE+'/Scripts/copymanga/response.js','utf8');
 for(const p of ['/h5/index','/comic/book/chapter/first','/h5/comicContent/book/first']){
  const q={...req(mobile,p),method:'GET'},s={statusCode:200,headers:{'Content-Type':'text/html'},body:'<html><head></head><body>native</body></html>'};
  const a=await run(responseCode,q,s),b=await run(loon,q,s);assert.equal(a.result.body,b.result.body);assert.deepEqual(a.result.headers,b.result.headers);assert.equal(a.result.status,'HTTP/1.1 200 OK');
 }
});
test('QX manifest response and native cache request map correctly',async()=>{
 const manifest=await run(requestCode,{...req(mobile,'/__loon_copymanga__/manifest.webmanifest'),method:'GET'});assert.equal(JSON.parse(manifest.result.body).display,'standalone');
 const q=req(mobile,'/h5/index');q.method='GET';q.headers.Accept='text/html';q.headers['If-None-Match']='fixture';const r=await run(requestCode,q);assert.equal(r.result.headers['If-None-Match'],undefined);
});
test('bridge scope rejects login and external calls, POST comments keep one request',async()=>{
 for(const url of ['https://api.copy4000.com/api/v3/login','https://evil.test/']){const q=req();q.body=JSON.stringify({url});const r=await run(requestCode,q);assert.match(r.result.status,/403/);assert.equal(r.calls.length,0);}
 const q=req();q.body=JSON.stringify({url:'https://api.mangacopy.com/api/v3/member/roast',method:'POST',data:'roast=fixture'});const r=await run(requestCode,q);assert.equal(r.calls.length,1);assert.equal(r.calls[0].body,'roast=fixture');assert.equal(r.calls[0].headers.Cookie,undefined);
});

test('timeout ignores late redirect replies and completes only once',async()=>{
 let expire,resolve,calls=0;const completions=[];
 vm.runInNewContext(requestCode,{$request:req(),setTimeout:f=>{expire=f;return 1;},clearTimeout:()=>{},
  $task:{fetch:()=>{calls++;return new Promise(r=>resolve=r);}},$done:r=>completions.push(r)});
 expire();resolve({statusCode:302,headers:{Location:'/comic/book/chapter/first'},body:''});
 await new Promise(r=>setImmediate(r));assert.equal(calls,1);assert.equal(completions.length,1);assert.match(completions[0].status,/502/);
});
test('independent rewrite maps every script and separates request phases',()=>{
 const path=require('node:path');const file=path.resolve(__dirname,'../../Rewrites/CopyManga.conf');
 const rules=fs.readFileSync(file,'utf8').split('\n').filter(l=>l.startsWith('^'));
 assert.equal(rules.length,5);
 for(const rule of rules){const [pattern,,kind,url]=rule.split(' ');new RegExp(pattern);assert.ok(kind.startsWith('script-'));const local=url.split('/main/')[1].split('?')[0];assert.ok(fs.existsSync(path.resolve(__dirname,'../..',local)));}
 assert.match(rules.find(l=>l.includes('analyze-echo')),/fetch/);
 assert.match(rules.find(l=>l.includes(' url script-echo-response ')),/manifest/);
});
