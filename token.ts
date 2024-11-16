type TokenBucketState = {
    tokens: number;
    lastRefillTime: number;
    locked: boolean;
};

function createTokenBucket(capacity: number, refillRate: number) {
    const state: TokenBucketState = {
        tokens: capacity,
        lastRefillTime: Date.now(),
        locked: false
    };

    function refillTokens() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - state.lastRefillTime;
        const tokensToAdd = elapsedTime * (refillRate / 1000); // Convert refill rate from tokens/s
        state.tokens = Math.min(capacity, state.tokens + tokensToAdd); // token capacity exceeding
        state.lastRefillTime = currentTime;
    }

    function getToken(): boolean {
        refillTokens();
        if (state.locked) {
            return false; // If locked, cannot get tokens
        }
        if (state.tokens >= 1) {
            state.tokens--;
            return true;
        } else {
            state.locked = true;
            return false;
        }
    }

    function unlock() {
        state.locked = false;
    }

    return { getToken, unlock };
}

// Example usage
const bucket7 = createTokenBucket(10, 1); // Capacity of 10 tokens, refill rate of 1 token per second

console.log("Token 1: ", bucket7.getToken()); // true
console.log("Token 2: ", bucket7.getToken()); // true
console.log("Token 3: ", bucket7.getToken()); // true

// Wait for 2 seconds
setTimeout(() => {
    bucket7.unlock(); // Unlock after wait
    console.log("Token 4: ", bucket7.getToken()); // true, tokens are refilled
}, 2000);
