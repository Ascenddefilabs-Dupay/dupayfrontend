'use client';
import React, { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NextPage } from 'next';
import styles from './Success.module.css';

const CryptoSwap: NextPage = () => {
    const router = useRouter();
    const [sourceCurrency, setSourceCurrency] = useState<string>(''); 
    const [destinationCurrency, setDestinationCurrency] = useState<string>(''); 
    const [amount, setAmount] = useState<string>(''); 

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/Userauthorization/Dashboard/Home');
        }, 2000);

        // Clean up the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, [router]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const currency = params.get('currency') || '';
          const destination_currency=params.get('destination_currency') || '';
          const amount=params.get('amount');
          console.log("amount",amount);
          console.log("destination currency: ",destination_currency);
          console.log('fetched currency: ',currency);
          if (currency) {
            setSourceCurrency(currency);
          } else {
            console.error("Currency parameter not found in URL.");
          }
          if (destination_currency) {
            setDestinationCurrency(destination_currency);
          } else {
            console.error("Destination Currency parameter not found in URL.");
          }
          if (amount) {
            setAmount(amount);
          } else {
            console.error("Amount  not found in URL.");
          }
        }
      }, []);
    return (
        <div className={styles.fiatSwap5}>
            <div className={styles.success}>
                Success!
                <img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935592/86d91837-f818-483b-9da1-7e3030270e2a.png" />
                <img className={styles.checkIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935639/ebfcf71e-db0c-47ef-900f-be09099dc2af.png" />
            </div>
            <div className={styles.listmbList}>
                <div className={styles.listmbListItemitemLeft}>
                    <div className={styles.iconiconWrapper}>
                        <img className={styles.iconcheck} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728883166/25822ffa-db56-486c-9acb-37bf12223cdc.png" />
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.listmbListItemBasic}>
                        <div className={styles.listmbListItemitemLeft1}>
                            <div className={styles.title}>{amount} {sourceCurrency} Swapped to {destinationCurrency} </div>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    );
};

export default CryptoSwap;
