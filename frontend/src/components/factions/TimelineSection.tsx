import React from 'react';
import styles from './TimelineSection.module.css';

interface TimelineSectionProps {
  title: string;
  description: string;
  buttonText: string;
  onTimelineClick: () => void;
}

export const TimelineSection = ({ title, description, buttonText, onTimelineClick }: TimelineSectionProps) => {
  return (
    <section className={styles.timelineSection}>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className={styles.timelineButton} onClick={onTimelineClick}>
        {buttonText}
      </button>
    </section>
  );
};