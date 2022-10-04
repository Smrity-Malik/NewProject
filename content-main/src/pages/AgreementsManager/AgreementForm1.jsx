import React from 'react';
import {
  Button, Divider,
  Select, Skeleton,
  Text,
  TextInput,
} from '@mantine/core';
import flat from 'flat';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { loadingStates, validateEmail, validateMobile } from '../../utilities/utilities';
import colors from '../../utilities/design';

const AgreementForm1 = ({
  form, setUiConfigs, uiConfigs, save,
}) => {
  const agreementFormJson = flat.unflatten(form.values);

  console.log({ agreementFormJson });

  const saveNext = async () => {
    const keys = {};
    if (!agreementFormJson?.typeOfAgreement || agreementFormJson?.typeOfAgreement?.length < 3) {
      keys.typeOfAgreement = 'Type is mandatory.';
    }
    if (agreementFormJson?.requestingUser?.name?.length < 3) {
      keys['requestingUser.name'] = 'Name is mandatory.';
    }
    if (agreementFormJson?.requestingUser?.email?.length > 0) {
      if (!validateEmail(agreementFormJson?.requestingUser?.email)) {
        keys['requestingUser.email'] = 'Please check email.';
      }
    } else {
      keys['requestingUser.email'] = 'Please check email.';
    }
    if (agreementFormJson?.requestingUser?.phone?.length > 0) {
      if (!validateMobile(agreementFormJson?.requestingUser?.phone)
      || agreementFormJson?.requestingUser?.phone.length !== 10
      ) {
        keys['requestingUser.phone'] = 'Please check phone.';
      }
    } else {
      keys['requestingUser.phone'] = 'Please check phone.';
    }
    if (Object.keys(keys).length > 0) {
      form.setErrors(keys);
      showNotification(({
        color: 'red',
        title: 'Agreement Form',
        message: 'Please check all fields are filled properly.',
      }));
    } else {
      await save();
      setUiConfigs({
        ...uiConfigs,
        currentStep: 1,
      });
    }
  };

  return (
    <div className="w-full flex flex-col my-4">
      {agreementFormJson.typeOfAgreementData.length
        ? (
          <Select
            searchable
            creatable
            className="max-w-lg"
            label="Type of agreement"
            data={agreementFormJson.typeOfAgreementData}
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              form.setFieldValue('typeOfAgreementData', Array.from(new Set([
                ...form.values.typeOfAgreementData,
                query,
              ])));
            }}
            {...form.getInputProps('typeOfAgreement')}
          />
        )
        : <Skeleton height={50} />}
      <Divider className="mt-8" />
      <Text size="md" color="#46BDE1" className="my-8">Requesting User Details</Text>
      <div className="grid grid-cols-3 gap-4">
        <TextInput label="Name" placeholder="Enter Name" {...form.getInputProps('requestingUser.name')} />
        <TextInput label="Email" placeholder="Enter Email" {...form.getInputProps('requestingUser.email')} />
        <TextInput label="Phone" placeholder="Enter 10 digit phone no." {...form.getInputProps('requestingUser.phone')} />
        <TextInput label="Designation" placeholder="Enter Designation" {...form.getInputProps('requestingUser.designation')} />
        <TextInput label="Department" placeholder="Enter Department" {...form.getInputProps('requestingUser.businessDepartment')} />
      </div>
      <div className="flex flex-row justify-between">
        <div />
        {uiConfigs.loading === loadingStates.LOADING
          ? <BeatLoader color={colors.primary} size={10} />
          : <Button className="max-w-xs mt-20" onClick={saveNext}>Next</Button> }
      </div>
    </div>
  );
};

export default AgreementForm1;
