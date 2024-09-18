"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FiatWalletForm.module.css";
import { FaArrowLeft } from "react-icons/fa";
import Select, { SingleValue } from "react-select";
import { useRouter } from "next/navigation";

interface AccountTypeOption {
  value: string;
  label: string | JSX.Element;
}

interface ErrorState {
  accountType?: string;
  walletName?: string;
  email?: string;
  securityPin?: string;
}


interface AdminCMSData {
  account_type: string;
  currency_type: string;

interface ErrorState {
  walletType?: string;
  walletCurrency?: string;
  username?: string;
  phoneNumber?: string;
  form?: string;
  accountType?:string;

}

export default function FiatWalletForm() {
  const [accountType, setAccountType] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [securityPin, setSecurityPin] = useState<string>("");

  const [walletCurrency, setWalletCurrency] = useState<string>("INR");
  const [selectedCurrency, setSelectedCurrency] = useState<SingleValue<AccountTypeOption>>(null);
  const [adminCMSData, setAdminCMSData] = useState<AdminCMSData[]>([]);
  const [error, setError] = useState<ErrorState>({});
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionDataString = localStorage.getItem("session_data");
    if (sessionDataString) {
      const sessionData = JSON.parse(sessionDataString);
      setUserId(sessionData.user_id);
    }
  }, []);

  useEffect(() => {
    axios
      .get<AdminCMSData[]>("https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/account-types/")
      .then((response) => setAdminCMSData(response.data))
      .catch((error) => console.error("Error fetching account types and currency types:", error));
  }, []);

  const accountTypeOptions: AccountTypeOption[] = adminCMSData
    .filter((data) => data.account_type !== null)
    .map((data) => ({
      value: data.account_type,
      label: data.account_type,
    }));

  const currencyOptions: AccountTypeOption[] = adminCMSData
    .filter((data) => data.currency_type !== null)
    .map((data) => ({
      value: data.currency_type,
      label: data.currency_type,
    }));

  const handleCurrencyChange = (option: SingleValue<AccountTypeOption>) => {
    setSelectedCurrency(option);
    setWalletCurrency(option?.value || "INR");
  };

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '4px',
      borderColor: '#ccc',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#aaa',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
      color: 'black',
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 5,
    }),
  };

  const validateFields = (): boolean => {
    const newError: ErrorState = {};
    if (!accountType) newError.accountType = "Account type is required.";
    if (!walletName) newError.walletName = "Wallet name is required.";
    if (!email) newError.email = "Email is required.";
    if (!securityPin || securityPin.length !== 4) {
      newError.securityPin = "Security PIN must be a 4-digit number.";
    }
    setError(newError);
    setAlertMessage(Object.keys(newError).length > 0 ? "Please correct the errors before submitting." : "");
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAlertMessage("");
  
    if (!validateFields()) return;
  
    const payload = {
      fiat_wallet_id: "generated_id_here",
      fiat_wallet_type: accountType, // Ensure this is a valid option
      fiat_wallet_currency: walletCurrency, // Ensure this is a valid currency code
      fiat_wallet_address: "", // Check if an empty string is acceptable
      fiat_wallet_balance: 0, // Ensure this is a valid value
      fiat_wallet_created_time: new Date().toISOString(),
      fiat_wallet_updated_time: new Date().toISOString(),
      fiat_wallet_phone_number: "", // Provide a valid phone number if required
      fiat_wallet_email: email, // Ensure this is a valid email format
      qr_code: "", // Ensure this is acceptable or provide a valid QR code
      user_id: userId, // Ensure this is a valid user ID
    };
  
    try {
      setShowLoader(true);
      const response = await axios.post(
        "https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/fiat_wallets/",
        payload
      );
      setAlertMessage("Wallet created successfully!");
      resetForm();
      setTimeout(() => router.push("/Userauthorization/Dashboard"), 2000);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.detail || "Error creating wallet"
        : "Error creating wallet";
      setAlertMessage(errorMessage);
      console.error("Error creating wallet:", error);
    } finally {
      setShowLoader(false);
    }
  };
  
  
  const resetForm = () => {
    setAccountType("");
    setWalletName("");
    setEmail("");
    setSecurityPin("");
    setSelectedCurrency(null);
    setError({});
  };

  const handleLeftArrowClick = () => router.back();

  return (
    <div className={styles.container}>
      {alertMessage && (
        <div className={styles.customAlert}>
          <p>{alertMessage}</p>
          <button onClick={() => setAlertMessage("")}>Close</button>
        </div>
      )}
      {showLoader && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
      <div className={styles.topBar}>
        <button className={styles.topBarButton} onClick={handleLeftArrowClick}>
          <FaArrowLeft className={styles.topBarIcon} />
        </button>
        <h2 className={styles.topBarTitle}>Create Wallet</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="accountType" className={styles.label}>
            Account Type:
          </label>
          <select
            id="accountType"
            className={styles.selectInput}
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="">Select Account Type</option>
            {accountTypeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {error.accountType && <p className={styles.error}>{error.accountType}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="walletName" className={styles.label}>
            Wallet Name:
          </label>
          <input
            id="walletName"
            type="text"
            className={styles.inputField}
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />
          {error.walletName && <p className={styles.error}>{error.walletName}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="currency" className={styles.label}>
            Currency Type:
          </label>
          <Select
            id="currency"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            options={currencyOptions}
            styles={customSelectStyles} // Custom styles applied here
            isSearchable
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <p className={styles.error}>{error.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="securityPin" className={styles.label}>
            Security PIN:
          </label>
          <input
            id="securityPin"
            type="password"
            maxLength={4}
            className={styles.inputField}
            value={securityPin}
            onChange={(e) => setSecurityPin(e.target.value)}
          />
          {error.securityPin && <p className={styles.error}>{error.securityPin}</p>}
        </div>

        <div className={styles.formGroup}>
          <button type="submit" className={styles.submitButton}>Create Wallet</button>
        </div>
      </form>
    </div>
  );
}
