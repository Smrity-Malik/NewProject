import React from 'react';
import { Badge, TextInput, Button } from '@mantine/core';
import styles from './NoticeRequestForm.module.css';
import Agreement from './Agreement';

function NoticeRequestForm() {
  return (
    <div>
      <div className="flex flex-col px-10 pb-9">
        <div className="flex flex-row justify-between">
          <div className={styles.noticeTitle}>
            Legal Notices
            / Notice Request - DRN-30
          </div>
          <Badge
            style={{
              backgroundColor: '#FFF8B5',
              borderRadius: '1rem',
              color: '#121212',
              width: '170px',
              height: '33px',
            }}
          >
            Notice Requested
          </Badge>
        </div>
        <div className={`${styles.text} mt-7`}>
          Commodo eget a et dignissim dignissim morbi vitae, mi.
          Mi aliquam sit ultrices enim cursus. Leo sapien, pretium
          duis est eu volutpat interdum eu non. Odio eget nullam elit
          laoreet. Libero at felis nam at orci venenatis rutrum nunc.
          Etiam mattis ornare pellentesque iaculis enim.
        </div>
        <div className={`${styles.uploadFile} mt-6`}>
          Uploaded Files
        </div>
        <Agreement />
        <Agreement />
        <TextInput
          className="mt-8"
          placeholder="Add remark"
          label="Remarks"
          required
        />
        <TextInput
          className="mt-8"
          placeholder="Add remarks for rejecting or accepting "
          label="Expert Remarks:"
          required
        />
        <div className="flex flex-row justify-end mt-6">
          <Button
            className={`${styles.btn} mr-5`}
            style={{
              backgroundColor: '#E03131',
              borderRadius: '0.5rem',
            }}
          >
            Reject Notice
          </Button>
          <Button
            className={`${styles.btn}`}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
            }}
          >
            Create Notice
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NoticeRequestForm;
