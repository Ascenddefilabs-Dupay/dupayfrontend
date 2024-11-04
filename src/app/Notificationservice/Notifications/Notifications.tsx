// Notifications.tsx
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaFilter } from 'react-icons/fa'; // Import filter icon
import { useRouter } from 'next/navigation';
import router from 'next/router';
import { IoIosArrowBack } from "react-icons/io";
import LottieAnimationLoading from '../../assets/LoadingAnimation';

interface Notification {
    content: string;
    created_at: string;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [walletId, setwalletId] = useState<string | null>(null);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]); // State for filtered notifications
    const [filter, setFilter] = useState<string>('All'); // Default filter
    const [showDropdown, setShowDropdown] = useState(false); // For dropdown visibility
    // const [userId] = useState<string>('DupC0015');
    // const [walletId] = useState<string>('Wa0000000002');
    const [loading, setLoading] = useState(true); 
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId = sessionData.user_id;
                setUserId(storedUserId);
                const storewalletId = sessionData.fiat_wallet_id;
                setwalletId(storewalletId);
            } else {
                router.push('/Userauthentication/SignIn');
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userId) {
                setLoading(true);
                try {
                    const response = await axios.get(`https://notificationservice-255574993735.asia-south1.run.app/notificationsapi/fetch-notifications/?user_id=${userId}&wallet_id=${walletId}`);
                    setNotifications(response.data);
                    setFilteredNotifications(response.data); // Initially, show all notifications
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotifications();
    }, [userId, walletId]);

    // Handle filter change
    useEffect(() => {
        if (filter === 'All') {
            setFilteredNotifications(notifications); // Show all notifications
        } else if (filter === 'Transactions') {
            setFilteredNotifications(notifications.filter(notif => notif.content.includes('Transaction'))); // Filter transactions
        } else if (filter === 'Others') {
            setFilteredNotifications(notifications.filter(notif => !notif.content.includes('Transaction'))); // Exclude transactions
        }
    }, [filter, notifications]);

    const handleBackClick = () => {
        setLoading(true);
        router.push('/Userauthorization/Dashboard/Home');
        // setTimeout(() => {
            
        //     setLoading(false);
        // }, 1000);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const selectFilter = (selectedFilter: string) => {
        setFilter(selectedFilter);
        setShowDropdown(false); // Close dropdown after selecting a filter
    };

    return (
        <div className='page'>
        <div className="container">
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: '#17171a'}}>
                {/* Show the Lottie loading animation */}
                <LottieAnimationLoading width="300px" height="300px" />
              </div>
            ) : (
                <>
                    <div className="header">
                        <button className="backButton" onClick={handleBackClick}>
                        <IoIosArrowBack />
                        </button>
                        <h1 className="heading">Notifications</h1>
                        <div className="filterContainer">
                            <FaFilter className="filterIcon" onClick={toggleDropdown} />
                            {showDropdown && (
                                <div className="dropdown">
                                    <button onClick={() => selectFilter('All')}>All</button>
                                    <button onClick={() => selectFilter('Transactions')}>Transactions</button>
                                    <button onClick={() => selectFilter('Others')}>Others</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="notificationList">
                        {filteredNotifications.length === 0 ? (
                            <div className="noNotifications">
                                <img 
                                    src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728452000/NO_NOTIFICATION_1_-removebg-preview_1_-Photoroom_e3xj54.png" 
                                    alt="No Notifications Icon" 
                                    className="noNotificationsIcon"
                                />
                                <p>No Notifications</p>
                            </div>
                        ) : (
                            filteredNotifications.map((notif, index) => (
                                <div key={index} className="card">
                                    <p className="content">{notif.content}</p>
                                    <p className="timestamp">{notif.created_at}</p>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
        </div>
    );
}

