/* eslint-disable arrow-body-style */
import React, { memo } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery, useModalState } from '../../../misc/Custom-Hooks';
import { database } from '../../../misc/firebase';
import EditableInput from '../../EditableInput';

const EditRoomBtnDrawer = () => {
  const { isOpen, close, open } = useModalState();
  const name = useCurrentRoom(v => v.name);
  const description = useCurrentRoom(v => v.description);
  const isMobile = useMediaQuery('(max-width: 992px )');

  const { chatId } = useParams();

  const updateData = (key, value) => {
    database
      .ref(`rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('Successfully Updatted', 4000);
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  };

  const onNameSave = newName => {
    updateData('name', newName);
  };

  const onDescriptionSave = newDesc => {
    updateData('description', newDesc);
  };

  return (
    <div>
      <Button className="br-circle " size="sm" color="red" onClick={open}>
        A
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="right">
        <Drawer.Header>
          <Drawer.Title>Edit Room</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body>
          <EditableInput
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className="mb-2">Name: </h6>}
            emptyMsg="Name Cannot Be Empty"
            wrapperClassName="mt-3"
          />
          <EditableInput
            componentClass="textarea"
            rows={5}
            initialValue={description}
            onSave={onDescriptionSave}
            label={<h6 className="mb-2">Description: </h6>}
            emptyMsg="Description can not be empty"
            wrapperClassName="mt-3"
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button block onClick={close}>
            Close
          </Button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
};
export default memo(EditRoomBtnDrawer);
