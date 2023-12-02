
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
// objc = {
//   "version" : "1.0.0",
//   "errorCode" : 0,
//   "data" : {
//     "hotFeedSpotAdRequestMoment" : "2",
//     "homePageFeedSpotStep" : "8",
//     "feedDetailSpotInitialFixedPosition" : "2",
//     "spotShowReport" : "https://api.gotokeep.com/op-monitor-webapp/spotshow?spotId=__SPOTID__&os=1",
//     "splashAdLoadTimeLimit" : "0",
//     "homePageFeedSpotAdRequestMoment" : "2",
//     "homePageFeedSpotInitialFixedPosition" : "4",
//     "pugcLoadPostPreRolls" : "false",
//     "courseAdLoadTimeLimit" : "0",
//     "courseInterstitialShowMaxTimes" : "0",
//     "hotFeedSpotInitialFixedPosition" : "2",
//     "hotFeedFindSpotAdRequestMoment" : "4",
//     "upGlideDegreeThreshold" : "30",
//     "hotFeedRecommendDynamicSpotPosition" : "12",
//     "feedDetailSpotStep" : "6",
//     "followFeedSpotAdRequestMoment" : "2",
//     "feedAdLoadTimeLimit" : "0",
//     "pugcPreLoadEarlySeconds" : "0",
//     "shakeAccelerationThreshold" : "15",
//     "homePage_8_FeedSpotStep" : "8",
//     "upGlideAccelerationThreshold" : "0",
//     "hotFeedFindSpotInitialFixedPosition" : "2",
//     "slideScreenPercent" : "0.125",
//     "eventPushToken" : "3*@lld--=Ddd1ddf3>,?s[]||$%@wqw",
//     "aliHCSpotConfig" : "{\n    \"100000\": {\n        \"dspDeliveryId\": \"281\",\n        \"dspSpotId\": \"71\",\n        \"aliHC_iOS_ID\": \"10001501\",\n        \"aliHC_Android_ID\": \"10001499\",\n        \"price\": \"500\",\n        \"templateType\": \"splash\"\n    },\n    \"1000010\": {\n        \"dspDeliveryId\": \"282\",\n        \"dspSpotId\": \"72\",\n        \"aliHC_iOS_ID\": \"10001503\",\n        \"aliHC_Android_ID\": \"10001500\",\n        \"price\": \"0\",\n        \"templateType\": \"feed-single-image\"\n    },\n    \"1000011\": {\n        \"dspDeliveryId\": \"282\",\n        \"dspSpotId\": \"72\",\n        \"aliHC_iOS_ID\": \"10001503\",\n        \"aliHC_Android_ID\": \"10001500\",\n        \"price\": \"0\",\n        \"templateType\": \"feed-single-image\"\n    },\n    \"1000020\": {\n        \"dspDeliveryId\": \"282\",\n        \"dspSpotId\": \"72\",\n        \"aliHC_iOS_ID\": \"10001503\",\n        \"aliHC_Android_ID\": \"10001500\",\n        \"price\": \"0\",\n        \"templateType\": \"feed-single-image\"\n    }\n}",
//     "followFeedDynamicSpotPosition" : "16",
//     "shakeDegreeThreshold" : "35",
//     "followFeedSpotInitialFixedPosition" : "4",
//     "hotFeedRecommendSpotFixedPositionSecond" : "8",
//     "slideDegreeThreshold" : "70",
//     "magazineDegreeThreshold" : "30",
//     "homePage_8_FeedSpotAdRequestMoment" : "4",
//     "homePageFeedDynamicSpotPosition" : "16",
//     "upGlideAttitudeThreshold" : "10",
//     "homePageFeedSpotFixedPositionSecond" : "10",
//     "splashWarmAdRequestInterval" : "60000",
//     "hotFeedRecommendSpotInitialFixedPosition" : "4",
//     "closeConfirmButtonText" : "不喜欢该内容",
//     "adTimeoutReport" : "https://api.gotokeep.com/op-monitor-webapp/timeout?spotId=__SPOTID__&message=__MESSAGE__",
//     "followFeedSpotStep" : "14",
//     "hotFeedDynamicSpotPosition" : "12",
//     "pugcStepMaxSeconds" : "21",
//     "pugcThresholdPercent" : "30",
//     "hotFeedRecommendSpotStep" : "6",
//     "hotFeedFindSpotFixedPositionSecond" : "6",
//     "feedDetailSpotFixedPositionSecond" : "8",
//     "presentationPriority" : "2",
//     "homePage_8_FeedSpotInitialFixedPosition" : "6",
//     "homePage_8_FeedDynamicSpotPosition" : "18",
//     "homePage_8_FeedSpotFixedPositionSecond" : "12",
//     "shakeTimeThreshold" : "3000",
//     "hotFeedRecommendSpotAdRequestMoment" : "2",
//     "hotFeedFindDynamicSpotPosition" : "12",
//     "closeButtonStyle" : "more",
//     "followFeedSpotFixedPositionSecond" : "10",
//     "hotFeedFindSpotStep" : "10",
//     "hotFeedSpotFixedPositionSecond" : "6",
//     "feedDetailSpotAdRequestMoment" : "4",
//     "pugcStepMinSeconds" : "9",
//     "hotFeedSpotStep" : "10",
//     "feedInteractionAdShadowTime" : "0",
//     "feedDetailDynamicSpotPosition" : "14",
//     "aliHCMinPrice" : "200"
//   },
//   "now" : "2023-11-16T07:30:46.196Z",
//   "ok" : true,
//   "text" : ""
// }
$done({body : JSON.stringify(objc)})
