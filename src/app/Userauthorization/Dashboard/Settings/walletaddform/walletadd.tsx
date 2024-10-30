// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import styles from '../walletaddform/walletadd.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';

// const Wallet = () => {
   
//     const router = useRouter();
//     const [userId, setUserId] = useState<string | null>(null);
//     const [walletaddress, setWalletaddress] = useState<string | null>(null);
//     const [fiataddress, setfiataddress] = useState<string | null>(null);
//     const [copied, setCopied] = useState(false); 
//     const [fiatCopied, setFiatCopied] = useState(false);
//     const [selectedLockMethod, setSelectedLockMethod] = useState<string | null>(null);
//     useEffect(() => {
//         getData();
//       }, []);
//     const securityhandleBackClick = () => {
//         let redirectUrl = '/Userauthorization/Dashboard/Settings';
//         router.push(redirectUrl);
//     };


//     const getData = async () => {
//         try {
//             if (typeof window !== 'undefined') {
//                 const sessionDataString = window.localStorage.getItem('session_data');
//                 if (sessionDataString) {
//                   const sessionData = JSON.parse(sessionDataString);
//                   const storedUserId = sessionData.user_id;
//                   setUserId( storedUserId);
//                   console.log(storedUserId);
//                   console.log(sessionData.user_email);
//                   const response = await axios.get('http://127.0.0.1:8000/passwordapi/deletewalletaddress/', {
//                     params: { userId: storedUserId},
//                   });
//                   console.log(response.data.status)
//                   const response1 = await axios.get('http://127.0.0.1:8000/passwordapi/deletefiataddress/', {
//                     params: { userId: storedUserId},
//                   });
//                   console.log(response1.data.status)
//                   setWalletaddress(response.data.status);
//                   setfiataddress(response1.data.status);
//                 }
//               }
          
//         } catch (error) {
//           console.error('Error checking user ID:', error);
//         } finally {
//         }
//     };

    

//     const formatWalletAddress = (address: string | null) => {
//         if (!address) return '';
//         return `${address.slice(0, 5)}...${address.slice(-4)}`; 
//     };

    

//     const formatfiataddress= (address1: string | null) => {
//         if (!address1) return '';
//         return `${address1.slice(0, 5)}...${address1.slice(-4)}`; 
//     };

   
    
//     return (
//         <div className={styles.wallet_card}>
//             <div className={styles.walletlabel}>
//                 <div className={styles.walletleftarrow}>
//                     <img className={styles.walleticon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729071971/arrow-left-2_kuvb2s.png" onClick={securityhandleBackClick}/>
//                 </div>
//                 <div className={styles.wallettitle}>Wallets</div>
//                 <div className={styles.walletrightbtn} />
//             </div>
//             <div className={styles.walletParent}>
//                 <div className={styles.walletframeWrapper}>
//                     <div className={styles.walletframeGroup}>
//                         <div className={styles.walletframeContainer}>
//                             <div className={styles.walleticonavatarParent}>
//                                 <img className={styles.walleticonavatar} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729072860/image_3_gyxppb.png" />
//                                 <div className={styles.walletselectYourPreferred}>{formatWalletAddress(walletaddress)}</div>
//                             </div>
//                             <div className={styles.walleticonsettingWrappercrpto}>
//                                 <FontAwesomeIcon icon={faTrash} className={styles.walletcopyiconwallet} /> 
//                             </div>
//                         </div>
//                         <div className={styles.wallettagxsmallonleftdefault}>
//                             <img className={styles.walleticoncheck} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729073320/check_u1uem5.png" />
//                             <div className={styles.wallettext}>Crypto wallet</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className={styles.walletframeWrapperfiat}>
//                     <div className={styles.walletframeGroupfiat}>
//                         <div className={styles.walletframeContainerfiat}>
//                             <div className={styles.walleticonavatarParentfiat}>
//                                 <img className={styles.walleticonavatarfiat} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729072860/image_3_gyxppb.png" />
//                                 <div className={styles.walletselectYourPreferredfiat}>{formatfiataddress(fiataddress)}</div>
//                             </div>
//                             <div className={styles.walleticonsettingWrapperfiat}>
//                                 <FontAwesomeIcon icon={faTrash} className={styles.walleticonfiat}  /> 
//                             </div>
//                         </div>
//                         <div className={styles.wallettagxsmallonleftdefaultfiat}>
//                             <img className={styles.walleticoncheckfiat} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729073320/check_u1uem5.png" />
//                             <div className={styles.wallettextfiat}>Fiat wallet</div>
//                         </div>
//                     </div>
//                 </div>
//       		</div>

//         </div>
        
//     );
// };

// export default Wallet;


'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../walletaddform/walletadd.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';

