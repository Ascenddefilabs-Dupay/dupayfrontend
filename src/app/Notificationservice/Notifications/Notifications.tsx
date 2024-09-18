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
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Set initial state to true to show loader initially
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId = sessionData.user_id;
                setUserId(storedUserId);
            } else {
                router.push('/Userauthentication/SignIn'); // Redirect if no session data
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userId) { // Only fetch if userId is not null
                setLoading(true); // Set loading to true before fetching
                try {
                    const response = await axios.get(`http://localhost:8000/notificationsapi/fetch-notifications/?user_id=${userId}`);
                    setNotifications(response.data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                } finally {
                    setLoading(false); // Always hide loader after fetch attempt
                }
            }
        };

        fetchNotifications();
    }, [userId]); // Fetch notifications only when userId is available

    const handleBackClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard')
            setLoading(false); // Hide loading text after delay
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

