"use client";
import type { NextPage } from 'next';
import styles from './Onboarding3.module.css';
import { useRouter } from 'next/navigation';

const Oboarding3:NextPage = () => {

	const router = useRouter();
    const handleNavigation2 = () => {
        router.push('/FigmaScreens/Onboarding2'); // Updated route
    };
    
    const handleNavigation1 = () => {
        router.push('/FigmaScreens/Onboarding1'); // Updated route
    };
    const navigateToSignUp = () => {
      router.push('/FigmaScreens/SignUp'); // Updated route
  };
  	return (
    		<div className={styles.oboarding6}>
      			<div className={styles.homeScreenBackground}>
        				<div className={styles.background} />
      			</div>
      			<img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804098/circle_d5udrl.png" />
      			<div className={styles.carouselIndicator}>
        				<img className={styles.imagecarouselIndicatorcompoIcon} onClick={handleNavigation1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
        				<img className={styles.imagecarouselIndicatorcompoIcon1} onClick={handleNavigation2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
        				<img className={styles.imagecarouselIndicatorcompoIcon2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
      			</div>
      			<div className={styles.titleParent}>
        				<div className={styles.title}>
          					<span className={styles.buySell}>Buy, Sell</span>{`, `}
          					<span>{`&`}</span>{` `}
          					<span className={styles.buySell}>Manage</span>{` `}
          					<span className={styles.with}>{`with `}</span>
          					<span className={styles.buySell}>Confidence</span>
        				</div>
        				<div className={styles.titleWrapper}>
          					<div className={styles.title1}>Industry-leading security and ease of use.</div>
        				</div>
      			</div>
      			<div className={styles.btnmbBtnFab}>
        				<div className={styles.btnbtn} onClick={navigateToSignUp}>
          					<div className={styles.text}>Get started</div>
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

export default Oboarding3;
