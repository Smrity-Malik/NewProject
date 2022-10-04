import actions from '../actions';

const notification = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_NOTIFICATION:
      return action.payload;
    default:
      return state;
  }
};

export default notification;
