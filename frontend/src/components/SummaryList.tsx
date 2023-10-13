import { IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider, IonProgressBar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Summary, Tag } from "../models";

type SummaryListProps = {
  summary: Summary;
};

export default function SummaryList(props: SummaryListProps) {
  const [maxMonth, setMaxMonth] = useState(0);
  const [maxYear, setMaxYear] = useState(0);
  useEffect(() => {
    doRefresh();
  }, [props.summary]);

  const doRefresh = () => {
    const maxMonth = Math.max(...props.summary.by_month.map((date: [unknown, number]) => date[1]));
    const maxYear = Math.max(...props.summary.by_year.map((date: [unknown, number]) => date[1]));
    setMaxMonth(maxMonth);
    setMaxYear(maxYear);
  };

  const getExpenditureLink = (date: string) => {
    const params = [`date=${date}`];
    if ((props.summary as Tag).id >= 0) {
      params.push(`tag=${(props.summary as Tag).id}`);
    }
    return `/expenditures/?${params.join("&")}`;
  };

  return (
    <IonList>
      <IonItemGroup>
        <IonItemDivider>
          <IonLabel>Nach Monat</IonLabel>
        </IonItemDivider>
        {props.summary.by_month.map(([date, amount]) => (
          <IonItem routerLink={getExpenditureLink(date)} routerDirection="forward" key={`date-${date}`}>
            <IonLabel position="fixed">
              {new Date(Date.parse(date)).toLocaleString(undefined, { month: "long" })}
              <p>{new Date(Date.parse(date)).toLocaleString(undefined, { year: "numeric" })}</p>
            </IonLabel>
            <IonLabel>
              <IonProgressBar value={amount / maxMonth}></IonProgressBar>
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
        {props.summary.by_year.map(([date, amount]) => (
          <IonItem routerLink={getExpenditureLink(date)} routerDirection="forward" key={`date-${date}`}>
            <IonLabel>{new Date(Date.parse(date)).toLocaleString(undefined, { year: "numeric" })}</IonLabel>
            <IonLabel>
              <IonProgressBar value={amount / maxYear}></IonProgressBar>
            </IonLabel>
            <IonLabel slot="end" color="success" position="fixed">
              {(amount / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
            </IonLabel>
          </IonItem>
        ))}
      </IonItemGroup>
    </IonList>
  );
}
