import type { NextPage } from 'next';
import styles from './SplashScreen.module.css';
import { useRouter } from 'next/navigation';

const Oboarding:NextPage = () => {
    const router = useRouter();
    
    const handleNavigation3 = () => {
        router.push('/OnBoarding/SplashScreen-3'); // Updated route
    };
    const handleNavigation2 = () => {
        router.push('/OnBoarding/SplashScreen-2'); // Updated route
    };
	const handleSkipClick = () => {
        router.push('/Userauthentication/SignUp/EmailVerification');
    };
  	return (
    		<div className={styles.oboarding4}>
      			{/* <div className={styles.homeScreenBackground}>
        				<div className={styles.background} />
      			</div> */}
				
      			<div className={styles.carouselIndicator}>
        				
        				<img className={styles.imagecarouselIndicatorcompoIcon1}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
        				<img className={styles.imagecarouselIndicatorcompoIcon2} onClick={handleNavigation2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
                        <img className={styles.imagecarouselIndicatorcompoIcon} onClick={handleNavigation3} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
      			</div>
      			<button className={styles.skip} onClick={handleSkipClick}>Skip</button>
      			<div className={styles.titleParent}>
        				<div className={styles.title}>
          					<span>The</span>
          					<span className={styles.future}>{` Future `}</span>
          					<span className={styles.of}>{`of `}</span>
          					<span className={styles.future}>Money</span>
          					<span> is Here.</span>
        				</div>
        				<div className={styles.title1}>Step into the next generation of finance with Dupay.</div>
      			</div>
				<button className={styles.getStartedButton} onClick={handleNavigation2}>Discover more</button>
      			<img className={styles.techbgIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804632/image-1_a0ff1x.png" />
			
    		</div>);
};

export default Oboarding;