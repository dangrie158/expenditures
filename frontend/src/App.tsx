import React from "react";
import { Redirect, Route } from "react-router-dom";
import { AnimationBuilder, IonApp, IonPage, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./components/Login";
import { useCredentials } from "./backend-hooks";
import TagDetail from "./pages/Tags";
import SummaryOverview from "./pages/Summary";
import Expenditures from "./pages/Expenditures";
import { createAnimation, iosTransitionAnimation, setupConfig } from "@ionic/core";
import { register } from "./serviceWorkerRegistration";

const animationBuilder: AnimationBuilder = (baseEl, opts) => {
    if (opts.direction === "back") {
        return createAnimation();
    }
    return iosTransitionAnimation(baseEl, opts);
};

setupConfig({
    swipeBackEnabled: false,
    navAnimation: animationBuilder,
});
setupIonicReact();
register();

export default function App() {
    const [credentials, setCredentials] = useCredentials();

    if (credentials.username && credentials.password) {
        return (
            <IonApp>
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route path="/home" component={Home} exact />
                        <Route path="/tags/:id/" component={TagDetail} />
                        <Route path="/summary/" component={SummaryOverview} />
                        <Route path="/expenditures/" component={Expenditures} />
                        <Redirect from="/" to="/home" exact />
                    </IonRouterOutlet>
                </IonReactRouter>
            </IonApp>
        );
    } else {
        return (
            <IonApp>
                <IonPage>
                    <Login onSave={(username, password) => setCredentials({ username, password })} />
                </IonPage>
            </IonApp>
        );
    }
}
