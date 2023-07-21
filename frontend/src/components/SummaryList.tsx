import { IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider, IonProgressBar } from '@ionic/react';
import React from 'react';
import { Summary, Tag } from "../models";

type SummaryListProps = {
    summary: Summary
};

export class SummaryList extends React.Component<SummaryListProps> {
    state = {
        max_month: 0,
        max_year: 0
    }

    componentDidMount() {
        this.doRefresh()
    }

    componentDidUpdate(preProps: SummaryListProps) {
        if (this.props.summary !== preProps.summary) {
            this.doRefresh();
        }
    }

    doRefresh() {
        const max_month = Math.max(...this.props.summary.by_month.map((date: [any, number]) => date[1]));
        const max_year = Math.max(...this.props.summary.by_year.map(((date: [any, number]) => date[1])));

        this.setState({
            max_month: max_month,
            max_year: max_year
        })
    }

    getExpenditureLink(date: string) {
        let params = [`date=${date}`]
        if ((this.props.summary as Tag).id >= 0) {
            params.push(`tag=${(this.props.summary as Tag).id}`)
        }
        return `/expenditures/?${params.join('&')}`
    }

    render() {
        return (
            <IonList>
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>Nach Monat</IonLabel>
                    </IonItemDivider>
                    {this.props.summary.by_month.map(([date, amount]) => (
                        <IonItem routerLink={this.getExpenditureLink(date)} routerDirection="forward" key={`date-${date}`}>
                            <IonLabel position="fixed">
                                {new Date(Date.parse(date)).toLocaleString(undefined, { month: "long" })}
                                <p>
                                    {new Date(Date.parse(date)).toLocaleString(undefined, { year: "numeric" })}
                                </p>
                            </IonLabel>
                            <IonLabel>
                                <IonProgressBar value={amount / this.state.max_month}></IonProgressBar>
                            </IonLabel>
                            <IonLabel slot="end" color="success" position="fixed">
                                {(amount / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>Nach Jahr</IonLabel>
                    </IonItemDivider>
                    {this.props.summary.by_year.map(([date, amount]) => (
                        <IonItem routerLink={this.getExpenditureLink(date)} routerDirection="forward" key={`date-${date}`}>
                            <IonLabel>
                                {new Date(Date.parse(date)).toLocaleString(undefined, { year: "numeric" })}
                            </IonLabel>
                            <IonLabel>
                                <IonProgressBar value={amount / this.state.max_year}></IonProgressBar>
                            </IonLabel>
                            <IonLabel slot="end" color="success" position="fixed">
                                {(amount / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                            </IonLabel>

                        </IonItem>
                    ))}
                </IonItemGroup>
            </IonList >
        );
    }
}

export default SummaryList
