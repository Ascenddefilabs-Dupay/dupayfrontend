'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthNavbar from './AuthNavbar';
import styles from './page1.module.css';

const Page: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>('Individual');
  const router = useRouter();

  useEffect(() => {
    // Pre-select the 'Individual' account on initial render
    setSelectedAccount('Individual');
  }, []);

  const handleSelectAccount = (accountType: string) => {
    setSelectedAccount(accountType);
  };

  const handleGetStarted = () => {
    if (!selectedAccount) {
      alert('Please select an account type before proceeding.');
      return;
    }
    router.push('/Userauthentication/SignUp/SecondaryNavbar');
  };

  return (
    <>
      <AuthNavbar />
<<<<<<< HEAD:src/app/Userauthentication/SignUp/page.tsx
      <main className="pt-20 md:pt-24 p-4 md:p-11">
        {/* Adjust padding to account for navbar height */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Welcome to Dupay</h1>
=======
      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1 className={styles.heading}>Welcome to Dupay</h1>
>>>>>>> 738fe1825f90a3ff57c13bdc244b2b82867e5673:src/app/Userauthentication/SignUp/page.jsx
        </div>

        <div className={styles.accountType}>
          <h2 className={styles.subheading}>Choose your Account Type</h2>
        </div>

        <div className={styles.accountOptions}>
          <div className={styles.accountColumn}>
            <div
              className={`${styles.accountCard} ${selectedAccount === 'Individual' ? styles.activeCard : ''}`}
              onClick={() => handleSelectAccount('Individual')}
            >
              <h3 className={styles.cardTitle}>Individual</h3>
              <p className={styles.cardcontent}>For individuals who want to trade, send and receive crypto, get price alerts, and more.</p>
            </div>

            <div
              className={`${styles.accountCard} ${selectedAccount === 'Vendor' ? styles.activeCard : ''}`}
              onClick={() => handleSelectAccount('Vendor')}
            >
              <h3 className={styles.cardTitle}>Vendor</h3>
              <p className={styles.cardcontent}>We offer businesses and high-net-worth individuals secure solutions for accepting, managing, and trading cryptocurrencies.</p>
            </div>
          </div>

          <aside className={styles.accountDetails}>
            {selectedAccount === 'Individual' && (
              <div>
                <h3 className={styles.detailTitle}>An individual account is the best way to manage your personal crypto portfolio</h3>
                <h5 className={styles.detailSubtitle}>Access to hundreds of cryptocurrencies</h5>
                <p className={styles.detailText}>Buy, sell, and track your crypto all in one place</p>

                <h5 className={styles.detailSubtitle}>Safe & secure</h5>
                <p className={styles.detailText}>Industry best practices are used to keep your crypto safe</p>

                <h5 className={styles.detailSubtitle}>Anytime, anywhere</h5>
                <p className={styles.detailText}>Stay on top of the markets with the Dupay app for Android or iOS</p>
              </div>
            )}

            {selectedAccount === 'Vendor' && (
              <div>
                <h4 className={styles.detailTitle}>Our business account provides companies, institutions, and high-net-worth clients with access to top-tier investment tools.</h4>
                <h5 className={styles.detailSubtitle}>Set up your organization</h5>
                <p className={styles.detailText}>Create a single account to manage all of your business entities</p>

                <h5 className={styles.detailSubtitle}>Invite and manage your team</h5>
                <p className={styles.detailText}>Provide your whole team with permissioned access to your organization’s account</p>

                <h5 className={styles.detailSubtitle}>Safe & secure</h5>
                <p className={styles.detailText}>Offline cold storage provides maximum security.</p>
              </div>
            )}
          </aside>
        </div>

<<<<<<< HEAD:src/app/Userauthentication/SignUp/page.tsx
        <div className="mt-8">
          <button
            className="bg-gradient-to-r from-[#7f2ee3] to-[#4246f7] text-white rounded-lg py-2 px-4 md:py-2 md:px-6 hover:bg-blue-700 transition-colors duration-300 w-full md:w-auto"
            onClick={handleGetStarted}
          >
=======
        <div className={styles.getStarted}>
          <button className={styles.getStartedButton} onClick={handleGetStarted}>
>>>>>>> 738fe1825f90a3ff57c13bdc244b2b82867e5673:src/app/Userauthentication/SignUp/page.jsx
            Get Started
          </button>
          
        </div>
        <br></br>
        <br></br>
      </main>
    </>
  );
};

export default Page;
