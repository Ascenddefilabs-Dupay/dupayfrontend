"use client";
import React, { useState, useCallback, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from "./AddBankForm.module.css";

// Define the IFSC code validation function
const validateIfscCode = (ifscCode: string): boolean => {
  const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscPattern.test(ifscCode);
};

interface Bank {
  id: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  bic_code: string;
  currency: string;
  kyc_document: string;
}

const AddBankForm: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [bankName, setBankName] = useState<string>("");
  const [bankList, setBankList] = useState<Bank[]>([]);
  const [accountHolderName, setAccountHolderName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [swiftBicCode, setSwiftBicCode] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [bankIcon, setBankIcon] = useState<File | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Fetch user ID from localStorage
  useEffect(() => {
    const storedSessionData = localStorage.getItem("session_data");
    if (storedSessionData) {
      try {
        const userData = JSON.parse(storedSessionData);
        const userId = userData?.user_id;
        if (userId) {
          setUserId(userId);
          fetchBankList(userId);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch bank list for a specific user
const fetchBankList = async (userId: string) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/addbank/get_banks/${userId}/`
    );
    const data = await response.json();

    if (data.length === 0) {
      // If no banks are available, go directly to the form screen
      setShowForm(true);
      setSelectedBank(null);
    } else {
      // Otherwise, show the bank list in the initial screen
      setBankList(data);
      setShowForm(false);
    }
  } catch (error) {
    console.error("Error fetching bank list:", error);
  }
};

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (
        !bankName ||
        !accountHolderName ||
        !accountNumber ||
        !ifscCode ||
        !branchName ||
        !swiftBicCode ||
        !currency ||
        !bankIcon
      ) {
        toast.error("Please fill all fields", { position: "top-center", autoClose:false });
        return;
      }

      if (!validateIfscCode(ifscCode)) {
        toast.error("Invalid IFSC Code", { position: "top-center", autoClose:false });
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("user_id", userId !== null ? userId.toString() : "");
      formData.append("bank_name", bankName);
      formData.append("account_holder_name", accountHolderName);
      formData.append("account_number", accountNumber);
      formData.append("ifsc_code", ifscCode);
      formData.append("branch_name", branchName);
      formData.append("bic_code", swiftBicCode);
      formData.append("currency", currency);
      formData.append("kyc_document", bankIcon);

      try {
        const res = await fetch("http://127.0.0.1:8000/addbank/add/", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          toast.success("Bank added successfully!", { position: "top-center", autoClose: 1500 });
          setBankName("");
          setAccountHolderName("");
          setAccountNumber("");
          setIfscCode("");
          setBranchName("");
          setSwiftBicCode("");
          setCurrency("");
          setBankIcon(null);
          fetchBankList(userId!); // Refresh the bank list
        } else {
          const errorData = await res.json();
          toast.error("Failed to add bank.", { position: "top-center", autoClose:false });
        }
      } catch (error) {
        toast.error("An error occurred while submitting.", { position: "top-center", autoClose: false });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      branchName,
      swiftBicCode,
      currency,
      bankIcon,
      userId,
    ]
  );

  // Handle back button click to go back to the dashboard
  const handleBackClick = useCallback(() => {
    window.location.href = "/Userauthorization/Dashboard/Home";
  }, []);

  // Show the add bank form
  const handleAddBankClick = () => {
    setShowForm(true);
    setSelectedBank(null);
  };

  // Handle selecting a bank to view its details
  const handleBankClick = (bank: Bank) => {
    setSelectedBank(bank);
    setShowForm(false);
  };

  // Handle returning from Bank Details back to Initial Screen
  const handleReturnToList = () => {
    setSelectedBank(null);
    setShowForm(false);
  };
  const handleUnlinkBankAccount = async (bankId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/addbank/delete_bank/${bankId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success("Bank account unlinked successfully!", { position: "top-center", autoClose: 1000 });
        fetchBankList(userId!); 
        setSelectedBank(null);
        setShowForm(false);// Refresh the bank list after deletion
      } else {
        const errorData = await response.json();
        toast.error("Failed to unlink bank account", { position: "top-center", autoClose: false });
      }
    } catch (error) {
      toast.error("An error occurred while unlinking the bank account", { position: "top-center", autoClose: false });
    }
  };
  

  return (
    <div className={styles.container}>
      {/* InitialScreen: Bank list and Add Bank button */}
      {!showForm && !selectedBank && bankList.length > 0 && (
        <div className={styles.initialScreen}>
          <FaArrowLeft className={styles.BackIcon} onClick={handleBackClick} />
          
          {/* Bank List Display */}
          {bankList.length > 0 && (
            <div className={styles.bankList}>
              {bankList.map((bank) => (
                <button
                  key={bank.id}
                  className={styles.bankButton}
                  onClick={() => handleBankClick(bank)}
                >
                  <span className={styles.bankName}>{bank.bank_name}</span>
                  <FaArrowRight className={styles.rightArrow} />
                </button>
              ))}
            </div>
          )}

          {/* Add Bank Button */}
          <button className={styles.addButton} onClick={handleAddBankClick}>
            Add Bank Account
          </button>
        </div>
      )}
      {/* FormScreen: Add Bank form */}
      {(showForm || bankList.length === 0) && !selectedBank && (
        <div className={styles.formScreen}>
          <FaArrowLeft className={styles.BackIcon} onClick={handleReturnToList} />
          <br />
          <br />
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldContainer}>
              <label className={styles.label}>
                Bank Name<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldContainer}>
              <label className={styles.label}>
                Account Holder Name<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldContainer}>
              <label className={styles.label}>
                Account Number<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldContainer}>
              <label className={styles.label}>
                IFSC Code<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldContainer}>
              <label className={styles.label}>
                Branch Name<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldContainer}>
              <label className={styles.label}>
                Swift/BIC Code<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={swiftBicCode}
                onChange={(e) => setSwiftBicCode(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldContainer}>
              <label className={styles.label}>
                Currency<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.fieldContainer}>
              <label className={styles.label}>
                Upload Bank Icon<span className={styles.required}>*</span>
              </label>
              <input
                type="file"
                onChange={(e) => setBankIcon(e.target.files ? e.target.files[0] : null)}
                required
                className={styles.fileInput}
              />
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

{/* BankDetailsScreen: Bank details */}
      {selectedBank && (
        <div className={styles.bankDetailsScreen}>
          
          <div className={styles.header}>
            <FaArrowLeft className={styles.Back} onClick={handleReturnToList} />
            <h2 className={styles.title}>Bank Details</h2>
          </div>
          <div className={styles.card}>
            
            {/* Account Number at the top-left */}
            <div className={styles.topDetails}>
              
              <div className={styles.accountNumberValue}>{selectedBank.account_number}</div>

              {/* Account Holder Name below Account Number */}
              
              <div className={styles.accountHolderValue}>{selectedBank.bank_name}</div>
            </div>
            
            <br />
            <div className={styles.detailsRow}>
              <div className={styles.label}>Branch:</div>
              <div className={styles.value}>{selectedBank.branch_name}</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.label}>IFSC Code:</div>
              <div className={styles.value}>{selectedBank.ifsc_code}</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.label}>SWIFT/BIC Code:</div>
              <div className={styles.value}>{selectedBank.bic_code}</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.label}>Currency:</div>
              <div className={styles.value}>{selectedBank.currency}</div>
            </div>
          </div>
          <div className={styles.card1}>


            {/* Unlink Bank Account Link */}
            <a href="#" className={styles.unlinkLink}onClick={() => handleUnlinkBankAccount(selectedBank.id)}>
              <FaTrash className={styles.trashIcon} />
              Unlink Bank Account
            </a>
          </div>
        </div>
      )}


      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddBankForm;
