/* eslint-disable arrow-body-style */
import React from 'react';
import TimeAgo from 'timeago-react';
import ProfileAvatar from './ProfileAvatar';

const RoomItem = ({ room }) => {
  const { created, name, lastMessage } = room;

  return (
    <>
      <div className="d-flex  align-items-center">
        <h3 className="text-disapperar" style={{ marginRight: '5em' }}>
          {name}
        </h3>
        <TimeAgo
          datetime={
            lastMessage ? new Date(lastMessage.created) : new Date(created)
          }
          className="font-normal text-black-45"
        />
      </div>

      <div className="d-flex align-items-center text-black-70">
        {lastMessage ? (
          <>
            <div className="d-flex align-items-center">
              <ProfileAvatar
                src={lastMessage.author.avatar}
                name={lastMessage.author.name}
                size="sm"
              />
            </div>
            <div className="text-disapperar ml-2">
              <div className="italic">{lastMessage.author.name}</div>
              <h6>{lastMessage.text}</h6>
            </div>
          </>
        ) : (
          <span>No Messages yet...</span>
        )}
      </div>
    </>
  );
};

export default RoomItem;
