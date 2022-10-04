import React from 'react';
import { BarLoader } from 'react-spinners';

const LazyLoading = () => (
  <div className="fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
    <BarLoader width={150} height={5} color="#30BEF5" />
  </div>
);

export default LazyLoading;
