import React from 'react';
import {
  Button, Divider, Text, TextInput,
} from '@mantine/core';
import flat from 'flat';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import {
  existsAndLength, loadingStates, validateAddress, validateEmail, validateMobile,
} from '../../utilities/utilities';
import colors from '../../utilities/design';
import useMultiAddress from '../../hooks/useMultiAddress';
import CompleteAddress from '../../components/CompleteAddress';

const CaseForm4 = ({
  caseForm, setUiConfigs, uiConfigs, saveCase,
}) => {
  const caseFormUnflatted = flat.unflatten(caseForm.values);
  const validate = () => {
    const keys = {};

    const complainantLawyerResult = caseFormUnflatted['complainant lawyer'].map(
      validateAddress,
    );
    const respondentLawyerResult = caseFormUnflatted['respondent lawyer'].map(
      validateAddress,
    );
    complainantLawyerResult.forEach((validationResult, parentIndex) => {
      const { erroredKeys } = validationResult;
      erroredKeys.forEach((errorKey) => {
        keys[`complainant lawyer.${parentIndex}.${errorKey}`] = 'Please check this field.';
      });
    });
    respondentLawyerResult.forEach((validationResult, parentIndex) => {
      const { erroredKeys } = validationResult;
      erroredKeys.forEach((errorKey) => {
        keys[`respondent lawyer.${parentIndex}.${errorKey}`] = 'Please check this field.';
      });
    });

    if (!existsAndLength(caseForm.values['companyRepresentative.name'])) {
      keys['companyRepresentative.name'] = 'Please check value.';
    }

    if (!existsAndLength(caseForm.values['companyRepresentative.designation'])) {
      keys['companyRepresentative.designation'] = 'Please check value.';
    }

    if (!existsAndLength(caseForm.values['companyRepresentative.email'])
        || !validateEmail(caseForm.values['companyRepresentative.email'])) {
      keys['companyRepresentative.email'] = 'Please check value.';
    }

    if (!existsAndLength(caseForm.values['companyRepresentative.phone'])
        || !validateMobile(caseForm.values['companyRepresentative.phone'])) {
      keys['companyRepresentative.phone'] = 'Please check value.';
    }

    if (Object.keys(keys).length > 0) {
      caseForm.setErrors(keys);
      showNotification(({
        color: 'red',
        title: 'Case Form',
        message: 'Please check all fields are filled properly.',
      }));
      return false;
    }
    return true;
  };
  const navigate = useNavigate();
  const saveFinish = async () => {
    if (validate()) {
      const newValues = { ...caseForm.values, formCompleted: true };
      if (await saveCase(newValues)) {
        navigate('/app/dispute-manager/cases');
      }
    }
  };
  const savePrev = async () => {
    if (validate() && await saveCase()) {
      setUiConfigs({
        ...uiConfigs,
        currentStep: 2,
      });
    }
  };

  const runOnSaveCompl = (data) => {
    caseForm.setValues({
      ...caseForm.values,
      ...(flat({ 'complainant lawyer': data })),
    });
  };

  const runOnSaveResp = (data) => {
    caseForm.setValues({
      ...caseForm.values,
      ...(flat({ 'respondent lawyer': data })),
    });
  };

  const [multiData, add, setMode,
    onSave, onDelete, editOrAddAllowed,
    deleteAllowed, getMode] = useMultiAddress(caseFormUnflatted['complainant lawyer'], runOnSaveCompl);

  const [multiDataRes, addRes, setModeRes,
    onSaveRes, onDeleteRes, editOrAddAllowedRes,
    deleteAllowedRes, getModeRes] = useMultiAddress(caseFormUnflatted['respondent lawyer'], runOnSaveResp);

  return (
    <div className="w-full flex flex-col my-4">
      <Divider my="xs" label="Lawyer Information" labelPosition="center" />
      <Text>Lawyers Details</Text>
      <div className="flex flex-col w-full">

        <div className="border-solid border-2 border-gray-100 rounded-xl p-6 flex-col mx-2">
          <Text size="xl" className="my-2">Complainants Lawyer</Text>
          {multiData.map(
            (dataNode, index) => (
              <CompleteAddress
                withDivider={index !== (multiData.length - 1)}
                data={dataNode}
                onDelete={onDelete(index)}
                setMode={setMode(index)}
                onSave={onSave(index)}
                allowEdit={editOrAddAllowed}
                placeholderText={`Complainant ${index + 1}`}
                deleteAllowed={deleteAllowed}
                mode={getMode(index)()}
                skipValidation
              />
            ),
          )}
          {editOrAddAllowed
          && <Button variant="outline" className="w-60" onClick={add}>Add New Lawyer</Button>}
        </div>

        <div className="border-solid border-2 border-gray-100 rounded-xl p-6 flex-col mt-8 mx-2">
          <Text size="xl" className="my-2">Respondents Lawyer</Text>
          {multiDataRes.map(
            (dataNode, index) => (
              <CompleteAddress
                withDivider={index !== (multiDataRes.length - 1)}
                data={dataNode}
                onDelete={onDeleteRes(index)}
                setMode={setModeRes(index)}
                onSave={onSaveRes(index)}
                allowEdit={editOrAddAllowedRes}
                placeholderText={`Respondent ${index + 1}`}
                deleteAllowed={deleteAllowedRes}
                mode={getModeRes(index)()}
                skipValidation
              />
            ),
          )}
          {editOrAddAllowedRes
          && <Button variant="outline" className="w-60" onClick={addRes}>Add New Lawyer</Button>}
        </div>

      </div>
      <Divider my="xs" label="Company Representative" labelPosition="center" />
      <Text>Company Representative Details</Text>
      <div className="flex flex-row my-2 justify-between w-1/2">
        <TextInput
          className="max-w-lg"
          label="Name"
          placeholder="Enter Name"
          {...caseForm.getInputProps('companyRepresentative.name')}
        />
        <TextInput
          className="max-w-lg"
          label="Phone"
          placeholder="Enter 10 digit phone no."
          {...caseForm.getInputProps('companyRepresentative.phone')}
        />
      </div>
      <div className="flex flex-row my-2 justify-between w-1/2">
        <TextInput
          className="max-w-lg"
          label="Email"
          placeholder="Enter Email"
          {...caseForm.getInputProps('companyRepresentative.email')}
        />
        <TextInput
          className="max-w-lg"
          label="Designation"
          placeholder="Enter Designation"
          {...caseForm.getInputProps('companyRepresentative.designation')}
        />
      </div>
      {editOrAddAllowedRes && editOrAddAllowed
      && (
      <div className="flex flex-row justify-between">
        {uiConfigs.loading === loadingStates.LOADING
          ? <BeatLoader color={colors.primary} size={10} />
          : (
            <>
              <Button className="max-w-xs mt-20" onClick={savePrev}>Previous</Button>
              <Button className="max-w-xs mt-20" onClick={saveFinish}>Finish</Button>
            </>
          )}
      </div>
      ) }
    </div>
  );
};

export default CaseForm4;
