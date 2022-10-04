/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import flat from 'flat';
import { Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useLocation } from 'react-router-dom';
import AgreementForm1 from './AgreementForm1';
import {
  createAgreement,
  getAgreementDetails,
  getAgreementTypesApi,
  updateAgreement,
} from '../../utilities/apis/agreements';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { loadingStates } from '../../utilities/utilities';
import AgreementForm2 from './AgreementForm2';
import AgreementForm3 from './AgreementForm3';
import colors, { themeColor } from '../../utilities/design';

const AgreementCreatePage = () => {
  const FORM_STEPS = {
    STEP_1: 0,
    STEP_2: 1,
    STEP_3: 2,
  };
  const initialState = {
    typeOfAgreementData: [],
    typeOfAgreement: null,
    requestingUser: {
      name: '',
      email: '',
      phone: '',
      designation: '',
      businessDepartment: '',
    },
    dateOfContract: null,
    termOfContractInDays: null,
    contractQuillJsDelta: {
      ops: [{ insert: 'Agreement content goes here...' }],
    },
    firstParty: {},
    secondParty: {},
    documents: [],
    formCompleted: false,
  };
  const { state } = useLocation();
  const [agreementDetails, setAgreementDetails] = useState({
    agreementLoaded: false,
    agreementId: state?.agreementId || null,
  });

  const [uiConfigs, setUiConfigs] = useState({
    currentStep: FORM_STEPS.STEP_1,
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });
  const agreementForm = useForm({ initialValues: flat(initialState) });

  const saveAgreement = async (values) => {
    const formValues = flat.unflatten(values || agreementForm.values);
    const agreementData = ({
      json: flat.unflatten(values || agreementForm.values),
      flatted: values || (agreementForm.values),
    });
    const toUse = agreementDetails.agreementId ? updateAgreement : createAgreement;

    const agreementArgs = {
      typeOfAgreement: formValues.typeOfAgreement,
      requestingUserDetails: formValues.requestingUser,
      dateOfContract: formValues.dateOfContract,
      contractTermInDays: formValues.termOfContractInDays ? parseInt(formValues.termOfContractInDays, 10) : null,
      contractQuillJsDelta: formValues.contractQuillJsDelta,
      firstParty: formValues.firstParty,
      secondParty: formValues.secondParty,
      formCompleted: !!formValues.formCompleted,
    };

    const args = agreementDetails.agreementId
      ? ({ agreementId: agreementDetails.agreementId, agreementData, ...agreementArgs })
      : ({ agreementData, ...agreementArgs });
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(toUse(args));
    if (response?.success) {
      showNotification({
        color: 'green',
        title: 'Agreement Form',
        message: 'Details saved.',
      });
      if (response?.agreement?.id) {
        setAgreementDetails({
          ...agreementDetails,
          agreementId: response.agreement.id,
          agreementLoaded: true,
        });
      }
    } else {
      showNotification({
        color: 'red',
        title: 'Agreement Form',
        message: 'Something went wrong.',
      });
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
      return false;
    }
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
    return true;
  };

  const fetchAgreementData = async (agreementId) => {
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });

    const convertResponseToFormValues = (responseAgreement) => ({
      typeOfAgreement: responseAgreement.typeOfAgreement,
      requestingUser: responseAgreement.requestingUserDetails,
      dateOfContract: responseAgreement.dateOfContract || null,
      termOfContractInDays: responseAgreement.contractTermInDays || null,
      contractQuillJsDelta: responseAgreement.contractQuillJsDelta || {
        ops: [{ insert: 'Agreement content goes here...' }],
      },
      firstParty: responseAgreement.firstParty || {},
      secondParty: responseAgreement.secondParty || {},
      formCompleted: !!responseAgreement.formCompleted,
    });

    const response = await apiWrapWithErrorWithData(getAgreementDetails({ agreementId }));
    if (response?.success && response.agreement) {
      agreementForm.setValues((prevValues) => (flat({ ...initialState, ...flat.unflatten(prevValues), ...convertResponseToFormValues(response.agreement) })));
      setAgreementDetails({
        ...agreementDetails,
        agreementLoaded: true,
      });
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Agreement',
        message: 'Something went wrong.',
      });
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };

  useEffect(() => {
    if (agreementDetails.agreementId && !agreementDetails.agreementLoaded) {
      fetchAgreementData(agreementDetails.agreementId);
    }
  }, [agreementDetails.agreementId, agreementDetails.agreementLoaded]);

  const getAgreementTypes = async () => {
    const resp = await apiWrapWithErrorWithData(getAgreementTypesApi());
    if (resp?.success && resp?.typesOfAgreement) {
      const uniqueValues = Array.from(new Set([
        ...resp.typesOfAgreement,
      ]));
      agreementForm.setFieldValue('typeOfAgreementData', uniqueValues);
    } else {
      showNotification({
        title: 'Agreement Types',
        message: 'Could not load agreement types',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    getAgreementTypes();
  }, []);

  const allowStepSelect = !!agreementForm.values.formCompleted;

  return (
    <Stepper
      color={themeColor(colors.agreement)}
      active={uiConfigs.currentStep}
      onStepClick={(step) => {
        setUiConfigs({
          ...uiConfigs,
          currentStep: step,
        });
      }}
      breakpoint="sm"
    >
      <Stepper.Step allowStepSelect={allowStepSelect} label="Requesting User">
        <AgreementForm1
          id={agreementDetails.agreementId}
          save={saveAgreement}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          form={agreementForm}
        />
      </Stepper.Step>
      <Stepper.Step allowStepSelect={allowStepSelect} label="Basic details">
        <AgreementForm2
          id={agreementDetails.agreementId}
          save={saveAgreement}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          form={agreementForm}
        />
      </Stepper.Step>
      <Stepper.Step allowStepSelect={allowStepSelect} label="Templates">
        <AgreementForm3
          id={agreementDetails.agreementId}
          save={saveAgreement}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          form={agreementForm}
        />
      </Stepper.Step>
    </Stepper>
  );
};

export default AgreementCreatePage;
