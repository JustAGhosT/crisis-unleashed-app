export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    const swUrl = "/sw.js";
    navigator.serviceWorker
      .register(swUrl)
      .catch(() => {
        // ignore
      });
  });
}


