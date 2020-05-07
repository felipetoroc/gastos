import {IonItem,IonList,IonPopover,IonFab,IonFabButton, IonIcon, IonPage,IonHeader,IonToolbar,IonTitle,IonContent, IonLabel, IonRow, IonCol} from '@ionic/react';
import React, {useState,useEffect} from 'react';
import './Resumen.css';
import { add } from 'ionicons/icons';
import IngresoMov from '../components/IngresoMov'
import {db} from '../firebaseConfig'

const Resumen: React.FC = () => {
    
    const [vCredito, setVCredito] = useState(0)
    const [vEfectivo, setVEfectivo] = useState(0)
    const [fCredito, setFCredito] = useState(0)
    const [fEfectivo, setFEfectivo] = useState(0)

    const [vICredito, setVICredito] = useState(0)
    const [vIEfectivo, setVIEfectivo] = useState(0)
    const [fICredito, setFICredito] = useState(0)
    const [fIEfectivo, setFIEfectivo] = useState(0)

    const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});
    
    useEffect(() => {
        db.collection("movimientos").onSnapshot((querySnapshot) => {
            var sumaVCredito = 0
            var sumaVEfectivo = 0
            var sumaFCredito = 0
            var sumaFEfectivo = 0
            var sumaVICredito = 0
            var sumaVIEfectivo = 0
            var sumaFICredito = 0
            var sumaFIEfectivo = 0
            querySnapshot.forEach(doc => {
                if(doc.data().mov_tipo_mov === "gasto"){
                    if(doc.data().mov_frec_mov === "variable"){
                        if(doc.data().mov_tipo_moneda === "credito"){
                            sumaVCredito += parseFloat(doc.data().mov_monto)
                        }else if(doc.data().mov_tipo_moneda === "efectivo"){
                            sumaVEfectivo += parseFloat(doc.data().mov_monto)
                        }
                    }else if(doc.data().mov_frec_mov === "fijo"){
                        if(doc.data().mov_tipo_moneda === "credito"){
                            sumaFCredito += parseFloat(doc.data().mov_monto)
                        }else if(doc.data().mov_tipo_moneda === "efectivo"){
                            sumaFEfectivo += parseFloat(doc.data().mov_monto)
                        }
                    }   
                }else if(doc.data().mov_tipo_mov === "ingreso"){
                    if(doc.data().mov_frec_mov === "variable"){
                        if(doc.data().mov_tipo_moneda === "credito"){
                            sumaVICredito += parseFloat(doc.data().mov_monto)
                        }else if(doc.data().mov_tipo_moneda === "efectivo"){
                            sumaVIEfectivo += parseFloat(doc.data().mov_monto)
                        }
                    }else if(doc.data().mov_frec_mov === "fijo"){
                        if(doc.data().mov_tipo_moneda === "credito"){
                            sumaFICredito += parseFloat(doc.data().mov_monto)
                        }else if(doc.data().mov_tipo_moneda === "efectivo"){
                            sumaFIEfectivo += parseFloat(doc.data().mov_monto)
                        }
                    }   
                }
                
            });
            setVCredito(sumaVCredito)
            setVEfectivo(sumaVEfectivo)
            setFCredito(sumaFCredito)
            setFEfectivo(sumaFEfectivo)

            setVICredito(sumaVICredito)
            setVIEfectivo(sumaVIEfectivo)
            setFICredito(sumaFICredito)
            setFIEfectivo(sumaFIEfectivo)
        })
      },[])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Resumen Gastos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonRow>
                        <IonCol>Movimientos variables</IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>Ingresos</IonCol>
                        <IonCol>Gastos</IonCol>
                        <IonCol>Total</IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonRow>
                                <IonCol>Credito: {Math.round(vICredito)}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>Efectivo: {Math.round(vIEfectivo)}</IonCol>
                            </IonRow>
                        </IonCol>
                        <IonCol>
                            <IonRow>
                                <IonCol>Credito: {Math.round(vCredito)}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>Efectivo: {Math.round(vEfectivo)}</IonCol>
                            </IonRow>
                        </IonCol>
                        
                        <IonCol>
                            <IonRow>
                                <IonCol>Credito: {Math.round(vICredito)}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>Efectivo: {Math.round(vIEfectivo)}</IonCol>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    
                </IonList>
                <IonList>
                    <IonRow>
                        <IonCol>Movimientos fijos</IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>Ingresos</IonCol>
                        <IonCol>Gastos</IonCol>
                        <IonCol>Total</IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonRow>
                                <IonCol>Credito: {Math.round(fICredito)}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>Efectivo: {Math.round(fIEfectivo)}</IonCol>
                            </IonRow>
                        </IonCol>
                        <IonCol>
                            <IonRow>
                                <IonCol>Credito: {Math.round(fCredito)}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>Efectivo: {Math.round(fEfectivo)}</IonCol>
                            </IonRow>
                        </IonCol>
                        
                        <IonCol>
                            <IonRow>
                                <IonCol>Credito: {Math.round(fICredito)}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>Efectivo: {Math.round(fIEfectivo)}</IonCol>
                            </IonRow>
                        </IonCol>
                    </IonRow>
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
                <IngresoMov/>
                </IonPopover>
            </IonContent>
        </IonPage>
    )
};

export default Resumen;