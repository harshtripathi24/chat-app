/* eslint-disable arrow-body-style */
import React, { memo, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase';
import { database } from '../../../misc/firebase';
import { useProfile } from '../../../context/profile.context';
import AttachMentBtnModal from './AttachMentBtnModal';
import AudioMessageBtn from './AudioMessageBtn';

function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      created: profile.created,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    created: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
}

const ChatBottom = () => {
  const [input, setInput] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { profile } = useProfile();
  const { chatId } = useParams();

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }

    const msgData = assembleMessage(profile, chatId);

    msgData.text = input;

    const updates = {};
    const messageId = database.ref('messages').push().key;

    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };
    setIsLoading(true);
    try {
      await database.ref().update(updates);
      setInput('');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.error(`Error occured: ${err.message}`, 4000);
    }
  };

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async files => {
      setIsLoading(true);

      const updates = {};
      files.forEach(file => {
        const msgData = assembleMessage(profile, chatId);

        msgData.file = file;
        const messageId = database.ref('messages').push().key;

        updates[`/messages/${messageId}`] = msgData;
      });

      const lastMsgId = Object.keys(updates).pop();

      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        Alert.error(`Error occured: ${err.message}`, 4000);
      }
    },
    [chatId, profile]
  );

  return (
    <InputGroup>
      <AttachMentBtnModal afterUpload={afterUpload} />
      <AudioMessageBtn afterUpload={afterUpload} />
      <Input
        placeholder="Write a new message here...."
        value={input || ''}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />

      <InputGroup.Button
        color="blue"
        appearance="primary"
        onClick={onSendClick}
        disabled={isLoading}
      >
        <Icon icon="send" />
      </InputGroup.Button>
    </InputGroup>
  );
};

export default memo(ChatBottom);
