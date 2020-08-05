import {IonAlert,IonIcon,IonPage,IonToolbar,IonTitle,IonHeader,IonContent, IonList, IonButton, IonItem, IonInput, IonCard, IonLabel } from '@ionic/react';
import React , {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import './Registro.css';
import {regin} from '../firebaseConfig'
import { checkmarkCircle } from 'ionicons/icons';

const Registro: React.FC = () => {
  const history = useHistory()
  const [correo,setCorreo] = useState('');
  const [password,setPassword] = useState('');
  const [rpassword,setRpassword] = useState('');
  const [checkPass, setCheckPass] = useState(false);
  const [error, setError] = useState('')

  const [alertRegCorrecto,setAlertRegCorrecto] = useState(false)


  useEffect(() => {
    if(password!==''){
        if(password!==rpassword){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
            setCheckPass(false)
        }else{
            setCheckPass(true)
        }
    }
  },[rpassword])

  async function regUser(){
    if(checkPass===true){
        if(password.length >= 6){
            const res = await regin(correo,password);
            if(res===true){
                setAlertRegCorrecto(true)
                setCorreo('')
                setPassword('')
                setRpassword('')
                setError('')
            }else{
                setError("Registro fallido")
            }
        }else{
            setError("Contraseña muy corta. 6 caracteres mínimo")
        }
    }else{
        setError("Contraseñas no coinciden")
    }
  };

  return (
    <IonPage className="registro">
        <IonHeader>
            <IonToolbar>
                <IonTitle>Registro de usuario</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
            <IonList className="error">
                <IonLabel color="danger">{error}</IonLabel>
            </IonList>
            <IonList>
                <IonItem>
                <IonInput
                    type="email"
                    placeholder="Correo"
                    value={correo} 
                    onIonChange={(e: any) => setCorreo(e.target.value)}>
                </IonInput>
                </IonItem>
                <IonItem>
                <IonInput
                    type="password"
                    placeholder="Contraseña"
                    value={password} 
                    onIonChange={(e: any) => setPassword(e.target.value)}>
                </IonInput>
                </IonItem>
                <IonItem>
                <IonInput
                    type="password"
                    placeholder="Repita contraseña"
                    value={rpassword} 
                    onIonChange={(e: any) => setRpassword(e.target.value)}>
                </IonInput>
                {checkPass===true?<IonIcon color="success" icon={checkmarkCircle} />:<></>}
                </IonItem>
            </IonList>
            <IonList>
                <IonButton expand="block" onClick={regUser}>Registrarse</IonButton>
            </IonList>
            <IonList>
                <IonItem routerLink="/Login" routerDirection="none" lines="none">
                    <IonLabel color="primary">Ya tienes una cuenta? inicia sesión aquí</IonLabel>
                </IonItem>
            </IonList>
          </IonCard>
        </IonContent>
        <IonAlert
            isOpen={alertRegCorrecto}
            onDidDismiss={() => setAlertRegCorrecto(false)}
            header={'Registro correcto!'}
            message={'Registro correcto, ahora puede iniciar sesión'}
            buttons={[
            {
                text: 'vamos!',
                handler: () => {
                    history.goBack();
                }
            }
            ]}
        />
    </IonPage>
  );
};

export default Registro;