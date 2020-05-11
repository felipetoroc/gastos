import {IonPopover,IonButtons,IonIcon,IonSelectOption,IonDatetime,IonToast,IonList, IonButton, IonItem, IonInput, IonTitle, IonLabel, IonSelect } from '@ionic/react';
import React , {useState,useEffect,useContext} from 'react';
import './IngresoMov.css';
import {add} from 'ionicons/icons';
import {db,agregar} from '../firebaseConfig'
import IngresoCategoria from './IngresoCategoria';
import IngresoTarjeta from './IngresoTarjeta';
import {UserContext} from '../App'

const IngresoMov: React.FC = () => {
  const listaVacia = [] as any[]
  const [listaCategoria, setListaCategoria] = useState(listaVacia)
  const [listaTarjetas, setListaTarjetas] = useState(listaVacia)

  const user = useContext(UserContext)

  const [mensaje,setMensaje] = useState('');
  const [periodo, setPeriodo] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString())
  const [cuotas, setCuotas] = useState(1)
  const [tipoMoneda, setTipoMoneda] = useState('')
  const [frecMov, setFrecMov] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('')
  const [descripcion,setDescripcion] = useState('');
  const [monto,setMonto] = useState('');
  const [categoria, setCategoria] = useState('')
  const [diaTope, setDiaTope] = useState('')

  const [showtoast,setShowtoast] = useState(false)
  const [popoverCate, setPopoverCate] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});
  const [popoverTar, setPopoverTar] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});

 function getDiaTope(tipo: string){
    
 }

 function setearPeriodo(){
  var splitFechaInput = fecha.split("T");
  var split2FechaInput = splitFechaInput[0].split("-")
  var periodoFechaInput = split2FechaInput[0]+split2FechaInput[1]+split2FechaInput[2]
  var periodoDiaPago = split2FechaInput[0]+split2FechaInput[1]+diaTope
  
  if(parseInt(periodoFechaInput)<=parseInt(periodoDiaPago)){
    return split2FechaInput[0]+split2FechaInput[1]
  }else{
    var nextPeriodo = parseInt(split2FechaInput[1])+1
    var nextPeriodoTexto = nextPeriodo<=9?"0"+nextPeriodo.toString():nextPeriodo.toString()
    return split2FechaInput[0]+nextPeriodoTexto
  }
 }
  useEffect(()=>{
    if(tipoMoneda==="efectivo"){
      db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((querySnapshot) => {
          querySnapshot.forEach(doc => {
            setDiaTope(doc.data().dia_pago)
            console.log(setearPeriodo())
          });
      })
    }else{
      db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((querySnapshot) => {
          querySnapshot.forEach(doc => {
            if(doc.data().tarjeta_nombre===tipoMoneda){
              setDiaTope(doc.data().tarjeta_dia_f)
              console.log(setearPeriodo())
            }
          });
      })
    }
  },[tipoMoneda,fecha])

  useEffect(()=>{
    if(tipoMoneda==="efectivo"){
      setCuotas(1)
    }
    if(tipoMovimiento==="pagotc"){
      setCuotas(1)
    }
  },[tipoMoneda,tipoMovimiento])

  useEffect(()=>{
    db.collection("usersData").doc(user.uid).collection("categorias").onSnapshot((querySnapshot) => {
        setListaCategoria(listaVacia)
        querySnapshot.forEach(doc => {
            var objeto = {nombre:doc.data().nombre_categoria}
            setListaCategoria(prevListaCategoria => [...prevListaCategoria, objeto]);
        });
    })
  },[])

  useEffect(()=>{
    db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((querySnapshot) => {
        setListaTarjetas(listaVacia)
        querySnapshot.forEach(doc => {
            var objeto = {nombre:doc.data().tarjeta_nombre,cupo:doc.data().tarjeta_cupo,dia:doc.data().tarjeta_dia_f}
            setListaTarjetas(prevListaTarjeta => [...prevListaTarjeta, objeto]);
        });
    })
  },[])

  const agregarGasto = () => {
    try{
      if(cuotas<=1){
        if(tipoMovimiento=="pagotc"){
          agregar(
            {
              mov_periodo:periodo,
              mov_fecha: fecha,
              mov_cuotas: "1",
              mov_tipo_moneda: tipoMoneda,
              mov_frec_mov: frecMov,
              mov_tipo_mov: "ingreso",
              mov_descripcion: descripcion,
              mov_monto: monto,
              mov_categoria: categoria
            },"movimientos",user.uid);
          agregar(
            {
              mov_periodo:periodo,
              mov_fecha: fecha,
              mov_cuotas: "1",
              mov_tipo_moneda: "efectivo",
              mov_frec_mov: frecMov,
              mov_tipo_mov: "gasto",
              mov_descripcion: descripcion,
              mov_monto: monto,
              mov_categoria: categoria
            },"movimientos",user.uid);
            
        }else{
          const id = agregar(
            {
              mov_periodo:periodo,
              mov_fecha: fecha,
              mov_cuotas: "1",
              mov_tipo_moneda: tipoMoneda,
              mov_frec_mov: frecMov,
              mov_tipo_mov: tipoMovimiento,
              mov_descripcion: descripcion,
              mov_monto: monto,
              mov_categoria: categoria
            },"movimientos",user.uid);
          }
          
      }else{
        var contador = 0;
        var montoCuota = parseInt(monto)/cuotas
        for(var i=parseInt(periodo);i<parseInt(periodo)+cuotas;i++){
          var cuotasRestantes = cuotas-contador
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
            },"movimientos",user.uid);
          contador++;
          console.log(i)
        }
      }
     
      setShowtoast(true)
      setFecha(new Date().toISOString())
      setPeriodo('')
      setCuotas(1)
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

  return (
    <>
          <IonList className="ingresoMov" >
            <IonTitle className="ion-padding">Movimiento nuevo</IonTitle>
            <IonItem>
              <IonLabel>Tipo de movimiento</IonLabel>
              <IonSelect value={tipoMovimiento} onIonChange={e => setTipoMovimiento(e.detail.value)} interface="popover">
                <IonSelectOption value="ingreso">Ingreso</IonSelectOption>
                <IonSelectOption value="gasto">Gasto</IonSelectOption>
                <IonSelectOption value="pagotc">Pago tarjeta</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>Fecha compra</IonLabel>
              <IonDatetime displayFormat="YYYY-MM-DD" value={fecha} onIonChange={(e: any) => setFecha(e.detail.value!)}></IonDatetime>
            </IonItem>
            <IonItem>
              <IonLabel>Moneda</IonLabel>
              <IonSelect value={tipoMoneda} onIonChange={e => setTipoMoneda(e.detail.value)} interface="popover">
                <IonSelectOption value="efectivo">Efectivo</IonSelectOption>
                {listaTarjetas.map((tarjeta,i) => (
                  <IonSelectOption key={i} value={tarjeta.nombre}>{tarjeta.nombre}</IonSelectOption>
                ))}
              </IonSelect>
              <IonButtons>
                <IonButton onClick={(e: any) => {e.persist();setPopoverTar({show:true,evento:e})}} color="secondary" >
                  <IonIcon icon={add}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonPopover
                isOpen={popoverTar.show}
                event={popoverTar.evento}
                onDidDismiss={e => setPopoverTar({show:false, evento:e})}
                >
                <IngresoTarjeta/>
              </IonPopover>
            </IonItem>
            {tipoMoneda!="efectivo" && tipoMoneda != '' && tipoMovimiento != "pagotc"?
              <IonItem>
                <IonLabel>Cuotas</IonLabel>
                <IonInput
                  value={cuotas} 
                  onIonChange={(e: any) => setCuotas(parseInt(e.target.value))}>
                </IonInput>
              </IonItem>:<></>
            }
            <IonItem>
              <IonLabel>Periodo</IonLabel>
              <IonInput
                value={periodo} 
                onIonChange={(e: any) => setPeriodo(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Frecuencia</IonLabel>
              <IonSelect value={frecMov} onIonChange={e => setFrecMov(e.detail.value)} interface="popover">
                <IonSelectOption value="variable">Variable</IonSelectOption>
                <IonSelectOption value="fijo">Fijo</IonSelectOption>
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
                <IonButton onClick={(e: any) => {e.persist();setPopoverCate({show:true,evento:e})}} color="secondary" >
                  <IonIcon icon={add}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonPopover
                isOpen={popoverCate.show}
                event={popoverCate.evento}
                onDidDismiss={e => setPopoverCate({show:false, evento:e})}
                >
                <IngresoCategoria/>
              </IonPopover>
            </IonItem>
            <IonItem>
              <IonInput
                placeholder="Descripcion movimiento"
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