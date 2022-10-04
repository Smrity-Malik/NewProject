import React, { useState } from 'react';
import {
  Button,
  Modal, SegmentedControl, Select, Space, Text, Textarea, TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import flat from 'flat';
import { useDispatch, useSelector } from 'react-redux';
import { randomId } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { loadingStates } from '../utilities/utilities';
import { formSettings } from '../utilities/formSettings';
import actions from '../redux/actions';
import { selectWorkspaceSettings } from '../redux/selectors';
import { saveSettings } from '../utilities/apis/settings';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';

const AddressAddModal = ({ opened, setClose }) => {
  // eslint-disable-next-line no-unused-vars
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });
  const workSpaceSettings = useSelector(selectWorkspaceSettings);
  const form = useForm({
    initialValues: flat({
      address: { ...formSettings.senderOrReceiver },
    }),
  });
  const context = 'address';
  const dispatch = useDispatch();
  const save = async () => {
    const value = (flat.unflatten(form.values)).address;
    value.addressId = (randomId()).replace('mantine-', '');
    const newSettings = { 
      ...workSpaceSettings,
      addresses: [...workSpaceSettings.addresses,
        value,
      ],
    };
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(saveSettings({
      settingsData: newSettings,
    }));
    if (response?.success) {
      dispatch({
        type: actions.SET_WORKSPACE_SETTINGS,
        payload: newSettings,
      });
      setClose();
      setConfigs({
        ...configs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    } else {
      showNotification({
        title: 'Settings',
        message: 'Couldn\'t save settings',
      });
      setConfigs({
        ...configs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };
  return (
    <Modal title="Add new address" opened={opened} onClose={setClose} size="calc(50vw)">
      <Text size="sm">This address can be re-used across various sections of app.</Text>
      <div className="flex flex-col w-1/2">
        <SegmentedControl
          color="blue"
          data={
              [
                { value: 'Individual', label: 'Individual' },
                { value: 'Entity', label: 'Entity' },
              ]
            }
          {...form.getInputProps(`${context}.type`)}
        />
        <Space h="xs" />
        <TextInput required label="Name" placeholder="Enter Name" {...form.getInputProps(`${context}.name`)} />
        <Space h="xs" />
        <TextInput
          required
          placeholder="Enter Email"
          label="Email"
          {...form.getInputProps(`${context}.email`)}
        />
        <Space h="xs" />

        {form.values[`${context}.type`] === 'Individual' && (
        <>
          <TextInput
            required
            label="Phone"
            placeholder="Enter 10 digit phone no."
            type="number"
            {...form.getInputProps(`${context}.phone`)}
          />
          <Space h="xs" />
          <TextInput
            required
            placeholder="S/o"
            label="S/o"
            {...form.getInputProps(`${context}.sonOf`)}
          />
          <Space h="xs" />
          <Textarea
            required
            placeholder="Enter Residence"
            label="Residence"
            {...form.getInputProps(`${context}.residenceOf`)}
          />
          <Space h="xs" />
        </>
        )}

        {form.values[`${context}.type`] === 'Entity' && (
        <>
          <Select
            label="Entity Type"
            required
            data={[
              { value: 'Company', label: 'Company' },
              { value: 'LLP', label: 'LLP' },
              { value: 'Partnership Firm', label: 'Partnership Firm' },
              { value: 'Sole Proprietary', label: 'Sole Proprietary' },
            ]}
            {...form.getInputProps(`${context}.companyType`)}
          />
          <Space h="xs" />
          <Textarea
            required
            placeholder="Registered Office Address"
            label="Registered Office Address"
            {...form.getInputProps(`${context}.registeredOfficeAddress`)}
          />
          <Space h="xs" />
          <Textarea
            required
            placeholder="Corporate Office Address"
            label="Corporate Office Address"
            {...form.getInputProps(`${context}.corporateOfficeAddress`)}
          />
          <Space h="xs" />
        </>
        )}
      </div>
      {configs.loading === loadingStates.LOADING ? <BeatLoader color="blue" size={10} /> : <Button onClick={save}>Save Address</Button>}
    </Modal>
  );
};

export default AddressAddModal;
