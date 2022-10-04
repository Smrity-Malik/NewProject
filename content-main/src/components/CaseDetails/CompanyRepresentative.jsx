import React from 'react';
import styles from './CaseDetails.module.css';

function CompanyRepresentative({
  name, email, phone, designation,
}) {
  return (
    <div className="mt-7">
      <div className={styles.title}>Company Representative</div>
      <div className="grid grid-cols-4 mt-7">
        <div>
          <div className={styles.label}>Name</div>
          <div className={styles.text}>{name}</div>
        </div>
        <div>
          <div className={styles.label}>Email</div>
          <div className={styles.text}>{email}</div>
        </div>
        <div>
          <div className={styles.label}>Phone</div>
          <div className={styles.text}>{phone}</div>
        </div>
        <div>
          <div className={styles.label}>Designation</div>
          <div className={styles.text}>{designation}</div>
        </div>
      </div>
    </div>
  );
}

export default CompanyRepresentative;
