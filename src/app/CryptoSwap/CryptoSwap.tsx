// import React, { useState } from "react";
// import axios from "axios";

// interface PriceResponse {
//   [key: string]: {
//     usd: number;
//   };
// }

// const SwapPage: React.FC = () => {
//   const [fromToken, setFromToken] = useState<string>("sui");
//   const [toToken, setToToken] = useState<string>("bitcoin");
//   const [amount, setAmount] = useState<number>(0);
//   const [swapRate, setSwapRate] = useState<number | null>(null);

//   const handleSwap = async () => {
//     try {
//       const fromResponse = await axios.get<PriceResponse>(
//         `https://api.coingecko.com/api/v3/simple/price?ids=${fromToken}&vs_currencies=usd`
//       );
//       const toResponse = await axios.get<PriceResponse>(
//         `https://api.coingecko.com/api/v3/simple/price?ids=${toToken}&vs_currencies=usd`
//       );
//       const fromRate = fromResponse.data[fromToken].usd;
//       const toRate = toResponse.data[toToken].usd;
//       const swapValue = (fromRate / toRate) * amount;
//       setSwapRate(swapValue);
//     } catch (error) {
//       console.error("Error fetching token prices:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Swap Crypto</h2>
//       <div>
//         <select
//           value={fromToken}
//           onChange={(e) => setFromToken(e.target.value)}
//         >
//           <option value="sui">SUI</option>
//           <option value="bitcoin">Bitcoin</option>
//           <option value="ethereum">Ethereum</option>
//           <option value="bnb">Binance Coin</option>
//           <option value="solana">Solana</option>
//           <option value="cardano">Cardano</option>
//         </select>

//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//           placeholder="Amount"
//         />

//         <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
//           <option value="sui">SUI</option>
//           <option value="bitcoin">Bitcoin</option>
//           <option value="ethereum">Ethereum</option>
//           <option value="bnb">Binance Coin</option>
//           <option value="solana">Solana</option>
//           <option value="cardano">Cardano</option>
//         </select>

//         <button onClick={handleSwap}>Swap</button>
//       </div>
//       {swapRate !== null && (
//         <p>
//           You can swap {amount} {fromToken} for {swapRate.toFixed(4)} {toToken}.
//         </p>
//       )}
//     </div>
//   );
// };

// export default SwapPage;

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import './CryptoSwap.css';
// import { FaChevronLeft, FaExchangeAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const RAZORPAY_KEY = 'rzp_test_41ch2lqayiGZ9X';
import Select, { components } from 'react-select';
import { fontWeight, padding, width } from '@mui/system';
import LottieAnimation from '@/app/assets/animation';
import LottieAnimationLoading from '@/app/assets/LoadingAnimation';
const API_BASE_URL='https://fiatmanagement-ind-255574993735.asia-south1.run.app';
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
interface Currency {
  currency_icon: string;
  balance?: string;
  currency_type:string;
}

interface CurrencyOption {
  value: string;
  label: JSX.Element;
}
interface FiatWallet {
  balance: string; 
  currency_type: string;
  wallet_id: string;
  }

  interface OptionType {
    value: string;
    label: string;
  }
  const currencyIcons = {
    'SUI':'https://res.cloudinary.com/dgfv6j82t/image/upload/v1729751154/a2ca4b2c-1d38-48c4-b77c-5026eacbefa6.png',
    'BTC':'https://res.cloudinary.com/dgfv6j82t/image/upload/v1729765305/d6893a3a-07b3-4075-b0fe-f476a95510c9.png',
    'ETH':'https://res.cloudinary.com/dgfv6j82t/image/upload/v1729765367/4e24a2c0-6992-43b1-9b08-f63e8701a4e2.png',
    'BNB':'https://res.cloudinary.com/dgfv6j82t/image/upload/v1729765567/d00f7e53-532c-492b-9171-3bd4c9bc6241.png',
    'solana':'https://res.cloudinary.com/dgfv6j82t/image/upload/v1729765427/1d4ee764-327c-4f95-8d93-f8b315ef5ef1.png',
    'cardano':'https://res.cloudinary.com/dgfv6j82t/image/upload/v1729765532/d324f5a6-eb14-4749-b6f1-38c609dca7b2.png',
  };
  
  // const currencyList = [
  //   'SUI','Bitcoin','Ethereum','Binance Coin','Solana','Cardano'
  // ];
  const currencyList = ['SUI', 'BTC', 'ETH', 'BNB', 'solana', 'cardano'];
  interface PriceResponse {
      [key: string]: {
        usd: number;
      };
    }
    

    
