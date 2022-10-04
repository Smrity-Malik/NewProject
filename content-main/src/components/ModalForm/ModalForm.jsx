import React, { useState } from 'react';
import {
  TextInput, Button, Group, Modal, Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { BeatLoader } from 'react-spinners';
import { loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { requestDemo } from '../../utilities/apis/demo';
// import styles from './ModalForm.module.css';
const ModalForm = (props) => {
  const { opened, setOpened } = props;
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });

  const form = useForm({
    initialValues: {
      name: '',
      companyName: '',
      email: '',
      mobileNum: '',
      message: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      mobileNum: (value) => (/^\d{10}$/.test(value) ? null : 'Invalid number'),
    },
  });

  if (configs.loading === loadingStates.SUCCEEDED) {
    return (
      <Modal
        onClose={() => setOpened(false)}
        title="Book Demo"
        opened={opened}
      >
        Thank you for your interest, we will get back to you shortly.
      </Modal>
    );
  }

  const handleSubmit = async (values) => {
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(requestDemo(values));
    if (response && response.success) {
      setConfigs({
        ...configs,
        loading: loadingStates.SUCCEEDED,
      });
    } else {
      setConfigs({
        ...configs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
      alert('Something went wrong');
    }
  };

  return (
    <Modal
      closeOnClickOutside={false}
      size="calc(50vw)"
      opened={opened}
      onClose={() => setOpened(false)}
      title="Book Demo"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="flex flex-col">
          <div className="flex flex-row w-full my-4">
            <TextInput
              className="w-1/2 mx-4"
              required
              label="Name"
              placeholder="Your name"
              {...form.getInputProps('name')}
            />
            <TextInput
              className="w-1/2 mx-4"
              required
              label="Company Name"
              placeholder="Your organization name"
              {...form.getInputProps('companyName')}
            />
          </div>
          <div className="flex flex-row w-full my-4">
            <TextInput
              className="w-1/2 mx-4"
              required
              label="Email"
              placeholder="Your email"
              {...form.getInputProps('email')}
            />
            <TextInput
              className="w-1/2 mx-4"
              required
              label="Mobile Number"
              placeholder="Your contact number"
              {...form.getInputProps('mobileNum')}
            />
          </div>
          <div className="flex flex-row w-full my-4">
            <Textarea
              className="w-full mx-4"
              required
              label="Message"
              placeholder="Your requirements"
              {...form.getInputProps('message')}
            />
          </div>
        </div>

        <Group position="right" mt="md">
          {configs.loading === loadingStates.LOADING ? <BeatLoader size={10} />
            : (
              <Button type="submit">Submit</Button>
            )}
        </Group>
      </form>
    </Modal>

  );
};

export default ModalForm;
