import React from 'react';
import { Button, Progress } from '@mantine/core';
import styles from './NewCaseForm2.module.css';

function NewCaseForm2() {
  return (
    <div className="mt-16 mx-8">
      <div className={`${styles.attachFile}`}>
        Attach Files
      </div>
      <div className={`${styles.dropBox} flex flex-col justify-center mt-6`}>
        <div><img src="/assets/images/download.svg" alt="downloadlogo" /></div>
        <div className="mt-3">Drop media files (PDF, DOCX) upto 5MB</div>
      </div>
      <div className="flex flex-row mt-11">
        <img src="/assets/images/downloadFileLogo.svg" alt="fileLogo" />
        <div className="flex flex-col w-2/3 pl-3">
          <div className="flex flex-row justify-between">
            <div className={`${styles.agrement}`}>Agreement -02</div>
            <div>81%</div>
          </div>
          <div className="mt-3"><Progress color="teal" size="xs" value={40} /></div>
        </div>
      </div>
      <div className="flex flex-row mt-11">
        <img src="/assets/images/downloadFileLogo.svg" alt="fileLogo" />
        <div className="flex flex-col w-2/3 pl-3">
          <div className="flex flex-row justify-between">
            <div className={`${styles.agrement}`}>Agreement -01</div>
          </div>
          <div className="mt-3"><Progress color="teal" size="xs" value={100} /></div>
        </div>
        <div className="flex flex-row">
          <Button
            className="mx-3"
            variant="outline"
            style={{
              border: ' 1px solid #46BDE1',
              borderRadius: '0.5rem',
              color: '#46BDE1',
              width: '150px',
            }}
          >
            Download
          </Button>
          <Button
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
              width: '150px',
            }}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewCaseForm2;
