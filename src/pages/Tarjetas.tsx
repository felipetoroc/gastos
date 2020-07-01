import {IonButton,IonModal,IonItem,IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonIcon} from '@ionic/react';
import React, {useState,useEffect,useContext} from 'react';
import './Tarjetas.css';
import {db} from '../firebaseConfig'
import {UserContext} from '../App'
import DetalleTarjeta from '../components/DetalleTarjeta';
import ListaMovimientos from '../components/ListaMovimientos';
import {listOutline } from 'ionicons/icons';

const Tarjetas: React.FC = () => {
  
  const listaVacia = [] as any[]
  const [lista,setLista] = useState(listaVacia);
  const user = useContext(UserContext)
  const [selected, setSelected] = useState('')
  
  const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((querySnapshot) => {
            setLista(listaVacia)
            querySnapshot.forEach(doc => {
                var objeto = {id:doc.id,nombre:doc.data().tarjeta_nombre,cupo:doc.data().tarjeta_cupo,dia:doc.data().tarjeta_dia_f}
                setLista(prevLista => [...prevLista, objeto]); 
            })
        });
    },[])

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Configuración</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            
            <IonItem>
                <IonLabel>Lista de tarjetas</IonLabel>
            </IonItem>
            
            <IonList>
                {lista.map((tarjeta,i) => (
                    <IonList key={i}>
                        <IonButton onClick={() => {setShowModal(true);setSelected(tarjeta)}}><IonIcon icon={listOutline}/></IonButton>
                        <DetalleTarjeta  data={{tarjeta:{id:tarjeta.id,nombre:tarjeta.nombre,cupo:tarjeta.cupo,dia:tarjeta.dia}}}/>
                    </IonList>
                ))}
            </IonList>
            <IonModal isOpen={showModal}>
            <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
                <IonContent>
                    <ListaMovimientos data={{tarjeta:selected}}/>
                </IonContent>
            </IonModal>
        </IonContent>
    </IonPage>
  )
};

export default Tarjetas;
