# 哔咔 Pica 网页版（Quantumult X）

针对 `manhuapica.com`。来源为已由用户实机确认解决反复更新提示的 Loon 实现，并同步本次章末广告容器隐藏；QX 版完成离线迁移验证，尚待 QX 实机验证。

## 资源与配置

- [重写 Web.conf](https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Rewrites/Pica/Web.conf)：原生 QX 格式，`opt-parser=false`，建议 `inserted-resource=true`。
- [分流 Web.list](https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Rules/Pica/Web.list)：四个精确主机，不带策略列；按本仓库约定用 `force-policy=Auto, opt-parser=true, inserted-resource=true`。
- 脚本在 `Scripts/pica-web/`；个人配置中的新资源排在对应 remote 区段前面，既有条目的相对顺序保留。
- 主配置需要 `Auto` 策略，重写及 MitM 已开启、QX 证书已安装并信任。四个 MitM 主机在重写资源首行声明，不改个人证书和已有排除域名。

资源订阅行：

```ini
[filter_remote]
https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Rules/Pica/Web.list, tag=哔咔网页分流, img-url=https://raw.githubusercontent.com/BOBANDJOB/Loon/main/Icons/app/pica-web-round.png, force-policy=Auto, update-interval=604800, opt-parser=true, inserted-resource=true, enabled=true

[rewrite_remote]
https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Rewrites/Pica/Web.conf, tag=哔咔网页去广告, img-url=https://raw.githubusercontent.com/BOBANDJOB/Loon/main/Icons/app/pica-web-round.png, update-interval=604800, opt-parser=false, inserted-resource=true, enabled=true
```

以上是两个区段内的订阅示例，合并到已有区段，不重复创建区段。当前个人配置已由本次迁移同步添加。

## 与 Loon 一致的行为

| 入口 | 行为 |
| --- | --- |
| 广告主机 `/get-ad-zones` | GET、HTTP 200、数值 code 200、非空 zones 才清空广告位；其他字段保留 |
| 两个网页 API 主机 `/announcements` | GET、HTTP 200、数值 code 200、第一页非空 docs 才清空 docs / total / pages；普通站务公告第一页也隐藏 |
| `/sw.js`、PWA 注册模块及漫画模块的请求 | 移除条件缓存请求头，取得可改写正文；Cookie、鉴权及其他字段保留 |
| `/sw.js` 响应 | 仅修改注册模块和漫画模块的两个 precache revision；其余清单不改、不清除站点存储 |
| 入口 JS 与 PWA 注册模块 | 关闭已识别的更新通知；注册模块注入主页轮播与章末广告容器的隐藏样式，收起加载动画和广告错误占位 |

GET、状态、精确主机和路径、未知代码结构的旁路条件与 Loon 保持一致。漫画、推荐、收藏、登录错误与其他页公告保持原始行为。未知构建放行，不猜测新代码结构。

浏览器缓存 revision 刻意沿用 `loon-pwa-quiet-20261116d-<原模块hash>`，页面模块的修改后字节也与 Loon 相同。这里的 loon 是共享标识，不代表 QX 运行时依赖 Loon；两端使用同一 Safari 站点数据时可复用缓存，避免仅因为切换代理客户端就制造新版本。

## QX 平台适配

