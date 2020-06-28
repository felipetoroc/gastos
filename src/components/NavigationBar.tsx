import React,{useContext,useState} from 'react'
import {IonPopover,IonText,IonButton, IonButtons, IonMenuButton, IonIcon, IonToolbar, IonTitle } from '@ionic/react';
import {add } from 'ionicons/icons';
import {UserContext} from '../App'
import IngresoMov from '../components/IngresoMov'
import './NavigationBar.css'

const NavigationBar: React.FC = () => {
    const user = useContext(UserContext);
    const [popover, setPopover] = useState(false)

    return(
      <IonToolbar className="navigationBar">
        <IonButtons slot="start">
          <IonMenuButton/>
        </IonButtons>
        <IonTitle><IonText></IonText>Simple Gastos</IonTitle>
        <IonButtons slot="end">
          <IonButton slot="end" onClick={()=> setPopover(true)} color="success"><IonIcon icon={add} /></IonButton>
        </IonButtons>
        <IonPopover
                   
            isOpen={popover}
            animated={false}
            onDidDismiss={e => setPopover(false)}
            >
            <IngresoMov/>
        </IonPopover>
      </IonToolbar>
    )
  }

  export default NavigationBar;