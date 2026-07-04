const CACHE='dantian-v2';
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.url.startsWith('chrome-extension'))return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&r.status===200){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c));}
      return r;
    }).catch(()=>caches.match(e.request).then(cached=>{
      if(cached)return cached;
      if(e.request.mode==='navigate')return caches.match('/the-dantian/index.html');
    }))
  );
});
