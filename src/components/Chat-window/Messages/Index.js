/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable arrow-body-style */
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformArrayWithId } from '../../../misc/Helper';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messageRef = database.ref('/messages');

function shouldScrollToBottom(node, threshhold = 5) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshhold;
}

const Messages = () => {
  const { chatId } = useParams();

  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;
      messageRef.off();

      messageRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snap => {
          const data = transformArrayWithId(snap.val());

          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }

          setMessages(data);
        });

      setLimit(p => p + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;

      node.scrollTop = newHeight - oldHeight;
    }, 500);
  }, [limit, loadMessages]);

  useEffect(() => {
    const node = selfRef.current;

    loadMessages();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 500);

    return () => {
      messageRef.off('value');
    };
  }, [selfRef, loadMessages]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      let alertMsg;

      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Admin Permission Removed';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin Permission Granted';
          }
        }
        return admins;
      });

      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const messagesRef = database.ref(`/messages/${msgId}`);

    const { uid } = auth.currentUser;

    let alertMsg;

    await messagesRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like Removed';
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Like Added';
        }
      }
      return msg;
    });

    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm('Delete This Message')) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }
      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);

        Alert.info('Message Has been Deleted', 4000);
      } catch (err) {
        return Alert.error(`Error occured : ${err.message}`, 4000);
      }

      if (file) {
        try {
          // file
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
          Alert.info('Message Has been Deleted', 4000);
        } catch (err) {
          Alert.error(`Error occured : ${err.message}`, 4000);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.created).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map(msg => {
        return (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        );
      });

      items.push(...msgs);
    });

    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list  custom-scroll ">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green">
            Load More
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No Messages yet...</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default memo(Messages);
