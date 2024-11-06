import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './PasswordForm.css';
import ProgressBar from '../WalletCreation/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios';
import LottieAnimationLoading from '@/app/assets/LoadingAnimation';
const WalletManagement = process.env.WalletManagement

const PasswordForm: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [verifyPassword, setVerifyPassword] = useState<string>('');
    const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
    const [passwordStrength, setPasswordStrength] = useState<string>('Week');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<string>('');
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
        const timer = setTimeout(() => setLoading(false));
        return () => clearTimeout(timer);
    }, []);

    const generateWalletId = async (): Promise<string> => {
        const prefix = 'DUP';
        try {
            const response = await axios.get(`${WalletManagement}/walletmanagementapi/latest_wallet_id/`);
            const lastId = response.data.wallet_id;
            let newId;
            if (lastId) {
                const numberPart = parseInt(lastId.replace(prefix, ''), 10);
                newId = `${prefix}${String(numberPart + 1).padStart(4, '0')}`;
            } else {
                newId = `${prefix}0001`;
            }
            localStorage.setItem('last_wallet_id', newId); // Storing the new ID
            return newId;
        } catch (error) {
            console.error('Error fetching the latest wallet ID:', error);
            return `${prefix}0001`;  // fallback
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        if (value.length > 8) {
            setPasswordStrength(' Good');
        } else if (value.length > 4) {
            setPasswordStrength(' Medium');
        } else {
            setPasswordStrength(' Weak');
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case ' Good':
                return 'rgba(118, 226, 104, 1)';
            case ' Medium':
                return 'orange';
            case ' Weak':
                return 'red';
            default:
                return '';
        }
    };

    const handleLeftArrowClick = () => {
        setLoading(true);
        router.push('./WalletCreation/CreateAccount');
    };

    const handleVerifyPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setVerifyPassword(value);
        setPasswordMatch(password === value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (passwordMatch && isChecked) {
            setLoading(true);
            const walletId = await generateWalletId();
            localStorage.setItem('wallet_id', walletId);
            localStorage.setItem('password', password);
            setMessage('Password saved :)');
            setMessageType('success');
            router.push('./SecureWallet');
        }
    };

    const showTerms = () => {
        setModalContent("Sample Terms and Conditions:\n\n1. You must be at least 18 years old to use this service.\n2. You agree to use the service only for lawful purposes.\n3. We reserve the right to terminate your account if you violate these terms.");
        setShowModal(true);
    };

    const showPrivacyPolicy = () => {
        setModalContent("Sample Privacy Policy:\n\n1. We collect personal data to improve\n\t our services.\n2. Your data will not be shared with third \n\t parties without your consent.\n3. We use secure methods to protect your data \n\tfrom unauthorized access.");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalContent('');
    };

    return (
        <div className='maincontainer'>
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
                            <ProgressBar currentStep={1} totalSteps={3} />
                        </div>
                        <div className="columnright">
                            <h1 className='status'>1/3</h1>
                        </div>
                    </div>
                    <div className="textcontainer">
                        <h1 className='firstheading'>Create Password</h1>
                        <h2 className='secondheading'>This password will unlock your Dupay wallet only on this service</h2>
                    </div>
                    <div className='formcontainer'>
                        <form onSubmit={handleSubmit} className='formdata'>
                            <div className='newpassword'>
                                <div className="password-input">
                                    <label>New Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder='Enter Password'
                                    // className='password'
                                    />
                                </div>
                                <div className='eye'>
                                    <button type="button" className='eyeicon' onClick={() => setShowPassword(!showPassword)}>
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </div>
                            <div className='inputstatus1'>
                                <div>Password strength: </div>
                                <div><p style={{ color: getPasswordStrengthColor(), marginLeft: '5px' }}>
                                    {passwordStrength}
                                </p></div>
                            </div>
                            <div className='newpassword'>
                                <div className="password-input">
                                    <label>New Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={verifyPassword}
                                        onChange={handleVerifyPasswordChange}
                                        placeholder='Enter Password'
                                        id="password-input-field"
                                    />
                                </div>
                                <div className='eye'>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className='eyeicon'>
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </div>
                            <div className='inputstatus'>
                                {passwordMatch ? "It's a match!" : 'Must be at least 8 characters'}
                            </div>
                            <div className='terms'>
                                <div className='checkbox'>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => setIsChecked(!isChecked)}
                                    />
                                </div>
                                <div className='checktext'>
                                    <label className='cond'>
                                        I understand that Dupay cannot recover this password for me.<a onClick={(e) => { e.preventDefault(); showPrivacyPolicy(); }}> Learn more</a>
                                    </label>
                                </div>
                            </div>
                            <div className='nextbutton' >
                                <button type="submit" disabled={!passwordMatch || !isChecked}>Create Password</button>
                            </div>
                        </form>
                    </div>
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                            <pre>{modalContent}</pre>
                                <span className="close-button" onClick={closeModal}>×</span>
                                
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PasswordForm;
