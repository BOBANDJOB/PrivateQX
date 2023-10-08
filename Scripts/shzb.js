
var objc = JSON.parse($response.body);
objc = {
  "status" : true,
  "ad" : {
    "active" : true,
    "info" : {
      "aid" : "ad_1018",
      "close_forever" : true
    },
    "image" : "https://img.picgo.net/2023/09/19/9F4B1FDB-C2D1-41DF-B0E3-C6E1730400E24d9ca50bcc3f33b8.th.jpeg",
    "url" : "https://t.me/appios520"
  }
}
$done({body : JSON.stringify(objc)})