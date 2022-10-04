import React from 'react';
import { SegmentedControl, Pagination } from '@mantine/core';
// import { Pagination } from '@mantine/core';
import Agreement2 from './Agreement2';
import styles from './AgreementTemplate2.module.css';
import data from '../AgreementTemplate/agreementData.json';

function AgreementTemplate2() {
  return (
    <div className="flex flex-col pt-2 pb-7 pl-10 pr-14">
      <div className={styles.title}>Agreements Templates</div>
      <div className="flex flex-row justify-between mt-6">
        <div className={`${styles.text} mt-1`}>
          Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit ultrices enim.
        </div>
        <div>
          <SegmentedControl
            color="blue"
            // color="#46BDE1"
            data={[
              { label: 'Service Agreements', value: 'Service Agreements' },
              { label: 'Employement Agrrements', value: 'Employement Agrrements' },
            ]}
          />
        </div>
      </div>
      <div className="mt-16">
        { data.map((obj) => <Agreement2 {...obj} />)}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          total={3}
          size="sm"
        />
      </div>
    </div>
  );
}

export default AgreementTemplate2;
