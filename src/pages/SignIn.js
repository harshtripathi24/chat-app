import React from 'react';
import { Button, Col, Container, Grid, Panel, Row , Alert, Icon } from 'rsuite';

import firebase from 'firebase/app';
import '../styles/utility.scss'
import { auth, database } from '../misc/firebase';

const SignIn = () => {

  const signInWithProvider = async(provider) => {

    try {
      const {additionalUserInfo , user } = await auth.signInWithPopup(provider)  
      
      if ( additionalUserInfo.isNewUser ) {
        await database.ref(`/profiles/${user.uid}`).set({
         
          name: user.displayName,
          created: firebase.database.ServerValue.TIMESTAMP
        })
        Alert.success("Sign In Successful ! ",4000);

       
     }
      
    } catch (err) {  
      Alert.error(err.message ,4000)
      
    }

  }

  const onFacebookSignIn = () => {
     signInWithProvider( new firebase.auth.FacebookAuthProvider() );
    
  };
  const onGoogleSignIn = () =>{


      signInWithProvider(new firebase.auth.GoogleAuthProvider());
      
      
 
 
     
  };

 return (<Container>
     <Grid className='mt-page' >
     <Row>
      <Col xs={24} md={12} mdOffset={6} >
        <Panel>
          <div className="text-center">
            <h2>Wellcome to chat</h2>
            <p>Progressive chat platform for neophytes</p>
          </div>

      <div className='mt-3' >
        
        <Button block  color="blue" onClick={onFacebookSignIn}>
          <Icon icon='facebook'/> Continue With Facebook
         
        </Button>
        <Button block  color="green" onClick={onGoogleSignIn} >
     <Icon icon='google' /> Continue With Google
         
        </Button>
      </div>
    
    
        </Panel>

      
      </Col>
    </Row>
</Grid>
</Container>
 )

}

export default SignIn;
