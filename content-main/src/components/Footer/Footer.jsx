import React from 'react';
import { assetsPrefix } from '../../utilities/utilities';
import styles from './Footer.module.css';

const Footer = () => (
  <div className={`flex flex-row w-full justify-between items-center ${styles.footerContainer}`}>
    <div>
      <img className={styles.logo} src={`${assetsPrefix}/images/trueCounselLogo.svg`} alt="TrueCounsel" />
    </div>
    <div className={styles.copyRightText}>© 2021 TrueCounsel. All rights reserved</div>
    <div className="flex flex-row">
      <img className="mx-2" src={`${assetsPrefix}/images/social-icons/social-icons.svg`} alt="TrueCounsel Social" />
      <img className="mx-2" src={`${assetsPrefix}/images/social-icons/social-icons-1.svg`} alt="TrueCounsel Social" />
      <img className="mx-2" src={`${assetsPrefix}/images/social-icons/social-icons-2.svg`} alt="TrueCounsel Social" />
      <img className="mx-2" src={`${assetsPrefix}/images/social-icons/social-icons-3.svg`} alt="TrueCounsel Social" />
    </div>
  </div>
);

export default Footer;
