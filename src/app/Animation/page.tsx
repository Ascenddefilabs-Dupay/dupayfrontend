'use client';
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Font import (include this in your _app.tsx or in a global CSS file)
const SF_PRO_FONT_URL = "https://fonts.googleapis.com/css2?family=SF+Pro:wght@400;700&display=swap";

// Add this to your _app.tsx or global CSS file
if (typeof window !== "undefined") {
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.href = SF_PRO_FONT_URL;
  document.head.appendChild(linkElement);
}

const Container = styled.div<{ gradientBg: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width:400px;
  margin:0 auto;
  background: ${({ gradientBg }) => (gradientBg ? 'linear-gradient(180deg, #e34d67, #7746f4)' : '#000')};
  position: relative;
  overflow: hidden;
`;

const LogoAnimation = keyframes`
  0% {
    transform: translateY(-100vh);
    opacity: 0;
  }
  50% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const LogoMoveLeftAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-30px);
  }
`;

const TitleFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Logo = styled.img<{ showTitle: boolean }>`
  width: 50px;
  height: auto;
  animation: ${LogoAnimation} 1.5s ease forwards, ${({ showTitle }) => showTitle && LogoMoveLeftAnimation} 1.5s 1.5s forwards;
  transition: transform 1.5s ease;
`;

const Title = styled.h1<{ show: boolean }>`
  margin-left: 20px;
  font-size: 24px;
  color: #fff;
  opacity: 0;
  font-family: 'SF Pro', sans-serif;  // SF Pro font usage
  animation: ${({ show }) => (show ? TitleFadeIn : 'none')} 1s forwards;
`;

const SplashScreen = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [gradientBg, setGradientBg] = useState(false);

  useEffect(() => {
    const timeout1 = setTimeout(() => setShowTitle(true), 1500); // Show title after logo reaches the center
    const timeout2 = setTimeout(() => setGradientBg(true), 3000); // Change background after the logo moves
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  return (
    <Container gradientBg={gradientBg}>
      {!gradientBg && (
        <Logo
          src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075056/Dupaylogo_yzcput.png" // Replace with actual logo path
          alt="Logo"
          showTitle={showTitle}
        />
      )}
      {showTitle && <Title show={true}>Dupay</Title>}
    </Container>
  );
};

export default SplashScreen;
