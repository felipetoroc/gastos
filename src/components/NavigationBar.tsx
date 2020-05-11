import React,{useContext} from 'react'
import {IonButton, IonButtons, IonMenuButton, IonIcon, IonToolbar, IonTitle } from '@ionic/react';
import {logout} from '../firebaseConfig'
import {logOut } from 'ionicons/icons';
import {useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const NavigationBar: React.FC = () => {
    const history = useHistory()
    const user = useContext(UserContext);

    async function logoutUser(){
        var res = await logout();
        history.replace('/Login')
    }
    return(
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton color="primary"/>
        </IonButtons>
        <IonTitle>{user.email+user.uid}</IonTitle>
        <IonButtons slot="end">
          <IonButton slot="end" onClick={logoutUser} color="danger"><IonIcon icon={logOut}></IonIcon></IonButton>
        </IonButtons>
      </IonToolbar>
    )
  }

  export default NavigationBar;