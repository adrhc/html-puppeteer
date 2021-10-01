import SimpleContainerComponent from "./SimpleContainerComponent.js";
import {jQueryOf} from "../../util/DomUtils.js";

export default class DynamicContainerComponent extends SimpleContainerComponent {
    /**
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({...options, parentHtml: jQueryOf(options.elemIdOrJQuery).html()});
    }
}