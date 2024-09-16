"use client";
import { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa'; 
import styles from './page.module.css'; 

interface RequestBody {
  account_type?: string;
  currency_type?: string;
}

interface FetchedValue {
  id: number;
  account_type?: string;
  currency_type?: string;
}

const Home = () => {
  const [showTextBox, setShowTextBox] = useState<string>(''); 
  const [inputValue, setInputValue] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [fetchedValues, setFetchedValues] = useState<FetchedValue[]>([]); 
  const [editMode, setEditMode] = useState<number | null>(null); 
  const [editedValue, setEditedValue] = useState<string>(''); 
  const [backButtonVisible, setBackButtonVisible] = useState<boolean>(false); 
  const [activeButton, setActiveButton] = useState<string>(''); // State for active button
  // Fetch values from the backend when a button is clicked
  const handleButtonClick = async (type: string) => {
    setShowTextBox(type); 
    setInputValue(''); 
    setBackButtonVisible(true); 
    setActiveButton(type); // Show the back button when a type is selected

    try {
      const response = await fetch(`http://localhost:8000/api/admincms/${type}/`);
      if (response.ok) {
        const data = await response.json();
        setFetchedValues(data); 
      } else {
        setFetchedValues([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFetchedValues([]);
    }
  };

  // Handle the Back button click (now with arrow)
  const handleBackClick = () => {
    setShowTextBox(''); 
    setFetchedValues([]); 
    setBackButtonVisible(false); 
    setActiveButton('');// Hide the back button
  };

  // Handle adding a new value
  const handleAddClick = async () => {
    if (showTextBox === '' || inputValue.trim() === '') {
      alert('Please provide a valid input.');
      return;
    }

    const requestBody: RequestBody = {};
    if (showTextBox === 'account') requestBody.account_type = inputValue;
    if (showTextBox === 'currency') requestBody.currency_type = inputValue;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/admincms/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        setFetchedValues(prev => [...prev, { id: responseData.data.id, [showTextBox + '_type']: inputValue }]);
        setInputValue('');
      } else {
        alert('Failed to add value');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing an existing item
  const handleEdit = (id: number, currentValue: string) => {
    setEditMode(id); 
    setEditedValue(currentValue); 
  };

  // Handle saving the edited value
  const handleSave = async (id: number) => {
    const requestBody: RequestBody = {};
    if (showTextBox === 'account') requestBody.account_type = editedValue;
    if (showTextBox === 'currency') requestBody.currency_type = editedValue;

    try {
      const response = await fetch(`http://localhost:8000/api/admincms/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert('Updated successfully');
        setFetchedValues(prev =>
          prev.map(item => (item.id === id ? { ...item, [showTextBox + '_type']: editedValue } : item))
        );
        setEditMode(null); 
      } else {
        alert('Failed to update');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  // Handle deleting an existing item
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/admincms/${id}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFetchedValues(fetchedValues.filter(item => item.id !== id)); 
        } else {
          alert('Failed to delete');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    }
  };

  return (
    <div className={styles.container}>
      {backButtonVisible && (
        <FaArrowLeft onClick={handleBackClick} className={styles.backArrowIcon} />
      )}
      <h1 className={styles.title}>Content Management</h1>


      <div className={styles.buttonContainer}>
        <button 
          onClick={() => handleButtonClick('account')} 
          className={`${styles.button} ${activeButton === 'account' ? styles.activeButton : ''}`}
          disabled={showTextBox === 'currency'} // Disable the other button
        >
          Account Type
        </button>
        <button 
          onClick={() => handleButtonClick('currency')} 
          className={`${styles.button} ${activeButton === 'currency' ? styles.activeButton : ''}`}
          disabled={showTextBox === 'account'} // Disable the other button
        >
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

      {fetchedValues.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{showTextBox === 'account' ? 'Account Type' : 'Currency Type'}</th>
              </tr>
            </thead>
            <tbody>
              {fetchedValues.map((item) => (
                <tr key={item.id}>
                  <td className={styles.tableRow}>
                    {editMode === item.id ? (
                      <input
                        type="text"
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        className={styles.inputEdit} // Different style for editable input
                      />
                    ) : (
                      showTextBox === 'account' ? item.account_type : item.currency_type
                    )}
                    <div className={styles.actionIcons}>
                      {editMode === item.id ? (
                        <FaSave className={styles.icon} onClick={() => handleSave(item.id)} />
                      ) : (
                        <>
                          <FaEdit
                            className={styles.icon}
                            onClick={() => handleEdit(
                              item.id, 
                              showTextBox === 'account' ? (item.account_type ?? '') : (item.currency_type ?? '')
                            )}
                          />
                          <FaTrash className={styles.icon} onClick={() => handleDelete(item.id)} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
