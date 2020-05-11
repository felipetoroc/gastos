import {IonPage,IonToolbar,IonTitle,IonHeader,IonContent,IonToast,IonItemDivider, IonList, IonButton, IonItem, IonInput, IonCard, IonLabel } from '@ionic/react';
import React , {useState} from 'react';
import './Login.css';
import {login} from '../firebaseConfig'
import {useHistory} from 'react-router-dom'

const Login: React.FC = () => {
  const [correo,setCorreo] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('')
  const history = useHistory()

  async function loginUser(){
    const res = await login(correo,password);
    if(res===false){
      setError("Contraseña incorrecta o usuario no existe")
      setCorreo('')
      setPassword('')
    }else{
      history.replace('/Resumen')
    }
    
  };

  return (
    <IonPage className="login">
        <IonHeader>
            <IonToolbar>
                <IonTitle>Inicio de sesión</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
          <IonList className="error">
                <IonLabel color="danger">{error}</IonLabel>
          </IonList>
          <IonList>
            <IonItem>
            <IonLabel>Correo</IonLabel>
              <IonInput
                value={correo} 
                onIonChange={(e: any) => setCorreo(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Contraseña</IonLabel>
              <IonInput
                type="password"
                value={password} 
                onIonChange={(e: any) => setPassword(e.target.value)}>
              </IonInput>
            </IonItem>
          </IonList>
          <IonList>
              <IonButton expand="block" onClick={loginUser}>Iniciar sesión</IonButton>
          </IonList>
          <IonItem routerLink="/Registro" routerDirection="none" lines="none" >
                    <IonLabel color="primary">Usuario nuevo</IonLabel>
                </IonItem>
          </IonCard>
        </IonContent>
    </IonPage>
  );
};

export default Login;