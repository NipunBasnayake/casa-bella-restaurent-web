import Image from 'next/image';
import styles from './Gallery.module.css';

export const metadata = {
  title: 'Gallery',
  description: 'View the elegant dining atmosphere and exquisite dishes at Casa Bella.',
};

const images = [
  { src: '/images/hero.png', alt: 'Elegant dining room setting' },
  { src: '/images/pasta.png', alt: 'Truffle Tagliatelle pasta' },
  { src: '/images/pizza.png', alt: 'Wood-fired Margherita pizza' },
  { src: '/images/wine.png', alt: 'Sommelier pouring red wine' },
  { src: '/images/chef.png', alt: 'Executive chef in the kitchen' },
  // Reusing some images to fill the grid if needed
  { src: '/images/hero.png', alt: 'Ambient restaurant lighting' },
];

export default function Gallery() {
  return (
    <div className={styles.galleryPage}>
      <header className={styles.pageHeader}>
        <div className={styles.overlay}></div>
        <Image src="/images/wine.png" alt="Wine pouring" fill className={styles.headerImage} />
        <div className={`container ${styles.headerContent} fade-in`}>
          <h1>Gallery</h1>
          <p>A Glimpse into the Casa Bella Experience</p>
        </div>
      </header>

      <section className={styles.gallerySection}>
        <div className="container">
          <div className={styles.grid}>
            {images.map((img, idx) => (
              <div key={idx} className={`${styles.imageWrapper} fade-in delay-${(idx % 3) * 100}`}>
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill 
                  className={styles.galleryImage} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.imageOverlay}>
                  <span>{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
