// import { style } from '@mui/system';
// import styles from './SplashScreen3.module.css';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import useSwipe from '../../useSwipe'; // Adjust the path as needed
// import LottieAnimationLoading from '../../assets/Loadingrefresh';


// export default function SplashScreen3() {
//     const router = useRouter();
//     const [showLoader, setShowLoader] = useState<boolean>(true); // Explicitly type the state
//     const [isExiting, setIsExiting] = useState(false);

//     const handleSwipeLeft = () => {
//       setIsExiting(true);
//         router.push('/OnBoarding/SplashScreen-1'); // Updated route
//     };
//     const handleSwipeRight = () => {
//       setIsExiting(true);
//       router.push('/OnBoarding/SplashScreen-2'); // Updated route
//     };
//     const navigateToSignUp = () => {
//       setIsExiting(true);
//       router.push('/Userauthentication/SignUp/EmailVerification'); // Updated route
//     };

//      // Use effect to hide the loader after a delay or when the component is ready
//      useEffect(() => {
//       const timer = setTimeout(() => {
//           setShowLoader(false); // Hide the loader after 2 seconds (adjust as needed)
//       }, 2000); // Adjust the duration as necessary

//       return () => clearTimeout(timer); // Clean up the timer on unmount
//   }, []);

//     useSwipe(handleSwipeLeft, handleSwipeRight);


//   return (
//     <div className={`${styles.container} ${isExiting ? styles.slideExit : styles.slideEnter}`}>
//      {/* <div className={`${styles.oboarding4} ${isExiting ? styles.slideExit : styles.slideEnter}`}> */}
//      {showLoader ? (
//                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: ' #17171a', width: '100%', maxHeight: '100%' }}>
//                     {/* Show the Lottie loading animation */}
//                     <LottieAnimationLoading width="300px" height="300px" />
//                 </div>
//             ) : (
//                 <>
//       <div className={styles.carouselIndicator}>
//           <img className={styles.imagecarouselIndicatorcompoIcon1} onClick={handleSwipeLeft}   alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
//           <img className={styles.imagecarouselIndicatorcompoIcon2} onClick={handleSwipeRight} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6" />
//           <img className={styles.imagecarouselIndicatorcompoIcon}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
//       </div>
//       <div className={styles.textContent}>
//         <h1 className={styles.title}>
//           <span className={styles.highlight}> Buy, Sell &amp;</span>
//              <br /> <span className={styles.highlighted}>Manage</span> with <br />
//              <span className={styles.highlights}>Confidence </span>
//         </h1>
//         <p className={styles.subText}>Industry-leading security and <br/>
//           ease of use.</p>
//       </div>
//       <button className={styles.getStartedButton} onClick={navigateToSignUp}>Get started</button>
//       </>
//     </div>
//   );
// }
  import { useRouter } from 'next/navigation';
  import { useState, useEffect } from 'react';
  import useSwipe from '../../useSwipe'; // Adjust the path as needed
  import LottieAnimationLoading from '../../assets/Loadingrefresh';
  import styles from './SplashScreen3.module.css';

  export default function SplashScreen3() {
      const router = useRouter();
      const [showLoader, setShowLoader] = useState<boolean>(true); // Explicitly type the state
      const [isExiting, setIsExiting] = useState<boolean>(false); // Explicitly type the state
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
          // setIsExiting(true);
          // router.push('/OnBoarding/SplashScreen-1'); // Updated route
      };

      const handleSwipeRight = () => {
          setIsExiting(true);
          router.push('/OnBoarding/SplashScreen-2'); // Updated route
      };

      const navigateToSignUp = () => {
          setIsExiting(true);
          router.push('/Userauthentication/SignUp/EmailVerification'); // Updated route
      };


      useSwipe(handleSwipeLeft, handleSwipeRight);

      return (
          <div className={`${styles.container} ${isExiting ? styles.slideExit : styles.slideEnter}`}>
              {showLoader ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#17171a', width: '100%' }}>
                      {/* Show the Lottie loading animation */}
                      <LottieAnimationLoading width="300px" height="300px" />
                  </div>
              ) : (
                  <>
                      <div className={styles.carouselIndicator}>
                          <img
                              className={styles.imagecarouselIndicatorcompoIcon1}
                              onClick={handleSwipeLeft}
                              alt="Swipe Left"
                              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png"
                          />
                          <img
                              className={styles.imagecarouselIndicatorcompoIcon2}
                              onClick={handleSwipeRight}
                              alt="Swipe Right"
                              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png"
                          />
                          <img
                              className={styles.imagecarouselIndicatorcompoIcon}
                              alt="Carousel Indicator"
                              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png"
                          />
                      </div>
                      <div className={styles.textContent}>
                          <h1 className={styles.title}>
                              <span className={styles.highlight}>Buy, Sell &amp;</span>
                              <br />
                              <span className={styles.highlighted}>Manage</span> with <br />
                              <span className={styles.highlights}>Confidence</span>
                          </h1>
                          <p className={styles.subText}>Industry-leading security and <br /> ease of use.</p>
                      </div>
                      <button className={styles.getStartedButton} onClick={navigateToSignUp}>Get started</button>
                  </>
              )}
          </div>
      );
  }
