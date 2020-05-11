import {IonFab, IonFabButton, IonIcon, IonPopover,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid, IonInput, IonLabel, IonButtons, IonButton } from '@ionic/react';
import React, {useState,useEffect,useContext} from 'react';
import './Categorias.css';
import {db,eliminar} from '../firebaseConfig'
import { add,play,caretBack } from 'ionicons/icons';
import {agregarCategoria} from '../components/IngresoCategoria'
import {UserContext} from '../App'

const Categorias: React.FC = () => {
  
  const listaVacia = [] as any[]
  const [lista,setLista] = useState(listaVacia);
  const [nombre, setNombre] = useState('')
  const user = useContext(UserContext)
  const [userID, setUserID] = useState('')


  useEffect(() => {
    db.collection("usersData").doc(user.uid).collection("categorias").onSnapshot((querySnapshot) => {
        setLista(listaVacia)
        querySnapshot.forEach(doc => {
            var objeto = {id:doc.id,nombre:doc.data().nombre_categoria}
            setLista(prevLista => [...prevLista, objeto]);
        })
    });
  },[])

  function eliminarCate(id: string){
    setLista(listaVacia)
    eliminar(id,"categorias",user.uid)
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Configuración</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink="/Mantenedor"><IonIcon icon={caretBack} /></IonButton>Información inicial
                    </IonButtons>
                    <IonLabel>Lista de categorias</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonItem>
                <IonLabel>Nueva categoria</IonLabel>
                <IonInput placeholder="Ingrese nombre" value={nombre} onIonChange={(e:any) => {setNombre(e.target.value)}}>
                </IonInput>
                <IonButtons>
                    <IonButton color="success" onClick={() => {agregarCategoria(nombre,user.uid);setNombre('')}}><IonIcon icon={add}></IonIcon>
                    </IonButton>
                </IonButtons>
            </IonItem>
            <IonGrid>
            <IonRow>
                <IonCol>Nombre de categorias</IonCol>
            </IonRow>
            {lista.map((cate,i) => (
            <IonRow key={i}>
                <IonItemSliding>
                    <IonItem>  
                        <IonCol>{cate.nombre}</IonCol>
                    </IonItem>
                    <IonItemOptions side="end" onClick={() => {eliminarCate(cate.id)}}>
                        <IonItemOption color="danger" expandable>
                            Eliminar
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            </IonRow>
            ))}
            </IonGrid>
        </IonContent>
    </IonPage>
  )
};

export default Categorias;
