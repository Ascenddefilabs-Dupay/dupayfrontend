"use client";
import React from "react";
import config from "../config.json";
import "../AddAccount.css";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import {
  NetworkName,
  makePolymediaUrl,
  requestSuiFromFaucet,
  shortenAddress,
} from "@polymedia/suitcase-core";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  jwtToAddress,
} from "@mysten/zklogin";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { jwtDecode } from "jwt-decode";
//import { LinkExternal, Modal, isLocalhost } from "@polymedia/suitcase-react";
import { log } from "console";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from  "axios";
import  styles from "./zkdetails.module.css";

type ValidNetworkName = "testnet" | "devnet" | "localnet";
const NETWORK: ValidNetworkName = "testnet";

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

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

function ZkDetails() {
  const accounts = useRef<AccountData[]>(loadAccounts());
  const [modalContent, setModalContent] = useState<string>(" ");
  const [balances, setBalances] = useState<Map<string, number>>(new Map());
  const [userId, setUserId] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [walletId, setWalletId] = useState("");
  const [resultAddress, setResultAddress] = useState<string | null>(null);


  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    completZkLogin();
    fetchBalances(accounts.current);
    const interval = setInterval(() => fetchBalances(accounts.current), 5_000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setId(sessionData.user_id);
        console.log("User ID:",sessionData.user_id);
        console.log(id);
        console.log(sessionData.user_email);
  
        // Ensure accounts exist and fetch the wallet ID
        if (accounts.current && accounts.current.length > 0) {
          const account = accounts.current[0]; // Fetch the first account
          fetchWalletId(account).then((walletId) => {
            console.log("Wallet ID:", walletId);
            setWalletId(walletId); // Assuming you have a state to store it
          });
        }
      }
    }
    // Adding an empty dependency array will ensure this runs only once on component mount
  }, []); 
  
  useEffect(() => {
    
    const timer = setTimeout(async () => {

      // Save account data before redirection
      if (accounts.current && accounts.current.length > 0) {
        const account = accounts.current[0]; // Assuming we are saving the first account
        await saveAccount(account); // Call the save function before redirection
      }


      router.push("/Userauthorization/Dashboard/Home");
    }, 1200); 
  
    return () => clearTimeout(timer);
  }, [router]);

  // Enoki API integration for getting the salt
  const fetchWalletId = async (account: AccountData) => {
    const id = account.userAddr; // Directly access the property
    console.log(id); // This will log the actual resolved wallet ID (the user address)
    return id;
  };
  


  async function completZkLogin() {
    // grab the JWT from the URL fragment (the '#...')
    const urlFragment = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(urlFragment);
    const jwt = urlParams.get("id_token");
    console.log("jwt token");
    console.log(jwt, "jwt");

    if (!jwt) {
      return;
    }
    // remove the URL fragment
    window.history.replaceState(null, "", window.location.pathname);

    // decode the JWT
    getUserSaltAndAddress(jwt).then((result) => {
      console.log("INside getUserSaltAddress");
      if (result) {
        console.log("Salt:", result.salt);
        console.log("Address:", result.address);
        setWalletId(result.address);
        const Salt = result.salt;
        const Address = result.address;
        setResultAddress(result.address);
      }
    }); //;

    const jwtPayload = jwtDecode(jwt);
    if (!jwtPayload.sub || !jwtPayload.aud) {
      console.warn("[completeZkLogin] missing jwt.sub or jwt.aud");
      return;
    }
    console.log("jwtpayload", jwtPayload);

    // === Get the salt ===
    const response = await getUserSaltAndAddress(jwt);
    console.log(response);
    const userSalt = response?.salt;

    const userAddr = response?.address;
    // === Load and clear the data which beginZkLogin() created before the redirect ===
    const setupData = loadSetupData();
    if (!setupData) {
      console.warn("[completeZkLogin] missing session storage data");
      return;
    }
    clearSetupData();
    for (const account of accounts.current) {
      if (userAddr === account.userAddr) {
        // console.warn([completeZkLogin] already logged in with this ${setupData.provider} account)
        return;
      }
    }
    console.log(shortenAddress(walletId))
    // === Get the zero-knowledge proof ===\
    const ephemeralKeyPair = keypairFromSecretKey(
      setupData.ephemeralPrivateKey
    );
    const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();

    const payload = JSON.stringify(
      {
        maxEpoch: setupData.maxEpoch,
        jwtRandomness: setupData.randomness,
        extendedEphemeralPublicKey:
          getExtendedEphemeralPublicKey(ephemeralPublicKey),
        jwt,
        salt: userSalt.toString(),
        keyClaimName: "sub",
      },
      null,
      2
    );
    console.debug("[completeZkLogin] Requesting ZK proof with:", payload);
    setModalContent("⏳ Requesting ZK proof. This can take a few seconds...");
    const zkProofs = await axios.post(
      "https://prover-dev.mystenlabs.com/v1",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(zkProofs);

    if (!zkProofs) {
      return;
    }
    saveAccount({
      // provider: setupData.provider,
      userAddr,
      zkProofs,
      ephemeralPrivateKey: setupData.ephemeralPrivateKey,
      userSalt: userSalt.toString(),
      sub: jwtPayload.sub,
      aud:
        typeof jwtPayload.aud === "string" ? jwtPayload.aud : jwtPayload.aud[0],
      maxEpoch: setupData.maxEpoch,
    });
  }
  // === Save data to session storage so sendTransaction() can use it ===
  async function sendTransaction(account: AccountData) {
    setModalContent("🚀 Sending transaction...");

    // Sign the transaction bytes with the ephemeral private key
    try {
      const tx = new Transaction();
      tx.setSender(account.userAddr);
      console.log("UserAddress", account.userAddr);

      const ephemeralKeyPair = keypairFromSecretKey(
        account.ephemeralPrivateKey
      );
      console.log("Key Pair", ephemeralKeyPair);

      const { bytes, signature: userSignature } = await tx.sign({
        client: suiClient,
        signer: ephemeralKeyPair,
      });
      // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience)
      const addressSeed = genAddressSeed(
        BigInt(account.userSalt),
        "sub",
        account.sub,
        account.aud
      ).toString();
      // Serialize the zkLogin signature by combining the ZK proof (inputs), the maxEpoch,
      // and the ephemeral signature (userSignature)
      console.log("account.zkProofs", account.zkProofs);
      console.log("addressSeed", addressSeed);
      console.log("bytes", bytes);
      console.log("max epoch", account.maxEpoch );

      const zkLoginSignature = getZkLoginSignature({
        inputs: {
          ...account.zkProofs.data,
          addressSeed,
        },
        maxEpoch: account.maxEpoch,
        userSignature,
      });
      console.log("zkLoginSignature", zkLoginSignature);

      // Execute the transaction
      const res = await suiClient
        .executeTransactionBlock({
          transactionBlock: bytes,
          signature: zkLoginSignature,
          options: {
            showEffects: true,
          },
        })
        .then((result) => {
          console.debug(
            "[sendTransaction] executeTransactionBlock response:",
            result
          );
          fetchBalances([account]);
        })
        .catch((error: unknown) => {
          console.warn(
            "[sendTransaction] executeTransactionBlock failed:",
            error
          );
          return null;
        })
        .finally(() => {
          setModalContent("");
        });
    } catch (error) {
      console.log("Failed ", error);
    }
  }

  async function getUserSaltAndAddress(userJwt: string) {
    console.log("JWt inside enoki", userJwt);

    const url = "https://api.enoki.mystenlabs.com/v1/zklogin";
    const headers = {
      Authorization: "Bearer enoki_public_6771382f7ef797a6473a2871dbfbca4a", // Replace with your actual API key
      "zklogin-jwt": userJwt,
    };
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        const responseData = await response.json();
        const { salt, address } = responseData.data;
        return { salt, address };
      } else {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  /**
   * Get the SUI balance for each account
   */
  async function fetchBalances(accounts: AccountData[]) {
    if (accounts.length == 0) {
      return;
    }
    const newBalances = new Map<string, number>();
    for (const account of accounts) {
      try {
        const suiBalance = await suiClient.getBalance({
          owner: account.userAddr,
          coinType: "0x2::sui::SUI",
        });
        newBalances.set(
          account.userAddr,
          +suiBalance.totalBalance / 1_000_000_000
        );
      } catch (error) {
        console.error(`Failed to fetch balance for ${account.userAddr}`, error);
        newBalances.set(account.userAddr, 0); // Or handle appropriately
      }
    }
    setBalances(newBalances);
  }
  function keypairFromSecretKey(privateKeyBase64: string): Ed25519Keypair {
    const keyPair = decodeSuiPrivateKey(privateKeyBase64);
    return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
  }

  function loadSetupData(): SetupData | null {
    const dataRaw = sessionStorage.getItem(setupDataKey);
    if (!dataRaw) {
      return null;
    }
    const data: SetupData = JSON.parse(dataRaw);
    return data;
  }
  function clearSetupData(): void {
    sessionStorage.removeItem(setupDataKey);
  }

  function saveSetupData(data: SetupData) {
    sessionStorage.setItem(setupDataKey, JSON.stringify(data));
    console.log("saveSetupData setDataKey", JSON.stringify(data));
  }
  

  const generateWalletId = async (): Promise<string> => {
    const prefix = "DUP";
    try {
      const response = await axios.get(
        `${WalletManagement}/walletmanagementapi/latest_wallet_id/`
      );
      const lastId = response.data.wallet_id;
      console.log(lastId);
      let newId;
      if (lastId) {
        const numberPart = parseInt(lastId.replace(prefix, ""), 10);
        newId = `${prefix}${String(numberPart + 1).padStart(4, "0")}`;
      } else {
        newId = `${prefix}0001`;
      }
      console.log("new ID",newId);
      localStorage.setItem("last_wallet_id", newId); // Storing the new ID
      return newId;
    } catch (error) {
      console.error("Error fetching the latest wallet ID:", error);
      return `${prefix}0001`; // fallback
    }
  };

  async function saveAccount(account: AccountData): Promise<void> {
    const newWalletId = await generateWalletId();
    // const user_id = userId;
    // console.log(user_id);

    const sessionDataString = window.localStorage.getItem('session_data');
    let user_id = null;
    if (sessionDataString) {
      const sessionData = JSON.parse(sessionDataString);
      user_id = sessionData.user_id;
    }

    if (!user_id) {
      console.error("User ID not found in localStorage");
      return;  // Optionally handle the case where user_id is not available
    }

    // const newAccounts = [account];
    const newAccounts = [
      {
        ...account,
        wallet_id: newWalletId, // Add wallet_id to the account data
        user_id: user_id,
      },
    ];
    sessionStorage.setItem(accountDataKey, JSON.stringify(newAccounts));
    accounts.current = newAccounts;
    console.log("saveAccount accounts.current", newAccounts);
    console.log("saveAccount Address", account.userAddr);
    console.log("balance", (balances.get(account.userAddr)?.toFixed(2))?.toString());
    console.log(account.userAddr)
    // console.log("WalletID",account.);
    try {
      const response = await axios.post(
        `${WalletManagement}/zklogin_api/save_account/`,
        {
          sui_address: account.userAddr,
          balance: (balances.get(account.userAddr) || "0.00").toString(),
          wallet_id: newWalletId, 
          user_id: user_id,
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Account data saved to backend:", response.data);
    } catch (error) {
      console.error("Failed to save account data to backend:", error);
    }
  }
  

  function loadAccounts(): AccountData[] {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const dataRaw = sessionStorage.getItem(accountDataKey);
      if (!dataRaw) {
        return [];
      }
      return JSON.parse(dataRaw) as AccountData[];
    }
  
    return [];
  }

  const openIdProviders: OpenIdProvider[] = ["Google"];

  return (
    <div className={styles.container}>
      <div className={styles.walletcontainer}>
        <div className={styles.success_text}>Success!</div>
        <div className={styles.wallet_ready}>Your wallet is ready</div>
        <div className={styles.join_text}>
          Wallet Address: <span className={styles.wallet_id}>{shortenAddress(walletId)}</span>
        </div>
        <img className={styles.signwallet} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935592/86d91837-f818-483b-9da1-7e3030270e2a.png" />
        <img className={styles.checkwallet} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727935639/ebfcf71e-db0c-47ef-900f-be09099dc2af.png" />
      </div>
    </div>

  );
}

export default ZkDetails;