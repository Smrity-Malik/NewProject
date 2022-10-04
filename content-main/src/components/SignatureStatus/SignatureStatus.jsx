import React from 'react';
import { Badge } from '@mantine/core';
import styles from './SignatureStatus.module.css';

function SignatureStatus({
  status, email, index,
}) {
  return (
    <div className="grid grid-cols-4 mt-10">
      <div>
        <div className={`${styles.label}`}>
          {index === 0 ? 'First' : 'Sencond'}
          {' '}
          Party
        </div>
        <div className={`${styles.email}`}>{email}</div>
      </div>
      <div>
        <div className={`${styles.label}`}>Signature Status</div>
        <div>
          <Badge
            style={{
              backgroundColor: status.toLowerCase() === 'signed' ? '#C9FFE4' : ' #FCA5A5',
              borderRadius: '16px',
              color: '#121212',
              // padding: '3px 8px',
              width: '170px',
              height: '23px',
            }}
            className={styles.badgeText}
          >
            { status.toUpperCase() }
          </Badge>

        </div>
      </div>
    </div>
  );
}

export default SignatureStatus;
