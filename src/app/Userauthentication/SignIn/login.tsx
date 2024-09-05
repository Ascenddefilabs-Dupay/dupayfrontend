"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from './login.module.css';
import Navbar from '../LandingPage/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UseSession from './hooks/UseSession';

// Define types for the Google response
interface GoogleResponse {
  credential: string;
}

interface UserData {
  user_id: string;
  user_first_name: string;
  user_email: string;
  user_phone_number: string;
  session_id: string;
}

export default function Login() {
  const router = useRouter();
  const [heading, setHeading] = useState<string>('Login');
  const { isLoggedIn, userData, clearSession } = UseSession();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpTimer, setOtpTimer] = useState<number>(0);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (typeof window !== 'undefined' && (window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleResponse,
        });
        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-button")!,
          { theme: "outline", size: "large" }
        );
      } else {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
      }
    };

    initializeGoogleSignIn();
  }, []);

  const handleGoogleResponse = async (response: GoogleResponse) => {
    try {
      const res = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/google-login/', {
        token: response.credential,
      });

      if (res.status === 200) {
        const { user_id, user_first_name, user_email, user_phone_number, session_id } = res.data;
        LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id);
        alert('Logged in successfully with Google');
        window.location.href = '/KycVerification/PersonalDetails';
      } else {
        alert('Google login failed.');
      }
    } catch (error) {
      alert('Error during Google login.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loginMode === 'password') {
      try {
        const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/login/', {
          user_email: email,
          user_password: password,
        });

        if (response.status === 200) {
          await sendOtp();
          setOtpTimer(30);
          alert('OTP sent to your email.');
          setLoginMode('otp');
          setHeading('Two-Factor Authentication');
        } else {
          alert('Invalid email or password.');
        }
      } catch (error) {
        alert('Username or password is incorrect.');
      }
    } else if (loginMode === 'otp') {
      try {
        const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/verify-otp/', {
          user_email: email,
          user_otp: otp,
        });

        if (response.status === 200) {
          const { user_id, user_first_name, user_email, user_phone_number, session_id } = response.data;
          LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id);
          alert('Logged in successfully');
          window.location.href = '/KycVerification/PersonalDetails';
        } else {
          alert('Invalid OTP.');
        }
      } catch (error) {
        alert('Error verifying OTP.');
      }
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/generate-otp/', {
        user_email: email,
      });
      setOtpTimer(30);
      alert('OTP resent to your email.');
    } catch (error) {
      alert('Error resending OTP.');
    }
  };

  const LocalStorage = (user_id: string, user_first_name: string, user_email: string, user_phone_number: string, session_id: string) => {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 2);

    const sessionData = {
      session_id,
      user_id,
      user_first_name,
      user_email,
      user_phone_number,
      expiration: expirationDate.toISOString(),
    };
    localStorage.setItem('session_data', JSON.stringify(sessionData));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main} style={{ marginTop: '80px' }}>
        {!isLoggedIn ? (
          <div className={styles.card}>
            <h1 className={styles.title}>{heading}</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your Email"
                    disabled={loginMode === 'otp' && otpTimer > 0}
                  />
                </label>
              </div>
              {loginMode === 'password' && (
                <div className={styles.formGroup}>
                  <label htmlFor="password">
                    Password
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className={styles.passwordInput}
                      />
                      <i
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
                        onClick={() => setShowPassword(prev => !prev)}
                      />
                    </div>
                  </label>
                  <Link href="/Userauthentication/SignIn/ForgotPassword" className={styles.forgotPassword}>
                    Forgot Password?
                  </Link>
                </div>
              )}
              {loginMode === 'otp' && (
                <>
                  <div className={styles.formGroup}>
                    <button
                      type="button"
                      className={styles.button}
                      onClick={sendOtp}
                      disabled={otpTimer > 0}
                    >
                      {otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : 'Send OTP'}
                    </button>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="otp">
                      Enter OTP
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                </>
              )}
              <div className={styles.formGroup}>
                <button type="submit" className={styles.button}>
                  {loginMode === 'password' ? 'Login' : 'Verify OTP'}
                </button>
              </div>
              {loginMode === 'password' && (
                <div className={styles.formGroup}>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => {
                      setLoginMode('otp');
                      setHeading('OTP Login');
                      setOtp('');
                    }}
                  >
                    Login with OTP
                  </button>
                </div>
              )}
              {loginMode === 'password' && (
                <div id="google-signin-button" />
              )}
            </form>
            <p className={styles.text}>
              Don't have an account? <Link href="/Userauthentication/SignUp">Sign Up</Link>
            </p>
          </div>
        ) : (
          <div className={styles.card}>
            {/* <h1 className={styles.title}>Welcome back, {userData.user_first_name}</h1> */}
            <button
              onClick={clearSession}
              className={styles.button}
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
