/* eslint-disable react/no-danger */
import {
  Button, Pagination, Skeleton, Text, Box, ActionIcon,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import { Refresh } from 'tabler-icons-react';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { getEmailsApi, getEmailsFromThreadApi } from '../../utilities/apis/emails';
import {
  formatDate, formatTime, handleFromEmail, loadingStates,
} from '../../utilities/utilities';
import EmailBox from '../EmailBox';
import SingleEmailView from './SingleEmailView';

const EmailTab = ({ parent, parentId }) => {
  const [bgColor, setBgColor] = useState(false);
  const [configs, setConfigs] = useState({
    loadingThreads: loadingStates.NO_ACTIVE_REQUEST,
    threadsCount: null,
    loadingEmails: loadingStates.NO_ACTIVE_REQUEST,
    activeMailThreadIndex: null,
    threads: null,
    emails: null,
    threadPage: 1,
    emailBoxView: false,
  });

  const { emails } = configs;

  const selectThreadIndex = (index) => {
    setConfigs((stateC) => ({
      ...stateC,
      activeMailThreadIndex: index,
      emails: null,
    }));
  };

  const getEmailsFromThread = async (threadIndex) => {
    setConfigs((stateC) => ({
      ...stateC,
      loadingEmails: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(getEmailsFromThreadApi({
      page: configs.threadPage,
      threadId: configs.threads[threadIndex].id,
    }));
    if (resp?.success) {
      setConfigs((stateC) => ({
        ...stateC,
        loadingEmails: loadingStates.NO_ACTIVE_REQUEST,
        emails: resp.emails,
      }));
    } else {
      showNotification({
        color: 'red',
        title: 'Email',
        message: 'Failed to load emails',
      });
      setConfigs((stateC) => ({
        ...stateC,
        loadingEmails: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };

  const getEmailThreads = async () => {
    setConfigs((stateC) => ({
      ...stateC,
      loadingThreads: loadingStates.LOADING,
      emails: null,
      activeMailThreadIndex: null,
    }));
    const resp = await apiWrapWithErrorWithData(getEmailsApi({
      page: configs.threadPage,
      parent,
      parentId,
    }));
    if (resp?.success) {
      setConfigs((stateC) => ({
        ...stateC,
        loadingThreads: loadingStates.NO_ACTIVE_REQUEST,
        threads: resp.threads,
        threadsCount: resp.threadsCount,
      }));
    } else {
      showNotification({
        color: 'red',
        title: 'Email threads',
        message: 'Failed to load email threads',
      });
      setConfigs((stateC) => ({
        ...stateC,
        loadingThreads: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };

  useEffect(() => {
    getEmailThreads();
  }, [configs.threadPage]);

  useEffect(() => {
    getEmailsFromThread(configs.activeMailThreadIndex);
  }, [configs.activeMailThreadIndex]);

  return (
    <>
      {configs.emailBoxView && (
      <EmailBox
        initialData={{
          to: null,
          subject: `${parent} #${parentId}`,
          direction: 'outgoing',
        }}
        onClose={() => {
          setConfigs((stateC) => ({
            ...stateC,
            emailBoxView: false,
          }));
        }}
        parentResource={parent}
        parentResourceId={parentId}
      />
      )}
      <div className="flex flex-col mt-4">
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            cursor: 'pointer',

            '&:hover': {
              backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
            },
          })}
          className="mb-4"
        >
          <Text>{`${parent}-${parentId}@em7388.truecounsel.in`}</Text>
        </Box>

        <div className="flex justify-between">
          <Text>Email</Text>
          <div className="flex">
            <ActionIcon
              onClick={getEmailThreads}
              color="green"
              className="mr-4"
            >
              <Refresh />
            </ActionIcon>
            <Button onClick={
                () => {
                  setConfigs((stateC) => ({
                    ...stateC,
                    emailBoxView: true,
                  }));
                }
            }
            >
              New Email
            </Button>
          </div>
        </div>
        <div className="flex w-full">
          <div className={`flex flex-col my-4 ${configs.activeMailThreadIndex === null ? 'w-full' : ''}`}>
            <Text color="lime" size="sm">Email threads</Text>
            {(configs.loadingThreads === loadingStates.LOADING || !configs.threads)
                && (
                <div className="flex flex-col">
                  <Skeleton height={100} radius="md" className="my-1 w-full" />
                  <Skeleton height={100} radius="md" className="my-1 w-full" />
                  <Skeleton height={100} radius="md" className="my-1 w-full" />
                  <Skeleton height={100} radius="md" className="my-1 w-full" />
                  <Skeleton height={100} radius="md" className="my-1 w-full" />
                </div>
                )}
            {configs.threads && configs.loadingThreads !== loadingStates.LOADING
        && (
        <>
          {configs.threads.map(
            (thread, index) => (
              <div
                onClick={() => {
                  selectThreadIndex(index);
                  setBgColor(!bgColor);
                }}
                // eslint-disable-next-line max-len
                // className={`flex justify-between py-6 pl-6 pr-3 rounded border-blue-100 hover:bg-green-50 cursor-pointer border-solid my-2 px-2 ${configs.activeMailThreadIndex !== null ? 'flex-col w-80 items-start' : 'items-center'} ${configs.activeMailThreadIndex === index && 'bg-green-50'}`}
                className={`flex justify-between py-6 pl-6 pr-3 rounded border-blue-100 hover:bg-green-50 cursor-pointer border-solid my-2 px-2 ${configs.activeMailThreadIndex !== null ? 'flex-col w-80 items-start' : 'items-center'} `}
                style={bgColor ? { backgroundColor: '#46BDE1', color: '#FFFFFF' } : { backgroundColor: '#FFFFFF', color: '#121212' }}
              >
                <div className="flex flex-col my-1">
                  <div className="flex flex-row items-center">
                    <Text className="mb-2 mr-3" size="sm">
                      {thread.emails?.[0]?.direction === 'outgoing'
                        ? thread.emails?.[0]?.to?.[0]
                        : handleFromEmail(thread.emails[0].from)}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    {/* <Text color="gray" size="sm"> */}
                    <Text color={bgColor ? '#FFFFFF' : 'gray'} size="sm">
                      Subject:
                    </Text>
                    <Text size="sm" className="ml-2">
                      {thread.subject}
                    </Text>
                  </div>
                </div>
                <Text color={bgColor ? '#FFFFFF' : 'gray'} size="sm">
                  {`${formatDate(thread.emails[0].createdAt)}, ${formatTime(thread.emails[0].createdAt)}`}
                </Text>
              </div>
            ),
          )}
        </>
        )}
            {(configs.threadsCount && configs.loadingThreads !== loadingStates.LOADING)
        && (
        <Pagination
          onChange={(page) => {
            setConfigs({
              ...configs,
              threadPage: page,
            });
          }}
          total={Math.ceil(configs.threadsCount / 5)}
          page={configs.threadPage}
        />
        )}
          </div>
          {bgColor && (
          <>
            {(configs.activeMailThreadIndex !== null
         && (!emails || configs.loadingEmails === loadingStates.LOADING))
        && (
        <div className="flex flex-col w-full p-4 mt-6">
          <Skeleton height={100} radius="md" className="my-1 w-full" />
          <Skeleton height={100} radius="md" className="my-1 w-full" />
          <Skeleton height={100} radius="md" className="my-1 w-full" />
          <Skeleton height={100} radius="md" className="my-1 w-full" />
          <Skeleton height={100} radius="md" className="my-1 w-full" />
        </div>
        )}
          </>
          )}
          {/* {(configs.activeMailThreadIndex !== null
         && (!emails || configs.loadingEmails === loadingStates.LOADING))
        && (
        <div className="flex flex-col w-full p-4 mt-6">
          <Skeleton height={100} radius="md" className="my-1 w-full" />
          <Skeleton height={100} radius="md" className="my-1 w-full" />
          <Skeleton height={100} radius="md" className="my-1 w-full" />
          <Skeleton height={100} radius="md" className="my-1 w-full" />
          <Skeleton height={100} radius="md" className="my-1 w-full" />
        </div>
        )} */}
          {(configs.activeMailThreadIndex !== null && emails)
        && (
        <div className="flex flex-col w-full mt-6">
            {emails.map(
              (email) => (
                <SingleEmailView email={email} />
              ),
            )}

        </div>
        )}
        </div>

      </div>
    </>
  );
};

export default EmailTab;
