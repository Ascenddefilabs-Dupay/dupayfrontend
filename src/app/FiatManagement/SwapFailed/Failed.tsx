import type { NextPage } from 'next';
import styles from './Failed.module.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Fail:NextPage = () => {
	const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/FiatManagement/FiatSwap');
        }, 2000);

        // Clean up the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, [router]);
  	return (
    		<div className={styles.fiatSwap5}>
      			<div className={styles.success}>Failed!
      			<img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727936811/8cb33ead-2bbe-4774-baca-3ba522e6f47a.png" />
      			{/* <img className={styles.checkIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935639/ebfcf71e-db0c-47ef-900f-be09099dc2af.png" /> */}
    		</div>
            </div>);
};

export default Fail;
