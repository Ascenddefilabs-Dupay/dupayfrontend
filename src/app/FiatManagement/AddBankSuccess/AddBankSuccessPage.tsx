'use client';
import React, { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NextPage } from 'next';
import styles from './AddBankSuccessPage.module.css';



const Success:NextPage = () => {
  const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/FiatManagement/AddBanks');
        }, 2000);

        // Clean up the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, [router]);
  	return (
    		<div className={styles.success}>
      			<div className={styles.success1}>Success!</div>
      			<div className={styles.yourWalletIs}>Your wallet is ready</div>
        				<div className={styles.joinAndClaim}>Join and claim your free username.</div>
      			<img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935592/86d91837-f818-483b-9da1-7e3030270e2a.png" />
      			<img className={styles.checkIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935639/ebfcf71e-db0c-47ef-900f-be09099dc2af.png" />
      			</div>);
      			};
      			
      			export default Success;
      			