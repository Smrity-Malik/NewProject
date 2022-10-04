import actions from '../actions';

const workspaceUsers = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_WORKSPACE_USERS:
      return action.payload;
    default:
      return state;
  }
};

export default workspaceUsers;
