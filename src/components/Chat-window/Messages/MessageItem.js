import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/Custom-Hooks';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import IconBtnControl from './IconBtnControl';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

// eslint-disable-next-line arrow-body-style
const MessageItem = ({ message, handleAdmin, handleLike }) => {
  const { author, created, text, likes, likeCount } = message;

  const [selfRef, isHovered] = useHover();

  const isMobile = useMediaQuery('(max-width: 992px)');

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHovered || likes;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li
      className={`padded mb-1 cursor-pointer ${
        isHovered ? 'bg-black-02' : ''
      } `}
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />

        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1 "
          size="xs"
        />

        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin
                ? 'Remove Admin Permission '
                : 'Give Admin in this Room'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={created}
          className="font-normal text-black-45 ml-2 "
        />
        <IconBtnControl
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={canShowIcons}
          iconName="heart"
          toolTip="Like this Message"
          onClick={() => {
            handleLike(message.id);
          }}
          badgeContent={likeCount}
        />
      </div>

      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
