# 拷贝漫画增强（Quantumult X）

2026-11-17：从已通过用户 iPhone / 美国 VPS 验证的 Loon cd6e907（20261117h）迁移。QX 尚待实机验证；不能据一次成功保证服务端永不返回 210。

## 安装与分工

订阅：[Rewrites/CopyManga.conf](../Rewrites/CopyManga.conf)。它统一提供首页公告、页面缓存处理、阅读器注入和同源请求桥接。公告从 Complement 的 K 分区移出；只订阅 Complement 的其他配置需要额外添加本重写，家庭模板没有自动修改或发布。

桌面浏览器（Macintosh / Windows NT / X11 / CrOS，且不带 Mobile 等移动标志）原样透传，使用 Tampermonkey。手机启用此重写后不要同时运行同站油猴阅读器。iPad 桌面 UA 无 Mobile 时也会透传。这是按请求 UA 分工，不是检测 QX 运行在哪种机器；MitM 和分流仍由 QX 配置控制。

手机 Web App 与 Safari 均使用同一阅读器：目录、页码设置、双页图片分类、返回处理及顶部适配均复用 Loon，不重新实现。主屏幕入口在安装元数据改变后可能需要重新添加。

## 请求与平台差异

网页内容由桥接读取桌面章节页面，读取页面提供的动态 dnts，成功但解析失败时沿用上游旧 API 回退。网络错误、超时、HTTP 错误或 code 210 停止当前加载，不自动重试或切换旧 API。登录接口不在桥接允许范围内，不改写登录或伪造成功响应。图片自身的有限重载保持源版。

QX 使用 $task.fetch，保持证书校验、关闭自动重定向，逐跳检查允许地址；Cookie 只回传同主机。使用 QX 默认 HTTP 超时（官方示例为 10 秒），同时以 24 秒限制整条桥接等待；浏览器等待上限 28 秒。QX 没有在本适配中使用未经文档确认的自定义 HTTP timeout 参数，不能宣称与 Loon 的 24 秒底层超时完全一致。定时结束后忽略迟到结果，不再重定向或重试；这不等于取消已经发出的底层请求。

建议 QX build 934 或更高：[官方请求示例](https://github.com/crossutility/Quantumult-X/blob/master/sample-task.js)说明 auto-cookie 关闭选项从该版本支持；更旧版可能自动管理 Cookie，无法保证一致。桥接使用 [官方配置示例](https://github.com/crossutility/Quantumult-X/blob/master/sample.conf)的 script-analyze-echo-response 等待请求正文，清单使用 script-echo-response。

## 同步与验证

Scripts/copymanga/response.js 的网页注入代码与 Loon 20261117h 完全相同，仅外层 $done 做 QX 适配。request.js 用薄适配层映射 $httpClient 到 $task.fetch。源哈希见 source.json。保留内部 __loon_copymanga__ 名称以避免改变已安装的 Web App ID / scope。

更新源后运行（显式传入本地 Loon 路径，不把个人路径写入仓库）：

```sh
node Scripts/copymanga/sync.cjs /path/to/Loon
node Scripts/copymanga/sync.cjs /path/to/Loon --check
LOON_SOURCE=/path/to/Loon node --test Scripts/copymanga/test.cjs
node --test Scripts/copymanga.test.cjs
```

离线测试覆盖 QX 返回结构、请求参数、Cookie 隔离、错误停止、重定向边界、桌面透传，以及 QX/Loon 注入 HTML 逐字一致。实机需验证阅读超过 5 页、目录、章节返回、双页、登录和 Mac Tampermonkey 共存。

## 致谢与许可

原作：[Byaidu / JirachiZhang copymanga-helper 12.4](https://github.com/Byaidu/copymanga-helper)。感谢 [hymbz / ComicRead](https://github.com/hymbz/ComicReadScript) 提供图片分类思路；未复制其源码。适配：BOBANDJOB。按 GPL-3.0-or-later 发布，许可见 Scripts/copymanga/LICENSE；详细原作说明保留在 [Loon 文档](https://github.com/BOBANDJOB/Loon/tree/main/Scripts/copymanga)。
