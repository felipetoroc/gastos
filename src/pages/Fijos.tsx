import {IonFab, IonFabButton, IonIcon, IonPopover,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid } from '@ionic/react';
import React, {useState,useEffect} from 'react';
import './Fijos.css';
import {db} from '../firebaseConfig'
import { add } from 'ionicons/icons';
import IngresoGastoFijo from '../components/IngresoGastoFijo'

const Fijos: React.FC = () => {
  const listaVacia = [] as any[]
  const [listaGastoFijo,setListaGastoFijo] = useState(listaVacia);
  const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});


  useEffect(() => {
  
    db.collection("gastos_fijos").onSnapshot((querySnapshot) => {
        console.log("vacia arreglo")
        setListaGastoFijo(listaVacia)
        querySnapshot.forEach(doc => {
            var objeto = {id:doc.id,descripcion:doc.data().descripcion,monto:doc.data().monto}
            setListaGastoFijo(prevListaGasto => [...prevListaGasto, objeto]);
            console.log("carga arreglo")
        });
    })
  },[])

  function eliminarGasto(id: string){
    setListaGastoFijo(listaVacia)
    db.collection("gastos_fijos").doc(id).delete();
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Lista gastos fijos</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonRow>
                <IonCol>Descripcion</IonCol>
                <IonCol>Monto</IonCol>
            </IonRow>
            {listaGastoFijo.map((gasto,i) => (
            <IonRow key={i}>
                <IonItemSliding>
                    <IonItem>  
                        <IonCol>{gasto.descripcion}</IonCol>
                        <IonCol>{gasto.monto}</IonCol>
                    </IonItem>
                    <IonItemOptions side="end" onClick={() => {eliminarGasto(gasto.id)}}>
                        <IonItemOption color="danger" expandable>
                            Eliminar
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            </IonRow>
            ))}
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
                <IngresoGastoFijo/>
            </IonPopover>
        </IonContent>
    </IonPage>
  )
};

export default Fijos;
