# Rate Limiter - LLD (Node.js)

A scalable and extensible Rate Limiter implementation in Node.js using multiple rate limiting algorithms.

## Supported Algorithms

- Sliding Window
- Fixed Window
- Token Bucket

---

## Features

- Per User / IP / Endpoint rate limiting
- Strategy + Factory Design Pattern
- Pluggable architecture
- Easy to extend with new algorithms

---

## Project Structure

```txt
rate-limiter/
│
├── algorithms/
│   ├── FixedWindow.js
│   ├── SlidingWindow.js
│   └── TokenBucket.js
│
├── RateLimiter.js
├── RateLimiterFactory.js
├── app.js
└── package.json