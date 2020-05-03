import {IonFab, IonFabButton, IonIcon, IonPopover,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid, IonInput, IonLabel, IonButtons, IonButton } from '@ionic/react';
import React, {useState,useEffect} from 'react';
import './Categorias.css';
import {db,eliminar,agregar} from '../firebaseConfig'
import { add,play,caretBack } from 'ionicons/icons';
import {agregarCategoria} from '../components/IngresoMov'

const Categorias: React.FC = () => {
  const listaVacia = [] as any[]
  const [lista,setLista] = useState(listaVacia);
  const [nombre, setNombre] = useState('')

  useEffect(() => {
  
    db.collection("gastos_categorias").onSnapshot((querySnapshot) => {
        console.log("vacia arreglo")
        setLista(listaVacia)
        querySnapshot.forEach(doc => {
            var objeto = {id:doc.id,nombre:doc.data().nombre_categoria}
            setLista(prevLista => [...prevLista, objeto]);
            console.log("carga arreglo")
        });
    })
  },[])

  function eliminarGasto(id: string){
    eliminar(id,"gastos_categorias")
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
                    <IonButton color="success" onClick={() => {agregarCategoria(nombre);setNombre('')}}><IonIcon icon={add}></IonIcon>
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
                    <IonItemOptions side="end" onClick={() => {eliminarGasto(cate.id)}}>
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
