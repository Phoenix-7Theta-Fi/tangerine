# Health benchmark run health-final

- base URL: http://localhost:3001
- k6: k6 v2.3.0 (commit/e088784614, go1.26.8, linux/amd64)
- observation ingestion: VUS=20 DURATION=30s
- FHIR bundle ingestion: VUS=10 DURATION=30s OBS_PER_BUNDLE=3
- concurrent sources: VUS=15 DURATION=30s
- trend scaling: counts=[1000 10000 100000 500000] iters=200 code=8867-4
- adherence scaling: configs=[20:10000 50:25000 100:50000] iters=30 window=30d
- outbox drain after ingestion: 1.785s
