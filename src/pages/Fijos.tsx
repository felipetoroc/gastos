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
    db.collection("usersData").doc(user.uid).collection("gastos_fijos").onSnapshot((querySnapshot) => {
        console.log("vacia arreglo")
        setListaGastoFijo(listaVacia)
        querySnapshot.forEach(doc => {
            var objeto = {id:doc.id,descripcion:doc.data().descripcion,monto:doc.data().monto}
            setListaGastoFijo(prevListaGasto => [...prevListaGasto, objeto]);
            console.log("carga arreglo")
        });
    })
  },[])

  function eliminarGastoFijo(id: string){
    eliminar(id,"gastos_fijos",user.uid)
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Lista gastos fijos</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonList>
                <IonItem>
                    <IonLabel>TOTAL GASTOS FIJOS: ${total}</IonLabel>
                </IonItem>
            </IonList>
            <IonList>
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
                    <IonItemOptions side="end" onClick={() => {eliminarGastoFijo(gasto.id)}}>
                        <IonItemOption color="danger" expandable>
                            Eliminar
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            </IonRow>
            ))}
            </IonList>
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
