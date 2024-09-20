import React from 'react';
import Animation from './animation';

const page = () => {
  return (
    <div>
      <Animation />
    </div>
  )
}

export default page


  // "use client";
  // import React, { useEffect, useState } from "react";

  // const Page = () => {
  //   const [animationStage, setAnimationStage] = useState(0);

  //   useEffect(() => {
  //     // Animation sequence timers
  //     const timer1 = setTimeout(() => setAnimationStage(1), 1000); // Image falls into view
  //     const timer2 = setTimeout(() => setAnimationStage(2), 3000); // Text emerges from the image
  //     const timer3 = setTimeout(() => setAnimationStage(3), 5000); // Fade out both image and text
  //     const timer4 = setTimeout(() => setAnimationStage(4), 5500); // Change background to radial gradient (wave effect)
  //     const timer5 = setTimeout(() => setAnimationStage(5), 5700); // Change background back to black

  //     return () => {
  //       clearTimeout(timer1);
  //       clearTimeout(timer2);
  //       clearTimeout(timer3);
  //       clearTimeout(timer4);
  //       clearTimeout(timer5);
  //     };
  //   }, []);

  //   return (
  //     <div
  //         style={{
  //           height: "100vh",
  //           width: '430px',
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           position: "relative", // Ensure child elements are positioned relative to this div
  //           overflow: "hidden",
  //           backgroundColor: 'black',
  //           margin: '0 auto',
  //         }} 
  //     >
  //       {/* Animation div */}
  //       <div
  //         style={{
  //           position: "absolute",
  //           top: 0,
  //           left: 0,
  //           width: "100%",
  //           height: "100%",
  //           pointerEvents: "none", // Ensure it doesn't interfere with user interactions
  //           zIndex: 0, // Place behind other content
  //           animation: animationStage >= 5 ? "my-animation 1s ease-out forwards" : "none", // Apply animation based on stage
  //         }}
  //       />
  //       {animationStage < 4 && ( // Hide the content permanently after stage 3
  //         <div
  //           style={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             transition: "opacity 1s ease",
  //             opacity: animationStage === 3 ? 0 : 1, // Fade out at stage 3
  //             zIndex: 1, // Ensure content is above the animation div

  //           }}
  //         >
  //           {/* Image */}
  //           <div
  //             style={{
  //               background:
  //                 "linear-gradient(to right, rgba(119, 6, 211, 1) 25%, rgba(243, 66, 235, 1) 100%)",
  //               width: "40px",
  //               height: "40px",
  //               borderRadius: "50%",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               animation: animationStage === 1 ? "fall 1s ease-in-out forwards" : "none", // Image falls in
  //               transition: "transform 1s ease, opacity 1s ease",
  //               transform: animationStage === 3 ? "translateX(40px)" : "none", // Move left before fading out
  //               opacity: animationStage === 0 ? 0 : 1, // Hide image initially
  //             }}
  //           >
  //             <img
  //               src="/images/dupay.png"
  //               alt="Dupay_img"
  //               style={{
  //                 width: "40px",
  //                 height: "40px",
  //                 borderRadius: "50%",
  //                 animation: animationStage === 1 ? "fadeIn 1s ease-in-out forwards" : "none", // Fade-in effect for the image
  //                 opacity: animationStage === 0 ? 0 : 1, // Hide image initially
  //               }}
  //             />
  //           </div>

  //           {/* Text */}
  //           {animationStage >= 2 && (
  //                 <div
  //                     style={{
  //                     marginLeft: "10px", // Text is positioned next to the image
  //                     transform: animationStage === 2 ? "translateX(0)" : "translateX(-30px)", // Start from the left
  //                     animation:
  //                         animationStage === 2
  //                         ? "fadeInText 1s ease forwards" // Fade in from the left
  //                         : animationStage === 3
  //                         ? "fadeOutText 1s ease forwards" // Fade out back to the left
  //                         : "none",
  //                     color: "white",
  //                     opacity: animationStage >= 2 && animationStage < 3 ? 1 : 0, // Control opacity during the fade in and fade out
  //                     transition: "transform 1s ease, opacity 1s ease",
  //                     }}
  //                 >
  //                     Dupay
  //                 </div>
  //                 )}

  //         </div>
  //       )}

  //             <style jsx>{`
  //             @keyframes fall {
  //                 0% {
  //                 transform: translateY(-1000%);
  //                 opacity: 0;
  //                 }
  //                 100% {
  //                 transform: translateY(0);
  //                 opacity: 1;
  //                 }
  //             }

  //             @keyframes fadeInImage {
  //                 0% {
  //                     opacity: 0;
  //                     transform: translateX(30px) scale(0.8); /* Slightly right at the start */
  //                 }
  //                 100% {
  //                     opacity: 1;
  //                     transform: translateX(-10px) scale(1); /* Settle slightly left as text fades in */
  //                 }
  //             }

  //           @keyframes fadeOutImage {
  //                 0% {
  //                     opacity: 1;
  //                     transform: translateX(0px) scale(1); /* Starting at its normal position */
  //                 }
  //                 100% {
  //                     opacity: 0;
  //                     transform: translateX(-100vw) scale(1); /* Move off-screen to the left */
  //                 }

  //             }
  //             @keyframes fadeInText {
  //                 0% {
  //                 opacity: 0;
  //                 transform: translateX(-30px) scale(0.8); /* Starting from the left */
  //                 }
  //                 100% {
  //                 opacity: 1;
  //                 transform: translateX(0) scale(1); /* Ending at its position */
  //                 }
  //             }

  //             @keyframes fadeOutText {
  //                 0% {
  //                 opacity: 1;
  //                 transform: translateX(0) scale(1); /* Starting at its position */
  //                 }
  //                 100% {
  //                 opacity: 0;
  //                 transform: translateX(-30px) scale(0.8); /* Moving back to the left and shrinking */
  //                 }
  //               }
  //                 @keyframes my-animation {
  //                   0% {
  //                     width: 0px;
  //                     height: 0px;
  //                     border-radius: 1%;
  //                     background: linear-gradient(to right, rgba(119, 6, 211, 1) 25%, rgba(243, 66, 235, 1) 100%);
  //                     top: 50%;
  //                     left: 50%;
  //                     transform: translate(-50%, -50%);
  //                   }
  //                   50% {
  //                     width: 430px;
  //                     height: 100vh;
  //                     background: linear-gradient(to right, rgba(119, 6, 211, 1) 25%, rgba(243, 66, 235, 1) 100%);
  //                     top: 0;
  //                     left: 0;
  //                     margin: 0 auto;
  //                     transform: translate(0, 0);
  //                   }
  //                   100% {
  //                     width: 100vw;
  //                     height: 100vh;
  //                     background: black; /* Change to black at the end */
  //                   }
  //                 }

  //             `}</style>ś
  //     </div>
  //   );
  // };

  // export default Page;