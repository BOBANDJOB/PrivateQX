# Pica 资源

| 用途 | 重写 | 分流 | 说明 |
| --- | --- | --- | --- |
| 原生 App | 已包含在 [Complement.conf](../../Rewrites/Complement.conf) | 原有 Supplement 中的哔咔段 | [App.md](App.md) |
| 网页版 | [Pica/Web.conf](../../Rewrites/Pica/Web.conf) | [Pica/Web.list](../../Rules/Pica/Web.list) | [网页、阅读及列表广告清理](Web.md) |

QX 将重写与分流分成两种资源；个人配置已经分别订阅网页资源。两者都添加后才能同时保证网页配置可改写及业务分流。

App 的 Complement 入口与 Supplement 分流还被家庭模板使用，因此继续保留这些地址和规则。网页版作为独立资源启停，不复制一套 App 规则，也不新增重复的 App 订阅。

本次把说明从 Rewrites 移到 Docs，原来的 `Rewrites/Pica.md` 与 `Rewrites/RewriteNotes.md` 文档地址已移除；订阅文件的旧地址均保持可用。全部重写资源见 [索引](../Rewrites.md)。
