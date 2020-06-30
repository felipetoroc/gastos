import {IonLabel,IonToast, IonList, IonButton, IonItem, IonInput, IonContent, IonText } from '@ionic/react';
import React , {useState,useContext, useEffect} from 'react';
import './IngresoCategoria.css';
import {agregar,actualizar} from '../firebaseConfig'
import {UserContext} from '../App'

export const agregarTarjeta = (nombre: string,cupo:string,dia:string,uid:string) =>{
    if(nombre!==''){
      const id = agregar({tarjeta_nombre:nombre,tarjeta_cupo:cupo,tarjeta_dia_f:dia},"tarjetas",uid);
      console.log(id)
    }
}

const IngresoTarjeta: React.FC<any> = (props) => {
  const [mensaje,setMensaje] = useState('');
  const [mensajeError,setMensajeError] = useState('');
  const [nombre,setNombre] = useState('');
  const [cupo,setCupo] = useState('');
  const [dia,setDia] = useState('');
  const [showtoast,setShowtoast] = useState(false)

  const user = useContext(UserContext)

  useEffect(()=>{
    if(typeof props.data !== "undefined"){
      setNombre(props.data.tarjeta.nombre)
      setCupo(props.data.tarjeta.cupo)
      setDia(props.data.tarjeta.dia)
    }
  },[])

  function validarCampos(){
    if(nombre === '' || cupo === '' || dia === ''){
      return 1;
    }else{
      if(Number.isInteger(parseInt(cupo)) === false || Number.isInteger(parseInt(dia)) === false){
        return 2;
      }else{
        if(parseInt(dia) > 31 || parseInt(dia) < 1){
          return 3;
        }else{
          return 0;
        }
      }
    }
  }
  
  const agregar = () => {
    if(validarCampos() === 0){
      if(typeof props.data === "undefined"){
        const docid = agregarTarjeta(nombre,cupo,dia,user.uid);
        setShowtoast(true)
        setMensaje("Tarjeta guardada");
        setNombre('')
        setCupo('')
        setDia('')
      }else{
        actualizar({
          tarjeta_nombre: nombre,
          tarjeta_cupo: cupo,
          tarjeta_dia_f: dia
      },"tarjetas",props.data.tarjeta.id,user.uid);
      }
    }else{
      switch(validarCampos()){
        case 1: setMensajeError("Faltan datos")
        break
        case 2: setMensajeError("Cupo y día numéricos")
        break
        case 3: setMensajeError("Día entre 1 y 31")
      }
    }
    
  };

  return (
    <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonLabel>{mensajeError===''?<IonText color="primary">Ingrese datos</IonText>:<IonText color="danger">{mensajeError}</IonText>}</IonLabel>
            </IonItem>
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
            <IonButton color="success" expand="block" onClick={agregar}>Guardar</IonButton>
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