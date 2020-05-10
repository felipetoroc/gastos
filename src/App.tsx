import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonButtons, IonMenuButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Menu from './components/Menu';
import Resumen from './pages/Resumen';
import Mantenedor from './pages/Mantenedor';
import Fijos from './pages/Fijos';
import Categorias from './pages/Categorias'
import Login from './pages/Login'
import Registro from './pages/Registro'


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

/* Theme variables 
import './theme/variables.css';*/

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Menu></Menu>
      <IonButtons slot="start">
        <IonMenuButton color="primary"/>
      </IonButtons>

      <IonRouterOutlet id="main">
        <Route path="/login" component={Login} exact />
        <Route path="/registro" component={Registro} exact />
        <Route path="/home" component={Home} exact />
        <Route path="/Resumen" component={Resumen} exact />
        <Route path="/Mantenedor" component={Mantenedor} exact />
        <Route path="/Fijos" component={Fijos} exact />
        <Route path="/Categorias" component={Categorias} exact />
        <Route exact path="/" render={() => <Redirect to="/Resumen" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
