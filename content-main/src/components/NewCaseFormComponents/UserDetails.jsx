import React from 'react';
import styles from './UserDetails.module.css';

function UserDetails() {
  return (
    <div className="mt-7">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className={styles.heading}>Name</div>
            <div className={styles.detail}>Lorem ipsum dolor sit raler nutsha</div>
          </div>
          <div className="flex flex-col">
            <div className={styles.heading}>Email</div>
            <div className={styles.detail}>Sid@gmail.com</div>
          </div>
          <div className="flex flex-col">
            <div className={styles.heading}>Phone</div>
            <div className={styles.detail}>8448616148</div>
          </div>
          <div className="flex flex-row">
            <div className="mx-4">
              <div className={`${styles.greenBox}`}>
                <img className="mx-4 my-3" src="/assets/images/edit.svg" alt="editLogo" />
              </div>
            </div>
            <div>
              <div className={`${styles.redBox}`}>
                <img className="mx-4 my-3" src="/assets/images/delete.svg" alt="deleteLogo" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-8 mb-11">
          <div className="flex flex-col">
            <div className={styles.heading}>Company Type</div>
            <div className={styles.detail}>Company</div>
          </div>
          <div className="flex flex-col">
            <div className={styles.heading}>Residence</div>
            <div className={styles.detail}>
              Landmark Tower, Moti Vihar, Ashok Marg, South City I,
              Sector 41, Gurugram, Haryana 122001
            </div>
          </div>
        </div>
      </div>
      <div>
        <img src="/assets/images/Line.svg" alt="line" />
      </div>
    </div>
  );
}

export default UserDetails;
