import {IonToast,IonItemDivider, IonList, IonButton, IonItem, IonInput } from '@ionic/react';
import React , {useState} from 'react';
import './IngresoGasto.css';
import {db} from '../firebaseConfig'

const Ingreso: React.FC = () => {
  const [mensaje,setMensaje] = useState('');
  const [texto,setTexto] = useState('');
  const [monto,setMonto] = useState('');
  const [showtoast,setShowtoast] = useState(false)

  const agregarGasto = () => {
    try{
      db.collection("gastos").add({
        descripcion: texto,
        monto: monto
      });
      setShowtoast(true)
      setMensaje("Gasto ingresado correctamente");
    }catch(error){
      setMensaje(error)
    }
  };

  return (
    <>
          <IonList>
            <IonItemDivider>Descripción gasto</IonItemDivider>
            <IonItem>
              <IonInput
                value={texto} 
                onIonChange={(e: any) => setTexto(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItemDivider>Monto</IonItemDivider>
            <IonItem>
              <IonInput
                value={monto} 
                onIonChange={(e: any) => setMonto(e.target.value)}>
              </IonInput>
            </IonItem>
            <section>
              <IonButton expand="block" onClick={agregarGasto}>Guardar</IonButton>
            </section>
          </IonList>
          <IonToast
            isOpen={showtoast}
            onDidDismiss={() => setShowtoast(false)}
            message={mensaje}
            duration={500}
          />
      </>
  );
};

export default Ingreso;