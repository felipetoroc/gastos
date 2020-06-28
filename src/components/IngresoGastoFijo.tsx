import {IonToast,IonList, IonButton, IonItem, IonInput, IonContent } from '@ionic/react';
import React , {useState,useContext} from 'react';
import './IngresoGastoFijo.css';
import {agregar} from '../firebaseConfig'
import {UserContext} from '../App'

const IngresoGastoFijo: React.FC = () => {
  const [mensaje,setMensaje] = useState('');
  const [texto,setTexto] = useState('');
  const [monto,setMonto] = useState('');
  const [showtoast,setShowtoast] = useState(false)
  const user = useContext(UserContext)

  const agregarGasto = () => {
    const docid = agregar({descripcion:texto,monto:monto},"gastos_fijos",user.uid);
    setShowtoast(true)
    setMensaje("Gasto fijo ingresado correctamente");
    setMonto('')
    setTexto('')
    console.log(docid)
  };

  return (
    <IonContent className="ion-padding">
      <IonList>
        <IonItem>
          <IonInput
            placeholder="Descripción"
            value={texto} 
            onIonChange={(e: any) => setTexto(e.target.value)}>
          </IonInput>
        </IonItem>
        <IonItem>
          <IonInput
            placeholder="Monto"
            value={monto} 
            onIonChange={(e: any) => setMonto(e.target.value)}>
          </IonInput>
        </IonItem>
          
      </IonList>
      <IonButton expand="block" onClick={agregarGasto}>Guardar</IonButton>
      <IonToast
        isOpen={showtoast}
        onDidDismiss={() => setShowtoast(false)}
        message={mensaje}
        duration={500}
      />
    </IonContent>
  );
};

export default IngresoGastoFijo;