import React, { useState } from 'react';
// import React from 'react';
import { Button } from '@mantine/core';
// import { Modal, Button, Group } from '@mantine/core';
import styles from './EmailTrail.module.css';
import EmailDetail from './EmailDetail';
import SignDetail from './SignDetail';

function EmailTrail() {
  const [show, setShow] = useState(false);
  // const [clr, setClr] = useState(false);
  return (
    <div className="flex flex-col pt-5 pl-9 pr-6">
      <div className="flex flex-row justify-between mb-8">
        <div className="flex flex-col">
          <div className={styles.title}>Email</div>
          <div className={styles.text}>
            Commodo eget a et dignissim dignissim morbi vitae, mi.
            Mi aliquam sit ultrices enim cursus. Leo sapien.
          </div>
        </div>
        <Button
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.5rem',
            color: '#F5F5F5',
          }}
        >
          Send New Email
        </Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: show ? '30% 70%' : '100%' }}>
        <div>
          <EmailDetail setShow={setShow} show={show} />
          <EmailDetail setShow={setShow} show={show} />
          <EmailDetail setShow={setShow} show={show} />
        </div>
        {show
          ? <SignDetail />
          : null}
      </div>
      {/* {!show
        ? <SignDetail />
        : null} */}
    </div>
  );
}

export default EmailTrail;
