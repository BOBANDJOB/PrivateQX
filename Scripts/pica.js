// 哔咔启动弹窗处理：移植自已实机验证的 Loon 实现，2026-11-16。
// GET /banners：仅兜底捕获到的 HTTP 500 JSON 解析错误。
// GET /announcements?page=1：清空公告第一页，公告列表也会一起隐藏。
(function () {
  if (typeof $request === "undefined" || typeof $response === "undefined") return $done({});
  if ($request.method !== "GET" || typeof $response.body !== "string") return $done({});

  const banners = $request.url === "https://api.tipatipa.xyz/banners";
  const announcements = $request.url === "https://api.tipatipa.xyz/announcements?page=1";
  const status = Number($response.statusCode);
  if ((!banners && !announcements) || (banners && status !== 500) || (announcements && status !== 200)) return $done({});

  let result;
  try { result = JSON.parse($response.body); } catch (_) { return $done({}); }
  if (banners) {
    if (!result || result.code !== 500 || result.error !== "Unexpected token < in JSON at position 0") return $done({});
    result = { code: 200, message: "success", data: { banners: [] } };
  } else {
    const page = result && result.code === 200 && result.data && result.data.announcements;
    if (!page || !Array.isArray(page.docs) || String(page.page) !== "1" || page.docs.length === 0) return $done({});
    page.docs = [];
    page.total = 0;
    page.pages = 0;
  }

  // QX 官方示例要求保留 Content-Length、Content-Type、Content-Encoding，交由运行时处理。
  const headers = Object.assign({}, $response.headers || {});
  Object.keys(headers).forEach(key => {
    if (["cache-control", "etag", "last-modified", "expires"].includes(key.toLowerCase())) delete headers[key];
  });
  headers["Cache-Control"] = "no-store";
  $done({ status: "HTTP/1.1 200 OK", headers, body: JSON.stringify(result) });
})();
