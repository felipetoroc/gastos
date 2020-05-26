import {IonItem,IonList,IonPopover,IonFab,IonFabButton, IonIcon, IonPage,IonHeader,IonToolbar,IonTitle,IonContent, IonLabel, IonRow, IonCol,IonProgressBar} from '@ionic/react';
import React, {useState,useEffect,useContext,useReducer} from 'react';
import './Resumen.css';
import { add } from 'ionicons/icons';
import IngresoMov from '../components/IngresoMov'
import {db} from '../firebaseConfig'
import {UserContext} from '../App'

const Resumen: React.FC = () => {
    const user = useContext(UserContext)
    const [busy,setBusy] = useState(true)

    const [tarjetas, setTarjetas] = useState<any>([])
    const [totalFijos, setTotalFijos] = useState(0)
    const [periodos, setPeriodos] = useState<any>([])

    const [sueldo, setSueldo] = useState(0)
    const [gefectivo, setGefectivo] = useState(0)
    const [iefectivo, setIefectivo] = useState(0)
    const [periodoIni, setPeriodoIni] = useState('')
    const [periodoFin, setPeriodoFin] = useState('')
    const [gTarjetas, setGtarjetas] = useState<any>([])

    const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});


    useEffect(()=>{
        db.collection("usersData").doc(user.uid).collection("gastos_fijos").onSnapshot((querySnapshot) => {
            var sumaTotal = 0
            querySnapshot.forEach(doc => {
              sumaTotal += parseFloat(doc.data().monto)
            });
            setTotalFijos(sumaTotal)
        })
        db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((querySnapshot) => {
            setTarjetas([])
            querySnapshot.forEach(doc => {
                var objeto = {nombre:doc.data().tarjeta_nombre}
                setTarjetas((prevTarjeta:any) => [...prevTarjeta, objeto]);
            });
        })
    },[])

    useEffect(() => {
        db.collection("usersData").doc(user.uid).collection("movimientos").onSnapshot((querySnapshot) => {
            db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((querySnapshot2) => {
                db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((querySnapshot3) => {
                    setSueldo(0)
                    setGefectivo(0)
                    setIefectivo(0)
                    var fechaPago = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                    var fechaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                    var fechaIni = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                    var fechaFin = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                    if(querySnapshot2.empty == false){
                        querySnapshot2.forEach(doc => {
                            if(doc.data().dia_pago != ''){
                                fechaPago.setDate(doc.data().dia_pago)
                            }else{
                                fechaPago.setMonth(fechaPago.getMonth()+1)
                                fechaPago.setDate(1)
                            }
                        });
                    }else{
                        fechaPago.setMonth(fechaPago.getMonth()+1)
                        fechaPago.setDate(1)
                    }

                    if(fechaActual>fechaPago){
                        fechaFin.setMonth(fechaPago.getMonth()+1)
                        fechaFin.setDate(fechaPago.getDate())
                        fechaIni = fechaPago
                    }else{
                        fechaFin = fechaPago
                        fechaIni.setMonth(fechaPago.getMonth()-1)
                        fechaIni.setDate(fechaPago.getDate())
                    }

                    setPeriodoIni(fechaIni.toLocaleDateString())
                    setPeriodoFin(fechaFin.toLocaleDateString())

                    var otrosGastos = [] as any[]
                
                    querySnapshot.forEach(doc => {
                        var fechaMov = new Date(doc.data().mov_fecha)
                        var fechaMovFormat = new Date(fechaMov.getFullYear(),fechaMov.getMonth(),fechaMov.getDate())

                        if(fechaMovFormat < fechaFin && fechaMovFormat >= fechaIni){
                            if(doc.data().mov_categoria === "sueldo"){
                                setSueldo(prev => prev+parseInt(doc.data().mov_monto))
                            }
                            if(doc.data().mov_tipo_mov === "gasto" && doc.data().mov_tipo_moneda === "efectivo"){
                                setGefectivo(prev => prev+parseInt(doc.data().mov_monto));
                            }
                            if(doc.data().mov_tipo_mov === "ingreso" && doc.data().mov_tipo_moneda === "efectivo"){
                                setIefectivo(prev => prev+parseInt(doc.data().mov_monto))
                            }
                            if(doc.data().mov_tipo_mov === "gasto" && doc.data().mov_tipo_moneda !== "efectivo"){
                                otrosGastos.push({nombre: doc.data().mov_tipo_moneda, monto: parseInt(doc.data().mov_monto)})
                            }
                        }
                       
                    });
                    if(querySnapshot3.empty == false){
                        querySnapshot3.forEach(doc => {
                            const sum = otrosGastos.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre == doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                            },0)
                            setGtarjetas((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum}])
                        });
                    }
                })
            })
        })
      },[])

    return (
        <IonPage className="resumen">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Resumen Gastos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Resumen Gastos</IonTitle>
                        <IonLabel>{"Inicio: "+periodoIni+" Fin: "+periodoFin}</IonLabel>
                    </IonToolbar>
                </IonHeader>
                <IonList>
                    <IonItem>
                        <IonLabel>{gTarjetas.map((item:any,i:any) => (
                            item.nombre+" "+item.suma
                        ))}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Sueldo</IonLabel><IonLabel slot="end" className="datos">{sueldo}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Ingresos en efectivo</IonLabel><IonLabel slot="end" className="datos">{iefectivo}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Gastos en efectivo</IonLabel><IonLabel slot="end" className="datos">{gefectivo}</IonLabel>
                    </IonItem>
                    
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