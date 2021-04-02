/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDiceRoller } from "./dataObject";

/**
 * Render an IDiceRoller into a given div as a text character, with a button to roll it.
 * @param diceRoller - The Data Object to be rendered
 * @param div - The div to render into
 */
export function renderDiceRoller(diceRoller: IDiceRoller, div: HTMLDivElement) {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style.textAlign = "center";
    div.append(wrapperDiv);

    const diceCharDiv = document.createElement("div");
    //diceCharDiv.style.fontSize = "200px";

    const startInput = document.createElement("input");
    startInput.id = "startInputId";
    startInput.placeholder = "start/pos";
    startInput.type = "text";

    const endInput = document.createElement("input");
    endInput.id = "endInputId";
    endInput.placeholder = "end";
    endInput.type = "text";

    const textInput = document.createElement("input");
    textInput.id = "textInputId";
    textInput.placeholder = "text";
    textInput.type = "text";

    const insertButton = document.createElement("button");
    insertButton.textContent = "insert"
    insertButton.id = "insertButtonId";    

    const removeButton = document.createElement("button");
    removeButton.textContent = "remove"
    removeButton.id = "removeButtonId";

    const replaceButton = document.createElement("button");
    replaceButton.textContent = "replace"
    replaceButton.id = "replaceButtonId";

    wrapperDiv.append(diceCharDiv, 
        document.createElement("br"), startInput, 
        document.createElement("br"), endInput,
        document.createElement("br"), textInput, 
        document.createElement("br"), insertButton, 
        document.createElement("br"), removeButton, 
        document.createElement("br"), replaceButton);

    wrapperDiv.append()

    // Get the current value of the shared data to update the view whenever it changes.
    const updateDiceChar = () => {
        diceCharDiv.textContent = diceRoller.value;
    };
    updateDiceChar();
    diceRoller.on("diceRolled", updateDiceChar);

    const insertListener = () => {
        diceRoller.insert(Number(startInput.value), String(textInput.value));
        startInput.value = "";
        endInput.value = "";
        textInput.value = "";
    }

    insertButton.addEventListener("click", insertListener);

    const removeListener = () => {
        diceRoller.remove(Number(startInput.value), Number(endInput.value));
        startInput.value = "";
        endInput.value = "";
        textInput.value = "";
    }

    removeButton.addEventListener("click", removeListener);

    const replaceListener = () => {
        diceRoller.replace(Number(startInput.value), , Number(endInput.value), String(textInput.value));
        startInput.value = "";
        endInput.value = "";
        textInput.value = "";
    }

    replaceButton.addEventListener("click", replaceListener);
}
