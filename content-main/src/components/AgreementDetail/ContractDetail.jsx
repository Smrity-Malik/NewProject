import React from 'react';
import styles from './AgreementDetail.module.css';
import { formatDate } from '../../utilities/utilities';

function ContractDetail({
  typeOfAgreement, termOfContractInDays, dateOfContract, endDate,
}) {
  return (
    <div>
      <div className={`${styles.title} mt-4`}>Contract Details</div>
      <div className="grid grid-cols-4 gap-y-9 mt-3 mb-9">
        <div>
          <div className={styles.label}>Type</div>
          <div className={styles.text}>{typeOfAgreement}</div>
        </div>
        <div>
          <div className={styles.label}>Contract Date</div>
          <div className={styles.text}>{formatDate(dateOfContract)}</div>
        </div>
        <div>
          <div className={styles.label}>Contract Term (in days)</div>
          <div className={styles.text}>{termOfContractInDays}</div>
        </div>
        <div>
          <div className={styles.label}>Contract End Date</div>
          <div className={styles.text}>{formatDate(endDate)}</div>
        </div>
      </div>
    </div>
  );
}

export default ContractDetail;
