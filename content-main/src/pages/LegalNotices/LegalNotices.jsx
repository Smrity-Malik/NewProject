/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Button, Divider, Pagination, Select, Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
// import { BeatLoader } from 'react-spinners';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInputState } from '@mantine/hooks';
import { Refresh } from 'tabler-icons-react';
import NoticeForm from './NoticeForm';
import RequestListing from './RequestListing';
import RequestNoticeForm from './RequestNoticeForm';
import { loadingStates, noticeRequestStatuses } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { listNoticeRequests } from '../../utilities/apis/notices';
import NoticesListing from './NoticesListing';
import StatsCard from '../../components/StatsCard';
// import colors from '../../utilities/design';

const LegalNotices = () => {
  const [loadingNoticeRequestsFetch, setLoadingNoticeRequestsFetch] = useState(loadingStates.NO_ACTIVE_REQUEST);
  const initialState = {
    requestNoticeFormShow: false,
    noticeFormConfigs: {
      showForm: false,
      requestReference: null,
      noticeReference: null,
      loadPreBuiltNotice: false,
    },
  };
  const { state } = useLocation();
  const [noticeRequestListingPage, setNoticeRequestListingPage] = useState(1);
  const navigate = useNavigate();
  const [configs, setConfigs] = useState({
    ...initialState,
  });
  // const sampleNoticeRequests = [{
  //   reference: 'RQ/12',
  //   requestedBy: 'Patanjali Kumar',
  //   requestDate: '2022-03-05T01:23:45.678+05:30',
  //   status: 'APPROVED',
  // }, {
  //   reference: 'RQ/34',
  //   requestedBy: 'Saurabh Bhardwaj',
  //   requestDate: '2022-04-01T01:23:45.678+05:30',
  //   status: 'PENDING',
  // }, {
  //   reference: 'RQ/87',
  //   requestedBy: 'Nagendra',
  //   requestDate: '2022-02-12T01:23:45.678+05:30',
  //   status: 'REJECTED',
  // }, {
  //   reference: 'RQ/45',
  //   requestedBy: 'Patanjali Kumar',
  //   requestDate: '2022-01-23T01:23:45.678+05:30',
  //   status: 'APPROVED',
  // }
  // ];
  const [noticeRequests, setNoticeRequests] = useState([]);
  const [noticeRequestStatusFilter, setNoticeRequestStatusFilter] = useInputState(noticeRequestStatuses.ALL);
  const fetchNoticeRequests = async ({
    page, status,
  }) => {
    setLoadingNoticeRequestsFetch(loadingStates.LOADING);
    const response = await apiWrapWithErrorWithData(listNoticeRequests({ status, page }));
    if (response?.success && response?.noticeRequests) {
      setNoticeRequests(response.noticeRequests);
      setLoadingNoticeRequestsFetch(loadingStates.NO_ACTIVE_REQUEST);
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Requests',
        message: 'Failed to load notice requests',
      });
      setLoadingNoticeRequestsFetch(loadingStates.NO_ACTIVE_REQUEST);
    }
  };
  useEffect(() => {
    fetchNoticeRequests({ page: noticeRequestListingPage, status: noticeRequestStatusFilter });
  }, [noticeRequestListingPage, noticeRequestStatusFilter]);

  const toggleValueHandler = (name) => () => {
    setConfigs({
      ...configs,
      [name]: !configs[name],
    });
  };

  useEffect(() => {
    if (state?.target === 'notice-form' && state?.requestReference) {
      setConfigs({
        ...configs,
        requestNoticeFormShow: false,
        noticeFormConfigs: {
          ...configs.noticeFormConfigs,
          showForm: true,
          requestReference: state.requestReference,
        },
      });
      // history.replace({ ...history.location });
    }
  }, []);

  // const numOfFileSuccessUploaded = (configs.files.filter(
  //   (file) => file.uploadedComplete,
  // )).length;
  return (
    <>
      <div className="w-full mb-4">
        <div className="flex flex-row">
          <StatsCard
            cardText="Notice Requests"
            textNumber={100}
            bulletPoints={[
              {
                bulletText: '75 Pending',
                bulletColor: '#d9b342',
              },
              {
                bulletText: '5 Approved',
                bulletColor: '#39ea11',
              },
              {
                bulletText: '20 Rejected',
                bulletColor: '#a70e37',
              },
            ]}
          />
          <StatsCard
            cardText="Notices"
            textNumber={120}
            bulletPoints={[
              {
                bulletText: '60 Draft',
                bulletColor: '#B327F5',
              },
              {
                bulletText: '60 Sent',
                bulletColor: '#ED9013',
              },
            ]}
          />
        </div>
        <div className="flex flex-col">
          <Button
            className="my-2 w-60"
            onClick={() => {
              setConfigs({
                ...configs,
                requestNoticeFormShow: true,
              });
            }}
          >
            Request New Notice
          </Button>
          <Text size="xs">Requires either concerned documents or a message.</Text>
        </div>
      </div>

      <Divider my="xs" label="Requested Notices" labelPosition="center" />
      <div className="w-full ml-2 flex flex-row justify-between items-center">
        <div className="flex flex-row">
          <Text className="text-xl mr-4">Notice Requests</Text>
          {loadingNoticeRequestsFetch !== loadingStates.LOADING && (
          <ActionIcon
            onClick={fetchNoticeRequests}
            color="white"
            variant="hover"
          >
            <Refresh />
          </ActionIcon>
          )}
        </div>
        <Select
          value={noticeRequestStatusFilter}
          onChange={setNoticeRequestStatusFilter}
          data={[
            { label: 'ALL', value: noticeRequestStatuses.ALL },
            { label: 'APPROVED', value: noticeRequestStatuses.APPROVED },
            { label: 'PENDING', value: noticeRequestStatuses.PENDING },
            { label: 'REJECTED', value: noticeRequestStatuses.REJECTED },
          ]}
          label="Status"
        />
      </div>
      {loadingNoticeRequestsFetch === loadingStates.LOADING
          && <RequestListing showSkeleton skeletonLength={(noticeRequests?.length || 10)} />}
      {noticeRequests
          && loadingNoticeRequestsFetch !== loadingStates.LOADING
          && !!noticeRequests.length && (
          <div className="flex flex-col">
            <RequestListing
              onActionClick={(noticeRequest) => {
                navigate(`/app/view/notice-request/${noticeRequest.reference}`);
                // setConfigs({
                //   ...configs,
                //   noticeFormConfigs: {
                //     showForm: true,
                //     requestReference: noticeRequest.reference,
                //     loadPreBuiltNotice: false,
                //     noticeReference: null,
                //   },
                // });
              }}
              data={noticeRequests}
            />
          </div>
      )}
      {loadingNoticeRequestsFetch !== loadingStates.LOADING && noticeRequests.length === 0
      && <Text>No requests to show</Text>}
      {loadingNoticeRequestsFetch !== loadingStates.LOADING
          && (
          <div className="flex flex-row justify-center">
            <Pagination page={noticeRequestListingPage} onChange={setNoticeRequestListingPage} total={10} />
          </div>
          )}

      <Divider my="xs" label="Approved Notices" labelPosition="center" />
      <NoticesListing configs={configs} setConfigs={setConfigs} />

      {configs.requestNoticeFormShow && <RequestNoticeForm onClose={toggleValueHandler('requestNoticeFormShow')} />}

      {configs.noticeFormConfigs.showForm
          && (
          <NoticeForm
            onClose={() => {
              setConfigs({
                ...configs,
                noticeFormConfigs: {
                  ...configs.noticeFormConfigs,
                  showForm: false,
                },
              });
            }}
            noticeConfigs={configs.noticeFormConfigs}
          />
          )}
      <div className="my-20">&nbsp;</div>
    </>
  );
};

export default LegalNotices;
