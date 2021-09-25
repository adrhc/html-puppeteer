import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";
import {generateString} from "./Generators.js";

export default class Scenario10App {
    /**
     * @type {number}
     */
    index = 1;
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
     * @return {*}
     * @private
     */
    _oldestKidId() {
        return Object.values(this.parent.children)
            .map(kid => kid.getState().id)
            .filter(v => v != null)
            .reduce((prev, curr) => prev <= curr ? prev : curr, 9999);
    }

    /**
     * execute the application
     */
    run() {
        $(namedBtn("change-parent-state")).on("click", () => {
            this.parent.replaceState(JSON.parse($("#parent-state-and-debugger").val()));
        });
        $(namedBtn("change-partial-state")).on("click", () => {
            const childrenState = JSON.parse($("#partial-state").val());
            delete childrenState.text;
            this.parent.replaceParts(childrenState);
        });
        $(namedBtn("create")).on("click", () => {
            this.parent.replacePart(`kid${this.index}`,
                {id: this.index++, name: generateString("name ")});
        });
        $(namedBtn("remove")).on("click", () => {
            const lastKidId = this._oldestKidId();
            this.parent.replacePart(`kid${lastKidId}`);
        });
    }
}