"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';
import styles from './ForgotPassword.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome for icons
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [retypeNewPassword, setRetypeNewPassword] = useState<string>('');
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false); 
  const [showRetypeNewPassword, setShowRetypeNewPassword] = useState<boolean>(false); 
  const router = useRouter();

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app//loginapi/generate-otp/', { user_email: email });
      if (response.status === 200) {
        setShowOtpField(true);
        alert('OTP sent to your email');
      }
    } catch (error) {
      alert('Error sending OTP');
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== retypeNewPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app//loginapi/reset-password/', {
        user_email: email,
        otp,
        new_password: newPassword,
      });
      if (response.status === 200) {
        alert('Password reset successfully');
        router.push('/Userauthentication/SignIn');
      } else {
        alert('Error resetting password');
      }
    } catch (error) {
      alert('Error resetting password');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="Forgot Password page" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          {/* Back Arrow Icon */}
          <Link href="/Userauthentication/SignIn">
            <i className={`fas fa-arrow-left ${styles.backArrow}`} />
          </Link>

          {!showOtpField ? (
            <>
              <h1 className={styles.title}>Forgot Password</h1>
              <form className={styles.form} onSubmit={handleEmailSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    Email
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <button type="submit" className={styles.button}>Send OTP</button>
              </form>
            </>
          ) : (
            <>
              <h1 className={styles.title}>Reset Password</h1>
              <form className={styles.form} onSubmit={handlePasswordSubmit}>
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
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">
                    New Password
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                        required
                        className={styles.passwordInput}
                      />
                      <i
                        className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      />
                    </div>
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="retypeNewPassword">
                    Retype New Password
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showRetypeNewPassword ? "text" : "password"}
                        id="retypeNewPassword"
                        value={retypeNewPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRetypeNewPassword(e.target.value)}
                        required
                        className={styles.passwordInput}
                      />
                      <i
                        className={`fas ${showRetypeNewPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
                        onClick={() => setShowRetypeNewPassword((prev) => !prev)}
                      />
                    </div>
                  </label>
                </div>
                <button type="submit" className={styles.button}>Reset Password</button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
