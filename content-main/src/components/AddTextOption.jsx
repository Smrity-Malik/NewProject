import React, { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { BeatLoader } from 'react-spinners';
import { loadingStates } from '../utilities/utilities';

const AddTextOption = ({ placeholder, onSaveClick, loading }) => {
  const [config, setConfig] = useState({
    value: '',
  });
  const handler = (name) => (e) => {
    setConfig({
      ...config,
      [name]: e.target.value,
    });
  };
  return (
    <div className="flex flex-row items-center">
      <TextInput className="mr-4" placeholder={placeholder} value={config.value} onChange={handler('value')} />
      {loading === loadingStates.LOADING
        ? <BeatLoader size={10} />
        : (
          <Button
            disabled={config.value.length === 0}
            onClick={() => {
              onSaveClick(config.value);
            }}
          >
            Save
          </Button>
        )}
    </div>
  );
};

export default AddTextOption;
