/*
关键数据
^https:\/\/www\.(1024tera|terabox)\.(com|app)\/api\/user\/getinfo\? url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/teraboxvip.js

hostname = www.terabox.com, www.1024tera.com


*/
var objc = JSON.parse($response.body);
objc.records[0].vip_type = 3;
$done({body : JSON.stringify(objc)})