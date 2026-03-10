'use client';
import { useEffect, useState } from 'react';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
  { code: 'en', label: '🇬🇧 English', short: '🇬🇧 EN' },
  { code: 'it', label: '🇮🇹 Italiano', short: '🇮🇹 IT' },
  { code: 'es', label: '🇪🇸 Español', short: '🇪🇸 ES' },
  { code: 'fr', label: '🇫🇷 Français', short: '🇫🇷 FR' },
  { code: 'de', label: '🇩🇪 Deutsch', short: '🇩🇪 DE' }
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if a language preference exists in cookies Google uses
    const cookies = document.cookie.split(';');
    const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
    
    if (googtrans) {
      const code = googtrans.split('/').pop() || 'en';
      if (LANGUAGES.some(l => l.code === code)) {
        setCurrentLang(code);
      }
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
    // Set the cookie for google translate
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain}`;
    
    // Reload the page to apply the translation
    window.location.reload();
  };

  return (
    <div className={styles.langContainer}>
      <button 
        className={styles.langButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <span>{LANGUAGES.find(l => l.code === currentLang)?.short || 'EN'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.langDropdown}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.langItem} ${currentLang === lang.code ? styles.active : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
