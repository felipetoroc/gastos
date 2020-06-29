import {IonIcon,IonButtons,IonLabel,IonHeader, IonContent,IonToolbar, IonTitle, IonPage,IonToast, IonList, IonButton, IonItem, IonInput } from '@ionic/react';
import React , {useState,useEffect,useContext} from 'react';
import './Mantenedor.css';
import {db,agregar,actualizar} from '../firebaseConfig'
import {play} from 'ionicons/icons';
import {UserContext} from '../App'


const Mantenedor: React.FC = () => {
    const [showtoast,setShowtoast] = useState(false);
    const [mensaje,setMensaje] = useState('');
    const [sueldo,setSueldo] = useState('');
    const [pago,setPago] = useState('');
    const [idDoc,setIdDoc] = useState<any>();
    const [pptVariable, setPptVariable] = useState('')

    const user = useContext(UserContext)

    useEffect(() => {
        db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((querySnapshot) => {
            querySnapshot.forEach(doc => {
                if(doc.id){
                    setSueldo(doc.data().monto_sueldo)
                    setPago(doc.data().dia_pago)
                    setIdDoc(doc.id)
                    setPptVariable(doc.data().ppt_variable)
                }
            });
        }, (error) => {
            console.log(error)
        })
    },[])

    const agregarDatos = () => {
        if(!idDoc){
            var docid = agregar({
                monto_sueldo: sueldo,
                dia_pago: pago,
                ppt_variable: pptVariable
            },"info_importante",user.uid);
            setShowtoast(true)
            setIdDoc(docid);
        }else{
            actualizar({
                monto_sueldo: sueldo,
                dia_pago: pago,
                ppt_variable: pptVariable
            },"info_importante",idDoc,user.uid);
            setShowtoast(true)
        }
        setMensaje("Datos guardados");
    };

    return (
        <IonPage className="mantenedor">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Configuración</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonHeader>
                    <IonToolbar>
                        <IonLabel>Información importante</IonLabel>
                    </IonToolbar>
                </IonHeader>
                <IonList>
                    {/*<IonItem>
                        <IonLabel>Sueldo</IonLabel>
                        <IonInput slot="end"
                            value={sueldo} 
                            onIonChange={(e: any) => setSueldo(e.target.value)}>
                        </IonInput>
                    </IonItem>*/}
                    <IonItem>
                        <IonLabel>Dia de pago</IonLabel>
                        <IonInput
                            value={pago} 
                            onIonChange={(e: any) => setPago(e.target.value)}>
                        </IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Presupuesto gasto variable</IonLabel>
                        <IonInput
                            value={pptVariable} 
                            onIonChange={(e: any) => setPptVariable(e.target.value)}>
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