// components/headers/UtilityBar.jsx
'use client';

import Link from 'next/link';
import styles from '../../styles/components/utility-bar.module.css';
import company from '../../data/company';

export default function UtilityBar() {
  return (
    <div className={styles.utilityBar} role="navigation" aria-label="Utility">
      <div className="container">
        <div className={styles.wrap}>
          {/* Left: contact info */}
          <div className={styles.info}>
            {company?.phone?.jp && (
              <span className={styles.infoItem}>
                <span className={styles.icon} aria-hidden="true">📞</span>
                <a href={`tel:${company.phone.jp}`}>{company.phone.jp}</a>
              </span>
            )}

            {company?.email && (
              <span className={`${styles.infoItem} ${styles.hideXs}`}>
                <span className={styles.icon} aria-hidden="true">✉️</span>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </span>
            )}
          </div>

          {/* Right: language + CTA */}
          <div className={styles.actions}>
            {/* Language switch (static for now) */}
            <div className={styles.lang} aria-label="Language select">
              <button className={styles.langBtn} aria-current="true" type="button">
                日本語
              </button>
              <button className={styles.langBtn} type="button">
                EN
              </button>
            </div>

            {/* Small CTA */}
            <Link className={styles.ctaSm} href="/jbbc/contact/inquiry">
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