读取 `$response.statusCode`，成功返回状态使用 `HTTP/1.1 200 OK`。按 [QX 官方示例](https://github.com/crossutility/Quantumult-X/blob/master/sample-rewrite-with-script.js) 保留 Content-Length / Content-Type / Content-Encoding 及其他非缓存 Header，交由 QX 运行时处理长度与编码；与 Loon 的 Header 清理方式不同。

请求阶段用 `script-request-header`，正文阶段用 `script-response-body`。相同 URL 的两个阶段分别执行，响应规则之间的入口互不重叠。脚本没有调用 `$prefs`，持久状态来自 Safari 的 Service Worker 与 Cache Storage。

## 使用与验证

更新 QX 配置及两个新资源，重新打开网页。若 Safari 此前已经应用同版本 Loon 补丁，可直接复用已缓存模块，不一定重新下载；这种情况下页面正常不等于已实机确认 QX 脚本命中。

首次迁移旧缓存时，旧页面可能最后弹一次确认。等新的 SW 与注册模块下载后，点击「好」激活，或关闭该站全部标签页及主屏幕 Web App 后重开。随后复测 Safari 冷启动、首页加载框和漫画阅读。无需先清除网站数据或重新登录。

若仍反复提示，先检查 `/sw.js` 是否为 200、预缓存清单中的注册模块是否带固定 revision、注册模块是否经过脚本修改；304 没有可改写正文。不要把无正文抓包当作已执行补丁的证据。

## 本地验证

上一版 App 原有 8 项测试与网页 11 项测试共 19 项通过。网页测试含 146 组与 Loon 的对照：目标、旁路与错误状态的正文结果一致，请求头处理一致；HTTP 状态及响应 Header 的平台差异单独验证。注册模块的 waiting / external 通知不再调用提示、正常离线回调和手动激活继续工作，首页样式只注入一次。

```sh
node --check Scripts/pica-web/response.js
node --check Scripts/pica-web/announcements.js
node --check Scripts/pica-web/pwa-cache.js
node --check Scripts/pica-web/pwa-update.js
node --check Scripts/pica-web/content.js
node --test Scripts/pica.test.cjs Scripts/pica-web/*.cjs
```

不设置 `PICA_LOON_ROOT` 时，对照项会跳过，其余测试不依赖兄弟仓库。原始 HAR、账号信息和个人完整配置不进入 Git。验证记录区分 Loon 实测通过与 QX 尚待实机验证。

章末广告占位：对截图已定位的 `chapter-navigation__ad` 使用 display:none，连错误提示及其空白一起收起。此容器与章节导航按钮、页码互为独立子节点；不隐藏整个 chapter-navigation，保留漫画图片错误提示；本轮进一步取消穿插广告页，见后文。Loon / QX 使用同一 CSS，新增项待实机复测。

归档网页 HAR 本地回放：93 条记录、372 组响应对照和 93 组请求头对照全部与 Loon 一致。公开入口模块、注册模块和 SW 的改写正文也逐字节一致，完整模块语法检查通过。个人抓包仅从本地归档读取，没有进入本仓库。

网页版资源图标使用用户指定的圆形 PNG，与 Loon Web 插件共用同一图片地址；App 图标不变。

## 阅读穿插与收藏列表广告（20261116d）

新增 `content.js`，对当前漫画模块中 9 处广告插入 / 页码模型代码进行整体匹配后修改：列表及网格不再插入广告卡片；单页、双页、瀑布流不再增加广告页。瀑布流总数、可见范围和跳页索引同步移除广告偏移，保留真实图片、图片错误和章节导航。未知构建放行，避免半套索引算法混用。

SW 仅更新注册模块、漫画模块两个 precache revision；两端继续使用相同缓存版本和相同修改后字节。实际 Workbox 验证只重取这两项，相同清单再次安装零下载。QX 共 26 项测试通过，包含原有 146 组对照与新增分页边界 / 卡片顺序测试；当前真实模块的两端输出一致且语法检查通过。

移除合成广告页后总页数以真实图片计数，不删除历史记录；旧会话虚拟位置不会热迁移。更新重写资源后关闭该站旧标签页及 Web App，再重新进入。当前 QX / Loon 新增项均待手机实测。

## 独立 Web App 顶部模糊（20261117a）

上一版 e 的导航加高经用户实测不理想，已撤回。本版恢复原导航的高度、位置及显隐，只移除根页面/index.html HTML 中唯一的 black-translucent 状态栏 meta。WebKit 维护回复指出该旧模式应移除，见 [官方回复](https://bugs.webkit.org/show_bug.cgi?id=317153#c2)。实际设备是否由同一平台问题触发仍未确认，修复效果待手机验证。

新增 document.js 使用精确域名、GET、200、HTML MIME 和 PicaWeb/manifest 保护；页面其余内容逐字节保留。HTML 与注册模块缓存更新到固定 20261117a，漫画模块继续用 d；真实 90 条 SW 清单与 Workbox 检查只重新下载 HTML、注册模块两项，重复安装零请求。不强制刷新阅读、不清账号数据、不加导航高度或正文留白。

35 项 QX、52 项 Loon 测试通过，包含 HTML 改写/头部保护及迁移边界，两端浏览器正文一致。Web.conf 现在为一条请求处理、六条响应处理，订阅地址不变。更新后关闭该站旧页面与 Web App 再打开；旧主屏幕入口若仍保留安装时的状态栏效果，从更新后的 Safari 首页新增入口对照，保留旧入口数据。
