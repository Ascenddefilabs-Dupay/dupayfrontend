"use client";
import type { NextPage } from 'next';
import styles from './WebPage2.module.css';
import { useRouter } from 'next/navigation';




const Webpage2:NextPage = () => {

	const router=useRouter();
	const navigateToWebpage3 = () =>{
	
		router.push('/WebPages3');
	}
	const navigateToSignin = () =>{
	
		router.push('/Userauthentication/SignIn');
	}
  	return (
    		<div className={styles.webpageSingle}>
      			{/* <img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727325960/0beadfc1-104a-4d39-90dc-d34518823d07.png" /> */}
      			<div className={styles.webpageSingleChild} />
      			{/* <div className={styles.webpageSingleItem} /> */}
      			<div className={styles.homeAboutContactParent}>
				  <button className={styles.homeAboutContact}><button className={styles.buttons} > HOME</button>               <button className={styles.buttons1} > ABOUT</button>               <button className={styles.buttons2} > CONTACT</button>                 <button className={styles.button1} onClick={navigateToSignin}> SIGN IN</button> </button>
        				<img className={styles.groupIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727326120/d379fc46-6749-4e40-b189-c6a23ccbe05f.png" />
      			</div>
      			<div className={styles.dupayLogoParent}>
        				<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
        				<b className={styles.dupay}>Dupay</b>
      			</div>
      			<div className={styles.groupParent}>
        				<img className={styles.frameChild} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727326187/be2641a4-fbda-4137-ba57-a37ffcc58313.png" />
        				<div className={styles.frameParent1}>
          					<div className={styles.titleParent}>
            						<div className={styles.title2}>
              							<span>Welcome to</span>
              							<span className={styles.buySell}> Dupay</span>
            						</div>
            						<div className={styles.titleContainer}>
              							<div className={styles.title1}>An individual account is the best way to manage your personal crypto portfolio:</div>
            						</div>
          					</div>
          					<div className={styles.frameParent2}>
            						<div className={styles.dupayLogoGroup}>
              							<img className={styles.dupayLogoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
              							<b className={styles.title4}>Access to Hundreds of Cryptocurrencies</b>
            						</div>
            						<div className={styles.dupayLogoContainer}>
              							<img className={styles.dupayLogoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
              							<b className={styles.title4}>Safe and Secure</b>
            						</div>
            						<div className={styles.dupayLogoContainer}>
              							<img className={styles.dupayLogoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
              							<b className={styles.title4}>Anytime, Anywhere</b>
            						</div>
          					</div>
        				</div>
      			</div>
      			<img className={styles.webpageSingleInner} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727326340/004ffae3-1c39-4b25-9416-4f0f0abfa666.png" />
      			<div className={styles.webpageSingleInner1} onClick={navigateToWebpage3}>
        				<div className={styles.titleParent1}>
          					<b className={styles.title4}>Individual</b>
          					<div className={styles.title8}>For individuals who want to trade, send and receive crypto, get price alerts and more</div>
        				</div>
      			</div>
      			<div className={styles.webpageSingleInner2}>
        				<div className={styles.titleParent2}>
          					<b className={styles.title4}>Vendor</b>
          					<div className={styles.title8}>We offer business and high net-worth individuals secure solutions for accepting, managing and trading cryptocurrencies. </div>
        				</div>
      			</div>
      			<div className={styles.webpageSingleInner3}>
        				<div className={styles.image7Parent}>
          					<img className={styles.image7Icon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727326396/c97b8587-276f-4fbf-9d46-c1b2a4c48617.png" />
          					<div className={styles.title11}>Dupay Wallet is available in your country</div>
            						</div>
          					</div>
          					<div className={styles.webpageSingleChild1} />
        				</div>);
        				};
        				
        				export default Webpage2;
        				