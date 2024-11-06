'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../passwordform/password.css';
import axios from 'axios';
import bcrypt from 'bcryptjs'; 
const SecurityManagement = process.env.NEXT_PUBLIC_SecurityManagement
const Password = () => {
    const [passcode, setPasscode] = useState("");
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
      }, [router]);
    

    const handleNumberClick = async (number: any) => {
        if (passcode.length < 6) {
            const newPasscode = passcode + number;
            setPasscode(newPasscode);

            if (newPasscode.length === 6) {
                try {
                    // Hash the passcode before sending it to the server
                    const salt = bcrypt.genSaltSync(10);
                    const hashedPasscode = bcrypt.hashSync(newPasscode, salt);
                    console.log(userId);

                    // Send the hashed passcode to the server
                    await axios.post(`${SecurityManagement}/passwordapi/password/`, {
                        password_creation: newPasscode,
                        userId: userId,
                    });

                    router.push('/Userauthorization/Dashboard/Settings/retypepassword');
                } catch (error) {
                    console.error('Error submitting transaction:', error);
                }
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((number, index) => (
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

export default Password;
