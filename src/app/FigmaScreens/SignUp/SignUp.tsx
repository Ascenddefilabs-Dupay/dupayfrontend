"use client";
import type { NextPage } from 'next';
import styles from './SignUp.module.css';
import { useRouter } from 'next/navigation';

const SignUp:NextPage = () => {
	const router = useRouter();
    const navigateToSignIn = () => {
        router.push('/FigmaScreens/Login');
    };
	const navigateToSendOtp = () => {
        router.push('/FigmaScreens/OTPScreen');
    };

  	return (
    		<div className={styles.signUp}>
      			<div className={styles.homeScreenBackground}>
        				<div className={styles.background} />
      			</div>
      			<img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804098/circle_d5udrl.png" />
      			<div className={styles.signUpChild} />
      			<div className={styles.frameParent}>
        				<div className={styles.dupayLogoParent}>
          					<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075056/Dupaylogo_yzcput.png" />
          					<b className={styles.dupay}>Dupay</b>
        				</div>
        				<div className={styles.frameGroup}>
          					<div className={styles.inputinputWrapper}>
            						<div className={styles.inputinput}>
              							<div className={styles.label}>Email address</div>
            						</div>
          					</div>
          					<div className={styles.btnbtn} onClick={navigateToSendOtp}>
            						<div className={styles.label}>Send OTP</div>
          					</div>
          					<div className={styles.content}>{`By proceeding, you agree to these `}
            						<span className={styles.termAndConditions}>Term and Conditions.</span>{` and `}
            						<span className={styles.termAndConditions}>Privacy Policy</span>
          					</div>
        				</div>
        				<div className={styles.frameWrapper}>
          					<div className={styles.titleParent}>
            						<div className={styles.title}>or continue with</div>
            						<div className={styles.googleButtonIosWrapper}>
              							<div className={styles.googleButtonIos}>
                								<img className={styles.icon24pxgoogle} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727338231/396cff48-052a-4060-a34c-9a7522287560.png" />
              							</div>
            						</div>
            						<div className={styles.title1}>
              							<span>Already have an account?</span>
                								<span className={styles.span}>{` `}</span>
                								<span className={styles.signIn} onClick={navigateToSignIn}>Sign in</span>
                								</div>
                								</div>
                								</div>
                								</div>
                								{/* <div className={styles.systembar}>
                  									<div className={styles.google}>Google</div>
                  									<div className={styles.systembarChild} />
                  									<div className={styles.systembarItem} />
                  									<img className={styles.systembarInner} alt="" src="Ellipse 2.svg" />
                  									<img className={styles.vectorIcon} alt="" src="Vector 1.svg" />
                  									<img className={styles.unionIcon} alt="" src="Union.svg" />
                								</div> */}
                								</div>);
              							};
              							
export default SignUp;
              							