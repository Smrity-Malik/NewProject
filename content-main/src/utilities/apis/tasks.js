import axios from 'axios';
import { headersProvider } from '../apiHelpers';
import constants from '../constants';

export const getUserTasks = () => axios.get(`${constants.apiHost}/tasks/my-tasks`, {
  headers: headersProvider(),
});

export const getResourceTasks = ({
  parentResource,
  parentResourceId,
  page,
}) => axios.get(`${constants.utilityHost}/tasks/list`, {
  params: {
    page,
    parent: parentResource,
    parentId: parentResourceId,
  },
  headers: headersProvider(),
});

export const updateTask = ({
  taskId,
  status,
}) => axios.put(`${constants.utilityHost}/tasks/edit-task/${taskId}`, {
  status,
}, {
  headers: headersProvider(),
});

export const createTaskApi = ({
  taskData,
}) => axios.post(`${constants.utilityHost}/tasks/create-task`, {
  ...taskData,
}, {
  headers: headersProvider(),
});

export const getTaskDetails = ({ taskId }) => axios.get(`${constants.utilityHost}/tasks/details/${taskId}`, {
  headers: headersProvider(),
});

export const addTaskRemark = ({
  taskId,
  remark,
}) => axios.post(`${constants.utilityHost}/tasks/add-remark`, {
  taskId,
  remark,
}, {
  headers: headersProvider(),
});

export const getSelfTasks = ({
  page,
  assignedToId,
}) => axios.get(`${constants.utilityHost}/tasks/self-tasks`, {
  params: {
    page,
    assignedToId,
  },
  headers: headersProvider(),
});

export const tasksAnalytics = () => axios.get(`${constants.utilityHost}/tasks/analytics`, {
  headers: headersProvider(),
});
