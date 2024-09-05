"use client";
import CurrencySelector from './CurrencySelector';

const CurrencyPage: React.FC = () => {
  return (
    <div className="container">
      <CurrencySelector />
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          
        }
      `}</style>
    </div>
  );
};

export default CurrencyPage;

