'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          Casa Bella
        </Link>

        <nav className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/about" onClick={closeMobileMenu}>Story</Link>
          <Link href="/menu" onClick={closeMobileMenu}>Menu</Link>
          <Link href="/gallery" onClick={closeMobileMenu}>Gallery</Link>
          <Link href="/contact" onClick={closeMobileMenu}>Contact</Link>

          <div className={styles.mobileActions}>
            <LanguageSwitcher />
            <Link
              href="/reservation"
              className={`btn btn-primary ${styles.reserveBtn}`}
              onClick={closeMobileMenu}
            >
              Reserve a Table
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`}></span>
        </button>
      </div>
    </header>
  );
}