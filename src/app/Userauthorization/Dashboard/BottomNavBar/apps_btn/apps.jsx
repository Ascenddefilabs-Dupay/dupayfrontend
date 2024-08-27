// 'use client';
// import { useRouter } from 'next/navigation';
// import styles from './apps.module.css'

// const Apps = () => {
//   const router = useRouter();

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.header}>Apps</h1>
//       <div className={styles.contentBox}>
//         <p>No Apps found</p>
//       </div>
//     </div>
//   );
// };

//  export default Apps;

'use client';

import styles from './apps.module.css'; // Adjust the path as needed
import { useRouter } from 'next/navigation';

const Apps = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Apps</h1>
      <div className={styles.content}>
        <p>No Apps found</p>
      </div>
    </div>
  );
};

export default Apps;
