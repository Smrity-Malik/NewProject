/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { showNotification } from '@mantine/notifications';
import { Grid, Skeleton } from '@mantine/core';
import { loadingStates } from '../../utilities/utilities';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { noticesAnalytics } from '../../utilities/apis/notices';
import colors from '../../utilities/design';

ChartJS.register(ArcElement, Tooltip, Legend);

const NoticesAnalytics = () => {
  const [configs, setConfigs] = useState({
    loading: loadingStates.NO_ACTIVE_REQUEST,
    data: null,
  });

  const chartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: ['#3a36db', '#1f6fbd', '#03a89e', '#8189a9', '#c079af', '#ff69b4'],
        borderColor: ['#3a36db', '#1f6fbd', '#03a89e', '#8189a9', '#c079af', '#ff69b4'],
        borderWidth: 1,
      },
    ],
  };

  const dataForStatus = (statusWiseData) => {
    const data = structuredClone(chartData);
    data.labels = statusWiseData.map((item) => item.status);
    data.datasets[0].label = 'Notices by status';
    // eslint-disable-next-line dot-notation
    data.datasets[0].data = statusWiseData.map((item) => item['_count'].id);
    data.datasets[0].backgroundColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].backgroundColor[index]);
    data.datasets[0].borderColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].borderColor[index]);
    return ({ ...data });
  };

  const taskStatusWise = (statusWiseData) => {
    const data = structuredClone(chartData);
    data.labels = statusWiseData.map((item) => item.status);
    data.datasets[0].label = 'Notices tasks by status';
    // eslint-disable-next-line dot-notation
    data.datasets[0].data = statusWiseData.map((item) => item['_count'].id);
    data.datasets[0].backgroundColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].backgroundColor[index]);
    data.datasets[0].borderColor = statusWiseData.map((item, index) => colors[item.status.toLowerCase()] || data.datasets[0].borderColor[index]);
    return data;
  };

  useEffect(() => {
    (async () => {
      setConfigs({ ...configs, loading: loadingStates.LOADING });
      const resp = await apiWrapWithErrorWithData(noticesAnalytics());
      if (resp?.success && resp?.analytics) {
        setConfigs({
          ...configs,
          data: resp.analytics,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        });
      } else {
        showNotification({
          color: 'red',
          title: 'Notices Analytics',
          message: 'Failed to load notices analytics.',
        });
        setConfigs({ ...configs, loading: loadingStates.NO_ACTIVE_REQUEST });
      }
    })();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxHeight: 10,
          boxWidth: 10,
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Grid>
        {configs.loading === loadingStates.LOADING
        && (
        <>
          <Grid.Col span={4}>
            <Skeleton style={{ height: '310px' }} className="mx-8" visible />
          </Grid.Col>
          <Grid.Col span={4}>
            <Skeleton style={{ height: '310px' }} className="mx-8" visible />
          </Grid.Col>
          <Grid.Col span={4}>
            <Skeleton style={{ height: '310px' }} className="mx-8" visible />
          </Grid.Col>
        </>
        )}
        {(configs.loading !== loadingStates.LOADING && configs.data?.noticesStatusWise)
        && (
        <>
          <Grid.Col span={4}>
            <div
              // className="border-solid border-gray-100 border-2 rounded-lg p-4"
              // style={{ border: 'none', boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1)' }}
              className="border-2 border-none rounded-lg p-4"
              style={{ boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1) ' }}
            >
              <div>Notice Requests by status</div>
              <div
                style={{
                  height: '200px',
                  width: '100%',
                  padding: '16px',
                }}
              >
                <Doughnut
                  id="chart-1"
                  data={dataForStatus(configs.data.noticeRequestsStatusWise)}
                  options={{ ...chartOptions }}
                />
              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={4}>
            <div
              className="border-2 border-none rounded-lg p-4"
              style={{ boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1) ' }}
            >
              <div>Notices by status</div>
              <div
                style={{
                  height: '200px',
                  width: '100%',
                  padding: '16px',
                }}
              >
                <Doughnut
                  id="chart-1"
                  data={dataForStatus(configs.data.noticesStatusWise)}
                  options={{ ...chartOptions }}
                />
              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={4}>
            <div
              className="border-2 border-none rounded-lg p-4"
              style={{ boxShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.1) ' }}
            >
              <div>Notices tasks by status</div>
              <div
                style={{
                  height: '200px',
                  width: '100%',
                  padding: '16px',
                }}
              >
                <Doughnut
                  data={taskStatusWise(configs.data.noticesTaskStatusWise)}
                  options={chartOptions}
                />
              </div>
            </div>
          </Grid.Col>
        </>
        )}
      </Grid>
    </div>
  );
};

export default NoticesAnalytics;
