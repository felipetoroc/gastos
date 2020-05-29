import {IonText,IonPopover,IonButton,IonLabel,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid, IonSelect, IonSelectOption, IonButtons, IonIcon, IonItemDivider } from '@ionic/react';
import React, {useState,useEffect, useContext} from 'react';
import './Home.css';
import {db,eliminar} from '../firebaseConfig'
import { add,trash } from 'ionicons/icons';
import {UserContext} from '../App'


const Home: React.FC = () => {
  const listaVacia = [] as any[]
  const [listaMov, setlistaMov] = useState(listaVacia);
  const [listaPeriodo, setListaPeriodo] = useState(listaVacia);
  const [selectedPeriodo, setSelectedPeriodo] = useState('')
  const user = useContext(UserContext)

  const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});

  useEffect(() => {
    db.collection("usersData").doc(user.uid).collection("movimientos").orderBy("mov_fecha").onSnapshot((querySnapshot) => {
        setlistaMov(listaVacia)
        querySnapshot.forEach(doc => {
            var splitFecha = doc.data().mov_fecha.split("T");
            var splitFecha2 = splitFecha[0].split("-")
            var objeto = {
                id:doc.id,
                categoria:doc.data().mov_categoria,
                cuotas:doc.data().mov_cuotas,
                descripcion:doc.data().mov_descripcion,
                ano:splitFecha2[0],
                fecha:splitFecha2[0]+"-"+splitFecha2[1]+"-"+splitFecha2[2],
                monto:doc.data().mov_monto,
                periodo:doc.data().mov_periodo,
                frecuencia:doc.data().mov_frec_mov,
                tipo_moneda:doc.data().mov_tipo_moneda,
                tipo_movimiento:doc.data().mov_tipo_mov
            }
            setlistaMov(prevlistaMov => [...prevlistaMov, objeto]);
        });
    })
  },[])

  function eliminarMov(id: string){
    setlistaMov(listaVacia)
    eliminar(id,"movimientos",user.uid)
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Movimientos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonList>
                
                {listaMov.map((mov,i,arr) => { 
                    
                    var x = i;
                    if(i>0){
                        x = x-1
                    }
                    return(
                        <div  key={i}>
                            {arr[x].fecha!=mov.fecha || i == 0?
                                <IonItem>
                                    <IonLabel color="primary">{mov.fecha}</IonLabel>
                                </IonItem>
                                :
                                <></>
                            }
                            <IonItemSliding>
                                <IonItem>
                                    <IonLabel>{mov.tipo_moneda}</IonLabel>
                                    <IonLabel>{mov.descripcion}</IonLabel>
                                    <IonLabel>{mov.tipo_movimiento==="gasto"?<span style={{color:"red"}}>-{mov.monto}</span >:<span style={{color:"green"}}>{mov.monto}</span>}</IonLabel>
                                </IonItem>
                                <IonItemOptions side="end" onIonSwipe={() => {eliminarMov(mov.id)}}>
                                    <IonItemOption color="danger" expandable>
                                        Eliminar
                                    </IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        </div>
                    )
                })}
            </IonList>
        </IonContent>
    </IonPage>
  )
};

export default Home;
