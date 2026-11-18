# 重写索引

2026-11-17 整理，共 11 个重写资源文件；文件存在不表示当前配置启用。

- [Pica 分类](Pica/README.md)：App 保留 Complement 兼容入口，网页资源单独放 `Rewrites/Pica/`。
- [拷贝漫画](CopyManga.md)：独立 CopyManga.conf 统一公告与移动阅读增强，桌面透传。
- [重写语法笔记](RewriteNotes.md)。
- `Rewrites/` 只存订阅文件；说明统一放 `Docs/`，新建多资源项目使用子目录。
- 既有订阅 URL 保持可用，不统一改名或扩展名。Complement 的拷贝漫画公告已迁至独立订阅；Supplement 和其他应用规则不变。
- `Scripts/` 存运行脚本，`Rules/` 存分流；`.local/` 是忽略的本地验证缓存和配置备份。

| 资源 | 活跃规则条数 |
| --- | --- |
| [Rewrites/91series.conf](../Rewrites/91series.conf) | 1 |
| [Rewrites/AdBlock.conf](../Rewrites/AdBlock.conf) | 1 |
| [Rewrites/Amap.snippet](../Rewrites/Amap.snippet) | 27 |
| [Rewrites/Cainiao.snippet](../Rewrites/Cainiao.snippet) | 13 |
| [Rewrites/Complement.conf](../Rewrites/Complement.conf) | 12 |
| [Rewrites/CopyManga.conf](../Rewrites/CopyManga.conf) | 5 |
| [Rewrites/Pica/Web.conf](../Rewrites/Pica/Web.conf) | 7 |
| [Rewrites/PornHub.snippet](../Rewrites/PornHub.snippet) | 1 |
| [Rewrites/TED-premium.conf](../Rewrites/TED-premium.conf) | 1 |
| [Rewrites/Weibo.snippet](../Rewrites/Weibo.snippet) | 36 |
| [Rewrites/Zhihu.snippet](../Rewrites/Zhihu.snippet) | 35 |

拷贝漫画已独立为 [CopyManga.conf](../Rewrites/CopyManga.conf)（5 条规则），手机使用增强阅读器，桌面透传给 Tampermonkey；见 [说明](CopyManga.md)。
