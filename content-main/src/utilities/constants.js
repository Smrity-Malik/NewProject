let env = null;
if (process.env.REACT_APP_ENV === 'LOCALHOST') {
  env = 'local';
}
if (process.env.REACT_APP_ENV === 'DEVELOPMENT') {
  env = 'dev';
}
if (process.env.REACT_APP_ENV === 'STAGING') {
  env = 'stage';
}
if (process.env.REACT_APP_ENV === 'PRODUCTION') {
  env = 'prod';
}
const constants = {
  env,
  apiHost: process.env.REACT_APP_API_HOST,
  environment: process.env.REACT_APP_ENV,
  workspaceId: process.env.REACT_APP_WORKSPACE_ID,
  utilityHost: process.env.REACT_APP_API_UTILITY_HOST,
};

export default constants;
