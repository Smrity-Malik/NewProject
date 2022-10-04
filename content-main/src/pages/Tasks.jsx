/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { Anchor, Table, Text } from '@mantine/core';
import { parseISO } from 'date-fns';
import { showNotification } from '@mantine/notifications';
import colors from '../utilities/design';
import { formatDate, loadingStates } from '../utilities/utilities';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { getUserTasks } from '../utilities/apis/tasks';
import TaskModal from '../components/TaskModal';
import StatsCard from '../components/StatsCard';

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
  useEffect(() => {
    getTasks();
  }, []);
  return (
    <>
      <div className="flex flex-row">
        <StatsCard
          cardText="All tasks"
          textNumber={100}
          bulletPoints={[
            {
              bulletText: '25 Case Tasks',
              bulletColor: '#d9b342',
            },
            {
              bulletText: '25 Notice Tasks',
              bulletColor: '#39ea11',
            },
            {
              bulletText: '50 Agreement Tasks',
              bulletColor: '#a70e37',
            },
          ]}
        />
        <StatsCard
          cardText="Cases Tasks"
          textNumber={50}
          bulletPoints={[
            {
              bulletText: '10 Pending',
              bulletColor: '#B327F5',
            },
            {
              bulletText: '40 Completed',
              bulletColor: '#ED9013',
            },
          ]}
        />
        <StatsCard
          cardText="Notices Tasks"
          textNumber={50}
          bulletPoints={[
            {
              bulletText: '10 Pending',
              bulletColor: '#B327F5',
            },
            {
              bulletText: '40 Completed',
              bulletColor: '#ED9013',
            },
          ]}
        />
        <StatsCard
          cardText="Agreement Tasks"
          textNumber={50}
          bulletPoints={[
            {
              bulletText: '10 Pending',
              bulletColor: '#B327F5',
            },
            {
              bulletText: '40 Completed',
              bulletColor: '#ED9013',
            },
          ]}
        />
      </div>
      <div className="flex flex-col">
        {tasksConfig.loading === loadingStates.LOADING && <BeatLoader color={colors.primary} size={10} /> }
        {((tasksConfig.loading !== loadingStates.LOADING && !tasksConfig.tasks?.length))
    && <div>No tasks to show</div>}
        <Text size="lg">My Tasks</Text>
        {(!!(tasksConfig.loading !== loadingStates.LOADING && tasksConfig.tasks.length)) && (
          <Table striped>
            <thead>
              <tr>
                <th>Created At</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasksConfig.tasks.map(
                (row) => (
                  <tr>
                    <td>{formatDate(parseISO(row.createdAt))}</td>
                    <td>{row.createdBy}</td>
                    <td>{row.status}</td>
                    <td>{formatDate(row.dueDate)}</td>
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
    </>
  );
};

export default Dashboard;
