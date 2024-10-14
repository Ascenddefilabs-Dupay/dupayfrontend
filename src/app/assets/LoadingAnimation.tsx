import React from 'react';
import Lottie from 'react-lottie';
import animationData from './Loading.json'; // Path to your JSON file

interface LottieAnimationProps {
  width?: string;
  height?: string;
}

const LottieAnimationLoading: React.FC<LottieAnimationProps> = ({ width = '250x', height = '250px' }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true, // Animation will play automatically
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{ width, height }}>
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default LottieAnimationLoading;
