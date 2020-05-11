import {IonText,IonPopover,IonButton,IonLabel,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid, IonSelect, IonSelectOption, IonButtons, IonIcon } from '@ionic/react';
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
    db.collection("usersData").doc(user.uid).collection("movimientos").orderBy("mov_periodo","asc").onSnapshot((querySnapshot) => {
        setListaPeriodo(listaVacia)
        var prevPeriodo = '';
        querySnapshot.forEach(doc => {
            var objeto = {
                periodo:doc.data().mov_periodo,
            }
            if(prevPeriodo != objeto.periodo){
                setListaPeriodo(prevListaPeriodo => [...prevListaPeriodo, {periodo: objeto.periodo}])
            }
            prevPeriodo = objeto.periodo
            console.log(prevPeriodo)
        });
    })
  },[])

  useEffect(() => {
    db.collection("usersData").doc(user.uid).collection("movimientos").onSnapshot((querySnapshot) => {
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
                fecha:splitFecha2[1]+"-"+splitFecha2[2],
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
                <IonTitle>Lista movimientos</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonList>
            <IonItem>
                <IonLabel>Selecciona un periodo</IonLabel>
                <IonSelect value={selectedPeriodo} onIonChange={(e:any) => setSelectedPeriodo(e.target.value)} interface="popover">
                    {listaPeriodo.map((per,i) => (
                        <IonSelectOption key={i} value={per.periodo}>{per.periodo}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            </IonList>
            <IonList>
            <IonItem>
                <table>
                    <thead>
                        <tr>
                            <td>Fecha</td>
                            <td>Descripcion</td>
                            <td>Cuotas</td>
                            <td>Monto</td>
                            <td>Acción</td>
                        </tr>
                    </thead>
                    <tbody>
                        {listaMov.map((mov,i) => {
                            if(mov.periodo === selectedPeriodo){
                                return(
                                    <tr key={i} >
                                        <td><div>{mov.fecha}</div></td>
                                        <td><div>{mov.descripcion}</div></td>
                                        <td><div>{mov.cuotas}</div></td>
                                        <td>{mov.tipo_movimiento === "gasto" ? <div style={{color:"red"}}>{"-"+Math.round(mov.monto)}</div>:<div style={{color:"green"}}>{Math.round(mov.monto)}</div>}</td>
                                        <td>
                                            <div>
                                            <IonButtons>
                                                <IonButton onClick={()=> eliminarMov(mov.id)}><IonIcon icon={trash}></IonIcon></IonButton>
                                            </IonButtons>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </table>
            </IonItem>
            </IonList>
        </IonContent>
    </IonPage>
  )
};

export default Home;
