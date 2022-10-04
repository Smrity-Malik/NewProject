import React, { useState } from 'react';
import { Stepper } from '@mantine/core';
import { loadingStates } from '../utilities/utilities';
import NewCaseForm1 from '../components/NewCaseFormComponents/NewCaseForm1';
import NewCaseForm2 from '../components/NewCaseFormComponents/NewCaseForm2';
import NewCaseForm3 from '../components/NewCaseFormComponents/NewCaseForm3';
import NewCaseForm4 from '../components/NewCaseFormComponents/NewCaseForm4';

const NewCaseFormNew = () => {
  const FORM_STEPS = {
    STEP_1: 0,
    STEP_2: 1,
    STEP_3: 2,
    STEP_4: 3,
  };
  const [uiConfigs, setUiConfigs] = useState({
    currentStep: FORM_STEPS.STEP_1,
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });

  return (
    <Stepper
      className="mt-11"
      size="xs"
      active={uiConfigs.currentStep}
      onStepClick={(step) => {
        setUiConfigs({
          ...uiConfigs,
          currentStep: step,
        });
      }}
      breakpoint="sm"
    >

      <Stepper.Step allowStepSelect label="First step" description="Case parties details">
        <NewCaseForm1 />
      </Stepper.Step>
      <Stepper.Step allowStepSelect label="Second step" description="Court details">
        <NewCaseForm2 />
      </Stepper.Step>
      <Stepper.Step allowStepSelect label="Third step" description="Documents">
        <NewCaseForm3 />
      </Stepper.Step>
      <Stepper.Step allowStepSelect label="Final step" description="Working personnel">
        <NewCaseForm4 />
      </Stepper.Step>
    </Stepper>
  );
};

export default NewCaseFormNew;
