/* eslint-disable */
import React, { useEffect } from 'react';
import {
  Button,
  Text, Textarea,
  TextInput,
} from '@mantine/core';
import flat from 'flat';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mantine/dates';
import { formatISO, parseISO } from 'date-fns';
import { loadingStates, validateEmail } from '../../utilities/utilities';
import colors from '../../utilities/design';
import { showNotification } from '@mantine/notifications';

const AgreementForm2 = ({
    id, form, setUiConfigs, uiConfigs, save,
}) => {
  const agreementFormJson = flat.unflatten(form.values);

  const navigate = useNavigate();

  const validate = () => {
    const keys = {};
    console.log({ agreementFormJson });
      if (!agreementFormJson.dateOfContract
          || isNaN(parseISO(
              agreementFormJson.dateOfContract
          ).getTime())) {
        keys['dateOfContract'] = 'Please check value.';
      }
      if(isNaN(agreementFormJson.termOfContractInDays) || agreementFormJson.termOfContractInDays <=0){
        keys['termOfContractInDays'] = 'Please check value.';
      }

    if(!agreementFormJson.firstParty.name || agreementFormJson.firstParty.name?.length < 3){
      keys['firstParty.name'] = 'Please check value.';
    }
    if(!validateEmail(agreementFormJson.firstParty?.email)){
      keys['firstParty.email'] = 'Please check value.';
    }
    if(!agreementFormJson.firstParty.address || agreementFormJson.firstParty.address?.length < 3){
      keys['firstParty.address'] = 'Please check value.';
    }
    if(!agreementFormJson.firstParty.representative || agreementFormJson.firstParty.representative?.length < 3){
      keys['firstParty.representative'] = 'Please check value.';
    }
    if(!agreementFormJson.firstParty.signatory || agreementFormJson.firstParty.signatory?.length < 3){
      keys['firstParty.signatory'] = 'Please check value.';
    }

    if(!agreementFormJson.secondParty.name || agreementFormJson.secondParty.name?.length < 3){
      keys['secondParty.name'] = 'Please check value.';
    }
    if(!validateEmail(agreementFormJson.secondParty?.email)){
      keys['secondParty.email'] = 'Please check value.';
    }
    if(!agreementFormJson.secondParty.address || agreementFormJson.secondParty.address?.length < 3){
      keys['secondParty.address'] = 'Please check value.';
    }
    if(!agreementFormJson.secondParty.representative || agreementFormJson.secondParty.representative?.length < 3){
      keys['secondParty.representative'] = 'Please check value.';
    }
    if(!agreementFormJson.secondParty.signatory || agreementFormJson.secondParty.signatory?.length < 3){
      keys['secondParty.signatory'] = 'Please check value.';
    }

    if((Object.keys(keys)).length !== 0){
      console.log({ keys });
      form.setErrors(keys);
      showNotification(({
        color: 'red',
        title: 'Agreement Form',
        message: 'Please check all fields are filled properly.',
      }));
    }
    return (Object.keys(keys)).length === 0;

  };

  const savePrev = async () => {
    if (validate()) {
      await save({...form.values, formCompleted: true });
      setUiConfigs({
        ...uiConfigs,
        currentStep: 0,
      });
    }
  };

  const saveNext = async () => {
    if (validate()) {
      await save({...form.values, formCompleted: true });
      setUiConfigs({
        ...uiConfigs,
        currentStep: 2,
      });
      // navigate(`/app/agreements/details/${id}`);
    }
  };

  return (
    <div className="w-full flex flex-col my-4">
      <div className="flex flex-row items-center">
        <DatePicker
            className="max-w-lg my-2 mr-8"
            label="Date of contract"
            placeholder="Select date"
            {...({
              ...form.getInputProps('dateOfContract'),
              onChange: (val) => {
                if (val && val.getTime) {
                  form.getInputProps('dateOfContract').onChange(
                      formatISO(val),
                  );
                } else {
                  form.getInputProps('dateOfContract').onChange(
                      null,
                  );
                }
              },
              value:
                  form.values['dateOfContract']
                      ? parseISO(form.values.dateOfContract) : null,
            })}
        />
        <TextInput
            type="number"
            className="max-w-lg"
            placeholder='Enter Days'
            label="Contract term (in days)"
            {...form.getInputProps('termOfContractInDays')}
        />
      </div>
       <div className="flex flex-col justify-between my-2">
        <div className="flex flex-col">
          <Text color="#46BDE1">First Party</Text>
        <div className="grid grid-cols-3 gap-4">
          <TextInput label="Name" placeholder="Enter Name" {...form.getInputProps('firstParty.name')} />
          <TextInput label="Email" placeholder="Enter Email" {...form.getInputProps('firstParty.email')} />
          <TextInput label="Representative" placeholder="Enter Representative" {...form.getInputProps('firstParty.representative')} />
          <TextInput label="Authorised Signatory" placeholder="Enter Signatory" {...form.getInputProps('firstParty.signatory')} />
          <Textarea label="Registered Address" placeholder="Enter Registered Address" {...form.getInputProps('firstParty.address')} />
        </div>
        </div>
        <div className="flex flex-col w-full my-4">
          <Text color="#46BDE1">Second Party</Text>
          <div className="grid grid-cols-3 gap-4">
          <TextInput label="Name" placeholder="Enter Name" {...form.getInputProps('secondParty.name')} />
          <TextInput label="Email" placeholder="Enter Email" {...form.getInputProps('secondParty.email')} />
          <TextInput label="Representative" placeholder="Enter Representative" {...form.getInputProps('secondParty.representative')} />
          <TextInput label="Authorised Signatory" placeholder="Enter Signatory" {...form.getInputProps('secondParty.signatory')} />
            <Textarea label="Registered Address" placeholder="Enter Registered Address" {...form.getInputProps('secondParty.address')} />
          </div>
        </div>
       </div>
        <div className="flex flex-row justify-between">
          {uiConfigs.loading === loadingStates.LOADING
            ? <BeatLoader color={colors.primary} size={10} />
            : (
              <>
                <Button className="max-w-xs mt-20" onClick={savePrev}>Previous</Button>
                <Button className="max-w-xs mt-20" onClick={saveNext}>Next</Button>
              </>
            )}
        </div>
    </div>
  );
};

export default AgreementForm2;
