import React, { useEffect, useState } from 'react';
import {
  Button, Textarea, Text, Center, Select,
} from '@mantine/core';
import { CalendarEvent } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { BeatLoader } from 'react-spinners';
import styles from './TaskDetailsUI.module.css';
import {
  formatDate, formatTime, getValueForInput, loadingStates,
} from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { addTaskRemark, getTaskDetails, updateTask } from '../../utilities/apis/tasks';
import UserAvatarView from '../UserAvatarView';
import NewDocumentUploader from '../NewDocumentUploader/NewDocumentUploader';
import useMultiFileUpload from '../../hooks/useMultiFileUpload';
import colors from '../../utilities/design';
import { taskStatusColors, taskStatusValues } from '../../utilities/enums';

function TaskDetailsUI({ taskId, parent, parentId }) {
  const [taskDetailsData, setTaskDetailsData] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    remarkLoading: loadingStates.NO_ACTIVE_REQUEST,
    taskDetails: null,
    remarkInput: '',
    taskStatusUpdating: loadingStates.NO_ACTIVE_REQUEST,
  });
  const { taskDetails } = taskDetailsData;

  const getTaskDetailsHandler = async () => {
    setTaskDetailsData({
      ...taskDetailsData,
      loading: loadingStates.LOADING,
    });
    const resp = await apiWrapWithErrorWithData(getTaskDetails({
      taskId,
    }));
    if (resp?.success) {
      setTaskDetailsData({
        ...taskDetailsData,
        loading: loadingStates.NO_ACTIVE_REQUEST,
        taskDetails: resp.task,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Task Details',
        message: 'Task details could not be loaded.',
      });
    }
  };

  const saveRemark = async () => {
    if (taskDetailsData.remarkInput.length < 5) {
      showNotification({
        title: 'Task Remark',
        message: 'Remark should be minimum 5 characters.',
        color: 'red',
      });
      return;
    }
    setTaskDetailsData({
      ...taskDetailsData,
      remarkLoading: loadingStates.LOADING,
    });
    const resp = await apiWrapWithErrorWithData(addTaskRemark({
      taskId,
      remark: taskDetailsData.remarkInput,
    }));
    if (resp?.success && resp?.remark) {
      setTaskDetailsData({
        ...taskDetailsData,
        remarkLoading: loadingStates.NO_ACTIVE_REQUEST,
        remarkInput: '',
        taskDetails: {
          ...taskDetailsData.taskDetails,
          remarks: [...taskDetailsData.taskDetails.remarks,
            resp.remark,
          ],
        },
      });
    } else {
      setTaskDetailsData({
        ...taskDetailsData,
        remarkLoading: loadingStates.NO_ACTIVE_REQUEST,
      });
      showNotification({
        title: 'Task Remark',
        message: 'Could not add remark.',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    getTaskDetailsHandler();
  }, []);

  const updateTaskData = async (newStatus) => {
    setTaskDetailsData({
      ...taskDetailsData,
      taskDetails: {
        ...taskDetailsData.taskDetails,
        status: newStatus,
      },
      taskStatusUpdating: loadingStates.LOADING,
    });
    const resp = await apiWrapWithErrorWithData(updateTask({
      taskId,
      status: newStatus,
    }));
    if (resp?.success) {
      setTaskDetailsData((taskDetailsDataState) => ({
        ...taskDetailsDataState,
        taskStatusUpdating: loadingStates.NO_ACTIVE_REQUEST,
      }));
    } else {
      showNotification({
        title: 'Task Status',
        message: 'Task status could not be updated.',
        color: 'red',
      });
      setTaskDetailsData((taskDetailsDataState) => ({
        ...taskDetailsDataState,
        taskStatusUpdating: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };

  // useEffect(() => {
  //   updateTaskData();
  // }, [taskDetails?.status]);

  const multiUploadArgs = useMultiFileUpload({ parent: 'task', parentId: taskId });

  if (!taskDetails || taskDetailsData.loading === loadingStates.LOADING) {
    return (
      <Center>
        <BeatLoader color={colors.primary} size={10} />
      </Center>
    );
  }

  return (
    <div className="flex flex-col pl-10 pr-2 pb-2">
      <div className="mr-7 pb-10">
        <div className="flex flex-row justify-between my-4 ml-1">
          <div className={`${styles.taskHeader}`}>{`Task - ${taskId} for ${parent} - ${parentId}`}</div>
          <div className={`${styles.btns} flex items-center justify-between`}>
            {taskDetailsData.taskStatusUpdating === loadingStates.LOADING
              && <BeatLoader color={colors.primary} size={10} />}
            {taskDetailsData.taskStatusUpdating === loadingStates.NO_ACTIVE_REQUEST
                && (
                <Select
                  color={taskStatusColors[taskDetails.status]}
                  data={taskStatusValues}
                  value={taskDetails.status}
                  onChange={(input) => {
                    const value = getValueForInput(input);
                    updateTaskData(value);
                  }}
                />
                )}
            {/* <Button className={`${styles.filledBtn}`} variant="filled">Go To Case</Button> */}
          </div>
        </div>
        <div className="text-xl mb-4">
          {taskDetails.title}
        </div>
        <div className="flex flex-row mt-2 justify-between">
          <div>
            <div className={`${styles.detail}`}>Created By</div>
            <div className={`${styles.info} mt-1`}><UserAvatarView {...taskDetails.createdBy} /></div>
          </div>
          <div>
            <div className={`${styles.detail}`}>Due date</div>
            <div className={`${styles.info} mt-1`}>{formatDate(taskDetails.dueDate)}</div>
          </div>
          <div>
            <div className={`${styles.detail}`}>Reminder Time</div>
            <div className={`${styles.info} mt-1`}>
              {`${formatDate(taskDetails.reminderTime)}, ${formatTime(taskDetails.reminderTime)}`}
            </div>
          </div>
          <div>
            <div className={`${styles.detail}`}>Created</div>
            <div className={`${styles.info} mt-1`}>{formatDate(taskDetails.createdAt)}</div>
          </div>

        </div>
        <div className="flex flex-row justify-between mt-6 items-start">
          {/* <AssignDetails /> */}
          <div className="flex flex-col">
            <div className={`${styles.assign} mb-2`}>Assigned To</div>
            <UserAvatarView {...taskDetails.assignedTo} />
          </div>
          <div className="flex flex-col w-2/3">
            <div className={`${styles.detail}`}>Description</div>
            <div className={`${styles.taskDesc} mt-1`}>
              {taskDetails.description}
            </div>
          </div>
        </div>
        <div className="flex flex-col my-2">
          <div className={`${styles.detail}`}>Files</div>
          <NewDocumentUploader multiUploadArgs={multiUploadArgs} />
        </div>
        <div className={`${styles.remark} mt-8`}>Remarks</div>
        {
          taskDetails.remarks.map(
            (remark) => (
              <div className={`${styles.remarkRow} flex flex-col mt-4`}>
                <div className="flex flex-row justify-between mt-3 px-4">
                  <div className="flex items-center">
                    <CalendarEvent size={16} />
                    <div className="ml-2 text-sm">
                      {`${formatDate(remark.createdAt)}, ${formatTime(remark.createdAt)}`}
                    </div>
                  </div>
                  <Text size="xs" color="gray">
                    {remark.createdBy.name}
                  </Text>
                </div>
                <div className={`${styles.remarkTitle} mt-2 mb-3`}>
                  {remark.remark}
                </div>
              </div>
            ),
          )
        }
        {!taskDetails.remarks.length && (
        <div className="mt-4 flex justify-center">
          <Text color="gray" size="sm">
            No remarks.
          </Text>
        </div>
        ) }
        <div className={`${styles.addRemark} mt-6`}>
          <Textarea
            disabled={taskDetailsData.remarkLoading === loadingStates.LOADING}
            value={taskDetailsData.remarkInput}
            onChange={(input) => {
              const value = getValueForInput(input);
              setTaskDetailsData({
                ...taskDetailsData,
                remarkInput: value,
              });
            }}
            className={`${styles.textarea}`}
            placeholder="Add Remark"
          />
          <Button
            className="ml-4"
            onClick={saveRemark}
            disabled={taskDetailsData.remarkLoading === loadingStates.LOADING}
            style={{
              backgroundColor: '#46BDE1',
              borderRadius: '0.5rem',
              color: '#F5F5F5',
            }}
          >
            {taskDetailsData.remarkLoading === loadingStates.LOADING
                && <BeatLoader color={colors.primary} size={10} />}
            {taskDetailsData.remarkLoading === loadingStates.NO_ACTIVE_REQUEST
                && <span>Save</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsUI;
