const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const names = ['response', 'announcements', 'pwa-update', 'pwa-cache'];
const sources = Object.fromEntries(names.map(name => [name, fs.readFileSync(path.join(__dirname, name + '.js'), 'utf8')]));
const urls = {
    response: 'https://pica-ad-api.diwodiwo.xyz/get-ad-zones?z=fixture',
    announcements: 'https://picaapi.go2778.com/announcements',
    'pwa-update': 'https://manhuapica.com/assets/js/index-fixture.js',
    'pwa-cache': 'https://manhuapica.com/sw.js'
};
const board = () => ({ code: 200, data: { announcements: {
    docs: [{ title: 'fixture' }], page: 1, limit: 5, total: 30, pages: 6 }, other: true } });
const callback = 'onNeedRefresh(){confirm(t.t("common:pwa.updateAvailable"))&&s(!0)}';
const entry = '// virtual_pwa-register-fixture.js\nconst s=registerSW({' + callback + ',onOfflineReady(){ready()}});';
const registration = 'function registerSW(options){const{onNeedRefresh:n,onOfflineReady:r}=options;' +
    'const w=new Workbox("/sw.js");const notify=()=>n?.();w.addEventListener("waiting",notify);' +
    'w.addEventListener("installed",event=>{if(event.isExternal)notify();else r?.()});return()=>w.messageSkipWaiting()}';
const worker = 'self.addEventListener("message",()=>"SKIP_WAITING");wb.precacheAndRoute([' +
    '{url:"index.html",revision:"html"},{url:"assets/js/virtual_pwa-register-fixture.js",revision:null},' +
    '{url:"assets/js/feature-comics-fixture.js",revision:null},{url:"assets/js/index-fixture.js",revision:null}],{});wb.cleanupOutdatedCaches();';
const bodies = { response: JSON.stringify({ code: 200, data: { zones: ['fixture'], other: true } }),
    announcements: JSON.stringify(board()), 'pwa-update': entry, 'pwa-cache': worker };
