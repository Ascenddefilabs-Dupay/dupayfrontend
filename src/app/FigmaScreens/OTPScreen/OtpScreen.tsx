"use client";
import type { NextPage } from 'next';
import styles from './OtpScreen.module.css';
import { useRouter } from 'next/navigation';

const OTP:NextPage = () => {
    const router = useRouter();
    const navigateToSignIn = () => {
        router.push('/FigmaScreens/Login');
    };
  	return (
    		<div className={styles.otp}>
      			<div className={styles.homeScreenBackground}>
        				<div className={styles.background} />
      			</div>
      			<div className={styles.otpChild} />
      			<div className={styles.frameParent}>
        				<div className={styles.dupayLogoParent}>
          					<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075056/Dupaylogo_yzcput.png" />
          					<b className={styles.dupay}>Dupay</b>
        				</div>
        				<div className={styles.frameGroup}>
          					<div className={styles.component2Parent}>
            						<div className={styles.component2} />
            						<div className={styles.component2} />
            						<div className={styles.component2} />
            						<div className={styles.component2} />
            						<div className={styles.component2} />
            						<div className={styles.component2} />
          					</div>
          					<div className={styles.lineParent}>
            						<div className={styles.frameChild} />
            						<div className={styles.frameChild} />
            						<div className={styles.frameChild} />
            						<div className={styles.frameChild} />
            						<div className={styles.frameChild} />
            						<div className={styles.frameChild} />
          					</div>
        				</div>
        				<div className={styles.title}>
          					<span>Didn’t receive the code?</span>
            						<span className={styles.span}>{` `}</span>
            						<span className={styles.requestHere}>Request here</span>
                        </div>
                        </div>
            						
            						<div className={styles.btnbtn} onClick={navigateToSignIn}>
              							<div className={styles.text}>Next</div>
            						</div>
            						</div>);
          					};
          					
          					export default OTP;
          					