import {IonToast,IonItemDivider, IonList, IonButton, IonItem, IonInput } from '@ionic/react';
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
    <>
          <IonList>
            <IonItemDivider>Nombre categoría</IonItemDivider>
            <IonItem>
              <IonInput
                value={texto} 
                onIonChange={(e: any) => setTexto(e.target.value)}>
              </IonInput>
            </IonItem>
            <section>
              <IonButton expand="block" onClick={agregar}>Guardar</IonButton>
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

export default IngresoCategoria;