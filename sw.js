const V="elike-v2";
const ASSETS=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>{
    const net=fetch(r).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(ch=>ch.put(r,c))}return res}).catch(()=>null);
    e.waitUntil(net);
    return m||net.then(res=>res||(r.mode==="navigate"?caches.match("index.html"):Response.error()));
  }));
});
