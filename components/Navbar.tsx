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
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          Casa Bella
        </Link>

        <nav className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>Story</Link>
          <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
          <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LanguageSwitcher />
            <Link href="/reservation" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Reserve a Table</Link>
          </div>
        </nav>

        <button
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`}></span>
        </button>
      </div>
    </header>
  );
}
