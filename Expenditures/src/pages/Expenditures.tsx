import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonBackButton, IonButtons, IonLabel } from '@ionic/react';
import React from 'react';
import { API_HOST } from '../App'
import { RouteComponentProps } from "react-router-dom";

import { ExpenditureList } from '../components/ExpenditureList';
import { Tag } from '../models';

export class Expenditures extends React.Component<RouteComponentProps> {
  state = {
    tag: new Tag(),
    date: "",
    tagId: "",
    year: -1,
    month: -1
  }
  queryParams: Map<string, string> = new Map()

  componentDidMount() {
    this.queryParams = this.props.location.search
      .split(/\?|&/g)
      .reduce((obj: any, item: string): any => {
        const elements = item.split('=')
        if (elements.length === 2) {
          obj.set(elements[0], elements[1]);
        } else if (elements.length === 1 && elements[0] !== "") {
          obj.set(elements[0], "");
        }
        return obj
      }, new Map())

    let month, year = "";
    if (this.queryParams.get('date')) {
      const dateComponents = this.queryParams.get('date')!.split("/");
      if (dateComponents.length > 1) {
        month = dateComponents[0];
        year = dateComponents[1]
      } else if (dateComponents.length === 1) {
        year = dateComponents[0]
      }
    }

    this.setState({
      year: year,
      month: month,
      tagId: this.queryParams.get("tag"),
      date: this.queryParams.get("date")
    }, () => { this.doRefresh() });

  }

  doRefresh() {
    if (this.queryParams.get('tag')) {
      fetch(`${API_HOST}/api/tags/${this.queryParams.get('tag')}`)
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
                Ausgaben Übersicht
              </IonLabel>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonCard
            style={{ "position": "sticky" }}
            color={this.state.tag.color}>
            <IonCardHeader class="ion-text-center">
              <IonCardSubtitle>Ausgaben für {this.queryParams.get('date') ?
                new Date(Date.parse(this.queryParams.get('date')!)).toLocaleString(undefined, { year: "numeric", month: "long" }) :
                new Date(Date.parse(this.queryParams.get('date')!)).toLocaleString(undefined, { year: "numeric" })
              } {this.state.tag.id >= 0 &&
                `für ${this.state.tag.name}`
                }
              </IonCardSubtitle>
              <IonCardTitle></IonCardTitle>
            </IonCardHeader>
          </IonCard>

          <ExpenditureList
            onTagClick={(tag) => this.props.history.push(`/tags/${tag.id}`)}
            allowAdd={false}
            allowEdit={true}
            date={this.state.date}
            tag={this.state.tagId} />
        </IonContent>
      </IonPage >
    );
  }
}

export default Expenditures;
