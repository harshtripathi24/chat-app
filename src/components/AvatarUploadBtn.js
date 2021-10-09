

/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react'
import { Alert, Button, Modal } from 'rsuite'
import AvatarEditor from 'react-avatar-editor'
import { useModalState } from '../misc/Custom-Hooks';

const fileInputTypes = '.png, .jpeg, .jpg'

const acceptedFileTypes = ['image/png', 'image/jpeg','image/pjpeg'];


const isValidFile = (file) =>  acceptedFileTypes.includes(file.type);




const AvatarUploadBtn = () => {
    const {isOpen, open , close } = useModalState();;
    
    const [img, setImg] = useState(null);
    
    const onFileInputType = (ev) =>{
    
    
        const currentFile = ev.target.files;
    
        if (currentFile.length === 1) {
            
            const file = currentFile[0]
    
            if (isValidFile(file)) {
    

                setImg(file)
                open();
    
                
            }else{
                Alert.warning(`You Selected the Wrong File type ${file.type}`,4000)
            }
        }
    }
    return (
     <div className="mt-3 text-center" >

         <div>
             <label htmlFor='avatar-upload' className='d-block cursor-pointer padded' >
                 Select New Avatar
                 <input type="file" name="file" className="d-none" id='avatar-upload' accept={fileInputTypes} onChange={onFileInputType} />
             </label>


             <Modal show={isOpen} onHide={close} >
                 <Modal.Header>
  <Modal.Title>
      Adjust and Upload new Avatar 
  </Modal.Title>
                 </Modal.Header>
                 <Modal.Body>
<div className='d-flex justify-content-center align-items-center h-10'>
    
                         
                          {img && 
                          <AvatarEditor
            image={img}
            width={200}
            height={200}
            border={10}
            borderRadius={100}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.5}
            rotate={0}
          />

                    }
                      </div>
                      
                 </Modal.Body>

                 <Modal.Footer>
                 <Button block appearance='ghost' >
                     Upload New Avatar
                 </Button>
                 </Modal.Footer>
             </Modal>
         </div>
     </div>
    )
}

export default AvatarUploadBtn
