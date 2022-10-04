import actions from '../actions';

const allNotification = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_ALL_NOTIFICATION:
      return action.payload;
    default:
      return state;
  }
};

export default allNotification;
