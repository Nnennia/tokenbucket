class TokenBucket {
    private capacity: number;
    private tokens: number;
    private refillRate: number;
    private locked: boolean;
    private lastRefillTime: number;

    constructor(capacity: number, refillRate: number) {
        this.capacity = capacity;
        this.tokens = capacity; // Initialize tokens to the capacity
        this.refillRate = refillRate;
        this.locked = false;
        this.lastRefillTime = Date.now();
    }

    private refillTokens() {
        const currentTime = Date.now();
        const passedTime = currentTime - this.lastRefillTime;
        const addToken = passedTime * (this.refillRate / 1000); // Convert refill rate from tokens/s
        this.tokens = Math.min(this.capacity, this.tokens + addToken); // Ensure tokens do not exceed capacity
        this.lastRefillTime = currentTime;
    }

    getToken(): boolean {
        this.refillTokens();
        if (this.locked) {
            return false; // If locked, cannot get tokens
        }
        if (this.tokens >= 1) {
            this.tokens--;
            return true;
        } else {
            this.locked = true;
            return false;
        }
    }

    unlock() {
        this.locked = false;
    }
}

// Example usage
const bucket = new TokenBucket(10, 1); // Capacity of 10 tokens, refill rate of 1 token per second

console.log("Token 1: ", bucket.getToken()); // true
console.log("Token 2: ", bucket.getToken()); // true
console.log("Token 3: ", bucket.getToken()); // true

// Wait for 2 seconds
setTimeout(() => {
    bucket.unlock(); // Unlock after wait
    console.log("Token 4: ", bucket.getToken()); // true, tokens are refilled
}, 2000);
