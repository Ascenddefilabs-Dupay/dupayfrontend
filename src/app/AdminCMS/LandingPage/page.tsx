"use client";
import { useState } from 'react';
import styles from './page.module.css'; // Import the CSS module

interface RequestBody {
  account_type?: string;
  currency_type?: string;
}

const Home = () => {
  const [showTextBox, setShowTextBox] = useState<string>(''); // Correct type declaration
  const [inputValue, setInputValue] = useState<string>(''); // Correct type declaration
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state

  const handleButtonClick = (type: string) => {
    setShowTextBox(type);
    setInputValue(''); // Reset input when switching
  };

  const handleAddClick = async () => {
    if (showTextBox === '') {
      alert('Please select an option.');
      return;
    }

    if (inputValue.trim() === '') {
      alert('Input cannot be empty.');
      return;
    }

    const requestBody: RequestBody = {};
    if (showTextBox === 'account') {
      requestBody.account_type = inputValue;
    } else if (showTextBox === 'currency') {
      requestBody.currency_type = inputValue;
    }

    setIsLoading(true); // Set loading to true when starting the request

    try {
      const response = await fetch("http://localhost:8000/api/admincms/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message || 'Added successfully');
        setInputValue(''); // Clear the input field after adding
        setShowTextBox(''); // Optionally, hide the text box after adding
      } else {
        const errorData = await response.json();
        alert(`Failed to add: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false); // Set loading to false when the request is complete
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Content Management</h1>

      <div className={styles.buttonContainer}>
        <button onClick={() => handleButtonClick('account')} className={styles.button}>
          Account Type
        </button>
        <button onClick={() => handleButtonClick('currency')} className={styles.button}>
          Currency Type
        </button>
      </div>

      {showTextBox && (
        <div className={styles.textBoxContainer}>
          <input
            type="text"
            placeholder={`Enter ${showTextBox === 'account' ? 'Account' : 'Currency'} Type`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleAddClick} className={styles.addButton} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
