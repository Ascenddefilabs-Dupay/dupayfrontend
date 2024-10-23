
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../securityfrom/securityset.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faKey } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const Security = () => {
    const [requiredmode, sethandleMode] = useState(false);
    const [transmode, sethandletransactionMode] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [walletaddress, setWalletaddress] = useState<string | null>(null);
    const [fiataddress, setfiataddress] = useState<string | null>(null);
    const [copied, setCopied] = useState(false); 
    const [fiatCopied, setFiatCopied] = useState(false);
    const [selectedLockMethod, setSelectedLockMethod] = useState<string | null>(null);
    useEffect(() => {
        // if (typeof window !== 'undefined') {
        //   const sessionDataString = window.localStorage.getItem('session_data');
        //   if (sessionDataString) {
        //     const sessionData = JSON.parse(sessionDataString);
        //     const storedUserId = sessionData.user_id;
        //     setUserId( storedUserId);
        //     console.log(storedUserId);
        //     console.log(sessionData.user_email);
        //     getData();
        //   } else {
        //     // redirect('http://localhost:3000/Userauthentication/SignIn');
        //   }
        // }
        getData();
      }, []);
    const securityhandleBackClick = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings';
        router.push(redirectUrl);
    };

    const securityLockButtonClick = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings/passwordform';
        router.push(redirectUrl);
    };

    const handleRequiredapp = (event: React.ChangeEvent<HTMLInputElement>) => {
        sethandleMode(event.target.checked);
    };

    const handleaTransaction = (event: React.ChangeEvent<HTMLInputElement>) => {
        sethandletransactionMode(event.target.checked);
    };

    const getData = async () => {
        try {
            if (typeof window !== 'undefined') {
                const sessionDataString = window.localStorage.getItem('session_data');
                if (sessionDataString) {
                  const sessionData = JSON.parse(sessionDataString);
                  const storedUserId = sessionData.user_id;
                  setUserId( storedUserId);
                  console.log(storedUserId);
                  console.log(sessionData.user_email);
                  const response = await axios.get('https://securitymanagement-255574993735.asia-south1.run.app/passwordapi/walletaddress/', {
                    params: { userId: storedUserId},
                  });
                  console.log(response.data.status)
                  const response1 = await axios.get('https://securitymanagement-255574993735.asia-south1.run.app/passwordapi/fiataddress/', {
                    params: { userId: storedUserId},
                  });
                  console.log(response1.data.status)
                  setWalletaddress(response.data.status);
                  setfiataddress(response1.data.status);
                }
              }
          
        } catch (error) {
          console.error('Error checking user ID:', error);
        } finally {
        }
    };

    const handleCopy = () => {
        if (walletaddress) {
            navigator.clipboard.writeText(walletaddress) 
                .then(() => {
                    setCopied(true); 
                    setTimeout(() => setCopied(false), 1000); 
                })
                .catch(err => console.error('Failed to copy text: ', err));
        }
    };

    const FiatCopy = () => {
        if (fiataddress) {
            navigator.clipboard.writeText(fiataddress) 
                .then(() => {
                    setFiatCopied(true); 
                    setTimeout(() => setFiatCopied(false), 1000); 
                })
                .catch(err => console.error('Failed to copy text: ', err));
        }
    };

    const formatWalletAddress = (address: string | null) => {
        if (!address) return '';
        return `${address.slice(0, 5)}...${address.slice(-4)}`; 
    };

    

    const formatfiataddress= (address1: string | null) => {
        if (!address1) return '';
        return `${address1.slice(0, 5)}...${address1.slice(-4)}`; 
    };

    const handleSelectLockMethod = async (method: string) => {
        try {
            setSelectedLockMethod(method);
            console.log(method);
            
            const response = await axios.post('https://securitymanagement-255574993735.asia-south1.run.app/passwordapi/unlockpassword/', {
                unlock_password: method,
                userId: userId,
            });
    
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error); 
        }
    };
    
    return (
        <div className={styles.security_card}>
            <div className={styles.securitylabel}>
                <div className={styles.securityleftarrow}>
                    <img className={styles.securityicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729071971/arrow-left-2_kuvb2s.png" onClick={securityhandleBackClick}/>
                </div>
                <div className={styles.securityitle}>Security</div>
                <div className={styles.securityrightbtn} />
            </div>
            <div className={styles.securityParent}>
                <div className={styles.seurityframeWrapper}>
                    <div className={styles.securityframeGroup}>
                        <div className={styles.securityframeContainer}>
                            <div className={styles.securityiconavatarParent}>
                                <img className={styles.securityiconavatar} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729072860/image_3_gyxppb.png" />
                                <div className={styles.securityselectYourPreferred}>{formatWalletAddress(walletaddress)}</div>
                            </div>
                            <div className={styles.securityiconsettingWrapper}>
                                <FontAwesomeIcon icon={faCopy} className={styles.copyicon} onClick={handleCopy} /> {copied && <span className={styles.copiedMessage}>Copied</span>}
                            </div>
                        </div>
                        <div className={styles.securitytagxsmallonleftdefault}>
                            <img className={styles.securityiconcheck} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729073320/check_u1uem5.png" />
                            <div className={styles.securitytext}>Crypto wallet</div>
                        </div>
                    </div>
                </div>
                <div className={styles.seurityframeWrapperfiat}>
                    <div className={styles.securityframeGroupfiat}>
                        <div className={styles.securityframeContainerfiat}>
                            <div className={styles.securityiconavatarParentfiat}>
                                <img className={styles.securityiconavatarfiat} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729072860/image_3_gyxppb.png" />
                                <div className={styles.securityselectYourPreferredfiat}>{formatfiataddress(fiataddress)}</div>
                            </div>
                            <div className={styles.securityiconsettingWrapperfiat}>
                                <FontAwesomeIcon icon={faCopy} className={styles.copyiconfiat} onClick={FiatCopy} /> {fiatCopied && <span className={styles.copiedMessage1}>Copied</span>}
                            </div>
                        </div>
                        <div className={styles.securitytagxsmallonleftdefaultfiat}>
                            <img className={styles.securityiconcheckfiat} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729073320/check_u1uem5.png" />
                            <div className={styles.securitytextfiat}>Fiat wallet</div>
                        </div>
                    </div>
                </div>
      		</div>

            <div className={styles.securityParentlock}>
                <div className={styles.selectYourPreferred}>Select your preferred lock method</div>
                <div className={styles.securitypass} onClick={securityLockButtonClick}>
                    <div className={styles.securityleft}>
                        <FontAwesomeIcon icon={faKey} className={styles.passwordcopyiconfiat}/>
                        <div className={styles.securitytitlepass}>Password</div>
                        <img className={styles.passcodeiconrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
                    </div>
                    
                </div>
            </div>

            {/* <div className={styles.lockselection}>
                <div className={styles.securityunlockrequ}>Select when to require an unlock</div>
                <div className={styles.transactionlock}>
                    <div className={styles.makingtranslock}>
                        <div className={styles.transactiontitle}>Making a transaction</div>
                    </div>
                    <div className={styles.makingapplock}>
                        <div className={styles.applocktitle}>Open the app</div>
                    </div>
                </div>
            </div> */}
             <div className={styles.lockselection}>
                <div className={styles.securityunlockrequ}>Select when to require an unlock</div>
                <div className={styles.transactionlock}>
                    <div 
                        className={`${styles.makingtranslock} ${selectedLockMethod === 'Making Transaction' ? styles.selected : ''}`} onClick={() => handleSelectLockMethod('Making Transaction')}>
                        <div className={styles.transactiontitle}>Making a transaction</div>
                    </div>
                    <div 
                        className={`${styles.makingapplock} ${selectedLockMethod === 'Open App' ? styles.selected : ''}`} onClick={() => handleSelectLockMethod('Open App')}>
                        <div className={styles.applocktitle}>Open the app</div>
                    </div>
                </div>
            </div>

        </div>
        
    );
};

export default Security;