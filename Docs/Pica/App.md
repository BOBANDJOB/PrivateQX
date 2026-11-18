# 哔咔启动弹窗处理（Quantumult X）

已合并到原有 `Rewrites/Complement.conf` 的 B 分区，继续使用现有重写订阅：

```text
https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Rewrites/Complement.conf
```

无需新增订阅或修改主配置。更新「重写资源」中的 Complement 资源及对应脚本，确保重写与 MitM 已启用，再完全退出哔咔重开验证。现有资源设置为每周自动更新，立即测试时需要手动更新。

## 两段逻辑

- `GET https://api.tipatipa.xyz/banners`：仅当 HTTP 500、JSON `code` 为数值 500，且 `error` 完全等于 `Unexpected token < in JSON at position 0`，返回 HTTP 200 和成功的空横幅数组。正常响应及其他错误保持原样。
- `GET https://api.tipatipa.xyz/announcements?page=1`：仅当 HTTP 200、JSON `code` 为数值 200，且公告页码为 1、`docs` 为非空数组，将公告数组清空，`total` 和 `pages` 归零，保留页码、分页大小及其他字段。同一接口的第一页公告列表也会隐藏。

两条规则共用 `Scripts/pica.js`，并在 Complement 首行添加精确 MitM 域名 `api.tipatipa.xyz`。原来的 `manhuapica.com` 广告过滤继续保留。

## 迁移边界

- 来源为本人已实机确认解决弹窗的 Loon 版 `Scripts/pica/banners.js`、`Scripts/pica/announcements.js`。QX App 版此前已由用户反馈验证通过，本次保留已验证逻辑。
- QX 读取 `$response.statusCode`，改写状态使用 `$done({status: "HTTP/1.1 200 OK", headers, body})`，遵循 [QX 官方脚本示例](https://github.com/crossutility/Quantumult-X/blob/master/sample-rewrite-with-script.js)。
- 按官方说明，保留 QX 的 Content-Length、Content-Type、Content-Encoding 字段，由运行时处理；只更新缓存相关 Header。
- 分流继续使用已有 `Rules/Supplement.list` 中的哔咔规则及 `Auto` 策略，未迁入 Loon 的 `US` 策略名称。
- 不调整 QUIC、代理节点或其他接口，也不把两种客户端的资源组织方式混用。

## 本地验证

```sh
node --check Scripts/pica.js
node --test Scripts/pica.test.cjs
git diff --check
```

脚本测试覆盖命中、正常响应旁路、其他错误、URL / 方法 / 页码边界、状态格式及 QX Header 处理。迁移时另与 Loon 源码逐项比较了 JSON 改写和旁路行为。不包含抓包、账号或 Token。


资源分类见 [Pica 索引](README.md)，网页版独立重写见 [Web.md](Web.md)。本次不把已有 App 规则移出 Complement，保留家庭模板的原订阅入口。
