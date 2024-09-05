// // ProgressBar.js
// import React from 'react';
// import styles from './ProgressBar.module.css';

// const ProgressBar = ({ step, totalSteps }) => {
//   const percentage = (step / totalSteps) * 100;

//   return (
//     <div className={styles.progressWrapper}>
//       <div className={styles.progressContainer}>
//         <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
//       </div>
//       <div className={styles.progressText}>KYC STEP {step}/{totalSteps}</div>
//     </div>
//   );
// };

// export default ProgressBar;



import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => {
  const percentage = (step / totalSteps) * 100;

  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className={styles.progressText}>KYC STEP {step}/{totalSteps}</div>
    </div>
  );
};

export default ProgressBar;
