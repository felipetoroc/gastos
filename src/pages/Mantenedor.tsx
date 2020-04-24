import {IonIcon,IonButtons,IonText,IonLabel,IonHeader, IonContent,IonToolbar, IonTitle, IonPage,IonToast,IonItemDivider, IonList, IonButton, IonItem, IonInput } from '@ionic/react';
import React , {useState,useEffect} from 'react';
import './Mantenedor.css';
import {db,agregar,actualizar} from '../firebaseConfig'
import { add,play } from 'ionicons/icons';


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
            var docid = agregar({
                dia_facturacion: facturacion,
                monto_sueldo: sueldo,
                efectivo_inicial: efectivo,
                cupo_tarjeta: cupo,
                dia_pago: pago
            },"info_importante");
            setShowtoast(true)
            setMensaje("Datos iniciales agregados");
            setIdDoc(docid);
        }else{
            actualizar({
                dia_facturacion: facturacion,
                monto_sueldo: sueldo,
                efectivo_inicial: efectivo,
                cupo_tarjeta: cupo,
                dia_pago: pago
            },"info_importante",idDoc);
            setShowtoast(true)
            setMensaje("Datos iniciales modificados");
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Configuración</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonTitle>
                            <IonLabel>Información inicial</IonLabel>
                        </IonTitle>
                        <IonButtons slot="end">
                            Lista de categorias<IonButton routerLink="/Categorias"><IonIcon icon={play} /></IonButton>
                        </IonButtons>
                    </IonItem>
                </IonList>
                <IonList>
                    <IonItem>
                    <IonLabel>Fecha facturación TC</IonLabel>
                    <IonInput
                        value={facturacion} 
                        onIonChange={(e: any) => setFacturacion(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <IonItem>
                    <IonLabel>Sueldo</IonLabel>
                    <IonInput slot="end"
                        value={sueldo} 
                        onIonChange={(e: any) => setSueldo(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <IonItem>
                    <IonLabel>Efectivo inicial</IonLabel>
                    <IonInput
                        value={efectivo} 
                        onIonChange={(e: any) => setEfectivo(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <IonItem>
                    <IonLabel>Cupo tarjeta de crédito</IonLabel>
                    <IonInput
                        value={cupo} 
                        onIonChange={(e: any) => setCupo(e.target.value)}>
                    </IonInput>
                    </IonItem>
                    <IonItem>
                    <IonLabel>Dia de pago</IonLabel>
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