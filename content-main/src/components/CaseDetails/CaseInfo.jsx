import React from 'react';
import styles from './CaseDetails.module.css';

function CaseInfo({
  type, year, number, amount,
}) {
  return (
    <div className="grid grid-cols-4 mt-9">
      <div>
        <div className={styles.label}>Case Type</div>
        <div className={styles.text}>{type}</div>
      </div>
      <div>
        <div className={styles.label}>Case Number</div>
        <div className={styles.text}>{number}</div>
      </div>
      <div>
        <div className={styles.label}>Case year</div>
        <div className={styles.text}>{year}</div>
      </div>
      <div>
        <div className={styles.label}>Case Amount</div>
        <div className={styles.text}>{amount}</div>
      </div>
    </div>
  );
}

export default CaseInfo;
