'use client';
import ProgressBar from '../WalletCreation/ProgressBar';
import React, { useEffect, useState } from 'react';
import './style.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LottieAnimationLoading from '@/app/assets/LoadingAnimation';
const WalletManagement = process.env.WalletManagement


const SuccessPage: React.FC = () => {

    const [recoveryWords, setRecoveryWords] = useState<string[]>([]);
    const [maskedWords, setMaskedWords] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [creationState, setCreationState] = useState<boolean>(false);
    const router = useRouter();
    const [isTextVisible, setIsTextVisible] = useState<boolean>(false);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [wrongAttempts, setWrongAttempts] = useState<number>(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId: string = sessionData.user_id;
                setUserId(storedUserId);
            } else {
            }
        }
    }, [router]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false));
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const words = localStorage.getItem('recoveryWords');
        if (words) {
            const wordArray = words.split(',');
            setMaskedWords(wordArray);
            const shuffledWords = shuffleArray(wordArray);
            setRecoveryWords(shuffledWords);
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

    const handleLeftArrowClick = () => {
        setLoading(true);
        router.push('../WalletSecretCode');
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId: string = sessionData.user_id;
                setUserId(storedUserId);
                console.log(storedUserId);
                console.log(sessionData.user_email);
            }
        }
    }, []);

    const handleSubmit = async () => {
        const user_id = userId
        console.log(user_id);
        const walletId = localStorage.getItem('wallet_id');
        const password = localStorage.getItem('password');

        if (out && user_id !== null) {
            setIsSuccess(true);
            setLoading(true)
            setCreationState(true);
            try {
                console.log('Wallet ID:', walletId);
                console.log('Password:', password);
                console.log('Recovery Phrases:', recoveryWords);
                console.log("Uer_id", user_id)
                await axios.post(`${WalletManagement}/walletmanagementapi/save-wallet-data/`, {
                    // await axios.post('http://127.0.0.1:8000/walletmanagementapi/save-wallet-data/', {
                    wallet_id: walletId,
                    password,
                    recovery_phrases: recoveryWords.join(' '),
                    user_id,
                    creation_state: true,
                });

                // Clear local storage
                localStorage.removeItem('walletId');
                localStorage.removeItem('password');
                localStorage.removeItem('recoveryWords');
                localStorage.removeItem('last_wallet_id');
                router.push('../WalletSubmit');
            } catch (error) {
                console.error('Error saving phrase:', error);
                alert('error');
            }
        } else {
            setIsSuccess(false);
            alert('Enter The Password and User_Id needed');
        }
    };

    const toggleVisibility = () => {
        setIsTextVisible(!isTextVisible);
    };
    const handleWordClick = (word: string) => {
        if (!selectedWords.includes(word)) {
            setSelectedWords(prev => [...prev, word]);
        }
    };
    const halfIndex = Math.ceil(recoveryWords.length / 2);
    const slide1Words = recoveryWords.slice(0, halfIndex);
    const slide2Words = recoveryWords.slice(halfIndex);

    const firstWord = selectedWords[0];
    const lastWord = selectedWords[1];
    const expectedFirstWord = maskedWords[0];
    const expectedLastWord = maskedWords[maskedWords.length - 1];

    const out = (firstWord === expectedFirstWord) && (lastWord === expectedLastWord);

    useEffect(() => {
        if (!out && selectedWords.length > 1) {
            setSelectedWords([]);
            setWrongAttempts(prev => prev + 1);
    
            if (wrongAttempts === 4) {
                alert('Wrong Inputs! Toomany attempts.')
                handleLeftArrowClick();
            }
        } 
    }, [out, selectedWords, wrongAttempts]);

    return (
        <div className="successmaincontainer">
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '430px', backgroundColor: 'black' }}>
                    <LottieAnimationLoading width="300px" height="300px" />
                </div>
            ) : (
                <div className='successsubcontainer'>
                    <div className="successcontainer">
                        <div className="successcolumnleft" onClick={handleLeftArrowClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 8L10 12L14 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div className="successcolumnmiddle">
                            <ProgressBar currentStep={3} totalSteps={3} />
                        </div>
                        <div className="successcolumnright">
                            <h1 className='successstatus'>3/3</h1>
                        </div>
                    </div>
                    <div className="successtextcontainer">
                        <h1 className='successfirstheading'>Confirm Seed Phrase</h1>
                        <h2 className='successsecondheading'>Select each first (1st)and last word (12th) in the order it was presented to you</h2>
                    </div>

                    {/* -------------------- */}

                    <div className="list-container">
                        {out ? (
                            <ol className="styled-list">
                                <li className="listfields">{maskedWords[0]}</li>
                                <li className="listfields">{maskedWords[1]}</li>
                                <li className="listfields">{maskedWords[2]}</li>
                                <li className="listfields">{maskedWords[3]}</li>
                                <li className="listfields">{maskedWords[4]}</li>
                                <li className="listfields">{maskedWords[5]}</li>
                                <li className="listfields">{maskedWords[6]}</li>
                                <li className="listfields">{maskedWords[7]}</li>
                                <li className="listfields">{maskedWords[8]}</li>
                                <li className="listfields">{maskedWords[9]}</li>
                                <li className="listfields">{maskedWords[10]}</li>
                                <li className="listfields">{maskedWords[11]}</li>
                            </ol>
                        ) : (
                            <div className="list-container2">

                                <div className="glassy-overlay">
                                    <ol className="maskedStyled-list">
                                        <li className="listfieldsfirst">{selectedWords[0]}</li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="maskedlistfields"></li>
                                        <li className="listfieldslast">{selectedWords[1]}</li>
                                    </ol>
                                </div>
                                <ol className="maskedStyled-list">
                                    <li className="listfieldsfirst">{selectedWords[0]}</li>
                                    <li className="maskedlistfields">{maskedWords[1]}</li>
                                    <li className="maskedlistfields">{maskedWords[2]}</li>
                                    <li className="maskedlistfields">{maskedWords[3]}</li>
                                    <li className="maskedlistfields">{maskedWords[4]}</li>
                                    <li className="maskedlistfields">{maskedWords[5]}</li>
                                    <li className="maskedlistfields">{maskedWords[6]}</li>
                                    <li className="maskedlistfields">{maskedWords[7]}</li>
                                    <li className="maskedlistfields">{maskedWords[8]}</li>
                                    <li className="maskedlistfields">{maskedWords[9]}</li>
                                    <li className="maskedlistfields">{maskedWords[10]}</li>
                                    <li className="listfieldslast">{selectedWords[1]}</li>
                                </ol>
                            </div>
                        )}
                    </div>
                    <div className="slider-container">
                        <div className="slider-cont">
                            {isTextVisible ? (
                                <ol className="slide1">
                                    {slide1Words.map((word, index) => (
                                        <button key={index} className="fields" onClick={() => handleWordClick(word)}>
                                            {word}
                                        </button>
                                    ))}
                                </ol>
                            ) : (
                                <ol className="slide2">
                                    {slide2Words.map((word, index) => (
                                        <button key={index} className="fields" onClick={() => handleWordClick(word)}>
                                            {word}
                                        </button>
                                    ))}
                                </ol>
                            )}
                        </div>
                        <div className='togglebutton'>
                            <button onClick={toggleVisibility} className='togglebutton1'>
                                {!isTextVisible ? (
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 8C6.20914 8 8 6.20914 8 4C8 1.79086 6.20914 0 4 0C1.79086 0 0 1.79086 0 4C0 6.20914 1.79086 8 4 8Z" fill="#D74D78" />
                                    </svg>) : (<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.5" d="M4 7C5.65685 7 7 5.65685 7 4C7 2.34315 5.65685 1 4 1C2.34315 1 1 2.34315 1 4C1 5.65685 2.34315 7 4 7Z" fill="#DDDEE6" />
                                    </svg>)}
                            </button>
                            <button onClick={toggleVisibility} className='togglebutton2'>
                                {isTextVisible ? (
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 8C6.20914 8 8 6.20914 8 4C8 1.79086 6.20914 0 4 0C1.79086 0 0 1.79086 0 4C0 6.20914 1.79086 8 4 8Z" fill="#D74D78" />
                                    </svg>) : (<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.5" d="M4 7C5.65685 7 7 5.65685 7 4C7 2.34315 5.65685 1 4 1C2.34315 1 1 2.34315 1 4C1 5.65685 2.34315 7 4 7Z" fill="#DDDEE6" />
                                    </svg>)}
                            </button>
                        </div>
                    </div>
                    <button className={out ? "successnextbutton" : "successnextbutton1"} onClick={handleSubmit}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
export default SuccessPage;
