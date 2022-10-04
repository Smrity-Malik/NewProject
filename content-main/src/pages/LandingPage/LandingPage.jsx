/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import { BeatLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import Header from '../../components/Header/Header';
import styles from './LandingPage.module.css';
import { assetsPrefix, loadingStates } from '../../utilities/utilities';
import Footer from '../../components/Footer/Footer';
import ModalForm from '../../components/ModalForm/ModalForm';
import { usersLogin } from '../../utilities/apis/users';
import { apiWrapWithErrorWithData } from '../../utilities/apiHelpers';
import { setCookiesSession } from '../../cookiesSession';
import actions from '../../redux/actions';
import { selectIsUserLoggedIn, selectUserData } from '../../redux/selectors';

const LandingPage = () => {
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(selectIsUserLoggedIn);
  const userData = useSelector(selectUserData);
  const navigate = useNavigate();
  const [configs, setConfigs] = useState({
    modalFormOpen: false,
    loading: loadingStates.NO_ACTIVE_REQUEST,
    requestNoticeFormShow: false,
  });

  const responseGoogleSuccess = async (response) => {
    setConfigs({ ...configs, loading: loadingStates.LOADING });
    let token = null;
    try {
      if (response.credential) {
        token = response.credential;
        // token = 'ya29.A0ARrdaM8fsy2HTmYB_WNej3ICh0UWen8aY_Ut9PLAotq4JWGnQOgAJLFTGWMJTNWFMhjL_8rI06cbLhkPfbI29zLPx4d9h79mce2hi186tX8MbEjJVQn2IVAnVsW0DiSWuiAi2Rg9CqsE7EX39WP5yGuwkddq';
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
  useEffect(() => {
    window.handleGoogleLogin = responseGoogleSuccess;
    return () => {
      window.handleGoogleLogin = () => alert('Login not allowed at this point.');
    };
  }, []);

  // const responseGoogleFailure = (e) => {
  //   console.log(e);
  //   alert('Failed to log in. Please try refreshing page.');
  // };

  useGoogleOneTapLogin({
    onError: (error) => console.log(error),
    onSuccess: (response) => console.log(response),
    googleAccountConfigs: {
      client_id: '303250175875-5cu7et5frerce78fb51vvvc54i77fb4o.apps.googleusercontent.com', // Your google client id here !!!
      callback: responseGoogleSuccess,
    },
    disabled: true,
  });

  const featureBox1 = [
    'Manage your documents and workflows.',
    'Assign and manage tasks to team members and external professionals',
    'Manage Budget and Payments',
    'get legal updates and notifications for upcoming deadlines',
    'Automated Notices and Case Drafting',
    'Reduced overheads and enhanced performance',
    'Data fully secured with AWS',
    'Regular Notifications and daily case reminders',
  ];

  const featureBox2 = [
    'Along with SaaS features, use our network of professionals to deliver standardised services in cost effective and time saving manner.',
    'We deploy multiple recovery strategies across all buckets',
    'We leverage our strong network of Advocates for Mediation',
    'Assistance in strategising and executing corporate-legal work',
    'Technology with a network of Collection Partners',
    'Regular and Timely Reports',
    'Time-bound resolution coupled with highly efficient services',
    'No arbitrary or overhead costs',
  ];

  const toggleValueHandler = (name) => () => {
    setConfigs({
      ...configs,
      [name]: !configs[name],
    });
  };

  return (
    <div className="flex flex-col w-full">
      <ModalForm
        opened={configs.modalFormOpen}
        setOpened={(opened) => {
          setConfigs({
            ...configs,
            modalFormOpen: opened,
          });
        }}
      />
      <img className={styles.homePageImage} src={`${assetsPrefix}/images/homepage-image.png`} alt="TrueCounsel Dashboard" />
      <Header openRequestNoticeForm={toggleValueHandler('requestNoticeFormShow')} />
      <div className="mt-16 w-1/2 pl-16 mb-40">
        <div className={styles.topHeading}>
          A digital tool to
          <br />
          <span style={{ color: '#46BDE1' }}>
            manage and
            <br />
            optimise legal
            <br />
            operations
          </span>
          {' '}
          for corporates
          <br />
        </div>
        <div className={`mt-8 ml-1 pr-2 ${styles.topSubHeading}`}>
          {/* eslint-disable-next-line max-len */}
          With TrueCounsel, you can stop worrying and chasing after people and start managing all of it smoothly from your workstation !!
        </div>
        <div className="mt-11 flex flex-row items-center">
          <Button
            onClick={() => {
              setConfigs({
                ...configs,
                modalFormOpen: true,
              });
            }}
            className={`${styles.bookDemoBtn} py-4 mr-11`}
          >
            Book A Demo
          </Button>
          {((window.location.hostname.indexOf('app.truecounsel.in') !== -1)
          || (window.location.hostname.indexOf('localhost') !== -1)
          )
          && (
          <div>
            {!userLoggedIn && (
              configs.loading === loadingStates.LOADING ? <BeatLoader size={10} />
                : (
                  <div>
                    <div
                      id="g_id_onload"
                      data-client_id="303250175875-5cu7et5frerce78fb51vvvc54i77fb4o.apps.googleusercontent.com"
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
                ))}
            {userData && (
            <div>
              Welcome,&nbsp;
              {userData.name}
            </div>
            )}
          </div>
          )}
        </div>
      </div>

      <div className="px-16 flex flex-col mb-20">
        <div className={`${styles.sectionHeading} mb-5`}>
          Our
          <span className={styles.textPrimaryColor}>&nbsp;Modules</span>
        </div>
        <div className="flex flex-row justify-between items-center mb-9">
          <span className={`${styles.textSmall} w-1/2`}>
            {/* eslint-disable-next-line max-len */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida aliquam sagittis, morbi magnis aliquet molestie.
          </span>
          <div className={styles.moduleContainer}>
            <div className="flex flex-row mb-3">
              <img className={styles.image} src={`${assetsPrefix}/images/modulesFeature/feature-1.svg`} alt="Agreement Management" />
              <span className={styles.heading}>Agreement Manager</span>
            </div>
            <div className={styles.subHeading}>
              Enables to manage contracts process
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-stretch mb-9 flex-wrap">
          <div className={styles.moduleContainer}>
            <div className="flex flex-row mb-3">
              <img className={styles.image} src={`${assetsPrefix}/images/modulesFeature/feature-2.svg`} alt="Agreement Management" />
              <span className={styles.heading}>Dispute Manager</span>
            </div>
            <div className={styles.subHeading}>
              Enables you to smoothly manage all cases, lawyers and court documents
            </div>
          </div>

          <div className={styles.moduleContainer}>
            <div className="flex flex-row mb-3">
              <img className={styles.image} src={`${assetsPrefix}/images/modulesFeature/feature-3.svg`} alt="Agreement Management" />
              <span className={styles.heading}>IPR Manager</span>
            </div>
            <div className={styles.subHeading}>
              Enables to manage IPR of client
            </div>
          </div>

          <div className={styles.moduleContainer}>
            <div className="flex flex-row mb-3">
              <img className={styles.image} src={`${assetsPrefix}/images/modulesFeature/feature-4.svg`} alt="Agreement Management" />
              <span className={styles.heading}>Compliances</span>
            </div>
            <div className={styles.subHeading}>
              Enables you to organise and do all corporate compliances/filings and license applications with time and effort optimisation
            </div>
          </div>

        </div>
        <div className="flex flex-row justify-between items-center mb-9 items-stretch">

          <div className={styles.moduleContainer}>
            <div className="flex flex-row mb-3">
              <img className={styles.image} src={`${assetsPrefix}/images/modulesFeature/feature-5.svg`} alt="Agreement Management" />
              <span className={styles.heading}>Recovery Manager</span>
            </div>
            <div className={styles.subHeading}>
              Enables to manage contracts process
            </div>
          </div>

          <div className={styles.moduleContainer}>
            <div className="flex flex-row mb-3">
              <img className={styles.image} src={`${assetsPrefix}/images/modulesFeature/feature-6.svg`} alt="Agreement Management" />
              <span className={styles.heading}>Budget Manager</span>
            </div>
            <div className={styles.subHeading}>
              Enables you to run your legal operations as per assigned budgets and in a cost efficient manner
            </div>
          </div>

          <div className={styles.moduleContainer}>
            <div className="flex flex-row mb-3">
              <img className={styles.image} src={`${assetsPrefix}/images/modulesFeature/feature-7.svg`} alt="Agreement Management" />
              <span className={styles.heading}>Custom Module</span>
            </div>
            <div className={styles.subHeading}>
              A customised module for the Client as per its unique requirements
            </div>
          </div>

        </div>
      </div>

      <div className="px-16 flex flex-col mb-20">
        <div className="flex flex-col w-full mt-4 justify-center items-center">
          <div className={`${styles.sectionHeading} mb-5`}>
            Partnership
            <span className={styles.textPrimaryColor}>&nbsp;options</span>
          </div>
          <div className="mb-14">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida aliquam sagittis, morbi magnis aliquet molestie.
          </div>
        </div>
      </div>

      <div className={`w-full ${styles.partnerShipOptionsContainer}`}>
        <div className="flex flex-row items-stretch justify-center relative">
          <img src={`${assetsPrefix}/images/wave.png`} alt="Background" className={styles.waveBg} />
          <div className={`${styles.moduleContainer} ${styles.featuresContainer} p-0 px-11`}>
            <img src={`${assetsPrefix}/images/laptop-icon.svg`} alt="Features" className="mt-7" />
            <span className={`${styles.featuresHeading} mb-4`}>SaaS Platform</span>
            <div className="flex flex-col justify-start item">
              {featureBox1.map(
                (feature) => (
                  <div className="flex flex-row align-top my-3">
                    <img src={`${assetsPrefix}/images/tickFilled.svg`} className="mr-8" alt="Feature" />
                    <span>{feature}</span>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className={`${styles.moduleContainer} ${styles.featuresContainer}`}>
            <img src={`${assetsPrefix}/images/laptop-icon.svg`} alt="Features" className="mt-7" />
            <span className={`${styles.featuresHeading} mb-4`}>SaaS + Operational Assistance</span>
            <div className="flex flex-col justify-start">
              {featureBox2.map(
                (feature) => (
                  <div className="flex flex-row align-top my-3">
                    <img src={`${assetsPrefix}/images/tickFilled.svg`} className="mr-8" alt="Feature" />
                    <span>{feature}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
