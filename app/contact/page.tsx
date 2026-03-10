import Image from 'next/image';
import GoogleMap from '@/components/GoogleMap';
import styles from './Contact.module.css';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Casa Bella Ristorante for inquiries, feedback, or special events.',
};

export default function Contact() {
  return (
    <div className={styles.contactPage}>
      <header className={styles.pageHeader}>
        <div className={styles.overlay}></div>
        <Image src="/images/hero.png" alt="Restaurant interior" fill className={styles.headerImage} />
        <div className={`container ${styles.headerContent} fade-in`}>
          <h1>Contact Us</h1>
          <p>We&apos;d love to hear from you</p>
        </div>
      </header>

      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={`${styles.contactInfo} fade-in delay-100`}>
              <h2>Get In Touch</h2>
              <p className={styles.infoDesc}>
                Whether you&apos;re looking to host a private event, share feedback, or just say
                ciao, our team is here to assist you.
              </p>

              <div className={styles.infoBlock}>
                <h3>Visit Us</h3>
                <address className={styles.address}>
                  123 Bella Ave
                  <br />
                  Cityville, CA 90000
                  <br />
                  United States
                </address>
              </div>

              <div className={styles.infoBlock}>
                <h3>Contact</h3>
                <p>
                  <a href="tel:+15551234567" className={styles.contactLink}>
                    +1 (555) 123-4567
                  </a>
                  <br />
                  <a
                    href="mailto:info@casabellaristorante.com"
                    className={styles.contactLink}
                  >
                    info@casabellaristorante.com
                  </a>
                </p>
              </div>

              <div className={styles.infoBlock}>
                <h3>Opening Hours</h3>
                <ul className={styles.hoursList}>
                  <li>
                    <span>Mon - Thu</span> <span>5:00 PM - 10:00 PM</span>
                  </li>
                  <li>
                    <span>Fri - Sat</span> <span>5:00 PM - 11:00 PM</span>
                  </li>
                  <li>
                    <span>Sunday</span> <span>4:00 PM - 9:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`${styles.contactFormWrapper} fade-in delay-200`}>
              <h2>Send a Message</h2>
              <form className={styles.contactForm}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    required
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="form-control"
                    required
                    placeholder="How can we help?"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows={5}
                    required
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection}>
        <GoogleMap
          address="123 Bella Ave, Cityville, CA 90000"
          lat={34.0522}
          lng={-118.2437}
          zoom={15}
          height="500px"
        />
      </section>
    </div>
  );
}
