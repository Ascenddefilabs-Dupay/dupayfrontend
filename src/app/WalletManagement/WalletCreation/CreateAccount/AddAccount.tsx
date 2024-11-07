"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import "./AddAccount.css";
import config from "./config.json";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

import {
  NetworkName,
  makePolymediaUrl,
  requestSuiFromFaucet,
  shortenAddress,
} from "@polymedia/suitcase-core";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  jwtToAddress,
} from "@mysten/zklogin";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { jwtDecode } from "jwt-decode";
// import { LinkExternal, Modal, isLocalhost } from "@polymedia/suitcase-react";
import { log } from "console";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";
import axios from "axios";

type ValidNetworkName = "testnet" | "devnet" | "localnet";

const NETWORK: ValidNetworkName = "testnet";
//  const FULLNODE_URL = getFullnodeUrl(NETWORK);
const MAX_EPOCH = 2; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});
/* Session storage keys */

const setupDataKey = "zklogin-demo.setup";
const accountDataKey = "zklogin-demo.accounts";
/* Types */

type OpenIdProvider = "Google" | "Twitch" | "Facebook";

type SetupData = {
  // provider: OpenIdProvider;
  maxEpoch: number;
  randomness: string;
  ephemeralPrivateKey: string;
};

type AccountData = {
  // provider: OpenIdProvider;
  userAddr: string;
  zkProofs: any;
  ephemeralPrivateKey: string;
  userSalt: string;
  sub: string;
  aud: string;
  maxEpoch: number;
};

