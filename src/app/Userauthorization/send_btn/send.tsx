"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import styles from "./send.module.css";
import LottieAnimationLoading from "../../assets/LoadingAnimation";
//import { bridgeTransfer } from "@wormhole-foundation/wormhole-connect";
import WormholeConnect, {
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import {
  NetworkName,
  makePolymediaUrl,
  requestSuiFromFaucet,
  shortenAddress,
} from "@polymedia/suitcase-core";
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
import axios from "axios";
import { fontSize } from "@mui/system";

type ValidNetworkName = "testnet" | "devnet" | "localnet";
const NETWORK: ValidNetworkName = "devnet";

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

const config: WormholeConnectConfig = {
  env: "testnet",
} as any;

const Send: React.FC = () => {
  //const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const accounts = useRef<AccountData[]>(loadAccounts());
  const [modalContent, setModalContent] = useState<string>(" ");
  const [balances, setBalances] = useState<Map<string, number>>(new Map());
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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
    if (typeof window !== "undefined") {
      const sessionDataString = window.localStorage.getItem("session_data");
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setUserId(storedUserId);
        console.log(storedUserId);
        console.log(sessionData.user_email);
      }
    }
  }, []);

  const handleBackClick = () => {
    setLoading(true); // Show loading text
    setTimeout(() => {
      router.push("/Userauthorization/Dashboard/Home"); // Navigate after delay
      setLoading(true); // Show loading text
    }, 500); // Adjust delay if needed
  };

  const handleAddCryptoClick = () => {
    setLoading(true); // Show loading text
    setTimeout(() => {
      router.push("/FiatManagement/Currency_Conversion"); // Navigate after delay
      setLoading(true); // Show loading text
    }, 500); // Adjust delay if needed
  };

  //const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionDataString = window.localStorage.getItem("session_data");
      // Uncomment this part if you need session handling
      // if (sessionDataString) {
      //     const sessionData = JSON.parse(sessionDataString);
      //     const storedUserId = sessionData.user_id;
      //     setUserId(storedUserId);
      //     console.log(storedUserId);
      //     console.log(sessionData.user_email);
      // } else {
      //     router.push('/Userauthentication/SignIn');
      // }
    }
  }, [router]);

  // Enoki API integration for getting the salt

  async function completZkLogin() {
    // grab the JWT from the URL fragment (the '#...')
    // const urlFragment = window.location.hash.substring(1);
    // const urlParams = new URLSearchParams(urlFragment);
    // const jwt = urlParams.get("id_token");
    // console.log("jwt token");
    // console.log(jwt, "jwt");

    function getJwtFromSessionStorage() {
      // Fetch the JWT using the key you used to store it
      const jwt_token = sessionStorage.getItem("jwt_token");

      // Check if the JWT exists
      if (jwt_token) {
        console.log("Retrieved JWT from sessionStorage:", jwt_token);
        return jwt_token; // Return the JWT if it exists
      } else {
        console.log("No JWT found in sessionStorage");
        return null; // Return null if no JWT was found
      }
    }

    const jwt = getJwtFromSessionStorage();

    if (!jwt) {
      return;
    }
    // remove the URL fragment
    window.history.replaceState(null, "", window.location.pathname);

    sessionStorage.setItem("jwt_token", jwt);

    // decode the JWT
    getUserSaltAndAddress(jwt).then((result) => {
      console.log("INside getUserSaltAddress");
      if (result) {
        console.log("Salt:", result.salt);
        console.log("Address:", result.address);
        const Salt = result.salt;
        const Address = result.address;
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
      console.log("max epoch", account.maxEpoch);

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
  //   function saveAccount(account: AccountData): void {
  //     const newAccounts = [account, ...accounts.current];
  //     sessionStorage.setItem(accountDataKey, JSON.stringify(newAccounts));
  //     accounts.current = newAccounts;
  //     console.log("saveAccount accounts.current", newAccounts);
  //   }

  const generateWalletId = async (): Promise<string> => {
    const prefix = "DUP";
    try {
      const response = await axios.get(
        "http://localhost:8000/walletmanagementapi/latest_wallet_id/"
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
      console.log("new ID", newId);
      localStorage.setItem("last_wallet_id", newId); // Storing the new ID
      return newId;
    } catch (error) {
      console.error("Error fetching the latest wallet ID:", error);
      return `${prefix}0001`; // fallback
    }
  };

  async function saveAccount(account: AccountData): Promise<void> {
    const newWalletId = await generateWalletId();
    const user_id = userId;
    console.log(user_id);
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
    console.log(
      "balance",
      balances.get(account.userAddr)?.toFixed(2)?.toString()
    );
    // console.log("WalletID",account.);
    try {
      const response = await axios.post(
        "http://localhost:8000/zklogin_api/save_account/",
        {
          sui_address: account.userAddr,
          balance: (balances.get(account.userAddr) || "0.00").toString(),
          wallet_id: newWalletId,
          user_id: user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Account data saved to backend:", response.data);
    } catch (error) {
      console.error("Failed to save account data to backend:", error);
    }
  }
  function handleContinueClick() {
    // Assuming you want to save the first account in the list when Continue is clicked
    if (accounts.current.length > 0) {
      saveAccount(accounts.current[0])
        .then(() => {
          router.push("/Userauthorization/Dashboard/Home"); // Redirect after saving
        })
        .catch((error) => {
          console.error("Error during saveAccount:", error);
        });
    }
  }

  function handlePreviousClick() {
    router.push("/WalletManagement/WalletCreation/CreateAccount");
  }

  function loadAccounts(): AccountData[] {
    // Check if we're in a browser environment
    if (
      typeof window !== "undefined" &&
      typeof sessionStorage !== "undefined"
    ) {
      const dataRaw = sessionStorage.getItem(accountDataKey);
      if (!dataRaw) {
        return [];
      }
      return JSON.parse(dataRaw) as AccountData[];
    }

    // Return an empty array when running server-side
    return [];
  }

  const openIdProviders: OpenIdProvider[] = ["Google"];

  return (
    <div className={styles.container}>
      <ArrowBackIcon onClick={handleBackClick} className={styles.backIcon} />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "black",
          }}
        >
          {/* Show the Lottie loading animation */}
          <LottieAnimationLoading width="300px" height="300px" />
        </div>
      ) : (
        <>
          <h1 style={{ fontSize: "30px", textAlign: "center" }}>
            Transfer Sui Tokens
          </h1>
          <div className={styles.imageContainer}>
            <img
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911804/send_image_ipuouh.png"
              alt="Send_Image"
              className={styles.image}
            />
          </div>
          <div className={styles.description}>
            <p className={styles.d1}>To send, first add crypto to</p>
            <p className={styles.d2}>your wallet</p>
            <div className={styles.additionalInfo}>
              <p>Use a Dupay account to buy or transfer</p>
              <p className={styles.ai2}>crypto, or receive assets directly.</p>
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className={styles.buttonContainer}>
            {accounts.current.length > 0 && (
              <div id="accounts" className="section white-text">
                {/* <h2>Accounts:</h2> */}
                {accounts.current.map((acct) => {
                  const balance = balances.get(acct.userAddr);
                  const explorerLink = makePolymediaUrl(
                    NETWORK,
                    "address",
                    acct.userAddr
                  );
                  return (
                    <div className={styles.account} key={acct.userAddr}>
                      {/* <div>
                        <label className={`provider ${acct.provider}`}>
                          {acct.provider}
                        </label>
                      </div> */}
                      {/* <div>
                        Address:{" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={explorerLink}
                        >
                          {shortenAddress(acct.userAddr)}
                        </a>
                      </div> */}
                      {/* <div>User ID: {acct.sub}</div> */}
                      <div>
                        Balance:{" "}
                        {typeof balance === "undefined"
                          ? "(loading)"
                          : `${balance} SUI`}
                        <button
                          className={styles.button}
                          onClick={() => {
                            requestSuiFromFaucet(NETWORK, acct.userAddr);
                            setModalContent(
                              "💰 Requesting SUI from faucet. This will take a few seconds..."
                            );
                            setTimeout(() => {
                              setModalContent("");
                            }, 3000);
                          }}
                        >
                          Get Tokens
                        </button>
                        <button
                          onClick={() => {
                            sendTransaction(acct);
                          }}
                          className={styles.button}
                        >
                          Send transaction
                        </button>
                      </div>
                      <h1>WormholeConnect Application</h1>
                      {/* <h2>Current Environment: {config.env}</h2> */}
                      <WormholeConnect config={config} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Send;
