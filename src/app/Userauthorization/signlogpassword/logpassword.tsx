'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '../signlogpassword/logpassword.css';
import Swal from 'sweetalert2';

const Logpasscode = () => {
    const [passcode, setPasscode] = useState("");
    const [hasError, setHasError] = useState(false);
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

    const handleNumberClick1 = async (number: any) => {
        if (passcode.length < 6) {
            const signpasscode = passcode + number;
            setPasscode(signpasscode);

            // After 6 digits are entered
            if (signpasscode.length === 6) {
                try {
                    // Send the retypepasscode to the backend without hashing
                    const response = await axios.post('https://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/logpassword/', {
                        logmain_password: signpasscode,
                        userId: userId,
                    });
                    console.log(response.data)

                    if (response.data.status === 'password_failure') {
                        // Trigger vibration on password mismatch
                        if (navigator.vibrate) {
                            navigator.vibrate(300); // Vibrates for 300 milliseconds
                        }

                        // Show alert and reset passcode
                        Swal.fire({
                            position: "center",
                            icon: "warning",
                            title: "Password Mismatch",
                            showConfirmButton: false,
                            timer: 1500,
                            background: '#2c2c2c',  // background color
                            iconColor: 'red',        // icon color
                            width: '200px', 
                            
                            customClass: {
                                title: 'lock-title', // apply your class
                                popup: 'lock-popup', // apply your class
                            }
                        });
                        

                        setPasscode(""); // Clear passcode
                    } else {
                        router.push('/Userauthorization/Dashboard/Home');
                        setHasError(true);
                    }
                } catch (error) {
                    console.error('Error submitting transaction:', error);
                }
            }
        }
    };

    const handleBackspace1 = () => {
        setPasscode(passcode.slice(0, -1));
    };

    const handleRecoverycode = () => {
        router.push('/Userauthorization/Recoveryphase');
      };

    return (
        <div className="log_passcode-screen">
            <h1>Unlock your wallet</h1>
            <div className="log_passcode-dots">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className={`log_dot ${index < passcode.length ? 'filled' : ''}`}
                    ></div>
                ))}
            </div>
            <p>Enter Passcode</p>
            <div className="log_number-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((number, index) => (
                    <button
                        key={index}
                        className="log_number-button"
                        onClick={() => handleNumberClick1(number.toString())}
                    >
                        {number}
                    </button>
                ))}
                <button className="log_backspace-button" onClick={handleBackspace1}>
                    &#x232B;
                </button>
            </div>

            <div className="log_card1">
                <button className="log_password_button" onClick={handleRecoverycode}>
                    <span className="log_button_text">Recovery Passcode</span>
                </button>
            </div>
        </div>
    );
};

export default Logpasscode;