"use strict";
// Cache names are scoped to this installation, including on shared GitHub Pages origins.
const PREFIX="jazdecky-kalendar-"+self.registration.scope+"-";
const CACHE=PREFIX+"v10";
const FILES=["./","./index.html","./script.js","./vendor/jspdf.umd.min.js","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=="GET"||!url.href.startsWith(self.registration.scope))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    // Navigations always use the installed app shell, even with query parameters.
    const cached=await cache.match(request.mode==="navigate"?"./index.html":request);
    if(cached)return cached;
    try{return await fetch(request)}catch{return Response.error()}
  })());
});
