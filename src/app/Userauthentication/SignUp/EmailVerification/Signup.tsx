"use client";
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';


import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link';
import styles from './signup.module.css'; // Adjust the path according to your project structure

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

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
  const [otp, setOtp] = useState<string>('');
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
      const emailCheckResponse = await fetch('https://userauthentication-ind-255574993735.asia-south1.run.app/signupapi/check-email/', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const emailCheckResult = await emailCheckResponse.json();
      if (emailCheckResponse.ok && emailCheckResult.exists) {
        alert('Email is already in use. Please use a different email.');
        return;
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const response = await fetch('https://userauthentication-ind-255574993735.asia-south1.run.app/signupapi/generate-otp/', {
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
        setTimer(30);
        setShowResendOtp(false);
        setOtpExpired(false);
        alert('OTP sent successfully!');
      } else {
        alert(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
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
      alert('Please verify your email by clicking the "Send OTP" button.');
    } else if (valid && otpSent && !verificationSuccessful) {
      alert('Please complete OTP verification.');
    }
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (otpExpired) {
      alert('Invalid or expired OTP. Please request a new OTP.');
    } else if (otp === otpFromBackend) {
      setVerificationSuccessful(true);
      setOtpSent(false);
      setOtp('');
      setOtpFromBackend('');
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
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
      const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/signupapi/register/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Registration successful!');
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

      const backendResponse = await fetch('https://userauthentication-ind-255574993735.asia-south1.run.app/signupapi/google-signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (backendResponse.ok) {
        alert('Google Sign-Up successful!');
        router.push('/Userauthentication/SignIn');
      } else {
        const errorData = await backendResponse.json();
        alert(`Google Sign-Up failed: ${errorData.error}`);
      }
    } catch (error) {
      alert('Google Sign-Up failed. Please try again.');
    }
  };

  const handleGoogleFailure = (error: any) => {
    console.error('Google Sign-In Failure:', error);
    alert('Google Sign-In failed. Please try again.');
  };

  return (
    
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className={styles.container}>

        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Signup</h1>
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
                      className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                      required
                    />
                    {!verificationSuccessful && (
                      <button type="button" onClick={sendOtp} className={styles.otpButton}>
                        Send OTP
                      </button>
                    )}
                  </div>
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>

                <div className={styles.checkboxGroup}>
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms" className={styles.checkboxLabel}>
                    I have read and agree to the <a href="#" className={styles.link}>Terms and Conditions</a> and{' '}
                    <a href="#" className={styles.link}>Privacy Policy</a>.
                  </label>
                </div>
                <button type="submit" className={styles.submitButton}>
                  {verificationSuccessful ? 'Proceed to Password Setup' : 'Submit'}
                </button>
              </form>
            )}

            {otpSent && !verificationSuccessful && (
              <form onSubmit={handleOtpSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Enter OTP*</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`${styles.input} ${errors.otp ? styles.errorInput : ''}`}
                    required
                  />
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
                <button type="submit" className={styles.submitButton}>Verify OTP</button>
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
            <div className={styles.googleButtonWrapper}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              // onError={handleGoogleFailure}
              // logo
            />
          </div>
          <div className={styles.signInLinkWrapper}>
                  <Link href="/Userauthentication/SignIn" className={styles.signInLink}>
                    Already have an account? Sign In
                  </Link>
          </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
