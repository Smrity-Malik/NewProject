import React, { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { loadingStates } from '../utilities/utilities';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { getReadPresignedUrl } from '../utilities/apis/commonApis';
import colors from '../utilities/design';

const DocumentViewer = ({
  fileUrl,
  componentToRender,
  parentResource,
  parentResourceId,
}) => {
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    presignedReadUrl: null,
  });
  const getPresignedReadUrl = async () => {
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getReadPresignedUrl({
      parentResource,
      parentResourceId,
      fileUrl,
    }));
    if (response?.success && response?.presignedUrl) {
      setConfigs({
        ...configs,
        presignedReadUrl: response.presignedUrl,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
      window.open(response.presignedUrl, '_blank').focus();
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Failed',
        message: 'Failed to load file.',
      });
      setConfigs({
        ...configs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };
  return (
    <div onClick={(e) => {
      e.stopPropagation();
      if (!configs.presignedReadUrl) {
        getPresignedReadUrl();
      } else {
        window.open(configs.presignedReadUrl, '_blank').focus();
      }
    }}
    >
      {configs.loading === loadingStates.LOADING
        ? <BeatLoader color={colors.primary} size={10} />
        : componentToRender}
    </div>
  );
};

export default DocumentViewer;
