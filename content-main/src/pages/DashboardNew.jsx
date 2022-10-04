import React from 'react';
import { Divider, Text } from '@mantine/core';
import DashboardNotifications from './DashboardNotifications';
import DashboardTasks from './DashboardTasks';
import DashboardAnalytics from './DashboardAnalytics';
import DashboardGraph from './DashboardGraph';

const DashboardNew = () => (
  <div className="flex flex-col p-4">
    <Text>Notifications</Text>
    <DashboardNotifications />
    <div className="flex flex-col mt-4 w-full pt-5">
      {/* <Divider className="w-full my-2 mb-4" /> */}
      <DashboardAnalytics />
    </div>
    <DashboardGraph />
    <div className="flex flex-col mt-4 w-full">
      <Divider className="w-full my-2" />
      <Text>My Tasks</Text>
      <DashboardTasks />
    </div>
  </div>
);

export default DashboardNew;
