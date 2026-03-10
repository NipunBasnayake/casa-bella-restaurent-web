import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container grid grid-3 ${styles.footerGrid}`}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerLogo}>Casa Bella</h3>
          <p className={styles.footerDesc}>
            Authentic Italian flavors in an elegant setting. Experience true culinary artistry in the heart of the city.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">TW</a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Contact Us</h4>
          <address className={styles.address}>
            123 Bella Ave<br />
            Cityville, CA 90000<br />
            <br />
            <a href="tel:+15551234567" className={styles.contactLink}>(555) 123-4567</a><br />
            <a href="mailto:info@casabellaristorante.com" className={styles.contactLink}>info@casabellaristorante.com</a>
          </address>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Hours</h4>
          <ul className={styles.hoursList}>
            <li><span>Mon - Thu:</span> <span>5:00 PM - 10:00 PM</span></li>
            <li><span>Fri - Sat:</span> <span>5:00 PM - 11:00 PM</span></li>
            <li><span>Sunday:</span> <span>4:00 PM - 9:00 PM</span></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Casa Bella Ristorante. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
