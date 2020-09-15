import { IonContent, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonItemOptions, IonItemOption, IonItemSliding, IonFab, IonFabButton, IonButtons, IonIcon, IonModal, IonButton, IonRefresher, IonRefresherContent, IonInput, IonSelect, IonSelectOption, IonText, IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading, IonImg, IonThumbnail } from '@ionic/react';
import { RefresherEventDetail, InputChangeEventDetail } from '@ionic/core';
import React from 'react';
import { FormEvent } from 'react';
import { add } from 'ionicons/icons';
import { API_HOST } from '../App'
import { Tag, Expenditure } from '../models'
import { RouteComponentProps } from "react-router-dom";

class Home extends React.Component<RouteComponentProps> {


  state = {
    expenditures: Array<Expenditure>(),
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
    fetch(`${API_HOST}/api/expenditures/${item.id}`, { method: 'DELETE' })
      .then((_: Object) => {
        const data = this.state.expenditures.filter(i => i.id !== item.id)

        this.setState({ expenditures: data })
        this.doRefresh();
      })
      .catch(console.error)
  }

  editExpenditure(item: Expenditure) {
    this.setState({
      newItem: item, showModal: true
    })
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

    fetch(`${API_HOST}/api/expenditures?limit=${this.state.expenditureLimit}`)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          isLoading: false,
          expenditures: data.map((item: any) => {
            item.amount = item.amount / 100
            return item
          })
        })
        if (event) {
          event.detail.complete()
        }
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

  searchNext(event: CustomEvent) {
    this.setState({
      expenditureLimit: this.state.expenditureLimit + 20
    });

    fetch(`${API_HOST}/api/expenditures?limit=${this.state.expenditureLimit}`)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          expenditures: data.map((item: any) => {
            item.amount = item.amount / 100
            return item
          })
        })
      })
      .catch(console.error)
      .finally(() => (event.target as HTMLIonInfiniteScrollElement).complete())
  }

  render() {
    return (
      <IonPage>
        <IonLoading isOpen={this.state.isSaving || this.state.isLoading} message="Laden..." />
        <IonHeader>
          <IonToolbar>
            <IonThumbnail slot="start">
              <IonImg src="/assets/icon/android-chrome-192x192.png" />
            </IonThumbnail>
            <IonTitle>Letzte Ausgaben</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonCard routerLink="/tags/" style={{ "bottom": "0", "position": "fixed", "width": "calc(100% - 4em)", "margin": "2em" }} routerDirection="forward" slot="fixed" color={this.state.balance < 0 ? "warning" : "success"} >
            <IonCardHeader>
              <IonCardSubtitle>Aktueller Stand</IonCardSubtitle>
              <IonCardTitle>{this.state.balance.toLocaleString(undefined, { style: "currency", currency: "EUR" })}</IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList>
            {this.state.expenditures.map((expenditure) => (
              <IonItemSliding key={expenditure.id.toString()}>
                <IonItem>
                  <IonLabel>
                    {expenditure.reason}
                    <p>{expenditure.username}</p>
                  </IonLabel>

                  <IonLabel color="success" className="ion-text-wrap" style={{ "textAlign": "right" }}>
                    <IonText color="success">
                      {expenditure.amount.toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                    </IonText>
                    <p></p>
                    <IonText color="secondary">
                      {expenditure.tags.map((tag) => {
                        return (
                          <IonButton color={tag.color} onClick={() => this.props.history.push(`/tags/${tag.id}`)} key={tag.id}>
                            <IonIcon icon={require(`ionicons/icons/imports/${tag.icon}.js`)}></IonIcon>
                          </IonButton>
                        );
                      })}
                    </IonText>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="primary" onClick={() => { document.querySelector('ion-item-sliding')!.closeOpened(); this.editExpenditure(expenditure) }}>
                    Bearbeiten
                  </IonItemOption>

                  <IonItemOption color="danger" onClick={() => { this.deleteExpenditure(expenditure) }}>
                    Löschen
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
            <IonInfiniteScroll threshold="100px" disabled={false} onIonInfinite={(e: CustomEvent<void>) => this.searchNext(e)}>
              <IonInfiniteScrollContent>
              </IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </IonList>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => this.showEmptyModal()}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        </IonContent>
        <IonModal isOpen={this.state.showModal} onDidDismiss={() => { this.setState({ showModal: false }) }}>
          <form onSubmit={this.handleSubmit}>
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
                <IonInput value={this.state.newItem.amount > 0 ? (this.state.newItem.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""} inputMode="decimal" pattern="^[0-9]+([\.,][0-9]{1,2})?$" required={true} onIonChange={this.handleChangeAmount} placeholder="0.00"></IonInput> €
              </IonItem>
              <IonItem>
                <IonLabel>Grund</IonLabel>
                <IonInput required={true} value={this.state.newItem.reason} onIonChange={this.handleChangeReason} placeholder="Shop oder Zweck"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel>Gezahlt von</IonLabel>
                <IonSelect onIonChange={this.handleChangeUser} value={this.state.newItem.username}>
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

                <IonLabel className="ion-text-wrap">
                  {this.state.tags.map((tag) => {
                    return (
                      <IonButton onClick={(evt) => this.handleToggleTag(tag)} color={tag.color} fill={this.newItemHasTag(tag) ? "solid" : "outline"} key={tag.id}>
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
