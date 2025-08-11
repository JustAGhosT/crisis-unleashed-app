import { onCLS, onINP, onLCP, Metric } from 'web-vitals';

function sendToRUM(metric: Metric) {
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      label: metric.label,
      path: window.location.pathname,
      ts: Date.now(),
      device: navigator.userAgent,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/rum', blob);
    } else {
      fetch('/api/rum', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true });
    }
  } catch (e) {
    // swallow
  }
}

export function initWebVitals() {
  onLCP(sendToRUM);
  onINP(sendToRUM);
  onCLS(sendToRUM);
}
