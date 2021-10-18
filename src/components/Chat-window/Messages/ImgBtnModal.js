/* eslint-disable arrow-body-style */
import React from 'react';
import { Modal } from 'rsuite';
import { useModalState } from '../../../misc/Custom-Hooks';

const ImgBtnModal = ({ src, fileName }) => {
  const { isOpen, close, open } = useModalState();

  return (
    <>
      <input
        type="image"
        src={src}
        alt="file"
        onClick={open}
        className="mw-100 mh-100 w-auto"
      />
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Image Display {fileName} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <img src={src} width="100%" height="100%" alt="fille" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <a href={src} target="_blank" rel="noopener noreferrer">
            View Orignal
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImgBtnModal;