const SwapPage: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [swapRate, setSwapRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<string>('SUI');
  const [destinationCurrency, setDestinationCurrency] = useState<string>('BTC');
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [conversionRate, setConversionRate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fetchedCurrency, setFetchedCurrency] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<FiatWallet[]>([]);
  // const [currencyIcons, setCurrencyIcons] = useState<Record<string, string>>({});
  // const [currencyList, setCurrencyList] = useState<string[]>([]);
  const [walletId, setWalletId] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const router = useRouter();
  const [style, setStyle] = useState({ backgroundColor: '#222531', color:'#ffffff' });
  const [styles, setStyles] = useState({ top:'30%' });
  const [blur,setBlur] = useState({ top:'7%' })
  const [flagIconUrl, setFlagIconUrl] = useState<string | null>(null);
  const [fromToken, setFromToken] = useState<string>("sui");
  const [toToken, setToToken] = useState<string>("bitcoin");
  // const [amount, setAmount] = useState<number>(0);
  const cloudinaryBaseUrl = "https://res.cloudinary.com/dgfv6j82t/";
  const paymentOptions = [
    { value: '', label: 'Payment Method' },
    { value: 'WalletBalance', label: 'Wallet Balance' },
    { value: 'Cards', label: 'Cards' },
    { value: 'UPI', label: 'UPI' }
  ];
  const [balances, setBalances] = useState<Record<string, number>>({
    INR: 0.00,
    USD: 0.00,
    GBP: 0.00,
    EUR: 0.00,
    AUD: 0.00,
    CAD: 0.00,
});

const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    AUS:'A$',
};
const isButtonEnabled = amount.trim() !== '' && paymentMode!=='' ;
// const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);


const handlePaymentModeChange = (selectedOption: OptionType | null) => {
  const selectedPaymentMode = selectedOption?.value || ''; // Safely extract the value
  setPaymentMode(selectedPaymentMode);

  console.log('Payment mode selected:', selectedPaymentMode);
};

useEffect(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const currency = params.get('currency') || '';
    if (currency) {
      setFetchedCurrency(currency);
    } else {
      console.error("Currency parameter not found in URL.");
    }
  }
}, []);
console.log("currency is: ",fetchedCurrency);
  useEffect(() => {
    if (fetchedCurrency) {
      fetchCurrencyIcon(fetchedCurrency);
    }
  }, [fetchedCurrency]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const walletIdValue = params.get('wallet_id') || "";
      setWalletId(walletIdValue);

    }
    
  }, []);

