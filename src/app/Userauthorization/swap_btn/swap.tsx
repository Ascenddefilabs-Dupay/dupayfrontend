// "use client";

// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { FaCheck } from "react-icons/fa6";
// import { useRouter } from 'next/navigation';
// import React, { useState, useEffect } from 'react';
// import { redirect } from 'next/navigation';

// export default function Swap(): JSX.Element {
//     const router = useRouter();
//     const [loading, setLoading] = useState<boolean>(false);

//     const [userId, setUserId] = useState<string | null>(null);

//       useEffect(() => {
//         if (typeof window !== 'undefined') {
//           const sessionDataString = window.localStorage.getItem('session_data');
//         //   if (sessionDataString) {
//         //     const sessionData = JSON.parse(sessionDataString);
//         //     const storedUserId = sessionData.user_id;
//         //     setUserId(storedUserId);
//         //     console.log(storedUserId);
//         //     console.log(sessionData.user_email);
//         //   } else {
//         //     redirect('http://localhost:3000/Userauthentication/SignIn');
//         //   }
//         }
//       }, []);

//     const handleBackClick = (): void => {
//         setLoading(true); // Show loading text
//         setTimeout(() => {
//             router.push('/Userauthorization/Dashboard');
//         }, 500); // Adjust delay if needed
//     }

//     const handleAddCryptoClick = (): void => {
//         setLoading(true); // Show loading text
//         setTimeout(() => {
//             router.push('/FiatManagement/Currency_Conversion'); // Adjust the route as needed
//         }, 500); // Adjust delay if needed  
//     };

//     const handleLearnMoreClick = (): void => {
//         setLoading(true); // Show loading text
//         setTimeout(() => {
//             router.push('/Userauthorization/Dashboard'); // Adjust the route as needed
//         }, 500); // Adjust delay if needed
//     };

//     return (
//         <div style={{
//             position: 'relative',
//             backgroundColor: 'black',
//             width: '400px',
//             top: '1px',
//             margin: '0 auto',
//             color: 'white',
//             minHeight: '100vh',
//             borderRadius: '15px',
//             display: 'flex',
//             flexDirection: 'column',
//             overflowY: 'auto',
//             cursor: 'pointer',
//         }}>
//             {loading ? (
//                 <div style={styles.loaderContainer}>
//                     <div style={styles.loader}></div>
//                 </div>
//             ) : (
//                 <>
//                     <div style={{ flex: '1' }}> 
//                         <ArrowBackIcon onClick={handleBackClick} style={{ margin: '10px 15px' }} />
//                         <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911804/swap_image_tcwqal.png" alt="Swap image" style={{ height: '140px', marginLeft: '130px' }} />
//                         <header style={{ alignItems: 'center', marginLeft: '110px', fontSize: '20px' }}>
//                             Get the best price
//                             <p style={{ marginLeft: '20px' }}>
//                                 when you swap
//                             </p>
//                         </header>
//                         <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
//                             <div style={{ margin: '10px', color: 'white', fontSize: '20px', marginBottom: '45px' }}><FaCheck /></div>
//                             <p style={{ fontSize: '15px', margin: 0 }}>
//                                 Get the best price
//                                 <p style={{ color: 'gray', fontSize: '12px', marginLeft: '10px', margin: 0 }}>
//                                     we check 75+ DEXs to find the best route and price for your swap
//                                 </p>
//                             </p>
//                         </div>
//                         <p style={{ margin: '-20px 0' }}></p>
//                         <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
//                             <div style={{ margin: '10px ', color: 'white', fontSize: '20px', marginBottom: '60px' }}><FaCheck style={{ marginTop: '12px' }} /></div>
//                             <p style={{ fontSize: '15px', margin: 2 }}>
//                                 Trade 2+ million tokens
//                                 <p style={{ color: 'gray', fontSize: '12px', marginLeft: '2px', margin: '10' }}>
//                                   Swap on Base, Ethereum, Arbitrum, Optimism, Polygon, Solana, BNB, and Avalanche networks.
//                                 </p>
//                             </p>
//                         </div>
//                         <p style={{ margin: '-20px 0' }}></p>
//                         <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
//                             <div style={{ margin: '10px', color: 'white', fontSize: '20px', marginBottom: '50px' }}><FaCheck /></div>
//                             <p style={{ fontSize: '15px', margin: 0 }}>
//                                 Protected with swap simulation
//                                 <p style={{ color: 'gray', fontSize: '12px', marginLeft: '10px', margin: 0 }}>
//                                     Avoid losing funds with swap simulations. We'll warn you if your swap might fail.
//                                 </p>
//                             </p>
//                         </div>
//                         <p style={{ margin: '-5px 0' }}></p>
//                     </div>
//                     <div style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         padding: '10px 20px',
//                         position: 'sticky',
//                         bottom: 0,
//                         backgroundColor: 'black',
//                         borderRadius: '0 0 15px 15px'
//                     }}>
//                         <div>
//                             <button
//                                 onClick={handleAddCryptoClick}
//                                 style={{
//                                     marginBottom: '10px',
//                                     padding: '10px',
//                                     background: 'linear-gradient(90deg, #007bff9f, #800080)',
//                                     color: 'white',
//                                     borderRadius: '5px',
//                                     fontWeight: 'bold',
//                                     border: 'none',
//                                     width: '100%'
//                                 }}
//                             >
//                                 Add crypto to your wallet
//                             </button>
//                         </div>
//                         <div>
//                             <button
//                                 onClick={handleLearnMoreClick}
//                                 style={{
//                                     padding: '10px',
//                                     background: 'linear-gradient(90deg, #007bff9f, #800080)',
//                                     color: 'white',
//                                     fontWeight: 'bold',
//                                     borderRadius: '5px',
//                                     border: 'none',
//                                     width: '100%'
//                                 }}
//                             >
//                                 Learn More
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }

