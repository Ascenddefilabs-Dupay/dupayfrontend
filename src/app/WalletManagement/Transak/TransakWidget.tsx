'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const TransakWidget: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    dob: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postCode: '',
    countryCode: '',
    email: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setUserId(storedUserId);
        console.log(storedUserId);
        console.log(sessionData.user_email);

        // Fetch user data from the backend
        fetchUserData(storedUserId);
      } else {
        // router.push('/Userauthentication/SignIn');
      }
    }
  }, [router]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/walletmanagementapi/user/${userId}/`);
      if (response.ok) {
        const data = await response.json();
        setUserData({
          firstName: data.user_first_name,
          lastName: data.user_last_name,
          mobileNumber: data.user_phone_number,
          dob: data.user_dob,
          addressLine1: data.user_address_line_1,
          addressLine2: data.user_address_line_2,
          city: data.user_city,
          state: data.user_state,
          postCode: data.user_pin_code,
          countryCode: data.user_country,
          email: data.user_email,
        });
        console.log("Fetched user data", data.user_dob);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const buyCryptoBtn = document.getElementById('buyCryptoBtn') as HTMLButtonElement;
    const transakContainer = document.getElementById('transakContainer') as HTMLDivElement;
    const transakIframe = document.getElementById('transakIframe') as HTMLIFrameElement;

    const walletAddress = '0x10db6182bc1a8234dd848b4f188cb00395f34a24374035b3688c3022ead89cda';

    buyCryptoBtn.addEventListener('click', () => {
      setLoading(true);
      window.location.href = '/Userauthorization/Dashboard';
    });
    buyCryptoBtn.style.display = 'block';
    transakContainer.style.display = 'block';

    if (userData.firstName && userData.lastName && userData.email && userData.dob && userData.mobileNumber && userData.email && userData.addressLine1 && userData.addressLine2 && userData.city && userData.state && userData.postCode && userData.countryCode != 'null') {

      transakIframe.src = `https://global-stg.transak.com/?apiKey=a413d789-c5cf-4955-ae22-ff724c620d36&environment=staging&cryptoCurrencyCode=SUI&walletAddress=${walletAddress}&userData=%7B%22firstName%22%3A%22${userData.firstName}%22%2C%22lastName%22%3A%22${userData.lastName}%22%2C%22email%22%3A%22${userData.email}%22%2C%22mobileNumber%22%3A%22${userData.mobileNumber}%22%2C%22dob%22%3A%22${userData.dob}%22%2C%22address%22%3A%7B%22addressLine1%22%3A%22${userData.addressLine1}%22%2C%22addressLine2%22%3A%22${userData.addressLine2}%22%2C%22city%22%3A%22${userData.city}%22%2C%22state%22%3A%22${userData.state}%22%2C%22postCode%22%3A%22${userData.postCode}%22%2C%22countryCode%22%3A%22${userData.countryCode}%22%7D%7D`;
    }else{
      transakIframe.src = `https://global-stg.transak.com/?apiKey=a413d789-c5cf-4955-ae22-ff724c620d36&environment=staging&cryptoCurrencyCode=SUI&walletAddress=${walletAddress}&email=${userData.email}`;
    }
    const iframeWindow = transakIframe.contentWindow;
    window.addEventListener('message', (message) => {
      if (message.source !== iframeWindow) return;

      if (message?.data?.event_id === 'TRANSAK_ORDER_SUCCESSFUL') {
        // Handle order success
      }
    });
  }, [userData]);

  return (
    <div style={{ height: '100vh', display: 'grid', margin: 'auto', padding: '20px', maxWidth: '430px', backgroundColor: 'Black' }}>
      <button
        id="buyCryptoBtn"
        style={{
          display: 'none',
          justifyContent: 'left',
          padding: '0',
          fontSize: '18px',
          color: 'white',
          cursor: 'pointer',
          width: '20px',
        }}
      >
        <FaArrowLeft />
      </button>

      <div
        id="transakContainer"
        style={{
          display: 'none',
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          height: '80vh',
          marginTop: '20px',
          boxShadow: '0 0 15px #1461db',
          borderRadius: '15px',
          overflow: 'hidden',
        }}
      >
        <iframe
          id="transakIframe"
          src=""
          allow="camera;microphone;payment"
          style={{ height: '100%', width: '100%', border: 'none', maxWidth: '438px' }}
        ></iframe>
      </div>
    </div>
  );
};

export default TransakWidget;
