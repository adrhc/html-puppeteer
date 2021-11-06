import {btnSelectorOf} from "../html-puppeteer/util/SelectorUtils.js";
import {generateIdNameBags} from "./Generators.js";
import Scenario10App from "./Scenario10App.js";

export default class Scenario13App extends Scenario10App {
    /**
     * @type {string}
     */
    innerPart;

    /**
     * @param {AbstractContainerComponent} parent
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
        $(btnSelectorOf("create")).on("click", () => {
            this._generateThenAppend("cats");
        });
        $(btnSelectorOf("remove")).on("click", () => {
            this._removeOldestItem("cats");
        });
    }

    /**
     * @param {OptionalPartName=} partName
     * @return {*}
     * @protected
     */
    _generateNewItem(partName) {
        return {
            id: `${partName}-${Math.random()}`,
            [this.innerPart]: generateIdNameBags(2, this.innerPart)
        };
    }
}