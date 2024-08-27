// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import '../securityfrom/securityset.css';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import FormLabel from '@mui/material/FormLabel';
// import { Switch } from '@mui/material';

// const SecurityScreen = () => {
//     const [requiredmode, sethandleMode] = useState(false);
//     const [transmode, sethandletransactionMode] = useState(false);
//     const [isFormVisible, setIsFormVisible] = useState(true);
//     const router = useRouter();

//     const securityhandleBackClick = () => {
//         let redirectUrl = 'http://localhost:3000//Userauthorization/Dashboard/Settings';
//         router.push(redirectUrl);
//     };

//     const securityLockButtonClick = () => {
//         let redirectUrl = 'http://localhost:3000//Userauthorization/Dashboard/Settings/passwordform';
//         router.push(redirectUrl);
//     };

//     const handleRequiredapp = (event) => {
//         sethandleMode(event.target.checked);
//     };

//     const handleaTransaction = (event) => {
//         sethandletransactionMode(event.target.checked);
//     };
//     return (
//         <div className="security_container">
//             <div className="security_card">
//                 <div className="security1">
//                     <ArrowBackIcon className="secrity_icon" onClick={securityhandleBackClick} />
//                     <span className='security_label'>Security</span>
//                 </div>
//                 <label className='backup_label'>Backups</label>
//                 <div className="security2">
//                     <button className='wall_button'>
//                         <div className='wall'>
//                             <span className='wallet_label'>Wallet1</span>
//                             <span className="not-backed-up">Not backed up</span>
//                             <ChevronRightIcon className="wall_icon"/>
//                         </div>
//                     </button>
//                 </div>
//                 <hr style={{ marginTop: '10px', border: '0.1px solid gray'}}/>
//                 <label className='securitylock_label'>Security lock</label>
//                 <div className="security3">
//                     <button className='security_lock_button' onClick={securityLockButtonClick}>
//                         <div className='sec_lock'>
//                             <span className='method_label'>Lock method</span>
//                             <span className="pass_label">Password</span>
//                             <ChevronRightIcon className="pass_icon"/>
//                         </div>
//                     </button>
//                 </div>
//                 <hr style={{ marginTop: '10px', border: '0.1px solid gray'}}/>
//                 <label className='unlock_label'>Require unlock when...</label>
//                 <div className="require_lock">
//                     <button className='open_app'>
//                         <div className="unlock-info">
//                             <span className="opening">Opening the app </span>
//                         </div>
//                             <label className="required_switch">
//                                 {<Switch checked={requiredmode} onChange={handleRequiredapp} />}
//                             </label>
//                     </button>
//                 </div>
//                 <div className="transaction_lock">
//                     <button className='making_app'>
//                         <div className="trans-info">
//                             <span className="make_trans">Making a transaction</span>
//                         </div>
//                             <label className="trans_switch">
//                                 {<Switch checked={transmode} onChange={handleaTransaction} />}
//                             </label>
//                     </button>
//                 </div>
//                 <label className='selected_label'>At least one option must be selected.</label>
//             </div>
//         </div>
//     );
// };

// export default SecurityScreen;








'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../securityfrom/securityset.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormLabel from '@mui/material/FormLabel';
import { Switch } from '@mui/material';

const SecurityScreen = () => {
    const [requiredmode, sethandleMode] = useState(false);
    const [transmode, sethandletransactionMode] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const router = useRouter();

    const securityhandleBackClick = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings';
        router.push(redirectUrl);
    };

    const securityLockButtonClick = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings/passwordform';
        router.push(redirectUrl);
    };

    const handleRequiredapp = (event) => {
        sethandleMode(event.target.checked);
    };

    const handleaTransaction = (event) => {
        sethandletransactionMode(event.target.checked);
    };
    return (
        <div className="security_container">
            <div className="security_card">
                <div className="security1">
                    <ArrowBackIcon className="secrity_icon" onClick={securityhandleBackClick} />
                    <span className='security_label'>Security</span>
                </div>
                <label className='backup_label'>Backups</label>
                <div className="security2">
                    <button className='wall_button'>
                        <div className='wall'>
                            <span className='wallet_label'>Wallet1</span>
                            <span className="not-backed-up">Not backed up</span>
                            <ChevronRightIcon className="wall_icon"/>
                        </div>
                    </button>
                </div>
                <hr style={{ marginTop: '10px', border: '0.1px solid gray'}}/>
                <label className='securitylock_label'>Security lock</label>
                <div className="security3">
                    <button className='security_lock_button' onClick={securityLockButtonClick}>
                        <div className='securitybutton_lock'>
                            <span className='lock_method_label'>Lock method</span>
                            <span className="password_label1">Password</span>
                            <ChevronRightIcon className="pass_icon"/>
                        </div>
                    </button>
                </div>
                <hr style={{ marginTop: '10px', border: '0.1px solid gray'}}/>
                <label className='unlock_label'>Require unlock when...</label>
                <div className="require_lock">
                    <button className='open_app'>
                        <div className="unlock-info">
                            <span className="opening">Opening the app </span>
                        </div>
                            <label className="required_switch">
                                {<Switch checked={requiredmode} onChange={handleRequiredapp} />}
                            </label>
                    </button>
                </div>
                <div className="transaction_lock">
                    <button className='making_app'>
                        <div className="trans-info">
                            <span className="make_trans">Making a transaction</span>
                        </div>
                            <label className="trans_switch">
                                {<Switch checked={transmode} onChange={handleaTransaction} />}
                            </label>
                    </button>
                </div>
                <label className='selected_label'>At least one option must be selected.</label>
            </div>
        </div>
    );
};

export default SecurityScreen;