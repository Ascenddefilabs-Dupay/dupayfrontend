'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import Head from 'next/head';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import styles from '../Recoveryphase/recovery.module.css'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bcrypt from 'bcryptjs';
// import '../newpasscodephase/newpasscode.css';



const RecoveryPass: React.FC = () => {
    const router = useRouter();
    const [user_email, setEmail] = useState<string>('');
    const [user_password, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [verifyNewPassword, setVerifyNewPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [newPasswordError, setNewPasswordError] = useState<string>('');
    const [passwordMismatchError, setPasswordMismatchError] = useState<string>('');
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [otpFromBackend, setOtpFromBackend] = useState<string>('');
    const [verificationSuccessful, setVerificationSuccessful] = useState<boolean>(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [timer, setTimer] = useState<number>(60); // Example timer state
    const [showResendOtp, setShowResendOtp] = useState<boolean>(false);
    const [otpExpired, setOtpExpired] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
    // const [errors, setErrors] = useState<Error>({});

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    //   const user_password = ''; // Replace this with the actual current user password


    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Reset error message
    
        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
    
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const hashedPassword1 = await bcrypt.hash(confirmPassword, salt);
        //   const response = await axios.post('http://127.0.0.1:8000/userauthorizationapi/logpassword1/', {
        //     params: { password: hashedPassword ,confirmPassword: hashedPassword1}
        //   });
    
          const response1 = await axios.post("http://127.0.0.1:8000/passwordapi/recreatepasscode/", {
            password: hashedPassword,  
            confirmPassword: hashedPassword1,
            // Make sure this key matches your backend   
        });
    
          // Logic to handle password creation with hashed password goes here
          console.log("Password created successfully:", hashedPassword);
        } catch (error) {
          console.error("Error hashing password:", error);
          setError("An error occurred while creating the password.");
        }
      };
    const checkEmailExists = async (email: string) => {
        try {
            const response = await axios.get(`https://userauthentication-rcfpsxcera-uc.a.run.app/passwordchangeapi/check-email/?email=${user_email}`);
            if (response.data.exists) {
                setEmailError('');
            } else {
                setEmailError('Email not found');
            }
        } catch (error) {
            setEmailError('Error checking email');
        }
    };

    useEffect(() => {
        if (otpSent && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            // Clear the interval when the component unmounts or when the timer reaches 0
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setShowResendOtp(true); // Show the "Resend OTP" button when the timer reaches 0
        }
    }, [otpSent, timer]);

    const sendOtp = async () => {
        if (!user_email) {
            Swal.fire({
                text: 'Email is required.',
                width: 250,
                color: 'white',
                confirmButtonText: 'Okay',
                // background: 'rgba(0, 0, 0, 0.5)', 
                background:'rgb(117, 115, 115)',
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                }
                  
                });
            return;
        }
        
        try {
    
          const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          console.log(generatedOtp)
          const response = await fetch('https://securitymanagement-255574993735.asia-south1.run.app/passwordapi/generate_otp/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_email, otp: generatedOtp }),
          });
    
          const result = await response.json();

          console.log(result);
          
          if (response.ok) {
            setOtpFromBackend(generatedOtp);
            setOtpSent(true);
            setTimer(60);
            setShowResendOtp(false);
            setOtpExpired(false);
            Swal.fire({
                title: 'OTP Sent Successfully!',
                width: 300,
                color: 'white',
                showConfirmButton: true,
                confirmButtonText: 'Okay', 
                background:'rgb(117, 115, 115)',
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title', 
                }
              });
          } else {
            Swal.fire({
                width: 300,
                color: 'white',
                title: result.error || 'Email Not Found',
                showConfirmButton: true,
                background:'rgb(117, 115, 115)',
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                }
              });
          }
        } catch (error) {
            Swal.fire({
                title: 'Failed to send OTP',
                width: 300,
                color: 'white',
                text: 'Please try again.',
                showConfirmButton: true,
                confirmButtonText: 'Retry', 
                background:'rgb(117, 115, 115)',
                customClass: {
                    popup: 'custom-popup' , 
                    title: 'custom-title',
                }
              });
        }
      };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('https://securitymanagement-255574993735.asia-south1.run.app/passwordapi/generate_otp/', {
                user_email: user_email,
            });
    
            if (response.status === 200) {
                setOtpSent(true);
                Swal.fire('Success', 'OTP sent to your email!', 'success');
                
            }
        } catch (error) {
            // Type cast 'error' to 'any' to access its properties
            const errorMessage = (error as any)?.response?.data?.message || 'Failed to send OTP';
            
            Swal.fire('Error', errorMessage, 'error');
        }
        
    };
    
    const handleOtpCheck = async () => {
        try {
          const response = await fetch("https://securitymanagement-255574993735.asia-south1.run.app/passwordapi/verify_otp/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_email: user_email,  // Make sure this key matches your backend
              user_otp: otp,      // Make sure this key matches your backend
            }),
          });

          
          if (response.ok) {
            Swal.fire({
                title: "OTP Verification",
                icon: "success",
                width: 300,
                color: 'white',
                background:'rgb(117, 115, 115)',
                customClass: {
                    popup: 'otp-swal-popup', 
                    title: 'otp-swal-title',
                    confirmButton: 'otp-swal-confirm-btn' 
                },
                confirmButtonText: "Continue"
            }).then((result) => {
                if (result.isConfirmed) {
                    // router.push('/Userauthorization/newpasscodephase'); 
                    setVerificationSuccessful(true);
                }
                
            });
          } else {
            const errorData = await response.json();
            console.log("Error:", errorData);
          }
        } catch (error) {
          console.error("Request failed:", error);
        }
      };
      
      
    
    
    const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add your OTP submission logic here
    };
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
    
        // If the value has more than one character, split it
        if (value.length > 1) {
            const updatedOtp = [...otp];
    
            // Fill the current box with the first character
            updatedOtp[index] = value.charAt(0);
    
            // If there's a second character, place it in the next box
            if (index < otp.length - 1) {
                updatedOtp[index + 1] = value.charAt(1);
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus(); // Focus on the next input
            }
    
            setOtp(updatedOtp);
        } else {
            // If only one character, handle as before
            const updatedOtp = [...otp];
            updatedOtp[index] = value.charAt(0);
            setOtp(updatedOtp);
    
            // Move to the next input if available
            if (index < otp.length - 1 && value !== '') {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };
    
    
    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            const updatedOtp = [...otp];
    
            // Clear the current input box
            updatedOtp[index] = '';
    
            // Update the OTP state
            setOtp(updatedOtp);
    
            // Move focus to the previous input if the current box is empty
            if (index > 0) {
                const prevInput = document.getElementById(`otp-${index - 1}`);
                prevInput?.focus();
            }
        }
    };

    const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Reset error message
    
        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
    
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const hashedPassword1 = await bcrypt.hash(confirmPassword, salt);
        //   const response = await axios.post('http://127.0.0.1:8000/userauthorizationapi/logpassword1/', {
        //     params: { password: hashedPassword ,confirmPassword: hashedPassword1}
        //   });
    
          const response = await axios.post("https://securitymanagement-255574993735.asia-south1.run.app/passwordapi/recreatepasscode/", {
            email: user_email,
            password: hashedPassword,  
            confirmPassword: hashedPassword1,
            // Make sure this key matches your backend   
        });
    
          // Logic to handle password creation with hashed password goes here
          console.log(response.data)
          console.log(response.data.status)
          if (response.data.success){
            Swal.fire({
                title: "Passcode changed Successfully",
                icon: "success",
                width: 300,
                color: 'white',
                background:'rgb(117, 115, 115)',
                customClass: {
                    popup: 'otp-swal-popup', 
                    title: 'otp-swal-title',
                    confirmButton: 'otp-swal-confirm-btn' 
                },
                confirmButtonText: "Continue"
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/Userauthorization/Dashboard/Home');
                    setVerificationSuccessful(true);
                }
                }
            )}
            console.log("Password created successfully:", hashedPassword);
                
            } catch (error) {
            console.error("Error hashing password:", error);
            setError("An error occurred while creating the password.");
            }
            
        };
    
    

    return (
        <div className={styles.Recoverycontainer}>
            <Head>
                <title>Log Passcode</title>
                <meta name="description" content="Log passcode page" />
            </Head>

            <div className={styles.Recovery}>
                <div className={styles.Recoverycard}>
                    <div className={styles.RecoveryimageLogo}>
                        <div className={styles.Recoverygraphics}>
                            <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804054/dupay_rhft2i.png" alt="logo" />
                        </div>
                        <h1 className={styles.Recoverytitle}>Dupay</h1>
                    </div>

                    <div className={styles.RecoveryformContent}>
                        {!otpSent && !verificationSuccessful && (
                            <form onSubmit={handleSubmit} className={styles.Recoveryform}>
                                <div className={styles.RecoveryinputGroup}>
                                    <div className={styles.RecoveryinputWithButton}>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={user_email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`${styles.input} ${emailError ? styles.RecoveryerrorInput : ''}`}
                                            required
                                        />
                                    </div>
                                    {emailError && <span className={styles.Recoveryerror}>{emailError}</span>}
                                </div>

                                {!verificationSuccessful && (
                                    <button type="button" onClick={() => sendOtp()} className={styles.RecoverysubmitButton}>
                                        Send OTP
                                    </button>
                                )}
                            </form>
                        )}
                        {otpSent && !verificationSuccessful && (
                            <form onSubmit={handleOtpSubmit} className={styles.Recoveryform}>
                                <div className={styles.inputGroup}>
                                    <label>Enter OTP*</label>
                                    <div className={styles.otpGroup}>
                                        {otp.map((_, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength={1} 
                                                value={otp[index] || ''}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleBackspace(e, index)}
                                                className={styles.otpInput}
                                                required
                                            />
                                        ))}
                                    </div>

                                    {passwordError && <span className={styles.Recoveryerror}>{passwordError}</span>}
                                </div>

                                <div className={styles.RecoverytimerGroup}>
                                    <span>{timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : '00:00'}</span>
                                    {showResendOtp && !otpExpired && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                sendOtp(); // Resend the OTP
                                                setTimer(60); // Reset the timer
                                                setShowResendOtp(false); // Hide the button until the timer runs out again
                                            }}
                                            className={styles.RecoveryresendOtpButton}
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>

                                <button type="submit" className={styles.RecoverysubmitButton} onClick={handleOtpCheck}>Next</button>
                            </form>
                        )}
                        {verificationSuccessful && (
                                <form onSubmit={handleSubmitPassword}>
                                    {/* <span className={styles.createpass}>Create New Passcode</span> */}
                                    <span className={styles.pass1}>New Passcode</span>
                                    <div className={styles.newpasscode1}>
                                        <div className={styles.newpass_container}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            value={password}
                                            maxLength={6}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setPassword(value);
                                            }
                                            }}
                                        />
                                        <span className={styles.icon} onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </span>
                                        </div>
                                    </div>

                                    <span className={styles.pass1} >Retype New Passcode</span>
                                    <div className={styles.newpasscode2}>
                                        <div className={styles.newpass_container2}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Retype New Password"
                                            value={confirmPassword}
                                            maxLength={6}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setConfirmPassword(value);
                                            }
                                            }}
                                        />
                                        <span className={styles.icon2} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </span>
                                        </div>
                                    </div>

                                    {error && <p className={styles.error_message}>{error}</p>}
                                    <button className={styles.newpasssubmit} >Submit</button>
                                </form>
                            )}

                            <div className={styles.Recoveryfooter}>
                            <p>
                                <Link href="/terms-and-conditions">Back To LogIn</Link> 
                            </p>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecoveryPass;


