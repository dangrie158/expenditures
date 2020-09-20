import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButtons, IonModal, IonButton, IonInput, IonSegment, IonSegmentButton } from '@ionic/react';
import { RefresherEventDetail, InputChangeEventDetail } from '@ionic/core';
import React from 'react';
import { FormEvent } from 'react';
import { API_HOST } from '../App'
import { Tag, Expenditure } from '../models'
import NamedIcon from './NamedIcon';

type ExpenditureEditorProps = {
  show: boolean;
  onDismiss: () => void;
  onSave: (item: Expenditure) => void;
  onEdit: (item: Expenditure) => void;
  userNames: Array<string>;
  item: Expenditure;
}

export class ExpenditureEditor extends React.Component<ExpenditureEditorProps> {
  state = {
    tags: Array<Tag>(),
    showModal: true,
    isSaving: false
  };

  componentDidMount() {
    this.doRefresh();
  }

  getUsername() {
    let userName = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1")
    return userName
  }

  handleChangeAmount(event: CustomEvent<InputChangeEventDetail>) {
    this.props.item.amount = Number.parseFloat((event.detail.value || '0').replace(',', '.'))
  }

  handleChangeReason(event: CustomEvent<InputChangeEventDetail>) {
    this.props.item.reason = event.detail.value || '';
    this.props.onEdit(this.props.item);
  }

  handleChangeUser(event: CustomEvent<InputChangeEventDetail>) {
    this.props.item.username = event.detail.value!
    this.props.onEdit(this.props.item);
  }

  handleToggleTag(tag: Tag) {
    let oldTags = this.props.item.tags.map(t => t.name);
    let index = oldTags.indexOf(tag.name);
    let newTags = this.props.item.tags;
    if (index >= 0) {
      newTags.splice(index, 1)
    } else {
      newTags.push(tag)
    }

    this.props.item.tags = newTags;
    this.props.onEdit(this.props.item);
  }

  doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    this.setState({
      isLoading: true
    });

    fetch(`${API_HOST}/api/tags`)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          tags: data
        })
      })
      .catch(console.error)
  }

  itemHasTag(tag: { name: string }) {
    return this.props.item.tags.map(t => t.name).indexOf(tag.name) >= 0
  }

  handleSubmit(event: FormEvent) {
    this.setState({
      isSaving: true
    });

    event.preventDefault();
    let item = this.props.item;
    this.addOrUpdateExpenditure(item)
      .then(() => {
        this.props.onSave(item)
        this.props.onDismiss()
      })
      .finally(() => {
        this.setState({
          isSaving: false
        })
      });
  }

  addOrUpdateExpenditure(item: Expenditure) {
    let newItem = {
      amount: (item.amount * 100).toFixed(0),
      reason: item.reason,
      username: item.username,
      tags: item.tags
    }

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
      .catch((e) => {
        console.error(e);
        alert("Speichern fehlgeschlagen");
      })
  }

  render() {
    return (
      <IonModal isOpen={this.props.show} onDidDismiss={this.props.onDismiss}>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>{this.props.item.id === -1 ? "Ausgabe eintragen" : "Ausgabe bearbeiten"}</IonTitle>
              <IonButtons slot="start">
                <IonButton onClick={this.props.onDismiss}>Abbrechen</IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton color="primary" type="submit" disabled={this.state.isSaving}>Speichern</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonItem>
              <IonLabel>Betrag</IonLabel>
              <IonInput
                value={this.props.item.amount > 0 ? (this.props.item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}
                inputMode="decimal"
                pattern="^[0-9]+([\.,][0-9]{1,2})?$"
                required={true}
                onIonBlur={(e) => this.props.onEdit(this.props.item)}
                onIonChange={(e) => this.handleChangeAmount(e)}
                placeholder="0.00" /> €
              </IonItem>
            <IonItem>
              <IonLabel>Grund</IonLabel>
              <IonInput
                required={true}
                value={this.props.item.reason}
                onIonChange={(e) => this.handleChangeReason(e)}
                placeholder="Shop oder Zweck"
                autocapitalize="on" />
            </IonItem>
            <IonItem>
              <IonLabel>Gezahlt von</IonLabel>
              <IonSegment
                slot="end"
                style={{ "width": "50%" }}
                onIonChange={(e) => this.handleChangeUser(e)} value={this.props.item.username}>
                {this.props.userNames.map((name) => {
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
                    <IonButton
                      key={tag.id}
                      onClick={(evt) => this.handleToggleTag(tag)}
                      color={tag.color}
                      fill={this.itemHasTag(tag) ? "solid" : "outline"}
                      size="small"
                      style={{ "width": "40%", "margin": "0.4rem calc(20%/4)" }}>
                      <IonLabel>{tag.name}</IonLabel>
                      <NamedIcon name={tag.icon} />
                    </IonButton>
                  );
                })}
              </IonLabel>
            </IonItem>
          </IonContent>
        </form>
      </IonModal >
    );
  }
}

export default ExpenditureEditor;
