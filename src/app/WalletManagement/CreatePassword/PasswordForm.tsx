import React, { useEffect, useState } from 'react';
import './PasswordForm.css';
import ProgressBar from '../WalletCreation/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios';

const PasswordForm: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [verifyPassword, setVerifyPassword] = useState<string>('');
    const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
    const [passwordStrength, setPasswordStrength] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false));
        return () => clearTimeout(timer);
    }, []);

    const generateWalletId = async (): Promise<string> => {
        const prefix = 'DUP';
        try {
            const response = await axios.get('https://walletmanagement-ind-255574993735.asia-south1.run.app/walletmanagementapi/latest_wallet_id/');
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
            setPasswordStrength('good');
        } else if (value.length > 4) {
            setPasswordStrength('medium');
        } else {
            setPasswordStrength('weak');
        }
    };

    const handleLeftArrowClick = () => {
        setLoading(true);
        window.location.href = './WalletCreation/CreateAccount';
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

            // Store wallet_id and password in localStorage
            localStorage.setItem('wallet_id', walletId);
            localStorage.setItem('password', password);

            // Navigate to the next page
            setMessage('Password saved :)');
            setMessageType('success');
            window.location.href = './WalletSecretCode';
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
        <div>
            {loading ? (
                <div className='loading'>
                    <div className='spinner'></div>
                </div>
            ) : (
                <div className="wallet-manager">
                    <div className="card">
                        <div className="container">
                            <div className="column left" onClick={handleLeftArrowClick}>
                                <FaArrowLeft />
                            </div>
                            <div className="column middle">
                                <ProgressBar currentStep={2} totalSteps={4} />
                            </div>
                            <div className="column right">
                                {/* Right column content */}
                            </div>
                        </div>
                        <h1 className='heading'>Create Password</h1>
                        <p>Set a password to unlock your wallet each time you use your computer. It can't be used to recover your wallet.</p>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Password</label>
                                <div className="password-input">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder='Enter Password'
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
                                <label className='cond'>
                                    I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); showTerms(); }}>terms</a> and <a href="#privacy-policy" onClick={(e) => { e.preventDefault(); showPrivacyPolicy(); }}>privacy policy</a>
                                </label>
                            </div>
                            <button type="submit" disabled={!passwordMatch || !isChecked}>Next</button>
                        </form>
                        {message && (
                            <div className={`message ${messageType}`}>
                                {message}
                            </div>
                        )}
                    </div>

                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close-button" onClick={closeModal}>×</span>
                                <pre>{modalContent}</pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PasswordForm;
