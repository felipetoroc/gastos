import {IonButton,IonPopover,IonLabel,IonItem,IonItemOption,IonItemOptions,IonItemSliding} from '@ionic/react';
import React, {useState,useEffect, useContext} from 'react';
import './ListaMovimientos.css';
import {db,eliminar} from '../firebaseConfig'
import {UserContext} from '../App'
import {usePeriodo} from '../hooks/usePeriodo'
import DetalleMovimiento from './DetalleMovimiento';


const ListaMovimientos: React.FC<any> = (props) => {
    const user = useContext(UserContext)

    const [listaMov, setListaMov] = useState([] as any[]);
    const [selected, setSelected] = useState()

    const [contPeriodo,setContPeriodo] = useState(0)
    const [diapago,fechaPago, fechaIni, fechaFin,setDiapago,setNumPeriodo] = usePeriodo(1,1)
    
    const [popoverDetails, setPopoverDetails] = useState(false);

    useEffect(() =>{
        setNumPeriodo(contPeriodo)
        console.log(contPeriodo)
    },[contPeriodo])

    useEffect(()=>{
        db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((q) => {
          if(q.empty === false){
            setNumPeriodo(contPeriodo)
            setDiapago(q.docs[0].data().dia_pago) 
          }
        });
    },[])
    
    useEffect(() => {
        db.collection("usersData").doc(user.uid).collection("movimientos")
        .orderBy("mov_fecha","desc")
        .onSnapshot((q2) => {
            setListaMov([])
            q2.forEach(doc => {
                var objeto = {
                    id:doc.id,
                    categoria:doc.data().mov_categoria,
                    cuotas:doc.data().mov_cuotas,
                    descripcion:doc.data().mov_descripcion,
                    fecha:doc.data().mov_fecha,
                    monto:parseFloat(doc.data().mov_monto),
                    frecuencia:doc.data().mov_frec_mov,
                    tipo_moneda:doc.data().mov_tipo_moneda,
                    tipo_movimiento:doc.data().mov_tipo_mov
                }
                if(typeof props.data !== "undefined"){
                    if(objeto.tipo_moneda === props.data.tarjeta.nombre){
                        console.log(props.data.tarjeta.nombre)
                        setListaMov(prev => [...prev,objeto])
                    }
                }else{
                    setListaMov(prev => [...prev,objeto])
                }
            })
          })
    },[])

    function eliminarMov(id: string){
        eliminar(id,"movimientos",user.uid)
    }

    return (
        <>
            <IonItem>
                <IonButton color="warning" onClick={() => setContPeriodo(contPeriodo-1)} slot="start">Anterior</IonButton>
                <IonLabel>Periodo: desde <b>{fechaIni.toLocaleDateString()}</b> hasta <b>{fechaFin.toLocaleDateString()}</b></IonLabel>
                <IonButton color="warning" onClick={() => setContPeriodo(contPeriodo+1)} slot="end">Siguiente</IonButton>
            </IonItem>
            <IonItem>
                <IonLabel>Total</IonLabel>
                <IonLabel slot="end">
                    {
                        Math.round(
                            listaMov.reduce((a:any,b:any) => {
                                var fecha = new Date(b.fecha)
                                if(fecha >= fechaIni && fecha < fechaFin){
                                    if(b.tipo_movimiento === "ingreso"){
                                        return a+b.monto
                                    }else{
                                        return a-b.monto
                                    }
                                }
                                return a
                            },0)
                        )
                    }
                </IonLabel>
            </IonItem>
            {listaMov.map((mov:any,i:any,arr:any) => { 
                var fecha = new Date(mov.fecha)
                if(fecha >= fechaIni && fecha < fechaFin)
                return(
                    <div  key={i}>
                        <IonItemSliding onClick={() => {setPopoverDetails(true);setSelected(mov)}}>
                            <IonItem lines="none">
                                <IonLabel color="primary">{fecha.toLocaleDateString()}</IonLabel>
                                <IonLabel>{mov.descripcion}</IonLabel>
                                <IonLabel>{mov.tipo_movimiento==="gasto"?<span style={{color:"red"}}>-{Math.round(mov.monto)}</span >:<span style={{color:"green"}}>{Math.round(mov.monto)}</span>}</IonLabel>
                                <IonLabel>{mov.tipo_moneda}</IonLabel>
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
            <IonPopover
                isOpen={popoverDetails}
                animated={false}
                onDidDismiss={e => setPopoverDetails(false)}
                >
                <DetalleMovimiento data={{movimiento:selected}}/>
            </IonPopover>
        </>
    )
};

export default ListaMovimientos;