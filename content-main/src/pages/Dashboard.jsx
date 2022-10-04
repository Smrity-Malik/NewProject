import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { Modal, Button, Group } from '@mantine/core';
import { Button } from '@mantine/core';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { getDatabase, ref, set } from 'firebase/database';
import { loadingStates } from '../utilities/utilities';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { getUserTasks } from '../utilities/apis/tasks';
import { selectAllNotifications, selectUserData } from '../redux/selectors';
import NotificationBox from '../components/NotificationBox';
import TaskModal from '../components/TaskModal';
import constants from '../utilities/constants';
// import ServiceProviderDetail from '../components/ServiceProviderDetail/ServiceProviderDetail';
// import ServiceProviderForm from '../components/ServiceProviderForm/ServiceProviderForm';
// import NoticeDetail from '../components/NoticeDetail/NoticeDetail';
// import AgreementDetail from '../components/AgreementDetail/AgreementDetail';
// import AgreementTemplate1 from '../components/TemplateManager/TemplatesList';
// import AgreementTemplate2 from '../components/AgreementTemplate2/AgreementTemplate2';
// import TemplateForm from '../components/TemplateForm/TemplateForm';
// import SignatureRequest from '../components/SignatureRequest/SignatureRequest';
// import SignatureStatus from '../components/SignatureStatus/SignatureStatus';
// import EmailTrail from '../components/EmailTrail/EmailTrail';
// import TaskDetailsUI from '../components/TaskNewUI/TaskDetailsUI';
// import TaskNewForm from '../components/CaseNewUI/TaskNewForm';
// import CaseExpense from '../components/CaseExpense/CaseExpense';
// import CaseRecord from '../components/CaseRecord/CaseRecord';
// import ExpenseCaseDetailPage from '../components/ExpenseCaseDetailPage/ExpenseCaseDetailPage';
// import RecordCaseDetailPage from '../components/RecordCaseDetailPage/RecordCaseDetailPage';
// import NoticeRequestForm from '../components/NoticeRequestForm/NoticeRequestForm';

// import CaseExpenseDetails from '../components/CaseExpenseDetails/CaseExpenseDetails';
// import CaseNotification from '../components/CaseNotification/CaseNotification';
// import CaseDetails from '../components/CaseDetails/CaseDetails';

