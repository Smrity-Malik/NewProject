import React, { useState } from 'react';
import {
  Button, Drawer, Select, Text, TextInput,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { showNotification } from '@mantine/notifications';
import { getValueForInput, loadingStates } from '../../utilities/utilities';
import colors from '../../utilities/design';
import { updateCase } from '../../utilities/apis/cases';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { caseStatusValues } from '../../utilities/enums';

const CaseAdditionalSettings = ({
  caseId, onClose, caseData, uiConfigs, setUiConfigs,
}) => {
  const { status, amount } = caseData.wholeData;
  const [additionalSettings, setAdditionalSettings] = useState({
    status,
    amount: amount || 0,
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });
  const onValueChange = (name) => (incoming) => {
    const value = getValueForInput(incoming);
    setAdditionalSettings((settings) => ({
      ...settings,
      [name]: value,
    }));
  };
  const saveCase = async () => {
    setAdditionalSettings((settings) => ({
      ...settings,
      loading: loadingStates.LOADING,
    }));
    const response = await apiWrapWithErrorWithData(updateCase({
      caseId,
      status: additionalSettings.status,
      amount: additionalSettings.amount,
    }));
    if (response?.success) {
      showNotification({
        title: 'Case',
        message: 'Case data saved.',
        color: 'green',
      });
      setUiConfigs({
        ...uiConfigs,
        additionalSettingsOpened: false,
      });
    } else {
      showNotification({
        title: 'Case',
        message: 'Case data couldn\'t be saved.',
        color: 'red',
      });
    }

    setAdditionalSettings({
      ...additionalSettings,
      additionalSettingsLoading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };
  const navigate = useNavigate();
  return (
    <Drawer
      opened={uiConfigs.additionalSettingsOpened}
      onClose={onClose}
      position="right"
      size="lg"
    >
      <div className="flex flex-col m-4">
        <div className="m-2 mr-4 mb-8 flex flex-row justify-end">
          <Text
            onClick={(e) => {
              e.stopPropagation();
              navigate('/app/dispute-manager/edit-case', {
                state: {
                  caseId,
                },
              });
            }}
            className="text-blue-600 cursor-pointer"
          >
            Edit basic data
          </Text>
        </div>
        <Select
          className="my-2"
          label="Status"
          data={caseStatusValues}
          value={additionalSettings.status}
          onChange={onValueChange('status')}
        />
        <TextInput
          className="my-2"
          label="Case Amount"
          value={additionalSettings.amount}
          type="number"
          onChange={onValueChange('amount')}
        />
        {additionalSettings.loading === loadingStates.LOADING
          ? <BeatLoader size={10} color={colors.primary} />
          : (
            <Button
              onClick={saveCase}
              className="w-24"
            >
              Save
            </Button>
          )}
      </div>
    </Drawer>
  );
};

export default CaseAdditionalSettings;
