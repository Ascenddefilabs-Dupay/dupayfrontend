'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './productannouncement.module.css';
import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';


const ProductAnnouncement: React.FC = () => {
  const [userId, setUserId] = useState<string>('');

  // Function to send a browser notification
  const sendNotification = (title: string, message: string, icon: string, link: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: icon,
      });

      notification.onclick = () => {
        window.open(link, '_blank');
      };
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          alert('Notification permissions are not granted. Please enable them in your browser settings.');
        }
      });
    }
  };

  const createProductAnnouncementNotification = () => {
    if (!userId) {
      alert("User ID is not available.");
      return;
    }

    axios.post('http://notificationservice-ind-255574993735.asia-south1.run.app/productannouncementapi/create-product-announcement/', {
      user_id: userId,  // Pass user ID dynamically
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        const message = response.data.product_announcement_content;  // Use the dynamic content from the backend
        sendNotification('Product Announcement', message, 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1725254311/logo3_ln9n43.png', 'https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to create product announcement notification.');
      });
  };

  useEffect(() => {
    requestNotificationPermission();

    axios.get('http://notificationservice-ind-255574993735.asia-south1.run.app/productannouncementapi/get-product-announcement-user-ids/')
      .then(response => {
        const userIds = response.data.user_ids;
        if (userIds && userIds.length > 0) {
          setUserId(userIds[0]);  // Set the first user ID
        } else {
          alert('No users with product announcement enabled.');
        }
      })
      .catch(error => {
        console.error('Error fetching user IDs:', error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className="main">
        <header className={styles.header}>
          <Link href="/Notificationservice/AdminNotificationScreen">
            <FaArrowLeft  style={{position: 'relative' ,right:'10px', color: 'white'}} />
          </Link>
          <center>
            <div className="centeredBox">
              <Typography variant="h4" gutterBottom>
                Product Announcement Notification
              </Typography>
            </div>
            <button
              onClick={createProductAnnouncementNotification}
              className={styles.button}
            >
              Trigger Product Announcement Notification
            </button>
            <h6 className={styles.messagetext}>Needs to trigger the Product Announcement Notification users will get the Notification.</h6>
          </center>
        </header>
      </div>
    </div>
  );
};

export default ProductAnnouncement;
