import SimpleContainerComponent from "./SimpleContainerComponent.js";
import {jQueryOf} from "../../util/DomUtils.js";

/**
 * ChildrenShellsView have the chance to use parentHtml for children shells.
 * We have to set htmlTemplate to "" to avoid the drawing of the parentHtml
 * which now is a candidate to be children shell template.
 */
export default class DynamicContainerComponent extends SimpleContainerComponent {
    /**
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({...options, parentHtml: jQueryOf(options.elemIdOrJQuery).html(), htmlTemplate: ""});
    }
}