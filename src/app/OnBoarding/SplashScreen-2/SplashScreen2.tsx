// import React from 'react';
// import styles from './SplashScreen2.module.css';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import useSwipe from '../../useSwipe'; 
// import LottieAnimationLoading from '../../assets/Loadingrefresh';



// const SplashScreen2: React.FC = () => {
//     const router = useRouter();
// 	const [showLoader, setShowLoader] = useState<boolean>(true); // Explicitly type the state
// 	const [isExiting, setIsExiting] = useState(false);

// 	 // Use effect to hide the loader after a delay or when the component is ready
// 	 useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowLoader(false); // Hide the loader after 2 seconds (adjust as needed)
//         }, 2000); // Adjust the duration as necessary

//         return () => clearTimeout(timer); // Clean up the timer on unmount
//     }, []);

    
//     const handleSwipeLeft = () => {
//         setIsExiting(true);
//         router.push('/OnBoarding/SplashScreen-3'); // Updated route
//     };
//     const handleSwipeRight = () => {
// 		setIsExiting(true);
//         router.push('/OnBoarding/SplashScreen-1'); // Updated route
//     };
// 	const handleSkipClick = () => {
// 		setIsExiting(true);
//         router.push('/Userauthentication/SignUp/EmailVerification');
//     };

// 	useSwipe(handleSwipeLeft, handleSwipeRight);


//   	return (
//     		<div className={`${styles.oboarding5} ${isExiting ? styles.slideExit : styles.slideEnter}`}>
// 				{showLoader ? (
//                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: ' #17171a', width: '100%', maxHeight: '100%' }}>
//                     {/* Show the Lottie loading animation */}
//                     <LottieAnimationLoading width="300px" height="300px" />
//                 </div>
//             ) : (
//                 <>
//       			<button className={styles.skip} onClick={handleSkipClick}>Skip</button>
//       			<div className={styles.carouselIndicator}>
// 							<button onClick={handleSwipeLeft} style={{cursor: 'pointer'}}>
// 							<img className={styles.imagecarouselIndicatorcompoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />

// 							</button> 
// 						<img className={styles.imagecarouselIndicatorcompoIcon2}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
// 						<img className={styles.imagecarouselIndicatorcompoIcon}  onClick={handleSwipeRight} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
//       			</div>
// 				  <img className={styles.groupIcon}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804062/image_xnekfp.png" />
//       			{/* <div className={styles.titleParent}>
//         				<div className={styles.title}>
//           					<span>{`Trusted by `}</span>
//           					<span className={styles.individuals}>Individuals</span>{` `}
//           					<span>{`&`}</span>
//           					<span className={styles.individuals}> Businesses</span>
//         				</div>
//         				<div className={styles.titleWrapper}>
//           					<div className={styles.title1}>The most reliable platform for your crypto needs.</div>
//         				</div>
//       			</div> */}
// 				  <div className={styles.textContent}>
// 				  <div className={styles.title}>
// 					<span>{`Trusted by `}</span>
// 					<span className={styles.individuals}>Individuals</span>{` `}
// 					<span>{`&`}</span>
// 					<span className={styles.individuals1}> Businesses</span>
// 				  </div>
// 						<p className={styles.subText}>The most reliable platform for <br/>
// 						ease of use.</p>
// 					</div>
//       			<img className={styles.lockBgIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727063179/2nd-screen_ms4not.png" />
// 			<button className={styles.getStartedButton} onClick={handleSwipeRight}>See how it works</button>
//       			</>
//     		</div>)
// };




// export default SplashScreen2;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSwipe from '../../useSwipe'; 
import LottieAnimationLoading from '../../assets/LoadingAnimation'
import styles from './SplashScreen2.module.css';

const SplashScreen2: React.FC = () => {
    const router = useRouter();
    const [showLoader, setShowLoader] = useState<boolean>(true);
    const [isExiting, setIsExiting] = useState<boolean>(false);

	const [initialLoad, setInitialLoad] = useState<boolean>(true); // Track the initial load

    // Use effect to hide loader after a delay
    useEffect(() => {
        // Hide the loader after a delay only on initial load
        const timer = setTimeout(() => {
            if (initialLoad) {
                setShowLoader(false); // Stop showing the loader
                setInitialLoad(false); // Set to false after first load
            }
        }, 2000); // Adjust duration as needed

        // Cleanup timer on unmount
        return () => clearTimeout(timer);
    }, [initialLoad]);

    const handleSwipeLeft = () => {
        setIsExiting(true);
        router.push('/OnBoarding/SplashScreen-3'); // Updated route
    };

    const handleSwipeRight = () => {
        setIsExiting(true);
        router.push('/OnBoarding/SplashScreen-3'); // Updated route
    };

    const handleSkipClick = () => {
        setIsExiting(true);
        router.push('/Userauthentication/SignUp/EmailVerification');
    };

    useSwipe(handleSwipeLeft, handleSwipeRight);

    return (
        <div className={`${styles.oboarding5} ${isExiting ? styles.slideExit : styles.slideEnter}`}>
            {showLoader ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#17171a', width: '100%' }}>
                    {/* Show the Lottie loading animation */}
                    <LottieAnimationLoading width="300px" height="300px" />
                </div>
            ) : (
                <>
                    <button className={styles.skip} onClick={handleSkipClick}>Skip</button>
                    <div className={styles.carouselIndicator}>
                        <button onClick={handleSwipeLeft} style={{ cursor: 'pointer' }}>
                            <img className={styles.imagecarouselIndicatorcompoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
                        </button>
                        <img className={styles.imagecarouselIndicatorcompoIcon2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
                        <img className={styles.imagecarouselIndicatorcompoIcon} onClick={handleSwipeRight} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
                    </div>
                    <img className={styles.groupIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804062/image_xnekfp.png" />
                    <div className={styles.textContent}>
                        <div className={styles.title}>
                            <span>{`Trusted by `}</span>
                            <span className={styles.individuals}>Individuals</span>
                            <span>{` & `}</span>
                            <span className={styles.individuals1}>Businesses</span>
                        </div>
                        <p className={styles.subText}>The most reliable platform for <br /> ease of use.</p>
                    </div>
                    <img className={styles.lockBgIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727063179/2nd-screen_ms4not.png" />
                    <button className={styles.getStartedButton} onClick={handleSwipeRight}>See how it works</button>
                </>
            )}
        </div>
    );
};

export default SplashScreen2;
