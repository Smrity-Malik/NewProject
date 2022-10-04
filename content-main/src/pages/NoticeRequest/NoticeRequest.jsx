/* eslint-disable max-len */
import React, { useState } from 'react';
import {
  Modal, Textarea, TextInput, Text, Button,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { getValueForInput, loadingStates, validateEmail } from '../../utilities/utilities';
import NewDocumentUploader from '../../components/NewDocumentUploader/NewDocumentUploader';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { submitNoticeRequest } from '../../utilities/apis/notices';
import colors from '../../utilities/design';

const NoticeRequest = () => {
  const [configs, setConfigs] = useState({
    email: '',
    remarks: '',
    errors: {},
    loading: loadingStates.NO_ACTIVE_REQUEST,
  });

  const multiUploadArgs = useMultiFileUpload({});

  const navigate = useNavigate();

  const submitNoticeRequestHandler = async () => {
    const keys = {};
    setConfigs((stateC) => ({
      ...stateC,
      errors: {},
    }));
    if (!validateEmail(configs.email)) {
      keys.email = 'Please check value.';
    }
    if ((configs.remarks.length < 5) && (!multiUploadArgs.finalFiles.length)) {
      showNotification({
        title: 'Notice Request',
        message: 'Either remarks or files is mandatory',
        color: 'red',
      });
      keys.remarks = 'Please check value';
    }
    if (Object.keys(keys).length) {
      setConfigs((stateC) => ({
        ...stateC,
        errors: keys,
      }));
      return;
    }
    setConfigs((stateC) => ({
      ...stateC,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(submitNoticeRequest({
      files: multiUploadArgs.finalFiles,
      email: configs.email,
      remarks: configs.remarks,
    }));
    if (resp?.success && resp?.noticeRequest?.id) {
      showNotification({
        title: 'Notice Request',
        message: `Notice request has been submitted with id ${resp.noticeRequest.id}`,
        color: 'green',
      });
      navigate('/');
      setConfigs((stateC) => ({
        ...stateC,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    } else {
      showNotification({
        title: 'Notice Request',
        message: 'Couldn\'t submit notice request.',
        color: 'red',
      });
      setConfigs((stateC) => ({
        ...stateC,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };

  return (
    <div className="h-screen w-screen bg-white">
      <Modal
        overflow="inside"
        size="calc(100vw - 200px)"
        opened
        onClose={() => {

        }}
      >
        <div className="p-8 flex flex-col">
          <Text>Request new notice</Text>
          <span className="mt-6 mb-8 text-gray-400">
            Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit ultrices enim cursus. Leo sapien, pretium duis est eu volutpat interdum eu non. Odio eget nullam elit laoreet. Libero at felis nam at orci venenatis rutrum nunc. Etiam mattis ornare pellentesque iaculis enim.
          </span>
          <TextInput
            className="mb-8"
            error={configs.errors.email}
            label="Email"
            required
            placeholder="Type your email"
            value={configs.email}
            onChange={(input) => {
              const value = getValueForInput(input);
              setConfigs((stateC) => ({
                ...stateC,
                email: value,
              }));
            }}
          />
          <Textarea
            className="mb-8"
            label="Remarks"
            required
            placeholder="Enter description"
            value={configs.remarks}
            onChange={(input) => {
              const value = getValueForInput(input);
              setConfigs((stateC) => ({
                ...stateC,
                remarks: value,
              }));
            }}
          />
          <div className="flex flex-col mb-8">
            <Text>Files</Text>
            <NewDocumentUploader hideOpenButton multiUploadArgs={multiUploadArgs} />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={submitNoticeRequestHandler}
              disabled={configs.loading === loadingStates.LOADING}
            >
              {configs.loading === loadingStates.NO_ACTIVE_REQUEST ? <Text>Request Notice</Text>
                : <BeatLoader color={colors.primary} size={10} />}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NoticeRequest;
