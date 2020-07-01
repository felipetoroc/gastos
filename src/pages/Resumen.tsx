import {IonItem,IonList, IonPage,IonHeader,IonToolbar,IonTitle,IonContent, IonLabel} from '@ionic/react';
import React, {useState,useEffect,useContext} from 'react';
import './Resumen.css';
import {db} from '../firebaseConfig'
import {UserContext} from '../App'
import {usePeriodo} from '../hooks/usePeriodo'

const Resumen: React.FC = () => {
    const user = useContext(UserContext)
    const [tarjetas, setTarjetas] = useState<any>([])
    const [totalFijos, setTotalFijos] = useState(0)
    const [pptVariable, setPptVariable] = useState('')

    const [diapago,fechaPago, fechaIni, fechaFin,setDiapago] = usePeriodo(1,0)

    const [gefectivof, setGefectivof] = useState(0)
    const [gefectivov, setGefectivov] = useState(0)
    const [iefectivof, setIefectivof] = useState(0)
    const [iefectivov, setIefectivov] = useState(0)
    const [gTarjetasf, setGtarjetasf] = useState<any>([])
    const [gTarjetasv, setGtarjetasv] = useState<any>([])
    const [iTarjetasf, setItarjetasf] = useState<any>([])
    const [iTarjetasv, setItarjetasv] = useState<any>([])

    useEffect(()=>{
        db.collection("usersData").doc(user.uid).collection("gastos_fijos").onSnapshot((qGastos) => {
            db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((qTarjetas) => {
                db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((q) => {
                    var sumaTotal = 0
                    setTarjetas([])
                    if(q.empty === false){
                        setDiapago(q.docs[0].data().dia_pago) 
                        setPptVariable(q.docs[0].data().ppt_variable)
                    }
                    qTarjetas.forEach(doc => {
                        var objeto = {nombre:doc.data().tarjeta_nombre}
                        setTarjetas((prevTarjeta:any) => [...prevTarjeta, objeto]);
                    });
                    qGastos.forEach(doc => {
                        sumaTotal += parseFloat(doc.data().monto)
                    });
                    setTotalFijos(sumaTotal)
                });
            })
        })
    },[])

    useEffect(() => {
        db.collection("usersData").doc(user.uid).collection("movimientos").onSnapshot((querySnapshot) => {
                db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((querySnapshot3) => {
                    setGefectivof(0)
                    setGefectivov(0)
                    setIefectivof(0)
                    setIefectivov(0)
                    setGtarjetasf([])
                    setGtarjetasv([])
                    setItarjetasf([])
                    setItarjetasv([])
                    
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
                    if(querySnapshot3.empty === false){
                        querySnapshot3.forEach(doc => {
                            const sum1 = otrosGastosf.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre === doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                                return acumulator
                            },0)
                            const sum2 = otrosGastosv.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre === doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                                return acumulator
                            },0)
                            const sum3 = otrosIngresosf.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre === doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                                return acumulator
                            },0)
                            const sum4 = otrosIngresosv.reduce((acumulator,currentValue) =>{
                                if(currentValue.nombre === doc.data().tarjeta_nombre){
                                    return acumulator + currentValue.monto
                                }
                                return acumulator
                            },0)
                            setGtarjetasf((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum1}])
                            setGtarjetasv((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum2}])
                            setItarjetasf((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum3}])
                            setItarjetasv((prev:any) => [...prev, {nombre: doc.data().tarjeta_nombre, suma:sum4}])
                        });
                    }
                })
            
        })
      },[diapago])

    return (
        <IonPage className="resumen">
            <IonHeader>
                <IonToolbar>
                    
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Resumen Gastos</IonTitle>
                    </IonToolbar>
                </IonHeader>
                
                <IonList>
                    <IonItem>
                        <IonLabel>Periodo: desde <b>{fechaIni.toLocaleDateString()}</b> hasta <b>{fechaFin.toLocaleDateString()}</b></IonLabel>
                    </IonItem>
                </IonList>
                <IonList>
                    <IonItem>
                        <IonLabel><b>Restantes gasto mensual</b></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel><b>Solo efectivo</b></IonLabel>
                        <IonLabel slot="end" className="datos">{
                            (iefectivof+iefectivov)-(gefectivof+gefectivov)
                        }</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel><b>Tarjetas + efectivo</b></IonLabel>
                        <IonLabel slot="end" className="datos">{
                            (iefectivof+iefectivov+iTarjetasf.reduce((a:any,b:any)=>(a+b.suma),0)+iTarjetasv.reduce((a:any,b:any)=>(a+b.suma),0))-(gefectivof+gefectivov+gTarjetasf.reduce((a:any,b:any)=>(a+b.suma),0)+gTarjetasv.reduce((a:any,b:any)=>(a+b.suma),0))
                        }</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel><b>Gastos Fijos</b></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Presupuesto:  {totalFijos}</IonLabel>
                        <IonLabel slot="end" className="datos">Real:  {gefectivof+gTarjetasf.reduce((a:number,b:any) => {return a+b.suma},0)}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel><b>Gastos Variables</b></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Presupuesto:  {pptVariable}</IonLabel>
                        <IonLabel slot="end" className="datos">Real:  {gefectivov+gTarjetasv.reduce((a:number,b:any) => {return a+b.suma},0)}</IonLabel>
                    </IonItem>
                </IonList>
                <IonList>
                    <IonItem>
                        <IonLabel><b>Ingresos</b></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Efectivo</IonLabel>
                        <IonLabel slot="end" className="datos">{iefectivof+iefectivov}</IonLabel>
                    </IonItem>
                    
                    {iTarjetasf.map((item:any,i:any) => {
                        if(typeof item.suma !== "undefined" && item.suma !== 0){
                            return(
                            <IonItem key={i}>
                                <IonLabel>{item.nombre} fijo </IonLabel>
                                <IonLabel slot="end" className="datos">{item.suma}</IonLabel>
                            </IonItem>
                            )
                        }
                    })}
                    {iTarjetasv.map((item:any,i:any) => {
                        if(typeof item.suma !== "undefined" && item.suma !== 0){
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
                        <IonLabel>efectivo</IonLabel><IonLabel slot="end" className="datos">{gefectivof+gefectivov}</IonLabel>
                    </IonItem>
                    {tarjetas.map((val:any,x:any) => {
                        return(
                            <IonItem key={x}>
                                <IonLabel>{val.nombre}</IonLabel>
                                <IonLabel slot="end" className="datos">
                                    {
                                        gTarjetasf.reduce((a:any,b:any)=>(b.nombre===val.nombre?a+b.suma:a),0)+gTarjetasv.reduce((a:any,b:any)=>(b.nombre===val.nombre?a+b.suma:a),0)
                                    }
                                </IonLabel>
                            </IonItem>
                            )
                    })}
                    <IonItem>
                        <IonLabel><b>Detalle por frecuencia</b></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Efectivo fijo</IonLabel><IonLabel slot="end" className="datos">{gefectivof}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Efectivo variable</IonLabel><IonLabel slot="end" className="datos">{gefectivov}</IonLabel>
                    </IonItem>
                    
                    {gTarjetasf.map((item:any,i:any) => {
                    if(typeof item.suma !== "undefined" && item.suma !== 0){
                        return(
                        <IonItem key={i}>
                            <IonLabel>{item.nombre} fijo </IonLabel>
                            <IonLabel slot="end" className="datos">{item.suma}</IonLabel>
                        </IonItem>
                        )
                    }
                    })}
                    {gTarjetasv.map((item:any,i:any) => {
                    if(typeof item.suma !== "undefined"  && item.suma !== 0){
                        return(
                        <IonItem key={i}>
                            <IonLabel>{item.nombre} variable </IonLabel>
                            <IonLabel slot="end" className="datos">{item.suma}</IonLabel>
                        </IonItem>
                        )
                    }
                    })} 
                </IonList>
            </IonContent>
        </IonPage>
    )
};

export default Resumen;