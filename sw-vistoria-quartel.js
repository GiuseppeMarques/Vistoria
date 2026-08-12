const CACHE_NAME = 'vistoria-quartel-v2';

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.match(e.request).then(function(cached){
        var fetchPromise = fetch(e.request).then(function(resp){
          if(resp && resp.status===200){ cache.put(e.request, resp.clone()); }
          return resp;
        }).catch(function(){ return cached; });
        return cached || fetchPromise;
      });
    })
  );
});
