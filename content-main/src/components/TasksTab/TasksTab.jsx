import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import {
  ActionIcon, Anchor, Button, Center, Skeleton, Table, Pagination, Modal, Badge, Text,
} from '@mantine/core';
import { Refresh } from 'tabler-icons-react';
import smartTruncate from 'smart-truncate';
import { formatDistance, parseISO } from 'date-fns';
import { formatDate, loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { getResourceTasks } from '../../utilities/apis/tasks';
import TaskNewForm from '../CaseNewUI/TaskNewForm';
import { taskStatusColors } from '../../utilities/enums';
import UserAvatarView from '../UserAvatarView';
import TaskDetailsUI from '../TaskNewUI/TaskDetailsUI';

const TasksTab = ({ parent, parentId }) => {
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
      getResourceTasks({
        parentResource: parent,
        parentResourceId: parentId,
        page: tasksConfig.page,
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
        message: `Failed to load tasks for ${parent} ${parentId}`,
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
      {tasksConfig.taskFormVisible
          && (
          <Modal
            closeOnClickOutside={false}
            overflow="inside"
            opened
            onClose={() => {
              setTasksConfig({
                ...tasksConfig,
                taskFormVisible: false,
              });
            }}
            size="calc(80vw)"
          >
            <TaskNewForm
              parent={parent}
              parentId={parentId}
              onModalExit={() => {
                setTasksConfig({
                  ...tasksConfig,
                  taskFormVisible: false,
                });
              }}
            />
          </Modal>
          )}

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
              parent={parent}
              parentId={parentId}
              taskId={tasksConfig.loadTask}
              onModalExit={() => {
                setTasksConfig({
                  ...tasksConfig,
                  loadTask: null,
                });
              }}
            />
          </Modal>
          )}
      <div className="flex flex-col p-4">
        <div className="flex flex-row justify-end">
          <div className="flex items-center">
            <ActionIcon color="white" className="mx-2" onClick={getTasks}>
              <Refresh />
            </ActionIcon>
            <Button
              onClick={() => setTasksConfig({
                ...tasksConfig,
                taskFormVisible: true,
              })}
              className="w-40 mx-2"
            >
              Create Task
            </Button>
          </div>
        </div>
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
              <th>Assigned to</th>
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
                    <UserAvatarView {...row.assignedTo} />
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
                        loadTask: row.id,
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

export default TasksTab;
