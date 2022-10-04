import React, { useEffect, useState } from 'react';
import {
  Modal, Skeleton, Text, Button,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { loadingStates } from '../utilities/utilities';
import NotificationBox from '../components/CaseNotification/NotificationBox';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { getSelfNotifications } from '../utilities/apis/users';
import TaskDetailsUI from '../components/TaskNewUI/TaskDetailsUI';
import colors from '../utilities/design';

const DashboardNotifications = ({
  sortByOptions = {}, filterOptions = {}, btnText = 'View more...', onBtnClick,
}) => {
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    notifications: null,
    taskToLoad: null,
    notificationsCount: null,
  });

  const getNotifications = async () => {
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });
    const resp = await apiWrapWithErrorWithData(getSelfNotifications({
      sortByOptions,
      filterOptions,
      page: 1,
      // take: 3,
      take: 2,
    }));
    if (resp?.success && resp?.notifications) {
      setConfigs({
        ...configs,
        notifications: resp.notifications,
        notificationsCount: resp.notificationsCount,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Notifications List',
        message: 'Could not load notifications list.',
      });
      setConfigs({
        ...configs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);

  const navigate = useNavigate();

  const notificationClickHandler = (notif) => () => {
    if (notif.task) {
      setConfigs({
        ...configs,
        taskToLoad: ({
          parent: notif.parent,
          parentId: notif.parentId,
          id: notif.task.id,
        }),
      });
    }
    if (notif.case) {
      navigate(`/app/dispute-manager/cases/details/${notif.case.id}`);
    }
    if (notif.notice) {
      navigate(`/app/dispute-manager/notices/details/${notif.case.id}`);
    }
    if (notif.agreement) {
      navigate(`/app/agreements/details/${notif.agreement.id}`);
    }
    return (() => {});
  };

  const notificationButtonText = (notif) => {
    if (notif.task) {
      return 'View Task';
    }
    if (notif.case) {
      return 'View Case';
    }
    if (notif.agreement) {
      return 'View Agreement';
    }
    if (notif.notice) {
      return 'View Notice';
    }
    return 'View';
  };

  if (!configs.notifications || configs.loading === loadingStates.LOADING) {
    return (
      <div className="flex flex-col">
        <Skeleton height={95} radius="md" className="my-4" />
        <Skeleton height={95} radius="md" className="my-4" />
        {/* <Skeleton height={95} radius="md" className="my-4" /> */}
      </div>
    );
  }

  return (
    <>
      {(configs.taskToLoad !== null)
            && (
            <Modal
              overflow="inside"
              opened
              onClose={() => {
                setConfigs({
                  ...configs,
                  taskToLoad: null,
                });
              }}
              size="calc(80vw)"
            >
              <TaskDetailsUI
                parent={configs.taskToLoad.parent}
                parentId={configs.taskToLoad.parentId}
                taskId={configs.taskToLoad.id}
                onModalExit={() => {
                  setConfigs({
                    ...configs,
                    taskToLoad: null,
                  });
                }}
              />
            </Modal>
            )}
      <div className="flex flex-col">
        {(configs.notifications.length === 0)
          && (
          <div
            className="flex justify-center items-center"
            style={{
              minHeight: '200px',
            }}
          >
            <Text>No notifications for you.</Text>
          </div>
          )}
        {configs.notifications.map((notif) => (
          <NotificationBox
            backgroundColor={colors[notif.module.toLowerCase()]}
            {...{
              date: notif.sentAt,
              seen: notif.seenAt,
              module: notif.module.toUpperCase(),
              notificationText: notif.notificationText,
              btnName: notificationButtonText(notif),
              onBtnClick: notificationClickHandler(notif),
            }}
          />
        ))}
        {(!!(configs.notificationsCount)
                && configs.notificationsCount >= 2)
            && (
            <div className="flex justify-center">
              <Button
                onClick={onBtnClick || (() => {
                  navigate('/app/notifications');
                })}
                variant="outline"
              >
                {btnText}
              </Button>
            </div>
            )}
      </div>
    </>
  );
};

export default DashboardNotifications;
