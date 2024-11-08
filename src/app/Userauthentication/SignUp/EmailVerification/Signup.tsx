"use client";
import { useState, useEffect, FormEvent , useRef} from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
// import Navbar from '../../LandingPage/Navbar';


import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link';
import styles from './signup.module.css'; // Adjust the path according to your project structure
import { margin, style } from '@mui/system';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LottieAnimationLoading from '../../../assets/LoadingAnimation'; 

const UserAuthentication = process.env.NEXT_PUBLIC_UserAuthentication
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
// const UserAuthentication = process.env.UserAuthentication
interface Errors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
  submit?: string;
}

export default function Home1() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpFromBackend, setOtpFromBackend] = useState<string>('');
  const [verificationSuccessful, setVerificationSuccessful] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [showResendOtp, setShowResendOtp] = useState<boolean>(false);
  const [otpExpired, setOtpExpired] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
 
  
  


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowResendOtp(true);
      setOtpExpired(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    if (!email) {
      setErrors({ email: 'Email is required.' });
      return;
    }
    try {

      // Check if the email is already in use
      const emailCheckResponse = await fetch(`${UserAuthentication}/signupapi/check-email/`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const emailCheckResult = await emailCheckResponse.json();
      if (emailCheckResponse.ok && emailCheckResult.exists) {
        // alert('Email is already in use. Please use a different email.');
        toast.error("Email is already in use. Please use a different email.", { position: "top-center", autoClose:5000 });
        return;
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const response = await fetch(`${UserAuthentication}/signupapi/generate-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: generatedOtp }),
      });

      const result = await response.json();
      if (response.ok) {
        setOtpFromBackend(generatedOtp);
        setOtpSent(true);
        setTimer(60);
        setShowResendOtp(false);
        setOtpExpired(false);
        // alert('OTP sent successfully!');
        toast.success("OTP sent successfully!", { position: "top-center", autoClose:5000 });
      } else {
        // alert(result.error || 'Failed to send OTP. Please try again.');
        toast.error("Failed to send OTP. Please try again.", { position: "top-center", autoClose:false });
      }
    } catch (error) {
      // alert('Failed to send OTP. Please try again.');
      toast.error("Failed to send OTP. Please try again.", { position: "top-center", autoClose:false });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let valid = true;
    let newErrors: Errors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }

    setErrors(newErrors);

    if (valid && !otpSent) {
      // alert('Please verify your email by clicking the "Send OTP" button.');
      toast.error("Please verify your email by clicking the 'Send OTP' button", { position: "top-center", autoClose:false });
    } else if (valid && otpSent && !verificationSuccessful) {
      // alert('Please complete OTP verification.');
      toast.error("Please complete OTP verification.", { position: "top-center", autoClose:false });
    }
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    const combinedOtp = otp.join('');
    console.log('OTP Submitted:', otp.join(''));
    if (otpExpired) {
      // alert('Invalid or expired OTP. Please request a new OTP.');
      toast.error("Invalid or expired OTP. Please request a new OTP.", { position: "top-center", autoClose:false });
    } else if (combinedOtp === otpFromBackend) {
      setVerificationSuccessful(true);
      setOtpSent(false);
      setOtp(Array(6).fill(""));
      setOtpFromBackend('');
      // alert('OTP verified successfully!');
      toast.success("OTP verified successfully!", { position: "top-center", autoClose:5000 });
    } else {
      // alert('Invalid OTP. Please try again.');
      toast.error("Invalid OTP. Please try again.", { position: "top-center", autoClose:false });
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let newErrors: Errors = {};
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('user_email', email);
    formDataToSend.append('user_password', newPassword);

    try {
      const response = await axios.post(`${UserAuthentication}/signupapi/register/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {

        // alert('Registration successful!');
        toast.success("Registration successful!", { position: "top-center", autoClose:5000 });
        router.push('/Userauthentication/SignIn');
      } else {
        const errorMessage = response.data.error || 'Registration failed. Please try again.';
        setErrors(prevErrors => ({
          ...prevErrors,
          user_email: errorMessage,
        }));
        
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
      setErrors(prevErrors => ({
        ...prevErrors,
        user_email: errorMessage,
      }));
      
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      const idToken = response.credential;

      const backendResponse = await fetch(`${UserAuthentication}/signupapi/google-signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (backendResponse.ok) {
        // alert('Google Sign-Up successful!');
        toast.success("Google Sign-Up successful!", { position: "top-center", autoClose:5000 });
        router.push('/Userauthentication/SignIn');
      } else {
        const errorData = await backendResponse.json();

        // alert(`Google Sign-Up failed: ${errorData.error}`);
        toast.error("Google Sign-Up failed: ${errorData.error}", { position: "top-center", autoClose:false });
        console.log(errorData,UserAuthentication)
      }

    } catch (error) {
      toast.error("Google Sign-Up failed. Please try again.", { position: "top-center", autoClose:false });
      // alert('Google Sign-Up failed. Please try again.');
    }
  };

  const handleGoogleFailure = (error: any) => {
    console.error('Google Sign-In Failure:', error);
    // alert('Google Sign-In failed. Please try again.');
    toast.error("Google Sign-In failed. Please try again.", { position: "top-center", autoClose:false});
  };
  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) { // Only allow digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move to the next input field if available
      if (index < otp.length - 1 && value !== "") {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

 






  // Handle backspace for deletion (works for both physical and custom keyboard)
  const handleBackspace = () => {
    for (let i = otp.length - 1; i >= 0; i--) {
      if (otp[i] !== '') {
        const newOtp = [...otp];
        newOtp[i] = '';
        setOtp(newOtp);

        // Move focus to the current input field
        inputRefs.current[i]?.focus();
        break;
      }
    }
  };
  

  // Capture physical keyboard input (only for backspace or navigation)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace") {
      handleBackspace(); // Trigger backspace behavior
    }
  };
 
  

  return (
    
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className={styles.container}>
      <Head>
        <title>Signup</title>
        <meta name="description" content="Signup page" />
      </Head>
      {/* <Navbar /> */}
      <header>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      </header>

        <div className={styles.formWrapper}>
          <div className={styles.card} >
        <div className={styles.imageLogo}>
              <div className={styles.graphics}>
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25" fill="url(#paint0_linear_2012_8284)"/>
                <path d="M19.1019 37.6812H16.9419C16.3896 37.6812 15.9419 37.2334 15.9419 36.6812V18.9782C15.9419 18.4259 16.388 17.9782 16.9403 17.9782H25.7178C27.1738 17.9782 32.7897 19.2358 32.7897 25.1048C32.7897 30.9738 29.0458 32.441 25.7178 32.441H22.7649C22.2127 32.441 21.7658 31.9933 21.7658 31.441V29.4585C21.7658 28.9062 22.2135 28.4585 22.7658 28.4585H25.7178C28.6298 28.4585 29.0458 26.1528 29.0458 25.1048C29.0458 24.0568 28.4218 21.9607 25.7178 21.9607H20.1019V36.6812C20.1019 37.2335 19.6541 37.6812 19.1019 37.6812Z" fill="white"/>
                <path d="M15.9419 15.3014V13.3188C15.9419 12.7666 16.3892 12.3188 16.9415 12.3188H25.7178C28.6298 12.3188 38.4057 13.7861 38.4057 25.1048C38.4057 36.4235 28.4218 37.6812 25.7178 37.6812H22.7653C22.213 37.6812 21.7658 37.2335 21.7658 36.6812V35.1179C21.7658 34.5656 22.2136 34.1179 22.7658 34.1179H25.7178C31.3337 34.1179 34.4537 30.345 34.4537 25.1048C34.4537 19.8647 30.5017 16.3014 25.7178 16.3014H16.941C16.3887 16.3014 15.9419 15.8536 15.9419 15.3014Z" fill="white"/>
                <defs>
                <linearGradient id="paint0_linear_2012_8284" x1="0" y1="0" x2="0" y2="50" gradientUnits="userSpaceOnUse">
                <stop stop-color="#E34D67"/>
                <stop offset="1" stop-color="#7746F4"/>
                </linearGradient>
                </defs>
                </svg>

              </div>
              <h1 className={styles.title}>Dupay</h1>
            </div>
          <div className={styles.formContent}>
            {!otpSent && !verificationSuccessful && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Email Address*</label>
                  <div className={styles.inputWithButton}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => {
                      e.preventDefault();
                      // handleFocus();
              
                    }}
                    
                    // onBlur={() => {
                    //   setkeyboardAlphaVisible(false);
                    //   setBottomVisible(true);         
                    // }}
                    className={`${styles.input} ${styles.errorInput}`}
                    required
                  />

             
                    
                    {/* {!verificationSuccessful && (
                      <button type="button" onClick={sendOtp} className={styles.otpButton}>
                        Send OTP
                      </button>
                    )} */}
                  </div>
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>

                
                {/* <button type="submit" className={styles.submitButton}>
                  {verificationSuccessful ? 'Proceed to Password Setup' : 'Send OTP'}
                </button> */}
                {!verificationSuccessful && (
                      <button type="button" onClick={sendOtp} className={styles.submitButton}>
                        Send OTP
                      </button>
                    )}

                <div className={styles.checkboxGroup}>
                  {/* <input type="checkbox" id="terms" required /> */}
                  <label htmlFor="terms" className={styles.checkboxLabel}>
                  By proceeding, you agree to these <a href="#" className={styles.link}>Term and <br />Conditions.</a> and <a href="#" className={styles.link}>Privacy Policy</a>
                  {/* <a href="#" className={styles.link}></a> */}
                   {/* <a href="#" className={styles.link}>Terms and Conditions</a> and{' '} */}
                  </label>
                </div>
                
                
              
              
                <div className='BottomClass'>
                <div className={styles.orContinueWith}>
                      <p>or continue with</p>
                    </div>
                    {/* <div id="google-signin-button" className={styles.googleSignIn}>
                      <img 
                        src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804058/google_qolmfs.png" 
                        alt="Google sign-in"
                        className={styles.googleIcon}
                      />
                    </div> */}
                <div className={styles.googleButtonWrapper}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  // onError={handleGoogleFailure}
                  // logo
                />
              </div>

              <div className={styles.orContinueWith}>
                      <p>Already have an account? <Link href="/Userauthentication/SignIn">
                    <span className={styles.account}>Login</span>
                  </Link></p>
              </div>
              </div>  
              </form>
            )}
            

            {otpSent && !verificationSuccessful && (
              <form onSubmit={handleOtpSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  
                  <label>Enter OTP*</label>
                  <div className={styles.otpGroup}>
                  {Array(6)
                    .fill('')
                    .map((_, index) => (
                      <input
                        key={index}
                        ref={el => {
                          inputRefs.current[index] = el;
                        }}
                        // type="text"
                        type="tel"
                        maxLength={1}
                        value={otp[index] || ''}
                        className={styles.otpInput}
                        required
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)} 
                      />
                    ))}
                  </div>
                  
                  {errors.otp && <span className={styles.error}>{errors.otp}</span>}
                    </div>
                    <div className={styles.timerGroup}>
                      <span>{timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : '00:00'}</span>
                      {showResendOtp && !otpExpired && (
                        <button type="button" onClick={sendOtp} className={styles.resendOtpButton}>
                          Resend OTP
                        </button>
                  )}
                </div>
                <div className={styles.orContinueWith}>
                  <p>Did not  receive the code? <Link href="/Userauthentication/SignUp/EmailVerification">
                <span className={styles.account}>Request here.</span>
              </Link></p>
                </div>
                <button type="submit" className={styles.submitButton}>Next</button>
               
          
              </form>
            )}

            {verificationSuccessful && (
              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>New Password*</label>
                  <div className={styles.passwordGroup}>
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`${styles.input} ${errors.newPassword ? styles.errorInput : ''}`}
                      required
                    />
                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className={styles.eyeButton}>
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.newPassword && <span className={styles.error}>{errors.newPassword}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Confirm Password*</label>
                  <div className={styles.passwordGroup}>
                    <input
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
                      required
                    />
                    <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className={styles.eyeButton}>
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                </div>
                <button type="submit" className={styles.submitButton}>Register</button>

              </form>
            )}
            
          
          </div>
        </div>
        </div>
        <ToastContainer /> {/* Make sure to include this component */}
      </div>
    </GoogleOAuthProvider>
  );
}


