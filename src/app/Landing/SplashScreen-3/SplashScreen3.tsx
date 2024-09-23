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
      <header>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      </header>
      <div className={styles.header}>
        <div className={styles.dots}>
            <span className={styles.dot} onClick={handleNavigation1}></span>
            <span className={styles.dot} onClick={handleNavigation2}></span>
            <span className={`${styles.dot} ${styles.active}`}></span>
        </div>
        <div className={styles.skipButton}>Skip</div>
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
