import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsUserLoggedIn } from '../../redux/selectors';
import NewLandingPageRedirect from '../../pages/NewLandingPageRedirect';

// eslint-disable-next-line react/prop-types
const Protected = ({ children }) => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const location = useLocation();
  if (isUserLoggedIn) {
    return (children);
  }
  if (process.env.REACT_APP_ENV === 'LOCALHOST') {
    return (
      <Navigate
        to={process.env.REACT_APP_LANDING_PAGE_URL}
        replace
        state={{
          redirectAfterLogin: location.pathname,
        }}
      />
    );
  }
  return <NewLandingPageRedirect />;
};

export default Protected;
