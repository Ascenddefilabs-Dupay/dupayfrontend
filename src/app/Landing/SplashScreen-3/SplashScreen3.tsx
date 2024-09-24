import styles from './SplashScreen3.module.css';
import { useRouter } from 'next/navigation';

export default function SplashScreen3() {
    const router = useRouter();
    const handleNavigation2 = () => {
        router.push('/Landing/SplashScreen-2'); // Updated route
    };
    
    const handleNavigation1 = () => {
        router.push('/Landing/SplashScreen-1'); // Updated route
    };
    const navigateToSignIn = () => {
      router.push('/Userauthentication/SignIn'); // Updated route
  };

  return (
    <div className={styles.container}>
      <div className={styles.carouselIndicator}>
          <img className={styles.imagecarouselIndicatorcompoIcon}  onClick={handleNavigation1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
          <img className={styles.imagecarouselIndicatorcompoIcon1} onClick={handleNavigation2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
          
          <img className={styles.imagecarouselIndicatorcompoIcon2}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6" />
      </div>
      <div className={styles.textContent}>
        <h1 className={styles.title}>
          <span className={styles.highlight}> Buy, Sell &amp;</span>
             <br /> <span className={styles.highlighted}>Manage</span> with <br />
             <span className={styles.highlights}>Confidence </span>
        </h1>
        <p className={styles.subText}>Industry-leading security and <br/>
          ease of use.</p>
      </div>
      <button className={styles.getStartedButton} onClick={navigateToSignIn}>Get started</button>
    </div>
  );
}
