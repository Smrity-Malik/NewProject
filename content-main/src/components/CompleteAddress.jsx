import React, { useEffect, useState } from 'react';
import {
  SegmentedControl, Textarea, TextInput, Button, Select, ActionIcon, Divider,
} from '@mantine/core';
import { Edit, Trash } from 'tabler-icons-react';
import { getValueForInput, validateAddress } from '../utilities/utilities';
import TextWithLabel from './TextWithLabel';

const CompleteAddress = ({
  data,
  onDelete,
  onSave, allowEdit, setMode, deleteAllowed, withDivider, mode, skipValidation = false,
}) => {
  const [configs, setConfigs] = useState({
    data,
    erroredFields: [],
  });

  const isErrored = (key) => configs.erroredFields.indexOf(key) !== -1;

  useEffect(() => {
    setConfigs({ ...configs, data });
  }, [data]);

  const validate = () => {
    const { result, erroredKeys } = validateAddress(configs.data);
    if (!result) {
      setConfigs({ ...configs, erroredFields: erroredKeys });
      return false;
    }
    return true;
  };

  const onSaveHandler = () => {
    if (!skipValidation) {
      const validation = validate();
      if (validation) {
        setConfigs({ ...configs, erroredFields: [], mode: 'view' });
        onSave(configs.data);
        setMode('view');
      }
    } else {
      setConfigs({ ...configs, mode: 'view' });
      onSave(configs.data);
      setMode('view');
    }
  };

  const changeHandler = (name) => (incoming) => {
    const value = getValueForInput(incoming);
    setConfigs({ ...configs, data: { ...configs.data, [name]: value } });
  };

  const inputProps = (name) => ({
    onChange: changeHandler(name),
    value: configs.data[name],
    error: isErrored(name) ? 'Please check value.' : false,
  });

  if (mode === 'view') {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          {/* <Text>{data.name || placeholderText}</Text> */}
          <div />
          <div className="flex">
            {allowEdit && (
            <ActionIcon
              color="green"
              className="mx-2"
              onClick={() => {
                setMode('edit');
                setConfigs({ ...configs, mode: 'edit' });
              }}
            >
              <Edit />
            </ActionIcon>
            )}
            {deleteAllowed
            && (
            <ActionIcon color="red" className="mx-2" onClick={onDelete}>
              <Trash />
            </ActionIcon>
            )}
          </div>
        </div>
        <div className="flex">
          <TextWithLabel label="Name" text={inputProps('name').value} />
          <TextWithLabel label="Email" text={inputProps('email').value} />
          {configs.data.type === 'Individual'
        && (
        <TextWithLabel label="Phone" text={inputProps('phone').value} />
        )}
          {configs.data.type === 'Entity'
        && (
        <TextWithLabel label="Entity Type" text={inputProps('companyType').value} />
        )}
        </div>
        <div className="flex">
          {configs.data.type === 'Individual'
        && (
        <TextWithLabel label="S/o" text={inputProps('sonOf').value} />
        )}
          {configs.data.type === 'Entity'
        && (
        <TextWithLabel label="Registered Address" text={inputProps('registeredOfficeAddress').value} />
        )}
          {configs.data.type === 'Individual'
        && (
        <TextWithLabel label="Residence" text={inputProps('residenceOf').value} />
        )}
          {configs.data.type === 'Entity'
        && (
        <TextWithLabel label="Corporate Address" text={inputProps('corporateOfficeAddress').value} />
        )}
          <div>&nbsp;</div>
        </div>
        {mode === 'edit'
      && (
      <div className="flex justify-end">
        <Button onClick={onSaveHandler}>Save</Button>
      </div>
      )}
        {withDivider && <Divider className="w-full my-4" />}

      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        {/* <Text>{data.name || placeholderText}</Text> */}
        <div />
        {mode === 'edit'
          && (
          <div className="flex items-center">
            <SegmentedControl
              value={configs.data.type}
              color="blue"
              data={['Individual', 'Entity']}
              onChange={(value) => {
                setConfigs({
                  ...configs,
                  data: { ...configs.data, type: getValueForInput(value) },
                });
              }}
            />
            {deleteAllowed
            && (
            <ActionIcon color="red" className="mx-2" onClick={onDelete}>
              <Trash />
            </ActionIcon>
            )}
          </div>
          )}

      </div>
      <div className="flex">
        <TextInput
          required={!skipValidation}
          label="Name"
          placeholder="Enter Name"
          className="inputCustom mx-4"
          {...inputProps('name')}
        />
        <TextInput
          required={!skipValidation}
          label="Email"
          placeholder="Enter Email"
          className="inputCustom mx-4"
          {...inputProps('email')}
        />
        {configs.data.type === 'Individual'
        && (
        <TextInput
          label="Phone"
          placeholder="Enter 10 digit phone no."
          className="inputCustom mx-4"
          {...inputProps('phone')}
        />
        )}
        {configs.data.type === 'Entity'
        && (
        <Select
          className="inputCustom mx-4"
          label="Entity Type"
          required={!skipValidation}
          data={[
            { value: 'Company', label: 'Company' },
            { value: 'LLP', label: 'LLP' },
            { value: 'Partnership Firm', label: 'Partnership Firm' },
            { value: 'Sole Proprietary', label: 'Sole Proprietary' },
          ]}
          {...inputProps('companyType')}
        />
        )}
      </div>
      <div className="flex">
        {configs.data.type === 'Individual'
        && (
        <TextInput
          required={!skipValidation}
          label="S/o"
          placeholder="S/o"
          className="inputCustom mx-4"
          {...inputProps('sonOf')}
        />
        )}
        {configs.data.type === 'Entity'
        && (
        <Textarea
          label="Registered Address"
          placeholder="Enter Registered Address"
          className="inputCustom mx-4"
          {...inputProps('registeredOfficeAddress')}
        />
        )}
        {configs.data.type === 'Individual'
        && (
        <Textarea
          label="Residence"
          placeholder="Enter Residence"
          className="inputCustom mx-4"
          {...inputProps('residenceOf')}
        />
        )}
        {configs.data.type === 'Entity'
        && (
        <Textarea
          label="Corporate Address"
          placeholder="Enter Corporate Address"
          className="inputCustom mx-4"
          {...inputProps('corporateOfficeAddress')}
        />
        )}
      </div>
      {mode === 'edit'
      && (
      <div className="flex justify-end">
        <Button onClick={onSaveHandler}>Save</Button>
      </div>
      )}
      {withDivider && <Divider className="w-full my-4" />}
    </div>
  );
};
export default CompleteAddress;
