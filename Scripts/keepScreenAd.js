
/*
关键数据
^https:\/\/api\.gotokeep\.com\/op-engine-webapp\/v1\/configs url script-response-body https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/keepScreenAd.js
hostname：api.gotokeep.com



*/
var objc = JSON.parse($response.body);
objc.data.hotFeedSpotAdRequestMoment = 999999;
objc.data.homePageFeedSpotStep = 999999;
objc.data.splashAdLoadTimeLimit = 0;
objc.data.homePageFeedSpotAdRequestMoment = 999999;
objc.data.pugcLoadPostPreRolls = false;
objc.data.courseAdLoadTimeLimit = 0;
objc.data.courseInterstitialShowMaxTimes = 0;
objc.data.hotFeedFindSpotAdRequestMoment = 999999;
objc.data.feedDetailSpotStep = 999999;
objc.data.followFeedSpotAdRequestMoment = 999999;
objc.data.feedAdLoadTimeLimit = 0;
objc.data.homePage_8_FeedSpotStep = 999999;
objc.data.homePage_8_FeedSpotAdRequestMoment = 999999;
objc.data.splashWarmAdRequestInterval = 999999;
objc.data.followFeedSpotStep = 999999;
objc.data.hotFeedRecommendSpotStep = 999999;
objc.data.hotFeedRecommendSpotAdRequestMoment = 999999;
objc.data.hotFeedFindSpotStep = 999999;
objc.data.feedDetailSpotAdRequestMoment = 999999;
objc.data.hotFeedSpotStep = 999999;
objc.data.feedInteractionAdShadowTime = 999999;
$done({body : JSON.stringify(objc)})
