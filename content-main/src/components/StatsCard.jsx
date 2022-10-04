import React from 'react';

const StatsCard = ({ cardText, textNumber, bulletPoints }) => (
  <div className="flex flex-col p-6 cardShadow mx-2 mt-2 w-64">
    <div className="text-sm font-semibold mb-7" style={{ color: '#8A92A6' }}>
      {cardText}
    </div>
    <div className="flex flex-row items-center">
      <img src="/Graph.png" alt="" className="w-10 h-9 mr-6" />
      <span className="text-2xl font-medium">{textNumber}</span>
    </div>
    <div className="flex flex-col mt-7">
      {bulletPoints.map((ob) => (
        <div className="flex my-1 items-center">
          <div
            className="w-4 h-4 rounded-xl  mr-7"
            style={{ backgroundColor: ob.bulletColor }}
          />
          <div className="text-black">
            {ob.bulletText}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default StatsCard;
