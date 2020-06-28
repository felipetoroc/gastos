import {IonGrid,IonRow,IonCol,IonContent,IonPopover,IonButtons,IonIcon,IonSelectOption,IonDatetime,IonToast, IonButton,  IonInput, IonTitle, IonSelect } from '@ionic/react';
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
  
  const [fecha, setFecha] = useState(new Date().toISOString())
  const [cuotas, setCuotas] = useState('')
  const [tipoMoneda, setTipoMoneda] = useState('')
  const [frecMov, setFrecMov] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('')
  const [descripcion,setDescripcion] = useState('');
  const [monto,setMonto] = useState('');
  const [categoria, setCategoria] = useState('')

  const [mensaje,setMensaje] = useState('');
  const [showtoast,setShowtoast] = useState(false)
  const [popoverCate, setPopoverCate] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});
  const [popoverTar, setPopoverTar] = useState<{show: boolean, evento: Event | undefined}>({show: false, evento: undefined});

  

  useEffect(() => {
    db.collection("usersData").doc(user.uid).collection("tarjetas").onSnapshot((qTarjetas) => {
      db.collection("usersData").doc(user.uid).collection("categorias").orderBy("nombre_categoria").onSnapshot((qCategorias) => {
        setListaTarjetas(listaVacia)
        setListaCategoria(listaVacia)
        qTarjetas.forEach(doc => {
            var objeto = {nombre:doc.data().tarjeta_nombre,cupo:doc.data().tarjeta_cupo,dia:doc.data().tarjeta_dia_f}
            setListaTarjetas(prevListaTarjeta => [...prevListaTarjeta, objeto]);
        });
        qCategorias.forEach(doc => {
          var objeto = {nombre:doc.data().nombre_categoria}
          setListaCategoria(prevListaCategoria => [...prevListaCategoria, objeto]);
        });
      })
    })
  },[])

  useEffect(()=>{
    if(tipoMoneda === "efectivo"){
      setCuotas('1')
    }else{
      setCuotas('')
    }
    if(tipoMovimiento === "pagotc"){
      setCuotas('1')
    }
  },[tipoMoneda,tipoMovimiento])
  
  const agregarGasto = () => {

    for(var i=0;i<parseInt(cuotas);i++){
      var montoCuota = parseInt(monto)/parseInt(cuotas)
      var nuevaFecha = new Date(fecha)
      nuevaFecha = new Date(nuevaFecha.setMonth(nuevaFecha.getMonth()+i))
      var nuevaCuota = parseInt(cuotas)-i
      const id = agregar(
      {
        mov_fecha: nuevaFecha.toISOString(),
        mov_cuotas: nuevaCuota.toString(),
        mov_tipo_moneda: tipoMoneda,
        mov_frec_mov: frecMov,
        mov_tipo_mov: tipoMovimiento,
        mov_descripcion: descripcion,
        mov_monto: montoCuota.toString(),
        mov_categoria: categoria
      },"movimientos",user.uid);
    }
    
    setShowtoast(true)
    setFecha(new Date().toISOString())
    setCuotas('')
    setTipoMoneda('')
    setFrecMov('')
    setTipoMovimiento('')
    setCategoria('')
    setDescripcion('')
    setMonto('')
    setMensaje("Movimiento ingresado");
  };

  return (
    <IonContent className="ingresoMov">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonTitle><IonDatetime placeholder="Fecha" displayFormat="YYYY-MM-DD" value={fecha} onIonChange={(e: any) => {setFecha(e.detail.value!)}}></IonDatetime>
            </IonTitle>
                     
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonSelect placeholder="Tipo de movimiento" value={tipoMovimiento} onIonChange={e => setTipoMovimiento(e.detail.value)} interface="popover" >
                <IonSelectOption value="ingreso">Ingreso</IonSelectOption>
                <IonSelectOption value="gasto">Gasto</IonSelectOption>
                <IonSelectOption value="pagotc">Pago tarjeta</IonSelectOption>
            </IonSelect>
          </IonCol>
          <IonCol size="2"></IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonSelect placeholder={tipoMovimiento=="pagotc"?"Tarjeta a pagar":tipoMovimiento=="ingreso"?"¿A qué medio?":"Medio de pago"} value={tipoMoneda}  onIonChange={(e:any) => {setTipoMoneda(e.detail.value)}} interface="popover">
              {tipoMovimiento!="pagotc"?<IonSelectOption value="efectivo">Efectivo</IonSelectOption>:<></>}
              {listaTarjetas.map((tarjeta,i) => (
                <IonSelectOption key={i} value={tarjeta.nombre}>{tarjeta.nombre}</IonSelectOption>
              ))}
            </IonSelect>
          </IonCol>
          <IonCol size="2">
            <IonButtons>
              <IonButton onClick={(e: any) => {e.persist();setPopoverTar({show:true,evento:e})}} color="secondary" >
                <IonIcon icon={add}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonSelect placeholder="Frecuencia" value={frecMov} onIonChange={e => setFrecMov(e.detail.value)} interface="popover">
              <IonSelectOption value="variable">Variable</IonSelectOption>
              <IonSelectOption value="fijo">Fijo</IonSelectOption>
            </IonSelect>
          </IonCol>
          <IonCol size="2"></IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonSelect placeholder="Categoría" value={categoria} onIonChange={e => setCategoria(e.detail.value)} interface="action-sheet">
              {listaCategoria.map((cate,i) => (
                <IonSelectOption key={i} value={cate.nombre}>{cate.nombre}</IonSelectOption>
              ))}
            </IonSelect>
          </IonCol>
          <IonCol size="2">
            <IonButtons>
              <IonButton onClick={(e: any) => {e.persist();setPopoverCate({show:true,evento:e})}} color="secondary" >
                <IonIcon icon={add}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
          <IonInput
                  className="inputTextos"
                  placeholder="Descripcion movimiento"
                  value={descripcion} 
                  onIonChange={(e:any) => {setDescripcion(e.target.value)}}>
                </IonInput>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
          <IonInput
                  className="inputTextos"
                  placeholder="Monto"
                  value={monto} 
                  onIonChange={(e: any) => setMonto(e.target.value)}>
                </IonInput>
          </IonCol>
        </IonRow>
        {tipoMoneda!="efectivo" && tipoMoneda! && tipoMovimiento != "pagotc"?
          <IonRow>
            <IonCol>
              <IonInput
                placeholder="Cuotas"
                value={cuotas} 
                onIonChange={(e: any) => setCuotas(e.target.value)}>
              </IonInput>
            </IonCol>
            <IonCol size="2"></IonCol>
          </IonRow>:<></>
        }
        <IonRow>
          <IonCol>
            <IonButton expand="block" onClick={agregarGasto}>Guardar</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonToast
        isOpen={showtoast}
        onDidDismiss={() => setShowtoast(false)}
        message={mensaje}
        duration={500}
      />
      <IonPopover
        isOpen={popoverTar.show}
        event={popoverTar.evento}
        onDidDismiss={e => setPopoverTar({show:false, evento:e})}
        >
          <IngresoTarjeta/>
      </IonPopover>
      <IonPopover
        isOpen={popoverCate.show}
        event={popoverCate.evento}
        onDidDismiss={e => setPopoverCate({show:false, evento:e})}
        >
          <IngresoCategoria/>
      </IonPopover>
    </IonContent>
  );
};

export default IngresoMov;