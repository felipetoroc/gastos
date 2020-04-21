import {IonPopover,IonFab,IonFabButton, IonIcon, IonPage,IonHeader,IonToolbar,IonTitle,IonContent} from '@ionic/react';
import React, {useState,useEffect} from 'react';
import './Resumen.css';
import { add } from 'ionicons/icons';
import Ingreso from './Ingreso'

const Resumen: React.FC = () => {

    const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Resumen Gastos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={(e: any) => {e.persist();setPopover({show:true,evento:e})}}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                <IonPopover
                isOpen={popover.show}
                event={popover.evento}
                onDidDismiss={e => setPopover({show:false, evento:e})}
                
                >
                    <Ingreso/>
                </IonPopover>
            </IonContent>
        </IonPage>
    )
};

export default Resumen;