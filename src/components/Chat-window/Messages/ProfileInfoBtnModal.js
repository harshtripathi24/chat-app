/* eslint-disable arrow-body-style */
import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/Custom-Hooks';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, close, open } = useModalState();

  const { name, avatar, created } = profile;

  const memberSince = new Date(created).toLocaleDateString();

  return (
    <>
      <Button {...btnProps} onClick={open}>
        {name}
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{name} Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200 img-fullsize font-huge"
          />

          <h4 className="mt-2">{name}</h4>

          <p>Member Since : {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;
