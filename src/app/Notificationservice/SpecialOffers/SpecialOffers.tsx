'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SpecialOffers: React.FC = () => {
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

  const createSpecialOffersNotification = () => {
    if (!userId) {
      alert("User ID is not available.");
      return;
    }

    axios.post('http://notificationservice-ind-255574993735.asia-south1.run.app/specialoffersapi/create-special-offers/', {
      user_id: userId,  // Pass user ID dynamically
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        const message = response.data.special_offer_content;  // Use the dynamic content from the backend
        sendNotification('Special Offers', message, 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1725254311/logo3_ln9n43.png', 'https://www.specialoffer.inc/');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to create special offers notification.');
      });
  };

  useEffect(() => {
    requestNotificationPermission();

    axios.get('http://notificationservice-ind-255574993735.asia-south1.run.app/specialoffersapi/get-special-offers-user-ids/')
      .then(response => {
        const userIds = response.data.user_ids;
        if (userIds && userIds.length > 0) {
          setUserId(userIds[0]);  // Set the first user ID
        } else {
          alert('No users with special offers enabled.');
        }
      })
      .catch(error => {
        console.error('Error fetching user IDs:', error);
      });
  }, []);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className='text-4xl font-bold'>Special Offers Notification</h1>
        <button
          onClick={createSpecialOffersNotification}
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4'
        >
          Trigger Special Offers Notification
        </button>
      </main>
    </div>
  );
};

export default SpecialOffers;
