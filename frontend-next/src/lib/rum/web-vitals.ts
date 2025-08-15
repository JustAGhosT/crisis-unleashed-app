import { onCLS, onINP, onLCP, type Metric } from "web-vitals";

function sendToRUM(metric: Metric) {
  try {
    const payload: {
      name: string;
      value: number;
      id: string;
      label?: string;
      path: string;
      ts: number;
      device: string;
    } = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      path: window.location.pathname,
      ts: Date.now(),
      device: navigator.userAgent,
    };

    const maybeLabel = (metric as { label?: string }).label;
    if (maybeLabel) payload.label = maybeLabel;

    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/rum", blob);
    } else {
      fetch("/api/rum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // swallow
  }
}

export function initWebVitals() {
  onLCP(sendToRUM);
  onINP(sendToRUM);
  onCLS(sendToRUM);
}
