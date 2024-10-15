'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Setting.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Newsetting = () => {
    const router = useRouter();
    const [simpleMode, setSimpleMode] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState(searchValue);
    const [filteredSections, setFilteredSections] = useState<string[]>([
      'account',
      'wallet',
      'mobile',
      'world',
      'lock',
      'moon',
      'bell',
      'voice',
      'term',
      'privacy',
      'signout'
    ]);

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

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(searchValue); 
      }, 500); 
  
      return () => {
        clearTimeout(timer); 
      };
    }, [searchValue]);

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
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value.toLowerCase());
    };
    const SettingBackClick = () => {
      router.push('/Userauthorization/Dashboard/BottomNavBar/profileicon_btn');
  };
    
    const handleClearSearch = () => {
      console.log("Cancel icon clicked");
      setSearchValue(''); 
      setDebouncedValue('');
      setFilteredSections([
          'account',
          'wallet',
          'mobile',
          'world',
          'lock',
          'moon',
          'bell',
          'voice',
          'term',
          'privacy',
          'signout',
      ]);
    };

    useEffect(() => {
      const searchTerms: { [key: string]: string } = {
        account: 'Account',
        wallet: 'Wallets',
        mobile: 'Simple Mode',
        world: 'Networks',
        lock: 'Security',
        moon: 'Display mode',
        bell: 'Notifications',
        voice: 'Get Help',
        term: 'Terms and services',
        privacy: 'Privacy policy',
        signout: 'Sign out',
      };
    
      const filtered = Object.entries(searchTerms).filter(
        ([, value]) => value.toLowerCase().includes(debouncedValue.toLowerCase())
      ).map(([key]) => key);
    
      const additionalMatches = Object.keys(searchTerms).filter(
        key => key.toLowerCase().includes(debouncedValue.toLowerCase())
      );
    
      const combinedFiltered = [...filtered, ...additionalMatches];
      const uniqueFilteredSections = Array.from(new Set(combinedFiltered)); // Remove duplicates
    
      setFilteredSections(uniqueFilteredSections.length > 0 ? uniqueFilteredSections : []);
    
      if (uniqueFilteredSections.length === 0) {
        setFilteredSections(uniqueFilteredSections);
      }
    }, [debouncedValue]);
    
    

    return (
      <div className={styles.settingprofile}>
        <div className={styles.settings}>
          <ArrowBackIcon className={styles.notify_icon} onClick={SettingBackClick} />
          <h1 className={styles.settings_back_label}>Setting</h1>
        </div>

        <div className={styles.searchparentnode} >
          <div className={styles.searchinput}>
              <img className={styles.searchicon} alt="Clear search" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/cancelicon_ib28js.png" onClick={handleClearSearch}  />
              <div><input className={styles.searchlabel} type="text" value={searchValue} placeholder="Enter crypto name, news etc.." onChange={handleSearch}/></div>
              <img className={styles.cancelsearchicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/searchicon_pcrmhm.png" />
          </div>

          {filteredSections.includes('account') && (

            <div className={styles.accountfolder} onClick={profileHandleClick}>
              <div className={styles.accountbody}>
                  <div className={styles.iconleft}>
                      <div className={styles.accountwa}>
                          <img className={styles.accounticon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/profileicon_lgk3al.png" />
                      </div>
                  </div>
                  <div className={styles.accounttext}>
                      <div className={styles.accountleft}>
                          <div className={styles.accounttitle}>Account</div>
                      </div>
                  </div>
                  <img className={styles.accounticonrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>

          )}

          {filteredSections.includes('wallet') && (
            <div className={styles.walletfolder}>
              <div className={styles.walletbody}>
                  <div className={styles.walleticonleft}>
                      <div className={styles.walletwa}>
                          <img className={styles.walleticon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887446/walleticon_k19n0w.png" />
                      </div>
                  </div>
                  <div className={styles.wallettext}>
                      <div className={styles.walletleft}>
                          <div className={styles.wallettitle}>Wallets</div>
                      </div>
                  </div>
                  <img className={styles.walleticonrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>

          )}

          {filteredSections.includes('mobile') && (
            <div className={styles.mobilefolder} onClick={handleSwitch}>
              <div className={styles.mobilebody}>
                  <div className={styles.mobileiconleft}>
                      <div className={styles.mobilewa}>
                          <img className={styles.mobileicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887446/mobileicon_g5ojfj.png" />
                      </div>
                  </div>
                  <div className={styles.mobiletext}>
                      <div className={styles.mobileleft}>
                          <div className={styles.mobiletitle}>Simple Mode</div>
                      </div>
                  </div>
                  <img className={styles.mobileiconrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}

          {filteredSections.includes('world') && (
            <div className={styles.worldfolder}>
              <div className={styles.worldbody}>
                  <div className={styles.worldiconleft}>
                      <div className={styles.worldwa}>
                          <img className={styles.worldicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887446/worldicon_vequ4e.png" />
                      </div>
                  </div>
                  <div className={styles.worldtext}>
                      <div className={styles.worldleft}>
                          <div className={styles.worldtitle}>Networks</div>
                      </div>
                  </div>
                  <img className={styles.worldiconrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}

          {filteredSections.includes('lock') && (
            <div className={styles.lockfolder} onClick={handleSecurity}>
              <div className={styles.lockbody}>
                  <div className={styles.lockiconleft}>
                      <div className={styles.lockwa}>
                          <img className={styles.lockicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/lockicon_ga39jp.png" />
                      </div>
                  </div>
                  <div className={styles.locktext}>
                      <div className={styles.lockleft}>
                          <div className={styles.locktitle}>Security</div>
                      </div>
                  </div>
                  <img className={styles.lockiconrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}

          {filteredSections.includes('moon') && (
            <div className={styles.moonfolder} onClick={handleDisplay}>
              <div className={styles.moonbody}>
                  <div className={styles.lmooniconleft}>
                      <div className={styles.moonwa}>
                          <img className={styles.moonicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887446/moonicon_hml4j6.png" />
                      </div>
                  </div>
                  <div className={styles.moontext}>
                      <div className={styles.moonleft}>
                          <div className={styles.moontitle}>Display mode</div>
                      </div>
                  </div>
                  <img className={styles.mooniconrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}

          {filteredSections.includes('bell') && (
            <div className={styles.bellfolder} onClick={handleNotification}>
              <div className={styles.bellbody}>
                  <div className={styles.belliconleft}>
                      <div className={styles.bellwa}>
                          <img className={styles.bellicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/bellicon_k0xdcv.png" />
                      </div>
                  </div>
                  <div className={styles.belltext}>
                      <div className={styles.bellleft}>
                          <div className={styles.belltitle}>Notifications</div>
                      </div>
                  </div>
                  <img className={styles.belliconrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}

          {filteredSections.includes('voice') && (
            <div className={styles.voicefolder}>
              <div className={styles.voicebody}>
                  <div className={styles.voiceiconleft}>
                      <div className={styles.voicewa}>
                          <img className={styles.voiceicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887446/voiceicon_et6i0r.png" />
                      </div>
                  </div>
                  <div className={styles.voicetext}>
                      <div className={styles.voiceleft}>
                          <div className={styles.voicetitle}>Get Help</div>
                      </div>
                  </div>
                  <img className={styles.iconrightarrow} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}

          {filteredSections.includes('term') && (
            <div className={styles.termfolder}>
              <div className={styles.termbody}>
                <div className={styles.termcontent}>
                    <div className={styles.termleft}>
                        <div className={styles.termtitle}>Terms and services</div>
                    </div>
                </div>
                <img className={styles.termicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}
          
          {filteredSections.includes('privacy') && (
            <div className={styles.privacyfolder}>
              <div className={styles.privacybody}>
                <div className={styles.privacycontent}>
                  <div className={styles.privacyeft}>
                    <div className={styles.privacytitle}>Privacy policy</div>
                  </div>
                </div>
                  <img className={styles.privacyicon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}

          {filteredSections.includes('signout') && (
            <div className={styles.signoutfolder} onClick={handleSignOut}>
              <div className={styles.signoutbody}>
                <div className={styles.signouticonLeft}>
                  <div className={styles.signoutWr}>
                      <img className={styles.signouticon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887446/signout_od3z4e.png" />
                  </div>
                </div>
                <div className={styles.signouttext}>
                  <div className={styles.signouteft}>
                      <div className={styles.signouttitle}>Sign out</div>
                  </div>
                </div>
                <img className={styles.signouticonarrowRightSent} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728887445/iconright_t0hh6j.png" />
              </div>
            </div>
          )}

          {filteredSections.length === 0 ? ( 
            <div className={styles.searchempty}>
              <img className={styles.searchemptychild} alt="No results" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728977664/Group_mllrk2.png" />
              <img className={styles.searchemptydot1} alt="No results" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728990160/Ellipse_152_cek0jr.png" />
              <img className={styles.searchemptydot2} alt="No results" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728990160/Ellipse_152_cek0jr.png" />
              <img className={styles.searchemptysmile} alt="No results" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728990160/Vector_363_xbp3hg.png" />
              <div className={styles.noResultsFound}>No results found</div>
            </div>
            ) : (
            filteredSections.map((section, index) => ( 
              <div key={index} className={styles.sectionItem}>
                {/* Render your section item here */}
              </div>
            ))
          )}


        </div>
      </div>
    );
};

export default Newsetting;

