import {IonItem,IonList,IonPopover,IonFab,IonFabButton, IonIcon, IonPage,IonHeader,IonToolbar,IonTitle,IonContent, IonLabel, IonRow, IonCol,IonProgressBar} from '@ionic/react';
import React, {useState,useEffect,useContext,useReducer} from 'react';
import './Resumen.css';
import { add } from 'ionicons/icons';
import IngresoMov from '../components/IngresoMov'
import {db} from '../firebaseConfig'
import {UserContext} from '../App'

export function getPeriodos(query:any){
    var fechaPago = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaIni = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaFin = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    
    if(query.empty == false){
        query.forEach((doc:any) => {
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

    return {fechapago:fechaPago,fechaini:fechaIni,fechafin:fechaFin}
}


const Resumen: React.FC = () => {
    const user = useContext(UserContext)
    const [busy,setBusy] = useState(true)

    const [tarjetas, setTarjetas] = useState<any>([])
    const [totalFijos, setTotalFijos] = useState(0)

    const [sueldo, setSueldo] = useState(0)
    const [gefectivof, setGefectivof] = useState(0)
    const [gefectivov, setGefectivov] = useState(0)
    const [iefectivof, setIefectivof] = useState(0)
    const [iefectivov, setIefectivov] = useState(0)
    const [periodoIni, setPeriodoIni] = useState('')
    const [periodoFin, setPeriodoFin] = useState('')
    const [gTarjetasf, setGtarjetasf] = useState<any>([])
    const [gTarjetasv, setGtarjetasv] = useState<any>([])
    const [iTarjetasf, setItarjetasf] = useState<any>([])
    const [iTarjetasv, setItarjetasv] = useState<any>([])

    const [popover, setPopover] = useState(false);


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
                    setGefectivof(0)
                    setGefectivov(0)
                    setIefectivof(0)
                    setIefectivov(0)
                    setGtarjetasf([])
                    setGtarjetasv([])
                    setItarjetasf([])
                    setItarjetasv([])

                    //para visualización en el resumen

                    var fechaIni = getPeriodos(querySnapshot2).fechaini;
                    var fechaFin = getPeriodos(querySnapshot2).fechafin;
                    setPeriodoIni(fechaIni.toLocaleDateString())
                    setPeriodoFin(fechaFin.toLocaleDateString())

                    var otrosGastosf = [] as any[]
                    var otrosGastosv = [] as any[]
                    var otrosIngresosf = [] as any[]
                    var otrosIngresosv = [] as any[]
                
                    querySnapshot.forEach(doc => {
                        var fechaMov = new Date(doc.data().mov_fecha)
                        var fechaMovFormat = new Date(fechaMov.getFullYear(),fechaMov.getMonth(),fechaMov.getDate())

                        if(fechaMovFormat < fechaFin && fechaMovFormat >= fechaIni){
                            if(doc.data().mov_tipo_mov === "gasto" && doc.data().mov_tipo_moneda === "efectivo"){
                                if(doc.data().mov_frec_mov === "fijo"){
                                    setGefectivof(prev => prev+parseInt(doc.data().mov_monto));
                                }else{
                                    setGefectivov(prev => prev+parseInt(doc.data().mov_monto));
                                }
                            }
                            if(doc.data().mov_tipo_mov === "ingreso" && doc.data().mov_tipo_moneda === "efectivo"){
                                if(doc.data().mov_frec_mov === "fijo"){
                                    setIefectivof(prev => prev+parseInt(doc.data().mov_monto))
                                }else{
                                    setIefectivov(prev => prev+parseInt(doc.data().mov_monto))
                                }
                            }
                            if(doc.data().mov_tipo_mov === "gasto" && doc.data().mov_tipo_moneda !== "efectivo"){
                                if(doc.data().mov_frec_mov === "fijo"){
                                    otrosGastosf.push({nombre: doc.data().mov_tipo_moneda, monto: parseInt(doc.data().mov_monto)})
                                }else{
                                    otrosGastosv.push({nombre: doc.data().mov_tipo_moneda, monto: parseInt(doc.data().mov_monto)})
                                }
                            }
                            if(doc.data().mov_tipo_mov === "ingreso" && doc.data().mov_tipo_moneda !== "efectivo"){
                                if(doc.data().mov_frec_mov === "fijo"){
                                    otrosIngresosf.push({nombre: doc.data().mov_tipo_moneda, monto: parseInt(doc.data().mov_monto)})
                                }else{
                                    otrosIngresosv.push({nombre: doc.data().mov_tipo_moneda, monto: parseInt(doc.data().mov_monto)})
                                }
                            }
                        }
                       
                    });
                    if(querySnapshot3.empty == false){
                        querySnapshot3.forEach(doc => {
                            const sum1 = otrosGastosf.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre == doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                            },0)
                            const sum2 = otrosGastosv.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre == doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                            },0)
                            const sum3 = otrosIngresosf.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre == doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                            },0)
                            const sum4 = otrosIngresosv.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre == doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                            },0)
                            setGtarjetasf((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum1}])
                            setGtarjetasv((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum2}])
                            setItarjetasf((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum3}])
                            setItarjetasv((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum4}])
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
                    </IonToolbar>
                </IonHeader>
                
                <IonList>
                    <IonItem>
                        <IonLabel>Periodo: desde <b>{periodoIni}</b> hasta <b>{periodoFin}</b></IonLabel>
                    </IonItem>
                </IonList>
                <IonList>
                    <IonItem>
                        <IonLabel><b>Total</b></IonLabel>
                        <IonLabel slot="end" className="datos">{(iefectivof+iefectivov)-(gefectivof+gefectivov)}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel><b>Presupuesto Fijos</b></IonLabel>
                        <IonLabel slot="end" className="datos">{totalFijos}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel><b>Fijos a la fecha</b></IonLabel>
                        <IonLabel slot="end" className="datos">{gTarjetasf.reduce((a:any,b:any) => (a+b.suma),0)}</IonLabel>
                    </IonItem>
                </IonList>
                <IonList>
                    <IonItem>
                        <IonLabel><b>Ingresos</b></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Efectivo fijo</IonLabel>
                        <IonLabel slot="end" className="datos">{iefectivof}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Efectivo variable</IonLabel>
                        <IonLabel slot="end" className="datos">{iefectivov}</IonLabel>
                    </IonItem>
                    {iTarjetasf.map((item:any,i:any) => {
                    if(typeof item.suma != "undefined" && item.suma != 0){
                        return(
                        <IonItem key={i}>
                            <IonLabel>{item.nombre} fijo </IonLabel>
                            <IonLabel slot="end" className="datos">{item.suma}</IonLabel>
                        </IonItem>
                        )
                    }
                    })}
                    {iTarjetasv.map((item:any,i:any) => {
                    if(typeof item.suma != "undefined" && item.suma != 0){
                        return(
                        <IonItem key={i}>
                            <IonLabel>{item.nombre} variable</IonLabel>
                            <IonLabel slot="end" className="datos">{item.suma}</IonLabel>
                        </IonItem>
                        )
                    }
                    })}
                    <IonItem>
                        <IonLabel><b>Gastos</b></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Efectivo fijo</IonLabel><IonLabel slot="end" className="datos">{gefectivof}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Efectivo variable</IonLabel><IonLabel slot="end" className="datos">{gefectivov}</IonLabel>
                    </IonItem>
                    
                    {gTarjetasf.map((item:any,i:any) => {
                    if(typeof item.suma != "undefined" && item.suma != 0){
                        return(
                        <IonItem key={i}>
                            <IonLabel>{item.nombre} fijo </IonLabel>
                            <IonLabel slot="end" className="datos">{item.suma}</IonLabel>
                        </IonItem>
                        )
                    }
                    })}
                    {gTarjetasv.map((item:any,i:any) => {
                    if(typeof item.suma != "undefined"  && item.suma != 0){
                        return(
                        <IonItem key={i}>
                            <IonLabel>{item.nombre} variable </IonLabel>
                            <IonLabel slot="end" className="datos">{item.suma}</IonLabel>
                        </IonItem>
                        )
                    }
                    })} 
                </IonList>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={(e: any) => {e.persist();setPopover(true)}}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                <IonPopover
                   
                    isOpen={popover}
                    animated={false}
                    onDidDismiss={e => setPopover(false)}
                    >
                    <IngresoMov/>
                </IonPopover>
            </IonContent>
        </IonPage>
    )
};

export default Resumen;