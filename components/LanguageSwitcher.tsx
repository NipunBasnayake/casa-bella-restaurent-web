'use client';

import { useState } from 'react';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'it', label: 'Italiano', short: 'IT' },
  { code: 'es', label: 'Espanol', short: 'ES' },
  { code: 'fr', label: 'Francais', short: 'FR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
];

function setGoogleTranslateCookie(langCode: string) {
  const domain = window.location.hostname;
  window.document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
  window.document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain}`;
}

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof document === 'undefined') {
      return 'en';
    }

    const cookieValues = document.cookie.split(';');
    const googtrans = cookieValues.find((cookieValue) =>
      cookieValue.trim().startsWith('googtrans=')
    );

    if (!googtrans) {
      return 'en';
    }

    const code = googtrans.split('/').pop() || 'en';
    return LANGUAGES.some((language) => language.code === code) ? code : 'en';
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    setGoogleTranslateCookie(langCode);
    window.location.reload();
  };

  return (
    <div className={styles.langContainer}>
      <button
        className={styles.langButton}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Select Language"
      >
        <span>{LANGUAGES.find((language) => language.code === currentLang)?.short || 'EN'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.langDropdown}>
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              className={`${styles.langItem} ${currentLang === language.code ? styles.active : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
