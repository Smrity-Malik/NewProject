import React from 'react';
import { Badge, Button } from '@mantine/core';
import { formatDate } from '../../utilities/utilities';
import styles from './ServiceProviderDetail.module.css';

function ServiceProviderDetail() {
  const detail = {
    createdOn: '2022-07-18T06:45:05Z',
  };
  const data = {
    email: 'Sid@gmail.com',
    phone: '9013657183',
    designation: 'Manager',
  };
  return (
    <div className="flex flex-col px-6 pt-7 pb-16">
      <div className={styles.header}>Alex Macbeth</div>
      <div className="flex flex-row justify-between items-center mt-1">
        <div className="flex flex-row ">
          <img className="pr-2" width={12} src="/assets/images/calendar.svg" alt="calendar" />
          <div className={styles.dateTime}>
            Created on
            {' '}
            {formatDate(detail.createdOn)}
          </div>
        </div>
        <div className="flex flex-row items-center ">
          <Badge
            className={styles.badge}
            style={{
              backgroundColor: '#96F2D7',
              borderRadius: '1rem',
              color: '#121212',
              width: '170px',
              height: '33px',
            }}
          >
            Active
          </Badge>
          <Button
            className={`${styles.btn} ml-4`}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
              width: '180px',
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 mt-11">
        <div>
          <div className={styles.label}>Email</div>
          <div className={styles.text}>{data.email}</div>
        </div>
        <div>
          <div className={styles.label}>Phone</div>
          <div className={styles.text}>{data.phone}</div>
        </div>
        <div>
          <div className={styles.label}>Designation</div>
          <div className={styles.text}>{data.designation}</div>
        </div>
      </div>
    </div>
  );
}

export default ServiceProviderDetail;
