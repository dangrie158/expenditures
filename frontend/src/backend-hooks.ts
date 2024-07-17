import { useIonToast } from "@ionic/react";
import { useState } from "react";

type LoginCredentials = {
    username: string;
    password: string;
};

export const API_HOST =
    process.env.NODE_ENV === "development" ? `http://${window.location.hostname}:5100` : document.location.origin;

export function useCredentials(): [LoginCredentials, (_: LoginCredentials) => void] {
    const loadCredentials = () => {
        const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1");
        const password = document.cookie.replace(/(?:(?:^|.*;\s*)password\s*=\s*([^;]*).*$)|^.*$/, "$1");
        //renew cookie
        persistCredentials(username, password);
        return { username: username, password: password };
    };

    const persistCredentials = (username: string, password: string) => {
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + 2 * 356 * 24 * 60 * 60 * 1000);
        document.cookie = `username=${username}; expires=${expiry.toUTCString()}`;
        document.cookie = `password=${password}; expires=${expiry.toUTCString()}`;
    };

    const [credentials, setCredentials] = useState<LoginCredentials>(loadCredentials());

    const saveCredentials = ({ username, password }: LoginCredentials) => {
        persistCredentials(username, password);
        setCredentials({ username, password });
    };

    return [credentials, saveCredentials];
}

export function useAuthorizedFetch() {
    const [credentials, setCredentials] = useCredentials();
    const [present] = useIonToast();

    return async function <T>(input: RequestInfo, init: RequestInit = {}): Promise<T | undefined> {
        init = {
            ...init,
            headers: {
                ...init.headers,
                Authorization: `Basic ${window.btoa(`${credentials.username}:${credentials.password}`)}`,
            },
        };

        const response = await globalThis.fetch(input, init);
        // login was unsuccessfull. clear the credentials to show the login form again
        if (!response.ok && response.status === 401) {
            setCredentials({ username: "", password: "" });
        }
        try {
            return (await response.json()) as T;
        } catch (error) {
            console.error(error);
            present({
                message: "Verbindungsfehler",
                duration: 1500,
                position: "top",
            });
        }
    };
}
