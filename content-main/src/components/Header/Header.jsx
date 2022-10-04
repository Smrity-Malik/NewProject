import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { assetsPrefix } from '../../utilities/utilities';
import styles from './Header.module.css';
import { selectIsUserLoggedIn } from '../../redux/selectors';

const Header = ({ openRequestNoticeForm }) => {
  const navigate = useNavigate();
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <div className={`${styles.headerContainer} flex flex-row w-full justify-between items-center p-16 pr-14`}>
      <div>
        <img className={styles.logo} src={`${assetsPrefix}/images/trueCounselLogo.svg`} alt="TrueCounsel" />
      </div>
      <div>
        {isUserLoggedIn
              && (
              <span
                onClick={() => {
                  navigate('/app');
                }}
                className={`mx-5 cursor-pointer ${styles.headerItem}`}
              >
                App
              </span>
              )}
        <span
          onClick={(e) => {
            e.stopPropagation();
            openRequestNoticeForm();
          }}
          className={`mx-5 cursor-pointer ${styles.headerItem}`}
        >
          Request Notice
        </span>
        <span className={`mx-5 cursor-pointer ${styles.headerItem}`}>About Us</span>
        <span className={`mx-5 ${styles.headerItem}`}>Services</span>
        <span className={`mx-5 mr-0 ${styles.headerItem}`}>Contact Us</span>
      </div>
    </div>
  );
};

export default Header;