function execute(source, request, response) {
    const values = [];
    const context = { $request: request, $done: value => values.push(JSON.parse(JSON.stringify(value))) };
    if (response !== undefined) context.$response = response;
    vm.runInNewContext(source, context, { timeout: 1000 });
    assert.equal(values.length, 1);
    return values[0];
}
function run(name, request = {}, response = {}, source = sources[name]) {
    return execute(source, { method: 'GET', url: urls[name], ...request }, {
        statusCode: 200, headers: { 'Content-Type': name === 'response' || name === 'announcements' ?
            'application/json' : 'application/javascript' }, body: bodies[name], ...response });
}
test('advertisement zones and announcement first page become empty successful QX responses', () => {
    const ads = run('response');assert.equal(ads.status, 'HTTP/1.1 200 OK');
    assert.deepEqual(JSON.parse(ads.body), { code: 200, data: { zones: [], other: true } });
    const announcements = JSON.parse(run('announcements').body);
    assert.deepEqual(announcements.data.announcements, { docs: [], page: 1, limit: 5, total: 0, pages: 0 });
    assert.equal(announcements.data.other, true);
});
test('both web API hosts work, while App API, other pages, paths and methods pass through', () => {
    assert.ok(run('announcements', { url: 'https://picaapi.acbbb.com/announcements?page=1' }).body);
    const page2 = board();page2.data.announcements.page = 2;
    assert.deepEqual(run('announcements', {}, { body: JSON.stringify(page2) }), {});
    for (const name of names) {
        const badPath = new URL(urls[name]);badPath.pathname += '/fixture';badPath.search = '';
        for (const method of ['POST', 'HEAD', 'OPTIONS']) assert.deepEqual(run(name, { method }), {});
        for (const url of ['https://api.tipatipa.xyz/announcements?page=1',
            'https://picaapi.go2778.com/comics/fixture', 'https://manhuapica.com.evil.test/sw.js',
            badPath.href]) assert.deepEqual(run(name, { url }), {});
    }
});
test('only QX statusCode 200 and known non-empty response schemas are handled', () => {
    for (const name of names) {
        for (const statusCode of [204, 304, 401, 403, 404, 500]) assert.deepEqual(run(name, {}, { statusCode }), {});
        assert.deepEqual(run(name, {}, { statusCode: undefined, status: 200 }), {});
        for (const body of ['', '<html>error</html>', 'null', '{}']) assert.deepEqual(run(name, {}, { body }), {});
    }
    assert.deepEqual(run('response', {}, { body: JSON.stringify({ code: '200', data: { zones: ['fixture'] } }) }), {});
    assert.deepEqual(run('response', {}, { body: JSON.stringify({ code: 200, data: { zones: [] } }) }), {});
});
test('QX body headers survive exactly while stale cache validators are removed', () => {
    for (const name of names) {
        const headers = { 'Content-Length': '999', 'Content-Type': name === 'response' || name === 'announcements' ?
            'application/json' : 'application/javascript', 'Content-Encoding': 'br', 'Transfer-Encoding': 'chunked',
            ETag: 'fixture', 'Last-Modified': 'fixture', Expires: 'fixture', 'cache-control': 'max-age=300',
            'Access-Control-Allow-Origin': '*', 'Set-Cookie': 'fixture=1', Vary: 'Origin' };
        const original = { ...headers };const result = run(name, {}, { headers });
        assert.deepEqual(headers, original);
        for (const key of ['Content-Length', 'Content-Type', 'Content-Encoding', 'Transfer-Encoding',
            'Access-Control-Allow-Origin', 'Set-Cookie', 'Vary']) assert.equal(result.headers[key], headers[key]);
        for (const key of ['ETag', 'Last-Modified', 'Expires', 'cache-control']) assert.ok(!(key in result.headers));
        assert.equal(result.headers['Cache-Control'], 'no-store');
    }
});
test('request phase removes conditional headers only and preserves credentials without mutation', () => {
    const headers = { 'If-None-Match': 'fixture', 'if-modified-since': 'fixture',
        Cookie: 'fixture=1', Authorization: 'fixture', Accept: '*/*' };
    const request = { method: 'GET', url: urls['pwa-cache'], headers };
    const result = execute(sources['pwa-cache'], request);
    assert.deepEqual(result.headers, { Cookie: 'fixture=1', Authorization: 'fixture', Accept: '*/*',
        'Cache-Control': 'no-cache', Pragma: 'no-cache' });
    assert.equal(headers['If-None-Match'], 'fixture');
    assert.deepEqual(execute(sources['pwa-cache'], { ...request, method: 'POST' }), {});
    assert.deepEqual(execute(sources['pwa-cache'], { ...request, url: 'https://picaapi.go2778.com/users/profile' }), {});
});
test('precache revision is stable, changes only HTML and targeted modules, and matches Loon namespace', () => {
    const result = run('pwa-cache');
    assert.equal(result.body, worker.replace('virtual_pwa-register-fixture.js",revision:null',
        'virtual_pwa-register-fixture.js",revision:"loon-pwa-quiet-20261117a-fixture"').replace('feature-comics-fixture.js",revision:null', 'feature-comics-fixture.js",revision:"loon-pwa-quiet-20261116d-fixture"').replace('index.html",revision:"html"', 'index.html",revision:"loon-pwa-statusbar-20261117a-html"'));
    assert.equal(run('pwa-cache').body, result.body);
    assert.deepEqual(run('pwa-cache', {}, { body: result.body }), {});
    assert.ok(!result.body.includes('caches.delete'));assert.ok(!result.body.includes('Date.now'));
});
test('entry callback is muted and unknown/ambiguous builds are left unchanged', () => {
    assert.equal(run('pwa-update').body, entry.replace(callback, 'onNeedRefresh(){}'));
    assert.deepEqual(run('pwa-update', {}, { body: entry + callback }), {});
    assert.deepEqual(run('pwa-update', {}, { headers: { 'Content-Type': 'text/html' } }), {});
    assert.deepEqual(run('pwa-cache', {}, { body: worker.replace('revision:null}', 'revision:"server-revision"}') }), {});
});
test('registration suppresses both notification paths and installs the scoped style once', () => {
    const url = 'https://manhuapica.com/assets/js/virtual_pwa-register-fixture.js';
    const result = run('pwa-update', { url }, { body: registration });
    let wb;let prompts = 0;let offline = 0;let activation = 0;const nodes = new Map();
    const context = { Workbox: function () { wb = this;this.handlers = {};
        this.addEventListener = (name, callback) => this.handlers[name] = callback;this.messageSkipWaiting = () => activation++; },
        document: { getElementById: id => nodes.get(id), createElement: () => ({}),
            head: { appendChild: node => nodes.set(node.id, node) } } };
    vm.createContext(context);vm.runInContext(result.body, context);
    const update = context.registerSW({ onNeedRefresh: () => prompts++, onOfflineReady: () => offline++ });
    wb.handlers.waiting();wb.handlers.installed({ isExternal: true });assert.equal(prompts, 0);
    wb.handlers.installed({ isExternal: false });assert.equal(offline, 1);assert.equal(activation, 0);
    update();assert.equal(activation, 1);vm.runInContext(result.body, context);assert.equal(nodes.size, 1);
    const style=nodes.get('loon-pica-web-home-clean').textContent;
    assert.ok(style.startsWith('.logged-in-home-container .slideshow-section,.chapter-navigation__ad{display:none!important}'));
    assert.ok(!style.includes('.mobile-header'));
    assert.ok(!style.includes('filter:'));
});
test('new resource has six response routes, one request route and exact existing script/host references', () => {
    const conf = fs.readFileSync(path.join(__dirname, '../../Rewrites/Pica/Web.conf'), 'utf8');
    assert.match(conf.split('\n')[0], /^hostname = /);
    const lines = conf.split('\n').filter(l => l.includes(' url script-'));
    assert.equal(lines.filter(l => l.includes('script-request-header')).length, 1);
    assert.equal(lines.filter(l => l.includes('script-response-body')).length, 6);
    for (const url of [...Object.values(urls), 'https://manhuapica.com/assets/js/virtual_pwa-register-fixture.js']) {
        assert.equal(lines.filter(l => l.includes('script-response-body') && new RegExp(l.split(' ')[0]).test(url)).length, 1);
    }
    for (const line of lines) {
        const u = new URL(line.split(' ').at(-1));assert.equal(u.hostname, 'raw.githubusercontent.com');
        assert.ok(fs.existsSync(path.join(__dirname, '../..', u.pathname.replace('/BOBANDJOB/PrivateQX/main/', ''))));
    }
    const rules = fs.readFileSync(path.join(__dirname, '../../Rules/Pica/Web.list'), 'utf8');
    assert.equal(rules.split('\n').filter(l => l.startsWith('host,')).length, 4);
    assert.ok(!rules.includes('host-suffix'));
});
test('all manual invocations return once and no preference storage is accessed', () => {
    for (const source of Object.values(sources)) {
        const values = [];vm.runInNewContext(source, { $done: value => values.push(JSON.stringify(value)) });
        assert.deepEqual(values, ['{}']);assert.ok(!/\$prefs|\$persistentStore/.test(source));
    }
});
test('optional checkout comparison preserves Loon bodies and request headers across 146 cases', {
    skip: !process.env.PICA_LOON_ROOT
}, () => {
    let comparisons = 0;
    for (const name of names) {
        const loon = fs.readFileSync(path.join(process.env.PICA_LOON_ROOT, 'Scripts/pica-web', name + '.js'), 'utf8');
        const variants = [
            { request: { method: 'GET', url: urls[name] }, body: bodies[name] },
            { request: { method: 'GET', url: 'https://example.test/fixture' }, body: bodies[name] }
        ];
        if (name === 'pwa-update') variants.push({ request: { method: 'GET', url: 'https://manhuapica.com/assets/js/virtual_pwa-register-fixture.js' }, body: registration });
        for (const variant of variants) for (const method of ['GET', 'POST', 'HEAD', 'OPTIONS']) for (const status of [200, 304, 401, 500]) {
            const request = { ...variant.request, method };
            const common = { headers: { 'Content-Type': name === 'response' || name === 'announcements' ? 'application/json' : 'application/javascript' }, body: variant.body };
            const a = execute(sources[name], request, { ...common, statusCode: status });
            const b = execute(loon, request, { ...common, status });
            assert.equal(a.body, b.body);assert.equal(a.status ? 200 : undefined, b.status);
            comparisons++;
        }
        if (name === 'pwa-cache') for (const url of [urls[name], 'https://manhuapica.com/assets/js/virtual_pwa-register-fixture.js']) {
            const request = { method: 'GET', url, headers: { 'If-None-Match': 'fixture', Cookie: 'fixture=1' } };
            assert.deepEqual(execute(sources[name], request), execute(loon, request));comparisons++;
        }
    }
    assert.equal(comparisons, 146);
});
