import React, { useEffect, useState } from 'react';
import {
  Anchor, Badge, Center, Modal, Pagination, Skeleton, Table, Text,
} from '@mantine/core';
import smartTruncate from 'smart-truncate';
import { formatDistance, parseISO } from 'date-fns';
import { showNotification } from '@mantine/notifications';
import { formatDate, loadingStates } from '../utilities/utilities';
import UserAvatarView from '../components/UserAvatarView';
import { taskStatusColors } from '../utilities/enums';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { getSelfTasks } from '../utilities/apis/tasks';
import TaskDetailsUI from '../components/TaskNewUI/TaskDetailsUI';

const DashboardTasks = ({ taskAssignedToUserId }) => {
  const [tasksConfig, setTasksConfig] = useState({
    taskFormVisible: false,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    tasks: [],
    page: 1,
    tasksCount: null,
    loadTask: null,
  });
  const getTasks = async () => {
    setTasksConfig((taskC) => ({
      ...taskC,
      loading: loadingStates.LOADING,
      tasksCount: null,
    }));
    const response = await apiWrapWithErrorWithData(
      getSelfTasks({
        page: tasksConfig.page,
        assignedToId: taskAssignedToUserId || undefined,
      }),
    );
    if (response?.success && response?.tasks) {
      setTasksConfig({
        ...tasksConfig,
        tasks: response.tasks,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        tasksCount: response.tasksCount || null,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Tasks',
        message: 'Failed to load self tasks.',
      });
      setTasksConfig({
        ...tasksConfig,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      });
    }
  };

  useEffect(() => {
    if (tasksConfig.loadTask === null || !tasksConfig.taskFormVisible) {
      getTasks();
    }
  }, [tasksConfig.loadTask, tasksConfig.taskFormVisible, tasksConfig.page]);

  return (
    <>
      {(tasksConfig.loadTask !== null)
              && (
              <Modal
                overflow="inside"
                opened
                onClose={() => {
                  setTasksConfig({
                    ...tasksConfig,
                    loadTask: null,
                  });
                }}
                size="calc(80vw)"
              >
                <TaskDetailsUI
                  parent={tasksConfig.loadTask.parent}
                  parentId={tasksConfig.loadTask.parentId}
                  taskId={tasksConfig.loadTask.id}
                  onModalExit={() => {
                    setTasksConfig({
                      ...tasksConfig,
                      loadTask: null,
                    });
                  }}
                />
              </Modal>
              )}
      <div className="flex flex-col">
        {tasksConfig.loading === loadingStates.LOADING
                && (
                <div className="flex flex-col mb-2 mt-8">
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <Skeleton height={30} radius="md" className="my-1 w-full" />
                  <div className="flex flex-row justify-center">
                    <Skeleton height={40} radius="md" className="w-40" />
                  </div>
                </div>
                )}
        {((tasksConfig.loading !== loadingStates.LOADING && !tasksConfig.tasks?.length))
    && <Center className="my-4">No tasks to show</Center>}
        {(tasksConfig.loading !== loadingStates.LOADING && !!tasksConfig.tasks.length) && (
          <Table className="mt-8" striped>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Due date</th>
                <th>Created by</th>
                <th>Module</th>
                <th>Status</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {tasksConfig.tasks.map(
                (row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="flex flex-col">
                        <div>{`Task - ${row.id}`}</div>
                        <Text size="xs" color="gray">{smartTruncate(row.title, 20)}</Text>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span>
                          {formatDate(row.dueDate)}
                        </span>
                        <Text color="gray" size="xs">
                          {formatDistance(parseISO(row.dueDate), new Date(), {
                            addSuffix: true,
                          })}
                        </Text>
                      </div>
                    </td>
                    <td>
                      <UserAvatarView {...row.createdBy} />
                    </td>
                    <td>
                      {`${row.parent.toUpperCase()}-${row.parentId}`}
                    </td>
                    <td>
                      <Badge color={taskStatusColors[row.status] || 'orange'}>
                        {row.status}
                      </Badge>
                    </td>
                    <td>
                      <Anchor onClick={(e) => {
                        e.stopPropagation();
                        setTasksConfig({
                          ...tasksConfig,
                          loadTask: row,
                        });
                      }}
                      >
                        View
                      </Anchor>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </Table>
        )}
        {tasksConfig.tasksCount
    && (
    <div className="flex justify-center mt-4">
      <Pagination
        onChange={(page) => {
          setTasksConfig({
            ...tasksConfig,
            page,
          });
        }}
        total={Math.ceil(tasksConfig.tasksCount / 10)}
        page={tasksConfig.page}
      />
    </div>
    )}
      </div>
    </>
  );
};

export default DashboardTasks;
