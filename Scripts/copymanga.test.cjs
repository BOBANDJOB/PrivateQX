const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'copymanga.js'),'utf8');
const url='https://api.copy4000.com/api/v3/system/config/2020/1';
function run(request={},response={}) { const done=[];vm.runInNewContext(source,{$request:{url,method:'GET',...request},$response:{statusCode:200,body:JSON.stringify({results:{code:'fixture',other:1},unchanged:true}),...response},$done:v=>done.push(JSON.parse(JSON.stringify(v)))});assert.equal(done.length,1);return done[0]; }
test('clears only results.code and preserves all other data',()=>{assert.deepEqual(JSON.parse(run().body),{results:{code:'',other:1},unchanged:true});});
test('non-GET and non-200 responses pass through',()=>{for(const method of ['POST','HEAD','OPTIONS'])assert.deepEqual(run({method}),{});for(const statusCode of [204,304,401,500,'200'])assert.deepEqual(run({},{statusCode}),{});});
test('similar paths, query strings, other hosts and schemes pass through',()=>{for(const candidate of [url+'/',url+'?x=1',url.replace('/2020/1','/2020/2'),url.replace('api.copy4000.com','api.mangacopy.com'),url.replace('https:','http:'),url.replace('.com/','.com.evil.test/')])assert.deepEqual(run({url:candidate}),{});});
test('malformed JSON and absent fields pass through',()=>{for(const body of ['', 'null','{}','{"results":null}','{"results":{}}','<html>error</html>'])assert.deepEqual(run({},{body}),{});});
test('existing empty code stays empty and other fields are retained',()=>{assert.deepEqual(JSON.parse(run({},{body:'{"results":{"code":"","value":false}}'}).body),{results:{code:'',value:false}});});
test('Mac/Windows/Linux/ChromeOS desktop browser requests pass through without parsing the body',()=>{
 for(const agent of ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Version/27.2 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/143.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)','Mozilla/5.0 (X11; Linux x86_64)','Mozilla/5.0 (X11; CrOS aarch64)'])
  for(const key of ['User-Agent','user-agent','USER-AGENT'])assert.deepEqual(run({headers:{[key]:agent}}),{});
});
test('mobile and native clients retain announcement cleanup without mistaking iPhone for Mac',()=>{
 for(const agent of ['Mozilla/5.0 (iPhone; CPU iPhone OS 27_2_1 like Mac OS X) Mobile/15E148',
  'Mozilla/5.0 (iPad; CPU OS 27_2 like Mac OS X) Mobile/15E148',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Mobile/15E148',
  'Mozilla/5.0 (Linux; Android 15) Mobile','COPY/3.0.6'])
  assert.equal(JSON.parse(run({headers:{'User-Agent':agent}}).body).results.code,'');
});
test('explicit backend failures including code 210 are never changed to success',()=>{
 for(const code of [210,401,403,500])assert.deepEqual(run({},{body:JSON.stringify({code,message:'server refusal',results:{code:'keep'}})}),{});
 assert.equal(JSON.parse(run({},{body:'{"code":200,"results":{"code":"announcement"}}'}).body).results.code,'');
});
test('current rewrite has one exact owner, script and hostname',()=>{const file=path.join(__dirname,'../Rewrites/CopyManga.conf');if(!fs.existsSync(file))return;const config=fs.readFileSync(file,'utf8');assert.equal((config.match(/Scripts\/copymanga\.js/g)||[]).length,1);assert.match(config.split('\n')[0],/api\.copy4000\.com/);const rule=config.split('\n').find(s=>s.includes('Scripts/copymanga.js'));const pattern=new RegExp(rule.split(' ')[0]);assert.ok(pattern.test(url));assert.ok(!pattern.test(url+'?x=1'));});

test("Complement no longer duplicates the announcement",()=>{assert.doesNotMatch(fs.readFileSync(path.join(__dirname,"../Rewrites/Complement.conf"),"utf8"),/Scripts\/copymanga\.js/);});
