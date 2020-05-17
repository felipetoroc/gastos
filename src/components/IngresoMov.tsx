import {IonPopover,IonButtons,IonIcon,IonSelectOption,IonDatetime,IonToast,IonList, IonButton, IonItem, IonInput, IonTitle, IonLabel, IonSelect } from '@ionic/react';
import React , {useState,useEffect,useContext,useReducer} from 'react';
import './IngresoMov.css';
import {add} from 'ionicons/icons';
import {db,agregar} from '../firebaseConfig'
import IngresoCategoria from './IngresoCategoria';
import IngresoTarjeta from './IngresoTarjeta';
import {UserContext} from '../App'

const reducerPeriodo = (state:string,action:any) => {
    
    var diaTope = parseInt(action.moneda.dia)<=9?"0"+action.moneda.dia:action.moneda.dia
  
    var splitFechaInput = action.fecha.split("T");
    var split2FechaInput = splitFechaInput[0].split("-")

    var mesInt = parseInt(split2FechaInput[1])

    var periodoFechaInput = split2FechaInput[0]+split2FechaInput[1]+split2FechaInput[2]
    
    var periodoIni = split2FechaInput[0]+split2FechaInput[1]+diaTope
    var periodoFin = split2FechaInput[0]+split2FechaInput[1]+diaTope
    
    if(parseInt(periodoIni)>=parseInt(periodoFechaInput)){
        mesInt = mesInt-1
        var mesString = mesInt<=9?"0"+mesInt.toString():mesInt.toString()
        periodoIni = split2FechaInput[0]+mesString+diaTope
    }else{
        mesInt = mesInt+1
        var mesString = mesInt<=9?"0"+mesInt.toString():mesInt.toString()
        periodoFin = split2FechaInput[0]+mesString+diaTope
    }
    return periodoIni+"-"+periodoFin;
}


