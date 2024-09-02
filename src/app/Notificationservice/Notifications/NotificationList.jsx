import { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch all notifications for the user
    axios.get('/notifications/')
      .then(response => {
        setNotifications(response.data.notifications);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  const markAsRead = (notificationId) => {
    axios.post(`/notifications/mark-as-read/${notificationId}/`)
      .then(response => {
        if (response.data.success) {
          // Update the notification status in the state
          setNotifications(notifications.map(notification => 
            notification.notification_id === notificationId
              ? { ...notification, status: true }
              : notification
          ));
        }
      })
      .catch(error => {
        console.error('Error marking notification as read:', error);
      });
  };

  return (
    <div>
      <h2>Your Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.notification_id} style={{ fontWeight: notification.status ? 'normal' : 'bold' }}>
            {notification.message} - {notification.created_at}
            {!notification.status && (
              <button onClick={() => markAsRead(notification.notification_id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
