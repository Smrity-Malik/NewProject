import React from 'react';
import {
  Button,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { loadingStates } from '../../utilities/utilities';
import colors from '../../utilities/design';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import NewDocumentUploader from '../../components/NewDocumentUploader/NewDocumentUploader';

const CaseForm3 = ({
  setUiConfigs, uiConfigs, caseId,
}) => {
  const multiUploadArgs = useMultiFileUpload({ loadFromParent: true, parentId: caseId, parent: 'case' });

  const validate = () => {
    const uploadedFiles = multiUploadArgs.finalFiles.filter(
      (file) => (file.attached),
    );
    if (!uploadedFiles.length) {
      showNotification(({
        color: 'red',
        title: 'Case Form',
        message: 'Minimum one file is required.',
      }));
      return false;
    }
    return true;
  };

  const saveNext = async () => {
    if (validate()) {
      setUiConfigs({
        ...uiConfigs,
        currentStep: 3,
      });
    }
  };
  const savePrev = async () => {
    if (validate()) {
      setUiConfigs({
        ...uiConfigs,
        currentStep: 1,
      });
    }
  };
  return (
    <div className="w-full flex flex-col my-4">
      <div className="flex flex-col">
        <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
        <div className="flex justify-between">
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
    </div>
  );
};

export default CaseForm3;
