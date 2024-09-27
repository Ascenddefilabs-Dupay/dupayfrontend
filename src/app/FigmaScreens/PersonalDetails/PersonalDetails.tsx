"use client";
import type { NextPage } from 'next';
import styles from './PersonalDetails.module.css';


const PersonalDetails:NextPage = () => {
  	return (
    		<div className={styles.personalDetails}>
      			<div className={styles.frameParent}>
        				<div className={styles.frameWrapper}>
          					<div className={styles.frameGroup}>
            						<div className={styles.frameContainer}>
              							<div className={styles.dupayLogoParent}>
                								<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075056/Dupaylogo_yzcput.png" />
                								<b className={styles.dupay}>Dupay</b>
              							</div>
            						</div>
            						<div className={styles.frameDiv}>
              							<div className={styles.frameWrapper}>
                								<div className={styles.title}>Welcome</div>
                								<div className={styles.title1}>Anuroop Nair</div>
              							</div>
              							<div className={styles.title2}>Update your personal details before creating a wallet</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.frameParent1}>
          					<div className={styles.inputinputParent}>
            						<div className={styles.inputinput}>
              							<div className={styles.label}>First name</div>
              							<div className={styles.text}>Anuroop</div>
            						</div>
            						<div className={styles.inputinput}>
              							<div className={styles.label}>Last name</div>
              							<div className={styles.text}>Nair</div>
            						</div>
            						<div className={styles.inputinput2}>
              							<div className={styles.label2}>Mobile number</div>
            						</div>
            						<div className={styles.inputinput3}>
              							<div className={styles.label3}>Date of birth</div>
              							<img className={styles.iconcalendar} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727342723/90fbaa93-5fb2-4728-aa23-59be2ef628a1.png" />
            						</div>
            						<div className={styles.inputinput2}>
              							<div className={styles.label2}>{`Address line 1 `}</div>
            						</div>
            						<div className={styles.inputinput2}>
              							<div className={styles.label2}>Address line 2 (Optional)</div>
            						</div>
            						<div className={styles.inputinput2}>
              							<div className={styles.label2}>State/Region</div>
            						</div>
            						<div className={styles.inputinput2}>
              							<div className={styles.label2}>City</div>
            						</div>
            						<div className={styles.inputinput2}>
              							<div className={styles.label2}>Postal/Zip code</div>
            						</div>
            						<div className={styles.inputinput2}>
              							<div className={styles.label2}>Country</div>
            						</div>
          					</div>
          					<div className={styles.listmbListItemBasic}>
            						<div className={styles.listmbListItemitemLeft}>
              							<img className={styles.iconfaceid} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727342899/41f2e8b8-8692-4b98-9cd3-d3508baf1f3c.png" />
              							<div className={styles.title3}>Enable Face ID?</div>
                								</div>
                								<div className={styles.swichswitch}>
                  									<div className={styles.swichswitchChild} />
                								</div>
                								</div>
                								</div>
                								</div>
                								{/* <div className={styles.systembar}>
                  									<div className={styles.google}>Google</div>
                  									<div className={styles.systembarChild} />
                  									<div className={styles.systembarItem} />
                  									<img className={styles.systembarInner} alt="" src="Ellipse 2.svg" />
                  									<img className={styles.vectorIcon} alt="" src="Vector 1.svg" />
                  									<img className={styles.unionIcon} alt="" src="Union.svg" />
                								</div> */}
                								<div className={styles.btnmbBtnFab}>
                  									<div className={styles.btnbtn}>
                    										<div className={styles.label2}>Update and create wallet</div>
                  									</div>
                								</div>
                								</div>);
              							};
              							
              							export default PersonalDetails;
              							