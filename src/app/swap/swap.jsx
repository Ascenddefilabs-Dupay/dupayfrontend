import React, { useState } from "react";
import axios from "axios";

const SwapPage = () => {
  const [fromToken, setFromToken] = useState("sui");
  const [toToken, setToToken] = useState("bitcoin");
  const [amount, setAmount] = useState(0);
  const [swapRate, setSwapRate] = useState(null);

  const handleSwap = async () => {
    const fromResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromToken}&vs_currencies=usd`
    );
    const toResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${toToken}&vs_currencies=usd`
    );
    const fromRate = fromResponse.data[fromToken].usd;
    const toRate = toResponse.data[toToken].usd;
    const swapValue = (fromRate / toRate) * amount;
    setSwapRate(swapValue);
  };

  return (
    <div>
      <h2>Swap Crypto</h2>
      <div>
        <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
          <option value="sui">SUI</option>
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="bnb">Binance Coin</option>
          <option value="solana">Solana</option>
          <option value="cardano">Cardano</option>
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />

        <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
          <option value="sui">SUI</option>
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="bnb">Binance Coin</option>
          <option value="solana">Solana</option>
          <option value="cardano">Cardano</option>
        </select>

        <button onClick={handleSwap}>Swap</button>
      </div>
      {swapRate && (
        <p>
          You can swap {amount} {fromToken} for {swapRate.toFixed(4)} {toToken}.
        </p>
      )}
    </div>
  );
};

export default SwapPage;