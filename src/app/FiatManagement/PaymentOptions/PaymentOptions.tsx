import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './PaymentOptions.module.css';
import UpiIcon from '/public/images/upi.png'; // Import the UPI image
import { FaArrowLeft } from 'react-icons/fa';

const PaymentOptions: React.FC = () => {
    const router = useRouter();

    const handleCreditChange = (credit: string) => {
        localStorage.setItem('selectedPaymentOption', credit);
        router.back(); // Navigate back to the previous page
    };

    const handleLeftArrowClick = () => {
        window.location.href = '/FiatManagement/Currency_Conversion';
    };

    return (
        <div className={styles.paymentOptionsContainer}>
            <div className={styles.topBar}>
                <button className={styles.topBarButton}>
                    <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick} />
                </button>
                <h2 className={styles.topBarTitle}>Select Payment Option</h2>
            </div>
            <div className={styles.paymentOptions}>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('UPI')}>
                    <img src={UpiIcon.src} alt="UPI" className={styles.paymentIcon} /> {/* Use the UPI image */}
                    <span>UPI</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Credit Card')}>
                    <i className="fas fa-credit-card"></i>
                    <span>Credit Card</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Debit Card')}>
                    <i className="fas fa-credit-card"></i>
                    <span>Debit Card</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Google Pay')}>
                    <i className="fab fa-google-pay"></i>
                    <span>Google Pay</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Bank')}>
                    <i className="fas fa-university"></i>
                    <span>Bank</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Neteller')}>
                    <i className="fas fa-wallet"></i>
                    <span>Neteller</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Skrill')}>
                    <i className="fas fa-wallet"></i>
                    <span>Skrill</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Cash App')}>
                    <i className="fas fa-wallet"></i>
                    <span>Cash App</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('US Wire Bank Transfer')}>
                    <i className="fas fa-university"></i>
                    <span>US Wire Bank Transfer</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Phone Pay')}>
                    <i className="fas fa-phone"></i>
                    <span>Phone Pay</span>
                </div>
                <div className={styles.paymentOption} onClick={() => handleCreditChange('Paytm')}>
                    <i className="fas fa-mobile-alt"></i>
                    <span>Paytm</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentOptions;
