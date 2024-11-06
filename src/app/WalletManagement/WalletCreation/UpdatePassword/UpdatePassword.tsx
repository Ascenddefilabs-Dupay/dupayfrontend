import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './UpdatePassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/navigation';
const WalletManagement = process.env.NEXT_PUBLIC_WalletManagement

const PasswordForm: React.FC = () => {
    const [walletId, setWalletId] = useState<string | null>(null);
    const [password, setPassword] = useState<string>('');
    const [verifyPassword, setVerifyPassword] = useState<string>('');
    const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
    const [passwordStrength, setPasswordStrength] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(''); // State for messages
    const [messageType, setMessageType] = useState<'success' | 'error'>(); // State for message type ('success' or 'error')
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
        // Retrieve wallet_id from sessionStorage
        const id = sessionStorage.getItem('wallet_id');
        if (id) {
            setWalletId(id);
        } else {
            console.error('Wallet ID not found');
            // Handle error or redirect if necessary
        }
    }, []);

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        // Password strength logic
        if (value.length > 8) {
            setPasswordStrength('good');
        } else if (value.length > 4) {
            setPasswordStrength('medium');
        } else {
            setPasswordStrength('weak');
        }
    };

    const handleLeftArrowClick = () => {
        setLoading(true);
        //window.location.href = './ImportPassphrase';
        router.push('./ImportPassphrase'); 
    };

    const handleVerifyPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setVerifyPassword(value);
        setPasswordMatch(password === value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (passwordMatch && isChecked && walletId) {
            try {
                const response = await axios.post(`${WalletManagement}/walletmanagementapi/update-password/`, { wallet_id: walletId, password });
                setMessage('Password updated successfully :)');
                setMessageType('success');
                sessionStorage.removeItem('wallet_id');
                //window.location.href = '/Userauthorization/Dashboard/Home';
                router.push('/Userauthorization/Dashboard/Home'); 
            } catch (error) {
                setMessage('Error updating password!');
                setMessageType('error');
                console.error('Error updating password', error);
            }
        }
    };

    const showTerms = () => {
        setModalContent("Sample Terms and Conditions:\n\n1. You must be at least 18 years old to use this service.\n2. You agree to use the service only for lawful purposes.\n3. We reserve the right to terminate your account if you violate these terms.");
        setShowModal(true);
    };

    const showPrivacyPolicy = () => {
        setModalContent("Sample Privacy Policy:\n\n1. We collect personal data to improve our services.\n2. Your data will not be shared with third parties without your consent.\n3. We use secure methods to protect your data from unauthorized access.");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalContent('');
    };

    return (
        <div className="wallet-manager">
            {loading ? (
                <div className='loading'>
                    <div className='spinner'></div>
                    {/* <p className='loadingText'>LOADING</p> */}
                </div>
            ) : (
                <div className="card">
                    <div className="container">
                        <div className="column left" onClick={handleLeftArrowClick}>
                            <FaArrowLeft />
                        </div>
                        <div className="column middle">
                            <h1 className='heading'>Update Password</h1>
                        </div>
                        <div className="column right">
                        </div>
                    </div>
                    <p>Set a password to unlock your wallet each time you use your computer. It can not be used to recover your wallet.</p>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>New Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder='New Password'
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </button>
                            </div>
                            <div className={`strength ${passwordStrength}`}>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="strength-bar"></div>
                                ))}
                                {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                            </div>
                        </div>
                        <div>
                            <label>Verify Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={verifyPassword}
                                    onChange={handleVerifyPasswordChange}
                                    placeholder='Verify Password'
                                    id="password-input-field"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="toggle-password-button"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </button>
                            </div>
                            <div className="verify">{passwordMatch ? "It's a match!" : 'Passwords do not match'}</div>
                        </div>
                        <div className='terms'>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <label className='conditions'>
                                I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); showTerms(); }}>terms</a> and <a href="#privacy-policy" onClick={(e) => { e.preventDefault(); showPrivacyPolicy(); }}>privacy policy</a>
                            </label>
                        </div>
                        <button type="submit"
                            className='submit' disabled={!passwordMatch || !isChecked}>Next</button>
                    </form>
                    {message && (
                        <div className={`message ${messageType}`}>
                            {message}
                        </div>
                    )}
                </div>
            )}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>×</span>
                        <pre>{modalContent}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordForm;
