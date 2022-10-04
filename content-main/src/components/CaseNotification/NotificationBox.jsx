import React from 'react';
import { Button } from '@mantine/core';
import styles from './NotificationBox.module.css';
import { formatDate, formatTime } from '../../utilities/utilities';

function NotificationBox({
  backgroundColor, date, seen, module, notificationText, btnName, onBtnClick,
}) {
  const bg = {
    backgroundColor,
  };
  return (
    <div style={bg} className={`${styles.bgRed} pl-4 my-2`}>
      <div className={`${styles.topBox} px-6 pt-4`}>
        <div className={`${styles.task}`}>{module}</div>
        <div className="flex flex-row justify-between items-center">
          <div>
            <div className={`${styles.heading} my-2 mr-8`}>{notificationText}</div>
            <div className="flex flex-row mt-1 mb-6">
              <div className="flex flex-row mr-4 items-center">
                <img src="/assets/images/calendar.svg" alt="calendar" />
                <div className={`${styles.detail} ml-2`}>
                  {formatDate(date)}
                </div>
              </div>
              <div className="flex flex-row mr-4 items-center">
                <img src="/assets/images/clock.svg" alt="clock" />
                <div className={`${styles.detail} ml-2`}>{formatTime(date)}</div>
              </div>
              {seen
                  && (
                  <div className="flex flex-row mr-4 items-center">
                    <img src="/assets/images/eye.svg" alt="eye" />
                    <div className={`${styles.detail} ml-2`}>
                      {`${formatDate(seen)}, ${formatTime(seen)}`}
                    </div>
                  </div>
                  )}
            </div>
          </div>
          {!!(btnName?.length)
              && (
              <div className="flex justify-center">
                <Button
                  onClick={onBtnClick || (() => {
                  })}
                  style={{
                    backgroundColor: '#46BDE1',
                    borderRadius: '0.5rem',
                    color: '#F5F5F5',
                  }}
                >
                  {btnName}
                </Button>
              </div>
              )}
        </div>
      </div>
    </div>
  );
}

export default NotificationBox;
