import {generateIdNameBags} from "../../Generators.js";
import CreateRemoveCollectionItemsEventsBinder from "./CreateRemoveCollectionItemsEventsBinder.js";

export default class CatsWithKittensEventsBinder extends CreateRemoveCollectionItemsEventsBinder {
    /**
     * @param {AbstractComponent} component
     */
    constructor(component) {
        super(component, "cats");
    }

    /**
     * @param {OptionalPartName=} partName
     * @return {*}
     * @protected
     */
    _generateNewItem(partName) {
        return {
            id: `${partName}-${Math.random()}`,
            kittens: generateIdNameBags(2, "kitten")
        };
    }
}