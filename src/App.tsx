import React,{useState, useEffect} from 'react';
import { Redirect, Route} from 'react-router-dom';
import {IonProgressBar,IonButton, IonApp, IonRouterOutlet, IonButtons, IonMenuButton, IonIcon, IonToolbar } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {auth,logout} from './firebaseConfig';
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


const RoutingSystem: React.FC = () => {
  return(
    <IonReactRouter>
      <Menu></Menu>
      <NavigationBar/>
      <IonRouterOutlet id="main">
        <Route path="/Login" component={Login} exact />
        <Route path="/Registro" component={Registro} exact />
        <Route path="/Home" component={Home} exact />
        <Route path="/Resumen" component={Resumen} exact />
        <Route path="/Mantenedor" component={Mantenedor} exact />
        <Route path="/Fijos" component={Fijos} exact />
        <Route path="/Categorias" component={Categorias} exact />
        <Route path="/" component={Login}></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  )
}

const interfaceUser = {
  email: ''
}

export const UserContext = React.createContext(interfaceUser)

const App: React.FC = () => {
  const [loggedin, setLoggedin] = useState(false)
  const [loading, setLoading] = useState(true)

  const [userEmail, setUserEmail] = useState(interfaceUser)
  
  useEffect(()=>{
    auth.onAuthStateChanged(function(user) {
      var correoUsuario = '';
      if(user){
        setLoggedin(true)
        if(user.email!=null){
          correoUsuario = user.email
        }
        window.history.replaceState({},'', '/Resumen')
      }else{
        setLoggedin(false)
        setUserEmail({email: ''})
        window.history.replaceState({},'', '/Login')
      }
      setUserEmail({email:correoUsuario})
    });
  },[])

    return (
      <UserContext.Provider value={userEmail}>
        <IonApp>
          <RoutingSystem />
        </IonApp>
      </UserContext.Provider>
    );
};

export default App;
