// 'use client'
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import styles from './TransakForm.module.css';
// import ProgressBar from '../kycform1/ProgressBar';

// const TransakForm = () => {
//   const [formData, setFormData] = useState({
//     investment: false,
//     nfts: false,
//     web3: false,
//   });

//   const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
//   const router = useRouter();

//   const handleChange = (event) => {
//     const { name, checked } = event.target;
//     setFormData((prevData) => {
//       const newFormData = { ...prevData, [name]: checked };
//       const atLeastOneChecked = newFormData.investment || newFormData.nfts || newFormData.web3;
//       setIsSubmitEnabled(atLeastOneChecked);
//       return newFormData;
//     });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     axios.post('http://localhost:8000/api/kyc-details/', formData)
//       .then(response => {
//         console.log(response.data);
//         router.push('/KycVerification/kycform1');
//       })
//       .catch(error => {
//         console.error('There was an error!', error);
//       });
//   };

//   useEffect(() => {
//     setIsSubmitEnabled(formData.investment || formData.nfts || formData.web3);
//   }, [formData]);

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <form className={styles.form} onSubmit={handleSubmit}>
//           <h1 className={styles.h1}>Purpose of Transak</h1>
//           <ProgressBar step={2} totalSteps={3} />
//           <h3 className={styles.h3}>What's your purpose for using Transak?</h3>
//           <div className={styles.card1}>
//             <label className={styles.label1}>
//               <input className={styles.input}
//                 type="checkbox"
//                 name="investment"
//                 checked={formData.investment}
//                 onChange={handleChange}
//               />
//               Buying/selling crypto for investments
//             </label>
//           </div>
//           <div className={styles.card1}>
//             <label className={styles.label1}>
//               <input className={styles.input}
//                 type="checkbox"
//                 name="nfts"
//                 checked={formData.nfts}
//                 onChange={handleChange}
//               />
//               Buying NFTs
//             </label>
//           </div>
//           <div className={styles.card1}>
//             <label className={styles.label1}>
//               <input className={styles.input}
//                 type="checkbox"
//                 name="web3"
//                 checked={formData.web3}
//                 onChange={handleChange}
//               />
//               Buying crypto to use a web3 protocol
//             </label>
//           </div>
//           <div className={styles['button-sub']}>
//             <button
//               className={styles.button1}
//               type="submit"
//               disabled={!isSubmitEnabled}
//             >
//               Next
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TransakForm;



'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './TransakForm.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TransakForm = () => {
  const [formData, setFormData] = useState({
    investment: false,
    nfts: false,
    web3: false,
  });

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const router = useRouter();

  const settinghandleBackClick = () => {
    let redirectUrl = 'http://localhost:3000/KycVerification/PersonalDetails';
    router.push(redirectUrl);
  };

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: checked };
      const atLeastOneChecked = newFormData.investment || newFormData.nfts || newFormData.web3;
      setIsSubmitEnabled(atLeastOneChecked);
      return newFormData;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://https://kycverification-ind-255574993735.asia-south1.run.app/kycverification_api/kyc-details/', formData)
      .then(response => {
        console.log(response.data);
        router.push('/KycVerification/kycform1');
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  useEffect(() => {
    setIsSubmitEnabled(formData.investment || formData.nfts || formData.web3);
  }, [formData]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ArrowBackIcon className={styles.setting_back_icon} onClick={settinghandleBackClick} />
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.h1}>Purpose of Transak</h1>
          <h3 className={styles.h3}>What is your purpose for using Transak?</h3>
          <div className={styles.card1}>
            <label className={styles.label1}>
              <input className={styles.input}
                type="checkbox"
                name="investment"
                checked={formData.investment}
                onChange={handleChange}
              />
              Buying/selling crypto for investments
            </label>
          </div>
          <div className={styles.card1}>
            <label className={styles.label1}>
              <input className={styles.input}
                type="checkbox"
                name="nfts"
                checked={formData.nfts}
                onChange={handleChange}
              />
              Buying NFTs
            </label>
          </div>
          <div className={styles.card1}>
            <label className={styles.label1}>
              <input className={styles.input}
                type="checkbox"
                name="web3"
                checked={formData.web3}
                onChange={handleChange}
              />
              Buying crypto to use a web3 protocol
            </label>
          </div>
          <div className={styles['button-sub']}>
            <button
              className={styles.button1}
              type="submit"
              disabled={!isSubmitEnabled}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransakForm;
