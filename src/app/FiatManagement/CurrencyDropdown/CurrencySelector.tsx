"use client"
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import country_list from './country-list';
import styles from './CurrencySelector.module.css';
import { FaArrowLeft } from 'react-icons/fa';

interface CountryList {
  [key: string]: string;
}

const CurrencySelector: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const router = useRouter();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  const handleCurrencySelect = (currency: string): void => {
    setSelectedCurrency(currency);
    router.push(`/FiatManagement/Currency_Conversion?currency=${currency}`);
  };

  const filteredCurrencies = Object.entries(country_list).filter(([currency]) =>
    currency.toLowerCase().includes(search.toLowerCase())
  );

  const handleLeftArrowClick = (): void => {
    window.location.href = '/FiatManagement/Currency_Conversion';
  };

  return (
    <div className={styles.currencySelector}>
      <div className={styles.topBar}>
        <button className={styles.topBarButton}>
          <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick} />
        </button>
        <h2 className={styles.topBarTitle}>Change Currency</h2>
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
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img
              src={`https://flagcdn.com/48x36/${country_list[currency].toLowerCase()}.png`}
              alt="flag"
              style={{
                width: '24px', // Adjust width
                height: '18px', // Adjust height
                marginRight: '235px', // Adjust margin
                objectFit: 'contain' // Keep aspect ratio intact
              }}
            />
            {currency}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelector;
