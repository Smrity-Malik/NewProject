/* eslint-disable max-len */

export const selectUserData = (store) => store.userData;

export const selectIsUserLoggedIn = (store) => (!!store?.userData?.email && !!store?.userData?.email);

export const selectWorkspaceSettings = (store) => store?.workspaceSettings;

export const selectAllNotifications = (store) => store.allNotification;

export const selectNotification = (store) => store.notification;

export const selectAllWorkspaceUsers = (store) => store.workspaceUsers;
