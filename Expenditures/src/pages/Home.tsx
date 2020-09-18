import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonImg, IonThumbnail } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import React from 'react';
import { App, API_HOST } from '../App'
import { Expenditure } from '../models'
import { RouteComponentProps } from "react-router-dom";

import { ExpenditureList } from '../components/ExpenditureList';

export class Home extends React.Component<RouteComponentProps> {
  state = {
    userName: App.loadCredentials().username,
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
            routerLink="/summary/"
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
            userNames={this.state.availableUserNames}
            allowEdit={true}
            allowAdd={true} />
        </IonContent>


      </IonPage >
    );
  }
}

export default Home;
