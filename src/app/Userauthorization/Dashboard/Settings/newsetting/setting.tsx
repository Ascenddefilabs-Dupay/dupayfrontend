'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Setting.module.css';
const Newsetting = () => {
    const router = useRouter();
    const [simpleMode, setSimpleMode] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
      useEffect(() => {
          if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
              const sessionData = JSON.parse(sessionDataString);
              const storedUserId = sessionData.user_id;
              setUserId( storedUserId);
              console.log(storedUserId);
              console.log(sessionData.user_email);
            } else {
              // redirect('http://localhost:3000/Userauthentication/SignIn');
            }
          }
        }, []);
    

    const handleNavigation = () => {
      router.push('/Userauthorization/Dashboard/Settings/network_set');
    };

    const settinghandleBackClick = () => {
      let redirectUrl = '/Userauthorization/Dashboard/BottomNavBar/profileicon_btn';
      router.push(redirectUrl);
    };

    const handleSwitch = () => {
      console.log("Switch clicked"); 
      const newSimpleMode = !simpleMode;
      setSimpleMode(newSimpleMode);
    
      if (newSimpleMode) {
        console.log("Navigating to switchform"); 
        router.push('/Userauthorization/Dashboard/Settings/switchform');
      }
    };

    const handleSignOut = () => {
      router.push('/Userauthentication/SignUp/EmailVerification');
    };
    const handleDisplay = () => {
      router.push('/Userauthorization/Dashboard/Settings/displayform');
    };
    const handleSecurity = () => {
      router.push('/Userauthorization/Dashboard/Settings/securityfrom');
    };
    const profileHandleClick = () => {
      router.push('http://localhost:3004/Manageprofile/profilesidebar');
    };
    const handleNotification = () => {
      router.push('/Userauthorization/Dashboard/Settings/notificationfrom');
    }
    const handleClearSearch = () => {
      setSearchValue(''); 
    };
    return (
      <div className={styles.settingprofile}>
        <div className={styles.settings}>
          <span className={styles.settings_back_label}>Setting</span>
        </div>

        <div className={styles.searchparentnode} >
          <div className={styles.searchinput}>
              <img className={styles.searchicon} alt="" src="/cancelicon.png" />
              <div><input className={styles.searchlabel} type="text" placeholder="Enter crypto name, news etc.." onClick= {handleClearSearch}/></div>
              <img className={styles.cancelsearchicon} alt="" src="/searchicon.png" />
          </div>

          <div className={styles.accountfolder} onClick={profileHandleClick}>
            <div className={styles.accountbody}>
                <div className={styles.iconleft}>
                    <div className={styles.accountwa}>
                        <img className={styles.accounticon} alt="" src="/profileicon.png" />
                    </div>
                </div>
                <div className={styles.accounttext}>
                    <div className={styles.accountleft}>
                        <div className={styles.accounttitle}>Account</div>
                    </div>
                </div>
                <img className={styles.accounticonrightarrow} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.walletfolder}>
            <div className={styles.walletbody}>
                <div className={styles.walleticonleft}>
                    <div className={styles.walletwa}>
                        <img className={styles.walleticon} alt="" src="/walleticon.png" />
                    </div>
                </div>
                <div className={styles.wallettext}>
                    <div className={styles.walletleft}>
                        <div className={styles.wallettitle}>Wallets</div>
                    </div>
                </div>
                <img className={styles.walleticonrightarrow} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.mobilefolder} onClick={handleSwitch}>
            <div className={styles.mobilebody}>
                <div className={styles.mobileiconleft}>
                    <div className={styles.mobilewa}>
                        <img className={styles.mobileicon} alt="" src="/mobileicon.png" />
                    </div>
                </div>
                <div className={styles.mobiletext}>
                    <div className={styles.mobileleft}>
                        <div className={styles.mobiletitle}>Simple Mode</div>
                    </div>
                </div>
                <img className={styles.mobileiconrightarrow} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.worldfolder}>
            <div className={styles.worldbody}>
                <div className={styles.worldiconleft}>
                    <div className={styles.worldwa}>
                        <img className={styles.worldicon} alt="" src="/worldicon.png" />
                    </div>
                </div>
                <div className={styles.worldtext}>
                    <div className={styles.worldleft}>
                        <div className={styles.worldtitle}>Networks</div>
                    </div>
                </div>
                <img className={styles.worldiconrightarrow} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.lockfolder} onClick={handleSecurity}>
            <div className={styles.lockbody}>
                <div className={styles.lockiconleft}>
                    <div className={styles.lockwa}>
                        <img className={styles.lockicon} alt="" src="/lockicon.png" />
                    </div>
                </div>
                <div className={styles.locktext}>
                    <div className={styles.lockleft}>
                        <div className={styles.locktitle}>Security</div>
                    </div>
                </div>
                <img className={styles.lockiconrightarrow} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.moonfolder} onClick={handleDisplay}>
            <div className={styles.moonbody}>
                <div className={styles.lmooniconleft}>
                    <div className={styles.moonwa}>
                        <img className={styles.moonicon} alt="" src="/moonicon.png" />
                    </div>
                </div>
                <div className={styles.moontext}>
                    <div className={styles.moonleft}>
                        <div className={styles.moontitle}>Display mode</div>
                    </div>
                </div>
                <img className={styles.mooniconrightarrow} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.bellfolder} onClick={handleNotification}>
            <div className={styles.bellbody}>
                <div className={styles.belliconleft}>
                    <div className={styles.bellwa}>
                        <img className={styles.bellicon} alt="" src="/bellicon.png" />
                    </div>
                </div>
                <div className={styles.belltext}>
                    <div className={styles.bellleft}>
                        <div className={styles.belltitle}>Notifications</div>
                    </div>
                </div>
                <img className={styles.belliconrightarrow} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.voicefolder}>
            <div className={styles.voicebody}>
                <div className={styles.voiceiconleft}>
                    <div className={styles.voicewa}>
                        <img className={styles.voiceicon} alt="" src="/voiceicon.png" />
                    </div>
                </div>
                <div className={styles.voicetext}>
                    <div className={styles.voiceleft}>
                        <div className={styles.voicetitle}>Get Help</div>
                    </div>
                </div>
                <img className={styles.iconrightarrow} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.termfolder}>
            <div className={styles.termbody}>
              <div className={styles.termcontent}>
                  <div className={styles.termleft}>
                      <div className={styles.termtitle}>Terms and services</div>
                  </div>
              </div>
              <img className={styles.termicon} alt="" src="/iconright.png" />
            </div>
          </div>
          

          <div className={styles.privacyfolder}>
            <div className={styles.privacybody}>
              <div className={styles.privacycontent}>
                <div className={styles.privacyeft}>
                  <div className={styles.privacytitle}>Privacy policy</div>
                </div>
              </div>
                <img className={styles.privacyicon} alt="" src="/iconright.png" />
            </div>
          </div>

          <div className={styles.signoutfolder} onClick={handleSignOut}>
            <div className={styles.signoutbody}>
              <div className={styles.signouticonLeft}>
                <div className={styles.signoutWr}>
                    <img className={styles.signouticon} alt="" src="/signout.png" />
                </div>
              </div>
              <div className={styles.signouttext}>
                <div className={styles.signouteft}>
                    <div className={styles.signouttitle}>Sign out</div>
                </div>
              </div>
              <img className={styles.signouticonarrowRightSent} alt="" src="/iconright.png" />
            </div>
          </div>
        </div>
      </div>  

    );
};

export default Newsetting;

