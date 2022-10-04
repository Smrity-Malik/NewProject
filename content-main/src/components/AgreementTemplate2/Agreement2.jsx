import React from 'react';
import { Button } from '@mantine/core';
import styles from './Agreement2.module.css';
// import { formatDate } from '../../utilities/utilities';

function Agreement2({
  agreementTitle, createdBy, date, time,
}) {
  return (
    <div className="flex flex-row justify-between mb-14">
      <div className="flex flex-row text-center">
        <div><img src="/assets/images/downloadFileLogo.svg" alt="fileLogo" /></div>
        <div className="flex flex-col pl-3">
          <div className={styles.agreementTitle}>{agreementTitle}</div>
          <div className="flex flex-row text-center">
            <div className={`${styles.text} mr-3`}>
              Created by
              {' '}
              { createdBy }
            </div>
            <div className="flex flex-row text-center">
              <div><img src="/assets/images/clock2.svg" alt="clock" /></div>
              <div className={`${styles.date} ml-2`}>
                {date}
                ,
                {' '}
                {time}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <Button
          className="mx-3"
          variant="outline"
          style={{
            border: ' 1px solid #46BDE1',
            borderRadius: '0.25rem',
            color: '#46BDE1',
            lineHeight: '1.375rem',
            fontWeight: '400',
          }}
        >
          Preview
        </Button>
        <Button
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.25rem',
            lineHeight: '1.375rem',
            fontWeight: '400',
            color: '#F5F5F5',
          }}
        >
          Select
        </Button>
      </div>
    </div>
  );
}

export default Agreement2;
