/*
^https:\/\/api\.go2778\.com\/announcements\?page=1 url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/BicaScreenAd.js
hostname：api.go2778.com

*/
var objc = JSON.parse($response.body);
objc.data.announcements.docs = [];
$done({body : JSON.stringify(objc)})