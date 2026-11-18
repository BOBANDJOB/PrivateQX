// 拷贝漫画首页公告。QX 当前唯一入口在 Rewrites/CopyManga.conf。
// Loon 同一规则归属 CopyMangaHelper.lpx；保留已验证的精确 URL、GET、200 条件。
(function () {
  if (typeof $request === 'undefined' || typeof $response === 'undefined' ||
      $request.method !== 'GET' || $response.statusCode !== 200 ||
      !/^https:\/\/api\.copy4000\.com\/api\/v3\/system\/config\/2020\/1$/.test($request.url)) {
    $done({});
    return;
  }
  // iPhone UAs also contain "Mac OS X". Match desktop tokens, not that phrase.
  // iPad desktop-mode requests without Mobile are deliberately passed through.
  const headers = $request.headers || {};
  const uaKey = Object.keys(headers).find(key => key.toLowerCase() === 'user-agent');
  const ua = uaKey ? String(headers[uaKey]) : '';
  if (/\b(?:Macintosh|Windows NT|X11|CrOS)\b/i.test(ua) &&
      !/\b(?:iPhone|iPad|iPod|Android|Mobile)\b/i.test(ua)) {
    $done({});
    return;
  }
  try {
    const body = JSON.parse($response.body);
    if (!body || !body.results || !Object.prototype.hasOwnProperty.call(body.results, 'code')) {
      $done({});
      return;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'code') && Number(body.code) !== 200) {
      $done({});
      return;
    }
    body.results.code = '';
    $done({ body: JSON.stringify(body) });
  } catch (_) {
    $done({});
  }
})();