const Dashboard = () => {
  const [tasksConfig, setTasksConfig] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    tasks: [],
  });

  const getTasks = async () => {
    setTasksConfig({
      ...tasksConfig,
      loadingStates: loadingStates.LOADING,
    });
    const response = await apiWrapWithErrorWithData(getUserTasks());
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
        message: 'Failed to load tasks for self.',
      });
      setTasksConfig({
        ...tasksConfig,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };
  const allNotifications = (useSelector(selectAllNotifications) || []);
  allNotifications.sort((notiA, notiB) => {
    const dateA = parseISO(notiA.time);
    const dateB = parseISO(notiB.time);
    return dateB - dateA;
  });
  useEffect(() => {
    getTasks();
  }, []);
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const markAsSeen = (notification) => {
    // if (notification.seen) {
    //   return;
    // }
    if (notification.key) {
      const notificationKey = notification.key;
      const currentUTCtimeISO = (new Date()).toISOString();
      // TODO: Change user id
      const userId = userData.id || 'sample-userid-2283-38383';
      const db = getDatabase();
      const nodeRef = ref(db, `${constants.env}/notifications/${userId}/${notificationKey}/seen`);
      return set(nodeRef, currentUTCtimeISO);
    }
    return null;
  };
  // const [opened1, setOpened1] = useState(false);
  // const [opened2, setOpened2] = useState(false);
  // const [opened3, setOpened3] = useState(false);
  // const [opened4, setOpened4] = useState(false);
  // const [opened5, setOpened5] = useState(false);
  // const [opened6, setOpened6] = useState(false);
  // const [opened7, setOpened7] = useState(false);
  // const [opened8, setOpened8] = useState(false);
  // const [opened9, setOpened9] = useState(false);
  return (
    <div className="flex flex-col">
      {/* <ServiceProviderDetail /> */}
      {/* <NoticeDetail /> */}
      {/* <AgreementDetail /> */}
      {/* <Modal
        opened={opened9}
        onClose={() => setOpened9(false)}
        size="calc(100vw - 200px)"
      >
        <ServiceProviderForm />
      </Modal>
      <Group position="center">
        <Button
          variant="filled"
          onClick={() => setOpened9(true)}
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.5rem',
            color: '#F5F5F5',
          }}
        >
          ServiceProviderForm
        </Button>
      </Group> */}
      {/* <Modal
        opened={opened8}
        onClose={() => setOpened8(false)}
        size="calc(100vw - 200px)"
      >
        <AgreementTemplate2 />
      </Modal>
      <Group position="center">
        <Button
          variant="filled"
          onClick={() => setOpened8(true)}
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.5rem',
            color: '#F5F5F5',
          }}
        >
          AgreementTemplate
        </Button>
      </Group> */}
      {/* <AgreementTemplate1 /> */}
      {/* <TemplateForm /> */}
      {/* <SignatureStatus /> */}
      {/* <SignatureRequest /> */}
      {/* <EmailTrail /> */}
      {/* <CaseDetails /> */}
      {/* <CaseExpenseDetails /> */}
      {/* <CaseNotification /> */}
      {/* <div className="flex flex-row justify-between"> */}
      <div className="grid grid-cols-4 gap-4">
        {/* <Modal
          opened={opened1}
          onClose={() => setOpened1(false)}
          size="calc(100vw - 200px)"
        >
          <TaskDetailsUI />
        </Modal>
        <Group position="center">
          <Button
            variant="filled"
            onClick={() => setOpened1(true)}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            Open TaskNew
          </Button>
        </Group> */}
        {/* <Modal
          opened={opened2}
          onClose={() => setOpened2(false)}
          size="calc(100vw - 200px)"
        >
          <TaskNewForm />
        </Modal>
        <Group position="center">
          <Button
            variant="filled"
            onClick={() => setOpened2(true)}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            Open CaseNew
          </Button>
        </Group> */}
        {/* <Modal
          opened={opened3}
          onClose={() => setOpened3(false)}
          size="calc(100vw - 200px)"
        >
          <CaseExpense />
        </Modal>
        <Group position="center">
          <Button
            variant="filled"
            onClick={() => setOpened3(true)}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            Open CaseExpense
          </Button>
        </Group> */}
        {/* <Modal
          opened={opened4}
          onClose={() => setOpened4(false)}
          size="calc(100vw - 200px)"
        >
          <CaseRecord />
        </Modal>
        <Group position="center">
          <Button
            variant="filled"
            onClick={() => setOpened4(true)}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            Open CaseRecord
          </Button>
        </Group> */}
        {/* ExpenseCaseDetailPage */}
        {/* <Modal
          opened={opened5}
          onClose={() => setOpened5(false)}
          size="calc(100vw - 200px)"
        >
          <ExpenseCaseDetailPage />
        </Modal>
        <Group position="center">
          <Button
            variant="filled"
            onClick={() => setOpened5(true)}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            ExpenseCaseDetailPage
          </Button>
        </Group> */}
        {/* RecordCaseDetailPage */}
        {/* <Modal
          opened={opened6}
          onClose={() => setOpened6(false)}
          size="calc(100vw - 200px)"
        >
          <RecordCaseDetailPage />
        </Modal>
        <Group position="center">
          <Button
            variant="filled"
            onClick={() => setOpened6(true)}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            RecordCaseDetailPage
          </Button>
        </Group> */}
        {/* NoticeRequestFrom */}
        {/* <Modal
          opened={opened7}
          onClose={() => setOpened7(false)}
          size="calc(100vw - 200px)"
        >
          <NoticeRequestForm />
        </Modal>
        <Group position="center">
          <Button
            variant="filled"
            onClick={() => setOpened7(true)}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            NoticeRequestForm
          </Button>
        </Group> */}
      </div>
      {allNotifications.map(
        (notification, index) => {
          const description = (
            <div className="flex flex-row">
              <span className="mr-4">
                Sent:
                {' '}
                {formatDistanceToNowStrict(parseISO(notification.time))}
              </span>
              <span>
                {notification.seen ? `Seen ${formatDistanceToNowStrict(parseISO(notification.seen))}` : '' }
              </span>
            </div>
          );
          let action = null;
          if (notification.metadata) {
            if (notification.metadata?.type === 'task' && notification.metadata?.id) {
              action = (
                <TaskModal
                  taskToLoad={notification.metadata.id}
                  mode="view"
                  componentToShow={<Button variant="white" onClick={() => { markAsSeen(notification); }}>View Task</Button>}
                />
              );
            }
            if (notification.metadata?.type === 'case' && notification.metadata?.id) {
              const { id } = notification.metadata;
              action = (
                <Button
                  variant="white"
                  onClick={() => {
                    const url = `/app/dispute-manager/cases/details/${id}`;
                    navigate(url);
                    markAsSeen(notification);
                  }}
                >
                  Go to Case
                </Button>
              );
            }
            if (notification.metadata?.type === 'notice' && notification.metadata?.id) {
              const { id } = notification.metadata;
              action = (
                <Button
                  variant="white"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `/app/view/notice/${id}`;
                    navigate(url);
                    markAsSeen(notification);
                  }}
                >
                  Go to Notice
                </Button>
              );
            }
            if (notification.metadata?.type === 'notice-request' && notification.metadata?.id) {
              const { id } = notification.metadata;
              action = (
                <Button
                  variant="white"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `/app/view/notice-request/${id}`;
                    navigate(url);
                    markAsSeen(notification);
                  }}
                >
                  Go to Notice
                </Button>
              );
            }
          }
          return (
            <NotificationBox
              seen={notification.seen}
              index={index}
              pillText={notification.metadata?.type.replace('-', ' ').toUpperCase()}
              pillColor={notification.bgColor || 'green'}
              title={notification.notificationText}
              description={description}
              actionBtn={action}
            />
          );
        },
      ) }
    </div>
  // <div className="flex flex-col">
  //   <Text size="lg" className="my-2">Notifications</Text>
  //   {allNotifications.map((notification, index) => (
  //     <NotificationRenderer
  //       index={index}
  //       key={notification.key}
  //       incomingNotification={notification}
  //       navigate={navigate}
  //     />
  //   ))}
  // </div>
  );
};

export default Dashboard;
