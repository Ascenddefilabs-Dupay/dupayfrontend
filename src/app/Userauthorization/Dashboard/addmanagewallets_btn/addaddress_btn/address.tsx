'use client';

import {useRouter} from 'next/navigation'
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './address.module.css'

const Addaddress = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/Userauthorization/Dashboard/addmanagewallets_btn')
    }

return(        
    <div className={styles.container}>
        <div className={styles.backButton}>
            <IconButton onClick={handleBackClick} sx={{color: '#fff'}}>
            <ArrowBackIcon />
            </IconButton>
        </div>
        <div className={styles.progressBar}></div>
            <h1 className={styles.heading}>Add an address</h1>
           
            <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933124/Addaddress_koffsx.svg" alt="Center Logo" className= {styles.image}/>
            
            <p className={styles.paragraph}>Each address includes a unique Ethereum and 
                Solana address that belongs to your wallet. 
                You can add up to 15 per wallet. 
                You can import them into other crypto wallets too.</p>

            <button className={styles.continueButton} onClick={() => console.log('continue button is clicked')}>
                Continue</button>        

    </div>
        )
    }
    export default Addaddress;