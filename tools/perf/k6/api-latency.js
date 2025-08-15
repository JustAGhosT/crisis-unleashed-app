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

const baseUrl = __ENV.API_BASE_URL;

export default function () {
  const endpoints = [
    '/api/status',
    '/api/deck?page=1',
    '/api/cards?page=1',
  ];

  endpoints.forEach((p) => {
    const res = http.get(`${baseUrl}${p}`);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(0.2);
  });
}
