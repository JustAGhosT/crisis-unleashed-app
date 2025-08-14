"""
OpenTelemetry bootstrap (env-gated).
Safe to import at service startup; no-ops if not configured or deps missing.
"""
from __future__ import annotations

import logging
import os
from typing import Any, Optional

logger = logging.getLogger(__name__)

ENABLED = os.getenv("OTEL_ENABLED", "false").lower() == "true"

if ENABLED:
    try:
        # Core
        from opentelemetry import trace, metrics
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        from opentelemetry.sdk.metrics import MeterProvider
        from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
        from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader

        # Instrumentations (optional)
        try:
            import opentelemetry.instrumentation.asgi as _asgi_mod
            ASGIInstrumentor = getattr(_asgi_mod, "ASGIInstrumentor", None)
        except Exception:  # pragma: no cover
            ASGIInstrumentor = None
        try:
            import opentelemetry.instrumentation.pymongo  # noqa: F401
        except Exception:  # pragma: no cover
            pass

        service_name = os.getenv("OTEL_SERVICE_NAME", "crisis-unleashed-backend")
        otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4318")

        resource = Resource.create({"service.name": service_name})

        # Traces
        tracer_provider = TracerProvider(resource=resource)
        span_exporter = OTLPSpanExporter(endpoint=f"{otlp_endpoint}/v1/traces")
        tracer_provider.add_span_processor(BatchSpanProcessor(span_exporter))
        trace.set_tracer_provider(tracer_provider)

        # Metrics
        metric_exporter = OTLPMetricExporter(endpoint=f"{otlp_endpoint}/v1/metrics")
        reader = PeriodicExportingMetricReader(metric_exporter)
        meter_provider = MeterProvider(resource=resource, metric_readers=[reader])
        metrics.set_meter_provider(meter_provider)

        logger.info("OpenTelemetry initialized (endpoint=%s, service=%s)", otlp_endpoint, service_name)

    except Exception as e:  # pragma: no cover
        logger.warning("OpenTelemetry disabled: %s", e)
else:
    logger.debug("OpenTelemetry not enabled (set OTEL_ENABLED=true to enable)")
