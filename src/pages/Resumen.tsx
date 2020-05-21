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
    const [infoImportante, setInfoImportante] = useState<any>({})
    const [totalFijos, setTotalFijos] = useState(0)

    const [efectivo, setEfectivo] = useState<any>({})

    const [popover, setPopover] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});
    
    
    useEffect(()=>{
        db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((querySnapshot) => {
            setInfoImportante({dia:'',sueldo:''})
            querySnapshot.forEach(doc => {
                var objeto = {dia:doc.data().dia_pago,sueldo:doc.data().monto_sueldo}
                setInfoImportante(objeto);
            });
        })
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
            querySnapshot.forEach(doc => {
                if(doc.data().mov_tipo_mov === "gasto"){
                    if(doc.data().mov_tipo_moneda === "efectivo"){
                        var suma = 0;
                        suma += parseInt(doc.data().mov_monto)
                        console.log(suma)
                        setEfectivo({movimiento:"gasto",suma:suma})
                    }
                }
            });
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
                <IonList>
                    <IonItem>
                        <IonLabel>Sueldo</IonLabel><IonLabel slot="end" className="datos">{infoImportante.sueldo}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Gastos fijos</IonLabel><IonLabel slot="end" className="datos">{totalFijos}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Gastos en efectivo</IonLabel><IonLabel slot="end" className="datos">{efectivo.suma}</IonLabel>
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