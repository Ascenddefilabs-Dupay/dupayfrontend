"use client";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import styles from './receive.module.css'; // Import the CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy, faQrcode, faAngleRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/system'; // Import styled from @mui/system
import { FaUserCircle } from 'react-icons/fa';
import Typography from '@mui/material/Typography';
import axios from 'axios'; // Ensure axios is imported
import { redirect } from 'next/navigation';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LottieAnimationLoading from '../../assets/LoadingAnimation';



export default function Receive() {
    const [user, setUserProfile] = useState({});
    const [profileImage, setProfileImage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [copyState, setCopyState] = useState({ id: false, ethereum: false, bitcoin: false });
    const [copyType, setCopyType] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const router = useRouter();
    const userId = 'DupC0001';
    const ethereumAddress = '0x0b77...3E32'; // Example address
    const bitcoinAddress = 'bc1qdg...yr62'; // Example address
    const [showLoader, setShowLoader] = useState<boolean>(true); // Explicitly type the state

    // const [userId, setUserId] = useState(null);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
          // const storedUserId = localStorage.getItem('user_id');
          // setUserId(storedUserId);
          // setAlertMessage('User Need To Login')
          // if (storedUserId === null) redirect('http://localhost:3000/');
          // console.log(storedUserId)
        //   console.log(userId);
        }
      }, []);

      useEffect(() => {
        fetchUserProfile();
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
            // setShowForm(true);
        }, 2000); // 2 seconds delay
    
        return () => clearTimeout(timer);
        }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`https://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/profile/${userId}/`);
            setUserProfile(response.data);
            if (response.data.user_profile_photo) {
                const baseURL = 'https://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/profile_photos';
                let imageUrl = '';

                if (typeof response.data.user_profile_photo === 'string' && response.data.user_profile_photo.startsWith('http')) {
                    imageUrl = response.data.user_profile_photo;
                } else if (response.data.user_profile_photo && response.data.user_profile_photo.startsWith('/')) {
                    imageUrl = `${baseURL}${response.data.user_profile_photo}`;
                } else if (response.data.user_profile_photo && response.data.user_profile_photo.data) {
                    const byteArray = new Uint8Array(response.data.user_profile_photo.data);
                    const base64String = btoa(
                        byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                    imageUrl = `data:image/jpeg;base64,${base64String}`;
                }

                setProfileImage(imageUrl);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleQr = (e: React.MouseEvent<SVGSVGElement>, type: string) => {
        e.stopPropagation();
    
        if (type === 'ethereum') {
           
            router.push(`/Userauthorization/receive_btn/ethereum_btn?address=${ethereumAddress}`);
            setShowLoader(true); 
        } else if (type === 'bitcoin') {
            router.push(`/Userauthorization/receive_btn/bitcoin_btn?address=${bitcoinAddress}`);
            setShowLoader(true); 
        }
    };
    

    const handleCopy = (type: string) => {
        let textToCopy: string | undefined;
    
        if (type === 'id') {
            textToCopy = userId;
        } else if (type === 'ethereum') {
            textToCopy = ethereumAddress;
        } else if (type === 'bitcoin') {
            textToCopy = bitcoinAddress;
        }
    
        // Type Guard to ensure textToCopy is not undefined
        if (typeof textToCopy === 'string') {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopyType(type);
                    setCopyState((prevState) => ({ ...prevState, [type]: true }));
                    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard!`); // Show toast notification
                    setTimeout(() => {
                        setCopyState((prevState) => ({ ...prevState, [type]: false }));
                        setCopyType('');
                    }, 2000); // Show check icon for 2 seconds
                })
                .catch((err) => console.error('Failed to copy:', err));
        } else {
            console.error('Text to copy is undefined');
        }
    };
    

    const handleBackClick = () => {
        router.push('/Userauthorization/Dashboard/Home'); 
        setShowLoader(true); 
    };

    const ProfileImage = styled('img')({
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: '5px',
        border: '2px solid white',
    });

    // Memoize filteredSections to update based on searchQuery
    const filteredSections = useMemo(
        () => [
            { id: 'profile', title: 'Profile', visible: userId.toLowerCase().includes(searchQuery.toLowerCase().trim()) },
            { id: 'ethereum', title: 'Ethereum address', visible: ethereumAddress.toLowerCase().includes(searchQuery.toLowerCase().trim()) },
            { id: 'bitcoin', title: 'Bitcoin address', visible: bitcoinAddress.toLowerCase().includes(searchQuery.toLowerCase().trim()) },
            { id: 'buyCrypto', title: 'Buy Crypto', visible: 'buy crypto'.includes(searchQuery.toLowerCase().trim()) },
        ],
        [searchQuery, userId, ethereumAddress, bitcoinAddress]
    );

    return (
        <div className={styles.container}>
            {showLoader ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
                {/* Show the Lottie loading animation */}
                <LottieAnimationLoading width="300px" height="300px" />
              </div>
              ) : (
                <>
            
             <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                closeOnClick={true}
                pauseOnHover={true}
                transition={Slide}  // Use the Slide transition
            />

              
            <div>
                <ArrowBackIcon 
                    onClick={handleBackClick} 
                    className={`${styles.backIcon} ${styles.iconHover}`} 
                />
                <h1 className={styles.heading}>
                    Received crypto and NFTs
                </h1>
            </div>
            <div className={styles.searchContainer}>
                <div className={styles.search}>
                    <input
                        className={`${styles.searchInput} ${isFocused ? styles.searchInputActive : ''}`}
                        type="text"
                        placeholder="Search assets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <a
                        href="#"
                        className={`${styles.searchIcon} ${isFocused ? styles.searchIconHover : ''}`}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </a>
                </div>
            </div>

            {/* Profile Section */}
            {filteredSections.find((section) => section.id === 'profile' && section.visible) && (
                <div
                    className={`${styles.profileDiv} ${styles.hoverableDiv}`}
                    onClick={() => handleCopy('id')}
                    style={{
                        display: 'flex',
                        margin: '45px 0 0 30px',
                        border: '1px solid gray',
                        width: '330px',
                        alignItems: 'center',
                        padding: '15px',
                        borderRadius: '12px',
                    }}
                >
                    <div>
                        {profileImage ? (
                            <ProfileImage src={profileImage} alt="Profile Image" />
                        ) : (
                            <FaUserCircle className={styles.profileIcon} />
                        )}
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <Typography variant="body1" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px' }}>
                            {userId}
                        </Typography>
                        <p style={{ fontSize: '11px', color: 'gray' }}>Share username to</p>
                        <p style={{ fontSize: '11px', color: 'gray' }}>receive crypto or ....</p>
                    </div>
                    <div
                        style={{
                            margin: '10px 0 0 40px',
                            height: '40px',
                            width: '40px',
                            backgroundColor: 'rgb(50, 53, 61)',
                            borderRadius: '40px',
                            position: 'relative',
                            left: '60px',
                        }}
                    >
                        <FontAwesomeIcon
                            icon={copyState.id ? faCheck : faCopy}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy('id');
                            }}
                            style={{ margin: '12px', cursor: 'pointer', color: 'white' }}
                        />
                    </div>
                </div>
            )}

            {/* Ethereum Section */}
            {filteredSections.find((section) => section.id === 'ethereum' && section.visible) && (
                <div
                    className={`${styles.ethereumDiv} ${styles.hoverableDiv}`}
                    onClick={() => handleCopy('ethereum')}
                    style={{
                        display: 'flex',
                        margin: '25px 0 0 30px',
                        border: '1px solid gray',
                        width: '330px',
                        alignItems: 'center',
                        padding: '20px',
                        borderRadius: '12px',
                    }}
                >
                    <div>
                        <img
                            src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933125/ethereum_image_pjztx6.jpg"
                            alt="Ethereum_image"
                            style={{
                                height: '35px',
                                width: '35px',
                                borderRadius: '50px',
                                border: '1px solid white',
                            }}
                        />
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <p style={{ fontSize: '14px' }}>Ethereum address</p>
                        <p style={{ fontSize: '11px', color: 'gray' }}>{ethereumAddress}</p>
                    </div>
                    <div
                        style={{
                            height: '40px',
                            width: '40px',
                            backgroundColor: 'rgb(50, 53, 61)',
                            borderRadius: '40px',
                            position: 'relative',
                            left: '80px',
                        }}
                    >
                        <FontAwesomeIcon
                            icon={copyState.ethereum ? faCheck : faCopy}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy('ethereum');
                            }}
                            style={{ margin: '12px', cursor: 'pointer', color: 'white' }}
                        />
                    </div>
                    <div
                        style={{
                            height: '40px',
                            width: '40px',
                            backgroundColor: 'rgb(50, 53, 61)',
                            borderRadius: '40px',
                            marginLeft: '-15px',
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faQrcode}
                            onClick={(e) => handleQr(e, 'ethereum')}
                            style={{ margin: '12px', cursor: 'pointer', color: 'white' }}
                        />
                    </div>
                </div>
            )}

            {/* Bitcoin Section */}
            {filteredSections.find((section) => section.id === 'bitcoin' && section.visible) && (
                <div
                    className={`${styles.bitcoinDiv} ${styles.hoverableDiv}`}
                    onClick={() => handleCopy('bitcoin')}
                    style={{
                        display: 'flex',
                        margin: '25px 0 0 30px',
                        border: '1px solid gray',
                        width: '330px',
                        alignItems: 'center',
                        padding: '20px',
                        borderRadius: '12px',
                    }}
                >
                    <div>
                        <img
                            src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933124/bitcoin_img1_okht2d.png"
                            alt="Bitcoin_image"
                            style={{
                                height: '35px',
                                width: '35px',
                                borderRadius: '50px',
                                border: '1px solid white',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <p style={{ fontSize: '14px' }}>Bitcoin address</p>
                        <p style={{ fontSize: '11px', color: 'gray' }}>{bitcoinAddress}</p>
                    </div>
                    <div
                        style={{
                            height: '40px',
                            width: '40px',
                            backgroundColor: 'rgb(50, 53, 61)',
                            borderRadius: '40px',
                            position: 'relative',
                            left: '95px',
                        }}
                    >
                        <FontAwesomeIcon
                            icon={copyState.bitcoin ? faCheck : faCopy}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy('bitcoin');
                            }}
                            style={{ margin: '12px', cursor: 'pointer', color: 'white' }}
                        />
                    </div>
                    <div
                        style={{
                            height: '40px',
                            width: '40px',
                            backgroundColor: 'rgb(50, 53, 61)',
                            borderRadius: '40px',
                            marginLeft: '0px',
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faQrcode}
                            onClick={(e) => handleQr(e, 'bitcoin')}
                            style={{ margin: '12px', cursor: 'pointer', color: 'white' }}
                        />
                    </div>
                </div>
            )}

            {/* Buy Crypto Section */}
            {filteredSections.find((section) => section.id === 'buyCrypto' && section.visible) && (
                <div
                    className={`${styles.buyButtonDiv} ${styles.hoverableDiv}`}
                    onClick={() => router.push('/Userauthorization/buy_crypto')}
                    style={{
                        display: 'flex',
                        margin: '25px 0 0 30px',
                        border: '1px solid gray',
                        width: '330px',
                        alignItems: 'center',
                        padding: '20px',
                        borderRadius: '12px',
                    }}
                >
                    <div>
                        <FontAwesomeIcon icon={faAngleRight} size="2x" style={{ color: 'white' }} />
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <p style={{ fontSize: '14px' }}>Buy Crypto</p>
                        <p style={{ fontSize: '11px', color: 'gray' }}>Use your fiat wallet to buy crypto assets</p>
                    </div>
                </div>
            )}
             </>
              )}
        </div>
    );
}







