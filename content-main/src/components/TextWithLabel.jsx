import React from 'react';
import { Text } from '@mantine/core';
import styles from './TextWithLabel.module.css';

const TextWithLabel = ({
  label, text, labelColor, textColor, labelClassNames, textClassNames, className,
}) => (
  <div
    className={`flex flex-col m-2 ${className || ''}`}
    style={{
      minWidth: '25rem',
    }}
  >
    <Text className={`${(labelClassNames || '')} ${styles.label}`} color={labelColor || ''}>{label}</Text>
    <Text className={`${(textClassNames || '')} ${styles.text}`} color={textColor || ''}>{text}</Text>
  </div>
);

export default TextWithLabel;
