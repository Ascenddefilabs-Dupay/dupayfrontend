

// 'use client';
// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import styles from './PersonalDetailsForm.module.css';
// // import UseSession from '@/app/Userauthentication/SignIn/hooks/UseSession';

// interface FormData {
//   firstName: string;
//   lastName: string;
//   mobileNumber: string;
//   dob: string;
//   addressLine1: string;
//   addressLine2: string;
//   state: string;
//   city: string;
//   postalCode: string;
//   country: string;
// }

// interface Errors {
//   [key: string]: string;
// }

// interface CustomAlertProps {
//   message: string;
//   onClose: () => void;
// }

// const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => (
//   <div className={styles.customAlert}>
//     <p>{message}</p>
//     <button onClick={onClose} className={styles.closeButton}>Ok</button>
//   </div>
// );

// const PersonalDetailsForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     firstName: '',
//     lastName: '',
//     mobileNumber: '',
//     dob: '',
//     addressLine1: '',
//     addressLine2: '',
//     state: '',
//     city: '',
//     postalCode: '',
//     country: ''
//   });
//   const [errors, setErrors] = useState<Errors>({});
//   const [message, setMessage] = useState<string>('');
//   const [showAlert, setShowAlert] = useState<boolean>(false);
//   const [redirect, setRedirect] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();
//   // const { isLoggedIn, userData } = UseSession();
//   const [userId, setUserId] = useState<string | null>(null);
  

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//         const sessionDataString = window.localStorage.getItem('session_data');
//         if (sessionDataString) {
//             const sessionData = JSON.parse(sessionDataString);
//             const storedUserId: string = sessionData.user_id;
//             setUserId(storedUserId);
//             console.log(storedUserId);
//             // console.log(sessionData.user_email);
//         } else {
//             // router.push('/Userauthentication/SignIn');
//         }
//     }
// }, [router]);

//   // useEffect(() => {
//   //   if (isLoggedIn) {
//   //     console.log('User ID:', userData?.user_id);
//   //   } else {
//   //     console.log('User is not logged in');
//   //   }
//   // }, [isLoggedIn, userData]);

