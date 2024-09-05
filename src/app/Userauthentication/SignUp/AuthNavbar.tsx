// 'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import styles from './AuthNavbar.module.css';

const AuthNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${styles.navbar} fixed top-0 w-full shadow-md z-50`}>
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className={`${styles.menuButton} focus:outline-none text-3xl`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Dupay Text */}
      <Image
            src="/images/Dupay-Black.png"
            alt="Brand logo"
            width={40}
            height={30}
            className={styles.BrandImage}
          />

      <div className="flex-1 flex items-center justify-center md:justify-start">
        <Link href="/">
          <span id="dupayLink" className={styles.dupayText}>
            Dupay
          </span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className={`${styles.desktopMenu} hidden md:flex items-center gap-4`}>
        <span className={styles.accountText}>Already have an account?</span>
        <Link href="/Userauthentication/SignIn">
          <button className={styles.signInButton}>Sign In</button>
        </Link>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} fixed top-0 left-0 w-full h-full shadow-md z-40 transition-transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="p-4 flex justify-end">
          <button onClick={toggleMenu} className={`${styles.closeButton} text-3xl`}>
            <HiOutlineX />
          </button>
        </div>
        <ul className="flex flex-col items-center gap-6 mt-8">
          <li>
            <Link href="/Userauthentication/SignIn">
              <button className={styles.mobileSignInButton}>
                Sign In
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AuthNavbar;
