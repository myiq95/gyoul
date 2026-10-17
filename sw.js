const V='gyeol-v1',CD='https://cdnjs.cloudflare.com/ajax/libs/',PV=CD+'pdf.js/3.11.174/';
const PRE=['./','./index.html',CD+'jszip/3.10.1/jszip.min.js',PV+'pdf.min.js',PV+'pdf.worker.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>0)))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url),same=u.origin===location.origin;
  if(!same&&!/(^|\.)cdnjs\.cloudflare\.com$|^fonts\.(googleapis|gstatic)\.com$/.test(u.host))return;
  e.respondWith(caches.match(r,{ignoreSearch:same}).then(hit=>{
    const net=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))caches.open(V).then(c=>c.put(r,x.clone()));return x})
      .catch(()=>hit||(r.mode==='navigate'?caches.match('./index.html'):Response.error()));
    return hit||net;
  }));
});
