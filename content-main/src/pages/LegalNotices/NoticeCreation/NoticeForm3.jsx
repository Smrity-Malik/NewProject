/* eslint-disable max-len */
import flat from 'flat';
import {
  Button, Select, Text,
} from '@mantine/core';
import React from 'react';
import { BeatLoader } from 'react-spinners';
import { getValueForInput, loadingStates } from '../../../utilities/utilities';
import colors from '../../../utilities/design';

const NoticeForm3 = ({
  noticeForm, uiConfigs, setUiConfigs, saveNotice,
}) => {
  const noticeFormUnflatted = flat.unflatten(noticeForm.values);

  const saveNext = async () => {
    await saveNotice();
    setUiConfigs((stateC) => ({
      ...stateC,
      currentStep: 3,
    }));
  };

  const savePrev = async () => {
    await saveNotice();
    setUiConfigs((stateC) => ({
      ...stateC,
      currentStep: 1,
    }));
  };

  return (
    <div className="flex flex-col py-4 px-4">

      <Text>Notice Period</Text>
      <Text size="xs">
        Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit ultrices enimcursus. Leo sapien.
      </Text>

      <Select
        className="mt-20"
        label="Notice Period Tenure"
        data={[{
          label: '7 days',
          value: 7,
        }, {
          label: '15 days',
          value: 15,
        }, {
          label: '21 days',
          value: 21,
        }]}
        value={noticeFormUnflatted.noticePeriodDays}
        onChange={(input) => {
          const val = getValueForInput(input);
          noticeForm.setFieldValue('noticePeriodDays', val);
        }}
      />

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

export default NoticeForm3;
