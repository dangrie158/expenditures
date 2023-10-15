import {
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonProgressBar,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import React, { useEffect, useState } from "react";
import { API_HOST, useAuthorizedFetch } from "../backend-hooks";
import { Tag } from "../models";
import { RouteComponentProps } from "react-router-dom";
import SummaryList from "../components/SummaryList";
import NamedIcon from "../components/NamedIcon";

type TagDetailProps = RouteComponentProps<{
  id: string;
}>;

export default function TagDetail(props: TagDetailProps) {
  const [tag, setTag] = useState(new Tag());
  const [isLoading, setIsLoading] = useState(false);
  const authorizedFetch = useAuthorizedFetch();

  useEffect(() => {
    doRefresh();
  }, [props.match.params.id]);

  const doRefresh = async (event?: CustomEvent<RefresherEventDetail>) => {
    setIsLoading(true);
    const tagId = props.match.params.id!;
    try {
      const tag = await authorizedFetch<Tag>(`${API_HOST}/api/tags/${tagId}`);
      setTag(tag ?? new Tag());
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
          <IonTitle>
            <IonLabel>Ausgaben für: {tag.name}</IonLabel>
          </IonTitle>
          {isLoading ? <IonProgressBar type="indeterminate"></IonProgressBar> : ""}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={event => doRefresh(event)}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonCard color={tag.color}>
          <IonCardHeader class="ion-text-center">
            <NamedIcon style={{ fontSize: "4rem" }} name={tag.icon} />
            <IonCardTitle>{tag.name}</IonCardTitle>
            <IonCardSubtitle>Ausgaben gesamt</IonCardSubtitle>
            <IonCardTitle>
              {((tag.total ?? 0) / 100).toLocaleString(undefined, { style: "currency", currency: "EUR" })}
            </IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <SummaryList summary={tag} />
      </IonContent>
    </IonPage>
  );
}
