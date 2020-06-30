import {IonPopover,IonIcon,IonCard,IonCardHeader,IonCardTitle,IonCardSubtitle,IonCardContent,IonItemOption,IonItemOptions,IonItemSliding,IonLabel,IonItem, IonList, IonItemDivider, IonButton, IonGrid, IonRow, IonCol} from '@ionic/react';
import React, {useState, useEffect,useContext} from 'react';
import './DetalleMovimiento.css';
import {db,eliminar} from '../firebaseConfig'
import {UserContext} from '../App'
import {usePeriodo} from '../hooks/usePeriodo'
import {createOutline } from 'ionicons/icons';
import IngresoTarjeta from '../components/IngresoTarjeta';

const DetalleTarjeta: React.FC<any> = (props) => {

    const [tarjeta, setTarjeta] = useState({
        id:'',
        nombre:'',
        cupo: '',
        dia: ''
    });
    const [listaMov, setListaMov] = useState([] as any[])
    const user = useContext(UserContext)
    const [diapago,fechaPago, fechaIni, fechaFin,setDiapago] = usePeriodo(1)
    const [popoverTar, setPopoverTar] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});

    useEffect(()=>{
        setTarjeta(props.data.tarjeta)
        setDiapago(props.data.tarjeta.dia)
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
                if(fecha >= fechaIni){
                    var objeto = {
                        id:doc.id,
                        categoria:doc.data().mov_categoria,
                        cuotas:doc.data().mov_cuotas,
                        descripcion:doc.data().mov_descripcion,
                        fecha:fecha,
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

    function eliminarTarj(id: string){
        eliminar(id,"tarjetas",user.uid)
    }
    return (
        <IonCard>
            <IonItem>
                <IonLabel>{tarjeta.nombre.toUpperCase()}</IonLabel>
                <IonButton slot="end" onClick={(e: any) => {e.persist();setPopoverTar({show:true,evento:e})}}>
                    <IonIcon icon={createOutline} />
                </IonButton>
            </IonItem>
            <IonCardContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>Cupo</IonCol>
                        <IonCol>Utilizado</IonCol>
                        <IonCol>Gasto periodo</IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>{tarjeta.cupo}</IonCol>
                        <IonCol>
                            {Math.round(listaMov.reduce((a:any,b:any) => (tarjeta.nombre===b.tipo_moneda?b.tipo_movimiento==="gasto"?a-b.monto:a+b.monto:a),0))}
                        </IonCol>  
                        <IonCol>
                            {Math.round(listaMov.reduce((a:any,b:any) => (tarjeta.nombre===b.tipo_moneda&&b.fecha<fechaFin?b.tipo_movimiento==="gasto"?a-b.monto:a+b.monto:a),0))}
                        </IonCol>  
                    </IonRow>
                </IonGrid>
           </IonCardContent>
           <IonPopover
                isOpen={popoverTar.show}
                event={popoverTar.evento}
                onDidDismiss={e => setPopoverTar({show:false, evento:e})}
                >
                <IngresoTarjeta data={{tarjeta:tarjeta}}/>
            </IonPopover>
        </IonCard>
    )
};

export default DetalleTarjeta;