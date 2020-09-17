import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonButtons, IonModal, IonButton, IonInput, IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonImg, IonThumbnail } from '@ionic/react';
import { RefresherEventDetail, InputChangeEventDetail } from '@ionic/core';
import React from 'react';
import { FormEvent } from 'react';
import { API_HOST } from '../App'
import { Expenditure } from '../models'
import { RouteComponentProps } from "react-router-dom";

import { ExpenditureList } from './ExpenditureList';

class Home extends React.Component<RouteComponentProps> {
  state = {
    userName: this.getUsername(),
    userNameIsSet: this.getUsername() !== "",
    availableUserNames: Array<string>(),
    balance: 0
  };

  componentDidMount() {
    this.doRefresh();
  }

  editExpenditure(item: Expenditure) {
    this.setState({
      newItem: item, showModal: true
    })
    this.doRefresh();
  }

  saveUsername(username: string) {
    let expiry = new Date();
    expiry.setTime(expiry.getTime() + (2 * 356 * 24 * 60 * 60 * 1000));
    document.cookie = `username=${username}; expires=${expiry.toUTCString()}`;
  }

  getUsername() {
    let userName = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1")

    //renew cookie
    this.saveUsername(userName);

    return userName
  }

  doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    fetch(`${API_HOST}/api/current-status`)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          availableUserNames: data.map((item: Array<string>) => item[0])
        })
        return data
      })
      .then((data) => {
        let myBalance = data.find((item: any) => item[0] === this.state.userName)
        let otherBalance = data.find((item: any) => item[0] !== this.state.userName)
        let balance = myBalance[1] - otherBalance[1]
        this.setState({
          balance: balance / 100
        })
        return data
      })
      .catch(console.error)
  }

  handleChangeUsername(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      userName: event.detail.value
    });
  }

  handleSubmitUsername(event: FormEvent) {
    event.preventDefault();

    this.saveUsername(this.state.userName)
    this.setState({ userNameIsSet: true })
  }

  showEmptyModal() {
    let emptyExpenditure = new Expenditure()
    emptyExpenditure.username = this.state.userName;
    this.setState({ showModal: true, newItem: emptyExpenditure });
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonThumbnail slot="start" style={{ "marginLeft": "1rem" }}>
              <IonImg src="/assets/icon/android-chrome-192x192.png" />
            </IonThumbnail>
            <IonTitle>Letzte Ausgaben</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding" style={{ "--padding-start": 0, "--padding-end": 0 }}>
          <IonCard
            routerLink="/tags/"
            style={{ "bottom": "0", "position": "fixed", "width": "calc(100% - 4em)", "margin": "2em" }}
            routerDirection="forward"
            slot="fixed"
            color={this.state.balance < 0 ? "warning" : "success"} >
            <IonCardHeader>
              <IonCardSubtitle>Aktueller Stand</IonCardSubtitle>
              <IonCardTitle>{this.state.balance.toLocaleString(undefined, { style: "currency", currency: "EUR" })}</IonCardTitle>
            </IonCardHeader>
          </IonCard>

          <ExpenditureList
            onEdit={(e) => this.editExpenditure(e)}
            onDelete={(e) => this.doRefresh()}
            onTagClick={(tag) => this.props.history.push(`/tags/${tag.id}`)}
            userNames={this.state.availableUserNames} />
        </IonContent>

        <IonModal isOpen={!this.state.userNameIsSet}>
          <form onSubmit={(e) => this.handleSubmitUsername(e)}>
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
            </IonContent>
          </form>
        </IonModal>
      </IonPage >
    );
  }
}

export default Home;
