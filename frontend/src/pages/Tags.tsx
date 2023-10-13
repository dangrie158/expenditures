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
  IonLoading,
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
  const [isLoading, setIsLoading] = useState(true);
  const authorizedFetch = useAuthorizedFetch();

  useEffect(() => {
    doRefresh();
  }, [props.match.params.id]);

  const doRefresh = async (event?: CustomEvent<RefresherEventDetail>) => {
    const tagId = props.match.params.id;
    if (tagId !== "") {
      setIsLoading(true);
      try {
        console.log(`${API_HOST}/api/tags/${tagId}`);
        const tag = await authorizedFetch<Tag>(`${API_HOST}/api/tags/${tagId}`);
        if (tag !== undefined) {
          setTag(tag);
        }
      } finally {
        setIsLoading(false);
        console.log("done");
        event?.detail.complete();
      }
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
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonLoading isOpen={isLoading} message="Laden..." />
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
