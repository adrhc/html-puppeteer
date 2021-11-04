import {jQueryOf} from "../../util/Utils.js";
import BasicContainerComponent from "./BasicContainerComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";

/**
 * @typedef {BasicContainerComponentOptions & ContainerEventsBinderOptions} DynamicContainerComponentOptions
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class DynamicContainerComponent extends BasicContainerComponent {
    /**
     * ChildrenShells have the chance to use parentHtml for children shells.
     * We have to set htmlTemplate to something not null (by default "") to
     * avoid the drawing of the parent's html which by now is a candidate
     * for the children shell template.
     *
     * @param {BasicContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults({
            parentHtml: jQueryOf(options.elemIdOrJQuery).html(),
            htmlTemplate: "", ...options
        }).addEventsBinders(new ContainerEventsBinder()).options());
    }
}