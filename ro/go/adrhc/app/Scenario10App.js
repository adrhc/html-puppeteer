import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";
import {generateString} from "./Generators.js";
import {uniqueId} from "../html-puppeteer/util/StringUtils.js";

export default class Scenario10App {
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
        $(namedBtn("create")).on("click", () => {
            const id = uniqueId();
            this.parent.replacePart(id, {id: Math.random(), name: generateString("name ")});
        });
        $(namedBtn("remove")).on("click", () => {
            const oldestKidId = Object.values(this.parent.guests)[0]?.partName;
            this.parent.replacePart(oldestKidId);
        });
    }
}