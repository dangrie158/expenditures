import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonItem, IonLabel, IonItemOptions, IonItemOption, IonItemSliding, IonIcon, IonButton, IonRefresher, IonRefresherContent, IonText } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import React from 'react';
import { API_HOST } from '../App'
import { Tag, Expenditure } from '../models'

type ExpenditureListProps = {
    onEdit: (item: Expenditure) => void;
    onDelete: (item: Expenditure) => void;
    onTagClick: (tag: Tag) => void;
    onRefresherAvailable?: (refresher: () => Promise<void>) => void
    tag?: String;
    month?: String;
    year?: String;

}

export class ExpenditureList extends React.Component<ExpenditureListProps> {
    state = {
        expenditures: Array<Expenditure>(),
        expenditureLimit: 20
    }

    componentDidMount() {
        this.doRefresh()
        if (this.props.onRefresherAvailable) {
            this.props.onRefresherAvailable(this.doRefresh.bind(this))
        }
    }

    doRefresh(event?: CustomEvent<RefresherEventDetail>) {

        return fetch(`${API_HOST}/api/expenditures?limit=${this.state.expenditureLimit}`)
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
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={(event) => this.doRefresh(event)}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <IonList style={{ "marginBottom": "3rem" }}>
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
                                                <IonButton color={tag.color} onClick={() => this.props.onTagClick(tag)} key={tag.id}>
                                                    <IonIcon icon={require(`ionicons/icons/imports/${tag.icon}.js`)}></IonIcon>
                                                </IonButton>
                                            );
                                        })}
                                    </IonText>
                                </IonLabel>
                            </IonItem>
                            <IonItemOptions side="end">
                                <IonItemOption color="primary" onClick={() => { document.querySelector('ion-item-sliding')!.closeOpened(); this.props.onEdit(expenditure) }}>
                                    Bearbeiten
                            </IonItemOption>
                                <IonItemOption color="danger" onClick={() => { this.props.onDelete(expenditure) }}>
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
            </IonContent>
        );
    }
}

export default ExpenditureList;
