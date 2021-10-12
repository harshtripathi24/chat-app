/* eslint-disable arrow-body-style */
import React, { useCallback, useRef, useState } from 'react'
import firebase from 'firebase';
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from 'rsuite'
import { useModalState } from '../misc/Custom-Hooks'
import { database } from '../misc/firebase';


const {StringType} = Schema.Types;
const model = Schema.Model({

    name: StringType().isRequired("Chat name is Required"),
    description: StringType().isRequired("Desciption name is Required"),


})

const initialForm = {
    name : '',
    description:'',
}


const CreateRoomBtnModal = () => {
    
    
    const {isOpen, open,close} = useModalState();
    const [formValue , setFormValue] =  useState();
    const [isLoading , setIsLoading] = useState();

    const formRef =  useRef();
    const onFormChange = useCallback((value)=> {
    
        setFormValue(value)
    
    },[])


     const onSubmit = async () =>{

        if(! formRef.current.check()){
            return
        }
        setIsLoading(true);

        const newRoomData ={
            ...formValue,
            created: firebase.database.ServerValue.TIMESTAMP
        }
             try {
                  await database.ref('rooms').push(newRoomData);
                  Alert.success(`new Room ${formValue.name} has been created`,4000)
                  setIsLoading(false);
                  setFormValue(initialForm);
                 
             } catch (err) {
                 setIsLoading(false);
                 Alert.error(err.message,4000)
                 
             }
     }


    return (
        <div>
            <Button block color='green' onClick={open} className='mt-1' >
                <Icon icon='creative' />Create New Chat Room
            </Button>

            <Modal show={isOpen} onHide={close} >
                <Modal.Header>
                    <Modal.Title>
                     New Chat Room
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef} >
                        <FormGroup>
                            <ControlLabel>Room Name</ControlLabel>
                            <FormControl name="name" placeholder='Enter chat Room Name' />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Enter Discription </ControlLabel>
                            <FormControl componentClass='textarea' rows={5} name="description" placeholder='Enter Discription......' />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                    <Button block appearance='primary' onClick={onSubmit} disabled={isLoading}  >
                        Create new Chat Room
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateRoomBtnModal
