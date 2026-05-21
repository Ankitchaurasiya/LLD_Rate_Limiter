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

# Internal Flow Explanation

## Request Lifecycle

```txt
Client Request
      ↓
RateLimiter
      ↓
Generate Unique Key
(user/ip/endpoint)
      ↓
Check Existing Limiter in Map
      ↓
If limiter not found
      ↓
RateLimiterFactory
      ↓
Create Algorithm Instance
      ↓
Store in Map
      ↓
allowRequest()
      ↓
Allowed / Rejected
```

---

# Why Map is Used?

```js
Map<key, limiter>
```

Map provides:
- O(1) lookup
- fast insertion
- efficient per-user/per-IP limiter storage

Example:

```txt
"user:101" → SlidingWindow
"ip:1.1.1.1" → TokenBucket
```

---

# Why Common Interface?

All algorithms expose:

```js
allowRequest()
```

This ensures:
- loose coupling
- interchangeable algorithms
- cleaner RateLimiter implementation

The `RateLimiter` does not care:
- how Sliding Window works
- how Token Bucket works

It only calls:

```js
allowRequest()
```

---

# How New Algorithms Can Be Added?

## Step 1

Create new algorithm file:

```txt
algorithms/LeakyBucket.js
```

---

## Step 2

Expose same interface:

```js
allowRequest()
```

---

## Step 3

Register in Factory:

```js
case "LEAKY_BUCKET":
```

No changes required in:
- RateLimiter
- app.js
- request flow

This follows:
- Open/Closed Principle
- scalable architecture design

---

# Why Factory Improves Design?

Without factory:

```js
if(algo === "TOKEN_BUCKET"){
   return new TokenBucket()
}
```

This logic spreads everywhere.

With Factory:

```js
RateLimiterFactory.create(...)
```

Benefits:
- centralized object creation
- cleaner code
- better maintainability
- easy extensibility

---

# Why Strategy Pattern Fits Here?

Different algorithms solve the same problem:
- rate limiting

but use different internal logic.

Examples:
- Fixed Window
- Sliding Window
- Token Bucket

All are interchangeable strategies selected at runtime.

---

# Key Generation Strategy

The limiter key decides the throttling scope.

## Per User

```js
return `${userId}`;
```

---

## Per IP

```js
return `${ip}`;
```

---

## Per Endpoint

```js
return `${endPoint}`;
```

---

## Per User + Endpoint

```js
return `${userId}:${endPoint}`;
```

---

# Sliding Window Intuition

Sliding Window avoids sudden traffic bursts.

Instead of hard reset:
- it considers previous window traffic
- gradually reduces previous window contribution

Formula:

```txt
estimatedCount =
(previousCount * weight)
+ currentCount
```

This provides smoother throttling.

---

# Token Bucket Intuition

Token Bucket allows controlled bursts.

- bucket has fixed capacity
- tokens refill gradually
- each request consumes one token

If tokens are unavailable:
- request is rejected

Used widely in:
- API Gateways
- Cloud APIs
- Network traffic shaping

---

# Fixed Window Limitation

Fixed Window is simple but allows burst traffic.

Example:

```txt
100 requests at 12:00:59
100 requests at 12:01:00
```

Can allow:
- 200 requests in 2 seconds

Sliding Window and Token Bucket solve this problem better.

---

# Production-Level Improvements

## Distributed Support

Current implementation is in-memory.

For multi-server systems:
- Redis can be used
- distributed counters
- atomic Lua scripts

---

## Cleanup Mechanism

Inactive limiters should be removed periodically.

Otherwise:
- Map size can grow indefinitely

---

## Monitoring & Metrics

Can add:
- request count
- rejected count
- active limiters
- rate limiter analytics

---

# Complexity Analysis

| Operation | Complexity |
|---|---|
| Request Check | O(1) |
| Map Lookup | O(1) |
| Limiter Creation | O(1) |

---

# Key LLD Learnings

- Strategy Pattern
- Factory Pattern
- Extensible System Design
- Separation of Concerns
- API Throttling
- Scalable Backend Design
- Runtime Algorithm Switching
- Config-Driven Architecture

# LLD Interview Questions & Answers

---

## 1. Why did you use Factory Pattern in this design?

### Answer

Factory Pattern centralizes object creation logic and reduces tight coupling between the client and rate limiting algorithms.

Instead of directly creating objects like:

```js
new SlidingWindow()
new TokenBucket()
```

the client only calls:

```js
RateLimiterFactory.create(...)
```

Benefits:
- centralized object creation
- extensibility
- cleaner client code
- easier maintenance

---

## 2. Why did you use Strategy Pattern?

### Answer

Each algorithm exposes a common interface:

```js
allowRequest()
```

This makes algorithms interchangeable at runtime.

Example:
- Sliding Window
- Fixed Window
- Token Bucket

can be swapped without changing the `RateLimiter` logic.

This follows the Open/Closed Principle:
- open for extension
- closed for modification

---

## 3. Why did you use a config-driven design?

### Answer

Different algorithms require different configurations.

### Sliding Window

```js
{
  limit,
  windowSize
}
```

### Token Bucket

```js
{
  capacity,
  refillRate
}
```

Using a config object:
- avoids unused parameters
- improves scalability
- makes the system flexible

---

## 4. Explain the request flow in the system.

### Answer

```txt
Incoming Request
       ↓
RateLimiter
       ↓
Generate Unique Key
(user/ip/endpoint)
       ↓
Check Map for Existing Limiter
       ↓
If Not Exists:
Create via Factory
       ↓
Selected Algorithm
       ↓
allowRequest()
       ↓
Allowed / Rejected
```

The `RateLimiter` acts as the orchestrator while algorithms focus only on throttling logic.

---

## 5. How would you scale this design for distributed systems?

### Answer

Current implementation uses in-memory `Map`, which works only for a single server.

For distributed systems:
- Redis can be used
- atomic operations/Lua scripts
- shared counters
- distributed state management

This ensures all servers share the same rate limiting state.

---

## 6. Why is Map used in the design?

### Answer

```js
Map<key, limiter>
```

Map provides:
- O(1) lookup
- fast insertion
- efficient limiter storage

Each key stores a dedicated limiter instance.

Example:

```txt
"user:101" → SlidingWindow
"ip:1.1.1.1" → TokenBucket
```

---

## 7. Why does every algorithm expose allowRequest()?

### Answer

A common interface ensures:
- loose coupling
- interchangeable algorithms
- cleaner architecture

The `RateLimiter` does not need to know:
- internal algorithm logic
- implementation details

It simply calls:

```js
allowRequest()
```

---

## 8. What problem does Sliding Window solve over Fixed Window?

### Answer

Fixed Window allows sudden traffic bursts.

Example:

```txt
100 requests at 12:00:59
100 requests at 12:01:00
```

This can allow:
- 200 requests in 2 seconds

Sliding Window smooths traffic by considering:
- previous window count
- current window count

using weighted estimation.

---

## 9. Why is Token Bucket commonly used in production systems?

### Answer

Token Bucket:
- supports burst traffic
- provides smooth refill
- prevents sudden overload

Used widely in:
- API gateways
- cloud services
- traffic shaping systems

It balances:
- flexibility
- fairness
- performance

---

## 10. How can new algorithms be added to the system?

### Answer

Steps:
1. Create new algorithm file
2. Expose `allowRequest()`
3. Register in Factory

Example:

```txt
algorithms/LeakyBucket.js
```

Then:

```js
case "LEAKY_BUCKET":
```

No changes required in:
- RateLimiter
- app.js
- request flow

This makes the architecture highly extensible.
