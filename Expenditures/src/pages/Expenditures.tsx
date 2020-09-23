import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonBackButton, IonButtons, IonLabel } from '@ionic/react';
import React from 'react';
import { API_HOST } from '../App'
import { RouteComponentProps } from "react-router-dom";

import { ExpenditureList } from '../components/ExpenditureList';
import { Tag } from '../models';
import NamedIcon from '../components/NamedIcon';

export class Expenditures extends React.Component<RouteComponentProps> {
  state = {
    tag: new Tag(),
    date: "",
    tagId: "",
    year: -1,
    month: -1,
    queryParams: new Map<string, string>()
  }

  componentDidMount() {
    this.doRefresh()
  }

  componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.doRefresh();
    }
  }

  doRefresh() {
    const queryParams = this.props.location.search
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
    if (queryParams.get('date')) {
      const dateComponents = queryParams.get('date')!.split("/");
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
      tagId: queryParams.get("tag"),
      date: queryParams.get("date")
    }, () => {
      if (this.state.tagId !== undefined) {
        fetch(`${API_HOST}/api/tags/${this.state.tagId}`)
          .then(res => res.json())
          .then((data) => {
            this.setState({
              tag: data
            })
          })
          .catch(console.error)
      } else {
        this.setState({
          tag: new Tag()
        })
      }
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
            color={this.state.tag.color || 'dark'}>
            <IonCardHeader class="ion-text-center">
              <NamedIcon style={{ "fontSize": "4rem" }} name={this.state.tag.icon} />
              <IonCardSubtitle>Ausgaben {
                this.state.date &&
                  this.state.date!.split('-').length > 1 ?
                  `im ${new Date(Date.parse(this.state.date!)).toLocaleString(undefined, { year: "numeric", month: "long" })}` :
                  `in ${new Date(Date.parse(this.state.date!)).toLocaleString(undefined, { year: "numeric" })}`
              } {this.state.tag.id >= 0 &&
                "für"
                }
              </IonCardSubtitle>
              {this.state.tag.id >= 0 &&
                <IonCardTitle>
                  {this.state.tag.name}
                </IonCardTitle>
              }
              <IonCardTitle></IonCardTitle>
            </IonCardHeader>
          </IonCard>

          <ExpenditureList

            onListChanged={() => this.doRefresh()}
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
