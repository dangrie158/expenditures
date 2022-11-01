import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonPage, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Home } from './pages/Home';
import { Login } from './components/Login';
import { TagDetail } from './pages/Tags';
import { SummaryOverview } from './pages/Summary';
import { Expenditures } from './pages/Expenditures';

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

/* Theme variables */
import './theme/variables.css';

export const API_HOST = process.env.NODE_ENV === "development" ? `http://${window.location.hostname}:5100` : ""

export class App extends React.Component {

  state = {
    credentials: App.loadCredentials()
  }

  static persistCredentials(username: string, password: string) {
    let expiry = new Date();
    expiry.setTime(expiry.getTime() + (2 * 356 * 24 * 60 * 60 * 1000));
    document.cookie = `username=${username}; expires=${expiry.toUTCString()}`;
    document.cookie = `password=${password}; expires=${expiry.toUTCString()}`;
  }

  static loadCredentials() {
    let username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1")
    let password = document.cookie.replace(/(?:(?:^|.*;\s*)password\s*=\s*([^;]*).*$)|^.*$/, "$1")

    //renew cookie
    this.persistCredentials(username, password);

    return {
      username: username,
      password: password
    }
  }

  componentDidMount() {
    let originalFetch = window.fetch;
    const patchedFetch = (input: RequestInfo, init: RequestInit = {}) => {
      init = {
        ...init,
        headers: {
          ...init.headers,
          'Authorization': `Basic ${window.btoa(`${this.state.credentials.username}:${this.state.credentials.password}`)}`
        }
      }

      return originalFetch(input, init)
        .then((res) => {
          // login was unsuccessfull. clear the credentials
          // to show the login form again
          if (!res.ok && res.status === 401) {
            this.setState({
              credentials: {}
            });
          }
          return res;
        })
    }
    window.fetch = patchedFetch as any;
  }

  saveSessionCredentials(username: string, password: string) {
    App.persistCredentials(username, password);
    this.setState({
      credentials: {
        username: username,
        password: password
      }
    })
  }

  render() {
    if (this.state.credentials.username && this.state.credentials.password) {
      return (
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/home" component={Home} exact={true} />
              <Route path="/tags/:id/" component={TagDetail} />
              <Route path="/summary/" component={SummaryOverview} />
              <Route path="/expenditures/" component={Expenditures} />
              <Route path="/" render={() => <Redirect to="/home" />} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      );
    } else {
      return (
        <IonApp>
          <IonPage>
            <Login onSave={(u, p) => this.saveSessionCredentials(u, p)} />
          </IonPage>
        </IonApp>
      );
    }
  }
}

export default App;
