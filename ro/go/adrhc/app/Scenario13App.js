import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";
import {generateIdNameBags} from "./Generators.js";
import {updateOrInsert} from "../html-puppeteer/util/ArrayUtils.js";
import Scenario10App from "./Scenario10App.js";

export default class Scenario13App extends Scenario10App {
    /**
     * @type {string}
     */
    innerPart;

    /**
     * @param {BasicContainerComponent} parent
     * @param {string} innerPart
     */
    constructor(parent, {innerPart}) {
        super(parent);
        this.innerPart = innerPart;
    }

    /**
     * execute the application
     */
    run() {
        this._createParentStateChangingButtons();
        $(namedBtn("create")).on("click", () => {
            this._createOneAtIndex0("cats");
        });
        $(namedBtn("remove")).on("click", () => {
            this._removeLast("cats");
        });
    }

    /**
     * @param {string} partName
     * @protected
     */
    _createOneAtIndex0(partName) {
        const items = this.parent.getPart(partName) ?? [];
        const newItem = {
            id: `${partName}-${Math.random()}`,
            [this.innerPart]: generateIdNameBags(2, this.innerPart)
        };
        updateOrInsert(items, newItem);
        this.parent.replacePart(partName, items);
    }
}