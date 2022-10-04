/* eslint-disable max-len */
import flat from 'flat';
import {
  Button, SegmentedControl, Select, Text,
} from '@mantine/core';
import React from 'react';
import { BeatLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { getValueForInput, loadingStates } from '../../../utilities/utilities';
import colors from '../../../utilities/design';
import { putSettingsInFirebaseDb } from '../../../utilities/apis/settings';
import { selectWorkspaceSettings } from '../../../redux/selectors';

const NoticeForm2 = ({
  noticeForm, uiConfigs, setUiConfigs, saveNotice,
}) => {
  const noticeFormUnflatted = flat.unflatten(noticeForm.values);

  const saveNext = async () => {
    await saveNotice();
    setUiConfigs((stateC) => ({
      ...stateC,
      currentStep: 2,
    }));
  };

  const savePrev = async () => {
    await saveNotice();
    setUiConfigs((stateC) => ({
      ...stateC,
      currentStep: 0,
    }));
  };

  const workSpaceSettings = useSelector(selectWorkspaceSettings);

  return (
    <div className="flex flex-col py-4 px-4">

      <div className="flex justify-between items-center">
        <div className="flex flex-col mr-4 mb-4">
          <Text>Purpose</Text>
          <Text size="xs">
            Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit ultrices enimcursus. Leo sapien.
          </Text>
        </div>
        <SegmentedControl
          color="blue"
          data={['Money Recovery', 'Others']}
          value={noticeFormUnflatted.noticePurpose}
          onChange={(input) => {
            const val = getValueForInput(input);
            noticeForm.setFieldValue('noticePurpose', val);
          }}
        />
      </div>

      {noticeForm.values.noticePurpose === 'Money Recovery' && (
      <Select
        label="Select Subtype"
        data={workSpaceSettings.noticeFormPurposeMoneyRecoveryAdditionalOptions || []}
        placeholder="Type or select"
        nothingFound="Nothing found"
        searchable
        creatable
        value={noticeFormUnflatted.noticeSubPurpose}
        getCreateLabel={(query) => `+ ${query}`}
        onCreate={(query) => {
          const newSettings = {
            ...workSpaceSettings,
            noticeFormPurposeMoneyRecoveryAdditionalOptions: [...(workSpaceSettings.noticeFormPurposeMoneyRecoveryAdditionalOptions || []), {
              label: query,
              value: query,
            }],
          };
          putSettingsInFirebaseDb({ settingsData: newSettings });

          // const newSettings = {
          //   ...workspaceSettings,
          //   caseTypes: [...(caseTypes || []), {
          //     label: query,
          //     value: query,
          //   }],
          // };
          // putSettingsInFirebaseDb({ settingsData: newSettings });
        }}
        {...noticeForm.getInputProps('noticeSubPurpose')}
      />
      )}

      {noticeForm.values.noticePurpose === 'Others' && (
      <Select
        label="Select Subtype"
        data={workSpaceSettings.noticeFormPurposeOthersAdditionalOptions || []}
        placeholder="Type or select"
        nothingFound="Nothing found"
        searchable
        creatable
        value={noticeFormUnflatted.noticeSubPurpose}
        getCreateLabel={(query) => `+ ${query}`}
        onCreate={(query) => {
          const newSettings = {
            ...workSpaceSettings,
            noticeFormPurposeOthersAdditionalOptions: [...(workSpaceSettings.noticeFormPurposeOthersAdditionalOptions || []), {
              label: query,
              value: query,
            }],
          };
          putSettingsInFirebaseDb({ settingsData: newSettings });

          // const newSettings = {
          //   ...workspaceSettings,
          //   caseTypes: [...(caseTypes || []), {
          //     label: query,
          //     value: query,
          //   }],
          // };
          // putSettingsInFirebaseDb({ settingsData: newSettings });
        }}
        {...noticeForm.getInputProps('noticeSubPurpose')}
      />
      )}

      <div className="flex flex-row justify-between">
        <div>
          {uiConfigs.loading === loadingStates.LOADING
            ? <BeatLoader color={colors.primary} size={10} />
            : <Button disabled={uiConfigs.loading === loadingStates.LOADING} className="max-w-xs mt-20" onClick={savePrev}>Previous</Button>}
        </div>
        <div>
          {uiConfigs.loading === loadingStates.LOADING
            ? <BeatLoader color={colors.primary} size={10} />
            : <Button disabled={uiConfigs.loading === loadingStates.LOADING} className="max-w-xs mt-20" onClick={saveNext}>Next</Button>}
        </div>
      </div>
    </div>
  );
};

export default NoticeForm2;
