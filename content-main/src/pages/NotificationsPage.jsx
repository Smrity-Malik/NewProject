import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Modal, Pagination, SegmentedControl, Skeleton, Text,
} from '@mantine/core';
import { getValueForInput, loadingStates } from '../utilities/utilities';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { getSelfNotifications } from '../utilities/apis/users';
import TaskDetailsUI from '../components/TaskNewUI/TaskDetailsUI';
import NotificationBox from '../components/CaseNotification/NotificationBox';
import colors from '../utilities/design';

const NotificationsPage = () => {
  const location = useLocation();

  const [configs, setConfigs] = useState({
    page: 1,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    notifications: null,
    taskToLoad: null,
    notificationsCount: null,
    filterOptions: location?.state?.filterOptions || 'all',
  });

  const getNotifications = async () => {
    setConfigs({
      ...configs,
      loading: loadingStates.LOADING,
    });

    let newFilterOptions = {};

    if (configs.filterOptions.toLowerCase() === 'all') {
      newFilterOptions = {};
    }
    if (configs.filterOptions.toLowerCase() === 'cases') {
      newFilterOptions = {
        caseId: {
          not: null,
        },
      };
    }
    if (configs.filterOptions.toLowerCase() === 'agreements') {
      newFilterOptions = {
        agreementId: {
          not: null,
        },
      };
    }
    if (configs.filterOptions.toLowerCase() === 'notices') {
      newFilterOptions = {
        noticeId: {
          not: null,
        },
      };
    }

    const resp = await apiWrapWithErrorWithData(getSelfNotifications({
      page: configs.page || 1,
      filterOptions: newFilterOptions,
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
  }, [configs.filterOptions, configs.page]);

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
        <Skeleton height={95} radius="md" className="my-4" />
        <Skeleton height={95} radius="md" className="my-4" />
        <Skeleton height={95} radius="md" className="my-4" />
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
        <div className="flex justify-between items-center">
          <Text className="my-4">Notifiications</Text>
          <SegmentedControl
            value={configs.filterOptions}
            onChange={(input) => {
              const value = getValueForInput(input);
              setConfigs((stateC) => ({
                ...stateC,
                filterOptions: value,
              }));
            }}
            color="blue"
            data={[{
              label: 'All',
              value: 'all',
            }, {
              label: 'Cases',
              value: 'cases',
            }, {
              label: 'Agreements',
              value: 'agreements',
            }, {
              label: 'Notices',
              value: 'notices',
            }]}
          />
        </div>
        {(configs.notifications.length === 0)
                    && (
                    <div
                      className="flex justify-center items-center"
                      style={{
                        minHeight: '200px',
                      }}
                    >
                      <Text>No notifications to show.</Text>
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
        {!!(configs.notificationsCount)
              && (
              <div className="flex justify-center mt-4">
                <Pagination
                  onChange={(page) => {
                    setConfigs({
                      ...configs,
                      page,
                    });
                  }}
                  total={Math.ceil(configs.notificationsCount / 10)}
                  page={configs.page}
                />
              </div>
              )}
      </div>
    </>
  );
};

export default NotificationsPage;
