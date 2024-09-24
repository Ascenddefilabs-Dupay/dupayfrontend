"use client";
import { useState, useEffect, FormEvent , useRef} from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Navbar from '../../LandingPage/Navbar';


import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link';
import styles from './signup.module.css'; // Adjust the path according to your project structure
import { margin, style } from '@mui/system';


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
  // const [otp, setOtp] = useState<string>('');
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
  // const [showKeyboard, setShowKeyboard] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [keyboardAlphaVisible, setkeyboardAlphaVisible] = useState<boolean>(false);
  const [bottomVisible, setBottomVisible] = useState<boolean>(true);
  const [isShift, setIsShift] = useState(false);
  const [isNumeric, setIsNumeric] = useState(false);
  const [mainKeyboard , setMainKeyboard]= useState(false);
  const [style, setStyle] = useState({ marginTop: '35%' });
  
  const handleFocus = () => {

    if(isNumeric){
      setStyle((prevStyle) => ({
        ...prevStyle,
        marginTop: '35%', 
      }));
    }
    else
    {
      setStyle((prevStyle) => ({
        ...prevStyle,
        marginTop: '20%', 
      }));
    }
  };
 
  
  const handleKeyPress = (key: string) => {
    setEmail((prevEmail) => prevEmail + key); // Append the key to the current email value
  };

  // Function to handle shift key press
  
  // Function to handle backspace
  const handleDelete = () => {
    setEmail((prevEmail) => prevEmail.slice(0, -1));
  };

  const handleEnter = () => {
    setEmail((prev) => prev + '\n');
  };

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
    const combinedOtp = otp.join('');
    console.log('OTP Submitted:', otp.join(''));
    if (otpExpired) {
      alert('Invalid or expired OTP. Please request a new OTP.');
    } else if (combinedOtp === otpFromBackend) {
      setVerificationSuccessful(true);
      setOtpSent(false);
      setOtp(Array(6).fill(""));
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
    setIsNumeric(false);
    setMainKeyboard(false);
    setkeyboardAlphaVisible(false);
    setBottomVisible(true);
    setStyle((prevStyle) => ({
      ...prevStyle,
      marginTop: '35%', 
    }));
  };

  const toggleKeyboards = () => {
    // setkeyboardAlphaVisible(false);
    setIsNumeric(true);
    // setBottomVisible(false);
    // setMainKeyboard(false);
    setStyle((prevStyle) => ({
      ...prevStyle,
      marginTop: '35%', 
    }));
  };
  const toggleAlphaNumericKeyboards = () => {
    // setkeyboardAlphaVisible(true);
    setIsNumeric(false);
    
    setStyle((prevStyle) => ({
      ...prevStyle,
      marginTop: '20%', 
    }));
       
    // setBottomVisible(false);
    // setMainKeyboard(false);
  };


