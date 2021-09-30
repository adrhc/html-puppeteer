import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";
import {generateString} from "./Generators.js";
import {updateOrInsert} from "../html-puppeteer/util/ArrayUtils.js";
import Scenario10App from "./Scenario10App.js";

export default class Scenario13App extends Scenario10App {
    /**
     * @type {SimpleContainerComponent}
     */
    parent;

    /**
     * execute the application
     */
    run() {
        this._createParentStateChangingButtons();
        $(namedBtn("create")).on("click", () => {
            this._createOneAtIndex0("cats", "dogs");
        });
        $(namedBtn("remove")).on("click", () => {
            this._removeLast("cats");
        });
    }

    /**
     * @param {string} partName
     * @param {string} innerPart
     * @protected
     */
    _createOneAtIndex0(partName, innerPart) {
        const items = this.parent.getPart(partName) ?? [];
        const newItem = {
            id: `${partName}-Math.random()}`,
            dogs: {id: `${innerPart}-${Math.random()}`, name: generateString("name ")}
        };
        updateOrInsert(items, newItem);
        this.parent.replacePart(partName, items);
    }
}