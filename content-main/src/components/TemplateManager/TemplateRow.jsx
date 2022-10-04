import React from 'react';
import { Button } from '@mantine/core';
import styles from './TemplateRow.module.css';
import { formatDate, formatTime } from '../../utilities/utilities';

function TemplateRow({
  createdBy, createdAt, name, editButton = false, viewButton = true,
  onViewClick,
}) {
  return (
    <div className="flex flex-row justify-between pr-10 mb-14">
      <div className="flex flex-row text-center">
        <div><img src="/assets/images/downloadFileLogo.svg" alt="fileLogo" /></div>
        <div className="flex flex-col pl-3">
          <div className={`flex justify-start ${styles.agreementTitle}`}>{name}</div>
          <div className="flex flex-row text-center ">
            <div className={`${styles.text} mr-3`}>
              Created by
              {' '}
              { createdBy.name }
            </div>
            <div className="flex flex-row text-center">
              <div><img src="/assets/images/clock2.svg" alt="clock" /></div>
              <div className={`${styles.date} ml-2`}>
                {formatDate(createdAt)}
                ,
                {formatTime(createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        {viewButton
            && (
            <Button
              onClick={onViewClick}
              className="mx-2"
              variant="outline"
            >
              View
            </Button>
            )}
        {editButton
            && (
            <Button
              style={{
                backgroundColor: ' #46BDE1',
                borderRadius: '0.25rem',
                height: '40px',
                fontWeight: '400',
                lineHeight: '1.375rem',
              }}
            >
              Edit
            </Button>
            )}
      </div>
    </div>
  );
}

export default TemplateRow;
