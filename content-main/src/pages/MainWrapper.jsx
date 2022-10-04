/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getDatabase, ref, onValue, onChildAdded,
} from 'firebase/database';
import { Howl } from 'howler';
import { BeatLoader } from 'react-spinners';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
// import { getSettings } from '../utilities/apis/settings';
import actions from '../redux/actions';
import { selectIsUserLoggedIn, selectUserData } from '../redux/selectors';
import { userDetails, workspaceUsers } from '../utilities/apis/users';
import { loadingStates, validateEmail } from '../utilities/utilities';
import { deleteCookie, getCookiesSession } from '../cookiesSession';
import constants from '../utilities/constants';
import colors from '../utilities/design';

const sound = new Howl({
  src: ['https://i.cloudup.com/r4ZENSF0Hu.m4a', 'https://i.cloudup.com/2OPb5OYAI2.ogg'],
  html5: true,
});

const MainWrapper = ({ children }) => {
  const [configs, setConfigs] = useState({
    loading: loadingStates.LOADING,
  });

  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const getUserDetails = async () => {
    setConfigs(() => ({
      ...configs,
      loading: loadingStates.LOADING,
    }));
    const response = await apiWrapWithErrorWithData(userDetails());
    if (response?.success && response?.user) {
      dispatch({
        type: actions.SET_USER_DATA,
        payload: response.user,
      });
      setConfigs(() => ({
        ...configs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    } else {
      if (isUserLoggedIn) {
        setConfigs(() => ({
          ...configs,
          loading: loadingStates.NO_ACTIVE_REQUEST,
        }));
        dispatch({
          type: actions.SET_USER_DATA,
          payload: null,
        });
        return;
      }
      if (getCookiesSession('trueCounselUserData')) {
        deleteCookie('trueCounselUserData');
        window.location.href = process.env.REACT_APP_LANDING_PAGE_URL;
      }
      setConfigs(() => ({
        ...configs,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
    }
  };
  const fetchWorkspaceSettings = async () => {
    const db = getDatabase();
    const nodeValue = `${constants.env}/workspace-settings/${constants.workspaceId}`;
    if (window.firebaseValueListenerForWorkspace !== nodeValue) {
      if (window.firebaseValueListenerForWorkspace) {
        console.warn('Reloading due to overlap firebase value listener for workspace settings.');
        window.reload();
      }
      const nodeRef = ref(db, nodeValue);
      onValue(nodeRef, (snapshot) => {
        const data = snapshot.val();
        dispatch({
          type: actions.SET_WORKSPACE_SETTINGS,
          payload: (data || {}),
        });
      });
      window.firebaseValueListenerForWorkspace = nodeValue;
      // window.firebaseValueListenerTime = new Date().getTime();
    }

    // return;
    // const response = await apiWrapWithErrorWithData(getSettings());
    // if (response?.success && response?.settings) {
    //   dispatch({
    //     type: actions.SET_WORKSPACE_SETTINGS,
    //     payload: response.settings,
    //   });
    // } else {
    //   showNotification({
    //     color: 'red',
    //     title: 'Settings',
    //     message: 'Couldn\'t fetch settings',
    //   });
    // }
  };
  const fetchWorkspaceUsers = async () => {
    const response = await apiWrapWithErrorWithData(workspaceUsers());
    if (response?.success && response?.users) {
      dispatch({
        type: actions.SET_WORKSPACE_USERS,
        payload: response.users.filter((user) => validateEmail(user.email)),
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Settings',
        message: 'Couldn\'t fetch users list',
      });
    }
  };
  const userData = useSelector(selectUserData);
  const liveNotificationHandler = (notification) => {
    // wait for 4 seconds after adding value listener.
    if (((new Date().getTime()) - window.firebaseValueListenerTime) < 8000) {
      return;
    }
    if (notification?.notificationText) {
      sound.play();
      showNotification({
        color: notification?.bgColor || 'yellow',
        title: 'New Notification',
        message: notification.notificationText,
        // children: <div>Hello</div>,
      });
    }
  };
  useEffect(() => {
    if (userData?.email) {
      const userUuuid = userData.userUuid || 'sample-userid-2283-38383';
      // TODO: change email to user id
      const db = getDatabase();
      // const nodeValue = `${constants.env}/notifications/${userUuuid}`;
      // if (window.firebaseValueListener !== nodeValue) {
      //   if (window.firebaseValueListener) {
      //     console.warn('Reloading due to overlap firebase value listener');
      //     window.reload();
      //   }
      //   const nodeRef = ref(db, nodeValue);
      //   onValue(nodeRef, (snapshot) => {
      //     const data = snapshot.val();
      //     dispatch({
      //       type: actions.SET_ALL_NOTIFICATION,
      //       payload: transformFirebaseNotifs(data || {}),
      //     });
      //   });
      //   window.firebaseValueListener = nodeValue;
      //   window.firebaseValueListenerTime = new Date().getTime();
      // }

      const nodeAdded = `${constants.env}/notifications/${userUuuid}`;
      if (window.firebaseAddedListener !== nodeAdded) {
        if (window.firebaseAddedListener) {
          console.warn('Reloading due to overlap firebase added listener');
          window.reload();
        }
        const nodeRef = ref(db, nodeAdded);
        onChildAdded(nodeRef, (snapshot) => {
          const data = { ...snapshot.val(), key: snapshot.key };
          if (!data.seen || data.seen === 'false') {
            // dispatch({
            //   type: actions.SET_NOTIFICATION,
            //   payload: { ...data, seen: false },
            // });
            liveNotificationHandler({ ...data, seen: false });
          }
        });
        window.firebaseAddedListener = nodeAdded;
        window.firebaseValueListener = nodeAdded;
        window.firebaseValueListenerTime = new Date().getTime();
      }
    }
  }, [userData?.email, userData?.id]);

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchWorkspaceUsers();
      fetchWorkspaceSettings();
      if (state?.redirectAfterLogin) {
        navigate(state.redirectAfterLogin);
      }
    }
  }, [isUserLoggedIn]);
  useEffect(() => {
    getUserDetails();
  }, []);
  if (configs.loading === loadingStates.LOADING) {
  return (
    <div className="w-screen h-screen grid items-center justify-center">
        <BeatLoader size={10} color={colors.primary} />
    </div>
  );
  }
  return (children);
};
export default MainWrapper;
