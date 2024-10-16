"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from './login.module.css';
// import Navbar from '../LandingPage/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UseSession from './hooks/UseSession';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
  registration_status: boolean;
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
  const [loading, setLoading] = useState(false);
  
 
  useEffect(() => {
    const checkLocalStorage = () => {
      const sessionData = localStorage.getItem("session_data");
      if (sessionData) {
        const { expiration } = JSON.parse(sessionData);
        if (new Date(expiration) > new Date()) {
          router.push('/Userauthorization/Dashboard'); // Redirect if session is valid
          return;
        }
      }
      setLoading(false); // Set loading to false to show login form
    };

    checkLocalStorage(); // Check local storage on component mount
  }, [router]);
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button")!,
          { theme: "outline", size: "large" }
        );
      } else {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
              callback: handleGoogleResponse,
            });
            window.google.accounts.id.renderButton(
              document.getElementById("google-signin-button")!,
              { theme: "outline", size: "large" }
            );
          }
        };
        document.body.appendChild(script);
      }
    };

    initializeGoogleSignIn();
  }, []);
  const fetchFiatWalletId = async (userId: string) => {
    try {
      const response = await axios.get(
        `https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/fiat_wallet/${userId}/`
      );
      const { fiat_wallet_id } = response.data;

      if (fiat_wallet_id === null) {
        console.log("No wallet found, setting wallet ID to null.");
      } else {
        console.log("Wallet found: ", fiat_wallet_id);
      }
    } catch (error) {
      console.error("Error fetching fiat wallet ID: ", error);
    }
  };
  const handleGoogleResponse = async (response: GoogleResponse) => {
    try {
      const res = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/google-login/', {
        token: response.credential,
      });
  
      if (res.status === 200) {
        const { user_id, user_first_name, user_email, user_phone_number, session_id,registration_status, user_status, fiat_wallet_id } = res.data;
  
        // Ensure user_status is a boolean
        const isRegistrationComplete = registration_status === 'true' ? true : registration_status === 'false' ? false : registration_status;
  
        LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id, fiat_wallet_id);
        // alert('Logged in successfully with Google');
        toast.success("Logged in successfully with Google", { position: "top-center", autoClose:5000 });
        
        // Navigate based on user_status
        if (isRegistrationComplete) {
          router.push('/Userauthorization/Dashboard');
        } else {
          router.push('/KycVerification/PersonalDetails');
        }
      } else {
        // alert('Google login failed.');
        toast.error("Google login failed.", { position: "top-center", autoClose:false});
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      // alert('Error during Google login.');
      toast.error("Error during Google login.", { position: "top-center", autoClose:false });
    }
    
  };
    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (otpTimer > 0) {
        timer = setInterval(() => {
          setOtpTimer((prev) => prev - 1);
        }, 1000);
      }
      return () => clearInterval(timer); // Clear the timer on unmount
    }, [otpTimer]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      if (loginMode === 'password') {
        // Check if OTP has already been sent
        if (otpTimer > 0) {
          // Prevent sending OTP again while timer is active
          return;
        }
  
        try {
          const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/login/', {
            user_email: email,
            user_password: password,
          });
  
          if (response.status === 200) {
            // await sendOtp(); // Send OTP only once
            setOtpTimer(60); // Start the OTP timer
            toast.success("OTP sent to your email.", { position: "top-center", autoClose: 5000 });
            setLoginMode('otp');
            setHeading('Two-Factor Authentication');
          } else {
            toast.error("Invalid email or password.", { position: "top-center", autoClose: false });
          }
        } catch (error) {
          toast.error("Username or password is incorrect.", { position: "top-center", autoClose: false });
        }
      } else if (loginMode === 'otp') {
        try {
          const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/verify-otp/', {
            user_email: email,
            user_otp: otp,
          });
  
          if (response.status === 200) {
            const { user_id, user_first_name, user_email, user_phone_number, session_id, registration_status, fiat_wallet_id } = response.data;
            LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id, fiat_wallet_id);
            toast.success("Logged in successfully", { position: "top-center", autoClose: false });
  
            if (registration_status) {
              router.push('/Userauthorization/Dashboard');
            } else {
              router.push('/KycVerification/PersonalDetails');
            }
          } else {
            toast.error("Invalid OTP.", { position: "top-center", autoClose: false });
          }
        } catch (error) {
          toast.error("Error verifying OTP.", { position: "top-center", autoClose: false });
        }
      }
    };
  
    const sendOtp = async () => {
      try {
        await axios.post("https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/generate-otp/", {
          user_email: email,
        });
        setOtpTimer(60); // Start the OTP resend timer
        toast.success("OTP sent to your email.", { position: "top-center", autoClose: 5000 });
      } catch (error) {
        toast.error("Error sending OTP.", { position: "top-center", autoClose: false });
      }
    };
  
  const LocalStorage = async (
    user_id: string,
    user_first_name: string,
    user_email: string,
    user_phone_number: string,
    session_id: string,
    registration_status: boolean
  ) => {
    try {
      const walletResponse = await axios.get(
        `https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/fiat_wallet/${user_id}/`
      );
      const { fiat_wallet_id } = walletResponse.data;

      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 20);

      const sessionData = {
        session_id,
        user_id,
        user_first_name,
        user_email,
        user_phone_number,
        fiat_wallet_id: fiat_wallet_id || null,
        expiration: expirationDate.toISOString(),
      };
      localStorage.setItem("session_data", JSON.stringify(sessionData));
    } catch (error) {
      console.error("Error fetching fiat_wallet_id:", error);
      // alert("Error fetching wallet information.");
      toast.error("Error fetching wallet information.", { position: "top-center", autoClose:false});
    }
  };

  

  return (
    <div className={styles.container}>
      {/* <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>  */}
      <header>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      </header>

        {/* <Navbar /> */}

      <main className={styles.main}>
        {!isLoggedIn ? (
          <div className={styles.card}>
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
                      {otpTimer > 0 ? `Resend OTP IN(${otpTimer}s)` : 'Send OTP'}
                    </button>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="otp">
                      Enter OTP
                      <input
                        // type="text"
                        type="tel" // Change this to 'tel' to open the numeric keypad
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
                <div className={styles.orContinueWith}>
                  <p>or continue with</p>
                </div>
              )}
              {loginMode === 'password' && (
                <div id="google-signin-button" className={styles.googleSignIn}>
                  <img 
                    src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804058/google_qolmfs.png" 
                    alt="Google sign-in"
                    className={styles.googleIcon}
                  />
                </div>

              )}

              {/* <div id="google-signin-button" className={styles.googleSignIn}>
                <img 
                  src="/mnt/data/image.png" 
                  alt="Google sign-in"
                  className={styles.googleIcon}
                  onClick={() => {

                    if (window.google) {
                      window.google.accounts.id.prompt();
                    }
                  }}
                />
              </div> */}
              {loginMode === 'password' && (
                <div className={styles.orContinueWith}>
                  <p>Dont have an account? <Link href="/Userauthentication/SignUp/EmailVerification">
                <span className={styles.account}>Sign up</span>
              </Link></p>
                </div>
                
          
              )}
            </form>
          </div>
        ) : 
          <div>
             
          </div>
        }
      </main>
      <ToastContainer />
    </div>
  );
}
