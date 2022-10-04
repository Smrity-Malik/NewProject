import {
  TextInput, Select, Button, Radio,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React, { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import colors from '../../utilities/design';
import {
  existsAndLength, getValueForInput, loadingStates, validateEmail, validateMobile,
} from '../../utilities/utilities';
import styles from './ServiceProviderForm.module.css';
import { createServiceProvider } from '../../utilities/apis/serviceProvider';

function ServiceProviderForm({ formClose }) {
  const [serviceProviderData, setServiceProviderData] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    name: '',
    email: '',
    phone: '',
    password: '',
    designation: 'Lawyer',
    enabled: 'enabled',
    errors: {},
  });
  const changeHandler = (name) => (input) => {
    const value = getValueForInput(input);
    setServiceProviderData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const validate = () => {
    const keys = {};
    if (!existsAndLength(serviceProviderData.name)) {
      keys.name = 'Please check name.';
    }
    if (!existsAndLength(serviceProviderData.email) || !validateEmail(serviceProviderData.email)) {
      keys.email = 'Please check email.';
    }
    if (!validateMobile(serviceProviderData.phone || serviceProviderData.phone.length !== 10)) {
      keys.phone = 'Please check phone.';
    }
    if (!existsAndLength(serviceProviderData.password)) {
      keys.password = 'Please check password.';
    }
    if (Object.keys(keys).length) {
      showNotification({
        color: 'red',
        title: 'Service Record',
        message: 'Make sure all fields are filled properly.',
      });
      setServiceProviderData((data) => ({
        ...data,
        errors: keys,
      }));
      return false;
    }
    return true;
  };
  const serviceHandler = async () => {
    if (validate()) {
      setServiceProviderData((data) => ({
        ...data,
        loading: loadingStates.LOADING,
        errors: {},
      }));
      const serviceProviderApiData = {
        name: serviceProviderData.name,
        email: serviceProviderData.email,
        phone: serviceProviderData.phone,
        password: serviceProviderData.password,
        designation: serviceProviderData.designation,
        enabled: serviceProviderData.enabled === 'enabled',
      };
      const resp = await apiWrapWithErrorWithData(createServiceProvider({
        serviceProviderData: serviceProviderApiData,
      }));
      if (resp?.success) {
        setServiceProviderData((prevState) => ({
          ...prevState,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        }));
        showNotification({
          color: 'green',
          title: 'Service Provider Record Created.',
          message: 'Service Provider has been created.',
        });
        if (formClose) {
          formClose();
        }
      } else {
        showNotification({
          color: 'red',
          title: 'Service Provider Record',
          message: resp?.message || 'Service Provider Record could not be created.',
        });
        setServiceProviderData((prevState) => ({
          ...prevState,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        }));
      }
    }
  };
  return (
    <div className="flex flex-col px-4 pb-8">
      <div className={styles.title}>Add new service provider</div>
      <div className={`${styles.text} mt-1`}>
        Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit ultrices enim.
      </div>
      <div className=" grid grid-cols-2 gap-x-4 mt-8">
        <TextInput
          placeholder="Enter Name"
          label="Name"
          value={serviceProviderData.name}
          onChange={changeHandler('name')}
          error={serviceProviderData.errors.name}
        />
        <TextInput
          placeholder="Enter Email"
          label="Email"
          value={serviceProviderData.email}
          onChange={changeHandler('email')}
          error={serviceProviderData.errors.email}
        />
        <TextInput
          className="mt-8"
          placeholder="Enter 10 digit phone no."
          label="Phone"
          value={serviceProviderData.phone}
          onChange={changeHandler('phone')}
          error={serviceProviderData.errors.phone}
        />
        <TextInput
          className="mt-8"
          placeholder="Enter Password"
          label="Password"
          type="password"
          value={serviceProviderData.password}
          onChange={changeHandler('password')}
          error={serviceProviderData.errors.password}
        />
      </div>
      <Select
        className="mt-8"
        placeholder="Enter Designation"
        label="Designation"
        data={[
          { value: 'Lawyer', label: 'Lawyer' },
          { value: 'Clerk', label: 'Clerk' },
          { value: 'Researcher', label: 'Researcher' },
          // { value: 'vue', label: 'Vue' },
        ]}
        value={serviceProviderData.designation}
        onChange={changeHandler('designation')}
        // error={serviceProviderData.errors.designation}
      />
      <Radio.Group
        className="mt-8"
        label="User Permission"
        description="This is a description"
        spacing="xs"
        withAsterisk
        value={serviceProviderData.enabled}
        onChange={changeHandler('enabled')}
      >
        <Radio value="enabled" label="Enabled" />
        <Radio value="disabled" label="Disabled" />
      </Radio.Group>

      <div className="flex justify-end">
        {/* {serviceProviderData.loading === loadingStates.LOADING
          ? <BeatLoader color={colors.primary} size={10} />
          : (
            <Button
              onClick={serviceHandler}
              style={{
                backgroundColor: '#46BDE1',
                borderRadius: '0.5rem',
                color: '#F5F5F5',
              }}
            >
              Go to case
            </Button>
          )} */}
        <Button
          onClick={serviceHandler}
          disabled={serviceProviderData.loading === loadingStates.LOADING}
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.5rem',
            color: '#F5F5F5',
          }}
        >
          {serviceProviderData.loading === loadingStates.LOADING
              && <BeatLoader color={colors.primary} size={10} />}
          {serviceProviderData.loading === loadingStates.NO_ACTIVE_REQUEST
              && <span> Save</span>}
        </Button>
      </div>
    </div>
  );
}

export default ServiceProviderForm;
