import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Anchor, Badge, Breadcrumbs, Button, Divider, Text, Textarea,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { cleanFileObj, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { fetchNoticeRequest, updateNoticeRequest } from '../../utilities/apis/notices';
import colors from '../../utilities/design';

const RequestNoticeView = () => {
  const params = useParams();
  const { noticeRequestRef } = params;
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    noticeRequestData: null,
  });
  const navigate = useNavigate();
  const fetchNoticeRequestData = async () => {
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(
      fetchNoticeRequest(
        { noticeRequestRef },
      ),
    );
    setConfigs({
      ...configs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
    if (response?.success && response?.noticeRequestData) {
      setConfigs({
        ...configs,
        noticeRequestData: response.noticeRequestData,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Request',
        message: 'Failed to load notice request.',
      });
    }
  };
  useEffect(() => {
    fetchNoticeRequestData();
    return () => {};
  }, []);
  const items = [
    { title: 'Legal Notices', link: '/app/dispute-manager/legal-notices' },
    { title: `Notice Request - ${noticeRequestRef}`, link: `/app/view/notice-request/${noticeRequestRef}` },
  ].map((item) => (
    <Link key={item.title} to={item.link}>
      {item.title}
    </Link>
  ));

  const reject = async () => {
    if (!configs.noticeRequestData.adminRemarks.length) {
      showNotification({
        color: 'red',
        title: 'Notice Request',
        message: 'Please add expert remarks before rejecting.',
      });
      return;
    }
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(updateNoticeRequest({
      noticeRequestRef,
      data: {
        status: 'REJECTED',
        adminRemarks: configs.noticeRequestData.adminRemarks,
      },
    }));
    if (response?.success) {
      fetchNoticeRequestData();
    } else {
      showNotification({
        color: 'red',
        title: 'Failure',
        message: 'Failed to update notice request.',
      });
      setConfigs({
        ...configs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };

  const createNotice = async () => {
    navigate('/app/dispute-manager/legal-notices', {
      state: {
        target: 'notice-form',
        requestReference: noticeRequestRef,
      },
    });
  };

  return (
    <div className="w-full mb-4">
      <div className="flex flex-col w-1/2">
        <Breadcrumbs>{items}</Breadcrumbs>
        {configs.noticeRequestData && (
        <>
          <div className="flex flex-col">
            <Divider className="my-4" label="Current Data" labelPosition="center" />
            <Badge size="lg" className="w-40 my-4">{(configs.noticeRequestData.status || '-').toUpperCase()}</Badge>
            <Text weight="bold" size="md">Files: </Text>
            <div className="flex flex-col ml-4">
              {configs.noticeRequestData?.files?.length > 0 && configs.noticeRequestData.files.map(
                (file) => (
                  <div className="flex flex-col items-start w-full justify-between my-2">
                    <Text size="sm">{cleanFileObj(file).fileName}</Text>
                    <Anchor target="_blank" href={file}>View / Download</Anchor>
                  </div>
                ),
              )}
              {configs.noticeRequestData?.files?.length === 0
              && <Text>No files to show.</Text>}
            </div>

            <Text className="mt-4" weight="bold" size="md">Remarks: </Text>
            <div className="flex flex-col ml-4">
              <Textarea autosize maxRows={10} readOnly value={configs.noticeRequestData.remarks} />
            </div>

            <Text className="mt-4" weight="bold" size="md">Expert Remarks: </Text>
            <div className="flex flex-col ml-4">
              <Textarea
                onChange={(e) => {
                  setConfigs({
                    ...configs,
                    noticeRequestData: {
                      ...configs.noticeRequestData,
                      adminRemarks: e.target.value,
                    },
                  });
                }}
                autosize
                maxRows={10}
                placeholder="You can add remarks while rejecting"
                readOnly={configs.noticeRequestData.status !== 'PENDING'}
                value={configs.noticeRequestData.adminRemarks}
              />
            </div>

            {configs.loading !== loadingStates.LOADING
            && (
            <div className="my-4 flex flex-row">
              <Button
                onClick={createNotice}
                disabled={configs.noticeRequestData.status !== 'PENDING'}
                className="mx-4"
              >
                Create Notice
              </Button>
              <Button
                onClick={reject}
                color="red"
                disabled={configs.noticeRequestData.status !== 'PENDING'}
                className="mx-4"
              >
                Reject
              </Button>
            </div>
            )}

          </div>
        </>
        )}
        {configs.loading === loadingStates.LOADING
            && <BeatLoader size={10} color={colors.primary} />}
      </div>
    </div>
  );
};

export default RequestNoticeView;
