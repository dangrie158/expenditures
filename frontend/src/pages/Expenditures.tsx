import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonBackButton,
    IonButtons,
    IonLabel,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { API_HOST, useAuthorizedFetch } from "../backend-hooks";
import { RouteComponentProps } from "react-router-dom";

import ExpenditureList from "../components/ExpenditureList";
import { Tag } from "../models";
import NamedIcon from "../components/NamedIcon";

export default function Expenditures(props: RouteComponentProps) {
    const authorizedFetch = useAuthorizedFetch();

    const [tag, setTag] = useState(new Tag());
    const [date, setDate] = useState("");
    const [tagId, setTagId] = useState("");

    useEffect(() => {
        doRefresh();
    }, [props.location]);

    const doRefresh = async () => {
        const queryParams = new URLSearchParams(props.location.search);
        const tagId = queryParams.get("tag");
        const date = queryParams.get("date");
        if (tagId !== null) setTagId(tagId);
        if (date !== null) setDate(date);

        if (tagId !== null) {
            const newTag = await authorizedFetch<Tag>(`${API_HOST}/api/tags/${queryParams.get("tag")}`);
            if (newTag !== undefined) {
                setTag(newTag);
            }
        } else {
            setTag(new Tag());
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
                        <IonLabel>Ausgaben Übersicht</IonLabel>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonCard style={{ position: "sticky" }} color={tag.color || "dark"}>
                    <IonCardHeader class="ion-text-center">
                        <NamedIcon style={{ fontSize: "4rem" }} name={tag.icon} />
                        <IonCardSubtitle>
                            Ausgaben{" "}
                            {date && date.split("-").length > 1
                                ? `im ${new Date(Date.parse(date)).toLocaleString(undefined, {
                                      year: "numeric",
                                      month: "long",
                                  })}`
                                : `in ${new Date(Date.parse(date)).toLocaleString(undefined, {
                                      year: "numeric",
                                  })}`}{" "}
                            {tag.id >= 0 && "für"}
                        </IonCardSubtitle>
                        {tag.id >= 0 && <IonCardTitle>{tag.name}</IonCardTitle>}
                        <IonCardTitle></IonCardTitle>
                    </IonCardHeader>
                </IonCard>

                <ExpenditureList
                    onListChanged={() => doRefresh()}
                    onTagClick={(tag) => props.history.push(`/tags/${tag.id}`)}
                    allowAdd={false}
                    allowEdit={true}
                    date={date}
                    tag={tagId}
                />
            </IonContent>
        </IonPage>
    );
}
