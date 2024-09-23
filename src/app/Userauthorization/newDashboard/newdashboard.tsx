"use client";
import { useState } from 'react';
import type { NextPage } from 'next';
import styles from './newdashboard.module.css';
import { width } from '@mui/system';


const Home:NextPage = () => {
	const [isDupayOpen, setIsDupayOpen] = useState(false);

	const handleDupayClick = () => {
		setIsDupayOpen(true); // Open the blur screen with buttons
	  };
	
	  const handleClose = () => {
		setIsDupayOpen(false); // Close the blur screen
	  };

  	return (
    		<div className={styles.home}>
      			<img className={styles.frameIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074021/Frame_mp4g4t.png" />
      			<div className={styles.tabbarstabbars}>
        				<div className={styles.div}>
          					<div className={styles.content}>
            						<img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727076064/wallet_icon_ubkgg2.png" />
            						<b className={styles.text}>Wallet</b>
          					</div>
        				</div>
        				<div className={styles.div1}>
          					<div className={styles.content}>
            						<img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077435/payment_mbvqke.png" />
            						<b className={styles.text}>Dupay</b>
          					</div>
        				</div>
        				<div className={styles.div1}>
          					<div className={styles.content}>
            						<img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077051/profileicon_logo_dxbyqc.png" />
            						<b className={styles.text}>Profile</b>
          					</div>
        				</div>
      			</div>
      			
      			<div className={styles.aset}>
        				<div className={styles.asetChild} />
        				<div className={styles.int000}>{`INR 0.00 `}</div>
      			</div>
      			<div className={styles.homeInner} onClick={handleDupayClick}>
        				<img className={styles.frameChild} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
      			</div>
      			<div className={styles.chatBubbleParent}>
        				<img className={styles.chatBubbleIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074910/messagelogo_geocnl.png" />
        				<img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075270/Notificationlogo_aglon1.png" />
      			</div>
      			<div className={styles.goodMorningAnuroopContainer}>
        				<span>{`Good morning, `}</span>
        				<b>Anuroop</b>
      			</div>
				<div className={styles.tab}>
        				<div className={styles.tabsstyle1}>
          					<div className={styles.tabs}>
            						<div className={styles.tabitemstyle1}>
              							<div className={styles.tab1}>Crypto</div>
            						</div>
            						<div className={styles.tabitemstyle11}>
              							<div className={styles.tab1}>Fiat</div>
            						</div>
            						<div className={styles.tabitemstyle12}>
              							<div className={styles.tab1}>NFTs</div>
            						</div>
          					</div>
          					<div className={styles.dividerhorizontal} />
        				</div>
      			</div>
      			<div className={styles.btnmbBtnFab}>
        				<div className={styles.btnbtn}>
          					<div className={styles.tab1}>Add crypto</div>
        				</div>
      			</div>
      			<div className={styles.groupParent}>
        				<img className={styles.frameItem} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075702/crypto_image_logo_bxom6g.png" />
        				<div className={styles.addCryptoTo}>Add crypto to get started</div>
      			</div>
				  {isDupayOpen && (
        <div className={styles.overlay}>
          <div className={styles.blurBackground}></div>
          <div className={styles.buttonsContainer}>
            <div className={styles.button}>
              <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085076/cashout_icon_h0h6vj.png" alt="Cashout" 
				style={{position: 'relative', right: '-5px'}}

			  />
              <span>Cashout</span>
            </div>
            <div className={styles.button}>
              <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085724/swap_icon_v5uzcz.png" alt="Swap" 
			  style={{position: 'relative', right: '3px'}}
			  />
				<div style={{ fontFamily: 'Roboto, sans-serif' }}>Swap</div>
			</div>
            <div className={styles.button}>
              <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085940/Receive_icon_kwgsaq.png" alt="Receive" 
			  style={{width:'20px', height: '20px', position: 'relative', right: '-15px'}}
			  />
              <div style={{ marginLeft: '20px', fontFamily: 'Roboto, sans-serif' }}>Receive</div>
            </div>
            <div className={styles.button}>
              <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085858/Send_icon_zag3am.png" alt="Send" 
			  style={{width:'20px', height: '20px', position: 'relative', right: '4px'}}
			  />
              <div style={{ fontFamily: 'Roboto, sans-serif' }}>Send</div>
            </div>
            <div className={styles.button}>
              <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086014/Buy_icon_rwmfdq.png" alt="Buy" 
			 	style={{position: 'relative', right: '7px'}}

			  />

              <div style={{ fontFamily: 'Roboto, sans-serif', position: 'relative', right: '7px'  }}>Buy</div>
            </div>
          </div>
          {/* Close button */}
          <button className={styles.closeButton} onClick={handleClose}>
            <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086180/close_icon_acudos.png" alt="Close" />
          </button>
        </div>
      )}
      			{/* <div className={styles.frameParent}>
        				<div className={styles.iconbuyWrapper}>
          					<img className={styles.iconbase} alt="" src="icon/buy.svg" />
        				</div>
        				<b className={styles.buy}>Buy</b>
      			</div>
      			<div className={styles.frameParent}>
        				<div className={styles.iconbuyWrapper}>
          					<img className={styles.iconbase} alt="" src="icon/exchange.svg" />
        				</div>
        				<b className={styles.buy}>Swap</b>
      			</div>
      			<div className={styles.frameParent}>
        				<div className={styles.iconbuyWrapper}>
          					<img className={styles.chatBubbleIcon} alt="" src="icon/arrow-right-sent.svg" />
        				</div>
        				<b className={styles.buy}>Send</b>
      			</div>
      			<div className={styles.frameParent}>
        				<div className={styles.iconbuyWrapper}>
          					<img className={styles.chatBubbleIcon} alt="" src="icon/arrow-right-received.svg" />
        				</div>
        				<b className={styles.buy}>Receive</b>
      			</div>
      			<div className={styles.frameParent}>
        				<div className={styles.iconbuyWrapper}>
          					<img className={styles.iconbase} alt="" src="icon/payment$.svg" />
        				</div>
        				<b className={styles.buy}>Cashout</b>
      			</div> */}
      			<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075056/Dupaylogo_yzcput.png" />
      			
    		</div>);
};

export default Home;


// "use client";
// import { useState } from 'react';
// import type { NextPage } from 'next';
// import styles from './newdashboard.module.css';

// const Home: NextPage = () => {
//   const [isDupayOpen, setIsDupayOpen] = useState(false);

//   const handleDupayClick = () => {
//     setIsDupayOpen(true); // Open the blur screen with buttons
//   };

//   const handleClose = () => {
//     setIsDupayOpen(false); // Close the blur screen
//   };

//   return (
//     <div className={styles.home}>
//       {/* Main Content */}
//       <img className={styles.frameIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074021/Frame_mp4g4t.png" />
//       <div className={styles.tabbarstabbars}>
//         {/* Dupay Icon */}
//         <div className={styles.div1} onClick={handleDupayClick}>
//           <div className={styles.content}>
//             <img className={styles.iconbase} alt="Dupay Icon" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077435/payment_mbvqke.png" />
//             <b className={styles.text}>Dupay</b>
//           </div>
//         </div>
//         {/* Other Icons */}
//         {/* Add Wallet and Profile Icons */}
//       </div>

//       {/* Blur Screen and Buttons */}
//       {isDupayOpen && (
//         <div className={styles.overlay}>
//           <div className={styles.blurBackground}></div>
//           <div className={styles.buttonsContainer}>
//             <div className={styles.button}>
//               <img src="icon/cashout.svg" alt="Cashout" />
//               <span>Cashout</span>
//             </div>
//             <div className={styles.button}>
//               <img src="icon/swap.svg" alt="Swap" />
//               <span>Swap</span>
//             </div>
//             <div className={styles.button}>
//               <img src="icon/receive.svg" alt="Receive" />
//               <span>Receive</span>
//             </div>
//             <div className={styles.button}>
//               <img src="icon/send.svg" alt="Send" />
//               <span>Send</span>
//             </div>
//             <div className={styles.button}>
//               <img src="icon/buy.svg" alt="Buy" />
//               <span>Buy</span>
//             </div>
//           </div>
//           {/* Close button */}
//           <button className={styles.closeButton} onClick={handleClose}>
//             <img src="icon/close.svg" alt="Close" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
