import React from 'react';
import { SegmentedControl, Button, Pagination } from '@mantine/core';
import ExpensePurpose from './ExpensePurpose';
import styles from './CaseExpenseDetails.module.css';

function CaseExpenseDetails() {
  return (
    // <div className="flex flex-col pt-7 px-10 pb-24">
    <div className={`${styles.container} flex flex-col pt-7 px-10 pb-24`}>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className={styles.title}>Expenses</div>
          <div className={styles.heading}>Manage your expenses for this case details</div>
        </div>
        <div className="flex flex-row">
          <div className="mr-4">
            <SegmentedControl
              color="blue"
              data={[
                { label: 'Paid', value: 'Paid' },
                { label: 'Recoverd', value: 'Recoverd' },
              ]}
            />

          </div>
          <div>
            <Button
              style={{
                backgroundColor: '#46BDE1',
                borderRadius: '0.5rem',
                color: '#F5F5F5',
              }}
            >
              Add New Expense
            </Button>

          </div>
        </div>
      </div>
      <div className={`${styles.map} mt-7`}>
        {/* map */}
        map
      </div>
      <div className="mt-14">
        <ExpensePurpose />
        <ExpensePurpose />
      </div>
      <div className="flex justify-center mt-14">
        <Pagination
          total={3}
          size="sm"
        />
      </div>
    </div>
  );
}

export default CaseExpenseDetails;
