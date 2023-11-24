/*
关键数据
^https:\/\/www\.(1024tera|terabox)\.com\/api\/ad\/getconfig\? url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/terabox.js

hostname = www.terabox.com, www.1024tera.com


*/
var objc = JSON.parse($response.body);
objc.data.open_app_switch = 1;
objc.data.all_ad_close = 1;
objc.data.hot_start_time_limit_minute = 0;
objc.data.home_card_ad_closed_interval = 0;
objc.data.home_card_switch = 0;
objc.data.home_card_ad_click_close_invalid = 0;
objc.data.all_ad_close = 1;
$done({body : JSON.stringify(objc)})