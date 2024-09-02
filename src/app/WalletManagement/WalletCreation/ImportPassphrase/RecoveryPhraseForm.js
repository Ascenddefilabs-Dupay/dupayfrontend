import React, { useEffect, useState } from 'react';
import './RecoveryPhraseForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const RecoveryPhraseForm = () => {
    const [phrases, setPhrases] = useState(Array(12).fill(''));
    const [showPhrases, setShowPhrases] = useState(Array(12).fill(false));
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false));
    return () => clearTimeout(timer);
  }, []);

    const handleChange = (index, value) => {
        const newPhrases = [...phrases];
        newPhrases[index] = value;
        setPhrases(newPhrases);
    };

    const toggleVisibility = (index) => {
        const newShowPhrases = [...showPhrases];
        newShowPhrases[index] = !newShowPhrases[index];
        setShowPhrases(newShowPhrases);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            console.log(phrases);
            
            const response = await axios.post('https://walletmanagement-rcfpsxcera-uc.a.run.app/walletmanagementapi/check-recovery-phrase/', {
                phrases,
            });

            if (response.data.success) {
                const { wallet_id } = response.data;
                sessionStorage.setItem('wallet_id', wallet_id);
                console.log(wallet_id);
                // setTimeout(() => {
                window.location.href = './UpdatePassword/';
                // }, 2000);
            } else {
                setErrorMessage('Password words are incorrect');
            }
        } catch (error) {
            console.error('There was an error!', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const handleLeftArrowClick = () => {
        window.location.href = './AddAccount';
    };  
      

    return (
        <div className="wallet-manager">
            {loading ? (
        <div className='loading'>
          <div className='spinner'></div>
          <p className='loadingText'>LOADING</p>
        </div>
      ) : (
            <div className="recovery-phrase-form">
                <h2>WALLET SETUP</h2>
                <h3>Add Existing Account</h3>
                <p>Enter your 12-word Recovery Phrase</p>
                <form onSubmit={handleSubmit}>
                    <div className="phrase-grid">
                        {phrases.map((phrase, index) => (
                            <div key={index} className="phrase-input">
                                <div className="password-input">
                                    <input
                                        type={showPhrases[index] ? 'text' : 'password'}
                                        value={phrase}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        placeholder={`Password ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility(index)}
                                    >
                                        <FontAwesomeIcon
                                            icon={showPhrases[index] ? faEye : faEyeSlash}
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button type="submit">Add Account</button>
                </form>
                <button className="cancel" onClick={handleLeftArrowClick}>Cancel</button>
            </div>
            )}
        </div>
    );
};

export default RecoveryPhraseForm;
