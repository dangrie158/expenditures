import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonFab, IonFabButton, IonButtons, IonIcon, IonModal, IonButton, IonInput, IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading, IonImg, IonThumbnail, IonSegment, IonSegmentButton } from '@ionic/react';
import { RefresherEventDetail, InputChangeEventDetail } from '@ionic/core';
import React from 'react';
import { FormEvent } from 'react';
import { add } from 'ionicons/icons';
import { API_HOST } from '../App'
import { Tag, Expenditure } from '../models'
import { RouteComponentProps } from "react-router-dom";

import { ExpenditureList } from './ExpenditureList';

class Home extends React.Component<RouteComponentProps> {
  state = {
    showModal: false,
    newItem: new Expenditure(),
    userName: this.getUsername(),
    userNameIsSet: this.getUsername() !== "",
    availableUserNames: Array<string>(),
    tags: Array<Tag>(),
    balance: 0,
    isSaving: false,
    expenditureLimit: 20,
    isLoading: false
  };

  listRefresher?: () => Promise<void>;

  componentDidMount() {
    this.setState({
      newItem: {
        ...this.state.newItem,
        username: this.state.userName
      }
    });
  }

  onMountList(refresher: () => Promise<void>) {
    console.log("call of onMount")
    this.listRefresher = refresher;
    this.doRefresh();
  }

  editExpenditure(item: Expenditure) {
    this.setState({
      newItem: item, showModal: true
    })
  }

  deleteExpenditure(item: Expenditure) {
    fetch(`${API_HOST}/api/expenditures/${item.id}`, { method: 'DELETE' })
      .then((_: Object) => {
        this.doRefresh();
      })
      .catch(console.error)
  }

  addOrUpdateExpenditure(item: Expenditure) {
    let newItem = {
      amount: (item.amount * 100).toFixed(0),
      reason: item.reason,
      username: item.username,
      tags: item.tags
    }

    this.setState({ isSaving: true });

    let url = `${API_HOST}/api/expenditures`
    let method = 'POST'
    if (item.id !== -1) {
      url = `${API_HOST}/api/expenditures/${item.id}`
      method = 'PUT'
    }

    return fetch(url, {
      method: method,
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(newItem)
    })
      .then(() => {
        this.doRefresh();
      })
      .catch((e) => {
        console.error(e);
        alert("Speichern fehlgeschlagen");
      })
      .finally(() => {
        this.setState({ showModal: false, isSaving: false });
      });
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
    this.setState({
      isLoading: true
    });

    this.listRefresher!()
      .then(res => {
        this.setState({
          isLoading: false
        });
      })
      .catch(console.error)


    fetch(`${API_HOST}/api/tags`)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          tags: data
        })
      })
      .catch(console.error)

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

  handleChangeAmount(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      newItem: {
        ...this.state.newItem,
        amount: (event.detail.value || '0').replace(',', '.'),
      }
    });
  }

  handleChangeReason(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      newItem: {
        ...this.state.newItem,
        reason: event.detail.value,
      }
    });
  }

  handleChangeUser(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      newItem: {
        ...this.state.newItem,
        username: event.detail.value
      }
    });
  }


  handleToggleTag(tag: Tag) {
    let oldTags = this.state.newItem.tags.map(t => t.name);
    let index = oldTags.indexOf(tag.name);
    let newTags = this.state.newItem.tags;
    if (index >= 0) {
      newTags.splice(index, 1)
    } else {
      newTags.push(tag)
    }
    this.setState({
      newItem: {
        ...this.state.newItem,
        tags: newTags
      }
    });
  }

  handleChangeUsername(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      userName: event.detail.value
    });
  }

  newItemHasTag(tag: { name: string }) {
    return this.state.newItem.tags.map(t => t.name).indexOf(tag.name) >= 0
  }

  handleSubmit(event: FormEvent) {
    event.preventDefault();
    let newItem = this.state.newItem
    this.addOrUpdateExpenditure(newItem);
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
        <IonLoading isOpen={this.state.isSaving || this.state.isLoading} message="Laden..." />
        <IonHeader>
          <IonToolbar>
            <IonThumbnail slot="start" style={{ "marginLeft": "1rem" }}>
              <IonImg src="/assets/icon/android-chrome-192x192.png" />
            </IonThumbnail>
            <IonTitle>Letzte Ausgaben</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding" style={{ "--padding-start": 0, "--padding-end": 0 }}>
          <IonCard routerLink="/tags/" style={{ "bottom": "0", "position": "fixed", "width": "calc(100% - 4em)", "margin": "2em" }} routerDirection="forward" slot="fixed" color={this.state.balance < 0 ? "warning" : "success"} >
            <IonCardHeader>
              <IonCardSubtitle>Aktueller Stand</IonCardSubtitle>
              <IonCardTitle>{this.state.balance.toLocaleString(undefined, { style: "currency", currency: "EUR" })}</IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <ExpenditureList onRefresherAvailable={(refresher) => { this.listRefresher = refresher; this.doRefresh() }} onEdit={(e) => this.editExpenditure(e)} onDelete={(e) => this.deleteExpenditure(e)} onTagClick={(tag) => this.props.history.push(`/tags/${tag.id}`)} />
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => this.showEmptyModal()}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        </IonContent>
        <IonModal isOpen={this.state.showModal} onDidDismiss={() => { this.setState({ showModal: false }) }}>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <IonHeader translucent>
              <IonToolbar>
                <IonTitle>{this.state.newItem.id === -1 ? "Ausgabe eintragen" : "Ausgabe bearbeiten"}</IonTitle>
                <IonButtons slot="start">
                  <IonButton onClick={() => this.setState({ showModal: false })}>Abbrechen</IonButton>
                </IonButtons>
                <IonButtons slot="end">
                  <IonButton color="primary" type="submit" disabled={this.state.isSaving}>Speichern</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
              <IonItem>
                <IonLabel>Betrag</IonLabel>
                <IonInput value={this.state.newItem.amount > 0 ? (this.state.newItem.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""} inputMode="decimal" pattern="^[0-9]+([\.,][0-9]{1,2})?$" required={true} onIonChange={(e) => this.handleChangeAmount(e)} placeholder="0.00"></IonInput> €
              </IonItem>
              <IonItem>
                <IonLabel>Grund</IonLabel>
                <IonInput required={true} value={this.state.newItem.reason} onIonChange={(e) => this.handleChangeReason(e)} placeholder="Shop oder Zweck" autocapitalize="on"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel>Gezahlt von</IonLabel>
                <IonSegment slot="end" style={{ "width": "50%" }} onIonChange={(e) => this.handleChangeUser(e)} value={this.state.newItem.username}>
                  {this.state.availableUserNames.map((name) => {
                    return (
                      <IonSegmentButton key={name} value={name}>
                        <IonLabel>{name}</IonLabel>
                      </IonSegmentButton>
                    );
                  })}
                </IonSegment>
              </IonItem>
              <IonItem>
                <IonLabel className="ion-text-wrap">
                  {this.state.tags.map((tag) => {
                    return (
                      <IonButton onClick={(evt) => this.handleToggleTag(tag)} color={tag.color} fill={this.newItemHasTag(tag) ? "solid" : "outline"} key={tag.id} size="small" style={{ "width": "40%", "margin": "0.4rem calc(20%/4)" }}>
                        <IonLabel>{tag.name}</IonLabel>
                        <IonIcon icon={require(`ionicons/icons/imports/${tag.icon}.js`)}></IonIcon>
                      </IonButton>
                    );
                  })}
                </IonLabel>
              </IonItem>
            </IonContent>
          </form>
        </IonModal>
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
