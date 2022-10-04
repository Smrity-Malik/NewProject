import React from 'react';
import { Button } from '@mantine/core';
import { formatDate } from '../../utilities/utilities';
import styles from './RecordCaseDetailPage.module.css';

function RecordCaseDetailPage() {
  const obj = {
    caseHearingDate: '2022-08-06T06:45:05Z',
    nextHearingDate: '2022-09-06T06:45:05Z',
    purpose: 'case',
    fixedFor: 'fixed detail',
    summary: 'summary detail for case record',
  };
  return (
    <div className="flex flex-col px-10">
      <div className="flex flex-row justify-between">
        <div className={`${styles.caseHeader}`}>Case record- Case #2022</div>
      </div>
      <div className={`${styles.caseTitle} mt-1`}>
        Commodo eget a et dignissim dignissim morbi vitae, mi.
        Mi aliquam sit ultrices enim.
      </div>
      <div className={`${styles.label} grid gap-x-4 grid-cols-4 mt-5`}>
        <div>
          <div className={`${styles.label}`}>Case Hearing Date</div>
          <div className={`${styles.text} mt-1`}>{formatDate(obj.caseHearingDate)}</div>
        </div>
        <div>
          <div className={`${styles.label}`}>Next Hearing Date</div>
          <div className={`${styles.text} mt-1`}>{formatDate(obj.nextHearingDate)}</div>
        </div>
        <div>
          <div className={`${styles.label}`}>Purpose</div>
          <div className={`${styles.text} mt-1`}>{obj.purpose}</div>
        </div>
        <div>
          <div className={`${styles.label}`}>FixedFor</div>
          <div className={`${styles.text} mt-1`}>{obj.fixedFor}</div>
        </div>
      </div>
      <div className="mt-5">
        <div className={`${styles.label}`}>Summary</div>
        <div className={`${styles.text} mt-1`}>{obj.summary}</div>
      </div>
      <div className={`${styles.label} pt-6`}>Files</div>
      <div className="flex justify-end my-8">
        <Button
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.5rem',
            color: '#F5F5F5',
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default RecordCaseDetailPage;
