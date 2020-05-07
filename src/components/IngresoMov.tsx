import {IonButtons,IonIcon,IonFab,IonFabButton,IonAlert,IonSelectOption,IonDatetime,IonToast,IonList, IonButton, IonItem, IonInput, IonTitle, IonLabel, IonSelect, IonText } from '@ionic/react';
import React , {useState,useEffect} from 'react';
import './IngresoMov.css';
import {add} from 'ionicons/icons';
import {db,agregar} from '../firebaseConfig'

export const agregarCategoria = (nombre: string) =>{
  if(nombre!==''){
    const id = agregar({nombre_categoria:nombre},"gastos_categorias");
    console.log(id)
  }
}

const IngresoMov: React.FC = () => {
  const listaVacia = [] as any[]
  const [listaCategoria, setListaCategoria] = useState(listaVacia)


  const [showAlert, setShowAlert] = useState(false)

  const [mensaje,setMensaje] = useState('');
  const [periodo, setPeriodo] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString())
  const [cuotas, setCuotas] = useState('')
  const [tipoMoneda, setTipoMoneda] = useState('')
  const [frecMov, setFrecMov] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('')
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
      if(parseInt(cuotas)<=1){
        const id = agregar(
          {
            mov_periodo:periodo,
            mov_fecha: fecha,
            mov_cuotas: cuotas,
            mov_tipo_moneda: tipoMoneda,
            mov_frec_mov: frecMov,
            mov_tipo_mov: tipoMovimiento,
            mov_descripcion: descripcion,
            mov_monto: monto,
            mov_categoria: categoria
          },"movimientos");
      }else{
        var contador = 0;
        var montoCuota = parseInt(monto)/parseInt(cuotas)
        for(var i=parseInt(periodo);i<parseInt(periodo)+parseInt(cuotas);i++){
          var cuotasRestantes = parseInt(cuotas)-contador

          const id = agregar(
            {
              mov_periodo:i.toString(),
              mov_fecha: fecha,
              mov_cuotas: cuotasRestantes.toString(),
              mov_tipo_moneda: tipoMoneda,
              mov_frec_mov: frecMov,
              mov_tipo_mov: tipoMovimiento,
              mov_descripcion: descripcion,
              mov_monto: montoCuota.toString(),
              mov_categoria: categoria
            },"movimientos");
          contador++;
        }
      }
     
      setShowtoast(true)
      setFecha('')
      setPeriodo('')
      setCuotas('')
      setTipoMoneda('')
      setFrecMov('')
      setTipoMovimiento('')
      setCategoria('')
      setDescripcion('')
      setMonto('')
      setMensaje("Movimiento ingresado correctamente");
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
          <IonList >
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
              <IonLabel>Frecuencia del movimiento</IonLabel>
              <IonSelect value={frecMov} onIonChange={e => setFrecMov(e.detail.value)} interface="popover">
                <IonSelectOption value="variable">Variable</IonSelectOption>
                <IonSelectOption value="fijo">Fijo</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>Tipo de movimiento</IonLabel>
              <IonSelect value={tipoMovimiento} onIonChange={e => setTipoMovimiento(e.detail.value)} interface="popover">
                <IonSelectOption value="ingreso">Ingreso</IonSelectOption>
                <IonSelectOption value="gasto">Gasto</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>Categoria</IonLabel>
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

export default IngresoMov;