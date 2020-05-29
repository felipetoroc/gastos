import {IonToast, IonList, IonButton, IonItem, IonInput, IonContent } from '@ionic/react';
import React , {useState,useContext} from 'react';
import './IngresoCategoria.css';
import {agregar} from '../firebaseConfig'
import {UserContext} from '../App'

export const agregarTarjeta = (nombre: string,cupo:string,dia:string,uid:string) =>{
    if(nombre!==''){
      const id = agregar({tarjeta_nombre:nombre,tarjeta_cupo:cupo,tarjeta_dia_f:dia},"tarjetas",uid);
      console.log(id)
    }
}

const IngresoTarjeta: React.FC = () => {
  const [mensaje,setMensaje] = useState('');
  const [nombre,setNombre] = useState('');
  const [cupo,setCupo] = useState('');
  const [dia,setDia] = useState('');
  const [showtoast,setShowtoast] = useState(false)
  const user = useContext(UserContext)

  const agregar = () => {
    const docid = agregarTarjeta(nombre,cupo,dia,user.uid);
    setShowtoast(true)
    setMensaje("Tarjeta guardada");
    setNombre('')
    setCupo('')
    setDia('')
  };

  return (
    <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                placeholder="Nombre descriptivo"
                value={nombre} 
                onIonChange={(e: any) => setNombre(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                placeholder="Cupo"
                value={cupo} 
                onIonChange={(e: any) => setCupo(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                placeholder="Día de facturación"
                value={dia} 
                onIonChange={(e: any) => setDia(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonButton color="success" expand="block" onClick={agregar}>Agregar</IonButton>
          </IonList>
          <IonToast
            isOpen={showtoast}
            onDidDismiss={() => setShowtoast(false)}
            message={mensaje}
            duration={500}
          />
      </IonContent>
  );
};

export default IngresoTarjeta;