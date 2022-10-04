import React from 'react';
import { Button, Textarea, TextInput } from '@mantine/core';

function Form() {
  return (
    <div>
      <div className="grid gap-x-4 grid-cols-3  mt-8">
        <TextInput
          placeholder="Enter Name"
          label="Name"
          required
        />
        <TextInput
          placeholder="Enter Email"
          label="Email"
          required
        />
        <TextInput
          placeholder="Enter 10 digit phone no."
          label="Phone"
          required
        />
      </div>
      <div className="grid gap-x-4 grid-cols-3 mt-8">
        {/* <div className="grid gap-x-4 grid-cols-2 mt-8"> */}
        <TextInput
          label="S/o"
          placeholder="S/o"
          required
        />
        <Textarea
          placeholder="Enter Residence"
          label="Residence"
          required
          className="col-span-2"
        />
      </div>
      <div className="mt-16 mb-8 flex justify-end">
        <Button
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.5rem',
            color: '#F5F5F5',
          }}
        >
          Save
        </Button>
      </div>
      <div>
        <img src="/assets/images/Line.svg" alt="line" />
      </div>
    </div>
  );
}

export default Form;