const handleKeyboardClick = (num: string) => {
    // Handle OTP input
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
  const handleSpace = () => {
    console.log("hello")
    setEmail((prevEmail) => prevEmail + ' ');
};
  

  return (
    
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className={styles.container}>
      <Head>
        <title>Signup</title>
        <meta name="description" content="Signup page" />
      </Head>
      <Navbar />
      <header>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      </header>

        <div className={styles.formWrapper}>
        <div className={styles.card} style={style}>
        <div className={styles.imageLogo}>
              <div className={styles.graphics}>
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804054/dupay_rhft2i.png" alt="logo" />
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
                      handleFocus();
                      setMainKeyboard(true);
                      setBottomVisible(false);
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
                
                
                {!isNumeric &&
                mainKeyboard && (
                  <div className={styles.keyboardDefault}>
                  <div className={styles.toolbar}>
                  <div className={styles.back}>
                  <div className={styles.iconArrowLeft} >
                  <img className={styles.vectorIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067208/1826c340-1853-453d-9ad0-6cafb099b947.png" />
                  </div>
                  </div>
                  <div className={styles.iconSticker}>
                  <img className={styles.unionIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067251/1cc81d3a-0003-441b-85b1-eaf619058c2c.png" />
                  </div>
                  <div className={styles.iconSticker}>
                  <img className={styles.groupIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067288/8bed908b-816a-4e98-8925-7739c99b1c62.png" />
                  </div>
                  <div className={styles.iconSticker}>
                  <img className={styles.unionIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067323/46e9c034-1c6e-4f78-a167-395473ec2e8f.png" />
                  </div>
                  <div className={styles.iconSticker}>
                  <img className={styles.vectorIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067364/1ef39f67-4084-4d83-b97c-92167e6708a4.png" />
                  </div>
                  <div className={styles.divider} />
                  
                  <div className={styles.iconSticker}>
                  <img className={styles.vectorIcon3} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067428/0ea27218-2a82-4b99-a4f2-391939a2198d.png" />
                  </div>
                  <div className={styles.iconSticker}>
                  <img className={styles.vectorIcon2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067530/9a37047b-a061-4737-a0f0-611fa0c0b460.png" />
                  </div>
                  </div>
                  <div className={styles.qwer} >
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>1</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress('q')}>
                  <div className={styles.a}>q</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary} >
                  <div className={styles.number}>
                  <div className={styles.div}>2</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("w")}>
                  <div className={styles.a}>w</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>3</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("e")}>
                  <div className={styles.a}>e</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>4</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("r")}>
                  <div className={styles.a}>r</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>5</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("t")}>
                  <div className={styles.a}>t</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>6</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("y")}>
                  <div className={styles.a}>y</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>7</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("u")}>
                  <div className={styles.a}>u</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>8</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("i")}>
                  <div className={styles.a}>i</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>9</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("o")}>
                  <div className={styles.a}>o</div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary}>
                  <div className={styles.number}>
                  <div className={styles.div}>0</div>
                  </div>
                  <div className={styles.letter} onClick={() => handleKeyPress("p")}>
                  <div className={styles.a}>p</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.asdf}>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("a")}>
                  <div className={styles.a10}>a</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("s")}>
                  <div className={styles.a10}>s</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("d")}>
                  <div className={styles.a10}>d</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("f")}>
                  <div className={styles.a10}>f</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("g")}>
                  <div className={styles.a10}>g</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("h")}>
                  <div className={styles.a10}>h</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("j")}>
                  <div className={styles.a10}>j</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("k")}>
                  <div className={styles.a10}>k</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("l")}>
                  <div className={styles.a10}>l</div>
                  </div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.asdf}>
                  <div className={styles.keyFunction}>
                  <div className={styles.iconShiftOff}>
                  <img className={styles.arrowIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067590/79c3c29a-53a7-4df0-8741-1f85af2e8164.png" />
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("z")}>
                  <div className={styles.a10}>z</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("x")}>
                  <div className={styles.a10}>x</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("c")}>
                  <div className={styles.a10}>c</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("v")}>
                  <div className={styles.a10}>v</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("b")}>
                  <div className={styles.a10}>b</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("n")}>
                  <div className={styles.a10}>n</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary10}>
                  <div className={styles.key}>
                  <div className={styles.letter10} onClick={() => handleKeyPress("m")}>
                  <div className={styles.a10}>m</div>
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyFunction} onClick={handleDelete}>
                  <div className={styles.iconSticker}>
                  <img className={styles.deleteIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067636/6a140b73-fefd-445b-8fdf-fc4d21d6898b.png" />
                  </div>
                  </div>
                  </div>
                  <div className={styles.functions} >
                  <div className={styles.keySpecialFunction}>
                  <div className={styles.div} onClick={toggleKeyboards}>?123</div>
                  </div>
                  <div className={styles.keyFunction2} onClick={() => handleKeyPress(",")}>
                  <div className={styles.a}>,</div>
                  </div>
                  <div className={styles.keyPrimary26}>
                  <div className={styles.key}>
                  <div className={styles.iconSticker}>
                  <img className={styles.smileyIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067679/a0d18135-ae9d-4391-9d72-c387e9556d70.png" />
                  </div>
                  </div>
                  </div>
                  <div className={styles.keyPrimary27} onClick={handleSpace}>
                  <div className={styles.key17} />
                  </div>
                  <div className={styles.keyFunction2} onClick={() => handleKeyPress(".")}>
                  <div className={styles.a}>.</div>
                  </div>
                  <div className={styles.keySpecialFunction1} onClick={handleEnter}>
                  <div className={styles.iconSticker} >
                  <img className={styles.arrowIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067751/84f6495a-204d-47bb-abba-6fc1082fd5b7.png" />
                  </div>
                  </div>
                  </div>
                  <div className={styles.navigation}>
                  <div className={styles.dismissKeyboard}>
                  <div className={styles.iconArrowDown} onClick={toggleKeyboard}>
                  <img className={styles.vectorIcon4} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067823/d9b65ddc-9b07-4222-9237-1c0e9fd3e612.png" />
                  </div>
                  </div>
                  <div className={styles.navigationBar}>
                  {/* <div className={styles.homeIndicator} /> */}
                  </div>
                  </div>
                  </div>
                )}
              
                
              {isNumeric && 
              mainKeyboard&&(

                <div className={styles.customKeyboard}>
                {/* First row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('1')}>1</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('2')}>2</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('3')}>3</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('@')}>@</button>

                {/* Second row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('4')}>4</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('5')}>5</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('6')}>6</button>
                <button className={styles.keyboardButton} onClick={toggleAlphaNumericKeyboards}>abc</button>
                
                   

                {/* Third row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('7')}>7</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('8')}>8</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('9')}>9</button>
                <button className={styles.keyboardButton1} onClick={handleBackspace}>
                  <i className="fa fa-backspace"></i> 
                </button>

                {/* Fourth row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyPress(',')}>,</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('0')}>0</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyPress('.')}>.</button>
                <button className={styles.keyboardButton2} onClick={handleSubmit}>
                  <i className="fa fa-arrow-right"></i> 
                </button>
                <button className={styles.chevronButton} onClick={toggleKeyboard}>
                  <i className="fa fa-chevron-down"></i>
                </button>
                

              </div>
              
 )}
              {bottomVisible && (
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
                    <span className={styles.account}>Sign In</span>
                  </Link></p>
              </div>
              </div>
              )}
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
                  <i className="fa fa-backspace"></i> 
                </button>

                {/* Fourth row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick(',')}>,</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('0')}>0</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('.')}>.</button>
                <button className={styles.keyboardButton2} onClick={handleSubmit}>
                  <i className="fa fa-arrow-right"></i> 
                </button>
                <button className={styles.chevronButton} onClick={toggleKeyboard}>
                  <i className="fa fa-chevron-down"></i>
                </button>
              </div>
            )}
                
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
                  <i className="fa fa-backspace"></i> 
                </button>

                {/* Fourth row */}
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick(',')}>,</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('0')}>0</button>
                <button className={styles.keyboardButton} onClick={() => handleKeyboardClick('.')}>.</button>
                <button className={styles.keyboardButton2} onClick={handleSubmit}>
                  <i className="fa fa-arrow-right"></i> 
                </button>
                <button className={styles.chevronButton} onClick={toggleKeyboard}>
                  <i className="fa fa-chevron-down"></i>
                </button>
              </div>
            )}
          
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
      </div>
    </GoogleOAuthProvider>
  );
}


