import React from 'react';
import { Badge, Progress, Button } from '@mantine/core';
// import { Badge, Progress } from '@mantine/core';
import styles from './ExpensePurpose.module.css';
import EmailDetails from '../TaskNewUI/EmailDetails';

function ExpensePurpose() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mt-8">
        <div className={styles.expenseTitle}>Expense Purpose- some recovery</div>
        <Badge
          style={{
            backgroundColor: '#C9FFE4',
            borderRadius: '1rem',
            color: '#121212',
            padding: '3px 8px',
            width: '170px',
            height: '33px',
          }}
        >
          Paid

        </Badge>
      </div>
      <div className={`${styles.expenseInfo} mt-7`}>
        Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit ultrices enim cursus.
        Leo sapien, pretium duis est eu volutpat interdum eu non. Odio eget nullam elit laoreet.
        Libero at felis nam at orci venenatis rutrum nunc. Etiam mattis ornare pellentesque iaculis
        enim.
      </div>
      <div className="flex flex-row justify-between mt-8">
        <div>
          <div className={styles.heading}>Amount</div>
          <div className={styles.amount}>1,000 INR</div>
        </div>
        <div>
          <div className={styles.heading}>user paid to</div>
          <div>
            <EmailDetails />
          </div>
        </div>
        <div>
          <div className={styles.heading}>Purpose</div>
          <div className={styles.detail}>Recovery</div>
        </div>
        <div>
          <div className={styles.heading}>Date</div>
          <div className={styles.detail}>31 May 2022</div>
        </div>
        <div>
          <div className={styles.heading}>Designation</div>
          <div className={styles.detail}>Manager</div>
        </div>
      </div>
      <div className="flex flex-row mt-7">
        <img src="/assets/images/downloadFileLogo.svg" alt="fileLogo" />
        {/* <div className="flex flex-row justify-between"> */}
        <div className="flex flex-col w-2/3 pl-3">
          <div className={`${styles.paymentReceipt}`}>Payment Receipt</div>
          <div className="mt-3"><Progress color="teal" size="xs" value={100} /></div>
        </div>
        <div className="flex flex-row justify-end w-1/3">
          <Button
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            View
          </Button>
        </div>
        {/* </div> */}
      </div>
      <div className="mt-6">
        <img src="/assets/images/Line.svg" alt="line" />
      </div>
    </div>
  );
}

export default ExpensePurpose;
