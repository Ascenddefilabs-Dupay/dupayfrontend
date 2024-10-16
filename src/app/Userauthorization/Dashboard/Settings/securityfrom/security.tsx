
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../securityfrom/securityset.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faKey } from '@fortawesome/free-solid-svg-icons';


const Security = () => {
    const [requiredmode, sethandleMode] = useState(false);
    const [transmode, sethandletransactionMode] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const sessionDataString = window.localStorage.getItem('session_data');
          if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            const storedUserId = sessionData.user_id;
            setUserId( storedUserId);
            console.log(storedUserId);
            console.log(sessionData.user_email);
          } else {
            // redirect('http://localhost:3000/Userauthentication/SignIn');
          }
        }
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
                                <div className={styles.securityselectYourPreferred}>Wallet Address</div>
                            </div>
                            <div className={styles.securityiconsettingWrapper}>
                                <FontAwesomeIcon icon={faCopy} className={styles.copyicon} />
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
                                <div className={styles.securityselectYourPreferredfiat}>Fiat Address</div>
                            </div>
                            <div className={styles.securityiconsettingWrapperfiat}>
                                <FontAwesomeIcon icon={faCopy} className={styles.copyiconfiat} />
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

            <div className={styles.lockselection}>
                <div className={styles.securityunlockrequ}>Select when to require an unlock</div>
                <div className={styles.transactionlock}>
                    <div className={styles.makingtranslock}>
                            <div className={styles.transactiontitle}>Making a transaction</div>
                    </div>
                    <div className={styles.makingapplock}>
                            <div className={styles.applocktitle}>Open the app</div>
                    </div>
                </div>
            </div>

        </div>
        
    );
};

export default Security;