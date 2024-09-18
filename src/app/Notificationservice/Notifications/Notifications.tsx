// Notifications.tsx
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import router from 'next/router';

interface Notification {
    content: string;
    created_at: string;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    // const [userId, setUserId] = useState<string | null>(null);
    // const [walletId, setwalletId] = useState<string | null>(null);
    const [userId] = useState<string>('DupC0015');
    const [walletId] = useState<string>('Wa0000000002'); // Hardcoded wallet_id
    const [loading, setLoading] = useState(true); 
    const router = useRouter();

    useEffect(() => {
        // if (typeof window !== 'undefined') {
        //     const sessionDataString = window.localStorage.getItem('session_data');
        //     if (sessionDataString) {
        //         const sessionData = JSON.parse(sessionDataString);
        //         const storedUserId = sessionData.user_id;
        //         setUserId(storedUserId);
        //         const storewalletId = sessionData.wallet_id;
        //         setwalletId(storewalletId);
        //     } else {
        //         router.push('/Userauthentication/SignIn'); 
        //     }
        // }
    }, [router]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userId) { 
                setLoading(true); 
                try {
                    const response = await axios.get(`http://localhost:8000/notificationsapi/fetch-notifications/?user_id=${userId}&wallet_id=${walletId}`);
                    setNotifications(response.data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                } finally {
                    setLoading(false); 
                }
            }
        };

        fetchNotifications();
    }, [userId, walletId]);

    const handleBackClick = () => {
        setLoading(true); 
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard')
            setLoading(false); 
        }, 1000);
    };

    return (
        <div className="container">
            {loading ? (
                <div className="loaderContainer">
                    <div className="loader"></div>
                </div>
            ) : (
                <>
                    <div className="header">
                        <button className="backButton" onClick={handleBackClick}>
                            <ArrowBackIcon />
                        </button>
                        <h1 className="heading">Notifications</h1>
                    </div>
                    <div className="notificationList">
                        {notifications.map((notif, index) => (
                            <div key={index} className="card">
                                <p className="content">{notif.content}</p>
                                <p className="timestamp">{notif.created_at}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