// </div>
//                 {isNumeric && (
//         <div className={styles.customKeyboard}>
//           {/* First row */}
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('1')}>1</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('2')}>2</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('3')}>3</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('-')}><img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726903509/minus_ohgd12.png" alt="minus-img" /></button>

//           {/* Second row */}
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('4')}>4</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('5')}>5</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('6')}>6</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('?')}><img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726903513/space_ygxsze.png" alt="space-img" /></button>

//           {/* Third row */}
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('7')}>7</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('8')}>8</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('9')}>9</button>
//           <button className={styles.keyboardButton1} onClick={handleBackspace}><i className="fa fa-backspace"></i></button>

//           {/* Fourth row */}
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress(',')}>,</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('0')}>0</button>
//           <button className={styles.keyboardButton} onClick={() => handleKeyPress('.')}>.</button>
//           <button className={styles.keyboardButton2} onClick={handleSubmit}><i className="fa fa-arrow-right"></i></button>
//           <button className={styles.chevronButton} onClick={toggleKeyboard}><i className="fa fa-chevron-down"></i></button>
//         </div>
//       )}

//       {/* Default Keyboard */}
//       {!isNumeric && (
//         <div className={styles.keyboardDefault}>
//           {/* First row */}
//           <div className={styles.keyPrimary}>
//             <div className={styles.letter} onClick={() => handleKeyPress('q')}>q</div>
//           </div>
//           <div className={styles.keyPrimary}>
//             <div className={styles.letter} onClick={() => handleKeyPress('w')}>w</div>
//           </div>

//           {/* Add more letters as needed */}

//           {/* Toggle button */}
//           <button className={styles.toggleButton} onClick={toggleKeyboard}>123?</button>
//         </div>
//       )}