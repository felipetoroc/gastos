import {IonHeader, IonContent,IonToolbar, IonTitle, IonPage,IonToast,IonItemDivider, IonList, IonButton, IonItem, IonInput } from '@ionic/react';
import React , {useState,useEffect} from 'react';
import './Mantenedor.css';
import {db} from '../firebaseConfig'

const Mantenedor: React.FC = () => {
    const [showtoast,setShowtoast] = useState(false);
    const [mensaje,setMensaje] = useState('');
    const [facturacion,setFacturacion] = useState('');
    const [sueldo,setSueldo] = useState('');
    const [efectivo,setEfectivo] = useState('');
    const [cupo,setCupo] = useState('');
    const [pago,setPago] = useState('');
    const [idDoc,setIdDoc] = useState<any>();
  
    useEffect(() => {
        db.collection("info_importante").onSnapshot((querySnapshot) => {
            querySnapshot.forEach(doc => {
                if(doc.id){
                    setFacturacion(doc.data().dia_facturacion)
                    setSueldo(doc.data().monto_sueldo)
                    setEfectivo(doc.data().efectivo_inicial)
                    setCupo(doc.data().cupo_tarjeta)
                    setPago(doc.data().dia_pago)
                    setIdDoc(doc.id)
                }
            });
        }, (error) => {
            console.log(error)
        })
      },[])

    const agregarDatos = () => {
        if(!idDoc){
            var docid = db.collection("info_importante").doc();
            docid.set({
                dia_facturacion: facturacion,
                monto_sueldo: sueldo,
                efectivo_inicial: efectivo,
                cupo_tarjeta: cupo,
                dia_pago: pago
            });
            setShowtoast(true)
            setMensaje("Datos iniciales agregados");
            setIdDoc(docid.id);
        }else{
            db.collection("info_importante").doc(idDoc).set({
                dia_facturacion: facturacion,
                monto_sueldo: sueldo,
                efectivo_inicial: efectivo,
                cupo_tarjeta: cupo,
                dia_pago: pago
            });
            setShowtoast(true)
            setMensaje("Datos iniciales modificados");
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Información importante</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItemDivider>Fecha facturación TC</IonItemDivider>
                    <IonItem>
                    <IonInput
                        value={facturacion} 
                        onIonChange={(e: any) => setFacturacion(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <IonItemDivider>Sueldo</IonItemDivider>
                    <IonItem>
                    <IonInput
                        value={sueldo} 
                        onIonChange={(e: any) => setSueldo(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <IonItemDivider>Efectivo inicial</IonItemDivider>
                    <IonItem>
                    <IonInput
                        value={efectivo} 
                        onIonChange={(e: any) => setEfectivo(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <IonItemDivider>Cupo tarjeta de crédito</IonItemDivider>
                    <IonItem>
                    <IonInput
                        value={cupo} 
                        onIonChange={(e: any) => setCupo(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <IonItemDivider>Dia de pago</IonItemDivider>
                    <IonItem>
                    <IonInput
                        value={pago} 
                        onIonChange={(e: any) => setPago(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <section>
                    <IonButton expand="block" onClick={agregarDatos}>Guardar</IonButton>
                    </section>
                </IonList>
                <IonToast
                    isOpen={showtoast}
                    onDidDismiss={() => setShowtoast(false)}
                    message={mensaje}
                    duration={500}
                />
            </IonContent>
        </IonPage>
    );
};

export default Mantenedor;