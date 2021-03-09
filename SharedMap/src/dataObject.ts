/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IValueChanged } from "@fluidframework/map";
import { SharedMap } from "@fluidframework/map";
import { IFluidHandle } from "@fluidframework/core-interfaces";

/**
 * IDiceRoller describes the public API surface for our dice roller data object.
 */
export interface IDiceRoller {
    /**
     * Get the dice value as a number.
     */
    readonly value: number;

    /**
     * Roll the dice.  Will cause a "diceRolled" event to be emitted.
     */
    roll: () => void;

    /**
     * The diceRolled event will fire whenever someone rolls the device, either locally or remotely.
     */
    on(event: "diceRolled", listener: () => void): this;
}

// The root is map-like, so we'll use this key for storing the value.

/**
 * The DiceRoller is our data object that implements the IDiceRoller interface.
 */
export class DiceRoller extends DataObject implements IDiceRoller {

    private sharedCell?: SharedMap;
    /**
     * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
     * initialize the state of the DataObject.
     */
    protected async initializingFirstTime() {
        const cell = SharedMap.create(this.runtime);
        cell.set("value", 1);
        this.root.set("cell", cell.handle);
    }

    /**
     * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
     * DataObject, by registering an event listener for dice rolls.
     */
    protected async hasInitialized() {
        this.sharedCell = await this.root.get<IFluidHandle<SharedMap>>("cell")?.get();

        this.sharedCell?.on("valueChanged", (changed: IValueChanged) => {
            this.emit("diceRolled");
          });
    }

    public get value() {
        return this.sharedCell?.get("value");
    }

    public readonly roll = () => {
        const rollValue = Math.floor(Math.random() * 6) + 1;
        this.sharedCell?.set("value", rollValue)
    };
}

/**
 * The DataObjectFactory is used by Fluid Framework to instantiate our DataObject.  We provide it with a unique name
 * and the constructor it will call.  In this scenario, the third and fourth arguments are not used.
 */
export const DiceRollerInstantiationFactory = new DataObjectFactory(
    "dice-roller",
    DiceRoller,
    [SharedMap?.getFactory()],
    {},
);
