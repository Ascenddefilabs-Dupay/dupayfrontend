'use client';
import type { NextPage } from 'next';
import styles from './Failed.module.css';
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';

const Fail:NextPage = () => {
	const router = useRouter();
    const [walletId, setWalletId] = useState("");
    const [fetchedCurrency, setFetchedCurrency] = useState<string>(''); 
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const currency = params.get('currency') || '';
          if (currency) {
            setFetchedCurrency(currency);
          } else {
            console.error("Currency parameter not found in URL.");
          }
        }
      }, []);
      console.log("new currency is : ",fetchedCurrency);
        useEffect(() => {
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const walletIdValue = params.get('wallet_id') || "";
            setWalletId(walletIdValue);
      
          }
          
        }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(`/FiatManagement/FiatSwap?currency=${fetchedCurrency}&wallet_id=${walletId}`);
        }, 2000);

        // Clean up the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, [router,walletId,fetchedCurrency]);
  	return (
    		<div className={styles.fiatSwap5}>
      			<div className={styles.success}>Failed!
      			<img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727936811/8cb33ead-2bbe-4774-baca-3ba522e6f47a.png" />
      			{/* <img className={styles.checkIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935639/ebfcf71e-db0c-47ef-900f-be09099dc2af.png" /> */}
    		</div>
            </div>);
};

export default Fail;
