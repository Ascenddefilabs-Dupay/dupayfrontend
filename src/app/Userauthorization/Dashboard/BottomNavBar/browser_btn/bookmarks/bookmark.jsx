"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGlobe, faEllipsisV, faWindowRestore, faHome, faChevronLeft, faChevronRight, faClock, faBookmark, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const buypage = () => {

    const router = useRouter();

    const handleBackClick = () => {
        console.log('Back button clicked');
        router.push('/Userauthorization/Dashboard/BottomNavBar/browser_btn')
      };
  return (
    <div>
      <div style={{backgroundColor: 'black', width: '400px',margin: '0 auto', height: '100vh', display: 'flex', color: 'white', borderRadius: '12px'}}>
      <div >
        <IconButton className="backarrow" onClick={handleBackClick} sx={{ color: 'white' }}>
            <ArrowBackIcon />
        </IconButton>
        Bookmarks page
       
        <button style={{position: 'relative', left: '200px'}}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>

        <div style={{position: 'relative' , top: '125px',}}>  

            <img src="/bookmark_image.jpg" alt="" style={{position: 'relative',height: '100px',width: '180px', left: '100px', bottom: '10px'}}/>
        <p style={{marginLeft: '125px'}}>No bookmarks yet </p>
        <p style={{color: 'gray', marginLeft: '65px'}}>
            To add a bookmark,tap the  ⁝  menu in 
        </p>
        <p style={{color: 'gray', marginLeft: '150px'}}>
            your browser.
        </p>
      </div>
       
      </div>
     
     
     
      </div>
     
    </div>
  )
}

export default buypage
