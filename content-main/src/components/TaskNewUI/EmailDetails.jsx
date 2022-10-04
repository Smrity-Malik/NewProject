import React from 'react';
import styles from './EmailDetails.module.css';

function EmailDetails() {
  return (
    <div className="flex flex-row">
      <img src="/assets/images/Avatar.svg" alt="avatar" />
      <div className={`${styles.userDetails}  ml-2`}>
        <div className={`${styles.name}`}>Kathy Miller</div>
        <div className={`${styles.email}`}>Kathymiller@gmail.com</div>
      </div>
    </div>
  // <div className="flex flex-col">
  //   <div className={`${styles.assign}`}>Assigned To</div>
  //   <div className="flex flex-row">
  //     <img src="/assets/images/Avatar.svg" alt="avatar" />
  //     <div className={`${styles.userDetails}  ml-2`}>
  //       <div className={`${styles.name}`}>Kathy Miller</div>
  //       <div className={`${styles.email}`}>Kathymiller@gmail.com</div>
  //     </div>
  //   </div>
  // </div>
  );
}

export default EmailDetails;
