# Benchmark run optimized

- base URL: http://localhost:3001
- k6: k6 v2.3.0 (commit/e088784614, go1.26.8, linux/amd64)
- contention: VUS=20 ITER=10 RACERS=10
- feed-read: VUS=20 DURATION=30s
- slot-lookup: VUS=10 DURATION=20s counts=0 400 800 1200
