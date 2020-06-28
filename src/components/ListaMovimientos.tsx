import {IonPopover,IonLabel,IonItem,IonItemOption,IonItemOptions,IonItemSliding} from '@ionic/react';
import React, {useState,useEffect, useContext} from 'react';
import './ListaMovimientos.css';
import {db,eliminar} from '../firebaseConfig'
import {UserContext} from '../App'
import {usePeriodo} from '../hooks/usePeriodo'
import DetalleMovimiento from './DetalleMovimiento';


const ListaMovimientos: React.FC<any> = () => {
    const user = useContext(UserContext)

    const [listaMov, setListaMov] = useState([] as any[]);
    const [selected, setSelected] = useState()

    const [diapago,fechaPago, fechaIni, fechaFin,setDiapago] = usePeriodo(1)

    const [popoverDetails, setPopoverDetails] = useState(false);

    useEffect(()=>{
        db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((q) => {
          if(q.empty === false){
            setDiapago(q.docs[0].data().dia_pago) 
          }
        });
    },[])
    
    useEffect(() => {
        db.collection("usersData").doc(user.uid).collection("movimientos")
        /*.where("mov_tipo_mov",fTipoMov.comp,fTipoMov.tipo)
        .where("mov_frec_mov",fFrecMov.comp,fFrecMov.frec)
        .orderBy("mov_tipo_mov")*/
        .orderBy("mov_fecha","desc")
        .onSnapshot((q2) => {
            setListaMov([])
            q2.forEach(doc => {
              var fecha = new Date(doc.data().mov_fecha)
              if(fecha >= fechaIni && fecha < fechaFin){
                var objeto = {
                    id:doc.id,
                    categoria:doc.data().mov_categoria,
                    cuotas:doc.data().mov_cuotas,
                    descripcion:doc.data().mov_descripcion,
                    fecha:fecha.toLocaleDateString(),
                    monto:parseFloat(doc.data().mov_monto),
                    frecuencia:doc.data().mov_frec_mov,
                    tipo_moneda:doc.data().mov_tipo_moneda,
                    tipo_movimiento:doc.data().mov_tipo_mov
                }
                setListaMov(prev => [...prev,objeto])
              }
            })
            
          })
    },[diapago])

    function eliminarMov(id: string){
        eliminar(id,"movimientos",user.uid)
    }

    return (
        <>
            
            <IonItem>
                <IonLabel>Periodo: desde <b>{fechaIni.toLocaleDateString()}</b> hasta <b>{fechaFin.toLocaleDateString()}</b></IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Total</IonLabel>
                <IonLabel slot="end">
                    {Math.round(listaMov.reduce((a:any,b:any)=>(b.tipo_movimiento=="ingreso"?a+b.monto:a-b.monto),0))}
                </IonLabel>
            </IonItem>
            {listaMov.map((mov:any,i:any,arr:any) => { 
                return(
                    <div  key={i}>
                        <IonItemSliding onClick={() => {setPopoverDetails(true);setSelected(mov)}}>
                            <IonItem lines="none">
                                <IonLabel color="primary">{mov.fecha}</IonLabel>
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