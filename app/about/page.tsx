import Image from 'next/image';
import styles from './About.module.css';

export const metadata = {
  title: 'Our Story',
  description: 'Learn about the history and culinary philosophy of Casa Bella Ristorante.',
};

export default function About() {
  return (
    <div className={styles.aboutPage}>
      <header className={styles.pageHeader}>
        <div className={styles.overlay}></div>
        <Image src="/images/hero.png" alt="Restaurant Interior" fill className={styles.headerImage} />
        <div className={`container ${styles.headerContent} fade-in`}>
          <h1>Our Story</h1>
          <p>Passione, Famiglia, e Tradizione</p>
        </div>
      </header>

      <section className={styles.storySection}>
        <div className={`container grid grid-2 ${styles.alignCenter}`}>
          <div className={`${styles.storyText} fade-in delay-100`}>
            <h2>A Legacy of Flavor</h2>
            <p>
              Founded in 1998, Casa Bella began as a humble family trattoria with a simple mission:
              to share the authentic taste of Italy with our community. Over the decades, we have
              grown into a premier fine dining destination while never losing sight of our roots.
            </p>
            <p>
              Our recipes have been passed down through generations, originating from the
              sun-drenched hills of Tuscany and the bustling coastal towns of Campania. Every dish
              tells a story of heritage and dedication.
            </p>
          </div>
          <div className={`${styles.imageGrid} fade-in delay-200`}>
            <div className={styles.imageBlock}>
              <Image src="/images/pizza.png" alt="Wood-fired pizza" fill className={styles.gridImg} />
            </div>
            <div className={styles.imageBlock}>
              <Image src="/images/wine.png" alt="Wine pouring" fill className={styles.gridImg} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.chefSection}>
        <div className={`container grid grid-2 ${styles.alignCenter}`}>
          <div className={`${styles.chefImageWrapper} fade-in delay-100`}>
            <Image src="/images/chef.png" alt="Head Chef" fill className={styles.chefImage} />
          </div>
          <div className={`${styles.chefText} fade-in delay-200`}>
            <h2>Meet The Chef</h2>
            <h3 className={styles.chefName}>Lorenzo Visconti</h3>
            <p>
              Executive Chef Lorenzo Visconti brings over 25 years of culinary expertise to Casa
              Bella. Trained in Rome and Florence, Chef Lorenzo blends classical techniques with
              modern innovations to elevate traditional Italian cuisine.
            </p>
            <p>
              &quot;For me, cooking is an act of love. It&apos;s about respecting the ingredients,
              honoring the season, and sharing a piece of my homeland with every guest who walks
              through our doors.&quot;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
