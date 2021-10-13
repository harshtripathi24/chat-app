/* eslint-disable arrow-body-style */
import React from 'react';
import { Button, Icon, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useModalState } from '../../../misc/Custom-Hooks';

const RoomInfoBtnModal = () => {
  const { isOpen, close, open } = useModalState();

  const description = useCurrentRoom(v => v.description);

  const name = useCurrentRoom(v => v.name);

  return (
    <>
      <Button appearance="ghost" className="px-0" onClick={open}>
        <Icon icon="info-circle" />
        &nbsp; Room info
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1">Description</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoomInfoBtnModal;
