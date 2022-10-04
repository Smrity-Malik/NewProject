import React from 'react';
import { Button } from '@mantine/core';
import styles from './SignDetail.module.css';

function SignDetail() {
  return (
    <div className="flex flex-col pt-5 pl-9 pr-6">
      <div className="col-span-2 mt-2">
        <div className="flex flex-row justify-between">
          <div>
            <div className={styles.title}>Go mechanic</div>
            <div className={styles.email}>to : alishakamatbusiness@gmail.com</div>
          </div>
          <div className={styles.date}>
            30 july 2022 : 9:16AM
          </div>
        </div>
        <div className={`${styles.signTitle} mt-14`}>Sign this NDA soon</div>
        <div className={`${styles.signText} mt-4 mb-8`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit
          laoreet. Enim eu turpis egestas pretium. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Convallis tellus id interdum velit laoreet. Enim eu turpis egestas pretium
        </div>
        <div className={`${styles.signText} mt-4 mb-8`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit
          laoreet. Enim euturpis egestas pretium. Lorem ipsum dolor sit amet, consectetur.
        </div>
        <div className={`${styles.signText} mt-4 mb-8`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit
          laoreet. Enim eu turpis egestas pretium. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Convallis tellus id interdum velit laoreet. Enim eu turpis egestas pretium
        </div>
        <div className="flex flex-row mt-16">
          <Button
            className="mr-3"
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            Reply
          </Button>
          <Button
            variant="outline"
            style={{
              border: ' 1px solid #46BDE1',
              borderRadius: '0.5rem',
              color: '#46BDE1',
            }}
          >
            Forward
          </Button>
        </div>
      </div>
    </div>
  // </div>
  );
}

export default SignDetail;
