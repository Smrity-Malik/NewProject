import React from 'react';
import styles from './AgreementDetail.module.css';

function PartyDetail({
  name, email, address, signatory, representative,
}) {
  return (
    <div className="grid grid-cols-4 gap-y-9 mt-3 mb-9">
      <div>
        <div className={styles.label}>Name</div>
        <div className={styles.text}>{name}</div>
      </div>
      <div>
        <div className={styles.label}>Email</div>
        <div className={styles.text}>{email}</div>
      </div>
      <div>
        <div className={styles.label}>Address</div>
        <div className={styles.text}>{address}</div>
      </div>
      <div>
        <div className={styles.label}>Signatory</div>
        <div className={styles.text}>{signatory}</div>
      </div>
      <div>
        <div className={styles.label}>Representative</div>
        <div className={styles.text}>{representative}</div>
      </div>
    </div>
  );
}

export default PartyDetail;
