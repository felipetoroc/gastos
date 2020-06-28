import {IonList,IonHeader, IonPage, IonToolbar, IonContent} from '@ionic/react';
import React,{useContext} from 'react';
import './Movimientos.css';
import ListaMovimientos from '../components/ListaMovimientos';
import {UserContext} from '../App'


const Movimientos: React.FC = () => {
    const user = useContext(UserContext)
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <ListaMovimientos />
                </IonList>
            </IonContent>
        </IonPage>
    )
};

export default Movimientos;
