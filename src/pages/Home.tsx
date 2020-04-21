import {IonButton,IonLabel,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,IonRow,IonCol,IonLoading, IonGrid } from '@ionic/react';
import React, {useState,useEffect} from 'react';
import './Home.css';
import {db} from '../firebaseConfig'

const Home: React.FC = () => {
  const listaVacia = [] as any[]
  const [listaGasto, setListaGasto] = useState(listaVacia);

  useEffect(() => {
    db.collection("gastos").onSnapshot((querySnapshot) => {
        console.log("vacia arreglo")
        setListaGasto(listaVacia)
        querySnapshot.forEach(doc => {
            var objeto = {id:doc.id,descripcion:doc.data().descripcion,monto:doc.data().monto}
            setListaGasto(prevListaGasto => [...prevListaGasto, objeto]);
            console.log("carga arreglo")
        });
    })
  },[])

  function eliminarGasto(id: string){
    setListaGasto(listaVacia)
    db.collection("gastos").doc(id).delete();
  }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Lista gastos</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonRow>
                <IonCol>Descripcion</IonCol>
                <IonCol>Monto</IonCol>
            </IonRow>
            {listaGasto.map((gasto,i) => (
            <IonRow key={i}>
                <IonItemSliding>
                    <IonItem>  
                        <IonCol>{gasto.descripcion}</IonCol>
                        <IonCol>{gasto.monto}</IonCol>
                    </IonItem>
                    <IonItemOptions side="end" onClick={() => {eliminarGasto(gasto.id)}}>
                        <IonItemOption color="danger" expandable>
                            Eliminar
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            </IonRow>
            ))}
        </IonContent>
    </IonPage>
  )
};

export default Home;
