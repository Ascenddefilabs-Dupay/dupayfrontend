"use client";
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import Head from "next/head";
import axios from "axios";
import styles from "./login.module.css";
import Navbar from "../LandingPage/Navbar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UseSession from "./hooks/UseSession";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [heading, setHeading] = useState<string>("Login");
  const { isLoggedIn, userData, clearSession } = UseSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize Google sign-in
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
      const res = await axios.post(
        "https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/google-login/",
        {
          token: response.credential,
        }
      );

      if (res.status === 200) {
        const {
          user_id,
          user_first_name,
          user_email,
          user_phone_number,
          session_id,
          registration_status,
        } = res.data;

        const isRegistered = registration_status === "true" || registration_status === true;

        LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id, isRegistered);
        await fetchFiatWalletId(user_id);

        if (isRegistered) {
          router.push("/Userauthorization/Dashboard");
        } else {
          router.push("/KycVerification/PersonalDetails");
        }
      } else {
        alert("Google login failed.");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Error during Google login.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loginMode === "password") {
      try {
        const response = await axios.post(
          "https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/login/",
          {
            user_email: email,
            user_password: password,
          }
        );

        if (response.status === 200) {
          await sendOtp();
          setOtpTimer(30);
          alert("OTP sent to your email.");
          setLoginMode("otp");
          setHeading("Two-Factor Authentication");
        } else {
          alert("Invalid email or password.");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Login error:", error.response);
          alert("An error occurred during login. Please try again.");
        } else {
          console.error("Unexpected error:", error);
          alert("An unexpected error occurred.");
        }
      }
    } else if (loginMode === "otp") {
      try {
        const response = await axios.post(
          "https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/verify-otp/",
          {
            user_email: email,
            user_otp: otp.join(""),
          }
        );

        if (response.status === 200) {
          const {
            user_id,
            user_first_name,
            user_email,
            user_phone_number,
            session_id,
            registration_status,
          } = response.data;

          LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id, registration_status);
          await fetchFiatWalletId(user_id);
          alert("Logged in successfully");

          if (registration_status) {
            router.push("/Userauthorization/Dashboard");
          } else {
            router.push("/KycVerification/PersonalDetails");
          }
        } else {
          alert("Invalid OTP.");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error;
          if (errorMessage) {
            alert(errorMessage);
          } else {
            alert("Invalid OTP. Please try again.");
          }
        } else {
          console.error("Unexpected error:", error);
          alert("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post("https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/generate-otp/", {
        user_email: email,
      });
      setOtpTimer(30);
      alert("OTP resent to your email.");
    } catch (error) {
      alert("Error resending OTP.");
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
      alert("Error fetching wallet information.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < otp.length - 1 && value !== "") {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const toggleKeyboard = () => {
    setKeyboardVisible(false);
  };

  const handleKeyboardClick = (num: string) => {
    for (let i = 0; i < otp.length; i++) {
      if (otp[i] === "") {
        handleOtpChange(i, num);
        break;
      }
    }
  };

  const handleBackspace = () => {
    for (let i = otp.length - 1; i >= 0; i--) {
      if (otp[i] !== "") {
        const newOtp = [...otp];
        newOtp[i] = "";
        setOtp(newOtp);

        inputRefs.current[i]?.focus();
        break;
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      handleBackspace();
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{heading}</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.loginForm}>
          <h1>{heading}</h1>
          <form onSubmit={handleSubmit}>
            {loginMode === "password" && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i
                    className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </>
            )}

            {loginMode === "otp" && (
              <>
                <div className={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </div>
                {otpTimer > 0 ? (
                  <p>Resend OTP in {otpTimer} seconds</p>
                ) : (
                  <button type="button" onClick={sendOtp}>
                    Resend OTP
                  </button>
                )}
              </>
            )}

            <button type="submit" className={styles.submitBtn}>
              {loginMode === "password" ? "Login" : "Verify OTP"}
            </button>
          </form>

          <div id="google-signin-button"></div>
          <p>
            Don't have an account? <Link href="/Register">Register here</Link>.
          </p>
        </div>
      </main>

      {keyboardVisible && (
        <div className={styles.keyboard}>
          <div className={styles.keyboardRow}>
            {Array.from({ length: 10 }, (_, i) => (
              <button key={i} onClick={() => handleKeyboardClick(i.toString())}>
                {i}
              </button>
            ))}
          </div>
          <button onClick={toggleKeyboard}>Close Keyboard</button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
