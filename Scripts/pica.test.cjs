const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, 'pica.js'), 'utf8');
const bannerURL = 'https://api.tipatipa.xyz/banners';
const announcementURL = 'https://api.tipatipa.xyz/announcements?page=1';
const bannerError = { code: 500, error: 'Unexpected token < in JSON at position 0', message: '--', detail: ':(' };
const announcementPage = { code: 200, message: 'success', data: { announcements: {
  docs: [{ title: 'fixture' }], total: 30, limit: 5, page: '1', pages: 6
}, other: { preserved: true } } };
function run(url = bannerURL, statusCode = 500, body = JSON.stringify(bannerError), method = 'GET', headers = {}) {
  const results = [];
  vm.runInNewContext(source, {
    $request: { method, url }, $response: { statusCode, headers, body },
    $done: value => results.push(JSON.parse(JSON.stringify(value)))
  }, { timeout: 1000 });
  assert.equal(results.length, 1);
  return results[0];
}
test('captured banner error becomes the same successful empty list as Loon, using QX status format', () => {
  const result = run();
  assert.equal(result.status, 'HTTP/1.1 200 OK');
  assert.deepEqual(JSON.parse(result.body), { code: 200, message: 'success', data: { banners: [] } });
});
test('first-page announcements are empty while page, limit and unrelated data survive', () => {
  const result = run(announcementURL, 200, JSON.stringify(announcementPage));
  assert.equal(result.status, 'HTTP/1.1 200 OK');
  const body = JSON.parse(result.body);
  assert.deepEqual(body.data.announcements, { docs: [], total: 0, limit: 5, page: '1', pages: 0 });
  assert.deepEqual(body.data.other, { preserved: true });
});
test('healthy banners, authentication errors and unrelated server errors pass through', () => {
  assert.deepEqual(run(bannerURL, 200, JSON.stringify({ code: 200, data: { banners: ['fixture'] } })), {});
  assert.deepEqual(run(bannerURL, 500, JSON.stringify({ ...bannerError, error: 'Database unavailable' })), {});
  for (const status of [200, 304, 400, 401, 403, 404, 429, 502, 503]) assert.deepEqual(run(bannerURL, status), {});
  for (const status of [401, 403, 429, 500, 503]) assert.deepEqual(run(announcementURL, status, JSON.stringify(announcementPage)), {});
});
test('exact URL, GET and page boundaries are preserved', () => {
  for (const url of [
    'https://api.tipatipa.xyz/init?platform=ios', 'https://api.tipatipa.xyz/sources',
    'https://api.tipatipa.xyz/collections', 'https://api.tipatipa.xyz/banners/',
    'https://api.tipatipa.xyz/banners?x=1', 'https://api.tipatipa.xyz/announcements',
    'https://api.tipatipa.xyz/announcements?page=2', 'https://api.tipatipa.xyz/announcements?page=10',
    'https://api.tipatipa.xyz/announcements/fixture', 'https://api.tipatipa.xyz.evil.test/banners',
    'https://example.com/banners', 'http://api.tipatipa.xyz/banners'
  ]) {
    assert.deepEqual(run(url), {});
    assert.deepEqual(run(url, 200, JSON.stringify(announcementPage)), {});
  }
  for (const method of ['POST', 'HEAD', 'DELETE', 'PUT']) {
    assert.deepEqual(run(bannerURL, 500, JSON.stringify(bannerError), method), {});
    assert.deepEqual(run(announcementURL, 200, JSON.stringify(announcementPage), method), {});
  }
});
test('malformed JSON, wrong error shapes, mismatched pages and empty pages pass through', () => {
  for (const body of ['', '<html>error</html>', 'null', '[]', '{}', JSON.stringify({ ...bannerError, code: '500' })]) assert.deepEqual(run(bannerURL, 500, body), {});
  for (const page of [
    { code: 401, data: announcementPage.data },
    { code: 200, data: { announcements: { docs: [], page: '1' } } },
    { code: 200, data: { announcements: { docs: ['fixture'], page: '2' } } },
    { code: 200, data: { announcements: { docs: {}, page: '1' } } }
  ]) assert.deepEqual(run(announcementURL, 200, JSON.stringify(page)), {});
});
test('QX length, type and encoding headers stay intact; cache validators are removed', () => {
  const headers = { 'Content-Length': '92', 'Content-Type': 'application/json; charset=utf-8',
    'Content-Encoding': 'gzip', 'Transfer-Encoding': 'chunked', ETag: 'fixture',
    'cache-control': 'max-age=3600', 'Last-Modified': 'fixture', Expires: 'fixture', Server: 'fixture' };
  const result = run(bannerURL, 500, JSON.stringify(bannerError), 'GET', headers);
  assert.deepEqual(result.headers, { 'Content-Length': '92', 'Content-Type': 'application/json; charset=utf-8',
    'Content-Encoding': 'gzip', 'Transfer-Encoding': 'chunked', Server: 'fixture', 'Cache-Control': 'no-store' });
});
test('manual execution without response context safely passes through', () => {
  const output = [];
  vm.runInNewContext(source, { $done: value => output.push(JSON.parse(JSON.stringify(value))) });
  assert.deepEqual(output, [{}]);
});
test('Complement hostname and both exact rewrite routes resolve to the local QX script', () => {
  const conf = fs.readFileSync(path.join(__dirname, '../Rewrites/Complement.conf'), 'utf8');
  const hosts = conf.split('\n')[0].split('=')[1].split(',').map(s => s.trim());
  assert.equal(hosts.filter(h => h === 'api.tipatipa.xyz').length, 1);
  assert.ok(hosts.includes('manhuapica.com'));
  const lines = conf.split('\n').filter(s => s.includes(' url script-response-body ') && s.endsWith('/Scripts/pica.js'));
  assert.equal(lines.length, 2);
  const patterns = lines.map(s => new RegExp(s.split(' ')[0]));
  assert.equal(patterns.filter(re => re.test(bannerURL)).length, 1);
  assert.equal(patterns.filter(re => re.test(announcementURL)).length, 1);
  for (const url of ['https://api.tipatipa.xyz/init?platform=ios', 'https://api.tipatipa.xyz/announcements?page=10']) assert.ok(patterns.every(re => !re.test(url)));
  assert.ok(lines.every(s => s.endsWith('https://raw.githubusercontent.com/BOBANDJOB/PrivateQX/main/Scripts/pica.js')));
});
