'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PriceAlerts: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [priceAlertMessage, setPriceAlertMessage] = useState<string>('');

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

  const fetchPriceAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/pricealertsapi/get-price-alerts-user-ids/');
      const userIds = response.data.user_ids;

      if (userIds && userIds.length > 0) {
        setUserId(userIds[0]);  // Set the first user ID
      } else {
        alert('No users with price alerts enabled.');
      }
    } catch (error) {
      console.error('Error fetching user IDs:', error);
    }
  };

  const pollPriceAlerts = async () => {
    try {
      const response = await axios.post('http://localhost:8000/pricealertsapi/create-price-alerts/', {
        user_id: userId,
      });

      const message = response.data.price_alerts_content;  // Dynamic content from the backend
      if (message) {
        setPriceAlertMessage(message);
        sendNotification('Price Alerts', message, 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1725254311/logo3_ln9n43.png', 'https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages');
      }
    } catch (error) {
      console.error('Error triggering price alerts:', error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    fetchPriceAlerts();

    const interval = setInterval(() => {
      pollPriceAlerts();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className='text-4xl font-bold'>Price Alerts Notification</h1>
        <p>{priceAlertMessage}</p>
      </main>
    </div>
  );
};

export default PriceAlerts;

