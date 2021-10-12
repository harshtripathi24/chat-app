/* eslint-disable arrow-body-style */
import React from 'react';
import TimeAgo from 'timeago-react';

const RoomItem = () => {
  return (
    <>
      <div className="d-flex  align-items-center">
        <h3 className="text-disapperar" style={{ marginRight: '5em' }}>
          Room Name{' '}
        </h3>
        <TimeAgo datetime={new Date()} className="font-normal text-black-45" />
      </div>

      <div className="d-flex align-items-center text-black-70">
        <span>No Messages yet...</span>
      </div>
    </>
  );
};

export default RoomItem;
