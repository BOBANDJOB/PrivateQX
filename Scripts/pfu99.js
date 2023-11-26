/*
pfu短视频开屏
^https:\/\/welfare\.yuheng\.best\/api\/series3\/decrypt url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/pfu99.js


hostname = welfare.yuheng.best


*/
var objc = JSON.parse($response.body);
objc.data.adsTimeLongVideo = 0;
$done({body : JSON.stringify(objc)})