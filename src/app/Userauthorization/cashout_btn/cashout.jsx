"use client";
import { useRouter } from 'next/navigation';
import { MdOutlineCancel } from "react-icons/md";

export default function Send() {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/Userauthorization/Dashboard');
    };

    return (
        <div style={{
            backgroundColor: 'black', 
            width: '400px', 
            position: 'relative',
            margin: '0 auto', 
            height: '100vh', 
            color: 'white',
            borderRadius: '12px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            fontFamily: 'Arial, Helvetica, sans-serif', /* Set the font for the entire container */

        }}>
            <MdOutlineCancel 
                onClick={handleBackClick}  
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '24px',
                    cursor: 'pointer'
                }}
            />
            <h1 style={{ marginTop: '40px' }}>
                {/* Your heading content here */}
            </h1>

            <div style={{ marginTop: '60px' }}>
                <img src="/Cashout_image.jpg" alt="Cashout_Image" style={{ height: '100px' }} />
            </div>
            <div style={{ marginTop: '50px', textAlign: 'center' }}>
                <p>You're being redirected to</p>                
                <p>Alchemy Pay to complete cash</p>
                <p>out process</p>
            </div>
            <p style={{ color: 'gray', fontSize: '12px', marginTop: '85px' }}>
                Alchemy Pay is not affiliated with Wallet in any way.
            </p>         
            <button 
                onClick={() => router.push('/Userauthorization/Dashboard')}
                style={{
                    padding: '10px',
                    background: 'linear-gradient(90deg, #007bff9f, #800080)',
                    color: 'white',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    border: 'none',
                    width: '90%',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}
            >
                Continue
            </button>
        </div>
    );
}
