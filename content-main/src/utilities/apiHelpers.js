import { getCookiesSession } from '../cookiesSession';

export const headersProvider = () => {
  let token = null;
  try {
    const data = JSON.parse(getCookiesSession('trueCounselUserData'));
    token = data.token;
  } catch (e) {
    console.log(e);
  }
  return {
    Authorization: token,
  };
};

export const headersProviderWithAuthorization = headersProvider;

export const apiWrap = (apiPromise) => new Promise((resolve) => {
  apiPromise.then((res) => resolve(res.data)).catch((error) => {
    resolve(undefined);
    // eslint-disable-next-line no-console
    console.error(error);
  });
});

export const apiWrapWithoutData = (apiPromise) => new Promise((resolve) => {
  apiPromise.then((res) => resolve(res)).catch((error) => {
    resolve();
    // eslint-disable-next-line no-console
    console.error(error);
  });
});

export const apiWrapWithoutDataWithError = (apiPromise) => new Promise((resolve) => {
  apiPromise.then((res) => resolve(res)).catch((error) => {
    if (error.response) {
      resolve(error.response);
    } else {
      resolve(undefined);
    }
  });
});

// When using following function, make sure to check data for success, usually a success key
// do not rely on promise resolve
export const apiWrapWithErrorWithData = (apiPromise) => new Promise((resolve) => {
  apiPromise.then((res) => resolve(res.data)).catch((error) => {
    if (error.response) {
      resolve(error.response.data);
    } else {
      resolve(undefined);
    }
  });
});
