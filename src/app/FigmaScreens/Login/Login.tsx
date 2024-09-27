"use client";
import type { NextPage } from 'next';
import styles from './Login.module.css';
import { useRouter } from 'next/navigation';

const Login:NextPage = () => {
    const router = useRouter();
    const navigateToSignup = () => {
        router.push('/FigmaScreens/SignUp');
    };

	const navigateToPersonalDetails = () => {
        router.push('/FigmaScreens/PersonalDetails');
    };

  	return (
    		<div className={styles.login}>
      			<div className={styles.homeScreenBackground}>
        				<div className={styles.background} />
      			</div>
      			<img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804098/circle_d5udrl.png" />
      			<div className={styles.loginChild} />
      			<div className={styles.frameParent}>
        				<div className={styles.dupayLogoParent}>
          					<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804054/dupay_rhft2i.png" />
          					<b className={styles.dupay}>Dupay</b>
        				</div>
        				<div className={styles.frameGroup}>
          					<div className={styles.frameContainer}>
            						<div className={styles.inputinputParent}>
              							<div className={styles.inputinput}>
                								<div className={styles.label}>Email address</div>
              							</div>
              							<div className={styles.inputinput1}>
                								<div className={styles.helperText}>Forgot password?</div>
                  									<div className={styles.placeholder}>
                    										<div className={styles.label1}>Password</div>
                    										<img className={styles.iconeyeVisble} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727181528/eda6a2f8-9efb-497e-9713-1b1b783459a7.png" />
                  									</div>
                  									</div>
                  									</div>
                  									<div className={styles.btnbtn} onClick={navigateToPersonalDetails}>
                    										<div className={styles.label}>Log in</div>
                  									</div>
                  									</div>
                  									<div className={styles.titleParent}>
                    										<div className={styles.title}>or continue with</div>
                    										<div className={styles.googleButtonIosWrapper}>
                      											<div className={styles.googleButtonIos}>
                        												<img className={styles.icon24pxgoogle} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727338294/280c7cab-e415-466c-8a44-0a79604fd889.png" />
                      											</div>
                    										</div>
                    										<div className={styles.title1}>
                      											<span>Don’t have an account?</span>
                        												<span className={styles.span}>{` `}</span>
                        												<span className={styles.signUp} onClick={navigateToSignup}>Sign up</span>
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
                      											
                      											export default Login;
                      											