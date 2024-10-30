import type { NextPage } from 'next';
import styles from './Mweb3.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Webpage3 from '../WebPages3/WebPage3';


const MWEB3:NextPage = () => {

    const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const [isWebsite, setIsWebsite] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');

  const handleClick = (section: string) => {
    setSelectedSection(section);
  };
  const navigateToSignin = () =>{
	
	router.push('/Userauthentication/SignIn');
}
  useEffect(() => {
		const handleResize = () => {
		  setIsWebsite(window.innerWidth >= 768); // Adjust the width as necessary
		};
	
		handleResize(); // Check on mount
		window.addEventListener('resize', handleResize);
	
		return () => {
		  window.removeEventListener('resize', handleResize);
		};
	  }, []);
	
	  // Render mobile component if in mobile view
	 
 
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
		<>
      {isWebsite ? (
        <Webpage3 />
      ) : (
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
          </ul>
        </div>
      )}
      			{/* <div className={styles.mwebChild} /> */}
      			<div className={styles.frameGroup}>
				  <div className={styles.titleParent}>
            						<div className={styles.titleWrappers}>
              							<span>Dupay wallet is available on your country.</span>
            						</div>
            						<div className={styles.titleWrapper}>
              							<div className={styles.title1}>Dupay Wallet, our self-custody crypto wallet to trade crypto and collect NFTs , is available in your country</div>
            						</div>
                                    <div className={styles.titleWrapper} onClick={navigateToSignin}>Already have an account? Sign in</div>
          					</div>
        				<div className={styles.frameContainer}>
          					<div
								className={`${styles.frameDiv} ${
								selectedSection === 'firstLogo' ? styles.selected : ''
								}`}
								onClick={() => handleClick('firstLogo')}
							>
							  <div className={styles.logoParent}>
                								<img className={styles.logoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330053/62602024-0f8b-4c92-b46c-2dd278aab23d.png" />
                								<img className={styles.textoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330118/7eba6f40-5ecd-41f0-b8c7-e93dd480ffe9.png" />
              							</div>
          					</div>
          					<div
								className={`${styles.frameDiv} ${
								selectedSection === 'onboarding' ? styles.selected : ''
								}`}
								onClick={() => {
								handleClick('onboarding');
								navigatetoOnboarding(); // Trigger navigation
								}}
							>
            						<div className={styles.logoGroup} >
									<img className={styles.logoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330151/ee0450ef-d04e-4de3-9386-fad2da28734e.png" />
									<img className={styles.textoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330181/d014bb6c-f486-4939-803c-084078addcbf.png" />
            						</div>
          					</div>
							  <div
								className={`${styles.frameDiv} ${
								selectedSection === 'emailVerification' ? styles.selected : ''
								}`}
								onClick={() => {
								handleClick('emailVerification');
								navigateToEmailVerification(); // Trigger navigation
								}}
							>
            						<div className={styles.logoGroup} >
									<img className={styles.chromeWebStoreIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330555/5ca23ec4-a9a2-4d99-aa1b-bde3d45a0a1b.png" />
									<img className={styles.textoIcon2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727330507/579c0eb6-b5ea-4fac-8932-d23ba5bbb30c.png" />
            						</div>
          					</div>
          					<div
								className={`${styles.frameDiv} ${
								selectedSection === 'braveBrowser' ? styles.selected : ''
								}`}
								onClick={() => handleClick('braveBrowser')}
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
	)}
	</>
	);
        				};
        				
        				export default MWEB3;
        				