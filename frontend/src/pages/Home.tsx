import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
  IonImg,
  IonThumbnail,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { API_HOST, useCredentials, useAuthorizedFetch } from "../backend-hooks";
import { RouteComponentProps } from "react-router-dom";
import ExpenditureList from "../components/ExpenditureList";

type UserStatus = [string, number];
type CurrentStatus = [UserStatus, UserStatus];

export default function Home(props: RouteComponentProps) {
  const [credentials] = useCredentials();
  const [availableUsernames, setAvailableUsernames] = useState<string[]>([]);
  const [balance, setBalance] = useState(0);
  const authorizedFetch = useAuthorizedFetch();

  useEffect(() => {
    doRefresh();
  }, []);

  const doRefresh = async () => {
    const currentStatus = await authorizedFetch<CurrentStatus>(`${API_HOST}/api/current-status`);
    if (currentStatus) {
      setAvailableUsernames(currentStatus.map((entry: UserStatus) => entry[0]));
      const myBalance = currentStatus.find((item: UserStatus) => item[0] === credentials.username);
      const otherBalance = currentStatus.find((item: UserStatus) => item[0] !== credentials.username);
      if (myBalance !== undefined && otherBalance !== undefined) {
        const balance = myBalance[1] - otherBalance[1];
        setBalance(balance / 100);
      } else {
        console.error("did not find 2 users to calculate a sensible balance");
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonThumbnail slot="start" style={{ marginLeft: "1rem" }}>
            <IonImg src="/assets/icon/android-chrome-192x192.png" />
          </IonThumbnail>
          <IonTitle>Letzte Ausgaben</IonTitle>
        </IonToolbar>
      </IonHeader>

      <ExpenditureList
        onListChanged={() => doRefresh()}
        onTagClick={tag => props.history.push(`/tags/${tag.id}`)}
        userNames={availableUsernames}
        allowEdit={true}
        allowAdd={true}
      />

      <IonCard
        routerLink="/summary/"
        style={{ bottom: "0", position: "absolute", width: "calc(100% - 4em)", margin: "2em" }}
        routerDirection="forward"
        slot="fixed"
        color={balance < 0 ? "warning" : "success"}
      >
        <IonCardHeader>
          <IonCardSubtitle>Aktueller Stand</IonCardSubtitle>
          <IonCardTitle>{balance.toLocaleString(undefined, { style: "currency", currency: "EUR" })}</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </IonPage>
  );
}
