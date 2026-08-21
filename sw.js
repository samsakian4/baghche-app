const CACHE = "baghche-v1";
const FILES = ["./", "./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "باغچه 🌱", body: "" };
  try{ data = event.data ? event.data.json() : data; }
  catch(e){ if(event.data) data.body = event.data.text(); }
  event.waitUntil(
    self.registration.showNotification(data.title || "باغچه 🌱", {
      body: data.body || "",
      icon: "icon.svg",
      badge: "icon.svg",
      dir: "rtl",
      lang: "fa",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      const existing = clientsArr.find((c) => c.url.includes("index.html"));
      if(existing) return existing.focus();
      return self.clients.openWindow("./index.html");
    })
  );
});
