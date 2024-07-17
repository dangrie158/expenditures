import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonButtons,
    IonModal,
    IonButton,
    IonInput,
    IonSegment,
    IonSegmentButton,
    SegmentChangeEventDetail,
    IonDatetimeButton,
    IonDatetime,
    IonPopover,
    DatetimeChangeEventDetail,
    InputInputEventDetail,
} from "@ionic/react";
import { InputChangeEventDetail } from "@ionic/core";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormEvent } from "react";
import { API_HOST, useAuthorizedFetch } from "../backend-hooks";
import { Tag, Expenditure } from "../models";
import NamedIcon from "./NamedIcon";

type ExpenditureEditorProps = {
    show: boolean;
    onDismiss: () => void;
    onSave: (item: Expenditure) => void;
    onEdit: (item: Expenditure) => void;
    userNames: Array<string>;
    item: Expenditure;
};

export default function ExpenditureEditor(props: ExpenditureEditorProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [knownShops, setKnownShops] = useState([]);
    const authorizedFetch = useAuthorizedFetch();
    useEffect(() => {
        doRefresh();
    }, []);

    const [amount, setAmount] = useState("0");
    useEffect(() => {
        setAmount(
            props.item.amount > 0
                ? props.item.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  })
                : ""
        );
    }, [props.item.amount]);

    const handleChangeAmount = (event: CustomEvent<InputInputEventDetail>) => {
        setAmount((event.detail.value ?? "").replace(",", "."));
    };

    const finishChangeAmount = (callback?: (newItem: Expenditure) => void) => {
        props.onEdit({
            ...props.item,
            amount: Number.parseFloat(amount),
        });
        callback?.({
            ...props.item,
            amount: Number.parseFloat(amount),
        });
    };

    const handleChangeReason = (event: ChangeEvent<HTMLInputElement>) => {
        props.onEdit({
            ...props.item,
            reason: event.target.value ?? "",
        });
    };

    const handleChangeUser = (event: CustomEvent<SegmentChangeEventDetail>) => {
        props.onEdit({
            ...props.item,
            username: (event.detail.value ?? "") as string,
        });
    };

    const handleToggleTag = (tag: Tag) => {
        const oldTags = props.item.tags.map((tag) => tag.name);
        const index = oldTags.indexOf(tag.name);
        const newTags = props.item.tags;
        if (index >= 0) {
            newTags.splice(index, 1);
        } else {
            newTags.push(tag);
        }

        props.onEdit({
            ...props.item,
            tags: newTags,
        });
    };

    const handleChangeDate = (event: CustomEvent<DatetimeChangeEventDetail>) => {
        props.onEdit({
            ...props.item,
            created_date: (event.detail.value ?? "") as string,
        });
    };

    const doRefresh = async () => {
        setIsSaving(true);
        setTags((await authorizedFetch(`${API_HOST}/api/tags`)) ?? []);
        setKnownShops((await authorizedFetch(`${API_HOST}/api/shops`)) ?? []);
        setIsSaving(false);
    };

    const itemHasTag = (tag: { name: string }) => {
        return props.item.tags.map((tag) => tag.name).indexOf(tag.name) >= 0;
    };

    const handleSubmit = async (event: FormEvent) => {
        setIsSaving(true);
        finishChangeAmount(async (newItem) => {
            event.preventDefault();
            try {
                await addOrUpdateExpenditure(newItem);
                props.onSave(newItem);
                props.onDismiss();
            } finally {
                setIsSaving(false);
            }
        });
    };

    const addOrUpdateExpenditure = async (item: Expenditure) => {
        const newItem = {
            amount: (item.amount * 100).toFixed(0),
            reason: item.reason,
            username: item.username,
            tags: item.tags,
            created_date: item.created_date,
        };

        let url = `${API_HOST}/api/expenditures`;
        let method = "POST";
        if (item.id !== -1) {
            url = `${API_HOST}/api/expenditures/${item.id}`;
            method = "PUT";
        }

        try {
            await authorizedFetch(url, {
                method: method,
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(newItem),
            });
        } catch (error) {
            console.error(error);
            alert("Speichern fehlgeschlagen");
        }
    };
    const asd = useRef<HTMLIonInputElement>(null);

    return (
        <IonModal isOpen={props.show} onDidDismiss={props.onDismiss}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <IonHeader translucent>
                    <IonToolbar>
                        <IonTitle>{props.item.id === -1 ? "Ausgabe eintragen" : "Ausgabe bearbeiten"}</IonTitle>
                        <IonButtons slot="start">
                            <IonButton onClick={props.onDismiss}>Abbrechen</IonButton>
                        </IonButtons>
                        <IonButtons slot="end">
                            <IonButton color="primary" type="submit" disabled={isSaving}>
                                Speichern
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonItem>
                        <IonInput
                            ref={asd}
                            label="Betrag"
                            value={amount}
                            inputMode="decimal"
                            pattern="^[0-9]+([\.,][0-9]{1,2})?$"
                            required={true}
                            onIonInput={(event) => handleChangeAmount(event)}
                            onIonChange={() => finishChangeAmount()}
                            placeholder="0.00"
                        />{" "}
                        €
                    </IonItem>
                    <IonItem>
                        <IonLabel>Grund</IonLabel>
                        <input
                            className="native-input sc-ion-input-md"
                            list="knownShops"
                            required={true}
                            value={props.item.reason}
                            onChange={(event) => handleChangeReason(event)}
                            placeholder="Shop oder Zweck"
                        />
                    </IonItem>
                    <datalist id="knownShops">
                        {knownShops.map((shop) => (
                            <option key={shop} value={shop}></option>
                        ))}
                    </datalist>
                    <IonItem>
                        <IonLabel>Gezahlt von</IonLabel>
                        <IonSegment
                            slot="end"
                            style={{ width: "50%" }}
                            onIonChange={(event) => handleChangeUser(event)}
                            value={props.item.username}>
                            {props.userNames.map((name) => {
                                return (
                                    <IonSegmentButton key={name} value={name}>
                                        <IonLabel>{name}</IonLabel>
                                    </IonSegmentButton>
                                );
                            })}
                        </IonSegment>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Datum</IonLabel>
                        <IonDatetimeButton datetime="datetime"></IonDatetimeButton>

                        <IonPopover keepContentsMounted={true}>
                            <IonDatetime
                                value={props.item.created_date}
                                onIonChange={(event) => handleChangeDate(event)}
                                id="datetime"></IonDatetime>
                        </IonPopover>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            {tags.map((tag) => {
                                return (
                                    <IonButton
                                        key={tag.id}
                                        onClick={(_event) => handleToggleTag(tag)}
                                        color={tag.color}
                                        fill={itemHasTag(tag) ? "solid" : "outline"}
                                        size="small"
                                        style={{ width: "40%", margin: "0.4rem calc(20%/4)" }}>
                                        <IonLabel>{tag.name}</IonLabel>
                                        <NamedIcon name={tag.icon} />
                                    </IonButton>
                                );
                            })}
                        </IonLabel>
                    </IonItem>
                </IonContent>
            </form>
        </IonModal>
    );
}
