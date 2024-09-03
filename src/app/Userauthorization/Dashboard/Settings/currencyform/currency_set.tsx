// import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Correct import for app directory
// import country_list from './country-list';
// import styles from '../currencyform/currency_form.module.css';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const CurrencySelector = () => {
//     const [search, setSearch] = useState('');
//     const [selectedCurrency, setSelectedCurrency] = useState('');
//     const router = useRouter();

//     const handleSearchChange = (event) => {
//         setSearch(event.target.value);
//     };

//     const handleCurrencySelect = (currency) => {
//         setSelectedCurrency(currency);
//         router.push(`/Userauthorization/Dashboard/displayform?currency=${encodeURIComponent(currency)}`);
//         router.push('http://localhost:3000//Userauthorization/Dashboard/Settings/displayform');
//     };

//     const filteredCurrencies = Object.entries(country_list).filter(([currency]) =>
//         currency.toLowerCase().includes(search.toLowerCase())
//     );
    

//     const currencyItemhandleBackClick = () => {
//         router.push('http://localhost:3000//Userauthorization/Dashboard/Settings/displayform'); 
//     };

//     return (
//         <div className={styles.currencySelector}>
//             <div className="currecy_header">
//                 <ArrowBackIcon className="currency_set_icon" onClick={currencyItemhandleBackClick}  />
//                 <span>Local Currency</span>
//             </div>
//             <input
//                 type="text"
//                 placeholder="Search"
//                 value={search}
//                 onChange={handleSearchChange}
//                 className={styles.searchInput}
//             />
//             <div className={styles.currencyList}>
//                 {filteredCurrencies.map(([currency]) => (
//                 <div
//                     key={currency}
//                     className={`${styles.currencyItem} ${selectedCurrency === currency ? styles.selected : ''}`}
//                     onClick={() => handleCurrencySelect(currency)}
//                 >
//                     <img
//                     src={`https://flagcdn.com/48x36/${country_list[currency].toLowerCase()}.png`}
//                     alt="flag"
//                     className={styles.flag}
//                     />
//                     {currency}
//                 </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default CurrencySelector;



import { useState } from 'react';
import { useRouter } from 'next/navigation';
import country_list from './country-list';
import styles from '../currencyform/currency_form.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CurrencySelector = () => {
    const [search, setSearch] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const router = useRouter();

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleCurrencySelect = (currency) => {
        setSelectedCurrency(currency);
        // Redirect to DisplaySettings with the selected currency in the query string
        router.push(`/Userauthorization/Dashboard/Settings/displayform?currency=${encodeURIComponent(currency)}`);
    };

    const filteredCurrencies = Object.entries(country_list).filter(([currency]) =>
        currency.toLowerCase().includes(search.toLowerCase())
    );

    const handleBackClick = () => {
        router.push('/Userauthorization/Dashboard/Settings/displayform');
    };

    return (
        <div className={styles.currencySelector}>
            <div className="currecy_header">
                <ArrowBackIcon className="currency_set_icon" onClick={handleBackClick} />
                <span>Local Currency</span>
            </div>
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            <div className={styles.currencyList}>
                {filteredCurrencies.map(([currency]) => (
                    <div
                        key={currency}
                        className={`${styles.currencyItem} ${selectedCurrency === currency ? styles.selected : ''}`}
                        onClick={() => handleCurrencySelect(currency)}
                    >
                        <img
                            src={`https://flagcdn.com/48x36/${country_list[currency].toLowerCase()}.png`}
                            alt="flag"
                            className={styles.flag}
                        />
                        {currency}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrencySelector;