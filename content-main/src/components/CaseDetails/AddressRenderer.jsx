import React from 'react';
import styles from './CaseDetails.module.css';

function AddressRenderer({
  name, email, phone, sonOf, residenceOf,
  // eslint-disable-next-line no-unused-vars
  type, companyType, corporateOfficeAddress, registeredOfficeAddress,
}) {
  return (
    <div>
      <div className="grid grid-cols-3 mt-7">
        <div>
          <div className={styles.label}>Name</div>
          <div className={styles.text}>{name}</div>
        </div>
        <div>
          <div className={styles.label}>Email</div>
          <div className={styles.text}>{email}</div>
        </div>
        {type === 'Individual'
            && (
            <div>
              <div className={styles.label}>Phone</div>
              <div className={styles.text}>{phone}</div>
            </div>
            )}
        {type === 'Entity'
            && (
            <div>
              <div className={styles.label}>Company Type</div>
              <div className={styles.text}>{companyType}</div>
            </div>
            )}
      </div>
      <div className="grid grid-cols-3 mt-7">
        {type === 'Individual'
            && (
            <div>
              <div className={styles.label}>S/o</div>
              <div className={styles.text}>{sonOf}</div>
            </div>
            )}
        {type === 'Individual'
        && (
        <div>
          <div className={styles.label}>Residence</div>
          <div className={styles.text}>{residenceOf}</div>
        </div>
        )}
        {type === 'Entity'
            && (
            <div>
              <div className={styles.label}>Registered Address</div>
              <div className={styles.text}>{registeredOfficeAddress}</div>
            </div>
            )}
        {type === 'Entity'
        && (
        <div>
          <div className={styles.label}>Corporate Address</div>
          <div className={styles.text}>{corporateOfficeAddress}</div>
        </div>
        )}
      </div>
    </div>
  // </div>
  );
}

export default AddressRenderer;
