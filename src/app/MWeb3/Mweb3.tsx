import type { NextPage } from 'next';
import styles from './Mweb3.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


const MWEB3:NextPage = () => {

    const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
 
  const navigateToEmailVerification = () =>{
	
	router.push('/Userauthentication/SignUp/EmailVerification');
}
const navigatetoOnboarding = () =>{

	router.push('/OnBoarding/SplashScreen-1');
}
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (sidebarVisible) {
      document.body.classList.add(styles.noScroll); // Add no-scroll class
    } else {
      document.body.classList.remove(styles.noScroll); // Remove no-scroll class
    }

    // Cleanup function to remove the class on unmount
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [sidebarVisible]);

  const navigateToPage = (page: string) => {
    router.push(page);
    setSidebarVisible(false); // Close sidebar after navigating
  };
	const navigateToMweb2 = () =>{
	
		router.push('/MWeb2');
    }
  	return (
    		<div className={styles.mweb}>
      			<img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727325960/0beadfc1-104a-4d39-90dc-d34518823d07.png" />
      			<div className={styles.frameParent}>
        				<div className={styles.frameWrapper}>
          					<div className={styles.dupayLogoParent}>
            						<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
            						<b className={styles.dupay}>Dupay</b>
          					</div>
        				</div>
        				<img className={styles.iconmenuBurger} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727327352/8ad99937-a9a6-4a4e-8eb8-f401f305b690.png" onClick={toggleSidebar}/>
      			</div>
				  {sidebarVisible && (
        <div className={styles.sidebar}>
          <ul>
            <li onClick={() => navigateToPage('/')}>Home</li>
            <li onClick={() => navigateToPage('/about')}>About</li>
            <li onClick={() => navigateToPage('/contact')}>Contact</li>
            <li className={styles.button} onClick={() => navigateToPage('/Userauthentication/SignIn')}>Sign In</li>
            {/* <li onClick={() => navigateToPage('/MWeb2')}>Sign Up</li> */}
          </ul>
        </div>
      )}
      			<div className={styles.mwebChild} />
      			<div className={styles.frameGroup}>
        				<div className={styles.titleParent}>
          					<div className={styles.title}>
            						<span className={styles.buySell}>Buy, Sell</span>{`, `}
            						<span>{`&`}</span>{` `}
            						<span className={styles.buySell}>Manage</span>{` `}
            						<span className={styles.with}>{`with `}</span>
            						<span className={styles.buySell}>Confidence</span>
          					</div>
          					{/* <img className={styles.device14pmIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727281217/5e9eeacd-2561-43f1-8826-4fcb2d62a0c5.png" /> */}
          					<div className={styles.titleWrapper}>
            						<div className={styles.title1}>Experience industry-leading security and ease of use for all your transactions. Download our app today, available on iOS, Android, and the Chrome Web Store, as well as on the Brave browser, and manage your assets with confidence!</div>
          					</div>
        				</div>
        				<div className={styles.frameContainer}>
          					<div className={styles.frameDiv}>
							  <div className={styles.logoParent}>
                								<img className={styles.logoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330053/62602024-0f8b-4c92-b46c-2dd278aab23d.png" />
                								<img className={styles.textoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330118/7eba6f40-5ecd-41f0-b8c7-e93dd480ffe9.png" />
              							</div>
          					</div>
          					<div className={styles.frameDiv}>
            						<div className={styles.logoGroup} onClick={navigatetoOnboarding}>
									<img className={styles.logoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330151/ee0450ef-d04e-4de3-9386-fad2da28734e.png" />
									<img className={styles.textoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330181/d014bb6c-f486-4939-803c-084078addcbf.png" />
            						</div>
          					</div>
          					<div className={styles.frameDiv}>
            						<div className={styles.logoGroup} onClick={navigateToEmailVerification}>
									<img className={styles.chromeWebStoreIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330555/5ca23ec4-a9a2-4d99-aa1b-bde3d45a0a1b.png" />
									<img className={styles.textoIcon2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330507/579c0eb6-b5ea-4fac-8932-d23ba5bbb30c.png" />
            						</div>
          					</div>
          					<div className={styles.frameDiv}>
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
      			{/* <div className={styles.mwebItem} />
      			<div className={styles.mwebInner} />
      			<div className={styles.frameParent1}>
        				<img className={styles.frameChild} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727326187/be2641a4-fbda-4137-ba57-a37ffcc58313.png" />
        				<div className={styles.frameParent2}>
          					<div className={styles.titleGroup}>
            						<div className={styles.title2}>
              							<span>Welcome to</span>
              							<span className={styles.buySell}> Dupay</span>
            						</div>
            						<div className={styles.titleContainer}>
              							<div className={styles.title1}>An individual account is the best way to manage your personal crypto portfolio:</div>
            						</div>
          					</div>
          					<div className={styles.frameParent3}>
            						<div className={styles.dupayLogoGroup}>
              							<img className={styles.dupayLogoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
              							<b className={styles.title4}>Access to Hundreds of Cryptocurrencies</b>
            						</div>
            						<div className={styles.dupayLogoGroup}>
              							<img className={styles.dupayLogoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
              							<b className={styles.title5}>Safe and Secure</b>
            						</div>
            						<div className={styles.dupayLogoGroup}>
              							<img className={styles.dupayLogoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
              							<b className={styles.title5}>Anytime, Anywhere</b>
            						</div>
          					</div>
        				</div>
      			</div>
      			<div className={styles.rectangleParent}>
        				<div className={styles.frameItem} />
        				<img className={styles.loopergroupIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727326340/004ffae3-1c39-4b25-9416-4f0f0abfa666.png" />
        				<div className={styles.frameWrapper4} onClick={navigateToMweb2}>
          					<div className={styles.titleParent1}>
            						<b className={styles.title5}>Individual</b>
            						<div className={styles.title8}>For individuals who want to trade, send and receive crypto, get price alerts and more</div>
          					</div>
        				</div>
        				<div className={styles.frameWrapper5}>
          					<div className={styles.titleParent2}>
            						<b className={styles.title9}>Vendor</b>
            						<div className={styles.title10}>We offer business and high net-worth individuals secure solutions for accepting, managing and trading cryptocurrencies.</div>
          					</div>
        				</div>
      			</div>
      			<div className={styles.mwebInner1}>
        				<div className={styles.image7Parent}>
          					<img className={styles.image7Icon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727326396/c97b8587-276f-4fbf-9d46-c1b2a4c48617.png" />
          					<div className={styles.title11}>Dupay Wallet is available in your country</div>
            						</div>
          					</div> */}
        				</div>);
        				};
        				
        				export default MWEB3;
        				