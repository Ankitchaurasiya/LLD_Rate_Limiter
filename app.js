const RateLimitter = require('./RateLimiter');


const limitter = new RateLimitter('tokenBucket', {capacity: 5, refillRatePerSecond: 5});

const request = {
    userId : 101,
    ip : "133.343.1.1",
    endPoint: "/login"
}

let requestId = 1;
console.log(`Algorithm: ${limitter.alogrithm}`);
setInterval(() => {

    const isAllowed = limitter.isAllowed(request);

    console.log(`Request ${requestId}: ${isAllowed ? "Allowed" : "Rejected"}`);
    
    requestId++;
}, 150);