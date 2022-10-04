import React from 'react';
import { Badge, Button } from '@mantine/core';
import { formatDate, formatTime } from '../../utilities/utilities';
import styles from './NoticeDetail.module.css';
import noticeData from './noticeData.json';
import SenderDetail from './SenderDetail';

function NoticeDetail() {
  const detail = {
    createdOn: '2022-07-18T06:45:05Z',
  };
  return (
    <div className="flex flex-col pt-7 pl-4 pr-7">
      <div className={styles.title}>Notice DN-24</div>
      <div className="flex flex-row justify-between items-center mt-2">
        <div className="flex flex-row">
          <div className="flex flex-row mr-4">
            <img className="pr-2" src="/assets/images/calendar.svg" alt="calendar" />
            <span className={styles.dateTime}>
              Created on
              {' '}
              {formatDate(detail.createdOn)}
            </span>
          </div>
          <div className="flex flex-row mr-4">
            <img className="pr-2" src="/assets/images/clock.svg" alt="clock" />
            <span className={styles.dateTime}>
              {' '}
              {formatTime(detail.createdOn)}
            </span>
          </div>
        </div>
        <div>
          <Badge
            style={{
              backgroundColor: '#FFF8B5',
              borderRadius: '16px',
              color: '#121212',
              padding: '3px 8px',
              width: '170px',
              height: '33px',
            }}
          >
            In Process
          </Badge>
          <Button
            className="ml-4"
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
      <div className="mt-4">
        <div className={styles.title}>Sender</div>
        {/* <SenderDetail {...noticeData.sender} /> */}
        {noticeData.sender.map((obj) => <SenderDetail {...obj} />)}
      </div>
      <div className="mt-6">
        <div className={styles.title}>Receipient</div>
        {/* <SenderDetail {...receipientDetail} /> */}
        {noticeData.receipient.map((obj) => <SenderDetail {...obj} />)}
      </div>
    </div>
  );
}

export default NoticeDetail;