const IngresoMov: React.FC = () => {

  const listaVacia = [] as any[]
  const [listaCategoria, setListaCategoria] = useState(listaVacia)
  const [listaTarjetas, setListaTarjetas] = useState(listaVacia)
  const [periodo, dispatchPeriodo] = useReducer(reducerPeriodo, '')
  const [infoImportante, setInfoImportante] = useState(listaVacia)

  const user = useContext(UserContext)
  
  const [mensaje,setMensaje] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString())
  const [cuotas, setCuotas] = useState(1)
  const [tipoMoneda, setTipoMoneda] = useState<any>({})
  const [frecMov, setFrecMov] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('')
  const [descripcion,setDescripcion] = useState('');
  const [monto,setMonto] = useState('');
  const [categoria, setCategoria] = useState('')

  const [showtoast,setShowtoast] = useState(false)
  const [popoverCate, setPopoverCate] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});
  const [popoverTar, setPopoverTar] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});

  useEffect(()=>{
    if(tipoMoneda.nombre==="efectivo"){
      setCuotas(1)
    }
    if(tipoMovimiento==="pagotc"){
      setCuotas(1)
    }
  },[tipoMoneda,tipoMovimiento])

  useEffect(() => {
    db.collection("usersData").doc(user.uid).collection("info_importante").onSnapshot((querySnapshot) => {
      setInfoImportante(listaVacia)
      querySnapshot.forEach(doc => {
          var objeto = {dia:doc.data().dia_pago,nombre:"efectivo"}
          setInfoImportante(prevInfo => [...prevInfo, objeto]);
      });
    })
    db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((querySnapshot) => {
      setListaTarjetas(listaVacia)
      querySnapshot.forEach(doc => {
          var objeto = {nombre:doc.data().tarjeta_nombre,cupo:doc.data().tarjeta_cupo,dia:doc.data().tarjeta_dia_f}
          setListaTarjetas(prevListaTarjeta => [...prevListaTarjeta, objeto]);
      });
    })
    db.collection("usersData").doc(user.uid).collection("categorias").onSnapshot((querySnapshot) => {
      setListaCategoria(listaVacia)
      querySnapshot.forEach(doc => {
          var objeto = {nombre:doc.data().nombre_categoria}
          setListaCategoria(prevListaCategoria => [...prevListaCategoria, objeto]);
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
                mov_tipo_moneda: tipoMoneda.nombre,
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
                mov_tipo_moneda: tipoMoneda.nombre,
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
                mov_tipo_moneda: tipoMoneda.nombre,
                mov_frec_mov: frecMov,
                mov_tipo_mov: tipoMovimiento,
                mov_descripcion: descripcion,
                mov_monto: monto,
                mov_categoria: categoria
              },"movimientos",user.uid);
            }
            
        }else{
          
          var montoCuota = parseInt(monto)/cuotas
          agregar(
            {
              mov_periodo:periodo,
              mov_fecha: fecha,
              mov_cuotas: cuotas,
              mov_tipo_moneda: tipoMoneda.nombre,
              mov_frec_mov: frecMov,
              mov_tipo_mov: tipoMovimiento,
              mov_descripcion: descripcion,
              mov_monto: montoCuota.toString(),
              mov_categoria: categoria
            },"movimientos",user.uid);

          var contador = 0;
          
          var periodoSeparado = periodo.split("-")
          var periodoIni = periodoSeparado[0]
          var periodoFin = periodoSeparado[1]
          var pIniMes = parseInt(periodoIni.substring(4,5))
          var pFinMes = parseInt(periodoFin.substring(4,5))

          for(var i=0;i<cuotas-1;i++){
            var cuotasRestantes = cuotas-i
            var sumPIniMes = pIniMes++
            var sumPFinMes = pFinMes++
            var nuevoPiniMes = sumPIniMes<=9?"0"+sumPIniMes.toString():sumPIniMes.toString()
            var nuevoPfinMes = sumPFinMes<=9?"0"+sumPFinMes.toString():sumPFinMes.toString()
            var nuevoPeriodo = periodoIni.substring(0,3)+nuevoPiniMes+periodoIni.substring(6,7)+periodoIni.substring(0,3)+nuevoPfinMes+periodoIni.substring(6,7)
            const id = agregar(
              {
                mov_periodo:nuevoPeriodo,
                mov_fecha: fecha,
                mov_cuotas: cuotasRestantes.toString(),
                mov_tipo_moneda: tipoMoneda.nombre,
                mov_frec_mov: frecMov,
                mov_tipo_mov: tipoMovimiento,
                mov_descripcion: descripcion,
                mov_monto: montoCuota.toString(),
                mov_categoria: categoria
              },"movimientos",user.uid);
              console.log(id)
          }
        }
       
        setShowtoast(true)
        setFecha(new Date().toISOString())
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
              <IonDatetime displayFormat="YYYY-MM-DD" value={fecha} onIonChange={(e: any) => {setFecha(e.detail.value!);dispatchPeriodo({fecha:e.detail.value,moneda:tipoMoneda,info:infoImportante})}}></IonDatetime>
            </IonItem>
            <IonItem>
              <IonLabel>Moneda</IonLabel>
              <IonSelect value={tipoMoneda}  onIonChange={(e:any) => {setTipoMoneda(e.detail.value);dispatchPeriodo({fecha:fecha,moneda:e.detail.value,info:infoImportante})}} interface="popover">
                <IonSelectOption value={infoImportante[0]}>Efectivo</IonSelectOption>
                {listaTarjetas.map((tarjeta,i) => (
                  <IonSelectOption key={i} value={tarjeta}>{tarjeta.nombre}</IonSelectOption>
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
            {tipoMoneda.nombre!="efectivo" && tipoMoneda.nombre! && tipoMovimiento != "pagotc"?
              <IonItem>
                <IonLabel>Cuotas</IonLabel>
                <IonInput
                  value={cuotas} 
                  onIonChange={(e: any) => setCuotas(parseInt(e.target.value))}>
                </IonInput>
              </IonItem>:<></>
            }
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
                className="inputTextos"
                placeholder="Descripcion movimiento"
                value={descripcion} 
                onIonChange={(e: any) => setDescripcion(e.target.value)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                className="inputTextos"
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