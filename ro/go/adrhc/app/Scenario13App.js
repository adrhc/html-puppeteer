import {generateIdNameBags} from "./Generators.js";
import Scenario10App from "./Scenario10App.js";

export default class Scenario13App extends Scenario10App {
    /**
     * @type {string}
     */
    innerPart;

    /**
     * @param {AbstractContainerComponent} container
     * @param {string} innerPart
     */
    constructor(container, innerPart) {
        super(container);
        this.innerPart = innerPart;
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