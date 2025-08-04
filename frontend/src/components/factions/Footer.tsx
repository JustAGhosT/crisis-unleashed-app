import React, { ReactNode } from 'react';
import styles from './Footer.module.css';

interface FooterProps {
  children?: ReactNode;
  copyright?: string;
}

export const Footer = ({ children, copyright }: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {children}
        {copyright && <p className={styles.copyright}>{copyright}</p>}
      </div>
    </footer>
  );
};