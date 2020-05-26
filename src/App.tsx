import React,{useState, useEffect,useContext} from 'react';
import { Redirect, Route} from 'react-router-dom';
import {IonProgressBar,IonButton, IonApp, IonRouterOutlet, IonButtons, IonMenuButton, IonIcon, IonToolbar } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {auth,agregar,db,actualizar} from './firebaseConfig';
import {useHistory} from 'react-router-dom'


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Paginas */
import Home from './pages/Home';
import Menu from './components/Menu';
import Resumen from './pages/Resumen';
import Mantenedor from './pages/Mantenedor';
import Fijos from './pages/Fijos';
import Categorias from './pages/Categorias'
import Login from './pages/Login'
import Registro from './pages/Registro'

/* Componentes */
import NavigationBar from './components/NavigationBar'


/* Theme variables 
import './theme/variables.css';*/

const RoutingSystemLogout: React.FC = () => {
  const user = useContext(UserContext);

  return(
    <IonReactRouter>
      <IonRouterOutlet id="main">
        <Route path="/Login" component={Login} exact />
        <Route path="/Registro" component={Registro} exact />
        <Route path="/" component={Login}></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  )
}

const RoutingSystemLogin: React.FC = () => {

  return(
    <IonReactRouter>
      <Menu></Menu>
      <NavigationBar/>
      <IonRouterOutlet id="main">
        <Route path="/Home" component={Home} exact />
        <Route path="/Resumen" component={Resumen} exact />
        <Route path="/Mantenedor" component={Mantenedor} exact />
        <Route path="/Fijos" component={Fijos} exact />
        <Route path="/Categorias" component={Categorias} exact />
        <Route path="/" component={Resumen}></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  )
}


export const UserContext = React.createContext<any>({})

const App: React.FC = () => {
  const [busy, setBusy] = useState(true)
  const [logedIn, setLogedIn] = useState(false)
  const [userData, setUserData] = useState<any>({})
  
  useEffect(()=>{
    auth.onAuthStateChanged((user) => {
      if(user){
        
          setUserData({email:user.email,uid:user.uid})
          setLogedIn(true)
      
      }else{
        setLogedIn(false)
      }
      setBusy(false)
    });
  },[])

  useEffect(() => {
    if(logedIn===true){
      db.collection("usersData").doc(userData.uid).collection("info_importante").onSnapshot((querySnapshot) => {
        querySnapshot.forEach(doc => {
            var info_importante = {mes:doc.data().mes_ultimo_pago,pagado:doc.data().sueldo_pagado,dia:doc.data().dia_pago,sueldo:doc.data().monto_sueldo,id:doc.id}
            if(typeof info_importante!= "undefined"){
              var fechaActual = new Date()
              var fechaPago = new Date()
            
              if(info_importante.mes != ""){
                if(fechaActual.getMonth() != info_importante.mes){
                  actualizar({
                    monto_sueldo: info_importante.sueldo,
                    dia_pago: info_importante.dia,
                    sueldo_pagado: false,
                    mes_ultimo_pago: ""
                  },"info_importante",info_importante.id,userData.uid);
                }
              }
 
              fechaPago.setDate(info_importante.dia)

              if(fechaActual.getDate() === fechaPago.getDate()){
                if(info_importante.pagado === false){
                  const id = agregar(
                    {
                      mov_fecha: fechaActual.toISOString(),
                      mov_cuotas: "1",
                      mov_tipo_moneda: "efectivo",
                      mov_frec_mov: "fijo",
                      mov_tipo_mov: "ingreso",
                      mov_descripcion: "sueldo",
                      mov_monto: info_importante.sueldo,
                      mov_categoria: "sueldo"
                    },"movimientos",userData.uid);
  
                  actualizar({
                      monto_sueldo: info_importante.sueldo,
                      dia_pago: info_importante.dia,
                      sueldo_pagado: true,
                      mes_ultimo_pago: fechaActual.getMonth()
                    },"info_importante",info_importante.id,userData.uid);
                }
              }
              
            }
        });
      })
    }
  },[logedIn])

    return (
      <UserContext.Provider value={userData}>
        <IonApp>
          {busy ? <IonProgressBar type="indeterminate"></IonProgressBar>: logedIn?<RoutingSystemLogin/>:<RoutingSystemLogout/>}
        </IonApp>
      </UserContext.Provider>
      )
};

export default App;
