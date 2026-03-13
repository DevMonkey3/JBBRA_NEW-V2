// components/headers/Header.jsx
import styles from '../../styles/components/header.module.css';
import UtilityBar from './UtilityBar.jsx';
import { Navbar } from "../navbar"; 

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Thin top bar */}
        <div className={`${styles.slot} ${styles.utilityBarSlot}`}>
          <div className="container">
            <UtilityBar />
          </div>
        </div>

        <div className={styles.divider} />

        {/* Main navigation bar */}
        <div className={`${styles.slot} ${styles.navSlot}`}>
          <div className="container">
             <Navbar />
          </div>
        </div>
      </div>
    </header>
  );
}
