
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import styles from './navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    toggleMenu();
    router.push('/Userauthentication/SignIn');
  };

  const handleSignUp = () => {
    toggleMenu();
    router.push('/Userauthentication/SignUp');
  };

  return (
    <nav className={`${styles.navbar} ${styles.fixedTop}`}>
      {/* Hamburger Menu for Mobile */}
      <div className={styles.mobileMenuIcon}>
        <button onClick={toggleMenu} className={styles.menuButton}>
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
      <div className={styles.dupayText}>
        <Link href="/">
          <span className={styles.dupayLink}>Dupay</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul className={styles.desktopMenu}>
        <li>
          <Link href="/" className={styles.menuLink}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className={styles.menuLink}>
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className={styles.menuLink}>
            Contact
          </Link>
        </li>
        <li className={styles.authButtons}>
          <button className={styles.loginauthButton} onClick={handleLogin}>
            Login
          </button>
          <button className={styles.signupauthButton} onClick={handleSignUp}>
            Sign Up
          </button>
        </li>
      </ul>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : styles.menuClosed}`}
      >
        <div className={styles.closeMenuIcon}>
          <button onClick={toggleMenu} className={styles.menuButton}>
            <HiOutlineX />
          </button>
        </div>
        <ul className={styles.mobileMenuLinks}>
          <li>
            <Link href="/" className={styles.menuLink} onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.menuLink} onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className={styles.menuLink} onClick={toggleMenu}>
              Contact
            </Link>
          </li>
          <li className={styles.mobileAuthButtons}>
            <button className={styles.mobileAuthButton} onClick={handleLogin}>
              Login
            </button>
            <button className={styles.mobileAuthButton} onClick={handleSignUp}>
              Sign Up
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
