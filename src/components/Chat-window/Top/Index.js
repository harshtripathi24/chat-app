/* eslint-disable arrow-body-style */
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery } from '../../../misc/Custom-Hooks';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';
import RoomInfoBtnModal from './RoomInfoBtnModal';

const ChatTop = () => {
  const name = useCurrentRoom(v => v.name);
  const isMobile = useMediaQuery('(max-width : 992px)');
  const isAdmin = useCurrentRoom(v => v.isAdmin);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="d-flex text-disappear align-items-center">
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled '
                : 'd-none'
            }
          />
          <span className="text-disappear">{name}</span>
        </h4>
        <ButtonToolbar className="ws-nowrap">
          {isAdmin && <EditRoomBtnDrawer />}
        </ButtonToolbar>
      </div>
      <div className="d-flex justify-content-between alig-items-center">
        <span>todo</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(ChatTop);
