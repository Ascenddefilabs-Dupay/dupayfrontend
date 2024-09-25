import styles from './IphoneFingerPrint.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Welcome = () => {
  return (
    <div className={styles.loginSecondTime}>
<div className={styles.homeScreenBackground}>
<div className={styles.background} />
</div>
<img className={styles.groupIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726833959/image_o6akso.png" />
<div className={styles.frameParent}>
<div className={styles.frameGroup}>
<div className={styles.dupayLogoParent}>
<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804054/dupay_rhft2i.png" />
<b className={styles.dupay}>Dupay</b>
</div>
<div className={styles.titleParent}>
<div className={styles.title}>Welcome back</div>
<div className={styles.title1}>Anuroop Nair</div>
</div>
</div>
<div className={styles.frameContainer}>
<div className={styles.layer1Wrapper}>
<img className={styles.layer1Icon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727103280/a47ae1be-06a2-4e4b-a88b-b4b818c7695b.png" />
</div>
<div className={styles.title2}>Not you</div>
<div className={styles.title3}>App Version 2.03</div>
</div>
</div>
<div className={styles.title4}>
<span>Already have an account?</span>
<span className={styles.span}>{` `}</span>
<span className={styles.signIn}>Sign in</span>
</div>

</div>
  );
};

export default Welcome;
