import {IonFab, IonFabButton, IonIcon, IonPopover,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonLabel } from '@ionic/react';
import React, {useState,useEffect,useContext} from 'react';
import './Fijos.css';
import {db,eliminar} from '../firebaseConfig'
import { add } from 'ionicons/icons';
import IngresoGastoFijo from '../components/IngresoGastoFijo'
import {UserContext} from '../App'

const Fijos: React.FC = () => {
  const [listaGastoFijo,setListaGastoFijo] = useState([] as any[]);
  const [showPopover, setShowPopover] = useState(false);
  const user = useContext(UserContext)

  useEffect(() => {
    db.collection("usersData").doc(user.uid).collection("gastos_fijos").orderBy("descripcion").onSnapshot((querySnapshot) => {
        setListaGastoFijo([])
        querySnapshot.forEach(doc => {
            var objeto = {id:doc.id,descripcion:doc.data().descripcion,monto:doc.data().monto}
            setListaGastoFijo(prevListaGasto => [...prevListaGasto, objeto]);
        });
    })
  },[])

  function eliminarGastoFijo(id: string){
    eliminar(id,"gastos_fijos",user.uid)
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar><IonTitle>Lista gastos fijos</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Lista gastos fijos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonList>
                <IonItem>
                    <IonLabel><b>Total gastos fijos:</b> </IonLabel>
                    <IonLabel slot="end" color="danger">-${listaGastoFijo.reduce((a:any,b:any) => (a+parseInt(b.monto)),0)}</IonLabel>
                </IonItem>
            </IonList>
            <IonList>
                <IonItem>
                    <IonLabel><b>Descripcion</b></IonLabel>
                    <IonLabel slot="end"><b>Monto</b></IonLabel>
                </IonItem>
                {listaGastoFijo.map((gasto,i) => (
                <IonItemSliding key={i}>
                    <IonItem>  
                        <IonLabel>{gasto.descripcion}</IonLabel>
                        <IonLabel slot="end" color="danger">-${gasto.monto}</IonLabel>
                    </IonItem>
                    <IonItemOptions side="end" onIonSwipe={() => {eliminarGastoFijo(gasto.id)}}>
                        <IonItemOption color="danger" expandable>
                            Eliminar
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
                ))}
            </IonList>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton onClick={(e: any) => {e.persist();setShowPopover(true)}}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
            <IonPopover
                isOpen={showPopover}
                animated={false}
                onDidDismiss={e => setShowPopover(false)}
                >
                <IngresoGastoFijo/>
            </IonPopover>
        </IonContent>
    </IonPage>
  )
};

export default Fijos;
