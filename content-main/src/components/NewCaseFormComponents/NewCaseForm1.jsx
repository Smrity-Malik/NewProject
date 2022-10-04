import React from 'react';
import { TextInput, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
// import { IconCalendar } from '@tabler/icons';
import styles from './NewCaseForm1.module.css';

function NewCaseForm1() {
  // const [month, onMonthChange] = useState(new Date());
  return (
    <div className="mt-16 mx-8">
      <div className={`${styles.label} flex flex-col`}>
        <div className="grid gap-x-4 grid-cols-3">
          <Select
            data={['React', 'Angular', 'Svelte', 'Vue']}
            placeholder="Court type"
            label="Court type"
          />
          <Select
            data={['React', 'Angular', 'Svelte', 'Vue']}
            placeholder="Select State"
            label="State"
          />
          <Select
            data={['React', 'Angular', 'Svelte', 'Vue']}
            placeholder="Select City/District"
            label="City/District"
          />
        </div>
        <div className="grid gap-x-4 grid-cols-2 mt-8">
          <DatePicker
            // leftIcon={<IconCalendar />}
            data={['React', 'Angular', 'Svelte', 'Vue']}
            placeholder="Select date"
            label="Court date"
            clearable
          />
          <TextInput
            placeholder="Name of judge"
            label="Name of judge"
          />
        </div>
        {/* <div className={`${styles.calendar} mt-2 w-1/3`}>
          <div className="py-4 px-2 ">
            <Calendar
              month={month}
              onMonthChange={onMonthChange}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default NewCaseForm1;
