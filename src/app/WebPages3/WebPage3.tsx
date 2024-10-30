"use client";
import type { NextPage } from 'next';
import styles from './WebPage3.module.css';
import { useRouter } from 'next/navigation';
import React, {useState,useEffect} from 'react';
import MWEB3 from '../MWeb3/Mweb3';



const Webpage3:NextPage = () => {

	const router=useRouter();
	const [isMobile, setIsMobile] = useState(false);
	const [selectedSection, setSelectedSection] = useState<string>('');

  const handleClick = (section: string) => {
    setSelectedSection(section);
  };
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
		return <MWEB3 />;
	  }
	const navigateToSignin = () =>{
	
		router.push('/Userauthentication/SignIn');
	}
	const navigateToEmailVerification = () =>{
	
		router.push('/Userauthentication/SignUp/EmailVerification');
	}
	const navigatetoOnboarding = () =>{
	
		router.push('/OnBoarding/SplashScreen-1');
	}
	
	
  	return (
    <div className={styles.webpageSingle}>
      			<img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727325960/0beadfc1-104a-4d39-90dc-d34518823d07.png" />
      			<div className={styles.webpageSingleChild} />
      			{/* <div className={styles.webpageSingleItem} /> */}
      			<div className={styles.homeAboutContactParent}>
				  <div className={styles.homeAboutContact}><button className={styles.buttons} >HOME     ABOUT     CONTACT</button></div>
        				<img className={styles.groupIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727326120/d379fc46-6749-4e40-b189-c6a23ccbe05f.png" />
      			</div>
      			<div className={styles.dupayLogoParent}>
        				<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
        				<b className={styles.dupay}>Dupay</b>
      			</div>
      			<div className={styles.frameParent}>
        				<div className={styles.frameGroup}>
          					<div className={styles.titleParent}>
            						<div className={styles.title}>
              							<span>Dupay wallet is available on your <br /> country.</span>
            						</div>
            						<div className={styles.titleWrapper}>
              							<div className={styles.title1}>Dupay Wallet, our self-custody crypto wallet to trade crypto and <br />collect NFTs , is available in your country</div>
            						</div>
                                    <div className={styles.titleWrappers} onClick={navigateToSignin}>Already have an account? Sign in</div>
          					</div>
          					<div className={styles.frameContainer}>
							  <div
								className={`${styles.frameWrapper} ${
								selectedSection === 'first' ? styles.selected : ''
								}`}
								onClick={() => handleClick('first')}
							>
              							<div className={styles.logoParent}>
                								<img className={styles.logoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330053/62602024-0f8b-4c92-b46c-2dd278aab23d.png" />
                								<img className={styles.textoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330118/7eba6f40-5ecd-41f0-b8c7-e93dd480ffe9.png" />
              							</div>
            						</div>
            						<div
										className={`${styles.frameWrapper} ${
										selectedSection === 'second' ? styles.selected : ''
										}`}
										onClick={() => {
										handleClick('second');
										// Assuming you also want to trigger some navigation
										navigatetoOnboarding();
										}}
									>
              							<div className={styles.logoGroup}>
                								<img className={styles.logoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330151/ee0450ef-d04e-4de3-9386-fad2da28734e.png" />
                								<img className={styles.textoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330181/d014bb6c-f486-4939-803c-084078addcbf.png" />
              							</div>
            						</div>
            						<div
										className={`${styles.frameWrapper} ${
										selectedSection === 'third' ? styles.selected : ''
										}`}
										onClick={() => {
										handleClick('third');
										navigateToEmailVerification();
										}}
									>
              							<div className={styles.logoGroup}>
                								<img className={styles.chromeWebStoreIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330555/5ca23ec4-a9a2-4d99-aa1b-bde3d45a0a1b.png" />
                								<img className={styles.textoIcon2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330507/579c0eb6-b5ea-4fac-8932-d23ba5bbb30c.png" />
              							</div>
            						</div>
            						<div
										className={`${styles.frameWrapper} ${
										selectedSection === 'fourth' ? styles.selected : ''
										}`}
										onClick={() => handleClick('fourth')}
									>
              							<div className={styles.logoGroup}>
                								<img className={styles.image6Icon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330466/4f625e0a-8c85-4bd6-a24d-d7aa25d84336.png" />
                								<div className={styles.availableOnParent}>
                  									<div className={styles.availableOn}>Available on</div>
                  									<div className={styles.braveBrowser}>Brave Browser</div>
                								</div>
              							</div>
            						</div>
          					</div>
        				</div>
      			</div>
                  </div>);
        				};

                        export default Webpage3;