'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ExtensionNavbar.module.css';

const ExtensionNavbar = () => {
  return (
    <nav className={`${styles.navbar} fixed top-0 w-full shadow-md z-50`}>
      <div className="flex items-center">
        <Image
            src="/images/Dupay-Black.png"
            alt="Brand logo"
            width={40}
            height={30}
            className={styles.BrandImage}
        />
        <a href="/" className={styles.dupayLink} aria-label="Dupay Home">
          Dupay
        </a>
      </div>
      <div className="flex items-center mr-4">
        <button
          className={styles.downloadButton}
          onClick={() => window.location.href = ''}
          aria-label="Download"
        >
          Download
        </button>
      </div>
    </nav>
  );
};

export default ExtensionNavbar;

