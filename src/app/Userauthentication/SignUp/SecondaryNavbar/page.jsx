'use client'
import React from 'react';
import SecondaryNavbar from './SecondaryNavbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const handleDownloadClick = () => {
    router.push('/Userauthentication/SignUp/DownloadExtension');
  };

  return (
    <>
      <SecondaryNavbar />
      <div className='bg-black text-white min-h-screen'>
        <div className='flex flex-col min-h-screen'>
          <div className='flex-grow'>
            <div className='mt-36 flex'>
              <div className='flex items-center max-w-7xl w-full'>
                <div className='flex-grow p-4'>
                  <p className='text-white text-4xl ml-12'>
                    Dupay Wallet is available in your <br /> <span className='block'>country.</span>
                  </p>
                  <p className='text-white text-xl ml-12 mt-5'>
                    Dupay Wallet, our self-custody crypto wallet to trade crypto and collect NFTs, is available in your country.
                  </p>
                  <button 
                    className='bg-gradient-to-r from-[#007bff9f] to-[#800080] text-white rounded-lg py-2 px-4 md:py-2 md:px-6 hover:bg-blue-700 transition-colors duration-300 w-full md:w-auto mt-10 ml-12'
                    onClick={handleDownloadClick}
                  >
                    Download Dupay Wallet
                  </button>
                  <div className='flex items-center mt-6 ml-12'>
                    <p className='text-white text-lg mr-4'>
                      Already have a Dupay account?
                    </p>
                    <Link href='/Userauthentication/signin'>
                      <span className='text-purple-600 text-lg cursor-pointer font-medium'>
                        Sign In
                      </span>
                    </Link>
                  </div>
                </div>
                <div className='ml-16 flex-shrink-0'>
                  <div className='bg-black-50 p-6 rounded-lg shadow-lg'>
                    <img 
                      src='/images/download_wallet.svg'   
                      alt='Descriptive Alt Text' 
                      className='w-[400px] h-[400px] object-cover ' 
                    /> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
