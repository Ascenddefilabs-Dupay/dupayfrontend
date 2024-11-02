'use client';

import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FiCopy } from 'react-icons/fi';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './style.css'; // Ensure this path is correct
import ProgressBar from '../WalletCreation/ProgressBar';
import LottieAnimationLoading from '@/app/assets/LoadingAnimation';

const Wallet2: React.FC = () => {
    const [isTextVisible, setIsTextVisible] = useState<boolean>(false);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);
    const [randomWords, setRandomWords] = useState<string[]>([]);
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

    useEffect(() => {
        setIsClient(true);
        generateRandomWords();
    }, []);

    const generateRandomWords = () => {
        const words = Array.from({ length: 12 }, () => generateRandomWord());
        setRandomWords(words);
        localStorage.setItem('recoveryWords', words.join()); // Store in localStorage
    };

    const generateRandomWord = (): string => {
        const length = Math.floor(Math.random() * 3) + 4;
        let word = '';
        for (let i = 0; i < length; i++) {
            word += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Generate random lowercase letter
        }
        return capitalizeFirstLetter(word);
    };

    const capitalizeFirstLetter = (string: string): string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const toggleVisibility = () => {
        setIsTextVisible(!isTextVisible);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(randomWords.join()).then(() => {
            alert('Text copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsCheckboxChecked(event.target.checked);
    };

    const handleContinueClick = () => {
        if (isTextVisible) {
            setLoading(true);
            // Retrieve wallet_id and password from localStorage
            const walletId = localStorage.getItem('wallet_id');
            const password = localStorage.getItem('password');
            const recoveryWords = localStorage.getItem('recoveryWords');

            console.log("Wallet ID:", walletId);
            console.log("Password:", password);
            console.log("Recovery Words:", recoveryWords);

            // Send the data to the next page using URL parameters
            router.push(`/WalletManagement/WalletSecretCode/success?wallet_id=${walletId}&password=${password}&phrase=${recoveryWords}`);
        } else {
            alert('Please check the checkbox before continuing.');
        }
    };

    const handleLeftArrowClick = (e: MouseEvent<HTMLDivElement>) => {
        setLoading(true);
        //window.location.href = './CreatePassword';
        router.push('./SecureWallet');
    };

    return (
        <div className="maincontainer">
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '430px', backgroundColor: 'black' }}>
                    <LottieAnimationLoading width="300px" height="300px" />
                </div>
            ) : (
                <div className='subcontainer'>
                    <div className="container">
                        <div className="columnleft" onClick={handleLeftArrowClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 8L10 12L14 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div className="columnmiddle">
                            <ProgressBar currentStep={2} totalSteps={3} />
                        </div>
                        <div className="columnright">
                            <h1 className='status'>1/3</h1>
                        </div>
                    </div>
                    <div className="textcontainer">
                        <h1 className='firstheading'>Write Down Your Seed Phrase</h1>
                        <h2 className='secondheading'>This is your seed phrase. Write it down on a paper and keep it in a safe place. You'll be asked to re-enter this phrase (in order) on the next step.</h2>
                    </div>
                    <div className="textbox">
                        {isTextVisible ? (
                            <div className='sub1'>
                                <div className="phrase-grid">
                                    {randomWords.map((word, index) => (
                                        <div className="phrase-item" key={index}>

                                            <span>{index + 1}. {word}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        ) : (
                            <div className='blurscreen'>
                                <div className='sub2'>
                                    <div className="phrase-grid">
                                        {randomWords.map((word, index) => (
                                            <div className="phrase-item" key={index}>

                                                <span>{index + 1}. {word}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="icon-container">
                                    <h1 className='blurh1'>Tap to reveal your seed phrase</h1>
                                    <h2 className='blurh2'>Make sure no one is watching your screen.</h2>
                                    <div className='iconview'>
                                        <span className="icon" onClick={toggleVisibility}>
                                            <svg width="72" height="24" viewBox="0 0 72 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.11774 12.467C3.04045 12.3233 3 12.1627 3 11.9995C3 11.8363 3.04045 11.6757 3.11774 11.532C5.00974 8.033 8.50474 5 11.9997 5C15.4947 5 18.9897 8.033 20.8817 11.533C20.959 11.6767 20.9995 11.8373 20.9995 12.0005C20.9995 12.1637 20.959 12.3243 20.8817 12.468C18.9897 15.967 15.4947 19 11.9997 19C8.50474 19 5.00974 15.967 3.11774 12.467V12.467Z" stroke="#5F97FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M14.0462 9.80417C14.3375 10.0797 14.5706 10.4109 14.7317 10.778C14.8929 11.1452 14.9788 11.541 14.9844 11.9419C14.9899 12.3429 14.9151 12.7409 14.7642 13.1124C14.6133 13.4839 14.3895 13.8214 14.106 14.105C13.8224 14.3885 13.4849 14.6123 13.1134 14.7632C12.7419 14.9141 12.3439 14.9889 11.9429 14.9834C11.542 14.9778 11.1462 14.8919 10.779 14.7307C10.4119 14.5696 10.0807 14.3365 9.80517 14.0452C9.27525 13.4765 8.98675 12.7243 9.00047 11.9471C9.01418 11.1699 9.32903 10.4283 9.87868 9.87868C10.4283 9.32903 11.1699 9.01418 11.9471 9.00047C12.7243 8.98675 13.4765 9.27525 14.0452 9.80517" stroke="#5F97FF" stroke-width="1.429" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M43.136 6.832L39.04 18H36.32L32.224 6.832H34.624L37.696 15.712L40.752 6.832H43.136ZM45.615 8.08C45.2203 8.08 44.8897 7.95733 44.623 7.712C44.367 7.456 44.239 7.14133 44.239 6.768C44.239 6.39467 44.367 6.08533 44.623 5.84C44.8897 5.584 45.2203 5.456 45.615 5.456C46.0097 5.456 46.335 5.584 46.591 5.84C46.8577 6.08533 46.991 6.39467 46.991 6.768C46.991 7.14133 46.8577 7.456 46.591 7.712C46.335 7.95733 46.0097 8.08 45.615 8.08ZM46.719 9.136V18H44.479V9.136H46.719ZM57.1721 13.376C57.1721 13.696 57.1508 13.984 57.1081 14.24H50.6281C50.6815 14.88 50.9055 15.3813 51.3001 15.744C51.6948 16.1067 52.1801 16.288 52.7561 16.288C53.5881 16.288 54.1801 15.9307 54.5321 15.216H56.9481C56.6921 16.0693 56.2015 16.7733 55.4761 17.328C54.7508 17.872 53.8601 18.144 52.8041 18.144C51.9508 18.144 51.1828 17.9573 50.5001 17.584C49.8281 17.2 49.3001 16.6613 48.9161 15.968C48.5428 15.2747 48.3561 14.4747 48.3561 13.568C48.3561 12.6507 48.5428 11.8453 48.9161 11.152C49.2895 10.4587 49.8121 9.92533 50.4841 9.552C51.1561 9.17867 51.9295 8.992 52.8041 8.992C53.6468 8.992 54.3988 9.17333 55.0601 9.536C55.7321 9.89867 56.2495 10.416 56.6121 11.088C56.9855 11.7493 57.1721 12.512 57.1721 13.376ZM54.8521 12.736C54.8415 12.16 54.6335 11.7013 54.2281 11.36C53.8228 11.008 53.3268 10.832 52.7401 10.832C52.1855 10.832 51.7161 11.0027 51.3321 11.344C50.9588 11.6747 50.7295 12.1387 50.6441 12.736H54.8521ZM71.0951 9.136L68.5031 18H66.0871L64.4711 11.808L62.8551 18H60.4231L57.8151 9.136H60.0871L61.6551 15.888L63.3511 9.136H65.7191L67.3831 15.872L68.9511 9.136H71.0951Z" fill="#5F97FF" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {isTextVisible ? (
                        <button className="nextbutton" onClick={handleContinueClick}>Continue</button>
                    ) : (


                        <button className="nextbutton1" onClick={handleContinueClick}>Next</button>

                    )}


                </div>
            )}
        </div>
    );
};

export default Wallet2;
