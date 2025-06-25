let tokens = null;

module.exports = {
  getTokens: () => {
    console.log("📥 Getting tokens:", tokens ? "✅ Available" : "❌ None");
    return tokens;
  },
  setTokens: (newTokens) => {
    tokens = newTokens;
    console.log("📦 Tokens stored in tokenStore");
  },
};

