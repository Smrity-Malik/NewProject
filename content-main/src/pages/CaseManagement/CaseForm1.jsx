import React from 'react';
import {
  Button, Divider,
  Select,
  TextInput,
  Text,
} from '@mantine/core';
import flat from 'flat';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { loadingStates, validateAddress } from '../../utilities/utilities';
import colors from '../../utilities/design';
// import { pullIntoStoreFromServer } from '../../utilities/workspaceSettings';
import { selectWorkspaceSettings } from '../../redux/selectors';
import { putSettingsInFirebaseDb } from '../../utilities/apis/settings';
import CompleteAddress from '../../components/CompleteAddress';
import useMultiAddress from '../../hooks/useMultiAddress';

const CaseForm1 = ({
  caseForm, setUiConfigs, uiConfigs, saveCase,
}) => {
  const caseFormUnflatted = flat.unflatten(caseForm.values);

  const saveNext = async () => {
    const keys = {};
    if (!(caseFormUnflatted.caseNumber?.type?.length >= 2)) {
      keys['caseNumber.type'] = 'Please check value.';
    }
    if (!(caseFormUnflatted.caseNumber?.number > 0)) {
      keys['caseNumber.number'] = 'Please check value.';
    }
    if (!(caseFormUnflatted.caseNumber?.year >= 1947)) {
      keys['caseNumber.year'] = 'Please check value.';
    }
    const complainantValidationResult = caseFormUnflatted.complainant.map(
      validateAddress,
    );
    const respondentValidationResult = caseFormUnflatted.respondent.map(
      validateAddress,
    );
    complainantValidationResult.forEach((validationResult, parentIndex) => {
      const { erroredKeys } = validationResult;
      erroredKeys.forEach((errorKey) => {
        keys[`complainant.${parentIndex}.${errorKey}`] = 'Please check this field.';
      });
    });
    respondentValidationResult.forEach((validationResult, parentIndex) => {
      const { erroredKeys } = validationResult;
      erroredKeys.forEach((errorKey) => {
        keys[`respondent.${parentIndex}.${errorKey}`] = 'Please check this field.';
      });
    });
    if (Object.keys(keys).length > 0) {
      caseForm.setErrors(keys);
      showNotification(({
        color: 'red',
        title: 'Case Form',
        message: 'Please check all fields are filled properly.',
      }));
      return;
    }
    await saveCase();
    setUiConfigs({
      ...uiConfigs,
      currentStep: 1,
    });
  };

  const workspaceSettings = useSelector(selectWorkspaceSettings);

  const runOnSaveCompl = (data) => {
    caseForm.setValues({
      ...caseForm.values,
      ...(flat({ complainant: data })),
    });
  };

  const runOnSaveResp = (data) => {
    caseForm.setValues({
      ...caseForm.values,
      ...(flat({ respondent: data })),
    });
  };
  const [multiData, add, setMode,
    onSave, onDelete, editOrAddAllowed,
    deleteAllowed, getMode] = useMultiAddress(caseFormUnflatted.complainant, runOnSaveCompl);

  const [multiDataRes, addRes, setModeRes,
    onSaveRes, onDeleteRes, editOrAddAllowedRes,
    deleteAllowedRes, getModeRes] = useMultiAddress(caseFormUnflatted.respondent, runOnSaveResp);

  const { caseTypes } = workspaceSettings;

  return (
    <div className="w-full flex flex-col my-4">

      <div className="flex flex-row">
        <Select
          className="mx-2 inputCustom"
          label="Case Type"
          data={caseTypes || []}
          placeholder="Type or select"
          nothingFound="Nothing found"
          searchable
          creatable
          value={caseForm.values['caseNumber.type']}
          getCreateLabel={(query) => `+ ${query}`}
          onCreate={(query) => {
            const newSettings = {
              ...workspaceSettings,
              caseTypes: [...(caseTypes || []), {
                label: query,
                value: query,
              }],
            };
            putSettingsInFirebaseDb({ settingsData: newSettings });
          }}
          {...caseForm.getInputProps('caseNumber.type')}
        />

        <TextInput
          className="max-w-sm mx-2 inputCustom"
          label="Case Number"
          placeholder="Type case number"
          {...caseForm.getInputProps('caseNumber.number')}
        />

        <TextInput
          className="max-w-sm mx-2 inputCustom"
          type="number"
          label="Case Year"
          placeholder="Type case year"
          {...caseForm.getInputProps('caseNumber.year')}
        />
      </div>
      <Divider className="my-11" />
      <div className="border-solid border-2 border-gray-100 rounded-xl p-6 flex-col mx-2">
        <Text size="xl" className="my-2">Complainants</Text>
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
            />
          ),
        )}
        {editOrAddAllowed
      && <Button variant="outline" className="w-60" onClick={add}>Add New Complainant</Button>}
      </div>

      <div className="border-solid border-2 border-gray-100 rounded-xl p-6 flex-col mt-8 mx-2">
        <Text size="xl" className="my-2">Respondents</Text>
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
            />
          ),
        )}
        {editOrAddAllowedRes
        && <Button variant="outline" className="w-60" onClick={addRes}>Add New Respondent</Button>}
      </div>

      <div className="flex flex-row justify-between">
        <div />
        {(editOrAddAllowed && editOrAddAllowedRes)
        && (
        <div>
          {uiConfigs.loading === loadingStates.LOADING
            ? <BeatLoader color={colors.primary} size={10} />
            : <Button className="max-w-xs mt-20" onClick={saveNext}>Next</Button>}
        </div>
        )}
      </div>
    </div>
  );
};

export default CaseForm1;
