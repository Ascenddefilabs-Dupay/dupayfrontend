"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, Box, Modal, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaClock, FaFileAlt, FaCog } from 'react-icons/fa';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';

const StyledContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '1rem',
    backgroundColor: '#000000',
    borderRadius: '8px',
    color: '#FFFFFF',
    width: '428px',
    height:'auto', // Adjust height for additional content
    minHeight: '100vh' ,
    overflowY: 'auto',  // Adjust height for additional content
    scrollbarWidth: 'none', // For Firefox
    padding:'20px',
});

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1rem', // Adjusted for spacing
    },
    manage: {
        fontSize: '1.3rem',
        color: '#FFFFFF',
        marginLeft: '1px', // Ensure it starts from the left with some margin
    },
    privacyOptions: {
        width: '100%', // Ensure full width for consistent layout
        flexGrow: 1, // Allow the main content to grow and take available space
        overflowY: 'auto', // Add vertical scrolling if needed
        paddingBottom: '1rem', // Add padding at the bottom for better spacing
    },
    privacyCard: {
        margin: '6px 0', // Adjusted for consistent gap between cards
        backgroundColor: '#1f1f1f',
        cursor: 'pointer',
        border: '1px solid transparent', // Remove border for unselected cards
        transition: 'border-color 0.3s',
        color: '#FFFFFF',
    },
    active: {
        border: '1px solid #1E88E5',
    },
    cardTitle: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.85rem',
    },
    recommended: {
        color: '#1E88E5',
        fontSize: '0.75rem',
        marginLeft: '5px',
    },
    description: {
        color: '#9E9E9E', // Set the desired text color here
        marginLeft: '1px',
        fontSize: '0.85rem',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 'auto',
        width: '100%',
    },
    footerItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        color: '#FFFFFF', // Text color for the footer items
    },
    modal: {
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#FFFFFF',
        backgroundColor: '#000000',
        padding: '16px',
        border: '1px solid #000000',
        width: '320px',
    },
};

const BackArrow = styled(FaArrowLeft)({
    cursor: 'pointer',
    color: '#FFFFFF',
    fontSize: '1.0rem', // Adjust size as needed
    marginRight: '1rem', // Adjust spacing from the text
});

const ManagePrivacy = () => {
    const [isPublic, setIsPublic] = useState(true);
    const [open, setOpen] = useState(false);
    const [close, setClose] = useState(false);
    const [error, setError] = useState(false);
    const userId = 'dupC0029'; // Replace with sessionStorage['first_name'] or appropriate user ID retrieval
    const router = useRouter(); // Initialize useRouter

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/profile/${userId}/`);
            setIsPublic(response.data.profile_privacy === 'public');
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleToggle = (publicStatus) => {
        setIsPublic(publicStatus);
        axios.patch(`http://localhost:8000/api/profile/${userId}/`, { profile_privacy: publicStatus ? 'public' : 'private' })
            .then(response => {
                console.log('Privacy updated successfully', response.data);
                setClose(true);
                
            })
            .catch(error => {
                console.error('Error updating privacy', error);
                setError(true);
                
            });
        setOpen(true);
    };

    const handleOpen = () => setOpen(false);
    const handleClose = () => setClose(false);
    const handleError = () => setError(false);

    return (
        <div className={styles.pageWrapper}>
        <StyledContainer>
            <header style={styles.header}>
                <Link href="/Manageprofile">
                <BackArrow />

                </Link>
            </header>
            <Box display="flex" justifyContent="flex-start" width="100%">
                <Typography variant="h5" gutterBottom>
                    Manage Privacy
                </Typography>
            </Box>
            <Box style={styles.privacyOptions}>
                <Card
                    style={{ ...styles.privacyCard, ...(isPublic ? styles.active : {}) }}
                    onClick={() => handleToggle(true)}
                >
                    <CardContent>
                        <Typography variant="h6" style={styles.cardTitle}>
                            Public <span style={styles.recommended}>Recommended</span>
                        </Typography>
                        <Typography variant="body2" style={styles.description}>
                            Anyone can search for your username and see your profile details.
                        </Typography>
                    </CardContent>
                </Card>
                <Card
                    style={{ ...styles.privacyCard, ...(!isPublic ? styles.active : {}) }}
                    onClick={() => handleToggle(false)}
                >
                    <CardContent>
                        <Typography variant="h6" style={styles.cardTitle}>Private</Typography>
                        <Typography variant="body2" style={styles.description}>
                            Your username and profile details will be hidden from public view.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            
            <ToastContainer />
            <Modal open={open} onClose={handleOpen}>
                <Box style={styles.modal}>
                    <Typography variant="h6" component="h2">
                        Privacy updated
                    </Typography>
                    <Button onClick={handleOpen}>Ok</Button>
                </Box>
            </Modal>
            <Modal open={close} onClose={handleClose}>
                <Box style={styles.modal}>
                    <Typography variant="h6" component="h2">
                    Privacy updated successfully
                    </Typography>
                    <Button onClick={handleClose}>Ok</Button>
                </Box>
            </Modal>
            <Modal open={error} onClose={handleError}>
                <Box style={styles.modal}>
                    <Typography variant="h6" component="h2">
                        Error updating privacy
                    </Typography>
                    <Button onClick={handleError}>Ok</Button>
                </Box>
            </Modal>
        </StyledContainer>
        </div>
    );
};

export default ManagePrivacy;
