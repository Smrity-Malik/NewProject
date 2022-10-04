import actions from '../actions';

const workspaceSettings = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_WORKSPACE_SETTINGS:
      return action.payload;
    default:
      return state;
  }
};

export default workspaceSettings;
