import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './RecoveryPhraseForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const RecoveryPhraseForm: React.FC = () => {
    const [phrases, setPhrases] = useState<string[]>(Array(12).fill(''));
    const [showPhrases, setShowPhrases] = useState<boolean[]>(Array(12).fill(false));
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId: string = sessionData.user_id;
                setUserId(storedUserId);
                // console.log(storedUserId);
                // console.log(sessionData.user_email);
            } else {
                // router.push('/Userauthentication/SignIn');
            }
        }
    }, [router]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); // Adjust timer as needed
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (index: number, value: string) => {
        const newPhrases = [...phrases];
        newPhrases[index] = value;
        setPhrases(newPhrases);
    };

    const toggleVisibility = (index: number) => {
        const newShowPhrases = [...showPhrases];
        newShowPhrases[index] = !newShowPhrases[index];
        setShowPhrases(newShowPhrases);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log(phrases);

            const response = await axios.post('${WalletManagement}/walletmanagementapi/check-recovery-phrase/', {
                phrases,
            });

            if (response.data.success) {
                const { wallet_id } = response.data;
                sessionStorage.setItem('wallet_id', wallet_id);
                console.log(wallet_id);
                //window.location.href = './UpdatePassword/';
                router.push('./UpdatePassword/'); 
            } else {
                setErrorMessage('Password words are incorrect');
            }
        } catch (error) {
            console.error('There was an error!', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const handleLeftArrowClick = () => {
        setLoading(true);
        //window.location.href = './AddAccount';
        router.push('./AddAccount'); 
    };

    return (
        <div className="wallet-manager">
            {loading ? (
                <div className='loading'>
                    <div className='spinner'></div>
                    {/* <p className='loadingText'>LOADING</p> */}
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
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
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
