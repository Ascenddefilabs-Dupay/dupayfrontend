'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InsightsTips: React.FC = () => {
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

  const createInsightsTipsNotification = () => {
    if (!userId) {
      alert("User ID is not available.");
      return;
    }

    axios.post('http://notificationservice-rcfpsxcera-uc.a.run.app/insightstipsapi/create-insights-tips/', {
      user_id: userId,  // Pass user ID dynamically
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        const message = response.data.insights_tips_content;  // Use the dynamic content from the backend
        sendNotification('Insights Tips', message, 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1725254311/logo3_ln9n43.png', 'https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to create insights tips notification.');
      });
  };

  useEffect(() => {
    requestNotificationPermission();

    axios.get('http://notificationservice-rcfpsxcera-uc.a.run.app/insightstipsapi/get-insights-tips-user-ids/')
      .then(response => {
        const userIds = response.data.user_ids;
        if (userIds && userIds.length > 0) {
          setUserId(userIds[0]);  // Set the first user ID
        } else {
          alert('No users with insights tips enabled.');
        }
      })
      .catch(error => {
        console.error('Error fetching user IDs:', error);
      });
  }, []);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className='text-4xl font-bold'>Insights Tips Notification</h1>
        <button
          onClick={createInsightsTipsNotification}
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4'
        >
          Trigger Insights Tips Notification
        </button>
      </main>
    </div>
  );
};

export default InsightsTips;
