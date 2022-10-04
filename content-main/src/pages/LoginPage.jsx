/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PasswordInput, TextInput, Button } from '@mantine/core';
import { At, Lock } from 'tabler-icons-react';
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '@mantine/notifications';
import {
  assetsPrefix, getValueForInput, loadingStates, validateEmail,
} from '../utilities/utilities';
import { apiWrapWithErrorWithData } from '../utilities/apiHelpers';
import { usersLogin } from '../utilities/apis/users';
import { setCookiesSession } from '../cookiesSession';
import actions from '../redux/actions';
import styles from '../components/Header/AppHeader.module.css';
import { serviceProviderLoginApi } from '../utilities/apis/serviceProvider';
import { selectIsUserLoggedIn } from '../redux/selectors';

const LoginPage = () => {
  const [configs, setConfigs] = useState({
    modalFormOpen: false,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    requestNoticeFormShow: false,
    email: '',
    password: '',
    errors: {},
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation;
  const { redirectAfterLogin } = state || {};
  const clientId = '303250175875-5cu7et5frerce78fb51vvvc54i77fb4o.apps.googleusercontent.com';

  const inputHandler = (name) => (input) => {
    const value = getValueForInput(input);
    setConfigs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const responseGoogleSuccess = async (response) => {
    setConfigs({ ...configs, loading: loadingStates.LOADING });
    let token = null;
    try {
      if (response.credential) {
        token = response.credential;
      }
    } catch (e) {
      console.log(e);
      alert('Failed to log in. Please refresh page.');
    }
    if (token) {
      const apiResponse = await apiWrapWithErrorWithData(usersLogin({ accessToken: token }));
      if (apiResponse?.success) {
        const trueCounselJwtToken = apiResponse?.token;
        if (trueCounselJwtToken) {
          setCookiesSession('trueCounselUserData', JSON.stringify(apiResponse), 2);
          dispatch({
            type: actions.SET_USER_DATA,
            payload: apiResponse.user,
          });
          navigate('/app');
        }
        setConfigs({ ...configs, loading: loadingStates.NO_ACTIVE_REQUEST });
      } else {
        setConfigs({ ...configs, loading: loadingStates.FAILED });
        alert('Something went wrong. Please try refreshing the page.');
      }
    }
  };

  useGoogleOneTapLogin({
    onError: (error) => console.log(error),
    onSuccess: (response) => console.log(response),
    googleAccountConfigs: {
      client_id: clientId, // Your google client id here !!!
      callback: responseGoogleSuccess,
    },
    disabled: true,
  });
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  useEffect(() => {
    window.handleGoogleLogin = responseGoogleSuccess;
    if (isUserLoggedIn) {
      navigate(redirectAfterLogin || '/app');
    }
    return () => {
      window.handleGoogleLogin = () => alert('Login not allowed at this point.');
    };
  }, []);

  const loginHandler = async () => {
    const { email, password } = configs;
    setConfigs((prevState) => ({
      ...prevState,
      errors: {},
    }));
    const keys = {};
    if (!validateEmail(email)) {
      keys.email = 'Invalid Email';
    }
    if (!password || !password.length) {
      keys.password = 'Invalid Password';
    }
    if (Object.keys(keys).length) {
      setConfigs((prevState) => ({
        ...prevState,
        errors: keys,
      }));
      showNotification({
        title: 'Login',
        message: 'Please check inputs.',
        color: 'red',
      });
      return;
    }
    setConfigs((prevState) => ({
      ...prevState,
      loading: loadingStates.LOADING,
    }));
    const resp = await apiWrapWithErrorWithData(serviceProviderLoginApi({
      email: configs.email,
      password: configs.password,
    }));
    if (resp?.success && resp?.token && resp?.user) {
      setConfigs((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      setCookiesSession('trueCounselUserData', JSON.stringify(resp), 2);
      dispatch({
        type: actions.SET_USER_DATA,
        payload: resp.user,
      });
      navigate(redirectAfterLogin || '/app');
    } else {
      setConfigs((prevState) => ({
        ...prevState,
        loading: loadingStates.NO_ACTIVE_REQUEST,
      }));
      showNotification({
        title: 'Login',
        message: resp.message || "Couldn't login",
        color: 'red',
      });
    }
  };

  return (
    <div className="w-screen h-screen bg-white">
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col w-80">
          <img className={styles.logo} src={`${assetsPrefix}/images/trueCounselLogo.svg`} alt="TrueCounsel" />
          <TextInput
            value={configs.email}
            onChange={inputHandler('email')}
            className="my-2"
            label="Email"
            placeholder="Enter email"
            icon={<At size={14} />}
            error={configs.errors.email}
          />
          <PasswordInput
            value={configs.password}
            onChange={inputHandler('password')}
            className="my-2"
            label="Password"
            placeholder="Enter password"
            icon={<Lock size={14} />}
            error={configs.errors.password}
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              loginHandler();
            }}
            disabled={configs.loading === loadingStates.LOADING}
            className="my-2"
          >
            Login
          </Button>
          <div className="flex justify-center my-2">
            <div
              id="g_id_onload"
              data-client_id={clientId}
              data-callback="handleGoogleLogin"
              data-auto_prompt="false"
            />
            <div
              className="g_id_signin"
              data-type="standard"
              data-size="large"
              data-theme="outline"
              data-text="sign_in_with"
              data-shape="rectangular"
              data-logo_alignment="left"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
