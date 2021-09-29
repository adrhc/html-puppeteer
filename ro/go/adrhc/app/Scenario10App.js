import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";
import {generateString} from "./Generators.js";
import {updateOrInsert, removeByIndex} from "../html-puppeteer/util/ArrayUtils.js";

export default class Scenario10App {
    /**
     * @type {ComplexContainerComponent}
     */
    parent;

    /**
     * @param {ComplexContainerComponent} parent
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
            const cats = this.parent.getPart("cats") ?? [];
            updateOrInsert(cats, {id: Math.random(), name: generateString("name ")})
            this.parent.replacePart("cats", cats);
        });
        $(namedBtn("remove")).on("click", () => {
            const cats = this.parent.getPart("cats") ?? [];
            removeByIndex(cats, cats.length - 1);
            this.parent.replacePart("cats", cats);
        });
    }
}