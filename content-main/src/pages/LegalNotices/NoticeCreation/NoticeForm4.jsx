/* eslint-disable max-len */
import {
  Button, Text,
} from '@mantine/core';
import React from 'react';
import { BeatLoader } from 'react-spinners';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { loadingStates } from '../../../utilities/utilities';
import colors from '../../../utilities/design';
import useMultiFileUpload from '../../../hooks/useMultiFileUpload';
import NewDocumentUploader from '../../../components/NewDocumentUploader/NewDocumentUploader';

const NoticeForm4 = ({
  noticeId, uiConfigs, setUiConfigs, saveNotice, noticeForm,
}) => {
  const multiUploadArgs = useMultiFileUpload({
    parentId: noticeId,
    parent: 'notice',
    loadFromParent: true,
  });

  const navigate = useNavigate();

  const saveNext = async () => {
    if (multiUploadArgs.finalFiles.length) {
      const newValues = { ...noticeForm.values, formCompleted: true };
      await saveNotice(newValues);
      navigate(`/app/dispute-manager/legal-notices/details/${noticeId}`);
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Form',
        message: 'Select atleast one file.',
      });
    }
  };

  const savePrev = async () => {
    if (multiUploadArgs.finalFiles.length) {
      setUiConfigs((stateC) => ({
        ...stateC,
        currentStep: 0,
      }));
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Form',
        message: 'Select atleast one file.',
      });
    }
  };

  return (
    <div className="flex flex-col py-4 px-4">

      <Text>Files</Text>
      <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
      <div className="flex flex-row justify-between">
        <div>
          {uiConfigs.loading === loadingStates.LOADING
            ? <BeatLoader color={colors.primary} size={10} />
            : <Button disabled={uiConfigs.loading === loadingStates.LOADING} className="max-w-xs mt-20" onClick={savePrev}>Previous</Button>}
        </div>
        <div>
          {uiConfigs.loading === loadingStates.LOADING
            ? <BeatLoader color={colors.primary} size={10} />
            : <Button disabled={uiConfigs.loading === loadingStates.LOADING} className="max-w-xs mt-20" onClick={saveNext}>Finish</Button>}
        </div>
      </div>
    </div>
  );
};

export default NoticeForm4;
