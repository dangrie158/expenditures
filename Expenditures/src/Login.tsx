import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import React, { FormEvent } from 'react';
import { InputChangeEventDetail } from '@ionic/core'

type LoginProps = {
  onSave: (username: string, password: string) => void
};

export class Login extends React.Component<LoginProps> {

  state = {
    username: "",
    password: ""
  }

  handleChangeUsername(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      username: event.detail.value
    });
  }

  handleChangePassword(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      password: event.detail.value
    });
  }

  handleSubmit(event: FormEvent) {
    event.preventDefault();

    this.props.onSave(this.state.username, this.state.password)
  }

  render() {
    return (
      <IonModal isOpen={true}>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>Nutzer eintragen</IonTitle>
              <IonButtons slot="end">
                <IonButton color="primary" type="submit">Speichern</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonItem>
              <IonLabel>Nutzer</IonLabel>
              <IonInput required={true} onIonChange={(e) => this.handleChangeUsername(e)}></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel>Passwort</IonLabel>
              <IonInput required={true} onIonChange={(e) => this.handleChangePassword(e)} type="password"></IonInput>
            </IonItem>
          </IonContent>
        </form>
      </IonModal>
    );
  }
}

export default Login;
