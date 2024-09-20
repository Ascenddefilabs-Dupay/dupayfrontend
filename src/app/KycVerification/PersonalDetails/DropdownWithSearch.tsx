'use client'
import React, { useState, useEffect } from 'react';
import styles from './DropdownWithSearch.module.css';

interface Option {
  code: string;
  dialCode: string;
}

interface DropdownWithSearchProps {
  options: Option[];
  selectedOption: string;
  onSelect: (value: string) => void;
}

const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({ options = [], selectedOption, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.dialCode.includes(searchQuery)
      )
    );
  }, [searchQuery, options]);

  const handleOptionClick = (option: Option) => {
    onSelect(option.dialCode);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.optionsContainer}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.code}
                  className={styles.option}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.code} ({option.dialCode})
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownWithSearch;
