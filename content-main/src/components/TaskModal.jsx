/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import {
  Button,
  Modal, SegmentedControl, Select, Text, Textarea, TextInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { format, formatISO, parseISO } from 'date-fns';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { cleanFileObj, loadingStates, taskStatuses } from '../utilities/utilities';
import colors from '../utilities/design';
import DocumentUploader from '../pages/DocumentUploader/DocumentUploader';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { createTaskApi, getTaskDetails, updateTask } from '../utilities/apis/tasks';
import UserSelector from './UserSelector/UserSelector';

const TaskModal = ({
  refreshParent,
  parentResource,
  parentResourceId,
  componentToShow,
  initialUiState,
  mode,
  taskToLoad,
  initialTaskState,
}) => {
  const [uiConfigs, setUiConfigs] = useState({
    mode,
    taskToLoad,
    modalOpened: false,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    ...(initialUiState || {}),
  });
  const [task, setTask] = useState({
    files: [],
    assigneeFiles: [],
    ...(initialTaskState || {}),
  });
  const toggle = () => {
    setUiConfigs({
      ...uiConfigs,
      modalOpened: !uiConfigs.modalOpened,
    });
    if (uiConfigs.modalOpened && refreshParent) {
      refreshParent();
    }
  };

  const { files } = task;
  const setFiles = (incomingFiles) => setTask({
    ...task,
    files: incomingFiles,
  });
  const { assigneeFiles } = task;
  const setAssigneeFiles = (incomingFiles) => setTask({
    ...task,
    assigneeFiles: incomingFiles,
  });

  const directChange = (name) => (value) => {
    setTask({
      ...task,
      [name]: value,
    });
  };

  const changeHandler = (name) => (event) => {
    if (typeof event.getMonth === 'function') {
      setTask({
        ...task,
        [name]: event,
      });
      return;
    }
    setTask({
      ...task,
      [name]: event.target.value,
    });
  };

  const changeHandlerWithValue = (name) => ({
    onChange: changeHandler(name),
    value: task[name],
  });

  const viewMode = uiConfigs.mode === 'view';
  const editMode = uiConfigs.mode === 'edit';
  const updateMode = uiConfigs.mode === 'edit' && !!uiConfigs.taskToLoad;

  const reminderLabels = {
    86400: '24 Hours before due date',
    43200: '12 Hours before due date',
    21600: '6 Hours before due date',
  };

  const createTask = async () => {
    if (parentResource && parentResourceId) {
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.LOADING,
      });
      const taskData = {
        ...task,
        parentResource,
        parentResourceId,
        dueDate: formatISO(task.dueDate),
        files: task.files.map(cleanFileObj),
      };
      const response = await apiWrapWithErrorWithData(createTaskApi(
        {
          taskData,
        },
      ));
      if (response?.success) {
        toggle();
        showNotification({
          color: 'green',
          title: 'Task Created',
          message: 'Task has been created.',
        });
      }
    } else {
      showNotification({
        color: 'red',
        title: 'Resource Missing',
      });
    }
  };

  const loadTask = async () => {
    if (taskToLoad) {
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.LOADING,
      });

      const response = await apiWrapWithErrorWithData(getTaskDetails(
        {
          taskId: taskToLoad,
        },
      ));
      if (response?.success && response?.task) {
        setTask({
          ...response.task,
          dueDate: parseISO(response.task.dueDate),
          files: (response.task.files || []).map((file) => ({ ...file, uploadedComplete: true, uploadStarted: true })),
          assigneeFiles: (response.task.assigneeFiles || []).map((file) => ({ ...file, uploadedComplete: true, uploadStarted: true })),
        });
        setUiConfigs({
          ...uiConfigs,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        });
      }
    } else {
      showNotification({
        color: 'red',
        title: 'taskToLoad is missing.',
      });
    }
  };

  const saveTask = async () => {
    if (uiConfigs.taskToLoad) {
      setUiConfigs({
        ...uiConfigs,
        loading: loadingStates.LOADING,
      });
      const taskData = {
        ...task,
        status: task.status,
        dueDate: formatISO(task.dueDate),
        files: task.files.map(cleanFileObj),
        assigneeFiles: (task.assigneeFiles || []).map(cleanFileObj),
        assigneeRemarks: task.assigneeRemarks,
      };
      const response = await apiWrapWithErrorWithData(updateTask(
        {
          taskId: uiConfigs.taskToLoad,
          taskData,
        },
      ));
      if (response?.success) {
        toggle();
        showNotification({
          color: 'green',
          title: 'Task Created',
          message: 'Task has been created.',
        });
      }
    } else {
      showNotification({
        color: 'red',
        title: 'Resource Missing',
      });
    }
  };

  const createOrSaveTask = uiConfigs.taskToLoad ? saveTask : createTask;

  useEffect(() => {
    if (uiConfigs.modalOpened && uiConfigs.taskToLoad) {
      loadTask();
    }
  }, [uiConfigs.modalOpened, uiConfigs.taskToLoad]);

  const showUIForm = () => {
    if (uiConfigs.taskToLoad) {
      return !!task.title?.length;
    }
    return true;
  };

  const navigate = useNavigate();

  const actionHandler = () => {
    const resource = parentResource || task.parentResource;
    const id = parentResourceId || task.parentResourceId;
    if (resource === 'notice') {
      const url = `/app/view/notice/${id}`;
      navigate(url);
    }
    if (resource === 'case') {
      const url = `/app/dispute-manager/cases/details/${id}`;
      navigate(url);
    }
    if (resource === 'notice-request') {
      const url = `/app/view/notice-request/${id}`;
      navigate(url);
    }
    if (resource === 'agreement') {
      const url = `/app/agreements/details/${id}`;
      navigate(url);
    }
    toggle();
  };

  if (!uiConfigs.modalOpened) {
    return <div onClick={toggle}>{componentToShow}</div>;
  }

  return (
    <Modal
      overflow="inside"
      closeOnClickOutside={false}
      size="calc(50vw)"
      opened={uiConfigs.modalOpened}
      onClose={toggle}
      title="Task"
    >
      <div className="flex flex-row justify-between">
        <div className="w-1/2">
          <div className="my-2">
            {parentResourceId && (
            <Text color="gray">
              Task for
              {' '}
              {' '}
              {parentResourceId}
            </Text>
            )}
          </div>
          <div className="my-2">
            {uiConfigs.loading === loadingStates.LOADING && <BeatLoader color={colors.primary} size={10} />}
          </div>
          {showUIForm()
            && (
            <div className="flex flex-col">

                {uiConfigs.taskToLoad ? (
                  <div className="my-2">
                    {(editMode && updateMode) && (
                    <Select
                      data={[
                        { label: taskStatuses.CREATED, value: taskStatuses.CREATED },
                        { label: taskStatuses.ARCHIVED, value: taskStatuses.ARCHIVED },
                        { label: taskStatuses.COMPLETED, value: taskStatuses.COMPLETED },
                      ]}
                      placeholder="Select Status"
                      label="Status"
                      value={task.status}
                      onChange={directChange('status')}
                    />
                    )}
                    {viewMode && (
                    <div className="flex flex-col">
                      <Text color="gray" size="sm">Status</Text>
                      <Text>{task.status}</Text>
                    </div>
                    )}
                  </div>

                ) : null}

              <div className="my-2">
                {(editMode && !updateMode) && <TextInput placeholder="Enter title" label="Title" {...changeHandlerWithValue('title')} />}
                {viewMode && (
                <div className="flex flex-col">
                  <Text color="gray" size="sm">Title</Text>
                  <Text>{task.title}</Text>
                </div>
                )}
              </div>

              <div className="my-2">
                {(editMode && !updateMode) && (
                <Textarea
                  placeholder="Enter description"
                  label="Description"
                  {...changeHandlerWithValue('description')}
                />
                )}
                {viewMode && (
                <div className="flex flex-col">
                  <Text color="gray" size="sm">Description</Text>
                  <Textarea readOnly {...changeHandlerWithValue('description')} />
                </div>
                )}
              </div>

              <div className="my-2">
                {(editMode && !updateMode) && (
                <UserSelector
                  placeholder="Enter Assignee Email"
                  label="Assigned to"
                  {...changeHandlerWithValue('assignedToEmail')}
                />
                )}
                {viewMode && (
                <div className="flex flex-col">
                  <Text color="gray" size="sm">Assigned to email</Text>
                  <Text>{task.assignedToEmail}</Text>
                </div>
                )}
              </div>

              <div className="my-2">
                {(editMode && !updateMode) && (
                <Select
                  data={[
                    { label: reminderLabels['86400'], value: '86400' },
                    { label: reminderLabels['43200'], value: '43200' },
                    { label: reminderLabels['21600'], value: '21600' },
                  ]}
                  placeholder="Select one"
                  label="Reminder Time"
                  value={task.reminderTime}
                  onChange={directChange('reminderTime')}
                />
                )}
                {viewMode && (
                <div className="flex flex-col">
                  <Text color="gray" size="sm">Reminder Time</Text>
                  <Text>{reminderLabels[task.reminderTime] || ''}</Text>
                </div>
                )}
              </div>

              <div className="my-2">
                {(editMode && !updateMode) && <DatePicker placeholder="Pick date" label="Due date" {...changeHandlerWithValue('dueDate')} />}
                {viewMode && (
                <div className="flex flex-col">
                  <Text color="gray" size="sm">Due Date</Text>
                  <Text>{format(task.dueDate, 'dd MMM yyyy')}</Text>
                </div>
                )}
              </div>

              <div className="my-2">
                {(editMode && !updateMode) && <DocumentUploader title="Attach files to this task." files={files} setFiles={setFiles} />}
                {viewMode && (
                <div className="flex flex-col">
                  <Text color="gray" size="sm">
                    Files: (
                    {files.length}
                    )
                  </Text>
                  <DocumentUploader hideDropZone files={files} setFiles={setFiles} />
                </div>
                )}
              </div>

              <div className="my-2">
                {(editMode && updateMode) && (
                <Textarea
                  placeholder="Enter assignee remarks"
                  label="Assignee Remarks"
                  {...changeHandlerWithValue('assigneeRemarks')}
                />
                )}
                {viewMode && (
                <div className="flex flex-col">
                  <Text color="gray" size="sm">Assignee Description</Text>
                  <Textarea readOnly {...changeHandlerWithValue('assigneeRemarks')} />
                </div>
                )}
              </div>

              <div className="my-2">
                {(editMode && updateMode) && <DocumentUploader title="Attach assignee files to this task." files={assigneeFiles} setFiles={setAssigneeFiles} />}
                {viewMode && (
                <div className="flex flex-col">
                  <Text color="gray" size="sm">
                    Assignee Files: (
                    {assigneeFiles.length}
                    )
                  </Text>
                  <DocumentUploader hideDropZone files={assigneeFiles} setFiles={setAssigneeFiles} />
                </div>
                )}
              </div>

              <div className="my-2">
                {editMode && (
                <Button onClick={createOrSaveTask} disabled={uiConfigs.loading === loadingStates.LOADING}>
                  Save
                </Button>
                )}
              </div>
            </div>
            )}
        </div>
        <div className="w-1/2 flex flex-col">
          {uiConfigs.taskToLoad && showUIForm()
              && (
              <div className="flex flex-row justify-end">
                <SegmentedControl
                  color="blue"
                  className="my-2"
                  data={[
                    { label: 'UPDATE', value: 'edit' },
                    { label: 'VIEW', value: 'view' },
                  ]}
                  value={uiConfigs.mode}
                  onChange={(val) => {
                    setUiConfigs({
                      ...uiConfigs,
                      mode: val,
                    });
                  }}
                />
              </div>
              )}
          {(showUIForm() && viewMode) && (
          <div className="flex flex-row justify-end">
            <Button onClick={actionHandler}>
              Go to
              {' '}
              {(task.parentResource || parentResource).toUpperCase()}
            </Button>
          </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
