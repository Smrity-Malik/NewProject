import React from 'react';
import styles from './CaseDetails.module.css';
import { formatDate } from '../../utilities/utilities';

function CourtDetails({
  courtType, state, city, nextDateMain,
}) {
  return (
    <div>
      <div className="grid grid-cols-4 mt-7">
        <div>
          <div className={styles.label}>Court Type</div>
          <div className={styles.text}>{courtType}</div>
        </div>
        <div>
          <div className={styles.label}>State</div>
          <div className={styles.text}>{state}</div>
        </div>
        <div>
          <div className={styles.label}>City</div>
          <div className={styles.text}>{city}</div>
        </div>
        <div>
          <div className={styles.label}>Next Date</div>
          <div className={styles.text}>{formatDate(nextDateMain)}</div>
        </div>
      </div>
    </div>
  );
}

export default CourtDetails;
