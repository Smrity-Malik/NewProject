import React, { useEffect, useState } from 'react';
import flat from 'flat';
import { Stepper, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useLocation } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import CaseForm1 from './CaseForm1';
import CaseForm2 from './CaseForm2';
import CaseForm3 from './CaseForm3';
import CaseForm4 from './CaseForm4';
import { createCase, getCaseDetails, updateCase } from '../../utilities/apis/cases';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { loadingStates } from '../../utilities/utilities';
import colors from '../../utilities/design';

const CaseCreatePage = () => {
  const FORM_STEPS = {
    STEP_1: 0,
    STEP_2: 1,
    STEP_3: 2,
    STEP_4: 3,
  };
  const initialState = {
    complainant: [],
    respondent: [],
    'complainant lawyer': [],
    'respondent lawyer': [],
  };
  const { state } = useLocation();
  const [caseDetails, setCaseDetails] = useState({
    caseLoaded: false,
    caseId: state?.caseId,
  });

  const [uiConfigs, setUiConfigs] = useState({
    currentStep: FORM_STEPS.STEP_1,
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });
  const caseForm = useForm({ initialValues: flat(initialState) });

  const saveCase = async (values) => {
    const caseData = ({
      json: flat.unflatten(values || caseForm.values),
      flatted: values || (caseForm.values),
    });
    const toUse = caseDetails.caseId ? updateCase : createCase;
    const args = caseDetails.caseId ? ({ caseId: caseDetails.caseId, caseData }) : ({ caseData });
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(toUse(args));
    if (response?.success) {
      showNotification({
        color: 'green',
        title: 'Case Form',
        message: 'Details saved.',
      });
      if (response?.case?.id) {
        setCaseDetails({
          ...caseDetails,
          caseId: response.case.id,
          caseLoaded: true,
        });
      }
    } else {
      showNotification({
        color: 'red',
        title: 'Case Form',
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

  const fetchCaseData = async (caseId) => {
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getCaseDetails({ caseId }));
    if (response?.success && response?.case?.caseData?.json) {
      caseForm.setValues({ ...flat(response.case.caseData.json) });
      setCaseDetails({
        ...caseDetails,
        caseLoaded: true,
      });
    } else {
      showNotification(({
        color: 'red',
        title: 'Case',
        message: 'Something went wrong.',
      }));
    }
    setUiConfigs({
      ...uiConfigs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };

  useEffect(() => {
    if (caseDetails.caseId && !caseDetails.caseLoaded) {
      fetchCaseData(caseDetails.caseId);
    }
  }, [caseDetails.caseId, caseDetails.caseLoaded]);

  if (state?.caseId && !caseDetails.caseLoaded) {
    return (
      <Center>
        <BeatLoader size={10} color={colors.primary} />
      </Center>
    );
  }

  const allowStepSelect = !!caseForm.values.formCompleted;

  return (
    <Stepper
      active={uiConfigs.currentStep}
      onStepClick={(step) => {
        setUiConfigs({
          ...uiConfigs,
          currentStep: step,
        });
      }}
      breakpoint="sm"
    >
      <Stepper.Step allowStepSelect={allowStepSelect} label="Parties details">
        <CaseForm1
          caseId={caseDetails?.caseId}
          saveCase={saveCase}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          caseForm={caseForm}
        />
      </Stepper.Step>
      <Stepper.Step allowStepSelect={allowStepSelect} label="Court details">
        <CaseForm2
          caseId={caseDetails?.caseId}
          saveCase={saveCase}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          caseForm={caseForm}
        />
      </Stepper.Step>
      <Stepper.Step allowStepSelect={allowStepSelect} label="Documents">
        <CaseForm3
          caseId={caseDetails?.caseId}
          saveCase={saveCase}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          caseForm={caseForm}
        />
      </Stepper.Step>
      <Stepper.Step allowStepSelect={allowStepSelect} label="Working personnel">
        <CaseForm4
          caseId={caseDetails?.caseId}
          saveCase={saveCase}
          uiConfigs={uiConfigs}
          setUiConfigs={setUiConfigs}
          caseForm={caseForm}
        />
      </Stepper.Step>
    </Stepper>
  );
};

export default CaseCreatePage;
