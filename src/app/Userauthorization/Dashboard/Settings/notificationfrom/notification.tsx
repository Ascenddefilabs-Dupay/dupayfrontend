'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../notificationfrom/notification_set.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Switch } from '@mui/material';
import axios from 'axios';
const SecurityManagement = process.env.NEXT_PUBLIC_SecurityManagement
const Notification = () => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const sessionDataString = window.localStorage.getItem('session_data');
          if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            const storedUserId = sessionData.user_id;
            setUserId( storedUserId);
            console.log(storedUserId);
            console.log(sessionData.user_email);
          } else {
            // redirect('http://localhost:3000/Userauthentication/SignIn');
          }
        }
      }, []);
    const [notificationSettings, setNotificationSettings] = useState({
        product_announcement: true,
        insights_tips: true,
        special_offers: true,
        price_alerts: true,
        account_activity: true,
        messages: true,
    });

    const router = useRouter();
    

    const handleNotificationChange = async (field: string, value: boolean) => {
        const updatedSettings = {
            ...notificationSettings,
            [field]: value,
        };

        setNotificationSettings(updatedSettings);

        try {
            // await axios.post('http://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/notification/', updatedSettings, {
            // await axios.post('http://127.0.0.1:8000/userauthorizationapi/notification/', updatedSettings, {
                
                
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });
            await axios.post(`${SecurityManagement}/passwordapi/notification/`, {
                product_announcement: true,
                insights_tips: true,
                special_offers: true,
                price_alerts: true,
                account_activity: true,
                messages: true,
                userId: userId,
            });
            console.log(userId);
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };

    const notificationhandleBackClick = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings';
        router.push(redirectUrl);
    };

    return (
        <div className="notification_card">
            <div className="notification_header">
                <ArrowBackIcon className="notify_icon" onClick={notificationhandleBackClick} />
                <span>Notifications</span>
            </div>
            <div className="production_tab">
                <button className='production_button'>
                    <div className="productioninfo">
                        <span className="announcement_tab">Product Announcement</span>
                        <span className="announcement_discription">Be the first to learn about our newest features</span>
                    </div>
                    <label className="production_switch">
                        <Switch
                            checked={notificationSettings.product_announcement}
                            onChange={(e) => handleNotificationChange('product_announcement', e.target.checked)}
                        />
                    </label>
                </button>
            </div>
            <div className="insights_tab">
                <button className='insights_button'>
                    <div className="insight_info">
                        <span className="tips_tab">Insights and tips</span>
                    </div>
                    <label className="instight_switch">
                        <Switch
                            checked={notificationSettings.insights_tips}
                            onChange={(e) => handleNotificationChange('insights_tips', e.target.checked)}
                        />
                    </label>
                </button>
            </div>
            <div className="special_tab">
                <button className='special_button'>
                    <div className="special_info">
                        <span className="special_tab">Special offers</span>
                    </div>
                    <label className="special_switch">
                        <Switch
                            checked={notificationSettings.special_offers}
                            onChange={(e) => handleNotificationChange('special_offers', e.target.checked)}
                        />
                    </label>
                </button>
            </div>
            <div className="price_tab">
                <button className='price_button'>
                    <div className="price_info">
                        <span className="alert_tab">Price Alerts</span>
                        <span className="alert_discription">Get notified automatically when there is a big change in the price of an asset</span>
                    </div>
                    <label className="price_switch">
                        <Switch
                            checked={notificationSettings.price_alerts}
                            onChange={(e) => handleNotificationChange('price_alerts', e.target.checked)}
                        />
                    </label>
                </button>
            </div>
            <div className="account_tab">
                <button className='account_button'>
                    <div className="account_info">
                        <span className="account_tab">Account activity</span>
                    </div>
                    <label className="account_switch">
                        <Switch
                            checked={notificationSettings.account_activity}
                            onChange={(e) => handleNotificationChange('account_activity', e.target.checked)}
                        />
                    </label>
                </button>
            </div>
            <div className="message_tab">
                <button className='message_button'>
                    <div className="message_info">
                        <span className="message_tab">Messages</span>
                        <span className="message_discription">Get notified when someone sends you a message</span>
                    </div>
                    <label className="message_switch">
                        <Switch
                            checked={notificationSettings.messages}
                            onChange={(e) => handleNotificationChange('messages', e.target.checked)}
                        />
                    </label>
                </button>
            </div>
        </div>
    );
};

export default Notification;
