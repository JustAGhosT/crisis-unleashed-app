import React, { ReactNode } from 'react';
import styles from './DescriptionSection.module.css';

interface DescriptionSectionProps {
  title: string;
  children: ReactNode;
  choiceText?: string;
}

export const DescriptionSection = ({ title, children, choiceText }: DescriptionSectionProps) => {
  return (
    <section className={styles.descriptionSection}>
      <h2>{title}</h2>
      {children}
      {choiceText && <p className={styles.choiceText}>{choiceText}</p>}
    </section>
  );
};