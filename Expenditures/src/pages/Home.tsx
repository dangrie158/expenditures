import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonItemOptions, IonItemOption, IonItemSliding, IonFab, IonFabButton, IonButtons, IonIcon, IonModal, IonButton, IonRefresher, IonRefresherContent, IonInput, IonListHeader, IonSelect, IonSelectOption, IonChip } from '@ionic/react';
import { RefresherEventDetail, InputChangeEventDetail } from '@ionic/core';
import React from 'react';
import { FormEvent } from 'react';
import { add, checkmarkCircleOutline, } from 'ionicons/icons';

class Expenditure {
  username: string = "n/a"
  amount: number = 0
  reason: string = "n/a"
  id: number = -1
  tags: Array<{ name: string }> = []
}

class Home extends React.Component {
  state = {
    expenditures: Array<Expenditure>(),
    showModal: false,
    newItem: new Expenditure(),
    userName: this.getUsername(),
    userNameIsSet: this.getUsername() !== "",
    availableUserNames: Array<string>(),
    tags: Array<{ name: string }>(),
    balance: 0,
    isSaving: false
  }

  constructor(props: any) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
  }

  componentDidMount() {
    this.setState({
      newItem: {
        ...this.state.newItem,
        username: this.state.userName
      }
    })
    this.doRefresh()
  }

  deleteExpenditure(item: Expenditure) {
    fetch(`/api/expenditures/${item.id}`, { method: 'DELETE' })
      .then((_: Object) => {
        const data = this.state.expenditures.filter(i => i.id !== item.id)

        this.setState({ expenditures: data })
        this.doRefresh();
      })
      .catch(console.log)
  }

  addExpenditure(item: Expenditure) {
    let newItem = {
      amount: (item.amount * 100).toFixed(0),
      reason: item.reason,
      username: item.username,
      tags: item.tags
    }

    this.setState({ isSaving: true });

    return fetch(`/api/expenditures`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(newItem)
    })
      .then(() => {
        this.doRefresh();
      })
      .catch((e) => {
        console.log(e);
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

    fetch('/api/tags')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          tags: data
        })
      })
      .catch(console.log)

    fetch('/api/current-status')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
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
      .catch(console.log)
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
    console.log(this.state)
    this.setState({
      newItem: {
        ...this.state.newItem,
        username: event.detail.value
      }
    });
  }


  handleToggleTag(tag: { name: string }) {
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
    console.log(this.state.newItem.tags)
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
    this.addExpenditure(newItem);
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
            <IonItem slot="end">
              <IonLabel position="fixed" color={this.state.balance < 0 ? "warning" : "success"}>
                <p>Status:</p>
                <p>{this.state.balance.toLocaleString(undefined, { style: "currency", currency: "EUR" })}</p>
              </IonLabel>
            </IonItem>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList>
            {this.state.expenditures.map((expenditure) => (
              <IonItemSliding key={expenditure.id.toString()}>
                <IonItem>
                  <IonLabel position="fixed">
                    {expenditure.reason}
                    <p>{expenditure.username}</p>
                  </IonLabel>
                  {expenditure.tags.map((tag) => {
                    return (
                      <IonChip color="primary">
                        <IonLabel>{tag.name}</IonLabel>
                      </IonChip>
                    );
                  })}
                  <IonLabel slot="end" color="success" position="fixed">
                    {expenditure.amount.toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                  </IonLabel>
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
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        </IonContent>
        <IonModal isOpen={this.state.showModal}>
          <form onSubmit={this.handleSubmit}>
            <IonHeader translucent>
              <IonToolbar>
                <IonTitle>Ausgabe eintragen</IonTitle>
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
                <IonInput inputMode="decimal" pattern="^[0-9]+([\.,][0-9]{1,2})?$" required={true} onIonChange={this.handleChangeAmount} placeholder="0.00"></IonInput> €
              </IonItem>
              <IonItem>
                <IonLabel>Grund</IonLabel>
                <IonInput required={true} onIonChange={this.handleChangeReason} placeholder="Shop oder Zweck"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel>Gezahlt von</IonLabel>
                <IonSelect onIonChange={this.handleChangeUser}>
                  {this.state.availableUserNames.map((name) => {
                    return (
                      <IonSelectOption selected={name === this.state.newItem.username} key={name} value={name}>
                        {name}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Tags:</IonLabel>
                {this.state.tags.map((tag) => {
                  return (
                    <IonChip onClick={(evt) => this.handleToggleTag(tag)} color="primary" outline={this.newItemHasTag(tag) === false}>
                      <IonIcon icon={this.newItemHasTag(tag) ? checkmarkCircleOutline : add}></IonIcon>
                      <IonLabel>{tag.name}</IonLabel>
                    </IonChip>
                  );
                })}
              </IonItem>
            </IonContent>
          </form>
        </IonModal>
        <IonModal isOpen={!this.state.userNameIsSet}>
          <form onSubmit={this.handleSubmitUsername}>
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
                <IonInput required={true} onIonChange={this.handleChangeUsername}></IonInput>
              </IonItem>
            </IonContent>
          </form>
        </IonModal>
      </IonPage >
    );
  }
}

export default Home;
