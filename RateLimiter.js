const RateLimiterFactory = require('./RateLimiterFactory');



class RateLimitter {
    constructor (alogrithm, config){
        this.alogrithm = alogrithm;
        this.config = config;

        //Map <key, TockenBucket>
        this.limtters = new Map();
    }

    generateKey({userId, ip, endPoint}) {
        // considering only UserId
        return `${userId} : ${endPoint}`;

        //if consider only IP
        // return `${ip} : ${endPoint}`;

        //if consider both UserId and IP
        // return `${userId} : ${ip} : ${endPoint}`;
    }

    isAllowed(request) {
        const key = this.generateKey(request);

        if(!this.limtters.has(key)){
            //handle no entry case
            const limiter = RateLimiterFactory.createRateLimiter(this.alogrithm, this.config);
            this.limtters.set(key, limiter);
        }

        const limiter = this.limtters.get(key);
        return limiter.allowRequest();
    }
}

module.exports = RateLimitter;