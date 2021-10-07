/* eslint-disable arrow-body-style */
import React from 'react'
import { Button, Divider, Drawer, Icon } from 'rsuite'
import { useProfile } from '../../context/profile.context'
import EditableInput from '../EditableInput';

const Dashboard = ({onSignOut}) => {

    const {profile} = useProfile();

    
    // eslint-disable-next-line no-unused-vars
    const onSave = async(newData) => {

        console.log(newData);

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
