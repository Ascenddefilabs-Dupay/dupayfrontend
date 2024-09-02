"use client";

import React, { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Buypage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleBackClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard'); // Navigate after delay
        }, 500); // Adjust delay if needed
    };

    return (
        <div>
            <div style={{ padding: '20px', backgroundColor: 'black', width: '400px', margin: '0 auto', height: '100vh', display: 'flex', color: 'white', borderRadius: '12px', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                {loading ? (
                    <div style={{ color: 'white', fontSize: '18px' }}>
                        Loading...
                    </div>
                ) : (
                    <>
                        <div>
                            <IconButton className="backarrow" onClick={handleBackClick} sx={{ color: 'white' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            Crypto wallet
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(Buypage);



// "use client";

// import React, { useState, useEffect, memo } from 'react';
// import { useRouter } from 'next/navigation';
// import { IconButton } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const Buypage = () => {
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         setLoading(true);
//         // Simulate loading time
//         const timer = setTimeout(() => {
//             setLoading(false);
//         }, 2000);

//         return () => clearTimeout(timer); // Cleanup the timer on unmount
//     }, []);

//     const handleBackClick = (destination) => {
//         console.log('Back button clicked');
//         router.push(destination); // Navigate to the specified destination
//     };

//     return (
//         <div>
//             <div style={{ padding: '20px', backgroundColor: 'black', width: '400px', margin: '0 auto', height: '100vh', display: 'flex', color: 'white', borderRadius: '12px' }}>
//                 {loading ? (
//                     <div>
//                         <p>Loading...</p>
//                     </div>
//                 ) : (
//                     <>
//                         <div>
//                             <IconButton className="backarrow" onClick={() => handleBackClick('/Userauthorization/Dashboard')} sx={{ color: 'white' }}>
//                                 <ArrowBackIcon />
//                             </IconButton>
//                             Crypto wallet
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default memo(Buypage);
