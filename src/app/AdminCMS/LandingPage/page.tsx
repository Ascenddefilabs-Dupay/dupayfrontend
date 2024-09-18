"use client";
import { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaArrowLeft, FaPlus } from 'react-icons/fa'; 
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [activeButton, setActiveButton] = useState<string>(''); 
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false); 

  const handleButtonClick = async (type: string) => {
    setShowTextBox(type); 
    setInputValue(''); 
    setBackButtonVisible(true); 
    setActiveButton(type);  
    setIsInputVisible(false);

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
      toast.error('An error occurred while fetching data.', { autoClose: false });
      setFetchedValues([]);
    }
  };

  const handleBackClick = () => {
    setShowTextBox(''); 
    setFetchedValues([]); 
    setBackButtonVisible(false); 
    setActiveButton('');  
    setIsInputVisible(false);
  };

  const handlePlusClick = () => {
    setIsInputVisible(true); 
  };

  const handleAddClick = async () => {
    if (showTextBox === '' || inputValue.trim() === '') {
      toast.warning('Please provide a valid input.', { autoClose: false });
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
        setIsInputVisible(false); 
        toast.success('Added successfully.', { autoClose: 1000 });
      } else {
        toast.error('Failed to add value.', { autoClose: false });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while adding the value.', { autoClose: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number, currentValue: string) => {
    setEditMode(id); 
    setEditedValue(currentValue); 
  };

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
        toast.success('Updated successfully.', { autoClose: 1000 });
        setFetchedValues(prev =>
          prev.map(item => (item.id === id ? { ...item, [showTextBox + '_type']: editedValue } : item))
        );
        setEditMode(null); 
      } else {
        toast.error('Failed to update.', { autoClose: false });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating.', { autoClose: false });
    }
  };

  const handleDelete = async (id: number) => {
    if (await toast.promise(
      fetch(`http://localhost:8000/api/admincms/${id}/`, {
        method: 'DELETE',
      }).then(response => {
        if (response.ok) {
          setFetchedValues(fetchedValues.filter(item => item.id !== id)); 
          return 'Deleted successfully.';
        } else {
          throw new Error('Failed to delete.');
        }
      }),
      {
        pending: 'Deleting...',
        success: 'Deleted successfully.',
        error: 'Failed to delete.',
      },
      { autoClose: 1000 }
    )) {
      // Successfully deleted
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        {backButtonVisible && (
          <div className={styles.backButtonContainer}>
            <FaArrowLeft className={styles.backArrowIcon} onClick={handleBackClick} />
            
          </div>
        )}
        <h1 className={styles.navbarTitle}>Content Management</h1>
      </nav>

      <div className={styles.buttonContainer}>
        <button 
          onClick={() => handleButtonClick('account')} 
          className={`${styles.button} ${activeButton === 'account' ? styles.activeButton : styles.inactiveButton}`}
          disabled={activeButton === 'currency'}
        >
          Account Type
        </button>
        <button 
          onClick={() => handleButtonClick('currency')} 
          className={`${styles.button} ${activeButton === 'currency' ? styles.activeButton : styles.inactiveButton}`}
          disabled={activeButton === 'account'}
        >
          Currency Type
        </button>
      </div>
      {isInputVisible && (
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
                <th>
                  {showTextBox === 'account' ? 'Account Type' : 'Currency Type'}
                  <FaPlus className={styles.plusIcon} onClick={handlePlusClick} />
                </th>
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
                        className={styles.inputEdit} 
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
                          <FaTrash className={styles.deleteicon} onClick={() => handleDelete(item.id)} />
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


      <ToastContainer position="top-center" />
    </div>
  );
};

export default Home;
