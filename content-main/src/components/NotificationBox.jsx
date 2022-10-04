import React from 'react';

const NotificationBox = ({
  pillColor, pillText, description, title, index, seen, actionBtn,
}) => (
  <div
    className="pl-16 pt-7 pb-4 my-1 text-white flex-row items-center justify-between "
    style={{ backgroundColor: seen ? '#86d4eb' : '#46BDE1' }}
  >
    <div className="flex flex-col">
      {index === 0 && (
      <div className="text-xl font-bold mb-6">Notifications</div>
      )}
      <div className="flex flex-row items-center">
        {pillText?.length
            && (
            <div
              className="text-xs p-1 px-2 rounded-xl mr-6"
              style={{ backgroundColor: pillColor }}
            >
              {pillText}
            </div>
            )}
        <div className="text-white font-bold">{title}</div>
      </div>
      <div className="text-sm mt-3">{description}</div>
    </div>
    <div className="my-2">{actionBtn}</div>
  </div>
);

export default NotificationBox;
