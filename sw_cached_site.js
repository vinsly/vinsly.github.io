const cacheName = "sw_site_1";

const cacheAssets = [
  "/vinsly.github.io",
  "/vinsly.github.io/",
  "/vinsly.github.io/index.html",
  "/vinsly.github.io/css/style.css",
  "/vinsly.github.io/js/index.js",
  "/vinsly.github.io/image/pixel.gif",
];

self.addEventListener("install", (e) => {
  console.log("installed");
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(cacheAssets).then(self.skipWaiting()))
  );
});

self.addEventListener("activate", (e) => {
  console.log("activated");
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("clear old caches");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  console.log("SW: fetching");
  e.respondWith(
    caches.match(e.request).then(function (res) {
      let { url } = e.request;
      if (res !== undefined) {
        return res;
      }
      let interceptObj = {
        interaction: "event",
        client: "customer",
        os_name: "operating_system_name",
        x1: "utm_source",
        x2: "utm_medium",
        x3: "utm_campaign",
        landing_url: "campaign_url",
      };
      let updatedParams = "";
      if (url.indexOf("pixel.gif") > 0) {
        let queryParam = url.split("?");
        updatedParams = queryParam[1];
        for (let k of Object.entries(interceptObj)) {
          updatedParams = updatedParams.replace(k[0], k[1]);
        }
        const newUrl = queryParam[0] + "?" + updatedParams;
        e.request.url = newUrl;
      }
      return fetch(e.request)
        .then(function (res) {
          const copyRes = res.clone();
          caches.open(cacheName).then(function (cache) {
            cache.put(e.request, copyRes);
          });
          return res;
        })
        .catch(() =>
          caches.match("https://service-worker.github.io/image/pixel.gif")
        );
    })
  );
});
