import {IonToast,IonList, IonButton, IonItem, IonInput, IonContent, IonLabel } from '@ionic/react';
import React , {useState,useContext} from 'react';
import './IngresoGastoFijo.css';
import {agregar} from '../firebaseConfig'
import {UserContext} from '../App'
import { isNumber } from 'util';

const IngresoGastoFijo: React.FC = () => {
  const [mensaje,setMensaje] = useState('');
  const [mensajeError, setMensajeError] = useState('')
  const [texto,setTexto] = useState('');
  const [monto,setMonto] = useState('');
  const [showtoast,setShowtoast] = useState(false)
  const user = useContext(UserContext)

  function validarCampos(){
    if(texto === '' || monto === ''){
      return 1;
    }else{
      if(Number.isInteger(parseInt(monto)) === false){
        return 2;
      }else{
        return 0;
      }
    }
  }
  const agregarGasto = () => {
    if(validarCampos() === 0){
      const docid = agregar({descripcion:texto,monto:monto},"gastos_fijos",user.uid);
      setShowtoast(true)
      setMensaje("Gasto fijo ingresado correctamente");
      setMonto('')
      setTexto('')
      console.log(docid)
    }else{
      switch(validarCampos()){
        case 1:
          setMensajeError("Faltan Datos")
          break
        case 2:
          setMensajeError("Monto debe ser numérico")
          break
      }
    }
    
  };

  return (
    <IonContent className="ion-padding">
      <IonList>
        <IonItem>
          <IonLabel color="danger">{mensajeError}</IonLabel>
        </IonItem>
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