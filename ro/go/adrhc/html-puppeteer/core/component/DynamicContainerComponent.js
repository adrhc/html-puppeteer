import SimpleContainerComponent from "./SimpleContainerComponent.js";
import {jQueryOf} from "../../util/DomUtils.js";

export default class DynamicContainerComponent extends SimpleContainerComponent {
    /**
     * ChildrenShells have the chance to use parentHtml for children shells.
     * We have to set htmlTemplate to "" to avoid the drawing of the parentHtml
     * which now is a candidate to be children shell template.
     *
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({parentHtml: jQueryOf(options.elemIdOrJQuery).html(), ...options, htmlTemplate: ""});
    }
}