'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', flag: '/images/flags/uk.png', alt: 'UK flag' },
  { code: 'it', label: 'Italiano', short: 'IT', flag: '/images/flags/it.png', alt: 'Italy flag' },
  { code: 'es', label: 'Español', short: 'ES', flag: '/images/flags/es.png', alt: 'Spain flag' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '/images/flags/fr.png', alt: 'France flag' },
  { code: 'de', label: 'Deutsch', short: 'DE', flag: '/images/flags/de.png', alt: 'Germany flag' },
];

function setGoogleTranslateCookie(langCode: string) {
  const domain = window.location.hostname;
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain}`;
}

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof document === 'undefined') return 'en';

    const cookieValues = document.cookie.split(';');
    const googtrans = cookieValues.find((cookieValue) =>
      cookieValue.trim().startsWith('googtrans=')
    );

    if (!googtrans) return 'en';

    const code = googtrans.split('/').pop() || 'en';
    return LANGUAGES.some((language) => language.code === code) ? code : 'en';
  });

  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    LANGUAGES.find((language) => language.code === currentLang) || LANGUAGES[0];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    setGoogleTranslateCookie(langCode);
    window.location.reload();
  };

  return (
    <div className={styles.langContainer}>
      <button
        type="button"
        className={styles.langButton}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Select Language"
      >
        <span className={styles.langButtonContent}>
          <span className={styles.flagWrap}>
            <Image
              src={currentLanguage.flag}
              alt={currentLanguage.alt}
              width={18}
              height={18}
              className={styles.flag}
            />
          </span>
          <span>{currentLanguage.short}</span>
        </span>

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
              type="button"
              className={`${styles.langItem} ${currentLang === language.code ? styles.active : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className={styles.flagWrap}>
                <Image
                  src={language.flag}
                  alt={language.alt}
                  width={20}
                  height={20}
                  className={styles.flag}
                />
              </span>
              <span>{language.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
