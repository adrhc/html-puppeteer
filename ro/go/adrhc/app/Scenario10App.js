import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";
import {getTotalHeight} from "../html-puppeteer/util/DomUtils.js";
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

    constructor(parent) {
        this.parent = parent;
    }

    _oldestKidId() {
        return Object.values(this.parent.children)
            .map(kid => kid.getState().id)
            .filter(v => v != null)
            .reduce((prev, curr) => prev <= curr ? prev : curr, 9999);
    }

    run() {
        $(namedBtn("change-parent-state")).on("click", () => {
            this.parent.replaceState(JSON.parse($("#parent-debugger").val()));
            $('textarea').height(0);
            $('textarea').height(getTotalHeight);
        });
        $(namedBtn("create")).on("click", () => {
            this.parent.replacePart(`kid${this.index}`,
                {id: this.index++, name: generateString("name ")});
            $('textarea').height(getTotalHeight);
        });
        $(namedBtn("remove")).on("click", () => {
            const lastKidId = this._oldestKidId();
            this.parent.replacePart(`kid${lastKidId}`);
            $('textarea').height(0);
            $('textarea').height(getTotalHeight);
        });
        $('textarea').height(getTotalHeight);
        $('textarea').on('input', function () {
            this.style.height = "";
            this.style.height = this.scrollHeight + "px";
        });
    }
}