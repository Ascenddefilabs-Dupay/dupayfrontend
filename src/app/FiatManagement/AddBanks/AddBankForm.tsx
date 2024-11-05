"use client";
import React, { useState, useCallback, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaTrash,FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from "./AddBankForm.module.css";


import { useRouter } from 'next/navigation';



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
  const [fileName, setFileName] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const router = useRouter();
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
  


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setBankIcon(file); // Set the bankIcon state with the selected file
  }
};
  // Fetch bank list for a specific user
const fetchBankList = async (userId: string) => {
  try {
    const response = await fetch(
      `https://fiatmanagement-ind-255574993735.asia-south1.run.app/addbank/get_banks/${userId}/`
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

      // if (!validateIfscCode(ifscCode)) {
      //   toast.error("Invalid IFSC Code", { position: "top-center", autoClose:false });
      //   return;
      // }

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
        const res = await fetch("https://fiatmanagement-ind-255574993735.asia-south1.run.app/addbank/add/", {
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
          fetchBankList(userId!);
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
  const handleBack = () => {
    router.push('/Userauthorization/Dashboard/Home'); // Navigate to the Dashboard Home
  };

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
      const response = await fetch(`https://fiatmanagement-ind-255574993735.asia-south1.run.app/addbank/delete_bank/${bankId}/`, {
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
      {/* <img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727325960/0beadfc1-104a-4d39-90dc-d34518823d07.png" /> */}
      <img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804098/circle_d5udrl.png" />
      			<div className={styles.homeScreenBackground}>
        				<div className={styles.background} />
      			</div>
      {/* InitialScreen: Bank list and Add Bank button */}
      {!showForm && !selectedBank && bankList.length > 0 && (
        <div className={styles.initialScreen}>
          {/* <header className={styles.formHeader1}>
            <FaAngleLeft className={styles.BackIcon1} onClick={handleBackClick} />  

            <h1 className={styles.headerTitle}>Bank Accounts</h1>
          </header> */}
          <div className={styles.navbarnavBar}>
            <div className={styles.navbaritemleftBtn}>
              <div className={styles.iconiconWrappers}>
                <img className={styles.iconarrowLeftBack} onClick={handleBack} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729070642/arrow-left-back_e8gobf.png" />
              {/* <FaAngleLeft className={styles.iconarrowLeftBack} onClick={handleReturnToList} />  */}
              </div>
            </div>
            <div className={styles.hereIsTitle}>Bank Accounts</div>
            <div className={styles.navbaritemrightBtn} />
          </div>

          {/* <span className={styles.BackIcon} onClick={handleBackClick}>
            &lt;
          </span> */}


          {/* Bank List Display */}
          {bankList.length > 0 && (
            <div className={styles.bankList}>
              <h1 className={styles.bankCount}>Your Bank Accounts ({bankList.length})</h1>
              {bankList.map((bank) => (
                <button
                  key={bank.id}
                  className={styles.bankButton}
                  onClick={() => handleBankClick(bank)}
                >
                  <span className={styles.bankName}>{bank.bank_name}</span>
                  <FaAngleRight className={styles.rightArrow} />
                  
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
          
          {/* <header className={styles.formHeader}>
            <FaAngleLeft className={styles.BackIcon1} onClick={handleReturnToList} /> 
            <h1 className={styles.headerTitle}>Bank Details</h1>
          </header> */}
          <div className={styles.navbarnavBar}>
            <div className={styles.navbaritemleftBtn}>
              <div className={styles.iconiconWrapper}>
                <img className={styles.iconarrowLeftBack} onClick={handleReturnToList} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729070642/arrow-left-back_e8gobf.png" />
              {/* <FaAngleLeft className={styles.iconarrowLeftBack} onClick={handleReturnToList} />  */}
              </div>
            </div>
            <div className={styles.hereIsTitle}>Bank Details</div>
            <div className={styles.navbaritemrightBtn} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldContainer}>
            <div className={styles.floatingLabelContainer}>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value.replace(/^\s+/, ''))} 
                  required
                  className={styles.input}
                />
                <label className={`${styles.label} ${bankName ? styles.activeLabel : ''}`}>
                  Bank Name<span className={styles.required}>*</span>
                </label>
              </div>

            </div>

            <div className={styles.fieldContainer}>
            <div className={styles.floatingLabelContainer}>
              
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value.replace(/^\s+/, ''))}
                required
                className={styles.input}
              />
              <label className={`${styles.label} ${accountHolderName ? styles.activeLabel : ''}`}>
                Account Holder Name<span className={styles.required}>*</span>
              </label>
              </div>
            </div>

            <div className={styles.fieldContainer}>
            <div className={styles.floatingLabelContainer}>
             
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => {
                const input = e.target.value.replace(/^\s+/, ''); 
                if (/^\d*$/.test(input) && input.length <= 16) { 
                  setAccountNumber(input);
                }
              }}
              required
              maxLength={16} 
              className={styles.input}
            />

               <label className={`${styles.label} ${accountNumber ? styles.activeLabel : ''}`}>
                Account Number<span className={styles.required}>*</span>
              </label>
              </div>
            </div>

            <div className={styles.fieldContainer}>
            <div className={styles.floatingLabelContainer}>
              
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => {
                  let input = e.target.value.replace(/^\s+/, ''); 
                  if (/^[A-Z]{0,4}[0-9]{0,7}$/.test(input) && input.length <= 11) {
                    setIfscCode(input);
                  }
                }}
                maxLength={11} 
                required
                className={styles.input}
              />

              <label className={`${styles.label} ${ifscCode ? styles.activeLabel : ''}`}>
                IFSC Code<span className={styles.required}>*</span>
              </label>
              </div>
            </div>
            
            <label className={`${styles.ifsccodeex} ${styles.lowercaseWarning}`}>
                Ex. SBIN002345, UBIN123456
            </label>

            <div className={styles.fieldContainer}>
            <div className={styles.floatingLabelContainer}>
              
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value.replace(/^\s+/, ''))}
                required
                className={styles.input}
              />
              <label className={`${styles.label} ${branchName ? styles.activeLabel : ''}`}>
                Branch Name<span className={styles.required}>*</span>
              </label>
              </div>
            </div>

            <div className={styles.fieldContainer}>
            <div className={styles.floatingLabelContainer}>
              
              <input
                type="text"
                value={swiftBicCode}
                onChange={(e) => setSwiftBicCode(e.target.value.replace(/^\s+/, ''))}
                required
                className={styles.input}
              />
              <label className={`${styles.label} ${swiftBicCode ? styles.activeLabel : ''}`}>
                Swift/BIC Code<span className={styles.required}>*</span>
              </label>
              </div>
            </div>

            <div className={styles.fieldContainer}>
            <div className={styles.floatingLabelContainer}>
              
              <input
                type="text"
                value={currency}
                onChange={(e) => {
                  const input = e.target.value.replace(/^\s+/, ''); 
                  const uppercaseInput = input.replace(/[^A-Z]/g, '').slice(0, 3);
                  setCurrency(uppercaseInput);
                }}
                maxLength={3} 
                required
                className={styles.input}
              />

              <label className={`${styles.label} ${currency ? styles.activeLabel : ''}`}>
                Currency<span className={styles.required}>*</span>
              </label>
              </div>
            </div>
            <label className={`${styles.inrcurency} ${styles.lowercaseWarning}`}>
                Ex. INR, USD, AED
            </label>
            <div className={styles.fieldContainer}>
              <div className={styles.fileWrapper}>
                <label className={`${styles.labels} ${bankIcon ? styles.activeLabel : ''}`}>
                  Attach KYC Doc<span className={styles.required}>*</span>
                </label>

                <div className={styles.fileInputWrapper}>
                  <div className={styles.fileIcon}>
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729617035/fc1f7abb-17a0-4eda-a529-b5b06797587a.png" alt="file-icon" />
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    id="file"
                  />
                </div>

                {bankIcon && (
                  <div className={styles.fileName}>
                    {bankIcon.name} {/* Display the file name */}
                  </div>
                )}
              </div>
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
          
          {/* <div className={styles.formHeader}>
            <FaAngleLeft className={styles.BackIcon1} onClick={handleReturnToList} /> 
            <h1 className={styles.title}>Bank Details</h1>
          </div> */}
          <div className={styles.navbarnavBar}>
            <div className={styles.navbaritemleftBtn}>
              <div className={styles.iconiconWrapper}>
                <img className={styles.iconarrowLeftBack} onClick={handleReturnToList} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729070642/arrow-left-back_e8gobf.png" />
              {/* <FaAngleLeft className={styles.iconarrowLeftBack} onClick={handleReturnToList} />  */}
              </div>
            </div>
            <div className={styles.hereIsTitle}>Bank account</div>
            <div className={styles.navbaritemrightBtn} />
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
              <div className={styles.label1}>Branch:</div>
              <div className={styles.value}>{selectedBank.branch_name}</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.label1}>IFSC Code:</div>
              <div className={styles.value}>{selectedBank.ifsc_code}</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.label1}>SWIFT/BIC Code:</div>
              <div className={styles.value}>{selectedBank.bic_code}</div>
            </div>
            <div className={styles.detailsRow}>
              <div className={styles.label1}>Currency:</div>
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

      <ToastContainer />
    </div>

    
  );
};

export default AddBankForm;