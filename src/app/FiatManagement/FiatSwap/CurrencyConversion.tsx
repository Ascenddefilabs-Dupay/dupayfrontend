import React, { useState } from 'react';
import './CurrencyConversion.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const CurrencyConversion: React.FC = () => {
  const [amount, setAmount] = useState<number | string>('');
  const [sourceCurrency, setSourceCurrency] = useState<string>('USD');
  const [destinationCurrency, setDestinationCurrency] = useState<string>('USD');
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [conversionRate, setConversionRate] = useState<string | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear any existing error

    try {
      const apiKey = '081e8b26f72bef8de565e1ceff00a9e3'; 
      const url = `http://api.currencylayer.com/live?access_key=${apiKey}&currencies=${destinationCurrency}&source=${sourceCurrency}&format=1`;

      setShowLoader(true); 
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        const rate = data.quotes[`${sourceCurrency}${destinationCurrency}`];
        const converted = (parseFloat(amount as string) * rate).toFixed(2);

        setConversionRate(rate.toString());
        setConvertedAmount(`${converted} ${destinationCurrency}`);
        setShowLoader(false);
      } else {
        setAlertMessage(`Error: ${data.error.info}`);
        setShowLoader(false);
      }
    } catch (error) {
      console.error('Error fetching the conversion rate:', error);
      setAlertMessage('An error occurred. Please try again later.');
      setShowLoader(false);
    }
  };

  const handleLeftArrowClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard';
      setShowLoader(false);
    }, 3000);
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const validInput = /^[0-9]*\.?[0-9]*$/;

    if (!validInput.test(inputValue)) {
      return;
    }

    if (inputValue.length > 1 && inputValue.startsWith('0') && inputValue[1] !== '.') {
      inputValue = inputValue.slice(1);
    }

    if (inputValue.includes('.')) {
      const parts = inputValue.split('.');
      if (parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
      }
      inputValue = parts.join('.');
    }

    setAmount(inputValue);
  };

  return (
    <div className="container">
      {alertMessage && (
        <div className="customAlert">
          <p>{alertMessage}</p>
          <button onClick={handleCloseAlert} className="closeButton">OK</button>
        </div>
      )}
      {showLoader && (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      )}
      <div className="topBar">
        <button className="topBarButton">
          <FaArrowLeft className="topBarIcon" onClick={handleLeftArrowClick} />
        </button>
        <h2 className="topBarTitle">Currency Conversion</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Source Amount */}
        <label htmlFor="amount">Source Amount:</label>
        <input
          type="text"
          id="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={handleAmountChange}
          required
        />

        {/* Source Currency */}
        <label htmlFor="sourceCurrency">Source Currency:</label>
        <select
          id="sourceCurrency"
          value={sourceCurrency}
          onChange={(e) => setSourceCurrency(e.target.value)}
          required
        >
          <option value="" disabled>Select source currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="INR">INR</option>
          {/* Add more currencies as needed */}
        </select>

        {/* Destination Currency */}
        <label htmlFor="destinationCurrency">Destination Currency:</label>
        <select
          id="destinationCurrency"
          value={destinationCurrency}
          onChange={(e) => setDestinationCurrency(e.target.value)}
          required
        >
          <option value="" disabled>Select destination currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="INR">INR</option>
          {/* Add more currencies as needed */}
        </select>

        {/* Payment Mode */}
        <label htmlFor="paymentMode">Payment Mode (optional):</label>
        <select
          id="paymentMode"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="" disabled>Select payment mode</option>
          <option value="wallet">Wallet balance</option>
          <option value="card">Credit/Debit Card</option>
          <option value="upi">UPI</option>
          {/* Add more payment modes as needed */}
        </select>

        {/* Submit Button */}
        <button type="submit">Convert Currency</button>
      </form>

      {/* Conversion Result */}
      <div id="result">
        <p>Conversion Rate: <span id="rate">{conversionRate ?? '-'}</span></p>
        <p>Converted Amount: <span id="convertedAmount">{convertedAmount ?? '-'}</span></p>
      </div>

      {error && <div id="error" style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default CurrencyConversion;
