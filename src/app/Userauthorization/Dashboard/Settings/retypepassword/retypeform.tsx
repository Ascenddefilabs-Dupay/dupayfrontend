'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '../retypepassword/retypeform.css';

const Retype = () => {
    const [passcode, setPasscode] = useState("");
    const router = useRouter();

    const handleNumberClick1 = async (number: any) => {
        if (passcode.length < 6) {
            const retypepasscode = passcode + number;
            setPasscode(retypepasscode);

            // Redirect to /Dashboard after 6 digits
            if (retypepasscode.length === 6) {
                try {
                    const response = await axios.post('http://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/repassword/', {
                        retype_password: retypepasscode,
                    });

                    if (response.data.status === 'password_failure') {
                        alert("Password Must Be Same");
                    } else {
                        router.push('/Userauthorization/Dashboard');
                    }
                } catch (error) {
                    console.error('Error submitting transaction:');
                }
            }
        }
    };

    const handleBackspace1 = () => {
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
            <p>Retype Passcode</p>
            <div className="number-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number, index) => (
                    <button
                        key={index}
                        className="number-button"
                        onClick={() => handleNumberClick1(number.toString())}
                    >
                        {number}
                    </button>
                ))}
                <button className="backspace-button" onClick={handleBackspace1}>
                    &#x232B;
                </button>
            </div>
        </div>
    );
};

export default Retype;
