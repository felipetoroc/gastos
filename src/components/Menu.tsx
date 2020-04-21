import React from 'react';
import {IonLabel,IonMenuToggle , IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonMenu } from '@ionic/react';
import './Menu.css';

const Menu: React.FC = () => (
    <IonMenu contentId="main" side="start" type="overlay">
        <IonHeader>
            <IonToolbar color="primary">
                <IonTitle>Menu</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonMenuToggle  autoHide={false}>
                <IonItem routerLink="/Resumen" routerDirection="none" lines="none" >
                    <IonLabel>Resumen</IonLabel>
                </IonItem>
                <IonItem routerLink="/Home" routerDirection="none" lines="none" >
                    <IonLabel>Lista de gastos</IonLabel>
                </IonItem>
                <IonItem routerLink="/Ingreso" routerDirection="none" lines="none" >
                    <IonLabel>Ingresar Gastos</IonLabel>
                </IonItem>
            </IonMenuToggle>
        </IonContent>
    </IonMenu>
);

export default Menu;