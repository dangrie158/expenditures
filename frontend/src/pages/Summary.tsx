import {
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonItemGroup,
  IonItemDivider,
  IonLoading,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import React, { useEffect, useState } from "react";
import { API_HOST, useAuthorizedFetch } from "../backend-hooks";
import { Tag, Summary } from "../models";
import SummaryList from "../components/SummaryList";
import NamedIcon from "../components/NamedIcon";

export default function SummaryOverview() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [summary, setSummary] = useState(new Summary());
  const [isLoading, setIsLoading] = useState(true);
  const authorizedFetch = useAuthorizedFetch();

  useEffect(() => {
    doRefresh();
  }, []);

  const doRefresh = async (event?: CustomEvent<RefresherEventDetail>) => {
    setIsLoading(true);
    try {
      setTags((await authorizedFetch(`${API_HOST}/api/tags/summary`)) ?? []);
      const summary = await authorizedFetch<Summary>(`${API_HOST}/api/expenditures/summary`);
      if (summary !== undefined) {
        setSummary(summary);
      }
    } finally {
      setIsLoading(false);
      event?.detail.complete();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Ausgaben Übersicht</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonLoading isOpen={isLoading} message="Laden..." />
        <IonRefresher slot="fixed" onIonRefresh={event => doRefresh(event)}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList style={{ marginBottom: 0 }}>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Nach Tag</IonLabel>
            </IonItemDivider>
            {tags.map(tag => (
              <IonItem routerLink={"/tags/" + tag.id} routerDirection="forward" key={tag.id}>
                <NamedIcon color={tag.color} name={tag.icon} />
                <IonLabel position="fixed">{tag.name}</IonLabel>
                <IonLabel slot="end" color="success" position="fixed">
                  {((tag.sum ?? 0) / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                </IonLabel>
              </IonItem>
            ))}
          </IonItemGroup>
        </IonList>
        <SummaryList summary={summary} />
      </IonContent>
    </IonPage>
  );
}
