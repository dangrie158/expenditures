import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonItemOptions, IonItemOption, IonItemSliding, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonRefresher, IonRefresherContent, IonInput } from '@ionic/react';
import { RefresherEventDetail, InputChangeEventDetail } from '@ionic/core';
import React from 'react';
import { FormEvent } from 'react';

class Expenditure {
  username: string = "n/a"
  amount: number = 0
  reason: string = "n/a"
  id: number = -1
}

class Home extends React.Component {
  state = {
    expenditures: Array<Expenditure>(),
    showModal: false,
    newItem: new Expenditure(),
    userName: this.getUsername(),
    userNameIsSet: this.getUsername() !== "",
    balance: 0
  }

  constructor(props: any) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
  }

  componentDidMount() {
    this.doRefresh()
  }

  deleteExpenditure(item: Expenditure) {
    fetch(`/api/expenditures/${item.id}`, { method: 'DELETE' })
      .then((_: Object) => {
        const data = this.state.expenditures.filter(i => i.id !== item.id)

        this.setState({ expenditures: data })
      })
      .catch(console.log)
  }

  addExpenditure(item: Expenditure) {
    let newItem = {
      amount: (item.amount * 100).toFixed(0),
      reason: item.reason,
      username: item.username
    }
    return fetch(`/api/expenditures`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(newItem)
    })
      .then((_: Object) => {
        this.doRefresh()
      })
      .catch(console.log)
  }

  saveUsername(username: string) {
    document.cookie = `username=${username}`;
  }

  getUsername() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1")
  }

  doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    fetch('/api/expenditures?limit=20')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          expenditures: data.map((item: any) => {
            item.amount = item.amount / 100
            return item
          })
        })
        if (event) {
          event.detail.complete()
        }
      })
      .catch(console.log)

      fetch('/api/current-status')
        .then(res => res.json())
        .then((data) => {
          let myBalance = data.find((item: any) => item[0] === this.state.userName)
          let otherBalance = data.find((item: any) => item[0] !== this.state.userName)
          let balance = myBalance[1] - otherBalance[1]
          this.setState({
            balance: balance / 100
          })
        })
        .catch(console.log)
  }

  handleChangeAmount(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      newItem: {
        reason: this.state.newItem.reason,
        amount: event.detail.value
      }
    });
  }

  handleChangeReason(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      newItem: {
        amount: this.state.newItem.amount,
        reason: event.detail.value
      }
    });
  }

  handleChangeUsername(event: CustomEvent<InputChangeEventDetail>) {
    this.setState({
      userName: event.detail.value
    });
  }

  handleSubmit(event: FormEvent) {
    event.preventDefault();
    let newItem = this.state.newItem
    newItem.username = this.state.userName
    this.addExpenditure(newItem)
      .then(() =>
        this.setState({ showModal: false })
      )
  }

  handleSubmitUsername(event: FormEvent) {
    event.preventDefault();

    this.saveUsername(this.state.userName)
    this.setState({ userNameIsSet: true })
  }
  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Letzte Ausgaben</IonTitle>
            <IonLabel slot="end">Status:</IonLabel>
            <IonLabel slot="end" color={this.state.balance < 0 ? "warning" : "success"}>{this.state.balance} €</IonLabel>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList>
            {this.state.expenditures.map((expenditure) => (
              <IonItemSliding key={expenditure.id.toString()}>
                <IonItem>
                  <IonLabel>{expenditure.reason}</IonLabel>
                  <IonLabel>{expenditure.username}</IonLabel>
                  <IonLabel slot="end" color="success">{expenditure.amount}€</IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => {
                    this.deleteExpenditure(expenditure)
                  }}>Löschen</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => this.setState({ showModal: true })}>
              <IonIcon name="add" />
            </IonFabButton>
          </IonFab>
        </IonContent>
        <IonModal isOpen={this.state.showModal}>
          <form onSubmit={this.handleSubmit}>
            <IonItem>
              <IonLabel>Betrag</IonLabel>
              <IonInput inputMode="decimal" pattern="^[0-9]+(\.[0-9]{1,2})?$" required={true} onIonChange={this.handleChangeAmount} placeholder="0.00"></IonInput> €
          </IonItem>
            <IonItem>
              <IonLabel>Grund</IonLabel>
              <IonInput required={true} onIonChange={this.handleChangeReason} placeholder="Shop oder Zweck"></IonInput>
            </IonItem>
            <IonButton color="primary" type="submit">Speichern</IonButton>
            <IonButton color="light" onClick={() => this.setState({ showModal: false })}>Abbrechen</IonButton>
          </form>
        </IonModal>
        <IonModal isOpen={!this.state.userNameIsSet}>
          <form onSubmit={this.handleSubmitUsername}>
            <IonItem>
              <IonLabel>Nutzer</IonLabel>
              <IonInput required={true} onIonChange={this.handleChangeUsername}></IonInput>
            </IonItem>
            <IonButton color="primary" type="submit">Speichern</IonButton>
          </form>
        </IonModal>
      </IonPage>
    );
  }
}

export default Home;
