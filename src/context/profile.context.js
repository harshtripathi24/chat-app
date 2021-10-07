import React ,{ createContext, useContext, useEffect, useRef, useState } from "react";
import { auth, database } from "../misc/firebase";


 const ProfileContext = createContext()

 export const ProfileProvider = ({children}) => {
     
    const [profile,setProfile] = useState(false);
    const [isLoading, setIsLoading ] = useState(true);

    useEffect(()=>{

        let  userRef;
        const authUnSub = auth.onAuthStateChanged((authObj) => {

            if (authObj) {

              userRef =  database.ref(`/profiles/${authObj.uid}`);
              userRef.on('value',(snap)=>{

                    const  {name , created} = snap.val()

                
                    const data = {
                        name,
                        created,
                        uid: authObj.uid,
                        email: authObj.email
                    }
    
                    setProfile(data);
                    setIsLoading(false);

                })

                
            } else{

                if (useRef) {
                    useRef.off();
                    
                }

                setProfile(null)
                setIsLoading(false);
                
            }
        })

        return ()=>{
            authUnSub();
            if(useRef)
            {
                useRef.off();
            }
        }
    },[])

    return <ProfileContext.Provider  value={{isLoading,profile}} >
        {children}

    </ProfileContext.Provider>
 }

 export const useProfile = () => useContext(ProfileContext);