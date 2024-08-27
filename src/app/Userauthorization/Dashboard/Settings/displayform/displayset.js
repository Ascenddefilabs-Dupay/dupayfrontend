// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import '../displayform/displayset.css';
// import { FormLabel, RadioGroup, FormControlLabel, Radio, Switch } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// const DisplaySettings = () => {
//   const [appearance, setAppearance] = useState('auto');
//   const [privacyMode, setPrivacyMode] = useState(false);
//   const [hideSmallBalances, setHideSmallBalances] = useState(false);
//   const [hideSmallTestnet, setHideSmallTestnet] = useState(false);
//   const [hideSmalltabs, setHideSmalltabs] = useState(false);
//   const [selectedCurrency, setSelectedCurrency] = useState('INR');
//   const router = useRouter();

//   // Effect to set selectedCurrency based on the router query
//   useEffect(() => {
//     if (router.query && router.query.currency) {
//       setSelectedCurrency(router.query.currency);
//     }
//   }, [router.query]);

//   const handleCurrencySelect = (currency) => {
//     setSelectedCurrency(currency);
//     router.push(`/Userauthorization/Dashboard/Settings/displayform?currency=${encodeURIComponent(currency)}`);
//   };


//   const handleAppearanceChange = (event) => {
//     setAppearance(event.target.value);
//   };

//   const handlePrivacy = (event) => {
//     setPrivacyMode(event.target.checked);
//   };

//   const handleHide = (event) => {
//     setHideSmallBalances(event.target.checked);
//   };

//   const handleTestnet = (event) => {
//     setHideSmallTestnet(event.target.checked);
//   };

//   const handleTabs = (event) => {
//     setHideSmalltabs(event.target.checked);
//   };

//   const displayhandleBackClick = () => {
//     let redirectUrl = 's/Cryprto_Wallet/Dashboard/Settings';
//     router.push(redirectUrl);
//   };

//   return (
//     <div className="container">
//       <div className="display_card">
//         <div className="display_header">
//           <ArrowBackIcon className="diplay_icon" onClick={displayhandleBackClick} />
//           <span>Display</span>
//         </div>
//         <div className="appearance_set">
//           <FormLabel component="legend" className="display_label">Appearance</FormLabel>
//           <RadioGroup value={appearance} onChange={handleAppearanceChange}>
//             <div className="display_card1">
//               <button className="display_button1">
//                 <div className="dark_label">
//                   <span className="dark">Dark</span>
//                   <span className="dark1">Always use dark mode</span>
//                 </div>
//                 <FormControlLabel value="dark" control={<Radio />} />
//               </button>
//             </div>
//             <div className="display_card2">
//               <button className="display_button2">
//                 <div className="dark_label1">
//                   <span className="darks">Light</span>
//                   <span className="darks1">Always use light mode</span>
//                 </div>
//                 <FormControlLabel value="light" control={<Radio />} />
//               </button>
//             </div>
//             <div className="display_card3">
//               <button className="display_button3">
//                 <div className="dark_label2">
//                   <span className="dark_set">Auto</span>
//                   <span className="dark_set1">Use your device's default mode</span>
//                 </div>
//                 <FormControlLabel value="auto" control={<Radio />} />
//               </button>
//             </div>
//           </RadioGroup>
//           <hr style={{ marginBottom: '10px', border: '1px solid gray' }} />
//           <FormLabel component="legend1" className="display_labels1">Balances</FormLabel>
//           <div className="display_card4">
//             <button className='display_button4' onClick={handlecurrencyselector}>
//               <span className="display_local">Local currency</span>
//               <span className="display_usd">{selectedCurrency}</span>
//               <ChevronRightIcon className="display_icon" />
//             </button>
//           </div>
//           <div className="display_privacy">
//             <button className='displays_button'>
//               <div className="display-info">
//                 <span className="privacy-title4">Privacy Mode</span>
//                 <span className="privacy-description">Hide all Balances</span>
//               </div>
//               <label className="switch1">
//                 <Switch checked={privacyMode} onChange={handlePrivacy} />
//               </label>
//             </button>
//           </div>
//           <div className="display_hide">
//             <button className='displays_button1'>
//               <div className="display-info1">
//                 <span className="hide_title">Hide all Balances</span>
//                 <span className="hide-description">Balances below $1.00</span>
//               </div>
//               <label className="hide_switch">
//                 <Switch checked={hideSmallBalances} onChange={handleHide} />
//               </label>
//             </button>
//           </div>
//           <div className="display_test">
//             <button className='displays_button2'>
//               <div className="display-info2">
//                 <span className="test_title">Testnets</span>
//                 <span className="test-description">Show testnet balances</span>
//               </div>
//               <label className="test_switch">
//                 <Switch checked={hideSmallTestnet} onChange={handleTestnet} />
//               </label>
//             </button>
//           </div>
//           <hr style={{ marginBottom: '10px', border: '1px solid gray' }} />
//           <FormLabel component="legend2" className="display_labels2">Tabs</FormLabel>
//           <div className="display_tab">
//             <button className='displays_button3'>
//               <div className="display-info3">
//                 <span className="tab_title">Sticky tabs</span>
//                 <span className="tab-description">The last tab selected always stays selected, even after app close</span>
//               </div>
//               <label className="tab_switch">
//                 <Switch checked={hideSmalltabs} onChange={handleTabs} />
//               </label>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DisplaySettings;


