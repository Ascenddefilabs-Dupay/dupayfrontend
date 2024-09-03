"use client";
import CurrencySelector from './currency_set';

const CurrencyPage = () => {
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