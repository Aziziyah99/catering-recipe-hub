import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const clearClientCaches = async () => {
  if (!("caches" in window)) {
    return;
  }

  const cacheKeys = await window.caches.keys();
  await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
};

const cleanupServiceWorkers = async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  await clearClientCaches();
};

// Prevent service worker from interfering in iframe/preview contexts
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
})();

const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if (isPreviewHost || isInIframe) {
  void cleanupServiceWorkers();

  window.addEventListener("load", () => {
    void cleanupServiceWorkers();
  }, { once: true });
}

createRoot(document.getElementById("root")!).render(<App />);
