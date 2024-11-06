'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '../retypepassword/retypeform.css';
import Swal from 'sweetalert2'
const SecurityManagement = process.env.SecurityManagement
const Retype = () => {
    const [passcode, setPasscode] = useState("");
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
    const router = useRouter();

    const handleNumberClick1 = async (number: any) => {
        if (passcode.length < 6) {
            const retypepasscode = passcode + number;
            setPasscode(retypepasscode);

            // Redirect to /Dashboard after 6 digits
            if (retypepasscode.length === 6) {
                try {
                    // Send the retypepasscode to the backend without hashing
                    const response = await axios.post(`${SecurityManagement}/passwordapi/repassword/`, {
                        retype_password: retypepasscode,
                        userId: userId,
                    });
                    console.log(response.data)
                    console.log(response.data.status)

                    if (response.data.status === 'password_failure') {
                        Swal.fire({
                            position: "center",
                            icon: "warning",
                            title: "Passwork Mismatch",
                            showConfirmButton: false,
                            timer: 1500
                          });
                    } else if (response.data.status === 'password_match') {
                        console.log('password match')
                        router.push('/Userauthentication/SignUp/EmailVerification');
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((number, index) => (
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
