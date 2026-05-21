
class slidingWindow {
    constructor(capacity, windowSizeMs) {
        this.capacity = capacity;
        this.windowSizeMs = windowSizeMs;

        this.previousCount = 0;
        this.currentCount = 0;
        this.windowStartTime = Date.now();
    }

    allowRequest(){
        const now = Date.now();
        let elapsedTime = now - this.windowStartTime;

        if(elapsedTime > this.windowSizeMs){
            this.previousCount = this.currentCount;
            this.currentCount = 0;
            elapsedTime = 0;
            this.windowStartTime = now;
        }

        const weight = (this.windowSizeMs - elapsedTime ) / this.windowSizeMs;
        const estimatedCount = this.previousCount * weight + this.currentCount;
        if(estimatedCount >= this.capacity){
            return false;
        }
        this.currentCount++;
        return true;
    }
}

module.exports = slidingWindow;