import { IonIcon } from "@ionic/react";
import {
    help as defaultIcon,
    add,
    restaurant,
    water,
    beer,
    airplane,
    home,
    paw,
    car,
    bicycle,
    happy,
    cash,
} from "ionicons/icons";

import React from "react";

type NamedIconProps = {
    name: string;
    style?: { [key: string]: string | undefined };
    color?: string;
};

const namedIcons = {
    add: add,
    restaurant: restaurant,
    water: water,
    beer: beer,
    airplane: airplane,
    home: home,
    paw: paw,
    car: car,
    bicycle: bicycle,
    happy: happy,
    cash: cash,
} as Record<string, string>;

export default function NamedIcon(props: NamedIconProps) {
    if (!Object.hasOwn(namedIcons, props.name)) {
        console.warn(`unknown icon "${props.name}"`);
    }
    return <IonIcon icon={namedIcons[props.name] ?? defaultIcon} style={props.style} color={props.color} />;
}