//   const validateField = useCallback((name: keyof FormData, value: string) => {
//     let error = '';
//     switch (name) {
//       case 'firstName':
//         if (!value) error = 'First Name is required';
//         break;
//       case 'lastName':
//         if (!value) error = 'Last Name is required';
//         break;
//       case 'mobileNumber':
//         if (!value) error = 'Mobile Number is required';
//         else if (!/^\d{10}$/.test(value)) error = 'Mobile Number is invalid';
//         break;
//       case 'dob':
//         if (!value) {
//           error = 'Date of Birth is required';
//         } else {
//           const today = new Date();
//           const birthDate = new Date(value);
//           let age = today.getFullYear() - birthDate.getFullYear();
//           const monthDiff = today.getMonth() - birthDate.getMonth();
//           if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//             age--;
//           }
//           if (age < 18) {
//             error = 'You must be at least 18 years old.';
//           }
//         }
//         break;
//       case 'addressLine1':
//         if (!value) error = 'Address Line 1 is required';
//         break;
//       case 'state':
//         if (!value) error = 'State/Region is required';
//         break;
//       case 'city':
//         if (!value) error = 'City is required';
//         break;
//       case 'postalCode':
//         if (!value) error = 'Postal/Zip Code is required';
//         else if (!/^\d+$/.test(value)) error = 'Postal Code must be numeric';
//         break;
//       case 'country':
//         if (!value) error = 'Country is required';
//         break;
//       default:
//         break;
//     }
//     setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
//     validateField(name as keyof FormData, value);
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Errors = {};
//     Object.keys(formData).forEach((key) => {
//       validateField(key as keyof FormData, formData[key as keyof FormData]);
//       if (errors[key]) {
//         newErrors[key] = errors[key];
//       }
//     });
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setLoading(true);
//       localStorage.setItem('user_details', JSON.stringify(formData));
//       try {
//         const response = await axios.post('https://kycverification-ind-255574993735.asia-south1.run.app/kycverification_api/personal-details/', {
//           user_id: userId, // Include user_id
//           user_first_name: formData.firstName,
//           user_last_name: formData.lastName,
//           user_phone_number: formData.mobileNumber,
//           user_dob: formData.dob,
//           user_address_line_1: formData.addressLine1,
//           user_address_line_2: formData.addressLine2,
//           user_state: formData.state,
//           user_city: formData.city,
//           user_pin_code: formData.postalCode,
//           user_country: formData.country
//         }, {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         setMessage('Personal details submitted successfully!');
//         setShowAlert(true);
//         setRedirect(true);
//         setFormData({
//           firstName: '',
//           lastName: '',
//           mobileNumber: '',
//           dob: '',
//           addressLine1: '',
//           addressLine2: '',
//           state: '',
//           city: '',
//           postalCode: '',
//           country: ''
//         });
//       } catch (error) {
//         console.error('Error submitting personal details:', error);
//         setMessage('Error submitting personal details. Please try again.');
//         setShowAlert(true);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const closeAlert = () => {
//     setShowAlert(false);
//     if (redirect) {
//       router.push('/WalletManagement/WalletCreation');
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       {showAlert && <CustomAlert message={message} onClose={closeAlert} />}
//       <form onSubmit={handleSubmit} className={styles.form}>
//         {loading && (
//           <div className={styles.loaderContainer}>
//             <div className={styles.loader}></div>
//           </div>
//         )}
//         <h2 className={styles.heading}>Personal Details</h2>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             First Name <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Last Name <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Mobile Number <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="mobileNumber"
//             value={formData.mobileNumber}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.mobileNumber && <p className={styles.error}>{errors.mobileNumber}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Date of Birth <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.dob && <p className={styles.error}>{errors.dob}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Address Line 1 <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="addressLine1"
//             value={formData.addressLine1}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.addressLine1 && <p className={styles.error}>{errors.addressLine1}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>Address Line 2 (optional)</label>
//           <input
//             type="text"
//             name="addressLine2"
//             value={formData.addressLine2}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             State/Region <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.state && <p className={styles.error}>{errors.state}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             City <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.city && <p className={styles.error}>{errors.city}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Postal/Zip Code <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="postalCode"
//             value={formData.postalCode}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.postalCode && <p className={styles.error}>{errors.postalCode}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Country <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.country && <p className={styles.error}>{errors.country}</p>}
//         </div>
//         <button type="submit" className={styles.submitButton} disabled={loading}>
//           {loading ? 'Submitting...' : 'Submit'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PersonalDetailsForm;



'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './PersonalDetailsForm.module.css';
import DropdownWithSearch from './DropdownWithSearch';
import { fontSize, width } from '@mui/system';

interface FormData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  dob: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  postalCode: string;
  country: string;
  countryCode: string; // Country code
}

interface Errors {
  [key: string]: string;
}

interface CountryCode {
  code: string;
  dialCode: string;
}

interface CustomAlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => (
  <div className={styles.customAlert}>
    <p>{message}</p>
    <button onClick={onClose} className={styles.closeButton}>Ok</button>
  </div>
);

const PersonalDetailsForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    dob: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    postalCode: '',
    country: '',
    countryCode: '+1' // Default country code
  });
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [countryCodes, setCountryCodes] = useState<CountryCode[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [style, setStyle] = useState({ fontSize: '16px' });

  const onFocus = () => {
    setStyle((prevStyle) => ({
      ...prevStyle,
      fontSize: '12px', 
    }));
  }
  useEffect(() => {
    // Fetch country codes from REST Countries API
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const codes: CountryCode[] = response.data.map((country: any) => ({
          code: country.cca2, // Two-letter country code
          dialCode: country.idd?.root ? `${country.idd.root}${country.idd.suffixes[0]}` : '+1' // Dial code
        }));
        setCountryCodes(codes);
      } catch (error) {
        console.error('Error fetching country codes:', error);
      }
    };

    fetchCountryCodes();

    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setUserId(storedUserId);
        console.log(storedUserId);
        
      }
    }
  }, [router]);

  const validateField = useCallback((name: keyof FormData, value: string) => {
    let error = '';
    switch (name) {
      case 'firstName':
        if (!value) error = 'First Name is required';
        break;
      case 'lastName':
        if (!value) error = 'Last Name is required';
        break;
      case 'mobileNumber':
        if (!value) error = 'Mobile Number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Mobile Number is invalid'; // Adjusted regex for international format
        break;
      case 'dob':
        if (!value) {
          error = 'Date of Birth is required';
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18) {
            error = 'You must be at least 18 years old.';
          }
        }
        break;
      case 'addressLine1':
        if (!value) error = 'Address Line 1 is required';
        break;
      case 'state':
        if (!value) error = 'State/Region is required';
        break;
      case 'city':
        if (!value) error = 'City is required';
        break;
      case 'postalCode':
        if (!value) error = 'Postal/Zip Code is required';
        else if (!/^\d+$/.test(value)) error = 'Postal Code must be numeric';
        break;
      case 'country':
        if (!value) error = 'Country is required';
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    validateField(name as keyof FormData, value);
  };

  // const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { value } = e.target;
  //   setFormData(prevFormData => ({ ...prevFormData, countryCode: value }));
  // };

  const handleCountryCodeChange = (value: string) => {
    setFormData(prevFormData => ({ ...prevFormData, countryCode: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key as keyof FormData, formData[key as keyof FormData]);
      if (errors[key]) {
        newErrors[key] = errors[key];
      }
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      localStorage.setItem('user_details', JSON.stringify(formData));
      
      // Combine country code and mobile number
      const cleanedCountryCode = formData.countryCode.replace(/\D+/g, ''); // Removes any non-digit characters
      const phoneNumber = `${cleanedCountryCode}${formData.mobileNumber}`.replace(/\s+/g, '');

      // Print country code and combined phone number
      console.log('Cleaned Country Code:', cleanedCountryCode);
      console.log('Combined Phone Number:', phoneNumber);

      
      try {
        const response = await axios.post('https://kycverification-ind-255574993735.asia-south1.run.app/kycverification_api/personal-details/', {
          user_id: userId,
          user_first_name: formData.firstName,
          user_last_name: formData.lastName,
          user_phone_number: phoneNumber, // Prepend country code correctly
          user_dob: formData.dob,
          user_address_line_1: formData.addressLine1,
          user_address_line_2: formData.addressLine2,
          user_state: formData.state,
          user_city: formData.city,
          user_pin_code: formData.postalCode,
          user_country: formData.country
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setMessage('Personal details submitted successfully!');
        setShowAlert(true);
        setRedirect(true);
        setFormData({
          firstName: '',
          lastName: '',
          mobileNumber: '',
          dob: '',
          addressLine1: '',
          addressLine2: '',
          state: '',
          city: '',
          postalCode: '',
          country: '',
          countryCode: '+1' // Reset country code
        });
      } catch (error) {
        console.error('Error submitting personal details:', error);
        setMessage('Error submitting personal details. Please try again.');
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    if (redirect) {
      router.push('/WalletManagement/WalletCreation');
    }
  };

  return (
    <div className={styles.formContainer}>
      <header>
        <link href="https://fonts.googleapis.com/css?family=Poppins;
" rel="stylesheet" />
      </header>
      {showAlert && <CustomAlert message={message} onClose={closeAlert} />}
      <form onSubmit={handleSubmit} className={styles.form}>
        {loading && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        )}
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.frameContainer}>
              <div className={styles.dupayLogoParent}>
                {/* <img className={styles.dupayLogoIcon} alt="" src="/DupayAnimation.png" /> */}
                <img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
                <b className={styles.dupay}>Dupay</b>
              </div>
            </div>
            <div className={styles.frameDiv}>
              <div className={styles.frameWrapper}>
                <div className={styles.title}>Welcome</div>
              </div>
              <div className={styles.title2}>
                Update your personal details before creating a wallet
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* <h2 className={styles.heading}>Personal Details</h2> */}
       
        <div className={styles.formGroup}>
          
              <div className={styles.inputinput}>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                
                <label htmlFor="firstName" className={styles.label}>First name</label>
                {/* {errors.firstName && <p className={styles.error}>{errors.firstName}</p>} */}
              </div>
          {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
        </div>
        <div className={styles.formGroup}>
          
          <div className={styles.inputinput}>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <label htmlFor="lastName" className={styles.label}>Last name</label>
            {/* {errors.lastName && <p className={styles.error}>{errors.lastName}</p>} */}
          </div>
          {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
        </div>
        

       
        <div className={styles.formGroup}>
          
         <div className={styles.inputContainer}>
          <div className={styles.textFieldWrapper}>
            <div className={styles.countryCodeContainer}>
              <DropdownWithSearch
                options={countryCodes}
                selectedOption={formData.countryCode}
                onSelect={handleCountryCodeChange}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="mobileNumber"
                className={`${styles.label21} ${formData.mobileNumber ? styles.labelActive : ''}`}
              >
                Mobile number
              </label>
              <input
                type="text"
                name="mobileNumber"
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={styles.inputMobile}
                required
              />
            </div>
          </div>
        </div>
          {errors.mobileNumber && <p className={styles.error}>{errors.mobileNumber}</p>}
        </div>

        <div className={styles.formGroup}>
         
          <div className={styles.inputinput2}>
          <label htmlFor="dateOfBirth" style={style} className={styles.label215}>Date of Birth</label>
          <input
            type="date"
            name="dob"
            onFocus={onFocus}
            value={formData.dob}
            placeholder="Date of Birth"
            onChange={handleChange}
            className={styles.input}
            required
            id="dateOfBirth"
          />
          
        </div>
          
          {errors.dob && <p className={styles.error}>{errors.dob}</p>}
        </div>
        <div className={styles.formGroup}>
        
          <div className={styles.inputinput2}>
            <input type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className={styles.input}
            required />
            <label htmlFor="addressLine1" className={styles.label2}>Address line 1</label>
          </div>
          {errors.addressLine1 && <p className={styles.error}>{errors.addressLine1}</p>}
        </div>
        <div className={styles.formGroup}>
         
          <div className={styles.inputinput2}>
            <input type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className={styles.input} />
            <label htmlFor="addressLine2" className={styles.label2} >Address line 2 (Optional)</label>
          </div>
        </div>
        <div className={styles.formGroup}>
         
          <div className={styles.inputinput2}>
            <input type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={styles.input}
                  required />
            <label htmlFor="state" className={styles.label2}>State/Region</label>
          </div>
          {errors.state && <p className={styles.error}>{errors.state}</p>}
        </div>
        <div className={styles.formGroup}>
          
          <div className={styles.inputinput2}>
            <input type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={styles.input}
            required/>
            <label htmlFor="city" className={styles.label2}>City</label>
          </div>
          {errors.city && <p className={styles.error}>{errors.city}</p>}
        </div>
        <div className={styles.formGroup}>
          
            <div className={styles.inputinput2}>
              <input type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={styles.input}
            required />
              <label htmlFor="postalCode" className={styles.label2}>Postal/Zip Code</label>
            </div>
            
          {errors.postalCode && <p className={styles.error}>{errors.postalCode}</p>}
        </div>
        <div className={styles.formGroup}>
          
            <div className={styles.inputinput2}>
              <input type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={styles.input}
            required />
              <label htmlFor="country" className={styles.label2}>Country</label>
            </div>
          {errors.country && <p className={styles.error}>{errors.country}</p>}
        </div>
        
        {/* <div className={styles.btnmbBtnFab}>
            <div className={styles.btnbtn}>
              <button type="submit" className={styles.getStartedButton} disabled={loading}>
                  
              </button>
              
            </div>
        </div> */}
        <button className={styles.getStartedButton} >{loading ? 'update...' : 'Update and create wallet'}</button>
        
        
      </form>
    </div>
  );
};

export default PersonalDetailsForm;
