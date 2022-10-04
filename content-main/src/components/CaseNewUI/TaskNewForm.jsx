import React, { useState } from 'react';
import {
  Textarea, TextInput, Select, Button,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import {
  formatISO, setHours, setMinutes, subSeconds,
} from 'date-fns';
import styles from './TaskNewForm.module.css';
import { getValueForInput, loadingStates } from '../../utilities/utilities';
import UserSelector from '../UserSelector/UserSelector';
import NewDocumentUploader from '../NewDocumentUploader/NewDocumentUploader';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import colors from '../../utilities/design';
import { selectAllWorkspaceUsers } from '../../redux/selectors';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { createTaskApi } from '../../utilities/apis/tasks';

function TaskNewForm({ parent, parentId, onModalExit }) {
  const multiUploadArgs = useMultiFileUpload({});

  const [taskData, setTaskData] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    assignedToId: null,
    dueDate: null,
    reminderTime: '21600',
    title: '',
    description: '',
    pickTime: null,
    errors: {},
  });
  // const dueDate = "2022-09-20T00:00:00+05:30";
  // const dueDate = parseISO(taskData.dueDate);
  // const pickTime = parseISO(taskData.pickTime);
  const dueDate = new Date(taskData.dueDate);
  const pickTime = new Date(taskData.pickTime);
  const hours = pickTime.getHours();
  const minutes = pickTime.getMinutes();
  const result = setHours(dueDate, hours);
  const finalDueDate = setMinutes(result, minutes);
  // console.log(finalDueDate);

  const reminderLabels = {
    172800: '48 Hours before due date',
    86400: '24 Hours before due date',
    43200: '12 Hours before due date',
    21600: '6 Hours before due date',
  };

  const changeHandler = (name) => (incoming) => {
    const value = getValueForInput(incoming);
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  const validate = () => {
    const keys = {};
    setTaskData({
      ...taskData,
      errors: {},
    });
    if (taskData.title?.length < 5) {
      keys.title = 'Please check value.';
    }
    if (taskData.description?.length < 5) {
      keys.description = 'Please check value.';
    }
    if (!taskData.dueDate) {
      keys.dueDate = 'Please check value.';
    }
    if (!taskData.pickTime) {
      keys.pickTime = 'Please check value.';
    }
    if (!taskData.reminderTime) {
      keys.reminderTime = 'Please check value.';
    }
    if ((Object.keys(keys)).length) {
      setTaskData({
        ...taskData,
        errors: keys,
      });
      showNotification({
        color: 'red',
        title: 'Task Create',
        message: 'Make sure all fields are filled properly.',
      });
      return false;
    }
    if (!taskData.assignedToId) {
      showNotification({
        color: 'red',
        title: 'Task Create',
        message: 'Assign task to a user.',
      });
      return false;
    }
    return true;
  };

  const usersFromStore = useSelector(selectAllWorkspaceUsers);

  const getUserIdFromEmail = (email) => {
    const foundUser = usersFromStore.filter(
      (user) => user.email === email,
    );
    if (foundUser.length) {
      return foundUser[0];
    }
    return null;
  };

  const saveHandler = async () => {
    if (validate()) {
      const taskDataForApi = {
        parentId,
        parent,
        title: taskData.title,
        description: taskData.description,
        assignedToUserId: getUserIdFromEmail(taskData.assignedToId).id,
        // dueDate: formatISO(taskData.dueDate),
        dueDate: formatISO(finalDueDate),
        // reminderTime: formatISO(subSeconds(taskData.dueDate, taskData.reminderTime)),
        reminderTime: formatISO(subSeconds(finalDueDate, taskData.reminderTime)),
        files: multiUploadArgs.finalFiles,
        pickTime: taskData.pickTime,
      };
      setTaskData({
        ...taskData,
        loading: loadingStates.LOADING,
      });
      const resp = await apiWrapWithErrorWithData(createTaskApi({ taskData: taskDataForApi }));
      if (resp?.success) {
        showNotification({
          color: 'green',
          title: 'Task Created.',
          message: 'Task has been created and assigned.',
        });
        onModalExit();
      } else {
        showNotification({
          color: 'red',
          title: 'Task Creation.',
          message: 'An error occured.',
        });
        setTaskData({
          ...taskData,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        });
      }
    }
  };

  return (
    <div className="flex flex-col px-10">
      <div className="flex flex-row justify-between">
        <div className={`${styles.taskHeader}`}>
          Create task for
          {' '}
          {parent.toUpperCase()}
          {' '}
          -
          {' '}
          {parentId}
        </div>
      </div>
      <div className={`${styles.taskTitle} mt-2`}>
        <ul>
          <li>Keep task title small and clear.</li>
          <li>Attach files as necessary.</li>
          <li>Provide clear directions for assignee in description field.</li>
        </ul>
      </div>
      <div className="mt-5">
        <TextInput
          placeholder="Title"
          label="Title"
          required
          value={taskData.title}
          onChange={changeHandler('title')}
          error={taskData.errors.title}
        />
      </div>
      <div className="mt-5">
        <Textarea
          minRows={4}
          placeholder="Description"
          label="Description"
          value={taskData.description}
          onChange={changeHandler('description')}
          error={taskData.errors.description}
        />
      </div>
      <div className="grid gap-4 grid-cols-2  mt-5">
        <UserSelector
          onChange={changeHandler('assignedToId')}
          value={taskData.assignedToId}
          label="Assign to"
          placeholder="Type name or email"
        />
        <DatePicker
          minDate={(new Date())}
          placeholder="Due date"
          label="Select date"
          value={taskData.dueDate}
          onChange={changeHandler('dueDate')}
          error={taskData.errors.dueDate}
        />
        <TimeInput
          label="Pick time"
          // format="12"
          // defaultValue={new Date()}
          // withSeconds
          value={taskData.pickTime}
          onChange={changeHandler('pickTime')}
          error={taskData.errors.pickTime}
        />
        <Select
          data={[
            { label: reminderLabels['172800'], value: '172800' },
            { label: reminderLabels['86400'], value: '86400' },
            { label: reminderLabels['43200'], value: '43200' },
            { label: reminderLabels['21600'], value: '21600' },
          ]}
          placeholder="Reminder time"
          label="Reminder time"
          value={taskData.reminderTime}
          onChange={changeHandler('reminderTime')}
          error={taskData.errors.reminderTime}
        />
      </div>
      <div className={`${styles.file} mt-6 mb-1 font-bold`}>Files</div>
      <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
      <div className="flex justify-end my-8">
        <Button
          onClick={saveHandler}
          disabled={taskData.loading === loadingStates.LOADING}
          style={{
            backgroundColor: '#46BDE1',
            borderRadius: '0.5rem',
            color: '#F5F5F5',
          }}
        >
          {taskData.loading === loadingStates.LOADING
                      && <BeatLoader color={colors.primary} size={10} />}
          {taskData.loading === loadingStates.NO_ACTIVE_REQUEST
                      && <span>Save</span>}
        </Button>
      </div>
    </div>
  );
}

export default TaskNewForm;
