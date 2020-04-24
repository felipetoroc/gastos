import {IonText,IonPopover,IonButton,IonLabel,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid, IonSelect, IonSelectOption } from '@ionic/react';
import React, {useState,useEffect} from 'react';
import './Home.css';
import {db} from '../firebaseConfig'

const Home: React.FC = () => {
  const listaVacia = [] as any[]
  const [listaGasto, setListaGasto] = useState(listaVacia);
  const [listaPeriodo, setListaPeriodo] = useState(listaVacia);
  const [selectedPeriodo, setSelectedPeriodo] = useState('')

  const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});

  useEffect(() => {
    db.collection("gastos").onSnapshot((querySnapshot) => {
        console.log("vacia arreglo")
        setListaGasto(listaVacia)
        setListaPeriodo(listaVacia)
        var prevPeriodo = '';
        querySnapshot.forEach(doc => {
            var splitFecha = doc.data().gasto_fecha.split("T");
            var objeto = {
                id:doc.id,
                categoria:doc.data().gasto_categoria,
                cuotas:doc.data().gasto_cuotas,
                descripcion:doc.data().gasto_descripcion,
                fecha:splitFecha[0],
                monto:doc.data().gasto_monto,
                periodo:doc.data().gasto_periodo,
                tipo_gasto:doc.data().gasto_tipo_gasto,
                tipo_moneda:doc.data().gasto_tipo_moneda
            }
            setListaGasto(prevListaGasto => [...prevListaGasto, objeto]);
            if(prevPeriodo !==doc.data().gasto_periodo){
                setListaPeriodo(prevListaPeriodo => [...prevListaPeriodo, {periodo: doc.data().gasto_periodo}])
            }
            prevPeriodo = doc.data().gasto_periodo;
            
            console.log("carga arreglo")
        });
    })
  },[])

  function eliminarGasto(id: string){
    setListaGasto(listaVacia)
    db.collection("gastos").doc(id).delete();
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Lista gastos</IonTitle>
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
                {listaGasto.map((gasto,i) => {
                    if(gasto.periodo === selectedPeriodo){
                        return(
                            <IonRow key={i} onClick={(e: any) => {e.persist();setPopover({show:true,evento:e})}} >
                                <IonCol>{gasto.fecha}</IonCol>
                                <IonCol>{gasto.categoria}</IonCol>
                                <IonCol>{gasto.descripcion}</IonCol>
                                <IonCol>{gasto.monto}</IonCol>
                                <IonPopover
                                    isOpen={popover.show}
                                    event={popover.evento}
                                    onDidDismiss={e => setPopover({show:false, evento:e})}
                                >
                                    <IonList>
                                        <IonTitle>Detalles</IonTitle>
                                        <IonItem>
                                            Moneda usada: {gasto.tipo_moneda}
                                        </IonItem>
                                        <IonItem>
                                            Tipo de gasto: {gasto.tipo_gasto}
                                        </IonItem>
                                        <IonItem>
                                            Cantidad de cuotas: {gasto.cuotas}
                                        </IonItem>
                                        <IonButton onClick={() => eliminarGasto(gasto.id)} expand="block" color="danger">
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
