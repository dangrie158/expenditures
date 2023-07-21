import { IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButtons, IonRefresher, IonRefresherContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLoading } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import React from 'react';
import { API_HOST } from '../App'
import { Tag } from '../models'
import { RouteComponentProps } from "react-router-dom";
import SummaryList from '../components/SummaryList';
import NamedIcon from '../components/NamedIcon';

interface TagDetailProps extends RouteComponentProps<{
  id: string;
}> { }

export class TagDetail extends React.Component<TagDetailProps> {
  state = {
    tag: new Tag(),
    isLoading: true,
    tagId: ""
  }

  componentDidMount() {
    this.setState({ tagId: this.props.match.params.id }, () => {
      this.doRefresh();
    })
  }

  componentDidUpdate(prevProps: TagDetailProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({
        tagId: this.props.match.params.id
      }, () => {
        this.doRefresh()
      })
    }
  }

  doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    if (this.state.tagId !== "") {
      this.setState({ isLoading: true })
      fetch(`${API_HOST}/api/tags/${this.state.tagId}`)
        .then(res => res.json())
        .then((data) => {
          this.setState({
            tag: data
          })
        })
        .catch(console.error)
        .finally(() => {
          this.setState({ isLoading: false })
        })
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
          <IonLoading isOpen={this.state.isLoading} message="Laden..." />
          <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonCard color={this.state.tag.color}>
            <IonCardHeader class="ion-text-center">
              <NamedIcon style={{ "fontSize": "4rem" }} name={this.state.tag.icon} />
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
