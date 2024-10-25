import React, { useState } from "react";
import axios from "axios";

const SellPage = () => {
  const [token, setToken] = useState("sui");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("usd");
  const [conversionRate, setConversionRate] = useState(null);

  const handleSell = async () => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=${currency}`
    );
    console.log(response.data);
    const rate = response.data[token][currency];
    console.log("rate",rate);
    setConversionRate(rate * amount);
  };

  return (
    <div>
      <h2>Sell Crypto</h2>
      <div>
        <select value={token} onChange={(e) => setToken(e.target.value)}>
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

        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="usd">USD</option>
          <option value="inr">INR</option>
          <option value="eur">EUR</option>
          <option value="aed">AED</option>
        </select>

        <button onClick={handleSell}>Sell</button>
      </div>
      {conversionRate && (
        <p>
          You can sell {amount} {token} for {conversionRate} {currency.toUpperCase()}.
        </p>
      )}
    </div>
  );
};

export default SellPage;