console.log("wallet id is: ",walletId);
const fetchCurrencyIcon = async (currencyName:string) => {
    try {
      const response = await axios.post(`https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiat_fiatSwap/get-currency-icon/`, {
        currency: currencyName.trim(),
      });
      

      if (response.data && response.data.icon_url) {
        const fullIconUrl = cloudinaryBaseUrl + response.data.icon_url; // Combine base URL with the relative path
        console.log("Fetched full icon URL:", fullIconUrl);
        setFlagIconUrl(fullIconUrl);
      } else {
        console.error("Icon URL not found in response:", response.data);
        setAlertMessage('Currency icon not found.');
      }
    } catch (error) {
      console.error("Error fetching currency icon:", error);
      // setAlertMessage('Failed to load currency icon.');
    }
  };
  
  console.log("url",flagIconUrl);
      // Fetch bank names on load


      useEffect(() => {
        if(walletId){
        axios
          .get<{ fiat_wallets: FiatWallet[] }>(`https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiat_fiatSwap/fiat_wallet/${walletId}/`)
          .then((response) => {
            console.log('response data', response.data);
            const wallets = response.data.fiat_wallets;
            setWalletData(wallets);
      
            // Extracting currency types
            const currencies = wallets.map((wallet) => wallet.currency_type);
            // setCurrencyList(currencies);
            setLoading(true);
          })
          .catch((err) => {
            setLoading(false);
            console.error('Error fetching wallet data:', err);
          });
        }
      }, [walletId]);


      
      

      
      
      // Generate dropdown options with currency icons
      // const currencyOptions = currencyList.map((currency_type) => {
      //   const iconUrl = currencyIcons[currency_type] || ''; 
    
      //   return {
      //     value: currency_type,
      //     label: (
      //       <div style={{ display: 'flex', alignItems: 'center' }}>
      //         <img
      //           src={cloudinaryBaseUrl + iconUrl}
      //           alt={currency_type}
      //           style={{ marginRight: 8, width: 24, height: 24 }} 
      //         />
      //        <span>{currency_type.replace('|', '')}</span> 
      //       </div>
      //     ),
      //   };
      // });
      const currencyOptions = currencyList.map((currency_type) => {
        const iconUrl = currencyIcons[currency_type as keyof typeof currencyIcons] || ''; 
      
        return {
          value: currency_type,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', overflow: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }}> 
              <img
                src={iconUrl}
                alt={""}
                style={{ marginRight: 8, width: 24, height: 24 }}
              />

              <span>{currency_type}</span>
            </div>
          ),
        };
      });
     
      



  useEffect(() => {
    if (amount) {
      setStyles((prevStyles) => ({
        ...prevStyles,
        top:'22%',
      }));
      setStyle((prevStyle) => ({
        ...prevStyle,
        background: '#e2f0ff',
        color: '#000000',
      }));
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        top:'55%',
      }));
      setStyle((prevStyle) => ({
        ...prevStyle,
        background: '#222531',
        color: '#4c516b',
      }));
      
      
    }
  }, [amount])
  const customSelectStyles = {
    control: (base: any) => ({
        ...base,
        flex: '1',
        backgroundColor: '#17171a',
        borderColor: '#2a2d3c',
        color: 'white',
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center',
        height: '40px', 
        boxShadow: 'none', 
        boxSizing: 'border-box',
        flexShrink: '0',
        fontFamily: 'Poppins',
        border: '1px solid #2a2d3c',
        left:'0px',
        // marginRight:"10px",
        position: 'relative',
        paddingRight: '0',
        
    }),
    indicatorSeparator: (base: any) => ({
      display: 'none', // Hides the separator
    }),
  
    // Style the dropdown arrow or hide it if needed
    dropdownIndicator: (base: any) => ({
      ...base,
      color: 'white', // Adjust the arrow color if you want it visible
      padding: '0', // Adjust padding to remove extra space
      marginRight:'10px',
    }),
  

 menu: (base: any) => ({
        ...base,
        backgroundColor: '#17171a',
    }),
    singleValue: (base: any) => ({
        ...base,
        color: '#888daa',
        fontFamily: "Poppins",
        display: 'flex',
        alignItems: 'center', 
        fontWeight:'600'
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? '#2a2d3c' : '#17171a',
        color: 'white',
    }),
  };

  




  useEffect(() => {
    const loadRazorpayScript = () => {
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      }
    };
    loadRazorpayScript();
  }, []);

  const initiateRazorpayPayment = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        const options: any = {
          key: RAZORPAY_KEY,
          amount: parseFloat(amount) * 100,
          currency: fetchedCurrency,
          name: 'DUPAY',
          description: 'Payment for currency conversion',
  
          handler: async (response: any) => {
            setShowForm(true);
            setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
  
            const conversionSuccess = await handleCurrencyConversion();
            
            // Navigate based on conversion success
            if (conversionSuccess) {
              router.push(`/FiatManagement/SwapSuccess?currency=${fetchedCurrency}&destination_currency=${destinationCurrency}&amount=${amount}`);
            } else {
              router.push(`/FiatManagement/SwapFailed?currency=${fetchedCurrency}&wallet_id=${walletId}`);  
            }
  
            resolve(true);
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#F37254',
          },
          modal: {
            ondismiss: () => resolve(false),
          },
        };
  
        if (paymentMode === 'UPI') {
          options.method = 'upi';
          options.upi = {
            vpa: 'user@upi',
          };
        }
  
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
      } else {
        setShowForm(true);
        setAlertMessage('Razorpay script not loaded.');
        resolve(false);
      }
    });
  };
  
  const handleCurrencyConversion = async (): Promise<boolean> => {
    if (!amount || !conversionRate) {
      setAlertMessage('Invalid conversion data.');
      return false; // Return false if validation fails
    }
  
    setShowLoader(true);
  
    const postData = {
      wallet_id: walletId,
      source_currency: sourceCurrency,
      destination_currency: destinationCurrency,
      amount: parseFloat(amount),
      conversion_rate: parseFloat(conversionRate),
    };
  
    try {
      const response = await fetch(`https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/convert_currency/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
  
      const result = await response.json();
      if (result.status === 'success') {
        setAlertMessage('Currency conversion successful!');
        return true;  // Return true if conversion is successful
      } else {
        setAlertMessage(`Error: ${result.message}`);
        return false; // Return false if an error occurred
      }
    } catch (error) {
      console.error('Error converting currency:', error);
      setAlertMessage('An error occurred. Please try again later.');
      return false; // Return false if there is an exception
    } finally {
      setShowLoader(false);
    }
  };
  
  const fetchConversionRate = useCallback(async () => {
    if (!amount || !sourceCurrency || !destinationCurrency) {
      return;
    }
  
    try {
      // Fetch token prices from CoinGecko API\
      console.log("Hi");
      const fromResponse = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${sourceCurrency}&vs_currencies=usd`
      );
      console.log("1");
      const toResponse = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${destinationCurrency}&vs_currencies=usd`
      );
      console.log("2");
      const fromRate = fromResponse.data[sourceCurrency].usd;
      console.log("3", fromRate);
      const toRate = toResponse.data[destinationCurrency].usd;
      console.log("4",toRate);
      const swapValue = (fromRate / toRate) * (parseFloat(amount) || 0);
      console.log("amount ad",(parseFloat(amount) || 0))
      console.log("5",swapValue);
  
      setSwapRate(parseFloat(swapValue.toFixed(3)));
      console.log("swap is :",swapRate);
  
    } catch (error) {
      console.error('Error fetching the conversion rate or token prices:', error);
      setAlertMessage('An error occurred. Please try again later.');
    }
  }, [amount, sourceCurrency, destinationCurrency]);
  
  useEffect(() => {
    fetchConversionRate();
  }, [amount, sourceCurrency, destinationCurrency, fetchConversionRate]);
  
  // Recalculate the converted amount when swapRate, amount, or currencies change
  useEffect(() => {
    if (amount && swapRate) {
      const converted = (parseFloat(amount) * swapRate).toFixed(2);
      setConvertedAmount(`${converted}`);
    } else {
      setConvertedAmount('');
    }
  }, [swapRate, amount]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const validInput = /^[0-9]*\.?[0-9]*$/;
  
    // Validate input to accept only valid number format
    if (!validInput.test(inputValue)) {
      return;
    }
  
    // Remove leading zeroes
    if (inputValue.length > 1 && inputValue.startsWith('0') && inputValue[1] !== '.') {
      inputValue = inputValue.slice(1);
    }
  
    // Limit to two decimal places
    if (inputValue.includes('.')) {
      const parts = inputValue.split('.');
      if (parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
      }
      inputValue = parts.join('.');
    }
  
    setAmount(inputValue);
  };
  const handleSwapButton = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the page from refreshing
    setShowForm(false);
    const paymentSuccess = await initiateRazorpayPayment();
    console.log("1");
    if (!paymentSuccess) {
      setShowForm(true);
      setAlertMessage("Payment Declined!");
      setPaymentMode("Select Payment Method");
      router.push(`/FiatManagement/SwapFailed?currency=${fetchedCurrency}&wallet_id=${walletId}`);
    }
    else{
        // setShowForm(true);
        // router.push("/FiatManagement/SwapSuccess");
    }
  };

  const handleCurrencySwap = () => {
    const temp = sourceCurrency;
    setSourceCurrency(destinationCurrency);
    setDestinationCurrency(temp);
  };

  const handleCloseAlert = useCallback(() => {
    setAlertMessage('');
  }, []);

  const handleLeftArrowClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      router.push('/Userauthorization/Dashboard/Home');
      setShowLoader(false);
    }, 3000);
  };
console.log("Selected currency for swap:", fetchedCurrency);


  return (
    <div>
      {showForm && (
        <div className="container">
          {alertMessage && (
            <div className="customAlert">
              <p>{alertMessage}</p>
              <button onClick={handleCloseAlert} className="closeButton">OK</button>
            </div>
          )}
          {showLoader && (
            <div className="loaderContainer" >
              <LottieAnimationLoading />
            </div>
          )}
          <img className="shapeIcon" alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729139397/4c03bd90-fdce-4081-9358-1e6849723549.png" />
          <div className="navbarnavBar">
            <div className="navbaritemleftBtn">
            <div className="iconiconWrapper">
            <img
              className="iconarrowLeftBack"
              alt="Back"
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728536746/f8f904f1-485a-42cc-93c6-a9abd4346f30.png"
              onClick={handleLeftArrowClick} // Attach click handler
              style={{ cursor: 'pointer' }} // Optional: Makes it look clickable
          />
            </div>
            </div>
            <div className="hereIsTitle">Swap SUI</div>
            <div className="navbaritemrightBtn" />
            </div>
          <form>
          <div className="balanceCard">
                <div className="balanceDetails">
                    <img 
                        src={"https://res.cloudinary.com/dgfv6j82t/image/upload/v1729751154/a2ca4b2c-1d38-48c4-b77c-5026eacbefa6.png"} 
                        alt={''}
                        className="currencyImage"
                    />
                    <div className="currencyText">
                        <span className="currencyCode">Total SUI</span>
                        {/* <span className="currencyCountry">{selectedCountry}</span> */}
                    </div>
                    <div className="balanceAmount">
                    <p className="balanceAmount">
                         {(balances[fetchedCurrency || ''] !== undefined ? balances[fetchedCurrency || ''].toFixed(2) : '1234.00') } {fetchedCurrency}
                    </p>
                    </div>
                </div>
            </div>
            <div className="howMuchUsd">Choose a currency you want to Swap</div>
            <div className='currency-row'>
              <div className="inputinputs">
                <Select
                  options={currencyOptions}
                  value={currencyOptions.find((option) => option.value === sourceCurrency) || currencyOptions[0]}
                  onChange={(selectedOption) => {
                    setSourceCurrency(selectedOption?.value || '');
                    console.log('Source Currency Changed: ', selectedOption?.value);
                    fetchConversionRate();
                  }}
                  styles={customSelectStyles}
                  
                />
              </div>

              <button
                type="button"
                className="swap-button"
                onClick={handleCurrencySwap}
                aria-label="Swap currencies"
              >
                <img className="swapHoriz24dpE8eaedFill0WIcon" alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727781135/48d4a1fe-22e1-4e2c-9f39-36b0042f7556.png" />
              </button>

              <div className="inputinputs">
                <Select
                  options={currencyOptions}
                  value={currencyOptions.find((option) => option.value === destinationCurrency) || currencyOptions[2]}
                  onChange={(selectedOption) => {
                    setDestinationCurrency(selectedOption?.value || '');
                    console.log('Destination Currency Changed: ', selectedOption?.value);
                    fetchConversionRate();
                  }}
                  styles={customSelectStyles}
                />
              </div>
              </div>
            <div className="amount-row">
              <div className="amount-group">
              <div className="howMuchUsd">How much sui you want to swap?</div>
                {/* <label className="balance-label">How much {fetchedCurrency} you want to swap?</label> */}
                <div className="input-container">
                  <label 
                    className={`floating-label ${amount ? 'active' : ''}`} 
                    htmlFor="amount"
                  >
                    Enter amount of tokens
                  </label>
                  <input
                    type="tel"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                    inputMode="numeric" // This will trigger the numeric keypad
                  />
                </div>
                
                
              </div>
            </div>

            {/* <div className="payment-method">
              <div className="howMuchUsd">Select a payment method</div>
              <Select
                options={paymentOptions}
                value={paymentOptions.find((option) => option.value === paymentMode) || null}
                onChange={handlePaymentModeChange}
                styles={customSelectStylesPayement}
              />
            </div> */}
            {amount && (
            <div className="frameParent">
              <div className="frameWrapper">
                <div className="int000Parent">
                  <div className="int000">Converted SUI in {destinationCurrency}</div>
                  <div className="int0001">Powered by DUPAY</div>
                </div>
              </div>
              <div className="frameContainer">
                <div className="int000Wrapper">
                  <div className="int0002"> {destinationCurrency} {swapRate || '0.000'}</div>
                </div>
              </div>
            </div>
            )}
          {/* <img className="swap_shape_icon" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728881310/5e88fa10-f8ab-492d-82ad-5e3bcfe88593.png" alt="" /> */}
          <button
              className={`btnmbBtnFab swap-button ${!isButtonEnabled ? 'disabled' : ''}`}
              style={styles}
              disabled={!isButtonEnabled} >
              <div className="btnbtn" style={style} onClick={handleSwapButton}>
                <div className="text">Swap</div>
              </div>
            </button>
            {/* <div className='blurred' style={blur}></div> */}
          </form>
        </div>
      )}
    </div>
  );
};

export default SwapPage;