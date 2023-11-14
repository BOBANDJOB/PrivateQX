/*
关键数据
^https:\/\/www\.terabox\.com\/api\/ad\/getconfig\? url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/terabox.js

hostname = www.terabox.com


*/
var objc = JSON.parse($response.body);
objc = {
  "errno" : 0,
  "data" : {
    "privilege_infos" : [

    ],
    "open_app_switch" : 1,
    "block_ad_close" : 1,
    "hot_start_time_limit_minute" : 0,
    "exp" : {
      "hit_member_new" : false,
      "hit_share_link_ad_touch" : false,
      "new_reward_video_internal" : false,
      "hit_new_reward_video" : true,
      "upload_video" : true
    },
    "home_card_ad_closed_interval" : 0,
    "home_card_switch" : 0,
    "home_card_ad_click_close_invalid" : 0,
    "all_ad_close" : 1,
    "reward_ads" : [
      {
        "id" : 1,
        "user_can_use" : 10,
        "name" : "gaoqingshiping",
        "switch" : 0
      },
      {
        "id" : 2,
        "user_can_use" : 10,
        "name" : "beisubofang",
        "switch" : 0
      },
      {
        "id" : 3,
        "user_can_use" : 1000,
        "name" : "gaosuxiazai",
        "switch" : 0
      }
    ]
  },
  "show_msg" : "",
  "newno" : "",
  "request_id" : 459310679559274129
}
$done({body : JSON.stringify(objc)})