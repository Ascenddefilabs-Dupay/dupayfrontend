import React from 'react';
import { shortenAddress } from "@polymedia/suitcase-core";

interface AccountData {
  userAddr: string;
  balance: number | undefined; // balance can be undefined while loading
  onSendTransaction: () => void; // function to send transaction
  onRequestFaucet: () => void; // function to request SUI from faucet
}

const AccountDisplay: React.FC<AccountData> = ({ userAddr, balance, onSendTransaction, onRequestFaucet }) => {
  return (
    <div className="account white-text">
      <div>
        Address:{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://explorer.sui.io/address/${userAddr}`}
        >
          {shortenAddress(userAddr)}
        </a>
      </div>
      <div>
        Balance:{" "}
        {typeof balance === "undefined"
          ? "(loading)"
          : `${balance} SUI`}
      </div>
      <button
        className={` ${!balance ? "disabled" : ""}`}
        disabled={!balance}
        onClick={onSendTransaction}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          padding: '10px',
          fontSize: '18px',
          borderRadius: '0.5rem',
          border: 'none',
          background: 'linear-gradient(90deg, #007bff9f, #800080)',
          color: 'white',
          cursor: 'pointer',
          transition: 'all .6s ease',
          marginTop: '10px',
          marginBottom: '10px',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        Send transaction
      </button>
      {balance === 0 && (
        <button
          onClick={onRequestFaucet}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            padding: '10px',
            fontSize: '18px',
            borderRadius: '0.5rem',
            border: 'none',
            background: 'linear-gradient(90deg, #007bff9f, #800080)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all .6s ease',
            marginTop: '10px',
            marginBottom: '10px',
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          Use faucet
        </button>
      )}
      <hr />
    </div>
  );
};

export default AccountDisplay;