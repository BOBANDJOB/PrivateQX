/*

Terabox 会员状态响应体修改（仅供本地测试使用）

说明：
- 仅用于测试 QX 的 script-response-body 改写流程，观察 App 客户端对会员字段的展示反应。
- 只修改本机 App 收到的响应数据，不会改变服务端账号状态；
  下载速度、空间等真实权益由服务端按账号校验，不会因此生效。
- 同时处理两个接口，让客户端两套会员状态保持一致：
  1. /rest/2.0/membership/proxy/user  会员中心信息 member_info
     参照真实会员抓包：is_vip=1、is_vip_level=1、
     vip_end_time 为到期时间戳（秒）、vip_left_time 为剩余秒数。
  2. /api/user/getinfo  用户信息 records[].vip_type
     参照真实会员抓包：vip_type=2（客户端会缓存该值，并作为后续请求的 vip= 参数）。
- getinfo 的 request_id 超出 JS 安全整数范围，JSON.parse 会丢精度，
  因此该接口只用正则替换 vip_type，其余内容保持原样。
- 任何一步出错都会原样放行原始响应，不影响 App 正常使用。
- 修改前后的值都会写入 QX 日志（前缀 [TeraboxVIP]），方便对比。

[rewrite_local]

^https?:\/\/nephobox\.com\/(rest\/2\.0\/membership\/proxy\/user|api\/user\/getinfo) url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/refs/heads/main/Scripts/terabox/terabox_vip.js

[mitm]

hostname = nephobox.com

*/
var url = $request.url;
var body = $response.body;

try {
  if (url.indexOf("/membership/proxy/user") !== -1) {
    body = patchMembership(body);
  } else if (url.indexOf("/api/user/getinfo") !== -1) {
    body = patchGetinfo(body);
  }
} catch (e) {
  console.log("[TeraboxVIP] error: " + e + "，原样放行");
  body = $response.body;
}

// 修改成功则返回新内容，否则 body 仍为原始响应
$done({ body: body });

// 会员中心：修改 data.member_info
function patchMembership(raw) {
  var obj = JSON.parse(raw);
  var m = obj && obj.data && obj.data.member_info;
  if (!m) {
    console.log("[TeraboxVIP] membership: 未找到 data.member_info，原样放行");
    return raw;
  }

  console.log(
    "[TeraboxVIP] membership 原始: is_vip=" + m.is_vip +
    " level=" + m.is_vip_level +
    " vip_end_time=" + m.vip_end_time +
    " vip_left_time=" + m.vip_left_time
  );

  // 测试用到期时间：2099-12-31 23:59:59 (UTC+8)
  var end = 4102415999;
  var now = Math.floor(Date.now() / 1000);

  // 会员状态，与真实会员抓包保持一致
  m.is_vip = 1;
  m.is_vip_level = 1;
  m.vip_end_time = end;
  m.vip_left_time = end - now;
  // 真实会员抓包中该字段为 0，保持一致
  m.vip_end_time_without_grace = 0;

  // 关闭宽限期提示与续费相关展示
  m.show_grace_tips = 0;
  m.is_auto_renew = 0;
  m.can_cancel_renew = 0;
  m.can_trial = 0;

  // 到期提醒置空，避免 App 弹出"即将到期"
  if (obj.data.reminder) {
    obj.data.reminder.vip_expire_time = 0;
  }

  console.log(
    "[TeraboxVIP] membership 修改后: is_vip=" + m.is_vip +
    " level=" + m.is_vip_level +
    " vip_end_time=" + m.vip_end_time +
    " vip_left_time=" + m.vip_left_time
  );
  return JSON.stringify(obj);
}

// 用户信息：只替换 vip_type，避免 request_id 大整数被 JSON 处理丢精度
function patchGetinfo(raw) {
  var re = /("vip_type"\s*:\s*)(\d+)/g;
  var found = raw.match(re);
  if (!found) {
    console.log("[TeraboxVIP] getinfo: 未找到 vip_type，原样放行");
    return raw;
  }

  console.log("[TeraboxVIP] getinfo 原始: " + found.join(", "));
  // 真实会员抓包中 vip_type 为 2
  var out = raw.replace(re, function (_, key) { return key + "2"; });
  console.log("[TeraboxVIP] getinfo 修改后: vip_type=2 (" + found.length + " 处)");
  return out;
}
