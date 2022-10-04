import React, { useEffect, useState } from 'react';
import {
  Badge, Modal, Text, Center, Textarea, Button,
} from '@mantine/core';
import { BeatLoader } from 'react-spinners';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { getValueForInput, loadingStates } from '../../utilities/utilities';
import { noticeStatusColors } from '../../utilities/enums';
import colors from '../../utilities/design';
import NewDocumentUploader from '../../components/NewDocumentUploader/NewDocumentUploader';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { fetchNoticeRequest, updateNoticeRequest } from '../../utilities/apis/notices';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';

const NoticeRequestView = ({ noticeRequestId, onClose }) => {
  const [config, setConfig] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    noticeRequest: null,
    expertRemarks: '',
    errors: {},
  });

  const multiUploadArgs = useMultiFileUpload({});

  const loadNoticeRequest = async () => {
    setConfig((stateC) => ({
      ...stateC,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(fetchNoticeRequest({
      noticeRequestRef: noticeRequestId,
    }));
    if (resp?.success && resp?.noticeRequest) {
      setConfig((stateC) => ({
        ...stateC,
        noticeRequest: resp.noticeRequest,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      if (resp.noticeRequest.attachedFiles?.length) {
        multiUploadArgs.addUploadedFiles(resp.noticeRequest.attachedFiles);
      }
    } else {
      showNotification({
        title: 'Notice Request',
        message: 'Failed to load notice request',
        color: 'red',
      });
      setConfig((stateC) => ({
        ...stateC,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };
  useEffect(() => {
    loadNoticeRequest();
  }, []);

  const rejectHandler = async () => {
    if (config.expertRemarks.length < 5) {
      setConfig((stateC) => ({
        ...stateC,
        errors: {
          expertRemarks: 'Please check value',
        },
      }));
      return;
    }
    setConfig((stateC) => ({
      ...stateC,
      errors: {},
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(updateNoticeRequest({
      noticeRequestRef: noticeRequestId,
      data: {
        status: 'REJECTED',
        remarks: config.expertRemarks,
      },
    }));
    if (resp?.success) {
      loadNoticeRequest();
    } else {
      setConfig((stateC) => ({
        ...stateC,
        errors: {},
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        color: 'red',
        title: 'Notice Request',
        message: 'Failed to update notice request',
      });
    }
  };

  const navigate = useNavigate();

  if (config.loading === loadingStates.LOADING || !config.noticeRequest) {
    return (
      <Modal
        size="calc(100vw - 200px)"
        opened
        onClose={onClose}
      >
        <div
          className="flex flex-col my-4"
          style={{
            minHeight: '300px',
          }}
        >
          <Center>
            <BeatLoader color={colors.primary} size={10} />
          </Center>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      size="calc(100vw - 200px)"
      opened
      onClose={onClose}
    >
      <div className="flex flex-col my-4">
        <div className="flex justify-between mb-6">
          <Text>
            Notice Request -
            {noticeRequestId}
          </Text>
          <Badge color={noticeStatusColors[config.noticeRequest.status] || 'orange'}>
            {config.noticeRequest.status}
          </Badge>
        </div>
        <Text color="gray">Remarks</Text>
        <Text className="mb-6">{config.noticeRequest.remarks}</Text>
        <Text color="gray">Files</Text>
        <NewDocumentUploader multiUploadArgs={multiUploadArgs} hideDeleteButton hideDropZone />
        {(config.noticeRequest.status.toLowerCase() !== 'approved'
            && config.noticeRequest.status.toLowerCase() !== 'rejected')
          ? (
            <div className="flex flex-col my-8">
              <Textarea
                error={config.errors.expertRemarks}
                label="Expert remarks"
                value={config.expertRemarks}
                onChange={(input) => {
                  const val = getValueForInput(input);
                  setConfig((stateC) => ({
                    ...stateC,
                    expertRemarks: val,
                  }));
                }}
                placeholder="Enter reason for rejection"
              />
              <div className="flex justify-end my-4">
                <Button
                  onClick={() => {
                    navigate('/app/dispute-manager/legal-notices/create', {
                      requestNoticeId: noticeRequestId,
                    });
                  }}
                  className="mx-4"
                  color="green"
                >
                  Approve
                </Button>
                <Button onClick={rejectHandler} color="red">Reject</Button>
              </div>
            </div>
          )
          : (
            <div className="flex flex-col my-8">
              <Text color="gray">Expert Remarks</Text>
              <Text>{config.noticeRequest.expertRemarks}</Text>
            </div>
          )}
      </div>
    </Modal>
  );
};

export default NoticeRequestView;
