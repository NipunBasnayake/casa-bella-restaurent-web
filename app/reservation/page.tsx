'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './Reservation.module.css';

export default function Reservation() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className={styles.reservationPage}>
      <header className={styles.pageHeader}>
        <div className={styles.overlay}></div>
        <Image src="/images/hero.png" alt="Restaurant Interior" fill className={styles.headerImage} />
        <div className={`container ${styles.headerContent} fade-in`}>
          <h1>Reserve a Table</h1>
          <p>Join us for an unforgettable experience</p>
        </div>
      </header>

      <section className={styles.bookingSection}>
        <div className="container">
          <div className={`${styles.bookingContainer} fade-in delay-100`}>
            {isSubmitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h2>Reservation Pending</h2>
                <p>Thank you for choosing Casa Bella. We have received your request and will contact you shortly to confirm your booking.</p>
                <button className="btn btn-primary" onClick={() => setIsSubmitted(false)}>Make Another Reservation</button>
              </div>
            ) : (
              <>
                <div className={styles.bookingInfo}>
                  <h2>Book Your Experience</h2>
                  <p>
                    We recommend booking at least 24 hours in advance. For parties larger than 6, 
                    please contact us directly at (555) 123-4567.
                  </p>
                  <div className={styles.hoursInfo}>
                    <h3>Dinner Hours</h3>
                    <p>Monday - Thursday: 5pm - 10pm</p>
                    <p>Friday - Saturday: 5pm - 11pm</p>
                    <p>Sunday: 4pm - 9pm</p>
                  </div>
                </div>
                
                <form className={styles.bookingForm} onSubmit={handleSubmit}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input type="text" id="name" className="form-control" required placeholder="Giovanni Rossi" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input type="tel" id="phone" className="form-control" required placeholder="(555) 000-0000" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" id="email" className="form-control" required placeholder="g.rossi@example.com" />
                  </div>

                  <div className="grid grid-3">
                    <div className="form-group">
                      <label htmlFor="date" className="form-label">Date</label>
                      <input type="date" id="date" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="time" className="form-label">Time</label>
                      <select id="time" className="form-control" required>
                        <option value="">Select Time</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="17:30">5:30 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="18:30">6:30 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="19:30">7:30 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="20:30">8:30 PM</option>
                        <option value="21:00">9:00 PM</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="guests" className="form-label">Guests</label>
                      <select id="guests" className="form-control" required>
                        <option value="">Number of Guests</option>
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5 People</option>
                        <option value="6">6 People</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="requests" className="form-label">Special Requests (Optional)</label>
                    <textarea id="requests" className="form-control" rows={4} placeholder="Dietary restrictions, special occasions, etc."></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Request Reservation</button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
