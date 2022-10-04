import React from 'react';
import { Button } from '@mantine/core';
import styles from './Agreement.module.css';

function Agreement() {
  return (
    <div>
      <div className="flex flex-row justify-between mt-5 mb-4">
        <div className="flex flex-row">
          <img src="/assets/images/downloadFileLogo.svg" alt="fileLogo" />
          <div className="flex flex-col pl-3">
            <div className={styles.agreement}>Agreement -01</div>
            <div className="flex flex-row mt-1">
              <div className={`${styles.text} pr-3`}>Uploaded by Kathy</div>
              <div className="flex flex-row ">
                <img src="/assets/images/clock.svg" alt="clock" />
                {' '}
                <span className={`${styles.text} ml-2`}>19:54PM</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <Button
            className={`${styles.btn} mr-3`}
            variant="outline"
            style={{
              border: ' 1px solid #46BDE1',
              borderRadius: '0.5rem',
              color: '#46BDE1',
            //   width: '150px',
            }}
          >
            Move To Case
          </Button>
          <Button
            className={`${styles.btn}`}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            //   width: '150px',
            }}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Agreement;
