import styles from './IphoneFingerPrint.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Welcome = () => {
  return (
    <div className={styles.container}>
        <header>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      </header>
      <div className={styles.imageLogo}>
        <div className={styles.graphics}>
          <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804054/dupay_rhft2i.png" alt="logo" />
        </div>
        <h1 className={styles.title}>Dupay</h1>
      </div>
      <div className={styles.titleParent}>
        <div className={styles.title1}>Welcome back</div>
        <div className={styles.title2}>Anuroop Nair</div>
    </div>
      <div className={styles.imageContainer}>
        <img src="/images/fingerprint.png" alt="Scanner" />
      </div>
      <div className={styles.titleParent1}>
        <div className={styles.title3}>Not you</div>
        <div className={styles.title4}>App Version 2.03</div>
    </div>
    <div className={styles.orContinueWith}>
        <p>Don't have an account? <Link href="/Userauthentication/SignUp/EmailVerification">
      <span className={styles.account}>Sign up</span>
    </Link></p>
    </div>
      {/* <p className={styles.notYou}>Not you</p>
      <p className={styles.appVersion}>App Version 2.03</p> */}
    </div>
  );
};

export default Welcome;
