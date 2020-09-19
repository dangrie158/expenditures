import { IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButtons, IonIcon, IonRefresher, IonRefresherContent, IonItemGroup, IonItemDivider, IonLoading } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import React from 'react';
import { API_HOST } from '../App'
import { Tag, Summary } from '../models'
import { SummaryList } from '../components/SummaryList'

export class SummaryOverview extends React.Component {
  state = {
    tags: Array<Tag>(),
    summary: new Summary(),
    isLoading: true
  }

  componentDidMount() {
    this.doRefresh()
  }

  doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    this.setState({ isLoading: true });

    Promise.all([
      fetch(`${API_HOST}/api/tags/summary`)
        .then(res => res.json())
        .then((data) => {
          this.setState({
            tags: data
          })
        })
        .catch(console.error),

      fetch(`${API_HOST}/api/expenditures/summary`)
        .then(res => res.json())
        .then((data) => {
          this.setState({
            summary: data
          })
        })
        .catch(console.error)
    ]).finally(() => {
      this.setState({ isLoading: false });
    })
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Ausgaben Übersicht</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonLoading isOpen={this.state.isLoading} message="Laden..." />
          <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList style={{ "marginBottom": 0 }}>
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Nach Tag</IonLabel>
              </IonItemDivider>
              {this.state.tags.map((tag) => (
                <IonItem routerLink={"/tags/" + tag.id} routerDirection="forward" key={tag.id}>
                  <IonIcon color={tag.color} icon={require(`ionicons/icons/imports/${tag.icon}.js`)}></IonIcon>
                  <IonLabel position="fixed">
                    {tag.name}
                  </IonLabel>
                  <IonLabel slot="end" color="success" position="fixed">
                    {(tag.sum! / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                  </IonLabel>
                </IonItem>
              ))}
            </IonItemGroup>
          </IonList>
          <SummaryList summary={this.state.summary} />
        </IonContent>
      </IonPage >
    );
  }
}

export default SummaryOverview;
