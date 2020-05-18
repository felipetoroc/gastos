import {IonGrid,IonRow,IonCol,IonToast,IonItemDivider, IonList, IonButton, IonItem, IonInput, IonContent } from '@ionic/react';
import React , {useState,useContext, useEffect} from 'react';
import './IngresoCategoria.css';
import {agregar} from '../firebaseConfig'
import {UserContext} from '../App'

export const agregarCategoria = (nombre: string,uid:string) =>{
    if(nombre!==''){

      const id = agregar({nombre_categoria:nombre},"categorias",uid);
      console.log(id)
    }
}

const IngresoCategoria: React.FC = () => {
  const [mensaje,setMensaje] = useState('');
  const [texto,setTexto] = useState('');
  const [showtoast,setShowtoast] = useState(false)
  const user = useContext(UserContext)

  const agregar = () => {
    const docid = agregarCategoria(texto,user.uid);
    setShowtoast(true)
    setMensaje("Categoría guardada");
    setTexto('')
  };

  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonInput
              placeholder="Ingresa un nombre"
              value={texto} 
              onIonChange={(e: any) => setTexto(e.target.value)}>
            </IonInput>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton color="success" expand="block" onClick={agregar}>Agregar</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonToast
        isOpen={showtoast}
        onDidDismiss={() => setShowtoast(false)}
        message={mensaje}
        duration={500}
      />
    </IonContent>
  );
};

export default IngresoCategoria;