'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../displayform/displayset.css';
import { FormLabel, RadioGroup, FormControlLabel, Radio, Switch } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const DisplaySettings = () => {
  const [appearance, setAppearance] = useState('auto');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [hideSmallTestnet, setHideSmallTestnet] = useState(false);
  const [hideSmalltabs, setHideSmalltabs] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currency = params.get('currency');
    if (currency) {
      setSelectedCurrency(currency);
    }
  }, []);

  const handleAppearanceChange = (event) => {
    setAppearance(event.target.value);
  };

  const handlePrivacy = (event) => {
    setPrivacyMode(event.target.checked);
  };

  const handleHide = (event) => {
    setHideSmallBalances(event.target.checked);
  };

  const handleTestnet = (event) => {
    setHideSmallTestnet(event.target.checked);
  };

  const handleTabs = (event) => {
    setHideSmalltabs(event.target.checked);
  };

  const displayhandleBackClick = () => {
    router.push('/Userauthorization/Dashboard/Settings');
  };

  const handleCurrencySelector = () => {
    router.push('/Userauthorization/Dashboard/Settings/currencyform');
  };

  return (
    <div className="container">
      <div className="display_card">
        <div className="display_header">
          <ArrowBackIcon className="diplay_icon" onClick={displayhandleBackClick} />
          <span>Display</span>
        </div>
        <div className="appearance_set">
          <FormLabel component="legend" className="display_label">Appearance</FormLabel>
          <RadioGroup value={appearance} onChange={handleAppearanceChange}>
            <div className="display_card1">
              <button className="display_button1">
                <div className="dark_label">
                  <span className="dark">Dark</span>
                  <span className="dark1">Always use dark mode</span>
                </div>
                <FormControlLabel value="dark" control={<Radio />} />
              </button>
            </div>
            <div className="display_card2">
              <button className="display_button2">
                <div className="dark_label1">
                  <span className="darks">Light</span>
                  <span className="darks1">Always use light mode</span>
                </div>
                <FormControlLabel value="light" control={<Radio />} />
              </button>
            </div>
            <div className="display_card3">
              <button className="display_button3">
                <div className="dark_label2">
                  <span className="dark_set">Auto</span>
                  <span className="dark_set1">Use your device's default mode</span>
                </div>
                <FormControlLabel value="auto" control={<Radio />} />
              </button>
            </div>
          </RadioGroup>
          <hr style={{ marginBottom: '10px', border: '1px solid gray' }} />
          <FormLabel component="legend1" className="display_labels1">Balances</FormLabel>
          <div className="display_card4">
            <button className='display_button4' onClick={handleCurrencySelector}>
              <span className="display_local">Local currency</span>
              <span className="display_usd">{selectedCurrency}</span>
              <ChevronRightIcon className="display_icon" />
            </button>
          </div>
          <div className="display_privacy">
            <button className='displays_button'>
              <div className="display-info">
                <span className="privacy-title4">Privacy Mode</span>
                <span className="privacy-description">Hide all Balances</span>
              </div>
              <label className="switch1">
                <Switch checked={privacyMode} onChange={handlePrivacy} />
              </label>
            </button>
          </div>
          <div className="display_hide">
            <button className='displays_button1'>
              <div className="display-info1">
                <span className="hide_title">Hide all Balances</span>
                <span className="hide-description">Balances below $1.00</span>
              </div>
              <label className="hide_switch">
                <Switch checked={hideSmallBalances} onChange={handleHide} />
              </label>
            </button>
          </div>
          <div className="display_test">
            <button className='displays_button2'>
              <div className="display-info2">
                <span className="test_title">Testnets</span>
                <span className="test-description">Show testnet balances</span>
              </div>
              <label className="test_switch">
                <Switch checked={hideSmallTestnet} onChange={handleTestnet} />
              </label>
            </button>
          </div>
          <hr style={{ marginBottom: '10px', border: '1px solid gray' }} />
          <FormLabel component="legend2" className="display_labels2">Tabs</FormLabel>
          <div className="display_tab">
            <button className='displays_button3'>
              <div className="display-info3">
                <span className="tab_title">Sticky tabs</span>
                <span className="tab-description">The last tab selected always stays selected, even after app close</span>
              </div>
              <label className="tab_switch">
                <Switch checked={hideSmalltabs} onChange={handleTabs} />
              </label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;