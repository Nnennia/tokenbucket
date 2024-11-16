function createTokenBucket(capacity, refillRate) {
    var state = {
        tokens: capacity,
        lastRefillTime: Date.now(),
        locked: false
    };
    function refillTokens() {
        var currentTime = Date.now();
        var elapsedTime = currentTime - state.lastRefillTime;
        var tokensToAdd = elapsedTime * (refillRate / 1000); // Convert refill rate from tokens/s
        state.tokens = Math.min(capacity, state.tokens + tokensToAdd); // Ensure tokens do not exceed capacity
        state.lastRefillTime = currentTime;
    }
    function getToken() {
        refillTokens();
        if (state.locked) {
            return false; // If locked, cannot get tokens
        }
        if (state.tokens >= 1) {
            state.tokens--;
            return true;
        }
        else {
            state.locked = true;
            return false;
        }
    }
    function unlock() {
        state.locked = false;
    }
    return { getToken: getToken, unlock: unlock };
}
// Example usage
var bucket7 = createTokenBucket(10, 1); // Capacity of 10 tokens, refill rate of 1 token per second
console.log("Token 1: ", bucket7.getToken()); // true
console.log("Token 2: ", bucket7.getToken()); // true
console.log("Token 3: ", bucket7.getToken()); // true
// Wait for 2 seconds
setTimeout(function () {
    bucket7.unlock(); // Unlock after wait
    console.log("Token 4: ", bucket7.getToken()); // true, tokens are refilled
}, 2000);
