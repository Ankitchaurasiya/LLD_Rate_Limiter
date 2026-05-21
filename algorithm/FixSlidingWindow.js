class FixedWindow {
  constructor(limit, windowSizeMs) {
    this.limit = limit;
    this.windowSize = windowSizeMs;

    this.count = 0;
    this.windowStartTime = Date.now();
  }

  allowRequest() {
    const now = Date.now();

    if (now - this.windowStartTime >= this.windowSize) {
      this.count = 0;
      this.windowStartTime = now;
    }

    if (this.count >= this.limit) {
      return false;
    }

    this.count++;

    return true;
  }
}

module.exports = FixedWindow;