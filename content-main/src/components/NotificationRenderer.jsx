import React from 'react';
import { Button, Text } from '@mantine/core';
import {
  formatDistanceToNowStrict, parseISO,
} from 'date-fns';
import { useSelector } from 'react-redux';
import { getDatabase, ref, set } from 'firebase/database';
import styles from './NotificationRenderer.module.css';
import TaskModal from './TaskModal';
import { selectUserData } from '../redux/selectors';
import constants from '../utilities/constants';

const NotificationRenderer = ({ incomingNotification, navigate }) => {
  const notification = incomingNotification;
  let action = null;
  const userData = useSelector(selectUserData);
  const markAsSeen = () => {
    // if (notification.seen) {
    //   return;
    // }
    if (notification.key) {
      const notificationKey = notification.key;
      const currentUTCtimeISO = (new Date()).toISOString();
      // TODO: Change user id
      const userId = userData.id || 'sample-userid-2283-38383';
      const db = getDatabase();
      const nodeRef = ref(db, `${constants.env}/notifications/${userId}/${notificationKey}/seen`);
      return set(nodeRef, currentUTCtimeISO);
    }
    return null;
  };
  if (notification.metadata) {
    if (notification.metadata?.type === 'task' && notification.metadata?.id) {
      action = (
        <TaskModal
          taskToLoad={notification.metadata.id}
          mode="view"
          componentToShow={<Button onClick={() => { markAsSeen(); }}>View Task</Button>}
        />
      );
    }
    if (notification.metadata?.type === 'case' && notification.metadata?.id) {
      const { id } = notification.metadata;
      action = (
        <Button onClick={() => {
          const url = `/app/dispute-manager/cases/details/${id}`;
          navigate(url);
          markAsSeen();
        }}
        >
          Go to Case
        </Button>
      );
    }
    if (notification.metadata?.type === 'notice' && notification.metadata?.id) {
      const { id } = notification.metadata;
      action = (
        <Button onClick={(e) => {
          e.stopPropagation();
          const url = `/app/view/notice/${id}`;
          navigate(url);
          markAsSeen();
        }}
        >
          Go to Notice
        </Button>
      );
    }
    if (notification.metadata?.type === 'notice-request' && notification.metadata?.id) {
      const { id } = notification.metadata;
      action = (
        <Button onClick={(e) => {
          e.stopPropagation();
          const url = `/app/view/notice-request/${id}`;
          navigate(url);
          markAsSeen();
        }}
        >
          Go to Notice
        </Button>
      );
    }
  }
  return (
    <div className={`flex flex-row w-full rounded my-1 p-4 ${notification.seen ? styles.containerSeen : styles.containerUnSeen}`}>
      <div className={`${styles.mainDiv} flex flex-col`}>
        <Text className="my-2">
          {notification.notificationText}
        </Text>
        {notification.time
              && (
              <Text className="my-2">
                {formatDistanceToNowStrict(parseISO(notification.time))}
              </Text>
              )}
      </div>
      <div className={`${styles.actionDiv} flex flex-col justify-right items-end`}>
        {action}
        {notification.seen
                && (
                <Text className="mt-4">
                  Seen
                  {' '}
                  {formatDistanceToNowStrict(parseISO(notification.seen))}
                </Text>
                )}
      </div>
    </div>
  );
};

export default NotificationRenderer;
