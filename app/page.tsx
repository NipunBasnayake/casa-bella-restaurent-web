import Image from 'next/image';
import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <Image 
          src="/images/hero.png" 
          alt="Casa Bella elegant interior" 
          fill 
          priority
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle} fade-in`}>A Taste of Italy</h1>
          <p className={`${styles.heroSubtitle} fade-in delay-100`}>
            Experience authentic Italian fine dining, where traditional recipes meet modern elegance.
          </p>
          <div className={`${styles.heroBtns} fade-in delay-200`}>
            <Link href="/reservation" className="btn btn-primary">Reserve a Table</Link>
            <Link href="/menu" className="btn btn-secondary" style={{borderColor: 'white', color: 'white'}}>View Menu</Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles.introSection}>
        <div className={`container grid grid-2 ${styles.alignCenter}`}>
          <div className={`${styles.introText} fade-in`}>
            <h2>Benvenuti a Casa Bella</h2>
            <p>
              Nestled in the heart of the city, Casa Bella offers an unforgettable culinary journey 
              through the diverse regions of Italy. Our passion for authentic flavors and warm 
              hospitality ensures every meal is a celebration.
            </p>
            <p>
              We source only the finest seasonal ingredients, combining them with generations-old 
              recipes to create dishes that speak to the soul.
            </p>
            <Link href="/about" className={styles.readMoreLink}>Discover Our Story</Link>
          </div>
          <div className={`${styles.introImageWrapper} fade-in delay-200`}>
            <Image 
              src="/images/chef.png" 
              alt="Chef preparing meal" 
              width={500} 
              height={600} 
              className={styles.introImage}
            />
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className={styles.signatureSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="text-center">Signature Dishes</h2>
            <p className={`${styles.sectionSubtext} text-center`}>Culinary masterpieces crafted to perfection.</p>
          </div>
          
          <div className="grid grid-2">
            <div className={`card ${styles.dishCard}`}>
              <div className={styles.dishImageWrapper}>
                <Image src="/images/pasta.png" alt="Truffle Tagliatelle" fill className={styles.dishImage} />
              </div>
              <div className={styles.dishInfo}>
                <div className={styles.dishHeader}>
                  <h3>Truffle Tagliatelle</h3>
                  <span className={styles.dishPrice}>$32</span>
                </div>
                <p>Hand-crafted tagliatelle, black truffle shavings, Parmigiano-Reggiano cream sauce.</p>
              </div>
            </div>
            
            <div className={`card ${styles.dishCard}`}>
              <div className={styles.dishImageWrapper}>
                <Image src="/images/pizza.png" alt="Margherita Classica" fill className={styles.dishImage} />
              </div>
              <div className={styles.dishInfo}>
                <div className={styles.dishHeader}>
                  <h3>Margherita Classica</h3>
                  <span className={styles.dishPrice}>$24</span>
                </div>
                <p>San Marzano tomatoes, fresh buffalo mozzarella, fragrant basil, wood-fired crust.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.menuCtaWrapper}>
            <Link href="/menu" className="btn btn-secondary">Explore Full Menu</Link>
          </div>
        </div>
      </section>

      {/* Testimonial / Experience */}
      <section className={styles.experienceSection}>
        <Image src="/images/wine.png" alt="Wine pouring" fill className={styles.experienceBg} />
        <div className={styles.experienceOverlay}></div>
        <div className={`container ${styles.experienceContent}`}>
          <div className={styles.testimonialBox}>
            <span className={styles.quoteIcon}>&ldquo;</span>
            <p className={styles.quoteText}>
              The ambiance is unparalleled, the service impeccable, and the food transports you directly to Rome. Casa Bella is truly a gem.
            </p>
            <p className={styles.quoteAuthor}>- Culinary Review Magazine</p>
          </div>
        </div>
      </section>
    </div>
  );
}
