/* eslint-disable arrow-body-style */
import React from 'react'
import { Alert, Button, Divider, Drawer, Icon } from 'rsuite'
import { useProfile } from '../../context/profile.context'
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';

const Dashboard = ({onSignOut}) => {

    const {profile} = useProfile();

    
    // eslint-disable-next-line no-unused-vars
    const onSave = async(newData) => {

     const userNicknameRef = database.ref(`/profiles/${ profile.uid }`).child('name');
       
     try {
         await userNicknameRef.set(newData);

         Alert.success("Nick Name has been Updated",4000);
     } catch (error) {
        Alert.error(`Error occured : ${error}`,4000);
         
     }
    }

    return (
        <>
       <Drawer.Header>
           <Drawer.Title>
   Dshboard 
           </Drawer.Title>
       </Drawer.Header>
       <Drawer.Body>
           <h3>Hey, {profile.name}</h3>
           <Divider/>
           <EditableInput  name="NickName" initialValue={profile.name} onSave={onSave} label={<h6 className="mb-2" >
           Nickname
           </h6>} />

       </Drawer.Body>
       <Drawer.Footer>
           <Button block color='red' onClick={onSignOut} > <Icon icon='sign-out' /> Sign Out</Button>

       </Drawer.Footer>
        </>
    )
}

export default Dashboard
