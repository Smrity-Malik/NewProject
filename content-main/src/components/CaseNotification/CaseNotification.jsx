import React from 'react';
import { Pagination } from '@mantine/core';
import styles from './CaseNotification.module.css';
import NotificationBox from './NotificationBox';
import notificationData from './notificationData.json';
// import { formatISO } from 'date-fns';

function CaseNotification() {
  return (
    <div className="pb-16">
      <div className="flex flex-row justify-between mt-11 mb-11 ml-6">
        <div className={`${styles.title}`}>NOTIFICATIONS</div>
        <img src="/assets/images/Button.svg" width={58} height={23} alt="button" />
      </div>
      {notificationData.map((obj) => <NotificationBox {...obj} />)}
      {/* {notificationData.map((obj) =>{
        return <NotificationBox { ...obj, date:formatISO(obj.date)} />
      })} */}
      <div className="flex justify-center mt-14">
        <Pagination
          total={3}
          size="sm"
        />
      </div>
    </div>
  );
}

export default CaseNotification;
