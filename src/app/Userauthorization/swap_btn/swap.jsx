"use client";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaCheck } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

export default function Swap() {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/Userauthorization/Dashboard')
    }

    const handleAddCryptoClick = () => {
        router.push('/FiatManagement/Currency_Conversion'); // Adjust the route as needed
    };

    const handleLearnMoreClick = () => {
        router.push('/Userauthorization/Dashboard'); // Adjust the route as needed
    };

    return (
        <div style={{
            position: 'relative',
            backgroundColor: 'black',
            width: '400px',
            top: '1px',
            margin: '0 auto',
            color: 'white',
            minHeight: '80vh',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            cursor: 'pointer',
        }}>
            <div style={{ flex: '1' }}> 
                <ArrowBackIcon onClick={handleBackClick} style={{ margin: '10px 15px' }} />
                <img src="/swap_image.png" alt="Swap image" style={{ height: '140px', marginLeft: '130px' }} />
                <header style={{ alignItems: 'center', marginLeft: '110px', fontSize: '20px' }}>
                    Get the best price
                    <p style={{ marginLeft: '20px' }}>
                        when u swap
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
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            background: 'linear-gradient(90deg, #007bff9f, #800080)',
                            color: 'white',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            border: 'none',
                            width: '100%'
                        }}
                    >
                        Add crypto to your wallet
                    </button>
                </div>
                <div>
                    <button
                        onClick={handleLearnMoreClick}
                        style={{
                            padding: '10px',
                            background: 'linear-gradient(90deg, #007bff9f, #800080)',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '25px',
                            border: 'none',
                            width: '100%'
                        }}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}
