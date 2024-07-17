import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonModal,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import React, { FormEvent, useState } from "react";

type LoginProps = {
    onSave: (username: string, password: string) => void;
};

export default function Login({ onSave }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSave(username, password);
    };

    return (
        <IonModal isOpen={true}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <IonHeader translucent>
                    <IonToolbar>
                        <IonTitle>Nutzer eintragen</IonTitle>
                        <IonButtons slot="end">
                            <IonButton color="primary" type="submit">
                                Speichern
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonItem>
                        <IonInput
                            label="Nutzer"
                            required={true}
                            onIonChange={(event) => setUsername(event.detail.value ?? "")}></IonInput>
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Passwort"
                            required={true}
                            onIonChange={(event) => setPassword(event.detail.value ?? "")}
                            type="password"></IonInput>
                    </IonItem>
                </IonContent>
            </form>
        </IonModal>
    );
}
