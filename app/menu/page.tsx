import Image from 'next/image';
import styles from './Menu.module.css';

export const metadata = {
  title: 'Menu',
  description: 'Explore the authentic Italian menu at Casa Bella Ristorante.',
};

const menuData = [
  {
    category: "Antipasti",
    items: [
      { name: "Bruschetta al Pomodoro", desc: "Grilled artisan bread, vine-ripened tomatoes, garlic, fresh basil, EVOO", price: "12" },
      { name: "Calamari Fritti", desc: "Crispy fried calamari, lemon-garlic aioli, spicy marinara", price: "18" },
      { name: "Carpaccio di Manzo", desc: "Thinly sliced raw beef tenderloin, arugula, capers, shaved parmesan, truffle oil", price: "22" },
      { name: "Burrata e Prosciutto", desc: "Fresh creamy burrata, 24-month aged Prosciutto di Parma, balsamic glaze", price: "24" }
    ]
  },
  {
    category: "Primi (Pasta)",
    items: [
      { name: "Rigatoni alla Carbonara", desc: "Guanciale, free-range egg yolks, pecorino romano, black pepper", price: "26" },
      { name: "Truffle Tagliatelle", desc: "Hand-crafted pasta, black truffle shavings, Parmigiano-Reggiano cream sauce", price: "32", special: true },
      { name: "Linguine allo Scoglio", desc: "Fresh clams, mussels, shrimp, calamari, light garlic tomato broth", price: "34" },
      { name: "Gnocchi al Pesto", desc: "House-made potato dumplings, Genovese basil pesto, toasted pine nuts", price: "24" }
    ]
  },
  {
    category: "Secondi (Mains)",
    items: [
      { name: "Osso Buco alla Milanese", desc: "Braised veal shank, saffron risotto, gremolata", price: "48", special: true },
      { name: "Bistecca Fiorentina", desc: "32oz dry-aged Porterhouse steak, rosemary roasted potatoes (Serves 2)", price: "120" },
      { name: "Salmone Arrostito", desc: "Pan-seared king salmon, asparagus, lemon-caper butter sauce", price: "36" },
      { name: "Pollo al Marsala", desc: "Pan-fried chicken breast, wild mushrooms, Marsala wine reduction", price: "28" }
    ]
  },
  {
    category: "Dolci (Desserts)",
    items: [
      { name: "Classic Tiramisu", desc: "Espresso-soaked ladyfingers, mascarpone cream, cocoa powder", price: "12" },
      { name: "Panna Cotta", desc: "Vanilla bean panna cotta, wild berry compote", price: "10" },
      { name: "Cannoli Siciliani", desc: "Crispy pastry shell, sweet ricotta filling, pistachio, chocolate chips", price: "11" }
    ]
  }
];

export default function Menu() {
  return (
    <div className={styles.menuPage}>
      <header className={styles.pageHeader}>
        <div className={styles.overlay}></div>
        <Image src="/images/pasta.png" alt="Pasta dish" fill className={styles.headerImage} />
        <div className={`container ${styles.headerContent} fade-in`}>
          <h1>Our Menu</h1>
          <p>A Culinary Journey Through Italy</p>
        </div>
      </header>

      <section className={styles.menuSection}>
        <div className="container">
          {menuData.map((section, idx) => (
            <div key={idx} className={`${styles.menuGroup} fade-in delay-${(idx + 1) * 100}`}>
              <h2 className={styles.categoryTitle}>{section.category}</h2>
              <div className={styles.menuGrid}>
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={styles.menuItem}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>
                        {item.name}
                        {item.special && <span className={styles.specialBadge}>Chef Special</span>}
                      </h3>
                      <div className={styles.itemDots}></div>
                      <span className={styles.itemPrice}>${item.price}</span>
                    </div>
                    <p className={styles.itemDesc}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.menuFooter}>
        <div className="container text-center">
          <p className={styles.footerNote}>
            We accommodate most dietary restrictions. Please inform your server of any allergies. <br/>
            An 18% gratuity is added to parties of 6 or more.
          </p>
          <a href="/reservation" className="btn btn-primary">Book Your Table</a>
        </div>
      </section>
    </div>
  );
}
