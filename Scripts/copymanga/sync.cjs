// Generate the QX adapter from the validated Loon implementation; no browser-code fork.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const source=process.argv[2];
if(!source)throw Error('Usage: node sync.cjs /path/to/Loon [--check]');
const root=__dirname,check=process.argv.includes('--check');
const prelude=`// SPDX-License-Identifier: GPL-3.0-or-later
// Generated QX adapter. Source: BOBANDJOB/Loon, copymanga 20261117h.
// Desktop browser UA bypass is preserved; use Tampermonkey on Mac.
`;
const adapter=`
})(function (result) {
    if (!result.response) return $done(result);
    const response = result.response;
    const reasons = {200:'OK',400:'Bad Request',403:'Forbidden',405:'Method Not Allowed',502:'Bad Gateway',504:'Gateway Timeout'};
    $done({status:'HTTP/1.1 '+response.status+' '+(reasons[response.status] || 'Error'),headers:response.headers,body:response.body});
}, Object.fromEntries(['get','post'].map(method => [method, function(options, callback) {
    // QX uses its native network timeout; this timer caps the total bridge budget.
    // Do not replay a failed request. A late completion cannot start another redirect.
    let settled = false;
    const finish = (error, response, body) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        callback(error, response, body);
    };
    const timer = setTimeout(() => finish('bridge timeout'), options.timeout);
    const request = {url:options.url,method:method.toUpperCase(),headers:options.headers,
        opts:{redirection:false,'auto-cookie':false,'skip-cert-verify':false}};
    if (options.body !== undefined) request.body = options.body;
    try {
        $task.fetch(request).then(response => finish(null,{status:response.statusCode,headers:response.headers},response.body),
            error => finish(error && error.error || 'network error'));
    } catch (error) { finish('network error'); }
}])));
`;
const request=fs.readFileSync(path.join(source,'Scripts/copymanga/request.js'),'utf8');
const response=fs.readFileSync(path.join(source,'Scripts/copymanga/response.js'),'utf8');
const files={
 'request.js':prelude+'(function ($done, $httpClient) {\n'+request+adapter,
 'response.js':prelude+'(function ($done) {\n'+response+`\n})(function(result) {
    if (result.body !== undefined) result.status = 'HTTP/1.1 200 OK';
    $done(result);
});\n`,
 'LICENSE':fs.readFileSync(path.join(source,'Scripts/copymanga/LICENSE'),'utf8'),
 'source.json':JSON.stringify({repository:'https://github.com/BOBANDJOB/Loon',revision:'cd6e907',version:'20261117h',sha256:{request:crypto.createHash('sha256').update(request).digest('hex'),response:crypto.createHash('sha256').update(response).digest('hex')}},null,2)+'\n'
};
for(const [name,text]of Object.entries(files)){
 if(check){if(fs.readFileSync(path.join(root,name),'utf8')!==text)throw Error('Generated file differs: '+name);}
 else fs.writeFileSync(path.join(root,name),text);
}
console.log(check?'Generated sources match Loon':'Generated QX adapter');
