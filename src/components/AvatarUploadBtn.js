/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
import React, { useState, useRef } from 'react';
import { Alert, Avatar, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { database, storage } from '../misc/firebase';
import { useModalState } from '../misc/Custom-Hooks';
import { useProfile } from '../context/profile.context';
import ProfileAvatar from './ProfileAvatar';
import { getUserUpadates } from '../misc/Helper';

const fileInputTypes = '.png, .jpeg, .jpg';

const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];

const isValidFile = file => acceptedFileTypes.includes(file.type);

const toBlob = canvas => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File Process Error'));
      }
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();

  const [img, setImg] = useState(null);

  const { profile } = useProfile();

  const [isLoading, setIsLoading] = useState(false);

  const avatarEditorRef = useRef();

  const onFileInputType = ev => {
    const currentFile = ev.target.files;

    if (currentFile.length === 1) {
      const file = currentFile[0];

      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        Alert.warning(`You Selected the Wrong File type ${file.type}`, 4000);
      }
    }
  };
  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    setIsLoading(true);
    try {
      const blob = await toBlob(canvas);

      const avatarFileRef = storage
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');

      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });

      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

      const updates = await getUserUpadates(
        profile.uid,
        'avatar',
        downloadUrl,
        database
      );

      await database.ref().update(updates);

      Alert.success('Avatar Uploaded Successfully', 4000);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.error(`Error Occured : ${error.message}`, 4000);
    }
  };
  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />

      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select New Avatar
          <input
            type="file"
            name="file"
            className="d-none"
            id="avatar-upload"
            accept={fileInputTypes}
            onChange={onFileInputType}
          />
        </label>

        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>Adjust and Upload new Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-10">
              {img && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1.5}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload New Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