const Wallet = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [walletaddress, setWalletaddress] = useState<string | null>(null);
    const [fiataddress, setFiataddress] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [isFormVisible1, setIsFormVisible1] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId = sessionData.user_id;
                setUserId(storedUserId);
                console.log(storedUserId);
                console.log(sessionData.user_email);
            } else {
                // redirect('http://localhost:3000/Userauthentication/SignIn');
            }
            getData();
        }
    }, []);

    const securityhandleBackClick = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings';
        router.push(redirectUrl);
    };

    const getData = async () => {
        try {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId = sessionData.user_id;
                setUserId(storedUserId)

                const walletResponse = await axios.get('http://127.0.0.1:8000/passwordapi/deletewalletaddress/', {
                    params: { userId: storedUserId },
                });
                setWalletaddress(walletResponse.data.status);

                setIsFormVisible(walletResponse.data.status !== 'user_id not found');

                const fiatResponse = await axios.get('http://127.0.0.1:8000/passwordapi/deletefiataddress/', {
                    params: { userId: storedUserId },
                });
                setFiataddress(fiatResponse.data.status);

                
                setIsFormVisible1(fiatResponse.data.status !== 'user_id not found');
                console.log(isFormVisible1)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteWalletAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/passwordapi/deletewalletaddress/', {
                userId: userId,
            });
            setWalletaddress(null);
            setIsFormVisible(false);
            Swal.fire({
                position: "center",
                title: "Wallet address deleted ",
                showConfirmButton: false,
                timer: 1500,
                background: '#2c2c2c',     
                width: '250px', 
                
                customClass: {
                    title: 'lock-title', 
                    popup: 'lock-popup', 
                }
            });
        } catch (error) {
            console.error('Error deleting wallet address:', error);
        }
    };

    const deleteFiatAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/passwordapi/deletefiataddress/', {
                userId: userId,
            });
            setFiataddress(null);
            setIsFormVisible1(false);
            console.log(response.data.status)
            Swal.fire({
                position: "center",
                title: "Fiat address deleted ",
                showConfirmButton: false,
                timer: 1500,
                background: '#2c2c2c',    
                width: '250px', 
                customClass: {
                    title: 'lock-title', 
                    popup: 'lock-popup', 
                }
            });
        } catch (error) {
            console.error('Error deleting fiat address:', error);
        }
    };

    const formatAddress = (address: string | null) => {
        if (!address) return '';
        return `${address.slice(0, 5)}...${address.slice(-4)}`;
    };

    const formatAddr = (address1: string | null) => {
        if (!address1) return '';
        return `${address1.slice(0, 5)}...${address1.slice(-4)}`;
    };

    return (
        <div className={styles.wallet_card}>
            <div className={styles.walletlabel}>
                <div className={styles.walletleftarrow}>
                    <img className={styles.walleticon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729071971/arrow-left-2_kuvb2s.png" onClick={securityhandleBackClick} />
                </div>
                <div className={styles.wallettitle}>Wallets</div>
                <div className={styles.walletrightbtn} />
            </div>
            <div className={styles.walletParent}>
                { isFormVisible && (
                    <div className={styles.walletframeWrapper} >
                        <div className={styles.walletframeGroup}>
                            <div className={styles.walletframeContainer}>
                                <div className={styles.walleticonavatarParent}>
                                    <img className={styles.walleticonavatar} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729072860/image_3_gyxppb.png" />
                                    <div className={styles.walletselectYourPreferred}>{formatAddress(walletaddress)}</div>
                                </div>
                                <div className={styles.walleticonsettingWrappercrpto}>
                                    <FontAwesomeIcon icon={faTrash} className={styles.walletcopyiconwallet} onClick={deleteWalletAdd} />
                                </div>
                            </div>
                            <div className={styles.wallettagxsmallonleftdefault}>
                                <img className={styles.walleticoncheck} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729073320/check_u1uem5.png" />
                                <div className={styles.wallettext}>Crypto wallet</div>
                            </div>
                        </div>
                    </div>
                )}

                { isFormVisible1 && (

                    <div className={styles.walletframeWrapperfiat}>
                        <div className={styles.walletframeGroupfiat}>
                            <div className={styles.walletframeContainerfiat}>
                                <div className={styles.walleticonavatarParentfiat}>
                                    <img className={styles.walleticonavatarfiat} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729072860/image_3_gyxppb.png" />
                                    <div className={styles.walletselectYourPreferredfiat}>{formatAddr(fiataddress)}</div>
                                </div>
                                <div className={styles.walleticonsettingWrapperfiat}>
                                    <FontAwesomeIcon icon={faTrash} className={styles.walleticonfiat} onClick={deleteFiatAdd} />
                                </div>
                            </div>
                            <div className={styles.wallettagxsmallonleftdefaultfiat}>
                                <img className={styles.walleticoncheckfiat} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729073320/check_u1uem5.png" />
                                <div className={styles.wallettextfiat}>Fiat wallet</div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Wallet;