// const styles = {
//     loaderContainer: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         background: 'rgba(0, 0, 0, 1.5)', // Set background color to black
//         backdropFilter: 'blur(10px) saturate(180%)',
//         WebkitBackdropFilter: 'blur(10px) saturate(180%)',
//         zIndex: 2,
//         padding: '20px',
//         borderRadius: '20px',
//         width: '400px',
//         margin: '0 auto',
//         boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
//     } as React.CSSProperties,
//     loader: {
//         width: '60px',
//         height: '60px',
//         background: 'linear-gradient(45deg, #ff007b, #007bff)',
//         borderRadius: '12%',
//         animation: 'spin 1s linear infinite',
//         transform: 'rotate(45deg)',
//         position: 'relative',
//         zIndex: 3,
//         boxShadow: '0 0 20px rgba(255, 0, 123, 0.7), 0 0 20px rgba(0, 123, 255, 0.7)',
//     } as React.CSSProperties,
//     loadingText: {
//         fontSize: '20px',
//         color: 'white',
//         letterSpacing: '2px',
//         marginTop: '20px',
//         fontFamily: 'Arial, sans-serif',
//     } as React.CSSProperties,
// };








"use client";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaCheck } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from './swap.module.css';

export default function Swap(): JSX.Element {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // const sessionDataString = window.localStorage.getItem('session_data');
            // Uncomment this part if you need session handling
            // if (sessionDataString) {
            //     const sessionData = JSON.parse(sessionDataString);
            //     const storedUserId = sessionData.user_id;
            //     setUserId(storedUserId);
            //     console.log(storedUserId);
            //     console.log(sessionData.user_email);
            // } else {
            //     router.push('/Userauthentication/SignIn');
            // }
        }
    }, [router]);

    const handleBackClick = (): void => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard');
        }, 500); // Adjust delay if needed
    };

    const handleAddCryptoClick = (): void => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/FiatManagement/Currency_Conversion'); // Adjust the route as needed
        }, 500); // Adjust delay if needed  
    };

    const handleLearnMoreClick = (): void => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard'); // Adjust the route as needed
        }, 500); // Adjust delay if needed
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            ) : (
                <>
                    <div style={{ flex: '1' }}> 
                        <ArrowBackIcon onClick={handleBackClick} style={{ margin: '10px 15px' }} />
                        <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911804/swap_image_tcwqal.png" alt="Swap image" style={{ height: '140px', marginLeft: '130px' }} />
                        <header style={{ alignItems: 'center', marginLeft: '110px', fontSize: '20px' }}>
                            Get the best price
                            <p style={{ marginLeft: '20px' }}>
                                when you swap
                            </p>
                        </header>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                            <div style={{ margin: '10px', color: 'white', fontSize: '20px', marginBottom: '45px' }}><FaCheck /></div>
                            <p style={{ fontSize: '15px', margin: 0 }}>
                                Get the best price
                                <p style={{ color: 'gray', fontSize: '12px', marginLeft: '10px', margin: 0 }}>
                                    we check 75+ DEXs to find the best route and price for your swap
                                </p>
                            </p>
                        </div>
                        <p style={{ margin: '-20px 0' }}></p>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
                            <div style={{ margin: '10px ', color: 'white', fontSize: '20px', marginBottom: '60px' }}><FaCheck style={{ marginTop: '12px' }} /></div>
                            <p style={{ fontSize: '15px', margin: 2 }}>
                                Trade 2+ million tokens
                                <p style={{ color: 'gray', fontSize: '12px', marginLeft: '2px', margin: '10' }}>
                                  Swap on Base, Ethereum, Arbitrum, Optimism, Polygon, Solana, BNB, and Avalanche networks.
                                </p>
                            </p>
                        </div>
                        <p style={{ margin: '-20px 0' }}></p>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                            <div style={{ margin: '10px', color: 'white', fontSize: '20px', marginBottom: '50px' }}><FaCheck /></div>
                            <p style={{ fontSize: '15px', margin: 0 }}>
                                Protected with swap simulation
                                <p style={{ color: 'gray', fontSize: '12px', marginLeft: '10px', margin: 0 }}>
                                    Avoid losing funds with swap simulations. We'll warn you if your swap might fail.
                                </p>
                            </p>
                        </div>
                        <p style={{ margin: '-5px 0' }}></p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '10px 20px',
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor: 'black',
                        borderRadius: '0 0 15px 15px'
                    }}>
                        <div>
                            <button
                                onClick={handleAddCryptoClick}
                                className={styles.button}
                            >
                                Add crypto to your wallet
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={handleLearnMoreClick}
                                className={`${styles.button} ${styles.learnMore}`}
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
