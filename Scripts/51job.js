/*
关键数据
^https:\/\/appapi\.51job\.com\/api\/market\/get_launch\.php\?productname=51job&version=\d{2}\.\d\.\d&format=json&partner=[a-z0-9]{32}&uuid=[a-z0-9]{32}&guid=[a-z0-9]{32} url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/51job.js
hostname：appapi.51job.com



*/
var objc = JSON.parse($response.body);

objc = {
  "result" : "1",
  "status" : "1",
  "resultbody" : {
    "person" : [
      {
        "imgurl" : "https://img01.51jobcdn.com/im/mkt/tg/2023banner/kp_qf/1080_1890.jpg",
        "jumptype" : "",
        "startdate" : "1695398400",
        "adid" : "37923112",
        "isshowad" : "0",
        "enddate" : "1695398400",
        "url" : ""
      },
      {
        "imgurl" : "https://img01.51jobcdn.com/im/mkt/tg/2023banner/kp_ymn/bujuanxin/1080_1890.jpg",
        "jumptype" : "inurl",
        "startdate" : "1695312000",
        "adid" : "37919415",
        "isshowad" : "0",
        "enddate" : "1695312000",
        "url" : "qiancheng://home/show_webpage?enablevar=1&url=https%3A%2F%2Fappapi.51job.com%2Fapi%2Fauth%2Fget_auth_login.php%3Flogintype%3D51job%26uuid%3D%25uuid%25%26accountid%3D%25accountid%25%26key%3D%25key%25%26url%3Dhttp%253A%252F%252Ftrace.51job.com%252Fmktrace.php%253Ftag%253Dqw_ymzc_51appkjp%2526u%253DaHR0cDovL20uNTFqb2IuY29tL2FjdGl2aXR5L3B1c2hscC9pbmRleC5waHA%252FcHVzaGxwX3R5cGU9MTkmYW1wO3BhcnRuZXI9cXdfeW16Y181MWFwcGtqcA%253D%253D%2526k%253De9fcb86234480db5695ed0bb89965a1d"
      }
    ]
  }
}
$done({body : JSON.stringify(objc)})