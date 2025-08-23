import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 5,
      duration: '1m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'], // 300ms p95 API latency target
  },
};

// Fail fast if API_BASE_URL is not provided, and normalize trailing slashes
const rawBaseUrl = __ENV.API_BASE_URL;
if (!rawBaseUrl) {
  throw new Error(
    'API_BASE_URL is required. Example: API_BASE_URL=http://localhost:3000 k6 run tools/perf/k6/api-latency.js'
  );
}
// Remove any trailing slashes to avoid // in requests
const baseUrl = String(rawBaseUrl).replace(/\/+$/, '');

function joinUrl(base, path) {
  const p = String(path || '');
  return `${base}${p.startsWith('/') ? p : `/${p}`}`;
}

export default function () {
  const endpoints = [
    '/api/status',
    '/api/deck?page=1',
    '/api/cards?page=1',
  ];

  endpoints.forEach((p) => {
    const url = joinUrl(baseUrl, p);
    const res = http.get(url);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(0.2);
  });
}
