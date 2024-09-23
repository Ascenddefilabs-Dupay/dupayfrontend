"use client";
import { useState, useEffect, ChangeEvent, FormEvent,useRef } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from './login.module.css';
import Navbar from '../LandingPage/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UseSession from './hooks/UseSession';
import { ToastContainer, toast } from 'react-toastify';
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
  // const [otp, setOtp] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      const response = await axios.get(`https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/fiat_wallet/${userId}/`);
      const { fiat_wallet_id } = response.data;
      
      if (fiat_wallet_id === null) {
        console.log("No wallet found, setting wallet ID to null.");
        // Handle case where no wallet is found, you can set the state accordingly
      } else {
        console.log("Wallet found: ", fiat_wallet_id);
        // Proceed with the wallet ID
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
        const { user_id, user_first_name, user_email, user_phone_number, session_id, registration_status } = res.data;
  
        // Convert registration_status to a boolean if it is not already
        const isRegistered = registration_status == 'true' || registration_status === true;
  
        // Store user data and fetch fiat_wallet_id
        LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id, isRegistered);
        await fetchFiatWalletId(user_id); // Fetch fiat_wallet_id and store it
  
        // alert('Logged in successfully with Google');
  
        // Navigate based on registration_status
        if (isRegistered) {
          router.push('/Userauthorization/Dashboard');
        } else {
          router.push('/KycVerification/PersonalDetails');
        }
      } else {
        alert('Google login failed.');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
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
        window.alert('Username or password is incorrect.');
      }
    } else if (loginMode === 'otp') {
      try {
        const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/verify-otp/', {
          user_email: email,
          user_otp: otp,
        });
  
        if (response.status === 200) {
          const {
            user_id = '', 
            user_first_name = '', 
            user_email = '', 
            user_phone_number = '', 
            session_id = '', 
            registration_status = false 
          } = response.data || {};  // Handle null values or missing data
  
          LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id, registration_status);
          await fetchFiatWalletId(user_id); // Fetch fiat_wallet_id and store it
          // alert('Logged in successfully');
  
          // Navigate based on registration_status
          if (registration_status === 'true') {
            router.push('/dashboard');
          } else {
            router.push('/KycVerification/PersonalDetails');
          }
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

  const LocalStorage = async (user_id: string, user_first_name: string, user_email: string, user_phone_number: string, session_id: string, registration_status: boolean) => {
    try {
      // Fetch fiat_wallet_id using user_id
      const walletResponse = await axios.get(`https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/fiat_wallet/${user_id}/`);
      const { fiat_wallet_id } = walletResponse.data;
  
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 20);
  
      const sessionData = {
        session_id,
        user_id,
        user_first_name,
        user_email,
        user_phone_number,
        fiat_wallet_id: fiat_wallet_id || null,  // Default to null if fiat_wallet_id is missing
        expiration: expirationDate.toISOString(),
      };
      localStorage.setItem('session_data', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error fetching fiat_wallet_id:', error);
      alert('Error fetching wallet information.');
    }
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
  const toggleKeyboard = () => {
    setKeyboardVisible(false);
  };
  

  // Handle custom keyboard clicks
  const handleKeyboardClick = (num: string) => {
    // Find the first empty input field
    for (let i = 0; i < otp.length; i++) {
      if (otp[i] === "") {
        handleOtpChange(i, num);
        break;
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

        <Navbar />

      <main className={styles.main}>
        {!isLoggedIn ? (
          <div className={styles.card}>
            <div className={styles.imageLogo}>
              <div className={styles.graphics}>
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804054/dupay_rhft2i.png" alt="logo" />
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
                      {otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : 'Send OTP'}
                    </button>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="otp">
                      Enter OTP
                      <div className={styles.otpGroup}>
                      {Array(6)
                    .fill('')
                    .map((_, index) => (
                      <input
                        key={index}
                        ref={el => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={otp[index] || ''}
                        className={styles.otpInput}
                        required
                        onFocus={() => setKeyboardVisible(true)}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)} 
                      />
                    ))}
                      </div>
                  
                    </label>
                  </div>
                  
                </>
              )}
              <div className={styles.formGroup}>
                <button type="submit" className={styles.button}>
                  {loginMode === 'password' ? 'Login' : 'Verify OTP'}
                </button>
              </div>
              {keyboardVisible && (
              <div className={styles.customKeyboard}>
                {/* First row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('1')}>1</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('2')}>2</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('3')}>3</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('-')}><img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726903509/minus_ohgd12.png" alt="space-img" /></button>

                {/* Second row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('4')}>4</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('5')}>5</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('6')}>6</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('?')}><img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726903513/space_ygxsze.png" alt="space-img" /></button>
                
                   

                {/* Third row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('7')}>7</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('8')}>8</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('9')}>9</button>
                <button className={styles.keyboardButton1} onClick={handleBackspace}>
                  <i className="fa fa-backspace"></i> {/* FontAwesome backspace icon */}
                </button>

                {/* Fourth row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick(',')}>,</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('0')}>0</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('.')}>.</button>
                <form className={styles.keyboardButton2} onSubmit={handleSubmit}>
                  <button  type="submit">
                    <i className="fa fa-arrow-right"></i> {/* FontAwesome submit icon */}
                  </button>
                </form>
                <button className={styles.chevronButton} onClick={toggleKeyboard}>
                  <i className="fa fa-chevron-down"></i>
                </button>
              </div>)}
              {loginMode === 'password' && (
                <div className={styles.formGroup}>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => {
                      setLoginMode('otp');
                      setHeading('OTP Login');
                      setOtp(Array(6).fill(""));
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
                  <p>Don't have an account? <Link href="/Userauthentication/SignUp/EmailVerification">
                <span className={styles.account}>Sign up</span>
              </Link></p>
                </div>
                
          
              )}
                {/* <div className={styles.signInLinkWrapper}>
                  <Link href="/Userauthentication/SignUp/EmailVerification" className={styles.signInLink}>
                    New User? Sign up
                  </Link>
                </div> */}
            </form>
          </div>
        ) : (
          <div>
            <p>Already logged in. Redirecting...</p>
            {/* Handle redirection if needed */}
          </div>
        )}
      </main>
    </div>
  );
}
