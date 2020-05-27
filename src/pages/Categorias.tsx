import {IonList, IonIcon,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow,IonCol, IonGrid, IonInput, IonLabel, IonButtons, IonButton } from '@ionic/react';
import React, {useState,useEffect,useContext} from 'react';
import './Categorias.css';
import {db,eliminar} from '../firebaseConfig'
import { add,trash } from 'ionicons/icons';
import {agregarCategoria} from '../components/IngresoCategoria'
import {UserContext} from '../App'

const Categorias: React.FC = () => {
  
  const listaVacia = [] as any[]
  const [lista,setLista] = useState(listaVacia);
  const [nombre, setNombre] = useState('')
  const user = useContext(UserContext)


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
                    <IonLabel>Lista de categorias</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonList>
                <IonItem>
                    <IonLabel>Nueva categoria:</IonLabel>
                    <IonInput slot="end" placeholder="Ingrese nombre" value={nombre} onIonChange={(e:any) => {setNombre(e.target.value)}}>
                    </IonInput>
                    <IonButtons slot="end">
                        <IonButton color="success" onClick={() => {agregarCategoria(nombre,user.uid);setNombre('')}}><IonIcon icon={add}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonItem>
            </IonList>
            <IonList>
                {lista.map((cate,i) => (
                <IonItemSliding key={i}>
                    <IonItem>
                        <IonLabel>{cate.nombre}</IonLabel>  
                    </IonItem>
                    <IonItemOptions side="end" onIonSwipe={() => eliminarCate(cate.id)}>
                        <IonItemOption color="danger" expandable >
                            Eliminar
                        </IonItemOption>
                    </IonItemOptions>
                    
                </IonItemSliding>
            ))}
            </IonList>
        </IonContent>
    </IonPage>
  )
};

export default Categorias;
