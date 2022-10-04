import React, { useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import colors from '../utilities/design';

const NewLandingPageRedirect = () => {
  useEffect(() => {
    window.location.href = process.env.REACT_APP_LANDING_PAGE_URL;
  }, []);
  return (
    <div className="w-screen h-screen grid items-center justify-center">
      <BeatLoader size={10} color={colors.primary} />
    </div>
  );
};

export default NewLandingPageRedirect;
