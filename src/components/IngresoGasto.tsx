import {IonButtons,IonIcon,IonFab,IonFabButton,IonAlert,IonSelectOption,IonDatetime,IonToast,IonList, IonButton, IonItem, IonInput, IonTitle, IonLabel, IonSelect, IonText } from '@ionic/react';
import React , {useState,useEffect} from 'react';
import './IngresoGasto.css';
import {add} from 'ionicons/icons';
import {db,agregar} from '../firebaseConfig'

export const agregarCategoria = (nombre: string) =>{
  if(nombre!==''){
    const id = agregar({nombre_categoria:nombre},"gastos_categorias");
    console.log(id)
  }
}

const IngresoGasto: React.FC = () => {
  const listaVacia = [] as any[]
  const [listaCategoria, setListaCategoria] = useState(listaVacia)


  const [showAlert, setShowAlert] = useState(false)

  const [mensaje,setMensaje] = useState('');
  const [periodo, setPeriodo] = useState('')
  const [fecha, setFecha] = useState('')
  const [cuotas, setCuotas] = useState('')
  const [tipoMoneda, setTipoMoneda] = useState('')
  const [tipoGasto, setTipoGasto] = useState('')
  const [descripcion,setDescripcion] = useState('');
  const [monto,setMonto] = useState('');
  const [categoria, setCategoria] = useState('')


  

  const [showtoast,setShowtoast] = useState(false)

  useEffect(()=>{
    db.collection("gastos_categorias").onSnapshot((querySnapshot) => {
        console.log("vacia arreglo")
        setListaCategoria(listaVacia)
        querySnapshot.forEach(doc => {
            var objeto = {nombre:doc.data().nombre_categoria}
            setListaCategoria(prevListaCategoria => [...prevListaCategoria, objeto]);
            console.log("carga arreglo")
        });
    })
  },[])

  const agregarGasto = () => {
    try{
      const id = agregar(
        {
          gasto_periodo:periodo,
          gasto_fecha: fecha,
          gasto_cuotas: cuotas,
          gasto_tipo_moneda: tipoMoneda,
          gasto_tipo_gasto: tipoGasto,
          gasto_descripcion: descripcion,
          gasto_monto: monto,
          gasto_categoria: categoria
        },"gastos");
      console.log(id)
      setShowtoast(true)
      setMensaje("Gasto ingresado correctamente");
    }catch(error){
      setMensaje(error)
    }
  };

  const InputAlert = () => {
    return(
      <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Nueva categoria'}
          inputs={[
            {
              name: 'nombreCategoria',
              type: 'text',
              placeholder: 'Placeholder 1'
            },
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            },
            {
              text: 'Guardar',
              handler: data => {
                agregarCategoria(data.nombreCategoria);
              }
            }
          ]}
        />
    )
  }

  return (
    <>
          <IonList>
            <IonTitle className="ion-padding">Gasto nuevo</IonTitle>
            <IonItem>
              <IonLabel>Fecha compra</IonLabel>
              <IonDatetime displayFormat="YYYY-MM-DD" value={fecha} onIonChange={(e: any) => setFecha(e.detail.value!)}></IonDatetime>
            </IonItem>
            <IonItem>
              <IonLabel>Periodo</IonLabel>
              <IonInput
                value={periodo} 
                onIonChange={(e: any) => setPeriodo(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Cuotas</IonLabel>
              <IonInput
                value={cuotas} 
                onIonChange={(e: any) => setCuotas(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Moneda utilizada</IonLabel>
              <IonSelect value={tipoMoneda} onIonChange={e => setTipoMoneda(e.detail.value)} interface="popover">
                <IonSelectOption value="credito">Crédito</IonSelectOption>
                <IonSelectOption value="efectivo">Efectivo</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>Tipo de gasto</IonLabel>
              <IonSelect value={tipoGasto} onIonChange={e => setTipoGasto(e.detail.value)} interface="popover">
                <IonSelectOption value="variable">Variable</IonSelectOption>
                <IonSelectOption value="fijo">Fijo</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>Categoria gasto</IonLabel>
              <IonSelect value={categoria} onIonChange={e => setCategoria(e.detail.value)} interface="popover">
              {listaCategoria.map((cate,i) => (
                <IonSelectOption key={i} value={cate.nombre}>{cate.nombre}</IonSelectOption>
                
              ))}
              </IonSelect>
              <IonButtons>
                <IonButton onClick={() => setShowAlert(true)} color="secondary" >
                  <IonIcon icon={add}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonItem>
            <IonItem>
              <IonInput
                placeholder="Descripcion compra"
                value={descripcion} 
                onIonChange={(e: any) => setDescripcion(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                placeholder="Monto"
                value={monto} 
                onIonChange={(e: any) => setMonto(e.target.value)}>
              </IonInput>
            </IonItem>
            <section>
              <IonButton expand="block" onClick={agregarGasto}>Guardar</IonButton>
            </section>
          </IonList>
          <InputAlert/>
          <IonToast
            isOpen={showtoast}
            onDidDismiss={() => setShowtoast(false)}
            message={mensaje}
            duration={500}
          />
      </>
  );
};

export default IngresoGasto;