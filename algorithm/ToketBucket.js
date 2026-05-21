class TokenBucket {
    constructor(capacity, refillRatePerSecond) {
        this.capacity = capacity;
        this.refillRatePerSecond = refillRatePerSecond;
        
        this.tokens = capacity;
        this.lastRefillTime = Date.now();
    }

    refilToken(){
      const now = Date.now();
      // elapsed time in second: time from start to end -> endtime - startTime
      const elapsedTime = (now-this.lastRefillTime) / 1000;
      
      //tokens to add
      const refillAmount = elapsedTime * this.refillRatePerSecond;

      //refil bucket : ensure tokens should not > of capacity
      this.tokens = Math.min(this.capacity, this.tokens + refillAmount);

      this.lastRefillTime = now;
    }

    allowRequest(){
        //refill token before checking
        this.refilToken();
        
        if(this.tokens < 1){
            return false;
        }

        this.tokens--;
        return true;
    }
}

module.exports = TokenBucket;