const AddAccount = () => {
  const accounts = useRef<AccountData[]>(loadAccounts());
  const [modalContent, setModalContent] = useState<string>(" ");
  const [balances, setBalances] = useState<Map<string, number>>(new Map()); // Map<Sui address, SUI balance>
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setUserId(storedUserId);
        // console.log(storedUserId);
        // console.log(sessionData.user_email);
      } else {
        // router.push('/Userauthentication/SignIn');
      }
    }
  }, [router]);
  

  // useEffect(() => {
  //   //completZkLogin();
  //   fetchBalances(accounts.current);
  //   const interval = setInterval(() => fetchBalances(accounts.current), 5_000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const handleClose = () => {
    //window.location.href = "./";
    router.push('./'); 
  };

  const handleCreate = () => {
    
    router.push('../CreatePassword'); 
  };

  async function beginZkLogin(provider: OpenIdProvider) {
    //setModalContent(`🔑 Logging in with ${provider}...`);
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(
      ephemeralKeyPair.getPublicKey(),
      maxEpoch,
      randomness
    );

    // Save data to session storage so completeZkLogin() can use it after the redirect
    saveSetupData({
      //provider,
      maxEpoch,
      randomness: randomness.toString(),
      ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
    });
    // Start the OAuth flow with the OpenID provider
    const urlParamsBase = {
      nonce: nonce,
      redirect_uri: `https://frontend-prod-255574993735.asia-east1.run.app/WalletManagement/WalletCreation/CreateAccount/ZkDetails`,
      response_type: "id_token",
      scope: "openid",
    };
    let loginUrl: string;
    // switch (provider) {
    //   case "Google": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: config.CLIENT_ID_GOOGLE,
        });
        loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams.toString()}`;

    //     break;
    //   }
    //   case "Twitch": {
    //     const urlParams = new URLSearchParams({
    //       ...urlParamsBase,
    //       client_id: config.CLIENT_ID_TWITCH,
    //       force_verify: "true",
    //       lang: "en",
    //       login_type: "login",
    //     });
    //     loginUrl = `https://id.twitch.tv/oauth2/authorize?${urlParams.toString()}`;
    //     break;
    //   }
    //   case "Facebook": {
    //     const urlParams = new URLSearchParams({
    //       ...urlParamsBase,
    //       client_id: config.CLIENT_ID_FACEBOOK,
    //     });
    //     loginUrl = `https://www.facebook.com/v19.0/dialog/oauth?${urlParams.toString()}`;
    //     break;
    //   }
    // }
    //window.location.replace(loginUrl);
    router.replace(loginUrl); 
    //window.location.href = './AddAccount/ZkDetails';
    
  }
  /**
   * Complete the zkLogin process.
   * It sends the JWT to the salt server to get a salt, then
   * it derives the user address from the JWT and the salt, and finally
   * it gets a zero-knowledge proof from the Mysten Labs proving service.
   */
  // async function completZkLogin() {
  //   // grab the JWT from the URL fragment (the '#...')
  //   const urlFragment = window.location.hash.substring(1);
  //   const urlParams = new URLSearchParams(urlFragment);
  //   const jwt = urlParams.get("id_token");
  //   console.log("jwt token");
  //   console.log(jwt, "jwt");

  //   if (!jwt) {
  //     return;
  //   }
  //   // remove the URL fragment
  //   window.history.replaceState(null, "", window.location.pathname);

  //   // decode the JWT
  //   getUserSaltAndAddress(jwt).then((result) => {
  //     console.log("INside getUserSaltAddress");
  //     if (result) {
  //       console.log("Salt:", result.salt);
  //       console.log("Address:", result.address);
  //     }
  //   })//;

  //   const jwtPayload = jwtDecode(jwt);
  //   if (!jwtPayload.sub || !jwtPayload.aud) {
  //     console.warn("[completeZkLogin] missing jwt.sub or jwt.aud");
  //     return;
  //   }
  //   console.log("jwtpayload", jwtPayload);

  //   // === Get the salt ===
  //   const userSalt = await getSalt(jwtPayload.sub, jwt);
  //   console.log(userSalt);

  //   const userAddr = jwtToAddress(jwt, String(userSalt));
  //   // === Load and clear the data which beginZkLogin() created before the redirect ===
  //   const setupData = loadSetupData();
  //   if (!setupData) {
  //     console.warn("[completeZkLogin] missing session storage data");
  //     return;
  //   }
    // clearSetupData();
    // for (const account of accounts.current) {
    //   if (userAddr === account.userAddr) {
    //     // console.warn([completeZkLogin] already logged in with this ${setupData.provider} account)
    //     return;
    //   }
    // }
  //   // === Get the zero-knowledge proof ===\
  //   const ephemeralKeyPair = keypairFromSecretKey(
  //     setupData.ephemeralPrivateKey
  //   );
  //   const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();

  //   const payload = JSON.stringify(
  //     {
  //       maxEpoch: setupData.maxEpoch,
  //       jwtRandomness: setupData.randomness,
  //       extendedEphemeralPublicKey:
  //         getExtendedEphemeralPublicKey(ephemeralPublicKey),
  //       jwt,
  //       salt: userSalt.toString(),
  //       keyClaimName: "sub",
  //     },
  //     null,
  //     2
  //   );
  //   console.debug("[completeZkLogin] Requesting ZK proof with:", payload);
  //   setModalContent("⏳ Requesting ZK proof. This can take a few seconds...");
  //   const zkProofs = await axios.post(
  //     "https://prover-dev.mystenlabs.com/v1",
  //     payload,
  //     { headers: { "Content-Type": "application/json" } }
  //   );

  //   console.log(zkProofs);

  //   if (!zkProofs) {
  //     return;
  //   }
  //   saveAccount({
  //     // provider: setupData.provider,
  //     userAddr,
  //     zkProofs,
  //     ephemeralPrivateKey: setupData.ephemeralPrivateKey,
  //     userSalt: userSalt.toString(),
  //     sub: jwtPayload.sub,
  //     aud: typeof jwtPayload.aud === "string" ? jwtPayload.aud : jwtPayload.aud[0],
  //     maxEpoch: setupData.maxEpoch,
  //   });
  // }
  // // === Save data to session storage so sendTransaction() can use it ===
  // async function sendTransaction(account: AccountData) {
  //   setModalContent("🚀 Sending transaction...");

  //   // Sign the transaction bytes with the ephemeral private key
  //   try {
  //     const tx = new Transaction();
  //     tx.setSender(account.userAddr);
  //     console.log(account.userAddr);

  //     const ephemeralKeyPair = keypairFromSecretKey(account.ephemeralPrivateKey);
  //     console.log(ephemeralKeyPair);

  //     const { bytes, signature: userSignature } = await tx.sign({
  //       client: suiClient,
  //       signer: ephemeralKeyPair,
  //     });
  //     // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience)
  //     const addressSeed = genAddressSeed(
  //       BigInt(account.userSalt),
  //       "sub",
  //       account.sub,
  //       account.aud
  //     ).toString();
  //     // Serialize the zkLogin signature by combining the ZK proof (inputs), the maxEpoch,
  //     // and the ephemeral signature (userSignature)
  //     console.log("account.zkProofs",account.zkProofs);
  //     console.log("addressSeed",addressSeed);
  //     console.log("bytes",bytes);

  //     const zkLoginSignature = getZkLoginSignature({
  //       inputs: {
  //         ...account.zkProofs.data,
  //         addressSeed,
  //       },
  //       maxEpoch: account.maxEpoch,
  //       userSignature,
  //     });
  //     console.log("zkLoginSignature",zkLoginSignature);

  //     // Execute the transaction
  //     const res = await suiClient.executeTransactionBlock({
  //         transactionBlock: bytes,
  //         signature: zkLoginSignature,
  //         options: {
  //           showEffects: true,
  //         },
  //       })
  //       .then((result) => {
  //         console.debug(
  //           "[sendTransaction] executeTransactionBlock response:",
  //           result
  //         );
  //         fetchBalances([account]);
  //       })
  //       .catch((error: unknown) => {
  //         console.warn(
  //           "[sendTransaction] executeTransactionBlock failed:",
  //           error
  //         );
  //         return null;
  //       })
  //       .finally(() => {
  //         setModalContent("");
  //       });
      
  //   } catch (error) {
  //     console.log("Failed ", error);
  //   }
  // }

  // /**
  //  * Get the SUI balance for each account
  //  */
  // async function fetchBalances(accounts: AccountData[]) {
  //   if (accounts.length == 0) {
  //     return;
  //   }
  //   const newBalances = new Map<string, number>();
  //   for (const account of accounts) {
  //     try {
  //       const suiBalance = await suiClient.getBalance({
  //         owner: account.userAddr,
  //         coinType: "0x2::sui::SUI",
  //       });
  //       newBalances.set(
  //         account.userAddr,
  //         +suiBalance.totalBalance / 1_000_000_000
  //       );
  //     } catch (error) {
  //       console.error(`Failed to fetch balance for ${account.userAddr}`, error);
  //       newBalances.set(account.userAddr, 0); // Or handle appropriately
  //     }
  //   }
  //   setBalances(newBalances)//;
  // }


  // async function getUserSaltAndAddress(userJwt: string) {
  //   console.log("JWt inside enoki", userJwt);
  
  //   const url = 'https://api.enoki.mystenlabs.com/v1/zklogin';
  //   const headers = {
  //     'Authorization': 'Bearer enoki_public_6771382f7ef797a6473a2871dbfbca4a', // Replace with your actual API key
  //     'zklogin-jwt': userJwt
  //   };
  //   try {
  //     const response = await fetch(url, {
  //       method: 'GET',
  //       headers: headers,
  //     });
  //     if (response.ok) {
  //       const responseData = await response.json();
  //       const { salt, address } = responseData.data;
  //       return { salt, address };
  //     } else {
  //       throw new Error(
  //         `Failed to fetch data: ${response.status} ${response.statusText}`
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return null;
  //   }
  // }


  // function keypairFromSecretKey(privateKeyBase64: string): Ed25519Keypair {
  //   const keyPair = decodeSuiPrivateKey(privateKeyBase64);
  //   return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
  // }

  // function loadSetupData(): SetupData | null {
  //   const dataRaw = sessionStorage.getItem(setupDataKey);
  //   if (!dataRaw) {
  //     return null;
  //   }
  //   const data: SetupData = JSON.parse(dataRaw);
  //   return data;
  // }
  // function clearSetupData(): void {
  //   sessionStorage.removeItem(setupDataKey);
  // }

  function saveSetupData(data: SetupData) {
    sessionStorage.setItem(setupDataKey, JSON.stringify(data));
  }
  function saveAccount(account: AccountData): void {
    const newAccounts = [account, ...accounts.current];
    sessionStorage.setItem(accountDataKey, JSON.stringify(newAccounts));
    accounts.current = newAccounts;
  }

  function loadAccounts(): AccountData[] {

    if (typeof window === 'undefined') {
      // If it's server-side, return an empty array
      return [];
    }

    const dataRaw = sessionStorage.getItem(accountDataKey);
    if (!dataRaw) {
      return [];
    }
    const data: AccountData[] = JSON.parse(dataRaw);
    return data;
  }

  const openIdProviders: OpenIdProvider[] = ["Google"];

  return (
    // <div className="wallet-manager">
    //   <div className="add-account-container">
    //     <div className="add-account-header">
    //       <h1>Add Account</h1>
    //     </div>
    //     <div className="add-account-body">
    //       <div className="divider">CREATE NEW</div>
    //       <div >
        //   {openIdProviders.map((provider) => (
        //   <button
            
        //     onClick={() => {
        //       beginZkLogin(provider);
        //     }}
        //     key={provider}
        //     style={{
        //       display: 'flex',
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //       textAlign: 'center',
        //       width: '100%',
        //       padding: '10px',
        //       fontSize: '18px',
        //       borderRadius: '0.5rem',
        //       border: 'none',
        //       background: 'linear-gradient(90deg, #007bff9f, #800080)',
        //       color: 'white',
        //       cursor: 'pointer',
        //       transition: 'all .6s ease',
        //       marginTop: '10px',
        //       marginBottom: '10px',
        //       fontFamily: 'Arial, Helvetica, sans-serif',
        //     }}
        //   >
        //     <i className="fab fa-google" style={{ marginRight: '8px' }}></i>
        //     Continue with {provider}
        //   </button>
        // ))} 
    //     </div><br/>
    //       <button className="add-account-button" onClick={handleCreate}>
    //         Create a new Passphrase Account
    //       </button>
    //     </div>
    //     <button className="close-button" onClick={handleClose}>
    //       &times;
    //     </button>
        
    //   </div>
    // </div>
    <div className="wallet-manager">
      
        <div className='card'>
            <div className='backgrounddesing'>
              <svg className='backgrounddesing1' opacity='60%' width="200" height="250" viewBox="0 0 234 310" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M155.199 182.994C155.611 161.996 160.788 145.63 165.604 135.604C168.137 130.331 174.291 128.198 179.598 130.661C202.391 141.239 216.606 163.312 222.94 180.151C225.603 187.234 220.569 194.302 213.056 195.207C193.796 197.528 179.191 196.968 167.692 196.148C160.704 195.65 155.062 189.998 155.199 182.994Z" fill="url(#paint0_linear_2012_7952)" />
                <path d="M269.704 301.375C205.104 298.855 154.766 244.249 157.296 179.386C159.826 114.523 214.264 64.0038 278.864 66.5234C343.465 69.0431 393.802 123.649 391.272 188.512C388.742 253.375 334.305 303.895 269.704 301.375Z" stroke="url(#paint1_linear_2012_7952)" stroke-width="6" />
                <circle cx="186.585" cy="20.5844" r="176.717" transform="rotate(92.2336 186.585 20.5844)" stroke="url(#paint2_linear_2012_7952)" stroke-width="6" />
                <circle cx="144" cy="205.222" r="82" stroke="url(#paint3_linear_2012_7952)" stroke-width="6" />
                <defs>
                  <linearGradient id="paint0_linear_2012_7952" x1="155" y1="139.999" x2="155" y2="178.499" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FF89C2" />
                    <stop offset="0.5" stop-color="#F65BA4" />
                    <stop offset="1" stop-color="#BD46F4" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_2012_7952" x1="355.401" y1="234.175" x2="149.438" y2="153.197" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E34D67" />
                    <stop offset="0.5" stop-color="#FF67E0" />
                    <stop offset="1" stop-color="#7746F4" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_2012_7952" x1="256.712" y1="-103.659" x2="147.308" y2="208.843" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E34D67" />
                    <stop offset="0.5" stop-color="#FF67E0" />
                    <stop offset="1" stop-color="#7746F4" />
                  </linearGradient>
                  <linearGradient id="paint3_linear_2012_7952" x1="177.168" y1="146.459" x2="125.424" y2="294.262" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E34D67" />
                    <stop offset="0.5" stop-color="#FF67E0" />
                    <stop offset="1" stop-color="#7746F4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className='updatetext'>
              <label className='update'>Updated!</label><br/>
              <label className='subtext1'>Proceed to create a wallet</label>
            </div><br/>
            <div className='subcard'>
              <div className='subcard1'>
             <div  className='backbutton'>
             <button onClick={handleClose}>
              <svg width="24" height="44" viewBox="0 0 24 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 18L10 22L14 26" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
             </div>
              <svg width="137" height="50" viewBox="0 0 137 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25" fill="url(#paint0_linear_2012_7963)" />
                <path d="M19.1019 37.6812H16.9419C16.3896 37.6812 15.9419 37.2334 15.9419 36.6812V18.9782C15.9419 18.4259 16.388 17.9782 16.9403 17.9782H25.7178C27.1738 17.9782 32.7897 19.2358 32.7897 25.1048C32.7897 30.9738 29.0458 32.441 25.7178 32.441H22.7649C22.2127 32.441 21.7658 31.9933 21.7658 31.441V29.4585C21.7658 28.9062 22.2135 28.4585 22.7658 28.4585H25.7178C28.6298 28.4585 29.0458 26.1528 29.0458 25.1048C29.0458 24.0568 28.4218 21.9607 25.7178 21.9607H20.1019V36.6812C20.1019 37.2335 19.6541 37.6812 19.1019 37.6812Z" fill="white" />
                <path d="M15.9419 15.3014V13.3188C15.9419 12.7666 16.3892 12.3188 16.9415 12.3188H25.7178C28.6298 12.3188 38.4057 13.7861 38.4057 25.1048C38.4057 36.4235 28.4218 37.6812 25.7178 37.6812H22.7653C22.213 37.6812 21.7658 37.2335 21.7658 36.6812V35.1179C21.7658 34.5656 22.2136 34.1179 22.7658 34.1179H25.7178C31.3337 34.1179 34.4537 30.345 34.4537 25.1048C34.4537 19.8647 30.5017 16.3014 25.7178 16.3014H16.941C16.3887 16.3014 15.9419 15.8536 15.9419 15.3014Z" fill="white" />
                <path d="M59.8359 34V15.3808H66.9584C68.825 15.3808 70.4164 15.7421 71.7325 16.4647C73.0572 17.1787 74.068 18.2195 74.7648 19.5872C75.4701 20.955 75.8228 22.6238 75.8228 24.5936V24.6195C75.8228 26.5893 75.4701 28.2753 74.7648 29.6775C74.068 31.0796 73.0572 32.1506 71.7325 32.8903C70.4164 33.6301 68.825 34 66.9584 34H59.8359ZM63.7326 30.7871H66.481C67.6422 30.7871 68.6229 30.5549 69.4229 30.0904C70.2229 29.6172 70.825 28.9248 71.2293 28.013C71.6422 27.1011 71.8487 25.9743 71.8487 24.6324V24.6065C71.8487 23.3162 71.6379 22.2238 71.2164 21.3292C70.8035 20.4345 70.1971 19.755 69.3971 19.2905C68.5971 18.826 67.625 18.5937 66.481 18.5937H63.7326V30.7871ZM82.7905 34.2839C81.7754 34.2839 80.9109 34.0774 80.197 33.6645C79.4916 33.2516 78.9497 32.6581 78.5712 31.8839C78.2013 31.1011 78.0163 30.1678 78.0163 29.0839V20.1421H81.784V28.2968C81.784 29.2087 81.9948 29.914 82.4163 30.4129C82.8378 30.9119 83.4743 31.1613 84.3259 31.1613C84.756 31.1613 85.1388 31.0882 85.4743 30.942C85.8098 30.7957 86.098 30.5893 86.3388 30.3226C86.5883 30.0474 86.7732 29.7248 86.8937 29.3549C87.0227 28.9764 87.0872 28.5592 87.0872 28.1033V20.1421H90.8549V34H87.0872V31.7291H87.0098C86.7689 32.2538 86.4507 32.7097 86.055 33.0968C85.6679 33.4753 85.1991 33.7677 84.6485 33.9742C84.1066 34.1806 83.4872 34.2839 82.7905 34.2839ZM93.4226 38.529V20.1421H97.1903V22.5421H97.2806C97.5301 21.9829 97.857 21.5055 98.2613 21.1098C98.6742 20.7055 99.1559 20.3958 99.7064 20.1808C100.257 19.9657 100.859 19.8582 101.513 19.8582C102.683 19.8582 103.689 20.1464 104.532 20.7227C105.375 21.2991 106.025 22.1249 106.481 23.2001C106.936 24.2754 107.164 25.5614 107.164 27.0581V27.071C107.164 28.5764 106.936 29.8667 106.481 30.942C106.033 32.0172 105.388 32.843 104.545 33.4194C103.711 33.9957 102.713 34.2839 101.552 34.2839C100.898 34.2839 100.291 34.1763 99.7322 33.9613C99.1731 33.7462 98.6871 33.4452 98.2742 33.0581C97.8613 32.6624 97.5301 32.1936 97.2806 31.6516H97.1903V38.529H93.4226ZM100.261 31.1613C100.889 31.1613 101.431 30.9979 101.887 30.671C102.352 30.3355 102.709 29.8624 102.958 29.2517C103.207 28.6409 103.332 27.914 103.332 27.071V27.0581C103.332 26.2151 103.207 25.4883 102.958 24.8775C102.709 24.2668 102.352 23.798 101.887 23.4711C101.431 23.1442 100.889 22.9808 100.261 22.9808C99.6505 22.9808 99.1129 23.1485 98.6484 23.484C98.1839 23.8109 97.8183 24.2797 97.5516 24.8904C97.2936 25.5012 97.1645 26.228 97.1645 27.071V27.0839C97.1645 27.9183 97.2936 28.6409 97.5516 29.2517C97.8183 29.8624 98.1839 30.3355 98.6484 30.671C99.1129 30.9979 99.6505 31.1613 100.261 31.1613ZM113.306 34.2194C112.386 34.2194 111.577 34.043 110.881 33.6903C110.184 33.329 109.638 32.8344 109.242 32.2065C108.855 31.5699 108.661 30.8473 108.661 30.0388V30.0129C108.661 29.1699 108.872 28.4517 109.293 27.8581C109.715 27.256 110.326 26.7829 111.126 26.4388C111.934 26.0861 112.911 25.8754 114.055 25.8065L119.435 25.4711V27.8065L114.622 28.1291C113.891 28.1721 113.336 28.3441 112.958 28.6452C112.579 28.9377 112.39 29.3291 112.39 29.8194V29.8323C112.39 30.3484 112.584 30.7527 112.971 31.0452C113.367 31.3291 113.887 31.471 114.532 31.471C115.1 31.471 115.603 31.3635 116.042 31.1484C116.48 30.9248 116.829 30.6237 117.087 30.2452C117.345 29.8581 117.474 29.4237 117.474 28.942V24.7227C117.474 24.1033 117.276 23.6173 116.88 23.2646C116.493 22.9119 115.93 22.7356 115.19 22.7356C114.493 22.7356 113.934 22.8818 113.513 23.1743C113.1 23.4582 112.846 23.8238 112.751 24.2711L112.726 24.3872H109.268L109.281 24.2324C109.358 23.3808 109.646 22.6281 110.145 21.9743C110.644 21.312 111.332 20.7958 112.21 20.4259C113.096 20.0475 114.145 19.8582 115.358 19.8582C116.554 19.8582 117.59 20.0518 118.468 20.4388C119.345 20.8173 120.024 21.355 120.506 22.0517C120.997 22.7485 121.242 23.5657 121.242 24.5033V34H117.474V31.9613H117.384C117.126 32.4258 116.794 32.8301 116.39 33.1742C115.986 33.5097 115.521 33.7677 114.997 33.9484C114.48 34.129 113.917 34.2194 113.306 34.2194ZM125.822 38.5935C125.461 38.5935 125.113 38.5763 124.777 38.5419C124.442 38.5075 124.162 38.4731 123.938 38.4387V35.6387C124.076 35.6559 124.248 35.6774 124.455 35.7032C124.67 35.7376 124.915 35.7548 125.19 35.7548C125.758 35.7548 126.209 35.6559 126.545 35.458C126.88 35.2688 127.126 34.9376 127.28 34.4645L127.448 34L122.558 20.1421H126.687L129.835 31.7549L129.306 30.9549H130.042L129.513 31.7549L132.661 20.1421H136.635L131.887 34.2323C131.517 35.3247 131.057 36.1892 130.506 36.8258C129.956 37.4623 129.293 37.9139 128.519 38.1806C127.753 38.4559 126.855 38.5935 125.822 38.5935Z" fill="white" />
                <defs>
                  <linearGradient id="paint0_linear_2012_7963" x1="0" y1="0" x2="0" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E34D67" />
                    <stop offset="1" stop-color="#7746F4" />
                  </linearGradient>
                </defs>
              </svg>
              </div>
              <div className='subcard2'>
                <svg width="151" height="20" viewBox="0 0 151 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.2916 2.436V15H11.7716V6.828L8.40556 15H6.49756L3.11356 6.828V15H0.593563V2.436H3.45556L7.45156 11.778L11.4476 2.436H14.2916ZM16.135 9.978C16.135 8.97 16.333 8.076 16.729 7.296C17.137 6.516 17.683 5.916 18.367 5.496C19.063 5.076 19.837 4.866 20.689 4.866C21.433 4.866 22.081 5.016 22.633 5.316C23.197 5.616 23.647 5.994 23.983 6.45V5.028H26.521V15H23.983V13.542C23.659 14.01 23.209 14.4 22.633 14.712C22.069 15.012 21.415 15.162 20.671 15.162C19.831 15.162 19.063 14.946 18.367 14.514C17.683 14.082 17.137 13.476 16.729 12.696C16.333 11.904 16.135 10.998 16.135 9.978ZM23.983 10.014C23.983 9.402 23.863 8.88 23.623 8.448C23.383 8.004 23.059 7.668 22.651 7.44C22.243 7.2 21.805 7.08 21.337 7.08C20.869 7.08 20.437 7.194 20.041 7.422C19.645 7.65 19.321 7.986 19.069 8.43C18.829 8.862 18.709 9.378 18.709 9.978C18.709 10.578 18.829 11.106 19.069 11.562C19.321 12.006 19.645 12.348 20.041 12.588C20.449 12.828 20.881 12.948 21.337 12.948C21.805 12.948 22.243 12.834 22.651 12.606C23.059 12.366 23.383 12.03 23.623 11.598C23.863 11.154 23.983 10.626 23.983 10.014ZM34.5082 4.884C35.6962 4.884 36.6562 5.262 37.3882 6.018C38.1202 6.762 38.4862 7.806 38.4862 9.15V15H35.9662V9.492C35.9662 8.7 35.7682 8.094 35.3722 7.674C34.9762 7.242 34.4362 7.026 33.7522 7.026C33.0562 7.026 32.5042 7.242 32.0962 7.674C31.7002 8.094 31.5022 8.7 31.5022 9.492V15H28.9822V5.028H31.5022V6.27C31.8382 5.838 32.2642 5.502 32.7802 5.262C33.3082 5.01 33.8842 4.884 34.5082 4.884ZM44.7886 4.866C45.5326 4.866 46.1866 5.016 46.7506 5.316C47.3146 5.604 47.7586 5.982 48.0826 6.45V5.028H50.6206V15.072C50.6206 15.996 50.4346 16.818 50.0626 17.538C49.6906 18.27 49.1326 18.846 48.3886 19.266C47.6446 19.698 46.7446 19.914 45.6886 19.914C44.2726 19.914 43.1086 19.584 42.1966 18.924C41.2966 18.264 40.7866 17.364 40.6666 16.224H43.1686C43.3006 16.68 43.5826 17.04 44.0146 17.304C44.4586 17.58 44.9926 17.718 45.6166 17.718C46.3486 17.718 46.9426 17.496 47.3986 17.052C47.8546 16.62 48.0826 15.96 48.0826 15.072V13.524C47.7586 13.992 47.3086 14.382 46.7326 14.694C46.1686 15.006 45.5206 15.162 44.7886 15.162C43.9486 15.162 43.1806 14.946 42.4846 14.514C41.7886 14.082 41.2366 13.476 40.8286 12.696C40.4326 11.904 40.2346 10.998 40.2346 9.978C40.2346 8.97 40.4326 8.076 40.8286 7.296C41.2366 6.516 41.7826 5.916 42.4666 5.496C43.1626 5.076 43.9366 4.866 44.7886 4.866ZM48.0826 10.014C48.0826 9.402 47.9626 8.88 47.7226 8.448C47.4826 8.004 47.1586 7.668 46.7506 7.44C46.3426 7.2 45.9046 7.08 45.4366 7.08C44.9686 7.08 44.5366 7.194 44.1406 7.422C43.7446 7.65 43.4206 7.986 43.1686 8.43C42.9286 8.862 42.8086 9.378 42.8086 9.978C42.8086 10.578 42.9286 11.106 43.1686 11.562C43.4206 12.006 43.7446 12.348 44.1406 12.588C44.5486 12.828 44.9806 12.948 45.4366 12.948C45.9046 12.948 46.3426 12.834 46.7506 12.606C47.1586 12.366 47.4826 12.03 47.7226 11.598C47.9626 11.154 48.0826 10.626 48.0826 10.014ZM62.3518 9.798C62.3518 10.158 62.3278 10.482 62.2798 10.77H54.9898C55.0498 11.49 55.3018 12.054 55.7458 12.462C56.1898 12.87 56.7358 13.074 57.3838 13.074C58.3198 13.074 58.9858 12.672 59.3818 11.868H62.0998C61.8118 12.828 61.2598 13.62 60.4438 14.244C59.6278 14.856 58.6258 15.162 57.4378 15.162C56.4778 15.162 55.6138 14.952 54.8458 14.532C54.0898 14.1 53.4958 13.494 53.0638 12.714C52.6438 11.934 52.4338 11.034 52.4338 10.014C52.4338 8.982 52.6438 8.076 53.0638 7.296C53.4838 6.516 54.0718 5.916 54.8278 5.496C55.5838 5.076 56.4538 4.866 57.4378 4.866C58.3858 4.866 59.2318 5.07 59.9758 5.478C60.7318 5.886 61.3138 6.468 61.7218 7.224C62.1418 7.968 62.3518 8.826 62.3518 9.798ZM59.7418 9.078C59.7298 8.43 59.4958 7.914 59.0398 7.53C58.5838 7.134 58.0258 6.936 57.3658 6.936C56.7418 6.936 56.2138 7.128 55.7818 7.512C55.3618 7.884 55.1038 8.406 55.0078 9.078H59.7418ZM78.0203 5.028L71.8463 19.716H69.1643L71.3243 14.748L67.3283 5.028H70.1543L72.7283 11.994L75.3383 5.028H78.0203ZM83.8067 15.162C82.8467 15.162 81.9827 14.952 81.2147 14.532C80.4467 14.1 79.8407 13.494 79.3967 12.714C78.9647 11.934 78.7487 11.034 78.7487 10.014C78.7487 8.994 78.9707 8.094 79.4147 7.314C79.8707 6.534 80.4887 5.934 81.2687 5.514C82.0487 5.082 82.9187 4.866 83.8787 4.866C84.8387 4.866 85.7087 5.082 86.4887 5.514C87.2687 5.934 87.8807 6.534 88.3247 7.314C88.7807 8.094 89.0087 8.994 89.0087 10.014C89.0087 11.034 88.7747 11.934 88.3067 12.714C87.8507 13.494 87.2267 14.1 86.4347 14.532C85.6547 14.952 84.7787 15.162 83.8067 15.162ZM83.8067 12.966C84.2627 12.966 84.6887 12.858 85.0847 12.642C85.4927 12.414 85.8167 12.078 86.0567 11.634C86.2967 11.19 86.4167 10.65 86.4167 10.014C86.4167 9.066 86.1647 8.34 85.6607 7.836C85.1687 7.32 84.5627 7.062 83.8427 7.062C83.1227 7.062 82.5167 7.32 82.0247 7.836C81.5447 8.34 81.3047 9.066 81.3047 10.014C81.3047 10.962 81.5387 11.694 82.0067 12.21C82.4867 12.714 83.0867 12.966 83.8067 12.966ZM100.271 5.028V15H97.7332V13.74C97.4092 14.172 96.9832 14.514 96.4552 14.766C95.9392 15.006 95.3752 15.126 94.7632 15.126C93.9832 15.126 93.2932 14.964 92.6932 14.64C92.0932 14.304 91.6192 13.818 91.2712 13.182C90.9352 12.534 90.7672 11.766 90.7672 10.878V5.028H93.2872V10.518C93.2872 11.31 93.4852 11.922 93.8812 12.354C94.2772 12.774 94.8172 12.984 95.5012 12.984C96.1972 12.984 96.7432 12.774 97.1392 12.354C97.5352 11.922 97.7332 11.31 97.7332 10.518V5.028H100.271ZM105.278 6.576C105.602 6.048 106.022 5.634 106.538 5.334C107.066 5.034 107.666 4.884 108.338 4.884V7.53H107.672C106.88 7.53 106.28 7.716 105.872 8.088C105.476 8.46 105.278 9.108 105.278 10.032V15H102.758V5.028H105.278V6.576ZM118.716 2.436C120.036 2.436 121.194 2.694 122.19 3.21C123.198 3.726 123.972 4.464 124.512 5.424C125.064 6.372 125.34 7.476 125.34 8.736C125.34 9.996 125.064 11.1 124.512 12.048C123.972 12.984 123.198 13.71 122.19 14.226C121.194 14.742 120.036 15 118.716 15H114.324V2.436H118.716ZM118.626 12.858C119.946 12.858 120.966 12.498 121.686 11.778C122.406 11.058 122.766 10.044 122.766 8.736C122.766 7.428 122.406 6.408 121.686 5.676C120.966 4.932 119.946 4.56 118.626 4.56H116.844V12.858H118.626ZM136.496 9.798C136.496 10.158 136.472 10.482 136.424 10.77H129.134C129.194 11.49 129.446 12.054 129.89 12.462C130.334 12.87 130.88 13.074 131.528 13.074C132.464 13.074 133.13 12.672 133.526 11.868H136.244C135.956 12.828 135.404 13.62 134.588 14.244C133.772 14.856 132.77 15.162 131.582 15.162C130.622 15.162 129.758 14.952 128.99 14.532C128.234 14.1 127.64 13.494 127.208 12.714C126.788 11.934 126.578 11.034 126.578 10.014C126.578 8.982 126.788 8.076 127.208 7.296C127.628 6.516 128.216 5.916 128.972 5.496C129.728 5.076 130.598 4.866 131.582 4.866C132.53 4.866 133.376 5.07 134.12 5.478C134.876 5.886 135.458 6.468 135.866 7.224C136.286 7.968 136.496 8.826 136.496 9.798ZM133.886 9.078C133.874 8.43 133.64 7.914 133.184 7.53C132.728 7.134 132.17 6.936 131.51 6.936C130.886 6.936 130.358 7.128 129.926 7.512C129.506 7.884 129.248 8.406 129.152 9.078H133.886ZM146.094 2.436V4.47H140.856V7.692H144.87V9.69H140.856V15H138.336V2.436H146.094ZM149.159 3.84C148.715 3.84 148.343 3.702 148.043 3.426C147.755 3.138 147.611 2.784 147.611 2.364C147.611 1.944 147.755 1.596 148.043 1.32C148.343 1.032 148.715 0.887999 149.159 0.887999C149.603 0.887999 149.969 1.032 150.257 1.32C150.557 1.596 150.707 1.944 150.707 2.364C150.707 2.784 150.557 3.138 150.257 3.426C149.969 3.702 149.603 3.84 149.159 3.84ZM150.401 5.028V15H147.881V5.028H150.401Z" fill="white" />
                </svg>
              </div>
              <div className='subcard3'>
              {openIdProviders.map((provider) => (
                <button onClick={() => { beginZkLogin(provider); }} key={provider} className="create-wallet-button">
                  <div>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" width="24" height="24" fill="white" fill-opacity="0.01" />
                    <g opacity="0.9">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.96227 1.59325C6.27721 2.49474 3.98927 4.46639 2.7149 6.96148C2.27035 7.82226 1.95028 8.73538 1.75468 9.6834C1.26864 12.0331 1.6065 14.5398 2.70897 16.6801C3.42618 18.076 4.45753 19.3206 5.70226 20.2919C6.88179 21.2108 8.251 21.8971 9.70911 22.2752C11.5466 22.7579 13.5026 22.7463 15.3519 22.3333C17.0234 21.9553 18.606 21.1701 19.8685 20.0302C21.2021 18.8262 22.1564 17.2443 22.6603 15.5402C23.2115 13.6848 23.2826 11.7016 22.9388 9.7939C19.4832 9.7939 16.0217 9.7939 12.5661 9.7939C12.5661 11.2014 12.5661 12.6089 12.5661 14.0164C14.5695 14.0164 16.5729 14.0164 18.5764 14.0164C18.3452 15.3657 17.5272 16.5987 16.3714 17.3606C15.6423 17.8433 14.8066 18.1516 13.9412 18.3028C13.0758 18.4482 12.1749 18.4657 11.3095 18.297C10.4263 18.1225 9.59057 17.7619 8.85558 17.2559C7.68198 16.4475 6.78695 15.2668 6.33055 13.9349C5.8623 12.5798 5.85637 11.0734 6.33055 9.72411C6.66248 8.77028 7.20779 7.89205 7.93092 7.17086C8.82002 6.27519 9.97584 5.63542 11.2265 5.3737C12.2934 5.15269 13.4196 5.1934 14.4628 5.50165C15.3519 5.76337 16.1699 6.2461 16.8397 6.87424C17.5154 6.21121 18.1911 5.54818 18.8668 4.88515C19.2224 4.53037 19.5958 4.18722 19.9396 3.82081C18.9142 2.89024 17.705 2.13996 16.3892 1.66305C14.0183 0.80227 11.351 0.784822 8.96227 1.59325Z" fill="white" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.96222 1.59326C11.345 0.784824 14.0182 0.802272 16.3891 1.65723C17.705 2.13415 18.9082 2.87861 19.9396 3.81499C19.5958 4.1814 19.2224 4.52455 18.8667 4.87933C18.191 5.54236 17.5153 6.20539 16.8396 6.86843C16.1698 6.24029 15.3518 5.76337 14.4627 5.49583C13.4195 5.18758 12.2934 5.14106 11.2264 5.36788C9.98171 5.6296 8.82589 6.26937 7.93087 7.16504C7.20774 7.88042 6.66242 8.76446 6.3305 9.7183C5.12725 8.79936 3.92401 7.88624 2.71484 6.9673C3.98921 4.46639 6.27715 2.49475 8.96222 1.59326Z" fill="#EA4335" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.76071 9.67761C1.95631 8.7354 2.27639 7.81647 2.72093 6.95569C3.92418 7.87463 5.12742 8.78775 6.33659 9.70669C5.8624 11.0618 5.8624 12.5682 6.33659 13.9175C5.13334 14.8365 3.9301 15.7554 2.72686 16.6685C1.61253 14.534 1.27467 12.0273 1.76071 9.67761Z" fill="#FBBC05" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.566 9.78809C16.0216 9.78809 19.4831 9.78809 22.9388 9.78809C23.2825 11.6899 23.2055 13.6732 22.6602 15.5344C22.1564 17.2385 21.2021 18.8204 19.8684 20.0244C18.7007 19.1345 17.5331 18.2446 16.3654 17.3548C17.5212 16.5929 18.3392 15.3599 18.5703 14.0105C16.5669 14.0105 14.5635 14.0105 12.5601 14.0105C12.566 12.6031 12.566 11.1956 12.566 9.78809Z" fill="#4285F4" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.71484 16.6743C3.91809 15.7612 5.12133 14.8423 6.32457 13.9233C6.7869 15.2552 7.67599 16.4359 8.8496 17.2443C9.58458 17.7503 10.4263 18.1109 11.3035 18.2854C12.1689 18.4599 13.0639 18.4366 13.9352 18.2912C14.8006 18.14 15.6364 17.8317 16.3654 17.349C17.5331 18.2389 18.7008 19.1287 19.8684 20.0186C18.6059 21.1643 17.0233 21.9437 15.3518 22.3217C13.5025 22.7347 11.5465 22.7463 9.70906 22.2636C8.25094 21.8855 6.88173 21.2051 5.7022 20.2803C4.4634 19.3148 3.43205 18.0702 2.71484 16.6743Z" fill="#34A853" />
                    </g>
                  </svg>
                  </div>
                  <div className="subtext">
                      Continue with Google
                  </div>
                </button>
              ))} </div>
              <div className='subcard4'>
                <button onClick={handleCreate} className="existing-wallet-button2">
                  <div className="subtextcontainer">
                    <div className="subtext3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6892 3.21344C9.35064 3.21344 7.45482 5.10926 7.45482 7.44787V10.114H15.9237V7.44787C15.9237 5.10926 14.0279 3.21344 11.6892 3.21344ZM5.95482 7.44787V10.1423C4.84712 10.3168 4 11.2756 4 12.4323V19.6965C4 20.9769 5.03796 22.0148 6.31834 22.0148H17.1373C18.4176 22.0148 19.4556 20.9769 19.4556 19.6965V12.4323C19.4556 11.2489 18.5689 10.2726 17.4237 10.1315V7.44787C17.4237 4.28083 14.8563 1.71344 11.6892 1.71344C8.52221 1.71344 5.95482 4.28083 5.95482 7.44787ZM17.1373 11.614H6.31834C5.86638 11.614 5.5 11.9804 5.5 12.4323V19.6965C5.5 20.1484 5.86638 20.5148 6.31834 20.5148H17.1373C17.5892 20.5148 17.9556 20.1484 17.9556 19.6965V12.4323C17.9556 11.9804 17.5892 11.614 17.1373 11.614ZM11.6504 15.4507C11.9944 15.4507 12.2733 15.1718 12.2733 14.8279C12.2733 14.4839 11.9944 14.205 11.6504 14.205C11.3064 14.205 11.0276 14.4839 11.0276 14.8279C11.0276 15.1718 11.3064 15.4507 11.6504 15.4507ZM13.2733 14.8279C13.2733 15.4218 12.9542 15.9413 12.478 16.2241V18.228C12.478 18.6423 12.1422 18.978 11.728 18.978C11.3138 18.978 10.978 18.6423 10.978 18.228V16.3053C10.4173 16.0497 10.0276 15.4843 10.0276 14.8279C10.0276 13.9316 10.7541 13.205 11.6504 13.205C12.5467 13.205 13.2733 13.9316 13.2733 14.8279Z" fill="white" />
                      </svg>
                    </div>
                    <div className="subtext2">
                      Create a paraphrase account
                    </div>
                  </div>
                </button>
              </div>
            </div>
        </div>        
    </div>
  );
};

export default AddAccount;
