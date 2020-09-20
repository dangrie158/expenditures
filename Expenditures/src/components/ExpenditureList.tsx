import { IonInfiniteScroll, IonLoading, IonFab, IonFabButton, IonInfiniteScrollContent, IonList, IonItem, IonLabel, IonItemOptions, IonItemOption, IonItemSliding, IonButton, IonRefresher, IonRefresherContent, IonText, IonContent } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import React from 'react';
import { API_HOST } from '../App'
import { Tag, Expenditure } from '../models'
import { ExpenditureEditor } from './ExpenditureEditor';
import NamedIcon from './NamedIcon';

type ExpenditureListProps = {
    onEdit?: (item: Expenditure) => void;
    onDelete?: (item: Expenditure) => void;
    onTagClick: (tag: Tag) => void;
    userNames?: Array<string>;
    tag?: String;
    date?: String;
    allowEdit: boolean;
    allowAdd: boolean;
}

export class ExpenditureList extends React.Component<ExpenditureListProps> {
    state = {
        showEditor: false,
        expenditures: Array<Expenditure>(),
        expenditureLimit: 0,
        newItem: new Expenditure(),
        isLoading: false
    };

    componentDidMount() {
        this.doRefresh();

        this.setState({
            newItem: {
                ...this.state.newItem,
                username: this.getUsername()
            }
        });
    }

    getUsername() {
        let userName = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1")
        return userName;
    }

    deleteExpenditure(item: Expenditure) {
        fetch(`${API_HOST}/api/expenditures/${item.id}`, { method: 'DELETE' })
            .then((_: Object) => {
                this.doRefresh();
                if (this.props.onDelete) {
                    this.props.onDelete(item)
                }
            })
            .catch(console.error)
    }

    editExpenditure(item: Expenditure) {
        this.setState({ newItem: item, showEditor: true })
    }

    addExpenditure() {
        let emptyExpenditure = new Expenditure();
        emptyExpenditure.username = this.getUsername();
        this.setState({
            newItem: emptyExpenditure,
            showEditor: true
        })
    }

    doRefresh(event?: CustomEvent<RefresherEventDetail>) {
        this.setState({ isLoading: true });
        return this.searchNext()
            .then(() => {
                this.setState({
                    isLoading: false
                })
                if (event) {
                    event.detail.complete()
                }
            })
    }

    searchNext(event?: CustomEvent) {
        return new Promise<void>((resolve, reject) => {
            this.setState({
                expenditureLimit: this.state.expenditureLimit + 20
            }, () => {
                let queryProps = [`limit=${this.state.expenditureLimit}`]

                if (this.props.date !== undefined && this.props.date !== "") {
                    queryProps.push(`date=${this.props.date}`)
                }

                if (this.props.tag !== undefined && this.props.tag !== "undefined" && this.props.tag !== "" && this.props.tag !== "-1") {
                    queryProps.push(`tag=${this.props.tag}`)
                }
                fetch(`${API_HOST}/api/expenditures?${queryProps.join("&")}`)
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({
                            expenditures: data.map((item: any) => {
                                item.amount = item.amount / 100
                                return item
                            })
                        })
                        resolve();
                    })
                    .catch(reject)
                    .finally(() => {
                        if (event) { (event.target as HTMLIonInfiniteScrollElement).complete() }
                    })
            });
        })
    }

    onSaveExpenditure(item: Expenditure) {
        if (this.props.onEdit) {
            this.props.onEdit(item);
        }
        this.doRefresh();
    }

    render() {
        return (
            <IonContent>
                <IonLoading isOpen={this.state.isLoading} message="Laden..." />
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
                                    <p>{new Date(Date.parse(expenditure.created_date)).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p>
                                </IonLabel>
                                <IonLabel color="success" className="ion-text-wrap" style={{ "textAlign": "right" }}>
                                    <IonText color="success">
                                        {expenditure.amount.toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                                    </IonText>
                                    <p>
                                        {expenditure.tags.map((tag) => {
                                            return (
                                                <IonButton color={tag.color} onClick={() => this.props.onTagClick(tag)} key={tag.id}>
                                                    <NamedIcon name={tag.icon} />
                                                </IonButton>
                                            );
                                        })}
                                    </p>
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

                {this.props.allowEdit &&
                    <ExpenditureEditor
                        show={this.state.showEditor}
                        onDismiss={() => { this.setState({ showEditor: false }) }}
                        onSave={(e) => this.onSaveExpenditure(e)}
                        userNames={this.props.userNames || []}
                        onEdit={(e) => { this.setState({ newItem: e }); }}
                        item={this.state.newItem} />
                }

                {this.props.allowAdd &&
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton onClick={() => this.addExpenditure()}>
                            <NamedIcon name="add" />
                        </IonFabButton>
                    </IonFab>
                }
            </IonContent>
        );
    }
}

export default ExpenditureList;
