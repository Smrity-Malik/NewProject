import React from 'react';
import styles from './NoticeDetail.module.css';

function SenderDetail({
  name, email, phone, designation, purpose, subPurpose, noticePeriod, requestedBy, type,
}) {
  return (
    <div className="grid grid-cols-4 gap-y-9 mt-3">
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
      {type === 'receipient'
            && (
            <div>
              <div className={styles.label}>Purpose</div>
              <div className={styles.text}>{purpose}</div>
            </div>
            )}
      {type === 'receipient'
            && (
            <div>
              <div className={styles.label}>Sub Purpose</div>
              <div className={styles.text}>{subPurpose}</div>
            </div>
            )}
      {type === 'receipient'
            && (
            <div>
              <div className={styles.label}>Notice Period</div>
              <div className={styles.text}>{noticePeriod}</div>
            </div>
            )}
      {type === 'receipient'
            && (
            <div>
              <div className={styles.label}>Requested By</div>
              <div className={styles.text}>{requestedBy}</div>
            </div>
            )}
    </div>
  );
}

export default SenderDetail;
