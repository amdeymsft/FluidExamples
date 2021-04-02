/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { SequenceDeltaEvent, SharedString } from "@fluidframework/sequence";
import { IFluidHandle } from "@fluidframework/core-interfaces";

/**
 * IDiceRoller describes the public API surface for our dice roller data object.
 */
export interface IDiceRoller {
    /**
     * Get the dice value as a number.
     */
    readonly value: string;

    /**
     * Roll the dice.  Will cause a "diceRolled" event to be emitted.
     */
    insert: (pos: number, text: string) => void;
    remove: (start: number, end: number) => void;
    replace: (start: number, end: number, text: string) => void;

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

    private sharedString?: SharedString;
    /**
     * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
     * initialize the state of the DataObject.
     */
    protected async initializingFirstTime() {
        const ss = SharedString.create(this.runtime);
        ss.insertText(0,"The quick brown fox jumped over the lazy dog");
        this.root.set("string", ss.handle);
    }

    /**
     * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
     * DataObject, by registering an event listener for dice rolls.
     */
    protected async hasInitialized() {
        this.sharedString = await this.root.get<IFluidHandle<SharedString>>("string")?.get();

        this.sharedString?.on("sequenceDelta", (event: SequenceDeltaEvent) => {
            this.emit("diceRolled");
          });
    }

    public get value() {
        return this.sharedString?.getText() ?? "";
    }

    public readonly insert = (pos: number, text: string)  => {
        this.sharedString?.insertText(pos, text);
    };

    public readonly remove = (start: number, end: number)  => {
        this.sharedString?.removeText(start, end);
    };

    public readonly replace = (start: number, end: number, text: string)  => {
        this.sharedString?.replaceText(start, end, text);
    };
}

/**
 * The DataObjectFactory is used by Fluid Framework to instantiate our DataObject.  We provide it with a unique name
 * and the constructor it will call.  In this scenario, the third and fourth arguments are not used.
 */
export const DiceRollerInstantiationFactory = new DataObjectFactory(
    "dice-roller",
    DiceRoller,
    [SharedString?.getFactory()],
    {},
);
