import EventsBinder from "./EventsBinder.js";
import {generateString} from "../../../../app/Generators.js";
import {dataOwnerSelectorOf} from "../../../util/SelectorUtils.js";

export default class SimpleEventsBinder extends EventsBinder {
    constructor(component) {
        super(component);
        this.owner = component.id;
    }

    attachEventHandlers() {
        $(`${dataOwnerSelectorOf(this.owner)}[data-open]`).on("click", () => {
            this.parent.replacePart(`kid${this.index}`,
                {id: this.index++, name: generateString("name ")});
        });
    }

    detachEventHandlers() {}
}