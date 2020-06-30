import React, {useContext} from 'react';
import {IonIcon,IonButtons,IonButton,IonLabel,IonMenuToggle , IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonMenu } from '@ionic/react';
import './Menu.css';
import {UserContext} from '../App'
import {logOut } from 'ionicons/icons';
import {logout} from '../firebaseConfig'

const Menu: React.FC = () => {
    const user = useContext(UserContext);
    async function logoutUser(){
        await logout();
        
    }
    return(
        <IonMenu className="menu" contentId="main" side="start" type="overlay">
            
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{user.email}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton slot="end" onClick={logoutUser} color="white"><IonIcon icon={logOut}></IonIcon></IonButton>
                    </IonButtons>
                </IonToolbar>
                
            </IonHeader>
            
            <IonContent fullscreen={true}>
                <IonMenuToggle  autoHide={false}>
                    <IonItem routerLink="/Resumen" routerDirection="none" lines="none" >
                        <IonLabel>Resumen</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/Movimientos" routerDirection="none" lines="none" >
                        <IonLabel>Movimientos</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/Fijos" routerDirection="none" lines="none" >
                        <IonLabel>Gastos fijos</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/Categorias" routerDirection="none" lines="none" >
                        <IonLabel>Categorias</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/Tarjetas" routerDirection="none" lines="none" >
                        <IonLabel>Tarjetas</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/Mantenedor" routerDirection="none" lines="none" >
                        <IonLabel>Configuración</IonLabel>
                    </IonItem>
                </IonMenuToggle>
            </IonContent>
        </IonMenu>
    )
};

export default Menu;