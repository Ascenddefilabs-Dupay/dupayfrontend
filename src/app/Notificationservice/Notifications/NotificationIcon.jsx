import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Fetch the unread notification count when the component mounts
    axios.get('/notifications/unread-count/')
      .then(response => {
        setUnreadCount(response.data.unread_count);
      })
      .catch(error => {
        console.error('Error fetching unread count:', error);
      });
  }, []);

  const handleIconClick = () => {
    // Redirect to the notification list page
    router.push('/app/Notificationservice/Notifications');
  };

  return (
    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleIconClick}>
      <img src="/path-to-your-notification-icon.png" alt="Notifications" />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px'
        }}>
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
