
const CACHE = '13moon-cache-v3';
const ASSETS = ['./','./index.html','./manifest.json','./dreamspell_icon_512.png','./icon_person_info.png'];
self.addEventListener('install', e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener('activate', e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null)))); self.clients.claim();});
self.addEventListener('fetch', e=>{const u=new URL(e.request.url); if(u.origin===location.origin){e.respondWith(caches.open(CACHE).then(async c=>{const m=await c.match(e.request); if(m) return m; try{const f=await fetch(e.request); if(e.request.method==='GET'&&f.status===200) c.put(e.request,f.clone()); return f;}catch{return m||Response.error();}}));}});
