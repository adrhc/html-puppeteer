import SimpleContainerComponent from "./SimpleContainerComponent.js";
import {jQueryOf} from "../../util/DomUtils.js";

/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class DynamicContainerComponent extends SimpleContainerComponent {
    /**
     * ChildrenShells have the chance to use parentHtml for children shells.
     * We have to set htmlTemplate to something not null (by default "") to
     * avoid the drawing of the parent's html which by now is a candidate
     * for the children shell template.
     *
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({parentHtml: jQueryOf(options.elemIdOrJQuery).html(), htmlTemplate: "", ...options});
    }
}