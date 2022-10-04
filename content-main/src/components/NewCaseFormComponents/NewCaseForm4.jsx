import React from 'react';
import { TextInput, SegmentedControl } from '@mantine/core';
import styles from './NewCaseForm4.module.css';
import Form from './Form';
import UserDetails from './UserDetails';

function NewCaseForm4() {
  return (
    <div className="mt-16 mx-8">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className={`${styles.title} flex`}>
            Complainant Lawyers Details
          </div>
          <img src="/assets/images/downCap.svg" alt="downCapLogo" />
        </div>
        <div className="flex flex-row justify-between mt-5">
          <div className={`${styles.content} w-2/3`}>
            Commodo eget a et dignissim dignissim morbi vitae, mi.
            Mi aliquam sit ultrices enim cursus. Leo sapien.
          </div>
          <div>
            <SegmentedControl
              color="blue"
              // color="#46BDE1"
              data={[
                { label: 'Individual', value: 'Individual' },
                { label: 'Entity', value: 'Entity' },
              ]}
            />
          </div>
        </div>
        <Form />
        <UserDetails />
        <UserDetails />
        {/* 2 */}
        <div className="flex flex-row justify-between mt-7">
          <div className={`${styles.title} flex`}>
            Respondant Lawyers Details
          </div>
          <img src="/assets/images/downCap.svg" alt="downCapLogo" />
        </div>
        <div className="flex flex-row justify-between mt-5">
          <div className={`${styles.content} w-2/3`}>
            Commodo eget a et dignissim dignissim morbi vitae, mi.
            Mi aliquam sit ultrices enim cursus. Leo sapien.
          </div>
          <div>
            <SegmentedControl
              color="blue"
              // color="#46BDE1"
              // style={{ padding: '0px' }}
              data={[
                { label: 'Individual', value: 'Individual' },
                { label: 'Entity', value: 'Entity' },
              ]}
            />
          </div>
        </div>
        <Form />
        {/* 3 */}
        <div className={`${styles.title} flex mt-7`}>
          Company Representative Details
        </div>
        <div className="mt-8">
          <div className="grid gap-x-4 grid-cols-3">
            <TextInput
              placeholder="Enter Name"
              label="Name"
            />
            <TextInput
              placeholder="Enter Email"
              label="Email"
            />
            <TextInput
              placeholder="Enter 10 digit phone no."
              label="Phone"
            />
          </div>
        </div>
        <div className="mt-8">
          <div className="grid gap-x-4 grid-cols-3">
            <TextInput
              placeholder="Enter Designation"
              label="Designation"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCaseForm4;
