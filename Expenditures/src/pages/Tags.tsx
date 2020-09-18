import { IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButtons, IonIcon, IonRefresher, IonRefresherContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import React from 'react';
import { API_HOST } from '../App'
import { Tag } from '../models'
import { RouteComponentProps } from "react-router-dom";
import SummaryList from '../components/SummaryList';

interface TagDetailProps extends RouteComponentProps<{
  id: string;
}> { }

export class TagDetail extends React.Component<TagDetailProps> {
  state = {
    tag: new Tag()
  }

  tagId: number = -1

  constructor(props: any) {
    super(props);
    this.tagId = props.match.params.id
  }

  componentDidMount() {
    this.doRefresh()
  }

  doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    if (this.tagId >= 0) {
      fetch(`${API_HOST}/api/tags/${this.tagId}`)
        .then(res => res.json())
        .then((data) => {
          this.setState({
            tag: data
          })
        })
        .catch(console.error)
    }
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>
              <IonLabel>
                Ausgaben für: {this.state.tag.name}
              </IonLabel>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonCard color={this.state.tag.color}>
            <IonCardHeader class="ion-text-center">
              <IonIcon style={{ "fontSize": "4rem" }} icon={require(`ionicons/icons/imports/${this.state.tag.icon}.js`)} />
              <IonCardTitle>{this.state.tag.name}</IonCardTitle>
              <IonCardSubtitle>Ausgaben gesamt</IonCardSubtitle>
              <IonCardTitle>{(this.state.tag.total! / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}</IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <SummaryList summary={this.state.tag} />
        </IonContent>
      </IonPage >
    );
  }
}
