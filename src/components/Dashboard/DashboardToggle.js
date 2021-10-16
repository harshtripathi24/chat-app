/* eslint-disable arrow-body-style */
import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import { isOfflineForDatabase } from '../../context/profile.context';
import { useMediaQuery, useModalState } from '../../misc/Custom-Hooks';
import { auth, database } from '../../misc/firebase';
import Dashboard from './Dashboard';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();

  const isMobile = useMediaQuery('(max-width: 992px)');
  const onSignOut = useCallback(() => {
    database
      .ref(`/status/${auth.currentUser.uid}`)
      .set(isOfflineForDatabase)
      .then(() => {
        auth.signOut();

        Alert.info('Signedout from App', 4000);

        close();
      })
      .catch(err => {
        Alert.error(err.mesage, 4000);
      });
  }, [close]);

  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
