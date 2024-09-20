// import type { NextPage } from 'next';
// import styles from './personaldetails.module.css';

// interface FormData {
// 	firstName: string;
// 	lastName: string;
//   }

// const PersonalDetails:NextPage = () => {
// 		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		  const { name, value } = e.target;
// 		  setFormData((prevData) => ({
// 			...prevData,
// 			[name]: value,
// 		  }));
// 		};

//   	return (
//     		<div className={styles.personalDetails}>
//       			<div className={styles.frameParent}>
//         				<div className={styles.frameWrapper}>
//           					<div className={styles.frameGroup}>
//             						<div className={styles.frameContainer}>
//               							<div className={styles.dupayLogoParent}>
//                 								<img className={styles.dupayLogoIcon} alt="" src="/DupayAnimation.png" />
//                 								<b className={styles.dupay}>Dupay</b>
//               							</div>
//             						</div>
//             						<div className={styles.frameDiv}>
//               							<div className={styles.frameWrapper}>
//                 								<div className={styles.title}>Welcome</div>
//                 								<div className={styles.title1}>Anuroop Nair</div>
//               							</div>
//               							<div className={styles.title2}>Update your personal details before creating a wallet</div>
//             						</div>
//           					</div>
//         				</div>
//         				<div className={styles.frameParent1}>
//           					<div className={styles.inputinputParent}>
//             						<div className={styles.inputinput}>
//               							<div className={styles.label}>First name</div>
//               							{/* <div className={styles.text}>Anuroop</div> */}
// 										  <input type="text" name="firstName" value={formData.firstName}
// 											onChange={handleChange}
// 											className={styles.input} className={styles.input}
// 											required
// 										/>
//             						</div>
//             						<div className={styles.inputinput}>
//               							<div className={styles.label}>Last name</div>
//               							{/* <div className={styles.text}>Nair</div> */}
// 										<input type="text" name="lastName" 
// 										value={formData.firstName}
// 										onChange={handleChange}
// 										className={styles.input}
// 										className={styles.input}
// 											required
// 										/>
//             						</div>
//             						<div className={styles.inputinput2}>
//               							<div className={styles.label2}>Mobile number</div>
//             						</div>
//             						<div className={styles.inputinput3}>
//               							<div className={styles.label3}>Date of birth</div>
//               							<img className={styles.iconcalendar} alt="" src="icon/calendar.svg" />
//             						</div>
//             						<div className={styles.inputinput2}>
//               							<div className={styles.label2}>{`Address line 1 `}</div>
//             						</div>
//             						<div className={styles.inputinput2}>
//               							<div className={styles.label2}>Address line 2 (Optional)</div>
//             						</div>
//             						<div className={styles.inputinput2}>
//               							<div className={styles.label2}>State/Region</div>
//             						</div>
//             						<div className={styles.inputinput2}>
//               							<div className={styles.label2}>City</div>
//             						</div>
//             						<div className={styles.inputinput2}>
//               							<div className={styles.label2}>Postal/Zip code</div>
//             						</div>
//             						<div className={styles.inputinput2}>
//               							<div className={styles.label2}>Country</div>
//             						</div>
//           					</div>
//           					<div className={styles.listmbListItemBasic}>
//             						<div className={styles.listmbListItemitemLeft}>
//               							<img className={styles.iconfaceid} alt="" src="icon/faceID.svg" />
//               							<div className={styles.title3}>Enable Face ID?</div>
//                 								</div>
//                 								<div className={styles.swichswitch}>
//                   									<div className={styles.swichswitchChild} />
//                 								</div>
//                 								</div>
//                 								</div>
//                 								</div>
//                 								<div className={styles.btnmbBtnFab}>
//                   									<div className={styles.btnbtn}>
//                     										<div className={styles.label2}>Update and create wallet</div>
//                   									</div>
//                 								</div>
//             </div>);
//               							};
              							
//               							export default PersonalDetails;
              							
"use client";
import { useState } from 'react';
import type { NextPage } from 'next';

import styles from './personaldetails.module.css';

interface FormData {
  firstName: string;
  lastName: string;
}

const PersonalDetails: NextPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: 'Anuroop', // Initial value
    lastName: 'Nair',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className={styles.personalDetails}>
      <header>
        <link href="https://fonts.googleapis.com/css?family=Poppins;
" rel="stylesheet" />
      </header>
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.frameContainer}>
              <div className={styles.dupayLogoParent}>
                <img className={styles.dupayLogoIcon} alt="" src="/DupayAnimation.png" />
                <b className={styles.dupay}>Dupay</b>
              </div>
            </div>
            <div className={styles.frameDiv}>
              <div className={styles.frameWrapper}>
                <div className={styles.title}>Welcome</div>
              </div>
              <div className={styles.title2}>
                Update your personal details before creating a wallet
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frameParent1}>
          <div className={styles.inputinputParent}>
          <div className={styles.inputinput}>
              <div className={styles.label}>First name</div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputinput}>
                <div className={styles.label}>Last name</div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputinput2}>
                <div className={styles.label2}>Mobile number</div>
              </div>
              <div className={styles.inputinput3}>
                <div className={styles.label3}>Date of birth</div>
                <img className={styles.iconcalendar} alt="" src="/calender.png" />
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
              <img className={styles.iconfaceid} alt="" src="/FaceId.png" />
				<div className={styles.title3}>Enable Face ID?</div>
            </div>
            <div className={styles.swichswitch}>
              
              <div className={styles.swichswitchChild} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.btnmbBtnFab}>
        <div className={styles.btnbtn}>
          <div className={styles.label2}>Update and create wallet</div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
