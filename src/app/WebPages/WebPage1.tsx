"use client";
import type { NextPage } from 'next';
import styles from './WebPage1.module.css';
import { useRouter } from 'next/navigation';
import React, {useState,useEffect} from 'react';
import MWEB from '../MWeb/MWeb';




const WebpageSingle:NextPage = () => {

	const router=useRouter();
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const handleResize = () => {
		  setIsMobile(window.innerWidth < 768); // Adjust the width as necessary
		};
	
		handleResize(); // Check on mount
		window.addEventListener('resize', handleResize);
	
		return () => {
		  window.removeEventListener('resize', handleResize);
		};
	  }, []);
	
	  // Render mobile component if in mobile view
	  if (isMobile) {
		return <MWEB />;
	  }
	const navigateToWebpage2 = () =>{
	
		router.push('/WebPages2');
	}
	const navigateToSignin = () =>{
	
		router.push('/Userauthentication/SignIn');
	}
  	return (
    		<div className={styles.webpageSingle}>
      			<img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727325960/0beadfc1-104a-4d39-90dc-d34518823d07.png" />
      			<div className={styles.webpageSingleChild} />
      			{/* <div className={styles.webpageSingleItem} /> */}
      			<div className={styles.homeAboutContactParent}>
        				<div className={styles.homeAboutContact}><button className={styles.buttons} >HOME     ABOUT     CONTACT</button>     <button className={styles.button1} onClick={navigateToWebpage2}> SIGN UP </button> </div>
        				
      			</div>
      			<div className={styles.dupayLogoParent}>
        				<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
        				<b className={styles.dupay}>Dupay</b>
      			</div>
      			<div className={styles.frameParent}>
        				<div className={styles.frameGroup}>
          					<div className={styles.titleParent}>
            						<div className={styles.title}>
              							<span className={styles.buySell}>Buy, Sell</span>{`, `}
              							<span>{`&`}</span>{` `}
              							<span className={styles.buySell}>Manage</span>{` `}
              							<span className={styles.with}>{`with `}</span>
              							<span className={styles.buyConfidence}>Confidence</span>
            						</div>
            						<div className={styles.titleWrapper}>
              							<div className={styles.title1}>Experience industry-leading security and ease of use for all your transactions. Download our app today, available on iOS, Android, and the Chrome Web Store, as well as on the Brave browser, and manage your assets with confidence!</div>
            						</div>
          					</div>
							 
          					
        				</div>
        				<img className={styles.device14pmIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727281217/5e9eeacd-2561-43f1-8826-4fcb2d62a0c5.png" />
      			</div>
      			
      			
        				</div>);
        				};
        				
        				export default WebpageSingle;
        				