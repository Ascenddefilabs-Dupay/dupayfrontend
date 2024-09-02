"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from './login.module.css';
import Navbar from '../LandingPage/Navbar';
import Cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';

import UseSession from './hooks/UseSession';
export default function Login() {
  const router = useRouter();
  const [heading, setHeading] = useState('Login');
  const { isLoggedIn, userData, clearSession } = UseSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState('password');
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: "896447012011-mnfigne1bhvjm1cj5tfjb33mb7fn3mpr.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post('http://localhost:8000/loginapi/google-login/', {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    sessionStorage.setItem("user_id","DupC0003");
    sessionStorage.setItem("wallet_id","Wa0000000003");


    if (loginMode === 'password') {
      try {
        const response = await axios.post('http://localhost:8000/loginapi/login/', {
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
        const response = await axios.post('http://localhost:8000/loginapi/verify-otp/', {
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
      await axios.post('http://localhost:8000/loginapi/generate-otp/', {
        user_email: email,
      });
      setOtpTimer(30);
      alert('OTP resent to your email.');
    } catch (error) {
      alert('Error resending OTP.');
    }
  };

  const LocalStorage = (user_id, user_first_name, user_email, user_phone_number, session_id) => {
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
                    onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className={styles.passwordInput}
                      />
                      <i
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                    </div>
                  </label>
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
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                </>
              )}
              <div className={styles.checkboxContainer}>
                {loginMode === 'password' && (
                  <>
                    <label htmlFor="rememberMe">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        className={styles.checkbox}
                      />
                      Remember Me
                    </label>
                    <a href="/Userauthentication/SignIn/ForgotPassword" className={styles.forgotPassword}>Forgot Password?</a>
                  </>
                )}
              </div>
              <button type="submit" className={styles.button}>
                {loginMode === 'otp' ? 'Verify OTP' : 'Login'}
              </button>
              {loginMode === 'password' && (
                <>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => setLoginMode('otp')|| setHeading('Login with OTP')} 
                  >
                    Login with OTP
                  </button>
                  <label className={styles.or}>or</label>
                  <div className={styles.googleWrapper}>
                    <div id="google-signin-button" className={styles.googleButton}></div>
                  </div>
                </>
              )}
            </form>
          </div>
        ) : (
          <div className={styles.card}>
            <h1 className={styles.title}>Welcome, {userData.user_first_name}!</h1>
            <p>Email: {userData.user_email}</p>
            <p>Phone: {userData.user_phone_number}</p>
            <p>session_id:{userData.session_id}</p>
          </div>
        )}
      </main>
    </div>
  );
}
