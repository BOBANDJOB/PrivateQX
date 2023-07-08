/***********************************

> 应用名称：Bilibili大会员通用破解模板
> 软件版本：7.8.2
> 脚本作者：Cuttlefish
> 微信账号：墨鱼手记
> 解锁说明：解锁VIP番剧和影视
> 更新时间：2022-12-03
> 通知频道：https://t.me/ddgksf2021
> 贡献投稿：https://t.me/ddgksf2013_bot
> 问题反馈：ddgksf2013@163.com
> 特别提醒：如需转载请注明出处，谢谢合作！
> 特别说明：⚠️⚠️⚠️
          本脚本仅供学习交流使用，禁止转载售卖
          ⚠️⚠️⚠️


[rewrite_local]
  
# ～ Bilibili大会员（2022-12-05）@ddgksf2013
^http[s]?:\/\/((app|api)\.(\w{2,15})?\.(com|cn)).*player\.(v3|v2|v1).Play(URL|View).*$ url script-request-header BilibiliProCrack.js


[mitm] 

hostname=app.bilibili.com, grpc.biliapi.net,*.biliapi.net,app.bilibili.com,api.bilibili.com,api.live.bilibili.com,api.vc.bilibili.com,dataflow.biliapi.com,124.239.240.*,101.89.57.66, 218.94.210.66,240e:b1:9801:206:11:0:0:*

***********************************/

 


var modifiedHeaders = $request['headers'];
modifiedHeaders['Cookie'] = 'DedeUserID=339721502; DedeUserID__ckMd5=087e3691253aa6f2; SESSDATA=b64bba7f%2C1690201923%2Ccbac9112; bili_jct=ccc7ccd89e35d0e69ad0b67768cf182d; sid=5i30sv6o';
modifiedHeaders['x-bili-device-bin'] = 'CAEQpPWFIhokWUM0MzkxQ0I5RTM2REIyQjRGQTdBMEIzMkMzMDk3RkRGRjA5IgZpcGhvbmUqA2lvczIFcGhvbmU6BWFwcGxlQgVBcHBsZUoRaVBob25lIDEzIFBybyBNYXhSBDE2LjNqBjcuMTQuMHJAMzQ5NEI4MzlBQ0EyRDgzMEI4QjI0QkU1OEQ3QzhGOTcyMDE5MTAwMTE1MDYwMEY4OEUyQzk3RDdCQTBDRENGRnjMwMyq0TA=';
modifiedHeaders['Authorization'] = 'identify_v1 45e393de77578f046dcfcbac4ff58612';
modifiedHeaders['User-Agent'] = 'bili-universal/71400100 CFNetwork/1404.0.5 Darwin/22.3.0 os/ios model/iPhone 13 Pro Max mobi_app/iphone osVer/16.3 network/2';
modifiedHeaders['buvid'] = 'YC4391CB9E36DB2B4FA7A0B32C3097FDFF09';
modifiedHeaders['x-bili-metadata-bin'] = 'CiA0NWUzOTNkZTc3NTc4ZjA0NmRjZmNiYWM0ZmY1ODYxMhIGaXBob25lGgVwaG9uZSCk9YUiKgVhcHBsZTIkWUM0MzkxQ0I5RTM2REIyQjRGQTdBMEIzMkMzMDk3RkRGRjA5OgNpb3M=';
modifiedHeaders['x-bili-locale-bin'] = 'Eg4KAnpoEgRIYW5zGgJDTg==';
modifiedHeaders['x-bili-network-bin'] = 'CAE=';
modifiedHeaders['x-bili-fawkes-req-bin'] = 'CgZpcGhvbmUSBHByb2QaEGZmZmZmZmZmOTM5NWMyOTY=';
modifiedHeaders['x-bili-trace-id'] = 'da38c7a2d04e02caa792a719175159f7:a792a719175159f7:0:0';
modifiedHeaders['x-bili-exps-bin'] = 'CgIIAQ==';
$done({'headers': modifiedHeaders});
