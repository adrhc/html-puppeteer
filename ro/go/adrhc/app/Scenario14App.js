import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";

export default class Scenario14App {
    /**
     * @type {SimpleContainerComponent}
     */
    parent;

    /**
     * @param {SimpleContainerComponent} parent
     */
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * execute the application
     */
    run() {
        $(namedBtn("change-parent-state")).on("click",
            () => {
                this.parent.replaceState(JSON.parse($("#main-debugger").val()));
            });
        $(namedBtn("change-partial-state")).on("click", () => {
            const guestsState = JSON.parse($("#partial-state").val());
            this.parent.replaceParts(guestsState);
        });
    }
}