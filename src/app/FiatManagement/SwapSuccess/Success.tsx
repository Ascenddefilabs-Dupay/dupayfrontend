import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { NextPage } from 'next';
import styles from './Success.module.css';

const FiatSwap: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/Userauthorization/Dashboard/Home');
        }, 2000);

        // Clean up the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className={styles.fiatSwap5}>
            <div className={styles.success}>
                Success!
                <img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935592/86d91837-f818-483b-9da1-7e3030270e2a.png" />
                <img className={styles.checkIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935639/ebfcf71e-db0c-47ef-900f-be09099dc2af.png" />
            </div>
        </div>
    );
};

export default FiatSwap;
