/* eslint-disable import/no-cycle */
// import React from 'react';
import { useState, React } from 'react';
import styles from './EmailDetail.module.css';

function EmailDetail({
  setShow, show,
}) {
  const [clr, setClr] = useState(false);
  return (
    // style={{ borderBottom: '1px solid #ccc', paddingBottom: '2rem' }}>
    <div className={`${clr ? styles.bg : ''} flex flex-row`}>
      <div
        className="flex flex-col"
        style={{ width: '100%' }}
        onClick={() => {
          setShow(!show);
          setClr(!clr);
        }}
      >
        <div className="flex flex-col mt-8 px-6">
          <div className="flex flex-row justify-between">
            <div>
              <div className={`${styles.detailHeader}`} style={{ color: clr ? '#FFFFFF' : ' ' }}>Go mechanic-Multiple</div>
            </div>
            <div className={styles.date} style={{ color: clr ? '#FFFFFF' : ' ' }}>30 JULY</div>
          </div>
          <div className={`${styles.detailTitle} mt-1`} style={{ color: clr ? '#FFFFFF' : ' ' }}>Sign this NDA soon</div>
          <div className={`${styles.detailText} mt-3`} style={{ color: clr ? '#FFFFFF' : ' ' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore ...
          </div>
          <img className="mt-8" src="/assets/images/Line.svg" alt="line" />
        </div>
      </div>
    </div>
  );
}

export default EmailDetail;
