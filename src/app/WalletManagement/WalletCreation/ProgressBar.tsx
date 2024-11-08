// ProgressBar.tsx
import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const steps = [];

  for (let i = 1; i <= totalSteps; i++) {
    let stepClass = 'progress-bar__step';

    if (i < currentStep) {
      stepClass += ' progress-bar__step--completed';
    } else if (i === currentStep) {
      stepClass += ' progress-bar__step--current';
    }

    steps.push(<div key={i} className={stepClass}></div>);
  }

  return <div className="progress-bar">{steps}</div>;
};

export default ProgressBar;
