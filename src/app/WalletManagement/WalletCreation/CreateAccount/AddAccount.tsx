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

const NETWORK: ValidNetworkName = "devnet";
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
    //window.location.href = "../CreatePassword";
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
      redirect_uri: `http://localhost:3000/WalletManagement/WalletCreation/CreateAccount/ZkDetails`,
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
    <div className="wallet-manager">
      <div className="add-account-container">
        <div className="add-account-header">
          <h1>Add Account</h1>
        </div>
        <div className="add-account-body">
          {/* <button className="add-account-button ledger">Set up Ledger</button> */}
          <div className="divider">CREATE NEW</div>
          <div >
          {openIdProviders.map((provider) => (
          <button
            
            onClick={() => {
              beginZkLogin(provider);
            }}
            key={provider}
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
            <i className="fab fa-google" style={{ marginRight: '8px' }}></i>
            Continue with {provider}
          </button>
        ))} 
        </div><br/>
          <button className="add-account-button" onClick={handleCreate}>
            Create a new Passphrase Account
          </button>
          {/* <div className="divider">IMPORT EXISTING ACCOUNTS</div>
                <button className="add-account-button">Import Passphrase</button>
                <button className="add-account-button">Import Private Key</button> */}
        </div>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        
      </div>
    </div>
  );
};

export default AddAccount;
