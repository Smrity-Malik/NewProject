import React from 'react';
import styles from './SignatureStatusMain.module.css';
import SignatureStatus from './SignatureStatus';

function SignatureStatusMain() {
  return (
    <div className="flex flex-col pt-12 px-6">
      <div className={`${styles.signHeading} px-2`}>
        Signature request has been sent to following parties.
      </div>
      <div className={`${styles.statusHeading} mt-8`}>Signature Status Pending</div>
      <div className={`${styles.statusText} mt-7`}>
        Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit u
        ltrices enim cursus. Leo sapien, pretium duis est eu volutpat interdum eu non.
        Odio eget nullam elit laoreet. Libero at felis nam at orci venenatis rutrum nunc.
        Etiam mattis ornare pellentesque iaculis enim.
      </div>
      <SignatureStatus status="Signed" />
      <SignatureStatus status="Pending" />
    </div>

  );
}

export default SignatureStatusMain;
