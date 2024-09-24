import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import country_list from './country-list';
import styles from '../currencyform/currency_form.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Define a type for the country_list object
type CountryList = {
  [key: string]: string;
};

const CurrencySelector = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const sessionDataString = window.localStorage.getItem('session_data');
          if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            const storedUserId = sessionData.user_id;
            setUserId( storedUserId);
            console.log(storedUserId);
            console.log(sessionData.user_email);
          } else {
            // redirect('http://localhost:3000/Userauthentication/SignIn');
          }
        }
      }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleCurrencySelect = (currency: string) => {
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
              src={`https://flagcdn.com/48x36/${(country_list as CountryList)[currency].toLowerCase()}.png`}
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
