import actions from '../actions';

const userData = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_USER_DATA:
      return action.payload;
    default:
      return state;
  }
};

export default userData;
