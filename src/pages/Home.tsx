import {IonText,IonPopover,IonButton,IonLabel,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid, IonSelect, IonSelectOption } from '@ionic/react';
import React, {useState,useEffect} from 'react';
import './Home.css';
import {db} from '../firebaseConfig'

const Home: React.FC = () => {
  const listaVacia = [] as any[]
  const [listaMov, setlistaMov] = useState(listaVacia);
  const [listaPeriodo, setListaPeriodo] = useState(listaVacia);
  const [selectedPeriodo, setSelectedPeriodo] = useState('')

  const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});

  useEffect(() => {
    db.collection("movimientos").onSnapshot((querySnapshot) => {
        console.log("vacia arreglo")
        setlistaMov(listaVacia)
        setListaPeriodo(listaVacia)
        var prevPeriodo = '';
        querySnapshot.forEach(doc => {
            var splitFecha = doc.data().mov_fecha.split("T");
            var objeto = {
                id:doc.id,
                categoria:doc.data().mov_categoria,
                cuotas:doc.data().mov_cuotas,
                descripcion:doc.data().mov_descripcion,
                fecha:splitFecha[0],
                monto:doc.data().mov_monto,
                periodo:doc.data().mov_periodo,
                frecuencia:doc.data().mov_frec_mov,
                tipo_moneda:doc.data().mov_tipo_moneda
            }
            setlistaMov(prevlistaMov => [...prevlistaMov, objeto]);
            if(prevPeriodo !==doc.data().mov_periodo){
                setListaPeriodo(prevListaPeriodo => [...prevListaPeriodo, {periodo: doc.data().mov_periodo}])
            }
            prevPeriodo = doc.data().mov_periodo;
            
            console.log("carga arreglo")
        });
    })
  },[])

  function eliminarMov(id: string){
    setlistaMov(listaVacia)
    db.collection("movimientos").doc(id).delete();
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Lista movimientos</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonItem>
                <IonLabel>Selecciona un periodo</IonLabel>
                <IonSelect value={selectedPeriodo} onIonChange={(e:any) => setSelectedPeriodo(e.target.value)} interface="popover">
                    {listaPeriodo.map((per,i) => (
                        <IonSelectOption key={i} value={per.periodo}>{per.periodo}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonGrid>
                <IonRow>
                    
                    <IonCol>Fecha</IonCol>
                    <IonCol>Categoria</IonCol>
                    <IonCol>Descripcion</IonCol>
                    <IonCol>Monto</IonCol>
                </IonRow>
                {listaMov.map((mov,i) => {
                    if(mov.periodo === selectedPeriodo){
                        return(
                            <IonRow key={i} onClick={(e: any) => {e.persist();setPopover({show:true,evento:e})}} >
                                <IonCol>{mov.fecha}</IonCol>
                                <IonCol>{mov.categoria}</IonCol>
                                <IonCol>{mov.descripcion}</IonCol>
                                <IonCol>{mov.monto}</IonCol>
                                <IonPopover
                                    isOpen={popover.show}
                                    event={popover.evento}
                                    onDidDismiss={e => setPopover({show:false, evento:e})}
                                >
                                    <IonList>
                                        <IonTitle>Detalles</IonTitle>
                                        <IonItem>
                                            Moneda usada: {mov.tipo_moneda}
                                        </IonItem>
                                        <IonItem>
                                            Frecuencia: {mov.frecuencia}
                                        </IonItem>
                                        <IonItem>
                                            Cantidad de cuotas: {mov.cuotas}
                                        </IonItem>
                                        <IonButton onClick={() => eliminarMov(mov.id)} expand="block" color="danger">
                                            Eliminar
                                        </IonButton>
                                    </IonList>
                                </IonPopover>
                            </IonRow>
                        )
                    }
                })}
            </IonGrid>
            
        </IonContent>
    </IonPage>
  )
};

export default Home;
