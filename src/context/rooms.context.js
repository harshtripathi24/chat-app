import React, { createContext, useState, useEffect, useContext } from 'react';
import { database } from '../misc/firebase';
import { transformArrayWithId } from '../misc/Helper';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  // eslint-disable-next-line no-unused-vars
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const roomListRef = database.ref('rooms');

    roomListRef.on(
      'value',
      snap => {
        const data = transformArrayWithId(snap.val());
        setRooms(data);

        return () => {
          roomListRef.off();
        };
      },
      []
    );
  }, []);

  return <RoomContext.Provider value={rooms}>{children}</RoomContext.Provider>;
};

export  const useRooms = () =>  useContext(RoomContext);
