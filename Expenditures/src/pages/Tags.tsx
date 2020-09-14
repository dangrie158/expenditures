import { IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonListHeader, IonItem, IonLabel, IonButtons, IonIcon, IonRefresher, IonRefresherContent, } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import React from 'react';
import { API_HOST } from '../App'
import { Tag } from '../models'
import { RouteComponentProps } from "react-router-dom";

export class TagOverview extends React.Component {
  state = {
    tags: Array<Tag>(),
  }

  componentDidMount() {
    this.doRefresh()
  }

  doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    fetch(`${API_HOST}/api/tags/summary`)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          tags: data
        })
      })
      .catch(console.log)
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Ausgaben</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList>
            {this.state.tags.map((tag) => (

              <IonItem routerLink={"/tags/" + tag.id} routerDirection="forward" key="tag.id" >
                <IonLabel position="fixed">
                  {tag.name}
                </IonLabel>
                <IonIcon color={tag.color} icon={require(`ionicons/icons/imports/${tag.icon}.js`)}></IonIcon>
                <IonLabel slot="end" color="success" position="fixed">
                  {(tag.sum! / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                </IonLabel>
              </IonItem>

            ))}
          </IonList>

        </IonContent>

      </IonPage >
    );
  }
}

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
          console.log(data)
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
                {this.state.tag.name}
              </IonLabel>
              <IonIcon color={this.state.tag.color} icon={require(`ionicons/icons/imports/${this.state.tag.icon}.js`)}></IonIcon>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList>
            <IonListHeader>
              <IonLabel>Monatliche Ausgaben</IonLabel>
            </IonListHeader>
            {this.state.tag.by_month!.map((entry) => (
              <IonItem key="entry[0]">
                <IonLabel>
                  {new Date(Date.parse(entry[0])).toLocaleString(undefined, { month: "long", year: "numeric" })}
                </IonLabel>
                <IonLabel slot="end" color="success" position="fixed">
                  {(entry[1] / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                </IonLabel>
              </IonItem>
            ))}

            <IonListHeader>
              <IonLabel>Jährliche Ausgaben</IonLabel>
            </IonListHeader>
            {this.state.tag.by_year!.map((entry) => (
              <IonItem key="entry[0]">
                <IonLabel position="fixed">
                  {new Date(Date.parse(entry[0])).toLocaleString(undefined, { year: "numeric" })}
                </IonLabel>
                <IonLabel slot="end" color="success" position="fixed">
                  {(entry[1] / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>

        </IonContent>

      </IonPage >
    );
  }
}
