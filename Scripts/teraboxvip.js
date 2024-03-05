/*
关键数据
^https:\/\/www\.(1024tera|terabox)\.(com|app)\/api\/user\/getinfo\? url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/teraboxvip.js

hostname = www.terabox.com, www.1024tera.com


*/
var objc = JSON.parse($response.body);
objc.records.vip_type = 1;
$done({body : JSON.stringify(objc)})