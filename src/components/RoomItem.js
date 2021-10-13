/* eslint-disable arrow-body-style */
import React from 'react';
import TimeAgo from 'timeago-react';

const RoomItem = ({ room }) => {
  const { created, name } = room;



  return (
    <>
      <div className="d-flex  align-items-center">
        <h3 className="text-disapperar" style={{ marginRight: '5em' }}>
          {name}
        </h3>
        <TimeAgo
          datetime={new Date(created)}
          className="font-normal text-black-45"
        />
      </div>

      <div className="d-flex align-items-center text-black-70">
        <span>No Messages yet...</span>
      </div>
    </>
  );
};

export default RoomItem;
