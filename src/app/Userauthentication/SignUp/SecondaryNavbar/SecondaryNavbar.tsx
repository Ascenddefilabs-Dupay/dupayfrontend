 'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SecondaryNavBar.module.css';

const SecondaryNavbar = () => {
  return (
    <nav className={`${styles.navbar} fixed top-0 w-full shadow-md z-50`}>
      
      <Image
            src="/images/Dupay-Black.png"
            alt="Brand logo"
            width={40}
            height={30}
            className={styles.BrandImage}
          /><div className="flex-1">

        <Link href="/">
          <span className={styles.dupayLink} aria-label="Dupay Home">
            Dupay
          </span>
        </Link>
      </div>
      <div className="flex items-center mr-4">
        <Link href="/Userauthentication/SignIn">
          <button className={styles.signInButton} aria-label="Sign In">
            Sign In
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default SecondaryNavbar;
