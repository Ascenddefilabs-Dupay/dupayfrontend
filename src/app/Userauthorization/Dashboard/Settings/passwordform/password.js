'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../passwordform/password.css';
import axios from 'axios';


const PasscodeScreen = () => {
    const [passcode, setPasscode] = useState("");
    const router = useRouter();

    const handleNumberClick = async (number) => {
        if (passcode.length < 6) {
            const newPasscode = passcode + number;
            setPasscode(newPasscode);

            
            if (newPasscode.length === 6) {
                try{
                    const response = await axios.post('http://localhost:8000/api/password/', {
                        password_creation : newPasscode,
                    });
                }
                catch(error){
                    console.error('Error submitting transaction:', error.response ? error.response.data : error.message);
                }
                router.push('/Userauthorization/Dashboard/Settings/retypepassword');
            }
        }
    };

    const handleBackspace = () => {
        setPasscode(passcode.slice(0, -1));
    };

    return (
        <div className="passcode-screen">
            <h1>Unlock your wallet</h1>
            <div className="passcode-dots">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index < passcode.length ? 'filled' : ''}`}
                    ></div>
                ))}
            </div>
            <p>Enter your Passcode</p>
            <div className="number-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number, index) => (
                    <button
                        key={index}
                        className="number-button"
                        onClick={() => handleNumberClick(number.toString())}
                    >
                        {number}
                    </button>
                ))}
                <button className="backspace-button" onClick={handleBackspace}>
                    &#x232B;
                </button>
            </div>
        </div>
    );
};

export default PasscodeScreen;
