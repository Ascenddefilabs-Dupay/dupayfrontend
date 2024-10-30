import type { NextPage } from 'next';
import styles from './Mweb2.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Webpage2 from '../WebPages2/WebPage2';


const MWEB2:NextPage = () => {

    const router=useRouter();
	const [sidebarVisible, setSidebarVisible] = useState(false);
	const [isWebsite, setIsWebsite] = useState(false);
	const [selectedSection, setSelectedSection] = useState<string>('');

  const handleClick = (section: string) => {
    setSelectedSection(section);
  };
  
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
	
		router.push('/MWeb3');
    }
  	return (
		<>
      {isWebsite ? (
        <Webpage2 />
      ) : (
    		<div className={styles.mweb}>
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
      			<div className={styles.frameParent1}>
        				<img className={styles.frameChild} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1730263498/be2641a4-fbda-4137-ba57-a37ffcc58313-transformed_vvgrru.png" />
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
        				<div
							className={`${styles.frameWrapper4} ${
							selectedSection === 'individual' ? styles.selected : ''
							}`}
							onClick={() => {
							handleClick('individual');
							navigateToMweb2(); // This triggers your navigation
							}}
						>
          					<div className={styles.titleParent1}>
            						<b className={styles.title5}>Individual</b>
            						<div className={styles.title8}>For individuals who want to trade, send and receive crypto, get price alerts and more</div>
          					</div>
        				</div>
        				<div
							className={`${styles.frameWrapper5} ${
							selectedSection === 'Business' ? styles.selected : ''
							}`}
							onClick={() => handleClick('Business')}
						>
          					<div className={styles.titleParent2}>
            						<b className={styles.title9}>Business</b>
            						<div className={styles.title10}>We offer business and high net-worth individuals secure solutions for accepting, managing and trading cryptocurrencies.</div>
          					</div>
        				</div>
      			</div>
        				</div>
						)}
    </>
						);
        				};
						
        				
        				export default MWEB2;
        				