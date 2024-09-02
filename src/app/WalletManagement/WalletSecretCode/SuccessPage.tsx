'use client';
import ProgressBar from '../WalletCreation/ProgressBar';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';
import axios from 'axios';

const SuccessPage: React.FC = () => {

    const [recoveryWords, setRecoveryWords] = useState<string[]>([]);
    const [shuffledWords, setShuffledWords] = useState<string[]>([]);
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const [firstSelectedIndex, setFirstSelectedIndex] = useState<number | null>(null);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false));
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const words = localStorage.getItem('recoveryWords');
        if (words) {
            const wordArray = words.split(' ');
            setRecoveryWords(wordArray);
            setShuffledWords(shuffleArray(wordArray));
        }
    }, []);

    const shuffleArray = (array: string[]) => {
        const shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handleButtonClick = (index: number) => {
        if (selectedIndexes.includes(index)) {
            const updatedIndexes = selectedIndexes.filter(i => i !== index);
            setSelectedIndexes(updatedIndexes);

            if (index === firstSelectedIndex) {
                setFirstSelectedIndex(null);
            }

            if (index === lastSelectedIndex) {
                setLastSelectedIndex(null);
            }
        } else {
            if (selectedIndexes.length === 0) {
                setSelectedIndexes([index]);
                setFirstSelectedIndex(index);
            } else if (selectedIndexes.length === 1 && !selectedIndexes.includes(index)) {
                setSelectedIndexes([...selectedIndexes, index]);
                setLastSelectedIndex(index);
            }
        }
    };

    const handleLeftArrowClick = () => {
        window.location.href = '../WalletSecretCode';
    };

    const handleSubmit = async () => {
        if (firstSelectedIndex !== null && lastSelectedIndex !== null) {
            const firstWord = shuffledWords[firstSelectedIndex];
            const lastWord = shuffledWords[lastSelectedIndex];

            const expectedFirstWord = recoveryWords[0];
            const expectedLastWord = recoveryWords[recoveryWords.length - 1];

            const isCorrect = 
                firstWord.toLowerCase() === expectedFirstWord.toLowerCase() &&
                lastWord.toLowerCase() === expectedLastWord.toLowerCase();

            if (isCorrect) {
                setIsSuccess(true);
                setLoading(true)
                try {
                    // Retrieve wallet_id and password from localStorage
                    const walletId = localStorage.getItem('wallet_id');
                    const password = localStorage.getItem('password');
                    // const recoveryWords = localStorage.getItem('recoveryWords');
                    
                    // Print data to the console
                    console.log('Wallet ID:', walletId);
                    console.log('Password:', password);
                    console.log('Recovery Phrases:', recoveryWords);

                    // Send data to the backend
                    await axios.post('https://walletmanagement-rcfpsxcera-uc.a.run.app/walletmanagementapi/save-wallet-data/', {
                        wallet_id: walletId,
                        password,
                        recovery_phrases: recoveryWords.join(' '),
                    });

                    // Clear local storage
                    localStorage.removeItem('walletId');
                    localStorage.removeItem('password');
                    localStorage.removeItem('recoveryWords');
                    localStorage.removeItem('last_wallet_id');


                    window.location.href = '../WalletSubmit';
                } catch (error) {
                    console.error('Error saving phrase:', error);
                    alert('Enter The Password');
                }
            } else {
                setIsSuccess(false);
            }
        }
    };

    return (
        <div>
        {loading ? (
        <div className='loading'>
          <div className='spinner'></div>
          <p className='loadingText'>LOADING</p>
        </div>
      ) : (
        <div className="success-wrapper">
            <div className="container">
                <div className="column left" onClick={handleLeftArrowClick}>
                    <FaArrowLeft />
                </div>
                <div className="column middle">
                    <ProgressBar currentStep={4} totalSteps={4} />
                </div>
                <div className="column right">
                    {/* Right column content */}
                </div>
            </div>
            <div className="success-header">
                You saved it, right?
            </div>
            <div className="success-paragraph">
                Verify that you saved your secret recovery phrase by clicking on the first (1st) then last (12th) word.
            </div>
            <div className="word-buttons-container">
                {Array.from({ length: 6 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="word-button-row">
                        {Array.from({ length: 4 }).map((_, colIndex) => {
                            const isEvenRow = (rowIndex % 2) === 1;
                            const shouldRenderButton = (isEvenRow && (colIndex === 1 || colIndex === 3)) || (!isEvenRow && (colIndex === 0 || colIndex === 2));
                            const wordIndex = rowIndex * 2 + (shouldRenderButton ? Math.floor(colIndex / 2) : -1);

                            return (
                                <div key={colIndex} className={`word-button-placeholder col-${colIndex + 1}`}>
                                    {shouldRenderButton && wordIndex < shuffledWords.length && (
                                        <button
                                            className={`word-button ${selectedIndexes.includes(wordIndex) ? 'selected' : ''}`}
                                            onClick={() => handleButtonClick(wordIndex)}
                                        >
                                            {shuffledWords[wordIndex]}
                                            {firstSelectedIndex === wordIndex && (
                                                <span className="popup">First</span>
                                            )}
                                            {lastSelectedIndex === wordIndex && (
                                                <span className="popup">Last</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <button onClick={handleSubmit} className="continue-button">Submit</button>
            {isSuccess === true && <div className="success-message">Success! The words are correct.</div>}
            {isSuccess === false && <div className="error-message">Warning: The words are incorrect.</div>}
        </div>
        )}
    </div>
    );
};

export default SuccessPage;
