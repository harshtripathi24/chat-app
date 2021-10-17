/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModalState } from '../../../misc/Custom-Hooks';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachMentBtnModal = ({ afterUpload }) => {
  const [isOpen, close, open] = useModalState();
  const [isLoading, setIsLoading] = useState(false);

  const { chatId } = useParams();

  const [fileList, setFileList] = useState();

  const onChange = fileArr => {
    const filtered = fileArr
      .filter(el => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      setIsLoading(true);

      const uploadPromises = fileList.map(f => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
      });

      const uploadSnapShot = await Promise.all(uploadPromises);

      const shapPromises = uploadSnapShot.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: snap.ref.getDownloadURL(),
        };
      });

      const files = await Promise.all(shapPromises);

      await afterUpload(files);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  return (
    <>
      <InputGroup.Button color="green" onClick={open}>
        <Icon icon="upload" />
      </InputGroup.Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            Send to Chat
          </Button>
          <div className="text-right mt-2">
            Only Files less then 5 MB are Allowed
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachMentBtnModal;
