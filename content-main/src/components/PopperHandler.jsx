import React, { useState } from 'react';
import { Anchor, Popper } from '@mantine/core';

const PopperHandler = ({ componentToRender, expandedComponent }) => {
  const [visible, setVisible] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);

  return (
    <>
      <Anchor
        ref={setReferenceElement}
        onClick={(e) => {
          e.stopPropagation();
          setVisible((m) => !m);
        }}
      >
        {componentToRender}
      </Anchor>
      <Popper
        arrowSize={5}
        withArrow
        mounted={visible}
        referenceElement={referenceElement}
        transition="pop-top-left"
        transitionDuration={200}
      >
        {expandedComponent}
      </Popper>
    </>
  );
};

export default PopperHandler;
