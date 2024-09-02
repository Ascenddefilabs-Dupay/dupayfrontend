import { AppProps } from 'next/app';
import Navbar from './Userauthentication/LandingPage/Navbar';
import Index from './Userauthentication/LandingPage';


function Home({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Index />
      
      
      
      
    </>
  );
}

export default Home;




