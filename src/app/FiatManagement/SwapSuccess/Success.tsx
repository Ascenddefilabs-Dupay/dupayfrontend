import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { NextPage } from 'next';
import styles from './Success.module.css';

const FiatSwap: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            // router.push('/Userauthorization/Dashboard/Home');
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
            <div className={styles.listmbList}>
                <div className={styles.listmbListItemitemLeft}>
                    <div className={styles.iconiconWrapper}>
                        <img className={styles.iconcheck} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728883166/25822ffa-db56-486c-9acb-37bf12223cdc.png" />
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.listmbListItemBasic}>
                        <div className={styles.listmbListItemitemLeft1}>
                            <div className={styles.title}>Swap #0 Complete!</div>
                        </div>
                    </div>
                    <div className={styles.listmbListItemBasic1}>
                        <div className={styles.listmbListItemitemLeft1}>
                            <div className={styles.caption}>Tap to view this transaction</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiatSwap;
