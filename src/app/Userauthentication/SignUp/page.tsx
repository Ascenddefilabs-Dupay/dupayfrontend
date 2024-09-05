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
      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1 className={styles.heading}>Welcome to Dupay</h1>
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

        <div className={styles.getStarted}>
          <button className={styles.getStartedButton} onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </main>
    </>
  );
};

export default Page;
