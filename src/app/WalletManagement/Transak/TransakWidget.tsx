'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TransakWidget: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setUserId(storedUserId);
        console.log(storedUserId);
        console.log(sessionData.user_email);
      } else {
        // router.push('/Userauthentication/SignIn');
      }
    }
  }, [router]);

  useEffect(() => {
    const buyCryptoBtn = document.getElementById('buyCryptoBtn') as HTMLButtonElement;
    const transakContainer = document.getElementById('transakContainer') as HTMLDivElement;
    const transakIframe = document.getElementById('transakIframe') as HTMLIFrameElement;

    // buyCryptoBtn.addEventListener('click', () => {
      buyCryptoBtn.style.display = 'none';
      // Show the Transak container
      transakContainer.style.display = 'block';
      

      // Set the Transak iframe src with your API key and any required query parameters
      transakIframe.src = 'https://global-stg.transak.com/?apiKey=a413d789-c5cf-4955-ae22-ff724c620d36&environment=staging';

      // Set up the event listener for messages from the iframe
      const iframeWindow = transakIframe.contentWindow;
      window.addEventListener('message', (message) => {
        if (message.source !== iframeWindow) return;

        // To get all the events
        // console.log('Event ID: ', message?.data?.event_id);
        // console.log('Data: ', message?.data?.data);

        // This will trigger when the user marks payment as made
        if (message?.data?.event_id === 'TRANSAK_ORDER_SUCCESSFUL') {
        //   console.log('Order Data: ', message?.data?.data);
        }
      });
    // });
  }, []);

  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center', margin: 'auto', padding: '20px', maxWidth: '438px', backgroundColor: 'Black'  }}>
      {/* Buy Crypto Button */}
      <button
        id="buyCryptoBtn"
        style={{
          display:'none',
          padding: '10px 20px',
          fontSize: '18px',
          background: 'linear-gradient(90deg, #007bff9f, #800080)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Buy Crypto
      </button>

      {/* Hidden Div for Transak Widget */}
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

      <style jsx>{`
        /* Mobile View */
        @media (max-width: 600px) {
          #transakContainer {
            width: 100%;
            height: 60vh;
            box-shadow: 0 0 10px #1461db;
            border-radius: 10px;
          }

          #buyCryptoBtn {
            padding: 8px 16px;
            font-size: 16px;
          }
        }

        /* Tablet View */
        @media (min-width: 601px) and (max-width: 1024px) {
          #transakContainer {
            width: 100%;
            height: 70vh;
            box-shadow: 0 0 12px #1461db;
            border-radius: 12px;
          }

          #buyCryptoBtn {
            padding: 9px 18px;
            font-size: 17px;
          }
        }

        /* Laptop & Desktop View */
        @media (min-width: 1025px) {
          #transakContainer {
            width: 100%;
            max-width: 500px;
            height: 80vh;
            box-shadow: 0 0 15px #1461db;
            border-radius: 15px;
          }

          #buyCryptoBtn {
            padding: 10px 20px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default TransakWidget;
