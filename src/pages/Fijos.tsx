import {IonFab, IonFabButton, IonIcon, IonPopover,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid, IonLabel } from '@ionic/react';
import React, {useState,useEffect,useContext} from 'react';
import './Fijos.css';
import {db,eliminar} from '../firebaseConfig'
import { add } from 'ionicons/icons';
import IngresoGastoFijo from '../components/IngresoGastoFijo'
import {UserContext} from '../App'

const Fijos: React.FC = () => {
  const listaVacia = [] as any[]
  const [total, setTotal] = useState(0)
  const [listaGastoFijo,setListaGastoFijo] = useState(listaVacia);
  const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});
  const [showPopover, setShowPopover] = useState(false);
  const user = useContext(UserContext)

  useEffect(() => {
    db.collection("usersData").doc(user.uid).collection("gastos_fijos").onSnapshot((querySnapshot) => {
        var sumaTotal = 0
        querySnapshot.forEach(doc => {
          sumaTotal += parseFloat(doc.data().monto)
        });
        setTotal(sumaTotal)
    })
  },[])

  useEffect(() => {
    db.collection("usersData").doc(user.uid).collection("gastos_fijos").orderBy("descripcion").onSnapshot((querySnapshot) => {
        setListaGastoFijo(listaVacia)
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
                    <IonLabel slot="end" color="danger">-${total}</IonLabel>
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
