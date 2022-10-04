/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ActionIcon, Anchor,
  Breadcrumbs, Button, Divider, Popover, Table, Tabs, Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import {
  Help, MessageCircle, Photo, Settings,
} from 'tabler-icons-react';
import { parseISO } from 'date-fns';
import flat from 'flat';
import { cleanFileObj, formatDate, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { fetchNoticeDetails, updateNotice } from '../../utilities/apis/notices';
import colors from '../../utilities/design';
import PdfViewer from './PdfViewer';
import AddressRender from '../../components/AddressRender';
import { getReadPresignedUrl } from '../../utilities/apis/commonApis';
import { getResourceTasks } from '../../utilities/apis/tasks';
import TaskModal from '../../components/TaskModal';
import EmailBox from '../../components/EmailBox';
import DocumentUploader from '../DocumentUploader/DocumentUploader';

const NoticeDetailView = () => {
  const params = useParams();
  const { noticeRef } = params;
  const [noticeFileReadUrl, setNoticeFileReadUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [tasksConfig, setTasksConfig] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    tasks: [],
  });
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    noticeData: null,
    noticeRequestData: null,
    emailBoxView: false,
    noticeFilesLoading: loadingStates.NO_ACTIVE_REQUEST,
  });
  const getTasks = async () => {
    setTasksConfig({
      ...tasksConfig,
      loadingStates: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getResourceTasks({
      parentResource: 'notice',
      parentResourceId: noticeRef,
    }));
    if (response?.success && response?.tasks) {
      setTasksConfig({
        ...tasksConfig,
        tasks: response.tasks,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Tasks',
        message: `Failed to load tasks for notice ${noticeRef}`,
      });
      setTasksConfig({
        ...tasksConfig,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };
  useEffect(() => {
    getTasks();
  }, []);
  const fetchNoticeData = async () => {
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(fetchNoticeDetails(
      { noticeRef },
    ));
    setConfigs({
      ...configs,
      loading: loadingStates.NO_ACTIVE_REQUEST,
    });
    if (response?.success && response?.noticeData) {
      setConfigs({
        ...configs,
        noticeData: response.noticeData,
      });
      setFiles(((response?.noticeData?.json?.documents || []).map((file) => ({
        ...file,
        uploadStarted: true,
        uploadedComplete: true,
      }))));
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Request',
        message: 'Failed to load notice request.',
      });
    }
  };

  const getReadUrl = async (fileUrl) => {
    const response = await apiWrapWithErrorWithData(getReadPresignedUrl({
      parentResource: 'notice',
      parentResourceId: noticeRef,
      fileUrl,
    }));
    if (response?.success && response?.presignedUrl) {
      setNoticeFileReadUrl(response.presignedUrl);
    } else {
      showNotification({
        color: 'red',
        title: 'Notice Failed',
        message: 'Failed to load notice file.',
      });
    }
  };

  useEffect(() => {
    if (configs.noticeData?.json?.mainNoticeFileDestination) {
      getReadUrl(configs.noticeData.json.mainNoticeFileDestination);
    }
    return () => {};
  }, [configs.noticeData?.json]);

  useEffect(() => {
    fetchNoticeData();
    return () => {};
  }, []);
  const items = [
    { title: 'Legal Notices', link: '/app/dispute-manager/legal-notices' },
    { title: `Notice - ${noticeRef}`, link: `/app/view/notice/${noticeRef}` },
  ].map((item) => (
    <Link key={item.title} to={item.link}>
      {item.title}
    </Link>
  ));

  const { noticeData } = configs;
  const noticeJsonData = noticeData?.json || null;
  const [recipientPopOverOpen, setRecipientPopOverOpen] = useState(false);
  const [senderPopOverOpen, setSenderPopOverOpen] = useState(false);

  const popOverForAddr = (arr, stateOpen, setStateOpen) => (
    <Popover
      opened={stateOpen}
      onClose={() => setStateOpen(false)}
      target={(
        <ActionIcon
          onClick={() => {
            setStateOpen(true);
          }}
          color="white"
          variant="hover"
          radius="lg"
        >
          <Help size={20} />
        </ActionIcon>
)}
      width={260}
      position="bottom"
      withArrow
    >
      {arr.map((addr) => <AddressRender addr={addr} selected={false} />)}
    </Popover>
  );

  const saveFilesIntoNotice = async () => {
    const cleaned = files.map(cleanFileObj);
    const noticeDataJSON = { ...configs.noticeData?.json };
    noticeDataJSON.documents = cleaned;
    setConfigs({
      ...configs,
      noticeFilesLoading: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(updateNotice({
      noticeRef,
      noticeData: {
        json: noticeDataJSON,
        flatted: flat(noticeDataJSON),
      },
    }));
    if (response && response?.success) {
      showNotification({
        color: 'green',
        title: 'Notice',
        message: 'Notice saved successfully.',
      });
      fetchNoticeData();
    } else {
      showNotification({
        color: 'red',
        title: 'Notice',
        message: 'Failed to save notice.',
      });
    }
    setConfigs({
      ...configs,
      noticeFilesLoading: loadingStates.NO_ACTIVE_REQUEST,
    });
  };

  return (
    <div className="w-full mb-4">
      <div className="flex flex-col w-full">
        <Breadcrumbs>{items}</Breadcrumbs>
        {noticeJsonData && (
        <>
          <div className="flex flex-col">
            <Divider className="my-4" label="Current Data" labelPosition="center" />
            {/* <Badge size="lg" className="w-40 my-4">{(noticeRequestData.status || '-').toUpperCase()}</Badge> */}
            <div className="flex flex-row">
              <Text size="md" className="mr-8">
                From:
              </Text>
              <div className="flex flex-row items-center">
                {noticeJsonData.sender[0].name}
                {popOverForAddr(noticeData.json.sender, senderPopOverOpen, setSenderPopOverOpen)}
              </div>
            </div>
            <div className="flex flex-row">
              <Text size="md" className="mr-8">
                To:
              </Text>
              <div className="flex flex-row items-center">
                {noticeJsonData.recipient[0].name}
                {popOverForAddr(noticeData.json.recipient, recipientPopOverOpen, setRecipientPopOverOpen)}
              </div>
            </div>
            <div className="flex flex-row">
              <Text size="md" className="mr-8">
                Purpose:
              </Text>
              <Text>{noticeJsonData.purpose.type}</Text>
            </div>
            <div className="flex flex-row">
              <Text size="md" className="mr-8">
                Notice Period:
              </Text>
              <Text>{noticeJsonData.noticePeriod}</Text>
            </div>

            <Tabs className="my-4">
              <Tabs.Tab label="Notice" icon={<Photo size={14} />}>
                <div className="w-full h-auto">
                  {
                    (configs.noticeData?.json?.mainNoticeFileDestination && noticeFileReadUrl)
                      ? <PdfViewer file={noticeFileReadUrl} />
                      : <div>Notice file not found.</div>
                  }
                </div>
              </Tabs.Tab>
              <Tabs.Tab label="Email Trail" icon={<MessageCircle size={14} />}>
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between w-100">
                    <Text>Emails</Text>
                    <Anchor onClick={(e) => {
                      e.stopPropagation();
                      setConfigs({
                        ...configs,
                        emailBoxView: true,
                      });
                    }}
                    >
                      Send new email
                    </Anchor>
                  </div>
                </div>
              </Tabs.Tab>
              <Tabs.Tab label="Docs & Notice Details" icon={<Settings size={14} />}>
                <div className="flex flex-col">
                  <Text className="mb-4">Docs & Notice Details</Text>
                  <DocumentUploader parentResource="notice" parentResourceId={noticeRef} files={files} setFiles={setFiles} />
                  {configs.noticeFilesLoading !== loadingStates.LOADING && (
                  <Button
                    className="w-24"
                    onClick={saveFilesIntoNotice}
                  >
                    Save
                  </Button>
                  )}
                  {configs.noticeFilesLoading === loadingStates.LOADING && <BeatLoader color={colors.primary} size={10} /> }
                </div>
              </Tabs.Tab>
              <Tabs.Tab label="Tasks" icon={<Settings size={14} />}>

                <div className="flex flex-col w-full">

                  <div className="flex flex-row justify-between">
                    <div>
                      {tasksConfig.loading === loadingStates.LOADING && <BeatLoader color={colors.primary} size={10} /> }
                      {((tasksConfig.loading !== loadingStates.LOADING && !tasksConfig.tasks?.length))
                        && <div>No tasks to show</div>}
                      {(tasksConfig.loading !== loadingStates.LOADING && tasksConfig.tasks.length) && (
                        <Table striped>
                          <thead>
                            <tr>
                              <th>Created At</th>
                              <th>Created By</th>
                              <th>Assigned To</th>
                              <th>Status</th>
                              <th>Due Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tasksConfig.tasks.map(
                              (row) => (
                                <tr key={row.id}>
                                  <td>{formatDate(parseISO(row.createdAt))}</td>
                                  <td>{row.createdBy}</td>
                                  <td>{row.assignedToEmail}</td>
                                  <td>{row.status}</td>
                                  <td>{row.dueDate ? formatDate(parseISO(row.dueDate)) : '-'}</td>
                                  <td>
                                    <TaskModal
                                      taskToLoad={row.id}
                                      mode="view"
                                      componentToShow={<Anchor>View</Anchor>}
                                    />
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </Table>
                      )}
                    </div>
                    <div>
                      <TaskModal
                        parentResource="notice"
                        parentResourceId={noticeRef}
                        refreshParent={fetchNoticeData}
                        componentToShow={<Button>Create Task</Button>}
                        mode="edit"
                      />
                    </div>
                  </div>

                </div>

              </Tabs.Tab>
            </Tabs>
          </div>
          {configs.emailBoxView && (
          <EmailBox
            initialData={{
              to: (
                configs.noticeData?.json?.noticeDirection === 'outgoing'
                  ? (configs.noticeData?.json?.recipient || []).map((s) => (s.email.toLowerCase()))
                  : (configs.noticeData?.json?.sender || []).map((s) => (s.email.toLowerCase()))
              ),
              subject: `Notice #${noticeRef}`,
              documents: [{
                fileName: configs.noticeData?.json?.mainNoticeFileName,
                destination: configs.noticeData?.json?.mainNoticeFileDestination,
              },
              ...(configs.noticeData?.json?.documents || []),
              ],
              direction: 'outgoing',
            }}
            onClose={() => {
              setConfigs({
                ...configs,
                emailBoxView: false,
              });
            }}
          />
          )}
        </>
        )}
        {configs.loading === loadingStates.LOADING
            && <BeatLoader size={10} color={colors.primary} />}
      </div>
    </div>
  );
};

export default NoticeDetailView;
