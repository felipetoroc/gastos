import {IonList, IonIcon,IonItem,IonItemOption,IonItemOptions,IonItemSliding, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLabel, IonButtons, IonButton } from '@ionic/react';
import React, {useState,useEffect,useContext} from 'react';
import './Categorias.css';
import {db,eliminar} from '../firebaseConfig'
import { add} from 'ionicons/icons';
import {agregarCategoria} from '../components/IngresoCategoria'
import {UserContext} from '../App'
import {usePeriodo} from '../hooks/usePeriodo'

const Categorias: React.FC = () => {
  
  const listaVacia = [] as any[]
  const [lista,setLista] = useState(listaVacia);
  const [listaMov, setListaMov] = useState([] as any[])
  const [nombre, setNombre] = useState('')
  const user = useContext(UserContext)

  const [diapago,fechaPago, fechaIni, fechaFin,setDiapago] = usePeriodo(1)


    useEffect(() => {
        db.collection("usersData").doc(user.uid).collection("categorias").orderBy("nombre_categoria").onSnapshot((querySnapshot) => {
            db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((q) => {
                setLista(listaVacia)
                querySnapshot.forEach(doc => {
                    var objeto = {id:doc.id,nombre:doc.data().nombre_categoria}
                    setLista(prevLista => [...prevLista, objeto]);
                })
                if(q.empty === false){
                    setDiapago(q.docs[0].data().dia_pago) 
                }
            })
        });
    },[])

    useEffect(() => {
        db.collection("usersData").doc(user.uid).collection("movimientos")
        /*.where("mov_tipo_mov",fTipoMov.comp,fTipoMov.tipo)
        .where("mov_frec_mov",fFrecMov.comp,fFrecMov.frec)
        .orderBy("mov_tipo_mov")*/
        .orderBy("mov_fecha","desc")
        .onSnapshot((q2) => {
            setListaMov([])
            q2.forEach(doc => {
                var fecha = new Date(doc.data().mov_fecha)
                if(fecha >= fechaIni && fecha < fechaFin){
                    var objeto = {
                        id:doc.id,
                        categoria:doc.data().mov_categoria,
                        cuotas:doc.data().mov_cuotas,
                        descripcion:doc.data().mov_descripcion,
                        fecha:fecha.toLocaleDateString(),
                        monto:parseFloat(doc.data().mov_monto),
                        frecuencia:doc.data().mov_frec_mov,
                        tipo_moneda:doc.data().mov_tipo_moneda,
                        tipo_movimiento:doc.data().mov_tipo_mov
                    }
                    setListaMov(prev => [...prev,objeto])
                }
            })
        })
    },[diapago])

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
                        <IonLabel slot="end">{Math.round(listaMov.reduce((a:any,b:any) => (cate.nombre===b.categoria?b.tipo_movimiento==="gasto"?a-b.monto:a+b.monto:a),0))}</IonLabel>  
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
