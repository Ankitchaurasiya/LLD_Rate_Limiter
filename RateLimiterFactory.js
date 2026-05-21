//handle switch case between different algorithm
const SlidingWindow = require('./algorithm/SlidingWindow');
const TokenBucket = require('./algorithm/ToketBucket');
const FixedWindow = require('./algorithm/FixSlidingWindow');

class RateLimiterFactory {
    static createRateLimiter(type, config) {
        switch (type ){
            case 'fixedWindow':
                return new FixedWindow(config.limit, config.windowSizeMs);
            case 'slidingWindow':
                return new SlidingWindow(config.limit, config.windowSizeMs);
            case 'tokenBucket':
                return new TokenBucket(config.capacity, config.refillRatePerSecond);
            default:
                throw new Error('Invalid rate limiter type');
        }
    }
}

module.exports = RateLimiterFactory;