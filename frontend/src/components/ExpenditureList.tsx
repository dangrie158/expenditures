import {
  IonInfiniteScroll,
  IonFab,
  IonFabButton,
  IonInfiniteScrollContent,
  IonList,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonContent,
  IonToolbar,
  IonSearchbar,
  IonProgressBar,
  SearchbarChangeEventDetail,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import React, { useEffect, useState } from "react";
import { API_HOST, useAuthorizedFetch, useCredentials } from "../backend-hooks";
import { Tag, Expenditure } from "../models";
import ExpenditureEditor from "./ExpenditureEditor";
import NamedIcon from "./NamedIcon";

type ExpenditureListProps = {
  onListChanged: () => void;
  onTagClick: (tag: Tag) => void;
  userNames?: Array<string>;
  tag?: string;
  date?: string;
  allowEdit: boolean;
  allowAdd: boolean;
};

export default function ExpenditureList(props: ExpenditureListProps) {
  const [credentials] = useCredentials();
  const [showEditor, setShowEditor] = useState(false);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [expenditureLimit, setExpendituresLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState(() => {
    const expenditure = new Expenditure();
    expenditure.username = credentials.username;
    expenditure.created_date = new Date().toISOString();
    return expenditure;
  });
  const [isLoading, setIsLoading] = useState(false);
  const authorizedFetch = useAuthorizedFetch();

  useEffect(() => {
    doRefresh();
  }, [props.date, props.tag, searchQuery]);

  const deleteExpenditure = async (itemToDelete: Expenditure) => {
    await authorizedFetch(`${API_HOST}/api/expenditures/${itemToDelete.id}`, { method: "DELETE" });
    setExpenditures(expenditures.filter(expenditure => expenditure.id !== itemToDelete.id));
  };

  const editExpenditure = (item: Expenditure) => {
    setNewItem(item);
    setShowEditor(true);
  };

  const addExpenditure = () => {
    const emptyExpenditure = new Expenditure();
    emptyExpenditure.username = credentials.username;
    setNewItem(emptyExpenditure);
    setShowEditor(true);
  };

  const doRefresh = async (event?: CustomEvent<RefresherEventDetail>) => {
    setIsLoading(true);

    const url = new URL(`${API_HOST}/api/expenditures`);
    url.searchParams.set("limit", expenditureLimit.toFixed());
    url.searchParams.set("query", searchQuery);

    if (props.date !== undefined && props.date !== "") {
      url.searchParams.set("date", props.date);
    }

    if (props.tag !== undefined && props.tag !== "undefined" && props.tag !== "" && props.tag !== "-1") {
      url.searchParams.set("tag", props.tag);
    }

    try {
      const response = (await authorizedFetch<Expenditure[]>(url.toString())) ?? [];
      setExpenditures(
        response.map((item: Expenditure) => {
          item.amount = item.amount / 100;
          item.created_date = new Date(Date.parse(item.created_date)).toISOString();
          return item;
        })
      );
      props.onListChanged();
    } finally {
      setIsLoading(false);
      event?.detail.complete();
    }
  };

  const searchNext = async (event?: CustomEvent) => {
    setExpendituresLimit(expenditureLimit + 20);
    await doRefresh();
    if (event) {
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }
  };

  const search = async (event: CustomEvent<SearchbarChangeEventDetail>) => {
    setSearchQuery(event.detail.value ?? "");
  };

  const clearSearch = async (event: CustomEvent) => {
    setSearchQuery("");
  };

  return (
    <IonContent>
      <IonToolbar>
        <IonSearchbar
          showCancelButton="focus"
          debounce={100}
          animated={true}
          placeholder="Suchen"
          enterkeyhint="search"
          onIonChange={event => search(event)}
          onIonCancel={event => clearSearch(event)}
        ></IonSearchbar>
        {isLoading ? <IonProgressBar type="indeterminate"></IonProgressBar> : ""}
      </IonToolbar>
      <IonRefresher slot="fixed" onIonRefresh={event => doRefresh(event)}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <IonList style={{ marginBottom: "3rem" }}>
        {expenditures.map(expenditure => (
          <IonItemSliding key={expenditure.id.toString()} id={`expenditure-${expenditure.id.toString()}`}>
            <IonItem>
              <IonLabel>
                {expenditure.reason}
                <p>{expenditure.username}</p>
                <p>
                  {new Date(Date.parse(expenditure.created_date)).toLocaleString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </IonLabel>
              <IonLabel color="success" className="ion-text-wrap" style={{ textAlign: "right" }}>
                <IonText color="success">
                  {expenditure.amount.toLocaleString(undefined, { style: "currency", currency: "EUR" })}
                </IonText>
                <p>
                  {expenditure.tags.map(tag => {
                    return (
                      <IonButton color={tag.color} onClick={() => props.onTagClick(tag)} key={tag.id}>
                        <NamedIcon name={tag.icon} />
                      </IonButton>
                    );
                  })}
                </p>
              </IonLabel>
            </IonItem>
            <IonItemOptions side="end">
              <IonItemOption
                color="primary"
                onClick={() => {
                  document.querySelector("ion-item-sliding")?.closeOpened();
                  editExpenditure(expenditure);
                }}
              >
                Bearbeiten
              </IonItemOption>
              <IonItemOption color="danger" onClick={() => deleteExpenditure(expenditure)}>
                Löschen
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
        <IonInfiniteScroll threshold="100px" disabled={false} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonList>

      {props.allowEdit && (
        <ExpenditureEditor
          show={showEditor}
          onDismiss={() => setShowEditor(false)}
          onSave={async (_expenditure: Expenditure) => await doRefresh()}
          userNames={props.userNames || []}
          onEdit={(expenditure: Expenditure) => {
            setNewItem(expenditure);
          }}
          item={newItem}
        />
      )}

      {props.allowAdd && (
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => addExpenditure()}>
            <NamedIcon name="add" />
          </IonFabButton>
        </IonFab>
      )}
    </IonContent>
  );
}
