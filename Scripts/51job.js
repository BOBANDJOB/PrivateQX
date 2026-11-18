/*
关键数据
^https:\/\/appapi\.51job\.com\/api\/market\/get_launch\.php\?productname=51job&version=\d{2}\.\d\.\d&format=json&partner=[a-z0-9]{32}&uuid=[a-z0-9]{32}&guid=[a-z0-9]{32} url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/51job.js
hostname：appapi.51job.com



*/
var objc = JSON.parse($response.body);
// 循环遍历objc.resultbody.person数组
objc.resultbody?.person?.forEach(function(ad) {
  // 广告链接
  ad.imgurl = "";
  // 将每个广告对象的isshowad属性设置为'0'
  ad.isshowad = '0';
});
$done({body : JSON.stringify(objc)})